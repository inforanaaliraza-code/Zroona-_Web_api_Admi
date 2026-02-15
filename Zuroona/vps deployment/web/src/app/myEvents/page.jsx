"use client";

import { useEffect, useState } from "react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import useAuthStore from "@/store/useAuthStore";
import { CancelBookingApi } from "@/app/api/setting";
import { fetchUserBookings, setActiveTab, removeBooking } from "@/redux/slices/bookingsSlice";
import { useRTL } from "@/utils/rtl";
import Header from "@/components/Header/Header";
import GuestNavbar from "@/components/Header/GuestNavbar";
import Footer from "@/components/Footer/Footer";
import CancelConfirmDialog from "@/components/ui/CancelConfirmDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip-shadcn";
import ImageModal from "@/components/ui/image-modal";
import InvoiceRow from "@/components/Invoice/InvoiceRow";
import { getEventImages, getPrimaryEventImage } from "@/utils/imageUtils";

// Helper function to safely get translations with fallbacks
const getTranslation = (t, key, fallback) => {
  try {
    const translation = t(key);
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
  const { token, isAuthenticated } = useAuthStore();
  const { isRTL, textAlign, flexDirection } = useRTL();
  const router = useRouter();
  const dispatch = useDispatch();

  // Redux state
  const { bookings, filteredBookings, loading, error, activeTab } = useSelector(
    (state) => state.bookings
  );

  // Local state
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isReserving, setIsReserving] = useState(false);
  const [search, setSearch] = useState("");
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch bookings on mount
  useEffect(() => {
    if (!token || !isAuthenticated) {
      return;
    }
    dispatch(fetchUserBookings());
  }, [token, isAuthenticated, dispatch]);

  // Handle tab change
  const handleTabChange = (value) => {
    dispatch(setActiveTab(value));
  };

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
        reason: reason || undefined,
      });

      if (response && (response.status === 1 || response.status === true)) {
        toast.success(getTranslation(t, "events.bookingCancelled", "Booking cancelled successfully"));
        // Remove booking from Redux store
        dispatch(removeBooking(selectedBookingId));
        // Refresh bookings
        dispatch(fetchUserBookings());
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

  // Handle image click to open modal
  const handleImageClick = (booking) => {
    const images = getEventImages(booking.event || {});
    if (images && images.length > 0) {
      setSelectedImages(images);
      setSelectedImageIndex(0);
      setImageModalOpen(true);
    }
  };

  // Format helpers
  const formatDate = (dateString) => {
    if (!dateString) return getTranslation(t, "events.dateNotAvailable", "N/A");
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    try {
      const time = new Date(`2000-01-01T${timeString}`);
      return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return timeString;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return getTranslation(t, "common.notAvailable", "N/A");
    return `${amount.toLocaleString()} ${getTranslation(t, "common.currency", "SAR")}`;
  };

  // Status configuration
  const getStatusConfig = (status) => {
    const configs = {
      1: { 
        color: "bg-yellow-100 text-yellow-800 border-yellow-300", 
        icon: "lucide:clock",
        label: getTranslation(t, "events.waitingByHost", "Pending") || getTranslation(t, "events.pending", "Pending")
      },
      2: { 
        color: "bg-green-100 text-green-800 border-green-300", 
        icon: "lucide:check-circle-2",
        label: getTranslation(t, "events.approved", "Approved")
      },
      3: { 
        color: "bg-red-100 text-red-800 border-red-300", 
        icon: "lucide:x-circle",
        label: getTranslation(t, "events.cancelled", "Cancelled")
      },
      4: { 
        color: "bg-gray-100 text-gray-800 border-gray-300", 
        icon: "lucide:x",
        label: getTranslation(t, "events.rejected", "Rejected")
      },
    };
    return configs[status] || configs[1];
  };

  if (!token || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <Icon icon="lucide:lock" className="mx-auto h-16 w-16 text-gray-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">
            {getTranslation(t, "events.pleaseLogin", "Please login to continue")}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {getTranslation(t, "events.loginToViewBookings", "Please login to view your bookings")}
          </p>
          <div className="mt-6">
            <Button
              onClick={() => router.push("/login")}
              className="bg-gradient-to-r from-[#a797cc] to-[#8ba179] hover:shadow-lg"
            >
              {getTranslation(t, "header.tab5", "Login")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Header bgColor="#fff" />
      <GuestNavbar search={search} setSearch={setSearch} setPage={() => {}} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-32 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[80%] xl:max-w-7xl mx-auto">
          {/* Header Section */}
          <div className={`mb-8 ${textAlign}`}>
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {getTranslation(t, "sidemenu.tab4", "My Bookings")}
              </h1>
              <p className="text-lg text-gray-600">
                {getTranslation(t, "events.viewYourBookings", "View and manage your event bookings")}
              </p>
            </div>

            {/* Booking Flow Guide */}
            <div className="mt-6 bg-gradient-to-r from-[#a797cc]/10 via-purple-50/50 to-[#8ba179]/10 rounded-2xl p-6 border-2 border-[#a797cc]/20 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Icon icon="lucide:info" className="h-5 w-5 text-[#a797cc]" />
                {getTranslation(t, "events.bookingFlow", "Booking Flow")}
              </h3>
              <div className={`flex flex-wrap items-center justify-center gap-4 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                {[
                  { step: 1, label: t("events.bookEvent") || "Book Event", color: "bg-blue-500" },
                  { step: 2, label: t("events.waitApproval") || "Wait for Host Approval", color: "bg-yellow-500" },
                  { step: 3, label: t("events.makePayment") || "Make Payment", color: "bg-orange-500" },
                  { step: 4, label: t("events.joinGroupChat") || "Join Group Chat", color: "bg-green-500" },
                ].map((item, index, array) => (
                  <React.Fragment key={item.step}>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${item.color} text-white font-bold shadow-md`}>
                        {item.step}
                      </div>
                      <span className={`text-gray-700 font-medium ${textAlign}`}>{item.label}</span>
                    </div>
                    {index < array.length - 1 && (
                      <Icon icon={isRTL ? "lucide:arrow-left" : "lucide:arrow-right"} className="w-5 h-5 text-gray-400" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-white border-2 border-gray-200 rounded-xl p-1 h-auto">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#a797cc] data-[state=active]:to-[#8ba179] data-[state=active]:text-white"
                >
                  {getTranslation(t, "events.all", "All")}
                </TabsTrigger>
                <TabsTrigger 
                  value="approved"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#a797cc] data-[state=active]:to-[#8ba179] data-[state=active]:text-white"
                >
                  {getTranslation(t, "events.approved", "Approved")}
                </TabsTrigger>
                <TabsTrigger 
                  value="pending"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#a797cc] data-[state=active]:to-[#8ba179] data-[state=active]:text-white"
                >
                  {getTranslation(t, "events.waitingByHost", "Pending") || getTranslation(t, "events.pending", "Pending")}
                </TabsTrigger>
                <TabsTrigger 
                  value="rejected"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#a797cc] data-[state=active]:to-[#8ba179] data-[state=active]:text-white"
                >
                  {getTranslation(t, "events.rejected", "Rejected")}
                </TabsTrigger>
                <TabsTrigger 
                  value="cancelled"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#a797cc] data-[state=active]:to-[#8ba179] data-[state=active]:text-white"
                >
                  {getTranslation(t, "events.cancelled", "Cancelled")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a797cc]"></div>
            </div>
          ) : error ? (
            <div className={`text-center py-16 bg-white rounded-xl shadow-sm ${textAlign}`}>
              <Icon icon="lucide:alert-circle" className="mx-auto h-12 w-12 text-red-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">{error}</h3>
              <div className="mt-6">
                <Button
                  onClick={() => dispatch(fetchUserBookings())}
                  className="bg-gradient-to-r from-[#a797cc] to-[#8ba179] hover:shadow-lg"
                >
                  {getTranslation(t, "events.retry", "Retry")}
                </Button>
              </div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className={`text-center py-16 bg-white rounded-xl shadow-sm ${textAlign}`}>
              <Icon icon="lucide:calendar" className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {getTranslation(t, "events.noBookings", "No bookings found")}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === "all" && getTranslation(t, "events.noBookingsDesc", "You haven't made any bookings yet")}
                {activeTab === "approved" && getTranslation(t, "events.noApprovedBookings", "No approved bookings found")}
                {activeTab === "pending" && getTranslation(t, "events.noPendingBookings", "No pending bookings found")}
                {activeTab === "rejected" && getTranslation(t, "events.noRejectedBookings", "No rejected bookings found")}
                {activeTab === "cancelled" && getTranslation(t, "events.noCancelledBookings", "No cancelled bookings found")}
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => router.push("/events")}
                  className="bg-gradient-to-r from-[#a797cc] to-[#8ba179] hover:shadow-lg"
                  asChild
                >
                  <a href="/events">
                    {getTranslation(t, "events.exploreEvents", "Explore Events")}
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-[#a797cc]/10 to-[#8ba179]/10 border-b border-gray-200">
                    <tr>
                      <th className={`px-6 py-4 ${textAlign} text-xs font-semibold text-gray-700 uppercase tracking-wider`}>
                        {getTranslation(t, "events.event", "Event")}
                      </th>
                      <th className={`px-6 py-4 ${textAlign} text-xs font-semibold text-gray-700 uppercase tracking-wider`}>
                        {getTranslation(t, "events.date", "Date & Time")}
                      </th>
                      <th className={`px-6 py-4 ${textAlign} text-xs font-semibold text-gray-700 uppercase tracking-wider`}>
                        {getTranslation(t, "events.location", "Location")}
                      </th>
                      <th className={`px-6 py-4 ${textAlign} text-xs font-semibold text-gray-700 uppercase tracking-wider`}>
                        {getTranslation(t, "events.attendees", "Attendees")}
                      </th>
                      <th className={`px-6 py-4 ${textAlign} text-xs font-semibold text-gray-700 uppercase tracking-wider`}>
                        {getTranslation(t, "events.totalAmount", "Total")}
                      </th>
                      <th className={`px-6 py-4 ${textAlign} text-xs font-semibold text-gray-700 uppercase tracking-wider`}>
                        {getTranslation(t, "events.status", "Status")}
                      </th>
                      <th className={`px-6 py-4 ${textAlign} text-xs font-semibold text-gray-700 uppercase tracking-wider`}>
                        {getTranslation(t, "events.payment", "Payment")}
                      </th>
                      <th className={`px-6 py-4 ${textAlign} text-xs font-semibold text-gray-700 uppercase tracking-wider`}>
                        {getTranslation(t, "actions", "Actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking) => {
                      const status = getStatusConfig(booking.status);
                      const showInvoice = booking.status === 2 && booking.payment_status === 1 && booking.invoice_url;
                      const showGroupChat = booking.status === 2 && booking.payment_status === 1 && booking.event?._id;
                      const showPayment = booking.status === 2 && !booking.payment_status;
                      const showCancel = (booking.status === 1 || booking.status === 2) && booking.status !== 3;
                      const showRefundRequest = booking.status === 3 && booking.payment_status === 1 && !booking.refund_request_id;
                      const showViewRefund = booking.refund_request_id;
                      const eventImage = getPrimaryEventImage(booking.event || {});
                      const eventImages = getEventImages(booking.event || {});

                      return (
                        <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                          {/* Event Image & Name */}
                          <td className={`px-6 py-4 ${textAlign}`}>
                            <div className={`flex items-center gap-3 ${flexDirection}`}>
                              <div 
                                className="relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer group flex-shrink-0"
                                onClick={() => handleImageClick(booking)}
                              >
                                <Image
                                  src={eventImage}
                                  alt={booking.event?.event_name || "Event"}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                                  onError={(e) => {
                                    e.target.src = "/assets/images/home/event1.png";
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                  <Icon icon="lucide:maximize-2" className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start gap-2">
                                  <Badge variant="outline" className={`${status.color} border-2 text-xs`}>
                                    <Icon icon={status.icon} className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                                    {status.label}
                                  </Badge>
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 mt-1 line-clamp-2">
                                  {booking.event?.event_name || getTranslation(t, "events.eventNotAvailable", "Event not available")}
                                </h3>
                                {booking.organizer?.first_name || booking.event?.organizer?.first_name ? (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {getTranslation(t, "events.organizer", "Organizer")}: {booking.organizer?.first_name || booking.event?.organizer?.first_name || ""} {booking.organizer?.last_name || booking.event?.organizer?.last_name || ""}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          </td>

                          {/* Date & Time */}
                          <td className={`px-6 py-4 whitespace-nowrap ${textAlign}`}>
                            <div className="text-sm text-gray-900">
                              <div className={`flex items-center gap-1 mb-1 ${flexDirection}`}>
                                <Icon icon="lucide:calendar" className="w-4 h-4 text-[#a797cc]" />
                                <span className="font-medium">{formatDate(booking.event?.event_date)}</span>
                              </div>
                              {(booking.event?.event_start_time || booking.event_start_time) && (
                                <div className={`flex items-center gap-1 text-xs text-gray-600 ${flexDirection}`}>
                                  <Icon icon="lucide:clock" className="w-3 h-3" />
                                  <span>
                                    {formatTime(booking.event?.event_start_time || booking.event_start_time)}
                                    {(booking.event?.event_end_time || booking.event_end_time) && 
                                      ` - ${formatTime(booking.event?.event_end_time || booking.event_end_time)}`
                                    }
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Location */}
                          <td className={`px-6 py-4 ${textAlign}`}>
                            {(booking.event?.event_address || booking.event_address) ? (
                              <div className={`flex items-start gap-1 text-sm text-gray-600 max-w-[200px] ${flexDirection}`}>
                                <Icon icon="lucide:map-pin" className="w-4 h-4 text-[#a797cc] flex-shrink-0 mt-0.5" />
                                <span className="line-clamp-2">{booking.event?.event_address || booking.event_address}</span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">{getTranslation(t, "common.notAvailable", "N/A")}</span>
                            )}
                          </td>

                          {/* Attendees */}
                          <td className={`px-6 py-4 whitespace-nowrap ${textAlign}`}>
                            <div className={`flex items-center gap-1 text-sm text-gray-900 ${flexDirection}`}>
                              <Icon icon="lucide:users" className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">{booking.attendees || booking.no_of_attendees || 0}</span>
                            </div>
                          </td>

                          {/* Total Amount */}
                          <td className={`px-6 py-4 whitespace-nowrap ${textAlign}`}>
                            <div className={`flex items-center gap-1 text-sm font-semibold text-[#a797cc] ${flexDirection}`}>
                              <Icon icon="lucide:dollar-sign" className="w-4 h-4" />
                              <span>{formatCurrency(booking.total_amount)}</span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className={`px-6 py-4 whitespace-nowrap ${textAlign}`}>
                            <Badge variant="outline" className={`${status.color} border-2`}>
                              <Icon icon={status.icon} className="w-3 h-3 mr-1" />
                              {status.label}
                            </Badge>
                          </td>

                          {/* Payment Status */}
                          <td className={`px-6 py-4 whitespace-nowrap ${textAlign}`}>
                            <Badge 
                              variant={booking.payment_status ? "default" : "secondary"}
                              className={booking.payment_status 
                                ? "bg-green-100 text-green-700 border-green-300" 
                                : "bg-yellow-100 text-yellow-700 border-yellow-300"}
                            >
                              <Icon 
                                icon={booking.payment_status ? "lucide:check-circle-2" : "lucide:clock"} 
                                className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} 
                              />
                              {booking.payment_status 
                                ? getTranslation(t, "events.paid", "Paid") 
                                : getTranslation(t, "events.unpaid", "Unpaid")}
                            </Badge>
                            {showInvoice && (
                              <div className="mt-2">
                                <InvoiceRow booking={booking} />
                              </div>
                            )}
                          </td>

                          {/* Actions */}
                          <td className={`px-6 py-4 whitespace-nowrap ${textAlign}`}>
                            <div className={`flex items-center gap-2 flex-wrap ${flexDirection}`}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-3 text-xs"
                                    asChild
                                  >
                                    <Link href={`/events/${booking.event?._id}`}>
                                      <Icon icon="lucide:eye" className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                                      {getTranslation(t, "events.viewDetails", "View")}
                                    </Link>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{getTranslation(t, "events.viewDetailsTooltip", "View full event details")}</p>
                                </TooltipContent>
                              </Tooltip>

                              {showGroupChat && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="default"
                                      size="sm"
                                      className="h-8 px-3 text-xs bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                                      asChild
                                    >
                                      <Link href={`/messaging?event_id=${booking.event._id}`}>
                                        <Icon icon="lucide:message-circle" className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                                        {getTranslation(t, "events.chat", "Chat")}
                                      </Link>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{getTranslation(t, "events.groupChatTooltip", "Join group chat")}</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}

                              {showPayment && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="default"
                                      size="sm"
                                      className="h-8 px-3 text-xs bg-gradient-to-r from-[#a797cc] to-[#8ba179]"
                                      asChild
                                    >
                                      <Link href={`/events/${booking.event?._id}?initiate_payment=true`}>
                                        <Icon icon="lucide:credit-card" className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                                        {getTranslation(t, "events.pay", "Pay")}
                                      </Link>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{getTranslation(t, "events.paymentTooltip", "Complete payment")}</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}

                              {showCancel && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      className="h-8 px-3 text-xs"
                                      onClick={() => handleCancelBookingClick(booking._id)}
                                    >
                                      <Icon icon="lucide:x-circle" className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                                      {getTranslation(t, "events.cancel", "Cancel")}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{getTranslation(t, "events.cancelTooltip", "Cancel booking")}</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}

                              {showRefundRequest && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 px-3 text-xs border-orange-300 text-orange-700 hover:bg-orange-50"
                                      asChild
                                    >
                                      <Link href={`/refunds/request?booking_id=${booking._id}`}>
                                        <Icon icon="lucide:receipt-refund" className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                                        {getTranslation(t, "events.refund", "Refund")}
                                      </Link>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{getTranslation(t, "events.refundRequestTooltip", "Request refund")}</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}

                              {showViewRefund && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 px-3 text-xs border-blue-300 text-blue-700 hover:bg-blue-50"
                                      asChild
                                    >
                                      <Link href={`/refunds/${booking.refund_request_id}`}>
                                        <Icon icon="lucide:receipt" className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                                        {getTranslation(t, "events.viewRefund", "View Refund")}
                                      </Link>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{getTranslation(t, "events.viewRefundTooltip", "View refund status")}</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4 p-4">
                {filteredBookings.map((booking) => {
                  const status = getStatusConfig(booking.status);
                  const showInvoice = booking.status === 2 && booking.payment_status === 1 && booking.invoice_url;
                  const showGroupChat = booking.status === 2 && booking.payment_status === 1 && booking.event?._id;
                  const showPayment = booking.status === 2 && !booking.payment_status;
                  const showCancel = (booking.status === 1 || booking.status === 2) && booking.status !== 3;
                  const showRefundRequest = booking.status === 3 && booking.payment_status === 1 && !booking.refund_request_id;
                  const showViewRefund = booking.refund_request_id;
                  const eventImage = getPrimaryEventImage(booking.event || {});
                  const eventImages = getEventImages(booking.event || {});

                  return (
                    <div key={booking._id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
                      {/* Image and Status */}
                      <div className="relative">
                        <div 
                          className="relative w-full h-48 rounded-lg overflow-hidden cursor-pointer group"
                          onClick={() => handleImageClick(booking)}
                        >
                          <Image
                            src={eventImage}
                            alt={booking.event?.event_name || "Event"}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = "/assets/images/home/event1.png";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                            <Icon icon="lucide:maximize-2" className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <div className={`absolute top-2 ${isRTL ? "left-2" : "right-2"}`}>
                          <Badge variant="outline" className={`${status.color} border-2`}>
                            <Icon icon={status.icon} className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>
                      </div>

                      {/* Event Info */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {booking.event?.event_name || getTranslation(t, "events.eventNotAvailable", "Event not available")}
                        </h3>
                        
                        <div className="space-y-2 text-sm">
                          <div className={`flex items-center gap-2 ${flexDirection}`}>
                            <Icon icon="lucide:calendar" className="w-4 h-4 text-[#a797cc]" />
                            <span className="text-gray-700">{formatDate(booking.event?.event_date)}</span>
                            {(booking.event?.event_start_time || booking.event_start_time) && (
                              <>
                                <span className="text-gray-400">•</span>
                                <Icon icon="lucide:clock" className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">
                                  {formatTime(booking.event?.event_start_time || booking.event_start_time)}
                                  {(booking.event?.event_end_time || booking.event_end_time) && 
                                    ` - ${formatTime(booking.event?.event_end_time || booking.event_end_time)}`
                                  }
                                </span>
                              </>
                            )}
                          </div>

                          {(booking.event?.event_address || booking.event_address) && (
                            <div className={`flex items-start gap-2 ${flexDirection}`}>
                              <Icon icon="lucide:map-pin" className="w-4 h-4 text-[#a797cc] flex-shrink-0 mt-0.5" />
                              <span className="text-gray-600">{booking.event?.event_address || booking.event_address}</span>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                            <div>
                              <p className="text-xs text-gray-500">{getTranslation(t, "events.attendees", "Attendees")}</p>
                              <p className="text-sm font-semibold text-gray-900">{booking.attendees || booking.no_of_attendees || 0}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">{getTranslation(t, "events.totalAmount", "Total")}</p>
                              <p className="text-sm font-semibold text-[#a797cc]">{formatCurrency(booking.total_amount)}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t">
                            <Badge 
                              variant={booking.payment_status ? "default" : "secondary"}
                              className={booking.payment_status 
                                ? "bg-green-100 text-green-700 border-green-300" 
                                : "bg-yellow-100 text-yellow-700 border-yellow-300"}
                            >
                              <Icon 
                                icon={booking.payment_status ? "lucide:check-circle-2" : "lucide:clock"} 
                                className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} 
                              />
                              {booking.payment_status 
                                ? getTranslation(t, "events.paid", "Paid") 
                                : getTranslation(t, "events.unpaid", "Unpaid")}
                            </Badge>
                            {showInvoice && <InvoiceRow booking={booking} />}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 pt-2 border-t">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" asChild>
                            <Link href={`/events/${booking.event?._id}`}>
                              <Icon icon="lucide:eye" className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                              {getTranslation(t, "events.viewDetails", "View Details")}
                            </Link>
                          </Button>
                          {showGroupChat && (
                            <Button variant="default" size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600" asChild>
                              <Link href={`/messaging?event_id=${booking.event._id}`}>
                                <Icon icon="lucide:message-circle" className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                                {getTranslation(t, "events.chat", "Chat")}
                              </Link>
                            </Button>
                          )}
                          {showPayment && (
                            <Button variant="default" size="sm" className="flex-1 bg-gradient-to-r from-[#a797cc] to-[#8ba179]" asChild>
                              <Link href={`/events/${booking.event?._id}?initiate_payment=true`}>
                                <Icon icon="lucide:credit-card" className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                                {getTranslation(t, "events.pay", "Pay")}
                              </Link>
                            </Button>
                          )}
                        </div>
                        {(showCancel || showRefundRequest || showViewRefund) && (
                          <div className="flex gap-2">
                            {showCancel && (
                              <Button variant="destructive" size="sm" className="flex-1" onClick={() => handleCancelBookingClick(booking._id)}>
                                <Icon icon="lucide:x-circle" className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                                {getTranslation(t, "events.cancel", "Cancel")}
                              </Button>
                            )}
                            {showRefundRequest && (
                              <Button variant="outline" size="sm" className="flex-1 border-orange-300 text-orange-700" asChild>
                                <Link href={`/refunds/request?booking_id=${booking._id}`}>
                                  <Icon icon="lucide:receipt-refund" className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                                  {getTranslation(t, "events.refund", "Refund")}
                                </Link>
                              </Button>
                            )}
                            {showViewRefund && (
                              <Button variant="outline" size="sm" className="flex-1 border-blue-300 text-blue-700" asChild>
                                <Link href={`/refunds/${booking.refund_request_id}`}>
                                  <Icon icon="lucide:receipt" className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                                  {getTranslation(t, "events.viewRefund", "View Refund")}
                                </Link>
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
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

      {/* Image Modal */}
      <ImageModal
        images={selectedImages}
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        initialIndex={selectedImageIndex}
      />

      <Footer />
    </TooltipProvider>
  );
}
