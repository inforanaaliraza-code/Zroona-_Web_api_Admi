"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import { useRTL } from "@/utils/rtl";

const SignupHeader = ({ bgColor = "#fff" }) => {
  const { t } = useTranslation();
  const { isRTL } = useRTL();

  return (
    <>
      <div className="h-[72px]" />
      <header className={`fixed top-0 ${isRTL ? "left-0 right-0" : "right-0 left-0"} z-50 border-b border-[#b0a0df]/30 bg-[#b0a0df] shadow-md`}>
        <nav className="relative">
          <div className={`px-4 mx-auto max-w-7xl sm:px-6 lg:px-8`}>
            <div className={`flex items-center ${isRTL ? "flex-row-reverse" : "flex-row"} justify-between h-[72px]`}>
              {/* Logo - Centered Vertically, Bigger, Responsive */}
              <div className="flex-shrink-0 flex items-center h-full pt-1">
                {/* Desktop Logo - Bigger sizes */}
                <div className="hidden sm:block">
                  <Link
                    href="/"
                    className="flex items-center justify-center h-full transition-transform duration-300 hover:scale-105"
                  >
                    <Image
                      src="/assets/images/x_F_logo.png"
                      width={300}
                      height={90}
                      alt="Logo"
                      className="object-contain w-auto h-auto 
                        max-h-[60px] sm:max-h-[65px] md:max-h-[75px] lg:max-h-[85px] xl:max-h-[90px]
                        max-w-[220px] sm:max-w-[250px] md:max-w-[280px] lg:max-w-[300px] xl:max-w-[320px]
                        brightness-0 invert"
                      priority
                    />
                  </Link>
                </div>
                {/* Mobile Logo - Bigger sizes */}
                <div className="block sm:hidden">
                  <Link
                    href="/"
                    className="flex items-center justify-center h-full transition-transform duration-300 hover:scale-105"
                  >
                    <Image
                      src="/assets/images/x_F_logo.png"
                      width={200}
                      height={60}
                      alt="Logo"
                      className="object-contain w-auto h-auto 
                        max-h-[50px] max-w-[50px]
                        brightness-0 invert"
                      priority
                    />
                  </Link>
                </div>
              </div>

              {/* Right Side - Language and Login */}
              <div className="flex gap-4 items-center">
                <LanguageSwitcher ChangeLanguage={(lang) => {}} />
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white rounded-xl border border-brand-light-orange-1 hover:bg-gray-50 transition-all duration-300"
                >
                  <span suppressHydrationWarning>{t("header.tab5") || "Login"}</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

    </>
  );
};

export default SignupHeader;

