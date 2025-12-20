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
import { ChevronDown, ChevronUp, Check, X } from "lucide-react";
import { useRTL } from "@/utils/rtl";

export default function MyBookings() {
  const { t } = useTranslation();
  const { isRTL, flexDirection, textAlign, chevronIcon } = useRTL();
  const breadcrumbItems = [
    { label: t("breadcrumb.tab1"), href: "/joinUsEvent" },
    { label: t("breadcrumb.tab4"), href: "/myBookings" },
  ];
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState(2); // Default to approved (2) to show guest requests
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [activePage, setActivePage] = useState(100); // Increased to get all bookings for grouping
  const [expandedEvents, setExpandedEvents] = useState({});
  const [processingBooking, setProcessingBooking] = useState(null);

  const handlePage = (value) => {
    setPage(value);
  };

  const { BookingList, loading } = useSelector(
    (state) => state.BookingListData
  );

  useEffect(() => {
    // Only fetch approved bookings (status 2) to show guest requests
    dispatch(
      getBookingList({
        page: page,
        search: search,
        limit: activePage,
        book_status: 2, // Only approved bookings
        event_date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
      })
    );
  }, [page, search, selectedDate, dispatch]);

  // Group bookings by event
  const groupBookingsByEvent = () => {
    if (!BookingList?.data) return [];
    
    const grouped = {};
    BookingList.data.forEach((booking) => {
      // Only show bookings for accepted events (is_approved === 1)
      // We need to check if the event is accepted
      // For now, we'll assume all bookings in the list are for accepted events
      // since we're filtering by book_status = 2 (approved)
      
      const eventId = booking.event_id || booking.eventDetails?._id || booking._id;
      const eventName = booking.event_name || booking.eventDetails?.event_name || "Unknown Event";
      
      if (!grouped[eventId]) {
        grouped[eventId] = {
          eventId,
          eventName,
          eventDate: booking.event_date || booking.eventDetails?.event_date,
          eventImage: booking.event_image || booking.eventDetails?.event_image,
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
        toast.success(response?.message || `Booking ${action === "accept" ? "accepted" : "rejected"} successfully`);
        // Refresh the booking list
        dispatch(
          getBookingList({
            page: page,
            search: search,
            limit: activePage,
            book_status: 2,
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

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <section className="bg-white py-16 ">
        <div className="mx-auto px-4 md:px-8 xl:px-28">
          <div className="mx-auto">
            <div className="lg:col-span-4">
              <h2 className="text-3xl font-bold mb-6">
                {t("breadcrumb.tab4")}
              </h2>
              
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
                        (b) => b.book_status === 1 || b.book_status === 0
                      );
                      const approvedBookings = eventGroup.bookings.filter(
                        (b) => b.book_status === 2
                      );
                      const rejectedBookings = eventGroup.bookings.filter(
                        (b) => b.book_status === 3
                      );

                      return (
                        <div
                          key={eventGroup.eventId}
                          className="bg-white rounded-lg shadow-md overflow-hidden"
                        >
                          {/* Event Header - Expandable */}
                          <div
                            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between ${flexDirection}`}
                            onClick={() => toggleEvent(eventGroup.eventId)}
                          >
                            <div className={`flex items-center gap-4 flex-1 ${flexDirection}`}>
                              {eventGroup.eventImage && (
                                <Image
                                  src={eventGroup.eventImage}
                                  alt={eventGroup.eventName}
                                  width={80}
                                  height={80}
                                  className="rounded-lg object-cover"
                                />
                              )}
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {eventGroup.eventName}
                                </h3>
                                {eventGroup.eventDate && (
                                  <p className="text-sm text-gray-600">
                                    {format(new Date(eventGroup.eventDate), "MMM dd, yyyy")}
                                  </p>
                                )}
                                <div className="flex gap-4 mt-2 text-sm">
                                  <span className="text-gray-600">
                                    {t("guestRequests") || t("events.guestRequests") || "Guest Requests"}: {eventGroup.bookings.length}
                                  </span>
                                  {pendingBookings.length > 0 && (
                                    <span className="text-orange-600 font-medium">
                                      {t("pending") || t("events.pending") || "Pending"}: {pendingBookings.length}
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
                            <div className="border-t border-gray-200">
                              <div className="overflow-x-auto">
                                <table className="w-full">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className={`px-4 py-3 ${textAlign} text-xs font-medium text-gray-700 uppercase tracking-wider`}>
                                        {t("name") || "Name"}
                                      </th>
                                      <th className={`px-4 py-3 ${textAlign} text-xs font-medium text-gray-700 uppercase tracking-wider`}>
                                        {t("age") || "Age"}
                                      </th>
                                      <th className={`px-4 py-3 ${textAlign} text-xs font-medium text-gray-700 uppercase tracking-wider`}>
                                        {t("nationality") || "Nationality"}
                                      </th>
                                      <th className={`px-4 py-3 ${textAlign} text-xs font-medium text-gray-700 uppercase tracking-wider`}>
                                        {t("status") || "Status"}
                                      </th>
                                      <th className={`px-4 py-3 ${textAlign} text-xs font-medium text-gray-700 uppercase tracking-wider`}>
                                        {t("actions") || "Actions"}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {eventGroup.bookings.map((booking) => {
                                      // Try multiple paths for user data
                                      const userData = booking.userDetail || booking.user || {};
                                      const userName = 
                                        `${booking.user_first_name || userData.first_name || ""} ${booking.user_last_name || userData.last_name || ""}`.trim() || 
                                        t("events.unknown") || "Unknown";
                                      const userNationality = userData.nationality || booking.nationality || "N/A";
                                      const userDateOfBirth = userData.date_of_birth || booking.date_of_birth;
                                      const age = calculateAge(userDateOfBirth);
                                      const bookingStatus = booking.book_status;
                                      const isPending = bookingStatus === 0 || bookingStatus === 1;

                                      return (
                                        <tr key={booking._id} className="hover:bg-gray-50">
                                          <td className={`px-4 py-3 whitespace-nowrap ${textAlign}`}>
                                            <div className={`flex items-center ${flexDirection}`}>
                                              {(booking.user_profile_image || userData.profile_image) && (
                                                <Image
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
                                                    return getImageUrl(booking.user_profile_image || userData.profile_image);
                                                  })()}
                                                  alt={userName}
                                                  width={32}
                                                  height={32}
                                                  className={`rounded-full border border-gray-200 ${isRTL ? "ml-2" : "mr-2"}`}
                                                  onError={(e) => {
                                                    e.target.src = "/assets/images/home/user-dummy.png";
                                                  }}
                                                />
                                              )}
                                              <span className="text-sm font-medium text-gray-900">
                                                {userName}
                                              </span>
                                            </div>
                                          </td>
                                          <td className={`px-4 py-3 whitespace-nowrap text-sm text-gray-600 ${textAlign}`}>
                                            {age}
                                          </td>
                                          <td className={`px-4 py-3 whitespace-nowrap text-sm text-gray-600 ${textAlign}`}>
                                            {userNationality}
                                          </td>
                                          <td className={`px-4 py-3 whitespace-nowrap ${textAlign}`}>
                                            <span
                                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                bookingStatus === 2
                                                  ? "bg-green-100 text-green-800"
                                                  : bookingStatus === 3
                                                  ? "bg-red-100 text-red-800"
                                                  : "bg-yellow-100 text-yellow-800"
                                              }`}
                                            >
                                              {bookingStatus === 2
                                                ? t("approved") || "Approved"
                                                : bookingStatus === 3
                                                ? t("rejected") || "Rejected"
                                                : t("pending") || "Pending"}
                                            </span>
                                          </td>
                                          <td className={`px-4 py-3 whitespace-nowrap text-sm ${textAlign}`}>
                                            {isPending && (
                                              <div className={`flex gap-2 ${flexDirection}`}>
                                                <button
                                                  onClick={() => handleAcceptReject(booking._id, "accept")}
                                                  disabled={processingBooking === booking._id}
                                                  className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                                                >
                                                  <Check className="w-4 h-4" />
                                                  {t("accept") || "Accept"}
                                                </button>
                                                <button
                                                  onClick={() => handleAcceptReject(booking._id, "reject")}
                                                  disabled={processingBooking === booking._id}
                                                  className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                                                >
                                                  <X className="w-4 h-4" />
                                                  {t("reject") || "Reject"}
                                                </button>
                                              </div>
                                            )}
                                            {!isPending && (
                                              <span className="text-gray-400 text-xs">
                                                {t("events.processed") || t("processed") || "Processed"}
                                              </span>
                                            )}
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
                    <div className="text-center py-10">
                      <span className="text-gray-800">{t("events.noDataFound") || t("tab.tab7") || "No data found"}</span>
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
        </div>
      </section>
    </>
  );
}
