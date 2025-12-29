"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import SearchBar from "../Searchbar/Searchbar";
import useAuthStore from "@/store/useAuthStore";
import ClickOutside from "./ClickOutside";
import { useRTL } from "@/utils/rtl";

const GuestNavbar = ({ search, setSearch, setPage }) => {
  const { t } = useTranslation();
  const { token, isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const [showSupportDropdown, setShowSupportDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { isRTL, chevronIcon, right } = useRTL();

  // Support contact info
  const supportInfo = {
    phone: "+966 59 172 7589",
    email: "infozuroona@gmail.com"
  };

  // Define all navigation items with authentication requirements
  const allNavItems = [
    { label: t("header.homepage", "Homepage"), href: "/", icon: "lucide:home", requiresAuth: false, hideWhenLoggedIn: true },
    { label: t("header.events", "Events"), href: "/events", icon: "lucide:calendar-days", requiresAuth: false },
    { label: t("header.messaging", "Messaging"), href: "/messaging", icon: "lucide:message-circle", requiresAuth: true },
    { label: t("header.myBooking", "My Booking"), href: "/myEvents", icon: "lucide:calendar", requiresAuth: true },
    { label: t("header.profile", "Profile"), href: "/profile", icon: "lucide:user", requiresAuth: true },
  ];

  // Filter nav items based on authentication status
  const navItems = allNavItems.filter(item => {
    // Hide Home when user is logged in
    if (item.hideWhenLoggedIn && isAuthenticated) return false;
    // If item doesn't require auth, show it to everyone
    if (!item.requiresAuth) return true;
    // If item requires auth, only show if user is authenticated
    return isAuthenticated;
  });

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  return (
    <nav className="bg-[#b0a0df] border-b border-[#b0a0df]/30 shadow-sm sticky top-[72px] z-[90]" style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 flex-1">
            {/* Nav Items */}
            <div className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isRTL ? "flex-row-reverse" : "flex-row"
                  } ${
                    isActive(item.href)
                      ? "bg-white/20 text-white"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  <Icon icon={item.icon} className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Search Bar */}
            {token && isAuthenticated && (
              <div className={`flex-1 max-w-md ${isRTL ? "mr-auto" : "ml-auto"}`}>
                <SearchBar search={search} setSearch={setSearch} setPage={setPage} />
              </div>
            )}

            {/* Support Dropdown */}
            <ClickOutside onClick={() => setShowSupportDropdown(false)} className="relative">
              <button
                onClick={() => setShowSupportDropdown(!showSupportDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white/90 hover:bg-white/10 transition-colors"
              >
                <Icon icon="lucide:help-circle" className="h-4 w-4" />
                <span>{t("header.support", "Support")}</span>
                <Icon 
                  icon={showSupportDropdown ? "lucide:chevron-up" : "lucide:chevron-down"} 
                  className="h-4 w-4" 
                />
              </button>

              {showSupportDropdown && (
                <div className={`absolute ${isRTL ? "left-0" : "right-0"} mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50`}>
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className={`text-sm font-semibold text-gray-900 ${isRTL ? "text-right" : "text-left"}`}>{t("header.contactSupport", "Contact Support")}</h3>
                  </div>
                  <div className="px-4 py-2">
                    <a
                      href={`tel:${supportInfo.phone}`}
                      className={`flex items-center gap-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded px-2 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <Icon icon="lucide:phone" className="h-4 w-4 text-[#a797cc]" />
                      <span dir="ltr">{supportInfo.phone}</span>
                    </a>
                    <a
                      href={`mailto:${supportInfo.email}`}
                      className={`flex items-center gap-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded px-2 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <Icon icon="lucide:mail" className="h-4 w-4 text-[#a797cc]" />
                      <span className="break-all" dir="ltr">{supportInfo.email}</span>
                    </a>
                  </div>
                </div>
              )}
            </ClickOutside>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10"
          >
            <Icon icon={showMobileMenu ? "lucide:x" : "lucide:menu"} className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isRTL ? "flex-row-reverse" : "flex-row"
                  } ${
                    isActive(item.href)
                      ? "bg-white/20 text-white"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  <Icon icon={item.icon} className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* Mobile Search */}
              {token && isAuthenticated && (
                <div className="px-4 py-2">
                  <SearchBar search={search} setSearch={setSearch} setPage={setPage} />
                </div>
              )}

              {/* Mobile Support */}
              <div className="px-4 py-2 border-t border-white/20">
                <div className="py-2">
                  <h3 className={`text-sm font-semibold text-gray-900 mb-2 ${isRTL ? "text-right" : "text-left"}`}>{t("header.contactSupport", "Contact Support")}</h3>
                  <a
                    href={`tel:${supportInfo.phone}`}
                    className={`flex items-center gap-3 py-2 text-sm text-gray-700 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <Icon icon="lucide:phone" className="h-4 w-4 text-[#a797cc]" />
                    <span dir="ltr">{supportInfo.phone}</span>
                  </a>
                  <a
                    href={`mailto:${supportInfo.email}`}
                    className={`flex items-center gap-3 py-2 text-sm text-gray-700 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <Icon icon="lucide:mail" className="h-4 w-4 text-[#a797cc]" />
                    <span className="break-all" dir="ltr">{supportInfo.email}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default GuestNavbar;



