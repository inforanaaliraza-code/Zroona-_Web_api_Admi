/**
 * RTL Utility Functions
 * Provides helper functions for RTL (Right-to-Left) support
 */

import { useTranslation } from "react-i18next";

/**
 * Hook to get RTL state and utilities
 * @returns {Object} RTL utilities
 */
export const useRTL = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

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
 */
export const initRTL = () => {
  if (typeof window !== "undefined") {
    const lang = localStorage.getItem("i18nextLng") || "ar";
    const isRTL = lang === "ar";
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }
};

