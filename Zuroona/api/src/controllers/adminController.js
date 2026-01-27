const { generateToken } = require("../helpers/generateToken.js");
const HashPassword = require("../helpers/hashPassword.js");
require("dotenv").config();
// OTP functionality removed - using email-based authentication only
const Response = require("../helpers/response.js");
const AdminService = require("../services/adminService.js");
const { PutObjectCommand, S3Client, HeadObjectCommand } = require('@aws-sdk/client-s3');
const mongoose = require('mongoose');
const path = require('path');
const GroupCategories = require("../models/groupCategoryModel.js");
const UserService = require("../services/userService.js");
const CmsService = require("../services/cmsService.js");
const GroupCategoriesService = require("../services/groupCategoriesService.js");
const EventCategoryService = require("../services/EventCategoriesService.js");
const organizerService = require("../services/organizerService.js");
const NotificationService = require("../services/notificationService.js");
const NotificationUsers = require("../models/notificationUserModel.js");
const BookEventService = require("../services/bookEventService.js");
const EventService = require("../services/eventService.js");
const resp_messages = require("../helpers/resp_messages.js");
const Notification = require("../models/notificationModel.js");
const TransactionService = require("../services/recentTransaction.js");
const WalletService = require("../services/walletService.js");
const ConversationService = require("../services/conversationService.js");
const { sendEventApprovalEmail, sendEventRejectionEmail, sendOrganizerApprovalEmail, sendOrganizerRejectionEmail } = require("../helpers/emailService.js");
const { pushNotification } = require("../helpers/pushNotification.js");


const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const folderExists = async (folderName, bucketName) => {
    try {
        const headObjectCommand = new HeadObjectCommand({
            Bucket: bucketName,
            Key: folderName
        });
        await s3.send(headObjectCommand);
        return true;
    } catch (error) {
        if (error.name === 'NotFound') {
            return false;
        }
        throw error;
    }
};

const createFolder = async (folderName, bucketName) => {
    const uploadParams = {
        Bucket: bucketName,
        Key: `${folderName}/`,
        Body: ''
    };
    const uploadCommand = new PutObjectCommand(uploadParams);
    await s3.send(uploadCommand);
};


const adminController = {
    adminRegister: async (req, res) => {
        try {
            const { lang } = req.headers;
            const { email } = req.body;

            const existingUser = await AdminService.FindOneService({ email });

            if (existingUser) {
                return Response.conflictResponse(res, {}, 409, `The admin already exists`)
            }

            const admin = await AdminService.CreateService(req.body);

            return Response.ok(res, admin, 201, 'user registered');

        } catch (error) {
            console.log('c')
            console.log(error);
            if (error) {
                if (error.message === 'could not create admin') {
                    return Response.badRequestResponse(res, 'admin not registered');
                }
            }
            return Response.serverErrorResponse(res,)
        }

    },
    forgotAdminPassword: async (req, res) => {
        const { lang } = req.headers || 'en';
        try {
            const { email } = req.body;

            console.log("[ADMIN:FORGOT-PASSWORD] Request for:", email);

            // Validate email
            if (!email || !email.includes("@")) {
                return Response.validationErrorResponse(
                    res,
                    resp_messages(lang).email_required || "Valid email address is required"
                );
            }

            const emailLower = email.toLowerCase().trim();

            // Find admin by email
            const admin = await AdminService.FindOneService({ email: emailLower });

            if (!admin) {
                // Don't reveal if email exists for security
                console.log("[ADMIN:FORGOT-PASSWORD] Admin not found (security: not revealing)");
                return Response.ok(
                    res,
                    {},
                    200,
                    "If an account with this email exists, a password reset link has been sent."
                );
            }

            console.log("[ADMIN:FORGOT-PASSWORD] Admin found:", admin._id);

            const emailService = require("../helpers/emailService");
            const EmailVerificationService = require("../services/emailVerificationService");

            // Delete old reset tokens
            await EmailVerificationService.DeleteUserTokens(admin._id, "admin");

            // Generate reset token
            const resetToken = emailService.generateVerificationToken();
            const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

            // Save token
            await EmailVerificationService.CreateToken({
                token: resetToken,
                user_id: admin._id,
                user_type: "admin",
                email: emailLower,
                expiresAt,
                token_type: "password_reset",
            });

            // Generate reset link
            const resetLink = emailService.generatePasswordResetLink(
                resetToken,
                3, // role: admin
                admin.language || lang
            );

            // Send email
            const emailHtml = emailService.renderPasswordResetEmail(
                `${admin.name || admin.username || "Admin"}`,
                resetLink,
                admin.language || lang
            );

            const subject = (admin.language || lang) === "ar" 
                ? "إعادة تعيين كلمة المرور - Zuroona" 
                : "Password Reset Request - Zuroona";

            console.log("[ADMIN:FORGOT-PASSWORD] Sending reset email to:", emailLower);

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
            console.error("[ADMIN:FORGOT-PASSWORD] Error:", error);
            return Response.serverErrorResponse(
                res,
                resp_messages(lang).internalServerError || "Internal server error"
            );
        }
    },
    changePassword: async (req, res) => {
        try {
            const { current_password, new_password } = req.body;

            const { userId, lang } = req;

            console.log(req.lang)

            let user = await AdminService.FindOneService({ _id: userId });

            if (!user) {
                return Response.notFoundResponse(res, resp_messages(lang).user_not_found)
            }
            const oldPassword = user.password;

            let isPassword = await HashPassword.matchPassword(current_password, oldPassword);

            if (!isPassword) {
                return Response.badRequestResponse(res, resp_messages(lang).currentPasswordWrong)
            }

            isPassword = await HashPassword.matchPassword(new_password, oldPassword)


            if (isPassword) {

                return Response.badRequestResponse(res, resp_messages(lang).newPasswordSameAsCurrent)
            }

            const new_hash_password = await HashPassword.hashPassword(new_password);

            user.password = new_hash_password;

            await user.save();

            return Response.ok(res, {}, 200, resp_messages(lang).passwordChangeSuccess)

        } catch (error) {
            console.log(error)
            return Response.serverErrorResponse(res)

        }
    },
    resetPassword: async (req, res) => {
        const { lang } = req.headers || 'en';
        try {
            const { token, new_password, confirmPassword } = req.body;

            console.log("[ADMIN:RESET-PASSWORD] Reset request received");

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

            // Check if token is for password reset and belongs to admin
            if (tokenRecord.token_type !== "password_reset" || tokenRecord.user_type !== "admin") {
                return Response.unauthorizedResponse(
                    res,
                    resp_messages(lang).invalid_token || "Invalid reset token"
                );
            }

            // Find admin (password is not hidden in admin model)
            const admin = await AdminService.FindOneService({
                _id: tokenRecord.user_id,
            });

            if (!admin) {
                return Response.notFoundResponse(
                    res,
                    resp_messages(lang).user_not_found || "Admin not found"
                );
            }

            // Hash new password
            const hashedPassword = await HashPassword.hashPassword(new_password);

            // Update password
            admin.password = hashedPassword;
            await admin.save();

            // Mark token as used
            await EmailVerificationService.MarkAsUsed(tokenRecord._id);

            console.log("[ADMIN:RESET-PASSWORD] Password reset successful for:", admin.email);

            return Response.ok(
                res,
                {},
                200,
                resp_messages(lang).passwordResetSuccess || "Password reset successfully. You can now login with your new password."
            );
        } catch (error) {
            console.error("[ADMIN:RESET-PASSWORD] Error:", error);
            return Response.serverErrorResponse(
                res,
                resp_messages(lang).internalServerError || "Internal server error"
            );
        }
    },
    // OTP verification removed - using email-based authentication only
    adminLogin: async (req, res) => {
        const { lang } = req.headers || 'en'
        try {
            const { email, password } = req.body;

            console.log("[ADMIN:LOGIN] Login attempt for:", email);

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

            const emailLower = email.toLowerCase().trim();

            // Find admin by email only (no phone_number)
            const admin = await AdminService.FindOneService({ email: emailLower });

            if (!admin) {
                console.log("[ADMIN:LOGIN] Admin not found for email:", emailLower);
                return Response.unauthorizedResponse(
                    res,
                    resp_messages(lang).invalid_credentials || "Invalid email or password"
                );
            }

            console.log("[ADMIN:LOGIN] Admin found:", {
                id: admin._id,
                email: admin.email,
            });

            // Verify password
            const isPasswordValid = await HashPassword.matchPassword(password, admin.password);

            if (!isPasswordValid) {
                console.log("[ADMIN:LOGIN] Invalid password");
                return Response.unauthorizedResponse(
                    res,
                    resp_messages(lang).invalid_credentials || "Invalid email or password"
                );
            }

            console.log("[ADMIN:LOGIN] Password verified successfully");

            // Generate JWT token
            const token = generateToken(admin._id, admin.role);

            // Remove password from response
            const adminResponse = admin.toObject ? admin.toObject() : { ...admin };
            delete adminResponse.password;

            return Response.ok(
                res,
                {
                    token,
                    admin: adminResponse,
                },
                200,
                resp_messages(lang).login_success || "Login successful!"
            );

        } catch (error) {
            console.error("[ADMIN:LOGIN] Login error:", error);
            return Response.serverErrorResponse(
                res,
                resp_messages(lang).internalServerError || "Internal server error"
            );
        }
    },
    adminLogout: async (req, res) => {
        const { userId, lang } = req;
        try {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return Response.badRequestResponse(res, resp_messages(lang).id_required)
            }
            const user = await AdminService.FindOneService({ _id: userId });

            if (!user) {
                return Response.notFoundResponse(res, resp_messages(lang).user_not_found);
            }
            return Response.ok(res, {}, 200, resp_messages(lang).logout);
        } catch (error) {
            console.log(error.message)
            return Response.serverErrorResponse(res)
        }
    },
    categoryAdd: async (req, res) => {
        try {
            if (!req.files || !req.files.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const file = req.files.file;

            const allowedFileTypes = /jpeg|jpg|png|pdf/;
            const extName = allowedFileTypes.test(path.extname(file.name).toLowerCase());
            const mimeType = allowedFileTypes.test(file.mimetype);

            if (!extName || !mimeType) {
                return res.status(400).json({ message: 'Only images and PDFs are allowed.' });
            }

            const folderName = 'jeena';
            const bucketName = process.env.AWS_BUCKET_NAME;

            const folderExistsInS3 = await folderExists(folderName, bucketName);
            if (!folderExistsInS3) {
                await createFolder(folderName, bucketName);
            } else {
                console.log('Folder already exists');
            }

            const fileName = `${Date.now().toString()}_${file.name}`;
            const uploadParams = {
                Bucket: bucketName,
                Key: `${folderName}/${fileName}`,
                Body: file.data,
                ContentType: file.mimetype
            };

            const uploadCommand = new PutObjectCommand(uploadParams);
            await s3.send(uploadCommand);

            const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${folderName}/${fileName}`;

            const result = await GroupCategories.create({ url: fileUrl });
            res.status(200).json({ message: 'File uploaded successfully', result });
        } catch (error) {
            return Response.serverErrorResponse(res)

        }
    },
    adminProfile: async (req, res) => {
        try {
            const { userId } = req;
            const lang = req.lang || req.headers.lang || 'en';
            const user = await AdminService.FindOneService({ _id: userId });
            if (!user) {
                return Response.badRequestResponse(res, resp_messages(lang).user_not_found);
            }
            return Response.ok(res, user, 200, resp_messages(lang).profile_access);
        } catch (error) {
            console.error('[ADMIN-PROFILE] Error:', error);
            const lang = req.lang || req.headers.lang || 'en';
            return Response.serverErrorResponse(res, resp_messages(lang).internalServerError);
        }
    },
    // userList: async (req, res) => {
    //     try {
    //         const { page = 1, limit = 10, search = '' } = req.query;
    //         const pageInt = parseInt(page);
    //         const limitInt = parseInt(limit);
    //         const skip = (pageInt - 1) * limitInt;

    //         const searchQuery = search ? {
    //             $or: [
    //                 { first_name: { $regex: search, $options: 'i' } },
    //                 { last_name: { $regex: search, $options: 'i' } }
    //             ]
    //         } : {};

    //         const totalCount = await UserService.CountDocumentService(searchQuery);

    //         const user_data = await UserService.AggregateService([
    //             { $match: searchQuery },
    //             { $sort: { createdAt: -1 } },
    //             { $skip: skip },
    //             { $limit: limitInt }
    //         ]);

    //         const users = user_data.map((user, i) => ({
    //             ...user,
    //             id: `JN_UM_${String(i + 1).padStart(3, '0')}`
    //         }));

    //         if (users.length == 0) {
    //             return Response.badRequestResponse(res);
    //         }

    //         return Response.ok(res, users, 200, 'User listing', totalCount);
    //     } catch (error) {
    //         console.log("Error", error.message);
    //          return Response.serverErrorResponse(res, resp_messages(req.lang).internalServerError);
    //     }
    // },
    userList: async (req, res) => {
        try {
            const { page = 1, limit = 10, search = '', isActive, status } = req.query;
            const pageInt = parseInt(page);
            const limitInt = parseInt(limit);
            const skip = (pageInt - 1) * limitInt;

            // Build search query for name and email
            const searchQuery = search && search.trim() ? {
                $or: [
                    { first_name: { $regex: search.trim(), $options: 'i' } },
                    { last_name: { $regex: search.trim(), $options: 'i' } },
                    { email: { $regex: search.trim(), $options: 'i' } }
                ]
            } : {};

            // Build status filter
            // status can be: "Active", "Inactive", "Suspended", "Deleted"
            // OR use isActive boolean (legacy support)
            let statusFilter = {};
            
            if (status) {
                // New status-based filtering
                if (status === "Active") {
                    statusFilter = { 
                        isActive: 1, 
                        is_suspended: false,
                        is_delete: { $ne: 1 } // Not deleted
                    };
                } else if (status === "Inactive") {
                    statusFilter = { 
                        isActive: 2,
                        is_suspended: false,
                        is_delete: { $ne: 1 } // Not deleted
                    };
                } else if (status === "Suspended") {
                    statusFilter = { 
                        is_suspended: true,
                        is_delete: { $ne: 1 } // Not deleted
                    };
                } else if (status === "Deleted") {
                    statusFilter = { 
                        is_delete: 1 // Show deleted users
                    };
                }
            } else if (isActive !== undefined) {
                // Legacy support: isActive boolean
                const isActiveBool = isActive === 'true' || isActive === true;
                statusFilter = {
                    isActive: isActiveBool ? 1 : 2,
                    is_suspended: false,
                    is_delete: { $ne: 1 } // Not deleted
                };
            } else {
                // Default: show all users including deleted (for admin visibility)
                statusFilter = {}; // No filter - show all
            }

            // Combine search and status filters
            const matchQuery = {
                $and: [
                    ...(Object.keys(searchQuery).length > 0 ? [searchQuery] : []),
                    ...(Object.keys(statusFilter).length > 0 ? [statusFilter] : [])
                ]
            };

            // If no filters, match all
            const finalMatchQuery = Object.keys(matchQuery.$and).length > 0 ? matchQuery : {};

            const totalCount = await UserService.CountDocumentService(finalMatchQuery);

            const user_data = await UserService.AggregateService([
                { $match: finalMatchQuery },
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: limitInt }
            ]);

            // Add formatted ID and ensure status fields are present
            user_data.forEach((user, i) => {
                user.id = `JN_UM_${String((pageInt - 1) * limitInt + i + 1).padStart(3, '0')}`;
                // Ensure boolean fields are properly set
                user.isActive = user.isActive === 1;
                user.is_suspended = user.is_suspended === true;
            });

            return Response.ok(res, user_data, 200, resp_messages(req.lang).fetched_data, totalCount);
        } catch (error) {
            console.log("Error", error.message);
            return Response.serverErrorResponse(res, resp_messages(req.lang).internalServerError);
        }
    },
    organizerList: async (req, res) => {
        const { lang } = req || 'en'
        try {
            const { page = 1, limit = 10, search = '', is_approved, is_active } = req.query;
            const pageInt = parseInt(page);
            const limitInt = parseInt(limit);
            const skip = (pageInt - 1) * limitInt;

            const match_query = {
                $and: [
                    // CRITICAL: Only show organizers who have completed all registration steps
                    // registration_step === 4 means all 4 steps are completed and signup button was clicked
                    { registration_step: 4 },
                    {
                        $or: [
                            { first_name: { $regex: search, $options: 'i' } },
                            { last_name: { $regex: search, $options: 'i' } },
                            { email: { $regex: search, $options: 'i' } }
                        ]
                    }
                ]
            }
            if (is_approved) {
                match_query.$and.push({ is_approved: Number(is_approved) })
            }
            if (is_approved && is_active) {
                match_query.$and.push({ isActive: Number(is_active) })
            }
            const totalCount = await organizerService.CountDocumentService(match_query);

            const organizers_data = await organizerService.AggregateService([
                { $match: match_query },
                {
                    $lookup: {
                        from: 'book_event',
                        localField: '_id',
                        foreignField: 'organizer_id',
                        as: 'bookings'
                    }
                },
                {
                    $addFields: {
                        last_booking_date: {
                            $max: '$bookings.createdAt'
                        }
                    }
                },
                {
                    $project: {
                        profile_image: 1,
                        first_name: 1,
                        last_name: 1,
                        email: 1,
                        country_code: 1,
                        address: 1,
                        phone_number: 1,
                        gender: 1,
                        description: 1,
                        date_of_birth: 1,
                        is_approved: 1,
                        createdAt: 1,
                        isActive: 1,
                        registration_type: 1,
                        is_suspended: 1,
                        last_booking_date: 1,
                        last_ticket_date: '$last_booking_date'
                    }
                },
                { $skip: skip },
                { $sort: { createdAt: -1 } },
                { $limit: limitInt }
            ]);

            const organizers = organizers_data.map((organizer, i) => ({
                ...organizer,
                id: `JN_EO_${String(i + 1).padStart(3, '0')}`
            }));


            return Response.ok(res, organizers, 200, resp_messages(req.lang).fetched_data, totalCount);
        } catch (error) {
            console.log("Error", error.message);
            return Response.serverErrorResponse(res, resp_messages(req.lang).internalServerError);
        }
    },
    organizerDetail: async (req, res) => {
        const { lang } = req || 'en'
        try {
            const { id } = req.query;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return Response.badRequestResponse(res, resp_messages(lang).id_required)
            }

            const organizer = await organizerService.FindOneService({ _id: id });
            if (!organizer) {
                return Response.notFoundResponse(res, resp_messages(lang).user_not_found);
            }

            // CRITICAL: Only allow access to organizers who have completed all registration steps
            // registration_step === 4 means all 4 steps are completed and signup button was clicked
            if (organizer.registration_step !== 4) {
                return Response.notFoundResponse(
                    res, 
                    "Organizer registration is not complete. Only fully registered organizers can be viewed in admin panel."
                );
            }

            return Response.ok(res, organizer, 200, resp_messages(lang).fetched_data)

        } catch (error) {
            console.log(error.message);
            return Response.serverErrorResponse(res, {}, 500, resp_messages(lang).internalServerError);
        }
    },
    userDetail: async (req, res) => {
        const { lang } = req || 'en'
        try {
            const { id } = req.query;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return Response.badRequestResponse(res, resp_messages(lang).id_required)
            }

            const user = await UserService.FindOneService({ _id: id });
            if (!user) {
                return Response.notFoundResponse(res, resp_messages(lang).user_not_found);
            }

            // Ensure isActive is set (default to 1 if not present for backward compatibility)
            if (user.isActive === undefined || user.isActive === null) {
                user.isActive = 1;
                await user.save();
            }

            const book_events = await BookEventService.AggregateService([
                { $match: { user_id: new mongoose.Types.ObjectId(id) } },
                {
                    $lookup: {
                        from: 'events',
                        localField: 'event_id',
                        foreignField: '_id',
                        as: 'event'
                    }
                },
                {
                    $lookup: {
                        from: 'organizers',
                        localField: 'event.organizer_id',
                        foreignField: '_id',
                        as: 'organizer'
                    }
                },
                { $unwind: "$event" },
                { $unwind: "$organizer" },
                {
                    $project: {
                        event: {
                            event_name: 1,
                            event_image: 1,
                            event_address: 1,
                            event_start_time: 1,
                            event_end_time: 1,
                            event_date: 1,
                        },
                        organizer: {
                            profile_image: 1,
                            first_name: 1,
                            last_name: 1,
                            createdAt: 1,
                        },
                        book_status: 1
                    }
                }

            ]);

            return Response.ok(res, { user, book_events }, 200, resp_messages(lang).fetched_data);
        } catch (error) {
            console.log(error.message);
            return Response.serverErrorResponse(res, resp_messages(req.lang).internalServerError);
        }
    },
    eventDetail: async (req, res) => {
        const { lang } = req || 'en'
        try {
            const { id } = req.query;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return Response.badRequestResponse(res, resp_messages(lang).id_required)
            }

            const event = await EventService.AggregateService([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: 'organizers',
                        localField: 'organizer_id',
                        foreignField: '_id',
                        as: 'organizer'
                    }
                },
                {
                    $lookup: {
                        from: "book_event",
                        localField: '_id',
                        foreignField: 'event_id',
                        as: 'book_event'
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: 'book_event.user_id',
                        foreignField: '_id',
                        as: 'attendees'
                    },
                },
                {
                    $lookup: {
                        from: "event_review",
                        localField: '_id',
                        foreignField: 'event_id',
                        as: 'event_review'
                    },
                },
                {
                    $unwind: "$organizer"
                },
                {
                    $project: {
                        _id: 1,
                        event_date: 1,
                        event_start_time: 1,
                        event_end_time: 1,
                        event_name: 1,
                        event_image: 1,
                        event_images: 1,
                        event_description: 1,
                        event_address: 1,
                        no_of_attendees: 1,
                        event_price: 1,
                        dos_instruction: 1,
                        do_not_instruction: 1,
                        event_type: 1,
                        event_for: 1,
                        event_category: 1,
                        is_approved: 1, // Backend: 0=Pending, 1=Approved, 2=Rejected
                        // Map is_approved to event_status for frontend compatibility
                        // Frontend: 1=Pending, 2=Upcoming/Approved, 3=Completed, 4=Rejected
                        event_status: {
                            $cond: {
                                if: { $eq: ["$is_approved", 0] },
                                then: 1, // Pending
                                else: {
                                    $cond: {
                                        if: { $eq: ["$is_approved", 1] },
                                        then: {
                                            // Check if event date is in past for Completed status
                                            $cond: {
                                                if: { $lt: ["$event_date", new Date()] },
                                                then: 3, // Completed
                                                else: 2  // Upcoming/Approved
                                            }
                                        },
                                        else: 4 // Rejected (is_approved === 2)
                                    }
                                }
                            }
                        },
                        createdAt: 1,
                        updatedAt: 1,
                        organizer: {
                            _id: 1,
                            first_name: 1,
                            last_name: 1,
                            email: 1,
                            phone_number: 1,
                            country_code: 1,
                            profile_image: 1,
                        },
                        attendees: {
                            _id: 1,
                            profile_image: 1,
                            first_name: 1,
                            last_name: 1,
                            phone_number: 1,
                            country_code: 1,
                            createdAt: 1,
                        },
                        total_rating: { $avg: "$event_review.rating" },
                        total_review: { $size: "$event_review" }
                    }
                },
            ]);
            if (!event) {
                return Response.notFoundResponse(res, resp_messages(lang).eventNotFound);
            }
            return Response.ok(res, event[0], 200, resp_messages(lang).fetched_data)

        } catch (error) {
            console.log(error.message);
            return Response.serverErrorResponse(res, resp_messages(req.lang).internalServerError);
        }
    },
    changeStatus: async (req, res) => {
        const { lang } = req || 'en'
        const { userId, is_approved, rejection_reason } = req.body;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return Response.badRequestResponse(res, resp_messages(lang).id_required);
        }

        const organizer = await organizerService.FindOneService({ _id: userId });

        if (!organizer) {
            return Response.notFoundResponse(res, resp_messages(lang).user_not_found);
        }

        const oldStatus = organizer.is_approved;
        organizer.is_approved = is_approved;
        
        // If rejecting, set registration_type to 'Re-apply' for future re-application
        if (is_approved === 3) {
            organizer.registration_type = 'Re-apply';
        }

        await organizer.save();

        // Send email notification based on status change
        try {
            const organizerName = `${organizer.first_name} ${organizer.last_name}`;
            const organizerLang = organizer.language || lang;
            
            if (oldStatus === 1 && is_approved === 2) {
                // Approved
                await sendOrganizerApprovalEmail(organizer.email, organizerName, organizerLang);
            } else if (oldStatus === 1 && is_approved === 3) {
                // Rejected
                await sendOrganizerRejectionEmail(organizer.email, organizerName, rejection_reason || '', organizerLang);
            }
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            // Don't fail the request if email fails
        }

        return Response.ok(res, { status: organizer.is_approved }, 200, resp_messages(lang).update_success)
    },
    changeOrganizerStatus: async (req, res) => {
        const { lang } = req || 'en';
        const { id, userId, isActive, isSuspended, reactivate } = req.body;
        const organizerId = userId || id; // Support both userId and id for backward compatibility
        if (!mongoose.Types.ObjectId.isValid(organizerId)) {
            return Response.badRequestResponse(res, resp_messages(lang).id_required);
        }

        const organizer = await organizerService.FindOneService({ _id: organizerId });

        if (!organizer) {
            return Response.notFoundResponse(res, resp_messages(lang).user_not_found);
        }

        // CRITICAL: Only allow status changes for organizers who have completed all registration steps
        // registration_step === 4 means all 4 steps are completed and signup button was clicked
        if (organizer.registration_step !== 4) {
            return Response.badRequestResponse(
                res,
                "Cannot change status. Organizer registration is not complete. Only fully registered organizers can have their status changed."
            );
        }

        // Handle reactivation (for deleted accounts)
        if (reactivate === true) {
            organizer.is_delete = 0; // Reactivate deleted account
            organizer.is_suspended = false; // Remove suspension
            organizer.isActive = 1; // Set to active
            await organizer.save();
            
            return Response.ok(res, { 
                isActive: organizer.isActive,
                is_suspended: organizer.is_suspended,
                is_delete: organizer.is_delete
            }, 200, "Account reactivated successfully. Organizer can now register/login with the same phone number.");
        }

        // Handle suspend/unsuspend
        if (isSuspended !== undefined) {
            organizer.is_suspended = isSuspended;
            // If unsuspending, also set to active and ensure not deleted
            if (!isSuspended) {
                organizer.isActive = 1;
                organizer.is_delete = 0; // Ensure not deleted when unsuspending
            }
        }
        
        // Handle active/inactive
        if (isActive !== undefined) {
            organizer.isActive = isActive ? 1 : 2;
            // If setting to active, unsuspend and ensure not deleted
            if (isActive) {
                organizer.is_suspended = false;
                organizer.is_delete = 0; // Ensure not deleted when activating
            }
        }

        await organizer.save();

        return Response.ok(res, { 
            isActive: organizer.isActive,
            is_suspended: organizer.is_suspended,
            is_delete: organizer.is_delete
        }, 200, resp_messages(lang).update_success);
    },
    changeUserStatus: async (req, res) => {
        const { lang } = req || 'en';
        const { userId, isActive, isSuspended, reactivate } = req.body;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return Response.badRequestResponse(res, resp_messages(lang).id_required);
        }

        const user = await UserService.FindOneService({ _id: userId });

        if (!user) {
            return Response.notFoundResponse(res, resp_messages(lang).user_not_found);
        }

        // Handle reactivation (for deleted accounts)
        if (reactivate === true) {
            user.is_delete = 0; // Reactivate deleted account
            user.is_suspended = false; // Remove suspension
            user.isActive = 1; // Set to active
            await user.save();
            
            return Response.ok(res, { 
                isActive: user.isActive,
                is_suspended: user.is_suspended,
                is_delete: user.is_delete
            }, 200, "Account reactivated successfully. User can now register/login with the same phone number.");
        }

        // Handle suspend/unsuspend
        if (isSuspended !== undefined) {
            user.is_suspended = isSuspended;
            // If unsuspending, also set to active and ensure not deleted
            if (!isSuspended) {
                user.isActive = 1;
                user.is_delete = 0; // Ensure not deleted when unsuspending
            }
        }
        
        // Handle active/inactive
        if (isActive !== undefined) {
            user.isActive = isActive ? 1 : 2;
            // If setting to active, unsuspend and ensure not deleted
            if (isActive) {
                user.is_suspended = false;
                user.is_delete = 0; // Ensure not deleted when activating
            }
        }

        await user.save();

        return Response.ok(res, { 
            isActive: user.isActive,
            is_suspended: user.is_suspended,
            is_delete: user.is_delete
        }, 200, resp_messages(lang).update_success);
    },
    
    deleteUser: async (req, res) => {
        const { lang } = req || 'en';
        try {
            const { userId } = req.body;
            
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return Response.badRequestResponse(res, resp_messages(lang).id_required || "User ID is required");
            }
            
            const user = await UserService.FindOneService({ _id: userId });
            if (!user) {
                return Response.notFoundResponse(res, resp_messages(lang).user_not_found || "User not found");
            }
            
            // Soft delete: set is_delete = 1, isActive = 2, is_suspended = false
            user.is_delete = 1;
            user.isActive = 2; // Set to inactive
            user.is_suspended = false; // Remove suspension when deleting
            
            await user.save();
            
            return Response.ok(res, { 
                is_delete: user.is_delete,
                isActive: user.isActive,
                is_suspended: user.is_suspended
            }, 200, "User deleted successfully. User remains visible in admin panel but cannot login/register.");
        } catch (error) {
            console.error("[ADMIN:DELETE_USER] Error:", error);
            return Response.serverErrorResponse(res, resp_messages(lang).internalServerError || "Internal server error");
        }
    },
    
    updateUser: async (req, res) => {
        const { lang } = req || 'en';
        try {
            const { userId, phone_number, country_code, email } = req.body;
            
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return Response.badRequestResponse(res, resp_messages(lang).id_required || "User ID is required");
            }
            
            const user = await UserService.FindOneService({ _id: userId });
            if (!user) {
                return Response.notFoundResponse(res, resp_messages(lang).user_not_found || "User not found");
            }
            
            // Update phone number if provided
            if (phone_number !== undefined) {
                user.phone_number = phone_number;
            }
            
            // Update country code if provided
            if (country_code !== undefined) {
                user.country_code = country_code;
            }
            
            // Update email if provided
            if (email !== undefined && email !== null && email !== '') {
                user.email = email;
            }
            
            await user.save();
            
            return Response.ok(res, user, 200, resp_messages(lang).update_success || "User updated successfully");
        } catch (error) {
            console.error("[ADMIN:UPDATE_USER] Error:", error);
            return Response.serverErrorResponse(res, resp_messages(lang).internalServerError || "Internal server error");
        }
    },
    eventList: async (req, res) => {
        const { lang } = req || 'en'
        try {
            const { page = 1, limit = 10, search = '', status } = req.query;
            const skip = (parseInt(page) - 1) * parseInt(limit);


            const currentDate = new Date().toISOString();

            let search_query = {};

            // Status mapping: 1=Pending, 2=Upcoming, 3=Completed, 4=Rejected
            // Backend: is_approved: 0=Pending, 1=Approved/Upcoming, 2=Rejected
            if (status == '1') {
                // Pending events
                search_query = {
                    is_approved: 0
                };
            } else if (status == '2') {
                // Upcoming events (approved and future date)
                search_query = {
                    is_approved: 1,
                    event_date: { $gt: new Date(currentDate) }
                };
            } else if (status == '3') {
                // Completed events (approved and past date)
                search_query = {
                    is_approved: 1,
                    event_date: { $lt: new Date(currentDate) }
                };
            } else if (status == '4') {
                // Rejected events
                search_query = {
                    is_approved: 2
                };
            }
            if (search) {
                search_query = {
                    event_name: { $regex: search, $options: "i" }
                }
            }
            const results = await EventService.AggregateService([
                {
                    $match: search_query,
                },
                {
                    $lookup: {
                        from: 'organizers',
                        localField: 'organizer_id',
                        foreignField: '_id',
                        as: 'organizer'
                    }
                },
                {
                    $lookup: {
                        from: 'event_categories',
                        localField: 'event_categories',
                        foreignField: '_id',
                        as: 'event_category_details'
                    }
                },
                { $unwind: { path: "$organizer", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        organizer_id: 1,
                        event_date: 1,
                        no_of_attendees: 1,
                        event_start_time: 1,
                        event_end_time: 1,
                        event_name: 1,
                        event_image: 1,
                        event_images: 1,
                        event_address: 1,
                        longitude: 1,
                        latitude: 1,
                        event_price: 1,
                        event_type: 1,
                        event_types: 1, // Array of event types (conference, workshop, etc.)
                        createdAt: 1,
                        updatedAt: 1,
                        event_category: 1,
                        event_categories: 1,
                        event_category_details: {
                            _id: 1,
                            name: 1
                        },
                        event_for: 1,
                        is_approved: 1, // Backend: 0=Pending, 1=Approved, 2=Rejected
                        // Map is_approved to event_status for frontend compatibility
                        // Frontend: 1=Pending, 2=Upcoming/Approved, 3=Completed, 4=Rejected
                        event_status: {
                            $cond: {
                                if: { $eq: ["$is_approved", 0] },
                                then: 1, // Pending
                                else: {
                                    $cond: {
                                        if: { $eq: ["$is_approved", 1] },
                                        then: {
                                            // Check if event date is in past for Completed status
                                            $cond: {
                                                if: { $lt: ["$event_date", new Date()] },
                                                then: 3, // Completed
                                                else: 2  // Upcoming/Approved
                                            }
                                        },
                                        else: 4 // Rejected (is_approved === 2)
                                    }
                                }
                            }
                        },
                        organizer: {
                            first_name: 1,
                            last_name: 1,
                            profile_image: 1
                        }
                    }
                },
                { $sort: { createdAt: -1 } },
                {
                    $facet: {
                        data: [
                            { $skip: skip },
                            { $limit: parseInt(limit) }
                        ],
                        total_count: [
                            { $count: "count" }
                        ]
                    }
                }
            ]);
            const eventData = results[0].data.map((user, i) => ({
                ...user,
                id: `JN_ME_${String(i + 1).padStart(3, '0')}`
            }));

            const totalCount = results[0].total_count[0] ? results[0].total_count[0].count : 0;

            return Response.ok(res, eventData, 200, resp_messages(req.lang).fetched_data, totalCount);
        } catch (error) {
            console.log(error);
            return Response.serverErrorResponse(res, resp_messages(req.lang).internalServerError);
        }
    },
    getCms: async (req, res) => {
        const { lang } = req.headers || 'en'
        try {
            const { cms_type } = req.query;

            if (!cms_type) {
                return Response.badRequestResponse(res, resp_messages(lang).cmsTypeRequired)
            }


            const cms = await CmsService.AggregateService([
                { $match: { type: cms_type } },
                {
                    $project: {
                        type: 1,
                        description: 1,
                        description_ar: 1,
                    }
                }
            ]);
            return Response.ok(res, cms[0], 200, resp_messages(lang).fetched_data)
        } catch (error) {
            console.log(error.message)
            return Response.serverErrorResponse(res, resp_messages(req.lang).internalServerError);

        }
    },
    updateCms: async (req, res) => {
        const { lang } = req || 'en'
        try {
            const { id } = req.body;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return Response.badRequestResponse(res, resp_messages(lang).id_required)
            }
            const cms = await CmsService.FindByIdAndUpdateService(id, req.body);
            return Response.ok(res, cms, 200, resp_messages(lang).update_success)
        } catch (error) {
            console.log(error.message)
            return Response.serverErrorResponse(res, resp_messages(req.lang).internalServerError);

        }
    },
    addOrganizerGroupCategory: async (req, res) => {
        try {
            const item = await GroupCategoriesService.CreateService(req.body);
            return Response.ok(res, item);

        } catch (error) {

            return Response.serverErrorResponse(res, resp_messages(req.lang).internalServerError);

        }
    },
    groupCategoryDetail: async (req, res) => {
        try {
            const { id } = req.query;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return Response.badRequestResponse(res, resp_messages(req.lang).id_required)
            }

            const category = await GroupCategoriesService.FindOneService({ _id: id });
            if (!category) {
                return Response.notFoundResponse(res, resp_messages(req.lang).user_not_found);
            }
            return Response.ok(res, category)

        } catch (error) {
            console.log(error.message);
            return Response.serverErrorResponse(res, resp_messages(req.lang).internalServerError);
        }
    },
    eventCategoryDetail: async (req, res) => {
        try {
            const { id } = req.query;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return Response.badRequestResponse(res, resp_messages(req.lang).id_required)
            }

            const category = await EventCategoryService.FindOneService({ _id: id });
            if (!category) {
                return Response.notFoundResponse(res, {}, 404, 'category not found')
            }
            return Response.ok(res, category)

        } catch (error) {
            console.log(error.message);
            return Response.serverErrorResponse(res, resp_messages(req.lang).internalServerError);
        }
    },
    eventCategoryUpdate: async (req, res) => {
        try {
            const { id } = req.body;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return Response.badRequestResponse(res, resp_messages(req.lang).id_required)
            }

            const category = await EventCategoryService.FindOneService({ _id: id });
            if (!category) {
                return Response.notFoundResponse(res, 'category not found')
            }
            const exist_category = await EventCategoryService.FindByIdAndUpdateService(id, req.body);
            return Response.ok(res, exist_category)

        } catch (error) {
            console.log(error.message);
            return Response.serverErrorResponse(res, resp_messages(req.lang).internalServerError);
        }
    },
    groupCategoryUpdate: async (req, res) => {
        try {
            const { id } = req.body;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return Response.badRequestResponse(res, resp_messages(req.lang).id_required)
            }

            const category = await GroupCategoriesService.FindOneService({ _id: id });
            console.log(category)
            if (!category) {
                return Response.notFoundResponse(res, 'category not found')
            }
            const exist_category = await GroupCategoriesService.FindByIdAndUpdateService(id, req.body);
            return Response.ok(res, exist_category)

        } catch (error) {
            console.log(error.message);
            return Response.serverErrorResponse(res, resp_messages(req.lang).internalServerError);
        }
    },
    eventGroupCategoryDelete: async (req, res) => {
        try {
            const { id } = req.query;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return Response.badRequestResponse(res, resp_messages(req.lang).id_required)
            }

            const category = await EventCategoryService.FindByIdAndDeleteService(id);
            if (!category) {
                return Response.notFoundResponse(res, {}, 404, 'category not found')
            }
            return Response.ok(res, category)

        } catch (error) {
            console.log(error.message);
            return Response.serverErrorResponse(res, resp_messages(req.lang).internalServerError);
        }
    },
    groupCategoryDelete: async (req, res) => {
        try {
            const { id } = req.query;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return Response.badRequestResponse(res, resp_messages(req.lang).id_required)
            }

            const category = await GroupCategoriesService.FindByIdAndDeleteService(id);
            if (!category) {
                return Response.notFoundResponse(res, 'category not found')
            }
            return Response.ok(res, category)

        } catch (error) {
            console.log(error.message);
            return Response.serverErrorResponse(res, resp_messages(req.lang).internalServerError);
        }
    },
    addEventCategory: async (req, res) => {
        try {
            const item = await EventCategoryService.CreateService(req.body);
            return Response.ok(res, item);

        } catch (error) {
            return Response.serverErrorResponse(res, resp_messages(req.lang).internalServerError);

        }
    },
    eventCategoryList: async (req, res) => {
        try {
            const { page, limit, search = '' } = req.query;

            const skip = (parseInt(page) - 1) * parseInt(limit);
            let result;
            const count = await EventCategoryService.CountDocumentService({});
            if (!page && !limit) {
                result = await EventCategoryService.FindService({});
                return Response.ok(res, result, 200, resp_messages(req.lang).fetched_data, count)

            }
            const searchQuery = {
                $and: [
                    { name: { $regex: search, $options: "i" } },
                ]
            };
            result = await EventCategoryService.AggregateService([
                { $match: searchQuery },
                {
                    $project: {
                        __v: 0
                    }
                },
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: parseInt(limit) }
            ]);
            return Response.ok(res, result, 200, 'list', count)

        } catch (error) {
            console.log(error.message)
            return Response.serverErrorResponse(res)

        }
    },
    categoryList: async (req, res) => {
        try {
            const { page, limit, search = '' } = req.query;
            const skip = (parseInt(page) - 1) * parseInt(limit);
            let result;
            const count = await GroupCategoriesService.CountDocumentService({});
            if (!page && !limit) {
                result = await GroupCategoriesService.FindService({})
                return Response.ok(res, result, 200, resp_messages(req.lang).fetched_data, count)

            }
            const searchQuery = {
                $and: [
                    { name: { $regex: search, $options: "i" } },
                ]
            };
            result = await GroupCategoriesService.AggregateService([
                { $match: searchQuery },
                {
                    $project: {
                        __v: 0
                    }
                },
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: parseInt(limit) }
            ]);
            return Response.ok(res, result, 200, resp_messages(req.lang).fetched_data, count)

        } catch (error) {
            return Response.serverErrorResponse(res)

        }
    },
    addNotification: async (req, res) => {
        try {
            const { title, text, type, selected_users, role } = req.body;

            if (!title || !text || !type || !Array.isArray(role) || role.length === 0 || ![1, 2].includes(type)) {
                return Response.badRequestResponse(res, "Invalid or missing required fields");
            }

            const notification = await NotificationService.CreateService({ title, text, type, role });
            const notification_id = notification._id;

            let users = [];

            for (let r of role) {
                const service = r == 1 ? UserService : organizerService;
                let userConditions = {};

                if (type == 1) {
                    userConditions = {};
                } else if (type == 2 && selected_users && selected_users.length > 0) {
                    userConditions = { _id: { $in: selected_users } };
                } else {
                    return Response.badRequestResponse(res, "selected_users is required for type 2");
                }

                const fetchedUsers = await service.FindService(userConditions);
                users = users.concat(fetchedUsers);
            }

            if (!users || users.length === 0) {
                return Response.badRequestResponse(res, "No users found");
            }

            const allUsers = users.map((user) => ({
                notification_id,
                user_id: user._id,
            }));

            await NotificationUsers.insertMany(allUsers);

            const deviceTokens = users
                .filter(user => user.isNotification && user.deviceToken)
                .map(user => user.deviceToken);

            const message = type == 1 ? "Notification sent to all users/organizers" : "Notification sent to selected users/organizers";
            return Response.ok(res, { notification }, 200, message);

        } catch (error) {
            console.log(error);
            return Response.serverErrorResponse(res, "Internal server error");
        }
    },
    notificationList: async (req, res) => {
        try {
            const { search, page = 1, limit = 10 } = req.query;

            const pageNumber = parseInt(page);
            const pageSize = parseInt(limit);

            const notifications = await Notification.aggregate([
                // {
                //     $lookup: {
                //         from: 'users',
                //         foreignField: '_id',
                //         localField: 'user_id',
                //         as: 'users'
                //     }
                // },
                // {
                //     $lookup: {
                //         from: 'organizers',
                //         foreignField: '_id',
                //         localField: 'user_id',
                //         as: 'organizers'
                //     }
                // },
                // {
                //     $lookup: {
                //         from: 'notifications',
                //         foreignField: '_id',
                //         localField: 'notification_id',
                //         as: 'notifications'
                //     }
                // },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $skip: (pageNumber - 1) * pageSize
                },
                {
                    $limit: pageSize
                }
            ]);

            return Response.ok(res, notifications, 200, resp_messages(req.lang).fetched_data);

        } catch (error) {
            console.log(error);
            return Response.serverErrorResponse(res, {}, 500, "Internal server error");
        }
    },

    withdrawalList: async (req, res) => {
        try {
            const { page = 1, limit = 10, search = '', status, from_date, to_date } = req.query;
            const skip = (Number(page) - 1) * Number(limit);

            // Build match query
            let matchQuery = { type: 2 }; // Withdrawal type

            // Status filter
            if (status !== undefined && status !== '' && status !== 'all') {
                matchQuery.status = Number(status);
            }

            // Date range filter
            if (from_date || to_date) {
                matchQuery.createdAt = {};
                if (from_date) {
                    matchQuery.createdAt.$gte = new Date(from_date);
                }
                if (to_date) {
                    const toDate = new Date(to_date);
                    toDate.setHours(23, 59, 59, 999);
                    matchQuery.createdAt.$lte = toDate;
                }
            }

            // Build aggregation pipeline
            const pipeline = [
                { $match: matchQuery },
                {
                    $lookup: {
                        from: 'organizers',
                        localField: 'organizer_id',
                        foreignField: '_id',
                        as: 'organizer',
                        // CRITICAL: Only include organizers who have completed all registration steps
                        // registration_step === 4 means all 4 steps are completed and signup button was clicked
                        pipeline: [
                            {
                                $match: {
                                    registration_step: 4
                                }
                            }
                        ]
                    }
                },
                {
                    $unwind: { path: "$organizer", preserveNullAndEmptyArrays: true },
                },
                {
                    $lookup: {
                        from: 'admins',
                        localField: 'processed_by',
                        foreignField: '_id',
                        as: 'processor'
                    }
                },
                {
                    $unwind: { path: "$processor", preserveNullAndEmptyArrays: true },
                }
            ];

            // Search filter (applied after lookup)
            if (search && search.trim() !== '') {
                pipeline.push({
                    $match: {
                        $or: [
                            { 'organizer.first_name': { $regex: search, $options: 'i' } },
                            { 'organizer.last_name': { $regex: search, $options: 'i' } },
                            { 'organizer.email': { $regex: search, $options: 'i' } },
                            { 'organizer.phone_number': { $regex: search, $options: 'i' } }
                        ]
                    }
                });
            }

            // Project fields
            pipeline.push({
                $project: {
                    amount: 1,
                    currency: 1,
                    type: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    withdrawal_method: 1,
                    bank_details: 1,
                    admin_notes: 1,
                    rejection_reason: 1,
                    processed_at: 1,
                    transaction_reference: 1,
                    requested_at: 1,
                    organizer: {
                        _id: 1,
                        first_name: 1,
                        last_name: 1,
                        email: 1,
                        phone_number: 1,
                        profile_image: 1,
                        country_code: 1,
                        bank_details: 1
                    },
                    processor: {
                        first_name: 1,
                        last_name: 1,
                        email: 1
                    }
                }
            });

            // Sort, skip, limit
            pipeline.push(
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: Number(limit) }
            );

            const transactions = await TransactionService.AggregateService(pipeline);

            // Get total count with same filters
            const countPipeline = [
                { $match: matchQuery },
                {
                    $lookup: {
                        from: 'organizers',
                        localField: 'organizer_id',
                        foreignField: '_id',
                        as: 'organizer'
                    }
                },
                {
                    $unwind: { path: "$organizer", preserveNullAndEmptyArrays: true },
                }
            ];

            if (search && search.trim() !== '') {
                countPipeline.push({
                    $match: {
                        $or: [
                            { 'organizer.first_name': { $regex: search, $options: 'i' } },
                            { 'organizer.last_name': { $regex: search, $options: 'i' } },
                            { 'organizer.email': { $regex: search, $options: 'i' } },
                            { 'organizer.phone_number': { $regex: search, $options: 'i' } }
                        ]
                    }
                });
            }

            countPipeline.push({ $count: "total" });
            const countResult = await TransactionService.AggregateService(countPipeline);
            const count = countResult.length > 0 ? countResult[0].total : 0;

            return Response.ok(res, transactions, 200, resp_messages(req.lang).fetched_data, count);
        } catch (error) {
            console.error('[ADMIN:WITHDRAWAL_LIST] Error:', error.message);
            return Response.serverErrorResponse(res, resp_messages(req.lang).internalServerError);
        }
    },
    withdrawalStatusUpdate: async (req, res) => {
        try {
            const { id, status, admin_notes, rejection_reason, transaction_reference } = req.body;
            const { userId } = req; // Admin ID
            const lang = req.headers.lang || req.lang || 'en';

            if (!id || (status !== 1 && status !== 2)) {
                return Response.badRequestResponse(res, resp_messages(lang).invalid_data);
            }

            const transaction = await TransactionService.FindOneService({ _id: id });

            if (!transaction) {
                return Response.notFoundResponse(res, resp_messages(lang).data_not_found);
            }

            if (transaction.status == 1 || transaction.status == 2) {
                return Response.badRequestResponse(res, resp_messages(lang).request_already_processed);
            }

            // Get organizer details
            const organizerService = require('../services/organizerService');
            const organizer = await organizerService.FindOneService({ _id: transaction.organizer_id });

            if (!organizer) {
                return Response.notFoundResponse(res, resp_messages(lang).organizer_not_found);
            }

            if (status == 1) {
                // APPROVED - money is withdrawn, wallet already set to 0 when request was made
                transaction.status = 1;
                transaction.processed_by = userId;
                transaction.processed_at = new Date();
                
                if (admin_notes) {
                    transaction.admin_notes = admin_notes;
                }
                
                if (transaction_reference) {
                    transaction.transaction_reference = transaction_reference;
                }

                await transaction.save();

                // Send notification to organizer
                try {
                    const NotificationService = require('../services/notificationService');
                    await NotificationService.CreateService({
                        user_id: organizer._id,
                        role: 2, // Organizer role
                        title: lang === 'ar' ? 'تمت الموافقة على طلب السحب' : 'Withdrawal Request Approved',
                        description: lang === 'ar' 
                            ? `تمت الموافقة على طلب سحب مبلغ ${transaction.amount} ${transaction.currency || 'SAR'}. سيتم تحويل المبلغ قريباً.`
                            : `Your withdrawal request of ${transaction.amount} ${transaction.currency || 'SAR'} has been approved. The amount will be transferred soon.`,
                        isRead: false,
                        notification_type: 4, // Withdrawal type
                        status: 1 // Approved
                    });
                } catch (notifError) {
                    console.error('[ADMIN:WITHDRAWAL_APPROVE] Notification error:', notifError);
                }

                // Send email and push notification using new notification helper
                try {
                    const notificationHelper = require('../helpers/notificationService');
                    await notificationHelper.sendWithdrawalApproved({
                        amount: transaction.amount,
                        currency: transaction.currency || 'SAR',
                        bank_short: organizer.bank_name || 'Bank',
                        bank_name: organizer.bank_name || 'Bank',
                        payout_ref: transaction_reference || transaction._id.toString(),
                        transaction_reference: transaction_reference || transaction._id.toString()
                    }, organizer);
                    console.log(`[NOTIFICATION] Sent withdrawal approved notification to organizer ${organizer._id}`);
                } catch (notifError) {
                    console.error('[ADMIN:WITHDRAWAL_APPROVE] Notification error:', notifError);
                    // Fallback to old email method
                    try {
                        const EmailService = require('../helpers/emailService');
                        const emailTemplate = EmailService.renderWithdrawalApprovedEmail({
                            host_first_name: organizer.first_name,
                            amount: transaction.amount,
                            currency: transaction.currency || 'SAR',
                            bank_short: organizer.bank_name || 'Bank',
                            payout_ref: transaction_reference || transaction._id.toString()
                        }, lang);
                        await EmailService.send(organizer.email, emailTemplate.subject, emailTemplate.html);
                    } catch (emailError) {
                        console.error('[ADMIN:WITHDRAWAL_APPROVE] Email error:', emailError);
                    }
                }

                return Response.ok(res, transaction, 200, resp_messages(lang).withdrawal_approved || 'Withdrawal approved successfully');

            } else if (status == 2) {
                // REJECTED - restore wallet balance
                transaction.status = 2;
                transaction.processed_by = userId;
                transaction.processed_at = new Date();
                
                if (admin_notes) {
                    transaction.admin_notes = admin_notes;
                }
                
                if (rejection_reason) {
                    transaction.rejection_reason = rejection_reason;
                }

                await transaction.save();

                const amount = transaction.amount;
                const organizer_id = transaction.organizer_id;

                // Restore the amount back to wallet
                const wallet = await WalletService.FindOneService({ organizer_id: organizer_id });
                wallet.total_amount = wallet.total_amount + amount;
                await wallet.save();

                // Send notification to organizer
                try {
                    const NotificationService = require('../services/notificationService');
                    await NotificationService.CreateService({
                        user_id: organizer._id,
                        role: 2, // Organizer role
                        title: lang === 'ar' ? 'تم رفض طلب السحب' : 'Withdrawal Request Rejected',
                        description: lang === 'ar' 
                            ? `تم رفض طلب سحب مبلغ ${amount} ${transaction.currency || 'SAR'}. تم إرجاع المبلغ إلى محفظتك.${rejection_reason ? ` السبب: ${rejection_reason}` : ''}`
                            : `Your withdrawal request of ${amount} ${transaction.currency || 'SAR'} has been rejected. The amount has been restored to your wallet.${rejection_reason ? ` Reason: ${rejection_reason}` : ''}`,
                        isRead: false,
                        notification_type: 4, // Withdrawal type
                        status: 2 // Rejected
                    });
                } catch (notifError) {
                    console.error('[ADMIN:WITHDRAWAL_REJECT] Notification error:', notifError);
                }

                // Send email notification
                try {
                    const EmailService = require('../helpers/emailService');
                    await EmailService.sendEmail({
                        to: organizer.email,
                        subject: lang === 'ar' ? 'تم رفض طلب السحب' : 'Withdrawal Request Rejected - Zuroona',
                        html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                <h2 style="color: #a797cc;">Withdrawal Rejected</h2>
                                <p>Dear ${organizer.first_name} ${organizer.last_name},</p>
                                <p>Your withdrawal request has been rejected.</p>
                                <div style="background-color: #fff3f3; padding: 20px; border-radius: 10px; border-left: 4px solid #a797cc; margin: 20px 0;">
                                    <h3 style="margin-top: 0;">Withdrawal Details:</h3>
                                    <p><strong>Amount:</strong> ${amount} ${transaction.currency || 'SAR'}</p>
                                    <p><strong>Request Date:</strong> ${new Date(transaction.createdAt).toLocaleDateString()}</p>
                                    <p><strong>Rejected Date:</strong> ${new Date().toLocaleDateString()}</p>
                                    ${rejection_reason ? `<p><strong>Rejection Reason:</strong> ${rejection_reason}</p>` : ''}
                                    ${admin_notes ? `<p><strong>Admin Notes:</strong> ${admin_notes}</p>` : ''}
                                </div>
                                <p><strong>Good News:</strong> The amount of ${amount} ${transaction.currency || 'SAR'} has been restored to your wallet balance.</p>
                                <p>You can submit a new withdrawal request after resolving the mentioned issues.</p>
                                <p>If you have any questions, please contact our support team.</p>
                                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                                <p style="color: #666; font-size: 12px;">This is an automated email from Zuroona. Please do not reply.</p>
                            </div>
                        `
                    });
                } catch (emailError) {
                    console.error('[ADMIN:WITHDRAWAL_REJECT] Email error:', emailError);
                }

                return Response.ok(res, transaction, 200, resp_messages(lang).withdrawal_rejected || 'Withdrawal rejected successfully');
            }

        } catch (error) {
            console.error('[ADMIN:WITHDRAWAL_STATUS_UPDATE] Error:', error);
            return Response.serverErrorResponse(res, resp_messages(req.lang).internalServerError);
        }
    },

    /**
     * Get withdrawal statistics (Admin)
     * GET /admin/organizer/withdrawalStats
     */
    withdrawalStats: async (req, res) => {
        try {
            const lang = req.headers.lang || req.lang || 'en';

            // Get all withdrawal transactions
            const allWithdrawals = await TransactionService.FindService(1, 10000, { type: 2 });

            // Calculate statistics
            const stats = {
                total_requests: allWithdrawals.length,
                pending_requests: 0,
                approved_requests: 0,
                rejected_requests: 0,
                total_amount: 0,
                pending_amount: 0,
                approved_amount: 0,
                rejected_amount: 0,
                monthly_trend: [],
                top_hosts: [],
                recent_activity: []
            };

            // Calculate counts and amounts
            allWithdrawals.forEach(withdrawal => {
                stats.total_amount += withdrawal.amount || 0;

                if (withdrawal.status === 0) {
                    stats.pending_requests++;
                    stats.pending_amount += withdrawal.amount || 0;
                } else if (withdrawal.status === 1) {
                    stats.approved_requests++;
                    stats.approved_amount += withdrawal.amount || 0;
                } else if (withdrawal.status === 2) {
                    stats.rejected_requests++;
                    stats.rejected_amount += withdrawal.amount || 0;
                }
            });

            // Get monthly trend (last 6 months)
            const monthlyData = await TransactionService.AggregateService([
                {
                    $match: {
                        type: 2,
                        createdAt: {
                            $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" }
                        },
                        total_requests: { $sum: 1 },
                        total_amount: { $sum: "$amount" },
                        approved: {
                            $sum: { $cond: [{ $eq: ["$status", 1] }, 1, 0] }
                        },
                        rejected: {
                            $sum: { $cond: [{ $eq: ["$status", 2] }, 1, 0] }
                        },
                        pending: {
                            $sum: { $cond: [{ $eq: ["$status", 0] }, 1, 0] }
                        }
                    }
                },
                {
                    $sort: { "_id.year": 1, "_id.month": 1 }
                }
            ]);

            stats.monthly_trend = monthlyData.map(item => ({
                month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
                month_name: new Date(item._id.year, item._id.month - 1).toLocaleString('en', { month: 'short' }),
                total_requests: item.total_requests,
                total_amount: item.total_amount,
                approved: item.approved,
                rejected: item.rejected,
                pending: item.pending
            }));

            // Get top hosts (most withdrawn)
            const topHostsData = await TransactionService.AggregateService([
                {
                    $match: { type: 2, status: 1 } // Only approved withdrawals
                },
                {
                    $group: {
                        _id: "$organizer_id",
                        total_withdrawn: { $sum: "$amount" },
                        request_count: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: 'organizers',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'organizer'
                    }
                },
                {
                    $unwind: { path: "$organizer", preserveNullAndEmptyArrays: true }
                },
                {
                    $project: {
                        host_name: {
                            $concat: [
                                { $ifNull: ["$organizer.first_name", ""] },
                                " ",
                                { $ifNull: ["$organizer.last_name", ""] }
                            ]
                        },
                        host_email: "$organizer.email",
                        profile_image: "$organizer.profile_image",
                        total_withdrawn: 1,
                        request_count: 1
                    }
                },
                { $sort: { total_withdrawn: -1 } },
                { $limit: 10 }
            ]);

            stats.top_hosts = topHostsData;

            // Get recent activity (last 10 transactions)
            const recentActivity = await TransactionService.AggregateService([
                { $match: { type: 2 } },
                {
                    $lookup: {
                        from: 'organizers',
                        localField: 'organizer_id',
                        foreignField: '_id',
                        as: 'organizer'
                    }
                },
                {
                    $unwind: { path: "$organizer", preserveNullAndEmptyArrays: true }
                },
                {
                    $project: {
                        amount: 1,
                        status: 1,
                        createdAt: 1,
                        host_name: {
                            $concat: [
                                { $ifNull: ["$organizer.first_name", ""] },
                                " ",
                                { $ifNull: ["$organizer.last_name", ""] }
                            ]
                        },
                        host_image: "$organizer.profile_image"
                    }
                },
                { $sort: { createdAt: -1 } },
                { $limit: 10 }
            ]);

            stats.recent_activity = recentActivity;

            // Calculate average processing time
            const processedWithdrawals = await TransactionService.AggregateService([
                {
                    $match: {
                        type: 2,
                        status: { $in: [1, 2] },
                        processed_at: { $exists: true }
                    }
                },
                {
                    $project: {
                        processing_time: {
                            $subtract: ["$processed_at", "$requested_at"]
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        avg_processing_time: { $avg: "$processing_time" }
                    }
                }
            ]);

            if (processedWithdrawals.length > 0) {
                const avgTimeMs = processedWithdrawals[0].avg_processing_time;
                const avgTimeHours = (avgTimeMs / (1000 * 60 * 60)).toFixed(1);
                stats.avg_processing_time_hours = parseFloat(avgTimeHours);
            } else {
                stats.avg_processing_time_hours = 0;
            }

            return Response.ok(res, stats, 200, resp_messages(lang).fetched_data || 'Statistics fetched successfully');
        } catch (error) {
            console.error('[ADMIN:WITHDRAWAL_STATS] Error:', error);
            return Response.serverErrorResponse(res, resp_messages(req.lang).internalServerError);
        }
    },

    /**
     * Get refund requests list (Admin)
     * GET /admin/refund/list
     */
    refundList: async (req, res) => {
        try {
            const lang = req.lang || req.headers["lang"] || "en";
            const { page = 1, limit = 10, status, search } = req.query;
            const skip = (Number(page) - 1) * Number(limit);

            const RefundRequestService = require("../services/refundRequestService");
            const query = {};

            // Filter by status if provided
            if (status !== undefined) {
                query.status = parseInt(status);
            }

            // Search by user name, event name, or booking ID
            if (search) {
                query.$or = [
                    { refund_reason: { $regex: search, $options: "i" } },
                ];
            }

            let refundRequests;
            try {
                refundRequests = await RefundRequestService.FindService(
                    query,
                    Number(page),
                    Number(limit)
                );
                // Ensure it's an array
                if (!Array.isArray(refundRequests)) {
                    refundRequests = [];
                }
            } catch (serviceError) {
                console.error("[ADMIN:REFUND:LIST] Service error:", serviceError);
                refundRequests = [];
            }

            let count = 0;
            try {
                count = await RefundRequestService.CountDocumentService(query);
            } catch (countError) {
                console.error("[ADMIN:REFUND:LIST] Count error:", countError);
                count = Array.isArray(refundRequests) ? refundRequests.length : 0;
            }

            return Response.ok(
                res,
                refundRequests,
                200,
                resp_messages(lang).fetched_data || "Fetched data",
                count
            );
        } catch (error) {
            console.error("[ADMIN:REFUND:LIST] Error:", error);
            return Response.serverErrorResponse(
                res,
                resp_messages(req.lang).internalServerError
            );
        }
    },

    /**
     * Get refund request detail (Admin)
     * GET /admin/refund/detail
     */
    refundDetail: async (req, res) => {
        try {
            const lang = req.lang || req.headers["lang"] || "en";
            const { refund_id } = req.query;

            if (!refund_id) {
                return Response.validationErrorResponse(
                    res,
                    "Refund ID is required"
                );
            }

            const RefundRequestService = require("../services/refundRequestService");
            const refundRequest = await RefundRequestService.FindOneService({
                _id: refund_id,
            });

            if (!refundRequest) {
                return Response.notFoundResponse(
                    res,
                    "Refund request not found"
                );
            }

            return Response.ok(
                res,
                refundRequest,
                200,
                resp_messages(lang).fetched_data || "Fetched data"
            );
        } catch (error) {
            console.error("[ADMIN:REFUND:DETAIL] Error:", error);
            return Response.serverErrorResponse(
                res,
                resp_messages(req.lang).internalServerError
            );
        }
    },

    /**
     * Update refund request status (Admin)
     * PUT /admin/refund/update-status
     */
    refundStatusUpdate: async (req, res) => {
        try {
            const lang = req.lang || req.headers["lang"] || "en";
            const { adminId } = req;
            const { refund_id, status, admin_response, payment_refund_id } = req.body;

            console.log("[ADMIN:REFUND:UPDATE] Refund status update:", {
                refund_id,
                status,
                adminId,
            });

            // Validate inputs
            if (!refund_id || status === undefined) {
                return Response.validationErrorResponse(
                    res,
                    "Refund ID and status are required"
                );
            }

            // Validate status (0 pending, 1 approved, 2 rejected, 3 processed)
            if (![1, 2, 3].includes(parseInt(status))) {
                return Response.validationErrorResponse(
                    res,
                    "Invalid status. Use 1 for approved, 2 for rejected, or 3 for processed"
                );
            }

            const RefundRequestService = require("../services/refundRequestService");
            const BookEventService = require("../services/bookEventService");
            const TransactionService = require("../services/recentTransaction");
            const WalletService = require("../services/walletService");
            const NotificationService = require("../services/notificationService");

            // Find refund request
            const refundRequest = await RefundRequestService.FindOneService({
                _id: refund_id,
            });

            if (!refundRequest) {
                return Response.notFoundResponse(res, "Refund request not found");
            }

            // Check if already processed
            if (refundRequest.status === 3) {
                return Response.badRequestResponse(
                    res,
                    "Refund request already processed"
                );
            }

            if (refundRequest.status === 1 && parseInt(status) === 1) {
                return Response.badRequestResponse(
                    res,
                    "Refund request already approved"
                );
            }

            // Get booking details
            const booking = await BookEventService.FindOneService({
                _id: refundRequest.booking_id,
            });

            if (!booking) {
                return Response.notFoundResponse(res, "Booking not found");
            }

            // Get user details for notification
            const UserService = require("../services/userService");
            const user = await UserService.FindOneService({
                _id: refundRequest.user_id,
            });

            // Update refund request
            const updateData = {
                status: parseInt(status),
                processed_by: adminId,
                processed_at: new Date(),
            };

            if (admin_response) {
                updateData.admin_response = admin_response;
            }

            if (payment_refund_id) {
                updateData.payment_refund_id = payment_refund_id;
            }

            const updatedRefund = await RefundRequestService.FindByIdAndUpdateService(
                refund_id,
                updateData
            );

            // Handle based on status
            if (parseInt(status) === 1) {
                // Approved - Process refund via Moyasar
                const MoyasarService = require("../helpers/MoyasarService");
                let moyasarRefundId = null;
                let refundSuccess = false;
                let refundError = null;

                // Check if booking has payment_id (Moyasar payment ID)
                if (booking.payment_id) {
                    try {
                        console.log(`[ADMIN:REFUND:MOYASAR] Processing refund for payment ${booking.payment_id}`);
                        
                        // Process refund via Moyasar
                        const refundDescription = `Refund for booking ${booking.order_id || booking._id}. ${admin_response || 'Refund approved by admin'}`;
                        const refundResult = await MoyasarService.refundPayment(
                            booking.payment_id,
                            refundRequest.amount,
                            refundDescription
                        );

                        if (refundResult.success) {
                            moyasarRefundId = refundResult.refundId || refundResult.data?.id;
                            refundSuccess = true;
                            console.log(`[ADMIN:REFUND:MOYASAR] Refund processed successfully. Refund ID: ${moyasarRefundId}`);
                        } else {
                            refundError = refundResult.message;
                            console.error(`[ADMIN:REFUND:MOYASAR] Refund failed: ${refundError}`);
                            // Continue with refund request approval even if Moyasar refund fails
                            // Admin can manually process refund later
                        }
                    } catch (moyasarError) {
                        refundError = moyasarError.message;
                        console.error(`[ADMIN:REFUND:MOYASAR] Exception during refund: ${refundError}`);
                        // Continue with refund request approval
                    }
                } else {
                    console.warn(`[ADMIN:REFUND:MOYASAR] Booking ${booking._id} has no payment_id. Refund will be marked as approved but not processed via Moyasar.`);
                    refundError = "No payment ID found for this booking";
                }

                // Update refund request with Moyasar refund ID if available
                const refundUpdateData = {};
                if (moyasarRefundId) {
                    refundUpdateData.payment_refund_id = moyasarRefundId;
                }
                if (refundError) {
                    refundUpdateData.refund_error = refundError;
                }

                // Create refund transaction
                const refundTransaction = await TransactionService.CreateService({
                    user_id: refundRequest.user_id,
                    organizer_id: refundRequest.organizer_id,
                    book_id: refundRequest.booking_id,
                    amount: refundRequest.amount,
                    currency: "SAR",
                    type: 3, // Refund type
                    status: refundSuccess ? 1 : 0, // 1 Success, 0 Pending if Moyasar refund failed
                    payment_id: moyasarRefundId || payment_refund_id || null,
                });

                // Update refund request with transaction ID and Moyasar refund details
                await RefundRequestService.FindByIdAndUpdateService(refund_id, {
                    refund_transaction_id: refundTransaction._id,
                    ...refundUpdateData,
                });

                // Update booking status to refunded
                await BookEventService.FindByIdAndUpdateService(booking._id, {
                    book_status: 6, // Refunded
                });

                // Send notification to user
                const notificationMessage = refundSuccess
                    ? (lang === "ar"
                        ? `تمت الموافقة على طلب الاسترداد الخاص بك. تم إرجاع مبلغ ${refundRequest.amount} SAR إلى حسابك.${admin_response ? ` ملاحظة: ${admin_response}` : ""}`
                        : `Your refund request has been approved. Amount ${refundRequest.amount} SAR has been refunded to your account.${admin_response ? ` Note: ${admin_response}` : ""}`)
                    : (lang === "ar"
                        ? `تمت الموافقة على طلب الاسترداد الخاص بك. سيتم معالجة الاسترداد قريباً.${admin_response ? ` ملاحظة: ${admin_response}` : ""}`
                        : `Your refund request has been approved. Refund will be processed shortly.${admin_response ? ` Note: ${admin_response}` : ""}`);

                await NotificationService.CreateService({
                    user_id: refundRequest.user_id,
                    role: 1, // User role
                    title: lang === "ar" ? "تمت الموافقة على طلب الاسترداد" : "Refund Request Approved",
                    description: notificationMessage,
                    isRead: false,
                    notification_type: 4, // Refund type
                    event_id: refundRequest.event_id,
                    book_id: refundRequest.booking_id,
                });

                console.log(`[ADMIN:REFUND:APPROVED] Refund approved. Moyasar refund: ${refundSuccess ? 'Success' : 'Failed'}`);
            } else if (parseInt(status) === 2) {
                // Rejected
                await BookEventService.FindByIdAndUpdateService(booking._id, {
                    book_status: 3, // Keep as cancelled
                });

                // Send notification to user
                await NotificationService.CreateService({
                    user_id: refundRequest.user_id,
                    role: 1, // User role
                    title: lang === "ar" ? "تم رفض طلب الاسترداد" : "Refund Request Rejected",
                    description: lang === "ar"
                        ? `تم رفض طلب الاسترداد الخاص بك.${admin_response ? ` السبب: ${admin_response}` : ""}`
                        : `Your refund request has been rejected.${admin_response ? ` Reason: ${admin_response}` : ""}`,
                    isRead: false,
                    notification_type: 4, // Refund type
                    event_id: refundRequest.event_id,
                    book_id: refundRequest.booking_id,
                });

                console.log("[ADMIN:REFUND:REJECTED] Refund rejected");
            } else if (parseInt(status) === 3) {
                // Processed - Mark as completed
                await BookEventService.FindByIdAndUpdateService(booking._id, {
                    book_status: 6, // Refunded
                });

                // Send notification to user
                await NotificationService.CreateService({
                    user_id: refundRequest.user_id,
                    role: 1, // User role
                    title: lang === "ar" ? "تم معالجة الاسترداد" : "Refund Processed",
                    description: lang === "ar"
                        ? `تم معالجة استردادك بنجاح. تم إرجاع مبلغ ${refundRequest.amount} SAR إلى حسابك.`
                        : `Your refund has been processed successfully. Amount ${refundRequest.amount} SAR has been refunded to your account.`,
                    isRead: false,
                    notification_type: 4, // Refund type
                    event_id: refundRequest.event_id,
                    book_id: refundRequest.booking_id,
                });

                console.log("[ADMIN:REFUND:PROCESSED] Refund marked as processed");
            }

            return Response.ok(
                res,
                updatedRefund,
                200,
                resp_messages(lang).update_success || "Refund status updated successfully"
            );
        } catch (error) {
            console.error("[ADMIN:REFUND:UPDATE] Error:", error);
            return Response.serverErrorResponse(
                res,
                resp_messages(req.lang).internalServerError
            );
        }
    },
    
    // Event status change with email notification
    eventStatusChange: async (req, res) => {
        const { lang } = req || 'en';
        try {
            const { eventId, status, rejectionReason } = req.body;
            
            if (!mongoose.Types.ObjectId.isValid(eventId)) {
                return Response.badRequestResponse(res, resp_messages(lang).id_required);
            }

            const event = await EventService.FindOneService({ _id: eventId });
            if (!event) {
                return Response.notFoundResponse(res, resp_messages(lang).data_not_found);
            }

            // Map status: 1=Pending, 2=Upcoming/Approved, 3=Completed, 4=Rejected
            // Backend uses: 0=Pending, 1=Approved, 2=Rejected
            let newStatus;
            if (status === 2) {
                newStatus = 1; // Approved/Upcoming
            } else if (status === 4) {
                newStatus = 2; // Rejected
            } else {
                newStatus = event.is_approved; // Keep current
            }

            const oldStatus = event.is_approved;
            event.is_approved = newStatus;
            await event.save();

            // Get organizer details for email
            const organizer = await organizerService.FindOneService({ _id: event.organizer_id });
            
            if (organizer && organizer.email) {
                try {
                    const organizerName = `${organizer.first_name} ${organizer.last_name}`;
                    const organizerLang = organizer.language || lang;
                    
                    if (oldStatus === 0 && newStatus === 1) {
                        // Event approved - Create group chat automatically
                        try {
                            // Check if group chat already exists
                            const existingGroupChat = await ConversationService.GetGroupChatByEventService(event._id);
                            
                            if (!existingGroupChat) {
                                // Create group chat for this event
                                await ConversationService.CreateGroupChatService(
                                    event._id,
                                    event.organizer_id,
                                    event.event_name
                                );
                                console.log(`[GROUP-CHAT] Created group chat for event: ${event.event_name} (${event._id})`);
                            }
                        } catch (groupChatError) {
                            console.error('[GROUP-CHAT] Error creating group chat:', groupChatError);
                            // Don't fail the request if group chat creation fails
                        }
                        
                        // Event approved - Send email
                        await sendEventApprovalEmail(organizer.email, organizerName, event.event_name, organizerLang);
                        
                        // Create in-app notification and send push notification for organizer
                        try {
                            const notificationTitle = organizerLang === "ar" ? "تم الموافقة على فعاليتك" : "Event Approved";
                            const notificationDescription = organizerLang === "ar"
                                ? `تم الموافقة على فعاليتك "${event.event_name}". يمكن للمستخدمين الآن حجز تذاكر لحضور فعاليتك!`
                                : `Your event "${event.event_name}" has been approved. Users can now book tickets to attend your event!`;
                            
                            // Send push notification (this also creates in-app notification)
                            try {
                                const notificationMessage = {
                                    title: notificationTitle,
                                    description: notificationDescription,
                                    first_name: organizer.first_name,
                                    last_name: organizer.last_name,
                                    userId: organizer._id,
                                    profile_image: organizer.profile_image || "",
                                    event_id: event._id,
                                    notification_type: 1, // Event approval type
                                    status: newStatus
                                };
                                await pushNotification(res, 2, event.organizer_id, notificationMessage);
                                console.log(`[NOTIFICATION] Created and sent approval notification to organizer: ${event.organizer_id}`);
                            } catch (pushError) {
                                // If push notification fails, create in-app notification as fallback
                                console.error('[PUSH-NOTIFICATION] Error sending push notification, creating in-app notification as fallback:', pushError);
                                await NotificationService.CreateService({
                                    user_id: event.organizer_id,
                                    role: 2, // Organizer role
                                    title: notificationTitle,
                                    description: notificationDescription,
                                    isRead: false,
                                    notification_type: 1, // Event approval type
                                    event_id: event._id,
                                    status: newStatus
                                });
                                console.log(`[NOTIFICATION] Created fallback in-app notification for organizer: ${event.organizer_id}`);
                            }
                        } catch (notificationError) {
                            console.error('[NOTIFICATION] Error creating approval notification:', notificationError);
                            // Don't fail the request if notification creation fails
                        }
                    } else if (oldStatus === 0 && newStatus === 2 && rejectionReason) {
                        // Event rejected - Send email
                        await sendEventRejectionEmail(organizer.email, organizerName, event.event_name, rejectionReason, organizerLang);
                        
                        // Create in-app notification and send push notification for organizer
                        try {
                            const notificationTitle = organizerLang === "ar" ? "تم رفض فعاليتك" : "Event Rejected";
                            const notificationDescription = organizerLang === "ar"
                                ? `تم رفض فعاليتك "${event.event_name}". السبب: ${rejectionReason}`
                                : `Your event "${event.event_name}" has been rejected. Reason: ${rejectionReason}`;
                            
                            // Send push notification (this also creates in-app notification)
                            try {
                                const notificationMessage = {
                                    title: notificationTitle,
                                    description: notificationDescription,
                                    first_name: organizer.first_name,
                                    last_name: organizer.last_name,
                                    userId: organizer._id,
                                    profile_image: organizer.profile_image || "",
                                    event_id: event._id,
                                    notification_type: 3, // Event rejection type
                                    status: newStatus
                                };
                                await pushNotification(res, 2, event.organizer_id, notificationMessage);
                                console.log(`[NOTIFICATION] Created and sent rejection notification to organizer: ${event.organizer_id}`);
                            } catch (pushError) {
                                // If push notification fails, create in-app notification as fallback
                                console.error('[PUSH-NOTIFICATION] Error sending push notification, creating in-app notification as fallback:', pushError);
                                await NotificationService.CreateService({
                                    user_id: event.organizer_id,
                                    role: 2, // Organizer role
                                    title: notificationTitle,
                                    description: notificationDescription,
                                    isRead: false,
                                    notification_type: 3, // Event rejection type
                                    event_id: event._id,
                                    status: newStatus
                                });
                                console.log(`[NOTIFICATION] Created fallback in-app notification for organizer: ${event.organizer_id}`);
                            }
                        } catch (notificationError) {
                            console.error('[NOTIFICATION] Error creating rejection notification:', notificationError);
                            // Don't fail the request if notification creation fails
                        }
                    }
                } catch (emailError) {
                    console.error('Error sending email:', emailError);
                    // Don't fail the request if email fails
                }
            }

            return Response.ok(res, { event }, 200, resp_messages(lang).update_success);
        } catch (error) {
            console.error(error);
            return Response.serverErrorResponse(res, resp_messages(lang).internalServerError);
        }
    },
    
    // Admin Management CRUD
    adminList: async (req, res) => {
        const { lang } = req || 'en';
        try {
            const { page = 1, limit = 10, search = '' } = req.query;
            const skip = (parseInt(page) - 1) * parseInt(limit);
            
            let query = { is_delete: { $ne: 1 } };
            if (search) {
                query.$or = [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { mobileNumber: { $regex: search, $options: 'i' } }
                ];
            }
            
            const admins = await AdminService.FindService(page, limit, query);
            const totalCount = await AdminService.CountDocumentService(query);
            
            const adminData = admins.map((admin, i) => ({
                ...admin.toObject(),
                _id: admin._id,
                admin_name: `${admin.firstName || ''} ${admin.lastName || ''}`.trim(),
                username: admin.email?.split('@')[0] || `admin_${i + 1}`,
                mobile_number: admin.mobileNumber?.toString() || '',
                profile_image: admin.image || '/assets/images/dummyImage.png',
                is_main: admin.mobileNumber === '0598379373' || admin.mobileNumber === 598379373
            }));
            
            return Response.ok(res, adminData, 200, resp_messages(lang).fetched_data, totalCount);
        } catch (error) {
            console.error(error);
            return Response.serverErrorResponse(res, resp_messages(lang).internalServerError);
        }
    },
    
    adminDetail: async (req, res) => {
        const { lang } = req || 'en';
        try {
            const { id } = req.query;
            
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return Response.badRequestResponse(res, resp_messages(lang).id_required);
            }
            
            const admin = await AdminService.FindOneService({ _id: id });
            if (!admin) {
                return Response.notFoundResponse(res, resp_messages(lang).user_not_found);
            }
            
            return Response.ok(res, admin, 200, resp_messages(lang).fetched_data);
        } catch (error) {
            console.error(error);
            return Response.serverErrorResponse(res, resp_messages(lang).internalServerError);
        }
    },
    
    adminCreate: async (req, res) => {
        const { lang } = req || 'en';
        try {
            const { admin_name, username, mobile_number, email, password, profile_image } = req.body;
            
            // Check if admin with same email exists (removed mobile number restriction)
            if (email) {
                const existingAdmin = await AdminService.FindOneService({ email: email });
                if (existingAdmin) {
                    return Response.conflictResponse(res, {}, 409, "Admin with this email already exists");
                }
            }
            
            // Split admin_name into firstName and lastName
            const nameParts = admin_name ? admin_name.split(' ') : [];
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            // Convert mobile_number to number if it's a string
            const mobileNumberValue = mobile_number !== undefined && mobile_number !== null && mobile_number !== '' 
                ? (typeof mobile_number === 'string' ? parseInt(mobile_number) || mobile_number : mobile_number)
                : undefined;
            
            const adminData = {
                firstName,
                lastName,
                mobileNumber: mobileNumberValue,
                email: email || `${username}@zarouna.com`,
                password: password,
                image: profile_image,
                role: 3,
                is_verified: true
            };
            
            const admin = await AdminService.CreateService(adminData);
            
            // Remove password from response
            const adminResponse = admin.toObject ? admin.toObject() : admin;
            delete adminResponse.password;
            
            return Response.ok(res, adminResponse, 201, "Admin created successfully");
        } catch (error) {
            console.error('[ADMIN:CREATE] Error:', error);
            console.error('[ADMIN:CREATE] Error stack:', error.stack);
            return Response.serverErrorResponse(res, resp_messages(lang).internalServerError || `Error creating admin: ${error.message}`);
        }
    },
    
    adminUpdate: async (req, res) => {
        const { lang } = req || 'en';
        try {
            // Handle both JSON and FormData requests
            const id = req.body?.id;
            const admin_name = req.body?.admin_name;
            const username = req.body?.username;
            const mobile_number = req.body?.mobile_number;
            const email = req.body?.email;
            const profile_image = req.body?.profile_image;
            const password = req.body?.password;
            
            console.log('[ADMIN:UPDATE] Request body:', { id, admin_name, username, mobile_number, email, hasPassword: !!password, hasProfileImage: !!profile_image });
            console.log('[ADMIN:UPDATE] Files:', req.files ? Object.keys(req.files) : 'No files');
            console.log('[ADMIN:UPDATE] Content-Type:', req.headers['content-type']);
            
            if (!id) {
                return Response.badRequestResponse(res, resp_messages(lang).id_required || "Admin ID is required");
            }
            
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return Response.badRequestResponse(res, resp_messages(lang).id_required || "Invalid admin ID format");
            }
            
            const admin = await AdminService.FindOneService({ _id: id });
            if (!admin) {
                return Response.notFoundResponse(res, resp_messages(lang).user_not_found || "Admin not found");
            }
            
            // Prepare update data
            const updateData = {};
            
            // Split admin_name into firstName and lastName
            if (admin_name !== undefined && admin_name !== null && admin_name !== '') {
                const nameParts = admin_name.split(' ').filter(part => part.trim() !== '');
                updateData.firstName = nameParts[0] || admin.firstName || '';
                updateData.lastName = nameParts.slice(1).join(' ') || admin.lastName || '';
            }
            
            if (mobile_number !== undefined && mobile_number !== null && mobile_number !== '') {
                // Convert to number if it's a string, otherwise use as-is
                updateData.mobileNumber = typeof mobile_number === 'string' ? parseInt(mobile_number) || mobile_number : mobile_number;
            }
            
            if (email !== undefined && email !== null && email !== '') {
                updateData.email = email.toLowerCase().trim();
            }
            
            // Handle file upload (if file is sent via FormData)
            if (req.files && req.files.profile_image) {
                const file = req.files.profile_image;
                console.log('[ADMIN:UPDATE] File received:', { 
                    name: file.name, 
                    size: file.size, 
                    mimetype: file.mimetype,
                    hasData: !!file.data,
                    hasTempFilePath: !!file.tempFilePath
                });
                
                try {
                    // Read file data (handle both temp files and in-memory files)
                    let fileData;
                    const fs = require('fs');
                    
                    if (file.tempFilePath) {
                        // File was saved to temp directory
                        fileData = fs.readFileSync(file.tempFilePath);
                        console.log('[ADMIN:UPDATE] Reading from temp file:', file.tempFilePath);
                    } else if (file.data) {
                        // File is in memory
                        fileData = file.data;
                        console.log('[ADMIN:UPDATE] Using in-memory file data');
                    } else {
                        console.error('[ADMIN:UPDATE] No file data found');
                        throw new Error('File data not found');
                    }
                    
                    // Upload to AWS S3
                    const { uploadToS3 } = require("../utils/awsS3");
                    const s3Result = await uploadToS3(
                        fileData,
                        'Zuroona/Admin',
                        file.name || `admin-${Date.now()}.jpg`,
                        file.mimetype || 'image/jpeg'
                    );
                    
                    if (s3Result && s3Result.url) {
                        updateData.image = s3Result.url;
                        console.log('[ADMIN:UPDATE] Image uploaded to AWS S3:', s3Result.url);
                    } else {
                        console.error('[ADMIN:UPDATE] AWS S3 upload failed:', s3Result);
                    }
                    
                    // Clean up temp file if it was used
                    if (file.tempFilePath) {
                        try {
                            fs.unlinkSync(file.tempFilePath);
                            console.log('[ADMIN:UPDATE] Temp file cleaned up');
                        } catch (cleanupError) {
                            console.warn('[ADMIN:UPDATE] Failed to delete temp file:', cleanupError.message);
                        }
                    }
                } catch (uploadError) {
                    console.error('[ADMIN:UPDATE] Error uploading image:', uploadError);
                    console.error('[ADMIN:UPDATE] Upload error stack:', uploadError.stack);
                    // Don't fail the entire update if image upload fails, but log it
                }
            } else if (profile_image !== undefined && profile_image !== null) {
                // Handle string URL (if image URL is sent directly)
                if (typeof profile_image === 'string' && profile_image.trim() !== '') {
                    updateData.image = profile_image.trim();
                } else if (typeof profile_image === 'object') {
                    // Skip if it's an object (empty or not) - don't update image field
                    console.warn('[ADMIN:UPDATE] profile_image is an object, skipping image update:', profile_image);
                }
            }
            
            // Handle password update (hash if provided)
            if (password !== undefined && password !== null && password !== '') {
                const HashPassword = require("../helpers/hashPassword");
                updateData.password = await HashPassword.hashPassword(password);
            }
            
            // Update admin - no restrictions, update whatever is provided
            if (Object.keys(updateData).length > 0) {
                console.log('[ADMIN:UPDATE] Updating fields:', Object.keys(updateData));
                
                const updatedAdmin = await AdminService.FindByIdAndUpdateService(id, updateData);
                
                if (!updatedAdmin) {
                    return Response.serverErrorResponse(res, "Update failed");
                }
                
                // Format response
                const adminResponse = updatedAdmin.toObject ? updatedAdmin.toObject() : updatedAdmin;
                delete adminResponse.password;
                
                const formattedResponse = {
                    ...adminResponse,
                    profile_image: adminResponse.image || '/assets/images/dummyImage.png',
                    admin_name: `${adminResponse.firstName || ''} ${adminResponse.lastName || ''}`.trim() || 'Admin',
                    username: adminResponse.email?.split('@')[0] || 'admin',
                    mobile_number: adminResponse.mobileNumber?.toString() || '',
                };
                
                return Response.ok(res, formattedResponse, 200, "Admin updated successfully");
            } else {
                // No changes, return current data
                const adminResponse = admin.toObject ? admin.toObject() : admin;
                delete adminResponse.password;
                
                const formattedResponse = {
                    ...adminResponse,
                    profile_image: adminResponse.image || '/assets/images/dummyImage.png',
                    admin_name: `${adminResponse.firstName || ''} ${adminResponse.lastName || ''}`.trim() || 'Admin',
                    username: adminResponse.email?.split('@')[0] || 'admin',
                    mobile_number: adminResponse.mobileNumber?.toString() || '',
                };
                
                return Response.ok(res, formattedResponse, 200, "No changes to update");
            }
        } catch (error) {
            console.error('[ADMIN:UPDATE] Error:', error);
            console.error('[ADMIN:UPDATE] Error message:', error.message);
            console.error('[ADMIN:UPDATE] Error stack:', error.stack);
            return Response.serverErrorResponse(
                res, 
                resp_messages(lang).internalServerError || `Error updating admin: ${error.message}`
            );
        }
    },
    
    adminDelete: async (req, res) => {
        const { lang } = req || 'en';
        try {
            const { id } = req.body;
            
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return Response.badRequestResponse(res, resp_messages(lang).id_required);
            }
            
            const admin = await AdminService.FindOneService({ _id: id });
            if (!admin) {
                return Response.notFoundResponse(res, resp_messages(lang).user_not_found);
            }
            
            // Check if main admin (Mr. Naif's number)
            if (admin.mobileNumber === '0598379373' || admin.mobileNumber === 598379373) {
                return Response.badRequestResponse(res, "Cannot delete main admin account");
            }
            
            await AdminService.FindByIdAndDeleteService(id);
            
            return Response.ok(res, {}, 200, "Admin deleted successfully");
        } catch (error) {
            console.error(error);
            return Response.serverErrorResponse(res, resp_messages(lang).internalServerError);
        }
    },
    
    // Wallet details endpoint
    /**
     * Get comprehensive wallet statistics
     */
    getWalletStats: async (req, res) => {
        const lang = req.lang || req.headers["lang"] || "en";
        try {
            // Overall Statistics
            const wallets = await WalletService.AggregateService([
                {
                    $group: {
                        _id: null,
                        total_balance: { $sum: "$total_amount" },
                        total_wallets: { $sum: 1 },
                        avg_balance: { $avg: "$total_amount" },
                        max_balance: { $max: "$total_amount" },
                        min_balance: { $min: "$total_amount" }
                    }
                }
            ]);

            // Transaction Statistics
            const transactionStats = await TransactionService.AggregateService([
                {
                    $group: {
                        _id: "$type",
                        total_amount: { $sum: "$amount" },
                        count: { $sum: 1 },
                        avg_amount: { $avg: "$amount" }
                    }
                }
            ]);

            // Withdrawal Statistics by Status
            const withdrawalStats = await TransactionService.AggregateService([
                {
                    $match: { type: 2 }
                },
                {
                    $group: {
                        _id: "$status",
                        total_amount: { $sum: "$amount" },
                        count: { $sum: 1 }
                    }
                }
            ]);

            // Monthly Trends (last 6 months)
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

            const monthlyTrends = await TransactionService.AggregateService([
                {
                    $match: {
                        createdAt: { $gte: sixMonthsAgo },
                        status: 1
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                            type: "$type"
                        },
                        total_amount: { $sum: "$amount" },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } }
            ]);

            // Top 10 Hosts by Balance
            const topHosts = await WalletService.AggregateService([
                {
                    $lookup: {
                        from: "organizers",
                        localField: "organizer_id",
                        foreignField: "_id",
                        as: "organizer"
                    }
                },
                { $unwind: "$organizer" },
                {
                    $project: {
                        total_amount: 1,
                        organizer: {
                            _id: 1,
                            first_name: 1,
                            last_name: 1,
                            group_name: 1,
                            profile_image: 1,
                            email: 1
                        }
                    }
                },
                { $sort: { total_amount: -1 } },
                { $limit: 10 }
            ]);

            // Top 10 Hosts by Total Earnings
            const topEarners = await TransactionService.AggregateService([
                {
                    $match: { type: 1, status: 1 }
                },
                {
                    $group: {
                        _id: "$organizer_id",
                        total_earnings: { $sum: "$amount" },
                        transaction_count: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: "organizers",
                        localField: "_id",
                        foreignField: "_id",
                        as: "organizer"
                    }
                },
                { $unwind: "$organizer" },
                {
                    $project: {
                        total_earnings: 1,
                        transaction_count: 1,
                        organizer: {
                            _id: 1,
                            first_name: 1,
                            last_name: 1,
                            group_name: 1,
                            profile_image: 1
                        }
                    }
                },
                { $sort: { total_earnings: -1 } },
                { $limit: 10 }
            ]);

            // Recent Activity (last 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const recentActivity = await TransactionService.CountDocumentService({
                createdAt: { $gte: sevenDaysAgo }
            });

            // Pending Withdrawals
            const pendingWithdrawals = await TransactionService.AggregateService([
                {
                    $match: { type: 2, status: 0 }
                },
                {
                    $group: {
                        _id: null,
                        total_amount: { $sum: "$amount" },
                        count: { $sum: 1 }
                    }
                }
            ]);

            // Calculate totals
            const earnings = transactionStats.find(s => s._id === 1) || { total_amount: 0, count: 0 };
            const withdrawals = transactionStats.find(s => s._id === 2) || { total_amount: 0, count: 0 };
            const refunds = transactionStats.find(s => s._id === 3) || { total_amount: 0, count: 0 };

            const pendingWd = withdrawalStats.find(s => s._id === 0) || { total_amount: 0, count: 0 };
            const approvedWd = withdrawalStats.find(s => s._id === 1) || { total_amount: 0, count: 0 };
            const rejectedWd = withdrawalStats.find(s => s._id === 2) || { total_amount: 0, count: 0 };

            const stats = {
                // Overall Wallet Stats
                total_balance: wallets[0]?.total_balance || 0,
                total_wallets: wallets[0]?.total_wallets || 0,
                avg_balance: wallets[0]?.avg_balance || 0,
                max_balance: wallets[0]?.max_balance || 0,
                min_balance: wallets[0]?.min_balance || 0,

                // Transaction Totals
                total_earnings: earnings.total_amount,
                total_withdrawals: withdrawals.total_amount,
                total_refunds: refunds.total_amount,
                total_transactions: earnings.count + withdrawals.count + refunds.count,

                // Withdrawal Status
                pending_withdrawals: pendingWd.count,
                pending_withdrawals_amount: pendingWd.total_amount,
                approved_withdrawals: approvedWd.count,
                approved_withdrawals_amount: approvedWd.total_amount,
                rejected_withdrawals: rejectedWd.count,
                rejected_withdrawals_amount: rejectedWd.total_amount,

                // Available Balance
                available_balance: (wallets[0]?.total_balance || 0) - (pendingWd.total_amount || 0),

                // Recent Activity
                recent_activity: recentActivity,

                // Trends and Rankings
                monthly_trends: monthlyTrends,
                top_hosts: topHosts,
                top_earners: topEarners
            };

            return Response.ok(res, stats, 200, resp_messages(lang).success || "Success");
        } catch (error) {
            console.error("Error fetching wallet stats:", error);
            return Response.serverErrorResponse(res, error.message || resp_messages(lang).internalServerError);
        }
    },

    walletDetails: async (req, res) => {
        const { lang } = req || 'en';
        try {
            // Get all wallets and calculate totals
            const wallets = await WalletService.FindService(1, 1000, {});
            
            let total_balance = 0;
            let pending_balance = 0;
            let available_balance = 0;
            let total_withdrawals = 0;
            let total_earnings = 0;
            
            // Calculate totals from wallets
            wallets.forEach(wallet => {
                total_balance += wallet.total_amount || 0;
                available_balance += wallet.total_amount || 0;
            });
            
            // Get pending withdrawal requests (status = 0)
            const pendingTransactions = await TransactionService.FindService(1, 1000, { type: 2, status: 0 });
            pendingTransactions.forEach(transaction => {
                pending_balance += transaction.amount || 0;
                available_balance -= transaction.amount || 0; // Subtract pending from available
            });
            
            // Get completed withdrawals (status = 1)
            const completedWithdrawals = await TransactionService.FindService(1, 1000, { type: 2, status: 1 });
            completedWithdrawals.forEach(transaction => {
                total_withdrawals += transaction.amount || 0;
            });
            
            // Get all earnings (type = 1, status = 1)
            const earnings = await TransactionService.FindService(1, 1000, { type: 1, status: 1 });
            earnings.forEach(transaction => {
                total_earnings += transaction.amount || 0;
            });
            
            const walletData = {
                total_balance,
                pending_balance,
                available_balance: Math.max(0, available_balance),
                total_withdrawals,
                total_earnings
            };
            
            return Response.ok(res, walletData, 200, resp_messages(lang).fetched_data);
        } catch (error) {
            console.error(error);
            return Response.serverErrorResponse(res, resp_messages(lang).internalServerError);
        }
    },
    
    // Get current admin profile
    getCurrentAdmin: async (req, res) => {
        const { lang } = req || 'en';
        try {
            const { userId } = req;
            
            const admin = await AdminService.FindOneService({ _id: userId });
            if (!admin) {
                return Response.notFoundResponse(res, resp_messages(lang).user_not_found);
            }
            
            return Response.ok(res, admin, 200, resp_messages(lang).fetched_data);
        } catch (error) {
            console.error(error);
            return Response.serverErrorResponse(res, resp_messages(lang).internalServerError);
        }
    },
    
    // Get admin notifications
    getAdminNotifications: async (req, res) => {
        const { lang } = req || 'en';
        try {
            const { page = 1, limit = 20 } = req.query;
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const userId = req.userId || req.user?._id || req.user?.id;
            
            if (!userId) {
                return Response.badRequestResponse(res, "User ID is required. Please login again.");
            }
            
            // Validate ObjectId format
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return Response.badRequestResponse(res, "Invalid user ID format");
            }
            
            const userIdObject = new mongoose.Types.ObjectId(userId);
            
            // Get notifications for this specific admin user (role = 3)
            const notifications = await NotificationService.AggregateService([
                {
                    $match: { 
                        user_id: userIdObject,
                        role: 3 // Admin role
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $skip: skip
                },
                {
                    $limit: parseInt(limit)
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        description: 1,
                        text: '$description', // For backward compatibility
                        type: '$notification_type',
                        notification_type: 1,
                        is_read: '$isRead',
                        isRead: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        profile_image: 1,
                        username: 1,
                        senderId: 1,
                        event_id: 1,
                        book_id: 1,
                        status: 1
                    }
                }
            ]);
            
            // Get total count for pagination
            const totalCount = await NotificationService.CountDocumentService({
                user_id: userIdObject,
                role: 3
            });
            
            return Response.ok(res, notifications, 200, resp_messages(lang).fetched_data || "Notifications fetched successfully", totalCount);
        } catch (error) {
            console.error('[ADMIN-NOTIFICATIONS] Error:', error);
            console.error('[ADMIN-NOTIFICATIONS] Error stack:', error.stack);
            return Response.serverErrorResponse(res, resp_messages(lang).internalServerError || "Error fetching notifications");
        }
    },

    /**
     * Get all career applications (Admin)
     * GET /admin/career/applications
     */
    getCareerApplications: async (req, res) => {
        const lang = req.headers["lang"] || "en";
        try {
            const { page = 1, limit = 20, status, position, search } = req.query;
            const skip = (parseInt(page) - 1) * parseInt(limit);

            const CareerApplicationService = require("../services/careerApplicationService");
            
            // Build query
            const query = {};
            if (status !== undefined) {
                query.status = parseInt(status);
            }
            if (position) {
                query.position = { $regex: position, $options: 'i' };
            }
            if (search) {
                query.$or = [
                    { first_name: { $regex: search, $options: 'i' } },
                    { last_name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                ];
            }

            const applications = await CareerApplicationService.AggregateService([
                { $match: query },
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: parseInt(limit) },
            ]);

            const total = await CareerApplicationService.CountDocumentService(query);

            return Response.ok(
                res,
                {
                    applications,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: Math.ceil(total / limit),
                        totalApplications: total,
                        hasMore: skip + applications.length < total,
                    },
                },
                200,
                "Career applications retrieved successfully"
            );
        } catch (error) {
            console.error("[ADMIN:CAREER] Error getting applications:", error);
            return Response.serverErrorResponse(
                res,
                resp_messages(lang).internalServerError
            );
        }
    },

    /**
     * Get career application detail (Admin)
     * GET /admin/career/application/detail
     */
    getCareerApplicationDetail: async (req, res) => {
        const lang = req.headers["lang"] || "en";
        try {
            const { application_id } = req.query;

            if (!application_id) {
                return Response.validationErrorResponse(
                    res,
                    "Application ID is required"
                );
            }

            const CareerApplicationService = require("../services/careerApplicationService");
            const application = await CareerApplicationService.FindByIdService(application_id);

            if (!application) {
                return Response.notFoundResponse(
                    res,
                    "Career application not found"
                );
            }

            return Response.ok(
                res,
                application,
                200,
                "Career application retrieved successfully"
            );
        } catch (error) {
            console.error("[ADMIN:CAREER] Error getting application detail:", error);
            return Response.serverErrorResponse(
                res,
                resp_messages(lang).internalServerError
            );
        }
    },

    /**
     * Update career application status (Admin)
     * PUT /admin/career/application/update-status
     */
    updateCareerApplicationStatus: async (req, res) => {
        const lang = req.headers["lang"] || "en";
        try {
            const { application_id, status, notes } = req.body;
            const { userId: adminId } = req;

            if (!application_id || status === undefined) {
                return Response.validationErrorResponse(
                    res,
                    "Application ID and status are required"
                );
            }

            if (![0, 1, 2, 3].includes(parseInt(status))) {
                return Response.validationErrorResponse(
                    res,
                    "Invalid status. Use 0: Pending, 1: Under Review, 2: Accepted, 3: Rejected"
                );
            }

            const CareerApplicationService = require("../services/careerApplicationService");
            const application = await CareerApplicationService.FindByIdService(application_id);

            if (!application) {
                return Response.notFoundResponse(
                    res,
                    "Career application not found"
                );
            }

            const updateData = {
                status: parseInt(status),
                reviewed_by: adminId,
                reviewed_at: new Date(),
            };

            if (notes) {
                updateData.notes = notes;
            }

            const updatedApplication = await CareerApplicationService.FindByIdAndUpdateService(
                application_id,
                updateData
            );

            // Send email notification to applicant
            try {
                const emailService = require("../helpers/emailService");
                const statusMessages = {
                    0: { en: "Pending", ar: "قيد الانتظار" },
                    1: { en: "Under Review", ar: "قيد المراجعة" },
                    2: { en: "Accepted", ar: "مقبول" },
                    3: { en: "Rejected", ar: "مرفوض" },
                };

                const statusMessage = statusMessages[status] || statusMessages[0];
                const emailHtml = emailService.renderCareerApplicationStatusUpdate(
                    `${application.first_name} ${application.last_name}`,
                    application.position,
                    statusMessage[lang] || statusMessage.en,
                    notes,
                    lang
                );
                const subject = lang === "ar"
                    ? `تحديث حالة طلب التوظيف - ${statusMessage.ar}`
                    : `Application Status Update - ${statusMessage.en}`;

                await emailService.send(application.email, subject, emailHtml);
            } catch (emailError) {
                console.error("[ADMIN:CAREER] Error sending status update email:", emailError);
            }

            return Response.ok(
                res,
                updatedApplication,
                200,
                "Career application status updated successfully"
            );
        } catch (error) {
            console.error("[ADMIN:CAREER] Error updating application status:", error);
            return Response.serverErrorResponse(
                res,
                resp_messages(lang).internalServerError
            );
        }
    },

    /**
     * Get all guest bookings with invoices
     * GET /admin/bookings/invoices
     */
    /**
     * Get invoice statistics and analytics
     */
    getInvoiceStats: async (req, res) => {
        try {
            const lang = req.lang || req.headers["lang"] || "en";

            // Total invoices count by status
            const totalInvoices = await BookEventService.CountDocumentService({ payment_status: 1, invoice_id: { $exists: true, $ne: null } });
            const pendingInvoices = await BookEventService.CountDocumentService({ payment_status: 1, book_status: 1, invoice_id: { $exists: true, $ne: null } });
            const confirmedInvoices = await BookEventService.CountDocumentService({ payment_status: 1, book_status: 2, invoice_id: { $exists: true, $ne: null } });
            const completedInvoices = await BookEventService.CountDocumentService({ payment_status: 1, book_status: 5, invoice_id: { $exists: true, $ne: null } });
            const cancelledInvoices = await BookEventService.CountDocumentService({ payment_status: 1, book_status: { $in: [3, 6] }, invoice_id: { $exists: true, $ne: null } });

            // Total amount statistics
            const amountStats = await BookEventService.AggregateService([
                { $match: { payment_status: 1, invoice_id: { $exists: true, $ne: null } } },
                {
                    $group: {
                        _id: null,
                        total_amount: { $sum: "$total_amount" },
                        avg_amount: { $avg: "$total_amount" },
                        max_amount: { $max: "$total_amount" },
                        min_amount: { $min: "$total_amount" },
                    },
                },
            ]);

            // Monthly trends (last 6 months)
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

            const monthlyTrends = await BookEventService.AggregateService([
                {
                    $match: {
                        payment_status: 1,
                        invoice_id: { $exists: true, $ne: null },
                        createdAt: { $gte: sixMonthsAgo },
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                        },
                        total_invoices: { $sum: 1 },
                        total_amount: { $sum: "$total_amount" },
                        avg_amount: { $avg: "$total_amount" },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
            ]);

            // Top events by invoice count
            const topEvents = await BookEventService.AggregateService([
                {
                    $match: {
                        payment_status: 1,
                        invoice_id: { $exists: true, $ne: null },
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
                { $unwind: "$event" },
                {
                    $group: {
                        _id: "$event_id",
                        event_name: { $first: "$event.event_name" },
                        event_image: { $first: "$event.event_main_image" },
                        total_invoices: { $sum: 1 },
                        total_amount: { $sum: "$total_amount" },
                    },
                },
                { $sort: { total_amount: -1 } },
                { $limit: 5 },
            ]);

            // Payment method distribution (if available)
            const paymentMethodStats = await BookEventService.AggregateService([
                {
                    $match: {
                        payment_status: 1,
                        invoice_id: { $exists: true, $ne: null },
                    },
                },
                {
                    $group: {
                        _id: "$payment_method",
                        count: { $sum: 1 },
                        total_amount: { $sum: "$total_amount" },
                    },
                },
            ]);

            // Recent invoices (last 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const recentInvoicesCount = await BookEventService.CountDocumentService({
                payment_status: 1,
                invoice_id: { $exists: true, $ne: null },
                createdAt: { $gte: sevenDaysAgo },
            });

            const stats = {
                total_invoices: totalInvoices,
                pending_invoices: pendingInvoices,
                confirmed_invoices: confirmedInvoices,
                completed_invoices: completedInvoices,
                cancelled_invoices: cancelledInvoices,
                recent_invoices: recentInvoicesCount,
                total_amount: amountStats[0]?.total_amount || 0,
                avg_amount: amountStats[0]?.avg_amount || 0,
                max_amount: amountStats[0]?.max_amount || 0,
                min_amount: amountStats[0]?.min_amount || 0,
                monthly_trends: monthlyTrends,
                top_events: topEvents,
                payment_method_stats: paymentMethodStats,
            };

            return Response.ok(res, stats, 200, resp_messages(lang).success);
        } catch (error) {
            console.error("Error fetching invoice stats:", error);
            return Response.serverErrorResponse(res, error.message || "Internal server error", {}, 500);
        }
    },

    getAllBookingsWithInvoices: async (req, res) => {
        try {
            const lang = req.lang || req.headers["lang"] || "en";
            const { page = 1, limit = 10, search = "", payment_status, book_status, from_date, to_date } = req.query;
            const skip = (parseInt(page) - 1) * parseInt(limit);

            // Build match query
            const matchQuery = {};

            // Filter by payment status (only show paid bookings with invoices)
            if (payment_status !== undefined) {
                matchQuery.payment_status = parseInt(payment_status);
            } else {
                // Default: show only paid bookings
                matchQuery.payment_status = 1;
            }

            // Filter by book status
            if (book_status !== undefined && book_status !== "") {
                matchQuery.book_status = parseInt(book_status);
            }

            // Date range filter
            if (from_date || to_date) {
                matchQuery.createdAt = {};
                if (from_date) {
                    matchQuery.createdAt.$gte = new Date(from_date);
                }
                if (to_date) {
                    const endDate = new Date(to_date);
                    endDate.setHours(23, 59, 59, 999); // End of day
                    matchQuery.createdAt.$lte = endDate;
                }
            }

            // Search by event name, user name, or invoice ID
            if (search && search.trim() !== "") {
                matchQuery.$or = [
                    { invoice_id: { $regex: search, $options: "i" } },
                    { order_id: { $regex: search, $options: "i" } },
                ];
            }

            // Aggregate to get bookings with related data
            const bookings = await BookEventService.AggregateService([
                { $match: matchQuery },
                {
                    $lookup: {
                        from: "events",
                        localField: "event_id",
                        foreignField: "_id",
                        as: "event",
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
                    $lookup: {
                        from: "organizers",
                        localField: "organizer_id",
                        foreignField: "_id",
                        as: "organizer",
                    },
                },
                { $unwind: "$event" },
                { $unwind: "$user" },
                { $unwind: { path: "$organizer", preserveNullAndEmptyArrays: true } },
                // Add search filter for event name and user name
                ...(search && search.trim() !== "" ? [{
                    $match: {
                        $or: [
                            { "event.event_name": { $regex: search, $options: "i" } },
                            { "user.first_name": { $regex: search, $options: "i" } },
                            { "user.last_name": { $regex: search, $options: "i" } },
                            { "user.email": { $regex: search, $options: "i" } },
                            { invoice_id: { $regex: search, $options: "i" } },
                            { order_id: { $regex: search, $options: "i" } },
                        ],
                    },
                }] : []),
                {
                    $project: {
                        _id: 1,
                        order_id: 1,
                        invoice_id: 1,
                        invoice_url: 1,
                        payment_status: 1,
                        book_status: 1,
                        total_amount: 1,
                        no_of_attendees: 1,
                        payment_id: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        event: {
                            _id: "$event._id",
                            event_name: "$event.event_name",
                            event_date: "$event.event_date",
                            event_price: "$event.event_price",
                        },
                        user: {
                            _id: "$user._id",
                            first_name: "$user.first_name",
                            last_name: "$user.last_name",
                            email: "$user.email",
                            phone_number: "$user.phone_number",
                            profile_image: "$user.profile_image",
                        },
                        organizer: {
                            _id: "$organizer._id",
                            first_name: "$organizer.first_name",
                            last_name: "$organizer.last_name",
                            group_name: "$organizer.group_name",
                        },
                    },
                },
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: parseInt(limit) },
            ]);

            // Get total count
            const countPipeline = [
                { $match: matchQuery },
                {
                    $lookup: {
                        from: "events",
                        localField: "event_id",
                        foreignField: "_id",
                        as: "event",
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
                { $unwind: "$event" },
                { $unwind: "$user" },
                ...(search && search.trim() !== "" ? [{
                    $match: {
                        $or: [
                            { "event.event_name": { $regex: search, $options: "i" } },
                            { "user.first_name": { $regex: search, $options: "i" } },
                            { "user.last_name": { $regex: search, $options: "i" } },
                            { "user.email": { $regex: search, $options: "i" } },
                            { invoice_id: { $regex: search, $options: "i" } },
                            { order_id: { $regex: search, $options: "i" } },
                        ],
                    },
                }] : []),
                { $count: "total" },
            ];

            const countResult = await BookEventService.AggregateService(countPipeline);
            const totalCount = countResult.length > 0 ? countResult[0].total : 0;

            return Response.ok(
                res,
                bookings,
                200,
                resp_messages(lang).fetched_data,
                totalCount
            );
        } catch (error) {
            console.error("[ADMIN:INVOICES] Error fetching bookings with invoices:", error);
            return Response.serverErrorResponse(
                res,
                resp_messages(req.lang || "en").internalServerError
            );
        }
    },

    /**
     * Cleanup duplicate bookings - Remove duplicate booking events
     * POST /admin/cleanup/duplicate-bookings
     */
    cleanupDuplicateBookings: async (req, res) => {
        try {
            const lang = req.lang || req.headers["lang"] || "en";
            const BookEvent = require("../models/eventBookModel");

            console.log("[ADMIN:CLEANUP] Starting duplicate booking cleanup...");

            // Find all bookings grouped by user_id + event_id + time window (within 5 seconds)
            const duplicateGroups = await BookEvent.aggregate([
                {
                    $group: {
                        _id: {
                            user_id: "$user_id",
                            event_id: "$event_id",
                            timeWindow: {
                                $subtract: [
                                    { $toLong: "$createdAt" },
                                    { $mod: [{ $toLong: "$createdAt" }, 5000] } // 5 second window
                                ]
                            }
                        },
                        bookings: {
                            $push: {
                                _id: "$_id",
                                createdAt: "$createdAt",
                                book_status: "$book_status",
                                payment_status: "$payment_status"
                            }
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $match: {
                        count: { $gt: 1 } // Only groups with more than 1 booking
                    }
                }
            ]);

            console.log(`[ADMIN:CLEANUP] Found ${duplicateGroups.length} groups with duplicates`);

            let totalDeleted = 0;
            const deletedIds = [];
            const errors = [];

            for (const group of duplicateGroups) {
                try {
                    // Sort by createdAt (oldest first) and keep the first one
                    const sortedBookings = group.bookings.sort((a, b) => 
                        new Date(a.createdAt) - new Date(b.createdAt)
                    );

                    const keepBooking = sortedBookings[0]; // Keep the oldest
                    const duplicatesToDelete = sortedBookings.slice(1); // Delete the rest

                    // Delete duplicate bookings
                    for (const duplicate of duplicatesToDelete) {
                        try {
                            const result = await BookEvent.findByIdAndDelete(duplicate._id);
                            if (result) {
                                deletedIds.push(duplicate._id.toString());
                                totalDeleted++;
                                console.log(`[ADMIN:CLEANUP] Deleted duplicate booking: ${duplicate._id}`);
                            }
                        } catch (deleteError) {
                            console.error(`[ADMIN:CLEANUP] Error deleting booking ${duplicate._id}:`, deleteError.message);
                            errors.push(`Failed to delete booking ${duplicate._id}: ${deleteError.message}`);
                        }
                    }
                } catch (groupError) {
                    console.error(`[ADMIN:CLEANUP] Error processing group:`, groupError.message);
                    errors.push(`Error processing group: ${groupError.message}`);
                }
            }

            console.log(`[ADMIN:CLEANUP] Cleanup completed. Deleted ${totalDeleted} duplicate bookings`);

            return Response.ok(
                res,
                {
                    deletedCount: totalDeleted,
                    deletedIds: deletedIds,
                    duplicateGroupsFound: duplicateGroups.length,
                    errors: errors.length > 0 ? errors : undefined
                },
                200,
                `Cleanup completed. Deleted ${totalDeleted} duplicate booking(s).`,
                0
            );
        } catch (error) {
            console.error("[ADMIN:CLEANUP] Error:", error);
            return Response.serverErrorResponse(
                res,
                resp_messages(req.lang).internalServerError || "Error during cleanup"
            );
        }
    },
};

module.exports = adminController;