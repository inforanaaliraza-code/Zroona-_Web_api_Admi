"use client";

import { Inter } from "next/font/google";
// import "./globals.css";
import "../../public/css/admin.css"
import { Suspense, useEffect, useState, memo } from "react";
import dynamic from "next/dynamic";
import "react-toastify/dist/ReactToastify.css";

// Dynamically import ToastContainer to reduce initial bundle
const ToastContainer = dynamic(
  () => import("react-toastify").then(mod => mod.ToastContainer),
  { ssr: false }
);
import { I18nextProvider } from "react-i18next";
import i18n from "../lib/i18n";

const inter = Inter({ subsets: ["latin"] });

const RootLayout = memo(function RootLayout({ children }) {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
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
    <html lang={language} dir={isRTL ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        <title>Zuroona Admin</title>
        <link rel="icon" href="/assets/images/final_Zuroona.png" type="image/png" />
        <link rel="shortcut icon" href="/assets/images/final_Zuroona.png" type="image/png" />
        <link rel="apple-touch-icon" href="/assets/images/final_Zuroona.png" />
      </head>
      <body>
        <I18nextProvider i18n={i18n}>
          <ToastContainer autoClose={3000} position="top-right" />
          <Suspense>
            <div className="w-full">{children}</div>
          </Suspense>
        </I18nextProvider>
      </body>
    </html>
  );
});

RootLayout.displayName = 'RootLayout';

export default RootLayout;
