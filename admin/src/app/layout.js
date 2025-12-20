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
  const [mounted, setMounted] = useState(false);
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    setMounted(true);
    
    // Set dir attribute based on language
    if (typeof window !== "undefined") {
      document.documentElement.dir = isRTL ? "rtl" : "ltr";
      document.documentElement.lang = isRTL ? "ar" : "en";
    }
  }, [isRTL]);

  if (!mounted) {
    return (
      <html lang="en">
        <body>
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f47c0c]"></div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang={isRTL ? "ar" : "en"} dir={isRTL ? "rtl" : "ltr"}>
      <head>
        <link rel="icon" href="/assets/images/final_Zuroona.png" />
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
}
