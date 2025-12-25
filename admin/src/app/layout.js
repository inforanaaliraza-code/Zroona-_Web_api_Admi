"use client";

import { Inter } from "next/font/google";
// import "./globals.css";
import "../../public/css/admin.css"
import { Suspense, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { I18nextProvider } from "react-i18next";
import i18n from "../lib/i18n";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
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
        <link rel="icon" href="/assets/images/x_F_logo.png" type="image/png" />
        <link rel="shortcut icon" href="/assets/images/x_F_logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/assets/images/x_F_logo.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/x_F_logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/x_F_logo.png" />
        <title>Zuroona Admin</title>
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
}
