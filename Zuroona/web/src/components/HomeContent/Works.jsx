"use client";

import { useTranslation } from "react-i18next";

export default function Works() {
    const { t } = useTranslation();

    // YouTube video ID from https://youtu.be/WNjUOq-MM0Y
    const YOUTUBE_VIDEO_ID = "WNjUOq-MM0Y";

    return (
        <section className="relative py-16 md:py-20 lg:py-24 bg-gradient-to-br from-white via-purple-50/20 to-white">
            <div className="relative px-4 mx-auto max-w-7xl md:px-8 xl:px-28">
                {/* Section Header */}
                <div className="mb-12 text-center md:mb-16">
                    <div className="inline-flex items-center gap-2 mb-3 text-[#a797cc] font-medium">
                        <span className="w-8 h-[2px] bg-[#a797cc]"></span>
                        <span>{t("home.meet")}</span>
                        <span className="w-8 h-[2px] bg-[#a797cc]"></span>
                    </div>

                    <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-800 md:text-4xl lg:text-5xl">
                        {t("home.howToUseTitle")}
                    </h2>

                    <p className="mx-auto mb-6 text-base leading-relaxed text-gray-700 max-w-2xl md:text-lg">
                        {t("home.howToUseDescription")}
                    </p>

                    <div className="flex items-center justify-center gap-2">
                        <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-[#a797cc]"></div>
                        <div className="h-1 w-1.5 bg-[#a797cc] rounded-full"></div>
                        <div className="h-0.5 w-24 bg-gradient-to-r from-[#a797cc] via-[#b0a0df] to-[#a797cc]"></div>
                        <div className="h-1 w-1.5 bg-[#a797cc] rounded-full"></div>
                        <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-[#a797cc]"></div>
                    </div>
                </div>

                {/* YouTube Video Embed */}
                <div className="flex justify-center">
                    <div className="w-full max-w-4xl">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                            {/* 16:9 Aspect Ratio Container */}
                            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                <iframe
                                    src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?rel=0&modestbranding=1`}
                                    title={t("home.howToUseTitle")}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="absolute top-0 left-0 w-full h-full"
                                    style={{ border: 'none' }}
                                />
                            </div>
                        </div>
                        
                        {/* Optional: Video Description */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                {t("home.watchVideo") || "Watch our introduction video to learn more about Zuroona"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
