"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Suspense, useState, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../lib/i18n";
import { ibmPlexSansArabic, poppins, tajawal } from "@/lib/fonts";
import Script from "next/script";
import RTLHandler from "@/components/RTLHandler/RTLHandler";

// Dynamic ToastContainer that respects RTL/LTR
// This component must be inside I18nextProvider to use useTranslation
function DynamicToastContainer() {
  const [isRTL, setIsRTL] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Get language from localStorage or default
    const getIsRTL = () => {
      if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
        try {
          const lang = localStorage.getItem("i18nextLng") || "en";
          return lang === "ar";
        } catch (e) {
          return false; // Default to LTR (English)
        }
      }
      return false; // Default to LTR (English)
    };
    
    setIsRTL(getIsRTL());
  }, []);
  
  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        rtl={false}
      />
    );
  }
  
  return (
    <ToastContainer 
      position={isRTL ? "top-left" : "top-right"}
      autoClose={3000}
      rtl={isRTL}
    />
  );
}

export default function RootLayout({ children }) {
  // Always use "en" for SSR to prevent hydration mismatch
  // RTLHandler will update it on client side
  const initialLang = "en";
  const initialDir = "ltr";
  
  return (
    <html lang={initialLang} dir={initialDir} className={`${ibmPlexSansArabic.variable} ${poppins.variable} ${tajawal.variable}`} suppressHydrationWarning>
      <head>
        {/* Initialize language and direction BEFORE React hydration to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var lang = 'en';
                  if (typeof localStorage !== 'undefined') {
                    var stored = localStorage.getItem('i18nextLng');
                    if (stored === 'ar' || stored === 'en') {
                      lang = stored;
                    } else {
                      localStorage.setItem('i18nextLng', 'en');
                    }
                  }
                  var isRTL = lang === 'ar';
                  if (document.documentElement) {
                    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
                    document.documentElement.setAttribute('lang', lang);
                  }
                } catch (e) {
                  // Fallback to English LTR
                  if (document.documentElement) {
                    document.documentElement.setAttribute('dir', 'ltr');
                    document.documentElement.setAttribute('lang', 'en');
                  }
                }
              })();
            `,
          }}
        />
        <title>Zuroona - Your Event Platform</title>
        <link rel="icon" type="image/png" href="/assets/images/x_F_logo.png" />
        <link rel="shortcut icon" type="image/png" href="/assets/images/x_F_logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/x_F_logo.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/x_F_logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/x_F_logo.png" />
        <meta name="theme-color" content="#a797cc" />
        <meta name="description" content="Zuroona - Discover and book amazing events in Saudi Arabia" />
        <link
          rel="stylesheet"
          href="https://cdn.moyasar.com/mpf/1.15.0/moyasar.css"
        />
        <Script
          src="https://cdn.moyasar.com/mpf/1.15.0/moyasar.js"
          strategy="beforeInteractive"
          onLoad={() => {
            if (typeof window !== 'undefined') {
              window.MoyasarReady = true;
              console.log('[MOYASAR] Script loaded successfully');
              if (window.Moyasar) {
                console.log('[MOYASAR] Moyasar object available');
              } else {
                console.warn('[MOYASAR] Script loaded but Moyasar object not found');
              }
            }
          }}
          onError={() => {
            console.error('[MOYASAR] Failed to load script');
            if (typeof window !== 'undefined') {
              window.MoyasarLoadError = true;
            }
          }}
        />
        {/* Google Translate */}
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="lazyOnload"
        />
      </head>
      <body className="font-ibm-arabic" suppressHydrationWarning>
        <Provider store={store}>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#a797cc] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          }>
            <I18nextProvider i18n={i18n}>
              <RTLHandler />
              <DynamicToastContainer />
              {children}
            </I18nextProvider>
          </Suspense>
        </Provider>
      </body>
    </html>
  );
}
