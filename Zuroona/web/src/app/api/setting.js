import {
	deleteData,
	DeleteParams,
	getData,
	patchRawData,
	postDataURLIncodedWithToken,
	postFormData,
	postRawData,
	putRawData,
} from "./index";
import axios from "axios";
import { BASE_API_URL, TOKEN_NAME } from "@/until";
import Cookies from "universal-cookie";
import useAuthStore from "@/store/useAuthStore";

export const SignUpApi = async (payload) => {
	return postRawData("user/register", payload).then((data) => {
		return data;
	});
};

export const OrganizerSignUpApi = async (payload) => {
	return postRawData("organizer/register", payload).then((data) => {
		return data;
	});
};

export const OrganizerUpdateProfileApi = async (payload) => {
	// Check if organizer_id is in payload (registration flow, not authenticated)
	if (payload.organizer_id) {
		// Use registration update endpoint (no authentication required)
		return putRawData("organizer/registration/update", payload).then((data) => {
			return data;
		});
	} else {
		// Use authenticated profile update endpoint
		return putRawData("organizer/profile/update", payload).then((data) => {
			return data;
		});
	}
};

export const LoginApi = async (payload) => {
    // Unified email + password login (works for both guest and host)
    return postRawData("user/login", payload).then((data) => {
		return data;
	});
};

export const PasswordLoginApi = async (payload) => {
    return postRawData("user/login", payload).then((data) => {
		return data;
	});
};

export const OrganizerLoginApi = async (payload) => {
    // Organizer login using email + password
    return postRawData("organizer/login", payload).then((data) => {
		return data;
	});
};

export const ForgotPasswordApi = async (payload) => {
	// Send password reset email for user/guest
	return postRawData("user/forgot-password", payload).then((data) => {
		return data;
	});
};

export const OrganizerForgotPasswordApi = async (payload) => {
	// Send password reset email for organizer/host
	return postRawData("organizer/forgot-password", payload).then((data) => {
		return data;
	});
};

// Phone OTP Login APIs (Saudi Arabia Only)
export const SendPhoneOTPApi = async (payload) => {
	// Send OTP to phone number
	return postRawData("user/login/phone/send-otp", payload).then((data) => {
		return data;
	});
};

export const VerifyPhoneOTPApi = async (payload) => {
	// Verify OTP and login
	return postRawData("user/login/phone/verify-otp", payload).then((data) => {
		return data;
	});
};

// Backward compatibility - map to new endpoints
export const OTPVerificationApi = async (payload, token) => {
	// Use new phone OTP verification endpoint
	// payload should contain: { phone_number, country_code, otp }
	return VerifyPhoneOTPApi(payload);
};

export const ResendOtpApi = async (payload) => {
	// Use new phone OTP send endpoint
	// payload should contain: { phone_number, country_code }
	return SendPhoneOTPApi(payload);
};

export const ResetPasswordApi = async (payload) => {
	// Reset password using token (no auth token required)
	return postRawData("user/reset-password", payload).then((data) => {
		return data;
	});
};

export const OrganizerResetPasswordApi = async (payload) => {
	// Reset password for organizer using token
	return postRawData("organizer/reset-password", payload).then((data) => {
		return data;
	});
};

export const ProfileDetailApi = async (payload) => {
	return getData("user/profile/detail", payload).then((data) => {
		return data;
	});
};

export const EditProfileApi = async (payload) => {
	return putRawData("user/profile/update", payload).then((data) => {
		return data;
	});
};

export const OrganizerEditProfileApi = async (payload) => {
	return putRawData("organizer/profile/update", payload).then((data) => {
		return data;
	});
};

export const DeactivateOrganizerApi = async (payload) => {
	return putRawData("organizer/deactivate", payload).then((data) => {
		return data;
	});
};

export const resetPasswordApi = async (payload) => {
	return postRawData("reset-password", payload).then((data) => {
		return data;
	});
};

export const changePasswordApi = async (payload) => {
	return postRawData("change-password", payload).then((data) => {
		return data;
	});
};

export const logoutApi = async (payload) => {
	return postRawData("logout", payload).then((data) => {
		return data;
	});
};

export const UploadFileApi = async (payload) => {
	try {
		// Ensure file is properly included in payload
		if (!payload.file) {
			return { status: 0, message: "File is required" };
		}

		console.log("[UPLOAD-FILE-API] Uploading file:", {
			fileName: payload.file.name,
			fileSize: payload.file.size,
			fileType: payload.file.type,
			dirName: payload.dirName
		});

		const result = await postFormData("user/uploadFile", payload);
		console.log("[UPLOAD-FILE-API] Upload result:", result);
		return result;
	} catch (error) {
		console.error("[UPLOAD-FILE-API] Error:", error);
		return {
			status: 0,
			message: error?.response?.data?.message || error?.message || "File upload failed"
		};
	}
};

export const ActiveInActiveMediaApi = async (payload) => {
	return patchRawData("media/status/change", payload).then((data) => {
		return data;
	});
};

export const AddEditCMSApi = async (payload) => {
	return putRawData("cms/update", payload).then((data) => {
		return data;
	});
};

export const CMSDetailApi = async (payload) => {
	return getData("cms", payload).then((data) => {
		return data;
	});
};

export const getCategoryList = async (payload) => {
	return getData("organizer/category/list", payload).then((data) => {
		return data;
	});
};

export const GetAllNotificationApi = async (payload) => {
	return getData("user/notification/list", payload).then((data) => {
		return data;
	});
};

export const AddEventListApi = async (payload) => {
	return postRawData("organizer/event/add", payload).then((data) => {
		return data;
	});
};

export const EditEventListApi = async (payload) => {
	return putRawData("organizer/event/update", payload).then((data) => {
		return data;
	});
};

export const AddBookNowApi = async (payload) => {
	try {
		console.log("Book event payload:", payload);
		const token = useAuthStore.getState().token;
		console.log(
			"Using token from auth store:",
			token ? "Token exists" : "No token"
		);

		// Make direct axios call with detailed logging
		const formattedToken =
			token && !token.startsWith("Bearer ") ? `Bearer ${token}` : token;

		console.log(
			"Making direct request to:",
			`${BASE_API_URL}user/event/book`
		);
		const response = await axios({
			method: "post",
			url: `${BASE_API_URL}user/event/book`,
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: formattedToken || "",
			},
			data: payload,
		});

		console.log("Book event response:", response.data);
		return response.data;
	} catch (error) {
		console.error("Book event error:", error.message);
		if (error.response) {
			console.error("Response data:", error.response.data);
			console.error("Response status:", error.response.status);
		}
		return (
			error.response?.data || {
				status: 0,
				message: error.message || "Failed to book event",
			}
		);
	}
};

export const PayemntApi = async (payload) => {
	return getData("user/payment", payload).then((data) => {
		return data;
	});
};

export const LanguageApi = async (payload) => {
	return patchRawData("user/language", payload).then((data) => {
		return data;
	});
};

export const WithdrawalApi = async (payload) => {
	return postRawData("organizer/withdrawal", payload).then((data) => {
		return data;
	});
};

export const CancelBookingApi = async (payload) => {
	// payload should contain: { book_id, reason? }
	// Backend expects book_id, so map booking_id to book_id
	const requestPayload = payload.booking_id 
		? { book_id: payload.booking_id, reason: payload.reason }
		: { ...payload, book_id: payload.book_id || payload.booking_id };
	return postRawData("user/event/cancel", requestPayload).then((data) => {
		return data;
	});
};

export const UpdatePaymentApi = async (payload) => {
	try {
		console.log("Updating payment with payload:", payload);
		const token = useAuthStore.getState().token;

		// Format token if needed
		const formattedToken =
			token && !token.startsWith("Bearer ") ? `Bearer ${token}` : token;

		// Make direct axios call for better control
		const response = await axios({
			method: "post",
			url: `${BASE_API_URL}user/payment/update`,
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: formattedToken || "",
			},
			data: payload,
		});

		console.log("Payment update response:", response.data);
		return response.data;
	} catch (error) {
		console.error("Payment update error:", error.message);
		if (error.response) {
			console.error("Response data:", error.response.data);
			console.error("Response status:", error.response.status);
		}
		return (
			error.response?.data || {
				status: 0,
				message: error.message || "Failed to update payment",
			}
		);
	}
};

export const GetUserBookingsApi = async () => {
	// Fetch all bookings (pending, approved, rejected, paid/unpaid)
	return getData("user/bookings", { book_status: "all" }).then((data) => {
		return data;
	});
};

export const GetProfileApi = ProfileDetailApi;

// ===== REFUND APIs =====
export const RequestRefundApi = async (payload) => {
	// Request refund for a booking
	// payload: { book_id, refund_reason }
	return postRawData("user/refund/request", payload).then((data) => {
		return data;
	});
};

export const GetRefundListApi = async (payload) => {
	// Get user's refund requests list
	// payload: { page, limit }
	return getData("user/refund/list", payload).then((data) => {
		return data;
	});
};

export const GetRefundDetailApi = async (payload) => {
	// Get refund request detail
	// payload: { refund_id }
	return getData("user/refund/detail", payload).then((data) => {
		return data;
	});
};

// ===== CAREER APIs =====
export const SubmitCareerApplicationApi = async (payload) => {
	// Submit job application
	// payload: { first_name, last_name, email, position, cover_letter, resume_url }
	return postRawData("user/career/apply", payload).then((data) => {
		return data;
	});
};

export const GetCareerPositionsApi = async () => {
	// Get available job positions
	return getData("user/career/positions").then((data) => {
		return data;
	});
};
