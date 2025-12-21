const router = require("express").Router();
const fileUpload = require("express-fileupload");
const commonController = require("../controllers/commonController.js");
const organizerController = require("../controllers/organizerController.js");
const UserController = require("../controllers/userController.js");
const userController = require("../controllers/userController.js");
const messageController = require("../controllers/messageController.js");
const {
	AuthenticateUser,
	ExtractUserIdFromToken,
} = require("../middleware/authenticate.js");
const Validator = require("../middleware/validateMiddleware.js");
// OTP validation removed - using email-based authentication only

// Note: fileUpload middleware is applied globally in app.js
router.post("/uploadFile", commonController.uploadFile);

// ===== EMAIL-BASED AUTHENTICATION =====
router.post("/register", userController.userRegistration); // Email verification
router.post("/login", userController.userLoginByEmailPhone); // Email + password login (unified for guest and host)
router.post("/login/by-email-phone", userController.userLoginByEmailPhone); // Alias for backward compatibility
router.get("/verify-email", userController.verifyEmail); // Email verification
router.post("/resend-verification", userController.resendVerification); // Resend verification email

// ===== PHONE-BASED AUTHENTICATION (Saudi Arabia Only) =====
router.post("/login/phone/send-otp", userController.sendPhoneOTP); // Send OTP to phone number
router.post("/login/phone/verify-otp", userController.verifyPhoneOTP); // Verify OTP and login

// ===== PASSWORD RESET =====
router.post("/forgot-password", userController.forgotPassword); // Send password reset email
router.post("/reset-password", userController.resetPassword); // Reset password using token

// ===== PROFILE =====
router.put("/profile/update", AuthenticateUser, userController.updateProfile);
router.get("/profile/detail", AuthenticateUser, userController.getProfile);
router.post("/profile/logout", AuthenticateUser, userController.profileLogout);
router.delete(
	"/profile/delete",
	AuthenticateUser,
	userController.profileDelete
);
router.get("/event/list", userController.eventList);
router.get("/event/detail", ExtractUserIdFromToken, userController.eventDetail);
router.post("/event/book", AuthenticateUser, userController.bookEvent);
router.post(
	"/event/cancel",
	AuthenticateUser,
	userController.eventBookingCancel
);
router.get(
	"/event/booked/list",
	AuthenticateUser,
	userController.bookEventList
);
// Alias route for backward compatibility
router.get(
	"/bookings",
	AuthenticateUser,
	userController.bookEventList
);
router.get(
	"/event/booked/detail",
	AuthenticateUser,
	userController.bookingDetail
);
router.patch("/language", AuthenticateUser, userController.updateLanguage);
router.post("/event/review/add", AuthenticateUser, userController.addReview);
router.get("/event/review/list", AuthenticateUser, userController.reviewList);
router.get(
	"/notification/list",
	AuthenticateUser,
	userController.notificationList
);
router.get(
	"/unreadNotificationCount",
	AuthenticateUser,
	userController.notificationCounts
);
router.put("/deviceToken", AuthenticateUser, commonController.deviceToken);
router.post("/verifyPayment", AuthenticateUser, userController.verifyPayment);
router.get("/payment", AuthenticateUser, UserController.paymentDetail);
router.post("/webhookReceived", userController.receivedWebhook);
router.post(
	"/payment/update",
	AuthenticateUser,
	userController.updatePaymentStatus
);

// ===== REFUND REQUESTS =====
router.post("/refund/request", AuthenticateUser, userController.requestRefund); // Request refund
router.get("/refund/list", AuthenticateUser, userController.getRefundRequests); // Get user refund requests
router.get("/refund/detail", AuthenticateUser, userController.getRefundDetail); // Get refund detail

// Messaging routes
router.get("/conversations", AuthenticateUser, messageController.getConversations);
router.get("/messages", AuthenticateUser, messageController.getMessages);
router.post("/message/send", AuthenticateUser, messageController.sendMessage);
router.post("/message/send-with-attachment", AuthenticateUser, messageController.sendMessageWithAttachment);
router.get("/conversation/get-or-create", AuthenticateUser, messageController.getOrCreateConversation);
router.get("/messages/unread-count", AuthenticateUser, messageController.getUnreadCount);
router.get("/group-chat", AuthenticateUser, messageController.getGroupChat);

module.exports = router;
