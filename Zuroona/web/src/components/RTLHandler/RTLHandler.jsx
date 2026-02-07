"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { initRTL } from "@/utils/rtl";

/**
 * RTLHandler - Client component that updates document direction based on language
 * This component doesn't render any HTML elements, only updates the document
 * Ensures language and direction persist across page reloads
 */
export default function RTLHandler() {
  const { i18n } = useTranslation();
  const isInitialized = useRef(false);
  const isUpdating = useRef(false); // Prevent recursion

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") {
      return;
    }

    // Prevent multiple initializations
    if (isInitialized.current) {
      return;
    }

    // Initialize RTL on mount - run immediately before React hydration
    initRTL();
    
    const updateRTL = () => {
      // Prevent recursion
      if (isUpdating.current) {
        return;
      }
      
      // Ensure we're in the browser
      if (typeof window === "undefined" || typeof localStorage === "undefined") {
        return;
      }

      isUpdating.current = true;

      // Get language from i18n first, then fallback to localStorage, then default
      const lang = i18n.language || 
                   (typeof localStorage !== "undefined" ? localStorage.getItem("i18nextLng") : null) || 
                   "en";
      
      // Ensure language is valid
      const validLang = (lang === "ar" || lang === "en") ? lang : "en";
      const rtl = validLang === "ar";
      
      // Update document direction and language immediately
      if (typeof document !== "undefined" && document.documentElement) {
        try {
          // Update HTML attributes
          document.documentElement.setAttribute("dir", rtl ? "rtl" : "ltr");
          document.documentElement.setAttribute("lang", validLang);
          
          // Update body class for RTL/LTR styling
          if (document.body && document.body.parentNode) {
            document.body.classList.remove("rtl", "ltr");
            document.body.classList.add(rtl ? "rtl" : "ltr");
          }
          
          // Ensure language is saved to localStorage
          if (typeof localStorage !== "undefined") {
            localStorage.setItem("i18nextLng", validLang);
          }
          
          // Sync i18n language if it's different (but don't trigger if already same)
          // This prevents recursion - only change if actually different
          if (i18n.language !== validLang) {
            i18n.changeLanguage(validLang);
          }
          
          console.log(`[RTLHandler] Updated direction: ${rtl ? "rtl" : "ltr"}, language: ${validLang}`);
        } catch (error) {
          // Silently handle DOM manipulation errors (e.g., during unmount)
          console.warn("RTLHandler: Error updating DOM", error);
        }
      }
      
      // Reset flag after a short delay
      setTimeout(() => {
        isUpdating.current = false;
      }, 50);
    };

    // Initial update - run immediately
    updateRTL();
    isInitialized.current = true;
    
    // Listen for language changes from i18n (GLOBAL listener)
    const handleLanguageChange = (lng) => {
      console.log(`[RTLHandler] Language changed event (global): ${lng}`);
      updateRTL();
      
      // Also trigger a storage event so other tabs/components can sync
      if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
        try {
          localStorage.setItem("i18nextLng", lng);
          // Trigger custom storage event for same-tab sync
          window.dispatchEvent(new StorageEvent("storage", {
            key: "i18nextLng",
            newValue: lng,
            storageArea: localStorage
          }));
        } catch (error) {
          console.warn("[RTLHandler] Failed to sync language:", error);
        }
      }
    };
    
    i18n.on("languageChanged", handleLanguageChange);

    // Also listen for storage events (if language changes in another tab)
    const handleStorageChange = (e) => {
      if (e.key === "i18nextLng" && e.newValue) {
        const newLang = e.newValue;
        if (newLang === "ar" || newLang === "en" && i18n.language !== newLang) {
          console.log(`[RTLHandler] Language changed in another tab: ${newLang}`);
          // Only change if different to prevent recursion
          if (i18n.language !== newLang) {
            i18n.changeLanguage(newLang);
          }
          updateRTL();
        }
      }
    };
    
    window.addEventListener("storage", handleStorageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [i18n]);

  // This component doesn't render anything
  return null;
}

