"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Suspense } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../lib/i18n";
import { ibmPlexSansArabic, poppins, tajawal } from "@/lib/fonts";
import Script from "next/script";
import RTLHandler from "@/components/RTLHandler/RTLHandler";

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={`${ibmPlexSansArabic.variable} ${poppins.variable} ${tajawal.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/assets/images/main-logo.png" />
        <link rel="apple-touch-icon" href="/assets/images/main-logo.png" />
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
          <Suspense fallback={<div>Loading...</div>}>
            <I18nextProvider i18n={i18n}>
              <RTLHandler />
              <ToastContainer 
                position="top-right" 
                autoClose={3000}
                rtl={true}
              />
              {children}
            </I18nextProvider>
          </Suspense>
        </Provider>
      </body>
    </html>
  );
}
