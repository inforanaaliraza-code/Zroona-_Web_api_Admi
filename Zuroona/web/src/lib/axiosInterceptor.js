/**
 * Axios Interceptor with Error Handling, Retry Logic, and Token Management
 */

import axios from 'axios';
import Cookies from 'js-cookie';
import errorHandler from './errorHandler';

const TOKEN_NAME = 'token';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const REQUEST_TIMEOUT = 30000;

let axiosInstance = null;

/**
 * Create axios instance with interceptors
 */
function createAxiosInstance() {
  const instance = axios.create({
    timeout: REQUEST_TIMEOUT,
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Add token to headers if exists
      const token = Cookies.get(TOKEN_NAME);
      if (token) {
        config.headers.Authorization = `Bearer ${token.replace(/^Bearer\s+/, '')}`;
      }

      // Add request ID for tracking
      config.headers['X-Request-ID'] = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Development logging
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
      }

      return config;
    },
    (error) => {
      errorHandler.log(error, { phase: 'request' });
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      // Development logging
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API Response] ${response.status} ${response.config.url}`);
      }
      return response;
    },
    async (error) => {
      const config = error.config;

      // Don't retry if no config
      if (!config) {
        errorHandler.log(error, { phase: 'response' });
        return Promise.reject(error);
      }

      // Initialize retry count
      config.retryCount = config.retryCount || 0;

      // Handle 401 - Invalid token
      if (error.response?.status === 401) {
        Cookies.remove(TOKEN_NAME);
        
        // Dispatch logout event
        window.dispatchEvent(
          new CustomEvent('session-timeout', {
            detail: { type: 'LOGOUT', reason: 'Token expired' },
          })
        );

        errorHandler.log(error, { phase: 'response', code: '401' });
        return Promise.reject(error);
      }

      // Handle 403 - Forbidden
      if (error.response?.status === 403) {
        errorHandler.log(error, { phase: 'response', code: '403' });
        return Promise.reject(error);
      }

      // Retry logic for 5xx and network errors
      const shouldRetry =
        config.retryCount < MAX_RETRIES &&
        (error.response?.status >= 500 || !error.response || error.code === 'ECONNABORTED');

      if (shouldRetry) {
        config.retryCount += 1;
        const delayMs = RETRY_DELAY * Math.pow(2, config.retryCount - 1);

        if (process.env.NODE_ENV === 'development') {
          console.log(`[API Retry] Attempt ${config.retryCount}/${MAX_RETRIES} after ${delayMs}ms`);
        }

        await new Promise((resolve) => setTimeout(resolve, delayMs));
        return instance(config);
      }

      // Log final error
      errorHandler.log(error, { phase: 'response', retries: config.retryCount });
      return Promise.reject(error);
    }
  );

  return instance;
}

/**
 * Get or create axios instance
 */
function getAxiosInstance() {
  if (!axiosInstance) {
    axiosInstance = createAxiosInstance();
  }
  return axiosInstance;
}

/**
 * Wrapper to add error handling to any API call
 */
async function withErrorHandling(apiCall, options = {}) {
  try {
    const result = await apiCall();
    return {
      success: true,
      data: result.data || result,
      status: result.status,
      error: null,
    };
  } catch (error) {
    const normalized = errorHandler.log(error, options.context);
    
    return {
      success: false,
      data: null,
      error: normalized,
      status: normalized.statusCode || 0,
      userMessage: errorHandler.getUserMessage(error),
    };
  }
}

export { createAxiosInstance, getAxiosInstance, withErrorHandling };
export default getAxiosInstance();
