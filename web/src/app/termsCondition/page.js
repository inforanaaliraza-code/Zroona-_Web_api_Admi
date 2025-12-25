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
    fetchCMSDetail({ type: 2 });
  }, [i18n.language, fetchCMSDetail]);

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
              <p
                className="text-gray-700 text-justify [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:space-y-2 [&_li]:mb-1"
                dangerouslySetInnerHTML={{ __html: CMSDetail?.description }}
              />
            </div>
            
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
