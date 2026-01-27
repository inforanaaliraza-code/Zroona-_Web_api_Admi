import { IBM_Plex_Sans_Arabic, Poppins, Tajawal } from 'next/font/google';

export const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  variable: '--font-ibm-arabic',
  preload: true,
  display: 'swap',
  adjustFontFallback: false, // Disable font fallback adjustment
});

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Regular, Medium, SemiBold, Bold
  variable: '--font-poppins',
  preload: true,
  display: 'swap',
});

export const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '700'], // Regular, Bold (as per slides, for logos)
  variable: '--font-tajawal',
  preload: true,
  display: 'swap',
});
