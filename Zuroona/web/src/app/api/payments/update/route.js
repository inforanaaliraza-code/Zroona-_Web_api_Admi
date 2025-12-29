import { NextResponse } from "next/server";
import axios from "axios";
import { BASE_API_URL } from "@/until";

// Create a server-side version of postRawData that doesn't depend on client hooks
async function serverPostRawData(url = "", data = {}, token = null) {
  try {
    const response = await axios.post(BASE_API_URL + url, data, {
      headers: { Authorization: token || "" },
    });

    return response.data;
  } catch (error) {
    return error.response?.data || { status: false, message: error.message };
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { booking_id, payment_id, amount, token } = body;

    // Validate required fields
    if (!booking_id || !payment_id) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Call the API to update payment status using the server-side function
    const response = await serverPostRawData("user/payment/update", {
      booking_id,
      payment_id,
      amount,
    }, token);

    if (response.status) {
      return NextResponse.json({
        success: true,
        message: "Payment updated successfully",
        data: response.data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: response.message || "Payment update failed",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Payment update error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while processing payment" },
      { status: 500 }
    );
  }
}
