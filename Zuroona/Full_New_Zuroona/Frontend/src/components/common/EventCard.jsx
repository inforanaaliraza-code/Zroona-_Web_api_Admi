"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useRTL } from '@/utils/rtl';
import { TOKEN_NAME, BASE_API_URL } from '@/until';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { showGreenTick } from '@/utils/toastHelpers';
import { AddBookNowApi } from '@/app/api/setting';

export default function EventCard({
    event,
    showEventType,
    showBookNow,
    BookNowBtn,
    showViewNow,
    showButton,
    btnName,
    showUser,
    setModalShow,
    setActionType,
    setSelectedOrganizer,
    categories = [] // Array of category objects with _id and name
}) {

    const { t, i18n } = useTranslation();
    const { isRTL } = useRTL({ i18n });
    
    // Helper function to check if image URL is external
    const isExternalImage = (url) => {
        if (!url) return false;
        return url.startsWith("http://") || url.startsWith("https://");
    };
    
    // State to track approval status
    const [status, setStatus] = useState(
        event.book_status === 2
            ? 'Approved'
            : event.book_status === 3
                ? 'Rejected'
                : event.payment_status === 0 && event.book_status === 2
                    ? t('events.noPay') || 'No Pay' // Show "No Pay" when book_status is 2 and payment_status is 0
                    : ''
    );
    const token = Cookies.get(TOKEN_NAME);
    const router = useRouter();
    const [isReserving, setIsReserving] = useState(false);

    // Handle accept button click
    const handleApprove = () => {
        setSelectedOrganizer(event._id);
        setActionType("approve");
        setModalShow(true);
    };

    const handleReject = () => {
        setSelectedOrganizer(event._id);
        setActionType("reject");
        setModalShow(true);
    };

    // Handle reservation button click
    const handleReservation = async () => {
        if (!token) {
            router.push(`/login?r=events/${event._id}`);
            return;
        }

        // If the event is already booked and approved, redirect to payment
        if (event.book_status === 2 && event.payment_status === 0) {
            // Redirect to payment page
            window.location.href = `/payment?id=${event._id}`;
            return;
        }

        // If the event is already booked and waiting for approval, show message
        if (event.book_status === 1) {
            toast.info(t('events.waitingForApproval'));
            return;
        }

        // If the event is rejected, show message
        if (event.book_status === 3) {
            toast.error(t('events.bookingRejected'));
            return;
        }

        // Otherwise, make a new reservation
        try {
            setIsReserving(true);
            const payload = {
                event_id: event._id,
                no_of_attendees: 1 // Default to 1 attendee
            };
            
            const response = await AddBookNowApi(payload);
            
            if (response.status) {
                showGreenTick();
                // Update the local state to reflect the pending status
                setStatus('Pending');
                // Update the event object to reflect the booking status
                event.book_status = 1;
            } else {
                toast.error(response.message || t('events.reservationFailed'));
            }
        } catch (error) {
            console.error('Reservation error:', error);
            toast.error(t('events.reservationFailed'));
        } finally {
            setIsReserving(false);
        }
    };

    return (
        <>
            <div className="relative bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden transition-all duration-300 cursor-pointer border border-gray-100 group h-full flex flex-col">
                <div className="relative h-[200px] overflow-hidden flex-shrink-0">
                    <Image
                        src={(() => {
                            const getImageUrl = (imgPath) => {
                                if (!imgPath) return "/assets/images/home/dummyImage.png";
                                
                                // If blob URL (for preview), return as is
                                if (imgPath.startsWith("blob:")) {
                                    return imgPath;
                                }
                                
                                // If already absolute URL (http/https) - includes Cloudinary URLs
                                if (imgPath.includes("http://") || imgPath.includes("https://")) {
                                    return imgPath;
                                }
                                
                                // If Cloudinary URL format (res.cloudinary.com)
                                if (imgPath.includes("res.cloudinary.com")) {
                                    return imgPath;
                                }
                                
                                // If relative path (starts with /uploads/), construct absolute URL
                                const apiBase = BASE_API_URL.replace('/api/', '');
                                
                                if (imgPath.startsWith("/uploads/")) {
                                    return `${apiBase}${imgPath}`;
                                }
                                
                                if (imgPath.includes("uploads/")) {
                                    const uploadsIndex = imgPath.indexOf("uploads/");
                                    return `${apiBase}/${imgPath.substring(uploadsIndex)}`;
                                }
                                
                                if (imgPath.startsWith("/")) {
                                    return `${apiBase}${imgPath}`;
                                }
                                
                                // Default fallback
                                return "/assets/images/home/dummyImage.png";
                            };
                            return getImageUrl(event.event_images?.[0] || event.event_image);
                        })()}
                        alt={event.title || event.event_name}
                        height={200}
                        width={405}
                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                        unoptimized={isExternalImage(event.event_images?.[0] || event.event_image)}
                        onError={(e) => {
                            e.target.src = "/assets/images/home/dummyImage.png";
                        }}
                    />
                    {/* Gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Cancelled Badge - Show when event is cancelled */}
                    {(event.is_cancelled === true || event.event_status === 'cancelled') && (
                        <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg z-10`}>
                            <Icon icon="lucide:x-circle" className="w-4 h-4" />
                            <span>{t('events.cancelled') || 'Cancelled'}</span>
                        </div>
                    )}
                    
                    {/* Date & Time Badge - Enhanced - Fixed overflow */}
                    <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} flex items-center gap-2 bg-black/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg max-w-[calc(100%-24px)]`}>
                        <Icon icon="lucide:calendar" className="w-4 h-4 text-white flex-shrink-0" />
                        <div className="flex items-center gap-1.5 truncate">
                            <span className="truncate">
                                {new Date(event.event_date).getDate()}{" "}
                                {new Date(event.event_date).toLocaleString(
                                    i18n.language || "en-US",
                                    {
                                        month: "short",
                                    }
                                )}{" "}
                                {new Date(event.event_date).getFullYear()}
                            </span>
                            <span className="text-white/70 flex-shrink-0">•</span>
                            <span className="truncate">
                                {new Date(`1970-01-01T${event.event_start_time}`).toLocaleTimeString(i18n.language || [], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="p-5 relative flex-1 flex flex-col">
                    {
                        showEventType && (
                            <div
                                className={`absolute top-3 ${isRTL ? 'right-5' : 'left-5'} flex items-center text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md z-10
                                    ${event?.event_type === 1
                                        ? 'bg-gradient-to-r from-[#a797cc] to-[#8ba179]'
                                        : event?.event_type === 2
                                            ? 'bg-gradient-to-r from-[#ff3b00] to-[#ff6b3d]'
                                            : ''
                                    }`}
                            >
                                {event?.event_type === 1
                                    ? t('tab.tab4')
                                    : event?.event_type === 2
                                        ? t('tab.tab5')
                                        : ''}
                            </div>
                        )
                    }
                    <div className='flex justify-between items-start gap-4 flex-1'>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg font-bold text-gray-900 mb-2.5 line-clamp-2 group-hover:text-[#a797cc] transition-colors">
                                {event.event_name}
                            </h2>
                            <div className="flex items-start gap-2 text-gray-600 mb-2">
                                <Icon icon="lucide:map-pin" className="w-4 h-4 text-[#a797cc] mt-0.5 flex-shrink-0" />
                                <span className="text-sm leading-relaxed line-clamp-2">{event.event_address}</span>
                            </div>
                            {/* Category Display */}
                            {event.event_category && categories.length > 0 && (() => {
                                const category = categories.find(cat => 
                                    cat._id === event.event_category || 
                                    cat._id?.toString() === event.event_category?.toString()
                                );
                                return category ? (
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <Icon icon="lucide:tag" className="w-3.5 h-3.5 text-[#a797cc]" />
                                        <span className="text-xs text-[#a797cc] font-semibold bg-[#a797cc]/10 px-2 py-0.5 rounded-md">{category.name}</span>
                                    </div>
                                ) : null;
                            })()}
                        </div>
                        {/* Price Box - Enhanced & Prominent */}
                        <div className="flex flex-col items-end bg-gradient-to-br from-[#a797cc]/10 to-[#8ba179]/10 rounded-xl px-4 py-3 border-2 border-[#a797cc]/20 shadow-sm flex-shrink-0 self-start">
                            <p className="text-xs text-gray-600 font-medium mb-1 uppercase tracking-wide">{t('common.price') || t('card.tab1') || 'Price'}</p>
                            <div className="flex items-baseline gap-1">
                                <p className="text-xl font-bold text-[#a797cc] leading-tight">{event.event_price}</p>
                                <span className="text-sm font-semibold text-gray-700">{t('common.currency') || t('card.tab2') || 'SAR'}</span>
                            </div>
                            <span className="text-xs text-gray-500 mt-0.5">{t('eventsMain.perPerson') || t('events.perPerson') || 'per person'}</span>
                        </div>
                    </div>
                </div>

                {
                    showBookNow && (
                        <div className="border-t px-4 py-3">
                            <div className="flex justify-end">
                                {/* "Book Now" Button */}
                                {BookNowBtn && (
                                    <>
                                        {token ? (
                                        <button 
                                            onClick={handleReservation} 
                                            disabled={isReserving || event.book_status === 1}
                                            className={`${
                                                isReserving || event.book_status === 1 
                                                    ? 'bg-gray-400 cursor-not-allowed' 
                                                    : 'bg-[#a797cc] hover:bg-[#e56b00]'
                                            } text-white rounded-lg py-2 px-8 text-xs font-semibold transition-colors`}
                                        >
                                            {isReserving 
                                                ? t('eventsMain.processing') || 'Processing...' 
                                                : event.book_status === 1 
                                                    ? t('eventsMain.pending') || 'Pending'
                                                    : event.book_status === 2 && event.payment_status === 0
                                                        ? t('events.payNow') || 'Pay Now'
                                                        : btnName || t('card.tab10') || 'Book Now'}
                                        </button>
                                    ) : (
                                        <button onClick={() => router.push(`/login?r=events/${event._id}`)} className="bg-[#a797cc] text-white rounded-lg py-2 px-8 text-xs font-semibold">
                                            {t('card.tab10') || 'Book Now'}
                                        </button>
                                    )}
                                    </>
                                )}
                            </div>
                        </div>
                    )
                }
                {
                    showUser && (
                        <div className='border-t px-4 py-2 '>
                            <h4 className="text-sm text-gray-900 font-semibold mb-2">{t('card.tab4') || 'Guest Details'}</h4>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-x-2">
                                    <div className='w-[40px] h-[40px] rounded-full overflow-hidden border border-gray-200'>
                                        <Image 
                                            className="w-full h-full object-cover" 
                                            src={(() => {
                                                const getImageUrl = (imgPath) => {
                                                    if (!imgPath) return "/assets/images/home/user-dummy.png";
                                                    
                                                    // If blob URL (for preview), return as is
                                                    if (imgPath.startsWith("blob:")) {
                                                        return imgPath;
                                                    }
                                                    
                                                    // If already absolute URL (http/https) - includes Cloudinary URLs
                                                    if (imgPath.includes("http://") || imgPath.includes("https://")) {
                                                        return imgPath;
                                                    }
                                                    
                                                    // If Cloudinary URL format
                                                    if (imgPath.includes("res.cloudinary.com")) {
                                                        return imgPath;
                                                    }
                                                    
                                                    // If relative path, construct absolute URL
                                                    const apiBase = BASE_API_URL.replace('/api/', '');
                                                    
                                                    if (imgPath.startsWith("/uploads/")) {
                                                        return `${apiBase}${imgPath}`;
                                                    }
                                                    
                                                    if (imgPath.includes("uploads/")) {
                                                        const uploadsIndex = imgPath.indexOf("uploads/");
                                                        return `${apiBase}/${imgPath.substring(uploadsIndex)}`;
                                                    }
                                                    
                                                    if (imgPath.startsWith("/")) {
                                                        return `${apiBase}${imgPath}`;
                                                    }
                                                    
                                                    return "/assets/images/home/user-dummy.png";
                                                };
                                                return getImageUrl(event.user_profile_image);
                                            })()} 
                                            alt={t("add.profilePicture") || "Profile Picture"} 
                                            height={40} 
                                            width={40}
                                            unoptimized={isExternalImage(event.user_profile_image)}
                                            onError={(e) => {
                                                e.target.src = "/assets/images/home/user-dummy.png";
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-gray-900 text-sm font-semibold">{event.user_first_name} {event.user_last_name}</p>
                                    </div>
                                </div>
                                {/* Show status or action buttons based on book_status */}
                                {status || event.book_status === 1 || event.book_status === 2 || event.book_status === 3 ? (
                                    <div
                                        className={`text-xs p-2 rounded-md font-semibold ${
                                            event.book_status === 1
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : status === 'Approved' || event.book_status === 2
                                                ? 'bg-[#d5fae3] text-green-600'
                                                : 'bg-[#ff00002e] text-red-500'
                                        }`}
                                    >
                                        {status ||
                                            (event.book_status === 1
                                                ? t('eventsMain.pending') || "Pending"
                                                : event.book_status === 2
                                                    ? event.payment_status === 0
                                                        ? t('events.noPay') || "No Pay"
                                                        : t('eventsMain.approved') || "Approved"
                                                    : event.book_status === 3
                                                        ? t('eventsMain.rejected') || "Rejected"
                                                        : t('eventsMain.pending') || "Pending")}
                                    </div>
                                ) : (
                                    <div className="flex space-x-4">
                                        <button onClick={handleReject} className="text-[#a797cc] text-sm font-semibold">
                                            {t('card.tab7') || 'Reject'}
                                        </button>
                                        <button onClick={handleApprove} className="z-10 px-5 py-2 text-white text-sm bg-orange-500 rounded hover:bg-orange-600">
                                            {t('card.tab6') || 'Accept'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }

                {
                    showViewNow && (
                        <div className='border-t px-4 py-2 '>
                            <h4 className="text-sm text-gray-900 font-semibold mb-2">{t('eventsMain.organizer') || 'Organizer Details'}</h4>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-x-2">
                                    <div className='w-[40px] h-[40px] rounded-full overflow-hidden border border-gray-200'>
                                        <Image 
                                            className="w-full h-full object-cover" 
                                            src={(() => {
                                                const getImageUrl = (imgPath) => {
                                                    if (!imgPath) return "/assets/images/home/user-dummy.png";
                                                    
                                                    // If blob URL (for preview), return as is
                                                    if (imgPath.startsWith("blob:")) {
                                                        return imgPath;
                                                    }
                                                    
                                                    // If already absolute URL (http/https) - includes Cloudinary URLs
                                                    if (imgPath.includes("http://") || imgPath.includes("https://")) {
                                                        return imgPath;
                                                    }
                                                    
                                                    // If Cloudinary URL format
                                                    if (imgPath.includes("res.cloudinary.com")) {
                                                        return imgPath;
                                                    }
                                                    
                                                    // If relative path, construct absolute URL
                                                    const apiBase = BASE_API_URL.replace('/api/', '');
                                                    
                                                    if (imgPath.startsWith("/uploads/")) {
                                                        return `${apiBase}${imgPath}`;
                                                    }
                                                    
                                                    if (imgPath.includes("uploads/")) {
                                                        const uploadsIndex = imgPath.indexOf("uploads/");
                                                        return `${apiBase}/${imgPath.substring(uploadsIndex)}`;
                                                    }
                                                    
                                                    if (imgPath.startsWith("/")) {
                                                        return `${apiBase}${imgPath}`;
                                                    }
                                                    
                                                    return "/assets/images/home/user-dummy.png";
                                                };
                                                return getImageUrl(event.organizer_profile_image);
                                            })()} 
                                            alt={t("add.profilePicture") || "Profile Picture"} 
                                            height={40} 
                                            width={40}
                                            onError={(e) => {
                                                e.target.src = "/assets/images/home/user-dummy.png";
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-gray-900 text-sm font-semibold">{event.organizer_first_name} {event.organizer_last_name}</p>
                                    </div>
                                </div>
                                {/* Show status or action buttons based on book_status */}
                                {
                                    showButton && (
                                        <>
                                            {event.book_status === 2 && event.payment_status === 0 ? (
                                                <Link href={{
                                                    pathname: "/payment",
                                                    query: { id: event._id },
                                                }}>
                                                    <button className='bg-[#a797cc] text-white rounded-lg py-3 px-8 text-xs font-semibold'>{t('events.payNow') || 'Pay Now'}</button>
                                                </Link>
                                            ) : (
                                                <Link href={{
                                                    pathname: "/myEvents/detail",
                                                    query: { id: event._id },
                                                }}>
                                                    <button className='bg-[#a797cc] text-white rounded-lg py-3 px-8 text-xs font-semibold'>{t('eventsMain.viewDetails') || 'View Details'}</button>
                                                </Link>
                                            )}
                                        </>
                                    )
                                }

                            </div>
                        </div>
                    )
                }
            </div>
        </>
    );
}
