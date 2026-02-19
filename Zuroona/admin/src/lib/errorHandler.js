/**
 * CENTRALIZED ERROR HANDLER SERVICE
 * Handles all errors across the admin panel with consistent formatting and monitoring
 */

class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100;
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.errorCallbacks = [];
  }

  /**
   * Register callback to be called when errors occur
   */
  onError(callback) {
    this.errorCallbacks.push(callback);
  }

  /**
   * Trigger all error callbacks
   */
  triggerCallbacks(error) {
    this.errorCallbacks.forEach(cb => {
      try {
        cb(error);
      } catch (e) {
        console.error('[ErrorHandler] Callback failed:', e);
      }
    });
  }

  /**
   * Parse and normalize errors from various sources
   */
  normalizeError(error, context = {}) {
    let normalized = {
      status: 0,
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred',
      statusCode: 500,
      timestamp: new Date().toISOString(),
      context,
      isDevelopment: this.isDevelopment
    };

    // Axios/HTTP Response Error
    if (error?.response) {
      normalized.statusCode = error.response.status;
      const rawMsg = error.response.data?.message || error.response.statusText || 'Server error occurred';
      normalized.message = typeof rawMsg === 'string' ? rawMsg : 'Server error occurred';
      normalized.status = error.response.data?.status || 0;
      normalized.code = error.response.data?.code || `HTTP_${error.response.status}`;
      normalized.data = error.response.data;
      normalized.type = 'AXIOS_RESPONSE_ERROR';
    }
    // Network Error (no response)
    else if (error?.request) {
      normalized.message = 'Network error: Unable to reach server';
      normalized.code = 'NETWORK_ERROR';
      normalized.statusCode = 0;
      normalized.type = 'NETWORK_ERROR';
    }
    // Request Setup Error
    else if (error?.message !== undefined && error?.message !== null) {
      // Coerce to string so DOM nodes (e.g. HTMLImageElement) are never stored or rendered
      normalized.message = typeof error.message === 'string' ? error.message : String(error.message);
      normalized.code = error.code || 'REQUEST_ERROR';
      normalized.type = 'REQUEST_ERROR';
      normalized.originalError = error;
    }
    // Generic Error
    else if (typeof error === 'string') {
      normalized.message = error;
      normalized.code = 'GENERIC_ERROR';
      normalized.type = 'GENERIC_ERROR';
    }

    // Final guard: ensure message is always a string (never a DOM node or object)
    if (typeof normalized.message !== 'string') {
      normalized.message = normalized.message != null && typeof normalized.message.toString === 'function'
        ? normalized.message.toString()
        : 'An unexpected error occurred';
    }
    return normalized;
  }

  /**
   * Log error with full context
   */
  log(error, context = {}) {
    const normalized = this.normalizeError(error, context);
    
    // DEVELOPMENT: Log everything to console
    if (this.isDevelopment) {
      console.group(`%c⚠️ ERROR [${normalized.code}]`, 'color: red; font-weight: bold; font-size: 14px;');
      console.error('Message:', normalized.message);
      console.error('Status:', normalized.statusCode);
      console.error('Context:', context);
      console.error('Full Error:', normalized);
      console.groupEnd();
    }

    // Store in log (keep last N errors)
    this.errorLog.push(normalized);
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }

    // Trigger callbacks (for monitoring services, etc.)
    this.triggerCallbacks(normalized);

    return normalized;
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(error) {
    const normalized = this.normalizeError(error);
    const userMessages = {
      'NETWORK_ERROR': 'Unable to connect to server. Please check your internet connection.',
      'HTTP_401': 'Your session has expired. Please login again.',
      'HTTP_403': 'You do not have permission to perform this action.',
      'HTTP_404': 'The resource you are looking for was not found.',
      'HTTP_500': 'Server error. Please try again later.',
      'HTTP_503': 'Service temporarily unavailable. Please try again later.',
      'TIMEOUT': 'Request timed out. Please try again.',
      'VALIDATION_ERROR': 'Please check your input and try again.',
    };

    return userMessages[normalized.code] || normalized.message;
  }

  /**
   * Check if error is recoverable
   */
  isRecoverable(error) {
    const normalized = this.normalizeError(error);
    const nonRecoverableCodes = ['HTTP_401', 'HTTP_403', 'INTERNAL_SYSTEM_ERROR'];
    return !nonRecoverableCodes.includes(normalized.code);
  }

  /**
   * Get error severity level
   */
  getSeverity(error) {
    const normalized = this.normalizeError(error);
    
    if (normalized.statusCode >= 500) return 'CRITICAL';
    if (normalized.statusCode >= 400) return 'ERROR';
    if (normalized.statusCode >= 300) return 'WARNING';
    if (normalized.code === 'NETWORK_ERROR') return 'CRITICAL';
    
    return 'ERROR';
  }

  /**
   * Get all logged errors
   */
  getLogs() {
    return [...this.errorLog];
  }

  /**
   * Clear logs
   */
  clearLogs() {
    this.errorLog = [];
  }

  /**
   * Export error report for debugging
   */
  exportReport() {
    return {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      totalErrors: this.errorLog.length,
      errors: this.errorLog,
    };
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();
export default errorHandler;
