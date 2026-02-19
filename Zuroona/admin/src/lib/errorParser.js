/**
 * ERROR PARSER & MAPPER
 * Maps API errors to user-friendly messages and action suggestions
 */

const ERROR_MESSAGES = {
  // Network Errors
  'NETWORK_ERROR': {
    message: 'Unable to connect to the server. Please check your internet connection.',
    action: 'RETRY',
    icon: '🌐',
  },
  'TIMEOUT': {
    message: 'Request timed out. Please try again.',
    action: 'RETRY',
    icon: '⏱️',
  },

  // Authentication Errors
  'HTTP_401': {
    message: 'Your session has expired. Please login again.',
    action: 'LOGIN',
    icon: '🔐',
  },
  'INVALID_CREDENTIALS': {
    message: 'Invalid username or password.',
    action: 'RETRY',
    icon: '❌',
  },
  'TOKEN_EXPIRED': {
    message: 'Your session has expired. Please login again.',
    action: 'LOGIN',
    icon: '🔐',
  },

  // Authorization Errors
  'HTTP_403': {
    message: 'You do not have permission to access this resource.',
    action: 'CONTACT_SUPPORT',
    icon: '🚫',
  },
  'FORBIDDEN': {
    message: 'You do not have permission to perform this action.',
    action: 'CONTACT_SUPPORT',
    icon: '🚫',
  },

  // Not Found Errors
  'HTTP_404': {
    message: 'The resource you are looking for was not found.',
    action: 'GO_BACK',
    icon: '🔍',
  },
  'NOT_FOUND': {
    message: 'Resource not found.',
    action: 'GO_BACK',
    icon: '🔍',
  },

  // Validation Errors
  'VALIDATION_ERROR': {
    message: 'Please check your input and try again.',
    action: 'FIX_INPUT',
    icon: '⚠️',
  },
  'DUPLICATE_EMAIL': {
    message: 'This email is already registered.',
    action: 'USE_DIFFERENT_EMAIL',
    icon: '📧',
  },
  'DUPLICATE_PHONE': {
    message: 'This phone number is already registered.',
    action: 'USE_DIFFERENT_PHONE',
    icon: '📱',
  },

  // Server Errors
  'HTTP_500': {
    message: 'Server error occurred. Please try again later.',
    action: 'RETRY',
    icon: '⚠️',
  },
  'HTTP_503': {
    message: 'Service temporarily unavailable. Please try again later.',
    action: 'RETRY',
    icon: '🔧',
  },
  'INTERNAL_SERVER_ERROR': {
    message: 'An internal server error occurred.',
    action: 'CONTACT_SUPPORT',
    icon: '💥',
  },

  // Payment Errors
  'PAYMENT_FAILED': {
    message: 'Payment processing failed. Please try again or use a different payment method.',
    action: 'RETRY',
    icon: '💳',
  },
  'INVALID_CARD': {
    message: 'Invalid card details. Please check and try again.',
    action: 'FIX_INPUT',
    icon: '💳',
  },

  // Default
  'UNKNOWN_ERROR': {
    message: 'An unexpected error occurred. Please try again.',
    action: 'RETRY',
    icon: '😕',
  },
};

/**
 * Parse and map errors to user-friendly format
 */
export const parseError = (error, defaultMessage = null) => {
  // Handle string errors
  if (typeof error === 'string') {
    const mapped = ERROR_MESSAGES[error] || ERROR_MESSAGES['UNKNOWN_ERROR'];
    return {
      code: error,
      message: mapped.message,
      action: mapped.action,
      icon: mapped.icon,
      originalMessage: error,
    };
  }

  // Handle error objects
  const errorCode = 
    error?.code || 
    error?.data?.code || 
    `HTTP_${error?.statusCode}` ||
    'UNKNOWN_ERROR';

  const mapped = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES['UNKNOWN_ERROR'];

  // Ensure message/userMessage are always strings (never DOM nodes or objects)
  const rawMessage = error?.message ?? defaultMessage ?? mapped.message;
  const safeMessage = typeof rawMessage === 'string' ? rawMessage : (mapped?.message ?? 'An unexpected error occurred');

  return {
    code: errorCode,
    message: safeMessage,
    userMessage: mapped.message,
    action: mapped.action,
    icon: mapped.icon,
    details: error?.details || error?.data,
    originalError: error,
  };
};

/**
 * Get action based on error code
 */
export const getErrorAction = (errorCode) => {
  const mapped = ERROR_MESSAGES[errorCode];
  return mapped?.action || 'RETRY';
};

/**
 * Create action handler for error
 */
export const createErrorActionHandler = (action, context = {}) => {
  const handlers = {
    RETRY: () => context.retry?.(),
    LOGIN: () => {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    },
    GO_BACK: () => {
      if (typeof window !== 'undefined') {
        window.history.back();
      }
    },
    CONTACT_SUPPORT: () => {
      // Open support modal or navigate to support page
      context.openSupport?.();
    },
    FIX_INPUT: () => {
      // Focus on form fields
      context.focusForm?.();
    },
    USE_DIFFERENT_EMAIL: () => {
      context.clearEmail?.();
    },
    USE_DIFFERENT_PHONE: () => {
      context.clearPhone?.();
    },
  };

  return handlers[action] || (() => {});
};

/**
 * Map field-specific validation errors
 */
export const mapValidationErrors = (errors) => {
  const mapped = {};

  if (Array.isArray(errors)) {
    errors.forEach((error) => {
      if (error.field) {
        mapped[error.field] = error.message;
      }
    });
  } else if (typeof errors === 'object') {
    Object.keys(errors).forEach((key) => {
      mapped[key] = errors[key];
    });
  }

  return mapped;
};

/**
 * Format error for API response logging
 */
export const formatErrorResponse = (error, statusCode, endpoint) => {
  return {
    timestamp: new Date().toISOString(),
    endpoint,
    statusCode,
    code: error?.code || 'UNKNOWN',
    message: error?.message || 'Unknown error',
    details: error?.details || null,
  };
};

export default parseError;
