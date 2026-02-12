"use client";

import LoginForm from "@/components/LoginForm/LoginForm";
import Image from "next/image";
import LanguageSwitcher from "@/components/LanguageSwitcher/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function AdminLogin() {
    const { t } = useTranslation();
    return (
        <section className="bg-white h-screen flex items-center justify-center relative overflow-hidden" suppressHydrationWarning>
            {/* Decorative background elements matching website style */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-purple-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg relative z-10 border border-gray-100/50">
                {/* Language switcher in top-right of login card */}
                <div className="absolute top-4 right-4 z-20">
                    <LanguageSwitcher />
                </div>
                <div className="flex flex-col gap-y-6">
                    <div className="flex justify-center">
                        <div className="w-[240px]">
                            <Image
                                src="/assets/images/x_F_logo.png"
                                alt="Zuroona Logo"
                                height={70}
                                width={240}
                                className="w-full h-auto object-contain"
                                priority
                            />
                        </div>
                    </div>

                    <div className="w-full" suppressHydrationWarning>
                        <div className="flex flex-col items-center gap-y-2 mb-6">
                            <h3 className="text-2xl lg:text-3xl font-semibold text-[#a797cc]">{t("auth.login")}</h3>
                            <p className="font-medium text-gray-500 text-sm">{t("auth.signInToContinue")}</p>
                        </div>
                        <LoginForm />
                    </div>
                </div>
            </div>
        </section>
    );
}
