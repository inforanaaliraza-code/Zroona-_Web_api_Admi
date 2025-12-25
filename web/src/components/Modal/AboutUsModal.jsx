"use client";

import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import Modal from "../common/Modal";

export default function AboutUsModal({ isOpen, onClose }) {
  const { t } = useTranslation();

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
          {/* Mission Section - Enhanced */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200/80 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-start gap-5 mb-5">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-gray-purple-2 to-primary rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 transform transition-transform hover:scale-110">
                <Icon icon="lucide:target" className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  {t("about.tab2") || "Our Mission"}
                </h2>
                <div className="h-1 w-20 bg-gradient-to-r from-brand-gray-purple-2 to-primary rounded-full mb-4"></div>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  {t("about.content") || "Zuroona connects people through authentic Saudi experiences. We support Vision 2030 by creating meaningful cultural connections between hosts and guests."}
                </p>
              </div>
            </div>
          </div>

          {/* Vision & Values Grid - Enhanced */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vision Card */}
            <div className="bg-gradient-to-br from-brand-pastel-gray-purple-1/40 via-brand-gray-purple-2/20 to-transparent rounded-2xl shadow-xl p-6 md:p-7 border-2 border-brand-pastel-gray-purple-1/60 hover:border-brand-gray-purple-2/80 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-gray-purple-2 to-primary rounded-xl flex items-center justify-center shadow-lg">
                  <Icon icon="lucide:eye" className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                  {t("about.tab3") || "Our Vision"}
                </h3>
              </div>
              <div className="h-0.5 w-16 bg-gradient-to-r from-brand-gray-purple-2 to-primary rounded-full mb-4"></div>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                {t("eventsMain.toBecomeLeading") || "To become the leading platform for authentic cultural experiences in Saudi Arabia, connecting millions of people through meaningful interactions and shared moments."}
              </p>
            </div>

            {/* Values Card */}
            <div className="bg-gradient-to-br from-brand-light-orange-1/50 via-brand-light-orange-2/30 to-transparent rounded-2xl shadow-xl p-6 md:p-7 border-2 border-brand-light-orange-1/60 hover:border-brand-light-orange-2/80 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-brand-gray-green-2 rounded-xl flex items-center justify-center shadow-lg">
                  <Icon icon="lucide:heart" className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                  {t("about.tab4") || "Our Values"}
                </h3>
              </div>
              <div className="h-0.5 w-16 bg-gradient-to-r from-primary to-brand-gray-green-2 rounded-full mb-4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: "lucide:sparkles", text: t("eventsMain.authenticityCultural") || "Authenticity & Cultural Preservation", color: "green" },
                  { icon: "lucide:users-round", text: t("eventsMain.communityBuilding") || "Community Building", color: "purple" },
                  { icon: "lucide:target", text: t("eventsMain.supportingVision2030") || "Supporting Vision 2030", color: "purple" },
                  { icon: "lucide:rocket", text: t("eventsMain.empoweringSaudiYouth") || "Empowering Saudi Youth", color: "purple" }
                ].map((value, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-brand-light-orange-1/30 hover:border-primary/50 hover:bg-white hover:shadow-md transition-all duration-300 group">
                    <div className={`w-10 h-10 bg-gradient-to-br ${value.color === "green" ? "from-green-500 to-green-600" : "from-primary to-brand-gray-purple-2"} rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                      <Icon icon={value.icon} className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm md:text-base text-gray-700 font-medium group-hover:text-gray-900 transition-colors">{value.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Section - Enhanced */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: t("about.tab16") || "52M+", label: "Users", icon: "lucide:users" },
              { value: t("about.statsEvents") || "10K+", label: "Events", icon: "lucide:calendar" },
              { value: t("about.statsHosts") || "5K+", label: "Hosts", icon: "lucide:user-check" },
              { value: t("about.statsCities") || "100+", label: "Cities", icon: "lucide:map-pin" }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-5 text-center border-2 border-gray-100 hover:border-[#a797cc]/50 transition-all duration-300 hover:shadow-xl hover:scale-105 group">
                <div className="w-10 h-10 bg-gradient-to-br from-[#a797cc] to-primary rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Icon icon={stat.icon} className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-[#a797cc] mb-1 group-hover:text-[#8b7bb8] transition-colors">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* How It Works - Enhanced */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200/80">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                {t("eventsMain.howZuroonaWorks") || "How Zuroona Works"}
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-brand-gray-purple-2 to-primary rounded-full mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { 
                  icon: "lucide:user-plus", 
                  title: t("eventsMain.joinAsHost") || "Join as Host",
                  desc: t("eventsMain.createProfileShare") || "Create your profile and start sharing your passion with the community"
                },
                { 
                  icon: "lucide:calendar-plus", 
                  title: t("eventsMain.createEvents") || "Create Events",
                  desc: t("eventsMain.organizeUnique") || "Organize unique experiences that showcase Saudi culture and traditions"
                },
                { 
                  icon: "lucide:users", 
                  title: t("eventsMain.connectGrow") || "Connect & Grow",
                  desc: t("eventsMain.buildMeaningful") || "Build meaningful connections and grow your community through shared experiences"
                }
              ].map((step, index) => (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-brand-gray-purple-2 to-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Icon icon={step.icon} className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-[#a797cc] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
