"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import LoginModal from "../Modal/LoginModal";
import { useRTL } from "@/utils/rtl";

const SignupHeader = ({ bgColor = "#fff" }) => {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);

  return (
    <>
      <div className="h-[72px]" />
      <header className={`fixed top-0 ${isRTL ? "left-0 right-0" : "right-0 left-0"} z-50 border-b backdrop-blur-md backdrop-saturate-150 bg-white/70 border-gray-100/50`}>
        <nav className="relative">
          <div className={`px-4 mx-auto max-w-7xl sm:px-6 lg:px-8`}>
            <div className={`flex items-center ${isRTL ? "flex-row-reverse" : "flex-row"} justify-between h-[72px]`}>
              {/* Logo */}
              <div className="flex-shrink-0">
                <div className="hidden sm:block">
                  <Link
                    href="/"
                    className="block transition-transform duration-300 hover:scale-105"
                  >
                    <Image
                      src="/assets/images/main-logo.png"
                      width={140}
                      height={45}
                      alt="Logo"
                      className="object-contain w-auto h-auto max-h-[35px] sm:max-h-[40px] md:max-h-[45px] max-w-[90px] sm:max-w-[120px] md:max-w-[140px]"
                      priority
                    />
                  </Link>
                </div>
                <div className="block sm:hidden">
                  <Link
                    href="/"
                    className="block transition-transform duration-300 hover:scale-105"
                  >
                    <Image
                      src="/assets/images/main-logo.png"
                      width={32}
                      height={32}
                      alt="Logo"
                      className="object-contain w-auto h-auto max-h-[32px] max-w-[32px]"
                      priority
                    />
                  </Link>
                </div>
              </div>

              {/* Right Side - Language and Login */}
              <div className="flex gap-4 items-center">
                <LanguageSwitcher ChangeLanguage={(lang) => {}} />
                <button
                  onClick={openLoginModal}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white rounded-xl border border-brand-light-orange-1 hover:bg-gray-50 transition-all duration-300"
                >
                  <span>{t("header.tab5") || "Login"}</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      )}
    </>
  );
};

export default SignupHeader;

