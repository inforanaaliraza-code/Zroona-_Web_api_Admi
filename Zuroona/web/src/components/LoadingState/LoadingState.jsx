"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Loader from "../Loader/Loader";

/**
 * Enhanced Loading State Component
 * Provides consistent loading UI with i18n support
 */
export default function LoadingState({ 
  message = null, 
  fullScreen = false,
  size = "default",
  className = "" 
}) {
  const { t } = useTranslation();
  
  const loadingMessage = message || t("common.loading") || "Loading...";
  
  const sizeClasses = {
    small: "h-6 w-6",
    default: "h-10 w-10",
    large: "h-16 w-16"
  };
  
  const containerClasses = fullScreen 
    ? "fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50"
    : "flex items-center justify-center p-4";
  
  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center justify-center space-y-4">
        <Loader 
          height={size === "small" ? "24" : size === "large" ? "64" : "40"}
          width={size === "small" ? "60" : size === "large" ? "160" : "100"}
        />
        {loadingMessage && (
          <p className="text-sm text-gray-600 animate-pulse">
            {loadingMessage}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Skeleton Loader Component
 * Shows placeholder content while loading
 */
export function SkeletonLoader({ 
  lines = 3, 
  className = "",
  showAvatar = false 
}) {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      {showAvatar && (
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-gray-300 h-12 w-12"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      )}
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="h-4 bg-gray-300 rounded"></div>
          {index === lines - 1 && (
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Button Loading State
 * Shows loading state inside a button
 */
export function ButtonLoader({ size = "default" }) {
  const sizeClasses = {
    small: "h-4 w-4",
    default: "h-5 w-5",
    large: "h-6 w-6"
  };
  
  return (
    <div className={`${sizeClasses[size]} border-2 border-white border-t-transparent rounded-full animate-spin`}></div>
  );
}

