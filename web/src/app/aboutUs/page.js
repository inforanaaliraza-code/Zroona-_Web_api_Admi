"use client";

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
import Image from "next/image";
import useAuthStore from "@/store/useAuthStore";

export default function AboutUsPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useAuthStore();
  const { profile } = useSelector((state) => state.profileData);
  const token = Cookies.get(TOKEN_NAME);
  const isHost = user?.role === 2 || profile?.user?.role === 2;

  const breadcrumbItems = [
    ...(profile?.user?.role === 1
      ? [{ label: t("breadcrumb.tab1"), href: "/" }] 
      : [{ label: t("breadcrumb.tab1"), href: "/joinUsEvent" }]),
    { label: t("breadcrumb.tab8") || "About Us", href: "/aboutUs" },
  ];

  useEffect(() => {
    if (token) {
      dispatch(getProfile());
    }
  }, [token, dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <Breadcrumbs items={breadcrumbItems} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-brand-gray-purple-2 to-primary text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="relative mx-auto px-4 md:px-8 xl:px-28 max-w-7xl">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
                <Icon icon="lucide:info" className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {t("about.heading") || "About Zuroona"}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              {t("eventsMain.connectingPeople") || "Connecting People Through Authentic Saudi Experiences"}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto px-4 md:px-8 xl:px-28 max-w-7xl">
          {/* Mission Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-gray-purple-2 to-primary rounded-xl flex items-center justify-center shadow-lg">
                <Icon icon="lucide:target" className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {t("about.tab2") || "Our Mission"}
              </h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
              {t("about.content") || "Zuroona is a platform developed and run by ambitious Saudi youth, dedicated to supporting the Kingdom's Vision 2030 for the tourism sector and beyond. We focus on creating authentic experiences that connect guests with hosts, offering more than just commercial tourism, providing a true and personal way to explore Saudi culture.\n\nWhether it's sharing a home-cooked meal, participating in traditional activities, or engaging in meaningful conversations, Zuroona is all about real human connections, bringing people together through culture, hospitality, and shared experiences."}
            </p>
          </div>

          {/* Vision Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-brand-pastel-gray-purple-1/30 to-brand-gray-purple-2/20 rounded-2xl shadow-xl p-8 border border-brand-pastel-gray-purple-1/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-brand-gray-purple-2 to-primary rounded-xl flex items-center justify-center shadow-lg">
                  <Icon icon="lucide:eye" className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {t("about.tab3") || "Our Vision"}
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {t("eventsMain.toBecomeLeading") || "To become the leading platform for authentic cultural experiences in Saudi Arabia, connecting millions of people through meaningful interactions and shared moments."}
              </p>
            </div>

            <div className="bg-gradient-to-br from-brand-light-orange-1 to-brand-light-orange-2 rounded-2xl shadow-xl p-8 border border-brand-pastel-gray-purple-1/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-brand-gray-green-2 rounded-xl flex items-center justify-center shadow-lg">
                  <Icon icon="lucide:heart" className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {t("about.tab4") || "Our Values"}
                </h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-2">
                  <Icon icon="lucide:check-circle" className="w-5 h-5 text-green-600" />
                  <span>{t("eventsMain.authenticityCultural") || "Authenticity & Cultural Preservation"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon="lucide:check-circle" className="w-5 h-5 text-primary" />
                  <span>{t("eventsMain.communityBuilding") || "Community Building"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon="lucide:check-circle" className="w-5 h-5 text-primary" />
                  <span>{t("eventsMain.supportingVision2030") || "Supporting Vision 2030"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon="lucide:check-circle" className="w-5 h-5 text-primary" />
                  <span>{t("eventsMain.empoweringSaudiYouth") || "Empowering Saudi Youth"}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="text-4xl font-bold text-[#a797cc] mb-2">
                {t("about.tab16") || "52M+"}
              </div>
              <div className="text-sm text-gray-600 font-medium">{t("eventsMain.users") || "Users"}</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="text-4xl font-bold text-[#a797cc] mb-2">{t("about.statsEvents") || "10K+"}</div>
              <div className="text-sm text-gray-600 font-medium">{t("eventsMain.events") || "Events"}</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="text-4xl font-bold text-[#a797cc] mb-2">{t("about.statsHosts") || "5K+"}</div>
              <div className="text-sm text-gray-600 font-medium">{t("eventsMain.hosts") || "Hosts"}</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="text-4xl font-bold text-[#a797cc] mb-2">{t("about.statsCities") || "100+"}</div>
              <div className="text-sm text-gray-600 font-medium">{t("eventsMain.cities") || "Cities"}</div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              {t("eventsMain.howZuroonaWorks") || "How Zuroona Works"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-brand-gray-purple-2 to-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Icon icon="lucide:user-plus" className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t("eventsMain.joinAsHost") || "Join as Host"}</h3>
                <p className="text-gray-600">
                  {t("eventsMain.createProfileShare") || "Create your profile and start sharing your passion with the community"}
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-brand-gray-purple-2 to-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Icon icon="lucide:calendar-plus" className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t("eventsMain.createEvents") || "Create Events"}</h3>
                <p className="text-gray-600">
                  {t("eventsMain.organizeUnique") || "Organize unique experiences that showcase Saudi culture and traditions"}
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-brand-gray-purple-2 to-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Icon icon="lucide:users" className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t("eventsMain.connectGrow") || "Connect & Grow"}</h3>
                <p className="text-gray-600">
                  {t("eventsMain.buildMeaningful") || "Build meaningful connections and grow your community through shared experiences"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

