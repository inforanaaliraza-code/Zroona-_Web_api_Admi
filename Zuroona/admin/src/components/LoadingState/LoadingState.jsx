"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Loader from "../Loader/Loader";

/**
 * Enhanced Loading State Component for Admin Panel
 */
export default function LoadingState({ 
  message = null, 
  fullScreen = false,
  size = "default",
  className = "" 
}) {
  const { t } = useTranslation();
  
  const loadingMessage = message || t("common.loading") || "Loading...";
  
  const containerClasses = fullScreen 
    ? "fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50"
    : "flex items-center justify-center p-4";
  
  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center justify-center space-y-4">
        <Loader />
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

