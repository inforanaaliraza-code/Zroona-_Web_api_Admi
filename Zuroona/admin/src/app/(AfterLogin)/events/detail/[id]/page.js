"use client";

import { useDataStore } from "@/api/store/store";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ChangeEventStatusApi } from "@/api/events/apis";
import RejectEventModal from "@/components/Modals/RejectEventModal";
import { useTranslation } from "react-i18next";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ArrowLeft,
  Phone,
  Mail,
  User,
  FileText,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// Helper function to get proper image URL
const getEventImageUrl = (event) => {
  // Check for event_image first
  let imageUrl = event?.event_image;
  
  // If no event_image, check event_images array
  if (!imageUrl && event?.event_images && Array.isArray(event.event_images) && event.event_images.length > 0) {
    imageUrl = event.event_images[0];
  }
  
  // If still no image, return dummy
  if (!imageUrl) {
    return "/assets/images/dummyImage.png";
  }
  
  // If already absolute URL (http/https), return as is
  if (imageUrl.includes("http://") || imageUrl.includes("https://")) {
    return imageUrl;
  }
  
  // If relative path (starts with /uploads/), construct absolute URL
  if (imageUrl.startsWith("/uploads/")) {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3434";
    // Remove /api/admin/ or /api/ from base URL if present
    const baseUrl = apiBase.replace(/\/api\/admin\/?$/, "").replace(/\/api\/?$/, "");
    return `${baseUrl}${imageUrl}`;
  }
  
  // If it's a relative path without /uploads/, try to construct URL
  if (imageUrl.startsWith("/")) {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3434";
    const baseUrl = apiBase.replace(/\/api\/admin\/?$/, "").replace(/\/api\/?$/, "");
    return `${baseUrl}${imageUrl}`;
  }
  
  // Default fallback
  return "/assets/images/dummyImage.png";
};

export default function EventDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const detail = useDataStore((store) => store.EventsDetail);
  const { fetchEventsDetail } = useDataStore();

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchEventsDetail({ id: id })
        .then(() => {
          setLoading(false);
        })
        .catch((err) => {
          console.error("[EVENT-DETAIL] Error:", err);
          setLoading(false);
          toast.error(t("eventDetail.failedToFetch"));
        });
    }
  }, [id, fetchEventsDetail, t]);

  // Function to change event status (Accept/Reject)
  const ChangeEventStatus = (newStatus, rejectionReason = "") => {
    if (!detail?._id) {
      toast.error(t("eventDetail.eventIdNotFound") || "Event ID not found");
      return;
    }

    setLoading(true);
    
    const data = {
      eventId: detail._id,
      status: newStatus, // 2 for approved/upcoming, 4 for rejected
      rejectionReason: rejectionReason || null,
    };

    ChangeEventStatusApi(data)
      .then((res) => {
        if (res?.status === 1) {
          toast.success(res?.message || t("eventDetail.eventApprovedSuccess"));
          // Refresh details after status change
          setTimeout(() => {
            fetchEventsDetail({ id: detail._id })
              .then(() => {
                // Optionally redirect to events list
                // router.push("/events");
              })
              .catch((err) => {
                console.error("[EVENT-STATUS] Error refreshing details:", err);
              });
          }, 500);
          setShowRejectModal(false);
        } else {
          toast.error(res?.message || t("eventDetail.failedToUpdateStatus"));
        }
      })
      .catch((err) => {
        console.error("[EVENT-STATUS] Error:", err);
        toast.error(err?.response?.data?.message || t("eventDetail.failedToUpdateStatus"));
      })
      .finally(() => setLoading(false));
  };

  const handleReject = (reason) => {
    ChangeEventStatus(4, reason); // 4 = Rejected
  };

  const getStatusBadge = () => {
    // Check is_approved first (backend field: 0=Pending, 1=Approved, 2=Rejected)
    // Then check event_status (frontend mapped: 1=Pending, 2=Upcoming, 3=Completed, 4=Rejected)
    const isApproved = detail?.is_approved === 1;
    const isRejectedApproved = detail?.is_approved === 2;
    const isPendingApproved = detail?.is_approved === 0 || detail?.is_approved === undefined || detail?.is_approved === null;
    
    const eventStatus = detail?.event_status;
    
    // Determine status based on both fields
    let isPending = false;
    let isUpcoming = false;
    let isCompleted = false;
    let isRejected = false;
    
    if (isRejectedApproved || eventStatus === 4) {
      isRejected = true;
    } else if (isPendingApproved || eventStatus === 1) {
      isPending = true;
    } else if (isApproved || eventStatus === 2) {
      // Check if event date has passed for Completed status
      if (eventStatus === 3) {
        isCompleted = true;
      } else {
        // Check if event date is in the past
        const eventDate = detail?.event_date ? new Date(detail.event_date) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (eventDate && eventDate < today) {
          isCompleted = true;
        } else {
          isUpcoming = true;
        }
      }
    } else if (eventStatus === 3) {
      isCompleted = true;
    } else {
      // Default to pending if status is unclear
      isPending = true;
    }

    if (isPending) {
      return {
        statusKey: "pending",
        text: t("eventDetail.pending"),
        className: "bg-yellow-100 text-yellow-800 border-yellow-300",
        icon: <AlertCircle className="w-4 h-4" />
      };
    } else if (isUpcoming) {
      return {
        statusKey: "upcoming",
        text: t("common.upcoming"),
        className: "bg-blue-100 text-blue-800 border-blue-300",
        icon: <Calendar className="w-4 h-4" />
      };
    } else if (isCompleted) {
      return {
        statusKey: "completed",
        text: t("common.completed"),
        className: "bg-green-100 text-green-800 border-green-300",
        icon: <CheckCircle2 className="w-4 h-4" />
      };
    } else if (isRejected) {
      return {
        statusKey: "rejected",
        text: t("eventDetail.rejected"),
        className: "bg-red-100 text-red-800 border-red-300",
        icon: <XCircle className="w-4 h-4" />
      };
    }
    return {
      statusKey: "pending",
      text: t("eventDetail.pending"),
      className: "bg-yellow-100 text-yellow-800 border-yellow-300",
      icon: <AlertCircle className="w-4 h-4" />
    };
  };

  const statusBadge = getStatusBadge();
  // Improved pending detection
  const isPending = (detail?.is_approved === 0 || detail?.is_approved === undefined || detail?.is_approved === null) || 
                   (detail?.event_status === 1) ||
                   (!detail?.is_approved && !detail?.event_status);

  return (
    <DefaultLayout>
      <div className="w-full min-w-0 max-w-full min-h-screen pb-10 sm:pb-12 bg-gray-50">
        {/* Responsive padding: smaller on mobile to avoid overflow */}
        <div className="w-full min-w-0 max-w-full px-3 sm:px-6 lg:px-8">
        {/* Header - stacks cleanly on mobile */}
        <div className="mb-5 sm:mb-8 min-w-0">
          <div className="flex flex-col gap-4 sm:gap-5 min-w-0">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">{t("eventDetail.title")}</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{t("eventDetail.eventInfo")}</p>
            </div>
            {detail?._id && (
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0 w-full sm:w-auto">
                <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white rounded-xl border border-gray-200 shadow-sm min-w-0">
                  <span className="text-xs font-medium text-gray-600 shrink-0">{t("common.status")}:</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold border shrink-0 ${statusBadge.className}`}>
                    {statusBadge.icon}
                    <span className="truncate">{statusBadge.text}</span>
                  </span>
                </div>
                {isPending && (
                  <button
                    onClick={() => ChangeEventStatus(2)}
                    disabled={loading}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-[#a797cc] hover:bg-[#a08ec8] text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed min-w-0"
                    title={t("eventDetail.approveEvent")}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{t("common.approve")}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {loading && !detail?._id ? (
          <div className="flex justify-center items-center min-h-[500px] bg-white rounded-lg shadow-sm">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#a797cc] border-t-transparent mx-auto"></div>
              <p className="mt-6 text-gray-600 font-medium">{t("common.pleaseWait")}</p>
            </div>
          </div>
        ) : detail?._id ? (
          <div className="w-full min-w-0 space-y-5 sm:space-y-8">
            {/* Main Content Grid: single column on mobile, two columns from lg */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 sm:gap-6 lg:gap-8 min-w-0">
              {/* Left Column - Main Event Info */}
              <div className="min-w-0 space-y-4 sm:space-y-6">
                {/* Event Header Card */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 min-w-0">
                  <div className="flex flex-wrap items-start gap-3 sm:gap-4 min-w-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 break-words min-w-0">
                          {detail?.event_name?.trim()?.toLowerCase() === "new" ? t("eventDetail.new") : (detail?.event_name || t("events.eventName") || "Event Name")}
                        </h2>
                        <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold shrink-0 ${
                          detail?.event_for === 1 ? "bg-blue-100 text-blue-800" :
                          detail?.event_for === 2 ? "bg-pink-100 text-pink-800" :
                          "bg-purple-100 text-purple-800"
                        }`}>
                          {detail?.event_for === 1 
                            ? (t("eventsMain.menOnlyLabel") || "Men Only") 
                            : detail?.event_for === 2 
                              ? (t("eventsMain.womenOnlyLabel") || "Women Only") 
                              : (t("eventsMain.allWelcomeLabel") || "All Welcome")}
                        </span>
                      </div>
                      {/* Rating and Attendees */}
                      <div className="flex flex-wrap items-center gap-5 text-sm text-gray-600">
                        {detail?.total_rating > 0 && (
                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center">
                              {Array(5).fill(0).map((_, index) => (
                                <span key={index} className="text-yellow-400">
                                  {index < Math.floor(detail?.total_rating || 0) ? "★" : "☆"}
                                </span>
                              ))}
                            </div>
                            <span className="font-semibold text-gray-700">{detail?.total_rating?.toFixed(1)}</span>
                            {detail?.total_review > 0 && (
                              <span className="text-gray-500">({detail?.total_review} reviews)</span>
                            )}
                          </div>
                        )}
                        {detail?.attendees?.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{detail?.attendees?.length} Attendees</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Organizer Info - no overlapping; compact on mobile */}
                  <div className="mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 min-w-0">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 sm:mb-4">{t("eventDetail.organizerInfo")}</p>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 min-w-0 p-3 sm:p-4 rounded-xl bg-gray-50/80 border border-gray-100 isolate">
                      <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white shadow shrink-0 flex-shrink-0 bg-gray-100">
                        <Image
                          src={
                            detail?.organizer?.profile_image?.includes("http")
                              ? detail?.organizer?.profile_image
                              : "/assets/images/dummyImage.png"
                          }
                          alt={detail?.organizer?.first_name ? `${detail.organizer.first_name} ${detail?.organizer?.last_name || ""}`.trim() || "Organizer" : (t("eventDetail.organizerName") || "Organizer")}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                          sizes="(max-width: 640px) 56px, 80px"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <User className="w-4 h-4 text-gray-400 shrink-0" />
                          <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate min-w-0">
                            {detail?.organizer?.first_name} {detail?.organizer?.last_name}
                          </h3>
                        </div>
                        <div className="flex flex-col gap-2 sm:gap-3 text-sm text-gray-600 min-w-0">
                          {detail?.organizer?.phone_number && (
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-gray-400" />
                              <span className="break-all min-w-0">{detail?.organizer?.country_code} {detail?.organizer?.phone_number}</span>
                            </div>
                          )}
                          {detail?.organizer?.email && (
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-gray-400" />
                              <span className="break-all min-w-0">{detail?.organizer?.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Image Gallery - constrained so it never breaks layout */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-w-0">
                  {/* Main Image Display - responsive height */}
                  <div className="relative w-full h-[220px] sm:h-[300px] lg:h-[360px] bg-gray-100">
                    <Image
                      src={(() => {
                        const allImages = [];
                        if (detail?.event_images && Array.isArray(detail.event_images) && detail.event_images.length > 0) {
                          allImages.push(...detail.event_images);
                        } else if (detail?.event_image) {
                          allImages.push(detail.event_image);
                        }
                        return allImages.length > 0 ? getEventImageUrl({ event_image: allImages[currentImageIndex || 0] }) : "/assets/images/dummyImage.png";
                      })()}
                      alt={detail?.event_name || "Event Image"}
                      fill
                      className="object-cover"
                      priority
                      onError={(e) => {
                        e.target.src = "/assets/images/dummyImage.png";
                      }}
                    />
                    {/* Navigation buttons if multiple images */}
                    {(() => {
                      const allImages = [];
                      if (detail?.event_images && Array.isArray(detail.event_images) && detail.event_images.length > 0) {
                        allImages.push(...detail.event_images);
                      } else if (detail?.event_image) {
                        allImages.push(detail.event_image);
                      }
                      return allImages.length > 1 ? (
                        <>
                          <button
                            onClick={() => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all z-10"
                            aria-label="Previous Image"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                          <button
                            onClick={() => setCurrentImageIndex((prev) => (prev + 1) % allImages.length)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all z-10"
                            aria-label="Next Image"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium z-10">
                            {currentImageIndex + 1} / {allImages.length}
                          </div>
                        </>
                      ) : null;
                    })()}
                  </div>
                  
                  {/* Thumbnail Gallery - Show all images (up to 6) */}
                  {(() => {
                    const allImages = [];
                    if (detail?.event_images && Array.isArray(detail.event_images) && detail.event_images.length > 0) {
                      allImages.push(...detail.event_images.slice(0, 6));
                    } else if (detail?.event_image) {
                      allImages.push(detail.event_image);
                    }
                    return allImages.length > 1 ? (
                      <div className="p-5 bg-gray-50 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-3 min-w-0 gap-3">
                          <p className="text-sm font-semibold text-gray-700 truncate">
                            {t("eventDetail.eventImages")} ({allImages.length})
                          </p>
                          <p className="text-xs text-gray-500 shrink-0">
                            {t("eventDetail.clickToView")}
                          </p>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                          {allImages.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                idx === currentImageIndex
                                  ? "border-[#a797cc] ring-2 ring-[#a797cc]/20"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <Image
                                src={getEventImageUrl({ event_image: img })}
                                alt={t("events.eventImage") + ` ${idx + 1}` || `Event image ${idx + 1}`}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  e.target.src = "/assets/images/dummyImage.png";
                                }}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* About Event */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 min-w-0">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <FileText className="w-5 h-5 text-[#a797cc] shrink-0" />
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">{t("eventDetail.eventDescription")}</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words min-w-0">
                    {detail?.event_description || t("common.noData")}
                  </p>
                </div>
              </div>

              {/* Right Column - full width on mobile, fixed width from lg */}
              <div className="space-y-4 sm:space-y-6 min-w-0 w-full lg:max-w-[340px]">
                {/* Event Details Card */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-7 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-5">{t("eventDetail.eventInfo")}</h3>
                  <div className="space-y-4 sm:space-y-5">
                    <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                      <Calendar className="w-5 h-5 text-[#a797cc] mt-0.5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-500 mb-0.5">{t("common.date")}</p>
                        <p className="text-sm font-semibold text-gray-900 break-words">
                          {detail?.event_date ? new Date(detail.event_date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          }) : (t("eventTypeLegacy.notAvailable") || "N/A")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                      <Clock className="w-5 h-5 text-[#a797cc] mt-0.5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-500 mb-0.5">{t("common.time")}</p>
                        <p className="text-sm font-semibold text-gray-900 break-words">
                          {detail?.event_start_time && detail?.event_end_time
                            ? `${new Date(`1970-01-01T${detail.event_start_time}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${new Date(`1970-01-01T${detail.event_end_time}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                            : (t("eventTypeLegacy.notAvailable") || "N/A")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                      <MapPin className="w-5 h-5 text-[#a797cc] mt-0.5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-500 mb-0.5">{t("common.address")}</p>
                        <p className="text-sm font-semibold text-gray-900 break-words">
                          {detail?.event_address || (t("eventTypeLegacy.notAvailable") || "N/A")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                      <DollarSign className="w-5 h-5 text-[#a797cc] mt-0.5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-500 mb-0.5">{t("eventDetail.eventPrice")}</p>
                        <p className="text-sm font-semibold text-gray-900 break-words">
                          {detail?.event_price 
                            ? `${detail.event_price} ${t("common.currency") || "SAR"}` 
                            : (t("eventTypeLegacy.notAvailable") || "N/A")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                      <Users className="w-5 h-5 text-[#a797cc] mt-0.5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-500 mb-0.5">{t("eventDetail.maxAttendees")}</p>
                        <p className="text-sm font-semibold text-gray-900 break-words">
                          {detail?.no_of_attendees || (t("eventTypeLegacy.notAvailable") || "N/A")} {detail?.no_of_attendees === 1 
                            ? (t("eventsMain.personsLabel") || "person") 
                            : (t("eventsMain.peopleLabel") || "people")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instructions Card */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-7 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-5">{t("eventDetail.instructionsLabel") || "Instructions"}</h3>
                  <div className="space-y-6 min-w-0">
                    {detail?.dos_instruction && (
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                          <h4 className="text-sm font-semibold text-gray-900">{t("eventsMain.dosLabel") || "What to Do"}</h4>
                        </div>
                        <p className="text-sm text-gray-700 pl-6 break-words min-w-0 leading-relaxed">{detail.dos_instruction}</p>
                      </div>
                    )}
                    {detail?.do_not_instruction && (
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                          <h4 className="text-sm font-semibold text-gray-900">{t("eventsMain.dontsLabel") || "What Not to Do"}</h4>
                        </div>
                        <p className="text-sm text-gray-700 pl-6 break-words min-w-0 leading-relaxed">{detail.do_not_instruction}</p>
                      </div>
                    )}
                    {!detail?.dos_instruction && !detail?.do_not_instruction && (
                      <p className="text-sm text-gray-500 italic">{t("eventsMain.noInstructionsProvided") || "No instructions provided."}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - full width on mobile, centered on desktop */}
            {isPending && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 min-w-0">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 flex-wrap">
                  <button
                    onClick={() => ChangeEventStatus(2)}
                    disabled={loading}
                    className="w-full sm:w-auto min-w-0 flex items-center justify-center gap-2 bg-[#a797cc] hover:bg-[#a08ec8] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent shrink-0" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <span>{t("eventDetail.approveEvent")}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={loading}
                    className="w-full sm:w-auto min-w-0 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-5 h-5 shrink-0" />
                    <span>{t("eventDetail.rejectEvent")}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Status Badge for Non-Pending Events - use statusKey so it works in all languages */}
            {!isPending && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 min-w-0">
                <div className="flex justify-center">
                  {statusBadge.statusKey === "upcoming" && (
                    <div className="flex items-center gap-3 px-6 py-4 bg-green-50 border-2 border-green-200 rounded-lg">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                      <span className="text-lg font-semibold text-green-800">{t("eventDetail.eventApprovedLabel")}</span>
                    </div>
                  )}
                  {statusBadge.statusKey === "rejected" && (
                    <div className="flex items-center gap-3 px-6 py-4 bg-red-50 border-2 border-red-200 rounded-lg">
                      <XCircle className="w-6 h-6 text-red-600" />
                      <span className="text-lg font-semibold text-red-800">{t("eventDetail.eventRejectedLabel")}</span>
                    </div>
                  )}
                  {statusBadge.statusKey === "completed" && (
                    <div className="flex items-center gap-3 px-6 py-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                      <CheckCircle2 className="w-6 h-6 text-blue-600" />
                      <span className="text-lg font-semibold text-blue-800">{t("eventDetail.eventCompletedLabel")}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Event Not Found</h3>
            <p className="text-gray-600 mb-6">The event you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <button
              onClick={() => router.push("/events")}
              className="inline-flex items-center gap-2 bg-[#a797cc] hover:bg-[#a08ec8] text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </button>
          </div>
        )}
        </div>
      </div>

      {/* Rejection Modal */}
      <RejectEventModal
        show={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleReject}
        title={t("eventDetail.rejectEvent")}
        message={t("messages.confirmRejectEvent", { eventName: detail?.event_name })}
      />
    </DefaultLayout>
  );
}
