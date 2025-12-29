"use client";

import dynamic from "next/dynamic";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, memo } from "react";
import { FaShieldAlt, FaFileContract, FaInfoCircle, FaEdit, FaSave } from "react-icons/fa";

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
  const [status, setStatus] = useState("2");
  
  const tabs = [
    {
      id: "2",
      label: "Privacy Policy",
      icon: FaShieldAlt,
      color: "from-[#a797cc] to-[#b0a0df]",
      hoverColor: "hover:shadow-purple-300"
    },
    {
      id: "1",
      label: "Terms & Conditions",
      icon: FaFileContract,
      color: "from-[#a3cc69] to-[#9fb68b]",
      hoverColor: "hover:shadow-green-300"
    },
    {
      id: "3",
      label: "About Us",
      icon: FaInfoCircle,
      color: "from-[#a797cc] to-[#b0a0df]",
      hoverColor: "hover:shadow-orange-300"
    }
  ];
  
  return (
    <>
      <DefaultLayout>
        <div className="container mx-auto px-4 py-6">
          {/* Animated Header */}
          <div className="relative mb-10">
            <div className="flex items-center gap-4 py-6 px-8 bg-gradient-to-r from-[#a3cc69]/10 via-[#a797cc]/10 to-[#b0a0df]/10 rounded-2xl shadow-lg border border-[#a3cc69]/30 animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-br from-[#a3cc69] to-[#a797cc] rounded-xl flex items-center justify-center shadow-lg animate-bounce-slow">
                <FaEdit className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-black">
                  Manage CMS
                </h1>
                <p className="text-gray-600 mt-1">Update your website content & policies</p>
              </div>
            </div>
          </div>

          {/* Animated Tabs */}
          <div className="mt-8">
            <div className="flex justify-center mb-8">
              <div className="inline-flex gap-4 p-2 bg-white rounded-2xl shadow-xl border border-gray-100">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = status === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      className={`
                        group relative px-8 py-4 rounded-xl font-semibold text-base
                        transition-all duration-300 transform
                        ${isActive 
                          ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105` 
                          : `bg-gray-50 text-gray-600 hover:bg-gray-100 hover:scale-105 ${tab.hoverColor} hover:shadow-md`
                        }
                      `}
                      onClick={() => setStatus(tab.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`text-xl transition-transform duration-300 ${isActive ? 'animate-pulse' : 'group-hover:rotate-12'}`} />
                        <span>{tab.label}</span>
                      </div>
                      
                      {/* Active Indicator */}
                      {isActive && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white rounded-full animate-pulse"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Area with Animation */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-slide-up">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                {tabs.find(tab => tab.id === status) && (() => {
                  const currentTab = tabs.find(tab => tab.id === status);
                  const Icon = currentTab.icon;
                  return (
                    <>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${currentTab.color} flex items-center justify-center shadow-md`}>
                        <Icon className="text-xl text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">{currentTab.label}</h2>
                        <p className="text-sm text-gray-500">Edit and update your content below</p>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="animate-fade-in">
                {status === "2" && <PrivacyPolicy status={status} />}
                {status === "1" && <TermsConditions status={status} />}
                {status === "3" && <AboutUs status={status} />}
              </div>
            </div>
          </div>
        </div>

        {/* Custom Styles */}
        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bounce-slow {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }

          .animate-slide-up {
            animation: slide-up 0.6s ease-out;
          }

          .animate-bounce-slow {
            animation: bounce-slow 3s infinite;
          }
        `}</style>
      </DefaultLayout>
    </>
  );
});

ManageCms.displayName = 'ManageCms';

export default ManageCms;
