/**
 * Centralized Error Handler Service
 * @description Handles error normalization, logging, severity detection, and recovery checks
 */

class ErrorHandler {
  constructor() {
    this.errors = [];
    this.maxErrors = 100;
    this.callbacks = [];
  }

  /**
   * Normalize errors from different sources to consistent format
   */
  normalizeError(error) {
    let normalized = {
      message: 'Unknown error occurred',
      code: 'UNKNOWN_ERROR',
      severity: 'ERROR',
      timestamp: Date.now(),
      originalError: error,
    };

    if (axios?.isAxiosError(error)) {
      // Axios error
      normalized.code = error.response?.status ? `HTTP_${error.response.status}` : 'NETWORK_ERROR';
      normalized.message = error.response?.data?.message || error.message;
      normalized.statusCode = error.response?.status;
      normalized.data = error.response?.data;
      normalized.severity = this.getSeverity(error.response?.status);
    } else if (error instanceof TypeError) {
      // Network/connection error
      normalized.code = 'NETWORK_ERROR';
      normalized.message = 'Network connection failed';
      normalized.severity = 'ERROR';
    } else if (error instanceof Error) {
      // Standard Error
      normalized.message = error.message;
      normalized.code = error.code || 'ERROR';
      normalized.stack = error.stack;
    } else if (typeof error === 'string') {
      // String error
      normalized.message = error;
    } else if (typeof error === 'object') {
      // Object error
      normalized.message = error.message || JSON.stringify(error);
      normalized.code = error.code || error.type || 'ERROR';
    }

    return normalized;
  }

  /**
   * Log error with context and severity
   */
  log(error, context = {}) {
    const normalized = this.normalizeError(error);
    normalized.context = context;

    // Store in errors array (max 100)
    this.errors.push(normalized);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Development logging
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      const styles = {
        CRITICAL: 'color: #fff; background: #d32f2f; padding: 2px 6px; border-radius: 3px; font-weight: bold;',
        ERROR: 'color: #fff; background: #f57c00; padding: 2px 6px; border-radius: 3px;',
        WARNING: 'color: #000; background: #fbc02d; padding: 2px 6px; border-radius: 3px;',
        INFO: 'color: #fff; background: #1976d2; padding: 2px 6px; border-radius: 3px;',
      };

      console.group(`%c[${normalized.severity}]%c ${normalized.code}`, styles[normalized.severity], 'color: inherit;');
      console.log('Message:', normalized.message);
      if (normalized.statusCode) console.log('Status:', normalized.statusCode);
      if (Object.keys(context).length > 0) console.log('Context:', context);
      if (normalized.stack) console.log('Stack:', normalized.stack);
      console.groupEnd();
    }

    // Trigger callbacks
    this.callbacks.forEach((cb) => cb(normalized));

    // Send to logging service if available
    if (typeof window !== 'undefined' && window.__errorLoggingService) {
      window.__errorLoggingService.log(normalized, context);
    }

    return normalized;
  }

  /**
   * Get user-friendly message for error
   */
  getUserMessage(error) {
    const normalized = this.normalizeError(error);
    const errorParser = typeof window !== 'undefined' && window.__errorParser;

    if (errorParser && errorParser.parseError) {
      const parsed = errorParser.parseError(normalized.code);
      return parsed.userMessage || normalized.message;
    }

    return normalized.message;
  }

  /**
   * Get error severity level
   */
  getSeverity(errorOrStatus) {
    if (typeof errorOrStatus === 'number') {
      // HTTP status code
      if (errorOrStatus >= 500) return 'CRITICAL';
      if (errorOrStatus >= 400) return 'ERROR';
      return 'INFO';
    }

    const error = this.normalizeError(errorOrStatus);
    
    if (error.code.includes('NETWORK') || error.code.includes('TIMEOUT')) return 'ERROR';
    if (error.code === 'HTTP_500') return 'CRITICAL';
    if (error.code === 'HTTP_503') return 'CRITICAL';
    if (error.code === 'HTTP_401') return 'ERROR';
    if (error.code === 'HTTP_403') return 'ERROR';
    if (error.code === 'VALIDATION_ERROR') return 'WARNING';

    return 'ERROR';
  }

  /**
   * Check if error is recoverable
   */
  isRecoverable(error) {
    const normalized = this.normalizeError(error);
    
    // Network errors are recoverable (retry)
    if (normalized.code === 'NETWORK_ERROR') return true;
    if (normalized.code === 'TIMEOUT') return true;
    
    // 5xx errors are recoverable
    if (normalized.statusCode >= 500) return true;
    
    // 401/403 not recoverable (need auth)
    if (normalized.statusCode === 401 || normalized.statusCode === 403) return false;
    
    // 4xx not recoverable (client error)
    if (normalized.statusCode >= 400 && normalized.statusCode < 500) return false;

    return false;
  }

  /**
   * Register callback for error events
   */
  onError(callback) {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback);
    };
  }

  /**
   * Get all logged errors
   */
  getLogs() {
    return this.errors;
  }

  /**
   * Clear error logs
   */
  clearLogs() {
    this.errors = [];
  }

  /**
   * Export errors as JSON
   */
  export() {
    return {
      exported_at: new Date().toISOString(),
      total: this.errors.length,
      errors: this.errors,
    };
  }
}

// Singleton instance
const errorHandler = new ErrorHandler();

// Expose to window for debugging
if (typeof window !== 'undefined') {
  window.__errorHandler = errorHandler;
}

export default errorHandler;
export { errorHandler };
