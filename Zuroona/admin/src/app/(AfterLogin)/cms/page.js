"use client";

import dynamic from "next/dynamic";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, memo, useEffect } from "react";
import { FaShieldAlt, FaFileContract, FaInfoCircle, FaEdit } from "react-icons/fa";
import { useTranslation } from "react-i18next";

// Dynamically import CMS components to reduce initial bundle
const PrivacyPolicy = dynamic(() => import("@/components/CMS/PrivacyPolicy"), {
  loading: () => <div className="h-64 bg-gray-100 rounded animate-pulse" />
});
const TermsConditions = dynamic(() => import("@/components/CMS/TermsConditions"), {
  loading: () => <div className="h-64 bg-gray-100 rounded animate-pulse" />
});
const AboutUs = dynamic(() => import("@/components/CMS/AboutUs"), {
  loading: () => <div className="h-64 bg-gray-100 rounded animate-pulse" />
});

const ManageCms = memo(function ManageCms() {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState("2");
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isRTL = mounted ? i18n.language === "ar" : false;
  
  const tabs = [
    {
      id: "2",
      label: t("cms.privacyPolicy"),
      icon: FaShieldAlt,
      color: "from-[#a797cc] to-[#b0a0df]",
      hoverColor: "hover:shadow-purple-300"
    },
    {
      id: "1",
      label: t("cms.termsConditions"),
      icon: FaFileContract,
      color: "from-[#a3cc69] to-[#9fb68b]",
      hoverColor: "hover:shadow-green-300"
    },
    {
      id: "3",
      label: t("cms.aboutUs"),
      icon: FaInfoCircle,
      color: "from-[#a797cc] to-[#b0a0df]",
      hoverColor: "hover:shadow-orange-300"
    }
  ];
  
  return (
    <>
      <DefaultLayout>
        <div className="w-full min-w-0 max-w-full overflow-hidden px-3 sm:px-6 lg:px-8 py-4 sm:py-6" dir={isRTL ? "rtl" : "ltr"}>
          {/* Header - responsive */}
          <div className="relative mb-5 sm:mb-8 min-w-0">
            <div className={`flex flex-wrap items-center gap-3 sm:gap-4 py-4 sm:py-5 px-4 sm:px-6 bg-gradient-to-r ${isRTL ? 'from-[#b0a0df]/10 via-[#a797cc]/10 to-[#a3cc69]/10' : 'from-[#a3cc69]/10 via-[#a797cc]/10 to-[#b0a0df]/10'} rounded-xl shadow-md border border-[#a3cc69]/20 min-w-0`}>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#a3cc69] to-[#a797cc] rounded-lg flex items-center justify-center shadow-lg shrink-0">
                <FaEdit className="text-xl sm:text-2xl text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">
                  {t("cms.title")}
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-0.5">{t("cms.subtitle")}</p>
              </div>
            </div>
          </div>

          {/* Tabs - responsive: stack on mobile, row on sm+ */}
          <div className="mb-4 sm:mb-6 min-w-0">
            <div className="w-full max-w-2xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 p-2 bg-white rounded-xl shadow-lg border border-gray-100">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = status === tab.id;
                  return (
                    <button
                      key={tab.id}
                      className={`
                        group relative w-full min-h-[44px] sm:min-h-0 flex items-center justify-center gap-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-xs sm:text-sm
                        transition-all duration-200
                        ${isRTL ? 'flex-row-reverse' : ''}
                        ${isActive 
                          ? `bg-gradient-to-r ${tab.color} text-white shadow-md` 
                          : `bg-gray-50 text-gray-600 hover:bg-gray-100 ${tab.hoverColor} hover:shadow-sm`
                        }
                      `}
                      onClick={() => setStatus(tab.id)}
                    >
                      <Icon className={`text-base sm:text-lg shrink-0 ${isActive ? '' : 'group-hover:scale-110'} transition-transform`} />
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Area - constrained so it doesn't overflow */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 min-w-0 overflow-hidden">
            <div className={`flex flex-wrap items-center gap-3 mb-4 sm:mb-5 pb-4 border-b border-gray-100 min-w-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {tabs.find(tab => tab.id === status) && (() => {
                const currentTab = tabs.find(tab => tab.id === status);
                const Icon = currentTab.icon;
                return (
                  <>
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${currentTab.color} flex items-center justify-center shadow-sm shrink-0`}>
                      <Icon className="text-base sm:text-lg text-white" />
                    </div>
                    <div className={`min-w-0 flex-1 ${isRTL ? 'text-right' : ''}`}>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">{currentTab.label}</h2>
                      <p className="text-xs text-gray-400">{t("cms.editContentBelow")}</p>
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="min-w-0 overflow-hidden">
              {status === "2" && <PrivacyPolicy status={status} />}
              {status === "1" && <TermsConditions status={status} />}
              {status === "3" && <AboutUs status={status} />}
            </div>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
});

ManageCms.displayName = 'ManageCms';

export default ManageCms;
