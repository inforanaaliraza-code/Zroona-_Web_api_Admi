const router = require('express').Router();
const commonController = require('../controllers/commonController.js');
const organizerController = require('../controllers/organizerController.js');
const UserController = require('../controllers/userController.js');
const messageController = require('../controllers/messageController.js');
const { AuthenticateUser, AuthenticateOrganizer } = require('../middleware/authenticate.js');
const Validator = require('../middleware/validateMiddleware.js');
const { eventValidation } = require('../validations/eventValidation.js');
const { organizerRegistrationValidation, paymentSchema } = require('../validations/organizerValidation.js');



// ===== ORGANIZER AUTHENTICATION =====
router.post("/register", organizerController.organizerRegistration); // Email verification + 4 steps
router.post("/login", organizerController.organizerLogin); // Email + password login
router.get("/verify-email", organizerController.verifyOrganizerEmail); // Email verification
router.post("/verify-signup-otp", organizerController.verifySignupOtp); // Verify signup OTP for phone
router.post("/resend-signup-otp", organizerController.resendSignupOtp); // Resend signup OTP
router.post("/forgot-password", organizerController.forgotPassword); // Send password reset email
router.post("/reset-password", organizerController.resetPassword); // Reset password using token
router.put('/registration/update', organizerController.updateRegistrationProfile); // Update during registration (steps 3-4, accepts organizer_id in body)

// ===== ADMIN ORGANIZER MANAGEMENT =====
router.put("/admin/approve/:organizerId", AuthenticateUser, organizerController.approveOrganizer); // Approve organizer
router.put("/admin/reject/:organizerId", AuthenticateUser, organizerController.rejectOrganizer); // Reject organizer
router.put('/profile/update', AuthenticateUser, AuthenticateOrganizer, organizerController.updateProfile); // Update after authentication
router.get('/category/list', organizerController.categoryList);
router.get('/event/category/list', organizerController.eventCategoryList);
router.post('/event/add', AuthenticateUser, AuthenticateOrganizer, Validator(eventValidation),organizerController.addEvent);
router.put('/event/update', AuthenticateUser, AuthenticateOrganizer, organizerController.updateEvent);
router.get('/event/detail', AuthenticateUser, AuthenticateOrganizer, organizerController.eventDetail);
router.delete('/event/delete', AuthenticateUser, AuthenticateOrganizer, organizerController.deleteEvent);
router.get('/event/list', AuthenticateUser, AuthenticateOrganizer, organizerController.eventList);
router.post('/event/cancel', AuthenticateUser, AuthenticateOrganizer, organizerController.cancelEvent);
router.get('/event/booking/list', AuthenticateUser, AuthenticateOrganizer, organizerController.bookingList);
router.get('/event/booking/detail', AuthenticateUser, AuthenticateOrganizer, organizerController.bookingDetails);
router.get('/event/analytics', AuthenticateUser, AuthenticateOrganizer, organizerController.eventAnalytics);
router.patch('/event/booking/update-status', AuthenticateUser, AuthenticateOrganizer, organizerController.changeBookingStatus);
router.get('/event/review/list', AuthenticateUser, organizerController.reviewList);
router.get('/earning', AuthenticateUser, AuthenticateOrganizer, organizerController.earningList);
router.put('/deviceToken', AuthenticateUser, AuthenticateOrganizer, commonController.deviceToken);
router.patch('/paymentStatus', AuthenticateUser ,UserController.updatePaymentStatus);
router.post('/withdrawal', AuthenticateUser ,organizerController.withdrawal);
router.get('/withdrawalList', AuthenticateUser ,organizerController.withdrawalList )

// Messaging routes for organizers
router.get('/conversations', AuthenticateUser, AuthenticateOrganizer, messageController.getConversations);
router.get('/messages', AuthenticateUser, AuthenticateOrganizer, messageController.getMessages);
router.post('/message/send', AuthenticateUser, AuthenticateOrganizer, messageController.sendMessage);
router.post('/message/send-with-attachment', AuthenticateUser, AuthenticateOrganizer, messageController.sendMessageWithAttachment);
router.get('/conversation/get-or-create', AuthenticateUser, AuthenticateOrganizer, messageController.getOrCreateConversation);
router.get('/messages/unread-count', AuthenticateUser, AuthenticateOrganizer, messageController.getUnreadCount);
router.get('/group-chat', AuthenticateUser, AuthenticateOrganizer, messageController.getGroupChat);

module.exports = router;