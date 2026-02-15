"use client";

import { useDataStore } from "@/app/api/store/store";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { getProfile } from "@/redux/slices/profileInfo";
import { TOKEN_NAME } from "@/until";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@iconify/react";

export default function PrivacyPolicy() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const token = Cookies.get(TOKEN_NAME);
  const { profile } = useSelector((state) => state.profileData);

  const breadcrumbItems = [
    ...(profile?.user?.role === 1
      ? [{ label: t("breadcrumb.tab1"), href: "/" }] // Add home link for role 1
      : [{ label: t("breadcrumb.tab1"), href: "/joinUsEvent" }]), // Different breadcrumb for other roles
    { label: t("breadcrumb.tab11"), href: "/privacyPolicy" },
  ];
  // Fetch user profile if token exists
  useEffect(() => {
    if (token) {
      dispatch(getProfile());
    }
  }, [token, dispatch]);

  const CMSDetail = useDataStore((store) => store.CMSDetail);
  const { fetchCMSDetail } = useDataStore();

  useEffect(() => {
    fetchCMSDetail({ type: 2 }); // Type 2 = Privacy Policy (matches Admin Portal)
  }, [i18n.language, fetchCMSDetail]);


  return (
    <>
      <Header />
      <Breadcrumbs items={breadcrumbItems} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-brand-gray-purple-2 to-primary text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='https://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="relative mx-auto px-4 md:px-8 xl:px-28 max-w-7xl">
          <div className="text-center max-w-4xl mx-auto">
            {/* Privacy Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-28 h-28 bg-white rounded-3xl flex items-center justify-center border-4 border-white/30 shadow-2xl animate-pulse">
                <Icon icon="mdi:shield-lock" className="w-16 h-16 text-primary" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {t('breadcrumb.tab11') || "Privacy Policy"}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              {t("privacy.tagline") || "Your privacy matters to us"}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 ">
        <div className="container mx-auto px-4 md:px-8 lg:px-28">
          {/* Feature Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Data Protection Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-gray-purple-2 to-primary rounded-xl flex items-center justify-center mb-4">
                <Icon icon="lucide:lock" className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Data Protection</h3>
              <p className="text-gray-600 text-sm">Your data is encrypted and secure</p>
            </div>

            {/* Privacy Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-gray-purple-2 to-primary rounded-xl flex items-center justify-center mb-4">
                <Icon icon="lucide:eye-off" className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Privacy</h3>
              <p className="text-gray-600 text-sm">We respect your privacy</p>
            </div>

            {/* User Control Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-gray-purple-2 to-primary rounded-xl flex items-center justify-center mb-4">
                <Icon icon="lucide:user-cog" className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">User Control</h3>
              <p className="text-gray-600 text-sm">You control your data</p>
            </div>
          </div>

          {/* Questions Section */}
          <div className="bg-gradient-to-br from-brand-gray-purple-2/10 to-primary/10 rounded-2xl p-8 mb-12 border border-brand-gray-purple-2/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-gray-purple-2 to-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Icon icon="lucide:help-circle" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Questions?</h3>
                <p className="text-gray-700">
                  If you have any questions about our Privacy Policy, please contact us:
                </p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-8">
            <div>
              {CMSDetail?.description ? (
                <div
                  className="text-gray-700 text-justify [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-6 [&_h1]:text-gray-900 [&_h1]:border-b-2 [&_h1]:border-[#a797cc] [&_h1]:pb-3
                    [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-4 [&_h2]:text-gray-900
                    [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-3 [&_h3]:text-gray-800
                    [&_p]:mb-4 [&_p]:text-gray-700 [&_p]:leading-relaxed
                    [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:space-y-2 [&_ul]:mb-4
                    [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:space-y-2 [&_ol]:mb-4
                    [&_li]:mb-2 [&_li]:text-gray-700
                    [&_strong]:font-bold [&_strong]:text-gray-900"
                  dangerouslySetInnerHTML={{ __html: i18n.language === 'ar' ? CMSDetail?.description_ar : CMSDetail?.description }}
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
