"use client";

import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import Modal from "../common/Modal";
import { useDataStore } from "@/app/api/store/store";
import { useEffect } from "react";
import { useRTL } from "@/utils/rtl";

export default function AboutUsModal({ isOpen, onClose }) {
  const { t, i18n } = useTranslation();
  const { isRTL, textAlign } = useRTL({ i18n });
  const CMSDetail = useDataStore((store) => store.CMSDetail);
  const { fetchCMSDetail } = useDataStore();

  useEffect(() => {
    if (isOpen) {
      fetchCMSDetail({ type: 3 }); // Type 3 = About Us
    }
  }, [isOpen, i18n.language, fetchCMSDetail]);

  // Get content based on language - ONLY from CMS (Admin Portal is source of truth)
  const content = i18n.language === 'ar' 
    ? CMSDetail?.description_ar 
    : CMSDetail?.description;

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="2xl">
      <div className="flex flex-col min-h-[400px] max-h-[90vh] overflow-y-auto">
        {/* Professional Top Bar */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-brand-gray-purple-2 via-[#8b7bb8] to-primary text-white py-5 px-6 md:px-8 rounded-t-2xl border-b-4 border-white/30 shadow-lg">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 bg-white/25 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/40 transform transition-transform hover:scale-105">
              <Icon icon="lucide:info" className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-1 tracking-tight">
                {t("about.heading") || "About Zuroona"}
              </h1>
              <p className="text-sm md:text-base text-white/95 font-medium">
                {t("eventsMain.connectingPeople") || "Connecting People Through Authentic Saudi Experiences"}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 md:px-6 py-6 space-y-6">
          {/* Content Section - ONLY from CMS */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200/80">
            <div className="prose prose-lg max-w-none">
              {content ? (
                <div
                  className={`text-gray-700 leading-relaxed ${textAlign}
                    [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-6 [&_h1]:text-gray-900 [&_h1]:border-b-2 [&_h1]:border-[#a797cc] [&_h1]:pb-3
                    [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-5 [&_h2]:text-gray-900
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
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>{t("common.loading") || "Loading content..."}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
