"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { IoPlayCircleOutline } from "react-icons/io5";

// Video data - single featured video
const videoData = {
    id: 1,
    title: "How to Use Zuroona App",
    description: "Learn the basics of using Zuroona app to discover and join events",
    thumbnail: "/assets/images/home/video-thumb1.jpg",
    youtubeId: "YOUR_YOUTUBE_ID_1", // Replace with actual YouTube video ID
};

export default function Works() {
    const { t } = useTranslation();
    const [activeVideo, setActiveVideo] = useState(null);

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

    return (
        <>
            {/* <section className="pb-12">
                <div className="px-4 mx-auto md:px-8 xl:px-28">
                    <h1 className="mb-6 text-2xl font-bold sm:text-3xl lg:text-4xl">{t('home.tab7')}</h1>
                    <div className="grid grid-cols-1 gap-y-8 md:grid-cols-2 md:gap-x-16">
                        <div className="relative w-full">
                            <Image
                                src="/assets/images/home/banner1.png"
                                alt="Banner 1"
                                height={298}
                                width={628}
                                className="w-full"
                            />
                            <Link
                                href=""
                                className="absolute right-5 md:right-10 bottom-5 md:bottom-10 z-10 underline text-[#f47c0c] text-xs sm:text-sm font-semibold"
                            >
                                {t('home.tab10')}
                            </Link>
                        </div>

                        <div className="relative w-full">
                            <Image
                                src="/assets/images/home/banner2.png"
                                alt="Banner 2"
                                height={298}
                                width={628}
                                className="w-full"
                            />
                            <Link
                                href="/organizerSignup"
                                className="absolute right-5 bottom-5 z-10 text-xs font-semibold text-blue-800 underline md:right-10 md:bottom-10 sm:text-sm"
                            >
                                {t('home.tab9')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section> */}

            <section className="relative py-20 bg-gray-50">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50"></div>
                
                <div className="relative px-4 mx-auto md:px-8 xl:px-28">
                    {/* Section header */}
                    <div className="mb-12 text-center md:mb-16">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                            {t('home.tab7')}
                        </h2>
                        <div className="h-1 w-20 bg-brand-gray-purple-2 mx-auto rounded-full"></div>
                    </div>

                    {/* Single Video - Centered */}
                    <div className="flex justify-center">
                        <div className="w-full max-w-3xl overflow-hidden relative rounded-2xl shadow-lg transition-all duration-300 group hover:shadow-xl">
                            {/* Video thumbnail */}
                            <div className="relative bg-gray-900 aspect-video">
                                <img
                                    src={videoData.thumbnail}
                                    alt={videoData.title}
                                    className="object-cover w-full h-full opacity-90 transition-opacity duration-300 group-hover:opacity-70"
                                />
                                {/* Play button */}
                                <button
                                    onClick={() => setActiveVideo(videoData.youtubeId)}
                                    className="flex absolute inset-0 justify-center items-center"
                                >
                                    <IoPlayCircleOutline className="text-white text-6xl md:text-7xl opacity-90 
                                        group-hover:text-brand-gray-purple-2 group-hover:scale-110 transition-all duration-300" />
                                </button>
                            </div>
                            
                            {/* Video info */}
                            <div className="p-6 bg-white text-center">
                                <h3 className="mb-2 text-xl md:text-2xl font-semibold text-gray-900">
                                    {videoData.title}
                                </h3>
                                <p className="text-gray-600">
                                    {videoData.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

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
