"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import Cookies from "universal-cookie";
import { TOKEN_NAME } from "@/until";
import { useRTL } from "@/utils/rtl";
import { useSelector } from "react-redux";

const HostNavbar = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [token, setToken] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const { isRTL } = useRTL();
  
  // Get profile data to check approval status
  const { profile, loadingProfile } = useSelector((state) => state.profileData);
  const profileData = profile?.user?.role === 2 ? profile.user : null;
  
  useEffect(() => {
    setIsMounted(true);
    const cookie = new Cookies();
    const authToken = cookie.get(TOKEN_NAME);
    setToken(authToken);
  }, []);

  // Check approval status - only show navigation if approved (is_approved === 2)
  // 1 = pending, 2 = approved, 3 = rejected
  const isApproved = profileData?.is_approved === 2;

  const navItems = [
    { label: t("hostNavbar.myEvents"), href: "/joinUsEvent", icon: "lucide:calendar" },
    { label: t("hostNavbar.myBookings") || "My Bookings", href: "/myBookings", icon: "lucide:clipboard-list" },
    { label: t("hostNavbar.myWallet"), href: "/myEarning", icon: "lucide:wallet" },
    { label: t("hostNavbar.myRatings"), href: "/reviews", icon: "lucide:star" },
    { label: t("hostNavbar.messages"), href: "/messaging", icon: "lucide:message-circle" },
    { label: t("hostNavbar.myProfile"), href: "/editProfile", icon: "lucide:user" },
  ];

  const isActive = (href) => {
    if (href === "/joinUsEvent") {
      return pathname === "/joinUsEvent" || pathname?.startsWith("/joinUsEvent");
    }
    return pathname?.startsWith(href);
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted || !token) {
    return null;
  }

  // Don't show navigation if profile is loading
  if (loadingProfile) {
    return null;
  }

  // Only show navigation if user is approved
  if (!isApproved) {
    return null;
  }

  // Header height calculation: HeaderOrganizer uses absolute positioning
  // The header is approximately 72px tall on mobile, 80px on desktop
  // Navbar must be fixed at the correct top position to stay below header
  const headerHeight = 72; // Base height in pixels
  
  return (
    <>
      <nav 
        className="border-b border-[#8b7bb8]/30 shadow-sm z-[95] animate-gradient-xy" 
        style={{ 
          position: 'fixed',
          top: `${headerHeight}px`,
          left: 0,
          right: 0,
          width: '100%',
          willChange: 'transform', 
          transform: 'translateZ(0)',
          background: 'linear-gradient(135deg, #8b7bb8 0%, #a797cc 30%, #a3cc69 70%, #a797cc 100%)',
          backgroundSize: '200% 200%',
          zIndex: 95
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 flex-1">
            {/* Nav Items */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
                    isActive(item.href)
                      ? "bg-white/20 text-white"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  <Icon icon={item.icon} className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
        </div>
      </nav>
      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default HostNavbar;

