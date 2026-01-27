"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAuthStore from "@/store/useAuthStore";
import { RequestRefundApi, GetUserBookingsApi } from "@/app/api/setting";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Loader from "@/components/Loader/Loader";
import { useRTL } from "@/utils/rtl";

export default function RequestRefundPage() {
  const { t, i18n } = useTranslation();
  const { isRTL, textAlign, flexDirection, marginStart, marginEnd } = useRTL();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, isAuthenticated } = useAuthStore();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const breadcrumbItems = [
    { label: t("breadcrumb.tab1") || "Home", href: "/" },
    { label: t("refunds.title") || "Refunds", href: "/refunds" },
    { label: t("refunds.requestNew") || "Request Refund", href: "/refunds/request" },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fetchBookings();
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await GetUserBookingsApi();
      if (response?.status === 1) {
        // Filter only cancelled (status = 3) and paid (payment_status = 1) bookings that can be refunded
        // Also exclude bookings that already have a refund request
        const refundableBookings = (response.data || []).filter(
          (booking) => 
            booking.book_status === 3 && // Cancelled
            booking.payment_status === 1 && // Paid
            !booking.refund_request_id // No existing refund request
        );
        setBookings(refundableBookings);
      } else {
        toast.error(response?.message || "Failed to load bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    booking_id: Yup.string().required(t("refunds.validation.bookingRequired") || "Please select a booking"),
    refund_reason: Yup.string()
      .required(t("refunds.validation.reasonRequired") || "Refund reason is required")
      .min(10, t("refunds.validation.reasonMin") || "Reason must be at least 10 characters")
      .max(500, t("refunds.validation.reasonMax") || "Reason must not exceed 500 characters"),
  });

  const formik = useFormik({
    initialValues: {
      booking_id: searchParams?.get("booking_id") || "",
      refund_reason: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        const response = await RequestRefundApi(values);
        if (response?.status === 1) {
          toast.success(response.message || t("refunds.requestSuccess") || "Refund request submitted successfully");
          router.push("/refunds");
        } else {
          toast.error(response?.message || t("refunds.requestError") || "Failed to submit refund request");
        }
      } catch (error) {
        console.error("Error submitting refund request:", error);
        toast.error(error.response?.data?.message || t("refunds.requestError") || "Failed to submit refund request");
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="container px-4 py-8 mx-auto md:px-8 lg:px-28">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className={`text-3xl font-bold text-gray-900 ${textAlign}`}>
              {t("refunds.requestNew") || "Request Refund"}
            </h1>
            <p className={`mt-2 text-gray-600 ${textAlign}`}>
              {t("refunds.requestDesc") || "Submit a refund request for your booking"}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Booking Selection */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  {t("refunds.selectBooking") || "Select Booking"} *
                </label>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader />
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      {t("refunds.noRefundableBookings") || "No refundable bookings found. Only cancelled and paid bookings can be refunded."}
                    </p>
                  </div>
                ) : (
                  <select
                    name="booking_id"
                    value={formik.values.booking_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] ${
                      formik.touched.booking_id && formik.errors.booking_id
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">{t("refunds.selectBookingPlaceholder") || "Select a booking..."}</option>
                    {bookings.map((booking) => (
                      <option key={booking._id} value={booking._id}>
                        {booking.event?.event_name || booking.event_name || "Event"} - {booking.total_amount || booking.book_details?.total_amount || 0} SAR - Cancelled
                      </option>
                    ))}
                  </select>
                )}
                {formik.touched.booking_id && formik.errors.booking_id && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.booking_id}</p>
                )}
              </div>

              {/* Refund Reason */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  {t("refunds.reason") || "Refund Reason"} *
                </label>
                <textarea
                  name="refund_reason"
                  rows={6}
                  value={formik.values.refund_reason}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={t("refunds.reasonPlaceholder") || "Please explain why you need a refund..."}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] resize-none ${
                    formik.touched.refund_reason && formik.errors.refund_reason
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                />
                {formik.touched.refund_reason && formik.errors.refund_reason && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.refund_reason}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formik.values.refund_reason.length}/500 {t("refunds.characters") || "characters"}
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  {t("common.cancel") || "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={submitting || loading || bookings.length === 0}
                  className="flex-1 px-6 py-3 bg-[#a797cc] text-white rounded-lg font-semibold hover:bg-[#8b7ba8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader color="#fff" height="20" />
                      {t("refunds.submitting") || "Submitting..."}
                    </span>
                  ) : (
                    t("refunds.submit") || "Submit Request"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

