"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";

/**
 * Custom hook for authentication functionality
 * Provides easy access to auth state and methods
 */
export const useAuth = () => {
  const router = useRouter();
  const { token, user, isAuthenticated, login, logout, setUser, setToken } =
    useAuthStore();

  /**
   * Log user out and redirect to home page
   */
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  /**
   * Custom hook to check if user is authenticated and redirect if not
   * @param {string} redirectTo - Path to redirect to if not authenticated
   */
  const useRequireAuth = (redirectTo = "/") => {
    useEffect(() => {
      if (!isAuthenticated) {
        router.push(redirectTo);
      }
    }, [redirectTo]);

    return isAuthenticated;
  };

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout: handleLogout,
    setUser,
    setToken,
    useRequireAuth,
  };
};

export default useAuth;
