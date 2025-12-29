"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { GetUserBookingsApi } from "@/app/api/setting";

export default function PaymentCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const status = searchParams.get("status");
  const message = searchParams.get("message");
  const [receiptUrl, setReceiptUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    // Store payment result in localStorage
    if (id && status) {
      const booking_id = searchParams.get("booking_id");
      setBookingId(booking_id);
      localStorage.setItem(
        "paymentResult",
        JSON.stringify({
          id,
          status,
          message,
          booking_id,
        })
      );

      // If payment is successful, update the payment status via API and fetch receipt
      if (status === "paid" && booking_id) {
        const updatePayment = async () => {
          try {
            setLoading(true);
            // Update payment status
            const response = await fetch("/api/payments/callback", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id,
                status,
                booking_id,
              }),
            });

            const data = await response.json();
            console.log("Payment update response:", data);

            // Wait a bit for receipt generation, then fetch booking details
            setTimeout(async () => {
              try {
                const bookingsResponse = await GetUserBookingsApi();
                if (bookingsResponse && bookingsResponse.status === 1) {
                  const bookings = bookingsResponse.data || [];
                  const booking = bookings.find(
                    (b) => (b._id || b.book_id)?.toString() === booking_id?.toString()
                  );
                  
                  if (booking && booking.invoice_url) {
                    setReceiptUrl(booking.invoice_url);
                  }
                }
              } catch (error) {
                console.error("Error fetching booking details:", error);
              } finally {
                setLoading(false);
              }
            }, 3000); // Wait 3 seconds for receipt generation
          } catch (error) {
            console.error("Error updating payment:", error);
            setLoading(false);
          }
        };

        updatePayment();
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [id, status, message, searchParams]);

  const handleGoToBookings = () => {
    router.push("/myEvents");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="p-8 space-y-6 w-full max-w-md text-center bg-white rounded-3xl shadow-2xl border border-gray-100"
      >
        <div className="flex justify-center">
          {status === "paid" ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-green-200 rounded-full blur-xl opacity-50"></div>
              <Icon
                icon="lucide:check-circle"
                className="w-20 h-20 text-green-500 relative z-10"
              />
            </motion.div>
          ) : status === "failed" ? (
            <Icon icon="lucide:x-circle" className="w-20 h-20 text-red-500" />
          ) : (
            <Icon
              icon="lucide:loader-2"
              className="w-20 h-20 text-blue-500 animate-spin"
            />
          )}
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-[#a797cc] to-gray-900 bg-clip-text text-transparent"
        >
          {status === "paid"
            ? "Payment Successful!"
            : status === "failed"
            ? "Payment Failed"
            : "Processing Payment..."}
        </motion.h1>

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600"
          >
            {message}
          </motion.p>
        )}

        {status === "paid" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4 pt-4"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <Icon icon="lucide:loader-2" className="w-5 h-5 animate-spin" />
                <span className="text-sm">Generating your receipt...</span>
              </div>
            ) : receiptUrl ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Your payment has been processed successfully! Your receipt is ready.
                </p>
                <button
                  onClick={() => window.open(receiptUrl, "_blank")}
                  className="w-full bg-gradient-to-r from-[#a797cc] via-[#9d8bc0] to-[#a797cc] text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <Icon
                    icon="lucide:file-text"
                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                  />
                  View Receipt
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                Your payment has been processed successfully! Your receipt will be available in your bookings.
              </p>
            )}

            <button
              onClick={handleGoToBookings}
              className="w-full bg-white border-2 border-[#a797cc] text-[#a797cc] py-3 px-6 rounded-xl font-semibold hover:bg-[#a797cc] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Icon icon="lucide:calendar" className="w-5 h-5" />
              View My Bookings
            </button>
          </motion.div>
        )}

        {status === "failed" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="pt-4"
          >
            <button
              onClick={() => router.push("/events")}
              className="w-full bg-gradient-to-r from-[#a797cc] to-[#9d8bc0] text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {!status && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-gray-500"
          >
            Please wait while we process your payment...
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
