/**
 * Error Logging Service
 * Centralized logging with local storage and remote monitoring support
 */

class ErrorLoggingService {
  constructor() {
    this.logs = [];
    this.maxLogs = 500;
    this.remoteUrl = process.env.NEXT_PUBLIC_ERROR_MONITORING_URL;
    this.batchSize = 10;
    this.flushInterval = 30000; // 30 seconds
    this.initBatchFlush();
  }

  /**
   * Log an error with context
   */
  log(error, context = {}) {
    const logEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'Unknown error',
      severity: error.severity || 'ERROR',
      type: error.type || 'ERROR',
      context: context,
      url: typeof window !== 'undefined' ? window.location.href : null,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    };

    this.logs.push(logEntry);

    // Keep max logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Development logging
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      const styles = {
        CRITICAL: 'color: #fff; background: #d32f2f; padding: 2px 6px;',
        ERROR: 'color: #fff; background: #f57c00; padding: 2px 6px;',
        WARNING: 'color: #000; background: #fbc02d; padding: 2px 6px;',
        INFO: 'color: #fff; background: #1976d2; padding: 2px 6px;',
      };

      console.log(
        `%c[${logEntry.severity}]%c ${logEntry.code}`,
        styles[logEntry.severity] || 'color: inherit;',
        'color: inherit;'
      );
    }

    // Send critical errors immediately
    if (logEntry.severity === 'CRITICAL' && this.remoteUrl) {
      this.sendToRemote([logEntry]);
    }

    return logEntry;
  }

  /**
   * Initialize batch flush to remote server
   */
  initBatchFlush() {
    if (typeof window === 'undefined') return;

    setInterval(() => {
      if (this.logs.length > 0 && this.remoteUrl) {
        const batch = this.logs.splice(0, Math.min(this.batchSize, this.logs.length));
        this.sendToRemote(batch);
      }
    }, this.flushInterval);
  }

  /**
   * Send logs to remote monitoring service
   */
  async sendToRemote(batch) {
    if (!this.remoteUrl || typeof fetch === 'undefined') return;

    try {
      await fetch(this.remoteUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          app: 'zuroona-web',
          environment: process.env.NODE_ENV,
          logs: batch,
        }),
      }).catch(() => {
        // Silently fail if remote monitoring is unavailable
      });
    } catch (error) {
      // Prevent infinite error loops
    }
  }

  /**
   * Get all logs
   */
  getLogs() {
    return [...this.logs];
  }

  /**
   * Get logs by severity
   */
  getLogsBySeverity(severity) {
    return this.logs.filter((log) => log.severity === severity);
  }

  /**
   * Get logs by code
   */
  getLogsByCode(code) {
    return this.logs.filter((log) => log.code === code);
  }

  /**
   * Get statistics about errors
   */
  getStatistics() {
    const stats = {
      total: this.logs.length,
      bySeverity: {
        CRITICAL: 0,
        ERROR: 0,
        WARNING: 0,
        INFO: 0,
      },
      byCode: {},
      recentErrors: this.logs.slice(-10),
    };

    this.logs.forEach((log) => {
      // Count by severity
      if (stats.bySeverity.hasOwnProperty(log.severity)) {
        stats.bySeverity[log.severity]++;
      }

      // Count by code
      if (!stats.byCode[log.code]) {
        stats.byCode[log.code] = 0;
      }
      stats.byCode[log.code]++;
    });

    return stats;
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    this.logs = [];
  }

  /**
   * Export logs as object
   */
  export() {
    return {
      exported_at: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      total: this.logs.length,
      statistics: this.getStatistics(),
      logs: [...this.logs],
    };
  }

  /**
   * Download logs as JSON file
   */
  downloadLogsAsFile() {
    if (typeof window === 'undefined') return;

    const data = this.export();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `error-logs-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Singleton instance
const errorLoggingService = new ErrorLoggingService();

// Expose to window for debugging
if (typeof window !== 'undefined') {
  window.__errorLoggingService = errorLoggingService;
}

export default errorLoggingService;
export { errorLoggingService };
