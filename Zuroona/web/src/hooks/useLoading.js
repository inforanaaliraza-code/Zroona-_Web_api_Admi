/**
 * Custom hook for managing loading states
 * Provides consistent loading state management across components
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

	/**
	 * Execute async function with loading state management
	 */
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

/**
 * Hook for managing multiple loading states
 */
export const useMultipleLoading = (keys = []) => {
	const [loadingStates, setLoadingStates] = useState(
		keys.reduce((acc, key) => ({ ...acc, [key]: false }), {})
	);

	const setLoading = useCallback((key, value) => {
		setLoadingStates(prev => ({ ...prev, [key]: value }));
	}, []);

	const startLoading = useCallback((key) => {
		setLoading(key, true);
	}, [setLoading]);

	const stopLoading = useCallback((key) => {
		setLoading(key, false);
	}, [setLoading]);

	const isLoading = useCallback((key) => {
		return loadingStates[key] || false;
	}, [loadingStates]);

	const isAnyLoading = useCallback(() => {
		return Object.values(loadingStates).some(state => state === true);
	}, [loadingStates]);

	const resetAll = useCallback(() => {
		setLoadingStates(
			keys.reduce((acc, key) => ({ ...acc, [key]: false }), {})
		);
	}, [keys]);

	return {
		loadingStates,
		setLoading,
		startLoading,
		stopLoading,
		isLoading,
		isAnyLoading,
		resetAll
	};
};

