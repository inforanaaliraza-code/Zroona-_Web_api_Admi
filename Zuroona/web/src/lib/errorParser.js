/**
 * Error Parser and Message Mapper
 * Maps error codes to user-friendly messages and action suggestions
 */

const ERROR_MESSAGES = {
  // Network Errors
  NETWORK_ERROR: {
    code: 'NETWORK_ERROR',
    message: 'Network connection failed',
    userMessage: 'Unable to connect to the server. Please check your internet connection.',
    action: 'RETRY',
    icon: 'mdi:wifi-off',
  },
  OFFLINE: {
    code: 'OFFLINE',
    message: 'Device is offline',
    userMessage: 'You are offline. Please connect to the internet.',
    action: 'RETRY',
    icon: 'mdi:wifi-off',
  },
  TIMEOUT: {
    code: 'TIMEOUT',
    message: 'Request timeout',
    userMessage: 'The request took too long. Please try again.',
    action: 'RETRY',
    icon: 'mdi:clock-alert',
  },
  CONNECTION_REFUSED: {
    code: 'CONNECTION_REFUSED',
    message: 'Connection refused',
    userMessage: 'Unable to reach the server. Please try again later.',
    action: 'RETRY',
    icon: 'mdi:server-network-off',
  },

  // HTTP Status Errors
  HTTP_400: {
    code: 'HTTP_400',
    message: 'Bad request',
    userMessage: 'Invalid request. Please check your input.',
    action: 'GO_BACK',
    icon: 'mdi:alert-circle',
  },
  HTTP_401: {
    code: 'HTTP_401',
    message: 'Unauthorized',
    userMessage: 'Your session has expired. Please log in again.',
    action: 'LOGIN',
    icon: 'mdi:lock-alert',
  },
  HTTP_403: {
    code: 'HTTP_403',
    message: 'Forbidden',
    userMessage: 'You do not have permission to access this resource.',
    action: 'GO_BACK',
    icon: 'mdi:shield-alert',
  },
  HTTP_404: {
    code: 'HTTP_404',
    message: 'Not found',
    userMessage: 'The resource you are looking for does not exist.',
    action: 'GO_HOME',
    icon: 'mdi:file-not-found',
  },
  HTTP_500: {
    code: 'HTTP_500',
    message: 'Server error',
    userMessage: 'There was a problem on our end. Please try again later.',
    action: 'RETRY',
    icon: 'mdi:server-network-off',
  },
  HTTP_503: {
    code: 'HTTP_503',
    message: 'Service unavailable',
    userMessage: 'The service is temporarily unavailable. Please try again later.',
    action: 'RETRY',
    icon: 'mdi:server-network-off',
  },

  // Validation Errors
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    message: 'Validation failed',
    userMessage: 'Please check the data you entered and try again.',
    action: 'CORRECT_INPUT',
    icon: 'mdi:form-textbox-password',
  },
  REQUIRED_FIELD: {
    code: 'REQUIRED_FIELD',
    message: 'Required field missing',
    userMessage: 'Please fill in all required fields.',
    action: 'CORRECT_INPUT',
    icon: 'mdi:alert',
  },
  INVALID_EMAIL: {
    code: 'INVALID_EMAIL',
    message: 'Invalid email format',
    userMessage: 'Please enter a valid email address.',
    action: 'CORRECT_INPUT',
    icon: 'mdi:email-alert',
  },
  INVALID_PHONE: {
    code: 'INVALID_PHONE',
    message: 'Invalid phone number',
    userMessage: 'Please enter a valid phone number.',
    action: 'CORRECT_INPUT',
    icon: 'mdi:phone-alert',
  },
  DUPLICATE_EMAIL: {
    code: 'DUPLICATE_EMAIL',
    message: 'Email already exists',
    userMessage: 'This email is already registered. Please use a different email.',
    action: 'CORRECT_INPUT',
    icon: 'mdi:email-multiple',
  },
  DUPLICATE_PHONE: {
    code: 'DUPLICATE_PHONE',
    message: 'Phone already exists',
    userMessage: 'This phone number is already registered.',
    action: 'CORRECT_INPUT',
    icon: 'mdi:phone-multiple',
  },

  // Auth Errors
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    message: 'Invalid credentials',
    userMessage: 'Invalid email or password. Please try again.',
    action: 'RETRY',
    icon: 'mdi:lock-alert',
  },
  SESSION_EXPIRED: {
    code: 'SESSION_EXPIRED',
    message: 'Session has expired',
    userMessage: 'Your session has expired. Please log in again.',
    action: 'LOGIN',
    icon: 'mdi:clock-alert',
  },
  TOKEN_INVALID: {
    code: 'TOKEN_INVALID',
    message: 'Invalid token',
    userMessage: 'Your session is invalid. Please log in again.',
    action: 'LOGIN',
    icon: 'mdi:lock-alert',
  },
  NO_PERMISSION: {
    code: 'NO_PERMISSION',
    message: 'No permission',
    userMessage: 'You do not have permission to perform this action.',
    action: 'GO_BACK',
    icon: 'mdi:shield-alert',
  },

  // Business Logic Errors
  DUPLICATE_ENTRY: {
    code: 'DUPLICATE_ENTRY',
    message: 'Entry already exists',
    userMessage: 'This entry already exists. Please check and try again.',
    action: 'CORRECT_INPUT',
    icon: 'mdi:alert-circle',
  },
  NOT_FOUND: {
    code: 'NOT_FOUND',
    message: 'Resource not found',
    userMessage: 'The resource you are looking for does not exist.',
    action: 'GO_BACK',
    icon: 'mdi:file-not-found',
  },
  ALREADY_PROCESSED: {
    code: 'ALREADY_PROCESSED',
    message: 'Already processed',
    userMessage: 'This request has already been processed.',
    action: 'GO_BACK',
    icon: 'mdi:check-circle',
  },
  INVALID_STATE: {
    code: 'INVALID_STATE',
    message: 'Invalid state',
    userMessage: 'The operation cannot be performed in the current state.',
    action: 'GO_BACK',
    icon: 'mdi:alert-circle',
  },

  // Default
  UNKNOWN_ERROR: {
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred',
    userMessage: 'Something went wrong. Please try again.',
    action: 'RETRY',
    icon: 'mdi:alert-circle',
  },
};

/**
 * Parse error and return mapped message
 */
function parseError(errorCode, customMessage = null) {
  const errorMsg = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.UNKNOWN_ERROR;
  
  return {
    ...errorMsg,
    userMessage: customMessage || errorMsg.userMessage,
  };
}

/**
 * Get error action
 */
function getErrorAction(errorCode) {
  const errorMsg = ERROR_MESSAGES[errorCode];
  return errorMsg?.action || 'RETRY';
}

/**
 * Create handler for error action
 */
function createErrorActionHandler(errorCode, options = {}) {
  const action = getErrorAction(errorCode);
  
  return {
    action,
    handle: () => {
      switch (action) {
        case 'RETRY':
          return { type: 'RETRY' };
        case 'LOGIN':
          return { type: 'LOGIN' };
        case 'GO_BACK':
          return { type: 'GO_BACK' };
        case 'GO_HOME':
          return { type: 'GO_HOME' };
        case 'CORRECT_INPUT':
          return { type: 'CORRECT_INPUT' };
        default:
          return { type: 'NONE' };
      }
    },
  };
}

/**
 * Map validation errors from API response
 */
function mapValidationErrors(errors = []) {
  const mapped = {};
  
  errors.forEach((error) => {
    const field = error.field || error.path;
    const message = error.message || 'Invalid input';
    
    if (field) {
      mapped[field] = message;
    }
  });
  
  return mapped;
}

/**
 * Format error response for display
 */
function formatErrorResponse(error) {
  const code = error.code || 'UNKNOWN_ERROR';
  const parsed = parseError(code);
  
  return {
    code: parsed.code,
    title: parsed.message,
    message: parsed.userMessage,
    action: parsed.action,
    icon: parsed.icon,
    severity: getSeverityFromCode(code),
  };
}

/**
 * Get severity from error code
 */
function getSeverityFromCode(code) {
  if (code.includes('NETWORK') || code.includes('TIMEOUT')) return 'ERROR';
  if (code === 'HTTP_500' || code === 'HTTP_503') return 'CRITICAL';
  if (code === 'HTTP_401' || code === 'HTTP_403') return 'ERROR';
  if (code === 'VALIDATION_ERROR') return 'WARNING';
  return 'ERROR';
}

// Expose to window for debugging
if (typeof window !== 'undefined') {
  window.__errorParser = {
    parseError,
    getErrorAction,
    createErrorActionHandler,
    mapValidationErrors,
    formatErrorResponse,
    getSeverityFromCode,
  };
}

export {
  parseError,
  getErrorAction,
  createErrorActionHandler,
  mapValidationErrors,
  formatErrorResponse,
  getSeverityFromCode,
  ERROR_MESSAGES,
};
