"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ResetAndChangePassword from "@/components/ResetAndChangePassword/ResetAndChangePassword";
import Image from "next/image";
import { FaLock, FaShieldAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Setting() {
  const { t } = useTranslation();

  return (
    <DefaultLayout>
      <div className="min-h-screen py-6">
        {/* Animated Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 py-6 px-8 bg-gradient-to-r from-[#a3cc69]/10 via-[#a797cc]/10 to-[#b0a0df]/10 rounded-2xl shadow-lg border border-[#a3cc69]/30 animate-fade-in">
            <div className="w-16 h-16 bg-gradient-to-br from-[#a3cc69] to-[#a797cc] rounded-xl flex items-center justify-center shadow-lg animate-bounce-slow">
              <FaShieldAlt className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black">{t("common.changePassword")}</h1>
              <p className="text-gray-600 mt-1">{t("common.secureAccount")}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full flex items-center justify-center">
          <div className="w-full sm:w-full md:w-10/12 lg:w-7/12 xl:w-6/12">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-slide-up">
              {/* Gradient Top Bar */}
              <div className="h-2 bg-gradient-to-r from-[#a3cc69] via-[#a797cc] to-[#b0a0df]"></div>
              
              <div className="px-6 md:px-12 lg:px-16 py-8">
                {/* Icon and Title Section */}
                <div className="flex justify-start items-center gap-x-5 mb-10 pb-6 border-b border-gray-100">
                  <div className="w-[70px] lg:w-[100px] relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#a3cc69]/20 to-[#a797cc]/20 rounded-2xl blur-xl"></div>
                    <div className="relative">
                      <Image
                        src="/assets/images/login/reset-img.png"
                        alt={t("common.changePassword")}
                        width={100}
                        height={100}
                        quality={100}
                        priority
                        className="object-contain drop-shadow-lg animate-pulse-slow"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-black">{t("common.changePassword")}</h3>
                    <p className="font-medium text-gray-600 mt-1">{t("common.pleaseChangePassword")}</p>
                  </div>
                </div>

                {/* Form Component */}
                <ResetAndChangePassword page="change" />
              </div>
            </div>

            {/* Security Tips Card */}
            <div className="mt-6 bg-gradient-to-r from-[#a3cc69]/5 to-[#a797cc]/5 rounded-xl p-6 border border-[#a3cc69]/20 animate-fade-in">
              <div className="flex items-start gap-3">
                <FaLock className="text-[#a3cc69] text-xl mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">{t("common.passwordSecurityTips")}</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• {t("common.passwordTip1")}</li>
                    <li>• {t("common.passwordTip2")}</li>
                    <li>• {t("common.passwordTip3")}</li>
                    <li>• {t("common.passwordTip4")}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </DefaultLayout>
  );
}
