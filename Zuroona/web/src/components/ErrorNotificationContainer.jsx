'use client';

/**
 * Error Notification Container
 * Global component that displays error notifications (localized)
 */

import React, { useEffect, useState, useCallback, createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import errorHandler from '@/lib/errorHandler';
import { parseError } from '@/lib/errorParser';
import '@/styles/error-handling.css';

/** Map error codes to i18n keys for title and message so notifications are localized */
const ERROR_I18N_KEYS = {
  NETWORK_ERROR: { title: 'errors.networkErrorTitle', message: 'errors.networkUserMessage' },
  OFFLINE: { title: 'errors.offlineTitle', message: 'errors.offlineUserMessage' },
  TIMEOUT: { title: 'errors.timeoutTitle', message: 'errors.timeoutUserMessage' },
};

// Create context for error notifications
const ErrorNotificationContext = createContext(null);

/**
 * Error Notification Component (displays localized title and message)
 */
function ErrorNotification({ notification, onClose }) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 8000); // Auto-dismiss after 8 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const severityClass = notification.severity?.toLowerCase() || 'error';
  const title = notification.titleKey ? t(notification.titleKey) : (notification.title || t('errors.errorTitle'));
  const message = notification.messageKey ? t(notification.messageKey) : notification.message;

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
          <div className="error-notification-title">{title}</div>
          <div className="error-notification-message">{message}</div>
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
      const i18nKeys = ERROR_I18N_KEYS[error.code];

      const notification = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: error.message,
        message: parsed.userMessage || error.message,
        titleKey: i18nKeys?.title,
        messageKey: i18nKeys?.message,
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
