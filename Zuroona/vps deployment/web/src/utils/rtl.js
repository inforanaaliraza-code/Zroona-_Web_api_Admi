/**
 * RTL Utility Functions
 * Provides helper functions for RTL (Right-to-Left) support
 */

import { useMemo } from "react";
import { useEffect, useState } from "react";
import i18n from "@/lib/i18n";

// Helper function to get language from localStorage (safe for SSR)
// Defined outside the hook to ensure it's stable and doesn't cause hook order issues
const getLanguageFromStorage = () => {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return "en";
  }
  try {
    const stored = localStorage.getItem("i18nextLng");
    if (stored === "ar" || stored === "en") {
      return stored;
    }
  } catch (e) {
    // Ignore localStorage errors
  }
  return "en";
};

/**
 * Hook to get RTL state and utilities
 * @param {Object} options - Optional configuration
 * @param {Object} options.i18n - Optional i18n instance to use (recommended to pass if component already has useTranslation)
 * @returns {Object} RTL utilities
 */
export const useRTL = (options = {}) => {
  // Use provided i18n instance OR use global i18n instance
  // This ensures the hook always has access to language changes globally
  const i18nInstance = options.i18n || i18n;
  
  // Initialize with a constant value to ensure hook order is always the same
  // We'll update it immediately in useEffect to get the actual language
  // This prevents any hook order issues from conditional initialization
  const [currentLanguage, setCurrentLanguage] = useState("en");

  // Update language when i18n changes or when language changes in localStorage (GLOBAL)
  useEffect(() => {
    const updateLanguage = () => {
      // Priority: i18n.language > localStorage > current state
      const lang = i18nInstance?.language || getLanguageFromStorage();
      setCurrentLanguage((prevLang) => {
        // Only update if language actually changed
        return lang !== prevLang ? lang : prevLang;
      });
    };

    // Update immediately on mount - this runs after initial render
    // Priority: i18n.language > localStorage > default "en"
    const initialLang = i18nInstance?.language || getLanguageFromStorage();
    setCurrentLanguage(initialLang);

    // Listen for language changes globally (always listen to global i18n)
    const handleLanguageChange = (lang) => {
      setCurrentLanguage((prevLang) => {
        return lang !== prevLang ? lang : prevLang;
      });
    };

    // Listen to both provided i18n (if any) and global i18n
    if (i18nInstance?.on && typeof i18nInstance.on === "function") {
      i18nInstance.on("languageChanged", handleLanguageChange);
    }
    
    // Always listen to global i18n for global language changes
    if (i18n.on && typeof i18n.on === "function") {
      i18n.on("languageChanged", handleLanguageChange);
    }

    // Also listen for storage events (language changes in other tabs or components)
    const handleStorageChange = (e) => {
      if (e.key === "i18nextLng") {
        updateLanguage();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);
    }

    return () => {
      if (i18nInstance?.off && typeof i18nInstance.off === "function") {
        i18nInstance.off("languageChanged", handleLanguageChange);
      }
      if (i18n.off && typeof i18n.off === "function") {
        i18n.off("languageChanged", handleLanguageChange);
      }
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorageChange);
      }
    };
  }, [i18nInstance]);
  
  // Memoize the result to prevent unnecessary recalculations
  const rtlUtils = useMemo(() => {
    const isRTL = currentLanguage === "ar";

    return {
      isRTL,
      direction: isRTL ? "rtl" : "ltr",
      textAlign: isRTL ? "text-right" : "text-left",
      flexDirection: isRTL ? "flex-row-reverse" : "flex-row",
      marginStart: (size) => isRTL ? `mr-${size}` : `ml-${size}`,
      marginEnd: (size) => isRTL ? `ml-${size}` : `mr-${size}`,
      paddingStart: (size) => isRTL ? `pr-${size}` : `pl-${size}`,
      paddingEnd: (size) => isRTL ? `pl-${size}` : `pr-${size}`,
      borderStart: isRTL ? "border-r" : "border-l",
      borderEnd: isRTL ? "border-l" : "border-r",
      left: isRTL ? "right" : "left",
      right: isRTL ? "left" : "right",
      start: isRTL ? "end" : "start",
      end: isRTL ? "start" : "end",
      // Icon rotation for RTL
      chevronIcon: isRTL ? "lucide:chevron-right" : "lucide:chevron-left",
      chevronRightIcon: isRTL ? "lucide:chevron-left" : "lucide:chevron-right",
      arrowIcon: isRTL ? "lucide:arrow-right" : "lucide:arrow-left",
      arrowRightIcon: isRTL ? "lucide:arrow-left" : "lucide:arrow-right",
    };
  }, [currentLanguage]);

  return rtlUtils;
};

/**
 * Get RTL class names for common patterns
 * @param {boolean} isRTL - Whether the current language is RTL
 * @returns {Object} Class name utilities
 */
export const getRTLClasses = (isRTL) => {
  return {
    // Text alignment
    textAlign: isRTL ? "text-right" : "text-left",
    textAlignCenter: "text-center",
    
    // Flex direction
    flexRow: isRTL ? "flex-row-reverse" : "flex-row",
    flexCol: "flex-col",
    
    // Margins
    marginStart: (size) => isRTL ? `mr-${size}` : `ml-${size}`,
    marginEnd: (size) => isRTL ? `ml-${size}` : `mr-${size}`,
    
    // Padding
    paddingStart: (size) => isRTL ? `pr-${size}` : `pl-${size}`,
    paddingEnd: (size) => isRTL ? `pl-${size}` : `pr-${size}`,
    
    // Borders
    borderStart: isRTL ? "border-r" : "border-l",
    borderEnd: isRTL ? "border-l" : "border-r",
    
    // Positioning
    left: isRTL ? "right" : "left",
    right: isRTL ? "left" : "right",
    
    // Float
    float: isRTL ? "float-right" : "float-left",
    floatRight: isRTL ? "float-left" : "float-right",
  };
};

/**
 * Get RTL-aware spacing classes
 * @param {boolean} isRTL - Whether the current language is RTL
 * @param {string} size - Size (e.g., "2", "4", "6")
 * @returns {Object} Spacing utilities
 */
export const getRTLSpacing = (isRTL, size = "2") => {
  return {
    marginStart: isRTL ? `mr-${size}` : `ml-${size}`,
    marginEnd: isRTL ? `ml-${size}` : `mr-${size}`,
    paddingStart: isRTL ? `pr-${size}` : `pl-${size}`,
    paddingEnd: isRTL ? `pl-${size}` : `pr-${size}`,
  };
};

/**
 * Get RTL-aware icon name
 * @param {boolean} isRTL - Whether the current language is RTL
 * @param {string} leftIcon - Icon name for LTR
 * @param {string} rightIcon - Icon name for RTL (optional, defaults to leftIcon)
 * @returns {string} Icon name
 */
export const getRTLIcon = (isRTL, leftIcon, rightIcon = null) => {
  if (isRTL) {
    return rightIcon || leftIcon;
  }
  return leftIcon;
};

/**
 * Initialize RTL on page load
 * This runs immediately on client-side to prevent flash of wrong direction
 */
export const initRTL = () => {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    try {
      // Get language from localStorage - default "en" for consistency with SSR
      let lang = "en";
      
      if (typeof localStorage !== "undefined") {
        const stored = localStorage.getItem("i18nextLng");
        if (stored && (stored === "ar" || stored === "en")) {
          lang = stored;
        } else {
          localStorage.setItem("i18nextLng", "en");
          lang = "en";
        }
      }
      
      const isRTL = lang === "ar";
      
      // Update HTML attributes immediately (before React hydration)
      if (document.documentElement) {
        document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
        document.documentElement.setAttribute("lang", lang);
        
        // Update body class
        if (document.body) {
          document.body.classList.remove("rtl", "ltr");
          document.body.classList.add(isRTL ? "rtl" : "ltr");
        }
      }
      
    } catch (error) {
      console.warn("[initRTL] Error initializing RTL:", error);
      if (document.documentElement) {
        document.documentElement.setAttribute("dir", "ltr");
        document.documentElement.setAttribute("lang", "en");
      }
    }
  }
};

