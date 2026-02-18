"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { IoLocationOutline, IoMailOutline, IoCallOutline, IoCloseOutline } from "react-icons/io5";
import { FaTiktok, FaInstagram, FaSnapchatGhost, FaFacebook } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { useRTL } from "@/utils/rtl";
import AboutUsModal from "../Modal/AboutUsModal";
import TermsOfServiceModal from "../Modal/TermsOfServiceModal";
import PrivacyPolicyModal from "../Modal/PrivacyPolicyModal";


export default function Footer() {
    const { t, i18n } = useTranslation();
    const { textAlign } = useRTL();
    const [isAboutUsModalOpen, setIsAboutUsModalOpen] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

    return (
        <>
        <footer className="overflow-hidden relative text-white bg-gray-900">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,theme('colors.brand-orange')1a,transparent_70%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,theme('colors.brand-orange')1a,transparent_70%)]"></div>

            <div className="relative px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 md:py-16">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                    {/* Brand Section */}
                    <div className="gap-y-4">
                        <Image
                            src="/assets/images/x_F_logo.png"
                            alt="Zuroona Logo"
                            width={200}
                            height={60}
                            className="mb-6"
                        />
                        <p className={`max-w-sm text-sm text-gray-400 leading-relaxed ${textAlign}`} style={{ textAlign: 'justify', textJustify: 'inter-word', hyphens: 'auto' }}>
                            {t("footer.tab2")}
                        </p>
                        {/* Social Icons */}
                        <div className="flex gap-4 pt-4 flex-wrap">
                            <a 
                                href="https://www.instagram.com/zuroona?igsh=MXJvN2s4ZHlvNGR3aQ%3D%3D&utm_source=qr" 
                                className="text-gray-400 hover:text-brand-orange transition-colors" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="Follow us on Instagram"
                            >
                                <FaInstagram className="text-xl" />
                            </a>
                            <a 
                                href="https://x.com/zuroonaksa?s=11&t=cwvlmHDPVC7mbsMLpqJFkQ" 
                                className="text-gray-400 hover:text-brand-orange transition-colors" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="Follow us on X (Twitter)"
                            >
                                <RiTwitterXFill className="text-xl" />
                            </a>
                            <a 
                                href="https://www.tiktok.com/@zuroona?_t=ZN-90tyaX4DPnS&_r=1" 
                                className="text-gray-400 hover:text-brand-orange transition-colors" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="Follow us on TikTok"
                            >
                                <FaTiktok className="text-xl" />
                            </a>
                            <a 
                                href="https://snapchat.com/t/IQxxW6dK" 
                                className="text-gray-400 hover:text-brand-orange transition-colors" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="Add us on Snapchat"
                            >
                                <FaSnapchatGhost className="text-xl" />
                            </a>
                            <a 
                                href="https://www.facebook.com/share/1DbUJBjatB/?mibextid=wwXIfr" 
                                className="text-gray-400 hover:text-brand-orange transition-colors" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="Follow us on Facebook"
                            >
                                <FaFacebook className="text-xl" />
                            </a>
                        </div>
                    </div>

                    {/* Legal Links */}
                    <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold text-brand-orange mb-6">{t("footer.tab5")}</h3>
                        <ul className="flex flex-col gap-3">
                            <li>
                                <button
                                    onClick={() => setIsAboutUsModalOpen(true)}
                                    className="text-gray-400 hover:text-brand-orange transition-colors text-left"
                                >
                                    {t("footer.tab6")}
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setIsTermsModalOpen(true)}
                                    className="text-gray-400 hover:text-brand-orange transition-colors text-left"
                                >
                                    {t("footer.tab19")}
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setIsPrivacyModalOpen(true)}
                                    className="text-gray-400 hover:text-brand-orange transition-colors text-left"
                                >
                                    {t("footer.tab18")}
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* About Zuroona Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-brand-orange mb-6">{t("footer.tab6")}</h3>
                        <ul className="flex flex-col gap-4">
                            <li className="flex gap-3 items-center">
                                <IoLocationOutline className="text-brand-orange text-xl flex-shrink-0 mt-1" />
                                <span className="text-sm text-gray-400">{t("footer.tab24")}</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <IoCallOutline className="text-brand-orange text-xl flex-shrink-0" />
                                <span className="text-gray-400" dir="ltr">+966 59 172 7589</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <IoMailOutline className="text-brand-orange text-xl flex-shrink-0" />
                                <span className="text-gray-400">infozuroona@gmail.com</span>
                            </li>
                        </ul>
                        {/* App Store Buttons - link to app download page */}
                        <div className="mt-6 flex flex-col gap-3">
                            <Link
                                href="/download-app"
                                className="inline-block transition-opacity duration-300 transform hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg"
                                aria-label={t("footer.getOnGooglePlay") || "Get it on Google Play"}
                            >
                                <Image
                                    src="/assets/images/play_Final_ali.png"
                                    alt={t("footer.getOnGooglePlay") || "Get it on Google Play"}
                                    width={200}
                                    height={60}
                                    className="h-auto"
                                />
                            </Link>
                            <Link
                                href="/download-app"
                                className="inline-block transition-opacity duration-300 transform hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg"
                                aria-label={t("footer.downloadOnAppStore") || "Download on the App Store"}
                            >
                                <Image
                                    src="/assets/images/iphone_final_ali.png"
                                    alt={t("footer.downloadOnAppStore") || "Download on the App Store"}
                                    width={200}
                                    height={60}
                                    className="h-auto"
                                />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Commercial License */}
                <div className="pt-8 mt-12 border-t border-gray-800">
                    <p className="text-sm text-center text-gray-400">
                        {i18n.language === 'ar'
                            ? t("auth.commercialLicenseAr") || "١٠٠٩١٠٧١٠١ شركة واحة الاستكشاف المحدودة"
                            : t("auth.commercialLicense") || "Commercial License: 1009107101, Oasis Exploration Company Limited."}
                    </p>
                </div>

            </div>
        </footer>
        <AboutUsModal isOpen={isAboutUsModalOpen} onClose={() => setIsAboutUsModalOpen(false)} />
        <TermsOfServiceModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />
        <PrivacyPolicyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
    </>
    );
}
