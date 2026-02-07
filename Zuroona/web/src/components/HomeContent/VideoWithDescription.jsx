"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useRTL } from "@/utils/rtl";

export default function VideoWithDescription({ 
    videoId = "WNjUOq-MM0Y",
    description = null // Will use translation if not provided
}) {
    const { t, i18n } = useTranslation();
    const { isRTL } = useRTL({ i18n });
    const [isVisible, setIsVisible] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const sectionRef = useRef(null);

    // Use translation if description not provided
    const displayDescription = description || t("home.platformDescription");

    // Intersection Observer for scroll animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2,
            },
        },
    };

    const videoVariants = {
        hidden: { 
            opacity: 0, 
            x: isRTL ? 50 : -50,
            scale: 0.95 
        },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut",
            },
        },
    };

    const textVariants = {
        hidden: { 
            opacity: 0, 
            x: isRTL ? -50 : 50,
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
            },
        },
    };

    const handleVideoPlay = () => {
        setIsPlaying(true);
    };

    return (
        <section 
            ref={sectionRef}
            className="relative py-8 md:py-12 lg:py-16 bg-gradient-to-br from-white via-purple-50/30 to-white overflow-hidden"
        >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-[#a797cc]/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#a3cc69]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-[#a797cc]/3 to-[#a3cc69]/3 rounded-full blur-3xl"></div>
            </div>

            <div className="relative px-4 mx-auto max-w-7xl md:px-8 xl:px-28 z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
                >
                    {/* Video Section - Left */}
                    <motion.div
                        variants={videoVariants}
                        className={`order-2 lg:order-1 lg:col-span-7 ${isRTL ? 'lg:order-2' : ''}`}
                    >
                        <div className="relative group">
                            {/* Glow Effect */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-[#a797cc]/20 to-[#a3cc69]/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            {/* Video Container */}
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white transform transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-3xl">
                                {/* 16:9 Aspect Ratio Container */}
                                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                    <iframe
                                        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1`}
                                        title={t("home.discoverAuthenticTitle") || "Zuroona Platform Introduction"}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        className="absolute top-0 left-0 w-full h-full"
                                        style={{ border: 'none' }}
                                        onLoad={handleVideoPlay}
                                    />
                                    
                                    {/* Overlay Gradient on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                </div>

                                {/* Decorative Corner Elements */}
                                <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-[#a797cc] to-[#a3cc69] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform rotate-45"></div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-[#a3cc69] to-[#a797cc] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform rotate-45"></div>
                            </div>

                            {/* Video Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.5 }}
                                className="absolute -top-4 -right-4 bg-gradient-to-r from-[#a797cc] to-[#a3cc69] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-semibold"
                            >
                                <Icon icon="lucide:play-circle" className="w-5 h-5" />
                                <span>{t("home.watchVideo") || "Watch Video"}</span>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Text Description Section - Right */}
                    <motion.div
                        variants={textVariants}
                        className={`order-1 lg:order-2 lg:col-span-5 space-y-6 ${isRTL ? 'lg:order-1 text-right' : 'text-left'}`}
                    >
                        {/* Icon Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#a797cc]/10 to-[#a3cc69]/10 rounded-full border border-[#a797cc]/20"
                        >
                            <div className="w-2 h-2 bg-[#a797cc] rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-[#a797cc]">
                                {t("home.meetZuroona") || "Meet Zuroona"}
                            </span>
                        </motion.div>

                        {/* Title */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={isVisible ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.4 }}
                            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
                        >
                            {t("home.discoverAuthenticTitle") || t("home.howToUseTitle") || "Discover Authentic Saudi Experiences"}
                        </motion.h2>

                        {/* Description Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isVisible ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.6 }}
                            className="space-y-4"
                        >
                            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                                {displayDescription}
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
