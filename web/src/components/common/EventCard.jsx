"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { TOKEN_NAME } from '@/until';
import Cookies from 'js-cookie';
import LoginModal from '../Modal/LoginModal';
import { toast } from 'react-toastify';
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
    setSelectedOrganizer
}) {

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
    const { t, i18n } = useTranslation();
    const token = Cookies.get(TOKEN_NAME);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isReserving, setIsReserving] = useState(false);
    const openLoginModal = () => setLoginModalOpen(true);
    const closeLoginModal = () => setLoginModalOpen(false);

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
            openLoginModal();
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
                toast.success(t('events.reservationRequested'));
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
            <div className="relative bg-[#f8f8f8] rounded-xl hover:shadow-xl overflow-hidden hover:bg-white cursor-pointer">
                <div className="relative h-[176px] overflow-hidden">
                    <Image
                        src={(() => {
                            const getImageUrl = (imgPath) => {
                                if (!imgPath) return "/assets/images/home/dummyImage.png";
                                if (imgPath.includes("http://") || imgPath.includes("https://")) return imgPath;
                                if (imgPath.startsWith("/uploads/")) {
                                    const apiBase = "http://localhost:3434";
                                    return `${apiBase}${imgPath}`;
                                }
                                return "/assets/images/home/dummyImage.png";
                            };
                            return getImageUrl(event.event_images?.[0] || event.event_image);
                        })()}
                        alt={event.title || event.event_name}
                        height={176}
                        width={405}
                        className='w-full h-full object-cover'
                        onError={(e) => {
                            e.target.src = "/assets/images/home/dummyImage.png";
                        }}
                    />
                    <div className="absolute top-2 left-4 flex gap-x-2 bg-black text-white text-xs font-bold px-2 py-1 rounded">
                        <Icon icon="lucide:calendar" className="w-4 h-4 text-white" />
                        <div>
                            {new Date(event.event_date).getDate()}{" "}
                            {new Date(event.event_date).toLocaleString(
                                "en-US",
                                {
                                    month: "short",
                                }
                            )}{" "}
                            {new Date(event.event_date).getFullYear()}
                        </div>
                        <div className="text-white text-xs font-bold">
                            {new Date(`1970-01-01T${event.event_start_time}`).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}{" "}
                        </div>
                    </div>
                </div>
                <div className="p-4 relative">
                    {
                        showEventType && (
                            <div
                                className={`absolute -top-3 left-4 flex text-white text-xs font-bold px-2 py-1 rounded 
                                    ${event?.event_type === 1
                                        ? 'bg-[#a797cc]'
                                        : event?.event_type === 2
                                            ? 'bg-[#ff3b00]'
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
                    <div className='flex justify-between items-end'>
                        <div className="max-w-[16rem]">
                            <h2 className="text-base font-semibold mb-2 truncate max-w-full">
                                {event.event_name}
                            </h2>
                            <div className="flex gap-x-2 text-gray-700">
                                <div>
                                    <Icon icon="lucide:map-pin" className="w-4 h-4 text-brand-gray-purple-2" />
                                </div>
                                <span className="text-sm">{event.event_address}</span>
                            </div>
                        </div>
                    <div className="flex flex-col items-end">
                        <p className="text-sm text-gray-800 leading-4">Price</p>
                        <p className="text-[0.900rem] font-bold text-black leading-4 whitespace-nowrap">{event.event_price} SAR</p>
                        <span className="text-xs text-gray-800">/ person</span>
                    </div>
                    </div>
                </div>

                {
                    showBookNow && (
                        <div className="border-t px-4 py-2">
                            <div className="flex justify-between items-center">
                                {/* Attendees Section */}
                            {event?.attendees?.length > 0 ? (
                                <div>
                                    <h2 className="text-base font-semibold">Attendees</h2>
                                    <div className="flex items-center">
                                            <div className={`flex ${i18n.language === 'ar' ? '-space-x-3' : '-space-x-3'}`}>
                                                {/* Render attendees dynamically */}
                                                {event?.attendees.slice(0, 3).map((attendee, index) => (
                                                    <div
                                                        className="w-10 h-10 rounded-full border-2 border-white overflow-hidden"
                                                        key={attendee._id + index}
                                                    >
                                                        <Image
                                                            src={attendee.profile_image}
                                                            alt={`${attendee.first_name} ${attendee.last_name}`}
                                                            width={46}
                                                            height={46}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    </div>
                                                ))}

                                                {/* Counter circle */}
                                                {event?.attendees?.length > 3 && (
                                                    <div className="w-8 h-8 mt-1.5 !-ml-4 rounded-full bg-[#a797cc] border-2 border-transparent flex items-center justify-center text-white text-xs font-bold">
                                                        +{event.attendees.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // If no attendees, add a spacer to keep the button on the right
                                    <div className='h-16'></div>
                                )}

                                {/* "Book Now" Button */}
                                {BookNowBtn && (
                                    <div className="flex justify-end">
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
                                        <button onClick={openLoginModal} className="bg-[#a797cc] text-white rounded-lg py-2 px-8 text-xs font-semibold">
                                            {t('card.tab10') || 'Book Now'}
                                        </button>
                                    )}
                                    </div>
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
                                                    if (imgPath.includes("http://") || imgPath.includes("https://")) return imgPath;
                                                    if (imgPath.startsWith("/uploads/")) {
                                                        const apiBase = "http://localhost:3434";
                                                        return `${apiBase}${imgPath}`;
                                                    }
                                                    return "/assets/images/home/user-dummy.png";
                                                };
                                                return getImageUrl(event.user_profile_image);
                                            })()} 
                                            alt="Profile Picture" 
                                            height={40} 
                                            width={40}
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
                                {status || event.book_status === 2 || event.book_status === 3 ? (
                                    <div
                                        className={`text-xs p-2 rounded-md font-semibold ${status === 'Approved' || event.book_status === 2
                                            ? 'bg-[#d5fae3] text-green-600'
                                            : 'bg-[#ff00002e] text-red-500'
                                        }`}
                                    >
                                        {status ||
                                            (event.book_status === 2
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
                                                    if (imgPath.includes("http://") || imgPath.includes("https://")) return imgPath;
                                                    if (imgPath.startsWith("/uploads/")) {
                                                        const apiBase = "http://localhost:3434";
                                                        return `${apiBase}${imgPath}`;
                                                    }
                                                    return "/assets/images/home/user-dummy.png";
                                                };
                                                return getImageUrl(event.organizer_profile_image);
                                            })()} 
                                            alt="Profile Picture" 
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
            <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
        </>
    );
}
