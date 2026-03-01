"use client";

import { useDataStore } from "@/app/api/store/store";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { getProfile } from "@/redux/slices/profileInfo";
import { TOKEN_NAME } from "@/until";
import Cookies from "js-cookie";
import Image from "next/image";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

export default function TermsCondition() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const token = Cookies.get(TOKEN_NAME);
  const { profile } = useSelector((state) => state.profileData);

  const breadcrumbItems = [
    ...(profile?.user?.role === 1
      ? [{ label: t("breadcrumb.tab1"), href: "/" }] 
      : [{ label: t("breadcrumb.tab1"), href: "/joinUsEvent" }]),
    { label: t('breadcrumb.tab10'), href: "/termsCondition" },
  ];

  useEffect(() => {
    if (token) {
      dispatch(getProfile());
    }
  }, [token, dispatch]);
  
  const CMSDetail = useDataStore((store) => store.CMSDetail);
  const { fetchCMSDetail } = useDataStore();

  useEffect(() => {
    fetchCMSDetail({ type: 1 }); // Type 1 = Terms & Conditions (matches Admin Portal)
  }, [i18n.language, fetchCMSDetail]);

  // Get content based on language - ONLY from CMS (Admin Portal is source of truth)
  const content = i18n.language === 'ar' 
    ? CMSDetail?.description_ar 
    : CMSDetail?.description;

  return (
    <>
      <Header />
      <Breadcrumbs items={breadcrumbItems} />
      <section className="bg-white py-16 ">
        <div className="container mx-auto px-4 md:px-8 lg:px-28">
          <div className="text-center mb-8">
            <div className="flex justify-center">
              <Image
                src="/assets/images/home/privact-img.png"
                width={239}
                height={231}
                alt="Terms & Conditions Icon"
              />
            </div>
            <h1 className="text-3xl font-bold mt-4 text-gray-900">{t('breadcrumb.tab10')}</h1>
          </div>
          {/* Content Section */}
          <div className="space-y-8">
            {/* Section 1 */}
            <div>
              {content ? (
                <div
                  className={`text-gray-700 text-justify break-words overflow-x-auto [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-6 [&_h1]:text-gray-900 [&_h1]:border-b-2 [&_h1]:border-[#a797cc] [&_h1]:pb-3
                    [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-4 [&_h2]:text-gray-900
                    [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-3 [&_h3]:text-gray-800
                    [&_p]:mb-4 [&_p]:text-gray-700 [&_p]:leading-relaxed
                    [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:space-y-2 [&_ul]:mb-4
                    [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:space-y-2 [&_ol]:mb-4
                    [&_li]:mb-2 [&_li]:text-gray-700
                    [&_strong]:font-bold [&_strong]:text-gray-900`}
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
      </section>
      <Footer />
    </>
  );
}
