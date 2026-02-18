'use client';

/**
 * Error Notification Container
 * Global component that displays error notifications
 */

import React, { useEffect, useState, useCallback, createContext, useContext } from 'react';
import errorHandler from '@/lib/errorHandler';
import { parseError } from '@/lib/errorParser';
import '@/styles/error-handling.css';

// Create context for error notifications
const ErrorNotificationContext = createContext(null);

/**
 * Error Notification Component
 */
function ErrorNotification({ notification, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 8000); // Auto-dismiss after 8 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const severityClass = notification.severity?.toLowerCase() || 'error';

  return (
    <div
      className={`error-notification error-notification-${severityClass} ${
        isVisible ? 'error-notification-enter' : 'error-notification-exit'
      }`}
    >
      <div className="error-notification-content">
        <div className="error-notification-icon">
          {notification.severity === 'CRITICAL' && '🔴'}
          {notification.severity === 'ERROR' && '❌'}
          {notification.severity === 'WARNING' && '⚠️'}
          {notification.severity === 'INFO' && 'ℹ️'}
        </div>
        <div className="error-notification-text">
          <div className="error-notification-title">{notification.title || 'Error'}</div>
          <div className="error-notification-message">{notification.message}</div>
        </div>
      </div>
      <button
        className="error-notification-close"
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
      >
        ✕
      </button>
    </div>
  );
}

/**
 * Error Notification Container Component
 */
function ErrorNotificationContainer() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = errorHandler.onError((error) => {
      // Skip showing notification for auth/token errors (handled elsewhere or expected for guests)
      const msg = (error.message || '').toLowerCase();
      const isAuthError =
        error.code === 'HTTP_401' ||
        (msg.includes('token') && (msg.includes('missing') || msg.includes('invalid') || msg.includes('expired'))) ||
        (msg.includes('authentication') && (msg.includes('login') || msg.includes('required')));
      if (isAuthError) return;

      const parsed = parseError(error.code);

      const notification = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: error.message,
        message: parsed.userMessage || error.message,
        severity: error.severity || 'ERROR',
        code: error.code,
      };

      setNotifications((prev) => [...prev, notification]);
    });

    return unsubscribe;
  }, []);

  const handleClose = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <>
      <div className="error-notifications-container">
        {notifications.map((notification) => (
          <ErrorNotification
            key={notification.id}
            notification={notification}
            onClose={() => handleClose(notification.id)}
          />
        ))}
      </div>
      <ErrorNotificationContext.Provider value={{ notifications }}>
        {/* Context provider for child components */}
      </ErrorNotificationContext.Provider>
    </>
  );
}

/**
 * Hook to use error notifications
 */
function useErrorNotification() {
  const context = useContext(ErrorNotificationContext);
  
  return {
    show: (message, severity = 'ERROR') => {
      errorHandler.log(new Error(message), { severity });
    },
  };
}

export default ErrorNotificationContainer;
export { useErrorNotification, ErrorNotificationContext };
