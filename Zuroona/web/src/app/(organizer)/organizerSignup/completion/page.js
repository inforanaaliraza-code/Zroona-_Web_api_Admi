"use client";

import SignupHeader from "@/components/Header/SignupHeader";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CompletionPage() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <SignupHeader bgColor="#fff" />
      <div className="min-h-screen bg-white flex items-center justify-center py-16 px-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("thankYou") || "Thank You!"}
          </h1>

          {/* Message */}
          <p className="text-lg text-gray-600 mb-2">
            {t("thankYouMessage") || "Your registration is complete!"}
          </p>
          <p className="text-base text-gray-500 mb-8">
            {t("thankYouSubMessage") || "Please check your email to verify your account. Your application will be reviewed by our team."}
          </p>

          {/* Action Button */}
          <div className="flex justify-center">
            <Link
              href="/"
              className="px-8 py-3 bg-[#a797cc] text-white rounded-xl font-semibold hover:bg-[#8ba179] transition-colors shadow-md hover:shadow-lg"
            >
              {t("breadcrumb.tab1") || "Home"}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

