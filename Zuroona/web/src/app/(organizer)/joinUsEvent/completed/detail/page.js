"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getEventListDetail } from "@/redux/slices/EventListDetail";
import { useTranslation } from "react-i18next";
import { useRTL } from "@/utils/rtl";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Loader from "@/components/Loader/Loader";
import { format } from "date-fns";
import { BASE_API_URL } from "@/until";
import axios from "axios";
import Cookies from "js-cookie";
import { TOKEN_NAME } from "@/until";
import { toast } from "react-toastify";
import AttendeeReviewModal from "@/components/Modal/AttendeeReviewModal";

export default function CompletedEventDetail() {
  const { t, i18n } = useTranslation();
  const { isRTL, flexDirection, textAlign } = useRTL();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const EventListId = searchParams.get("id");
  const { EventListdetails = {}, loadingDetail } = useSelector(
    (state) => state.EventDetailData || {}
  );

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  useEffect(() => {
    if (EventListId) {
      dispatch(getEventListDetail({ id: EventListId }));
      fetchBookings();
    }
  }, [EventListId, dispatch, fetchBookings]);

  const fetchBookings = useCallback(async () => {
    if (!EventListId) return;
    
    setLoadingBookings(true);
    try {
      const token = Cookies.get(TOKEN_NAME);
      const response = await axios.get(
        `${BASE_API_URL}organizer/event/analytics?event_id=${EventListId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            lang: i18n.language || "en",
          },
        }
      );

      if (response.data?.status === 1 && response.data?.data?.bookings) {
        // Filter only approved and paid bookings
        const completedBookings = response.data.data.bookings.filter(
          booking => booking.book_status === 2 && booking.payment_status === 1
        );
        setBookings(completedBookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load attendees");
    } finally {
      setLoadingBookings(false);
    }
  }, [EventListId, i18n.language]);

  const detailData = useMemo(() => {
    return EventListdetails || {};
  }, [EventListdetails]);

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

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "/assets/images/home/user-dummy.png";
    if (imgPath.includes("http://") || imgPath.includes("https://")) return imgPath;
    if (imgPath.startsWith("/uploads/")) {
      return `${BASE_API_URL.replace('/api/', '')}${imgPath}`;
    }
    return "/assets/images/home/user-dummy.png";
  };

  const handleReviewClick = (booking) => {
    const userData = booking.userDetail || booking.user || {};
    setSelectedAttendee({
      bookingId: booking._id,
      userId: booking.user_id || booking.user?._id || userData._id,
      userName: `${booking.user_first_name || userData.first_name || ""} ${booking.user_last_name || userData.last_name || ""}`.trim() || "Unknown",
      eventId: EventListId,
      eventName: detailData?.event_name,
    });
    setReviewModalOpen(true);
  };

  const breadcrumbItems = [
    { label: t('breadcrumb.tab1'), href: "/joinUsEvent" },
    { label: t('events.completed') || 'Completed Events', href: "/joinUsEvent?statusFilter=completed" },
    { label: detailData?.event_name || 'Event Detail', href: "#" },
  ];

  if (loadingDetail) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <section className="bg-white min-h-screen py-8">
        <div className="mx-auto px-4 md:px-8 xl:px-28 max-w-7xl">
          {/* Event Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push("/joinUsEvent?statusFilter=completed")}
              className={`flex items-center gap-2 text-[#a797cc] hover:text-[#8ba179] mb-4 ${flexDirection}`}
            >
              <Icon icon="lucide:arrow-left" className="w-5 h-5" />
              <span>{t('common.back') || 'Back to Completed Events'}</span>
            </button>
            <h1 className={`text-3xl font-bold text-gray-900 mb-2 ${textAlign}`}>
              {detailData?.event_name || 'Event'}
            </h1>
            <p className={`text-gray-600 ${textAlign}`}>
              {t('events.completedEventAttendees') || 'Review attendees from this completed event'}
            </p>
          </div>

          {/* Attendees Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {t('events.attendees') || 'Attendees'} ({bookings.length})
              </h2>
            </div>
            
            {loadingBookings ? (
              <div className="flex justify-center items-center py-12">
                <Loader />
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <Icon icon="lucide:users" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-600 text-lg">
                  {t('events.noAttendees') || 'No attendees found for this event'}
                </p>
              </div>
            ) : (
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
                        {t("events.attendees") || "Attendees"}
                      </th>
                      <th className={`px-6 py-4 ${textAlign} text-xs font-semibold text-gray-700 uppercase tracking-wider`}>
                        {t("actions") || "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => {
                      const userData = booking.userDetail || booking.user || {};
                      const userName = 
                        `${booking.user_first_name || userData.first_name || ""} ${booking.user_last_name || userData.last_name || ""}`.trim() || 
                        t("events.unknown") || "Unknown";
                      const userNationality = userData.nationality || booking.nationality || "N/A";
                      const userDateOfBirth = userData.date_of_birth || booking.date_of_birth;
                      const age = calculateAge(userDateOfBirth);

                      return (
                        <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                          <td className={`px-6 py-4 whitespace-nowrap ${textAlign}`}>
                            <div className={`flex items-center ${flexDirection}`}>
                              {(booking.user_profile_image || userData.profile_image) && (
                                <Image
                                  src={getImageUrl(booking.user_profile_image || userData.profile_image)}
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
                            {booking.no_of_attendees || 1}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${textAlign}`}>
                            <button
                              onClick={() => handleReviewClick(booking)}
                              className="flex items-center gap-1 px-4 py-2 bg-[#a797cc] text-white rounded-lg hover:bg-[#8ba179] text-xs font-medium transition-colors"
                            >
                              <Icon icon="lucide:star" className="w-4 h-4" />
                              {t("events.review") || "Review"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Review Modal */}
      <AttendeeReviewModal
        isOpen={reviewModalOpen}
        onClose={() => {
          setReviewModalOpen(false);
          setSelectedAttendee(null);
        }}
        attendee={selectedAttendee}
        onReviewSubmitted={() => {
          setReviewModalOpen(false);
          setSelectedAttendee(null);
          // Optionally refresh bookings
        }}
      />
    </>
  );
}

