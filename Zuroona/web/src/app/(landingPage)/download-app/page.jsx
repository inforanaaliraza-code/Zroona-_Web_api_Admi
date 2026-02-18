"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRTL } from "@/utils/rtl";

const GOOGLE_PLAY_URL = process.env.NEXT_PUBLIC_GOOGLE_PLAY_APP_URL || "#";
const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_APP_URL || "#";

export default function DownloadAppPage() {
  const { t } = useTranslation();
  const { isRTL, textAlign } = useRTL();

  return (
    <section className="min-h-[70vh] bg-gradient-to-b from-white via-gray-50 to-white py-12 md:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className={`text-center ${isRTL ? "rtl" : "ltr"}`}>
          <h1 className={`text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl mb-4 ${textAlign}`}>
            {t("downloadApp.title") || "Download the Zuroona App"}
          </h1>
          <p className={`text-lg text-gray-600 max-w-2xl mx-auto mb-10 ${textAlign}`}>
            {t("downloadApp.subtitle") || "Discover and book authentic experiences across Saudi Arabia. Get the app on your phone."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block transition-all duration-300 hover:opacity-90 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:ring-offset-2 rounded-lg"
              aria-label={t("downloadApp.getOnGooglePlay") || "Get it on Google Play"}
            >
              <Image
                src="/assets/images/play_Final_ali.png"
                alt={t("downloadApp.getOnGooglePlay") || "Get it on Google Play"}
                width={220}
                height={66}
                className="h-auto w-[200px] sm:w-[220px]"
              />
            </a>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block transition-all duration-300 hover:opacity-90 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:ring-offset-2 rounded-lg"
              aria-label={t("downloadApp.downloadOnAppStore") || "Download on the App Store"}
            >
              <Image
                src="/assets/images/iphone_final_ali.png"
                alt={t("downloadApp.downloadOnAppStore") || "Download on the App Store"}
                width={220}
                height={66}
                className="h-auto w-[200px] sm:w-[220px]"
              />
            </a>
          </div>

          <p className={`mt-8 text-sm text-gray-500 max-w-md mx-auto ${textAlign}`}>
            {t("downloadApp.availableOn") || "Available on Android and iOS."}
          </p>

          <div className="mt-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
            >
              {t("downloadApp.backToHome") || "Back to Home"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
