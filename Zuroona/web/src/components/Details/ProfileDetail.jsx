"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useState, useMemo, useEffect } from "react";
import { Icon } from "@iconify/react";
import { BASE_API_URL } from "@/until";
import { useRTL } from "@/utils/rtl";

const ProfileDetail = ({ profile, showJoinButton, showEventStatus }) => {
    const { t, i18n } = useTranslation();
    const { isRTL } = useRTL();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightboxImageIndex, setLightboxImageIndex] = useState(0);

    // Helper function to check if image URL is external
    const isExternalImage = (url) => {
        if (!url) return false;
        return url.startsWith("http://") || url.startsWith("https://");
    };

    // Helper function to get proper image URL
    const getImageUrl = (imgPath) => {
        if (!imgPath) return "/assets/images/home/dummyImage.png";
        if (imgPath.includes("http://") || imgPath.includes("https://")) return imgPath;
        if (imgPath.startsWith("/uploads/")) {
            const apiBase = BASE_API_URL.replace('/api/', '');
            return `${apiBase}${imgPath}`;
        }
        if (imgPath.startsWith("/")) {
            const apiBase = BASE_API_URL.replace('/api/', '');
            return `${apiBase}${imgPath}`;
        }
        return "/assets/images/home/dummyImage.png";
    };

    // Get all event images
    const images = useMemo(() => {
        const imgArray = [];
        if (profile?.event_images && Array.isArray(profile.event_images) && profile.event_images.length > 0) {
            imgArray.push(...profile.event_images.map(img => getImageUrl(img)));
        } else if (profile?.event_image) {
            imgArray.push(getImageUrl(profile.event_image));
        }
        // Ensure we have at least one image
        if (imgArray.length === 0) {
            imgArray.push("/assets/images/home/dummyImage.png");
        }
        return imgArray;
    }, [profile?.event_images, profile?.event_image]);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const previousImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const openLightbox = (index) => {
        setLightboxImageIndex(index);
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
    };

    const nextLightboxImage = () => {
        setLightboxImageIndex((prev) => (prev + 1) % images.length);
    };

    const previousLightboxImage = () => {
        setLightboxImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // Handle keyboard navigation in lightbox
    useEffect(() => {
        if (!isLightboxOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                setLightboxImageIndex((prev) => (prev - 1 + images.length) % images.length);
            } else if (e.key === 'ArrowRight') {
                setLightboxImageIndex((prev) => (prev + 1) % images.length);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, images.length]);

    return (
        <>
            {/* Header Section - Professional Design */}
            <div className={`bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6 border border-gray-100 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                <div className={`flex flex-col md:flex-row md:items-start gap-4 mb-6 ${isRTL ? 'md:flex-row-reverse md:justify-between' : 'md:justify-between'}`}>
                    <div className="flex-1">
                        <h1 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight ${isRTL ? 'text-right' : 'text-left'}`}>
                            {profile?.event_name}
                        </h1>
                        <div className={`flex flex-wrap items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className={`inline-flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <Icon icon="lucide:map-pin" className="w-5 h-5 text-[#a797cc] flex-shrink-0" />
                                <span className="text-sm font-medium">{profile?.event_address}</span>
                            </span>
                            {showJoinButton && (
                                <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#a797cc] to-[#8ba179] text-white rounded-lg text-sm font-semibold shadow-md">
                                    {profile?.event_type === 1
                                        ? t('detail.tab32')
                                        : profile?.event_type === 2
                                            ? t('detail.tab33')
                                            : t('detail.tab34')
                                    }
                                </span>
                            )}
                            {showEventStatus && (
                                <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold shadow-md
                                      ${profile?.book_details?.book_status === 1
                                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'
                                        : profile?.book_details?.book_status === 2
                                            ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                                            : 'bg-gradient-to-r from-red-400 to-red-500 text-white'
                                    }
                                `}>
                                    {profile?.book_details?.book_status === 1
                                        ? t('card.default')
                                        : profile?.book_details?.book_status === 2
                                            ? t('detail.tab52')
                                            : t('detail.tab53')
                                    }
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Professional Event Image Gallery */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Main Image Display - Clickable for preview */}
                    <div 
                        className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gray-100 cursor-pointer group"
                        onClick={() => openLightbox(currentImageIndex)}
                    >
                        <Image
                            src={images[currentImageIndex]}
                            alt={profile?.event_name || "Event Image"}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            priority
                            unoptimized={isExternalImage(images[currentImageIndex])}
                            onError={(e) => {
                                e.target.src = "/assets/images/home/dummyImage.png";
                            }}
                        />
                        {/* Click to preview overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                            <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <Icon icon="lucide:maximize-2" className="w-5 h-5" />
                                <span className="text-sm font-medium">{t('detail.tab44')}</span>
                            </div>
                        </div>
                        
                        {/* Navigation Buttons - Only show if multiple images */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={previousImage}
                                    className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all z-10 backdrop-blur-sm`}
                                    aria-label="Previous Image"
                                >
                                    <Icon icon={isRTL ? "lucide:chevron-right" : "lucide:chevron-left"} className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all z-10 backdrop-blur-sm`}
                                    aria-label="Next Image"
                                >
                                    <Icon icon={isRTL ? "lucide:chevron-left" : "lucide:chevron-right"} className="w-6 h-6" />
                                </button>
                                
                                {/* Image Counter */}
                                <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium z-10`}>
                                    {currentImageIndex + 1} / {images.length}
                                </div>
                                
                                {/* Dots Indicator */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                    {images.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                                                index === currentImageIndex
                                                    ? "bg-white w-8"
                                                    : "bg-white/50 hover:bg-white/75"
                                            }`}
                                            aria-label={`Go to image ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    
                    {/* Thumbnail Gallery - Show if multiple images */}
                    {images.length > 1 && (
                        <div className={`p-4 bg-gray-50 border-t border-gray-200 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                            <div className={`flex items-center mb-3 ${isRTL ? 'flex-row-reverse justify-between' : 'justify-between'}`}>
                                <p className="text-sm font-semibold text-gray-700">
                                    {t('detail.tab42')} ({images.length})
                                </p>
                                <p className="text-xs text-gray-500">
                                    {t('detail.tab43')}
                                </p>
                            </div>
                            <div className="grid grid-cols-6 gap-2">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setCurrentImageIndex(index);
                                            openLightbox(index);
                                        }}
                                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                                            index === currentImageIndex
                                                ? "border-[#a797cc] ring-2 ring-[#a797cc]/20 scale-105"
                                                : "border-gray-200 hover:border-gray-300 hover:scale-105"
                                        }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`Event image ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            unoptimized={isExternalImage(img)}
                                            onError={(e) => {
                                                e.target.src = "/assets/images/home/dummyImage.png";
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
            </div>

            {/* Event Description - Professional Card */}
            <div className={`bg-white rounded-2xl shadow-xl p-6 md:p-8 mt-6 border border-gray-100 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                <h2 className={`text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Icon icon="lucide:file-text" className="w-6 h-6 text-[#a797cc] flex-shrink-0" />
                    <span>{t('detail.tab38')}</span>
                </h2>
                <p className={`text-gray-700 leading-relaxed text-base whitespace-pre-wrap ${isRTL ? 'text-right' : 'text-left'}`}>
                    {profile?.event_description || t('events.noDescriptionAvailable')}
                </p>
            </div>

            {/* Requirements for the Event - Professional Design */}
            <div className={`bg-white rounded-2xl shadow-xl p-6 md:p-8 mt-6 border border-gray-100 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                <h2 className={`text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Icon icon="lucide:list-checks" className="w-6 h-6 text-[#a797cc] flex-shrink-0" />
                    <span>{t('detail.tab39')}</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile?.dos_instruction && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                            <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <Icon icon="lucide:check" className="w-5 h-5 text-white" />
                                </div>
                                <div className={isRTL ? 'text-right' : 'text-left'}>
                                    <h3 className="font-bold text-green-800 mb-2 text-sm">{t('detail.tab40')}</h3>
                                    <p className="text-gray-700 text-sm leading-relaxed">{profile.dos_instruction}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {profile?.do_not_instruction && (
                        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-5 border border-red-100">
                            <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                    <Icon icon="lucide:x" className="w-5 h-5 text-white" />
                                </div>
                                <div className={isRTL ? 'text-right' : 'text-left'}>
                                    <h3 className="font-bold text-red-800 mb-2 text-sm">{t('detail.tab41')}</h3>
                                    <p className="text-gray-700 text-sm leading-relaxed">{profile.do_not_instruction}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox Modal for Image Preview */}
            {isLightboxOpen && (
                <div 
                    className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4"
                    onClick={closeLightbox}
                >
                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-50 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all`}
                        aria-label="Close preview"
                    >
                        <Icon icon="lucide:x" className="w-6 h-6" />
                    </button>

                    {/* Main Image Container */}
                    <div 
                        className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={images[lightboxImageIndex]}
                            alt={`Event image ${lightboxImageIndex + 1}`}
                            width={1200}
                            height={800}
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                            unoptimized={isExternalImage(images[lightboxImageIndex])}
                            onError={(e) => {
                                e.target.src = "/assets/images/home/dummyImage.png";
                            }}
                        />

                        {/* Navigation Buttons */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        previousLightboxImage();
                                    }}
                                    className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all z-10`}
                                    aria-label="Previous Image"
                                >
                                    <Icon icon={isRTL ? "lucide:chevron-right" : "lucide:chevron-left"} className="w-8 h-8" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        nextLightboxImage();
                                    }}
                                    className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all z-10`}
                                    aria-label="Next Image"
                                >
                                    <Icon icon={isRTL ? "lucide:chevron-left" : "lucide:chevron-right"} className="w-8 h-8" />
                                </button>

                                {/* Image Counter */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full text-base font-medium z-10">
                                    {lightboxImageIndex + 1} / {images.length}
                                </div>

                                {/* Thumbnail Strip */}
                                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10 max-w-[90%] overflow-x-auto px-4 py-2 bg-black/30 backdrop-blur-sm rounded-lg">
                                    {images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setLightboxImageIndex(index);
                                            }}
                                            className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                                                index === lightboxImageIndex
                                                    ? "border-white scale-110"
                                                    : "border-white/30 hover:border-white/60"
                                            }`}
                                        >
                                            <Image
                                                src={img}
                                                alt={`Thumbnail ${index + 1}`}
                                                fill
                                                className="object-cover"
                                                unoptimized={isExternalImage(img)}
                                                onError={(e) => {
                                                    e.target.src = "/assets/images/home/dummyImage.png";
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfileDetail;
