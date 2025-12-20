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
        <div className="relative min-h-screen bg-gradient-to-b from-white via-white to-orange-50/30">
            {/* Background Pattern */}
            <div className="fixed inset-0 bg-[url('/assets/images/home/bg-img.png')] bg-cover bg-center opacity-5 -z-10"></div>
            
            {/* Decorative Elements */}
            <div className="absolute left-10 top-20 w-24 h-24 bg-brand-light-orange-1 rounded-full opacity-60 blur-3xl"></div>
            <div className="absolute right-10 bottom-20 w-32 h-32 bg-brand-light-orange-1 rounded-full opacity-40 blur-3xl"></div>
            
            <Header />

            <main className="container relative flex items-center justify-center min-h-[calc(100vh-80px)] px-4 mx-auto">
                <div className="mx-auto max-w-4xl text-center">
                    {/* Welcome Tag */}
                    <span className="text-3xl font-semibold text-brand-orange mb-6">
                            {t('home.welcome')}
                        </span>

                    {/* Main Heading */}
                    <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-6xl lg:text-7xl">
                        {t('home.slogan')}
                    </h1>

                    {/* Description */}
                    <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-600">
                        {t('home.tab4')}
                    </p>

                    {/* CTA Button */}
                    {/* <div className="flex justify-center mb-16">
                        <Link 
                            href="/events"
                            className="group bg-primary px-8 py-4 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-primary/50 hover:-translate-y-0.5 transition-all"
                        >
                            <span className="flex gap-3 items-center text-lg">
                                <Icon 
                                    icon={isRTL ? "material-symbols:arrow-forward" : "material-symbols:arrow-back"} 
                                    className="w-6 h-6 transition-transform group-hover:translate-x-1" 
                                />
                                <span>{t('home.discoverEvents')}</span>
                            </span>
                        </Link>
                    </div> */}

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 mx-auto max-w-3xl">
                        {[
                            { value: '100+', label: t('home.organizers'), icon: 'material-symbols:groups' },
                            { value: '100+', label: t('home.saudi'), icon: 'clarity:users-line' },
                            { value: '50+', label: t('home.events'), icon: 'material-symbols:event' },
                        ].map((stat, index) => (
                            <div key={index} className="p-6 rounded-2xl backdrop-blur-sm transition-all bg-white/70 hover:bg-white/90 hover:shadow-lg hover:-translate-y-0.5 group">
                                {renderStatIcon(stat)}
                                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-orange mb-2">{stat.value}</div>
                                <div className="text-base font-medium text-gray-600 md:text-lg">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HeroSection;
