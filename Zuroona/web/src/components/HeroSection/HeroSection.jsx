"use client";

import Image from 'next/image';
import Header from '../Header/Header';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/router';
import SaudiMapIcon from '../icons/SaudiMapIcon';

const HeroSection = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const renderStatIcon = (stat) => {
        if (stat.icon === 'saudi-map') {
            return <SaudiMapIcon className="w-10 h-10 text-brand-orange mb-4 mx-auto group-hover:scale-110 transition-transform" />;
        }
        return (
            <Icon
                icon={stat.icon}
                className="w-10 h-10 text-brand-orange mb-4 mx-auto group-hover:scale-110 transition-transform"
            />
        );
    };

    return (
        <div
            className="relative min-h-screen min-h-viewport bg-white overflow-hidden max-w-[100%] w-full flex flex-col m-0"
            style={{ minHeight: '100vh', margin: 0 }}
        >
            {/* Full-viewport white layer - removes black space at top/bottom on tablet */}
            <div className="fixed inset-0 w-full min-h-viewport h-viewport bg-white -z-20" aria-hidden="true" />
            {/* Background Pattern */}
            <div className="fixed inset-0 bg-[url('/assets/images/home/bg-img.png')] bg-cover bg-center opacity-5 -z-10"></div>

            {/* Dotted Arrows and Visual Cues Background */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                {/* Dotted pattern overlay */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `radial-gradient(circle, #a797cc 1px, transparent 1px)`,
                    backgroundSize: '30px 30px'
                }}></div>

                {/* Decorative arrows */}
                <div className="absolute top-20 left-10 w-16 h-16 opacity-20">
                    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-[#a797cc]">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4" />
                    </svg>
                </div>
                <div className="absolute bottom-32 right-16 w-20 h-20 opacity-15 transform rotate-45">
                    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-[#a797cc]">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4" />
                    </svg>
                </div>
                <div className="absolute top-1/2 left-1/4 w-12 h-12 opacity-10 transform -rotate-12">
                    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-[#a797cc]">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3" />
                    </svg>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute left-10 top-20 w-24 h-24 bg-brand-light-orange-1 rounded-full opacity-60 blur-3xl"></div>
            <div className="absolute right-10 bottom-20 w-32 h-32 bg-brand-light-orange-1 rounded-full opacity-40 blur-3xl"></div>

            <Header />

            <main
                className="container relative flex flex-1 items-center justify-center min-h-viewport-main min-h-[calc(100vh-72px)] px-4 mx-auto overflow-visible pt-2 md:pt-1 lg:pt-2"
            >
                <div className="relative w-full max-w-6xl overflow-visible flex flex-col md:min-h-full md:justify-between">
                    {/* Dotted Arrow Line Image - Positioned to the right of heading */}
                    <div className="absolute right-0 top-[5%] translate-x-[60%] md:translate-x-[55%] lg:translate-x-[45%] hidden lg:block z-1 overflow-visible">
                        <Image
                            src="/assets/images/dotedArrow line.jpeg"
                            alt="Decorative arrow"
                            width={190}
                            height={420}
                            className="w-auto h-[380px] md:h-[480px] lg:h-[560px] object-contain opacity-30 transform scale-x-[-1]"
                            priority
                        />
                    </div>

                    <div className="mx-auto max-w-4xl text-center flex flex-col md:flex-grow md:justify-between md:gap-8">
                        {/* Top block: welcome + headline + description */}
                        <div>
                            <span className="text-4xl md:text-5xl font-semibold text-[#a797cc] mb-6 block">
                                {t('home.welcome')}
                            </span>
                            <h1 className="mb-6 text-4xl md:text-7xl lg:text-8xl font-bold leading-tight text-gray-900">
                                {t('home.slogan')}
                            </h1>
                            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-600 md:mb-0">
                                {t('home.tab4')}
                            </p>
                        </div>

                        {/* Stats - localized (eventsMain.* and home.events) - sits at bottom on tablet */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mx-auto max-w-3xl">
                            {[
                                { value: '100+', label: t('eventsMain.users') || t('home.saudi') || 'Users', icon: 'clarity:users-line' },
                                { value: '100+', label: t('home.events') || 'Active Events', icon: 'material-symbols:event' },
                                { value: '100+', label: t('eventsMain.hosts') || 'Hosts', icon: 'material-symbols:groups' },
                                { value: '10+', label: t('eventsMain.cities') || 'Cities', icon: 'material-symbols:location-city' },
                            ].map((stat, index) => (
                                <div key={index} className="p-6 rounded-2xl backdrop-blur-sm transition-all bg-white/70 hover:bg-white/90 hover:shadow-lg hover:-translate-y-0.5 group">
                                    {renderStatIcon(stat)}
                                    <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-orange mb-2">{stat.value}</div>
                                    <div className="text-base font-medium text-gray-600 md:text-lg">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HeroSection;
