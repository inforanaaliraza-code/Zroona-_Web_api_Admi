"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import ReactStars from "react-rating-stars-component";
import useAuthStore from "@/store/useAuthStore";
import { useRTL } from "@/utils/rtl";
import { BASE_API_URL } from "@/until";
import axios from "axios";

export default function MyReviewsPage() {
  const { t, i18n } = useTranslation();
  const { isRTL, textAlign, flexDirection, marginStart, marginEnd } = useRTL();
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();
  
  // State management
  const [activeTab, setActiveTab] = useState("events"); // "events" or "hosts"
  const [eventReviews, setEventReviews] = useState([]);
  const [hostReviews, setHostReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    events: { page: 1, limit: 10, totalCount: 0, totalPages: 0 },
    hosts: { page: 1, limit: 10, totalCount: 0, totalPages: 0 },
  });
  const [filterRating, setFilterRating] = useState(0); // 0 = all, 1-5 = specific rating

  // Breadcrumb items
  const breadcrumbItems = [
    { label: t("breadcrumb.tab1") || "Home", href: "/" },
    { label: t("myReviews.title") || "My Reviews", href: "/my-reviews" },
  ];

  // Fetch event reviews
  const fetchEventReviews = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_API_URL}/user/event/review/my-reviews`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            lang: i18n.language || "en",
          },
          params: { page, limit: 10 },
        }
      );

      if (response.data.status) {
        setEventReviews(response.data.data || []);
        setPagination((prev) => ({
          ...prev,
          events: {
            page,
            limit: 10,
            totalCount: response.data.total_count || 0,
            totalPages: Math.ceil((response.data.total_count || 0) / 10),
          },
        }));
      } else {
        toast.error(response.data.message || t("myReviews.fetchError") || "Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching event reviews:", error);
      toast.error(t("myReviews.fetchError") || "Error loading reviews");
    } finally {
      setLoading(false);
    }
  };

  // Fetch host reviews
  const fetchHostReviews = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_API_URL}/user-reviews/my-reviews`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            lang: i18n.language || "en",
          },
          params: { page, limit: 10 },
        }
      );

      if (response.data.status) {
        setHostReviews(response.data.data?.reviews || []);
        setPagination((prev) => ({
          ...prev,
          hosts: response.data.data?.pagination || {
            page: 1,
            limit: 10,
            totalCount: 0,
            totalPages: 0,
          },
        }));
      } else {
        toast.error(response.data.message || t("myReviews.fetchError") || "Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching host reviews:", error);
      toast.error(t("myReviews.fetchError") || "Error loading reviews");
    } finally {
      setLoading(false);
    }
  };

  // Load reviews on mount and tab change
  useEffect(() => {
    if (!token || !isAuthenticated) {
      setLoading(false);
      return;
    }

    if (activeTab === "events") {
      fetchEventReviews(1);
    } else {
      fetchHostReviews(1);
    }
  }, [activeTab, token, isAuthenticated]);

  // Filter reviews by rating
  const filteredEventReviews = filterRating === 0
    ? eventReviews
    : eventReviews.filter((review) => review.rating === filterRating);

  const filteredHostReviews = filterRating === 0
    ? hostReviews
    : hostReviews.filter((review) => review.rating === filterRating);

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(i18n.language === "ar" ? "ar-SA" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return t("myReviews.dateNotAvailable") || "N/A";
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (activeTab === "events") {
      fetchEventReviews(newPage);
    } else {
      fetchHostReviews(newPage);
    }
  };

  // Auth check
  if (!token || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <Icon icon="lucide:lock" className="mx-auto h-16 w-16 text-gray-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">
            {t("myReviews.pleaseLogin") || "Please login"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {t("myReviews.loginToView") || "Please login to view your reviews"}
          </p>
          <div className="mt-6">
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-[#a797cc] to-[#8ba179] hover:shadow-lg"
            >
              {t("header.tab5") || "Login"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <nav className="py-4 px-4 md:px-8 xl:px-28">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Icon
              icon={isRTL ? "lucide:chevron-right" : "lucide:chevron-left"}
              className="w-5 h-5 mr-2"
            />
            <span>{t("common.back") || "Back"}</span>
          </button>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          {breadcrumbItems.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && (
                <Icon
                  icon={isRTL ? "lucide:chevron-left" : "lucide:chevron-right"}
                  className="w-4 h-4 mx-2"
                />
              )}
              {index === breadcrumbItems.length - 1 ? (
                <span className="text-[#a797cc] font-medium">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-gray-700">
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Header */}
      <div className="px-4 md:px-8 xl:px-28 py-8 bg-gradient-to-r from-[#a797cc]/10 to-[#8ba179]/10">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#a797cc] to-[#8ba179] rounded-2xl flex items-center justify-center shadow-lg">
            <Icon icon="lucide:star" className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("myReviews.title") || "My Reviews"}
            </h1>
            <p className="text-gray-600 mt-1">
              {t("myReviews.subtitle") || "View and manage all your reviews"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="px-4 md:px-8 xl:px-28 py-6 bg-white border-b border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => {
                setActiveTab("events");
                setFilterRating(0);
              }}
              className={`px-6 py-2.5 rounded-md font-medium transition-all ${
                activeTab === "events"
                  ? "bg-white text-[#a797cc] shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon icon="lucide:calendar" className="inline-block w-4 h-4 mr-2" />
              {t("myReviews.eventReviews") || "Event Reviews"}
            </button>
            <button
              onClick={() => {
                setActiveTab("hosts");
                setFilterRating(0);
              }}
              className={`px-6 py-2.5 rounded-md font-medium transition-all ${
                activeTab === "hosts"
                  ? "bg-white text-[#a797cc] shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon icon="lucide:user" className="inline-block w-4 h-4 mr-2" />
              {t("myReviews.hostReviews") || "Host Reviews"}
            </button>
          </div>

          {/* Filter by Rating */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">
              {t("myReviews.filterByRating") || "Filter:"}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setFilterRating(0)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  filterRating === 0
                    ? "bg-[#a797cc] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {t("myReviews.all") || "All"}
              </button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFilterRating(rating)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1 ${
                    filterRating === rating
                      ? "bg-[#a797cc] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {rating}
                  <Icon icon="lucide:star" className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-8 xl:px-28 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a797cc]"></div>
          </div>
        ) : (
          <>
            {/* Event Reviews */}
            {activeTab === "events" && (
              <div className="space-y-6">
                {filteredEventReviews.length > 0 ? (
                  <>
                    {filteredEventReviews.map((review) => (
                      <div
                        key={review._id}
                        className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
                      >
                        <div className="flex items-start gap-4">
                          {/* Event Image */}
                          <div className="flex-shrink-0">
                            <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-200">
                              {review.event?.event_image?.[0] ? (
                                <Image
                                  src={review.event.event_image[0]}
                                  alt={review.event.event_name || "Event"}
                                  width={96}
                                  height={96}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Icon
                                    icon="lucide:calendar"
                                    className="w-8 h-8 text-gray-400"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Review Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                  {review.event?.event_name || t("myReviews.eventNameNA")}
                                </h3>
                                {review.organizer && (
                                  <p className="text-sm text-gray-600">
                                    {t("myReviews.organizedBy") || "Organized by"}{" "}
                                    <span className="font-medium">
                                      {review.organizer.first_name} {review.organizer.last_name}
                                    </span>
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <ReactStars
                                  count={5}
                                  value={review.rating || 0}
                                  size={20}
                                  activeColor="#a797cc"
                                  edit={false}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDate(review.createdAt)}
                                </p>
                              </div>
                            </div>
                            {review.description && (
                              <p className="text-gray-700 text-sm leading-relaxed">
                                {review.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Pagination for Event Reviews */}
                    {pagination.events.totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                          onClick={() => handlePageChange(pagination.events.page - 1)}
                          disabled={pagination.events.page === 1}
                          className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          <Icon icon="lucide:chevron-left" className="w-5 h-5" />
                        </button>
                        <span className="text-sm text-gray-600">
                          {t("myReviews.page") || "Page"} {pagination.events.page} {t("myReviews.of") || "of"}{" "}
                          {pagination.events.totalPages}
                        </span>
                        <button
                          onClick={() => handlePageChange(pagination.events.page + 1)}
                          disabled={pagination.events.page === pagination.events.totalPages}
                          className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          <Icon icon="lucide:chevron-right" className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-20">
                    <Icon
                      icon="lucide:message-square"
                      className="mx-auto h-16 w-16 text-gray-400"
                    />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      {t("myReviews.noEventReviews") || "No event reviews yet"}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {t("myReviews.noEventReviewsDesc") ||
                        "Start attending events and share your experience!"}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Host Reviews */}
            {activeTab === "hosts" && (
              <div className="space-y-6">
                {filteredHostReviews.length > 0 ? (
                  <>
                    {filteredHostReviews.map((review) => (
                      <div
                        key={review._id}
                        className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
                      >
                        <div className="flex items-start gap-4">
                          {/* Host Avatar */}
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                              {review.reviewed_id?.profile_image ? (
                                <Image
                                  src={review.reviewed_id.profile_image}
                                  alt={`${review.reviewed_id.first_name} ${review.reviewed_id.last_name}`}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Icon
                                    icon="lucide:user"
                                    className="w-8 h-8 text-gray-400"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Review Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                  {review.reviewed_id
                                    ? `${review.reviewed_id.first_name} ${review.reviewed_id.last_name}`
                                    : t("myReviews.hostNameNA")}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {review.reviewed_type === "Organizer"
                                    ? t("myReviews.hostOrganizer") || "Host/Organizer"
                                    : t("myReviews.user") || "User"}
                                </p>
                              </div>
                              <div className="text-right">
                                <ReactStars
                                  count={5}
                                  value={review.rating || 0}
                                  size={20}
                                  activeColor="#a797cc"
                                  edit={false}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDate(review.createdAt)}
                                </p>
                              </div>
                            </div>
                            {review.description && (
                              <p className="text-gray-700 text-sm leading-relaxed">
                                {review.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Pagination for Host Reviews */}
                    {pagination.hosts.totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                          onClick={() => handlePageChange(pagination.hosts.page - 1)}
                          disabled={pagination.hosts.page === 1}
                          className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          <Icon icon="lucide:chevron-left" className="w-5 h-5" />
                        </button>
                        <span className="text-sm text-gray-600">
                          {t("myReviews.page") || "Page"} {pagination.hosts.page} {t("myReviews.of") || "of"}{" "}
                          {pagination.hosts.totalPages}
                        </span>
                        <button
                          onClick={() => handlePageChange(pagination.hosts.page + 1)}
                          disabled={pagination.hosts.page === pagination.hosts.totalPages}
                          className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          <Icon icon="lucide:chevron-right" className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-20">
                    <Icon
                      icon="lucide:message-square"
                      className="mx-auto h-16 w-16 text-gray-400"
                    />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      {t("myReviews.noHostReviews") || "No host reviews yet"}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {t("myReviews.noHostReviewsDesc") ||
                        "Review hosts after attending their events!"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}


