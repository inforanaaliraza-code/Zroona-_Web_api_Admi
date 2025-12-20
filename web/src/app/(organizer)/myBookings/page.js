"use client";

import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Loader from "@/components/Loader/Loader";
import Paginations from "@/components/Paginations/Pagination";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { getBookingList } from "@/redux/slices/OrganizerBookingList";
import { useTranslation } from "react-i18next";
import { ChangeStatusOrganizerApi } from "@/app/api/myBookings/apis";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronDown, 
  ChevronUp, 
  Check, 
  X, 
  MessageCircle, 
  CreditCard,
  Users,
  Calendar,
  MapPin,
  DollarSign
} from "lucide-react";
import { useRTL } from "@/utils/rtl";
import { Icon } from "@iconify/react";

export default function MyBookings() {
  const { t } = useTranslation();
  const { isRTL, flexDirection, textAlign, chevronIcon } = useRTL();
  const breadcrumbItems = [
    { label: t("breadcrumb.tab1"), href: "/joinUsEvent" },
    { label: t("breadcrumb.tab4"), href: "/myBookings" },
  ];
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all"); // all, pending, approved, rejected
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [activePage, setActivePage] = useState(100);
  const [expandedEvents, setExpandedEvents] = useState({});
  const [processingBooking, setProcessingBooking] = useState(null);

  const handlePage = (value) => {
    setPage(value);
  };

  const { BookingList, loading } = useSelector(
    (state) => state.BookingListData
  );

  // Get book_status based on active tab
  const getBookStatus = () => {
    switch (activeTab) {
      case "pending":
        return "0"; // Pending bookings (status 0 or 1)
      case "approved":
        return "2"; // Approved bookings
      case "rejected":
        return "3"; // Rejected bookings
      default:
        return ""; // All bookings
    }
  };

  useEffect(() => {
    dispatch(
      getBookingList({
        page: page,
        search: search,
        limit: activePage,
        book_status: getBookStatus(),
        event_date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
      })
    );
  }, [page, search, selectedDate, activeTab, dispatch]);

  // Group bookings by event
  const groupBookingsByEvent = () => {
    if (!BookingList?.data) return [];
    
    const grouped = {};
    BookingList.data.forEach((booking) => {
      const eventId = booking.event_id || booking.eventDetails?._id || booking._id;
      const eventName = booking.event_name || booking.eventDetails?.event_name || "Unknown Event";
      
      if (!grouped[eventId]) {
        grouped[eventId] = {
          eventId,
          eventName,
          eventDate: booking.event_date || booking.eventDetails?.event_date,
          eventImage: booking.event_image || booking.eventDetails?.event_image,
          eventAddress: booking.event_address || booking.eventDetails?.event_address,
          bookings: [],
        };
      }
      
      grouped[eventId].bookings.push(booking);
    });
    
    return Object.values(grouped);
  };

  const groupedEvents = groupBookingsByEvent();

  const toggleEvent = (eventId) => {
    setExpandedEvents((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleAcceptReject = async (bookingId, action) => {
    setProcessingBooking(bookingId);
    try {
      const book_status = action === "accept" ? 2 : 3; // 2 = approved, 3 = rejected
      const response = await ChangeStatusOrganizerApi({
        book_id: bookingId,
        book_status: book_status,
      });

      if (response?.status === 1) {
        toast.success(
          response?.message || 
          `Booking ${action === "accept" ? "accepted" : "rejected"} successfully`
        );
        // Refresh the booking list
        dispatch(
          getBookingList({
            page: page,
            search: search,
            limit: activePage,
            book_status: getBookStatus(),
            event_date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
          })
        );
      } else {
        toast.error(response?.message || `Failed to ${action} booking`);
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error(`Failed to ${action} booking`);
    } finally {
      setProcessingBooking(null);
    }
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    if (paymentStatus === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          <Icon icon="lucide:check-circle" className="w-3 h-3" />
          {t("events.paid", "Paid")}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
        <Icon icon="lucide:clock" className="w-3 h-3" />
        {t("events.unpaid", "Unpaid")}
      </span>
    );
  };

  const getBookingStatusBadge = (bookStatus) => {
    if (bookStatus === 2) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          {t("approved") || "Approved"}
        </span>
      );
    } else if (bookStatus === 3) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
          {t("rejected") || "Rejected"}
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
        {t("pending") || "Pending"}
      </span>
    );
  };

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <section className="bg-gray-50 min-h-screen py-16">
        <div className="mx-auto px-4 md:px-8 xl:px-28">
          <div className="mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {t("breadcrumb.tab4") || "My Bookings"}
              </h2>
              <p className="text-gray-600">
                {t("events.manageBookings", "Manage all bookings for your events")}
              </p>
            </div>

            {/* Tabs */}
            <div className="mb-6 bg-white rounded-xl shadow-sm p-1 inline-flex">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-6 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeTab === "all"
                    ? "bg-[#a797cc] text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {t("events.all", "All")}
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`px-6 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeTab === "pending"
                    ? "bg-[#a797cc] text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {t("events.pending", "Pending")}
              </button>
              <button
                onClick={() => setActiveTab("approved")}
                className={`px-6 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeTab === "approved"
                    ? "bg-[#a797cc] text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {t("events.approved", "Approved")}
              </button>
              <button
                onClick={() => setActiveTab("rejected")}
                className={`px-6 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeTab === "rejected"
                    ? "bg-[#a797cc] text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {t("events.rejected", "Rejected")}
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('placeholder.search') || t('events.searchEvents') || 'Search events or guests...'}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#a797cc]"
              />
            </div>

            {loading ? (
              <div className="flex justify-center items-center w-full mb-10">
                <Loader height="30" />
              </div>
            ) : (
              <div className="space-y-4 mb-10">
                {groupedEvents.length > 0 ? (
                  groupedEvents.map((eventGroup) => {
                    const isExpanded = expandedEvents[eventGroup.eventId];
                    const pendingBookings = eventGroup.bookings.filter(
                      (b) => b.book_status === 0 || b.book_status === 1
                    );
                    const approvedBookings = eventGroup.bookings.filter(
                      (b) => b.book_status === 2
                    );
                    const rejectedBookings = eventGroup.bookings.filter(
                      (b) => b.book_status === 3
                    );
                    const paidBookings = eventGroup.bookings.filter(
                      (b) => b.payment_status === 1
                    );

                    return (
                      <div
                        key={eventGroup.eventId}
                        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
                      >
                        {/* Event Header - Expandable */}
                        <div
                          className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between ${flexDirection}`}
                          onClick={() => toggleEvent(eventGroup.eventId)}
                        >
                          <div className={`flex items-center gap-4 flex-1 ${flexDirection}`}>
                            {eventGroup.eventImage && (
                              <Image
                                src={eventGroup.eventImage}
                                alt={eventGroup.eventName}
                                width={100}
                                height={100}
                                className="rounded-xl object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {eventGroup.eventName}
                              </h3>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                {eventGroup.eventDate && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {format(new Date(eventGroup.eventDate), "MMM dd, yyyy")}
                                  </div>
                                )}
                                {eventGroup.eventAddress && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {eventGroup.eventAddress}
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-4 mt-3 text-sm">
                                <span className="flex items-center gap-1 text-gray-600">
                                  <Users className="w-4 h-4" />
                                  {t("events.totalBookings", "Total")}: {eventGroup.bookings.length}
                                </span>
                                {pendingBookings.length > 0 && (
                                  <span className="flex items-center gap-1 text-orange-600 font-medium">
                                    <Icon icon="lucide:clock" className="w-4 h-4" />
                                    {t("events.pending", "Pending")}: {pendingBookings.length}
                                  </span>
                                )}
                                {approvedBookings.length > 0 && (
                                  <span className="flex items-center gap-1 text-green-600 font-medium">
                                    <Icon icon="lucide:check-circle" className="w-4 h-4" />
                                    {t("events.approved", "Approved")}: {approvedBookings.length}
                                  </span>
                                )}
                                {paidBookings.length > 0 && (
                                  <span className="flex items-center gap-1 text-blue-600 font-medium">
                                    <CreditCard className="w-4 h-4" />
                                    {t("events.paid", "Paid")}: {paidBookings.length}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className={`flex items-center gap-2 ${flexDirection}`}>
                            {isExpanded ? (
                              <ChevronUp className={`w-5 h-5 text-gray-600 ${isRTL ? "rotate-180" : ""}`} />
                            ) : (
                              <ChevronDown className={`w-5 h-5 text-gray-600 ${isRTL ? "rotate-180" : ""}`} />
                            )}
                          </div>
                        </div>

                        {/* Guest Requests Table - Expandable */}
                        {isExpanded && (
                          <div className="border-t border-gray-200 bg-gray-50">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className={`px-6 py-4 ${textAlign} text-xs font-semibold text-gray-700 uppercase tracking-wider`}>
                                      {t("name") || "Guest Name"}
                                    </th>
                                    <th className={`px-6 py-4 ${textAlign} text-xs font-semibold text-gray-700 uppercase tracking-wider`}>
                                      {t("age") || "Age"}
                                    </th>
                                    <th className={`px-6 py-4 ${textAlign} text-xs font-semibold text-gray-700 uppercase tracking-wider`}>
                                      {t("nationality") || "Nationality"}
                                    </th>
                                    <th className={`px-6 py-4 ${textAlign} text-xs font-semibold text-gray-700 uppercase tracking-wider`}>
                                      {t("events.attendees", "Attendees")}
                                    </th>
                                    <th className={`px-6 py-4 ${textAlign} text-xs font-semibold text-gray-700 uppercase tracking-wider`}>
                                      {t("events.amount", "Amount")}
                                    </th>
                                    <th className={`px-6 py-4 ${textAlign} text-xs font-semibold text-gray-700 uppercase tracking-wider`}>
                                      {t("events.paymentStatus", "Payment")}
                                    </th>
                                    <th className={`px-6 py-4 ${textAlign} text-xs font-semibold text-gray-700 uppercase tracking-wider`}>
                                      {t("status") || "Status"}
                                    </th>
                                    <th className={`px-6 py-4 ${textAlign} text-xs font-semibold text-gray-700 uppercase tracking-wider`}>
                                      {t("actions") || "Actions"}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {eventGroup.bookings.map((booking) => {
                                    const userData = booking.userDetail || booking.user || {};
                                    const userName = 
                                      `${booking.user_first_name || userData.first_name || ""} ${booking.user_last_name || userData.last_name || ""}`.trim() || 
                                      t("events.unknown") || "Unknown";
                                    const userNationality = userData.nationality || booking.nationality || "N/A";
                                    const userDateOfBirth = userData.date_of_birth || booking.date_of_birth;
                                    const age = calculateAge(userDateOfBirth);
                                    const bookingStatus = booking.book_status;
                                    const isPending = bookingStatus === 0 || bookingStatus === 1;
                                    const isApproved = bookingStatus === 2;
                                    const isPaid = booking.payment_status === 1;

                                    return (
                                      <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                                        <td className={`px-6 py-4 whitespace-nowrap ${textAlign}`}>
                                          <div className={`flex items-center ${flexDirection}`}>
                                            {(booking.user_profile_image || userData.profile_image) && (
                                              <Image
                                                src={(() => {
                                                  const getImageUrl = (imgPath) => {
                                                    if (!imgPath) return "/assets/images/home/user-dummy.png";
                                                    if (imgPath.includes("http://") || imgPath.includes("https://")) return imgPath;
                                                    if (imgPath.startsWith("/uploads/")) {
                                                      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3434";
                                                      return `${apiBase}${imgPath}`;
                                                    }
                                                    return "/assets/images/home/user-dummy.png";
                                                  };
                                                  return getImageUrl(booking.user_profile_image || userData.profile_image);
                                                })()}
                                                alt={userName}
                                                width={40}
                                                height={40}
                                                className={`rounded-full border-2 border-gray-200 ${isRTL ? "ml-3" : "mr-3"}`}
                                                onError={(e) => {
                                                  e.target.src = "/assets/images/home/user-dummy.png";
                                                }}
                                              />
                                            )}
                                            <div>
                                              <div className="text-sm font-semibold text-gray-900">
                                                {userName}
                                              </div>
                                              {(userData.email || booking.user_email) && (
                                                <div className="text-xs text-gray-500">
                                                  {userData.email || booking.user_email}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-600 ${textAlign}`}>
                                          {age}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-600 ${textAlign}`}>
                                          {userNationality}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-600 ${textAlign}`}>
                                          <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            {booking.no_of_attendees || 1}
                                          </div>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 ${textAlign}`}>
                                          <div className="flex items-center gap-1">
                                            <DollarSign className="w-4 h-4 text-green-600" />
                                            {booking.total_amount || booking.event_price || 0} SAR
                                          </div>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap ${textAlign}`}>
                                          {getPaymentStatusBadge(booking.payment_status)}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap ${textAlign}`}>
                                          {getBookingStatusBadge(bookingStatus)}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${textAlign}`}>
                                          <div className={`flex items-center gap-2 ${flexDirection}`}>
                                            {isPending && (
                                              <>
                                                <button
                                                  onClick={() => handleAcceptReject(booking._id, "accept")}
                                                  disabled={processingBooking === booking._id}
                                                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium transition-colors"
                                                >
                                                  <Check className="w-4 h-4" />
                                                  {t("accept") || "Accept"}
                                                </button>
                                                <button
                                                  onClick={() => handleAcceptReject(booking._id, "reject")}
                                                  disabled={processingBooking === booking._id}
                                                  className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium transition-colors"
                                                >
                                                  <X className="w-4 h-4" />
                                                  {t("reject") || "Reject"}
                                                </button>
                                              </>
                                            )}
                                            {isApproved && isPaid && (
                                              <Link
                                                href={`/messaging?event_id=${booking.event_id}`}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-[#a797cc] text-white rounded-lg hover:bg-[#8ba179] text-xs font-medium transition-colors"
                                              >
                                                <MessageCircle className="w-4 h-4" />
                                                {t("events.groupChat", "Group Chat")}
                                              </Link>
                                            )}
                                            {!isPending && !(isApproved && isPaid) && (
                                              <span className="text-gray-400 text-xs">
                                                {t("events.processed") || t("processed") || "Processed"}
                                              </span>
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                    <Icon icon="lucide:inbox" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <span className="text-gray-600 text-lg">
                      {t("events.noDataFound") || t("tab.tab7") || "No bookings found"}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {BookingList?.total_count > activePage && (
              <Paginations
                handlePage={handlePage}
                page={page}
                total={BookingList.total_count}
                itemsPerPage={activePage}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
