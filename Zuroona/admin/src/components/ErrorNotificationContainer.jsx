'use client';

/**
 * ERROR NOTIFICATION COMPONENT
 * Global error notification system integrated with error handler
 */

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { errorHandler } from '@/lib/errorHandler';
import { parseError } from '@/lib/errorParser';

export function ErrorNotificationContainer() {
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    // Subscribe to error events
    const handleError = (error) => {
      const parsed = parseError(error.code, error.message);
      
      const errorId = `${Date.now()}-${Math.random()}`;
      const notification = {
        id: errorId,
        ...parsed,
        timestamp: new Date(),
      };

      setErrors((prev) => [...prev, notification]);

      // Auto-remove after 8 seconds
      setTimeout(() => {
        removeError(errorId);
      }, 8000);
    };

    errorHandler.onError(handleError);

    return () => {
      // Cleanup subscription
      errorHandler.errorCallbacks = errorHandler.errorCallbacks.filter(
        (cb) => cb !== handleError
      );
    };
  }, []);

  const removeError = (errorId) => {
    setErrors((prev) => prev.filter((e) => e.id !== errorId));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {errors.map((error) => (
        <ErrorNotification
          key={error.id}
          error={error}
          onClose={() => removeError(error.id)}
        />
      ))}
    </div>
  );
}

function ErrorNotification({ error, onClose }) {
  const severityStyles = {
    CRITICAL: 'bg-red-500 border-red-600',
    ERROR: 'bg-orange-500 border-orange-600',
    WARNING: 'bg-yellow-500 border-yellow-600',
    INFO: 'bg-blue-500 border-blue-600',
  };

  const iconMap = {
    CRITICAL: 'mdi:alert-circle',
    ERROR: 'mdi:alert',
    WARNING: 'mdi:alert-outline',
    INFO: 'mdi:information',
  };

  const severity = error.severity || 'ERROR';
  const style = severityStyles[severity] || severityStyles.ERROR;
  const icon = iconMap[severity] || iconMap.ERROR;

  return (
    <div
      className={`${style} text-white p-4 rounded-lg shadow-lg border-2 flex items-start gap-3 animate-slideInRight`}
      role="alert"
    >
      <Icon icon={icon} className="text-2xl flex-shrink-0 mt-1" />

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sm mb-1">{severity}</h3>
        <p className="text-sm break-words">
          {typeof error.message === 'string' ? error.message : (typeof error.userMessage === 'string' ? error.userMessage : 'An error occurred')}
        </p>
      </div>

      <button
        onClick={onClose}
        className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors flex-shrink-0"
        aria-label="Close notification"
      >
        <Icon icon="mdi:close" className="text-xl" />
      </button>
    </div>
  );
}

/**
 * Hook for showing errors programmatically
 */
export const useError = () => {
  const show = (message, severity = 'ERROR', context = {}) => {
    errorHandler.log(
      {
        code: 'USER_ERROR',
        message,
        severity,
        type: 'MANUAL_ERROR',
      },
      context
    );
  };

  return { show };
};

export default ErrorNotificationContainer;
