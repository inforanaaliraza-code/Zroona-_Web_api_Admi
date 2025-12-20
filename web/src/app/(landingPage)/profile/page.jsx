"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { format } from "date-fns";
import useAuthStore from "@/store/useAuthStore";
import { ProfileDetailApi, GetUserBookingsApi, CancelBookingApi } from "@/app/api/setting";
import Link from "next/link";
import UserAvatar from "@/components/ui/UserAvatar";
import EventPlaceholder from "@/components/ui/EventPlaceholder";
import CancelConfirmDialog from "@/components/ui/CancelConfirmDialog";
import { useRTL } from "@/utils/rtl";

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const { isRTL, textAlign, flexDirection, marginStart, marginEnd, chevronIcon, arrowIcon } = useRTL();
  const router = useRouter();
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useAuthStore();
  
  // State for profile data
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  
  // State for bookings
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [activeBookingFilter, setActiveBookingFilter] = useState("all");
  
  // State for cancel dialog
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isReserving, setIsReserving] = useState(false);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: t("breadcrumb.tab1"), href: "/" },
    { label: t("sidemenu.tab3"), href: "/profile" },
  ];

  // Status mapping for colors and icons
  const statusConfig = {
    0: { color: "bg-yellow-100 text-yellow-800", icon: "lucide:clock" }, // Pending
    1: { color: "bg-blue-100 text-blue-800", icon: "lucide:check-circle" }, // Approved
    2: { color: "bg-green-100 text-green-800", icon: "lucide:check-circle-2" }, // Confirmed
    3: { color: "bg-red-100 text-red-800", icon: "lucide:x-circle" }, // Cancelled
    4: { color: "bg-gray-100 text-gray-800", icon: "lucide:x" }, // Rejected
  };

  // Get status text with fallback
  const getStatusText = (status) => {
    switch (status) {
      case 0: return t("eventsMain.pending") || "Pending";
      case 1: return t("eventsMain.approved") || "Approved";
      case 2: return t("eventsMain.confirmed") || "Confirmed";
      case 3: return t("eventsMain.cancelled") || "Cancelled";
      case 4: return t("eventsMain.rejected") || "Rejected";
      default: return t("eventsMain.unknown") || "Unknown";
    }
  };

  // Get payment status text with fallback
  const getPaymentStatusText = (status) => {
    return status ? (t("eventsMain.paid") || "Paid") : (t("eventsMain.unpaid") || "Unpaid");
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return t("eventsMain.dateNotAvailable") || "Date not available";
    }
  };

  // Load user profile
  useEffect(() => {
    if (!token || !isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await ProfileDetailApi();
        if (response.status) {
          setProfile(response.data);
        } else {
          toast.error(response.message || t("eventsMain.profileLoadError") || "Failed to load profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error(t("eventsMain.profileLoadError") || "Error loading your profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, isAuthenticated]);

  // Fetch bookings - wrapped in useCallback to avoid recreating on every render
  const fetchBookings = useCallback(async () => {
    setBookingsLoading(true);
    try {
      const response = await GetUserBookingsApi();
      if (response.status) {
        let filteredBookings = response.data || [];
        
        // Apply filter
        if (activeBookingFilter !== "all") {
          const statusMap = {
            "pending": 0,
            "approved": 1,
            "confirmed": 2,
            "cancelled": 3,
            "rejected": 4
          };
          
          filteredBookings = filteredBookings.filter(
            booking => booking.status === statusMap[activeBookingFilter]
          );
        }
        
        setBookings(filteredBookings);
      } else {
        toast.error(response.message || t("eventsMain.bookingsLoadError") || "Failed to load bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error(t("eventsMain.bookingsLoadError") || "Error loading your bookings");
    } finally {
      setBookingsLoading(false);
    }
  }, [activeBookingFilter]);

  // Load user bookings when tab changes to bookings
  useEffect(() => {
    if (activeTab === "bookings" && token && isAuthenticated) {
      fetchBookings();
    }
  }, [activeTab, token, isAuthenticated, activeBookingFilter, fetchBookings]);

  // Handle cancel booking click
  const handleCancelBookingClick = (bookingId) => {
    if (!token || !isAuthenticated) {
      toast.error(t("eventsMain.pleaseLogin") || "Please login");
      return;
    }
    
    setSelectedBookingId(bookingId);
    setIsCancelDialogOpen(true);
  };
  
  // Handle cancel booking confirmation
  const handleCancelBooking = async () => {
    if (!selectedBookingId) return;
    
    try {
      setIsReserving(true); 
      const response = await CancelBookingApi({
        booking_id: selectedBookingId
      });
      
      if (response.status) {
        toast.success(t("eventsMain.bookingCancelled") || "Booking cancelled successfully");
        // Update the booking status in the local state
        setBookings(bookings.map(booking => 
          booking._id === selectedBookingId 
            ? {...booking, status: 3} // Set status to cancelled
            : booking
        ));
      } else {
        toast.error(response.message || t("eventsMain.cancelFailed") || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Cancel booking error:", error);
      toast.error(t("eventsMain.cancelFailed") || "Failed to cancel booking");
    } finally {
      setIsReserving(false);
      setIsCancelDialogOpen(false);
      setSelectedBookingId(null);
    }
  };

  if (!token || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <Icon icon="lucide:lock" className="mx-auto h-16 w-16 text-gray-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">{t("eventsMain.pleaseLogin") || "Please login"}</h2>
          <p className="mt-1 text-sm text-gray-500">
            {t("eventsMain.loginToViewProfile") || "Please login to view your profile"}
          </p>
          <div className="mt-6">
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-[#a797cc] to-[#8ba179] hover:shadow-lg"
            >
              {t("header.tab5")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="py-4 px-4 md:px-8 xl:px-28">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => router.back()}
            className={`inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${flexDirection}`}
          >
            <Icon icon={arrowIcon} className={`${marginEnd(1.5)} h-4 w-4`} />
            {t("common.back")}
          </button>
        </div>
        <ol className={`flex flex-wrap items-center gap-2 text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
          <li className="flex items-center">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 hover:underline"
            >
              {t("breadcrumb.tab1") || "Home"}
            </Link>
          </li>
          <li className="flex items-center">
            <Icon 
              icon={isRTL ? "lucide:chevron-left" : "lucide:chevron-right"} 
              className={`mx-2 h-4 w-4 text-gray-400 ${isRTL ? "order-1" : ""}`} 
            />
            <span className="font-medium text-gray-900">{t("profile.personalInfo")}</span>
          </li>
        </ol>
      </nav>
      
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex-shrink-0">
                <UserAvatar 
                  src={(() => {
                    const imgPath = profile?.user?.profile_image;
                    if (!imgPath) return null;
                    // UserAvatar component will handle URL conversion, but we can also do it here
                    if (!imgPath.includes("http://") && !imgPath.includes("https://")) {
                      if (imgPath.startsWith("/uploads/")) {
                        const apiBase = "http://localhost:3434";
                        return `${apiBase}${imgPath}`;
                      }
                    }
                    return imgPath;
                  })()} 
                  alt={`${profile?.user?.first_name || ''} ${profile?.user?.last_name || ''}`}
                  size={120}
                  className="border-4 border-gray-100 shadow-lg"
                />
              </div>
              
              <div className={`flex-1 text-center md:${textAlign}`}>
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile?.user?.first_name} {profile?.user?.last_name}
                </h1>
                
                <p className="text-gray-600 mt-1">
                  {profile?.user?.email}
                </p>
                
                <div className={`mt-4 flex flex-wrap justify-center md:${isRTL ? "justify-end" : "justify-start"} gap-2`}>
                  <Link
                    href="/signup/edit"
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Icon icon="lucide:edit" className={`${marginEnd(1.5)} h-4 w-4`} />
                    {t("signup.tab18")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className={`flex -mb-px ${flexDirection}`}>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === "profile"
                      ? "border-[#a797cc] text-[#a797cc]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon 
                    icon="lucide:user" 
                    className={`inline-block ${marginEnd(2)} h-5 w-5 ${activeTab === "profile" ? "text-[#a797cc]" : "text-gray-400"}`} 
                  />
                  {t("profile.personalInfo")}
                </button>
                
                <button
                  onClick={() => setActiveTab("bookings")}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === "bookings"
                      ? "border-[#a797cc] text-[#a797cc]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon 
                    icon="lucide:calendar" 
                    className={`inline-block ${marginEnd(2)} h-5 w-5 ${activeTab === "bookings" ? "text-[#a797cc]" : "text-gray-400"}`} 
                  />
                  {t("profile.myBookings")}
                </button>
              </nav>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                {loading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a797cc]"></div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h3 className={`text-lg font-medium text-gray-900 mb-4 ${textAlign}`}>{t("profile.personalInfo") || "Personal Information"}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className={`text-sm font-medium text-gray-500 ${textAlign}`}>{t("signup.tab2") || "First Name"}</p>
                          <p className={`mt-1 text-sm text-gray-900 ${textAlign}`}>{profile?.user?.first_name || "-"}</p>
                        </div>
                        
                        <div>
                          <p className={`text-sm font-medium text-gray-500 ${textAlign}`}>{t("signup.tab3") || "Last Name"}</p>
                          <p className={`mt-1 text-sm text-gray-900 ${textAlign}`}>{profile?.user?.last_name || "-"}</p>
                        </div>
                        
                        <div>
                          <p className={`text-sm font-medium text-gray-500 ${textAlign}`}>{t("signup.tab4") || "Phone"}</p>
                          <p className={`mt-1 text-sm text-gray-900 ${textAlign}`}>{profile?.user?.phone || "-"}</p>
                        </div>
                        
                        <div>
                          <p className={`text-sm font-medium text-gray-500 ${textAlign}`}>{t("signup.tab5") || "Email"}</p>
                          <p className={`mt-1 text-sm text-gray-900 ${textAlign}`}>{profile?.user?.email || "-"}</p>
                        </div>
                        
                        <div>
                          <p className={`text-sm font-medium text-gray-500 ${textAlign}`}>{t("signup.tab6") || "Gender"}</p>
                          <p className={`mt-1 text-sm text-gray-900 ${textAlign}`}>
                            {profile?.user?.gender === "1" 
                              ? (t("signup.tab7") || "Male")
                              : profile?.user?.gender === "2" 
                                ? (t("signup.tab8") || "Female")
                                : "-"}
                          </p>
                        </div>
                        
                        <div>
                          <p className={`text-sm font-medium text-gray-500 ${textAlign}`}>{t("signup.tab10") || "Date of Birth"}</p>
                          <p className={`mt-1 text-sm text-gray-900 ${textAlign}`}>
                            {profile?.user?.dob ? formatDate(profile.user.dob) : "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {profile?.user?.description && (
                      <div>
                        <h3 className={`text-lg font-medium text-gray-900 mb-2 ${textAlign}`}>{t("signup.tab11") || "Description"}</h3>
                        <p className={`text-sm text-gray-600 ${textAlign}`}>{profile.user.description}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            
            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div>
                {/* Booking Filters */}
                <div className="mb-6 overflow-x-auto">
                  <div className="inline-flex rounded-md shadow-sm">
                    {["all", "pending", "approved", "confirmed", "cancelled", "rejected"].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setActiveBookingFilter(filter)}
                        className={`px-4 py-2 text-sm font-medium ${
                          activeBookingFilter === filter
                            ? "bg-[#a797cc] text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        } ${
                          filter === "all" ? (isRTL ? "rounded-r-md" : "rounded-l-md") : ""
                        } ${
                          filter === "rejected" ? (isRTL ? "rounded-l-md" : "rounded-r-md") : ""
                        } border border-gray-300 ${
                          filter !== "all" ? (isRTL ? "border-r-0" : "border-l-0") : ""
                        }`}
                      >
                        {filter === "all" 
                          ? (t("profile.allBookings") || "All Bookings")
                          : (t(`eventsMain.${filter}`) || filter.charAt(0).toUpperCase() + filter.slice(1))
                        }
                      </button>
                    ))}
                  </div>
                </div>
                
                {bookingsLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a797cc]"></div>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className={`text-center py-16 ${textAlign}`}>
                    <Icon icon="lucide:calendar" className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      {t("eventsMain.noBookings") || "No bookings found"}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {t("eventsMain.startExploring") || "Start exploring amazing events near you"}
                    </p>
                    <div className="mt-6">
                      <Link
                        href="/events"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-[#a797cc] to-[#8ba179] hover:shadow-lg"
                      >
                        {t("eventsMain.exploreEvents") || "Explore Events"}
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                        {/* Event Image */}
                        <div className="relative">
                          <EventPlaceholder
                            src={booking.event?.event_images?.[0]}
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
                            {booking.event?.event_name || t("eventsMain.eventNotAvailable") || "Event not available"}
                          </h3>
                          
                          <div className="space-y-2 mb-4">
                            <div className={`flex items-start ${flexDirection}`}>
                              <Icon icon="lucide:calendar" className={`mt-0.5 ${marginEnd(2)} h-4 w-4 text-gray-500`} />
                              <span className="text-sm text-gray-600">
                                {booking.event?.event_date ? formatDate(booking.event.event_date) : (t("eventsMain.dateNotAvailable") || "Date not available")}
                              </span>
                            </div>
                            
                            <div className={`flex items-start ${flexDirection}`}>
                              <Icon icon="lucide:users" className={`mt-0.5 ${marginEnd(2)} h-4 w-4 text-gray-500`} />
                              <span className="text-sm text-gray-600">
                                {booking.attendees} {t("eventsMain.attendees") || "attendees"}
                              </span>
                            </div>
                            
                            <div className={`flex items-start ${flexDirection}`}>
                              <Icon icon="lucide:credit-card" className={`mt-0.5 ${marginEnd(2)} h-4 w-4 text-gray-500`} />
                              <span className="text-sm text-gray-600">
                                {getPaymentStatusText(booking.payment_status)}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Link
                              href={`/events/${booking.event?._id}`}
                              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                              {t("eventsMain.viewDetails") || "View Details"}
                            </Link>
                            
                            {(booking.status === 0 || booking.status === 1) && (
                              <button
                                onClick={() => handleCancelBookingClick(booking._id)}
                                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                              >
                                {t("eventsMain.cancelBooking") || "Cancel Booking"}
                              </button>
                            )}
                            
                            {booking.status === 1 && !booking.payment_status && (
                              <Link
                                href={`/events/${booking.event?._id}?initiate_payment=true`}
                                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-[#a797cc] to-[#8ba179] hover:shadow-lg"
                              >
                                {t("eventsMain.proceedToPayment") || "Proceed to Payment"}
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Cancel Confirmation Dialog */}
      <CancelConfirmDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleCancelBooking}
        isLoading={isReserving}
      />
    </>
  );
}
