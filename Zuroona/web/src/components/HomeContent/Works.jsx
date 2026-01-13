"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { IoPlayCircleOutline } from "react-icons/io5";
import { motion } from "framer-motion";

// Video data - single featured video (will be localized in component)
const getVideoData = (t) => ({
    id: 1,
    title: t("home.howToUseTitle"),
    description: t("home.howToUseDescription"),
    thumbnail: "/assets/images/home/video-thumb1.jpg",
    youtubeId: "YOUR_YOUTUBE_ID_1", // Replace with actual YouTube video ID
});

export default function Works() {
    const { t } = useTranslation();
    const [activeVideo, setActiveVideo] = useState(null);
    const videoData = getVideoData(t);

    const VideoModal = ({ videoId, onClose }) => (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black/80">
            <div className="relative w-full max-w-4xl bg-black aspect-video">
                <button 
                    onClick={onClose}
                    className="absolute -top-10 right-0 text-white hover:text-brand-gray-purple-2 text-xl"
                >
                    ✕
                </button>
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                />
            </div>
        </div>
    );

    // Floating particles animation - use deterministic values to prevent hydration mismatch
    const particleVariants = {
        animate: (i) => {
            // Use index-based deterministic offset instead of Math.random()
            const offset = (i * 2.5) % 20 - 10; // Deterministic value based on index
            return {
                y: [0, -30, 0],
                x: [0, offset, 0],
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
                transition: {
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                },
            };
        },
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                staggerChildren: 0.2,
            },
        },
    };

    const titleVariants = {
        hidden: { opacity: 0, y: -30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    const phoneVariants = {
        hidden: { 
            opacity: 0, 
            scale: 0.8,
            rotateY: -20,
        },
        visible: {
            opacity: 1,
            scale: 1,
            rotateY: 0,
            transition: {
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    return (
        <>
            <section className="relative py-16 md:py-20 lg:py-24 overflow-hidden bg-gradient-to-br from-white via-purple-50/30 to-white">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Gradient Orbs */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.2, 0.1],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.1, 0.15, 0.1],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1,
                        }}
                        className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-300 rounded-full blur-3xl"
                    />
                    
                    {/* Floating Particles */}
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            custom={i}
                            variants={particleVariants}
                            animate="animate"
                            className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full"
                            style={{
                                left: `${10 + i * 12}%`,
                                top: `${20 + (i % 3) * 25}%`,
                            }}
                        />
                    ))}
                </div>
                
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    variants={containerVariants}
                    className="relative px-4 mx-auto max-w-7xl md:px-8 xl:px-28"
                >
                    {/* Professional Section Header */}
                    <motion.div variants={titleVariants} className="mb-12 text-center md:mb-16">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 mb-3 text-[#a797cc] font-medium"
                        >
                            <span className="w-8 h-[2px] bg-[#a797cc]"></span>
                            <span>{t("home.howToUseTitle")}</span>
                            <span className="w-8 h-[2px] bg-[#a797cc]"></span>
                        </motion.div>
                        
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="mb-4 text-3xl font-bold tracking-tight text-gray-800 md:text-4xl lg:text-5xl drop-shadow-sm"
                        >
                            {t("home.howToUseTitle")}
                        </motion.h2>
                        
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="mx-auto mb-6 text-base leading-relaxed text-gray-700 max-w-2xl md:text-lg"
                        >
                            {t("home.howToUseDescription")}
                        </motion.p>
                        
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="flex items-center justify-center gap-2"
                        >
                            <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-[#a797cc]"></div>
                            <div className="h-1 w-1.5 bg-[#a797cc] rounded-full"></div>
                            <div className="h-0.5 w-24 bg-gradient-to-r from-[#a797cc] via-[#b0a0df] to-[#a797cc]"></div>
                            <div className="h-1 w-1.5 bg-[#a797cc] rounded-full"></div>
                            <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-[#a797cc]"></div>
                        </motion.div>
                    </motion.div>

                    {/* Premium App Demo Image Container with Ultra Animations */}
                    <div className="flex justify-center perspective-1000">
                        <motion.div
                            variants={phoneVariants}
                            className="relative w-full max-w-[180px] sm:max-w-[220px] md:max-w-[260px]"
                            style={{ transformStyle: "preserve-3d" }}
                            whileHover={{ 
                                scale: 1.05,
                                rotateY: 5,
                                transition: { duration: 0.4 }
                            }}
                        >
                            {/* Outer Glow Effect with Animation */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute -inset-6 bg-gradient-to-r from-[#a797cc]/30 via-[#c4b5e8]/30 to-[#a797cc]/30 rounded-3xl blur-2xl"
                            />
                            
                            {/* Rotating Ring Effect */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="absolute -inset-2 opacity-40"
                            >
                                <div className="w-full h-full border-2 border-dashed border-purple-300 rounded-3xl"></div>
                            </motion.div>
                            
                            {/* Main Container with Premium Styling */}
                            <motion.div
                                whileHover={{ boxShadow: "0 30px 80px -20px rgba(167,151,204,0.6)" }}
                                className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-2xl transition-all duration-500 group"
                            >
                                {/* Multi-layer Animated Background */}
                                <motion.div 
                                    animate={{
                                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                                    }}
                                    transition={{
                                        duration: 15,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                    className="absolute inset-0 rounded-xl md:rounded-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, #a797cc 0%, #c4b5e8 25%, #e8dff5 50%, #c4b5e8 75%, #a797cc 100%)',
                                        backgroundSize: '200% 200%',
                                    }}
                                />
                                
                                {/* Animated Purple Glow Layers */}
                                <motion.div 
                                    animate={{
                                        opacity: [0.2, 0.5, 0.2],
                                        scale: [1, 1.05, 1],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute inset-0 rounded-xl md:rounded-2xl"
                                    style={{
                                        background: 'radial-gradient(circle at 30% 50%, #b8a8d8 0%, transparent 60%), radial-gradient(circle at 70% 50%, #d4c5f0 0%, transparent 60%)',
                                    }}
                                />
                                
                                {/* Premium Image Container with Glassmorphism */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative rounded-lg md:rounded-xl overflow-hidden m-1 md:m-1.5 bg-white/20 backdrop-blur-md border border-white/30 shadow-inner"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                    <Image
                                        src="/assets/images/appdemo.jpg"
                                        alt={t("home.howToUseTitle")}
                                        width={250}
                                        height={188}
                                            className="w-full h-auto object-cover rounded-lg md:rounded-xl relative z-10"
                                        priority
                                    />
                                    </motion.div>
                                    
                                    {/* Premium Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent rounded-lg md:rounded-xl z-20 pointer-events-none"></div>
                                    
                                    {/* Shine Effect on Hover */}
                                    <motion.div
                                        initial={{ x: '-100%' }}
                                        whileHover={{ x: '100%' }}
                                        transition={{ duration: 0.8 }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-lg md:rounded-xl z-30"
                                    />
                                </motion.div>
                                
                                {/* Premium Animated Decorative Elements */}
                                <motion.div
                                    animate={{
                                        y: [0, -10, 0],
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute -top-1 -left-1 w-4 h-4 bg-gradient-to-br from-[#a797cc] to-[#c4b5e8] rounded-full blur-sm opacity-60 shadow-lg shadow-[#a797cc]/50"
                                />
                                <motion.div 
                                    animate={{
                                        y: [0, 10, 0],
                                        scale: [1, 1.3, 1],
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 1,
                                    }}
                                    className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-[#8b7bb8] to-[#a797cc] rounded-full blur-md opacity-60 shadow-lg shadow-[#8b7bb8]/50"
                                />
                                
                                {/* Pulsing Corner Accents */}
                                {[
                                    { top: '8px', left: '8px' },
                                    { top: '8px', right: '8px' },
                                    { bottom: '8px', left: '8px' },
                                    { bottom: '8px', right: '8px' },
                                ].map((position, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            scale: [1, 1.5, 1],
                                            opacity: [0.4, 0.8, 0.4],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: i * 0.5,
                                        }}
                                        className="absolute w-1.5 h-1.5 bg-[#a797cc] rounded-full"
                                        style={position}
                                    />
                                ))}
                            </motion.div>
                            
                            {/* Orbiting Particles */}
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        rotate: 360,
                                    }}
                                    transition={{
                                        duration: 10 + i * 2,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                    className="absolute inset-0"
                                    style={{
                                        transformOrigin: 'center',
                                    }}
                                >
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.3, 0.6, 0.3],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: i * 0.7,
                                        }}
                                        className="absolute w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-sm"
                                        style={{
                                            top: i === 0 ? '-10px' : i === 1 ? '50%' : 'auto',
                                            bottom: i === 2 ? '-10px' : 'auto',
                                            right: '-10px',
                                        }}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>

                {/* Video modal */}
                {activeVideo && (
                    <VideoModal 
                        videoId={activeVideo} 
                        onClose={() => setActiveVideo(null)} 
                    />
                )}
            </section>
        </>
    );
}
