"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Image from "next/image";
import Pagination from "@/components/common/pagination";
import { useDataStore } from "@/app/api/store/store";
import { useDispatch, useSelector } from "react-redux";
import { getUserNotificationList } from "@/redux/slices/UserNotificaton";
import Loader from "@/components/Loader/Loader";
import Paginations from "@/components/Paginations/Pagination";
import { useTranslation } from "react-i18next";
import { getProfile } from "@/redux/slices/profileInfo";
import { TOKEN_NAME, BASE_API_URL } from "@/until";
import Cookies from "js-cookie";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { useRTL } from "@/utils/rtl";

const NotificationList = () => {
  const { t, i18n } = useTranslation();
  const { isRTL, textAlign, flexDirection, marginStart, marginEnd, paddingStart, paddingEnd } = useRTL();
  const dispatch = useDispatch();
  const router = useRouter();
  const token = Cookies.get(TOKEN_NAME);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("new");
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState(10);
  const { profile } = useSelector((state) => state.profileData);
  const breadcrumbItems = [
    ...(profile?.user?.role === 1
      ? [{ label: t("breadcrumb.tab1"), href: "/" }] // Add home link for role 1
      : [{ label: t("breadcrumb.tab1"), href: "/joinUsEvent" }]),
    { label: t("breadcrumb.tab7"), href: "/notification" },
  ];
  useEffect(() => {
    if (token) {
      dispatch(getProfile());
    }
  }, [token, dispatch]);

  const handlePage = (value) => {
    setPage(value);
  };
  const { UserNotification } = useSelector(
    (state) => state.UserNotificatonListData || {}
  );

  useEffect(() => {
    setLoading(true); // Set loading to true before fetching data
    dispatch(
      getUserNotificationList({ page: page, limit: activePage })
    ).finally(() => {
      setLoading(false); // Set loading to false after data is fetched
    });
  }, [dispatch, page, activePage]);

  // Redirect logic based on notification type and available ids
  const handleRedirect = (notification) => {
    const { notification_type, event_id, book_id } = notification || {};
    const userRole = profile?.user?.role;

    // Booking request (guest → organizer) - Host sees this
    if (notification_type === 1 && book_id) {
      if (userRole === 2) {
        // Host - go to booking detail
        router.push(`/myBookings/detail?id=${book_id}`);
      } else {
        // Guest - go to my bookings
        router.push(`/myEvents?highlight=${book_id}`);
      }
      return;
    }

    // Booking accepted / rejected (organizer → guest) - Guest sees this
    if ((notification_type === 2 || notification_type === 3) && book_id) {
      if (userRole === 1) {
        // Guest - go to my bookings
        router.push(`/myEvents?highlight=${book_id}`);
      } else {
        // Host - go to booking detail
        router.push(`/myBookings/detail?id=${book_id}`);
      }
      return;
    }

    // Event updates: redirect based on role
    if (event_id) {
      if (userRole === 2) {
        // Host - go to event detail in host panel
        router.push(`/joinUsEvent/detail?id=${event_id}`);
      } else {
        // Guest - go to event detail in guest panel
        router.push(`/events/${event_id}`);
      }
      return;
    }

    // Wallet updates: go to withdrawal screen (host only)
    if (notification_type === 4) {
      if (userRole === 2) {
        router.push(`/myEarning`);
      } else {
        router.push(`/myEvents`);
      }
      return;
    }

    // Message notifications - redirect to messaging
    if (notification_type === 5 || notification_type === 6) {
      router.push(`/messaging`);
      return;
    }

    // Default fallback: notifications page
    router.push(`/notification`);
  };

  // Determine user role - check both profile and auth store
  const userRole = profile?.user?.role;
  const isGuest = userRole === 1;
  const isHost = userRole === 2;

  // Helper function to get proper image URL - matches logic from other components
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/assets/images/home/user-dummy.png";
    
    let imageUrl = imagePath;
    
    // Handle different URL formats
    if (imageUrl.startsWith('http://localhost:3000') || imageUrl.startsWith('https://localhost:3000')) {
      // Replace port 3000 with correct port 3434
      imageUrl = imageUrl.replace('localhost:3000', 'localhost:3434');
    } else if (imageUrl.startsWith('/uploads/')) {
      // Relative path - prepend correct base URL
      const apiBase = BASE_API_URL.replace('/api/', '');
      imageUrl = `${apiBase}${imageUrl}`;
    } else if (imageUrl.includes('/uploads/')) {
      // Contains uploads path but might have wrong port
      const apiBase = BASE_API_URL.replace('/api/', '');
      const uploadsIndex = imageUrl.indexOf('/uploads/');
      imageUrl = `${apiBase}${imageUrl.substring(uploadsIndex)}`;
    } else if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://') && !imageUrl.startsWith('data:') && !imageUrl.startsWith('blob:')) {
      // Path without protocol - construct full URL
      if (imageUrl.startsWith('uploads/')) {
        const apiBase = BASE_API_URL.replace('/api/', '');
        imageUrl = `${apiBase}/${imageUrl}`;
      } else {
        const apiBase = BASE_API_URL.replace('/api/', '');
        imageUrl = `${apiBase}/uploads/Jeena/${imageUrl}`;
      }
    }
    
    return imageUrl;
  };

  // Format date based on locale with proper Arabic numerals
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const locale = i18n.language === "ar" ? "ar-SA" : "en-US";
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      };
      
      let formatted = date.toLocaleDateString(locale, options);
      
      // For Arabic, ensure proper formatting
      if (i18n.language === "ar") {
        // Arabic locale already handles numerals correctly
        return formatted;
      }
      
      return formatted;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return (
    <>
      <Header />
      <Breadcrumbs items={breadcrumbItems} />
      <section className="bg-white py-16" dir={isRTL ? "rtl" : "ltr"}>
        <div className={`container mx-auto px-4 md:px-8 lg:px-28`}>
          {/* Page Title */}
          <div className={`mb-6 ${textAlign}`}>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t("notifications.title")}
            </h1>
          </div>
          
          {/* Notification List */}
          <div className={`bg-white rounded-lg shadow-sm ${isRTL ? 'pr-4 pl-4 md:pr-8 md:pl-8' : 'pl-4 pr-4 md:pl-8 md:pr-8'}`}>
            {loading ? (
              <div className={`flex ${flexDirection} justify-center items-center py-10`}>
                <Loader />
                <span className={`${marginStart(3)} ${textAlign} text-gray-600`}>
                  {t("notifications.loading")}
                </span>
              </div>
            ) : Array.isArray(UserNotification?.data) &&
              UserNotification.data.length > 0 ? (
              UserNotification.data.map((notification, index) => (
                <div
                  key={notification._id}
                  className="pt-6 cursor-pointer group"
                  onClick={() => handleRedirect(notification)}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  <div className={`flex ${flexDirection} items-start gap-4 w-full border-b border-gray-200 pb-6 hover:bg-gray-50 transition-colors rounded-md ${isRTL ? 'px-2 -mx-2' : 'px-2 -mx-2'}`}>
                    {/* Profile Image - Always on start side (right for RTL, left for LTR) */}
                    <div className="w-[40px] h-[40px] rounded-full overflow-hidden border-2 border-gray-200 shadow-sm bg-gray-100 flex-shrink-0">
                      <img
                        key={`notification-profile-${notification._id}-${notification.profile_image || 'default'}`}
                        src={getImageUrl(notification.profile_image)}
                        alt={t("notifications.profileImage")}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          console.error("[NOTIFICATION] Image load error for URL:", notification.profile_image);
                          if (!e.target.src.includes("user-dummy.png")) {
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.src = "/assets/images/home/user-dummy.png";
                          }
                        }}
                        onLoad={() => {
                          console.log("[NOTIFICATION] Image loaded successfully:", notification.profile_image);
                        }}
                      />
                    </div>
                    
                    {/* Notification Content - Middle section, takes available space */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-gray-800 ${textAlign} mb-1 break-words`}>
                        {notification.title}
                      </h3>
                      <p className={`text-sm text-gray-600 ${textAlign} leading-relaxed break-words`}>
                        {notification.description}
                      </p>
                    </div>
                    
                    {/* Date with Clock Icon - Always on end side (left for RTL, right for LTR) */}
                    <div className={`text-xs text-gray-400 flex items-center ${flexDirection} ${isRTL ? "gap-2" : "gap-3"} whitespace-nowrap flex-shrink-0`}>
                      {isRTL ? (
                        <>
                          <span className={textAlign}>
                            {formatDate(notification.createdAt)}
                          </span>
                          <Image
                            src="/assets/images/icons/clock.png"
                            alt="Clock Icon"
                            width={16}
                            height={16}
                            className="transform scale-x-[-1]"
                          />
                        </>
                      ) : (
                        <>
                          <Image
                            src="/assets/images/icons/clock.png"
                            alt="Clock Icon"
                            width={16}
                            height={16}
                          />
                          <span className={textAlign}>
                            {formatDate(notification.createdAt)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={`py-10 ${textAlign}`}>
                <p className="text-gray-500 pt-3">
                  {t("notifications.noNotifications")}
                </p>
              </div>
            )}

            {/* Pagination */}
            {UserNotification?.total_count > 6 && (
              <Paginations
                handlePage={handlePage}
                page={page}
                total={UserNotification.total_count}
                itemsPerPage={activePage}
              />
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default NotificationList;
