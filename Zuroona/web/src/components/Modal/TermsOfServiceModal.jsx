"use client";

import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import Modal from "../common/Modal";
import { useDataStore } from "@/app/api/store/store";
import { useEffect } from "react";
import { useRTL } from "@/utils/rtl";

export default function TermsOfServiceModal({ isOpen, onClose }) {
  const { t, i18n } = useTranslation();
  const { isRTL, textAlign } = useRTL({ i18n });
  const CMSDetail = useDataStore((store) => store.CMSDetail);
  const { fetchCMSDetail } = useDataStore();

  useEffect(() => {
    if (isOpen) {
      fetchCMSDetail({ type: 1 }); // Type 1 = Terms & Conditions (matches Admin Portal)
    }
  }, [isOpen, i18n.language, fetchCMSDetail]);

  // Get content based on language - ONLY from CMS (Admin Portal is source of truth)
  const processedContent = i18n.language === 'ar' 
    ? CMSDetail?.description_ar 
    : CMSDetail?.description;

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="2xl">
      <div className="flex flex-col min-h-[400px] max-h-[90vh] overflow-y-auto">
        {/* Professional Top Bar */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-[#a797cc] via-[#8b7bb8] to-[#6d5a9a] text-white py-5 px-6 md:px-8 rounded-t-2xl border-b-4 border-white/30 shadow-lg">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 bg-white/25 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/40 transform transition-transform hover:scale-105">
              <Icon icon="lucide:file-text" className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-1 tracking-tight">
                {t("breadcrumb.tab10") || "Terms of Service"}
              </h1>
              <p className="text-sm md:text-base text-white/95 font-medium">
                {t("terms.subtitle") || "Please read these terms carefully"}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 md:px-6 py-6 space-y-6">
          {/* Content Section - Ultra Professional */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200/80">
            <div className="prose prose-lg max-w-none">
              {processedContent ? (
                <div
                  className={`text-gray-700 leading-relaxed ${textAlign} 
                    [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-6 [&_h1]:text-gray-900 [&_h1]:border-b-2 [&_h1]:border-[#a797cc] [&_h1]:pb-3 [&_h1]:flex [&_h1]:items-center [&_h1]:gap-3
                    [&_h1_before]:content-[''] [&_h1_before]:w-1 [&_h1_before]:h-8 [&_h1_before]:bg-gradient-to-b [&_h1_before]:from-[#a797cc] [&_h1_before]:to-[#8b7bb8] [&_h1_before]:rounded-full
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
                    [&_th]:bg-gradient-to-r [&_th]:from-[#a797cc] [&_th]:to-[#8b7bb8] [&_th]:text-white [&_th]:p-4 [&_th]:text-left [&_th]:font-semibold
                    [&_td]:border [&_td]:border-gray-300 [&_td]:p-4 [&_td]:text-gray-700 [&_td]:bg-white
                    [&_tr:nth-child(even)_td]:bg-gray-50
                  `}
                  dangerouslySetInnerHTML={{ __html: processedContent }}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>{t("common.loading") || "Loading content..."}</p>
                </div>
              )}
            </div>
          </div>

          {/* User Information Requirements - Attractive Cards */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 md:p-7 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#a797cc] to-[#8b7bb8] rounded-xl flex items-center justify-center shadow-md">
                <Icon icon="lucide:user-circle" className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {t("userInfo.title") || "User Information"}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { icon: "lucide:user", text: t("userInfo.fullName") || "Full name" },
                { icon: "lucide:at-sign", text: t("userInfo.username") || "Username" },
                { icon: "lucide:phone", text: t("userInfo.mobileNumber") || "Mobile number" },
                { icon: "lucide:mail", text: t("userInfo.emailAddress") || "Email address" },
                { icon: "lucide:map-pin", text: t("userInfo.countryOfResidence") || "Country of residence" },
                { icon: "lucide:map", text: t("userInfo.locationDetails") || "Location details" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-[#a797cc]/50 hover:shadow-md transition-all duration-300 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#a797cc]/20 to-[#8b7bb8]/20 rounded-lg flex items-center justify-center group-hover:from-[#a797cc] group-hover:to-[#8b7bb8] transition-all duration-300">
                    <Icon icon={item.icon} className="w-5 h-5 text-[#a797cc] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Important Rules Section - Attractive Cards */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 md:p-7 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#a797cc] to-[#8b7bb8] rounded-xl flex items-center justify-center shadow-md">
                <Icon icon="lucide:alert-circle" className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {t("termsRules.title") || "Important Rules & Guidelines"}
              </h3>
            </div>
            <div className="space-y-4">
              {[
                { icon: "lucide:copyright", text: t("termsRules.noUnauthorizedContent") || "Do not use any Content without the owner's permission or unless authorized by these Terms or another agreement." },
                { icon: "lucide:heart-pulse", text: t("termsRules.followHealthGuidelines") || "Follow the guidelines from the Saudi Ministry of Health to ensure your and others' safety during the experience, particularly in relation to COVID-19." },
                { icon: "lucide:scale", text: t("termsRules.complyWithLaws") || "Comply with all applicable legal obligations." },
                { icon: "lucide:shield-check", text: t("termsRules.understandPrivacyLaws") || "Ensure you understand and comply with the relevant laws, including those related to privacy, data protection, and export regulations." },
                { icon: "lucide:file-check", text: t("termsRules.reviewTerms") || "Make sure to review and adhere to our Terms, Policies, and guidelines." }
              ].map((rule, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-xl border-l-4 border-[#a797cc] hover:border-[#8b7bb8] hover:shadow-lg transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#a797cc]/10 to-[#8b7bb8]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-[#a797cc] group-hover:to-[#8b7bb8] transition-all duration-300">
                    <Icon icon={rule.icon} className="w-6 h-6 text-[#a797cc] group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-gray-700 leading-relaxed pt-2 group-hover:text-gray-900 transition-colors">{rule.text}</p>
                </div>
              ))}
              {/* Special Card for Personal Info */}
              <div className="p-4 bg-gradient-to-br from-[#a797cc]/5 to-[#8b7bb8]/5 rounded-xl border-2 border-[#a797cc]/20 hover:border-[#a797cc]/40 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#a797cc] to-[#8b7bb8] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon icon="lucide:user-check" className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-900 font-semibold pt-2">{t("termsRules.personalInfoTitle") || "If you provide personal information of others to us, you must:"}</p>
                </div>
                <div className="ml-16 space-y-2">
                  {[
                    t("termsRules.personalInfo1") || "Do so in accordance with applicable laws,",
                    t("termsRules.personalInfo2") || "Be authorized to provide that information, and",
                    t("termsRules.personalInfo3") || "Permit us to process the information as per our Privacy Policy."
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-[#a797cc] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{idx + 1}</span>
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Key Points Section - Enhanced */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: "lucide:shield-check", title: t("terms.security") || "Security", desc: t("terms.securityDesc") || "Your data is protected" },
              { icon: "lucide:user-check", title: t("terms.userRights") || "User Rights", desc: t("terms.userRightsDesc") || "Know your rights" },
              { icon: "lucide:gavel", title: t("terms.legal") || "Legal", desc: t("terms.legalDesc") || "Legal compliance" }
            ].map((point, index) => (
              <div key={index} className="bg-gradient-to-br from-[#a797cc]/10 to-[#8b7bb8]/5 rounded-xl p-5 border-2 border-[#a797cc]/20 hover:border-[#a797cc]/40 transition-all duration-300 hover:shadow-lg hover:scale-105">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#a797cc] to-[#8b7bb8] rounded-lg flex items-center justify-center shadow-md">
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
              <div className="w-12 h-12 bg-gradient-to-br from-[#a797cc] to-[#8b7bb8] rounded-xl flex items-center justify-center shadow-md">
                <Icon icon="lucide:help-circle" className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {t("terms.questions") || "Questions?"}
              </h3>
            </div>
            <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
              {t("terms.contactUs") || "If you have any questions about these Terms, please contact us:"}
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
