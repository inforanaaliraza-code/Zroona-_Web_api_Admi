/**
 * ENHANCED API MODULE WITH COMPREHENSIVE ERROR HANDLING
 * Replaces admin/src/api/index.js with better error handling, retries, and logging
 */

import { createAxiosInstance, handleApiError, withErrorHandling } from '@/lib/axiosInterceptor';
import { errorHandler } from '@/lib/errorHandler';
import { errorLoggingService } from '@/lib/errorLoggingService';
import { parseError } from '@/lib/errorParser';
import { BASE_API_URL, TOKEN_NAME } from '@/until';
import Cookies from 'js-cookie';

// Create axios instance with interceptors
const axiosInstance = createAxiosInstance(BASE_API_URL);

/**
 * FORM DATA REQUESTS
 */

export const postFormDataNoToken = async (url = '', data = {}) => {
  return withErrorHandling(async () => {
    const formData = new FormData();
    for (let key in data) {
      formData.append(key, data[key]);
    }
    const response = await axiosInstance.post(url, formData);
    return response.data;
  }, { endpoint: url, method: 'POST_FORM' });
};

export const postFormData = async (url = '', data = {}) => {
  return withErrorHandling(async () => {
    const formData = new FormData();
    for (let key in data) {
      formData.append(key, data[key]);
    }
    const response = await axiosInstance.post(url, formData);
    return response.data;
  }, { endpoint: url, method: 'POST_FORM' });
};

export const putFormData = async (url = '', data = {}) => {
  return withErrorHandling(async () => {
    const formData = new FormData();
    for (let key in data) {
      formData.append(key, data[key]);
    }
    const response = await axiosInstance.put(url, formData);
    return response.data;
  }, { endpoint: url, method: 'PUT_FORM' });
};

/**
 * JSON REQUESTS
 */

export const postRawData = async (url = '', data = {}) => {
  return withErrorHandling(async () => {
    const response = await axiosInstance.post(url, data);
    return response.data;
  }, { endpoint: url, method: 'POST', data });
};

export const putRawData = async (url = '', data = {}) => {
  return withErrorHandling(async () => {
    const response = await axiosInstance.put(url, data);
    return response.data;
  }, { endpoint: url, method: 'PUT', data });
};

export const patchRawData = async (url = '', data = {}) => {
  return withErrorHandling(async () => {
    const response = await axiosInstance.patch(url, data);
    return response.data;
  }, { endpoint: url, method: 'PATCH', data });
};

/**
 * GET REQUESTS
 */

export const getData = async (url = '', params = {}) => {
  return withErrorHandling(async () => {
    const response = await axiosInstance.get(url, { params });
    return response.data;
  }, { endpoint: url, method: 'GET', params });
};

export const getDataNoToken = async (url = '', params = {}) => {
  return withErrorHandling(async () => {
    // Temporarily remove auth for this request
    const token = Cookies.get(TOKEN_NAME);
    Cookies.remove(TOKEN_NAME);
    
    try {
      const response = await axiosInstance.get(url, { params });
      return response.data;
    } finally {
      if (token) {
        Cookies.set(TOKEN_NAME, token);
      }
    }
  }, { endpoint: url, method: 'GET', skipAuth: true });
};

/**
 * DELETE REQUESTS
 */

export const deleteData = async (url = '', id = null) => {
  return withErrorHandling(async () => {
    const fullUrl = id ? `${url}/${id}` : url;
    const response = await axiosInstance.delete(fullUrl);
    return response.data;
  }, { endpoint: url, method: 'DELETE', id });
};

export const DeleteParams = async (url = '', params = {}) => {
  return withErrorHandling(async () => {
    const response = await axiosInstance.delete(url, { params });
    return response.data;
  }, { endpoint: url, method: 'DELETE', params });
};

/**
 * FILE DOWNLOAD
 */

export const getDataAndDownload = async (url = '', params = {}) => {
  return withErrorHandling(async () => {
    const response = await axiosInstance.get(url, {
      params,
      responseType: 'blob',
    });
    return response.data;
  }, { endpoint: url, method: 'GET_DOWNLOAD', params });
};

/**
 * Error handling wrapper for components
 */
export const handleAndDisplayError = (error, context = {}) => {
  const { normalized, userMessage, severity } = handleApiError(error);
  
  errorLoggingService.log(
    {
      code: normalized.code,
      message: normalized.message,
      severity,
      type: 'API_ERROR',
    },
    context
  );

  return {
    message: userMessage,
    severity,
    error: normalized,
  };
};

/**
 * Safe API call wrapper (for components)
 */
export const safeApiCall = async (apiFunction, options = {}) => {
  const {
    onError = null,
    onSuccess = null,
    showNotification = true,
  } = options;

  try {
    const result = await apiFunction();

    if (onSuccess) {
      onSuccess(result);
    }

    return {
      success: true,
      data: result,
      error: null,
    };
  } catch (error) {
    const { message, severity } = handleAndDisplayError(error, {
      function: apiFunction.name,
      ...options,
    });

    if (onError) {
      onError(error, message);
    }

    if (showNotification) {
      console.error(`[API Error] ${message}`);
    }

    return {
      success: false,
      data: null,
      error: error,
      message,
      severity,
    };
  }
};

export default axiosInstance;
