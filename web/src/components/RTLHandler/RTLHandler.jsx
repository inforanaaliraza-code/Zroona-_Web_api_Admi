"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { initRTL } from "@/utils/rtl";

/**
 * RTLHandler - Client component that updates document direction based on language
 * This component doesn't render any HTML elements, only updates the document
 */
export default function RTLHandler() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") {
      return;
    }

    // Initialize RTL on mount
    initRTL();
    
    const updateRTL = () => {
      // Ensure we're in the browser
      if (typeof window === "undefined" || typeof localStorage === "undefined") {
        return;
      }

      const lang = i18n.language || (typeof localStorage !== "undefined" ? localStorage.getItem("i18nextLng") : null) || "ar";
      const rtl = lang === "ar";
      
      // Update document direction and language
      if (typeof document !== "undefined" && document.documentElement) {
        try {
          document.documentElement.dir = rtl ? "rtl" : "ltr";
          document.documentElement.lang = lang;
          
          // Update body class for RTL/LTR styling - safely check if body exists and is in DOM
          if (document.body && document.body.parentNode) {
            // Use classList methods instead of direct className manipulation for better React compatibility
            document.body.classList.remove("rtl", "ltr");
            document.body.classList.add(rtl ? "rtl" : "ltr");
          }
        } catch (error) {
          // Silently handle DOM manipulation errors (e.g., during unmount)
          console.warn("RTLHandler: Error updating DOM", error);
        }
      }
    };

    // Initial update
    updateRTL();
    
    // Listen for language changes
    i18n.on("languageChanged", updateRTL);

    return () => {
      i18n.off("languageChanged", updateRTL);
    };
  }, [i18n]);

  // This component doesn't render anything
  return null;
}

