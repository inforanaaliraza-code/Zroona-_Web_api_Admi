"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { format } from "date-fns";
import useAuthStore from "@/store/useAuthStore";
import { ProfileDetailApi } from "@/app/api/setting";
import Link from "next/link";
import UserAvatar from "@/components/ui/UserAvatar";
import { useRTL } from "@/utils/rtl";

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const { isRTL, textAlign, flexDirection, marginStart, marginEnd, chevronIcon, arrowIcon } = useRTL();
  const router = useRouter();
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useAuthStore();
  
  // State for profile data
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: t("breadcrumb.tab1"), href: "/" },
    { label: t("sidemenu.tab3"), href: "/profile" },
  ];


  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return t("eventsMain.dateNotAvailable") || "Date not available";
    }
  };

  // Load user profile
  useEffect(() => {
    if (!token || !isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await ProfileDetailApi();
        if (response.status) {
          setProfile(response.data);
        } else {
          toast.error(response.message || t("eventsMain.profileLoadError") || "Failed to load profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error(t("eventsMain.profileLoadError") || "Error loading your profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, isAuthenticated]);


  if (!token || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <Icon icon="lucide:lock" className="mx-auto h-16 w-16 text-gray-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">{t("eventsMain.pleaseLogin") || "Please login"}</h2>
          <p className="mt-1 text-sm text-gray-500">
            {t("eventsMain.loginToViewProfile") || "Please login to view your profile"}
          </p>
          <div className="mt-6">
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-[#a797cc] to-[#8ba179] hover:shadow-lg"
            >
              {t("header.tab5")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="py-4 px-4 md:px-8 xl:px-28">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => router.back()}
            className={`inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${flexDirection}`}
          >
            <Icon icon={arrowIcon} className={`${marginEnd(1.5)} h-4 w-4`} />
            {t("common.back")}
          </button>
        </div>
        <ol className={`flex flex-wrap items-center gap-2 text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
          <li className="flex items-center">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 hover:underline"
            >
              {t("breadcrumb.tab1") || "Home"}
            </Link>
          </li>
          <li className="flex items-center">
            <Icon 
              icon={isRTL ? "lucide:chevron-left" : "lucide:chevron-right"} 
              className={`mx-2 h-4 w-4 text-gray-400 ${isRTL ? "order-1" : ""}`} 
            />
            <span className="font-medium text-gray-900">{t("profile.personalInfo")}</span>
          </li>
        </ol>
      </nav>
      
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex-shrink-0">
                <UserAvatar 
                  src={(() => {
                    const imgPath = profile?.user?.profile_image;
                    if (!imgPath) return null;
                    // UserAvatar component will handle URL conversion, but we can also do it here
                    if (!imgPath.includes("http://") && !imgPath.includes("https://")) {
                      if (imgPath.startsWith("/uploads/")) {
                        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3434";
                        return `${apiBase}${imgPath}`;
                      }
                    }
                    return imgPath;
                  })()} 
                  alt={`${profile?.user?.first_name || ''} ${profile?.user?.last_name || ''}`}
                  size={120}
                  className="border-4 border-gray-100 shadow-lg"
                />
              </div>
              
              <div className={`flex-1 text-center md:${textAlign}`}>
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile?.user?.first_name} {profile?.user?.last_name}
                </h1>
                
                <p className="text-gray-600 mt-1">
                  {profile?.user?.email}
                </p>
                
                <div className={`mt-4 flex flex-wrap justify-center md:${isRTL ? "justify-end" : "justify-start"} gap-2`}>
                  <Link
                    href="/signup/edit"
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Icon icon="lucide:edit" className={`${marginEnd(1.5)} h-4 w-4`} />
                    {t("signup.tab18")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile Content */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="space-y-6">
                {loading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a797cc]"></div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h3 className={`text-lg font-medium text-gray-900 mb-4 ${textAlign}`}>{t("profile.personalInfo") || "Personal Information"}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className={`text-sm font-medium text-gray-500 ${textAlign}`}>{t("signup.tab2") || "First Name"}</p>
                          <p className={`mt-1 text-sm text-gray-900 ${textAlign}`}>{profile?.user?.first_name || "-"}</p>
                        </div>
                        
                        <div>
                          <p className={`text-sm font-medium text-gray-500 ${textAlign}`}>{t("signup.tab3") || "Last Name"}</p>
                          <p className={`mt-1 text-sm text-gray-900 ${textAlign}`}>{profile?.user?.last_name || "-"}</p>
                        </div>
                        
                        <div>
                          <p className={`text-sm font-medium text-gray-500 ${textAlign}`}>{t("signup.tab4") || "Phone"}</p>
                          <p className={`mt-1 text-sm text-gray-900 ${textAlign}`}>{profile?.user?.phone || "-"}</p>
                        </div>
                        
                        <div>
                          <p className={`text-sm font-medium text-gray-500 ${textAlign}`}>{t("signup.tab5") || "Email"}</p>
                          <p className={`mt-1 text-sm text-gray-900 ${textAlign}`}>{profile?.user?.email || "-"}</p>
                        </div>
                        
                        <div>
                          <p className={`text-sm font-medium text-gray-500 ${textAlign}`}>{t("signup.tab6") || "Gender"}</p>
                          <p className={`mt-1 text-sm text-gray-900 ${textAlign}`}>
                            {profile?.user?.gender === "1" 
                              ? (t("signup.tab7") || "Male")
                              : profile?.user?.gender === "2" 
                                ? (t("signup.tab8") || "Female")
                                : "-"}
                          </p>
                        </div>
                        
                        <div>
                          <p className={`text-sm font-medium text-gray-500 ${textAlign}`}>{t("signup.tab10") || "Date of Birth"}</p>
                          <p className={`mt-1 text-sm text-gray-900 ${textAlign}`}>
                            {profile?.user?.dob ? formatDate(profile.user.dob) : "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {profile?.user?.description && (
                      <div>
                        <h3 className={`text-lg font-medium text-gray-900 mb-2 ${textAlign}`}>{t("signup.tab11") || "Description"}</h3>
                        <p className={`text-sm text-gray-600 ${textAlign}`}>{profile.user.description}</p>
                      </div>
                    )}
                  </>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
