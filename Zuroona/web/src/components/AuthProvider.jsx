'use client';

import { useEffect } from 'react';
import useAuthStore from '@/store/useAuthStore';

/**
 * AuthProvider component
 * Provides authentication state and functions to the application
 * Can be used to handle initialization, state sync, and auth-related side effects
 */
export default function AuthProvider({ children }) {
  const { token, user } = useAuthStore();

  // You can add any global auth-related effects here
  useEffect(() => {
    // Example: Log authentication status on mount or state change
    if (token && user) {
      console.log('User is authenticated');
    } else {
      console.log('User is not authenticated');
    }
  }, [token, user]);

  return children;
}
