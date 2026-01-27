/**
 * Performance Optimization Utilities
 * Provides utilities for optimizing React components and API calls
 */

import React, { useMemo, useCallback, memo } from 'react';

/**
 * Memoize expensive computations
 * Usage: const expensiveValue = useMemoized(() => computeExpensiveValue(a, b), [a, b]);
 */
export const useMemoized = (computeFn, deps) => {
	return useMemo(computeFn, deps);
};

/**
 * Memoize callback functions
 * Usage: const handleClick = useMemoizedCallback(() => doSomething(id), [id]);
 */
export const useMemoizedCallback = (callback, deps) => {
	return useCallback(callback, deps);
};

/**
 * Debounce function
 * Delays function execution until after wait time
 */
export const debounce = (func, wait = 300) => {
	let timeout;
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
};

/**
 * Throttle function
 * Limits function execution to once per wait time
 */
export const throttle = (func, wait = 300) => {
	let inThrottle;
	return function executedFunction(...args) {
		if (!inThrottle) {
			func.apply(this, args);
			inThrottle = true;
			setTimeout(() => (inThrottle = false), wait);
		}
	};
};

/**
 * Lazy load component with React.lazy
 * Usage: const LazyComponent = lazyLoad(() => import('./Component'));
 */
export const lazyLoad = (importFn) => {
	return React.lazy(importFn);
};

/**
 * Memoize component with React.memo
 * Usage: export default memoizeComponent(MyComponent, (prevProps, nextProps) => prevProps.id === nextProps.id);
 */
export const memoizeComponent = (Component, areEqual = null) => {
	return areEqual ? memo(Component, areEqual) : memo(Component);
};

/**
 * Image lazy loading helper
 * Returns intersection observer for lazy loading images
 */
export const useLazyImage = (src, placeholder = '/assets/images/placeholder.png') => {
	const [imageSrc, setImageSrc] = React.useState(placeholder);
	const [imageRef, setImageRef] = React.useState();

	React.useEffect(() => {
		let observer;

		const canObserve =
			typeof window !== 'undefined' &&
			typeof IntersectionObserver !== 'undefined' &&
			imageRef &&
			imageRef.nodeType === 1 &&
			imageSrc === placeholder;

		if (canObserve) {
			observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							setImageSrc(src);
							observer.unobserve(imageRef);
						}
					});
				},
				{ threshold: 0.1 }
			);
			observer.observe(imageRef);
		} else if (imageRef && imageSrc === placeholder) {
			// Fallback: if we cannot observe, load immediately to avoid crashes
			setImageSrc(src);
		}

		return () => {
			if (observer && observer.unobserve && imageRef && imageRef.nodeType === 1) {
				observer.unobserve(imageRef);
			}
		};
	}, [imageRef, imageSrc, placeholder, src]);

	return [imageSrc, setImageRef];
};

/**
 * Virtual scrolling helper
 * Calculates visible items for virtual scrolling
 */
export const useVirtualScroll = (items, itemHeight, containerHeight) => {
	return useMemo(() => {
		const visibleCount = Math.ceil(containerHeight / itemHeight);
		const startIndex = 0;
		const endIndex = Math.min(startIndex + visibleCount, items.length);
		
		return {
			visibleItems: items.slice(startIndex, endIndex),
			startIndex,
			endIndex,
			totalHeight: items.length * itemHeight,
			offsetY: startIndex * itemHeight
		};
	}, [items, itemHeight, containerHeight]);
};

/**
 * Cache API responses
 * Simple in-memory cache for API responses
 */
class APICache {
	constructor(maxSize = 100, ttl = 5 * 60 * 1000) {
		this.cache = new Map();
		this.maxSize = maxSize;
		this.ttl = ttl;
	}

	get(key) {
		const item = this.cache.get(key);
		if (!item) return null;
		
		if (Date.now() - item.timestamp > this.ttl) {
			this.cache.delete(key);
			return null;
		}
		
		return item.data;
	}

	set(key, data) {
		if (this.cache.size >= this.maxSize) {
			const firstKey = this.cache.keys().next().value;
			this.cache.delete(firstKey);
		}
		
		this.cache.set(key, {
			data,
			timestamp: Date.now()
		});
	}

	clear() {
		this.cache.clear();
	}

	delete(key) {
		this.cache.delete(key);
	}
}

export const apiCache = new APICache();

