/**
 * Custom hook for managing loading states in Admin Panel
 */

import { useState, useCallback } from 'react';

export const useLoading = (initialState = false) => {
	const [loading, setLoading] = useState(initialState);
	const [error, setError] = useState(null);

	const startLoading = useCallback(() => {
		setLoading(true);
		setError(null);
	}, []);

	const stopLoading = useCallback(() => {
		setLoading(false);
	}, []);

	const setErrorState = useCallback((errorMessage) => {
		setError(errorMessage);
		setLoading(false);
	}, []);

	const reset = useCallback(() => {
		setLoading(false);
		setError(null);
	}, []);

	const execute = useCallback(async (asyncFn, onSuccess, onError) => {
		try {
			startLoading();
			const result = await asyncFn();
			if (onSuccess) {
				onSuccess(result);
			}
			return result;
		} catch (err) {
			const errorMessage = err?.message || 'An error occurred';
			setErrorState(errorMessage);
			if (onError) {
				onError(err);
			}
			throw err;
		} finally {
			stopLoading();
		}
	}, [startLoading, stopLoading, setErrorState]);

	return {
		loading,
		error,
		startLoading,
		stopLoading,
		setErrorState,
		reset,
		execute
	};
};

