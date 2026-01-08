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
        <div className="relative min-h-screen bg-white overflow-x-visible overflow-y-hidden">
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
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4"/>
                    </svg>
                </div>
                <div className="absolute bottom-32 right-16 w-20 h-20 opacity-15 transform rotate-45">
                    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-[#a797cc]">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4"/>
                    </svg>
                </div>
                <div className="absolute top-1/2 left-1/4 w-12 h-12 opacity-10 transform -rotate-12">
                    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-[#a797cc]">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3"/>
                    </svg>
                </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute left-10 top-20 w-24 h-24 bg-brand-light-orange-1 rounded-full opacity-60 blur-3xl"></div>
            <div className="absolute right-10 bottom-20 w-32 h-32 bg-brand-light-orange-1 rounded-full opacity-40 blur-3xl"></div>
            
            <Header />

            <main className="container relative flex items-center justify-center min-h-[calc(100vh-80px)] px-4 mx-auto overflow-visible pt-20">
                <div className="relative w-full max-w-6xl overflow-visible">
                    {/* Dotted Arrow Line Image - Positioned to the right of heading */}
                    <div className="absolute right-0 top-[5%] translate-x-[60%] md:translate-x-[55%] lg:translate-x-[45%] hidden md:block z-1 overflow-visible">
                        <Image
                            src="/assets/images/dotedArrow line.jpeg"
                            alt="Decorative arrow"
                            width={190}
                            height={420}
                            className="w-auto h-[380px] md:h-[480px] lg:h-[560px] object-contain opacity-30 transform scale-x-[-1]"
                            priority
                        />
                    </div>

                    <div className="mx-auto max-w-4xl text-center">
                        {/* Welcome Tag */}
                        <span className="text-4xl md:text-5xl font-semibold text-[#a797cc] mb-6">
                                {t('home.welcome')}
                            </span>

                        {/* Main Heading */}
                        <h1 className="mb-6 text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-gray-900">
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
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mx-auto max-w-3xl">
                            {[
                                { value: '100+', label: t('users') || 'Users', icon: 'clarity:users-line' },
                                { value: '100+', label: t('home.events') || 'Events', icon: 'material-symbols:event' },
                                { value: '100+', label: t('hosts') || 'Hosts', icon: 'material-symbols:groups' },
                                { value: '10+', label: t('cities') || 'Cities', icon: 'material-symbols:location-city' },
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
