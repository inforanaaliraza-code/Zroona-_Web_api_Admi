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
    // CRITICAL: Use double RAF to ensure React hydration is complete
    // This prevents hydration mismatches by delaying DOM changes until after React finishes
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setMounted(true);
        
        // Get language from localStorage ONLY after hydration
        if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
          try {
            const storedLanguage = localStorage.getItem("i18nextLng") || "en";
            const currentLanguage = storedLanguage === "ar" ? "ar" : "en";
            
            // Only update if different to avoid unnecessary re-renders
            if (language !== currentLanguage) {
              setLanguage(currentLanguage);
              
              // Update i18n language
              if (i18n.language !== currentLanguage) {
                i18n.changeLanguage(currentLanguage);
              }
              
              // Update document attributes
              const isRTL = currentLanguage === "ar";
              document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
              document.documentElement.setAttribute("lang", currentLanguage);
              document.documentElement.setAttribute("data-hydrated", "true");
            }
          } catch (error) {
            console.warn("[ClientProviders] Error during hydration:", error);
          }
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
        document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
        document.documentElement.setAttribute("lang", lng);
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
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Suspense fallback={
          <div className="w-full h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        }>
          <div className="w-full" suppressHydrationWarning>{children}</div>
        </Suspense>
      </I18nextProvider>
    </Provider>
  );
}
