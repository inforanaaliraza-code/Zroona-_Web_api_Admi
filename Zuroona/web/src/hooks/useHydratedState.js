"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Hook to handle hydration-safe state management
 * Ensures component renders same content on server and client
 */
export function useHydratedState(initialValue = false) {
    const [isMounted, setIsMounted] = useState(false);
    const isFirstRenderRef = useRef(true);

    useEffect(() => {
        // Only run on client after hydration
        isFirstRenderRef.current = false;
        setIsMounted(true);
    }, []);

    return isMounted;
}

/**
 * Hook to safely access localStorage without hydration errors
 */
export function useLocalStorage(key, defaultValue) {
    const [value, setValue] = useState(defaultValue);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setValue(JSON.parse(item));
            }
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
        }
    }, [key]);

    const setStoredValue = (newValue) => {
        try {
            const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
            setValue(valueToStore);
            if (isMounted) {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [isMounted ? value : defaultValue, setStoredValue];
}
