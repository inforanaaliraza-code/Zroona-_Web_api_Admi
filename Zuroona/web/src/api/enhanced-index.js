/**
 * Enhanced API Module with Error Handling
 * Replaces direct axios calls with automatic error handling, retry logic, and logging
 */

import axiosInstance, { withErrorHandling } from '@/lib/axiosInterceptor';
import { parseError } from '@/lib/errorParser';
import errorHandler from '@/lib/errorHandler';
import errorLoggingService from '@/lib/errorLoggingService';

/**
 * Safe API call wrapper with error handling
 */
async function safeApiCall(apiCall, options = {}) {
  const { context = {}, onError = null, onSuccess = null } = options;

  try {
    const result = await apiCall();
    
    if (onSuccess) {
      onSuccess(result.data || result);
    }

    return {
      success: true,
      data: result.data || result,
      error: null,
    };
  } catch (error) {
    const normalized = errorHandler.log(error, context);
    const userMessage = errorHandler.getUserMessage(error);

    if (onError) {
      onError(normalized, userMessage);
    }

    return {
      success: false,
      data: null,
      error: normalized,
      userMessage,
    };
  }
}

/**
 * GET request with error handling
 */
async function getData(url, options = {}) {
  return withErrorHandling(
    () => axiosInstance.get(url),
    { context: { ...options, method: 'GET', endpoint: url } }
  );
}

/**
 * POST request with JSON data
 */
async function postRawData(url, data = {}, options = {}) {
  return withErrorHandling(
    () => axiosInstance.post(url, data, options.config),
    { context: { ...options, method: 'POST', endpoint: url } }
  );
}

/**
 * POST request with FormData
 */
async function postFormData(url, formData, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...options.config,
  };

  return withErrorHandling(
    () => axiosInstance.post(url, formData, config),
    { context: { ...options, method: 'POST_FORM', endpoint: url } }
  );
}

/**
 * PUT request with error handling
 */
async function putRawData(url, data = {}, options = {}) {
  return withErrorHandling(
    () => axiosInstance.put(url, data, options.config),
    { context: { ...options, method: 'PUT', endpoint: url } }
  );
}

/**
 * PATCH request with error handling
 */
async function patchRawData(url, data = {}, options = {}) {
  return withErrorHandling(
    () => axiosInstance.patch(url, data, options.config),
    { context: { ...options, method: 'PATCH', endpoint: url } }
  );
}

/**
 * DELETE request with error handling
 */
async function deleteData(url, options = {}) {
  return withErrorHandling(
    () => axiosInstance.delete(url, options.config),
    { context: { ...options, method: 'DELETE', endpoint: url } }
  );
}

/**
 * Handle and display errors
 */
function handleAndDisplayError(error, context = {}) {
  const normalized = errorHandler.log(error, context);
  const parsed = parseError(normalized.code);
  const userMessage = errorHandler.getUserMessage(error);

  errorLoggingService.log(normalized, context);

  return {
    code: normalized.code,
    message: normalized.message,
    userMessage,
    severity: normalized.severity,
    parsed,
  };
}

/**
 * Create axios instance exposed instance
 */
export {
  safeApiCall,
  getData,
  postRawData,
  postFormData,
  putRawData,
  patchRawData,
  deleteData,
  handleAndDisplayError,
  axiosInstance,
};

const apiExport = {
  safeApiCall,
  getData,
  postRawData,
  postFormData,
  putRawData,
  patchRawData,
  deleteData,
  handleAndDisplayError,
};
export default apiExport;