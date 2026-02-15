"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Image from "next/image";
import { Icon } from "@iconify/react";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import { useRTL } from '@/utils/rtl';

export default function RoleSelectionPage() {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState(null);
    // Pass i18n instance to useRTL to avoid calling useTranslation twice
    const { isRTL } = useRTL({ i18n });

    const handleLanguageChange = (newLang) => {
        i18n.changeLanguage(newLang);
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    };

    const roles = [
        {
            id: "guest",
            title: t("auth.joinAsGuest") || "Join as Guest",
            subtitle: t("auth.guestSubtitle") || "Discover and join amazing events",
            icon: "material-symbols:person",
            color: "from-[#a797cc] to-[#a797cc]/80",
            hoverColor: "hover:from-[#a797cc]/80 hover:to-[#a797cc]/90",
            route: "/signup/guest",
        },
        {
            id: "host",
            title: t("auth.becomeHost") || "Become a Host",
            subtitle: t("auth.hostSubtitle") || "Create and manage your own events",
            icon: "material-symbols:star",
            color: "from-brand-orange to-brand-orange/80",
            hoverColor: "hover:from-brand-orange/80 hover:to-brand-orange/90",
            route: "/signup/host",
            badge: t("auth.requiresApproval") || "Requires Approval",
        },
    ];

    const handleRoleSelect = (role) => {
        setSelectedRole(role.id);
        setTimeout(() => {
            router.push(role.route);
        }, 300);
    };

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            {/* Language Switcher - Fixed Top Right */}
            <div className={`fixed top-6 ${isRTL ? 'left-6' : 'right-6'} z-50`}>
                <LanguageSwitcher ChangeLanguage={handleLanguageChange} />
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex justify-center mb-6">
                            <Image
                                src="/assets/images/x_F_logo.png"
                                alt="Zuroona"
                                width={200}
                                height={60}
                                className="object-contain"
                            />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            {t("auth.welcomeToZuroona") || "Welcome to Zuroona"}
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            {t("auth.chooseAccountType") || "Choose your account type to get started"}
                        </p>
                    </motion.div>
                </div>

                {/* Role Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-8">
                    {roles.map((role, index) => (
                        <motion.div
                            key={role.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative"
                        >
                            <button
                                onClick={() => handleRoleSelect(role)}
                                className={`
                                    w-full p-8 rounded-2xl bg-white border-2 
                                    ${selectedRole === role.id ? 'border-primary shadow-2xl' : 'border-gray-200 hover:border-primary'}
                                    shadow-lg hover:shadow-2xl transition-all duration-300 
                                    transform hover:scale-105 text-left
                                `}
                            >
                                {/* Badge */}
                                {role.badge && (
                                    <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'}`}>
                                        <span className="bg-brand-light-orange-1 text-brand-orange text-xs font-semibold px-3 py-1 rounded-full">
                                            {role.badge}
                                        </span>
                                    </div>
                                )}

                                {/* Icon */}
                                <div className={`
                                    w-20 h-20 rounded-2xl bg-gradient-to-br ${role.color} 
                                    flex items-center justify-center mb-6 mx-auto md:mx-0
                                `}>
                                    <Icon 
                                        icon={role.icon} 
                                        className="w-10 h-10 text-white" 
                                        width={40}
                                        height={40}
                                    />
                                </div>

                                {/* Content */}
                                <div className="text-center md:text-left">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        {role.title}
                                    </h2>
                                    <p className="text-gray-600 mb-6">
                                        {role.subtitle}
                                    </p>

                                    {/* Features */}
                                    <ul className="space-y-3 mb-6">
                                    </ul>
                                </div>

                                {/* Arrow */}
                                <div className={`absolute bottom-4 ${isRTL ? 'left-4' : 'right-4'}`}>
                                    <Icon 
                                        icon={isRTL ? "material-symbols:arrow-back" : "material-symbols:arrow-forward"} 
                                        className={`w-6 h-6 transition-colors ${
                                            selectedRole === role.id ? 'text-brand-orange' : 'text-gray-400'
                                        }`}
                                        width={24}
                                        height={24}
                                    />
                                </div>
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Already have account */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-center"
                >
                    <p className="text-gray-600">
                        {t("auth.alreadyHaveAccount") || "Already have an account?"}{" "}
                        <button
                            onClick={() => router.push("/login")}
                            className="text-brand-orange hover:text-brand-orange/90 font-semibold underline"
                        >
                            <span suppressHydrationWarning>{t("auth.login") || "Login"}</span>
                        </button>
                    </p>
                </motion.div>

                {/* Help Text */}
                <div className="mt-12 max-w-3xl mx-auto">
                    <div className="bg-brand-light-orange-1 border border-brand-pastel-gray-purple-1 rounded-xl p-6">
                        <div className="flex items-start">
                            <Icon 
                                icon="material-symbols:info" 
                                className="w-6 h-6 text-brand-pastel-gray-purple-1 mr-3 mt-0.5 flex-shrink-0" 
                                width={24}
                                height={24}
                            />
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    {t("auth.needHelp") || "Need help choosing?"}
                                </h3>
                                <p className="text-sm text-gray-800 leading-relaxed">
                                    {t("auth.roleHelpText") || "Choose 'Guest' if you want to attend events. Choose 'Host' if you want to create and manage your own events. You can always upgrade to a Host account later!"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

