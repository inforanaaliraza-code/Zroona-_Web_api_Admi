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
        <div className="container mx-auto px-4 py-6" dir={isRTL ? "rtl" : "ltr"}>
          {/* Header */}
          <div className="relative mb-8">
            <div className={`flex items-center gap-4 py-5 px-6 bg-gradient-to-r ${isRTL ? 'from-[#b0a0df]/10 via-[#a797cc]/10 to-[#a3cc69]/10' : 'from-[#a3cc69]/10 via-[#a797cc]/10 to-[#b0a0df]/10'} rounded-xl shadow-md border border-[#a3cc69]/20`}>
              <div className="w-14 h-14 bg-gradient-to-br from-[#a3cc69] to-[#a797cc] rounded-lg flex items-center justify-center shadow-lg">
                <FaEdit className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {t("cms.title")}
                </h1>
                <p className="text-gray-500 text-sm mt-0.5">{t("cms.subtitle")}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex justify-center">
              <div className={`inline-flex ${isRTL ? 'flex-row-reverse' : ''} gap-3 p-2 bg-white rounded-xl shadow-lg border border-gray-100`}>
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = status === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      className={`
                        group relative px-6 py-3 rounded-lg font-medium text-sm
                        transition-all duration-200
                        ${isActive 
                          ? `bg-gradient-to-r ${tab.color} text-white shadow-md` 
                          : `bg-gray-50 text-gray-600 hover:bg-gray-100 ${tab.hoverColor} hover:shadow-sm`
                        }
                      `}
                      onClick={() => setStatus(tab.id)}
                    >
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Icon className={`text-lg ${isActive ? '' : 'group-hover:scale-110'} transition-transform`} />
                        <span>{tab.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className={`flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {tabs.find(tab => tab.id === status) && (() => {
                const currentTab = tabs.find(tab => tab.id === status);
                const Icon = currentTab.icon;
                return (
                  <>
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${currentTab.color} flex items-center justify-center shadow-sm`}>
                      <Icon className="text-lg text-white" />
                    </div>
                    <div className={isRTL ? 'text-right' : ''}>
                      <h2 className="text-xl font-semibold text-gray-800">{currentTab.label}</h2>
                      <p className="text-xs text-gray-400">{t("cms.editContentBelow")}</p>
                    </div>
                  </>
                );
              })()}
            </div>

            <div>
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
