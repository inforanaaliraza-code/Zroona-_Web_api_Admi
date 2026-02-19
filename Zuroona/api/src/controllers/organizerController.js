const { verifyToken, generateToken } = require("../helpers/generateToken");
const Response = require("../helpers/response");
const { cleanEmail } = require("../helpers/emailCleaner");
const { getLocalPhoneFromString } = require("../controllers/userController");
// OTP functionality removed - using email-based authentication only
const GroupCategories = require("../models/groupCategoryModel");
const BankService = require("../services/bankService");
const mongoose = require("mongoose");
const organizerService = require("../services/organizerService");
// OTP functionality removed - using email-based authentication only
const EventService = require("../services/eventService");
const BookEvent = require("../models/eventBookModel");
const BookEventService = require("../services/bookEventService");
const ReviewService = require("../services/reviewService");
const GroupCategoriesService = require("../services/groupCategoriesService");
const EventCategoryService = require("../services/EventCategoriesService");
const {
	sendEventBookingAcceptNotification,
} = require("../helpers/pushNotification");
const NotificationService = require("../services/notificationService");
const resp_messages = require("../helpers/resp_messages");
const UserService = require("../services/userService");
const PrettyConsole = require("../helpers/prettyConsole");
const WalletService = require("../services/walletService");
const moment = require("moment");
const TransactionService = require("../services/recentTransaction");
const ConversationService = require("../services/conversationService.js");
const notificationHelper = require("../helpers/notificationService");
const {
	getGraphData,
	getCurrentMonthAttendees,
	getPreviousMonthAttendees,
	calculateAttendanceChange,
	generateDailyEarningsData,
	generateWeeklyEarningsData,
	generateMonthlyEarningsData,
	calculateTotalAttendees,
	calculateMonthlyAttendeeComparison,
} = require("../helpers/earningHelperFun");

const custom_log = new PrettyConsole();
custom_log.clear();
custom_log.closeByNewLine = true;
custom_log.useIcons = true;

// ===== SPECIAL TEST PHONES (AUTO-VERIFIED) =====
// Match against last 9 digits of the phone number (local part without country code)
// Also supports 8-digit test numbers (50000001-50000009)
const SPECIAL_LOCAL_TEST_PHONES = new Set([
	"533333332",
	"522222221",
	"597832272",
	"597832271",
	// 8-digit test numbers (will match as last 8 digits)
	"50000001",
	"50000002",
	"50000003",
	"50000004",
	"50000005",
	"50000006",
	"50000007",
	"50000008",
	"50000009",
]);

const organizerController = {
	/**
	 * Organizer/Host Registration - Complete 4-step process
	 * POST /organizer/register
	 * 
	 * Registration Steps:
	 * 1. Basic Info (first_name, last_name, email, phone, gender, dob, city, acceptTerms, acceptPrivacy)
	 * 2. Personal Info & Questions (bio, questions_answers)
	 * 3. Bank Details (bank info)
	 * 4. Upload ID (govt_id)
	 * 
	 * After all steps: Send email verification
	 */
	organizerRegistration: async (req, res) => {
		const { lang = "en" } = req.headers;
		try {
			const { email, phone_number, country_code, registration_step = 4 } = req.body;

			console.log("[ORGANIZER:REGISTRATION] Registration request:", {
				email,
				phone_number,
				step: registration_step,
				password: "NOT_REQUIRED"
			});

			// Import validation helpers
			const { validateEmail, validateSaudiPhone } = require("../helpers/validationHelpers");

			// Validate email
			if (!email) {
				return Response.validationErrorResponse(
					res,
					resp_messages?.[lang]?.email_required || "Email address is required"
				);
			}

			const emailValidation = validateEmail(email);
			if (!emailValidation.isValid) {
				return Response.validationErrorResponse(
					res,
					emailValidation.message
				);
			}

			// Phone number is required for passwordless authentication
			if (!phone_number || !country_code) {
				return Response.validationErrorResponse(
					res,
					"Phone number and country code are required"
				);
			}

			// Validate Saudi phone number
			const phoneValidation = validateSaudiPhone(phone_number, country_code);
			if (!phoneValidation.isValid) {
				return Response.validationErrorResponse(
					res,
					phoneValidation.message
				);
			}

			const emailLower = cleanEmail(email);
			const phoneStr = phoneValidation.cleanPhone;

			// Check for existing organizer by email (including deleted ones for email/phone reuse prevention)
			const exist_organizer_email = await organizerService.FindOneService({
				email: emailLower,
			});

			// Check for existing user by email
			const exist_user_email = await UserService.FindOneService({
				email: emailLower,
				is_delete: { $ne: 1 },
			});

			console.log("[ORGANIZER:REGISTRATION] Existing checks:", {
				organizerByEmail: exist_organizer_email ? "found" : "not found",
				userByEmail: exist_user_email ? "found" : "not found",
			});

			// If email exists
			if (exist_organizer_email || exist_user_email) {
				const existingAccount = exist_organizer_email || exist_user_email;
				
				// Check if account is deleted or suspended
				if (existingAccount.is_delete === 1) {
					return Response.conflictResponse(
						res,
						{
							email: emailLower,
							account_status: "deleted"
						},
						409,
						"This email was previously used with a deleted or suspended account. Please use a different email address or contact the Zuroona admin team at infozuroona@gmail.com to reactivate your account."
					);
				}
				
				// Check if account is suspended
				if (existingAccount.is_suspended === true) {
					return Response.conflictResponse(
						res,
						{
							email: emailLower,
							account_status: "suspended"
						},
						409,
						"This email was previously used with a deleted or suspended account. Please use a different email address or contact the Zuroona admin team at infozuroona@gmail.com to reactivate your account."
					);
				}
				
				// If already verified, tell them to login
				if (existingAccount.is_verified) {
					return Response.conflictResponse(
						res,
						{
							exists_as: exist_organizer_email ? "organizer" : "user",
							email: emailLower,
						},
						409,
						resp_messages?.[lang]?.account_exist_login || 
						"Account already exists with this email. Please login."
					);
				}

				// If not verified, allow updating data and resend verification
				if (exist_organizer_email) {
					console.log("[ORGANIZER:REGISTRATION] Organizer exists but not verified, updating data");
					
					// Determine registration type: if previously rejected, mark as Re-apply
					const registrationType = (exist_organizer_email.is_approved === 3 || exist_organizer_email.registration_type === 'Re-apply') 
						? 'Re-apply' 
						: 'New';
					
					// Update organizer data
					const updateData = {
						...req.body,
						email: emailLower,
						phone_number: phone_number ? phone_number.toString() : exist_organizer_email.phone_number,
						role: 2,
						is_verified: false,
						is_approved: 1, // Pending approval
						registration_type: registrationType,
						language: lang,
						registration_step: registration_step || 4,
					};

					await organizerService.FindByIdAndUpdateService(
						exist_organizer_email._id,
						updateData
					);

					const updatedOrganizer = await organizerService.FindByIdService(exist_organizer_email._id);

					// Resend verification email
					const emailService = require("../helpers/emailService");
					const EmailVerificationService = require("../services/emailVerificationService");

					// Delete old tokens
					await EmailVerificationService.DeleteUserTokens(updatedOrganizer._id, "organizer");

					// Generate new token
					const verificationToken = emailService.generateVerificationToken();
					const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

					// Save token
					await EmailVerificationService.CreateToken({
						token: verificationToken,
						user_id: updatedOrganizer._id,
						user_type: "organizer",
						email: emailLower,
						expiresAt,
					});

					// Generate verification link
					const verificationLink = emailService.generateVerificationLink(
						verificationToken,
						2, // role: organizer
						lang
					);

					// Send email
					const emailHtml = emailService.renderHostVerificationEmail(
						`${updatedOrganizer.first_name} ${updatedOrganizer.last_name}`,
						verificationLink,
						lang
					);

					const subject = lang === "ar" 
						? "تأكيد البريد الإلكتروني - Zuroona" 
						: "Verify your email address - Zuroona";

					console.log("[ORGANIZER:REGISTRATION] Resending verification email to:", emailLower);

					const emailSent = await emailService.send(emailLower, subject, emailHtml);

					return Response.ok(
						res,
						{
							organizer: {
								_id: updatedOrganizer._id,
								email: updatedOrganizer.email,
								first_name: updatedOrganizer.first_name,
								last_name: updatedOrganizer.last_name,
								is_verified: false,
								is_approved: 1, // Pending
								registration_step: updatedOrganizer.registration_step,
							},
							verification_sent: emailSent,
						},
						200,
						resp_messages?.[lang]?.verification_email_sent || 
						"Registration data updated. Verification email sent. Please check your inbox."
					);
				}
			}

			// Check for existing phone number
			const exist_organizer_phone = await organizerService.FindOneService({
				phone_number: parseInt(phoneStr),
				country_code,
			});

			const exist_user_phone = await UserService.FindOneService({
				phone_number: parseInt(phoneStr),
				country_code,
			});

			if (exist_organizer_phone || exist_user_phone) {
				const existingPhoneAccount = exist_organizer_phone || exist_user_phone;
				
				// Check if account is deleted or suspended
				if (existingPhoneAccount.is_delete === 1) {
					return Response.conflictResponse(
						res,
						{
							phone_number: phone_number,
							account_status: "deleted"
						},
						409,
						"This phone number was previously used with a deleted or suspended account. Please use a different phone number or contact the Zuroona admin team at infozuroona@gmail.com to reactivate your account."
					);
				}
				
				// Check if account is suspended
				if (existingPhoneAccount.is_suspended === true) {
					return Response.conflictResponse(
						res,
						{
							phone_number: phone_number,
							account_status: "suspended"
						},
						409,
						"This phone number was previously used with a deleted or suspended account. Please use a different phone number or contact the Zuroona admin team at infozuroona@gmail.com to reactivate your account."
					);
				}
				
				return Response.conflictResponse(
					res,
					{
						exists_as: exist_organizer_phone ? "organizer" : "user",
						phone_number: phone_number,
					},
					409,
					resp_messages?.[lang]?.phone_exist || "Phone number already registered"
				);
			}

			// Validate required fields based on completion
			// For final submission (step 4), all fields must be present
			if (registration_step === 4) {
				const requiredFields = [
					"first_name",
					"last_name",
					"email",
					"gender",
					"date_of_birth",
					"bio",
					"govt_id", // ID uploaded
				];

				const missingFields = requiredFields.filter(field => !req.body[field]);

				if (missingFields.length > 0) {
					return Response.validationErrorResponse(
						res,
						`Missing required fields: ${missingFields.join(", ")}`
					);
				}
			}

			// Check if this is a re-application (check if email/phone was previously rejected)
			const wasRejected = await organizerService.FindOneService({
				$or: [
					{ email: emailLower, is_approved: 3 },
					{ phone_number: parseInt(phoneStr), country_code, is_approved: 3 }
				]
			});
			const registrationType = wasRejected ? 'Re-apply' : 'New';
			
			// Create new organizer (passwordless - no password field)
			const organizerData = {
				...req.body,
				email: emailLower,
				phone_number: parseInt(phoneStr),
				country_code: country_code,
				role: 2, // Organizer role
				is_verified: false, // Will be true only when BOTH email AND phone are verified
				phone_verified: false,
				email_verified_at: null,
				phone_verified_at: null,
				is_approved: 1, // Pending approval
				registration_type: registrationType,
				language: lang,
				registration_step: registration_step || 4,
			};

			// Remove password and confirmPassword if they exist (passwordless auth)
			delete organizerData.password;
			delete organizerData.confirmPassword;

			// Auto-verify email/phone for special test numbers
			const localPhoneForAutoVerify = getLocalPhoneFromString(phoneStr);
			const phoneDigits = phoneStr ? phoneStr.toString().replace(/\D/g, "") : "";
			const last8Digits = phoneDigits.slice(-8);
			const isSpecialTestPhone = (localPhoneForAutoVerify && SPECIAL_LOCAL_TEST_PHONES.has(localPhoneForAutoVerify)) ||
			                           (last8Digits && SPECIAL_LOCAL_TEST_PHONES.has(last8Digits));

			if (isSpecialTestPhone) {
				organizerData.is_verified = true;
				organizerData.phone_verified = true;
				organizerData.phone_verified_at = new Date();
				organizerData.email_verified_at = new Date();
			}

			// Ensure MongoDB connection before database operations
			const { ensureConnection } = require("../config/database");
			await ensureConnection();

			let organizer;
			try {
				organizer = await organizerService.CreateService(organizerData);
				console.log("[ORGANIZER:REGISTRATION] Organizer created successfully in database:", organizer._id);
			} catch (createError) {
				console.error("[ORGANIZER:REGISTRATION] Failed to create organizer in database:", createError.message);
				console.error("[ORGANIZER:REGISTRATION] Full error:", createError);
				return Response.serverErrorResponse(
					res,
					"Failed to create organizer account. Please try again later."
				);
			}

			// Send OTP to phone number for verification (via Msegat)
			const fullPhoneNumber = `${country_code}${phoneStr}`;
			let otpSent = false;
			let otpValue = null;

			if (isSpecialTestPhone) {
				console.log(`[ORGANIZER:REGISTRATION] Special test organizer created with auto-verified email/phone and fixed OTP. Skipping SMS for ${fullPhoneNumber}.`);
				otpSent = true;
				otpValue = "123456";
			} else {
				try {
					const { sendSignupOtp } = require("../helpers/otpSend");
					otpValue = await sendSignupOtp(organizer._id.toString(), fullPhoneNumber, 2, lang);
					otpSent = true;
					console.log("[ORGANIZER:REGISTRATION] OTP sent to phone number via Msegat");
				} catch (otpError) {
					console.error("[ORGANIZER:REGISTRATION] Error sending OTP to phone:", otpError.message);
					// Don't fail registration, but log the error
				}
			}

			// Create wallet for organizer
			const wallet = await WalletService.CreateService({
				organizer_id: organizer._id,
			});
			console.log("[ORGANIZER:REGISTRATION] Wallet created:", wallet._id);

			// Send email verification
			const emailService = require("../helpers/emailService");
			const EmailVerificationService = require("../services/emailVerificationService");

			const verificationToken = emailService.generateVerificationToken();
			const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

			// Save token
			await EmailVerificationService.CreateToken({
				token: verificationToken,
				user_id: organizer._id,
				user_type: "organizer",
				email: emailLower,
				expiresAt,
			});

			console.log("[ORGANIZER:REGISTRATION] Verification token created");

			// Generate verification link
			const verificationLink = emailService.generateVerificationLink(
				verificationToken,
				2, // role: organizer
				lang
			);

			// Send verification email
			const emailHtml = emailService.renderHostVerificationEmail(
				`${organizer.first_name} ${organizer.last_name}`,
				verificationLink,
				lang
			);

			const subject = lang === "ar" 
				? "تأكيد البريد الإلكتروني - Zuroona" 
				: "Verify your email address - Zuroona";

			console.log("[ORGANIZER:REGISTRATION] Sending verification email to:", emailLower);
			console.log("[ORGANIZER:REGISTRATION] Verification link:", verificationLink);

			const emailSent = await emailService.send(emailLower, subject, emailHtml);

			if (!emailSent) {
				console.error("[ORGANIZER:REGISTRATION] Failed to send verification email");
			} else {
				console.log("[ORGANIZER:REGISTRATION] Verification email sent successfully");
			}

			// Create notification for admin
			try {
				const AdminService = require("../services/adminService.js");
				const admins = await AdminService.FindService({ is_delete: { $ne: 1 } });
				
				for (const admin of admins) {
					await NotificationService.CreateService({
						user_id: admin._id,
						role: 3, // Admin role
						title: "New Host Application",
						title_ar: "طلب مضيف جديد",
						description: `A new host "${organizer.first_name} ${organizer.last_name}" has applied and is pending approval`,
						description_ar: `مضيف جديد "${organizer.first_name} ${organizer.last_name}" قدم طلب وينتظر الموافقة`,
						isRead: false,
						notification_type: 1, // Organizer type
					});
				}
			} catch (notificationError) {
				console.error("[ORGANIZER:REGISTRATION] Error creating admin notification:", notificationError);
			}

			return Response.ok(
				res,
				{
					organizer: {
						_id: organizer._id,
						email: organizer.email,
						phone_number: organizer.phone_number,
						country_code: organizer.country_code,
						first_name: organizer.first_name,
						last_name: organizer.last_name,
						is_verified: false,
						phone_verified: false,
						email_verified: false,
						is_approved: 1, // Pending
						registration_step: organizer.registration_step,
					},
					verification_status: {
						email_sent: emailSent,
						otp_sent: otpSent,
						email_verified: false,
						phone_verified: false,
					},
					verification_link: process.env.NODE_ENV === "development" ? verificationLink : undefined,
					otp_for_testing: process.env.NODE_ENV === "development" && otpValue ? otpValue : undefined,
				},
				201,
				lang === "ar"
					? "تم التسجيل بنجاح! يرجى التحقق من بريدك الإلكتروني ورقم الهاتف. سيتم مراجعة طلبك من قبل فريقنا."
					: "Registration successful! Please verify your email address and enter the OTP sent to your phone number. Your application will be reviewed by our team."
			);
		} catch (error) {
			console.error("[ORGANIZER:REGISTRATION] Registration error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages?.[lang]?.internalServerError || "Something went wrong"
			);
		}
	},

	organizerLogin: async (req, res) => {
		const lang = req.headers["lang"] || req.lang || "en";
		try {
			const { email, password } = req.body;

			// Log request (excluding password)
			console.log("[ORGANIZER:LOGIN] Login attempt for:", email);

			// Validate email
			if (!email || !email.includes("@")) {
				return Response.validationErrorResponse(
					res,
					resp_messages?.[lang]?.email_required || "Valid email address is required"
				);
			}

			// Validate password
			if (!password) {
				return Response.validationErrorResponse(
					res,
					resp_messages?.[lang]?.password_required || "Password is required"
				);
			}

			// Clean email - remove invisible/zero-width characters, trim, and lowercase
			const emailLower = cleanEmail(email);

			// Find organizer by email (include password field for verification)
			// Use model directly to allow .select("+password") chaining
			const Organizer = require("../models/organizerModel");
			const organizer = await Organizer.findOne({
				email: emailLower,
				is_delete: { $ne: 1 },
			}).select("+password");

			if (!organizer) {
				console.log("[ORGANIZER:LOGIN] Organizer not found for email:", emailLower);
				return Response.unauthorizedResponse(
					res,
					resp_messages?.[lang]?.invalid_credentials || "Invalid email or password"
				);
			}

			console.log("[ORGANIZER:LOGIN] Organizer found:", {
				id: organizer._id,
				email: organizer.email,
				is_verified: organizer.is_verified,
				is_approved: organizer.is_approved,
			});

			// Check if email is verified
			if (!organizer.is_verified) {
				console.log("[ORGANIZER:LOGIN] Email not verified");
				return Response.unauthorizedResponse(
					res,
					resp_messages?.[lang]?.email_not_verified || 
					"Please verify your email address before logging in. Check your inbox for the verification link."
				);
			}

			// Check approval status
			if (organizer.is_approved === 1) {
				console.log("[ORGANIZER:LOGIN] Account pending approval");
				return Response.unauthorizedResponse(
					res,
					resp_messages?.[lang]?.account_pending_approval || 
					"Your account is pending admin approval. You will be notified via email once approved."
				);
			}

			if (organizer.is_approved === 3) {
				console.log("[ORGANIZER:LOGIN] Account rejected");
				return Response.unauthorizedResponse(
					res,
					resp_messages?.[lang]?.account_rejected || 
					"Your account has been rejected by admin. Please contact support for more information."
				);
			}

			// Verify password
			const { matchPassword } = require("../helpers/hashPassword");
			const isPasswordValid = await matchPassword(password, organizer.password);

			if (!isPasswordValid) {
				console.log("[ORGANIZER:LOGIN] Invalid password");
				return Response.unauthorizedResponse(
					res,
					resp_messages?.[lang]?.invalid_credentials || "Invalid email or password"
				);
			}

			console.log("[ORGANIZER:LOGIN] Password verified successfully");

			// Generate JWT token
			const token = generateToken(organizer._id, organizer.role);

			// Remove password from response
			const organizerResponse = organizer.toObject();
			delete organizerResponse.password;

			return Response.ok(
				res,
				{
					token,
					organizer: organizerResponse,
				},
				200,
				resp_messages?.[lang]?.login_success || "Login successful!"
			);
		} catch (error) {
			console.error("[ORGANIZER:LOGIN] Login error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages?.[lang]?.internalServerError || "Internal server error"
			);
		}
	},

	// OTP verification removed - using email verification only
	
	/**
	 * Forgot Password - Send password reset email for organizer
	 * POST /organizer/forgot-password
	 * Body: { email }
	 */
	forgotPassword: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const { email } = req.body;

			console.log("[ORGANIZER:FORGOT-PASSWORD] Request for:", email);

			// Validate email
			if (!email || !email.includes("@")) {
				return Response.validationErrorResponse(
					res,
					resp_messages?.[lang]?.email_required || "Valid email address is required"
				);
			}

			const emailLower = cleanEmail(email);

			// Find organizer by email
			const organizer = await organizerService.FindOneService({
				email: emailLower,
				is_delete: { $ne: 1 },
			});

			if (!organizer) {
				// Don't reveal if email exists for security
				console.log("[ORGANIZER:FORGOT-PASSWORD] Organizer not found (security: not revealing)");
				return Response.ok(
					res,
					{},
					200,
					"If an account with this email exists, a password reset link has been sent."
				);
			}

			console.log("[ORGANIZER:FORGOT-PASSWORD] Organizer found:", organizer._id);

			const emailService = require("../helpers/emailService");
			const EmailVerificationService = require("../services/emailVerificationService");

			// Delete old reset tokens
			await EmailVerificationService.DeleteUserTokens(organizer._id, "organizer");

			// Generate reset token
			const resetToken = emailService.generateVerificationToken();
			const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

			// Save token
			await EmailVerificationService.CreateToken({
				token: resetToken,
				user_id: organizer._id,
				user_type: "organizer",
				email: emailLower,
				expiresAt,
				token_type: "password_reset",
			});

			// Generate reset link
			const resetLink = emailService.generatePasswordResetLink(
				resetToken,
				2, // role: organizer
				organizer.language || lang
			);

			// Send email
			const emailHtml = emailService.renderPasswordResetEmail(
				`${organizer.first_name} ${organizer.last_name}`,
				resetLink,
				organizer.language || lang
			);

			const subject = (organizer.language || lang) === "ar" 
				? "إعادة تعيين كلمة المرور - Zuroona" 
				: "Password Reset Request - Zuroona";

			console.log("[ORGANIZER:FORGOT-PASSWORD] Sending reset email to:", emailLower);

			const emailSent = await emailService.send(emailLower, subject, emailHtml);

			return Response.ok(
				res,
				{
					email: emailLower,
					reset_sent: emailSent,
				},
				200,
				emailSent 
					? (resp_messages?.[lang]?.password_reset_sent || "If an account with this email exists, a password reset link has been sent to your email.")
					: (resp_messages?.[lang]?.password_reset_failed || "Failed to send password reset email. Please try again later.")
			);
		} catch (error) {
			console.error("[ORGANIZER:FORGOT-PASSWORD] Error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages?.[lang]?.internalServerError || "Internal server error"
			);
		}
	},

	/**
	 * Reset Password - Reset password using token for organizer
	 * POST /organizer/reset-password
	 * Body: { token, new_password, confirmPassword }
	 */
	resetPassword: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const { token, new_password, confirmPassword } = req.body;

			console.log("[ORGANIZER:RESET-PASSWORD] Reset request received");

			// Validate token
			if (!token) {
				return Response.validationErrorResponse(
					res,
					resp_messages?.[lang]?.token_required || "Reset token is required"
				);
			}

			// Validate password
			if (!new_password) {
				return Response.validationErrorResponse(
					res,
					resp_messages?.[lang]?.password_required || "New password is required"
				);
			}

			// Validate password strength
			const { validatePasswordStrength, validatePasswordMatch } = require("../helpers/passwordValidator");
			const passwordValidation = validatePasswordStrength(new_password);
			
			if (!passwordValidation.isValid) {
				return Response.validationErrorResponse(
					res,
					passwordValidation.message
				);
			}

			// Validate password match
			if (confirmPassword) {
				const passwordMatchValidation = validatePasswordMatch(new_password, confirmPassword);
				if (!passwordMatchValidation.isValid) {
					return Response.validationErrorResponse(
						res,
						passwordMatchValidation.message
					);
				}
			}

			const EmailVerificationService = require("../services/emailVerificationService");

			// Find token
			const tokenRecord = await EmailVerificationService.FindByToken(token);

			if (!tokenRecord) {
				return Response.unauthorizedResponse(
					res,
					resp_messages?.[lang]?.invalid_token || "Invalid or expired reset token"
				);
			}

			// Check if token is for password reset and belongs to organizer
			if (tokenRecord.token_type !== "password_reset" || tokenRecord.user_type !== "organizer") {
				return Response.unauthorizedResponse(
					res,
					resp_messages?.[lang]?.invalid_token || "Invalid reset token"
				);
			}

			// Find organizer
			const organizer = await organizerService.FindOneService({
				_id: tokenRecord.user_id,
				is_delete: { $ne: 1 },
			}).select("+password");

			if (!organizer) {
				return Response.notFoundResponse(
					res,
					resp_messages?.[lang]?.user_not_found || "Organizer not found"
				);
			}

			// Hash new password
			const { hashPassword } = require("../helpers/hashPassword");
			const hashedPassword = await hashPassword(new_password);

			// Update password
			organizer.password = hashedPassword;
			await organizer.save();

			// Mark token as used
			await EmailVerificationService.MarkAsUsed(tokenRecord._id);

			console.log("[ORGANIZER:RESET-PASSWORD] Password reset successful for:", organizer.email);

			return Response.ok(
				res,
				{},
				200,
				resp_messages?.[lang]?.password_reset_success || "Password reset successfully. You can now login with your new password."
			);
		} catch (error) {
			console.error("[ORGANIZER:RESET-PASSWORD] Error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages?.[lang]?.internalServerError || "Internal server error"
			);
		}
	},

	/**
	 * Update profile during registration (steps 3-4)
	 * Accepts organizer_id in body - no authentication required
	 * Used for bank details (step 3) and CNIC upload (step 4)
	 */
	updateRegistrationProfile: async (req, res) => {
		console.log(
			"[ORGANIZER:REGISTRATION-UPDATE] Registration profile update request"
		);
		console.log(req.body);

		try {
			let { registration_step, organizer_id, group_location } = req.body;

			if (!organizer_id) {
				return Response.badRequestResponse(
					res,
					"organizer_id is required in request body for registration updates."
				);
			}

			const existOrganizer = await organizerService.FindOneService({
				_id: organizer_id,
			});

			if (!existOrganizer) {
				return Response.notFoundResponse(
					res,
					"Organizer not found with the provided organizer_id."
				);
			}

			if (group_location) {
				const processedGroupLocation = group_location.map((loc) => ({
					_id: loc._id ? loc._id : new mongoose.Types.ObjectId(),
					location: {
						type: "Point",
						coordinates: [loc.longitude, loc.latitude],
					},
					city_name: loc.city_name || "",
				}));

				req.body.group_location = processedGroupLocation;
			}

			// Remove organizer_id from req.body before updating organizer document
			// (to avoid trying to update _id field)
			const updateData = { ...req.body };
			delete updateData.organizer_id;

			const organizer =
				await organizerService.FindByIdAndUpdateAndSelectService(
					organizer_id,
					updateData
				);

			// Save bank details when registration_step is 3 (Bank Details step)
			if (registration_step == 3) {
				const bankData = {
					organizer_id: organizer_id,
					account_holder_name: req.body.account_holder_name,
					bank_name: req.body.bank_name,
					iban: req.body.iban,
					account_number: req.body.account_number,
					ifsc_code: req.body.ifsc_code,
				};

				const exist_user_bank = await BankService.FindOneService({
					organizer_id: organizer_id,
				});
				if (exist_user_bank) {
					await BankService.FindByIdAndUpdateService(
						exist_user_bank._id,
						bankData
					);
					console.log("[ORGANIZER:REGISTRATION-UPDATE] Bank details updated for organizer:", organizer_id);
				} else {
					await BankService.CreateService(bankData);
					console.log("[ORGANIZER:REGISTRATION-UPDATE] Bank details created for organizer:", organizer_id);
				}
			}
			
			// CNIC upload (govt_id) is saved in organizer document itself via govt_id field (registration_step == 4)
			// The govt_id field stores comma-separated URLs: "front_url,back_url"
			if (registration_step == 4 && req.body.govt_id) {
				console.log("[ORGANIZER:REGISTRATION-UPDATE] CNIC uploaded for organizer:", organizer_id);
				console.log("[ORGANIZER:REGISTRATION-UPDATE] CNIC URLs:", req.body.govt_id);
			}

			const lang = req.headers["lang"] || req.lang || "en";
			
			return Response.ok(
				res,
				{ organizer },
				200,
				resp_messages?.[lang]?.profileUpdated || resp_messages(lang)?.profileUpdated || "Profile updated successfully",
				0,
				1 // status: 1 for success
			);
		} catch (error) {
			console.error("[ORGANIZER:REGISTRATION-UPDATE] Error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages(req.lang).internalServerError
			);
		}
	},

	updateProfile: async (req, res) => {
		console.log(
			"start ====><============== body of organizer update profile "
		);
		console.log(req.body);
		console.log(
			"end  ====><============== body of organizer update profile "
		);

		try {
			const { userId } = req;
			let { registration_step, group_location, organizer_id } = req.body;

			// Use organizer_id from payload if provided (for post-registration steps before email verification)
			// Otherwise use userId from token (for authenticated requests)
			const targetOrganizerId = organizer_id || userId;

			if (!targetOrganizerId) {
				return Response.badRequestResponse(
					res,
					"Organizer ID is required. Please provide organizer_id in request body or ensure you are authenticated."
				);
			}

			const existOrganizer = await organizerService.FindOneService({
				_id: targetOrganizerId,
			});

			if (!existOrganizer) {
				return Response.notFoundResponse(
					res,
					"Organizer not found with the provided ID."
				);
			}

			if (group_location) {
				const processedGroupLocation = group_location.map((loc) => ({
					_id: loc._id ? loc._id : new mongoose.Types.ObjectId(),
					location: {
						type: "Point",
						coordinates: [loc.longitude, loc.latitude],
					},
					city_name: loc.city_name || "",
				}));

				req.body.group_location = processedGroupLocation;
			}

			// Remove organizer_id from req.body before updating organizer document
			// (to avoid trying to update _id field)
			const updateData = { ...req.body };
			delete updateData.organizer_id;

			const organizer =
				await organizerService.FindByIdAndUpdateAndSelectService(
					targetOrganizerId,
					updateData
				);

			// Save bank details when registration_step is 3 (Bank Details step) OR when bank fields are present (for profile updates)
			const hasBankDetails = req.body.account_holder_name || req.body.bank_name || req.body.iban || 
									req.body.account_number || req.body.ifsc_code;
			
			if (registration_step == 3 || hasBankDetails) {
				// Validate IBAN if provided
				if (req.body.iban && req.body.iban.trim() !== '') {
					const IBAN = require('iban');
					const cleanedIban = req.body.iban.replace(/\s/g, '').toUpperCase();
					if (!IBAN.isValid(cleanedIban)) {
						return Response.errorResponse(
							res,
							"Invalid IBAN format",
							400
						);
					}
				}

				const bankData = {
					organizer_id: targetOrganizerId,
					account_holder_name: req.body.account_holder_name || "",
					bank_name: req.body.bank_name || "",
					iban: req.body.iban || "",
					account_number: req.body.account_number || "",
					ifsc_code: req.body.ifsc_code || "",
				};

				const exist_user_bank = await BankService.FindOneService({
					organizer_id: targetOrganizerId,
				});
				if (exist_user_bank) {
					await BankService.FindByIdAndUpdateService(
						exist_user_bank._id,
						bankData
					);
					console.log("[ORGANIZER:UPDATE] Bank details updated for organizer:", targetOrganizerId);
					console.log("[ORGANIZER:UPDATE] Bank data:", JSON.stringify(bankData, null, 2));
				} else {
					await BankService.CreateService(bankData);
					console.log("[ORGANIZER:UPDATE] Bank details created for organizer:", targetOrganizerId);
					console.log("[ORGANIZER:UPDATE] Bank data:", JSON.stringify(bankData, null, 2));
				}
			}
			
			// CNIC upload (govt_id) is saved in organizer document itself via govt_id field (registration_step == 4)
			// The govt_id field stores comma-separated URLs: "front_url,back_url"
			if (registration_step == 4 && req.body.govt_id) {
				console.log("[ORGANIZER:UPDATE] CNIC uploaded for organizer:", targetOrganizerId);
				console.log("[ORGANIZER:UPDATE] CNIC URLs:", req.body.govt_id);
			}

			const token = generateToken(organizer._id, organizer.role);
			return Response.ok(
				res,
				{ user: organizer, token },
				200,
				resp_messages(req.lang).profileUpdated
			);
		} catch (error) {
			console.log(error.message);
			return Response.serverErrorResponse(
				res,
				resp_messages(req.lang).internalServerError
			);
		}
	},

	deactivateAccount: async (req, res) => {
		try {
			const { userId } = req;
			
			const organizer = await organizerService.FindOneService({
				_id: userId,
			});

			if (!organizer) {
				return Response.notFoundResponse(
					res,
					resp_messages(req.lang).user_not_found
				);
			}

			// Set organizer to inactive
			organizer.isActive = 2;
			await organizer.save();

			return Response.ok(
				res,
				{ isActive: organizer.isActive },
				200,
				resp_messages(req.lang).update_success || "Account deactivated successfully"
			);
		} catch (error) {
			console.log(error.message);
			return Response.serverErrorResponse(
				res,
				resp_messages(req.lang).internalServerError
			);
		}
	},

	getProfile: async (req, res) => {
		try {
			const { userId } = req;
			const organizer = await organizerService.FindOneService({
				_id: userId,
			});
			return Response.ok(
				res,
				organizer,
				200,
				resp_messages(req.lang).profile_access
			);
		} catch (error) {
			return Response.serverErrorResponse(
				res,
				resp_messages(req.lang).internalServerError
			);
		}
	},

	categoryList: async (req, res) => {
		const token = req.headers["authorization"];
		let lang = req.headers.lang || "en";
		if (token) {
			const decoded = verifyToken(token);
			const user = await UserService.FindOneService({
				_id: decoded.userId,
			});
			const organizer = await organizerService.FindOneService({
				_id: decoded.userId,
			});
			const entity = user || organizer;
			lang = entity.language;
		}
		try {
			const { page = 1, limit = 100, search = "" } = req.query;

			const skip = (parseInt(page) - 1) * parseInt(limit);
			const count = await GroupCategoriesService.CountDocumentService({});

			const searchQuery = {
				[`name.${lang}`]: { $regex: search, $options: "i" },
			};

			console.log("Search Query:", searchQuery);

			const result = await GroupCategoriesService.AggregateService([
				{ $match: searchQuery },
				{
					$project: {
						name: `$name.${lang}`,
						selected_image: 1,
						unselected_image: 1,
						createdAt: 1,
						updatedAt: 1,
					},
				},
				{ $sort: { name: 1 } },
				{ $skip: skip },
				{ $limit: parseInt(limit) },
			]);

			return Response.ok(
				res,
				result,
				200,
				resp_messages(lang).fetched_data,
				count
			);
		} catch (error) {
			console.error("Error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages(lang).internalServerError
			);
		}
	},

	eventCategoryList: async (req, res) => {
		let lang = req.headers.lang || "en";
		const token = req.headers["authorization"];

		if (token) {
			try {
				const decoded = verifyToken(token);
				const user = await UserService.FindOneService({
					_id: decoded.userId,
				});
				const organizer = await organizerService.FindOneService({
					_id: decoded.userId,
				});
				const entity = user || organizer;
				if (entity && entity.language) {
					lang = entity.language;
				}
			} catch (tokenError) {
				console.log("[EVENT-CATEGORY-LIST] Token verification failed, using default language:", tokenError.message);
				// Continue with default language if token is invalid
			}
		}
		try {
			const { page = 1, limit = 100, search = "" } = req.query;

			console.log("[EVENT-CATEGORY-LIST] Request received:", { page, limit, search, lang });

			const skip = (parseInt(page) - 1) * parseInt(limit);
			
			// Build the match query - always exclude deleted categories
			const baseQuery = { is_delete: { $ne: 1 } }; // Only get non-deleted categories
			
			// Add search filter if search term is provided
			const searchQuery = search && search.trim() 
				? { 
					...baseQuery,
					[`name.${lang}`]: { $regex: search.trim(), $options: "i" } 
				}
				: baseQuery;

			const count = await EventCategoryService.CountDocumentService(searchQuery);
			console.log("[EVENT-CATEGORY-LIST] Total non-deleted categories in DB:", count);

			console.log("[EVENT-CATEGORY-LIST] Search Query:", JSON.stringify(searchQuery));

			const result = await EventCategoryService.AggregateService([
				{ $match: searchQuery },
				{
					$project: {
						_id: 1, // Explicitly include _id
						name: `$name.${lang}`,
						selected_image: 1,
						unselected_image: 1,
						createdAt: 1,
						updatedAt: 1,
					},
				},
				{ $sort: { name: 1 } },
				{ $skip: skip },
				{ $limit: parseInt(limit) },
			]);

			console.log("[EVENT-CATEGORY-LIST] Categories found:", result?.length || 0);
			console.log("[EVENT-CATEGORY-LIST] Sample category:", result?.[0] || "No categories");

			return Response.ok(
				res,
				result || [],
				200,
				resp_messages(req.lang || lang).fetched_data || "Categories fetched successfully",
				count
			);
		} catch (error) {
			console.error("[EVENT-CATEGORY-LIST] Error:", error);
			console.error("[EVENT-CATEGORY-LIST] Error stack:", error.stack);
			return Response.serverErrorResponse(
				res,
				error.message || resp_messages(req.lang || "en").internalServerError || "Internal server error"
			);
		}
	},

	// OTP sending removed - using email-based authentication only

	userLogout: async (req, res) => {
		const lang = req.headers["lang"] || req.lang || "en";
		try {
			const { userId } = req;

			const user = await organizerService.FindOneService({ _id: userId });

			if (!user) {
				return Response.notFoundResponse(
					res,
					resp_messages(lang).user_not_found || "User not found"
				);
			}

			return Response.ok(
				res,
				{},
				200,
				resp_messages(lang).logout || "Logout successful"
			);
		} catch (error) {
			return Response.serverErrorResponse(
				res,
				resp_messages(lang).internalServerError || "Internal server error"
			);
		}
	},

	addEvent: async (req, res) => {
		try {
			const { userId } = req;
			const { longitude, latitude, event_category } = req.body;
			
			console.log("[ADD-EVENT] Received event_category:", event_category, "Type:", typeof event_category, "IsArray:", Array.isArray(event_category));
			
			const organizer = await organizerService.FindOneService({
				_id: userId,
			});

			if (!organizer) {
				return Response.notFoundResponse(
					res,
					resp_messages(req.lang).user_not_found
				);
			}

			// Handle event_category - accept string categories from frontend (static categories)
			// Frontend sends static category strings like "cultural-traditional", "outdoor-adventure", etc.
			let categoryStrings = [];
			if (Array.isArray(event_category)) {
				// Validate all categories in array
				for (const cat of event_category) {
					if (typeof cat !== 'string' || !cat || cat.trim() === '') {
						return Response.validationErrorResponse(
							res,
							`Invalid event category: ${cat}. Please select valid categories.`
						);
					}
					categoryStrings.push(cat.trim());
				}
			} else if (typeof event_category === 'string') {
				// Single category
				if (!event_category || event_category.trim() === '') {
					return Response.validationErrorResponse(
						res,
						"Invalid event category. Please select a valid category."
					);
				}
				categoryStrings = [event_category.trim()];
			} else {
				return Response.validationErrorResponse(
					res,
					"Event category is required. Please select at least one category."
				);
			}

		req.body.organizer_id = userId;
		
		// Store event_types in database (array of strings: conference, workshop, etc.)
		// Ensure event_types is an array
		if (req.body.event_types) {
			req.body.event_types = Array.isArray(req.body.event_types) 
				? req.body.event_types 
				: [req.body.event_types];
		} else {
			req.body.event_types = [];
		}
		
		// Set event_category as primary (first) category for backward compatibility
		// Set event_categories as array for multi-select support
		if (categoryStrings.length > 0) {
			req.body.event_category = categoryStrings[0]; // Primary category (required by model)
			req.body.event_categories = categoryStrings; // All selected categories (array)
		} else {
			return Response.validationErrorResponse(
				res,
				"At least one event category is required."
			);
		}
		
		// Convert event_date to Date if it's a string
		if (req.body.event_date && typeof req.body.event_date === 'string') {
			req.body.event_date = new Date(req.body.event_date);
		}
		
		// Set event_image from event_images[0] if not already set (required by model)
		if (req.body.event_images && Array.isArray(req.body.event_images) && req.body.event_images.length > 0) {
			req.body.event_image = req.body.event_images[0];
		} else if (!req.body.event_image) {
			return Response.validationErrorResponse(
				res,
				"At least one event image is required."
			);
		}
		
		// Only set location if both longitude and latitude are provided
		if (longitude !== undefined && latitude !== undefined && longitude !== null && latitude !== null && longitude !== '' && latitude !== '') {
			req.body.location = {
				type: "Point",
				coordinates: [parseFloat(longitude), parseFloat(latitude)],
			};
		}

		// Ensure area_name and neighborhood are saved (area_name comes from frontend, neighborhood can also be set)
		if (req.body.area_name) {
			req.body.area_name = req.body.area_name.trim();
		}
		if (req.body.neighborhood) {
			req.body.neighborhood = req.body.neighborhood.trim();
		}

		// Validate event price - must be at least 1 SAR
		const eventPrice = Number(req.body.event_price);
		if (isNaN(eventPrice) || eventPrice < 1) {
			return Response.validationErrorResponse(
				res,
				"Event price must be at least 1 SAR. Events with price less than 1 SAR cannot be created."
			);
		}

		console.log("[ADD-EVENT] Creating event with payload:", JSON.stringify(req.body, null, 2));
		const event = await EventService.CreateService(req.body);

		// Requirement #19: Create notification for admin when new event is submitted
		try {
			// Get all admin users to create notifications for them
			const AdminService = require("../services/adminService.js");
			const admins = await AdminService.FindService({ is_delete: { $ne: 1 } });
			const lang = req.headers.lang || req.lang || organizer.language || "en";
			
			// Create notification for each admin (store both EN and AR for admin UI locale)
			for (const admin of admins) {
				await NotificationService.CreateService({
					user_id: admin._id,
					role: 3, // Admin role
					title: "New Event Submitted",
					title_ar: "حدث جديد تم إرساله",
					description: `A new event "${req.body.event_name}" has been submitted by ${organizer.first_name} ${organizer.last_name}`,
					description_ar: `تم إرسال حدث جديد "${req.body.event_name}" من قبل ${organizer.first_name} ${organizer.last_name}`,
					isRead: false,
					notification_type: 2, // Event type
					event_id: event._id,
					profile_image: organizer.profile_image || "",
					username: `${organizer.first_name} ${organizer.last_name}`,
					senderId: organizer._id,
				});
			}
		} catch (notificationError) {
			console.error("[ADD-EVENT] Error creating admin notification:", notificationError);
			// Don't fail the request if notification fails
		}

		return Response.ok(
			res,
			event,
			201,
			resp_messages(req.lang).eventAdded
		);
		} catch (error) {
			console.error("[ADD-EVENT] Error:", error);
			console.error("[ADD-EVENT] Error message:", error?.message);
			console.error("[ADD-EVENT] Error stack:", error?.stack);
			console.error("[ADD-EVENT] Request body:", JSON.stringify(req.body, null, 2));
			return Response.serverErrorResponse(
				res,
				error?.message || resp_messages(req.lang).internalServerError
			);
		}
	},

	updateEvent: async (req, res) => {
		try {
			const { userId } = req;
			const { longitude, latitude, event_id } = req.body;
			const organizer = await organizerService.FindOneService({
				_id: userId,
			});

			if (!organizer) {
				return Response.notFoundResponse(
					res,
					resp_messages(req.lang).user_not_found
				);
			}

			if (!mongoose.Types.ObjectId.isValid(event_id)) {
				return Response.badRequestResponse(
					res,
					resp_messages(req.lang).invalidEventId
				);
			}

		req.body.organizer_id = userId;
		
		// Handle event_category - accept string categories from frontend (static categories)
		// Frontend sends static category strings like "cultural-traditional", "outdoor-adventure", etc.
		const { event_category } = req.body;
		if (event_category !== undefined) {
			let categoryStrings = [];
			if (Array.isArray(event_category)) {
				// Validate all categories in array
				for (const cat of event_category) {
					if (typeof cat !== 'string' || !cat || cat.trim() === '') {
						return Response.validationErrorResponse(
							res,
							`Invalid event category: ${cat}. Please select valid categories.`
						);
					}
					categoryStrings.push(cat.trim());
				}
			} else if (typeof event_category === 'string') {
				// Single category
				if (!event_category || event_category.trim() === '') {
					return Response.validationErrorResponse(
						res,
						"Invalid event category. Please select a valid category."
					);
				}
				categoryStrings = [event_category.trim()];
			} else {
				return Response.validationErrorResponse(
					res,
					"Event category must be a string or array."
				);
			}
			
			// Set event_category as primary (first) category for backward compatibility
			// Set event_categories as array for multi-select support
			if (categoryStrings.length > 0) {
				req.body.event_category = categoryStrings[0]; // Primary category (required by model)
				req.body.event_categories = categoryStrings; // All selected categories (array)
			}
		}
		
		// Set event_image from event_images[0] if event_images is provided (required by model, validation happens before pre-save hook)
		if (req.body.event_images && Array.isArray(req.body.event_images) && req.body.event_images.length > 0) {
			req.body.event_image = req.body.event_images[0];
		}
		
		// Only set location if both longitude and latitude are provided
		if (longitude !== undefined && latitude !== undefined && longitude !== null && latitude !== null && longitude !== '' && latitude !== '') {
			req.body.location = {
				type: "Point",
				coordinates: [parseFloat(longitude), parseFloat(latitude)],
			};
		}

		// Ensure area_name and neighborhood are saved (area_name comes from frontend, neighborhood can also be set)
		if (req.body.area_name) {
			req.body.area_name = req.body.area_name.trim();
		}
		if (req.body.neighborhood) {
			req.body.neighborhood = req.body.neighborhood.trim();
		}

		const exist_event = await EventService.FindOneService({
			_id: event_id,
		});
		if (!exist_event) {
			return Response.notFoundResponse(
				res,
				resp_messages(req.lang).eventNotFound
			);
		}

		// Validate event price if provided - must be at least 1 SAR
		if (req.body.event_price !== undefined) {
			const eventPrice = Number(req.body.event_price);
			if (isNaN(eventPrice) || eventPrice < 1) {
				return Response.validationErrorResponse(
					res,
					"Event price must be at least 1 SAR. Events with price less than 1 SAR cannot be created."
				);
			}
		}

		const event = await EventService.FindByIdAndUpdateService(
			event_id,
			req.body
		);

		return Response.ok(
			res,
			event,
			200,
			resp_messages(req.lang).eventUpdated
		);
		} catch (error) {
			console.log(error.message);
			return Response.serverErrorResponse(
				res,
				resp_messages(req.lang).internalServerError
			);
		}
	},

	deleteEvent: async (req, res) => {
		try {
			const { userId } = req;
			const { event_id } = req.body;

			// Ensure organizer exists
			const organizer = await organizerService.FindOneService({ _id: userId });

			if (!organizer) {
				return Response.notFoundResponse(
					res,
					resp_messages(req.lang).user_not_found
				);
			}

			// Validate event_id
			if (!mongoose.Types.ObjectId.isValid(event_id)) {
				return Response.badRequestResponse(
					res,
					resp_messages(req.lang).invalidEventId
				);
			}

			// Only allow deletion for events that belong to this organizer
			// and meet safe-status rules:
			// - Host: can delete if event is NOT approved yet (is_approved !== 1),
			//   OR event date has already passed (completed), OR event is cancelled.
			const event = await EventService.FindOneService({
				_id: event_id,
				organizer_id: userId,
			});

			if (!event) {
				return Response.notFoundResponse(
					res,
					resp_messages(req.lang).eventNotFound
				);
			}

			// Determine if event date is in the past (completed)
			const now = new Date();
			const eventDate = new Date(event.event_date);
			const isCompleted = !isNaN(eventDate.getTime()) && eventDate < now;

			// is_approved: 0=pending,1=approved,2=rejected
			const isPending = event.is_approved === 0;
			const isRejected = event.is_approved === 2;

			// For hosts we consider "cancelled" via isActive = 2 OR is_cancelled = true OR event_status = 'cancelled'
			const isCancelled = event.isActive === 2 || event.is_cancelled === true || event.event_status === 'cancelled';

			if (!isPending && !isRejected && !isCancelled && !isCompleted) {
				// Still an active/approved upcoming event – don't allow hard delete
				// Provide specific message based on event status
				let errorMessage;
				if (event.is_approved === 1) {
					// Event is approved and upcoming
					errorMessage = resp_messages(req.lang).cannotDeleteApprovedEvent || 
						"Cannot delete approved upcoming event. Please cancel the event first if you need to remove it.";
				} else {
					// Other active status
					errorMessage = resp_messages(req.lang).onlyPendingRejectedCancelledCompletedCanBeDeleted || 
						"Only pending, rejected, cancelled or completed events can be deleted.";
				}
				return Response.badRequestResponse(res, errorMessage);
			}

			// Soft delete: mark is_delete = 1 instead of removing document
			console.log(`[DELETE-EVENT] Attempting soft delete for event: ${event_id}`);
			console.log(`[DELETE-EVENT] Event status: is_cancelled=${event.is_cancelled}, event_status=${event.event_status}, isActive=${event.isActive}`);
			
			const updated = await EventService.FindByIdAndUpdateService(event_id, {
				is_delete: 1,
			});
			
			if (updated) {
				console.log(`[DELETE-EVENT] Successfully soft deleted event: ${event_id}, is_delete=${updated.is_delete}`);
			} else {
				console.log(`[DELETE-EVENT] WARNING: FindByIdAndUpdateService returned null/undefined for event: ${event_id}`);
			}

			return Response.ok(
				res,
				{ _id: event_id, is_delete: 1, deleted: true },
				200,
				resp_messages(req.lang).eventDeleted
			);
		} catch (error) {
			return Response.serverErrorResponse(
				res,
				resp_messages(req.lang).internalServerError
			);
		}
	},

	eventDetail: async (req, res) => {
		try {
			const { userId } = req;
			const { event_id } = req.query;

			if (!mongoose.Types.ObjectId.isValid(userId)) {
				return Response.badRequestResponse(res, "Invalid organizer ID");
			}

			const organizer = await organizerService.FindOneService({
				_id: userId,
			});
			if (!organizer) {
				return Response.notFoundResponse(
					res,
					resp_messages(req.lang).user_not_found
				);
			}

			if (!mongoose.Types.ObjectId.isValid(event_id)) {
				return Response.badRequestResponse(
					res,
					resp_messages(req.lang).id_required
				);
			}

			const exist_event = await EventService.AggregateService([
				{
					$match: { _id: new mongoose.Types.ObjectId(event_id) },
				},
				{
					$project: {
						_id: 1,
						organizer_id: 1,
						event_date: 1,
						event_start_time: 1,
						event_end_time: 1,
						event_name: 1,
						event_image: 1,
						event_description: 1,
						event_address: 1,
						latitude: {
							$arrayElemAt: ["$location.coordinates", 1],
						},
						longitude: {
							$arrayElemAt: ["$location.coordinates", 0],
						},
						no_of_attendees: 1,
						event_price: 1,
						dos_instruction: 1,
						do_not_instruction: 1,
						event_type: 1,
						createdAt: 1,
						updatedAt: 1,
						group_category: 1,
						event_category: 1,
						event_for: 1,
						// Cancellation fields
						is_cancelled: 1,
						event_status: 1,
						cancelled_at: 1,
						cancelled_reason: 1,
						cancelled_by: 1,
						isActive: 1,
						is_approved: 1,
					},
				},
			]);

			if (!exist_event || exist_event.length === 0) {
				return Response.notFoundResponse(
					res,
					resp_messages(req.lang).eventNotFound
				);
			}

			return Response.ok(
				res,
				exist_event[0],
				200,
				resp_messages(req.lang).fetched_data
			);
		} catch (error) {
			console.log(error);
			return Response.serverErrorResponse(
				res,
				resp_messages(req.lang).internalServerError
			);
		}
	},

	eventList: async (req, res) => {
		try {
			const { userId } = req;

			const {
				page = 1,
				limit = 10,
				event_type = 1,
				search = "",
				event_date,
				status,
			} = req.query;
			const skip = (parseInt(page) - 1) * parseInt(limit);

			const searchQuery = {
				$and: [
					{ organizer_id: new mongoose.Types.ObjectId(userId) },
					{ is_delete: { $ne: 1 } }, // Exclude soft deleted events
					// { event_type: Number(event_type) }, // Removed event_type filter dependency for status
				],
			};
			if (status !== undefined) {
				searchQuery.$and.push({ is_approved: Number(status) });
			}
			if (event_date) {
				const date = new Date(event_date);
				searchQuery.event_date = {
					$lt: new Date(date.setHours(23, 59, 59, 999)),
				};
			}
			const results = await EventService.AggregateService([
				{ $match: searchQuery },
				{
					$project: {
						location: 0,
						no_of_attendees: 0,
						dos_instruction: 0,
						do_not_instruction: 0,
						event_description: 0,
						organizer_id: 0,
					},
				},
				{ $sort: { createdAt: -1 } },
				{ $skip: skip },
				{ $limit: parseInt(limit) },
			]);
			const count = await EventService.CountDocumentService({
				organizer_id: userId,
				event_type: Number(event_type),
				is_delete: { $ne: 1 }, // Exclude soft deleted events from count
			});
			return Response.ok(
				res,
				results,
				200,
				resp_messages(req.lang).fetched_data,
				count
			);
		} catch (error) {
			console.log(error);
			return Response.serverErrorResponse(
				res,
				resp_messages(req.lang).internalServerError
			);
		}
	},

	bookingList: async (req, res) => {
		try {
			const { userId } = req;
			const {
				page = 1,
				limit = 10,
				search = "",
				book_status,
				booking_date,
			} = req.query;
			const skip = (parseInt(page) - 1) * parseInt(limit);
			const startOfTodayUTC = new Date(
				Date.UTC(
					new Date().getUTCFullYear(),
					new Date().getUTCMonth(),
					new Date().getUTCDate()
				)
			);
			// Build match query - show all bookings regardless of payment status
			// Filter by book_status only, not payment_status
			const matchQuery = {
				organizer_id: new mongoose.Types.ObjectId(userId),
				"eventDetails.event_name": { $regex: search, $options: "i" },
			};

			// Add book_status filter if provided
			// book_status: 0/1 = Pending, 2 = Approved/Confirmed, 3 = Cancelled (by guest), 4 = Rejected (by host)
			if (book_status !== undefined && book_status !== null && book_status !== "") {
				if (book_status == "0") {
					// Pending bookings (status 0 or 1)
					matchQuery.$and = [
						{ book_status: { $in: [0, 1] } }
					];
				} else if (book_status == "1") {
					// Pending bookings (status 0 or 1) - same as 0
					matchQuery.$and = [
						{ book_status: { $in: [0, 1] } }
					];
				} else if (book_status == "2") {
					// Approved/Confirmed bookings
					matchQuery.$and = [
						{ book_status: Number(book_status) }
					];
				} else if (book_status == "3") {
					// Cancelled bookings (by guest)
					matchQuery.$and = [
						{ book_status: Number(book_status) }
					];
				} else if (book_status == "4") {
					// Rejected bookings (by host)
					matchQuery.$and = [
						{ book_status: Number(book_status) }
					];
				}
			}

			// Add booking date filter if provided
			if (booking_date) {
				if (!matchQuery.$and) {
					matchQuery.$and = [];
				}
				matchQuery.$and.push({
					$expr: {
						$eq: [
							{
								$dateFromParts: {
									year: { $year: "$createdAt" },
									month: { $month: "$createdAt" },
									day: { $dayOfMonth: "$createdAt" },
								},
							},
							{
								$dateFromParts: {
									year: { $year: new Date(booking_date) },
									month: { $month: new Date(booking_date) },
									day: { $dayOfMonth: new Date(booking_date) },
								},
							},
						],
					},
				});
			}

			// Add event date filter for pending bookings (only future events)
			// Don't apply date filter for cancelled (3) or rejected (4) bookings - show all regardless of event date
			const eventDateFilter = 
				(book_status === "0" || book_status === "1" || book_status === "")
					? {
						"$eventDetails.event_date": {
							$gte: startOfTodayUTC,
						},
					}
					: {}; // No date filter for approved (2), cancelled (3), or rejected (4) bookings

			const total_count = await BookEvent.aggregate([
				{
					$lookup: {
						from: "events",
						localField: "event_id",
						foreignField: "_id",
						as: "eventDetails",
					},
				},
				{ $unwind: "$eventDetails" },

				{ $match: matchQuery },
				...(Object.keys(eventDateFilter).length > 0
					? [
						{
							$match: eventDateFilter,
						},
					]
					: []),
				{ $count: "total_count" },
			]);

			const event = await BookEvent.aggregate([
				{
					$lookup: {
						from: "events",
						localField: "event_id",
						foreignField: "_id",
						as: "eventDetails",
					},
				},
				{
					$lookup: {
						from: "users",
						localField: "user_id",
						foreignField: "_id",
						as: "user",
					},
				},
				{ $unwind: "$eventDetails" },
				{ $unwind: "$user" },
				{ $match: matchQuery },
				...(Object.keys(eventDateFilter).length > 0
					? [
						{
							$match: eventDateFilter,
						},
					]
					: []),
				{
					$project: {
						_id: 1,
						payment_status: 1,
						createdAt: 1,
						book_status: 1,
						rejection_reason: 1,
						event_id: 1,
						no_of_attendees: 1,
						total_amount: 1,
						event_date: "$eventDetails.event_date",
						event_start_time: "$eventDetails.event_start_time",
						event_end_time: "$eventDetails.event_end_time",
						event_name: "$eventDetails.event_name",
						event_image: "$eventDetails.event_image",
						event_description: "$eventDetails.event_description",
						event_address: "$eventDetails.event_address",
						event_price: "$eventDetails.event_price",
						event_type: "$eventDetails.event_type",
						user_profile_image: "$user.profile_image",
						user_first_name: "$user.first_name",
						user_last_name: "$user.last_name",
						user_email: "$user.email",
						userDetail: {
							profile_image: "$user.profile_image",
							first_name: "$user.first_name",
							last_name: "$user.last_name",
							nationality: "$user.nationality",
							date_of_birth: "$user.date_of_birth",
							email: "$user.email",
						},
					},
				},
				{ $sort: { createdAt: -1 } },
				{ $skip: skip },
				{ $limit: parseInt(limit) },
			]);

			// Remove duplicates based on booking _id (in case of any data inconsistency)
			const seenIds = new Set();
			const uniqueEvents = event.filter((booking) => {
				const bookingId = booking._id?.toString();
				if (!bookingId) return false;
				if (seenIds.has(bookingId)) {
					console.warn(`[DUPLICATE] Found duplicate booking ID in organizer booking list: ${bookingId}`);
					return false;
				}
				seenIds.add(bookingId);
				return true;
			});

			// Also remove duplicates based on user_id + event_id + createdAt (within 5 seconds)
			const seenKeys = new Set();
			const finalEvents = uniqueEvents.filter((booking) => {
				const userId = booking.user_id?.toString() || booking.user?._id?.toString();
				const eventId = booking.event_id?.toString();
				const createdAt = booking.createdAt ? new Date(booking.createdAt).getTime() : 0;
				
				if (!userId || !eventId) return true; // Keep if missing critical data
				
				// Create a key based on user + event + time window (5 seconds)
				const timeWindow = Math.floor(createdAt / 5000) * 5000;
				const bookingKey = `${userId}_${eventId}_${timeWindow}`;
				
				if (seenKeys.has(bookingKey)) {
					console.warn(`[DUPLICATE] Found duplicate booking: User ${userId}, Event ${eventId}, Time ${timeWindow}`);
					return false;
				}
				
				seenKeys.add(bookingKey);
				return true;
			});

			const totalDocuments =
				total_count.length > 0 ? total_count[0].total_count : 0;

			return Response.ok(
				res,
				finalEvents,
				200,
				resp_messages(req.lang).fetched_data,
				finalEvents.length // Use deduplicated count
			);
		} catch (error) {
			console.log(error.message);
			return Response.serverErrorResponse(
				res,
				resp_messages(req.lang).internalServerError
			);
		}
	},
	changeBookingStatus: async (req, res) => {
		try {
			const { book_id, book_status, rejection_reason } = req.body;

			const organizer = await organizerService.FindOneService({
				_id: req.userId,
			});
			if (!organizer) {
				return Response.notFoundResponse(
					res,
					resp_messages(req.lang).user_not_found
				);
			}

			const booked_event = await BookEventService.FindOneService({
				_id: book_id,
			});
			if (!booked_event) {
				return Response.notFoundResponse(
					res,
					resp_messages(req.lang).bookingNotFound
				);
			}

			const event = await EventService.FindOneService({
				_id: booked_event.event_id,
			});
			if (!event) {
				return Response.notFoundResponse(
					res,
					resp_messages(req.lang).eventNotFound
				);
			}

			// Validate rejection reason if rejecting
			if (book_status === 3 && (!rejection_reason || rejection_reason.trim().length < 10)) {
				return Response.badRequestResponse(
					res,
					resp_messages(req.lang).rejection_reason_required || "Rejection reason is required (minimum 10 characters)"
				);
			}

			booked_event.book_status = book_status;
			
			// Store rejection reason if provided
			if (book_status === 3 && rejection_reason) {
				booked_event.rejection_reason = rejection_reason.trim();
			} else if (book_status !== 3) {
				// Clear rejection reason if accepting
				booked_event.rejection_reason = null;
			}
			
			// Store confirmation timestamp when booking is confirmed (status = 2)
			if (book_status === 2) {
				booked_event.confirmed_at = new Date();
				// Set hold expiration (30 minutes from now)
				booked_event.hold_expires_at = new Date(Date.now() + 30 * 60 * 1000);
			}

			await booked_event.save();

			// Get guest user for notifications
			const guest = await UserService.FindOneService({ _id: booked_event.user_id });

			if (book_status === 2) {
				// Booking accepted - send "Accepted → Pay Now" notification
				try {
					// Calculate remaining seats
					const bookedSeatsResult = await BookEventService.AggregateService([
						{
							$match: {
								event_id: new mongoose.Types.ObjectId(event._id),
								book_status: { $in: [1, 2] },
								_id: { $ne: booked_event._id }
							},
						},
						{
							$group: {
								_id: null,
								totalBooked: { $sum: "$no_of_attendees" },
							},
						},
					]);
					const totalBookedSeats = bookedSeatsResult.length > 0 ? (bookedSeatsResult[0].totalBooked || 0) : 0;
					const remainingSeats = Math.max(0, event.no_of_attendees - totalBookedSeats);

					await notificationHelper.sendGuestAcceptedPayNow({
						host_first_name: organizer.first_name,
						host_id: organizer._id,
						experience_title: event.event_name,
						event_name: event.event_name,
						tickets_count: booked_event.no_of_attendees,
						no_of_attendees: booked_event.no_of_attendees,
						start_at: event.event_date || event.start_date,
						event_date: event.event_date || event.start_date,
						hold_expires_at: booked_event.hold_expires_at,
						total_amount: booked_event.total_amount,
						price_total: booked_event.total_amount,
						currency: 'SAR',
						remaining_seats: remainingSeats,
						book_id: booked_event._id,
						booking_id: booked_event._id,
						event_id: event._id
					}, guest, 'A'); // Use variant A (scarcity) by default
				} catch (notifError) {
					console.error('[NOTIFICATION] Error sending accepted pay now notification:', notifError);
					// Fallback to old notification method
					const notificationTitle = req.lang === "ar" ? "تم قبول طلبك" : "Booking Accepted";
					const notificationDescription = req.lang === "ar"
						? `تم قبول طلبك لحجز "${event.event_name}". يمكنك الآن المتابعة للدفع.`
						: `Your booking request for "${event.event_name}" has been accepted by the host. You can now proceed with payment.`;
					
					const notification_data = {
						title: notificationTitle,
						description: notificationDescription,
						event_id: event._id,
						event_type: event.event_type,
						event_name: event.event_name,
						userId: organizer._id,
						book_id: booked_event._id,
						notification_type: 2,
						status: book_status,
						first_name: organizer.first_name,
						last_name: organizer.last_name,
						profile_image: organizer.profile_image,
					};
					await sendEventBookingAcceptNotification(res, booked_event.user_id, notification_data);
				}
			} else if (book_status === 3 || book_status === 4) {
				// Booking rejected - use old notification method for now
				const notificationTitle = req.lang === "ar" ? "تم رفض طلبك" : "Booking Rejected";
				let notificationDescription = req.lang === "ar"
					? `تم رفض طلبك لحجز "${event.event_name}". لا يمكنك حجز هذا الحدث.`
					: `Your booking request for "${event.event_name}" has been rejected by the host. You cannot book this event.`;
				
				if (rejection_reason) {
					notificationDescription += req.lang === "ar"
						? ` السبب: ${rejection_reason}`
						: ` Reason: ${rejection_reason}`;
				}
				
				const notification_data = {
					title: notificationTitle,
					description: notificationDescription,
					event_id: event._id,
					event_type: event.event_type,
					event_name: event.event_name,
					userId: organizer._id,
					book_id: booked_event._id,
					notification_type: 3,
					status: book_status,
					first_name: organizer.first_name,
					last_name: organizer.last_name,
					profile_image: organizer.profile_image,
					rejection_reason: rejection_reason,
				};
				await sendEventBookingAcceptNotification(res, booked_event.user_id, notification_data);
			}

			// Create in-app notification for the guest (always create for consistency)
			try {
				const notificationTitle = book_status === 2
					? (req.lang === "ar" ? "تم قبول طلبك" : "Booking Accepted")
					: (req.lang === "ar" ? "تم رفض طلبك" : "Booking Rejected");
				
				let notificationDescription = "";
				if (book_status === 2) {
					notificationDescription = req.lang === "ar"
						? `تم قبول طلبك لحجز "${event.event_name}". يمكنك الآن المتابعة للدفع.`
						: `Your booking request for "${event.event_name}" has been accepted by the host. You can now proceed with payment.`;
				} else if (book_status === 3 || book_status === 4) {
					notificationDescription = req.lang === "ar"
						? `تم رفض طلبك لحجز "${event.event_name}". لا يمكنك حجز هذا الحدث.`
						: `Your booking request for "${event.event_name}" has been rejected by the host. You cannot book this event.`;
					if (rejection_reason) {
						notificationDescription += req.lang === "ar"
							? ` السبب: ${rejection_reason}`
							: ` Reason: ${rejection_reason}`;
					}
				}

				await NotificationService.CreateService({
					user_id: booked_event.user_id,
					role: 1, // User/Guest role
					title: notificationTitle,
					description: notificationDescription,
					isRead: false,
					notification_type: book_status == 2 ? 2 : 3,
					event_id: event._id,
					book_id: booked_event._id,
					status: book_status,
					profile_image: organizer.profile_image || "",
					username: `${organizer.first_name} ${organizer.last_name}`,
					senderId: organizer._id,
				});
				console.log(`[NOTIFICATION] Created in-app notification for user ${booked_event.user_id} - Status: ${book_status === 2 ? 'Accepted' : 'Rejected'}`);
			} catch (notificationError) {
				console.error('[NOTIFICATION] Error creating in-app notification:', notificationError);
				// Don't fail the request if notification fails
			}
			
			// If rejected, ensure the booking is properly marked and removed from active bookings
			if (book_status === 3 || book_status === 4) {
				console.log(`[BOOKING-REJECTED] Booking ${booked_event._id} rejected - Guest will not see this in active bookings`);
			}

			// NOTE: Guest will be added to group chat ONLY after payment is completed
			// When booking is accepted (status 2), guest can now proceed to payment
			// Group chat addition happens in updatePaymentStatus after payment is successful
			if (book_status === 2) {
				console.log(`[BOOKING-APPROVED] Booking ${booked_event._id} approved. Guest can now proceed to payment. Group chat will be added after payment.`);
			}

			return Response.ok(
				res,
				booked_event,
				200,
				resp_messages(req.lang).bookingStatusUpdated
			);
		} catch (error) {
			console.log(error.message);
			return Response.serverErrorResponse(
				res,
				resp_messages(req.lang).internalServerError
			);
		}
	},

	bookingDetails: async (req, res) => {
		try {
			const { book_id } = req.query;
			const event = await BookEventService.AggregateService([
				{ $match: { _id: new mongoose.Types.ObjectId(book_id) } },
				{
					$lookup: {
						from: "users",
						localField: "user_id",
						foreignField: "_id",
						as: "userDetail",
					},
				},
				{
					$lookup: {
						from: "events",
						localField: "event_id",
						foreignField: "_id",
						as: "event",
					},
				},
				{ $unwind: "$userDetail" },
				{ $unwind: "$event" },
					{
					$project: {
						userDetail: {
							profile_image: 1,
							first_name: 1,
							last_name: 1,
							country_code: 1,
							phone_number: 1,
							email: 1,
						},
						event_name: "$event.event_name",
						event_image: "$event.event_image",
						event_date: "$event.event_date",
						event_start_time: "$event.event_start_time",
						event_end_time: "$event.event_end_time",
						event_description: "$event.event_description",
						event_address: "$event.event_address",
						event_price: "$event.event_price",
						event_type: "$event.event_type",
						book_details: {
							_id: "$_id",
							event_id: "$event_id",
							no_of_attendees: "$no_of_attendees",
							total_amount_attendees: "$total_amount",
							total_tax_attendees: "$total_tax_attendees",
							total_amount: "$total_amount",
							book_status: "$book_status",
							createdAt: "$createdAt",
							updatedAt: "$updatedAt",
							payment_status: "$payment_status",
							rejection_reason: "$rejection_reason",
						},
					},
				},
			]);
			if (!event) {
				return Response.notFoundResponse(
					res,
					resp_messages(req.lang).eventNotFound
				);
			}
			return Response.ok(
				res,
				event[0],
				200,
				resp_messages(req.lang).fetched_data
			);
		} catch (error) {
			return Response.serverErrorResponse(
				res,
				resp_messages(req.lang).internalServerError
			);
		}
	},

	eventAnalytics: async (req, res) => {
		try {
			const { event_id } = req.query;
			const { userId } = req;

			if (!event_id || !mongoose.Types.ObjectId.isValid(event_id)) {
				return Response.badRequestResponse(
					res,
					resp_messages(req.lang).id_required || "Event ID is required"
				);
			}

			// Get event details
			const event = await EventService.FindOneService({ _id: event_id });
			if (!event) {
				return Response.notFoundResponse(
					res,
					resp_messages(req.lang).eventNotFound
				);
			}

			// Verify event belongs to this organizer
			if (event.organizer_id.toString() !== userId.toString()) {
				return Response.unauthorizedResponse(
					res,
					resp_messages(req.lang).unauthorized || "Unauthorized"
				);
			}

			// Get all bookings for this event with user details
			const bookings = await BookEventService.AggregateService([
				{
					$match: {
						event_id: new mongoose.Types.ObjectId(event_id)
					}
				},
				{
					$lookup: {
						from: "users",
						localField: "user_id",
						foreignField: "_id",
						as: "userDetail"
					}
				},
				{ $unwind: "$userDetail" },
				{
					$project: {
						_id: 1,
						book_status: 1,
						payment_status: 1,
						no_of_attendees: 1,
						total_amount: 1,
						rejection_reason: 1,
						order_id: 1,
						createdAt: 1,
						updatedAt: 1,
						userDetail: {
							_id: "$userDetail._id",
							first_name: "$userDetail.first_name",
							last_name: "$userDetail.last_name",
							profile_image: "$userDetail.profile_image",
							email: "$userDetail.email",
							phone_number: "$userDetail.phone_number",
							country_code: "$userDetail.country_code",
							nationality: "$userDetail.nationality",
							date_of_birth: "$userDetail.date_of_birth",
							createdAt: "$userDetail.createdAt"
						}
					}
				},
				{ $sort: { createdAt: -1 } }
			]);

			// Calculate statistics
			const stats = {
				total_bookings: bookings.length,
				pending: bookings.filter(b => b.book_status === 0 || b.book_status === 1).length,
				approved: bookings.filter(b => b.book_status === 2).length,
				rejected: bookings.filter(b => b.book_status === 3).length,
				paid: bookings.filter(b => b.payment_status === 1).length,
				unpaid: bookings.filter(b => b.payment_status === 0).length,
				total_attendees: bookings.reduce((sum, b) => sum + (b.no_of_attendees || 0), 0),
				total_revenue: bookings
					.filter(b => b.payment_status === 1)
					.reduce((sum, b) => sum + (b.total_amount || 0), 0),
				pending_revenue: bookings
					.filter(b => b.payment_status === 0 && (b.book_status === 2))
					.reduce((sum, b) => sum + (b.total_amount || 0), 0)
			};

			return Response.ok(
				res,
				{
					event: {
						_id: event._id,
						event_name: event.event_name,
						event_image: event.event_image,
						event_date: event.event_date,
						event_start_time: event.event_start_time,
						event_end_time: event.event_end_time,
						event_address: event.event_address,
						event_price: event.event_price,
						event_type: event.event_type,
						no_of_attendees: event.no_of_attendees
					},
					bookings: bookings,
					statistics: stats
				},
				200,
				resp_messages(req.lang).fetched_data
			);
		} catch (error) {
			console.error("[EVENT-ANALYTICS] Error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages(req.lang).internalServerError
			);
		}
	},

	reviewList: async (req, res) => {
		try {
			const { event_id } = req.query;
			const { userId } = req;

			console.log(userId);

			const { page = 1, limit = 10 } = req.query;
			const skip = (parseInt(page) - 1) * parseInt(limit);

			const event_review = await ReviewService.AggregateService([
				{
					$lookup: {
						from: "users",
						localField: "user_id",
						foreignField: "_id",
						as: "user",
					},
				},
				{
					$lookup: {
						from: "events",
						localField: "event_id",
						foreignField: "_id",
						as: "event",
					},
				},
				{
					$match: {
						"event.organizer_id": new mongoose.Types.ObjectId(
							userId
						),
					},
				},
				{
					$unwind: "$user",
				},
				{
					$project: {
						profile_image: "$user.profile_image",
						first_name: "$user.first_name",
						last_name: "$user.last_name",
						description: 1,
						rating: 1,
						createdAt: 1,
					},
				},
				{ $sort: { createdAt: -1 } },
				{ $skip: skip },
				{ $limit: parseInt(limit) },
			]);

			const ratingAggregation = await ReviewService.AggregateService([
				{
					$lookup: {
						from: "events",
						localField: "event_id",
						foreignField: "_id",
						as: "event",
					},
				},
				{
					$match: {
						"event.organizer_id": new mongoose.Types.ObjectId(
							userId
						),
					},
				},
				{
					$group: {
						_id: null,
						avg_rating: { $avg: "$rating" },
						total_count: { $sum: 1 },
						count_5: {
							$sum: {
								$cond: [
									{ $eq: [{ $round: "$rating" }, 5] },
									1,
									0,
								],
							},
						},
						count_4: {
							$sum: {
								$cond: [
									{ $eq: [{ $round: "$rating" }, 4] },
									1,
									0,
								],
							},
						},
						count_3: {
							$sum: {
								$cond: [
									{ $eq: [{ $round: "$rating" }, 3] },
									1,
									0,
								],
							},
						},
						count_2: {
							$sum: {
								$cond: [
									{ $eq: [{ $round: "$rating" }, 2] },
									1,
									0,
								],
							},
						},
						count_1: {
							$sum: {
								$cond: [
									{ $eq: [{ $round: "$rating" }, 1] },
									1,
									0,
								],
							},
						},
					},
				},
				{
					$project: {
						_id: 0,
						total_count: 1,
						avg_rating: { $round: ["$avg_rating", 1] },
						count_5: 1,
						count_4: 1,
						count_3: 1,
						count_2: 1,
						count_1: 1,
					},
				},
			]);
			const averageRating =
				ratingAggregation.length > 0 ? ratingAggregation[0] : 0;

			const count = await ReviewService.CountDocumentService({
				event_id: event_id,
			});

			const reviews = {};
			reviews.ratings = averageRating;
			reviews.reviews = event_review;

			return Response.ok(
				res,
				reviews,
				200,
				resp_messages(req.lang).fetched_data,
				count
			);
		} catch (error) {
			console.log(error.message);
			return Response.serverErrorResponse(
				res,
				resp_messages(req.lang).internalServerError
			);
		}
	},

	earningList: async (req, res) => {
		try {
		const { userId, lang = "en" } = req;
		const { filter = "m", page = 1, limit = 10 } = req.query;
		const skip = (Number(page) - 1) * Number(limit);

		const wallet = await WalletService.FindOneService({
			organizer_id: userId,
		});
		const total_amount = wallet?.total_amount || 0;

			const transactions = await TransactionService.AggregateService([
				{
					$match: {
						$and: [
							{
								organizer_id: new mongoose.Types.ObjectId(
									userId
								),
							},
							{ type: 1 },
						],
					},
				},
				{
					$lookup: {
						from: "users",
						localField: "user_id",
						foreignField: "_id",
						as: "user",
					},
				},
				{
					$unwind: {
						path: "$user",
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$project: {
						total_amount: "$amount",
						first_name: "$user.first_name",
						last_name: "$user.last_name",
						profile_image: "$user.profile_image",
						userId: 1,
						createdAt: 1,
					},
				},
				{ $sort: { createdAt: -1 } },
				{ $skip: skip },
				{ $limit: Number(limit) },
			]);

			let graph_data = [];
			if (filter === "d") {
				const daysOfWeek =
					lang === "ar"
						? ["أحد", "اثن", "ثلا", "أرب", "خم", "جمع", "سبت"]
						: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
				const todayIndex = moment().day();

				const ddd = moment()
					.subtract(6, "days")
					.startOf("day")
					.toDate();
				const bbb = moment().endOf("day").toDate();
				const earningsData = await TransactionService.AggregateService([
					{
						$match: {
							organizer_id: new mongoose.Types.ObjectId(userId),
							createdAt: {
								$gte: ddd,
								$lte: bbb,
							},
							type: 1,
						},
					},
					{
						$group: {
							_id: { $dayOfWeek: "$createdAt" },
							total_earning: { $sum: "$amount" },
						},
					},
					{
						$project: {
							labelIndex: {
								$mod: [{ $subtract: ["$_id", 1] }, 7],
							},
							total_earning: 1,
						},
					},
				]);

				const earningsMap = Array(7).fill(0);
				earningsData.forEach((item) => {
					earningsMap[item.labelIndex] = item.total_earning;
				});

				graph_data = daysOfWeek.map((day, index) => ({
					label: day,
					total_earning: earningsMap[index] || 0,
				}));

				graph_data = [
					...graph_data.slice(todayIndex + 1),
					...graph_data.slice(0, todayIndex + 1),
				];
			} else if (filter === "w") {
				const week_label = lang === "ar" ? "أسبوع" : "Week";
				const ddd = moment().startOf("month").toDate();
				const bbb = moment().endOf("month").toDate();
				const earningsData = await TransactionService.AggregateService([
					{
						$match: {
							organizer_id: new mongoose.Types.ObjectId(userId),
							createdAt: {
								$gte: ddd,
								$lte: bbb,
							},
							type: 1,
						},
					},
					{
						$group: {
							_id: {
								$floor: {
									$divide: [{ $dayOfMonth: "$createdAt" }, 7],
								},
							},
							total_earning: { $sum: "$amount" },
						},
					},
					{
						$project: {
							label: "$_id",
							total_earning: 1,
						},
					},
				]);

				graph_data = Array.from({ length: 4 }, (_, index) => {
					const weekData = earningsData.find(
						(item) => item.label === index
					);
					return {
						label: `${week_label} ${index + 1}`,
						total_earning: weekData ? weekData.total_earning : 0,
					};
				});
			} else if (filter === "m") {
				const months =
					lang === "ar"
						? [
							"مح",
							"صف",
							"رب١",
							"رب٢",
							"جم١",
							"جم٢",
							"رجب",
							"شعب",
							"رمض",
							"شوا",
							"ذق",
							"ذح",
						]
						: [
							"JAN",
							"FEB",
							"MAR",
							"APR",
							"MAY",
							"JUN",
							"JUL",
							"AUG",
							"SEP",
							"OCT",
							"NOV",
							"DEC",
						];
				const ddd = moment().startOf("year").toDate();
				const bbb = moment().endOf("year").toDate();
				const earningsData = await TransactionService.AggregateService([
					{
						$match: {
							organizer_id: new mongoose.Types.ObjectId(userId),
							createdAt: {
								$gte: ddd,
								$lte: bbb,
							},
							type: 1,
						},
					},
					{
						$group: {
							_id: { $month: "$createdAt" },
							total_earning: { $sum: "$amount" },
						},
					},
					{
						$project: {
							label: "$_id",
							total_earning: 1,
						},
					},
				]);

				graph_data = months.map((month, index) => {
					const monthData = earningsData.find(
						(item) => item.label === index + 1
					);
					return {
						label: month,
						total_earning: monthData ? monthData.total_earning : 0,
					};
				});
			}
			const total_attendees = await BookEventService.AggregateService([
				{
					$match: {
						organizer_id: new mongoose.Types.ObjectId(userId),
					},
				},
			]);
			let total_attendee = 0;

			if (total_attendees && Array.isArray(total_attendees)) {
				total_attendees.forEach((attendee) => {
					total_attendee += attendee?.no_of_attendees || 0;
				});
			}

			const current_month_attendees =
				await BookEventService.AggregateService([
					{
						$match: {
							organizer_id: new mongoose.Types.ObjectId(userId),
							createdAt: {
								$gte: new Date(new Date().setDate(1)),
								$lt: new Date(
									new Date(
										new Date().setMonth(
											new Date().getMonth() + 1
										)
									).setDate(0)
								),
							},
						},
					},
					{
						$group: {
							_id: { $month: "$createdAt" },
							totalAttendees: { $sum: 1 },
						},
					},
				]);

			const previousMonthStart = new Date();
			previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
			previousMonthStart.setDate(1);

			const previousMonthEnd = new Date(previousMonthStart);
			previousMonthEnd.setMonth(previousMonthEnd.getMonth() + 1);
			previousMonthEnd.setDate(0);

			const previous_month_attendees =
				await BookEventService.AggregateService([
					{
						$match: {
							organizer_id: new mongoose.Types.ObjectId(userId),
							createdAt: {
								$gte: previousMonthStart,
								$lt: previousMonthEnd,
							},
						},
					},
					{
						$group: {
							_id: { $month: "$createdAt" },
							totalAttendees: { $sum: 1 },
						},
					},
				]);

			let percentageChange = 0;
			let is_increased = 0;
			if (
				previous_month_attendees[0] &&
				previous_month_attendees[0].totalAttendees
			) {
				let previousMonthTotal =
					previous_month_attendees[0].totalAttendees;
				const currentMonthTotal = current_month_attendees[0]
					? current_month_attendees[0].totalAttendees
					: 0;

				if (previousMonthTotal >= 0) {
					percentageChange =
						((currentMonthTotal - previousMonthTotal) /
							previousMonthTotal) *
						100;

					if (currentMonthTotal > previousMonthTotal) {
						is_increased = 1;
					}
				}
			}
			if (percentageChange == 0) {
				percentageChange = 100;
				is_increased = 1;
			}
			const result = {
				previousMonthAttendees:
					previous_month_attendees[0]?.totalAttendees || 0,
				currentMonthAttendees:
					current_month_attendees[0]?.totalAttendees || 0,
				percentageChange: percentageChange.toFixed(0),
			};

			const current_month_percentage = Math.abs(result.percentageChange);

			return Response.ok(res, {
				total_earnings: total_amount,
				transactions,
				graph_data,
				total_attendees: total_attendee,
				is_increased: is_increased,
				current_month_percentage: current_month_percentage,
			});
		} catch (error) {
			console.log(error.message);
			return Response.serverErrorResponse(
				res,
				resp_messages(req.lang).internalServerError
			);
		}
	},

	getWalletInfo: async (req, res) => {
		try {
			const { userId } = req;
			const lang = req.lang || "en";

			// Get wallet information for the organizer
			const wallet = await WalletService.FindOneService({
				organizer_id: userId,
			});

			if (!wallet) {
				// Create default wallet if it doesn't exist
				const newWallet = await WalletService.CreateService({
					organizer_id: userId,
					total_amount: 0,
					minimum_withdrawal: 100,
					maximum_withdrawal: 50000
				});

				return Response.ok(
					res,
					{
						organizer_id: userId,
						total_amount: 0,
						minimum_withdrawal: 100,
						maximum_withdrawal: 50000
					},
					200,
					lang === "ar" ? "تم جلب معلومات المحفظة" : "Wallet information retrieved"
				);
			}

			return Response.ok(
				res,
				{
					organizer_id: userId,
					total_amount: wallet.total_amount || 0,
					minimum_withdrawal: wallet.minimum_withdrawal || 100,
					maximum_withdrawal: wallet.maximum_withdrawal || 50000
				},
				200,
				lang === "ar" ? "تم جلب معلومات المحفظة" : "Wallet information retrieved"
			);
		} catch (error) {
			console.error("[WALLET-INFO] Error:", error.message);
			return Response.serverErrorResponse(
				res,
				resp_messages(req.lang).internalServerError || "Error retrieving wallet information"
			);
		}
	},

	withdrawal: async (req, res) => {
		try {
			const { amount } = req.body;
			const { userId } = req;
			const organizerWallet = await WalletService.FindOneService({
				organizer_id: userId,
			});
			
			// Check if wallet exists, create if not
			if (!organizerWallet) {
				return Response.badRequestResponse(
					res,
					req.lang === "ar"
						? "لم يتم العثور على محفظة. يرجى الاتصال بالدعم"
						: "Wallet not found. Please contact support"
				);
			}
			
			// Validate amount is provided
			if (!amount || amount <= 0) {
				return Response.badRequestResponse(
					res,
					req.lang === "ar" 
						? "يجب تحديد مبلغ صحيح"
						: "Please enter a valid amount"
				);
			}
			
			// Check if amount is greater than available balance (host can withdraw full wallet amount)
			if (amount > organizerWallet.total_amount) {
				return Response.badRequestResponse(
					res,
					resp_messages(req.lang).insufficient_funds
				);
			}

			// Minimum 0.01 SAR to avoid zero/negative
			if (amount < 0.01) {
				return Response.badRequestResponse(
					res,
					req.lang === "ar" ? "الحد الأدنى للسحب 0.01 ريال" : "Minimum withdrawal amount is 0.01 SAR"
				);
			}
			
			// Requirement #22: Set wallet balance to 0 when withdrawal is requested (even if pending)
			// This allows host to request withdrawal again
			organizerWallet.total_amount = 0;
			await organizerWallet.save();
			
			// Create withdrawal transaction with pending status (status = 0)
			const transaction = await TransactionService.CreateService({
				type: 2,
				amount: amount,
				organizer_id: userId,
				status: 0, // Pending
			});
			
			// Create notification for admin when withdrawal is requested
			try {
				const AdminService = require("../services/adminService.js");
				const lang = req.headers.lang || req.lang || "en";
				const organizer = await organizerService.FindOneService({ _id: userId });
				
				if (organizer) {
					const admins = await AdminService.FindService({ is_delete: { $ne: 1 } });
					
					for (const admin of admins) {
						await NotificationService.CreateService({
							user_id: admin._id,
							role: 3, // Admin role
							title: "New Withdrawal Request",
							title_ar: "طلب سحب أموال جديد",
							description: `A withdrawal request of ${amount} SAR has been made by ${organizer.first_name} ${organizer.last_name}`,
							description_ar: `طلب سحب مبلغ ${amount} ر.س من قبل ${organizer.first_name} ${organizer.last_name}`,
							isRead: false,
							notification_type: 4, // Withdrawal type
							profile_image: organizer.profile_image || "",
							username: `${organizer.first_name} ${organizer.last_name}`,
							senderId: organizer._id,
							status: 0, // Pending status
						});
					}
				}
			} catch (notificationError) {
				console.error("[WITHDRAWAL] Error creating admin notification:", notificationError);
				// Don't fail the request if notification fails
			}
			
			return Response.ok(
				res,
				{},
				200,
				resp_messages(req.lang).withdrawalSuccess
			);
		} catch (error) {
			console.log(error.message);
			return Response.serverErrorResponse(
				res,
				resp_messages(req.lang).internalServerError
			);
		}
	},
	withdrawalList: async (req, res) => {
		try {
			const { userId } = req;
			const { page = 1, limit = 10 } = req.query;

			const skip = Number(page - 1) * Number(limit);
			const match_query = {
				organizer_id: new mongoose.Types.ObjectId(userId),
				type: 2,
			};
			const items = await TransactionService.AggregateService([
				{
					$match: match_query,
				},
				{
					$project: {
						amount: 1,
						status: 1,
						createdAt: 1,
						updatedAt: 1,
					},
				},
				{
					$sort: { createdAt: -1 },
				},
				{ $skip: skip },
				{ $limit: Number(limit) },
			]);

			const count = await TransactionService.CountDocumentService(
				match_query
			);

			return Response.ok(
				res,
				items,
				200,
				resp_messages(req.lang).fetched_data,
				count
			);
		} catch (error) {
			return Response.serverErrorResponse(
				res,
				resp_messages(req.lang).internalServerError
			);
		}
	},

	/**
	 * Verify organizer email address
	 * GET /organizer/verify-email?token=xxx
	 */
	verifyOrganizerEmail: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const { token } = req.query;

			console.log("[ORGANIZER:VERIFY-EMAIL] Verification request for token:", token);

			if (!token) {
				return Response.validationErrorResponse(
					res,
					resp_messages?.[lang]?.token_required || "Verification token is required"
				);
			}

			const EmailVerificationService = require("../services/emailVerificationService");

			// Find valid token
			const tokenDoc = await EmailVerificationService.FindByToken(token);

			if (!tokenDoc) {
				console.log("[ORGANIZER:VERIFY-EMAIL] Invalid or expired token");
				return Response.validationErrorResponse(
					res,
					resp_messages?.[lang]?.invalid_token || "Invalid or expired verification link"
				);
			}

			console.log("[ORGANIZER:VERIFY-EMAIL] Token found:", {
				user_id: tokenDoc.user_id,
				user_type: tokenDoc.user_type
			});

			// Verify this is an organizer token, not a user token
			if (tokenDoc.user_type !== "organizer") {
				console.log("[ORGANIZER:VERIFY-EMAIL] Token belongs to user, not organizer");
				return Response.validationErrorResponse(
					res,
					resp_messages?.[lang]?.invalid_token || "Invalid verification link. Please use the correct verification link for your account type."
				);
			}

			// Get organizer
			const organizer = await organizerService.FindByIdService(tokenDoc.user_id);

			if (!organizer) {
				console.log("[ORGANIZER:VERIFY-EMAIL] Organizer not found");
				return Response.notFoundResponse(
					res,
					resp_messages?.[lang]?.organizer_not_found || "Organizer not found"
				);
			}

			// Check if already verified
			// Check if email already verified
			if (organizer.email_verified_at) {
				console.log("[ORGANIZER:VERIFY-EMAIL] Email already verified");
				// Mark token as used anyway
				await EmailVerificationService.MarkAsUsed(tokenDoc._id);
				
				const bothVerified = organizer.is_verified && organizer.phone_verified;
				
				return Response.ok(
					res,
					{
						organizer: {
							_id: organizer._id,
							email: organizer.email,
							first_name: organizer.first_name,
							last_name: organizer.last_name,
							is_verified: organizer.is_verified,
							phone_verified: organizer.phone_verified,
							email_verified: true,
							is_approved: organizer.is_approved,
						},
					},
					200,
					bothVerified
						? (resp_messages?.[lang]?.already_verified || "Email already verified. Your application is pending admin approval.")
						: (lang === "ar"
							? "البريد الإلكتروني مُؤكد بالفعل. يرجى تأكيد رقم الهاتف لإكمال التسجيل."
							: "Email already verified. Please verify your phone number to complete registration.")
				);
			}

			// Mark email as verified
			organizer.email_verified_at = new Date();
			
			// Check if phone is also verified - if both verified, mark is_verified as true
			if (organizer.phone_verified) {
				organizer.is_verified = true;
				console.log("[ORGANIZER:VERIFY-EMAIL] Both email and phone verified - account fully verified");
			} else {
				console.log("[ORGANIZER:VERIFY-EMAIL] Email verified, waiting for phone verification");
			}
			
			await organizer.save();

			// Mark token as used
			await EmailVerificationService.MarkAsUsed(tokenDoc._id);

			console.log("[ORGANIZER:VERIFY-EMAIL] Organizer verified successfully:", organizer.email);

			const responseData = {
				organizer: {
					_id: organizer._id,
					email: organizer.email,
					phone_number: organizer.phone_number,
					first_name: organizer.first_name,
					last_name: organizer.last_name,
					is_verified: organizer.is_verified,
					phone_verified: organizer.phone_verified,
					email_verified: true,
					is_approved: organizer.is_approved, // Still pending approval
					role: organizer.role,
				},
			};

			return Response.ok(
				res,
				responseData,
				200,
				organizer.is_verified
					? (resp_messages?.[lang]?.verification_success_pending || 
						"Email and phone verified successfully! Your application is pending admin approval. We will notify you via email once approved.")
					: (lang === "ar"
						? "تم تأكيد البريد الإلكتروني بنجاح! يرجى تأكيد رقم الهاتف لإكمال التسجيل."
						: "Email verified successfully! Please verify your phone number to complete registration.")
			);
		} catch (error) {
			console.error("[ORGANIZER:VERIFY-EMAIL] Verification error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages?.[lang]?.internalServerError
			);
		}
	},

	/**
	 * Verify signup OTP for organizer phone number
	 * POST /organizer/verify-signup-otp
	 * Body: { organizer_id, phone_number, country_code, otp }
	 */
	verifySignupOtp: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const { organizer_id, phone_number, country_code, otp } = req.body;

			console.log("[ORGANIZER:VERIFY-SIGNUP-OTP] Verification request:", { organizer_id, phone_number, country_code });

			// Validate inputs
			if (!organizer_id) {
				return Response.validationErrorResponse(
					res,
					"Organizer ID is required"
				);
			}

			if (!phone_number || !country_code) {
				return Response.validationErrorResponse(
					res,
					"Phone number and country code are required"
				);
			}

			const { validateOTP, validateSaudiPhone } = require("../helpers/validationHelpers");

			// Validate phone number
			const phoneValidation = validateSaudiPhone(phone_number, country_code);
			if (!phoneValidation.isValid) {
				return Response.validationErrorResponse(
					res,
					phoneValidation.message
				);
			}

			// Validate OTP format
			const otpValidation = validateOTP(otp);
			if (!otpValidation.isValid) {
				return Response.validationErrorResponse(
					res,
					otpValidation.message
				);
			}

			// Find organizer
			const organizer = await organizerService.FindByIdService(organizer_id);
			if (!organizer) {
				return Response.notFoundResponse(
					res,
					resp_messages?.[lang]?.organizer_not_found || "Organizer not found"
				);
			}

			// Check if phone already verified
			if (organizer.phone_verified) {
				console.log("[ORGANIZER:VERIFY-SIGNUP-OTP] Phone already verified");
				return Response.ok(
					res,
					{
						organizer: {
							_id: organizer._id,
							phone_verified: true,
							is_verified: organizer.is_verified,
						},
					},
					200,
					lang === "ar"
						? "رقم الهاتف مؤكد بالفعل"
						: "Phone number already verified"
				);
			}

			// Verify OTP
			const fullPhoneNumber = `${country_code}${phoneValidation.cleanPhone}`;
			const { verifySignupOtp } = require("../helpers/otpSend");
			
			try {
				await verifySignupOtp(organizer_id, fullPhoneNumber, otpValidation.cleanOtp, 2);
			} catch (otpError) {
				console.error("[ORGANIZER:VERIFY-SIGNUP-OTP] OTP verification failed:", otpError.message);
				return Response.validationErrorResponse(
					res,
					otpError.message || "Invalid or expired OTP"
				);
			}

			// Mark phone as verified
			organizer.phone_verified = true;
			organizer.phone_verified_at = new Date();

			// Check if email is also verified - if both verified, mark is_verified as true
			if (organizer.email_verified_at) {
				organizer.is_verified = true;
				console.log("[ORGANIZER:VERIFY-SIGNUP-OTP] Both email and phone verified - account fully verified");
			} else {
				console.log("[ORGANIZER:VERIFY-SIGNUP-OTP] Phone verified, waiting for email verification");
			}

			await organizer.save();

			const responseData = {
				organizer: {
					_id: organizer._id,
					email: organizer.email,
					phone_number: organizer.phone_number,
					country_code: organizer.country_code,
					first_name: organizer.first_name,
					last_name: organizer.last_name,
					is_verified: organizer.is_verified,
					phone_verified: true,
					email_verified: !!organizer.email_verified_at,
					is_approved: organizer.is_approved,
					role: organizer.role,
				},
			};

			return Response.ok(
				res,
				responseData,
				200,
				organizer.is_verified
					? (lang === "ar"
						? "تم تأكيد البريد الإلكتروني ورقم الهاتف بنجاح! طلبك قيد مراجعة الإدارة."
						: "Email and phone verified successfully! Your application is pending admin approval.")
					: (lang === "ar"
						? "تم تأكيد رقم الهاتف بنجاح! يرجى تأكيد البريد الإلكتروني لإكمال التسجيل."
						: "Phone number verified successfully! Please verify your email address to complete registration.")
			);
		} catch (error) {
			console.error("[ORGANIZER:VERIFY-SIGNUP-OTP] Verification error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages?.[lang]?.internalServerError
			);
		}
	},

	/**
	 * Resend signup OTP to organizer phone number
	 * POST /organizer/resend-signup-otp
	 * Body: { organizer_id, phone_number, country_code }
	 */
	resendSignupOtp: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const { organizer_id, phone_number, country_code } = req.body;

			console.log("[ORGANIZER:RESEND-SIGNUP-OTP] Resend request:", { organizer_id, phone_number, country_code });

			if (!organizer_id) {
				return Response.validationErrorResponse(
					res,
					"Organizer ID is required"
				);
			}

			if (!phone_number || !country_code) {
				return Response.validationErrorResponse(
					res,
					"Phone number and country code are required"
				);
			}

			const { validateSaudiPhone } = require("../helpers/validationHelpers");
			const phoneValidation = validateSaudiPhone(phone_number, country_code);
			if (!phoneValidation.isValid) {
				return Response.validationErrorResponse(
					res,
					phoneValidation.message
				);
			}

			// Find organizer
			const organizer = await organizerService.FindByIdService(organizer_id);
			if (!organizer) {
				return Response.notFoundResponse(
					res,
					resp_messages?.[lang]?.organizer_not_found || "Organizer not found"
				);
			}

			// Check if phone already verified
			if (organizer.phone_verified) {
				return Response.validationErrorResponse(
					res,
					lang === "ar"
						? "رقم الهاتف مؤكد بالفعل"
						: "Phone number already verified"
				);
			}

			// Send OTP
			// IMPORTANT: Format phone number EXACTLY as done in registration
			// This must match the format used in organizer registration
			let fullPhoneNumber;
			const phoneStr = phoneValidation.cleanPhone;
			console.log(`[ORGANIZER:RESEND-SIGNUP-OTP] Phone formatting - phoneStr: "${phoneStr}", length: ${phoneStr.length}, country: ${country_code}`);
			
			if (country_code === "+92") {
				// Pakistan: Format exactly as done in registration
				if (phoneStr.length === 10 && phoneStr.startsWith('0')) {
					// 10 digits starting with 0: Remove 0 and use 9 digits
					const numberWithoutZero = phoneStr.substring(1);
					fullPhoneNumber = `${country_code}${numberWithoutZero}`;
					console.log(`[ORGANIZER:RESEND-SIGNUP-OTP] 10-digit number with leading 0: "${phoneStr}" -> Removed 0 -> "${numberWithoutZero}" -> ${fullPhoneNumber}`);
				}
				else if (phoneStr.length === 10 && !phoneStr.startsWith('0')) {
					// 10 digits without leading 0: Use as-is -> +923289081825
					fullPhoneNumber = `${country_code}${phoneStr}`;
					console.log(`[ORGANIZER:RESEND-SIGNUP-OTP] 10-digit number without leading 0: "${phoneStr}" -> Use as-is -> ${fullPhoneNumber}`);
				}
				else if (phoneStr.length === 9) {
					// 9 digits: MSGATE needs 10 digits for Pakistan - reject
					throw new Error(`Invalid Pakistan phone number format. MSGATE requires 10 digits after +92, but received only ${phoneStr.length} digits. Please enter the complete 10-digit number (e.g., 3289081825).`);
				}
				else {
					// Unexpected length: use as is
					fullPhoneNumber = `${country_code}${phoneStr}`;
					console.log(`[ORGANIZER:RESEND-SIGNUP-OTP] Warning: Unexpected phone length: ${phoneStr.length} digits`);
				}
			} else {
				// Saudi numbers: use as is
				fullPhoneNumber = `${country_code}${phoneStr}`;
			}
			
			console.log(`[ORGANIZER:RESEND-SIGNUP-OTP] Formatted phone for OTP: ${fullPhoneNumber} (original: "${phoneStr}", length: ${phoneStr.length}, country: ${country_code})`);
			
			const { sendSignupOtp } = require("../helpers/otpSend");
			let otpSent = false;
			let otpValue = null;

			try {
				otpValue = await sendSignupOtp(organizer_id, fullPhoneNumber, 2, lang);
				otpSent = true;
				console.log("[ORGANIZER:RESEND-SIGNUP-OTP] OTP sent successfully");
			} catch (otpError) {
				console.error("[ORGANIZER:RESEND-SIGNUP-OTP] Error sending OTP:", otpError.message);
				return Response.validationErrorResponse(
					res,
					otpError.message || resp_messages(lang).otp_send_failed
				);
			}

			return Response.ok(
				res,
				{
					organizer_id: organizer_id,
					phone_number: phone_number,
					otp_sent: otpSent,
					otp_for_testing: process.env.NODE_ENV === "development" && otpValue ? otpValue : undefined,
				},
				200,
				otpSent
					? resp_messages(lang).otp_sent_phone
					: resp_messages(lang).otp_send_failed
			);
		} catch (error) {
			console.error("[ORGANIZER:RESEND-SIGNUP-OTP] Error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages?.[lang]?.internalServerError
			);
		}
	},

	/**
	 * Admin: Approve organizer
	 * PUT /organizer/admin/approve/:organizerId
	 */
	approveOrganizer: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const { organizerId } = req.params;

			console.log("[ORGANIZER:APPROVE] Approving organizer:", organizerId);

			const organizer = await organizerService.FindByIdService(organizerId);

			if (!organizer) {
				return Response.notFoundResponse(
					res,
					resp_messages?.[lang]?.organizer_not_found || "Organizer not found"
				);
			}

			// Check if email is verified
			if (!organizer.is_verified) {
				return Response.validationErrorResponse(
					res,
					resp_messages?.[lang]?.email_not_verified || 
					"Organizer must verify their email before approval"
				);
			}

			// Update approval status
			organizer.is_approved = 2; // Approved
			await organizer.save();

			console.log("[ORGANIZER:APPROVE] Organizer approved:", organizerId);

			// Send approval email
			const emailService = require("../helpers/emailService");
			const emailHtml = emailService.renderHostApprovalEmail(
				`${organizer.first_name} ${organizer.last_name}`,
				organizer.language || "en"
			);

			const subject = organizer.language === "ar"
				? "تم الموافقة على حسابك - Zuroona"
				: "Your account has been approved - Zuroona";

			console.log("[ORGANIZER:APPROVE] Sending approval email to:", organizer.email);

			const emailSent = await emailService.send(organizer.email, subject, emailHtml);

			if (!emailSent) {
				console.error("[ORGANIZER:APPROVE] Failed to send approval email");
			}

			// Create notification for organizer
			try {
				await NotificationService.CreateService({
					user_id: organizer._id,
					role: 2, // Organizer role
					title: organizer.language === "ar" ? "تم الموافقة على حسابك" : "Account Approved",
					description: organizer.language === "ar"
						? "تم الموافقة على حسابك! يمكنك الآن تسجيل الدخول وإنشاء الفعاليات."
						: "Your account has been approved! You can now login and create events.",
					isRead: false,
					notification_type: 2, // Approval type
				});
			} catch (notificationError) {
				console.error("[ORGANIZER:APPROVE] Error creating notification:", notificationError);
			}

			return Response.ok(
				res,
				{
					organizer: {
						_id: organizer._id,
						email: organizer.email,
						first_name: organizer.first_name,
						last_name: organizer.last_name,
						is_approved: 2,
					},
					email_sent: emailSent,
				},
				200,
				resp_messages?.[lang]?.organizer_approved || "Organizer approved successfully"
			);
		} catch (error) {
			console.error("[ORGANIZER:APPROVE] Error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages?.[lang]?.internalServerError
			);
		}
	},

	/**
	 * Admin: Reject organizer
	 * PUT /organizer/admin/reject/:organizerId
	 * Body: { reason }
	 */
	rejectOrganizer: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const { organizerId } = req.params;
			const { reason } = req.body;

			console.log("[ORGANIZER:REJECT] Rejecting organizer:", organizerId);

			if (!reason || reason.trim() === "") {
				return Response.validationErrorResponse(
					res,
					resp_messages?.[lang]?.reason_required || "Rejection reason is required"
				);
			}

			const organizer = await organizerService.FindByIdService(organizerId);

			if (!organizer) {
				return Response.notFoundResponse(
					res,
					resp_messages?.[lang]?.organizer_not_found || "Organizer not found"
				);
			}

			// Update approval status
			organizer.is_approved = 3; // Rejected
			await organizer.save();

			console.log("[ORGANIZER:REJECT] Organizer rejected:", organizerId);

			// Send rejection email
			const emailService = require("../helpers/emailService");
			const emailHtml = emailService.renderHostRejectionEmail(
				`${organizer.first_name} ${organizer.last_name}`,
				reason,
				organizer.language || "en"
			);

			const subject = organizer.language === "ar"
				? "تحديث بشأن طلبك - Zuroona"
				: "Update on your application - Zuroona";

			console.log("[ORGANIZER:REJECT] Sending rejection email to:", organizer.email);

			const emailSent = await emailService.send(organizer.email, subject, emailHtml);

			if (!emailSent) {
				console.error("[ORGANIZER:REJECT] Failed to send rejection email");
			}

			// Create notification for organizer
			try {
				await NotificationService.CreateService({
					user_id: organizer._id,
					role: 2, // Organizer role
					title: organizer.language === "ar" ? "تم رفض طلبك" : "Application Rejected",
					description: reason,
					isRead: false,
					notification_type: 3, // Rejection type
				});
			} catch (notificationError) {
				console.error("[ORGANIZER:REJECT] Error creating notification:", notificationError);
			}

			return Response.ok(
				res,
				{
					organizer: {
						_id: organizer._id,
						email: organizer.email,
						first_name: organizer.first_name,
						last_name: organizer.last_name,
						is_approved: 3,
					},
					email_sent: emailSent,
					reason,
				},
				200,
				resp_messages?.[lang]?.organizer_rejected || "Organizer rejected"
			);
		} catch (error) {
			console.error("[ORGANIZER:REJECT] Error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages?.[lang]?.internalServerError
			);
		}
	},

	/**
	 * Cancel Event (Host)
	 * POST /organizer/event/cancel
	 * 
	 * Requirements:
	 * - Only for approved events
	 * - Check how many guests were accepted
	 * - Deduct total amount from host wallet
	 * - Log cancelled transactions
	 * - Send notifications to all guests, host, and admin
	 * - Update event status
	 */
	cancelEvent: async (req, res) => {
		try {
			const { userId } = req;
			const { event_id, reason } = req.body;
			const lang = req.headers["lang"] || "en";

			if (!mongoose.Types.ObjectId.isValid(event_id)) {
				return Response.badRequestResponse(res, resp_messages(lang).id_required || "Invalid event ID");
			}

			// Get organizer
			const organizer = await organizerService.FindOneService({
				_id: userId,
			});

			if (!organizer) {
				return Response.notFoundResponse(res, resp_messages(lang).user_not_found || "Organizer not found");
			}

			// Get event
			const event = await EventService.FindOneService({
				_id: event_id,
				organizer_id: userId, // Ensure organizer can only cancel their own events
			});

			if (!event) {
				return Response.notFoundResponse(res, resp_messages(lang).eventNotFound || "Event not found");
			}

			// Check if event is approved (is_approved = 1 means approved)
			if (event.is_approved !== 1) {
				let errorMessage;
				if (event.is_approved === 0) {
					errorMessage = resp_messages(lang).cannotCancelPendingEvent || 
						"Cannot cancel pending event. Please wait for admin approval or delete the event if it's not approved yet.";
				} else if (event.is_approved === 2) {
					errorMessage = resp_messages(lang).cannotCancelRejectedEvent || 
						"Cannot cancel rejected event. This event has already been rejected by admin.";
				} else {
					errorMessage = resp_messages(lang).onlyApprovedEventsCanBeCancelled || 
						"Only approved events can be cancelled.";
				}
				return Response.badRequestResponse(res, errorMessage);
			}

			// Check if event is already cancelled
			if (event.isActive === 2 || event.is_cancelled === true || event.event_status === 'cancelled') {
				return Response.badRequestResponse(res, resp_messages(lang).eventAlreadyCancelled || 
					"This event has already been cancelled.");
			}

			// Check if event date has passed
			const now = new Date();
			const eventDate = new Date(event.event_date);
			if (!isNaN(eventDate.getTime()) && eventDate < now) {
				return Response.badRequestResponse(res, resp_messages(lang).cannotCancelCompletedEvent || 
					"Cannot cancel completed event. This event has already taken place.");
			}

			// Get all accepted bookings (book_status = 2 means confirmed/approved)
			// Use BookEvent model directly to get all bookings
			const allBookings = await BookEvent.find({
				event_id: event_id,
				book_status: 2, // Only confirmed bookings
			});

			// Calculate total amount to deduct
			let totalAmountToDeduct = 0;
			let totalTicketsCancelled = 0;

			allBookings.forEach((booking) => {
				if (booking.payment_status === 1) { // Only if payment was made
					totalAmountToDeduct += booking.total_amount || 0;
					totalTicketsCancelled += booking.no_of_attendees || 0;
				}
			});

			// Deduct from host wallet
			if (totalAmountToDeduct > 0) {
				let wallet = await WalletService.FindOneService({
					organizer_id: userId,
				});

				if (!wallet) {
					wallet = await WalletService.CreateService({
						organizer_id: userId,
						total_amount: 0,
					});
				}

				// Deduct total amount from wallet
				const newBalance = Math.max(0, (wallet.total_amount || 0) - totalAmountToDeduct);
				await WalletService.FindByIdAndUpdateService(wallet._id, {
					total_amount: newBalance,
				});

				// Log cancelled transactions for each booking
				for (const booking of allBookings) {
					if (booking.payment_status === 1) {
						await TransactionService.CreateService({
							organizer_id: userId,
							user_id: booking.user_id,
							book_id: booking._id,
							amount: booking.total_amount || 0,
							currency: "SAR",
							type: 2, // Debit
							status: 1, // Success
							payment_id: booking.payment_id || null,
						});
					}
				}

				console.log(`[HOST:CANCEL] Deducted ${totalAmountToDeduct} SAR from host wallet. New balance: ${newBalance}`);
			}

			// Update all bookings to cancelled
			await BookEvent.updateMany(
				{
					event_id: event_id,
					book_status: 2, // Only update confirmed bookings
				},
				{
					$set: { book_status: 3 }, // Set to cancelled
				}
			);

			// Update event status to cancelled and add back the cancelled tickets
			event.no_of_attendees = (event.no_of_attendees || 0) + totalTicketsCancelled;
			event.is_cancelled = true;
			event.event_status = 'cancelled';
			event.isActive = 2; // Also set isActive = 2 for backward compatibility
			event.cancelled_at = new Date();
			event.cancelled_reason = reason || null;
			event.cancelled_by = userId;
			await event.save();
			
			console.log(`[HOST:CANCEL] Event ${event_id} marked as cancelled in database`);
			console.log(`[HOST:CANCEL] Updated fields: is_cancelled=${event.is_cancelled}, event_status=${event.event_status}, isActive=${event.isActive}`);

			// Send notifications
			const notificationMessages = {
				en: {
					hostTitle: "Event Cancelled",
					hostDesc: `You have cancelled the event "${event.event_name}".${reason ? ` Reason: ${reason}` : ""} Total amount deducted: ${totalAmountToDeduct} SAR.`,
					guestTitle: "Event Cancelled",
					guestDesc: `The event "${event.event_name}" has been cancelled by the host.${reason ? ` Reason: ${reason}` : ""} You may be eligible for a refund.`,
					adminTitle: "Event Cancelled by Host",
					adminDesc: `Host "${organizer.first_name} ${organizer.last_name}" cancelled event "${event.event_name}". ${totalTicketsCancelled} ticket(s) cancelled. Total amount ${totalAmountToDeduct} SAR deducted from host wallet.${reason ? ` Reason: ${reason}` : ""}`,
				},
				ar: {
					hostTitle: "تم إلغاء الفعالية",
					hostDesc: `لقد ألغيت الفعالية "${event.event_name}".${reason ? ` السبب: ${reason}` : ""} إجمالي المبلغ المخصوم: ${totalAmountToDeduct} ريال.`,
					guestTitle: "تم إلغاء الفعالية",
					guestDesc: `تم إلغاء الفعالية "${event.event_name}" من قبل المضيف.${reason ? ` السبب: ${reason}` : ""} قد تكون مؤهلاً لاسترداد الأموال.`,
					adminTitle: "تم إلغاء الفعالية من قبل المضيف",
					adminDesc: `ألغى المضيف "${organizer.first_name} ${organizer.last_name}" الفعالية "${event.event_name}". تم إلغاء ${totalTicketsCancelled} تذكرة. إجمالي المبلغ ${totalAmountToDeduct} ريال مخصوم من محفظة المضيف.${reason ? ` السبب: ${reason}` : ""}`,
				},
			};

			const messages = notificationMessages[lang] || notificationMessages.en;

			// Notify host with push notification
			try {
				const { pushNotification } = require("../helpers/pushNotification");
				const hostNotificationData = {
					title: messages.hostTitle,
					description: messages.hostDesc,
					first_name: organizer.first_name,
					last_name: organizer.last_name,
					userId: organizer._id,
					profile_image: organizer.profile_image || "",
					event_id: event._id,
					notification_type: 3, // Cancellation type
					status: 3, // Cancelled status
				};
				await pushNotification(res, 2, userId, hostNotificationData);
				console.log(`[NOTIFICATION] Sent event cancellation push notification to host: ${userId}`);
			} catch (pushError) {
				console.error('[PUSH-NOTIFICATION] Error sending push to host, creating in-app notification:', pushError);
				await NotificationService.CreateService({
					user_id: userId,
					role: 2, // Host role
					title: messages.hostTitle,
					description: messages.hostDesc,
					event_id: event._id,
					notification_type: 3, // Cancellation type
					isRead: false,
				});
			}

			// Notify all guests who had accepted bookings with push notifications
			const UserService = require("../services/userService");
			for (const booking of allBookings) {
				try {
					// Get user details for notification
					const guestUser = await UserService.FindOneService({ _id: booking.user_id });
					if (guestUser) {
						const { sendEventBookingAcceptNotification } = require("../helpers/pushNotification");
						const guestNotificationData = {
							title: messages.guestTitle,
							description: messages.guestDesc,
							first_name: guestUser.first_name,
							last_name: guestUser.last_name,
							userId: guestUser._id,
							profile_image: guestUser.profile_image || "",
							event_id: event._id,
							book_id: booking._id,
							notification_type: 3, // Cancellation type
							status: 3, // Cancelled status
						};
						await sendEventBookingAcceptNotification(res, booking.user_id, guestNotificationData);
						console.log(`[NOTIFICATION] Sent event cancellation push notification to guest: ${booking.user_id}`);
					}
				} catch (pushError) {
					console.error(`[PUSH-NOTIFICATION] Error sending push to guest ${booking.user_id}, creating in-app notification:`, pushError);
					await NotificationService.CreateService({
						user_id: booking.user_id,
						role: 1, // Guest role
						title: messages.guestTitle,
						description: messages.guestDesc,
						event_id: event._id,
						book_id: booking._id,
						notification_type: 3, // Cancellation type
						isRead: false,
					});
				}
			}

			// Notify admin (in-app only; store both EN and AR for admin UI locale)
			const AdminService = require("../services/adminService");
			const admins = await AdminService.FindService({ is_delete: { $ne: 1 } });
			const msgEn = notificationMessages.en;
			const msgAr = notificationMessages.ar;
			for (const admin of admins) {
				await NotificationService.CreateService({
					user_id: admin._id,
					role: 3, // Admin role
					title: msgEn.adminTitle,
					title_ar: msgAr.adminTitle,
					description: msgEn.adminDesc,
					description_ar: msgAr.adminDesc,
					event_id: event._id,
					notification_type: 3, // Cancellation type
					isRead: false,
				});
			}

			return Response.ok(
				res,
				{
					event: {
						_id: event._id,
						event_name: event.event_name,
						is_cancelled: true,
						event_status: 'cancelled',
						cancelled_at: event.cancelled_at,
						cancelled_reason: reason || null,
					},
					cancelledBookings: allBookings.length,
					totalTicketsCancelled,
					totalAmountDeducted: totalAmountToDeduct,
				},
				200,
				resp_messages(lang).eventCancelled || "Event cancelled successfully"
			);
		} catch (error) {
			console.error("[HOST:CANCEL] Error:", error);
			return Response.serverErrorResponse(
				res,
				error.message || resp_messages(req.lang).internalServerError || "Internal server error"
			);
		}
	},
};

module.exports = organizerController;
