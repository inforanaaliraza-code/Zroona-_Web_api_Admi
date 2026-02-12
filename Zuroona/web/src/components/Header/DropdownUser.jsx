"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import UserAvatar from "@/components/ui/UserAvatar";
import ClickOutside from "./ClickOutside";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Add icons for the arrow
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import useAuth from "@/hooks/useAuth";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useConfirm } from "@/hooks/useConfirm";

const DropdownUser = ({ profile }) => {
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
    console.log("[DROPDOWN-USER] Profile data updated:", {
      reduxProfile,
      reduxUserData,
      profile,
      userData,
      profile_image: userData?.profile_image
    });
  }, [reduxProfile, reduxUserData, profile, userData]);
  
  // Ensure this is a guest (role 1) - if not, don't show this dropdown
  const userRole = userData?.role;
  if (userRole === 2) {
    // This is a host, should use DropdownOrganizer instead
    return null;
  }

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
  
  const closeDropdown = () => setDropdownOpen(false);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      {/* Trigger */}
      <button
        onClick={(e) => {
          // Stop propagation to prevent conflicts with notification button
          e.stopPropagation();
          setDropdownOpen(!dropdownOpen);
        }}
        className="flex gap-x-2 items-center sm:gap-x-3"
      >
        <UserAvatar
          src={userData?.profile_image}
          alt={`${userData?.first_name || ""} ${
            userData?.last_name || ""
          }`}
          size={40}
          className="flex-shrink-0"
        />
        {/* Role Name - Guest */}
        <span className="text-left hidden sm:block">
          <span className="block text-sm text-white font-semibold truncate max-w-[6rem]">
            {userData?.first_name || t("auth.guest") || "Guest"}
          </span>
          <span className="block text-xs text-white/80 font-medium">
            {t("auth.guest") || "Guest"}
          </span>
        </span>
        <span className="text-xs text-white/80">
          {dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </button>

      {/* Dropdown */}
      {dropdownOpen && (
        <div className="absolute right-0 z-20 p-4 mt-2 w-64 bg-white rounded-xl shadow-lg">
          <ul className="text-gray-800">
            {/* Define your menu items */}
            {[
              {
                label: t("header.tab1") || "Events",
                path: "/events",
                icon: "lucide:calendar",
              },
              {
                label: t("header.messaging") || "Messaging",
                path: "/messaging",
                icon: "lucide:message-circle",
              },
              {
                label: t("sidemenu.tab4") || "My Bookings",
                path: "/myEvents",
                icon: "lucide:calendar-check",
              },
              {
                label: t("header.reviews") || t("sidemenu.tab13") || "My Reviews",
                path: "/my-reviews",
                icon: "lucide:star",
              },
              {
                label: t("refunds.title") || "Refunds",
                path: "/refunds",
                icon: "lucide:undo-2",
              },
              {
                label: t("profile.personalInfo") || "Profile",
                path: "/profile",
                icon: "lucide:user",
              },
              { label: t("sidemenu.tab8") || "About Us", path: "/aboutUs", icon: "lucide:info" },
            ].map(({ label, path, icon }) => {
              const isActive = currentRoute.startsWith(path);
              return (
                <li
                  key={path}
                  className="flex gap-2 items-center py-2 rounded-lg"
                >
                  <Icon
                    icon={icon}
                    className={`w-5 h-5 ${isActive ? "text-[#8ba179]" : "text-gray-600"}`}
                  />
                  <Link
                    href={path}
                    className={`text-sm ${
                      isActive ? "text-[#8ba179]" : ""
                    }`}
                    onClick={closeDropdown}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}

            {/* Logout */}
            <li className="flex gap-2 justify-center items-center py-1 pt-2 mt-4">
              <button
                onClick={handleLogout}
                className="group text-[#a797cc] underline text-sm font-semibold hover:text-[#8ba179] flex items-center"
              >
                {t("sidemenu.tab10")}
                <Icon
                  icon="lucide:log-out"
                  className="w-3 h-3 ml-1 text-[#a797cc] group-hover:text-[#8ba179]"
                />
              </button>
            </li>
          </ul>
        </div>
      )}
      
      {/* Confirmation Dialog */}
      <ConfirmDialog {...confirmProps} />
    </ClickOutside>
  );
};

export default DropdownUser;
