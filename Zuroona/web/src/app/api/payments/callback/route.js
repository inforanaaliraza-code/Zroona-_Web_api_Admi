import { NextResponse } from "next/server";
import axios from "axios";
import { BASE_API_URL } from "@/until";

// Create a server-side version of the payment update function
async function serverUpdatePayment(payload) {
  try {
    const response = await axios.post(BASE_API_URL + "payment/update", payload);
    return response.data;
  } catch (error) {
    return error.response?.data || { status: false, message: error.message };
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, status, amount, booking_id } = body;

    if (!id || !status || !booking_id) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Only process successful payments
    if (status === "paid") {
      const response = await serverUpdatePayment({
        booking_id,
        payment_id: id,
        amount: amount / 100 // Convert from halala to SAR
      });

      if (response.status) {
        return NextResponse.json({
          success: true,
          message: "Payment processed successfully",
          data: response.data
        });
      } else {
        return NextResponse.json(
          { success: false, message: response.message || "Payment update failed" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, message: "Payment was not successful" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while processing payment callback" },
      { status: 500 }
    );
  }
}
