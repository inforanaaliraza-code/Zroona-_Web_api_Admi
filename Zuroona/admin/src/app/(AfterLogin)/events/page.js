"use client";

import { useDataStore } from "@/api/store/store";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Loader from "@/components/Loader/Loader";
import Paginations from "@/components/Paginations/Pagination";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaFileExcel, FaPrint } from "react-icons/fa";
import { exportEventsToCSV, exportEventsToPDF } from "@/utils/exportUtils";
import { ChangeEventStatusApi } from "@/api/events/apis";
import { toast } from "react-toastify";
import RejectEventModal from "@/components/Modals/RejectEventModal";
import { useTranslation } from "react-i18next";

// Predefined Event Types (matching organizer side)
const EVENT_TYPES = [
  { value: 'conference', label: 'Conference' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'exhibition', label: 'Exhibition' },
  { value: 'concert', label: 'Concert' },
  { value: 'festival', label: 'Festival' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'networking', label: 'Networking Event' },
  { value: 'corporate', label: 'Corporate Event' },
  { value: 'privateParty', label: 'Private Party' },
];

// Helper function to format event types
const formatEventTypes = (eventTypes, eventType = null) => {
  // If event_types array exists and has values, use it
  if (eventTypes && Array.isArray(eventTypes) && eventTypes.length > 0) {
    // Filter out any null/undefined/empty values
    const validTypes = eventTypes.filter(type => type && typeof type === 'string' && type.trim() !== '');
    
    if (validTypes.length > 0) {
      // Map event type values to labels
      const typeLabels = validTypes.map(type => {
        const eventTypeObj = EVENT_TYPES.find(et => et.value === type);
        return eventTypeObj ? eventTypeObj.label : type.charAt(0).toUpperCase() + type.slice(1);
      });
      
      return typeLabels.join(", ");
    }
  }
  
  // Fallback: If no event_types but event_type (number) exists, show a default
  // This handles old events that don't have event_types field
  if (eventType !== null && eventType !== undefined) {
    // event_type: 1 = Join Us, 2 = Welcome (legacy field)
    return eventType === 1 ? "Join Us" : eventType === 2 ? "Welcome" : "N/A";
  }
  
  return "N/A";
};

// Helper function to format event categories
const formatEventCategories = (eventCategoryDetails) => {
  if (!eventCategoryDetails || !Array.isArray(eventCategoryDetails) || eventCategoryDetails.length === 0) {
    return "N/A";
  }
  
  // Extract category names (support both en and ar)
  const categoryNames = eventCategoryDetails.map(cat => {
    if (typeof cat === 'string') return cat;
    if (cat?.name) {
      // If name is an object with en/ar, use en (or ar if en not available)
      if (typeof cat.name === 'object') {
        return cat.name.en || cat.name.ar || cat.name;
      }
      return cat.name;
    }
    return "N/A";
  });
  
  return categoryNames.filter(name => name !== "N/A").join(", ") || "N/A";
};

// Helper function to get proper image URL
const getEventImageUrl = (event) => {
  // Check for event_images array first (up to 6 images)
  let imageUrl = null;
  
  if (event?.event_images && Array.isArray(event.event_images) && event.event_images.length > 0) {
    imageUrl = event.event_images[0]; // Use first image for thumbnail
  } else if (event?.event_image) {
    imageUrl = event.event_image;
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

export default function ManageEvents() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("Pending");
  const [loading, setLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [processingEventId, setProcessingEventId] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1); // Reset to first page when changing tabs
  };

  const handlePage = (value) => {
    setPage(value);
  };

  const params = {
    page: page,
    limit: 10,
    status: activeTab === "Pending" ? 1 : activeTab === "Upcoming" ? 2 : activeTab === "Completed" ? 3 : activeTab === "Rejected" ? 4 : 1,
    search: search,
  };

  const GetAllEvents = useDataStore((store) => store.GetAllEvents);
  const { fetchGetAllEvents } = useDataStore();

  // Refresh events list
  const refreshEvents = () => {
    setLoading(true);
    fetchGetAllEvents(params).then(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    refreshEvents();
  }, [page, activeTab, search]);

  // Handle Accept Event
  const handleAcceptEvent = async (eventId) => {
    try {
      setProcessingEventId(eventId);
      const response = await ChangeEventStatusApi({
        eventId: eventId,
        status: 2, // Approve - set to Upcoming
      });

      if (response?.status === 1) {
        toast.success(t("events.eventApprovedSuccess"));
        // Refresh events list
        refreshEvents();
      } else {
        toast.error(response?.message || t("events.failedToApproveEvent"));
      }
    } catch (error) {
      console.error("Accept event error:", error);
      toast.error(t("events.failedToApproveEventTryAgain"));
    } finally {
      setProcessingEventId(null);
    }
  };

  // Handle Reject Event
  const handleRejectEvent = (event) => {
    setSelectedEvent(event);
    setShowRejectModal(true);
  };

  const confirmRejectEvent = async (rejectionReason) => {
    if (!selectedEvent) return;

    try {
      setProcessingEventId(selectedEvent._id);
      const response = await ChangeEventStatusApi({
        eventId: selectedEvent._id,
        status: 4, // Reject
        rejectionReason: rejectionReason,
      });

      if (response?.status === 1) {
        toast.success(t("events.eventRejectedSuccess"));
        setShowRejectModal(false);
        setSelectedEvent(null);
        // Refresh events list
        refreshEvents();
      } else {
        toast.error(response?.message || t("events.failedToRejectEvent"));
      }
    } catch (error) {
      console.error("Reject event error:", error);
      toast.error(t("events.failedToRejectEventTryAgain"));
    } finally {
      setProcessingEventId(null);
    }
  };

  return (
    <DefaultLayout search={search} setSearch={setSearch} setPage={setPage}>
      <div>
        <div className="flex sm:items-end flex-col sm:flex-row gap-x-10 py-6">
          {/* Header */}
          <div className="flex lg:w-[40%] items-end mb-4 sm:mb-0">
            <h1 className="text-xl font-bold text-black">{t("events.manageEvents")}</h1>
          </div>

          {/* Export Buttons */}
          <div className="w-full flex lg:justify-end gap-3 items-center mt-5 lg:mt-0">
            <button onClick={() => exportEventsToCSV(GetAllEvents?.data || [])} className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition">
              <FaFileExcel /> {t("events.exportCSV")}
            </button>
            <button onClick={() => exportEventsToPDF(GetAllEvents?.data || [])} className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition">
              <FaPrint /> {t("events.exportPDF")}
            </button>
          </div>

          {/* Header (old) */}
          <div className="mb-4 sm:mb-0">
            <h1 className="text-xl font-bold text-black">{t("events.manageEvents")}</h1>
          </div>

          {/* Tabs */}
          <div className="flex items-end space-x-4">
            <button
              onClick={() => handleTabChange("Pending")}
              className={`px-3 py-3 sm:px-6 sm:py-4 border-2 rounded-xl text-sm font-semibold bg-white ${activeTab === "Pending"
                ? "border-2 border-[#a797cc] text-[#a797cc]"
                : "border-2 border-transparent text-[#c8b68b]"
                }`}
            >
              {t("events.pending")}
            </button>
            <button
              onClick={() => handleTabChange("Upcoming")}
              className={`px-3 py-3 sm:px-6 sm:py-4 border-2 rounded-xl text-sm font-semibold bg-white ${activeTab === "Upcoming"
                ? "border-2 border-[#a797cc] text-[#a797cc]"
                : "border-2 border-transparent text-[#c8b68b]"
                }`}
            >
              {t("events.upcoming")}
            </button>
            <button
              onClick={() => handleTabChange("Completed")}
              className={`px-3 py-3 sm:px-6 sm:py-4 border-2 rounded-xl text-sm font-semibold bg-white ${activeTab === "Completed"
                ? "border-2 border-[#a797cc] text-[#a797cc]"
                : "border-2 border-transparent text-[#c8b68b]"
                }`}
            >
              {t("completed")}
            </button>
            <button
              onClick={() => handleTabChange("Rejected")}
              className={`px-3 py-3 sm:px-6 sm:py-4 border-2 rounded-xl text-sm font-semibold bg-white ${activeTab === "Rejected"
                ? "border-2 border-[#a797cc] text-[#a797cc]"
                : "border-2 border-transparent text-[#c8b68b]"
                }`}
            >
              {t("events.rejected")}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead className="bg-[#f3f7ff]">
                <tr className="text-sm">
                  <th className="px-2 py-4 text-left font-base text-gray-600">
                    {t("events.eventId")}
                  </th>
                  <th className="px-2 py-4 text-left font-base text-gray-600">
                    {t("events.eventName")}
                  </th>
                  <th className="px-2 py-4 text-left font-base text-gray-600">
                    {t("events.organizer")}
                  </th>
                  <th className="px-2 py-4 text-left font-base text-gray-600">
                    {t("events.numberOfAttendees")}
                  </th>
                  <th className="px-2 py-4 text-left font-base text-gray-600">
                    {t("events.date")}
                  </th>
                  <th className="px-2 py-4 text-left font-base text-gray-600">
                    {t("events.time")}
                  </th>
                  <th className="px-2 py-4 text-left font-base text-gray-600">
                    {t("events.amountPerPerson")}
                  </th>
                  <th className="px-2 py-4 text-left font-base text-gray-600">
                    {t("events.city")}
                  </th>
                  <th className="px-2 py-4 text-left font-base text-gray-600">
                    {t("events.status")}
                  </th>
                  <th className="px-2 py-4 text-center font-base text-gray-600">
                    {t("events.action")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={11} className="py-3">
                      <Loader />
                    </td>
                  </tr>
                ) : GetAllEvents?.data?.length > 0 ? (
                  GetAllEvents?.data?.map((event, i) => (
                    <tr
                      key={i}
                      className="border-b last:border-0 text-sm font-medium text-black"
                    >
                      <td className="px-2 py-3 whitespace-nowrap">{event.id}</td>
                      <td className="px-2 py-3">
                        <div className="flex items-center space-x-3 w-max">
                          <div className="relative w-14 h-9 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                            <Image
                              src={getEventImageUrl(event)}
                              alt={event.event_name || "Event"}
                              fill
                              className="object-cover"
                              sizes="56px"
                              onError={(e) => {
                                e.target.src = "/assets/images/dummyImage.png";
                              }}
                            />
                          </div>
                          <span className="font-medium">{event.event_name}</span>
                        </div>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-3 w-max">
                          <Image
                            src={
                              event?.organizer?.profile_image?.includes("http")
                                ? event?.organizer?.profile_image
                                : "/assets/images/dummyImage.png"
                            }
                            alt={event.name}
                            height={42}
                            width={42}
                            className="w-10 h-10 rounded-full"
                          />
                          <span>
                            {event?.organizer?.first_name}{" "}
                            {event?.organizer?.last_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-3">{event.no_of_attendees}</td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        {new Date(event.event_date).getDate()}{" "}
                        {new Date(event.event_date).toLocaleString("en-US", {
                          month: "short",
                        })}{" "}
                        {new Date(event.event_date).getFullYear()}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        {new Date(
                          `1970-01-01T${event.event_start_time}`
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        -
                        {new Date(
                          `1970-01-01T${event.event_end_time}`
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        {event.event_price}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        {event.event_address}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <span className={`text-sm font-medium px-2 py-1 rounded ${
                          (event?.event_status === 1 || event?.is_approved === 0) ? "text-yellow-600 bg-yellow-100" :
                          (event?.event_status === 2 || event?.is_approved === 1) ? "text-blue-600 bg-blue-100" :
                          event?.event_status === 3 ? "text-green-600 bg-green-100" :
                          (event?.event_status === 4 || event?.is_approved === 2) ? "text-red-600 bg-red-100" :
                          "text-gray-600 bg-gray-100"
                        }`}>
                          {(event?.event_status === 1 || event?.is_approved === 0) ? t("events.pending") :
                           (event?.event_status === 2 || event?.is_approved === 1) ? t("events.upcoming") :
                           event?.event_status === 3 ? t("events.completed") :
                           (event?.event_status === 4 || event?.is_approved === 2) ? t("events.rejected") :
                           "N/A"}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex gap-2 items-center justify-center">
                          <Link
                            href={`/events/detail/${event?._id}`}
                            className="text-orange-500 hover:text-orange-600"
                            title={t("events.viewDetails")}
                          >
                            <Image
                              src="/assets/images/home/eye-outline.png"
                              alt={t("events.view")}
                              height={20}
                              width={20}
                            />
                          </Link>
                          
                          {/* Accept/Reject buttons for Pending events */}
                          {(event?.event_status === 1 || event?.is_approved === 0) && (
                            <>
                              <button
                                onClick={() => handleAcceptEvent(event._id)}
                                disabled={processingEventId === event._id}
                                className="bg-green-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                title={t("events.acceptEvent")}
                              >
                                {processingEventId === event._id ? "..." : t("events.accept")}
                              </button>
                              <button
                                onClick={() => handleRejectEvent(event)}
                                disabled={processingEventId === event._id}
                                className="bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                title={t("events.rejectEvent")}
                              >
                                {processingEventId === event._id ? "..." : t("common.reject")}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan={11} className="pt-2">
                      {t("events.noDataFound")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {GetAllEvents?.data?.length > 0 && (
          <Paginations
            handlePage={handlePage}
            page={page}
            total={GetAllEvents?.total_count}
            itemsPerPage={itemsPerPage}
          />
        )}

        {/* Reject Event Modal */}
        <RejectEventModal
          show={showRejectModal}
          onClose={() => {
            setShowRejectModal(false);
            setSelectedEvent(null);
          }}
          onConfirm={confirmRejectEvent}
          title={t("events.rejectEvent")}
          message={t("events.confirmRejectEvent", { eventName: selectedEvent?.event_name })}
        />
      </div>
    </DefaultLayout>
  );
}
