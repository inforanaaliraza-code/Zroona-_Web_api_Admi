/**
 * ERROR LOGGING SERVICE
 * Logs and monitors errors, sends to remote monitoring service if configured
 */

class ErrorLoggingService {
  constructor() {
    this.logs = [];
    this.maxLogs = 500;
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.monitoringUrl = process.env.NEXT_PUBLIC_ERROR_MONITORING_URL;
    this.sessionId = this.generateSessionId();
    this.batchSize = 10;
    this.batchTimeout = 30000; // 30 seconds
    this.batchTimer = null;
  }

  generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Log error with full context
   */
  log(error, context = {}) {
    const logEntry = {
      id: `LOG_${Date.now()}_${Math.random()}`,
      timestamp: new Date().toISOString(),
      type: error.type || 'ERROR',
      severity: error.severity || 'ERROR',
      code: error.code || 'UNKNOWN',
      message: error.message || 'Unknown error',
      context: {
        ...context,
        url: typeof window !== 'undefined' ? window.location.href : null,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      },
      stackTrace: error.stackTrace || error.stack,
      sessionId: this.sessionId,
      environment: process.env.NODE_ENV,
    };

    this.logs.push(logEntry);

    // Maintain max logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Development logging
    if (this.isDevelopment) {
      this.logToDevelopmentConsole(logEntry);
    }

    // Send to monitoring service if enabled
    if (this.monitoringUrl && error.severity === 'CRITICAL') {
      this.sendToMonitoring(logEntry);
    }

    return logEntry;
  }

  /**
   * Log to development console with formatting
   */
  logToDevelopmentConsole(entry) {
    const style = this.getConsoleStyle(entry.severity);
    console.group(
      `%c[${entry.severity}] ${entry.code}`,
      style
    );
    console.log('Message:', entry.message);
    console.log('Context:', entry.context);
    if (entry.stackTrace) {
      console.log('Stack:', entry.stackTrace);
    }
    console.groupEnd();
  }

  /**
   * Get console style based on severity
   */
  getConsoleStyle(severity) {
    const styles = {
      CRITICAL: 'color: #d32f2f; font-weight: bold; font-size: 14px;',
      ERROR: 'color: #f57c00; font-weight: bold; font-size: 13px;',
      WARNING: 'color: #fbc02d; font-weight: bold; font-size: 12px;',
      INFO: 'color: #1976d2; font-weight: normal; font-size: 12px;',
    };
    return styles[severity] || styles.ERROR;
  }

  /**
   * Send to remote monitoring service (e.g., Sentry, LogRocket)
   */
  async sendToMonitoring(logEntry) {
    if (!this.monitoringUrl) return;

    try {
      await fetch(this.monitoringUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry),
      });
    } catch (error) {
      if (this.isDevelopment) {
        console.warn('[ErrorLoggingService] Failed to send to monitoring:', error);
      }
    }
  }

  /**
   * Get all logs
   */
  getLogs(filter = {}) {
    let filtered = [...this.logs];

    if (filter.severity) {
      filtered = filtered.filter((l) => l.severity === filter.severity);
    }

    if (filter.code) {
      filtered = filtered.filter((l) => l.code === filter.code);
    }

    if (filter.limit) {
      filtered = filtered.slice(-filter.limit);
    }

    return filtered;
  }

  /**
   * Get logs by time range
   */
  getLogsByTimeRange(startTime, endTime) {
    return this.logs.filter((log) => {
      const logTime = new Date(log.timestamp).getTime();
      return logTime >= startTime && logTime <= endTime;
    });
  }

  /**
   * Get error statistics
   */
  getStatistics() {
    const stats = {
      total: this.logs.length,
      bySeverity: {},
      byCode: {},
      byType: {},
      recentErrors: this.logs.slice(-10),
    };

    this.logs.forEach((log) => {
      stats.bySeverity[log.severity] = (stats.bySeverity[log.severity] || 0) + 1;
      stats.byCode[log.code] = (stats.byCode[log.code] || 0) + 1;
      stats.byType[log.type] = (stats.byType[log.type] || 0) + 1;
    });

    return stats;
  }

  /**
   * Export logs for debugging
   */
  export() {
    return {
      sessionId: this.sessionId,
      exportTime: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      logs: this.logs,
      statistics: this.getStatistics(),
    };
  }

  /**
   * Clear old logs
   */
  clearOldLogs(hoursOld = 24) {
    const cutoffTime = Date.now() - hoursOld * 60 * 60 * 1000;
    this.logs = this.logs.filter((log) => {
      const logTime = new Date(log.timestamp).getTime();
      return logTime > cutoffTime;
    });
  }

  /**
   * Clear all logs
   */
  clearAll() {
    this.logs = [];
  }

  /**
   * Download logs as JSON file
   */
  downloadLogsAsFile() {
    const exportData = this.export();
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `error-logs-${this.sessionId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

export const errorLoggingService = new ErrorLoggingService();
export default errorLoggingService;
