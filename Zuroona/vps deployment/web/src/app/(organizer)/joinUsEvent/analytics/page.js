"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Loader from "@/components/Loader/Loader";
import { useTranslation } from "react-i18next";
import { useRTL } from "@/utils/rtl";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { BASE_API_URL } from "@/until";
import Cookies from "js-cookie";
import { TOKEN_NAME } from "@/until";
import { ChangeStatusOrganizerApi } from "@/app/api/myBookings/apis";
import RejectReasonModal from "@/components/Modal/RejectReasonModal";
import { Check, X, MessageCircle } from "lucide-react";

export default function EventAnalytics() {
  const { t, i18n } = useTranslation();
  const { isRTL, flexDirection, textAlign } = useRTL();
  const searchParams = useSearchParams();
  const router = useRouter();
  const eventId = searchParams.get("id");
  
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // all, pending, approved, rejected, paid
  const [processingBooking, setProcessingBooking] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedBookingForReject, setSelectedBookingForReject] = useState(null);

  useEffect(() => {
    if (eventId) {
      fetchAnalytics();
    }
  }, [eventId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = Cookies.get(TOKEN_NAME);
      const response = await fetch(
        `${BASE_API_URL}/organizer/event/analytics?event_id=${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            lang: i18n.language || "en",
          },
        }
      );

      const data = await response.json();
      if (data.status === 1) {
        setAnalyticsData(data.data);
      } else {
        toast.error(data.message || "Failed to load analytics");
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredBookings = () => {
    if (!analyticsData?.bookings) return [];
    
    switch (activeTab) {
      case "pending":
        return analyticsData.bookings.filter(b => b.book_status === 0 || b.book_status === 1);
      case "approved":
        return analyticsData.bookings.filter(b => b.book_status === 2);
      case "rejected":
        return analyticsData.bookings.filter(b => b.book_status === 3 || b.book_status === 4); // Support both 3 and 4 for rejected
      case "paid":
        return analyticsData.bookings.filter(b => b.payment_status === 1);
      default:
        return analyticsData.bookings;
    }
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

  const getBookingStatusBadge = (status) => {
    if (status === 2) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          {t("approved") || "Approved"}
        </span>
      );
    } else if (status === 3) {
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

  const getPaymentStatusBadge = (status) => {
    if (status === 1) {
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

  const handleAcceptReject = async (bookingId, action, rejectionReason = null) => {
    setProcessingBooking(bookingId);
    try {
      const book_status = action === "accept" ? 2 : 4; // 2 = approved, 4 = rejected (backend uses 4 for rejected)
      const payload = {
        book_id: bookingId,
        book_status: book_status,
      };
      
      // Add rejection reason if rejecting
      if (action === "reject" && rejectionReason) {
        payload.rejection_reason = rejectionReason;
      }
      
      const response = await ChangeStatusOrganizerApi(payload);

      if (response?.status === 1) {
        toast.success(
          response?.message || 
          `Booking ${action === "accept" ? "accepted" : "rejected"} successfully`
        );
        // Refresh analytics data
        await fetchAnalytics();
        // Close reject modal if open
        if (action === "reject") {
          setRejectModalOpen(false);
          setSelectedBookingForReject(null);
        }
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

  const handleRejectClick = (booking) => {
    const userData = booking.userDetail || {};
    const userName = `${userData.first_name || ""} ${userData.last_name || ""}`.trim() || t("events.unknown") || "Unknown";
    const eventName = analyticsData?.event?.event_name || "Event";
    
    setSelectedBookingForReject({
      bookingId: booking._id,
      guestName: userName,
      eventName: eventName,
    });
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = (rejectionReason) => {
    if (selectedBookingForReject) {
      handleAcceptReject(selectedBookingForReject.bookingId, "reject", rejectionReason);
    }
  };

  const breadcrumbItems = [
    { label: t("breadcrumb.tab1"), href: "/joinUsEvent" },
    { label: t("breadcrumb.tab14"), href: "/joinUsEvent" },
    {
      label: analyticsData?.event?.event_name || t("events.analytics", "Event Analytics"),
      href: "/joinUsEvent/analytics",
    },
  ];

  if (loading) {
    return (
      <>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex justify-center items-center w-full h-screen bg-white">
          <Loader />
        </div>
      </>
    );
  }

  if (!analyticsData) {
    return (
      <>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex justify-center items-center w-full h-screen bg-white">
          <div className="text-center">
            <Icon icon="lucide:alert-circle" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">{t("events.noDataFound") || "No data found"}</p>
          </div>
        </div>
      </>
    );
  }

  const stats = analyticsData.statistics;
  const filteredBookings = getFilteredBookings();

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <section className="bg-white py-8 md:py-12 min-h-screen">
        <div className="mx-auto px-4 md:px-8 xl:px-28">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {t("events.analytics", "Event Analytics")}
                </h1>
                <p className="text-gray-600">
                  {analyticsData.event?.event_name}
                </p>
              </div>
              <Link
                href={`/joinUsEvent/detail?id=${eventId}`}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Icon icon="lucide:arrow-left" className="w-5 h-5" />
                <span>{t("events.backToEvent", "Back to Event")}</span>
              </Link>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{t("events.totalBookings", "Total Bookings")}</span>
                <Icon icon="lucide:calendar-check" className="w-5 h-5 text-[#a797cc]" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.total_bookings}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{t("events.approved", "Approved")}</span>
                <Icon icon="lucide:check-circle" className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{t("events.totalAttendees", "Total Attendees")}</span>
                <Icon icon="lucide:users" className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-blue-600">{stats.total_attendees}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{t("events.totalRevenue", "Total Revenue")}</span>
                <Icon icon="lucide:dollar-sign" className="w-5 h-5 text-[#8ba179]" />
              </div>
              <p className="text-3xl font-bold text-[#8ba179]">{stats.total_revenue?.toLocaleString() || 0} {t("card.tab2")}</p>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-md p-5 border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-yellow-800">{t("events.pending", "Pending")}</span>
                <Icon icon="lucide:clock" className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-md p-5 border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-red-800">{t("events.rejected", "Rejected")}</span>
                <Icon icon="lucide:x-circle" className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-5 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-800">{t("events.paid", "Paid")}</span>
                <Icon icon="lucide:credit-card" className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-900">{stats.paid}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 bg-white rounded-2xl shadow-lg p-2 inline-flex border border-gray-200">
            {[
              { key: "all", label: t("events.all", "All"), icon: "lucide:list", count: stats.total_bookings },
              { key: "pending", label: t("events.pending", "Pending"), icon: "lucide:clock", count: stats.pending },
              { key: "approved", label: t("events.approved", "Approved"), icon: "lucide:check-circle", count: stats.approved },
              { key: "rejected", label: t("events.rejected", "Rejected"), icon: "lucide:x-circle", count: stats.rejected },
              { key: "paid", label: t("events.paid", "Paid"), icon: "lucide:credit-card", count: stats.paid },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-[#a797cc] to-[#8ba179] text-white shadow-lg scale-105"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon icon={tab.icon} className="w-4 h-4" />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === tab.key
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
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
                      {t("events.bookingDate") || "Booking Date"}
                    </th>
                    <th className={`px-6 py-4 ${textAlign} text-xs font-semibold text-gray-700 uppercase tracking-wider`}>
                      {t("actions") || "Actions"}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => {
                      const userData = booking.userDetail || {};
                      const userName = `${userData.first_name || ""} ${userData.last_name || ""}`.trim() || t("events.unknown") || "Unknown";
                      const userNationality = userData.nationality || "N/A";
                      const userDateOfBirth = userData.date_of_birth;
                      const age = calculateAge(userDateOfBirth);

                      return (
                        <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                          <td className={`px-6 py-4 whitespace-nowrap ${textAlign}`}>
                            <div className={`flex items-center ${flexDirection}`}>
                              {userData.profile_image && (
                                <Image
                                  src={(() => {
                                    const getImageUrl = (imgPath) => {
                                      if (!imgPath) return "/assets/images/home/user-dummy.png";
                                      if (imgPath.includes("https://") || imgPath.includes("httpss://")) return imgPath;
                                      if (imgPath.startsWith("/uploads/")) {
                                        const apiBase = BASE_API_URL.replace('/api/', '');
                                        return `${apiBase}${imgPath}`;
                                      }
                                      return "/assets/images/home/user-dummy.png";
                                    };
                                    return getImageUrl(userData.profile_image);
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
                                {userData.email && (
                                  <div className="text-xs text-gray-500">
                                    {userData.email}
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
                              <Icon icon="lucide:users" className="w-4 h-4 text-gray-400" />
                              {booking.no_of_attendees || 1}
                            </div>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 ${textAlign}`}>
                            <div className="flex items-center gap-1">
                              <Icon icon="lucide:dollar-sign" className="w-4 h-4 text-green-600" />
                              {booking.total_amount || 0} {t("card.tab2")}
                            </div>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap ${textAlign}`}>
                            {getPaymentStatusBadge(booking.payment_status)}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap ${textAlign}`}>
                            {getBookingStatusBadge(booking.book_status)}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-600 ${textAlign}`}>
                            {booking.createdAt ? format(new Date(booking.createdAt), "MMM dd, yyyy") : "N/A"}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${textAlign}`}>
                            <div className={`flex items-center gap-2 ${flexDirection}`}>
                              {/* Accept/Reject buttons for pending bookings */}
                              {(booking.book_status === 0 || booking.book_status === 1) && (
                                <>
                                  <button
                                    onClick={() => handleAcceptReject(booking._id, "accept")}
                                    disabled={processingBooking === booking._id}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                  >
                                    <Check className="w-4 h-4" />
                                    {t("accept") || "Accept"}
                                  </button>
                                  <button
                                    onClick={() => handleRejectClick(booking)}
                                    disabled={processingBooking === booking._id}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                  >
                                    <X className="w-4 h-4" />
                                    {t("reject") || "Reject"}
                                  </button>
                                </>
                              )}
                              {/* Group Chat for approved and paid bookings */}
                              {booking.book_status === 2 && booking.payment_status === 1 && (
                                <Link
                                  href={`/messaging?event_id=${eventId}`}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-[#a797cc] text-white rounded-lg hover:bg-[#8ba179] text-xs font-medium transition-colors"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                  {t("events.groupChat", "Group Chat")}
                                </Link>
                              )}
                              {/* View Details link for all bookings */}
                              <Link
                                href={`/myBookings?event_id=${eventId}`}
                                className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors"
                              >
                                <Icon icon="lucide:eye" className="w-4 h-4" />
                                {t("events.viewDetails", "Details")}
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center">
                        <Icon icon="lucide:inbox" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <span className="text-gray-600 text-lg">
                          {t("events.noBookingsFound", "No bookings found")}
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

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
          isLoading={processingBooking === selectedBookingForReject.bookingId}
        />
      )}
    </>
  );
}

