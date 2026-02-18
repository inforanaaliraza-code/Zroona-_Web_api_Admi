/**
 * AXIOS INTERCEPTOR WITH RETRY LOGIC & ERROR HANDLING
 * Centralized HTTP request/response handling with automatic retries
 */

import axios from 'axios';
import { errorHandler } from './errorHandler';
import Cookies from 'js-cookie';

const TOKEN_NAME = 'ZuroonaToken';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const REQUEST_TIMEOUT = 30000; // 30 seconds

// Track retry counts per request
const retryMap = new Map();

/**
 * Create axios instance with default config
 */
export const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: REQUEST_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // REQUEST INTERCEPTOR
  instance.interceptors.request.use(
    (config) => {
      try {
        const token = Cookies.get(TOKEN_NAME);

        if (token) {
          const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
          config.headers.Authorization = formattedToken;
        }

        config.requestId = `${Date.now()}-${Math.random()}`;
        retryMap.set(config.requestId, 0);

        if (process.env.NODE_ENV === 'development') {
          console.debug(`[API] ${config.method.toUpperCase()} ${config.url}`, {
            data: config.data,
            params: config.params,
          });
        }

        return config;
      } catch (error) {
        errorHandler.log(error, { step: 'REQUEST_INTERCEPTOR' });
        return Promise.reject(error);
      }
    },
    (error) => {
      errorHandler.log(error, { step: 'REQUEST_INTERCEPTOR_ERROR' });
      return Promise.reject(error);
    }
  );

  // RESPONSE INTERCEPTOR
  instance.interceptors.response.use(
    (response) => {
      retryMap.delete(response.config.requestId);

      if (process.env.NODE_ENV === 'development') {
        console.debug(`[API] Response: ${response.status}`, response.data);
      }

      return response;
    },
    async (error) => {
      const config = error.config;
      const requestId = config?.requestId;

      // No config = request failed to initialize
      if (!config) {
        errorHandler.log(error, { step: 'RESPONSE_INTERCEPTOR_NO_CONFIG' });
        return Promise.reject(error);
      }

      const retryCount = retryMap.get(requestId) || 0;
      retryMap.set(requestId, retryCount + 1);

      // HANDLE 401 - Token Expired
      if (error.response?.status === 401) {
        Cookies.remove(TOKEN_NAME);
        
        // Trigger logout event
        window.dispatchEvent(new Event('auth:logout'));
        
        errorHandler.log(error, {
          step: 'RESPONSE_INTERCEPTOR_401',
          message: 'Session expired',
        });

        return Promise.reject(error);
      }

      // HANDLE 403 - Forbidden
      if (error.response?.status === 403) {
        errorHandler.log(error, { step: 'RESPONSE_INTERCEPTOR_403' });
        return Promise.reject(error);
      }

      // RETRY LOGIC for 5xx and network errors
      const shouldRetry =
        retryCount < MAX_RETRIES &&
        (error.response?.status >= 500 || error.code === 'ECONNABORTED' || !error.response);

      if (shouldRetry) {
        const delayMs = RETRY_DELAY * Math.pow(2, retryCount); // Exponential backoff
        
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `[API] Retry ${retryCount + 1}/${MAX_RETRIES} for ${config.url} in ${delayMs}ms`
          );
        }

        await new Promise((resolve) => setTimeout(resolve, delayMs));
        return instance(config);
      }

      // Log final error
      errorHandler.log(error, {
        step: 'RESPONSE_INTERCEPTOR_FINAL',
        retryCount,
        url: config.url,
        method: config.method,
      });

      return Promise.reject(error);
    }
  );

  return instance;
};

/**
 * Handle API errors in components
 */
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  const normalized = errorHandler.normalizeError(error);
  const userMessage = errorHandler.getUserMessage(normalized);
  const severity = errorHandler.getSeverity(normalized);

  return {
    normalized,
    userMessage,
    severity,
    isRecoverable: errorHandler.isRecoverable(normalized),
  };
};

/**
 * Wrap API calls with error handling
 */
export const withErrorHandling = async (apiCall, context = {}) => {
  try {
    const result = await apiCall();
    return {
      success: true,
      data: result,
      error: null,
    };
  } catch (error) {
    const { normalized, userMessage, severity } = handleApiError(error);
    
    return {
      success: false,
      data: null,
      error: {
        normalized,
        userMessage,
        severity,
      },
    };
  }
};
