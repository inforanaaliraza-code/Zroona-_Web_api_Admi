const { generateToken, verifyToken } = require("../helpers/generateToken");
// OTP functionality removed - using email-based authentication only
const { sendEventBookingNotification } = require("../helpers/pushNotification");
const Response = require("../helpers/response");
const { cleanEmail } = require("../helpers/emailCleaner");
const BookEventService = require("../services/bookEventService");
const EventService = require("../services/eventService");
const NotificationService = require("../services/notificationService");
const organizerService = require("../services/organizerService");
const ReviewService = require("../services/reviewService");
const UserService = require("../services/userService");
const mongoose = require("mongoose");
const resp_messages = require("../helpers/resp_messages");
const axios = require("axios");
const PrettyConsole = require("../helpers/prettyConsole");
const crypto = require("crypto");
const TransactionService = require("../services/recentTransaction");
const WalletService = require("../services/walletService");
const DaftraService = require("../helpers/daftraService");
const FatoraService = require("../helpers/fatoraService");
const LocalInvoiceGenerator = require("../helpers/localInvoiceGenerator");
const MoyasarService = require("../helpers/MoyasarService");
const ConversationService = require("../services/conversationService");
const notificationHelper = require("../helpers/notificationService");

const custom_log = new PrettyConsole();
custom_log.clear();
custom_log.closeByNewLine = true;
custom_log.useIcons = true;
let _count = 0;

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

const getLocalPhoneFromString = (phone) => {
	if (!phone) return "";
	const digits = phone.toString().replace(/\D/g, "");
	return digits.slice(-9);
};

const UserController = {
	userRegistration: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const { email, phone_number, country_code } = req.body;

			// Log request data for debugging
			console.log("[USER:REGISTRATION] Registration request:", { ...req.body, password: "NOT_REQUIRED", confirmPassword: "NOT_REQUIRED" });

			// Import validation helpers
			const { validateEmail, validateSaudiPhone } = require("../helpers/validationHelpers");

			// Validate email
			if (!email) {
				return Response.validationErrorResponse(
					res,
					resp_messages(lang).email_required || "Email address is required"
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

			// Validate phone number
			console.log(`[USER:REGISTRATION] Received phone_number: "${phone_number}", type: ${typeof phone_number}, length: ${phone_number?.toString().length}, country_code: ${country_code}`);
			const phoneValidation = validateSaudiPhone(phone_number, country_code);
			if (!phoneValidation.isValid) {
				return Response.validationErrorResponse(
					res,
					phoneValidation.message
				);
			}

			// Clean email - remove invisible/zero-width characters, trim, and lowercase
			const emailLower = cleanEmail(email);
			const phoneStr = phoneValidation.cleanPhone;
			console.log(`[USER:REGISTRATION] After validation - phoneStr: "${phoneStr}", length: ${phoneStr?.length}, original: "${phone_number}"`);

			// Check for existing user by email (including deleted ones for email/phone reuse prevention)
			const exist_user_email = await UserService.FindOneService({
				email: emailLower,
			});

			// Check for existing organizer by email (including deleted ones)
			const exist_organizer_email = await organizerService.FindOneService({
				email: emailLower,
			});

			console.log("[USER:REGISTRATION] Existing checks:", {
				userByEmail: exist_user_email ? "found" : "not found",
				organizerByEmail: exist_organizer_email ? "found" : "not found",
			});

			// If email exists
			if (exist_user_email || exist_organizer_email) {
				const existingAccount = exist_user_email || exist_organizer_email;
				
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
							exists_as: exist_user_email ? "user" : "organizer",
							email: emailLower,
						},
						409,
						resp_messages(lang).account_exist_login || "Account already exists. Please login."
					);
				}

				// If not verified, resend verification email AND OTP
				console.log("[USER:REGISTRATION] User exists but not verified, resending verification email and OTP");
				
				const emailService = require("../helpers/emailService");
				const EmailVerificationService = require("../services/emailVerificationService");

				// Delete old tokens
				await EmailVerificationService.DeleteUserTokens(existingAccount._id, "user");

				// Generate new token
				const verificationToken = emailService.generateVerificationToken();
				const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

				// Save token
				await EmailVerificationService.CreateToken({
					token: verificationToken,
					user_id: existingAccount._id,
					user_type: "user",
					email: emailLower,
					expiresAt,
				});

				// Generate verification link
				const verificationLink = emailService.generateVerificationLink(
					verificationToken,
					1, // role: user
					lang
				);

				// Send email
				const emailHtml = emailService.renderGuestVerificationEmail(
					`${existingAccount.first_name} ${existingAccount.last_name}`,
					verificationLink,
					lang
				);

				const subject = lang === "ar" 
					? "تأكيد البريد الإلكتروني - Zuroona" 
					: "Verify your email address - Zuroona";

				console.log("[USER:REGISTRATION] Resending verification email to:", emailLower);
				console.log("[USER:REGISTRATION] Verification link:", verificationLink);

				const emailSent = await emailService.send(emailLower, subject, emailHtml);

				if (!emailSent) {
					console.error("[USER:REGISTRATION] Failed to send verification email");
				}

				// IMPORTANT: Also send OTP to phone number for existing unverified user
				let otpSent = false;
				let _otpValue = null;
				
				if (phoneValidation.isValid && phoneValidation.cleanPhone) {
					try {
						// Format phone number for MSGATE
						let fullPhoneNumber;
						console.log(`[USER:REGISTRATION] Existing user - Phone formatting - phoneStr: "${phoneValidation.cleanPhone}", length: ${phoneValidation.cleanPhone.length}, country: ${country_code}`);
						
						if (country_code === "+92") {
							// Pakistan: MSGATE needs E.164 format
							// Target: +923054717775 = +92 + 3054717775 (10 digits)
							if (phoneValidation.cleanPhone.length === 10 && phoneValidation.cleanPhone.startsWith('0')) {
								// 10 digits with leading 0: Remove 0 and use 9 digits
								const numberWithoutZero = phoneValidation.cleanPhone.substring(1);
								fullPhoneNumber = `${country_code}${numberWithoutZero}`;
							}
							else if (phoneValidation.cleanPhone.length === 10 && !phoneValidation.cleanPhone.startsWith('0')) {
								// 10 digits without 0: Use as-is -> +923054717775
								fullPhoneNumber = `${country_code}${phoneValidation.cleanPhone}`;
							}
							else if (phoneValidation.cleanPhone.length === 9) {
								// 9 digits: MSGATE needs 10 digits for Pakistan - this format is invalid
								// Reject 9-digit numbers for Pakistan
								throw new Error(`Invalid Pakistan phone number format. MSGATE requires 10 digits after +92, but received only ${phoneValidation.cleanPhone.length} digits. Please enter the complete 10-digit number (e.g., 3054717775).`);
							}
							else {
								fullPhoneNumber = `${country_code}${phoneValidation.cleanPhone}`;
							}
						} else {
							// Saudi numbers: use as is
							fullPhoneNumber = `${country_code}${phoneValidation.cleanPhone}`;
						}
						
						console.log(`[USER:REGISTRATION] Existing user - Formatted phone for OTP: ${fullPhoneNumber}`);
						
						const { sendSignupOtp } = require("../helpers/otpSend");
						_otpValue = await sendSignupOtp(existingAccount._id.toString(), fullPhoneNumber, 1, lang);
						otpSent = true;
						console.log("[USER:REGISTRATION] OTP sent to existing user's phone number via MSGATE");
					} catch (otpError) {
						console.error("[USER:REGISTRATION] Error sending OTP to existing user's phone:", otpError.message);
						// Continue even if OTP fails
					}
				}

				return Response.ok(
					res,
					{
						user: {
							_id: existingAccount._id,
							email: existingAccount.email,
							first_name: existingAccount.first_name,
							last_name: existingAccount.last_name,
							is_verified: false,
						},
						verification_sent: emailSent,
						otp_sent: otpSent,
					},
					200,
					resp_messages(lang).verification_email_sent || 
					"A verification link has been sent to your email and OTP to your phone. Please verify your account."
				);
			}

			// Check for existing phone number
			const exist_user_phone = await UserService.FindOneService({
				phone_number: parseInt(phoneStr),
				country_code,
			});

			const exist_organizer_phone = await organizerService.FindOneService({
				phone_number: parseInt(phoneStr),
				country_code,
			});

			if (exist_user_phone || exist_organizer_phone) {
				const existingPhoneAccount = exist_user_phone || exist_organizer_phone;
				
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
						exists_as: exist_user_phone ? "user" : "organizer",
						phone_number: phone_number,
					},
					409,
					resp_messages(lang).phone_exist || "Phone number already registered"
				);
			}

			// Create new user (passwordless - no password field)
			const userData = {
				...req.body,
				email: emailLower,
				phone_number: parseInt(phoneStr),
				country_code: country_code,
				role: 1, // Guest role
				is_verified: false, // Will be true only when BOTH email AND phone are verified
				phone_verified: false,
				email_verified_at: null,
				phone_verified_at: null,
				language: lang,
			};

			// Remove password and confirmPassword if they exist (passwordless auth)
			delete userData.password;
			delete userData.confirmPassword;

			// Ensure MongoDB connection before database operations
			const { ensureConnection } = require("../config/database");
			await ensureConnection();

			// Auto-verify email/phone for special test numbers
			const localPhoneForAutoVerify = getLocalPhoneFromString(phoneStr);
			const phoneDigits = phoneStr ? phoneStr.toString().replace(/\D/g, "") : "";
			const last8Digits = phoneDigits.slice(-8);
			const isSpecialTestPhone = (localPhoneForAutoVerify && SPECIAL_LOCAL_TEST_PHONES.has(localPhoneForAutoVerify)) ||
				(last8Digits && SPECIAL_LOCAL_TEST_PHONES.has(last8Digits));

			if (isSpecialTestPhone) {
				userData.is_verified = true;
				userData.phone_verified = true;
				userData.phone_verified_at = new Date();
				userData.email_verified_at = new Date();
			}

			let user;
			try {
				user = await UserService.CreateService(userData);
				console.log("[USER:REGISTRATION] User created successfully in database:", user._id);
			} catch (createError) {
				console.error("[USER:REGISTRATION] Failed to create user in database:", createError.message);
				console.error("[USER:REGISTRATION] Full error:", createError);
				return Response.serverErrorResponse(
					res,
					resp_messages(lang).internalServerError || "Failed to create user account. Please try again later."
				);
			}

			// Send OTP to phone number for verification (via MSGATE)
			// Format phone number for MSGATE: For Pakistan, ensure proper E.164 format
			let fullPhoneNumber;
			console.log(`[USER:REGISTRATION] Phone formatting - phoneStr: "${phoneStr}", length: ${phoneStr.length}, country: ${country_code}`);
			
			if (country_code === "+92") {
				// Pakistan: MSGATE needs E.164 format
				// Target number format: +923054717775 = +92 + 3054717775 (10 digits)
				// Valid input formats:
				// - 10 digits without 0: "3054717775" -> +923054717775 ✅
				// - 10 digits with 0: "0305471777" -> Remove 0 -> "305471777" (9 digits) -> +92305471777 (might be wrong)
				// - 9 digits: "305471777" -> +92305471777
				
				// The correct format for Pakistan mobile is: +92 + 9 digits (without local leading 0)
				// OR: +92 + 10 digits (if number already has 0 as part of the actual number)
				
				// Test shows: "3054717775" (10 digits) -> +923054717775 ✅ CORRECT
				// So if 10 digits without leading 0, use as-is
				// If 10 digits with leading 0, it's actually a 9-digit number with local format
				
				if (phoneStr.length === 10 && phoneStr.startsWith('0')) {
					// 10 digits starting with 0: This is local format (0 + 9 digits)
					// Remove leading 0 and use 9 digits: +92305471777
					const numberWithoutZero = phoneStr.substring(1); // Remove leading 0
					fullPhoneNumber = `${country_code}${numberWithoutZero}`;
					console.log(`[USER:REGISTRATION] 10-digit number with leading 0: "${phoneStr}" -> Removed 0 -> "${numberWithoutZero}" -> ${fullPhoneNumber}`);
				}
				else if (phoneStr.length === 10 && !phoneStr.startsWith('0')) {
					// 10 digits without leading 0: Use as-is -> +923054717775
					fullPhoneNumber = `${country_code}${phoneStr}`;
				}
				else if (phoneStr.length === 9) {
					// 9 digits: MSGATE needs 10 digits for Pakistan - reject
					throw new Error(`Invalid Pakistan phone number format. MSGATE requires 10 digits after +92, but received only ${phoneStr.length} digits. Please enter the complete 10-digit number (e.g., 3054717775).`);
				}
				else {
					// Unexpected length: use as is
					fullPhoneNumber = `${country_code}${phoneStr}`;
					console.log(`[USER:REGISTRATION] Warning: Unexpected phone length: ${phoneStr.length} digits`);
				}
			} else {
				// Saudi numbers: use as is
				fullPhoneNumber = `${country_code}${phoneStr}`;
			}
			
			console.log(`[USER:REGISTRATION] Formatted phone for OTP: ${fullPhoneNumber} (original: "${phoneStr}", length: ${phoneStr.length}, country: ${country_code})`);
			let otpSent = false;
			let otpValue = null;

			// For special test numbers, OTP already fixed and we don't need to send SMS again
			if (isSpecialTestPhone) {
				console.log(`[USER:REGISTRATION] Special test user created with auto-verified email/phone and fixed OTP. Skipping SMS for ${fullPhoneNumber}.`);
				otpSent = true;
				otpValue = "123456";
			} else {
				try {
					const { sendSignupOtp } = require("../helpers/otpSend");
					otpValue = await sendSignupOtp(user._id.toString(), fullPhoneNumber, 1, lang);
					otpSent = true;
					console.log("[USER:REGISTRATION] OTP sent to phone number via Msegat");
				} catch (otpError) {
					console.error("[USER:REGISTRATION] Error sending OTP to phone:", otpError.message);
					// Don't fail registration, but log the error
				}
			}

			// Generate verification token
			const emailService = require("../helpers/emailService");
			const EmailVerificationService = require("../services/emailVerificationService");

			const verificationToken = emailService.generateVerificationToken();
			const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

			// Save token
			await EmailVerificationService.CreateToken({
				token: verificationToken,
				user_id: user._id,
				user_type: "user",
				email: emailLower,
				expiresAt,
			});

			console.log("[USER:REGISTRATION] Verification token created");

			// Generate verification link
			const verificationLink = emailService.generateVerificationLink(
				verificationToken,
				1, // role: user
				lang
			);

			// Send verification email
			const emailHtml = emailService.renderGuestVerificationEmail(
				`${user.first_name} ${user.last_name}`,
				verificationLink,
				lang
			);

			const subject = lang === "ar" 
				? "تأكيد البريد الإلكتروني - Zuroona" 
				: "Verify your email address - Zuroona";

			console.log("[USER:REGISTRATION] Sending verification email to:", emailLower);
			console.log("[USER:REGISTRATION] Verification link:", verificationLink);

			const emailSent = await emailService.send(emailLower, subject, emailHtml);

			if (!emailSent) {
				console.error("[USER:REGISTRATION] Failed to send verification email, but user created");
				console.log("[USER:REGISTRATION] Manual verification link:", verificationLink);
			} else {
				console.log("[USER:REGISTRATION] Verification email sent successfully");
			}

			return Response.ok(
				res,
				{
					user: {
						_id: user._id,
						email: user.email,
						phone_number: user.phone_number,
						country_code: user.country_code,
						first_name: user.first_name,
						last_name: user.last_name,
						is_verified: false,
						phone_verified: false,
						email_verified: false,
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
					? "تم التسجيل بنجاح! يرجى التحقق من بريدك الإلكتروني ورقم الهاتف."
					: "Registration successful! Please verify your email address and enter the OTP sent to your phone number."
			);
		} catch (error) {
			console.error("[USER:REGISTRATION] Registration error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages(lang).internalServerError
			);
		}
	},
	userLogin: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const { email, password } = req.body;

			// Log request (excluding password)
			console.log("[USER:LOGIN] Login attempt for:", email);

			// Validate email
			if (!email || !email.includes("@")) {
				return Response.validationErrorResponse(
					res,
					resp_messages(lang).email_required || "Valid email address is required"
				);
			}

			// Validate password
			if (!password) {
				return Response.validationErrorResponse(
					res,
					resp_messages(lang).password_required || "Password is required"
				);
			}

			const emailLower = cleanEmail(email);

			// Find user by email (include password field for verification)
			const user = await UserService.FindOneService({
				email: emailLower,
				is_delete: { $ne: 1 },
			}).select("+password");

			if (!user) {
				console.log("[USER:LOGIN] User not found for email:", emailLower);
				return Response.unauthorizedResponse(
					res,
					resp_messages(lang).invalid_credentials || "Invalid email or password"
				);
			}

			console.log("[USER:LOGIN] User found:", {
				id: user._id,
				email: user.email,
				is_verified: user.is_verified,
			});

			// Check if email is verified
			if (!user.is_verified) {
				console.log("[USER:LOGIN] Email not verified");
				return Response.unauthorizedResponse(
					res,
					resp_messages(lang).email_not_verified || 
					"Please verify your email address before logging in. Check your inbox for the verification link."
				);
			}

			// Verify password
			const { matchPassword } = require("../helpers/hashPassword");
			const isPasswordValid = await matchPassword(password, user.password);

			if (!isPasswordValid) {
				console.log("[USER:LOGIN] Invalid password");
				return Response.unauthorizedResponse(
					res,
					resp_messages(lang).invalid_credentials || "Invalid email or password"
				);
			}

			console.log("[USER:LOGIN] Password verified successfully");

			// Generate JWT token
			const token = generateToken(user._id, user.role);

			// Remove password from response
			const userResponse = user.toObject();
			delete userResponse.password;

			return Response.ok(
				res,
				{
					token,
					user: userResponse,
				},
				200,
				resp_messages(lang).login_success || "Login successful!"
			);
		} catch (error) {
			console.error("[USER:LOGIN] Login error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages(lang).internalServerError
			);
		}
	},

	// Login using registered email + phone number, then send OTP (no restriction here)
	/**
	 * Login with email and password (unified for users and organizers)
	 * POST /user/login/by-email-phone
	 * Body: { email, password }
	 * 
	 * Constraints:
	 * - Email must be unique (already enforced in registration)
	 * - Email verification is COMPULSORY for both guest and organizer
	 * - Admin approval is COMPULSORY for organizer (in addition to email verification)
	 */
	userLoginByEmailPhone: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const { email, phone_number, country_code, password } = req.body;

			console.log("[USER:LOGIN] Login attempt for:", email || phone_number);

			// Password is required for secure login
			if (!password) {
				return Response.validationErrorResponse(
					res,
					resp_messages(lang).password_required || "Password is required"
				);
			}

			// Must provide either email or phone_number
			if (!email && !phone_number) {
				return Response.validationErrorResponse(
					res,
					resp_messages(lang).email_or_phone_required || "Email or phone number is required"
				);
			}

			// If email provided, validate it
			if (email && !email.includes("@")) {
				return Response.validationErrorResponse(
					res,
					resp_messages(lang).invalid_credentials || "Valid email is required"
				);
			}

			// If phone provided, validate country code (Saudi Arabia or Pakistan)
			if (phone_number && country_code !== "+966" && country_code !== "+92") {
				return Response.validationErrorResponse(
					res,
					resp_messages(lang).invalid_phone || "Only Saudi Arabia (+966) and Pakistan (+92) phone numbers are supported"
				);
			}

			// Clean email if provided
			const emailLower = email ? cleanEmail(email) : null;
			// Clean phone number if provided
			const phoneStr = phone_number ? phone_number.toString().replace(/\s+/g, '') : null;

			// Try to find user (guest) first - include password field for verification
			// Use model directly to allow .select("+password") chaining
			const User = require("../models/userModel");
			let user = null;
			if (emailLower) {
				user = await User.findOne({
					email: emailLower,
					is_delete: { $ne: 1 },
				}).select("+password");
			} else if (phoneStr && country_code) {
				user = await User.findOne({
					phone_number: phoneStr,
					country_code: country_code,
					is_delete: { $ne: 1 },
				}).select("+password");
			}

			// If not found as guest, try organizer - include password field
			// Use model directly to allow .select("+password") chaining
			const Organizer = require("../models/organizerModel");
			let organizer = null;
			if (!user) {
				if (emailLower) {
					organizer = await Organizer.findOne({
						email: emailLower,
						is_delete: { $ne: 1 },
					}).select("+password");
				} else if (phoneStr && country_code) {
					organizer = await Organizer.findOne({
						phone_number: phoneStr,
						country_code: country_code,
						is_delete: { $ne: 1 },
					}).select("+password");
				}
			}

			const account = user || organizer;

			if (!account) {
				console.log("[USER:LOGIN] Account not found for:", emailLower || phoneStr);
				return Response.unauthorizedResponse(
					res,
					resp_messages(lang).invalid_credentials || "Invalid email/phone or password"
				);
			}

			console.log("[USER:LOGIN] Account found:", {
				id: account._id,
				role: account.role,
				is_verified: account.is_verified,
				is_approved: account.is_approved,
			});

			// Verify password
			const { matchPassword } = require("../helpers/hashPassword");
			const isPasswordValid = await matchPassword(password, account.password);

			if (!isPasswordValid) {
				console.log("[USER:LOGIN] Invalid password");
				return Response.unauthorizedResponse(
					res,
					resp_messages(lang).invalid_credentials || "Invalid email or password"
				);
			}

			console.log("[USER:LOGIN] Password verified successfully");

			// Check if email is verified (COMPULSORY for both guest and organizer)
			if (!account.is_verified) {
				console.log("[USER:LOGIN] Email not verified");
				return Response.unauthorizedResponse(
					res,
					resp_messages(lang).email_not_verified || 
					"Please verify your email address before logging in. Check your inbox for the verification link."
				);
			}

			// For organizers, check approval status (COMPULSORY - both email verification AND approval required)
			if (account.role === 2) {
				// 1 = pending, 2 = approved, 3 = rejected
				if (account.is_approved === 1) {
					console.log("[USER:LOGIN] Organizer pending approval");
					return Response.unauthorizedResponse(
						res,
						{},
						401,
						resp_messages(lang).account_pending_approval ||
						"Your host profile is under review. Once approved, you will receive an email confirmation and then you can login to your account."
					);
				}

				if (account.is_approved === 3) {
					console.log("[USER:LOGIN] Organizer rejected");
					return Response.unauthorizedResponse(
						res,
						resp_messages(lang).account_rejected ||
						"Your account application was rejected. Please contact support for more information."
					);
				}

				if (account.is_approved !== 2) {
					console.log("[USER:LOGIN] Organizer not approved");
					return Response.unauthorizedResponse(
						res,
						resp_messages(lang).account_not_approved ||
						"Your account is not yet approved. Please wait for admin approval."
					);
				}
			}

			// Generate JWT token
			const token = generateToken(account._id, account.role);

			console.log("[USER:LOGIN] Login successful for:", emailLower || phoneStr);

			// Remove password from response - convert to plain object if needed
			const accountResponse = account.toObject ? account.toObject() : { ...account };
			delete accountResponse.password;

			return Response.ok(
				res,
				{
					token,
					user: {
						_id: accountResponse._id,
						email: accountResponse.email,
						first_name: accountResponse.first_name,
						last_name: accountResponse.last_name,
						phone_number: accountResponse.phone_number,
						country_code: accountResponse.country_code,
						role: accountResponse.role,
						is_verified: accountResponse.is_verified,
						is_approved: accountResponse.is_approved || null,
						profile_image: accountResponse.profile_image,
					},
				},
				200,
				resp_messages(lang).login_success || "Login successful"
			);
		} catch (error) {
			console.error("[USER:LOGIN] Login error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages(lang).internalServerError
			);
		}
	},

	/**
	 * Send OTP to phone number for login
	 * POST /user/login/phone/send-otp
	 */
	sendPhoneOTP: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const { phone_number, country_code } = req.body;

			console.log("[PHONE:LOGIN] OTP request for:", { phone_number, country_code });

			// Validate phone number
			if (!phone_number) {
				return Response.validationErrorResponse(
					res,
					resp_messages(lang).phone_required || "Phone number is required"
				);
			}

			// Validate country code (must be Saudi Arabia +966 or Pakistan +92)
			if (!country_code || (country_code !== "+966" && country_code !== "+92")) {
				return Response.validationErrorResponse(
					res,
					"Only Saudi Arabia (+966) and Pakistan (+92) phone numbers are allowed"
				);
			}

			// Validate phone number format using validation helper (supports +966 and +92)
			const { validatePhone } = require("../helpers/validationHelpers");
			const phoneValidation = validatePhone(phone_number, country_code);
			if (!phoneValidation.isValid) {
				return Response.validationErrorResponse(
					res,
					phoneValidation.message
				);
			}
			const phoneStr = phoneValidation.cleanPhone;

			// Format phone number for MSGATE - must match signup formatting
			let fullPhoneNumber;
			console.log(`[PHONE:LOGIN] Phone formatting - phoneStr: "${phoneStr}", length: ${phoneStr.length}, country: ${country_code}`);
			
			if (country_code === "+92") {
				// Pakistan: Format exactly as done in registration
				if (phoneStr.length === 10 && phoneStr.startsWith('0')) {
					// 10 digits starting with 0: Remove 0 and use 9 digits
					const numberWithoutZero = phoneStr.substring(1);
					fullPhoneNumber = `${country_code}${numberWithoutZero}`;
					console.log(`[PHONE:LOGIN] 10-digit number with leading 0: "${phoneStr}" -> Removed 0 -> "${numberWithoutZero}" -> ${fullPhoneNumber}`);
				}
				else if (phoneStr.length === 10 && !phoneStr.startsWith('0')) {
					// 10 digits without leading 0: Use as-is -> +923054717775
					fullPhoneNumber = `${country_code}${phoneStr}`;
				}
				else if (phoneStr.length === 9) {
					// 9 digits: MSGATE needs 10 digits for Pakistan - reject
					throw new Error(`Invalid Pakistan phone number format. MSGATE requires 10 digits after +92, but received only ${phoneStr.length} digits. Please enter the complete 10-digit number (e.g., 3054717775).`);
				}
				else {
					// Unexpected length: use as is
					fullPhoneNumber = `${country_code}${phoneStr}`;
					console.log(`[PHONE:LOGIN] Warning: Unexpected phone length: ${phoneStr.length} digits`);
				}
			} else {
				// Saudi numbers: use as is
				fullPhoneNumber = `${country_code}${phoneStr}`;
			}
			
			console.log(`[PHONE:LOGIN] Formatted phone for OTP: ${fullPhoneNumber} (original: "${phoneStr}", length: ${phoneStr.length}, country: ${country_code})`);

			// Ensure MongoDB connection before database operations
			const { ensureConnection } = require("../config/database");
			await ensureConnection();

			// Check if user exists with this phone number
			const User = require("../models/userModel");
			const Organizer = require("../models/organizerModel");

			const user = await User.findOne({
				phone_number: parseInt(phoneStr),
				country_code: country_code,
				is_delete: { $ne: 1 }
			});

			const organizer = await Organizer.findOne({
				phone_number: parseInt(phoneStr),
				country_code: country_code,
				is_delete: { $ne: 1 }
			});

			// Check for deleted or suspended accounts (even if is_delete = 1, we still want to show error)
			const deletedUser = await User.findOne({
				phone_number: parseInt(phoneStr),
				country_code: country_code,
				is_delete: 1
			});

			const deletedOrganizer = await Organizer.findOne({
				phone_number: parseInt(phoneStr),
				country_code: country_code,
				is_delete: 1
			});

			const suspendedUser = await User.findOne({
				phone_number: parseInt(phoneStr),
				country_code: country_code,
				is_suspended: true,
				is_delete: { $ne: 1 }
			});

			const suspendedOrganizer = await Organizer.findOne({
				phone_number: parseInt(phoneStr),
				country_code: country_code,
				is_suspended: true,
				is_delete: { $ne: 1 }
			});

			if (deletedUser || deletedOrganizer || suspendedUser || suspendedOrganizer) {
				return Response.conflictResponse(
					res,
					{
						phone_number: phone_number,
						account_status: deletedUser || deletedOrganizer ? "deleted" : "suspended"
					},
					409,
					"This phone number was previously used with a deleted or suspended account. Please use a different phone number or contact the Zuroona admin team at infozuroona@gmail.com to reactivate your account."
				);
			}

			if (!user && !organizer) {
				return Response.notFoundResponse(
					res,
					"No account found with this phone number. Please register first."
				);
			}

			const account = user || organizer;

			// Check if account is fully verified (both email AND phone must be verified for login)
			if (!account.is_verified) {
				const needsEmail = !account.email_verified_at;
				const needsPhone = !account.phone_verified;
				
				if (needsEmail && needsPhone) {
					return Response.unauthorizedResponse(
						res,
						lang === "ar"
							? "يرجى التحقق من بريدك الإلكتروني ورقم الهاتف أولاً"
							: "Please verify both your email address and phone number before logging in."
					);
				} else if (needsEmail) {
					return Response.unauthorizedResponse(
						res,
						lang === "ar"
							? "يرجى التحقق من بريدك الإلكتروني أولاً"
							: "Please verify your email address first. Check your inbox for the verification link."
					);
				} else if (needsPhone) {
					return Response.unauthorizedResponse(
						res,
						lang === "ar"
							? "يرجى التحقق من رقم الهاتف أولاً"
							: "Please verify your phone number first."
					);
				}
			}

		// Send OTP via Msegat
		const { sendOtpToPhone } = require("../helpers/otpSend");
		let otpGenerated = false;
		let otpValue = null;
		
		try {
			otpValue = await sendOtpToPhone(fullPhoneNumber, lang);
			otpGenerated = true;
		} catch (otpError) {
			console.error("[PHONE:LOGIN] Error in sendOtpToPhone:", otpError.message);
			// In development, allow OTP generation even if SMS fails
			if (process.env.NODE_ENV === 'development' || process.env.ALLOW_OTP_WITHOUT_SMS === 'true') {
				console.warn("[PHONE:LOGIN] Development mode: OTP generation allowed despite SMS failure");
				// OTP might still be generated, check console logs
				otpGenerated = true;
			} else {
				// In production, return error if SMS fails
				throw otpError;
			}
		}

		if (otpGenerated) {
			return Response.ok(
				res,
				{
					message: resp_messages(lang).otp_sent_phone,
					phone_number: phoneStr, // Return without country code for security
					...(process.env.NODE_ENV === 'development' && otpValue ? { 
						debug_otp: otpValue // Only in development
					} : {})
				},
				200,
				resp_messages(lang).otp_sent_phone
			);
		} else {
			throw new Error("Failed to generate OTP");
		}
	} catch (error) {
		console.error("[PHONE:LOGIN] Error sending OTP:", error);
		return Response.serverErrorResponse(
			res,
			error.message || resp_messages(lang).internalServerError || "Failed to send OTP. Please try again later."
		);
	}
	},

	/**
	 * Verify OTP and login with phone number
	 * POST /user/login/phone/verify-otp
	 */
	verifyPhoneOTP: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const { phone_number, country_code, otp } = req.body;

			console.log("[PHONE:LOGIN] OTP verification for:", { phone_number, country_code });

			// Validate inputs
			if (!phone_number || !country_code || !otp) {
				return Response.validationErrorResponse(
					res,
					"Phone number, country code, and OTP are required"
				);
			}

			// Validate country code (must be Saudi Arabia +966 or Pakistan +92)
			if (country_code !== "+966" && country_code !== "+92") {
				return Response.validationErrorResponse(
					res,
					"Only Saudi Arabia (+966) and Pakistan (+92) phone numbers are allowed"
				);
			}

			// Validate and format phone number
			const { validatePhone } = require("../helpers/validationHelpers");
			const phoneValidation = validatePhone(phone_number, country_code);
			if (!phoneValidation.isValid) {
				return Response.validationErrorResponse(
					res,
					phoneValidation.message
				);
			}
			const phoneStr = phoneValidation.cleanPhone;

			// Format phone number for MSGATE - must match signup formatting
			let fullPhoneNumber;
			console.log(`[PHONE:LOGIN:VERIFY] Phone formatting - phoneStr: "${phoneStr}", length: ${phoneStr.length}, country: ${country_code}`);
			
			if (country_code === "+92") {
				// Pakistan: Format exactly as done in registration
				if (phoneStr.length === 10 && phoneStr.startsWith('0')) {
					// 10 digits starting with 0: Remove 0 and use 9 digits
					const numberWithoutZero = phoneStr.substring(1);
					fullPhoneNumber = `${country_code}${numberWithoutZero}`;
				}
				else if (phoneStr.length === 10 && !phoneStr.startsWith('0')) {
					// 10 digits without leading 0: Use as-is
					fullPhoneNumber = `${country_code}${phoneStr}`;
				}
				else if (phoneStr.length === 9) {
					// 9 digits: Use as-is
					fullPhoneNumber = `${country_code}${phoneStr}`;
				}
				else {
					fullPhoneNumber = `${country_code}${phoneStr}`;
				}
			} else {
				// Saudi numbers: use as is
				fullPhoneNumber = `${country_code}${phoneStr}`;
			}
			
			console.log(`[PHONE:LOGIN:VERIFY] Formatted phone for verification: ${fullPhoneNumber}`);

			// Verify OTP
			const { verifyLoginOtp } = require("../helpers/otpSend");
			await verifyLoginOtp(fullPhoneNumber, otp.toString());

			// Ensure MongoDB connection before database operations
			const { ensureConnection } = require("../config/database");
			await ensureConnection();

			// Find user by phone number
			// Note: Database stores phone_number as integer (parseInt removes leading 0)
			// So "0305471777" becomes 305471777 in database
			const User = require("../models/userModel");
			const Organizer = require("../models/organizerModel");

			// Convert phoneStr to integer for database lookup (matches how it was stored)
			const phoneNumberForLookup = parseInt(phoneStr);

			// Check for deleted or suspended accounts first
			const deletedUser = await User.findOne({
				phone_number: phoneNumberForLookup,
				country_code: country_code,
				is_delete: 1
			});

			const deletedOrganizer = await Organizer.findOne({
				phone_number: phoneNumberForLookup,
				country_code: country_code,
				is_delete: 1
			});

			const suspendedUser = await User.findOne({
				phone_number: phoneNumberForLookup,
				country_code: country_code,
				is_suspended: true,
				is_delete: { $ne: 1 }
			});

			const suspendedOrganizer = await Organizer.findOne({
				phone_number: phoneNumberForLookup,
				country_code: country_code,
				is_suspended: true,
				is_delete: { $ne: 1 }
			});

			if (deletedUser || deletedOrganizer || suspendedUser || suspendedOrganizer) {
				return Response.conflictResponse(
					res,
					{
						phone_number: phone_number,
						account_status: deletedUser || deletedOrganizer ? "deleted" : "suspended"
					},
					409,
					"This phone number was previously used with a deleted or suspended account. Please use a different phone number or contact the Zuroona admin team at infozuroona@gmail.com to reactivate your account."
				);
			}

			let account = await User.findOne({
				phone_number: phoneNumberForLookup,
				country_code: country_code,
				is_delete: { $ne: 1 }
			});

			let role = 1; // User/Guest

			if (!account) {
				account = await Organizer.findOne({
					phone_number: phoneNumberForLookup,
					country_code: country_code,
					is_delete: { $ne: 1 }
				});
				role = 2; // Organizer/Host
			}

			if (!account) {
				return Response.notFoundResponse(
					res,
					"Account not found with this phone number"
				);
			}

			console.log("[PHONE:LOGIN] Account found:", {
				id: account._id,
				role: account.role,
				is_verified: account.is_verified,
				email_verified_at: account.email_verified_at,
				phone_verified: account.phone_verified,
				is_approved: account.is_approved,
			});

			// Step 1: Check phone verification (phone login requires phone verification)
			if (!account.phone_verified) {
				return Response.unauthorizedResponse(
					res,
					lang === "ar"
						? "يرجى التحقق من رقم الهاتف أولاً"
						: "Please verify your phone number first."
				);
			}

			// Step 2: Check email verification (COMPULSORY for both Guest and Host)
			const emailNotVerified = !account.email_verified_at;
			
			if (emailNotVerified) {
				// Guest User (role 1)
				if (account.role === 1) {
					return Response.unauthorizedResponse(
						res,
						lang === "ar"
							? "يرجى التحقق من عنوان بريدك الإلكتروني أولاً"
							: "Please verify your email address first."
					);
				}
				
				// Host User (role 2)
				if (account.role === 2) {
					return Response.unauthorizedResponse(
						res,
						lang === "ar"
							? "يرجى التحقق من عنوان بريدك الإلكتروني"
							: "Please verify your email address."
					);
				}
			}

			// Step 3: For Host users, check admin approval (COMPULSORY - only after email verification)
			if (account.role === 2) {
				// 1 = pending, 2 = approved, 3 = rejected
				if (account.is_approved === 1) {
					return Response.unauthorizedResponse(
						res,
						{},
						401,
						lang === "ar"
							? "حسابك قيد المراجعة من قبل الإدارة. بمجرد الموافقة، ستصلك رسالة تأكيد على بريدك الإلكتروني ويمكنك بعدها تسجيل الدخول إلى حسابك."
							: "Your host profile is under review. Once approved, you will receive an email confirmation and then you can login to your account."
					);
				}

				if (account.is_approved === 3) {
					return Response.unauthorizedResponse(
						res,
						lang === "ar"
							? "تم رفض طلب حسابك. يرجى الاتصال بالدعم لمزيد من المعلومات."
							: "Your account application was rejected. Please contact support for more information."
					);
				}

				if (account.is_approved !== 2) {
					return Response.unauthorizedResponse(
						res,
						{},
						401,
						lang === "ar"
							? "حسابك قيد المراجعة من قبل الإدارة. بمجرد الموافقة، ستصلك رسالة تأكيد على بريدك الإلكتروني ويمكنك بعدها تسجيل الدخول إلى حسابك."
							: "Your host profile is under review. Once approved, you will receive an email confirmation and then you can login to your account."
					);
				}
			}

			// Generate JWT token
			const token = generateToken(account._id, account.role);

			console.log("[PHONE:LOGIN] Login successful via phone");

			// Remove password from response
			const accountResponse = account.toObject ? account.toObject() : { ...account };
			delete accountResponse.password;

			// Prepare response (only reach here if all checks passed)
			const responseData = {
				token,
				user: role === 1 ? {
					_id: accountResponse._id,
					email: accountResponse.email,
					first_name: accountResponse.first_name,
					last_name: accountResponse.last_name,
					phone_number: accountResponse.phone_number,
					country_code: accountResponse.country_code,
					role: accountResponse.role,
					is_verified: accountResponse.is_verified,
					email_verified_at: accountResponse.email_verified_at,
					phone_verified: accountResponse.phone_verified,
					profile_image: accountResponse.profile_image,
				} : {
					_id: accountResponse._id,
					email: accountResponse.email,
					first_name: accountResponse.first_name,
					last_name: accountResponse.last_name,
					phone_number: accountResponse.phone_number,
					country_code: accountResponse.country_code,
					role: accountResponse.role,
					is_verified: accountResponse.is_verified,
					email_verified_at: accountResponse.email_verified_at,
					phone_verified: accountResponse.phone_verified,
					is_approved: accountResponse.is_approved,
					profile_image: accountResponse.profile_image,
				},
			};

			return Response.ok(
				res,
				responseData,
				200,
				lang === "ar" ? "تم تسجيل الدخول بنجاح" : "Login successful"
			);
		} catch (error) {
			console.error("[PHONE:LOGIN] Error verifying OTP:", error);
			return Response.serverErrorResponse(
				res,
				error.message || resp_messages(lang).internalServerError
			);
		}
	},

	// userLogin: async (req, res) => {
	//     custom_log.success("login method called ");
	//     const lang = req.headers['lang'] || 'en';

	//     try {
	//         const { phone_number, country_code } = req.body;

	//         // Run both queries in parallel
	//         const [user, organizer] = await Promise.all([
	//             UserService.FindOneService({ phone_number, country_code }),
	//             organizerService.FindOneService({ phone_number, country_code })
	//         ]);

	//         if (!user && !organizer) {
	//             return Response.notFoundResponse(res, resp_messages(lang).user_not_found);
	//         }

	//         const result = user || organizer;
	//         const token = generateToken(result._id, result.role);

	//         // Send response
	//         return Response.ok(res, {
	//             token,
	//             result,
	//             is_approved: result.is_approved || null
	//         }, 200, resp_messages(lang).otp_sent_phone);

	//     } catch (error) {
	//         console.log(error.message);
	//         return Response.serverErrorResponse(res, resp_messages(lang).internalServerError);
	//     }
	// },

	// OTP verification removed - using email verification only
	updateProfile: async (req, res) => {
		try {
			const { userId } = req;

			const user = await UserService.FindByIdAndUpdateService(
				userId,
				req.body
			);
			if (!user) {
				return Response.notFoundResponse(
					res,
					resp_messages(req.lang).user_not_found
				);
			}
			const token = generateToken(user._id, user.role);
			return Response.ok(
				res,
				{ user, token },
				200,
				resp_messages(req.lang).profileUpdated
			);
		} catch (error) {
			console.log(error);
			return Response.serverErrorResponse(
				res,
				resp_messages(req.lang).internalServerError
			);
		}
	},
	getProfile: async (req, res) => {
		try {
			const { userId, role, lang } = req;
			const service = role == 1 ? UserService : organizerService;
			const _users = await service.FindOneService({ _id: userId });
			const user = await service.AggregateService([
				{ $match: { _id: new mongoose.Types.ObjectId(userId) } },
				{
					$lookup: {
						from: "group_categories",
						localField: "group_category",
						foreignField: "_id",
						as: "group_category",
						pipeline: [
							{
								$project: {
									selected_image: 1,
									unselected_image: 1,
									createdAt: 1,
									updatedAt: 1,
									name: {
										$cond: {
											if: { $eq: [lang, "en"] },
											then: "$name.en",
											else: "$name.ar",
										},
									},
								},
							},
							{
								$sort: { name: 1 },
							},
						],
					},
				},
				{
					$lookup: {
						from: "organizer_bank_details",
						localField: "_id",
						foreignField: "organizer_id",
						as: "bank_details",
					},
				},
				{
					$unwind: {
						path: "$bank_details",
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$project: {
						group_category: "$group_category",
						bio: 1,
						first_name: 1,
						last_name: 1,
						address: 1,
						country_code: 1,
						phone_number: 1,
						gender: 1,
						email: 1,
						bank_details: "$bank_details",
						profile_image: 1,
						role: 1,
						registration_step: 1,
						language: 1,
						createdAt: 1,
						updatedAt: 1,
						is_approved: 1,
						isActive: 1,
						description: 1,
						govt_id: 1,
						fcm_token: 1,
						group_name: 1,
						date_of_birth: 1,
						group_location: {
							$map: {
								input: "$group_location",
								as: "location",
								in: {
									_id: "$$location._id",
									latitude: {
										$arrayElemAt: [
											"$$location.location.coordinates",
											1,
										],
									},
									longitude: {
										$arrayElemAt: [
											"$$location.location.coordinates",
											0,
										],
									},
									city_name: "$$location.city_name",
								},
							},
						},
					},
				},
			]);

			const token = generateToken(user[0]._id, user[0].role);
			return Response.ok(
				res,
				{ user: user[0], token },
				200,
				resp_messages(req.lang).profile_access
			);
		} catch (error) {
			console.log(error);
			return Response.serverErrorResponse(
				res,
				resp_messages(req.lang).internalServerError
			);
		}
	},
	// OTP sending removed - using email-based authentication only
	
	/**
	 * Forgot Password - Send password reset email
	 * POST /user/forgot-password
	 * Body: { email }
	 */
	forgotPassword: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const { email } = req.body;

			console.log("[USER:FORGOT-PASSWORD] Request for:", email);

			// Validate email
			if (!email || !email.includes("@")) {
				return Response.validationErrorResponse(
					res,
					resp_messages(lang).email_required || "Valid email address is required"
				);
			}

			const emailLower = cleanEmail(email);

			// Find user by email
			const user = await UserService.FindOneService({
				email: emailLower,
				is_delete: { $ne: 1 },
			});

			// Find organizer by email
			const organizer = await organizerService.FindOneService({
				email: emailLower,
				is_delete: { $ne: 1 },
			});

			const account = user || organizer;

			if (!account) {
				// Don't reveal if email exists for security
				console.log("[USER:FORGOT-PASSWORD] Account not found (security: not revealing)");
				return Response.ok(
					res,
					{},
					200,
					"If an account with this email exists, a password reset link has been sent."
				);
			}

			console.log("[USER:FORGOT-PASSWORD] Account found:", {
				id: account._id,
				role: account.role,
			});

			const emailService = require("../helpers/emailService");
			const EmailVerificationService = require("../services/emailVerificationService");

			// Delete old reset tokens
			await EmailVerificationService.DeleteUserTokens(
				account._id,
				account.role === 1 ? "user" : "organizer"
			);

			// Generate reset token
			const resetToken = emailService.generateVerificationToken();
			const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

			// Save token
			await EmailVerificationService.CreateToken({
				token: resetToken,
				user_id: account._id,
				user_type: account.role === 1 ? "user" : "organizer",
				email: emailLower,
				expiresAt,
				token_type: "password_reset", // Mark as password reset token
			});

			// Generate reset link
			const resetLink = emailService.generatePasswordResetLink(
				resetToken,
				account.role,
				account.language || lang
			);

			// Send email
			const emailHtml = emailService.renderPasswordResetEmail(
				`${account.first_name} ${account.last_name}`,
				resetLink,
				account.language || lang
			);

			const subject = (account.language || lang) === "ar" 
				? "إعادة تعيين كلمة المرور - Zuroona" 
				: "Password Reset Request - Zuroona";

			console.log("[USER:FORGOT-PASSWORD] Sending reset email to:", emailLower);

			const emailSent = await emailService.send(emailLower, subject, emailHtml);

			return Response.ok(
				res,
				{
					email: emailLower,
					reset_sent: emailSent,
				},
				200,
				emailSent 
					? (resp_messages(lang).password_reset_sent || "If an account with this email exists, a password reset link has been sent to your email.")
					: (resp_messages(lang).password_reset_failed || "Failed to send password reset email. Please try again later.")
			);
		} catch (error) {
			console.error("[USER:FORGOT-PASSWORD] Error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages(lang).internalServerError
			);
		}
	},

	/**
	 * Reset Password - Reset password using token
	 * POST /user/reset-password
	 * Body: { token, new_password, confirmPassword }
	 */
	resetPassword: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const { token, new_password, confirmPassword } = req.body;

			console.log("[USER:RESET-PASSWORD] Reset request received");

			// Validate token
			if (!token) {
				return Response.validationErrorResponse(
					res,
					resp_messages(lang).token_required || "Reset token is required"
				);
			}

			// Validate password
			if (!new_password) {
				return Response.validationErrorResponse(
					res,
					resp_messages(lang).password_required || "New password is required"
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
					resp_messages(lang).invalid_token || "Invalid or expired reset token"
				);
			}

			// Check if token is for password reset
			if (tokenRecord.token_type !== "password_reset") {
				return Response.unauthorizedResponse(
					res,
					resp_messages(lang).invalid_token || "Invalid reset token"
				);
			}

			// Determine service based on user_type
			const service = tokenRecord.user_type === "user" ? UserService : organizerService;

			// Find account
			const account = await service.FindOneService({
				_id: tokenRecord.user_id,
				is_delete: { $ne: 1 },
			}).select("+password");

			if (!account) {
				return Response.notFoundResponse(
					res,
					resp_messages(lang).user_not_found || "Account not found"
				);
			}

			// Hash new password
			const { hashPassword } = require("../helpers/hashPassword");
			const hashedPassword = await hashPassword(new_password);

			// Update password
			account.password = hashedPassword;
			await account.save();

			// Mark token as used
			await EmailVerificationService.MarkAsUsed(tokenRecord._id);

			console.log("[USER:RESET-PASSWORD] Password reset successful for:", account.email);

			return Response.ok(
				res,
				{},
				200,
				resp_messages(lang).password_reset_success || "Password reset successfully. You can now login with your new password."
			);
		} catch (error) {
			console.error("[USER:RESET-PASSWORD] Error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages(lang).internalServerError
			);
		}
	},
	profileLogout: async (req, res) => {
		try {
			const { userId, role } = req;
			const service = role == 1 ? UserService : organizerService;

			const user = await service.FindOneService({ _id: userId });

			if (!user) {
				return Response.notFoundResponse(
					res,
					resp_messages(req.lang).user_not_found
				);
			}
			// const token = generateToken(user._id, user.role);
			user.fcm_token = "";
			await user.save();

			return Response.ok(res, {}, 200, resp_messages(req.lang).logout);
		} catch (error) {
			return Response.serverErrorResponse(
				res,
				resp_messages(req.lang).internalServerError
			);
		}
	},
	profileDelete: async function (req, res) {
		try {
			const { userId, role } = req;
			const service = role == 1 ? UserService : organizerService;

			const user = await service.FindOneService({ _id: userId });
			if (!user) {
				return Response.notFoundResponse(
					res,
					resp_messages(req.lang).user_not_found
				);
			}
			if (!mongoose.Types.ObjectId.isValid(userId)) {
				return Response.badRequestResponse(
					res,
					resp_messages(req.lang).id_required
				);
			}
			// Mark as deleted instead of actually deleting to prevent email/phone reuse
			user.is_delete = 1;
			user.isActive = 2; // Set to inactive
			await user.save();

			return Response.ok(
				res,
				{},
				200,
				resp_messages(req.lang).profileDelete
			);
		} catch (error) {
			console.log(error.message);
			return Response.serverErrorResponse(
				res,
				resp_messages(req.lang).internalServerError
			);
		}
	},
	checkEmailFormat: async (req, res) => {
		const _lang = req.headers["lang"] || "en";
		try {
			const { email } = req.body;

			if (!email) {
				return Response.validationErrorResponse(
					res,
					"Email is required"
				);
			}

			const { validateGmailFormat, verifyGmailExistence } = require("../helpers/emailExistenceService");
			
			// First validate format
			const formatValidation = validateGmailFormat(email);
			if (!formatValidation.isValid) {
				return Response.ok(
					res,
					{
						isValid: false,
						exists: false,
						message: formatValidation.message,
						status: "invalid_format"
					},
					200,
					formatValidation.message
				);
			}

			// If format is valid, check existence
			const existenceCheck = await verifyGmailExistence(email);
			
			return Response.ok(
				res,
				{
					isValid: true,
					exists: existenceCheck.exists,
					message: existenceCheck.message,
					status: existenceCheck.exists ? "valid" : "not_exists",
					canSendVerification: existenceCheck.canSendVerification || false
				},
				200,
				existenceCheck.message
			);

		} catch (error) {
			console.error("[CHECK_EMAIL] Error:", error);
			return Response.serverErrorResponse(
				res,
				"Error checking email. Please try again."
			);
		}
	},

	eventList: async (req, res) => {
		const token = req.headers["authorization"];
		const lang = req.lang || req.headers["lang"] || "en";
		const messages = resp_messages(lang);
		try {
			const {
				page = 1,
				limit = 10,
				event_type = 1,
				_search = "",
				event_category,
			} = req.query;
			let gender;

			if (token) {
				const decoded = verifyToken(token);
				const userId = decoded.userId;
				const user = await UserService.FindOneService({ _id: userId });
				gender = user.gender;
			}

			const skip = (parseInt(page) - 1) * parseInt(limit);
			const date = new Date();

			let val = gender == 1 ? [1, 3] : gender == 2 ? [2, 3] : [3];

			// If event_type is 0, fetch both types (1 and 2)
			const eventTypeValue = Number(event_type);
			const eventTypeQuery = eventTypeValue === 0 ? { $in: [1, 2] } : eventTypeValue;

			const search_query = {
				$and: [
					{ event_date: { $gte: new Date(date) } },
					{ event_type: eventTypeQuery },
					{ event_for: { $in: val } },
					{ is_approved: 1 }, // Only show approved events to guests
				],
			};
			if (event_category) {
				// Support both string categories (new format) and ObjectId (old format for backward compatibility)
				const categoryQuery = mongoose.Types.ObjectId.isValid(event_category) 
					? new mongoose.Types.ObjectId(event_category)
					: event_category;
				search_query.$and.push({
					event_category: categoryQuery,
				});
			}
			console.log(search_query);
			console.log("i have add a console on query");

			const total_count = await EventService.CountDocumentService(
				search_query
			);

			const results = await EventService.AggregateService([
				{ $match: search_query },
				{
					$project: {
						event_date: 1,
						no_of_attendees: 1,
						event_start_time: 1,
						event_end_time: 1,
						event_name: 1,
						event_image: 1,
						event_address: 1,
						longitude: 1,
						latitude: 1,
						event_price: 1,
						event_type: 1,
						createdAt: 1,
						updatedAt: 1,
						event_category: 1,
						event_for: 1,
					},
				},
				{ $sort: { createdAt: -1 } },
				{ $skip: skip },
				{ $limit: parseInt(limit) },
			]);

			const event_ids = results.map((result) => result._id);

			const booked_event = await BookEventService.AggregateService([
				{
					$match: {
						event_id: { $in: event_ids },
					},
				},
				{
					$lookup: {
						from: "users",
						localField: "user_id",
						foreignField: "_id",
						as: "booked_user",
					},
				},
				{
					$project: {
						event_id: 1,
						"booked_user._id": 1,
						"booked_user.first_name": 1,
						"booked_user.last_name": 1,
						"booked_user.profile_image": 1,
					},
				},
			]);

			const bookedEventsMap = booked_event.reduce((map, booking) => {
				if (!map[booking.event_id]) {
					map[booking.event_id] = [];
				}
				const attendees = booking.booked_user.map((user) => ({
					_id: user._id,
					first_name: user.first_name,
					last_name: user.last_name,
					profile_image: user.profile_image,
				}));
				map[booking.event_id].push(...attendees);
				return map;
			}, {});

			const finalResults = results.map((event) => ({
				...event,
				attendees: bookedEventsMap[event._id] || [],
			}));

			return Response.ok(
				res,
				finalResults,
				200,
				messages.fetched_data,
				total_count
			);
		} catch (error) {
			console.log(error);
			return Response.serverErrorResponse(
				res,
				messages.internalServerError
			);
		}
	},
	eventDetail: async (req, res) => {
		const lang = req.lang || req.headers["lang"] || "en";
		const messages = resp_messages(lang);
		try {
			const { event_id } = req.query;
			const { userId } = req; // Get the current user's ID

			console.log("userId", userId);

			if (!mongoose.Types.ObjectId.isValid(event_id)) {
				return Response.badRequestResponse(
					res,
					messages.id_required
				);
			}
			const event = await EventService.AggregateService([
				{ $match: { _id: new mongoose.Types.ObjectId(event_id) } },
				{
					$lookup: {
						from: "book_event",
						localField: "_id",
						foreignField: "event_id",
						as: "attendees",
					},
				},
				{
					$lookup: {
						from: "users",
						localField: "attendees.user_id",
						foreignField: "_id",
						as: "attendees_info",
					},
				},
				{
					$lookup: {
						from: "organizers",
						localField: "organizer_id",
						foreignField: "_id",
						as: "organizer",
					},
				},
				{
					$unwind: {
						path: "$organizer",
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$unwind: {
						path: "$attendees_info",
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$group: {
						_id: "$_id",
						event_date: { $first: "$event_date" },
						event_category: { $first: "$event_category" },
						event_for: { $first: "$event_for" },
						event_start_time: { $first: "$event_start_time" },
						event_end_time: { $first: "$event_end_time" },
						event_name: { $first: "$event_name" },
						event_image: { $first: "$event_image" },
						event_description: { $first: "$event_description" },
						event_address: { $first: "$event_address" },
						no_of_attendees: { $first: "$no_of_attendees" },
						event_price: { $first: "$event_price" },
						dos_instruction: { $first: "$dos_instruction" },
						do_not_instruction: { $first: "$do_not_instruction" },
						event_type: { $first: "$event_type" },
						createdAt: { $first: "$createdAt" },
						updatedAt: { $first: "$updatedAt" },
						organizer: { $first: "$organizer" },
						attendees_info: { $push: "$attendees_info" },
						location: { $first: "$location.coordinates" },
					},
				},
				{
					$project: {
						_id: 1,
						event_date: 1,
						event_start_time: 1,
						event_end_time: 1,
						event_name: 1,
						event_image: 1,
						event_description: 1,
						event_address: 1,
						no_of_attendees: 1,
						event_price: 1,
						dos_instruction: 1,
						do_not_instruction: 1,
						event_type: 1,
						event_for: 1,
						createdAt: 1,
						updatedAt: 1,
						event_category: 1,
						"organizer.first_name": "$organizer.first_name",
						"organizer.last_name": "$organizer.last_name",
						"organizer.country_code": "$organizer.country_code",
						"organizer.phone_number": "$organizer.phone_number",
						"organizer.email": "$organizer.email",
						"organizer.profile_image": "$organizer.profile_image",
						"organizer._id": "$organizer._id",
						attendees: {
							$map: {
								input: "$attendees_info",
								as: "attendee",
								in: {
									first_name: "$$attendee.first_name",
									last_name: "$$attendee.last_name",
									profile_image: "$$attendee.profile_image",
									_id: "$$attendee._id",
								},
							},
						},
						longitude: { $arrayElemAt: ["$location", 0] },
						latitude: { $arrayElemAt: ["$location", 1] },
					},
				},
			]);

			if (!event || event.length === 0) {
				return Response.notFoundResponse(
					res,
					messages.data_not_found
				);
			}

			const event_category_id = event[0].event_category;
			const event_data = event[0];
			event_data.related_events = [];

			if (event_category_id) {
				const related_events = await EventService.AggregateService([
					{
						$match: {
							event_category: event_category_id,
							_id: { $ne: new mongoose.Types.ObjectId(event_id) },
						},
					},

					{
						$lookup: {
							from: "book_event",
							localField: "_id",
							foreignField: "event_id",
							as: "attendees",
						},
					},
					{
						$lookup: {
							from: "users",
							localField: "attendees.user_id",
							foreignField: "_id",
							as: "attendees_info",
						},
					},
					{
						$project: {
							_id: 1,
							event_date: 1,
							event_start_time: 1,
							event_end_time: 1,
							event_name: 1,
							event_image: 1,
							event_description: 1,
							event_address: 1,
							no_of_attendees: 1,
							event_price: 1,
							dos_instruction: 1,
							do_not_instruction: 1,
							event_type: 1,
							createdAt: 1,
							updatedAt: 1,
							event_category: 1,
							attendees: {
								$map: {
									input: "$attendees_info",
									as: "attendee",
									in: {
										first_name: "$$attendee.first_name",
										last_name: "$$attendee.last_name",
										profile_image:
											"$$attendee.profile_image",
										_id: "$$attendee._id",
									},
								},
							},
						},
					},
				]);
				event_data.related_events = related_events;
			}

			// Check if the current user has a booking for this event
			if (userId) {
				const userBooking = await BookEventService.AggregateService([
					{
						$match: {
							event_id: new mongoose.Types.ObjectId(event_id),
							user_id: new mongoose.Types.ObjectId(userId),
							book_status: { $ne: 3 }, // Not canceled bookings
						},
					},
					{
						$project: {
							_id: 1,
							no_of_attendees: 1,
							total_amount_attendees: 1,
							total_tax_attendees: 1,
							total_amount: 1,
							book_status: 1,
							payment_status: 1,
							order_id: 1,
							createdAt: 1,
							updatedAt: 1,
						},
					},
				]);

				// If user has a booking, add it to the response
				if (userBooking && userBooking.length > 0) {
					event_data.user_booking = userBooking[0];
				}
			}

			return Response.ok(
				res,
				event_data,
				200,
				messages.fetched_data
			);
		} catch (error) {
			console.error(error);
			return Response.serverErrorResponse(
				res,
				messages.internalServerError
			);
		}
	},
	bookEvent: async (req, res) => {
		try {
			const { userId } = req;

			const { event_id, no_of_attendees } = req.body;

			// Validate input
			if (!event_id) {
				return Response.validationErrorResponse(
					res,
					resp_messages(req.lang).invalid_event_id || "Event ID is required"
				);
			}

			// Check if it's a dummy event ID
			if (typeof event_id === 'string' && event_id.startsWith('dummy')) {
				return Response.badRequestResponse(
					res,
					resp_messages(req.lang).dummy_event_not_bookable || "This is a demo event and cannot be booked. Please select a real event."
				);
			}

			if (!no_of_attendees || no_of_attendees < 1) {
				return Response.validationErrorResponse(
					res,
					resp_messages(req.lang).invalid_attendees || "Number of attendees must be at least 1"
				);
			}

			const taxRate = 0;

			const user = await UserService.FindOneService({ _id: userId });

			if (!user) {
				return Response.notFoundResponse(
					res,
					resp_messages(req.lang).user_not_found
				);
			}

			// Validate event_id format (MongoDB ObjectId)
			const mongoose = require("mongoose");
			if (!mongoose.Types.ObjectId.isValid(event_id)) {
				return Response.validationErrorResponse(
					res,
					resp_messages(req.lang).invalid_event_id || "Invalid event ID format"
				);
			}

			const exist_event = await EventService.FindOneService({
				_id: event_id,
			});

			if (!exist_event) {
				return Response.notFoundResponse(
					res,
					resp_messages(req.lang).event_not_found || "Event not found"
				);
			}

			// Calculate already booked seats (only count confirmed/pending bookings, not cancelled/rejected)
			const bookedSeatsResult = await BookEventService.AggregateService([
				{
					$match: {
						event_id: new mongoose.Types.ObjectId(event_id),
						book_status: { $in: [1, 2] }, // 1 = pending, 2 = confirmed (exclude cancelled/rejected)
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
			const availableSeats = exist_event.no_of_attendees - totalBookedSeats;

			// Check if requested seats are available
			if (no_of_attendees > availableSeats) {
				const errorMessage = availableSeats > 0
					? `${resp_messages(req.lang).book_limit_exceeded}. Only ${availableSeats} seat${availableSeats !== 1 ? 's' : ''} available.`
					: resp_messages(req.lang).book_limit_exceeded;
				return Response.badRequestResponse(
					res,
					errorMessage
				);
			}

			// Check for duplicate booking - prevent same user from booking same event multiple times with pending status
			const existingBooking = await BookEventService.FindOneService({
				user_id: userId,
				event_id: exist_event._id,
				book_status: { $in: [0, 1] } // Check for pending bookings (0 or 1)
			});

			if (existingBooking) {
				console.log(`[BOOKING] Duplicate booking prevented - User ${userId} already has a pending booking for event ${exist_event._id}`);
				return Response.badRequestResponse(
					res,
					resp_messages(req.lang).duplicate_booking || "You already have a pending booking request for this event. Please wait for the host to respond."
				);
			}

			const ticketPrice = exist_event.event_price;
			const amountAttendees = ticketPrice * no_of_attendees;
			const totalTaxAttendees = amountAttendees * taxRate;
			const totalAmount = amountAttendees + totalTaxAttendees;

			req.body.user_id = userId;
			req.body.total_amount_attendees = amountAttendees;
			req.body.total_tax_attendees = totalTaxAttendees;
			req.body.total_amount = totalAmount;
			req.body.organizer_id = exist_event.organizer_id;

			const book_event = await BookEventService.CreateService(req.body);

			if (book_event) {
				exist_event.no_of_attendees -= Number(no_of_attendees);
				await exist_event.save();
				
				// Get organizer/host data for notifications
				const organizer = await organizerService.FindOneService({ _id: exist_event.organizer_id });
				
				// Calculate hold expiration (30 minutes from now)
				const holdExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
				
				// Send notification to guest (Request Sent)
				try {
					// Get organizer rating data properly
					let organizerRating = { averageRating: 4.5, totalReviews: 0 };
					try {
						const UserReviewService = require("../services/userReviewService");
						organizerRating = await UserReviewService.GetUserOverallRating(
							exist_event.organizer_id,
							"Organizer"
						);
						// Use received reviews for organizer rating
						organizerRating = organizerRating.received || organizerRating.overall || { rating: 4.5, totalReviews: 0 };
					} catch (ratingError) {
						console.error('[NOTIFICATION] Error fetching organizer rating:', ratingError);
					}
					
					await notificationHelper.sendGuestRequestSent({
						experience_title: exist_event.event_name,
						host_first_name: organizer?.first_name || 'Host',
						host_id: exist_event.organizer_id,
						tickets_count: no_of_attendees,
						start_at: exist_event.event_date || exist_event.start_date,
						event_date: exist_event.event_date || exist_event.start_date,
						rating_avg: organizerRating.rating || organizerRating.averageRating || 4.5,
						rating_count: organizerRating.totalReviews || 0,
						book_id: book_event._id,
						event_id: exist_event._id,
						hold_expires_at: holdExpiresAt
					}, user, 'A'); // Use variant A (friendly) by default
				} catch (guestNotifError) {
					console.error('[NOTIFICATION] Error sending guest request sent notification:', guestNotifError);
				}
				
				// Send notification to host (New Request)
				try {
					await notificationHelper.sendHostNewRequest({
						guest_first_name: user.first_name,
						user_first_name: user.first_name,
						experience_title: exist_event.event_name,
						event_name: exist_event.event_name,
						tickets_count: no_of_attendees,
						no_of_attendees: no_of_attendees,
						start_at: exist_event.event_date || exist_event.start_date,
						event_date: exist_event.event_date || exist_event.start_date,
						venue_area: exist_event.venue_area || exist_event.location || 'Diriyah',
						book_id: book_event._id,
						booking_id: book_event._id,
						event_id: exist_event._id,
						guest_id: userId,
						user_id: userId
					}, organizer);
					
					// Create in-app notification for host (store both EN and AR for UI locale switch)
					try {
						const eventTypeEn = exist_event.event_type == 1 ? "Join Us" : "Welcome";
						const eventTypeAr = exist_event.event_type == 1 ? "انضم معنا" : "مرحباً";
						const ticketWordEn = no_of_attendees > 1 ? "tickets" : "ticket";
						const hostTitleEn = `New Booking Request - ${eventTypeEn}`;
						const hostTitleAr = `طلب حجز جديد - ${eventTypeAr}`;
						const hostDescEn = `"${user.first_name} ${user.last_name}" requested to book "${exist_event.event_name}" (${no_of_attendees} ${ticketWordEn})`;
						const hostDescAr = `طلب "${user.first_name} ${user.last_name}" حجز "${exist_event.event_name}" (${no_of_attendees} تذكرة)`;

						await NotificationService.CreateService({
							user_id: exist_event.organizer_id,
							role: 2, // Host/Organizer role
							title: hostTitleEn,
							title_ar: hostTitleAr,
							description: hostDescEn,
							description_ar: hostDescAr,
							isRead: false,
							notification_type: 1, // New booking request
							event_id: book_event.event_id,
							book_id: book_event._id,
							status: book_event.book_status,
							profile_image: user.profile_image || "",
							username: `${user.first_name} ${user.last_name}`,
							senderId: userId,
						});
						console.log(`[NOTIFICATION] Created in-app notification for host ${exist_event.organizer_id} - New booking request: ${book_event._id}`);
					} catch (inAppNotifError) {
						console.error('[NOTIFICATION] Error creating in-app notification for host:', inAppNotifError);
						// Don't fail the request if in-app notification fails
					}
				} catch (hostNotifError) {
					console.error('[NOTIFICATION] Error sending host new request notification:', hostNotifError);
					// Fallback to old notification method
					const event_type =
						exist_event.event_type == 1
							? resp_messages(req.lang).event_type_join_us
							: resp_messages(req.lang).event_type_welcome;
					const notification_data = {
						notification_type: 1,
						title: `${event_type} ${
							resp_messages(req.lang).event_booked_request
						}`,
						description: `${user.first_name} ${user.last_name} ${
							resp_messages(req.lang).booked_event
						} ${exist_event.event_name}`,
						event_id: book_event.event_id,
						book_id: book_event._id,
						event_type: exist_event.event_type,
						event_name: exist_event.event_name,
						userId: userId,
						first_name: user.first_name,
						last_name: user.last_name,
						profile_image: user.profile_image,
						status: book_event.book_status,
					};
					sendEventBookingNotification(
						res,
						exist_event.organizer_id,
						notification_data
					);
					
					// Also create in-app notification as fallback
					try {
						await NotificationService.CreateService({
							user_id: exist_event.organizer_id,
							role: 2, // Host/Organizer role
							title: notification_data.title,
							description: notification_data.description,
							isRead: false,
							notification_type: 1, // New booking request
							event_id: book_event.event_id,
							book_id: book_event._id,
							status: book_event.book_status,
							profile_image: user.profile_image || "",
							username: `${user.first_name} ${user.last_name}`,
							senderId: userId,
						});
						console.log(`[NOTIFICATION] Created in-app notification for host (fallback): ${book_event._id}`);
					} catch (fallbackNotifError) {
						console.error('[NOTIFICATION] Error creating fallback in-app notification:', fallbackNotifError);
					}
				}
				
				// Notify admin about new booking (in-app only; store both EN and AR for admin UI locale)
				try {
					const AdminService = require("../services/adminService");
					const admins = await AdminService.FindService({ is_delete: { $ne: 1 } });
					for (const admin of admins) {
						await NotificationService.CreateService({
							user_id: admin._id,
							role: 3, // Admin role
							title: "New Booking",
							title_ar: "حجز جديد",
							description: `"${user.first_name} ${user.last_name}" has booked "${exist_event.event_name}".`,
							description_ar: `قام "${user.first_name} ${user.last_name}" بحجز "${exist_event.event_name}".`,
							event_id: book_event.event_id,
							book_id: book_event._id,
							notification_type: 1, // Booking type
							isRead: false,
						});
					}
					console.log(`[NOTIFICATION] Created admin notifications for new booking: ${book_event._id}`);
				} catch (adminNotifError) {
					console.error('[NOTIFICATION] Error creating admin notification for booking:', adminNotifError);
					// Don't fail the request if admin notification fails
				}
			}

			return Response.ok(
				res,
				book_event,
				200,
				resp_messages(req.lang).booking_successful
			);
		} catch (error) {
			console.error("Book event error:", error);
			// Log full error for debugging
			if (error.message) {
				console.error("Error message:", error.message);
			}
			if (error.stack) {
				console.error("Error stack:", error.stack);
			}
			return Response.serverErrorResponse(
				res,
				error.message || resp_messages(req.lang).internalServerError || "Internal server error"
			);
		}
	},
	bookEventList: async (req, res) => {
		try {
			const { userId } = req;
			if (!userId) {
				return Response.badRequestResponse(
					res,
					"User ID is required"
				);
			}

			let {
				book_status,
				event_date,
				_search,
				page = 1,
				limit = 10,
			} = req.query;

			// Normalize book_status - handle various formats
			if (book_status === "all" || book_status === "" || book_status === null || book_status === undefined) {
				book_status = "all";
			}
			// Handle malformed query parameters like "all:1"
			if (typeof book_status === "string" && book_status.includes(":")) {
				book_status = book_status.split(":")[0]; // Take the first part
			}

			const pageNum = parseInt(page, 10) || 1;
			const limitNum = parseInt(limit, 10) || 10;

			const startOfTodayUTC = new Date(
				Date.UTC(
					new Date().getUTCFullYear(),
					new Date().getUTCMonth(),
					new Date().getUTCDate()
				)
			);

		const matchStage = {
			user_id: new mongoose.Types.ObjectId(userId),
		};

		// Build filter conditions based on book_status
		// book_status: 1 = pending, 2 = approved/confirmed, 3/4 = cancelled/rejected
		if (book_status === "all" || book_status === "" || book_status === null || book_status === undefined) {
			// No extra filtering; return all bookings for the user
			// Don't add $and at all when fetching all bookings
		} else if (book_status == "3" || book_status == "4") {
			// Cancelled/Rejected bookings (unpaid)
			matchStage.$and = [
				{ book_status: Number(book_status) },
				{ payment_status: 0 },
			];
		} else if (book_status == "2") {
			// Approved/confirmed bookings — include both unpaid and paid
			matchStage.$and = [{ book_status: 2 }];
		} else {
			// Default: Pending bookings (book_status=1 or 0, unpaid)
			matchStage.$and = [
				{ book_status: { $in: [0, 1] } },
				{ payment_status: 0 },
			];
		}

		// Add event_date filter if provided
		if (event_date) {
			// Initialize $and if it doesn't exist
			if (!matchStage.$and) {
				matchStage.$and = [];
			}
			matchStage.$and.push({
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
								year: { $year: new Date(event_date) },
								month: { $month: new Date(event_date) },
								day: { $dayOfMonth: new Date(event_date) },
							},
						},
					],
				},
			});
		}

		// Remove $and if it's empty (MongoDB doesn't like empty $and arrays)
		if (matchStage.$and && matchStage.$and.length === 0) {
			delete matchStage.$and;
		}

			const eventDateCondition =
				book_status == "1"
					? {
							"event.event_date": { $gte: startOfTodayUTC },
					}
					: {};

			const countPipeline = [
				{ $match: matchStage },
				{
					$lookup: {
						from: "events",
						localField: "event_id",
						foreignField: "_id",
						as: "event",
					},
				},
				{ $unwind: "$event" },
				{ $match: eventDateCondition },
				{ $count: "totalCount" },
			];

			const countResult = await BookEventService.AggregateService(
				countPipeline
			);
			const totalCount =
				countResult.length > 0 ? countResult[0].totalCount : 0;

			const pipeline = [
				{ $match: matchStage },
				{
					$lookup: {
						from: "organizers",
						localField: "organizer_id",
						foreignField: "_id",
						as: "organizer",
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
				{ $unwind: "$organizer" },
				{ $unwind: "$event" },

				...(book_status == "1"
					? [
							{
								$match: {
									"event.event_date": {
										$gte: startOfTodayUTC,
									},
								},
							},
					]
					: []),

				{
					$project: {
						book_details: {
							total_amount: "$total_amount",
							no_of_attendees: "$no_of_attendees",
							total_amount_attendees: "$total_amount_attendees",
							total_tax_attendees: "$total_tax_attendees",
							created: "$created",
							updated: "$updated",
						},
						payment_status: 1,
						book_status: 1,
						refund_request_id: 1, // Include refund_request_id for refund flow
						invoice_id: 1,
						invoice_url: 1, // Include invoice URL so guests can access their receipts
						order_id: 1,
						event_id: "$event._id",
						event_date: "$event.event_date",
						event_start_time: "$event.event_start_time",
						event_end_time: "$event.event_end_time",
						event_name: "$event.event_name",
						event_image: "$event.event_image",
						event_description: "$event.event_description",
						event_address: "$event.event_address",
						no_of_attendees: "$event.no_of_attendees",
						event_price: "$event.event_price",
						dos_instruction: "$event.dos_instruction",
						do_not_instruction: "$event.do_not_instruction",
						event_for: "$event.event_for",
						event_type: "$event.event_type",
						createdAt: 1,
						updatedAt: 1,
						event_category: "$event.event_category",
						organizer_first_name: "$organizer.first_name",
						organizer_last_name: "$organizer.last_name",
						organizer_profile_image: "$organizer.profile_image",
					},
				},
				{ $sort: { createdAt: -1 } },
				{ $skip: (pageNum - 1) * limitNum },
				{ $limit: limitNum },
			];

			const book_events = await BookEventService.AggregateService(
				pipeline
			);

			return Response.ok(
				res,
				book_events,
				200,
				resp_messages(req.lang).fetched_data,
				totalCount
			);
		} catch (error) {
			console.log(error.message);
			return Response.serverErrorResponse(
				res,
				resp_messages(req.lang).internalServerError
			);
		}
	},
	bookingDetail: async (req, res) => {
		try {
			const { book_id } = req.query;
			const { _userId } = req;

			const exist_event = await BookEventService.FindOneService({
				_id: book_id,
			});

			if (!exist_event) {
				return Response.notFoundResponse(
					res,
					resp_messages(req.lang).eventNotFound
				);
			}

			const event = await EventService.AggregateService([
				{
					$match: {
						_id: new mongoose.Types.ObjectId(exist_event.event_id),
					},
				},
				{
					$lookup: {
						from: "organizers",
						localField: "organizer_id",
						foreignField: "_id",
						as: "organizer",
					},
				},
				{
					$unwind: "$organizer",
				},
				{
					$project: {
						event_date: 1,
						event_start_time: 1,
						event_end_time: 1,
						event_name: 1,
						// payment_status:`${exist_event.payment_status}`,
						event_image: 1,
						event_description: 1,
						event_address: 1,
						no_of_attendees: 1,
						event_price: 1,
						do_not_instruction: 1,
						dos_instruction: 1,
						event_type: 1,
						createdAt: 1,
						event_for: 1,
						updatedAt: 1,
						"organizer.first_name": 1,
						"organizer.last_name": 1,
						"organizer.email": 1,
						"organizer.phone_number": 1,
						"organizer.country_code": 1,
						"organizer.profile_image": 1,
						"organizer._id": 1,
					},
				},
			]);

			const attendees = await BookEventService.AggregateService([
				{
					$match: {
						event_id: new mongoose.Types.ObjectId(
							exist_event.event_id
						),
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
					$unwind: "$user",
				},
				{
					$project: {
						profile_image: "$user.profile_image",
						_id: "$user._id",
						first_name: "$user.first_name",
						last_name: "$user.last_name",
					},
				},
			]);

			const book_details = await BookEventService.AggregateService([
				{ $match: { _id: new mongoose.Types.ObjectId(book_id) } },
				{
					$project: {
						user_id: 0,
						// invoice_url is included so guests can access their receipts
					},
				},
			]);

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
					$match: {
						event_id: new mongoose.Types.ObjectId(
							exist_event.event_id
						),
					},
				},
				{ $unwind: "$user" },
				{
					$project: {
						description: 1,
						rating: 1,
						createdAt: 1,
						first_name: "$user.first_name",
						last_name: "$user.last_name",
						profile_image: "$user.profile_image",
					},
				},
			]);

			const event_data = event[0];
			event_data.attendees = attendees || [];
			event_data.book_details = book_details[0] || [];
			event_data.event_review = event_review || [];
			return Response.ok(
				res,
				event_data,
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
	eventBookingCancel: async (req, res) => {
		try {
			const { userId } = req;
			const { book_id, reason } = req.body;
			const lang = req.headers["lang"] || "en";

			if (!mongoose.Types.ObjectId.isValid(book_id)) {
				return Response.badRequestResponse(res, resp_messages(lang).id_required || "Invalid booking ID");
			}

			// Find booking
			const book_event = await BookEventService.FindOneService({
				_id: book_id,
				user_id: userId, // Ensure user can only cancel their own bookings
			});

			if (!book_event) {
				return Response.notFoundResponse(res, resp_messages(lang).bookingNotFound || "Booking not found");
			}

			// Get event details first to check event status
			const event = await EventService.FindOneService({
				_id: book_event.event_id,
			});

			if (!event) {
				return Response.notFoundResponse(res, resp_messages(lang).eventNotFound || "Event not found");
			}

			// Check if event date has passed (cannot cancel completed events)
			const now = new Date();
			const eventDate = new Date(event.event_date);
			if (!isNaN(eventDate.getTime()) && eventDate < now) {
				return Response.badRequestResponse(res, resp_messages(lang).cannotCancelCompletedEventBooking || 
					"Cannot cancel booking for completed event. This event has already taken place.");
			}

			// Check if booking is already cancelled
			if (book_event.book_status === 3) {
				return Response.badRequestResponse(res, resp_messages(lang).bookingAlreadyCancelled || "Booking already cancelled");
			}

			// Check if booking can be cancelled (status 1 = approved OR status 2 = confirmed)
			// Status: 0 = pending, 1 = approved, 2 = confirmed, 3 = cancelled, 4 = rejected
			if (book_event.book_status !== 1 && book_event.book_status !== 2) {
				let errorMessage;
				if (book_event.book_status === 0) {
					errorMessage = resp_messages(lang).cannotCancelPendingBooking || 
						"Cannot cancel pending booking. Please wait for host approval before cancelling.";
				} else if (book_event.book_status === 4) {
					errorMessage = resp_messages(lang).cannotCancelRejectedBooking || 
						"Cannot cancel rejected booking. This booking has already been rejected by the host.";
				} else {
					errorMessage = resp_messages(lang).onlyApprovedBookingsCanBeCancelled || 
						"Only approved or confirmed bookings can be cancelled.";
				}
				return Response.badRequestResponse(res, errorMessage);
			}

			// Event details are already fetched above (line 2919), no need to fetch again

			// Get user details
			const user = await UserService.FindOneService({ _id: userId });
			if (!user) {
				return Response.notFoundResponse(res, resp_messages(lang).user_not_found || "User not found");
			}

			// Get organizer details
			const organizer = await organizerService.FindOneService({
				_id: book_event.organizer_id,
			});

			if (!organizer) {
				return Response.notFoundResponse(res, resp_messages(lang).organizer_not_found || "Organizer not found");
			}

			// Calculate amount to deduct from host wallet
			const amountToDeduct = book_event.total_amount || 0;
			const ticketsCount = book_event.no_of_attendees || 0;

			// Deduct from host wallet if payment was made
			if (book_event.payment_status === 1 && amountToDeduct > 0) {
				// Get or create wallet
				let wallet = await WalletService.FindOneService({
					organizer_id: book_event.organizer_id,
				});

				if (!wallet) {
					wallet = await WalletService.CreateService({
						organizer_id: book_event.organizer_id,
						total_amount: 0,
					});
				}

				// Deduct amount from wallet
				const newBalance = Math.max(0, (wallet.total_amount || 0) - amountToDeduct);
				await WalletService.FindByIdAndUpdateService(wallet._id, {
					total_amount: newBalance,
				});

				// Log cancelled transaction
				await TransactionService.CreateService({
					organizer_id: book_event.organizer_id,
					user_id: userId,
					book_id: book_id,
					amount: amountToDeduct,
					currency: "SAR",
					type: 2, // Debit
					status: 1, // Success
					payment_id: book_event.payment_id || null,
				});

				console.log(`[GUEST:CANCEL] Deducted ${amountToDeduct} SAR from host wallet. New balance: ${newBalance}`);
			}

			// Update booking status to cancelled
			book_event.book_status = 3;
			await book_event.save();

			// Update event attendees count (add back the cancelled tickets)
			if (event.no_of_attendees !== undefined) {
				event.no_of_attendees = (event.no_of_attendees || 0) + ticketsCount;
				await event.save();
			}

			// Send notifications
			const notificationMessages = {
				en: {
					guestTitle: "Booking Cancelled",
					guestDesc: `Your booking for "${event.event_name}" has been cancelled.${reason ? ` Reason: ${reason}` : ""}`,
					hostTitle: "Guest Booking Cancelled",
					hostDesc: `A guest has cancelled their booking for "${event.event_name}". ${ticketsCount} ticket(s) cancelled. Amount deducted: ${amountToDeduct} SAR.`,
					adminTitle: "Booking Cancellation",
					adminDesc: `Guest "${user.first_name} ${user.last_name}" cancelled booking for event "${event.event_name}". Amount ${amountToDeduct} SAR deducted from host wallet.`,
				},
				ar: {
					guestTitle: "تم إلغاء الحجز",
					guestDesc: `تم إلغاء حجزك لـ "${event.event_name}".${reason ? ` السبب: ${reason}` : ""}`,
					hostTitle: "تم إلغاء حجز الضيف",
					hostDesc: `ألغى ضيف حجزه لـ "${event.event_name}". تم إلغاء ${ticketsCount} تذكرة. المبلغ المخصوم: ${amountToDeduct} ريال.`,
					adminTitle: "إلغاء الحجز",
					adminDesc: `ألغى الضيف "${user.first_name} ${user.last_name}" الحجز لحدث "${event.event_name}". تم خصم ${amountToDeduct} ريال من محفظة المضيف.`,
				},
			};

			const messages = notificationMessages[lang] || notificationMessages.en;

			// Notify guest with push notification
			try {
				const { pushNotification } = require("../helpers/pushNotification");
				const guestNotificationData = {
					title: messages.guestTitle,
					description: messages.guestDesc,
					first_name: user.first_name,
					last_name: user.last_name,
					userId: user._id,
					profile_image: user.profile_image || "",
					event_id: event._id,
					book_id: book_id,
					notification_type: 3, // Cancellation type
					status: 3, // Cancelled status
				};
				await pushNotification(res, 1, userId, guestNotificationData);
				console.log(`[NOTIFICATION] Sent booking cancellation push notification to guest: ${userId}`);
			} catch (pushError) {
				console.error('[PUSH-NOTIFICATION] Error sending push to guest, creating in-app notification:', pushError);
				await NotificationService.CreateService({
					user_id: userId,
					role: 1, // Guest role
					title: messages.guestTitle,
					description: messages.guestDesc,
					event_id: event._id,
					book_id: book_id,
					notification_type: 3, // Cancellation type
					isRead: false,
				});
			}

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
					book_id: book_id,
					notification_type: 3, // Cancellation type
					status: 3, // Cancelled status
				};
				await pushNotification(res, 2, book_event.organizer_id, hostNotificationData);
				console.log(`[NOTIFICATION] Sent booking cancellation push notification to host: ${book_event.organizer_id}`);
			} catch (pushError) {
				console.error('[PUSH-NOTIFICATION] Error sending push to host, creating in-app notification:', pushError);
				await NotificationService.CreateService({
					user_id: book_event.organizer_id,
					role: 2, // Host role
					title: messages.hostTitle,
					description: messages.hostDesc,
					event_id: event._id,
					book_id: book_id,
					notification_type: 3, // Cancellation type
					isRead: false,
				});
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
					book_id: book_id,
					notification_type: 3, // Cancellation type
					isRead: false,
				});
			}

			// Auto-create refund request if payment was made (payment_status = 1)
			if (book_event.payment_status === 1 && amountToDeduct > 0) {
				try {
					const RefundRequestService = require("../services/refundRequestService");
					
					// Check if refund request already exists for this booking
					const existingRefund = await RefundRequestService.FindOneService({
						booking_id: book_id,
					});

					if (!existingRefund) {
						// Create automatic refund request
						const refundRequestData = {
							booking_id: book_id,
							user_id: userId,
							event_id: event._id,
							organizer_id: book_event.organizer_id,
							amount: amountToDeduct,
							refund_reason: reason || `Automatic refund request for cancelled booking. ${lang === "ar" ? "تم إلغاء الحجز" : "Booking cancelled"}.`,
							status: 0, // Pending
							currency: "SAR",
						};

						const refundRequest = await RefundRequestService.CreateService(refundRequestData);
						console.log(`[GUEST:CANCEL] Auto-created refund request: ${refundRequest._id} for booking: ${book_id}`);

						// Notify admin about new refund request (store both EN and AR for admin UI locale)
						for (const admin of admins) {
							await NotificationService.CreateService({
								user_id: admin._id,
								role: 3, // Admin role
								title: "New Refund Request",
								title_ar: "طلب استرداد جديد",
								description: `New refund request from "${user.first_name} ${user.last_name}" for event "${event.event_name}". Amount: ${amountToDeduct} SAR.`,
								description_ar: `طلب استرداد جديد من "${user.first_name} ${user.last_name}" لحدث "${event.event_name}". المبلغ: ${amountToDeduct} ريال.`,
								event_id: event._id,
								book_id: book_id,
								notification_type: 4, // Refund type
								isRead: false,
							});
						}
					} else {
						console.log(`[GUEST:CANCEL] Refund request already exists for booking: ${book_id}`);
					}
				} catch (refundError) {
					console.error("[GUEST:CANCEL] Error creating auto-refund request:", refundError);
					// Don't fail the cancellation if refund request creation fails
				}
			}

			return Response.ok(
				res,
				{
					booking: book_event,
					amountDeducted: amountToDeduct,
					ticketsCancelled: ticketsCount,
					refundRequestCreated: book_event.payment_status === 1 && amountToDeduct > 0,
				},
				200,
				resp_messages(lang).bookingCancelled || "Booking cancelled successfully"
			);
		} catch (error) {
			console.error("[GUEST:CANCEL] Error:", error);
			return Response.serverErrorResponse(
				res,
				error.message || resp_messages(req.lang).internalServerError || "Internal server error"
			);
		}
	},
	updateLanguage: async (req, res) => {
		try {
			const { language } = req.body;
			const { role, userId } = req;
			const service = role == 1 ? UserService : organizerService;

			const result = await service.FindOneService({ _id: userId });

			result.language = language;
			await result.save();

			return Response.ok(
				res,
				{},
				200,
				resp_messages(req.lang).update_success
			);
		} catch (error) {
			console.log(error);
			return Response.serverErrorResponse(
				res,
				resp_messages(req.lang).internalServerError
			);
		}
	},
	addReview: async (req, res) => {
		try {
			const { event_id } = req.body;
			const { userId } = req;

			if (!mongoose.Types.ObjectId.isValid(event_id)) {
				return Response.badRequestResponse(
					res,
					resp_messages(req.lang).id_required
				);
			}

			const event = await EventService.FindOneService({ _id: event_id });

			if (!event) {
				return Response.notFoundResponse(
					res,
					resp_messages(req.lang).eventNotFound
				);
			}
			req.body.user_id = userId;
			const event_review = await ReviewService.CreateService(req.body);

			return Response.ok(
				res,
				event_review,
				200,
				resp_messages(req.lang).addReview
			);
		} catch (error) {
			console.log(error.message);
			return Response.serverErrorResponse(
				res,
				resp_messages(req.lang).internalServerError
			);
		}
	},
	notificationCounts: async (req, res) => {
		try {
			const { userId } = req;
			const notificationList = await NotificationService.AggregateService(
				[{ $match: { user_id: new mongoose.Types.ObjectId(userId) } }]
			);

			const unreadCount = notificationList.filter(
				(notification) => !notification.isRead
			).length;
			console.log(unreadCount);

			return Response.ok(res, { unreadCount }, 200, "Success");
		} catch (error) {
			console.error(error);
			return Response.serverErrorResponse(res, "Internal server error");
		}
	},
	reviewList: async (req, res) => {
		try {
			const { event_id, page, limit } = req.query;

			const skip = (Number(page) - 1) * Number(limit);

			if (!mongoose.Types.ObjectId.isValid(event_id)) {
				return Response.badRequestResponse(
					res,
					resp_messages(req.lang).id_required
				);
			}

			const event = await EventService.FindOneService({ _id: event_id });

			if (!event) {
				return Response.notFoundResponse(
					res,
					resp_messages(req.lang).eventNotFound
				);
			}

			const event_review = await ReviewService.AggregateService([
				{
					$match: {
						event_id: new mongoose.Types.ObjectId(event_id),
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
					$unwind: "$user",
				},
				{ $skip: skip },
				{ $limit: Number(limit) },
			]);
			const count = await ReviewService.CountDocumentService({
				event_id: event_id,
			});

			return Response.ok(
				res,
				event_review,
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
	// Get all event reviews given by the current user
	myEventReviews: async (req, res) => {
		try {
			const { userId } = req;
			const { page = 1, limit = 10 } = req.query;

			const skip = (Number(page) - 1) * Number(limit);

			// Get event reviews by current user
			const event_reviews = await ReviewService.AggregateService([
				{
					$match: {
						user_id: new mongoose.Types.ObjectId(userId),
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
					$unwind: "$event",
				},
				{
					$lookup: {
						from: "organizers",
						localField: "event.organizer_id",
						foreignField: "_id",
						as: "organizer",
					},
				},
				{
					$unwind: {
						path: "$organizer",
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$sort: { createdAt: -1 }
				},
				{ $skip: skip },
				{ $limit: Number(limit) },
			]);

			const count = await ReviewService.CountDocumentService({
				user_id: userId,
			});

			return Response.ok(
				res,
				event_reviews,
				200,
				resp_messages(req.lang).fetched_data,
				count
			);
		} catch (error) {
			console.error("Get my event reviews error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages(req.lang).internalServerError
			);
		}
	},
	notificationList: async (req, res) => {
		try {
			const { userId } = req;
			const { page = 1, limit = 10 } = req.query;

			const skip = (Number(page) - 1) * Number(limit);

			const notifications = await NotificationService.AggregateService([
				{
					$match: { user_id: new mongoose.Types.ObjectId(userId) },
				},
				{ $skip: skip },
				{ $sort: { createdAt: -1 } },
				{ $limit: parseInt(limit) },
			]);
			await NotificationService.updateMany(
				{ user_id: userId, isRead: false },
				{ $set: { isRead: true } }
			);

			return Response.ok(
				res,
				notifications,
				200,
				resp_messages(req.lang).fetched_data
			);
		} catch (error) {
			console.error(error);
			return Response.serverErrorResponse(
				res,
				resp_messages(req.lang).internalServerError
			);
		}
	},
	verifyPayment: async (req, res) => {
		try {
			const lang = req.lang || req.headers["lang"] || "en";
			const { order_id, payment_id, signature } = req.body;

			if (!order_id || !payment_id || !signature) {
				return Response.badRequestResponse(
					res,
					resp_messages(lang).payment_fields_required || "order_id, payment_id and signature are required"
				);
			}

			const signatureSecret =
				process.env.PAYMENT_SIGNATURE_SECRET ||
				process.env.RAZORPAY_SECRET ||
				process.env.MOYASAR_SIGNATURE_SECRET;

			if (!signatureSecret) {
				return Response.serverErrorResponse(
					res,
					resp_messages(lang).payment_signature_secret_missing || "Payment signature secret is not configured"
				);
			}

			const expectedSignature = crypto
				.createHmac("sha256", signatureSecret)
				.update(`${order_id}|${payment_id}`)
				.digest("hex");

			if (expectedSignature !== signature) {
				return Response.badRequestResponse(
					res,
					resp_messages(lang).invalid_payment_signature || "Invalid payment signature"
				);
			}

			return Response.ok(
				res,
				{ verified: true },
				200,
				resp_messages(lang).payment_verified || "Payment verified successfully"
			);
		} catch (error) {
			const lang = req.lang || req.headers["lang"] || "en";
			console.error("verifyPayment error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages(lang).internalServerError
			);
		}
	},
	paymentDetail: async (req, res) => {
		try {
			const lang = req.lang || req.headers["lang"] || "en";
			const messages = resp_messages(lang);
			const { id } = req.query;
			if (!id) {
				return Response.badRequestResponse(res, "Payment id is required");
			}

			const apiKey =
				process.env.MOYASAR_SECRET_KEY ||
				process.env.MOYASAR_API_KEY ||
				process.env.MOYASAR_SECRET;

			if (!apiKey) {
				return Response.serverErrorResponse(
					res,
					"Payment provider credentials not configured"
				);
			}

			const payment_detail = await axios.get(
				`https://api.moyasar.com/v1/payments/${id}`,
				{
					auth: {
						username: apiKey,
						password: "",
					},
				}
			);

			const data = payment_detail.data;
			return Response.ok(res, data, 200, messages.fetched_data);
		} catch (error) {
			console.log(error);
			return Response.serverErrorResponse(
				res,
				"Unable to fetch payment details"
			);
		}
	},

	receivedWebhook: async (req, res) => {
		const lang = req.lang || req.headers["lang"] || "en";
		try {
			const { headers, body } = req;
			console.log("headers", headers);
			const receivedSignature = headers["x-event-secret"];
			console.log(receivedSignature, "receivedSignature");

			// Use environment variable for webhook secret (preferably the Moyasar secret key)
			const sharedSecret = process.env.MOYASAR_SIGNATURE_SECRET ||
				process.env.MOYASAR_SECRET_KEY ||
				process.env.MOYASAR_SECRET ||
				"$2b$12$qx37f2bgws.TD1piwHj6Kuf"; // Fallback for compatibility

			const calculatedSignature = crypto
				.createHmac("sha256", sharedSecret)
				.update(JSON.stringify(body))
				.digest("hex");

			console.log("Calculated signature", calculatedSignature);
			
			// ============================================================
			// SECURITY: Webhook signature verification (optional but recommended)
			// Note: Moyasar may not always send signatures for all webhook types
			// ============================================================
			// if (receivedSignature && receivedSignature !== calculatedSignature) {
			//     console.error('Webhook signature verification failed.');
			//     return res.status(401).send("Invalid signature.");
			// }

			console.log("Received webhook body: ", body);

			// Validate webhook body structure
			if (!body || !body.data || !body.data.status) {
				console.error("Invalid webhook body structure");
				return res.status(400).send("Invalid webhook body");
			}

			const payment_id = body.data.id || body.id;
			
			if (
				body.data.status === "paid" ||
				body.data.status === "captured" ||
				body.data.status === "authorized"
			) {
				// ============================================================
				// CRITICAL SECURITY FIX: Verify payment with Moyasar API
				// Never trust webhook data alone - always verify server-side
				// ============================================================
				console.log("[WEBHOOK] Verifying payment with Moyasar API:", payment_id);
				
				const paymentVerification = await MoyasarService.getPayment(payment_id);
				
				if (!paymentVerification.success) {
					console.error("[WEBHOOK] Failed to verify payment with Moyasar:", paymentVerification.message);
					return res.status(400).send("Payment verification failed");
				}

				const moyasarPayment = paymentVerification.data;
				console.log("[WEBHOOK] Moyasar payment verified:", {
					id: moyasarPayment.id,
					status: moyasarPayment.status,
					amount: moyasarPayment.amount
				});

				// Double-check the payment status from Moyasar API (not just webhook)
				const validPaymentStatuses = ['paid', 'captured'];
				if (!validPaymentStatuses.includes(moyasarPayment.status) && moyasarPayment.status !== 'authorized') {
					console.error("[WEBHOOK] Payment not successful. Moyasar status:", moyasarPayment.status);
					return res.status(400).send(`Payment not successful. Status: ${moyasarPayment.status}`);
				}

				const book_id = body.data.metadata?.order_id || moyasarPayment.metadata?.order_id;
				
				if (!book_id) {
					console.error("[WEBHOOK] Booking ID not found in webhook or payment metadata");
					return res.status(400).send("Booking ID not found");
				}

				const existingTransaction =
					await TransactionService.FindOneService({
						payment_id: payment_id,
					});
					if (existingTransaction) {
					console.log(
						`Transaction for payment_id ${payment_id} already exists.`
					);
						return res.status(200).send(resp_messages(lang).webhook_already_processed || "Webhook already processed.");
				}

				const booking_details = await BookEventService.FindOneService({
					_id: book_id,
				});

					if (!booking_details) {
						console.error("Booking not found for webhook", book_id);
						return res.status(404).send(resp_messages(lang).bookingNotFound || "Booking not found");
					}

				// Verify payment amount matches booking amount
				const moyasarAmountInSAR = moyasarPayment.amount / 100;
				const bookingAmount = booking_details.total_amount || 0;
				const amountDifference = Math.abs(moyasarAmountInSAR - bookingAmount);
				
				if (amountDifference > 1) { // Allow 1 SAR difference for rounding
					console.error("[WEBHOOK] Amount mismatch! Moyasar:", moyasarAmountInSAR, "Booking:", bookingAmount);
					return res.status(400).send("Payment amount does not match booking amount");
				}

				// Handle authorized payments - capture them
				if (moyasarPayment.status === "authorized") {
					console.log("[WEBHOOK] Payment is authorized, attempting capture...");
					const captureResponse = await MoyasarService.capturePayment(
						payment_id
					);
					if (captureResponse.success) {
						console.log(
							`[WEBHOOK] Payment manually captured for booking: ${book_id}`
						);
					} else {
						console.log(
							`[WEBHOOK] Failed to capture payment for booking: ${book_id}`
						);
						return res
							.status(500)
							.send(
								captureResponse.message ||
									resp_messages(lang).payment_capture_failed
							);
					}
				}

				console.log("[WEBHOOK] ✅ Payment verified successfully. Updating booking.");

				booking_details.payment_status = 1;
				booking_details.book_status = 2;
				booking_details.payment_id = payment_id;
				booking_details.payment_data = {
					...body,
					moyasar_verified: true,
					moyasar_status: moyasarPayment.status,
					verified_at: new Date()
				};

				await booking_details.save();

				await TransactionService.CreateService({
					user_id: booking_details.user_id,
					organizer_id: booking_details.organizer_id,
					amount: moyasarAmountInSAR,
					type: 1,
					payment_id: payment_id,
					book_id: book_id,
					status: 1, // Success
				});

				// const amount = body.data.amount / 100;
				// await WalletService.updateMany(
				// 	{ organizer_id: booking_details.organizer_id },
				// 	{ $inc: { total_amount: amount } }
				// );

				console.log(
					`Payment captured successfully for booking: ${book_id}`
				);
			} else if (body.data.status === "failed" || body.data.status === "declined") {
				// Handle payment failure
				const book_id = body.data.metadata?.order_id;
				if (!book_id) {
					console.error("Booking ID not found in webhook metadata");
					return res.status(400).send("Booking ID not found");
				}
				console.log(`Payment failed/declined for booking: ${book_id}`);
				
				try {
					const booking_details = await BookEventService.FindOneService({
						_id: book_id,
					});

					if (booking_details) {
						const [event, user] = await Promise.all([
							EventService.FindOneService({ _id: booking_details.event_id }),
							UserService.FindOneService({ _id: booking_details.user_id })
						]);

						if (user && event) {
							// Send payment failed notification
							await notificationHelper.sendGuestPaymentFailed({
								guest_first_name: user.first_name || 'Guest',
								experience_title: event.event_name || 'Experience',
								event_name: event.event_name || 'Experience',
								order_id: booking_details.order_id || booking_details._id.toString(),
								book_id: booking_details._id,
								booking_id: booking_details._id,
								event_id: event._id
							}, user);
							console.log(`[NOTIFICATION] Sent payment failed notification to user ${user._id}`);
						}
					}
				} catch (notifError) {
					console.error('[NOTIFICATION] Error sending payment failed notification:', notifError);
				}
			} else {
				console.log(
					`Payment status is "${body.data.status}", ignoring webhook.`
				);
			}

			res.status(200).send(resp_messages(lang).webhook_processed || "Webhook processed successfully.");
		} catch (error) {
			console.error("Error occurred while processing webhook:", error);
				res.status(500).send(resp_messages(lang).webhook_processing_error || "An error occurred while processing the webhook.");
		}
	},

	updatePaymentStatus: async (req, res) => {
		try {
			const lang = req.lang || req.headers["lang"] || "en";
			const messages = resp_messages(lang);
			const { booking_id, payment_id, payment_status, amount } = req.body;
			console.log("[PAYMENT] Payment update request:", { booking_id, payment_id, payment_status, amount });

			// Validate the booking_id
			if (!booking_id || !mongoose.Types.ObjectId.isValid(booking_id)) {
				return Response.badRequestResponse(
					res,
					"Invalid or missing booking ID"
				);
			}

			// Validate payment_id is provided
			if (!payment_id) {
				return Response.badRequestResponse(
					res,
					messages.payment_id_required || "Payment ID is required"
				);
			}

			// ============================================================
			// CRITICAL SECURITY FIX: Verify payment with Moyasar API
			// Never trust client-side payment status - always verify server-side
			// ============================================================
			console.log("[PAYMENT] Verifying payment with Moyasar API:", payment_id);
			
			const paymentVerification = await MoyasarService.getPayment(payment_id);
			
			if (!paymentVerification.success) {
				console.error("[PAYMENT] Failed to verify payment with Moyasar:", paymentVerification.message);
				return Response.badRequestResponse(
					res,
					messages.payment_verification_failed || "Unable to verify payment. Please try again or contact support."
				);
			}

			const moyasarPayment = paymentVerification.data;
			console.log("[PAYMENT] Moyasar payment details:", {
				id: moyasarPayment.id,
				status: moyasarPayment.status,
				amount: moyasarPayment.amount,
				currency: moyasarPayment.currency
			});

			// Check if payment is actually paid or captured
			const validPaymentStatuses = ['paid', 'captured'];
			if (!validPaymentStatuses.includes(moyasarPayment.status)) {
				console.error("[PAYMENT] Payment not successful. Status:", moyasarPayment.status);
				
				// If payment is authorized but not captured, try to capture it
				if (moyasarPayment.status === 'authorized') {
					console.log("[PAYMENT] Attempting to capture authorized payment...");
					const captureResult = await MoyasarService.capturePayment(payment_id);
					
					if (!captureResult.success) {
						console.error("[PAYMENT] Failed to capture payment:", captureResult.message);
						return Response.badRequestResponse(
							res,
							messages.payment_capture_failed || "Payment authorization found but capture failed. Please contact support."
						);
					}
					console.log("[PAYMENT] Payment captured successfully");
				} else if (moyasarPayment.status === 'failed' || moyasarPayment.status === 'declined') {
					return Response.badRequestResponse(
						res,
						messages.payment_declined || "Payment was declined by your bank. Please check your balance and try again."
					);
				} else {
					return Response.badRequestResponse(
						res,
						messages.payment_not_completed || `Payment is not complete. Current status: ${moyasarPayment.status}`
					);
				}
			}

			// Verify the payment amount matches the booking amount
			const moyasarAmountInSAR = moyasarPayment.amount / 100; // Moyasar uses halala (smallest unit)

			// Find the booking
			const bookingDetails = await BookEventService.FindOneService({
				_id: booking_id,
			});

			if (!bookingDetails) {
				return Response.notFoundResponse(res, "Booking not found");
			}

			// CRITICAL: Verify booking belongs to the logged-in user
			const userId = req.userId || req.user?.id;
			if (userId && bookingDetails.user_id.toString() !== userId.toString()) {
				console.error("[PAYMENT] User ownership mismatch! Booking user:", bookingDetails.user_id, "Logged user:", userId);
				return Response.badRequestResponse(
					res,
					messages.payment_booking_mismatch || "This booking does not belong to your account. Access denied."
				);
			}

			console.log("[PAYMENT] Found booking:", bookingDetails._id);

			// Verify payment amount matches booking amount (allow small difference for rounding)
			const bookingAmount = bookingDetails.total_amount || 0;
			const amountDifference = Math.abs(moyasarAmountInSAR - bookingAmount);
			
			if (amountDifference > 1) { // Allow 1 SAR difference for rounding
				console.error("[PAYMENT] Amount mismatch! Moyasar:", moyasarAmountInSAR, "Booking:", bookingAmount);
				return Response.badRequestResponse(
					res,
					messages.payment_amount_mismatch || "Payment amount does not match booking amount. Please contact support."
				);
			}

			// CRITICAL: Verify payment metadata contains correct booking_id (must match)
			const moyasarOrderId = moyasarPayment.metadata?.order_id || moyasarPayment.metadata?.booking_id;
			if (moyasarOrderId && moyasarOrderId.toString() !== booking_id.toString()) {
				console.error("[PAYMENT] Booking ID mismatch! Moyasar:", moyasarOrderId, "Request:", booking_id);
				return Response.badRequestResponse(
					res,
					messages.payment_booking_mismatch || "Payment does not match this booking. Please contact support."
				);
			}
			if (!moyasarOrderId) {
				console.warn("[PAYMENT] Payment has no order_id/booking_id in metadata - ensure Moyasar init includes metadata");
			}

			// CRITICAL: Check if booking is approved by host (status = 2)
			// Payment can only be processed if host has approved the booking
			if (bookingDetails.book_status !== 2) {
				if (bookingDetails.book_status === 1) {
					return Response.badRequestResponse(
						res,
						messages.payment_pending_approval || 
						"Your booking request is still pending approval from the host. Please wait for the host to accept your request before making payment."
					);
				} else if (bookingDetails.book_status === 3 || bookingDetails.book_status === 4) {
					return Response.badRequestResponse(
						res,
						messages.payment_booking_rejected || 
						"Your booking request was rejected by the host. You cannot make payment for a rejected booking."
					);
				} else {
					return Response.badRequestResponse(
						res,
						messages.payment_booking_not_approved || 
						"Your booking must be approved by the host before you can make payment."
					);
				}
			}

			// Check if payment was already processed
			if (bookingDetails.payment_status === 1) {
				return Response.ok(
					res,
					{ payment_already_processed: true },
					200,
					"Payment was already processed"
				);
			}

			// Check for duplicate transaction with this payment_id
			const existingTransaction = await TransactionService.FindOneService({
				payment_id: payment_id,
			});
			
			if (existingTransaction) {
				console.log("[PAYMENT] Transaction already exists for payment_id:", payment_id);
				return Response.ok(
					res,
					{ payment_already_processed: true },
					200,
					"Payment was already processed"
				);
			}

			console.log("[PAYMENT] ✅ Payment verified successfully with Moyasar. Proceeding to update booking.");

			// Update the booking with payment information
			const updateData = {
				payment_status: 1, // Mark as paid
				payment_id: payment_id,
				book_status: 2, // Set to approved
				payment_data: {
					id: payment_id,
					amount: moyasarAmountInSAR,
					moyasar_status: moyasarPayment.status,
					verified_at: new Date(),
					updated_at: new Date(),
				},
			};
			
			// Set confirmed_at timestamp if booking is being confirmed now
			if (bookingDetails.book_status !== 2) {
				updateData.confirmed_at = new Date();
			}
			
			const updatedBooking =
				await BookEventService.FindByIdAndUpdateService(
					booking_id,
					updateData,
					{ new: true }
				);

			console.log(
				"[PAYMENT] Updated booking payment status:",
				updatedBooking.payment_status
			);

			// Create a transaction record (invoice info will be added after generation)
			const transaction = await TransactionService.CreateService({
				user_id: bookingDetails.user_id,
				organizer_id: bookingDetails.organizer_id,
				amount: amount || bookingDetails.total_amount,
				type: 1, // Payment
				payment_id: payment_id,
				book_id: booking_id,
				status: 1, // Success
			});

			// Get required data for invoice generation
			const [event, user, organizer] = await Promise.all([
				EventService.FindOneService({
					_id: bookingDetails.event_id,
				}),
				UserService.FindOneService({
					_id: bookingDetails.user_id,
				}),
				organizerService.FindOneService({
					_id: bookingDetails.organizer_id,
				}),
			]);

			// Generate receipt - Try multiple services in order: Fatora → Daftra → Local
			let invoiceGenerated = false;
			
			// PRIORITY 1: Try Fatora (Saudi Arabia platform)
			const fatoraApiKey = process.env.FATORA_API_KEY;
			const fatoraSecretKey = process.env.FATORA_SECRET_KEY || process.env.FATORA_API_SECRET;
			
			if (fatoraApiKey && fatoraSecretKey && fatoraApiKey.trim() !== "" && fatoraSecretKey.trim() !== "") {
				try {
					console.log("[RECEIPT] Attempting to generate invoice via Fatora API (Saudi platform)");
					const fatoraResponse = await FatoraService.createInvoice(
						bookingDetails,
						event,
						user,
						organizer
					);

					if (fatoraResponse && fatoraResponse.id) {
						// Save Fatora invoice to booking record
						updatedBooking.invoice_id = fatoraResponse.id;
						updatedBooking.invoice_url = fatoraResponse.invoice_url || fatoraResponse.invoice_pdf_url;
						await updatedBooking.save();

						// Also store in transaction record
						if (transaction && transaction._id) {
							await TransactionService.FindByIdAndUpdateService(
								transaction._id,
								{
									invoice_id: fatoraResponse.id,
									invoice_url: fatoraResponse.invoice_url || fatoraResponse.invoice_pdf_url,
									invoice_provider: 'fatora',
								}
							);
						}

						console.log(
							"[RECEIPT] Fatora invoice generated successfully:",
							fatoraResponse.id,
							"PDF URL:",
							fatoraResponse.invoice_url
						);
						
						invoiceGenerated = true;
					}
				} catch (fatoraError) {
					console.error("[RECEIPT] Fatora invoice generation failed:", fatoraError.message);
					console.log("[RECEIPT] Falling back to Daftra...");
				}
			}

			// PRIORITY 2: Try Daftra (if Fatora not configured or failed)
			if (!invoiceGenerated) {
				const daftraSubdomain = process.env.DAFTRA_SUBDOMAIN;
				const daftraApiKey = process.env.DAFTRA_API_KEY;
				const daftraClientSecret = process.env.DAFTRA_CLIENT_SECRET;
				
				if (daftraSubdomain && daftraApiKey && daftraClientSecret && daftraSubdomain.trim() !== "" && daftraApiKey.trim() !== "" && daftraClientSecret.trim() !== "") {
					try {
						console.log("[RECEIPT] Attempting to generate receipt via Daftra API");
						const daftraResponse = await DaftraService.generateEventReceipt(
						bookingDetails,
						event,
						user,
						organizer,
						{
							subdomain: daftraSubdomain,
							apiKey: daftraApiKey,
							clientSecret: daftraClientSecret
						}
					);

					if (daftraResponse && daftraResponse.id) {
						// Clean subdomain (remove .daftra.com if present) - use the same function as DaftraService
						let cleanSubdomain = daftraSubdomain
							.replace(/^https?:\/\//i, '')
							.replace(/\.daftra\.com.*$/i, '')
							.replace(/\/$/, '')
							.trim();
						
						console.log(`[RECEIPT] Cleaned subdomain: "${cleanSubdomain}" from "${daftraSubdomain}"`);
						
						// Save invoice/receipt to guest booking record so they can access it
						// Try multiple URL formats in order of preference
						const invoiceUrl = daftraResponse.receipt_pdf_url || 
							daftraResponse.pdf_url || 
							daftraResponse.invoice_pdf_url ||
							`https://${cleanSubdomain}.daftra.com/invoices/${daftraResponse.id}/pdf`;
						
						console.log(`[RECEIPT] Generated invoice URL: ${invoiceUrl}`);
						console.log(`[RECEIPT] Invoice ID: ${daftraResponse.id}`);
						console.log(`[RECEIPT] Invoice verified: ${daftraResponse.verified ? 'Yes' : 'No'}`);
						
						// Test if invoice URL is accessible (optional verification)
						try {
							const testResponse = await axios.head(invoiceUrl, { timeout: 5000 });
							console.log(`[RECEIPT] Invoice URL is accessible: ${testResponse.status}`);
						} catch (urlTestError) {
							console.warn(`[RECEIPT] Invoice URL might not be accessible yet: ${urlTestError.message}`);
							console.warn(`[RECEIPT] This is normal - invoice PDF may take a few seconds to generate in Daftra`);
						}
						
						// Save invoice to booking record (guest can access)
						updatedBooking.invoice_id = daftraResponse.id;
						updatedBooking.invoice_url = invoiceUrl;
						await updatedBooking.save();

						// Also store in transaction record for admin access
						if (transaction && transaction._id) {
							await TransactionService.FindByIdAndUpdateService(
								transaction._id,
								{
									invoice_id: daftraResponse.id,
									invoice_url: invoiceUrl,
								}
							);
						}

						console.log(
							"[RECEIPT] Daftra receipt generated successfully:",
							daftraResponse.id,
							"PDF URL:",
							invoiceUrl,
							"Saved to booking and transaction records"
						);
						
						invoiceGenerated = true;
					} else {
						console.warn("[RECEIPT] Daftra response received but no receipt ID found");
					}
				} catch (receiptError) {
					// Log detailed error information
					console.error(
						"[RECEIPT] Error generating Daftra receipt:",
						receiptError.message
					);
					
					// Log additional error details if available
					if (receiptError.response) {
						console.error("[RECEIPT] Error status:", receiptError.response.status);
						console.error("[RECEIPT] Error data:", JSON.stringify(receiptError.response.data));
					}
					
					// FALLBACK: Generate local invoice if Daftra fails
					console.log("[RECEIPT] Attempting to generate local invoice as fallback...");
					try {
						const localInvoice = await LocalInvoiceGenerator.generateAndSaveInvoice(
							bookingDetails,
							event,
							user,
							organizer
						);

						if (localInvoice && localInvoice.id) {
							// Save local invoice to booking record
							updatedBooking.invoice_id = localInvoice.id;
							updatedBooking.invoice_url = `${process.env.BASE_URL || 'http://localhost:3434'}${localInvoice.invoice_url}`;
							await updatedBooking.save();

							// Also store in transaction record
							if (transaction && transaction._id) {
								await TransactionService.FindByIdAndUpdateService(
									transaction._id,
									{
										invoice_id: localInvoice.id,
										invoice_url: `${process.env.BASE_URL || 'http://localhost:3434'}${localInvoice.invoice_url}`,
									}
								);
							}

							console.log(
								"[RECEIPT] Local invoice generated successfully:",
								localInvoice.id,
								"URL:",
								localInvoice.invoice_url
							);
						}
					} catch (localInvoiceError) {
						console.error("[RECEIPT] Failed to generate local invoice:", localInvoiceError.message);
						console.log("[RECEIPT] Payment processed successfully but invoice generation completely failed.");
					}
				}
			} else {
				console.warn("[RECEIPT] Daftra API credentials not configured.");
			}
		}

			// PRIORITY 3: Use local invoice generator (if both Fatora and Daftra failed/not configured)
			if (!invoiceGenerated) {
				console.log("[RECEIPT] Using local invoice generator as fallback...");
				
				// Use local invoice generator when both Fatora and Daftra are not available
				try {
					const localInvoice = await LocalInvoiceGenerator.generateAndSaveInvoice(
						bookingDetails,
						event,
						user,
						organizer
					);

					if (localInvoice && localInvoice.id) {
						// Save local invoice to booking record
						updatedBooking.invoice_id = localInvoice.id;
						updatedBooking.invoice_url = `${process.env.BASE_URL || 'http://localhost:3434'}${localInvoice.invoice_url}`;
						await updatedBooking.save();

						// Also store in transaction record
						if (transaction && transaction._id) {
							await TransactionService.FindByIdAndUpdateService(
								transaction._id,
								{
									invoice_id: localInvoice.id,
									invoice_url: `${process.env.BASE_URL || 'http://localhost:3434'}${localInvoice.invoice_url}`,
								}
							);
						}

						console.log(
							"[RECEIPT] Local invoice generated successfully:",
							localInvoice.id,
							"URL:",
							localInvoice.invoice_url
						);
					}
				} catch (localInvoiceError) {
					console.error("[RECEIPT] Failed to generate local invoice:", localInvoiceError.message);
				}
			}

			// Send booking confirmed notification after successful payment
			if (updatedBooking.payment_status === 1 && user && event) {
				try {
					// Get organizer for host name
					const organizer = await organizerService.FindOneService({ _id: event.organizer_id });
					
					await notificationHelper.sendGuestBookingConfirmed({
						experience_title: event.event_name,
						event_name: event.event_name,
						tickets_count: updatedBooking.no_of_attendees,
						no_of_attendees: updatedBooking.no_of_attendees,
						start_at: event.event_date || event.start_date,
						event_date: event.event_date || event.start_date,
						order_id: payment_id || updatedBooking.order_id || updatedBooking._id.toString(),
						total_amount: amount || updatedBooking.total_amount,
						price_total: amount || updatedBooking.total_amount,
						currency: 'SAR',
						book_id: booking_id,
						booking_id: booking_id,
						experience_id: event._id,
						event_id: event._id,
						host_first_name: organizer?.first_name || 'Host'
					}, user);
					console.log(`[NOTIFICATION] Sent booking confirmed notification to user ${bookingDetails.user_id}`);
				} catch (notifError) {
					console.error('[NOTIFICATION] Error sending booking confirmed notification:', notifError);
				}
			}

			// Add user to group chat ONLY after payment is successful
			// This ensures guests can only join group chat after they've paid
			// Check: event exists, event is approved, booking is approved (status 2), and payment is completed
			console.log(`[GROUP-CHAT] Checking conditions - Event exists: ${!!event}, Event approved: ${event?.is_approved}, Booking status: ${updatedBooking?.book_status}, Payment status: ${updatedBooking?.payment_status}`);
			
			if (event && event.is_approved === 1 && updatedBooking.book_status === 2 && updatedBooking.payment_status === 1) {
				try {
					console.log(`[GROUP-CHAT] All conditions met! Attempting to add user ${bookingDetails.user_id} to group chat for event: ${event.event_name}`);
					// Check if event is approved and has a group chat
					let groupChat = await ConversationService.GetGroupChatByEventService(event._id);
					
					// If group chat doesn't exist, create it
					if (!groupChat) {
						console.log(`[GROUP-CHAT] Creating group chat for event: ${event.event_name} (Payment successful)`);
						groupChat = await ConversationService.CreateGroupChatService(
							event._id,
							event.organizer_id,
							event.event_name
						);
					}
					
					if (groupChat) {
						// Add paying guest to group chat
						try {
							await ConversationService.AddParticipantToGroupService(
								event._id,
								bookingDetails.user_id,
								1 // Role: User/Guest
							);
							console.log(`[GROUP-CHAT] Successfully added user ${bookingDetails.user_id} to group chat for event: ${event.event_name} (Payment successful)`);
						} catch (addParticipantError) {
							console.error(`[GROUP-CHAT] Error adding participant to group chat:`, addParticipantError);
							// Check if user is already a participant (this is okay)
							if (addParticipantError.message && addParticipantError.message.includes('already')) {
								console.log(`[GROUP-CHAT] User ${bookingDetails.user_id} is already a participant in group chat`);
							} else {
								throw addParticipantError; // Re-throw if it's a different error
							}
						}
						
						// Get user and organizer details for welcome message
						const guestName = user ? `${user.first_name} ${user.last_name}` : "Guest";
					const _organizerName = organizer ? `${organizer.first_name} ${organizer.last_name}` : "Host";
						if (organizer && organizer._id) {
							try {
								const MessageService = require("../services/messageService");
								const userLang = user?.language || req.lang || "en";
								const welcomeMessage = userLang === "ar" 
									? `تم إضافة ${guestName} إلى محادثة المجموعة بعد إتمام الدفع. مرحباً بك!`
									: `${guestName} has been added to the group chat after completing payment. Welcome!`;
								
								await MessageService.CreateService({
									conversation_id: groupChat._id,
									sender_id: organizer._id,
									sender_role: 2, // Organizer
									message: welcomeMessage,
									message_type: "text",
								});
							
								// Update conversation last message
								await ConversationService.FindByIdAndUpdateService(groupChat._id, {
									last_message: welcomeMessage,
									last_message_at: new Date(),
									last_sender_id: organizer._id,
									last_sender_role: 2,
								});
								
								// Send notification to guest about being added to group chat
								try {
									const { sendEventBookingAcceptNotification } = require("../helpers/pushNotification");
									const groupChatNotification = {
										title: userLang === "ar" ? "تمت إضافتك إلى محادثة المجموعة" : "Added to Group Chat",
										description: userLang === "ar" 
											? `تمت إضافتك إلى محادثة المجموعة لحدث "${event.event_name}" بعد إتمام الدفع. يمكنك الآن التواصل مع المشاركين الآخرين.`
											: `You've been added to the group chat for "${event.event_name}" after completing payment. You can now communicate with other participants.`,
										first_name: organizer.first_name,
										last_name: organizer.last_name,
										profile_image: organizer.profile_image || "",
										userId: organizer._id,
										event_id: event._id,
										book_id: booking_id,
										notification_type: 5, // Group chat notification type
										status: 2, // Paid status
									};
									
									// Create in-app notification
									await NotificationService.CreateService({
										user_id: bookingDetails.user_id,
										role: 1, // User/Guest role
										title: groupChatNotification.title,
										description: groupChatNotification.description,
										isRead: false,
										notification_type: 5, // Group chat notification
										event_id: event._id,
										book_id: booking_id,
										profile_image: organizer.profile_image || "",
										username: `${organizer.first_name} ${organizer.last_name}`,
										senderId: organizer._id,
									});
									
									// Send push notification
									await sendEventBookingAcceptNotification(res, bookingDetails.user_id, groupChatNotification);
									
									console.log(`[NOTIFICATION] Sent group chat notification to user ${bookingDetails.user_id} after payment`);
								} catch (groupNotificationError) {
									console.error('[NOTIFICATION] Error sending group chat notification:', groupNotificationError);
								}
							} catch (messageError) {
								console.error('[GROUP-CHAT] Error sending welcome message:', messageError);
							}
						} else {
							console.warn(`[GROUP-CHAT] Organizer not found for event ${event._id}, skipping welcome message`);
						}
					} else {
						console.log(`[GROUP-CHAT] Failed to create or find group chat for event: ${event.event_name}`);
					}
				} catch (groupChatError) {
					console.error('[GROUP-CHAT] Error adding participant to group chat after payment:', groupChatError);
					console.error('[GROUP-CHAT] Error details:', {
						message: groupChatError.message,
						stack: groupChatError.stack,
						eventId: event?._id,
						userId: bookingDetails.user_id
					});
					// Don't fail the payment update if group chat addition fails
				}
			} else {
				console.log(`[GROUP-CHAT] Conditions not met - Event: ${event?._id}, Event approved: ${event?.is_approved}, Booking status: ${updatedBooking?.book_status}, Payment status: ${updatedBooking?.payment_status}`);
			}

			// Create notifications for user and organizer
			if (event && user && organizer) {
				const userLang = user.language || req.lang || "en";
				const organizerLang = organizer.language || req.lang || "en";
				
				// Notify the guest about successful payment with push notification
				try {
					const { sendEventBookingAcceptNotification } = require("../helpers/pushNotification");
					const guestNotificationData = {
						title: userLang === "ar" ? "تم الدفع بنجاح" : "Payment Successful",
						description: userLang === "ar" 
							? `تم معالجة دفعتك لـ "${event.event_name}" بنجاح.`
							: `Your payment for "${event.event_name}" has been processed successfully.`,
						first_name: user.first_name,
						last_name: user.last_name,
						userId: user._id,
						profile_image: user.profile_image || "",
						event_id: event._id,
						book_id: booking_id,
						notification_type: 2, // Payment success type
						status: 2, // Approved status
					};
					await sendEventBookingAcceptNotification(res, bookingDetails.user_id, guestNotificationData);
					console.log(`[NOTIFICATION] Sent payment success push notification to guest: ${bookingDetails.user_id}`);
				} catch (pushError) {
					console.error('[PUSH-NOTIFICATION] Error sending push to guest, creating in-app notification:', pushError);
					await NotificationService.CreateService({
						user_id: bookingDetails.user_id,
						role: 1, // User/Guest role
						title: userLang === "ar" ? "تم الدفع بنجاح" : "Payment Successful",
						description: userLang === "ar" 
							? `تم معالجة دفعتك لـ "${event.event_name}" بنجاح.`
							: `Your payment for "${event.event_name}" has been processed successfully.`,
						event_id: event._id,
						book_id: booking_id,
						notification_type: 2, // Payment success type
						status: 2, // Approved status
						isRead: false,
					});
				}

				// Notify the organizer/host about new payment
				const organizerNotificationData = {
					title: organizerLang === "ar" ? "تم استلام دفعة جديدة" : "New Booking Payment Received",
					description: organizerLang === "ar"
						? `${user.first_name} ${user.last_name} دفع مبلغ ${amount || bookingDetails.total_amount} ريال لحجز "${event.event_name}".`
						: `${user.first_name} ${user.last_name} has paid ${amount || bookingDetails.total_amount} SAR for booking "${event.event_name}".`,
					event_id: event.event_id,
					event_type: event.event_type,
					event_name: event.event_name,
					userId: user._id,
					book_id: booking_id,
					notification_type: 1, // Booking request type (payment completed)
					status: 2, // Approved status
					first_name: user.first_name,
					last_name: user.last_name,
					profile_image: user.profile_image,
				};

				// Send push notification to organizer
				await sendEventBookingNotification(
					res,
					bookingDetails.organizer_id,
					organizerNotificationData
				);
			}

			// Fetch the complete updated booking with event details for frontend
			const completeBooking = await BookEventService.AggregateService([
				{ $match: { _id: new mongoose.Types.ObjectId(booking_id) } },
				{
					$lookup: {
						from: "events",
						localField: "event_id",
						foreignField: "_id",
						as: "event",
					},
				},
				{ $unwind: "$event" },
				{
					$lookup: {
						from: "organizers",
						localField: "organizer_id",
						foreignField: "_id",
						as: "organizer",
					},
				},
				{ $unwind: "$organizer" },
				{
					$project: {
						_id: 1,
						book_status: 1,
						payment_status: 1,
						payment_id: 1,
						total_amount: 1,
						no_of_attendees: 1,
						invoice_id: 1,
						invoice_url: 1,
						order_id: 1,
						confirmed_at: 1,
						createdAt: 1,
						event: {
							_id: "$event._id",
							event_name: "$event.event_name",
							event_image: "$event.event_image",
							event_date: "$event.event_date",
							event_start_time: "$event.event_start_time",
							event_end_time: "$event.event_end_time",
							event_address: "$event.event_address",
						},
						organizer: {
							first_name: "$organizer.first_name",
							last_name: "$organizer.last_name",
							profile_image: "$organizer.profile_image",
						},
					},
				},
			]);

			return Response.ok(
				res,
				{
					payment_status: 1,
					booking_id: booking_id,
					payment_id: payment_id,
					book_status: 2,
					booking: completeBooking[0] || null, // Include full booking details
				},
				200,
				resp_messages(req.lang).update_success
			);
		} catch (error) {
			console.error("Payment status update error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages(req.lang).internalServerError
			);
		}
	},

	/**
	 * Verify email address
	 * GET /user/verify-email?token=xxx
	 */
	verifyEmail: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const { token } = req.query;

			console.log("[USER:VERIFY-EMAIL] Verification request for token:", token);

			if (!token) {
				return Response.validationErrorResponse(
					res,
					resp_messages(lang).token_required || "Verification token is required"
				);
			}

			const EmailVerificationService = require("../services/emailVerificationService");

			// Find valid token
			const tokenDoc = await EmailVerificationService.FindByToken(token);

			if (!tokenDoc) {
				console.log("[USER:VERIFY-EMAIL] Invalid or expired token");
				return Response.validationErrorResponse(
					res,
					resp_messages(lang).invalid_token || "Invalid or expired verification link"
				);
			}

			console.log("[USER:VERIFY-EMAIL] Token found:", {
				user_id: tokenDoc.user_id,
				user_type: tokenDoc.user_type
			});

			// Verify this is a user token, not an organizer token
			if (tokenDoc.user_type !== "user") {
				console.log("[USER:VERIFY-EMAIL] Token belongs to organizer, not user");
				return Response.validationErrorResponse(
					res,
					resp_messages(lang).invalid_token || "Invalid verification link. Please use the correct verification link for your account type."
				);
			}

			// Get user
			const user = await UserService.FindByIdService(tokenDoc.user_id);

			if (!user) {
				console.log("[USER:VERIFY-EMAIL] User not found");
				return Response.notFoundResponse(
					res,
					resp_messages(lang).user_not_found || "User not found"
				);
			}

			// Check if email already verified
			if (user.email_verified_at) {
				console.log("[USER:VERIFY-EMAIL] Email already verified");
				// Mark token as used anyway
				await EmailVerificationService.MarkAsUsed(tokenDoc._id);
				
				const bothVerified = user.is_verified && user.phone_verified;
				
				return Response.ok(
					res,
					{
						user: {
							_id: user._id,
							email: user.email,
							first_name: user.first_name,
							last_name: user.last_name,
							is_verified: user.is_verified,
							phone_verified: user.phone_verified,
							email_verified: true,
						},
					},
					200,
					bothVerified 
						? (resp_messages(lang).already_verified || "Email already verified. You can login now.")
						: (lang === "ar" 
							? "البريد الإلكتروني مُؤكد بالفعل. يرجى تأكيد رقم الهاتف لإكمال التسجيل."
							: "Email already verified. Please verify your phone number to complete registration.")
				);
			}

			// Mark email as verified
			user.email_verified_at = new Date();
			
			// Check if phone is also verified - if both verified, mark is_verified as true
			if (user.phone_verified) {
				user.is_verified = true;
				console.log("[USER:VERIFY-EMAIL] Both email and phone verified - account fully verified");
			} else {
				console.log("[USER:VERIFY-EMAIL] Email verified, waiting for phone verification");
			}
			
			await user.save();

			// Mark token as used
			await EmailVerificationService.MarkAsUsed(tokenDoc._id);

			console.log("[USER:VERIFY-EMAIL] Email verified successfully:", user.email);

			// If both verified, generate login token for auto-login
			const responseData = {
				user: {
					_id: user._id,
					email: user.email,
					phone_number: user.phone_number,
					first_name: user.first_name,
					last_name: user.last_name,
					is_verified: user.is_verified,
					phone_verified: user.phone_verified,
					email_verified: true,
					role: user.role,
				},
			};

			if (user.is_verified) {
				const loginToken = generateToken(user._id, user.role);
				responseData.token = loginToken; // For auto-login only when both verified
			}

			return Response.ok(
				res,
				responseData,
				200,
				user.is_verified
					? (resp_messages(lang).verification_success || "Email and phone verified successfully! You can now login.")
					: (lang === "ar"
						? "تم تأكيد البريد الإلكتروني بنجاح! يرجى تأكيد رقم الهاتف لإكمال التسجيل."
						: "Email verified successfully! Please verify your phone number to complete registration.")
			);
		} catch (error) {
			console.error("[USER:VERIFY-EMAIL] Verification error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages(lang).internalServerError
			);
		}
	},

	/**
	 * Resend verification email
	 * POST /user/resend-verification
	 * Body: { email }
	 */
	resendVerification: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const { email } = req.body;

			console.log("[USER:RESEND-VERIFICATION] Request for:", email);

			if (!email) {
				return Response.validationErrorResponse(
					res,
					resp_messages(lang).email_required || "Email is required"
				);
			}

			const emailLower = cleanEmail(email);

			// Find user
			const user = await UserService.FindOneService({
				email: emailLower,
				is_delete: { $ne: 1 },
			});

			if (!user) {
				return Response.notFoundResponse(
					res,
					resp_messages(lang).user_not_found || "User not found"
				);
			}

			// Check if already verified
			if (user.is_verified) {
				return Response.validationErrorResponse(
					res,
					resp_messages(lang).already_verified || "Email already verified"
				);
			}

			const emailService = require("../helpers/emailService");
			const EmailVerificationService = require("../services/emailVerificationService");

			// Delete old tokens
			await EmailVerificationService.DeleteUserTokens(user._id, "user");

			// Generate new token
			const verificationToken = emailService.generateVerificationToken();
			const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

			// Save token
			await EmailVerificationService.CreateToken({
				token: verificationToken,
				user_id: user._id,
				user_type: "user",
				email: emailLower,
				expiresAt,
			});

			// Generate verification link
			const verificationLink = emailService.generateVerificationLink(
				verificationToken,
				1, // role: user
				lang
			);

			// Send email
			const emailHtml = emailService.renderGuestVerificationEmail(
				`${user.first_name} ${user.last_name}`,
				verificationLink,
				lang
			);

			const subject = lang === "ar" 
				? "تأكيد البريد الإلكتروني - Zuroona" 
				: "Verify your email address - Zuroona";

			console.log("[USER:RESEND-VERIFICATION] Sending email to:", emailLower);

			const emailSent = await emailService.send(emailLower, subject, emailHtml);

			return Response.ok(
				res,
				{
					email: emailLower,
					verification_sent: emailSent,
					verification_link: process.env.NODE_ENV === "development" ? verificationLink : undefined,
				},
				200,
				emailSent 
					? (resp_messages(lang).verification_email_sent || "Verification email sent successfully")
					: (resp_messages(lang).verification_email_failed || "Failed to send verification email")
			);
		} catch (error) {
			console.error("[USER:RESEND-VERIFICATION] Error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages(lang).internalServerError
			);
		}
	},

	/**
	 * Verify signup OTP for phone number
	 * POST /user/verify-signup-otp
	 * Body: { user_id, phone_number, country_code, otp }
	 */
	verifySignupOtp: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const { user_id, phone_number, country_code, otp } = req.body;

			console.log("[USER:VERIFY-SIGNUP-OTP] Verification request:", { user_id, phone_number, country_code });

			// Validate inputs
			if (!user_id) {
				return Response.validationErrorResponse(
					res,
					"User ID is required"
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

			// Find user
			const user = await UserService.FindByIdService(user_id);
			if (!user) {
				return Response.notFoundResponse(
					res,
					resp_messages(lang).user_not_found || "User not found"
				);
			}

			// Check if phone already verified
			if (user.phone_verified) {
				console.log("[USER:VERIFY-SIGNUP-OTP] Phone already verified");
				return Response.ok(
					res,
					{
						user: {
							_id: user._id,
							phone_verified: true,
							is_verified: user.is_verified,
						},
					},
					200,
					lang === "ar"
						? "رقم الهاتف مؤكد بالفعل"
						: "Phone number already verified"
				);
			}

			// Verify OTP
			// IMPORTANT: Format phone number EXACTLY as it was when sending OTP
			// This must match the format used in userRegistration
			let fullPhoneNumber;
			console.log(`[USER:VERIFY-SIGNUP-OTP] Phone formatting - phoneStr: "${phoneValidation.cleanPhone}", length: ${phoneValidation.cleanPhone.length}, country: ${country_code}`);
			
			if (country_code === "+92") {
				// Pakistan: Format exactly as done in registration
				if (phoneValidation.cleanPhone.length === 10 && phoneValidation.cleanPhone.startsWith('0')) {
					// 10 digits starting with 0: Remove 0 and use 9 digits
					const numberWithoutZero = phoneValidation.cleanPhone.substring(1);
					fullPhoneNumber = `${country_code}${numberWithoutZero}`;
				}
				else if (phoneValidation.cleanPhone.length === 10 && !phoneValidation.cleanPhone.startsWith('0')) {
					// 10 digits without leading 0: Use as-is -> +923054717775
					fullPhoneNumber = `${country_code}${phoneValidation.cleanPhone}`;
				}
				else if (phoneValidation.cleanPhone.length === 9) {
					// 9 digits: MSGATE needs 10 digits for Pakistan - reject
					throw new Error(`Invalid Pakistan phone number format. MSGATE requires 10 digits after +92, but received only ${phoneValidation.cleanPhone.length} digits. Please enter the complete 10-digit number (e.g., 3054717775).`);
				}
				else {
					fullPhoneNumber = `${country_code}${phoneValidation.cleanPhone}`;
				}
			} else {
				// Saudi numbers: use as is
				fullPhoneNumber = `${country_code}${phoneValidation.cleanPhone}`;
			}
			
			console.log(`[USER:VERIFY-SIGNUP-OTP] Formatted phone for verification: ${fullPhoneNumber}`);
			
			const { verifySignupOtp } = require("../helpers/otpSend");
			
			try {
				await verifySignupOtp(user_id, fullPhoneNumber, otpValidation.cleanOtp, 1);
			} catch (otpError) {
				console.error("[USER:VERIFY-SIGNUP-OTP] OTP verification failed:", otpError.message);
				console.error("[USER:VERIFY-SIGNUP-OTP] Error details:", otpError);
				return Response.validationErrorResponse(
					res,
					otpError.message || "Invalid or expired OTP"
				);
			}

			// Mark phone as verified
			user.phone_verified = true;
			user.phone_verified_at = new Date();

			// Check if email is also verified - if both verified, mark is_verified as true
			if (user.email_verified_at) {
				user.is_verified = true;
				console.log("[USER:VERIFY-SIGNUP-OTP] Both email and phone verified - account fully verified");
			} else {
				console.log("[USER:VERIFY-SIGNUP-OTP] Phone verified, waiting for email verification");
			}

			await user.save();

			// Generate login token if both verified
			const responseData = {
				user: {
					_id: user._id,
					email: user.email,
					phone_number: user.phone_number,
					country_code: user.country_code,
					first_name: user.first_name,
					last_name: user.last_name,
					is_verified: user.is_verified,
					phone_verified: true,
					email_verified: !!user.email_verified_at,
					role: user.role,
				},
			};

			if (user.is_verified) {
				const { generateToken } = require("../helpers/generateToken");
				const loginToken = generateToken(user._id, user.role);
				responseData.token = loginToken; // For auto-login only when both verified
			}

			return Response.ok(
				res,
				responseData,
				200,
				user.is_verified
					? (lang === "ar"
						? "تم تأكيد البريد الإلكتروني ورقم الهاتف بنجاح! يمكنك الآن تسجيل الدخول."
						: "Email and phone verified successfully! You can now login.")
					: (lang === "ar"
						? "تم تأكيد رقم الهاتف بنجاح! يرجى تأكيد البريد الإلكتروني لإكمال التسجيل."
						: "Phone number verified successfully! Please verify your email address to complete registration.")
			);
		} catch (error) {
			console.error("[USER:VERIFY-SIGNUP-OTP] Verification error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages(lang).internalServerError
			);
		}
	},

	/**
	 * Resend signup OTP to phone number
	 * POST /user/resend-signup-otp
	 * Body: { user_id, phone_number, country_code }
	 */
	resendSignupOtp: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const { user_id, phone_number, country_code } = req.body;

			console.log("[USER:RESEND-SIGNUP-OTP] Resend request:", { user_id, phone_number, country_code });

			if (!user_id) {
				return Response.validationErrorResponse(
					res,
					"User ID is required"
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

			// Find user
			const user = await UserService.FindByIdService(user_id);
			if (!user) {
				return Response.notFoundResponse(
					res,
					resp_messages(lang).user_not_found || "User not found"
				);
			}

			// Check if phone already verified
			if (user.phone_verified) {
				return Response.validationErrorResponse(
					res,
					lang === "ar"
						? "رقم الهاتف مؤكد بالفعل"
						: "Phone number already verified"
				);
			}

			// Send OTP
			// IMPORTANT: Format phone number EXACTLY as done in registration
			// This must match the format used in userRegistration
			let fullPhoneNumber;
			const phoneStr = phoneValidation.cleanPhone;
			console.log(`[USER:RESEND-SIGNUP-OTP] Phone formatting - phoneStr: "${phoneStr}", length: ${phoneStr.length}, country: ${country_code}`);
			
			if (country_code === "+92") {
				// Pakistan: Format exactly as done in registration
				if (phoneStr.length === 10 && phoneStr.startsWith('0')) {
					// 10 digits starting with 0: Remove 0 and use 9 digits
					const numberWithoutZero = phoneStr.substring(1);
					fullPhoneNumber = `${country_code}${numberWithoutZero}`;
					console.log(`[USER:RESEND-SIGNUP-OTP] 10-digit number with leading 0: "${phoneStr}" -> Removed 0 -> "${numberWithoutZero}" -> ${fullPhoneNumber}`);
				}
				else if (phoneStr.length === 10 && !phoneStr.startsWith('0')) {
					// 10 digits without leading 0: Use as-is -> +923289081825
					fullPhoneNumber = `${country_code}${phoneStr}`;
					console.log(`[USER:RESEND-SIGNUP-OTP] 10-digit number without leading 0: "${phoneStr}" -> Use as-is -> ${fullPhoneNumber}`);
				}
				else if (phoneStr.length === 9) {
					// 9 digits: MSGATE needs 10 digits for Pakistan - reject
					throw new Error(`Invalid Pakistan phone number format. MSGATE requires 10 digits after +92, but received only ${phoneStr.length} digits. Please enter the complete 10-digit number (e.g., 3289081825).`);
				}
				else {
					// Unexpected length: use as is
					fullPhoneNumber = `${country_code}${phoneStr}`;
					console.log(`[USER:RESEND-SIGNUP-OTP] Warning: Unexpected phone length: ${phoneStr.length} digits`);
				}
			} else {
				// Saudi numbers: use as is
				fullPhoneNumber = `${country_code}${phoneStr}`;
			}
			
			console.log(`[USER:RESEND-SIGNUP-OTP] Formatted phone for OTP: ${fullPhoneNumber} (original: "${phoneStr}", length: ${phoneStr.length}, country: ${country_code})`);
			
			const { sendSignupOtp } = require("../helpers/otpSend");
			let otpSent = false;
			let otpValue = null;

			try {
				otpValue = await sendSignupOtp(user_id, fullPhoneNumber, 1, lang);
				otpSent = true;
				console.log("[USER:RESEND-SIGNUP-OTP] OTP sent successfully");
			} catch (otpError) {
				console.error("[USER:RESEND-SIGNUP-OTP] Error sending OTP:", otpError.message);
				return Response.validationErrorResponse(
					res,
					otpError.message || "Failed to send OTP. Please try again later."
				);
			}

			return Response.ok(
				res,
				{
					user_id: user_id,
					phone_number: phone_number,
					otp_sent: otpSent,
					otp_for_testing: process.env.NODE_ENV === "development" && otpValue ? otpValue : undefined,
				},
				200,
				otpSent
					? resp_messages(lang).otp_sent_phone
					: "Failed to send OTP"
			);
		} catch (error) {
			console.error("[USER:RESEND-SIGNUP-OTP] Error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages(lang).internalServerError
			);
		}
	},

	/**
	 * Request refund for cancelled booking
	 * POST /user/refund/request
	 */
	requestRefund: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const { userId } = req;
			const { booking_id, refund_reason } = req.body;

			console.log("[REFUND:REQUEST] Refund request:", { booking_id, userId });

			// Validate inputs
			if (!booking_id) {
				return Response.validationErrorResponse(
					res,
					resp_messages(lang).id_required
				);
			}

			if (!refund_reason || refund_reason.trim().length < 10) {
				return Response.validationErrorResponse(
					res,
					"Refund reason is required and must be at least 10 characters"
				);
			}

			// Find booking
			const BookEventService = require("../services/bookEventService");
			const booking = await BookEventService.FindOneService({
				_id: booking_id,
				user_id: userId,
			});

			if (!booking) {
				return Response.notFoundResponse(
					res,
					resp_messages(lang).bookingNotFound
				);
			}

			// Check if booking is cancelled (status 3)
			if (booking.book_status !== 3) {
				return Response.badRequestResponse(
					res,
					resp_messages(lang).refund_booking_not_cancelled
				);
			}

			// Check if payment was made
			if (booking.payment_status !== 1) {
				return Response.badRequestResponse(
					res,
					resp_messages(lang).refund_booking_not_paid
				);
			}

			// Check if refund already requested
			const RefundRequestService = require("../services/refundRequestService");
			const existingRefund = await RefundRequestService.FindOneService({
				booking_id: booking_id,
				user_id: userId,
			});

			if (existingRefund) {
				return Response.badRequestResponse(
					res,
					existingRefund.status === 0
						? resp_messages(lang).refund_request_pending
						: existingRefund.status === 1
						? resp_messages(lang).refund_request_approved
						: existingRefund.status === 2
						? resp_messages(lang).refund_request_rejected
						: resp_messages(lang).refund_already_processed
				);
			}

			// Get event details
			const EventService = require("../services/eventService");
			const event = await EventService.FindOneService({
				_id: booking.event_id,
			});

			if (!event) {
				return Response.notFoundResponse(res, resp_messages(lang).eventNotFound);
			}

			// Create refund request
			console.log("[REFUND:REQUEST] Creating refund request with data:", {
				booking_id: booking._id,
				user_id: userId,
				event_id: booking.event_id,
				organizer_id: booking.organizer_id,
				amount: booking.total_amount,
				refund_reason: refund_reason.trim(),
			});

			const refundRequest = await RefundRequestService.CreateService({
				booking_id: booking._id,
				user_id: userId,
				event_id: booking.event_id,
				organizer_id: booking.organizer_id,
				amount: booking.total_amount,
				refund_reason: refund_reason.trim(),
				status: 0, // Pending
			});

			if (!refundRequest || !refundRequest._id) {
				console.error("[REFUND:REQUEST] Failed to create refund request");
				return Response.serverErrorResponse(
					res,
					resp_messages(lang).refund_creation_failed
				);
			}

			console.log("[REFUND:REQUEST] Refund request created successfully:", refundRequest._id);

			// Update booking with refund request ID
			try {
				await BookEventService.FindByIdAndUpdateService(booking._id, {
					refund_request_id: refundRequest._id,
				});
				console.log("[REFUND:REQUEST] Booking updated with refund_request_id");
			} catch (updateError) {
				console.error("[REFUND:REQUEST] Error updating booking:", updateError);
				// Don't fail the request if booking update fails
			}

			// Create notification for admin
			const AdminService = require("../services/adminService");
			const admins = await AdminService.FindService({ is_delete: { $ne: 1 } });

			for (const admin of admins) {
				await NotificationService.CreateService({
					user_id: admin._id,
					role: 3, // Admin role
					title: "New Refund Request",
					title_ar: "طلب استرداد جديد",
					description: `User requested refund of ${booking.total_amount} SAR for cancelled booking`,
					description_ar: `طلب مستخدم استرداد مبلغ ${booking.total_amount} SAR لحجز ملغي`,
					isRead: false,
					notification_type: 4, // Refund type
					event_id: booking.event_id,
					book_id: booking._id,
				});
			}

			console.log("[REFUND:REQUEST] Refund request created:", refundRequest._id);

			return Response.ok(
				res,
				{
					refund_request: {
						_id: refundRequest._id,
						booking_id: refundRequest.booking_id,
						amount: refundRequest.amount,
						status: refundRequest.status,
						refund_reason: refundRequest.refund_reason,
						createdAt: refundRequest.createdAt,
					},
				},
				201,
				lang === "ar"
					? "تم تقديم طلب الاسترداد بنجاح. سيتم مراجعته من قبل المسؤول."
					: "Refund request submitted successfully. It will be reviewed by admin."
			);
		} catch (error) {
			console.error("[REFUND:REQUEST] Error:", error);
			return Response.serverErrorResponse(
				res,
				error.message || resp_messages(lang).internalServerError
			);
		}
	},

	/**
	 * Get user's refund requests
	 * GET /user/refund/list
	 */
	getRefundRequests: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const { userId } = req;
			const { page = 1, limit = 10, status } = req.query;

			console.log("[REFUND:LIST] Fetching refunds for user:", userId, { page, limit, status });

			// Build query
			const query = { user_id: new mongoose.Types.ObjectId(userId) };

			// Filter by status if provided
			if (status !== undefined && status !== null && status !== "") {
				query.status = parseInt(status);
			}

			const RefundRequestService = require("../services/refundRequestService");
			
			// Fetch refund requests with proper error handling and populated data
			let refundRequests;
			try {
				// Use aggregation for better populated data
				refundRequests = await RefundRequestService.AggregateService([
					{ $match: query },
					{
						$lookup: {
							from: "events",
							localField: "event_id",
							foreignField: "_id",
							as: "event"
						}
					},
					{ $unwind: { path: "$event", preserveNullAndEmptyArrays: true } },
					{
						$project: {
							_id: 1,
							booking_id: 1,
							user_id: 1,
							event_id: 1,
							organizer_id: 1,
							amount: 1,
							currency: 1,
							refund_reason: 1,
							status: 1,
							admin_response: 1,
							payment_refund_id: 1,
							refund_error: 1,
							processed_at: 1,
							createdAt: 1,
							updatedAt: 1,
							event: {
								_id: "$event._id",
								event_name: "$event.event_name",
								event_date: "$event.event_date",
								event_image: "$event.event_image"
							}
						}
					},
					{ $sort: { createdAt: -1 } },
					{ $skip: (Number(page) - 1) * Number(limit) },
					{ $limit: Number(limit) }
				]);
				
				console.log("[REFUND:LIST] Found refunds:", refundRequests?.length || 0);
			} catch (serviceError) {
				console.error("[REFUND:LIST] Service error:", serviceError);
				// If no refunds found, return empty array instead of error
				refundRequests = [];
			}

			// Get count
			let count = 0;
			try {
				count = await RefundRequestService.CountDocumentService(query);
			} catch (countError) {
				console.error("[REFUND:LIST] Count error:", countError);
				count = Array.isArray(refundRequests) ? refundRequests.length : 0;
			}

			// Ensure refundRequests is an array
			if (!Array.isArray(refundRequests)) {
				refundRequests = [];
			}

			return Response.ok(
				res,
				refundRequests,
				200,
				resp_messages(lang).fetched_data || "Fetched data",
				count
			);
		} catch (error) {
			console.error("[REFUND:LIST] Error:", error);
			console.error("[REFUND:LIST] Error stack:", error.stack);
			return Response.serverErrorResponse(
				res,
				error.message || resp_messages(lang).internalServerError || "Internal server error"
			);
		}
	},

	/**
	 * Get refund request detail
	 * GET /user/refund/detail
	 */
	getRefundDetail: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const { userId } = req;
			const { refund_id } = req.query;

			console.log("[REFUND:DETAIL] Request:", { refund_id, userId });

			if (!refund_id) {
				return Response.validationErrorResponse(res, "Refund ID is required");
			}

			// Validate ObjectId format
			if (!mongoose.Types.ObjectId.isValid(refund_id)) {
				return Response.validationErrorResponse(res, "Invalid refund ID format");
			}

			const RefundRequestService = require("../services/refundRequestService");
			
			// Use aggregation pipeline to populate related data and ensure user_id matches
			let refundRequests;
			try {
				refundRequests = await RefundRequestService.AggregateService([
					{
						$match: {
							_id: new mongoose.Types.ObjectId(refund_id),
							user_id: new mongoose.Types.ObjectId(userId),
						}
					},
					{
						$lookup: {
							from: "book_event",
							localField: "booking_id",
							foreignField: "_id",
							as: "booking"
						}
					},
					{ $unwind: { path: "$booking", preserveNullAndEmptyArrays: true } },
					{
						$lookup: {
							from: "users",
							localField: "user_id",
							foreignField: "_id",
							as: "user"
						}
					},
					{ $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
					{
						$lookup: {
							from: "events",
							localField: "event_id",
							foreignField: "_id",
							as: "event"
						}
					},
					{ $unwind: { path: "$event", preserveNullAndEmptyArrays: true } },
					{
						$lookup: {
							from: "organizers",
							localField: "organizer_id",
							foreignField: "_id",
							as: "organizer"
						}
					},
					{ $unwind: { path: "$organizer", preserveNullAndEmptyArrays: true } },
					{
						$project: {
							_id: 1,
							booking_id: 1,
							user_id: 1,
							event_id: 1,
							organizer_id: 1,
							amount: 1,
							currency: 1,
							refund_reason: 1,
							status: 1,
							admin_response: 1,
							payment_refund_id: 1,
							refund_error: 1,
							processed_at: 1,
							processed_by: 1,
							createdAt: 1,
							updatedAt: 1,
							booking: {
								_id: "$booking._id",
								order_id: "$booking.order_id",
								invoice_id: "$booking.invoice_id",
								no_of_attendees: "$booking.no_of_attendees",
								total_amount: "$booking.total_amount",
								payment_status: "$booking.payment_status",
								book_status: "$booking.book_status",
								createdAt: "$booking.createdAt"
							},
							user: {
								_id: "$user._id",
								first_name: "$user.first_name",
								last_name: "$user.last_name",
								email: "$user.email",
								phone_number: "$user.phone_number",
								profile_image: "$user.profile_image"
							},
							event: {
								_id: "$event._id",
								event_name: "$event.event_name",
								event_date: "$event.event_date",
								event_image: "$event.event_image",
								event_price: "$event.event_price"
							},
							organizer: {
								_id: "$organizer._id",
								first_name: "$organizer.first_name",
								last_name: "$organizer.last_name",
								email: "$organizer.email",
								group_name: "$organizer.group_name"
							}
						}
					}
				]);
			} catch (serviceError) {
				console.error("[REFUND:DETAIL] Service error:", serviceError);
				console.error("[REFUND:DETAIL] Service error stack:", serviceError.stack);
				// Return not found instead of server error
				return Response.notFoundResponse(
					res,
					"Refund request not found or you don't have permission"
				);
			}

			if (!refundRequests || refundRequests.length === 0) {
				console.log("[REFUND:DETAIL] Refund not found or user mismatch");
				return Response.notFoundResponse(
					res,
					"Refund request not found or you don't have permission"
				);
			}

			const refundRequest = refundRequests[0];
			console.log("[REFUND:DETAIL] Found refund request:", refundRequest._id);

			return Response.ok(
				res,
				refundRequest,
				200,
				resp_messages(lang).fetched_data || "Fetched data"
			);
		} catch (error) {
			console.error("[REFUND:DETAIL] Error:", error);
			console.error("[REFUND:DETAIL] Error stack:", error.stack);
			return Response.serverErrorResponse(
				res,
				error.message || resp_messages(lang).internalServerError || "Internal server error"
			);
		}
	},
};

module.exports = UserController;
module.exports.getLocalPhoneFromString = getLocalPhoneFromString;
