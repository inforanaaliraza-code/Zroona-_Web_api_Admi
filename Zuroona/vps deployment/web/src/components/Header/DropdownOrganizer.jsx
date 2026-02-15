"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ClickOutside from "./ClickOutside";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import useAuth from "@/hooks/useAuth";
import { useSelector } from "react-redux";
import { BASE_API_URL } from "@/until";
import { Icon } from "@iconify/react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useConfirm } from "@/hooks/useConfirm";

const DropdownOrganizer = ({ profile }) => {
  const { t } = useTranslation();
  const currentRoute = usePathname();
  const { push } = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout: authLogout } = useAuth();
  const { confirmProps, openConfirm } = useConfirm();
  
  // Also get profile from Redux store as fallback/update source
  const reduxProfile = useSelector((state) => state.profileData?.profile);
  const reduxUserData = reduxProfile?.user || reduxProfile;

  // Extract user data from profile (can be profile.user or just profile)
  // Prefer Redux store data if available (more up-to-date)
  const userData = reduxUserData || profile?.user || profile;
  
  // Debug logging
  useEffect(() => {
    console.log("[DROPDOWN-ORGANIZER] Profile data updated:", {
      reduxProfile,
      reduxUserData,
      profile,
      userData,
      profile_image: userData?.profile_image
    });
  }, [reduxProfile, reduxUserData, profile, userData]);
  
  // Ensure this is a host (role 2) - if not, don't show this dropdown
  const userRole = userData?.role;
  if (userRole === 1) {
    // This is a guest, should use DropdownUser instead
    return null;
  }

  // Check approval status - only show menu if approved (is_approved === 2)
  // 1 = pending, 2 = approved, 3 = rejected
  // If is_approved is undefined/null, default to showing features (for backward compatibility)
  const isApproved = userData?.is_approved === 2 || userData?.is_approved === undefined || userData?.is_approved === null;
  const isPending = userData?.is_approved === 1;
  const isRejected = userData?.is_approved === 3;

  const handleLogout = (e) => {
    e.preventDefault();
    openConfirm({
      title: t("confirm.logoutTitle") || "Logout?",
      description: t("confirm.logoutDescription") || "Are you sure you want to logout?",
      confirmText: t("confirm.logoutButton") || "Yes, Logout",
      cancelText: t("confirm.cancel") || "Cancel",
      variant: "warning",
      onConfirm: () => {
        authLogout();
        setDropdownOpen(false);
      },
    });
  };

  // If not approved, show limited menu or message
  if (!isApproved) {
    return (
      <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
        <button
          onClick={(e) => {
            // Stop propagation to prevent conflicts with notification button
            e.stopPropagation();
            setDropdownOpen(!dropdownOpen);
          }}
          className="flex items-center gap-x-2 sm:gap-x-3 hover:opacity-80 transition-opacity"
        >
          <span className="h-10 w-10 rounded-full overflow-hidden border-2 border-yellow-400/30 shadow-sm">
            <img
              key={`organizer-pending-${userData?.profile_image || 'default'}`}
              src={(() => {
                const getImageUrl = (imgPath) => {
                  if (!imgPath) return "/assets/images/home/user-dummy.png";
                  if (imgPath.includes("https://") || imgPath.includes("httpss://") || imgPath.startsWith("blob:")) return imgPath;
                  if (imgPath.startsWith("/uploads/")) {
                    const apiBase = BASE_API_URL.replace('/api/', '');
                    return `${apiBase}${imgPath}`;
                  }
                  if (imgPath.includes("uploads/")) {
                    const apiBase = BASE_API_URL.replace('/api/', '');
                    const uploadsIndex = imgPath.indexOf("uploads/");
                    return `${apiBase}/${imgPath.substring(uploadsIndex)}`;
                  }
                  return "/assets/images/home/user-dummy.png";
                };
                return getImageUrl(userData?.profile_image);
              })()}
              alt={userData?.first_name || "Profile"}
              className="rounded-full object-cover w-full h-full"
              style={{ minHeight: '100%', minWidth: '100%' }}
              onError={(e) => {
                if (!e.target.src.includes("user-dummy.png")) {
                  e.target.onerror = null;
                  e.target.src = "/assets/images/home/user-dummy.png";
                }
              }}
            />
          </span>
          <span className="text-left hidden sm:block">
            <span className="block text-sm text-black truncate w-full max-w-[7rem] sm:max-w-full font-semibold">
              {userData?.first_name || ""} {userData?.last_name || ""}
            </span>
          </span>
          <span className="text-gray-600 text-xs sm:text-base transition-transform duration-200">
            {dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
          </span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-3 w-72 bg-white shadow-2xl rounded-2xl z-50 overflow-hidden border border-gray-100">
            {/* User Info Header */}
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
                  <img
                    key={`organizer-dropdown-pending-${userData?.profile_image || 'default'}`}
                    src={(() => {
                      const getImageUrl = (imgPath) => {
                        if (!imgPath) return "/assets/images/home/user-dummy.png";
                        if (imgPath.includes("https://") || imgPath.includes("httpss://") || imgPath.startsWith("blob:")) return imgPath;
                        if (imgPath.startsWith("/uploads/")) {
                          const apiBase = BASE_API_URL.replace('/api/', '');
                          return `${apiBase}${imgPath}`;
                        }
                        if (imgPath.includes("uploads/")) {
                          const apiBase = BASE_API_URL.replace('/api/', '');
                          const uploadsIndex = imgPath.indexOf("uploads/");
                          return `${apiBase}/${imgPath.substring(uploadsIndex)}`;
                        }
                        return "/assets/images/home/user-dummy.png";
                      };
                      return getImageUrl(userData?.profile_image);
                    })()}
                    alt={userData?.first_name || "Profile"}
                    className="rounded-full object-cover w-full h-full"
                    style={{ minHeight: '100%', minWidth: '100%' }}
                    onError={(e) => {
                      if (!e.target.src.includes("user-dummy.png") && !e.target.src.includes("newprofile.png")) {
                        e.target.onerror = null;
                        e.target.src = "/assets/images/home/user-dummy.png";
                      }
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {userData?.first_name || ""} {userData?.last_name || ""}
                  </p>
                  <p className="text-xs text-white/90 font-medium">
                    {isPending ? t('auth.pendingApproval') || "Pending Approval" : isRejected ? t('auth.accountRejected') || "Rejected" : t('auth.host') || "Host"}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div className="p-4 bg-yellow-50 border-b border-yellow-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-yellow-800 font-semibold mb-1">
                    {isPending 
                      ? t('auth.pendingApproval') || "Account Pending Approval"
                      : isRejected
                      ? t('auth.accountRejected') || "Account Rejected"
                      : t('auth.notApproved') || "Account Not Approved"}
                  </p>
                  <p className="text-xs text-yellow-700 leading-relaxed">
                    {isPending
                      ? t('auth.pendingApprovalMessage') || "Your account is pending admin approval. You will be notified via email once approved."
                      : isRejected
                      ? t('auth.rejectedMessage') || "Your account application was rejected. Please contact support."
                      : t('auth.notApprovedMessage') || "Your account is not yet approved. Please wait for admin approval."}
                  </p>
                </div>
              </div>
            </div>

            {/* Logout */}
            <div className="p-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-200 hover:scale-[1.02]"
              >
                <Icon
                  icon="lucide:log-out"
                  className="w-4 h-4 text-[#a797cc]"
                />
                <span>{t('sidemenu.tab10') || "Logout"}</span>
              </button>
            </div>
          </div>
        )}
        {/* Confirmation Dialog */}
        <ConfirmDialog {...confirmProps} />
      </ClickOutside>
    );
  }

  const closeDropdown = () => setDropdownOpen(false);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      {/* Trigger - Show name and role "Host" */}
      <button
        onClick={(e) => {
          // Stop propagation to prevent conflicts with notification button
          e.stopPropagation();
          setDropdownOpen(!dropdownOpen);
        }}
        className="flex items-center gap-x-2 sm:gap-x-3 hover:opacity-80 transition-opacity"
      >
        <span className="h-10 w-10 rounded-full overflow-hidden border-2 border-white/30 shadow-sm bg-gray-100">
          <img
            key={`header-profile-${userData?.profile_image || 'default'}-${userData?._id || ''}`}
            src={(() => {
              const getImageUrl = (imgPath) => {
                if (!imgPath) {
                  return "/assets/images/home/user-dummy.png";
                }
                if (imgPath.includes("https://") || imgPath.includes("httpss://") || imgPath.startsWith("blob:")) {
                  return imgPath;
                }
                if (imgPath.startsWith("/uploads/")) {
                  const apiBase = BASE_API_URL.replace('/api/', '');
                  return `${apiBase}${imgPath}`;
                }
                if (imgPath.includes("uploads/")) {
                  const apiBase = BASE_API_URL.replace('/api/', '');
                  const uploadsIndex = imgPath.indexOf("uploads/");
                  return `${apiBase}/${imgPath.substring(uploadsIndex)}`;
                }
                return "/assets/images/home/user-dummy.png";
              };
              return getImageUrl(userData?.profile_image);
            })()}
            alt={userData?.first_name || "Profile"}
            className="rounded-full object-cover w-full h-full"
            style={{ minHeight: '100%', minWidth: '100%' }}
            onError={(e) => {
              if (!e.target.src.includes("user-dummy.png")) {
                e.target.onerror = null;
                e.target.src = "/assets/images/home/user-dummy.png";
              }
            }}
          />
        </span>
        {/* Name and Role - Host */}
        <span className="text-left hidden sm:block">
          <span className="block text-sm text-white font-semibold truncate max-w-[7rem]">
            {userData?.first_name || t("auth.host") || "Host"}
          </span>
          <span className="block text-xs text-white/80 font-medium">
            {t("auth.host") || "Host"}
          </span>
        </span>

        {/* Dropdown Arrow */}
        <span className="text-white/80 text-xs sm:text-base transition-transform duration-200">
          {dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </button>

      {/* Professional Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-3 w-72 bg-white shadow-2xl rounded-2xl z-50 overflow-hidden border border-gray-100">
          {/* User Info Header */}
          <div className="bg-gradient-to-r from-[#a797cc] to-[#8ba179] p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
                <img
                  key={`organizer-dropdown-approved-${userData?.profile_image || 'default'}`}
                  src={(() => {
                    const getImageUrl = (imgPath) => {
                      if (!imgPath) return "/assets/images/home/user-dummy.png";
                      if (imgPath.includes("https://") || imgPath.includes("httpss://") || imgPath.startsWith("blob:")) return imgPath;
                      if (imgPath.startsWith("/uploads/")) {
                        const apiBase = BASE_API_URL.replace('/api/', '');
                        return `${apiBase}${imgPath}`;
                      }
                      if (imgPath.includes("uploads/")) {
                        const apiBase = BASE_API_URL.replace('/api/', '');
                        const uploadsIndex = imgPath.indexOf("uploads/");
                        return `${apiBase}/${imgPath.substring(uploadsIndex)}`;
                      }
                      return "/assets/images/home/user-dummy.png";
                    };
                    return getImageUrl(userData?.profile_image);
                  })()}
                  alt={userData?.first_name || "Profile"}
                  className="rounded-full object-cover w-full h-full"
                  style={{ minHeight: '100%', minWidth: '100%' }}
                  onError={(e) => {
                    if (!e.target.src.includes("user-dummy.png") && !e.target.src.includes("newprofile.png")) {
                      e.target.onerror = null;
                      e.target.src = "/assets/images/home/user-dummy.png";
                    }
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">
                  {userData?.first_name || ""} {userData?.last_name || ""}
                </p>
                <p className="text-xs text-white/90 font-medium">
                  {t('auth.host') || "Host"}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <ul className="space-y-1">
              {[
                { label: t('sidemenu.payments'), path: "/myBookings", icon: "lucide:credit-card", highlight: true },
                { label: t('sidemenu.tab3'), path: "/editProfile", icon: "lucide:user-cog" },
                // Combined events entry: previously "Join Us Events" + "Welcome Events"
                { label: t('sidemenu.events') || t('sidemenu.tab11'), path: "/joinUsEvent", icon: "lucide:users" },
                { label: t('sidemenu.tab6'), path: "/myEarning", icon: "lucide:wallet" },
                { label: t('sidemenu.tab13'), path: "/reviews", icon: "lucide:star" },
                { label: t('sidemenu.notifications'), path: "/notification", icon: "lucide:bell" },
                { label: t('sidemenu.tab8'), path: "/aboutUs", icon: "lucide:info" },
              ].map(({ label, path, icon, highlight }) => {
                const isActive = currentRoute.startsWith(path);
                return (
                  <li key={path}>
                    <Link
                      href={path}
                      onClick={closeDropdown}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-[#8ba179]/10 text-[#8ba179] border-l-3 border-[#8ba179]"
                          : highlight
                          ? "bg-gradient-to-r from-[#a797cc]/10 to-[#8ba179]/10 text-[#8ba179] hover:from-[#a797cc]/20 hover:to-[#8ba179]/20 border-l-3 border-[#8ba179]"
                          : "text-gray-700 hover:bg-gray-50 hover:text-[#a797cc]"
                      }`}
                    >
                      <div className={`flex-shrink-0 ${isActive ? "scale-110" : ""} transition-transform`}>
                        <Icon
                          icon={icon}
                          className={`w-5 h-5 ${isActive || highlight ? "text-[#8ba179]" : "text-gray-600"}`}
                        />
                      </div>
                      <span className="flex-1">{label}</span>
                      {(isActive || highlight) && (
                        <div className="h-2 w-2 rounded-full bg-[#8ba179]"></div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
            
            {/* Divider */}
            <div className="my-2 border-t border-gray-200"></div>
            
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-200 hover:scale-[1.02]"
            >
              <Icon
                icon="lucide:log-out"
                className="w-4 h-4 text-[#a797cc]"
              />
              <span>{t('sidemenu.tab10') || "Logout"}</span>
            </button>
          </div>
        </div>
      )}
      {/* Confirmation Dialog */}
      <ConfirmDialog {...confirmProps} />
    </ClickOutside>
  );
};

export default DropdownOrganizer;
