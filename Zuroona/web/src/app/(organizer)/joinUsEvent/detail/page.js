"use client";

import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { useEffect, useMemo, useState } from "react";
import RegistrationModal from "@/components/Modal/AddBookModal";
import TimeSchedule from "@/components/Details/TimeSchedule";
import ProfileDetail from "@/components/Details/ProfileDetail";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { getEventListDetail } from "@/redux/slices/EventListDetail";
import { useTranslation } from "react-i18next";
import LocationMap from "@/components/Details/LocationMap";
import Audience from "@/components/Details/Audience";
import Loader from "@/components/Loader/Loader";
import { DeleteEventsApi, CancelEventApi } from "@/app/api/events/apis";
import { toast } from "react-toastify";
import { showGreenTick } from "@/utils/toastHelpers";
import { Icon } from "@iconify/react";
import { useRTL } from "@/utils/rtl";
import DeleteEventModal from "@/components/Modal/DeleteEventModal";
import CancelEventModal from "@/components/Modal/CancelEventModal";
import useAuthStore from "@/store/useAuthStore";
import AddEditJoinEventModal from "@/components/Modal/AddEditJoinEventModal";

export default function JoinUsDetail() {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  // Get user info from auth store
  const { user, token } = useAuthStore();
  const { profile } = useSelector((state) => state.profileData || {});
  
  // Determine user role - check both auth store and profile
  const userRole = user?.role || profile?.user?.role;
  const isHost = userRole === 2; // 2 = host/organizer, 1 = guest

  const EventListId = searchParams.get("id");
  const { EventListdetails = {}, loadingDetail } = useSelector(
    (state) => state.EventDetailData || {}
  );

  const title = EventListdetails?.event_name;

  // Use only real API data, no dummy fallback
  const detailData = useMemo(() => {
    return EventListdetails || {};
  }, [EventListdetails]);

  useEffect(() => {
    if (EventListId) {
      dispatch(getEventListDetail({ id: EventListId }));
    }
  }, [EventListId, dispatch]);

  const handleDeleteEvent = async () => {
    if (!EventListId) {
      toast.error(t("common.error", "Event ID not found"));
      return;
    }

    setIsDeleting(true);
    try {
      const response = await DeleteEventsApi({
        event_id: EventListId,
      });

      if (response?.status === 1) {
        showGreenTick();
        setIsDeleteModalOpen(false);
        // Redirect to events list
        setTimeout(() => {
          router.push("/joinUsEvent");
        }, 1500);
      } else {
        toast.error(response?.message || t("common.error", "Failed to delete event"));
      }
    } catch (error) {
      console.error("[DELETE-EVENT] Error:", error);
      toast.error(error?.response?.data?.message || t("common.error", "Failed to delete event"));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelEvent = async (reason = "") => {
    if (!EventListId) {
      toast.error(t("common.error", "Event ID not found"));
      return;
    }

    setIsCancelling(true);
    try {
      const response = await CancelEventApi(
        {
          event_id: EventListId,
          reason: reason || undefined,
        },
        token
      );

      if (response?.status === 1 || response?.status === true) {
        showGreenTick();
        setIsCancelModalOpen(false);
        // Refresh event details
        setTimeout(() => {
          dispatch(getEventListDetail({ id: EventListId }));
          toast.info(t("events.guestsNotified", "All guests have been notified about the cancellation"));
        }, 1000);
      } else {
        toast.error(
          response?.message || t("common.error", "Failed to cancel event")
        );
      }
    } catch (error) {
      console.error("[CANCEL-EVENT] Error:", error);
      toast.error(
        error?.response?.data?.message || t("common.error", "Failed to cancel event")
      );
    } finally {
      setIsCancelling(false);
    }
  };

  const breadcrumbItems = [
    { label: t("breadcrumb.tab1"), href: "/joinUsEvent" },
    { label: t("breadcrumb.tab14"), href: "/joinUsEvent" },
    {
      label: title || t("breadcrumb.tab13"), // Default to "Event Details" if title is undefined
      href: "/joinUsEvent/detail",
    },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      {loadingDetail && !detailData?.event_name ? (
        <div className="flex justify-center items-center w-full h-screen bg-[#FFF0F1]">
          <Loader />
        </div>
      ) : (
        <>
      <section className="bg-white min-h-screen py-8 md:py-12">
        <div className="mx-auto px-4 md:px-8 xl:px-28 max-w-7xl">
          
          {/* Cancelled Event Banner - Show if event is cancelled */}
          {(detailData?.is_cancelled === true || detailData?.event_status === 'cancelled') && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-2xl p-4 md:p-6">
              <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
                <div className="bg-red-100 p-3 rounded-xl">
                  <Icon icon="lucide:calendar-x" className="h-8 w-8 text-red-600" />
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <h3 className="text-xl font-bold text-red-800">
                    {t("events.eventCancelled", "This Event Has Been Cancelled")}
                  </h3>
                  {detailData?.cancelled_at && (
                    <p className="text-sm text-red-600 mt-1">
                      {t("events.cancelledOn", "Cancelled on")}: {new Date(detailData.cancelled_at).toLocaleDateString()}
                    </p>
                  )}
                  {detailData?.cancelled_reason && (
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-semibold">{t("events.reason", "Reason")}:</span> {detailData.cancelled_reason}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8">
            {/* Left Content Section */}
            <div className="lg:col-span-2 space-y-6">
                <ProfileDetail profile={detailData} showJoinButton={true} />
                
                {/* Action Buttons - Professional Design */}
                <div className={`mt-8 flex flex-wrap gap-4 ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
                  {/* View Analytics Button - Show for all events (primary button) */}
                  <Link
                    href={`/joinUsEvent/analytics?id=${EventListId}`}
                    className={`group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#a797cc] to-[#8ba179] text-white rounded-xl hover:from-[#8ba179] hover:to-[#7a9069] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <Icon icon="lucide:bar-chart-3" className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span>{t("events.viewAnalytics", "View Analytics")}</span>
                  </Link>
                  
                  {/* Edit Event Button - Orange color - Only for Approved events */}
                  {detailData?.is_approved === 1 && (
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className={`group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <Icon icon="lucide:edit" className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                      <span>{t("detail.tab15", "Edit Event")}</span>
                    </button>
                  )}

                  {/* Cancel Event Button - Red/Danger color - Only show if not already cancelled */}
                  {!(detailData?.is_cancelled === true || detailData?.event_status === 'cancelled') && (
                    <button
                      onClick={() => setIsCancelModalOpen(true)}
                      className={`group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <Icon icon="lucide:x-circle" className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                      <span>{t("events.cancelEvent", "Cancel Event")}</span>
                    </button>
                  )}
                  
                  {/* Cancelled Status Badge - Show if event is cancelled */}
                  {(detailData?.is_cancelled === true || detailData?.event_status === 'cancelled') && (
                    <div className={`flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold shadow-lg ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
                      <Icon icon="lucide:x-circle" className="h-5 w-5" />
                      <span>{t("events.eventCancelled", "Event Cancelled")}</span>
                    </div>
                  )}
                  
                  {/* Delete Event Button - Show for all events */}
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className={`group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <Icon icon="lucide:trash-2" className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span>{t("delete.tab1", "Delete Event")}</span>
                  </button>
                </div>
            </div>

            {/* Right Sidebar Section - Professional Cards */}
            <div className="space-y-6 mt-10 lg:mt-0">
                <Audience organizer={detailData} />
                <TimeSchedule schedule={detailData} />
                <LocationMap location={detailData} />
            </div>
          </div>
        </div>
      </section>

      {/* Book Now component removed for hosts - they already have Delete and Edit buttons above */}

      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Delete Event Modal */}
      <DeleteEventModal
        show={isDeleteModalOpen}
        onConfirm={handleDeleteEvent}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

      {/* Cancel Event Modal */}
      <CancelEventModal
        show={isCancelModalOpen}
        eventName={detailData?.event_name}
        onConfirm={handleCancelEvent}
        onCancel={() => setIsCancelModalOpen(false)}
        isLoading={isCancelling}
      />

      {/* Edit Event Modal */}
      <AddEditJoinEventModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        eventId={EventListId}
      />

      <style jsx>{`
        :global(.slick-dots .slick-active div) {
          background-color: #ab0017;
        }
      `}</style>
      <style jsx global>{`
        .slick-dots li {
          width: 10px;
          height: 10px;
          margin: 0 5px;
        }
        .slick-prev,
        .slick-next {
          width: 40px;
          height: 40px;
          z-index: 1;
          top: -50px;
        }
        .slick-prev {
          right: 50px;
          left: auto;
        }
        .slick-next {
          right: 0;
        }
        .slick-next:before,
        .slick-prev:before {
          content: "";
        }
        @media (max-width: 480px) {
          .slick-prev,
          .slick-next {
            width: 30px;
            height: 30px;
            top: -40px;
          }
          .slick-prev {
            right: 45px;
          }
          .slick-next {
            right: 5px;
          }
          .slick-dots li {
            width: 15px;
            height: 15px;
            margin: 0 2px;
          }
        }
      `}</style>
     </>
      )}
    </>
  );
}
