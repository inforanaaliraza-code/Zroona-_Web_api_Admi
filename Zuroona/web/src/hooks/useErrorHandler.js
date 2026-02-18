/**
 * Custom hook for error handling in React components
 * Provides consistent error handling with i18n support
 */

import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

function isAuthTokenError(error, message) {
	const msg = (message || error?.response?.data?.message || error?.message || '').toLowerCase();
	if (error?.response?.status === 401) return true;
	return (msg.includes('token') && (msg.includes('missing') || msg.includes('invalid') || msg.includes('expired'))) || (msg.includes('authentication') && (msg.includes('login') || msg.includes('required')));
}

export const useErrorHandler = () => {
	const { t } = useTranslation();
	const [error, setError] = useState(null);

	const handleError = useCallback((error, customMessage = null) => {
		let errorMessage = customMessage;

		if (!errorMessage) {
			if (error?.response?.data?.message) {
				errorMessage = error.response.data.message;
			} else if (error?.message) {
				errorMessage = error.message;
			} else if (typeof error === 'string') {
				errorMessage = error;
			} else {
				errorMessage = t('common.error') || 'An error occurred';
			}
		}

		if (isAuthTokenError(error, errorMessage)) return errorMessage;

		setError(errorMessage);
		toast.error(errorMessage);
		
		// Log error for debugging
		if (process.env.NODE_ENV === 'development') {
			console.error('Error handled:', error);
		}

		return errorMessage;
	}, [t]);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	const handleAsyncError = useCallback(async (asyncFn, errorMessage = null) => {
		try {
			clearError();
			return await asyncFn();
		} catch (err) {
			handleError(err, errorMessage);
			throw err;
		}
	}, [handleError, clearError]);

	return {
		error,
		handleError,
		clearError,
		handleAsyncError
	};
};

