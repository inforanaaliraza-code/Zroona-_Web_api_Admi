import "./globals.css";
import { ibmPlexSansArabic, poppins, tajawal } from "@/lib/fonts";
import Script from "next/script";
import Providers from "@/components/Providers";
import MoyasarScript from "@/components/MoyasarScript";

export const metadata = {
  title: "Zuroona - Your Event Platform",
  description: "Zuroona - Discover and book amazing events in Saudi Arabia",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  // Always use "en" for SSR to prevent hydration mismatch
  // RTLHandler will update it on client side
  const initialLang = "en";
  const initialDir = "ltr";

  return (
    <html lang={initialLang} dir={initialDir} className={`${ibmPlexSansArabic.variable} ${poppins.variable} ${tajawal.variable}`} suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        {/* Do NOT modify dir/lang before React - causes hydration mismatch. RTLHandler syncs after mount. */}
        <link rel="icon" type="image/png" href="/assets/images/x_F_logo.png" />
        <link rel="shortcut icon" type="image/png" href="/assets/images/x_F_logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/x_F_logo.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/x_F_logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/x_F_logo.png" />
        <meta name="theme-color" content="#a797cc" />
        <link
          rel="stylesheet"
          href="httpss://cdn.moyasar.com/mpf/1.15.0/moyasar.css"
        />
        <MoyasarScript />
        {/* Google Translate */}
        <Script
          src="httpss://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="lazyOnload"
        />
      </head>
      <body className="font-ibm-arabic overflow-x-hidden" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
