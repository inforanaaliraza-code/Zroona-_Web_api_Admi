import "./globals.css";
import { ibmPlexSansArabic, poppins, tajawal } from "@/lib/fonts";
import Script from "next/script";
import Providers from "@/components/Providers";
import MoyasarScript from "@/components/MoyasarScript";

export const metadata = {
  title: "Zuroona - Your Event Platform",
  description: "Zuroona - Discover and book amazing events in Saudi Arabia",
};

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
        <link rel="icon" type="image/png" href="/assets/images/x_F_logo.png" />
        <link rel="shortcut icon" type="image/png" href="/assets/images/x_F_logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/x_F_logo.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/x_F_logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/x_F_logo.png" />
        <meta name="theme-color" content="#a797cc" />
        <link
          rel="stylesheet"
          href="https://cdn.moyasar.com/mpf/1.15.0/moyasar.css"
        />
        <MoyasarScript />
        {/* Google Translate */}
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="lazyOnload"
        />
      </head>
      <body className="font-ibm-arabic" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
