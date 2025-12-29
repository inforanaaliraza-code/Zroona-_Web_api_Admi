"use client";

import Image from "next/image";
import { useState } from "react";
import DeleteEventModal from "../Modal/DeleteEventModal";
import AddEditJoinEventModal from "../Modal/AddEditJoinEventModal";
import { DeleteEventsApi } from "@/app/api/events/apis";
import { getEventList } from "@/redux/slices/EventList";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ApprovalModal from "../Modal/ApprovalModal";
import RejectReasonModal from "../Modal/RejectReasonModal";
import { getBookingDetail } from "@/redux/slices/OrgaizerBookingDetail";
import { ChangeStatusOrganizerApi } from "@/app/api/myBookings/apis";
import AddBookModal from "../Modal/AddBookModal";
import Loader from "../Loader/Loader";
import { useTranslation } from "react-i18next";
import { useRTL } from "@/utils/rtl";



const BookNow = ({ props, pageType }) => {
    const { t, i18n } = useTranslation();
    const { isRTL } = useRTL();
    const { push } = useRouter();
    const dispatch = useDispatch();
    
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';
        
        return date.toLocaleDateString(locale, {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const time = new Date(`1970-01-01T${timeString}`);
        const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';
        
        return time.toLocaleTimeString(locale, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };
    const [isStatusConfirmationOpen, setIsStatusConfirmationOpen] = useState(false);
    const [isBookOpenModal, setIsBookOpenModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [eventId, setEventId] = useState(null);
    const [page, setPage] = useState(1);
    const [eventType, setEventType] = useState(null);
    const [event_type, setEvent_type] = useState("1");
    const [loading, setLoading] = useState(false);

    // Set the status based on book_status in props
    const [status, setStatus] = useState(
        props?.book_details?.book_status === 2
            ? t("common.approved")
            : props?.book_details?.book_status === 3
                ? t("common.rejected")
                : ""
    );

    const [actionType, setActionType] = useState(""); // To track whether we're approving or rejecting

    const handleAccept = () => {
        setActionType("approve");
        setIsStatusConfirmationOpen(true);  // Open the approval modal with "approve" action
    };

    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedBookingForReject, setSelectedBookingForReject] = useState(null);

    const handleReject = () => {
        setActionType("reject");
        // Open reject reason modal instead of simple approval modal
        setSelectedBookingForReject({
            bookingId: props?._id,
            guestName: `${props?.userDetail?.first_name || ""} ${props?.userDetail?.last_name || ""}`.trim() || t("events.unknown") || "Unknown",
            eventName: props?.event_name || "Event",
        });
        setRejectModalOpen(true);
    };

    const ChangeStatus = (BookingListId, newStatus, rejectionReason = null) => {
        setLoading(true);
        const data = {
            book_id: BookingListId,
            book_status: newStatus, // 2 for approved, 3 for rejected
        };
        
        // Add rejection reason if rejecting
        if (newStatus === 3 && rejectionReason) {
            data.rejection_reason = rejectionReason;
        }

        // Example API call for changing the status
        ChangeStatusOrganizerApi(data)
            .then((res) => {
                setLoading(false);
                if (res?.status === 1) {
                    toast.success(res?.message);
                    dispatch(getBookingDetail({ id: BookingListId })); // Refresh details after status change
                    setStatus(newStatus === 2 ? "Approved" : "Rejected"); // Update local status state
                    // Close modals
                    setIsStatusConfirmationOpen(false);
                    setRejectModalOpen(false);
                    setSelectedBookingForReject(null);
                } else {
                    toast.error(res?.message);
                }
            })
            .catch((error) => {
                setLoading(false);
                toast.error("Failed to change status");
            });
    };

    const confirmStatusChange = () => {
        setIsStatusConfirmationOpen(false);  // Close the modal after confirming
        ChangeStatus(props?._id, 2); // Approve status (2 for approved)
    };

    const handleRejectConfirm = (rejectionReason) => {
        if (selectedBookingForReject) {
            ChangeStatus(selectedBookingForReject.bookingId, 3, rejectionReason);
        }
    };

    const handleDeleteClick = (id, event_type) => {
        setDeleteId(id);
        setEventType(event_type); // Store event_type to use it in the deleteData function
        setShowConfirm(true);
    };

    const confirmDelete = () => {
        setShowConfirm(false);
        deleteData(deleteId, eventType); // Pass event_type here
    };

    const deleteData = (id, event_type) => {
        setLoading(true);
        const payload = { event_id: id };
        
        DeleteEventsApi(payload)
            .then((res) => {
                if (res?.status === 1) {
                    toast.success(res?.message);
                    
                    // Redirect based on event_type
                    if (event_type === 1) {
                        push("/joinUsEvent");
                    } else if (event_type === 2) {
                        push("/welcomeUsEvent");
                    }
                    
                    dispatch(getEventList({ page: page, event_type: event_type }));
                } else {
                    toast.error(res?.message);
                }
            })
            .catch((err) => {
                toast.error("Failed to delete event. Please try again.");
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>
            <section className={`bg-[#fff] py-10 shadow-[0_-6px_10px_rgba(0,0,0,5%)] ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="px-4 md:px-8 xl:px-28">
                    {/* Book Now */}
                    <div className={`flex flex-col sm:flex-row items-center gap-y-6 sm:gap-y-0 ${isRTL ? 'sm:flex-row-reverse sm:justify-between' : 'justify-between'}`}>
                        <div className={`flex flex-col sm:flex-row items-center gap-4 md:gap-x-8 w-full ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                            <div className="w-[150px] md:w-[130px] lg:w-[110px] bg-gradient-to-b from-[#a797cc] to-[#8ba179] text-white p-3 rounded-xl text-center flex flex-col items-center">
                                <Image
                                    src="/assets/images/icons/users-icon.png"
                                    alt="icon"
                                    width={40}
                                    height={41}
                                />
                                <p className="text-sm mt-2 leading-4">
                                    <span className="font-semibold text-base">{props?.event_price || '0'} {t('card.tab2')}</span>
                                    <br /> 
                                    <span className="text-xs font-normal">{t('detail.tab54')}</span>
                                </p>
                            </div>
                            <div className={`text-center ${isRTL ? 'sm:text-right' : 'sm:text-left'}`}>
                                <div className="text-gray-700 text-sm">
                                    {formatDate(props?.event_date)}
                                </div>
                                <div className="text-gray-700 text-sm">
                                    {formatTime(props?.event_start_time)}{" "}
                                    {t('detail.tab45')}{" "}
                                    {formatTime(props?.event_end_time)}
                                </div>
                                <div className="font-semibold text-lg text-gray-900 mt-2">
                                    {props?.event_name}
                                </div>
                            </div>
                        </div>

                        <div className={`w-full sm:w-auto flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
                            {/* Conditionally render buttons based on the pageType */}
                            {pageType === 'book' && (
                                <button
                                    onClick={() => {
                                        setEventId(props?._id);
                                        setIsBookOpenModal(true);
                                    }}
                                    className="w-full sm:w-auto bg-primary text-white py-3 px-24 lg:px-36 rounded-xl text-base font-semibold transition duration-300"
                                >
                                    {t('detail.tab51')}
                                </button>
                            )}

                            {pageType === 'accept' && (
                                loading ? (
                                    <div className="flex justify-center items-center">
                                        <Loader height="30" />
                                    </div>
                                ) : status || props?.book_details?.book_status === 2 || props?.book_details?.book_status === 3 ? (
                                    <div className={`py-3 px-24 lg:px-36 rounded-xl text-base font-semibold ${status === 'Approved' || props?.book_details?.book_status === 2 ? 'bg-[#d5fae3] text-green-600' : 'bg-[#ff00002e] text-red-500'}`}>
                                        {status || (props?.book_details?.book_status === 2 ? t('detail.tab52') : t('detail.tab53'))}
                                    </div>
                                ) : (
                                    <div className={`flex ${isRTL ? 'flex-row-reverse space-x-reverse' : ''} space-x-8`}>
                                        <button onClick={() => handleReject()} className="text-[#a797cc] text-base font-semibold">{t('detail.tab48')}</button>
                                        <button onClick={() => handleAccept()} className="bg-[#a797cc] text-white py-3 px-24 lg:px-36 rounded-xl text-base font-semibold hover:bg-orange-600 transition duration-300">{t('detail.tab47')}</button>
                                    </div>
                                )
                            )}

                            {pageType === 'edit' && (
                                <div className={`flex flex-col md:flex-row gap-y-4 gap-x-8 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                                    <button className="text-[#a797cc] text-base font-semibold " onClick={() => handleDeleteClick(props._id, props.event_type)}>
                                        {t('detail.tab49')}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEventId(props?.id);
                                            setIsModalEditOpen(true);
                                        }}
                                        className="bg-[#a797cc] text-white py-3 px-24 lg:px-36 rounded-xl text-base font-semibold hover:bg-orange-600 transition duration-300">
                                        {t('detail.tab50')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Book Now Modal */}
            <AddBookModal
                isOpen={isBookOpenModal}
                onClose={() => setIsBookOpenModal(false)}
                eventId={eventId}
                eventData={props}
            />

            {/* Approval Modal */}
            <ApprovalModal
                show={isStatusConfirmationOpen}
                onConfirm={confirmStatusChange}
                onClose={() => setIsStatusConfirmationOpen(false)}
                title={t('approve.tab1') || 'Approve Booking'}
                message={t('approve.tab3') || 'Are you sure you want to approve this booking?'}
            />

            {/* Reject Reason Modal */}
            {selectedBookingForReject && (
                <RejectReasonModal
                    isOpen={rejectModalOpen}
                    onClose={() => {
                        setRejectModalOpen(false);
                        setSelectedBookingForReject(null);
                    }}
                    onConfirm={handleRejectConfirm}
                    guestName={selectedBookingForReject.guestName}
                    eventName={selectedBookingForReject.eventName}
                    isLoading={loading && selectedBookingForReject.bookingId === props?._id}
                />
            )}

            {/* Delete Event Modal */}
            <DeleteEventModal
                show={showConfirm}
                onConfirm={confirmDelete}
                onCancel={() => setShowConfirm(false)}
            />

            {/* Edit Event Modal */}
            <AddEditJoinEventModal
                isOpen={isModalEditOpen}
                onClose={() => setIsModalEditOpen(false)}
                eventId={eventId}
            />
        </>
    );
};

export default BookNow;
