"use client";

import React, { useEffect, useState } from "react";

/**
 * HydrationSafeWrapper - Prevents hydration errors by not rendering content until client-side hydration is complete
 * Use this wrapper for any component that has RTL/LTR, localStorage, or date/time dependent content
 */
export function HydrationSafeWrapper({ children, fallback = null }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Set to true immediately after first render to mark hydration complete
    setIsHydrated(true);
  }, []);

  // If not hydrated, show fallback or empty
  if (!isHydrated) {
    return fallback;
  }

  return <>{children}</>;
}

/**
 * NoHydration - Component that only renders on client, never on server
 * Useful for components that absolutely need client-side rendering
 */
export function NoHydration({ children, fallback = null }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <>{children}</> : fallback;
}
