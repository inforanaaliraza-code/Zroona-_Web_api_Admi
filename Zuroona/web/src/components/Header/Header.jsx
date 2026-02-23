"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import DropdownUser from "./DropdownUser";
import DropdownOrganizer from "./DropdownOrganizer";
import { useDispatch, useSelector } from "react-redux";
import { getUserNotificationCount } from "@/redux/slices/UserNotificatonCount";
import { TOKEN_NAME } from "@/until";
import { getProfile } from "@/redux/slices/profileInfo";
import Cookies from "universal-cookie";
import Loader from "../Loader/Loader";
import useAuthStore from "@/store/useAuthStore";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import { LanguageApi } from "@/app/api/setting";
import { toast } from "react-toastify";
import { showGreenTick } from "@/utils/toastHelpers";
import { useRTL } from "@/utils/rtl";
import { Icon } from "@iconify/react";

const Header = ({ bgColor, hideLogo = false }) => {
  const dispatch = useDispatch();
  const cookie = new Cookies();
  // Use the auth store instead of directly accessing cookies
  const { token, isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { isRTL, marginStart, marginEnd, paddingStart, paddingEnd } = useRTL();

  const { UserNotificationCount } = useSelector(
    (state) => state.UserNotificatonCountData
  );
  const { profile, loadingProfile } = useSelector((state) => state.profileData);

  // Determine user role from auth store or profile
  const userRole = user?.role || profile?.user?.role;
  const isGuest = userRole === 1;
  const isHost = userRole === 2;

  const profileData = profile?.user?.role === 1 ? profile : null;

  const ChangeLanguage = (language) => {
    setLoading(true);
    const payload = { language: language };

    LanguageApi(payload)
      .then((res) => {
        setLoading(false);
        if (res?.status === 1) {
          showGreenTick();
          i18n.changeLanguage(language);
        } else {
          toast.error(res?.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error(t("auth.failedToChangeLanguage") || "Failed to change language");
      });
  };

  const goToLogin = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (token) {
      dispatch(getUserNotificationCount(token));
      dispatch(getProfile()); // Fetch profile to get role
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);


  return (
    <>
      <div className="h-[72px]" />
      <header 
        className={`fixed top-0 ${isRTL ? "left-0 right-0" : "right-0 left-0"} z-[100] border-b border-[#8b7bb8]/30 shadow-md animate-gradient-xy`} 
        style={{ 
          willChange: 'transform', 
          transform: 'translateZ(0)',
          background: 'linear-gradient(135deg, #8b7bb8 0%, #a797cc 30%, #a3cc69 70%, #a797cc 100%)',
          backgroundSize: '200% 200%',
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        <nav className="relative">
          <div className={`px-4 mx-auto max-w-7xl sm:px-6 lg:px-8`}>
            <div className={`flex items-center ${isRTL ? "flex-row-reverse" : "flex-row"} justify-between h-[72px]`}>
              {/* Logo - Centered Vertically, Bigger, Responsive */}
              {!hideLogo && (
                <div className="flex-shrink-0 flex items-center h-full">
                  {/* Desktop Logo - Bigger sizes */}
                  <div className="hidden sm:block">
                    <Link
                      href={isAuthenticated && user ? (user.role === 2 ? "/joinUsEvent" : "/events") : "/"}
                      className="flex items-center h-full transition-transform duration-600 hover:scale-105"
                    >
                      <img
                        src="/assets/images/x_F_logo.png"
                        alt={t("add.zuroonaLogo") || "Zuroona Logo"}
                        className="object-contain w-auto h-auto 
                          max-h-[60px] sm:max-h-[65px] md:max-h-[75px] lg:max-h-[85px] xl:max-h-[90px]
                          max-w-[220px] sm:max-w-[250px] md:max-w-[280px] lg:max-w-[300px] xl:max-w-[320px]
                          brightness-0 invert"
                        width={300}
                        height={90}
                        fetchPriority="high"
                      />
                    </Link>
                  </div>
                  {/* Mobile Logo - Bigger sizes */}
                  <div className="block sm:hidden flex-grow">
                    <Link
                      href={isAuthenticated && user ? (user.role === 2 ? "/joinUsEvent" : "/events") : "/"}
                      className="flex items-center h-full transition-transform duration-300 hover:scale-105"
                    >
                      <img
                        src="/assets/images/x_F_logo.png"
                        alt={t("add.zuroonaLogo") || "Zuroona Logo"}
                        className="object-contain w-auto h-auto 
                          max-h-[55px] sm:max-h-[65px]
                          max-w-[180px] sm:max-w-[250px]
                          brightness-0 invert"
                        width={250}
                        height={75}
                        fetchPriority="high"
                      />
                    </Link>
                  </div>
                </div>
              )}

              {/* Desktop Navigation */}
              <div className="hidden gap-6 items-center sm:flex">
                <LanguageSwitcher ChangeLanguage={ChangeLanguage} />
                {!token ? (
                  <div className="flex gap-3 items-center">
                    <Link
                      href="/login"
                      className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-white/20 rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300 min-h-[44px] items-center"
                    >
                      <img
                        src="/assets/images/icons/lock-solid.png"
                        alt=""
                        width={14}
                        height={14}
                        className="opacity-80 w-3.5 h-3.5 object-contain flex-shrink-0"
                      />
                      <span suppressHydrationWarning>{t("header.tab5") || "Login"}</span>
                    </Link>
                    <Link
                      href="/signup"
                      className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#a797cc] rounded-xl hover:shadow-lg transition-all duration-300 min-h-[44px]"
                    >
                      <span suppressHydrationWarning>{t("header.tab4") || "Sign Up"}</span>
                    </Link>
                  </div>
                ) : (
                  <div className="flex gap-4 items-center">
                    {/* Notification Button - Completely separate from dropdown */}
                    <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
                      <Link 
                        href="/notification" 
                        className="relative block"
                        onClick={(e) => {
                          // Stop any event propagation to prevent dropdown from opening
                          e.stopPropagation();
                        }}
                      >
                        <div className="p-2 bg-white/20 rounded-xl transition-all duration-300 hover:bg-white/30 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center">
                          <Icon icon="lucide:bell" className="w-5 h-5 text-white" width={20} height={20} />
                          {UserNotificationCount?.unreadCount > 0 && (
                            <span className={`absolute -top-0.5 ${isRTL ? "-left-0.5" : "-right-0.5"} flex items-center justify-center w-3.5 h-3.5 text-[0.5rem] font-medium text-white bg-primary rounded-full`}>
                              {UserNotificationCount?.unreadCount}
                            </span>
                          )}
                        </div>
                      </Link>
                    </div>
                    {/* User Dropdown - Separate component */}
                    <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
                      {loadingProfile ? (
                        <Loader height="23" />
                      ) : isHost ? (
                        <DropdownOrganizer profile={profile?.user || user} />
                      ) : (
                        <DropdownUser profile={profile || { user: user }} />
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="mobile-menu-button p-2 sm:hidden min-w-[44px] min-h-[44px] flex items-center justify-center"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>

            {/* Mobile Menu */}
            <div
              className={`mobile-menu
                                absolute top-[72px] left-0 right-0 
                                bg-white/95 backdrop-blur-md backdrop-saturate-150
                                border-t border-gray-100/50
                                transition-all duration-300 ease-in-out
                                max-h-[calc(100vh-72px)] overflow-y-auto
                                z-50
                                ${
                                  isMobileMenuOpen
                                    ? "visible opacity-100"
                                    : "invisible opacity-0"
                                }
                                sm:hidden
                            `}
            >
              <div className="px-4 py-6 space-y-6 min-h-max">
                <div className="flex justify-center">
                  <LanguageSwitcher ChangeLanguage={ChangeLanguage} />
                </div>
                {!token ? (
                  <div className="flex flex-col gap-4">
                    <Link
                      href="/login"
                      onClick={goToLogin}
                      className="flex justify-center items-center gap-2 px-5 py-3 text-sm font-medium text-white bg-gray-700 rounded-xl border border-gray-600 hover:bg-gray-600 transition-all duration-300 w-full min-h-[44px]"
                    >
                      <img
                        src="/assets/images/icons/lock-solid.png"
                        alt=""
                        width={14}
                        height={14}
                        className="opacity-80 w-3.5 h-3.5 object-contain flex-shrink-0"
                      />
                      <span suppressHydrationWarning>{t("header.tab5") || "Login"}</span>
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex justify-center items-center gap-2 px-5 py-3 text-sm font-medium text-white bg-[#a797cc] rounded-xl hover:bg-[#9680bb] transition-all duration-300 w-full min-h-[44px]"
                    >
                      <span suppressHydrationWarning>{t("header.tab4") || "Sign Up"}</span>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {/* Notification Button - Separate from dropdown */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <Link
                        href="/notification"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex gap-2 justify-center items-center p-3 bg-white/20 rounded-xl transition-all duration-300 hover:bg-white/30 min-h-[44px]"
                      >
                        <div className="relative flex items-center justify-center">
                          <Icon icon="lucide:bell" className="w-5 h-5 text-white" width={20} height={20} />
                          {UserNotificationCount?.unreadCount > 0 && (
                            <span className={`absolute -top-0.5 ${isRTL ? "-left-0.5" : "-right-0.5"} flex items-center justify-center w-3.5 h-3.5 text-[0.5rem] font-medium text-white bg-primary rounded-full`}>
                              {UserNotificationCount?.unreadCount}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-white">
                          Notifications
                        </span>
                      </Link>
                    </div>
                    {/* User Dropdown - Separate component */}
                    <div onClick={(e) => e.stopPropagation()}>
                      {loadingProfile ? (
                        <div className="flex justify-center">
                          <Loader height="23" />
                        </div>
                      ) : isHost ? (
                        <div className="px-4">
                          <DropdownOrganizer profile={profile?.user || user} />
                        </div>
                      ) : (
                        <div className="px-4">
                          <DropdownUser profile={profile || { user: user }} />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

    </>
  );
};

export default Header;
