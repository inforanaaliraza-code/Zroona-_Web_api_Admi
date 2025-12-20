"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";

export default function PaymentCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const status = searchParams.get("status");
  const message = searchParams.get("message");
  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    // Store payment result in localStorage
    if (id && status) {
      const booking_id = searchParams.get("booking_id");
      localStorage.setItem(
        "paymentResult",
        JSON.stringify({
          id,
          status,
          message,
          booking_id,
        })
      );

      // If payment is successful, update the payment status via API
      if (status === "paid" && booking_id) {
        const updatePayment = async () => {
          try {
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
          } catch (error) {
            console.error("Error updating payment:", error);
          }
        };

        updatePayment();
      }
    }

    // Redirect after a short delay to ensure localStorage is set and API call is initiated
    // const timer = setTimeout(() => {
    //   router.push(redirect || '/events');
    // }, 1000); // Increased delay to allow API call to complete

    // return () => clearTimeout(timer);
  }, [id, status, message, router, redirect, searchParams]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="p-8 space-y-6 w-full max-w-md text-center bg-white rounded-2xl shadow-xl">
        <div className="flex justify-center">
          {status === "paid" ? (
            <Icon
              icon="lucide:check-circle"
              className="w-16 h-16 text-green-500"
            />
          ) : status === "failed" ? (
            <Icon icon="lucide:x-circle" className="w-16 h-16 text-red-500" />
          ) : (
            <Icon
              icon="lucide:loader-2"
              className="w-16 h-16 text-blue-500 animate-spin"
            />
          )}
        </div>

        <h1 className="text-2xl font-semibold">
          {status === "paid"
            ? "Payment Successful!"
            : status === "failed"
            ? "Payment Failed"
            : "Processing Payment..."}
        </h1>

        {message && <p className="text-gray-600">{message}</p>}

        <p className="text-sm text-gray-500">Redirecting you back...</p>
      </div>
    </div>
  );
}
