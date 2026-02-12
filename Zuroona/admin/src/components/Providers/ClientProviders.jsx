"use client";

// Import polyfill FIRST to fix React 19 findDOMNode issue with react-quill
import "@/lib/reactDomPolyfill";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import { useEffect, useState } from "react";

// Dynamically import ToastContainer to reduce initial bundle
const ToastContainer = dynamic(
  () => import("react-toastify").then(mod => mod.ToastContainer),
  { ssr: false }
);

export default function ClientProviders({ children }) {
  const [language, setLanguage] = useState("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Use double RAF to ensure React hydration is complete before changing language
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Set mounted flag
        setMounted(true);
        
        // Get language from localStorage after mount - FAST, NO BLOCKING
        if (typeof window !== "undefined") {
          const storedLanguage = localStorage.getItem("i18nextLng") || "en";
          const currentLanguage = storedLanguage === "ar" ? "ar" : "en";
          
          // Update i18n language
          if (i18n.language !== currentLanguage) {
            i18n.changeLanguage(currentLanguage);
          }
          
          setLanguage(currentLanguage);
          
          // Set dir attribute based on language
          const isRTL = currentLanguage === "ar";
          document.documentElement.dir = isRTL ? "rtl" : "ltr";
          document.documentElement.lang = currentLanguage;
        }
      });
    });
  }, []);

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setLanguage(lng);
      const isRTL = lng === "ar";
      if (typeof window !== "undefined") {
        document.documentElement.dir = isRTL ? "rtl" : "ltr";
        document.documentElement.lang = lng;
      }
    };

    i18n.on("languageChanged", handleLanguageChange);
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, []);

  const isRTL = language === "ar";

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ToastContainer 
          autoClose={3000} 
          position="top-right"
          rtl={false}
          style={{ direction: "ltr" }}
          toastStyle={{ direction: "ltr", textAlign: "left" }}
        />
        <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">Loading...</div>}>
          <div className="w-full" suppressHydrationWarning>{children}</div>
        </Suspense>
      </I18nextProvider>
    </Provider>
  );
}
