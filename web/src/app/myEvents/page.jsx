"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import EventPlaceholder from "@/components/ui/EventPlaceholder";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import useAuthStore from "@/store/useAuthStore";
import { GetUserBookingsApi, CancelBookingApi } from "@/app/api/setting";
import CancelConfirmDialog from "@/components/ui/CancelConfirmDialog";
import { useRTL } from "@/utils/rtl";
import Header from "@/components/Header/Header";
import GuestNavbar from "@/components/Header/GuestNavbar";
import Footer from "@/components/Footer/Footer";

// Helper function to safely get translations with fallbacks
const getTranslation = (t, key, fallback) => {
  try {
    const translation = t(key);
    // If translation returns the key itself, it means translation is missing
    if (translation === key) {
      return fallback;
    }
    return translation || fallback;
  } catch (error) {
    return fallback;
  }
};

export default function MyEventsPage() {
  const { t, i18n } = useTranslation();
  const [isI18nReady, setIsI18nReady] = useState(i18n.isInitialized);
  const { token, isAuthenticated, user } = useAuthStore();
  const { isRTL, textAlign, flexDirection, marginStart, marginEnd } = useRTL();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Wait for i18n to be ready
  useEffect(() => {
    if (i18n.isInitialized) {
      setIsI18nReady(true);
    } else {
      i18n.on('initialized', () => {
        setIsI18nReady(true);
      });
    }
  }, [i18n]);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isReserving, setIsReserving] = useState(false);
  const [activeTab, setActiveTab] = useState("approved"); // approved, pending, rejected

  // Status mapping for colors and icons
  const statusConfig = {
    0: { color: "bg-yellow-100 text-yellow-800", icon: "lucide:clock" }, // Pending
    1: { color: "bg-blue-100 text-blue-800", icon: "lucide:check-circle" }, // Approved
    2: { color: "bg-green-100 text-green-800", icon: "lucide:check-circle-2" }, // Confirmed
    3: { color: "bg-red-100 text-red-800", icon: "lucide:x-circle" }, // Cancelled
    4: { color: "bg-gray-100 text-gray-800", icon: "lucide:x" }, // Rejected
  };

  // Get status text with fallbacks
  const getStatusText = (status) => {
    switch (status) {
      case 0: return getTranslation(t, "events.pending", "Pending");
      case 1: return getTranslation(t, "events.approved", "Approved");
      case 2: return getTranslation(t, "events.confirmed", "Confirmed");
      case 3: return getTranslation(t, "events.cancelled", "Cancelled");
      case 4: return getTranslation(t, "events.rejected", "Rejected");
      default: return getTranslation(t, "events.unknown", "Unknown");
    }
  };

  // Get payment status text with fallbacks
  const getPaymentStatusText = (status) => {
    return status 
      ? getTranslation(t, "events.paid", "Paid")
      : getTranslation(t, "events.unpaid", "Unpaid");
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return "";
    try {
      const time = new Date(`2000-01-01T${timeString}`);
      return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch (error) {
      return timeString;
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Load user bookings
  useEffect(() => {
    if (!token || !isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await GetUserBookingsApi();
        console.log("[MY-EVENTS] API Response:", response);
        
        if (response && (response.status === 1 || response.status === true)) {
          // Map API response fields to frontend expected format
          const mappedBookings = (response.data || []).map(booking => ({
            _id: booking._id || booking.book_id,
            status: booking.book_status !== undefined ? booking.book_status : booking.status,
            payment_status: booking.payment_status,
            attendees: booking.no_of_attendees || booking.attendees || 0,
            total_amount: booking.book_details?.total_amount || booking.total_amount,
            // Top-level fields for easy access
            event_start_time: booking.event_start_time || booking.event?.event_start_time,
            event_end_time: booking.event_end_time || booking.event?.event_end_time,
            event_address: booking.event_address || booking.event?.event_address,
            event_category: booking.event_category || booking.event?.event_category,
            organizer: {
              first_name: booking.organizer_first_name || booking.organizer?.first_name,
              last_name: booking.organizer_last_name || booking.organizer?.last_name,
              profile_image: booking.organizer_profile_image || booking.organizer?.profile_image,
            },
            event: {
              _id: booking.event_id || booking.event?._id,
              event_name: booking.event_name || booking.event?.event_name,
              event_date: booking.event_date || booking.event?.event_date,
              event_images: booking.event_image ? [booking.event_image] : (booking.event?.event_images || []),
              event_address: booking.event_address || booking.event?.event_address,
              event_price: booking.event_price || booking.event?.event_price,
              event_description: booking.event_description || booking.event?.event_description,
              event_category: booking.event_category || booking.event?.event_category,
              event_for: booking.event_for || booking.event?.event_for,
              event_type: booking.event_type || booking.event?.event_type,
              event_start_time: booking.event_start_time || booking.event?.event_start_time,
              event_end_time: booking.event_end_time || booking.event?.event_end_time,
              organizer: {
                first_name: booking.organizer_first_name || booking.organizer?.first_name,
                last_name: booking.organizer_last_name || booking.organizer?.last_name,
                profile_image: booking.organizer_profile_image || booking.organizer?.profile_image,
              }
            },
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
          }));
          
          console.log("[MY-EVENTS] Mapped bookings:", mappedBookings);
          setBookings(mappedBookings);
        } else {
          toast.error(response?.message || getTranslation(t, "events.bookingsLoadError", "Failed to load bookings"));
          setBookings([]);
        }
      } catch (error) {
        console.error("[MY-EVENTS] Error fetching bookings:", error);
        toast.error(getTranslation(t, "events.bookingsLoadError", "Error loading your bookings"));
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token, isAuthenticated]);

  // Filter bookings based on active tab
  useEffect(() => {
    if (!bookings.length) {
      setFilteredBookings([]);
      return;
    }

    let filtered = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (activeTab === "approved") {
      // Requirement #2: For approved, show both upcoming and past (merged)
      // Status 1 = Approved, Status 2 = Confirmed (both are approved)
      filtered = bookings.filter(booking => {
        const status = booking.status;
        return status === 1 || status === 2;
      });
      // Sort: upcoming first, then past
      filtered.sort((a, b) => {
        const dateA = new Date(a.event?.event_date || 0);
        const dateB = new Date(b.event?.event_date || 0);
        // Upcoming events first (future dates), then past events
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const aIsUpcoming = dateA >= today;
        const bIsUpcoming = dateB >= today;
        
        if (aIsUpcoming && !bIsUpcoming) return -1;
        if (!aIsUpcoming && bIsUpcoming) return 1;
        // If both same type, sort by date
        return dateA - dateB; // Earlier dates first for upcoming, later dates first for past
      });
    } else if (activeTab === "pending") {
      filtered = bookings.filter(booking => booking.status === 0);
    } else if (activeTab === "rejected") {
      filtered = bookings.filter(booking => booking.status === 4);
    }

    setFilteredBookings(filtered);
  }, [bookings, activeTab]);

  // Handle cancel booking click
  const handleCancelBookingClick = (bookingId) => {
    if (!token || !isAuthenticated) {
      toast.error(getTranslation(t, "events.pleaseLogin", "Please login to continue"));
      return;
    }
    
    setSelectedBookingId(bookingId);
    setIsCancelDialogOpen(true);
  };
  
  // Handle cancel booking confirmation
  const handleCancelBooking = async (reason = "") => {
    if (!selectedBookingId) return;
    
    try {
      setIsReserving(true); 
      const response = await CancelBookingApi({
        booking_id: selectedBookingId,
        reason: reason || undefined
      });
      
      if (response && (response.status === 1 || response.status === true)) {
        toast.success(getTranslation(t, "events.bookingCancelled", "Booking cancelled successfully"));
        // Refresh bookings after cancellation
        const refreshResponse = await GetUserBookingsApi();
        if (refreshResponse && (refreshResponse.status === 1 || refreshResponse.status === true)) {
          const mappedBookings = (refreshResponse.data || []).map(booking => ({
            _id: booking._id || booking.book_id,
            status: booking.book_status !== undefined ? booking.book_status : booking.status,
            payment_status: booking.payment_status,
            attendees: booking.no_of_attendees || booking.attendees || 0,
            total_amount: booking.book_details?.total_amount || booking.total_amount,
            invoice_id: booking.invoice_id,
            invoice_url: booking.invoice_url,
            order_id: booking.order_id,
            // Top-level fields for easy access
            event_start_time: booking.event_start_time || booking.event?.event_start_time,
            event_end_time: booking.event_end_time || booking.event?.event_end_time,
            event_address: booking.event_address || booking.event?.event_address,
            event_category: booking.event_category || booking.event?.event_category,
            organizer: {
              first_name: booking.organizer_first_name || booking.organizer?.first_name,
              last_name: booking.organizer_last_name || booking.organizer?.last_name,
              profile_image: booking.organizer_profile_image || booking.organizer?.profile_image,
            },
            event: {
              _id: booking.event_id || booking.event?._id,
              event_name: booking.event_name || booking.event?.event_name,
              event_date: booking.event_date || booking.event?.event_date,
              event_images: booking.event_image ? [booking.event_image] : (booking.event?.event_images || []),
              event_address: booking.event_address || booking.event?.event_address,
              event_price: booking.event_price || booking.event?.event_price,
              event_description: booking.event_description || booking.event?.event_description,
              event_category: booking.event_category || booking.event?.event_category,
              event_for: booking.event_for || booking.event?.event_for,
              event_type: booking.event_type || booking.event?.event_type,
              event_start_time: booking.event_start_time || booking.event?.event_start_time,
              event_end_time: booking.event_end_time || booking.event?.event_end_time,
              organizer: {
                first_name: booking.organizer_first_name || booking.organizer?.first_name,
                last_name: booking.organizer_last_name || booking.organizer?.last_name,
                profile_image: booking.organizer_profile_image || booking.organizer?.profile_image,
              }
            },
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
          }));
          setBookings(mappedBookings);
        }
      } else {
        toast.error(response?.message || getTranslation(t, "events.cancelFailed", "Failed to cancel booking"));
      }
    } catch (error) {
      console.error("[MY-EVENTS] Cancel booking error:", error);
      toast.error(getTranslation(t, "events.cancelFailed", "Failed to cancel booking"));
    } finally {
      setIsReserving(false);
      setIsCancelDialogOpen(false);
      setSelectedBookingId(null);
    }
  };

  // Show loading while i18n initializes
  if (!isI18nReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a797cc]"></div>
      </div>
    );
  }

  if (!token || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <Icon icon="lucide:lock" className="mx-auto h-16 w-16 text-gray-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">
            {getTranslation(t, "events.pleaseLogin", "Please login to continue")}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {getTranslation(t, "events.loginToViewBookings", "Please login to view your bookings")}
          </p>
          <div className="mt-6">
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-[#a797cc] to-[#8ba179] hover:shadow-lg"
            >
              {getTranslation(t, "header.tab5", "Login")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header bgColor="#fff" />
      <GuestNavbar search={search} setSearch={setSearch} setPage={setPage} />
      <div className="min-h-screen bg-gray-50 pt-32 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-8 ${textAlign}`}>
            <h1 className="text-3xl font-bold text-gray-900">
              {getTranslation(t, "sidemenu.tab4", "My Bookings")}
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              {getTranslation(t, "events.viewYourBookings", "View and manage your event bookings")}
            </p>
          </div>

        {/* Requirement #1: Tabs - Only Approved, Pending, Rejected */}
        <div className="mb-6 flex justify-center">
          <div className={`inline-flex rounded-md shadow-sm bg-white border border-gray-200 overflow-hidden ${flexDirection}`}>
            <button
              onClick={() => setActiveTab("approved")}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "approved"
                  ? "bg-[#a797cc] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } ${isRTL ? "rounded-r-md" : "rounded-l-md"}`}
            >
              {getTranslation(t, "events.approved", "Approved")}
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-6 py-3 text-sm font-medium transition-colors ${isRTL ? "border-r" : "border-l"} ${isRTL ? "border-l" : "border-r"} border-gray-200 ${
                activeTab === "pending"
                  ? "bg-[#a797cc] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {getTranslation(t, "events.pending", "Pending")}
            </button>
            <button
              onClick={() => setActiveTab("rejected")}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "rejected"
                  ? "bg-[#a797cc] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } ${isRTL ? "rounded-l-md" : "rounded-r-md"}`}
            >
              {getTranslation(t, "events.rejected", "Rejected")}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a797cc]"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className={`text-center py-16 bg-white rounded-xl shadow-sm ${textAlign}`}>
            <Icon icon="lucide:calendar" className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {getTranslation(t, "events.noBookings", "No bookings found")}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === "approved" && getTranslation(t, "events.noApprovedBookings", "No approved bookings found")}
              {activeTab === "pending" && getTranslation(t, "events.noPendingBookings", "No pending bookings found")}
              {activeTab === "rejected" && getTranslation(t, "events.noRejectedBookings", "No rejected bookings found")}
            </p>
            <div className="mt-6">
              <Link
                href="/events"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-[#a797cc] to-[#8ba179] hover:shadow-lg"
              >
                {getTranslation(t, "events.exploreEvents", "Explore Events")}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBookings.map((booking) => {
              // Check if event is upcoming or past
              const eventDate = new Date(booking.event?.event_date || 0);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const isUpcoming = eventDate >= today;
              
              return (
              <div key={booking._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Event Image */}
                <div className="relative">
                  <EventPlaceholder
                    src={booking.event?.event_images?.[0] || booking.event?.event_image}
                    alt={booking.event?.event_name || "Event"}
                    className="h-48 rounded-t-xl"
                  />
                  <div className={`absolute top-4 ${isRTL ? "left-4" : "right-4"}`}>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[booking.status]?.color || "bg-gray-100 text-gray-800"}`}>
                      <Icon icon={statusConfig[booking.status]?.icon || "lucide:help-circle"} className={`${marginEnd(1)} h-3 w-3`} />
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {booking.event?.event_name || getTranslation(t, "events.eventNotAvailable", "Event not available")}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className={`flex items-start justify-between ${flexDirection}`}>
                      <div className={`flex items-start ${flexDirection}`}>
                        <Icon icon="lucide:calendar" className={`mt-0.5 ${marginEnd(2)} h-4 w-4 text-gray-500`} />
                        <span className={`text-sm text-gray-600 ${textAlign}`}>
                          {booking.event?.event_date 
                            ? formatDate(booking.event.event_date) 
                            : getTranslation(t, "events.dateNotAvailable", "Date not available")}
                        </span>
                      </div>
                      {activeTab === "approved" && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isUpcoming 
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {isUpcoming 
                            ? getTranslation(t, "events.upcoming", "Upcoming")
                            : getTranslation(t, "events.past", "Past")}
                        </span>
                      )}
                    </div>
                    
                    <div className={`flex items-start ${flexDirection}`}>
                      <Icon icon="lucide:users" className={`mt-0.5 ${marginEnd(2)} h-4 w-4 text-gray-500`} />
                      <span className={`text-sm text-gray-600 ${textAlign}`}>
                        {booking.attendees} {getTranslation(t, "events.attendees", "attendees")}
                      </span>
                    </div>
                    
                    <div className={`flex items-start justify-between ${flexDirection}`}>
                      <div className={`flex items-start ${flexDirection}`}>
                        <Icon icon="lucide:credit-card" className={`mt-0.5 ${marginEnd(2)} h-4 w-4 text-gray-500`} />
                        <span className={`text-sm text-gray-600 ${textAlign}`}>
                          {getPaymentStatusText(booking.payment_status)}
                        </span>
                      </div>
                      {/* Payment Status Badge */}
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        booking.payment_status 
                          ? "bg-green-100 text-green-700 border border-green-300" 
                          : "bg-blue-100 text-blue-700 border border-blue-300"
                      }`}>
                        {booking.payment_status 
                          ? getTranslation(t, "events.paid", "Paid") 
                          : getTranslation(t, "events.unpaid", "Unpaid")}
                      </span>
                    </div>

                    {/* Event Time */}
                    {(booking.event?.event_start_time || booking.event_start_time) && (
                      <div className={`flex items-start ${flexDirection}`}>
                        <Icon icon="lucide:clock" className={`mt-0.5 ${marginEnd(2)} h-4 w-4 text-gray-500`} />
                        <span className={`text-sm text-gray-600 ${textAlign}`}>
                          {formatTime(booking.event?.event_start_time || booking.event_start_time)}
                          {(booking.event?.event_end_time || booking.event_end_time) && 
                            ` - ${formatTime(booking.event?.event_end_time || booking.event_end_time)}`
                          }
                        </span>
                      </div>
                    )}

                    {/* Event Location */}
                    {(booking.event?.event_address || booking.event_address) && (
                      <div className={`flex items-start ${flexDirection}`}>
                        <Icon icon="lucide:map-pin" className={`mt-0.5 ${marginEnd(2)} h-4 w-4 text-gray-500 flex-shrink-0`} />
                        <span className={`text-sm text-gray-600 ${textAlign} line-clamp-1`}>
                          {booking.event?.event_address || booking.event_address}
                        </span>
                      </div>
                    )}

                    {/* Total Amount */}
                    {booking.total_amount && (
                      <div className={`flex items-start justify-between ${flexDirection}`}>
                        <div className={`flex items-start ${flexDirection}`}>
                          <Icon icon="lucide:dollar-sign" className={`mt-0.5 ${marginEnd(2)} h-4 w-4 text-gray-500`} />
                          <span className={`text-sm font-medium text-gray-900 ${textAlign}`}>
                            {formatCurrency(booking.total_amount)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Organizer Name */}
                    {(booking.organizer?.first_name || booking.organizer?.last_name || booking.event?.organizer?.first_name) && (
                      <div className={`flex items-start ${flexDirection}`}>
                        <Icon icon="lucide:user" className={`mt-0.5 ${marginEnd(2)} h-4 w-4 text-gray-500`} />
                        <span className={`text-sm text-gray-600 ${textAlign}`}>
                          {getTranslation(t, "events.organizer", "Organizer")}: {(() => {
                            const firstName = booking.organizer?.first_name || booking.event?.organizer?.first_name || "";
                            const lastName = booking.organizer?.last_name || booking.event?.organizer?.last_name || "";
                            return `${firstName} ${lastName}`.trim();
                          })()}
                        </span>
                      </div>
                    )}

                    {/* Event Category */}
                    {(booking.event?.event_category || booking.event_category) && (
                      <div className={`flex items-start ${flexDirection}`}>
                        <Icon icon="lucide:tag" className={`mt-0.5 ${marginEnd(2)} h-4 w-4 text-gray-500`} />
                        <span className={`text-sm text-gray-600 ${textAlign}`}>
                          {booking.event?.event_category || booking.event_category}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    {/* Primary Actions Row */}
                    <div className="flex gap-2">
                      <Link
                        href={`/events/${booking.event?._id}`}
                        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all"
                      >
                        <Icon icon="lucide:eye" className={`h-4 w-4 ${marginEnd(2)}`} />
                        {getTranslation(t, "events.viewDetails", "View Details")}
                      </Link>
                      
                      {/* Group Chat Button - Show for paid bookings (status 2 with payment_status 1) */}
                      {booking.status === 2 && booking.payment_status === 1 && booking.event?._id && (
                        <Link
                          href={`/messaging?event_id=${booking.event._id}`}
                          className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all"
                        >
                          <Icon icon="lucide:message-circle" className={`h-4 w-4 ${marginEnd(2)}`} />
                          {getTranslation(t, "events.openGroupChat", "Group Chat")}
                        </Link>
                      )}
                      
                      {/* Payment Button - Show for approved bookings (status 1) that are unpaid */}
                      {booking.status === 1 && !booking.payment_status && (
                        <Link
                          href={`/events/${booking.event?._id}?initiate_payment=true`}
                          className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-[#a797cc] to-[#8ba179] hover:shadow-lg transition-all"
                        >
                          <Icon icon="lucide:credit-card" className={`h-4 w-4 ${marginEnd(2)}`} />
                          {getTranslation(t, "events.proceedToPayment", "Proceed to Payment")}
                        </Link>
                      )}
                    </div>
                    
                    {/* Secondary Actions Row */}
                    <div className="flex gap-2">
                      {/* Cancel Button - Show for approved (1) or confirmed (2) bookings that are not already cancelled */}
                      {(booking.status === 1 || booking.status === 2) && booking.status !== 3 && (
                        <button
                          onClick={() => handleCancelBookingClick(booking._id)}
                          className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-all"
                        >
                          <Icon icon="lucide:x-circle" className={`h-4 w-4 ${marginEnd(2)}`} />
                          {getTranslation(t, "events.cancelBooking", "Cancel Booking")}
                        </button>
                      )}
                      
                      {/* Invoice Download - Show for paid bookings */}
                      {booking.status === 2 && booking.payment_status === 1 && booking.invoice_url && (
                        <a
                          href={booking.invoice_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 transition-all"
                        >
                          <Icon icon="lucide:file-text" className={`h-4 w-4 ${marginEnd(2)}`} />
                          {getTranslation(t, "events.downloadInvoice", "Invoice")}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>
      
      {/* Cancel Confirmation Dialog */}
      <CancelConfirmDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleCancelBooking}
        isLoading={isReserving}
        type="booking"
        showRefundWarning={true}
      />
      </div>
      <Footer />
    </>
  );
}
