"use client";

import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import Modal from "../common/Modal";
import { useDataStore } from "@/app/api/store/store";
import { useEffect, useMemo } from "react";
import { useRTL } from "@/utils/rtl";

export default function PrivacyPolicyModal({ isOpen, onClose }) {
  const { t, i18n } = useTranslation();
  const { isRTL, textAlign } = useRTL();
  const CMSDetail = useDataStore((store) => store.CMSDetail);
  const { fetchCMSDetail } = useDataStore();

  useEffect(() => {
    if (isOpen) {
      fetchCMSDetail({ type: 1 }); // Type 1 for Privacy Policy
    }
  }, [isOpen, i18n.language, fetchCMSDetail]);

  // Enhanced content processing - Remove all jeena references including Arabic
  const processedContent = useMemo(() => {
    if (!CMSDetail?.description) return "";
    let content = CMSDetail.description;
    // Remove Arabic "jeena" text (ﺎﻨﯿﺟ) and all variations
    content = content.replace(/ﺎﻨﯿﺟ/gi, "Zuroona");
    content = content.replace(/[""]\s*ﺎﻨﯿﺟ\s*[""]/gi, "Zuroona");
    content = content.replace(/[""]\s*jeena\s*[""]/gi, "Zuroona");
    content = content.replace(/[""]\s*Jeenas\s*[""]/gi, "Zuroona");
    content = content.replace(/jeena/gi, "Zuroona");
    content = content.replace(/jeenas/gi, "Zuroona");
    content = content.replace(/Jeena/gi, "Zuroona");
    content = content.replace(/Jeenas/gi, "Zuroona");
    // Remove standalone quotes or "or" patterns
    content = content.replace(/\s*[""]\s*or\s*[""]\s*/gi, " ");
    content = content.replace(/\s*or\s*[""]\s*/gi, " ");
    // Clean up extra spaces
    content = content.replace(/\s+/g, " ").trim();
    return content;
  }, [CMSDetail?.description]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="2xl">
      <div className="flex flex-col min-h-[400px] max-h-[90vh] overflow-y-auto">
        {/* Professional Top Bar */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-[#6d5a9a] via-[#8b7bb8] to-[#a797cc] text-white py-5 px-6 md:px-8 rounded-t-2xl border-b-4 border-white/30 shadow-lg">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 bg-white/25 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/40 transform transition-transform hover:scale-105">
              <Icon icon="lucide:shield-check" className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-1 tracking-tight">
                {t("breadcrumb.tab11") || "Privacy Policy"}
              </h1>
              <p className="text-sm md:text-base text-white/95 font-medium">
                {t("privacy.subtitle") || "Your privacy matters to us"}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 md:px-6 py-6 space-y-6">
          {/* Content Section - Ultra Professional */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200/80">
            <div className="prose prose-lg max-w-none">
              <div
                className={`text-gray-700 leading-relaxed ${textAlign}
                  [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-6 [&_h1]:text-gray-900 [&_h1]:border-b-2 [&_h1]:border-[#a797cc] [&_h1]:pb-3 [&_h1]:flex [&_h1]:items-center [&_h1]:gap-3
                  [&_h1_before]:content-[''] [&_h1_before]:w-1 [&_h1_before]:h-8 [&_h1_before]:bg-gradient-to-b [&_h1_before]:from-[#6d5a9a] [&_h1_before]:to-[#a797cc] [&_h1_before]:rounded-full
                  [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-5 [&_h2]:text-gray-900 [&_h2]:flex [&_h2]:items-center [&_h2]:gap-3
                  [&_h2_before]:content-[''] [&_h2_before]:w-1 [&_h2_before]:h-6 [&_h2_before]:bg-[#a797cc] [&_h2_before]:rounded-full
                  [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-4 [&_h3]:text-gray-800
                  [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mt-5 [&_h4]:mb-3 [&_h4]:text-gray-800
                  [&_p]:mb-5 [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:text-justify [&_p]:text-base
                  [&_ul]:list-none [&_ul]:ml-0 [&_ul]:space-y-3 [&_ul]:mb-5
                  [&_ol]:list-none [&_ol]:ml-0 [&_ol]:space-y-3 [&_ol]:mb-5
                  [&_li]:mb-3 [&_li]:text-gray-700 [&_li]:leading-relaxed [&_li]:p-3 [&_li]:bg-white [&_li]:rounded-lg [&_li]:border-l-4 [&_li]:border-[#a797cc] [&_li]:hover:shadow-md [&_li]:transition-all
                  [&_ul_li]:flex [&_ul_li]:items-start [&_ul_li]:gap-3
                  [&_ol_li]:flex [&_ol_li]:items-start [&_ol_li]:gap-3
                  [&_ul_li]:before:content-[''] [&_ul_li]:before:w-0 [&_ul_li]:before:h-0
                  [&_ol_li]:before:content-[''] [&_ol_li]:before:w-0 [&_ol_li]:before:h-0
                  [&_strong]:font-bold [&_strong]:text-gray-900
                  [&_a]:text-[#a797cc] [&_a]:hover:text-[#8b7bb8] [&_a]:underline [&_a]:font-medium [&_a]:transition-colors
                  [&_blockquote]:border-l-4 [&_blockquote]:border-[#a797cc] [&_blockquote]:pl-5 [&_blockquote]:pr-4 [&_blockquote]:py-3 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:bg-gray-50 [&_blockquote]:rounded-r [&_blockquote]:my-5
                  [&_table]:w-full [&_table]:border-collapse [&_table]:mb-5 [&_table]:shadow-md [&_table]:rounded-lg [&_table]:overflow-hidden
                  [&_th]:bg-gradient-to-r [&_th]:from-[#6d5a9a] [&_th]:to-[#a797cc] [&_th]:text-white [&_th]:p-4 [&_th]:text-left [&_th]:font-semibold
                  [&_td]:border [&_td]:border-gray-300 [&_td]:p-4 [&_td]:text-gray-700 [&_td]:bg-white
                  [&_tr:nth-child(even)_td]:bg-gray-50
                `}
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            </div>
          </div>

          {/* Key Points Section - Enhanced */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: "lucide:lock", title: t("privacy.dataProtection") || "Data Protection", desc: t("privacy.dataProtectionDesc") || "Your data is encrypted and secure" },
              { icon: "lucide:eye-off", title: t("privacy.privacy") || "Privacy", desc: t("privacy.privacyDesc") || "We respect your privacy" },
              { icon: "lucide:user-shield", title: t("privacy.userControl") || "User Control", desc: t("privacy.userControlDesc") || "You control your data" }
            ].map((point, index) => (
              <div key={index} className="bg-gradient-to-br from-[#a797cc]/10 to-[#8b7bb8]/5 rounded-xl p-5 border-2 border-[#a797cc]/20 hover:border-[#a797cc]/40 transition-all duration-300 hover:shadow-lg hover:scale-105">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#6d5a9a] to-[#a797cc] rounded-lg flex items-center justify-center shadow-md">
                    <Icon icon={point.icon} className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{point.title}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{point.desc}</p>
              </div>
            ))}
          </div>

          {/* Contact Section - Enhanced */}
          <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-xl p-6 md:p-7 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#6d5a9a] to-[#a797cc] rounded-xl flex items-center justify-center shadow-md">
                <Icon icon="lucide:help-circle" className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {t("privacy.questions") || "Questions?"}
              </h3>
            </div>
            <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
              {t("privacy.contactUs") || "If you have any questions about our Privacy Policy, please contact us:"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="mailto:infozuroona@gmail.com" 
                className="flex items-center gap-3 text-sm md:text-base text-[#a797cc] hover:text-[#8b7bb8] transition-all duration-300 font-medium hover:underline group"
              >
                <div className="w-10 h-10 bg-[#a797cc]/10 rounded-lg flex items-center justify-center group-hover:bg-[#a797cc]/20 transition-colors">
                  <Icon icon="lucide:mail" className="w-5 h-5 text-[#a797cc]" />
                </div>
                <span>infozuroona@gmail.com</span>
              </a>
              <a 
                href="tel:+966591727589" 
                className="flex items-center gap-3 text-sm md:text-base text-[#a797cc] hover:text-[#8b7bb8] transition-all duration-300 font-medium hover:underline group"
              >
                <div className="w-10 h-10 bg-[#a797cc]/10 rounded-lg flex items-center justify-center group-hover:bg-[#a797cc]/20 transition-colors">
                  <Icon icon="lucide:phone" className="w-5 h-5 text-[#a797cc]" />
                </div>
                <span>+966 59 172 7589</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
