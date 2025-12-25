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
