/**
 * SESSION AND AUTHENTICATION ERROR HANDLER
 * Manages token expiration, session validation, and auto-logout
 */

import Cookies from 'js-cookie';
import { errorHandler } from './errorHandler';
import { errorLoggingService } from './errorLoggingService';

const TOKEN_NAME = 'ZuroonaToken';
const SESSION_WARNING_TIME = 5 * 60 * 1000; // 5 minutes
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

class SessionManager {
  constructor() {
    this.isSessionValid = true;
    this.sessionWarningTimeout = null;
    this.sessionTimeoutTimeout = null;
    this.lastActivityTime = Date.now();
    this.listeners = [];
    this.isInitialized = false;
  }

  /**
   * Initialize session management
   */
  init() {
    if (this.isInitialized) return;
    
    if (typeof window === 'undefined') return;

    this.isInitialized = true;

    // Track user activity
    window.addEventListener('mousedown', this.recordActivity.bind(this));
    window.addEventListener('keydown', this.recordActivity.bind(this));
    window.addEventListener('click', this.recordActivity.bind(this));
    window.addEventListener('scroll', this.recordActivity.bind(this));

    // Listen for logout events from other tabs
    window.addEventListener('storage', this.handleStorageChange.bind(this));

    // Check token on init
    this.validateSession();

    if (process.env.NODE_ENV === 'development') {
      console.log('[SessionManager] Initialized');
    }
  }

  /**
   * Record user activity to extend session
   */
  recordActivity() {
    this.lastActivityTime = Date.now();
    this.resetSessionTimeout();
  }

  /**
   * Validate current session
   */
  validateSession() {
    const token = Cookies.get(TOKEN_NAME);

    if (!token) {
      this.setSessionInvalid('No token found');
      return false;
    }

    // Check if token is about to expire (basic check)
    try {
      // If token is JWT, we could decode it here
      // For now, just check if it exists and is not empty
      if (typeof token === 'string' && token.length > 0) {
        this.isSessionValid = true;
        this.resetSessionTimeout();
        return true;
      }
    } catch (error) {
      this.setSessionInvalid('Invalid token format');
      return false;
    }

    return false;
  }

  /**
   * Reset session timeout
   */
  resetSessionTimeout() {
    if (this.sessionWarningTimeout) {
      clearTimeout(this.sessionWarningTimeout);
    }
    if (this.sessionTimeoutTimeout) {
      clearTimeout(this.sessionTimeoutTimeout);
    }

    // Warn user before session expires
    this.sessionWarningTimeout = setTimeout(() => {
      this.warnSessionExpiring();
    }, SESSION_WARNING_TIME);

    // Auto-logout when session times out
    this.sessionTimeoutTimeout = setTimeout(() => {
      this.logout('Session expired due to inactivity');
    }, SESSION_TIMEOUT);
  }

  /**
   * Warn user that session is expiring
   */
  warnSessionExpiring() {
    this.notifyListeners({
      type: 'SESSION_WARNING',
      message: 'Your session will expire in 5 minutes due to inactivity',
    });

    errorLoggingService.log(
      {
        code: 'SESSION_EXPIRING_SOON',
        message: 'User session expiring in 5 minutes',
        severity: 'WARNING',
        type: 'SESSION_MANAGEMENT',
      },
      { lastActivityTime: new Date(this.lastActivityTime).toISOString() }
    );
  }

  /**
   * Handle 401 Unauthorized response
   */
  handleUnauthorized(error) {
    errorLoggingService.log(
      {
        code: 'UNAUTHORIZED_401',
        message: 'Received 401 Unauthorized response',
        severity: 'ERROR',
        type: 'AUTH_ERROR',
      },
      { endpoint: error?.config?.url }
    );

    this.logout('Your session has expired. Please login again.');
  }

  /**
   * Handle 403 Forbidden response
   */
  handleForbidden(error) {
    errorLoggingService.log(
      {
        code: 'FORBIDDEN_403',
        message: 'Received 403 Forbidden response',
        severity: 'ERROR',
        type: 'AUTH_ERROR',
      },
      { endpoint: error?.config?.url }
    );

    this.notifyListeners({
      type: 'PERMISSION_DENIED',
      message: 'You do not have permission to access this resource',
    });
  }

  /**
   * Logout user
   */
  logout(reason = 'User logout') {
    this.setSessionInvalid(reason);
    Cookies.remove(TOKEN_NAME);

    errorLoggingService.log(
      {
        code: 'USER_LOGOUT',
        message: reason,
        severity: 'INFO',
        type: 'SESSION_MANAGEMENT',
      }
    );

    this.notifyListeners({
      type: 'LOGOUT',
      message: reason,
    });

    // Dispatch logout event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth:logout'));
    }
  }

  /**
   * Set session as invalid
   */
  setSessionInvalid(reason = 'Unknown') {
    this.isSessionValid = false;
    
    if (process.env.NODE_ENV === 'development') {
      console.warn('[SessionManager] Session invalidated:', reason);
    }
  }

  /**
   * Subscribe to session events
   */
  onChange(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  /**
   * Notify all listeners
   */
  notifyListeners(event) {
    this.listeners.forEach((callback) => {
      try {
        callback(event);
      } catch (error) {
        console.error('[SessionManager] Listener error:', error);
      }
    });
  }

  /**
   * Handle storage changes (logout from other tabs)
   */
  handleStorageChange(event) {
    if (event.key === TOKEN_NAME && !event.newValue) {
      this.logout('You have been logged out from another tab');
    }
  }

  /**
   * Check if session is valid
   */
  isValid() {
    return this.isSessionValid && this.validateSession();
  }

  /**
   * Cleanup
   */
  destroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('mousedown', this.recordActivity);
      window.removeEventListener('keydown', this.recordActivity);
      window.removeEventListener('click', this.recordActivity);
      window.removeEventListener('scroll', this.recordActivity);
      window.removeEventListener('storage', this.handleStorageChange);
    }

    clearTimeout(this.sessionWarningTimeout);
    clearTimeout(this.sessionTimeoutTimeout);
    this.listeners = [];
  }
}

export const sessionManager = new SessionManager();

/**
 * React Hook for session management
 */
export const useSessionManager = () => {
  const React = require('react');
  const [sessionEvent, setSessionEvent] = React.useState(null);

  React.useEffect(() => {
    sessionManager.init();

    const unsubscribe = sessionManager.onChange((event) => {
      setSessionEvent(event);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    isSessionValid: sessionManager.isValid(),
    lastEvent: sessionEvent,
    logout: (reason) => sessionManager.logout(reason),
  };
};

export default sessionManager;
