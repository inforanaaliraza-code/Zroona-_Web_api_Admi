"use client";

import { useTranslation } from "react-i18next";
import { eventCategories } from "@/data/eventCategories";
import { useState } from "react";
import { Icon } from '@iconify/react';

export default function Categories() {
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const [activeSection, setActiveSection] = useState('joinUs'); // 'joinUs' or 'welcomeEvents'

    const currentCategories = eventCategories[activeSection][currentLanguage];

    return (
        <section className="relative py-24 bg-gray-50">
            <div className="relative px-4 mx-auto md:px-8 xl:px-28">
                {/* Modern Section Header */}
                <div className="flex flex-col items-center mb-16 text-center">
                    <div className="inline-flex items-center gap-2 mb-3 text-[#a797cc] font-medium">
                        <span className="w-8 h-[2px] bg-[#a797cc]"></span>
                        <span>{t('home.discover')}</span>
                        <span className="w-8 h-[2px] bg-[#a797cc]"></span>
                    </div>
                    <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
                        {t('home.tab5')}
                    </h2>
                </div>
                {/* Categories Grid */}
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6">
                    {currentCategories.map((category, index) => (
                        <div 
                            key={index}
                            className="group"
                        >
                            <div className="relative h-[200px] rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
                                {/* Card content */}
                                <div className="flex flex-col justify-center items-center p-6 h-full">
                                    {/* Icon container with colored background */}
                                    <div className="relative mb-5">
                                        <div className="w-20 h-20 bg-[#a797cc] rounded-2xl 
                                            flex items-center justify-center transform transition-all duration-500 
                                            group-hover:scale-110 group-hover:rotate-3">
                                            <Icon 
                                                icon={category.icon}
                                                className="w-10 h-10 text-white"
                                            />
                                        </div>
                                    </div>

                                    {/* Category name */}
                                    <h3 className="text-sm font-medium text-gray-800 text-center 
                                        group-hover:text-[#a797cc] transition-colors duration-300">
                                        {category.name}
                                    </h3>

                                    {/* Decorative elements */}
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#a797cc]/5 rounded-full 
                                        transform translate-x-12 -translate-y-12 group-hover:translate-x-8 
                                        transition-transform duration-500"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#a797cc]/5 rounded-full 
                                        transform -translate-x-12 translate-y-12 group-hover:-translate-x-8 
                                        transition-transform duration-500"></div>
                                </div>

                                {/* Bottom indicator */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r 
                                    from-transparent via-[#a797cc] to-transparent scale-x-0 group-hover:scale-x-100 
                                    transition-transform duration-500 origin-center"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
