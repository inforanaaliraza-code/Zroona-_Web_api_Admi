"use client";

// Import polyfills FIRST so they run before any component or dependency
import "@/lib/imageConstructorPolyfill"; // Fix "Failed to construct 'Image': Please use the 'new' operator"
import "@/lib/reactDomPolyfill"; // Fix React 19 findDOMNode issue with react-quill

import { Suspense } from "react";
import dynamic from "next/dynamic";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/redux/store";
import { setLanguage } from "@/redux/slices/language";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import { useEffect, useState } from "react";

// Dynamically import ToastContainer to reduce initial bundle
const ToastContainer = dynamic(
  () => import("react-toastify").then(mod => mod.ToastContainer),
  { ssr: false }
);

function ClientProvidersInner({ children }) {
  const dispatch = useDispatch();
  const [currentLang, setCurrentLang] = useState(typeof window !== "undefined" ? (i18n.language || "en") : "en");
  const isRTL = currentLang === "ar";

  useEffect(() => {
    // CRITICAL: Use double RAF - delay until after React hydration to prevent mismatch
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
          try {
            const storedLanguage = localStorage.getItem("i18nextLng") || "en";
            const currentLanguage = storedLanguage === "ar" ? "ar" : "en";
            
            if (i18n.language !== currentLanguage) {
              i18n.changeLanguage(currentLanguage);
            }
            
            // Sync Redux (DefaultLayout, Sidebar use isRTL from here)
            dispatch(setLanguage(currentLanguage));
            
            const isRTL = currentLanguage === "ar";
            document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
            document.documentElement.setAttribute("lang", currentLanguage);
            document.documentElement.setAttribute("data-hydrated", "true");
          } catch (error) {
            console.warn("[ClientProviders] Error during hydration:", error);
          }
        }
      });
    });
  }, [dispatch]);

  useEffect(() => {
    setCurrentLang(i18n.language || "en");
  }, []);

  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setCurrentLang(lng || "en");
      dispatch(setLanguage(lng));
      if (typeof window !== "undefined") {
        const rtl = lng === "ar";
        document.documentElement.setAttribute("dir", rtl ? "rtl" : "ltr");
        document.documentElement.setAttribute("lang", lng);
      }
    };

    i18n.on("languageChanged", handleLanguageChange);
    return () => i18n.off("languageChanged", handleLanguageChange);
  }, [dispatch]);

  return (
    <I18nextProvider i18n={i18n}>
        <ToastContainer 
          autoClose={3000} 
          position={isRTL ? "top-left" : "top-right"}
          rtl={isRTL}
          style={{ direction: isRTL ? "rtl" : "ltr" }}
          toastStyle={{ direction: isRTL ? "rtl" : "ltr", textAlign: isRTL ? "right" : "left" }}
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
  );
}

export default function ClientProviders({ children }) {
  return (
    <Provider store={store}>
      <ClientProvidersInner>{children}</ClientProvidersInner>
    </Provider>
  );
}
