/**
 * Session Manager
 * Handles session timeout, inactivity warnings, and multi-tab logout sync
 */

import Cookies from 'js-cookie';
import errorLoggingService from './errorLoggingService';

const TOKEN_NAME = 'token';
const SESSION_KEY = 'zuroona-session-state';

class SessionManager {
  constructor() {
    this.sessionWarningTime = 5 * 60 * 1000; // 5 minutes
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
    this.inactivityTimeout = null;
    this.warningTimeout = null;
    this.listeners = [];
    this.isSessionWarningShown = false;
  }

  /**
   * Initialize session management
   */
  init() {
    if (typeof window === 'undefined') return;

    // Set up global event listeners
    window.addEventListener('mousedown', () => this.recordActivity());
    window.addEventListener('keydown', () => this.recordActivity());
    window.addEventListener('scroll', () => this.recordActivity());
    window.addEventListener('click', () => this.recordActivity());
    window.addEventListener('touchstart', () => this.recordActivity());

    // Listen for storage changes (multi-tab logout sync)
    window.addEventListener('storage', (e) => {
      if (e.key === SESSION_KEY && e.newValue === null) {
        this.handleLogout('Multi-tab logout');
      }
    });

    // Listen for session timeout events
    window.addEventListener('session-timeout', (e) => {
      this.handleLogout(e.detail?.reason || 'Session timeout');
    });

    // Start session timeout
    this.resetSessionTimeout();
  }

  /**
   * Record user activity and reset timeout
   */
  recordActivity() {
    // Clear existing timeouts
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
    }
    if (this.warningTimeout) {
      clearTimeout(this.warningTimeout);
    }

    this.isSessionWarningShown = false;

    // Reset timeouts
    this.resetSessionTimeout();
  }

  /**
   * Reset session timeout
   */
  resetSessionTimeout() {
    if (typeof window === 'undefined') return;

    // Set warning timeout (5 minutes)
    this.warningTimeout = setTimeout(() => {
      this.showSessionWarning();
    }, this.sessionTimeout - this.sessionWarningTime);

    // Set session timeout (30 minutes)
    this.inactivityTimeout = setTimeout(() => {
      this.handleSessionTimeout();
    }, this.sessionTimeout);
  }

  /**
   * Show session warning
   */
  showSessionWarning() {
    if (this.isSessionWarningShown) return;

    this.isSessionWarningShown = true;
    this.notifyListeners({
      type: 'WARNING',
      message: 'Your session will expire soon. Please save your work.',
    });
  }

  /**
   * Handle session timeout
   */
  handleSessionTimeout() {
    this.handleLogout('Session expired after 30 minutes of inactivity');
  }

  /**
   * Handle logout
   */
  handleLogout(reason = 'User logged out') {
    // Remove token
    Cookies.remove(TOKEN_NAME);

    // Clear session state
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(SESSION_KEY);
      } catch (error) {
        // Ignore storage errors
      }
    }

    // Log event
    errorLoggingService.log(
      {
        code: 'SESSION_LOGOUT',
        message: reason,
        severity: 'INFO',
        type: 'SESSION_EVENT',
      },
      { reason }
    );

    // Notify listeners
    this.notifyListeners({
      type: 'LOGOUT',
      message: reason,
    });

    // Dispatch custom event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('user-logout', {
          detail: { reason },
        })
      );
    }
  }

  /**
   * Validate session (check if token exists and is valid)
   */
  isValid() {
    const token = Cookies.get(TOKEN_NAME);
    return !!token;
  }

  /**
   * Subscribe to session events
   */
  onChange(callback) {
    this.listeners.push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  /**
   * Notify all listeners
   */
  notifyListeners(data) {
    this.listeners.forEach((listener) => {
      try {
        listener(data);
      } catch (error) {
        console.error('Error in session listener:', error);
      }
    });
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
    }
    if (this.warningTimeout) {
      clearTimeout(this.warningTimeout);
    }
    this.listeners = [];
  }
}

// Singleton instance
const sessionManager = new SessionManager();

// Expose to window for debugging
if (typeof window !== 'undefined') {
  window.__sessionManager = sessionManager;
}

export default sessionManager;
export { sessionManager };
