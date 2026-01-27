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
      // Ensure we're in the browser
      if (typeof window === "undefined" || typeof localStorage === "undefined") {
        return;
      }

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
          
          // Sync i18n language if it's different
          if (i18n.language !== validLang) {
            i18n.changeLanguage(validLang);
          }
          
          console.log(`[RTLHandler] Updated direction: ${rtl ? "rtl" : "ltr"}, language: ${validLang}`);
        } catch (error) {
          // Silently handle DOM manipulation errors (e.g., during unmount)
          console.warn("RTLHandler: Error updating DOM", error);
        }
      }
    };

    // Initial update - run immediately
    updateRTL();
    isInitialized.current = true;
    
    // Listen for language changes from i18n
    i18n.on("languageChanged", (lng) => {
      console.log(`[RTLHandler] Language changed event: ${lng}`);
      updateRTL();
    });

    // Also listen for storage events (if language changes in another tab)
    const handleStorageChange = (e) => {
      if (e.key === "i18nextLng" && e.newValue) {
        const newLang = e.newValue;
        if (newLang === "ar" || newLang === "en") {
          console.log(`[RTLHandler] Language changed in another tab: ${newLang}`);
          i18n.changeLanguage(newLang);
          updateRTL();
        }
      }
    };
    
    window.addEventListener("storage", handleStorageChange);

    return () => {
      i18n.off("languageChanged", updateRTL);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [i18n]);

  // This component doesn't render anything
  return null;
}

