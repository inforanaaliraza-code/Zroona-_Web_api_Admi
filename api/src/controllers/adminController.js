const { generateToken } = require("../helpers/generateToken.js");
const HashPassword = require("../helpers/hashPassword.js");
require("dotenv").config();
// OTP functionality removed - using email-based authentication only
const Response = require("../helpers/response.js");
const AdminService = require("../services/adminService.js");
const { PutObjectCommand, } = require('@aws-sdk/client-s3');
const mongoose = require('mongoose');
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


// const s3 = new S3Client({
//     region: process.env.AWS_REGION,
//     credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
//     }
// });



// const folderExists = async (folderName, bucketName) => {
//     try {
//         const headObjectCommand = new HeadObjectCommand({
//             Bucket: bucketName,
//             Key: folderName
//         });
//         await s3.send(headObjectCommand);
//         return true;
//     } catch (error) {
//         if (error.name === 'NotFound') {
//             return false;
//         }
//         throw error;
//     }
// };

// const createFolder = async (folderName, bucketName) => {
//     const uploadParams = {
//         Bucket: bucketName,
//         Key: `${folderName}/`,
//         Body: ''
//     };
//     const uploadCommand = new PutObjectCommand(uploadParams);
//     await s3.send(uploadCommand);
// };


const adminController = {
    adminRegister: async (req, res) => {
        try {
            const { lang } = req.headers;
            const { email } = req.body;

            const existingUser = await AdminService.FindOneService({ email });

            if (existingUser) {
                return Response.conflictResponse(res, {}, 409, `The admin already exists`)
            };

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
            const user = await AdminService.FindOneService({ _id: userId });
            if (!user) {
                return Response.badRequestResponse(res, resp_messages(req.lang).user_not_found);
            }
            return Response.ok(res, user, resp_messages(req.lang).profile_access);
        } catch (error) {
            return Response.serverErrorResponse(res, resp_messages(req.lang).internalServerError);
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
            const { page = 1, limit = 10, search = '' } = req.query;
            const pageInt = parseInt(page);
            const limitInt = parseInt(limit);
            const skip = (pageInt - 1) * limitInt;

            const searchQuery = search ? {
                $or: [
                    { first_name: { $regex: search, $options: 'i' } },
                    { last_name: { $regex: search, $options: 'i' } }
                ]
            } : {};

            const totalCount = await UserService.CountDocumentService(searchQuery);

            const user_data = await UserService.AggregateService([
                { $match: searchQuery },
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: limitInt }
            ]);

            user_data.forEach((user, i) => {
                user.id = `JN_UM_${String(i + 1).padStart(3, '0')}`
            })

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

                    {
                        $or: [
                            { first_name: { $regex: search, $options: 'i' } },
                            { last_name: { $regex: search, $options: 'i' } }
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
        const { id, isActive } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return Response.badRequestResponse(res, resp_messages(lang).id_required);
        }

        const organizer = await organizerService.FindOneService({ _id: id });

        if (!organizer) {
            return Response.notFoundResponse(res, resp_messages(lang).user_not_found);
        }

        organizer.isActive = isActive ? 1 : 2; // Assuming 1 is active, 2 is inactive based on previous code

        await organizer.save();

        return Response.ok(res, { isActive: organizer.isActive }, 200, resp_messages(lang).update_success);
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
                { $unwind: "$organizer" },
                {
                    $project: {
                        organizer_id: 1,
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
                return Response.badRequestResponse(res, resp_messages(lang).id_required)
            }

            const category = await GroupCategoriesService.FindOneService({ _id: id });
            if (!category) {
                return Response.notFoundResponse(res, resp_messages(lang).user_not_found);
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
                return Response.badRequestResponse(res, resp_messages(lang).id_required)
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
                return Response.badRequestResponse(res, resp_messages(lang).id_required)
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
                return Response.badRequestResponse(res, resp_messages(lang).id_required)
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
                return Response.badRequestResponse(res, resp_messages(lang).id_required)
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
                return Response.badRequestResponse(res, resp_messages(lang).id_required)
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

            const { page = 1, limit = 10 } = req.query;
            const skip = (Number(page) - 1) * Number(limit);

            const transactions = await TransactionService.AggregateService([
                {
                    $match: { type: 2 }
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
                    $unwind: { path: "$organizer", preserveNullAndEmptyArrays: true },
                },
                {
                    $project: {
                        amount: 1,
                        currency: 1,
                        type: 1,
                        status: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        organizer: {
                            first_name: 1,
                            last_name: 1,
                            email: 1,
                            phone_number: 1,
                            profile_image: 1,
                            country_code: 1,
                        }
                    }
                },
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: Number(limit) }
            ]);

            const count = await TransactionService.CountDocumentService({ type: 2 })
            return Response.ok(res, transactions, 200, resp_messages(req.lang).fetched_data, count);
        } catch (error) {
            console.error(error.message);
            return Response.serverErrorResponse(res, resp_messages(req.lang).internalServerError);
        }
    },
    withdrawalStatusUpdate: async (req, res) => {
        try {
            const { id, status } = req.body;


            if (status == 1) {
                // Approved - money is withdrawn, wallet already set to 0 when request was made
                const transaction = await TransactionService.FindOneService({ _id: id });

                if (!transaction) {
                    return Response.notFoundResponse(res, resp_messages(req.lang).data_not_found)
                }

                if (transaction.status == 1 || transaction.status == 2) {
                    return Response.badRequestResponse(res, resp_messages(req.lang).request_already_processed)
                }
                transaction.status = 1

                await transaction.save();

                return Response.ok(res, {}, 200, resp_messages(req.lang).update_success)
            } else if (status == 2) {
                // Rejected - restore wallet balance
                const transaction = await TransactionService.FindOneService({ _id: id });
                if (transaction.status == 2 || transaction.status == 1) {
                    return Response.badRequestResponse(res, resp_messages(req.lang).request_already_processed)
                }
                transaction.status = 2
                await transaction.save();

                const amount = transaction.amount
                const organizer_id = transaction.organizer_id;

                const wallet = await WalletService.FindOneService({ organizer_id: organizer_id });
                // Restore the amount back to wallet
                wallet.total_amount = wallet.total_amount + amount;

                await wallet.save();
                return Response.ok(res, {}, 200, resp_messages(req.lang).update_success)
            }

        } catch (error) {
            return Response.serverErrorResponse(res, resp_messages(req.lang).internalServerError)

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
                        
                        // Event approved
                        await sendEventApprovalEmail(organizer.email, organizerName, event.event_name, organizerLang);
                    } else if (oldStatus === 0 && newStatus === 2 && rejectionReason) {
                        // Event rejected
                        await sendEventRejectionEmail(organizer.email, organizerName, event.event_name, rejectionReason, organizerLang);
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
                profile_image: admin.image || '/assets/images/home/Profile.png',
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
            
            // Check if admin with same email or mobile exists
            const existingAdmin = await AdminService.FindOneService({
                $or: [
                    { email: email },
                    { mobileNumber: mobile_number }
                ]
            });
            
            if (existingAdmin) {
                return Response.conflictResponse(res, {}, 409, "Admin with this email or mobile number already exists");
            }
            
            // Split admin_name into firstName and lastName
            const nameParts = admin_name.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            const adminData = {
                firstName,
                lastName,
                mobileNumber: mobile_number,
                email: email || `${username}@zarouna.com`,
                password: password,
                image: profile_image,
                role: 3,
                is_verified: true
            };
            
            const admin = await AdminService.CreateService(adminData);
            
            return Response.ok(res, admin, 201, "Admin created successfully");
        } catch (error) {
            console.error(error);
            return Response.serverErrorResponse(res, resp_messages(lang).internalServerError);
        }
    },
    
    adminUpdate: async (req, res) => {
        const { lang } = req || 'en';
        try {
            const { id } = req.body;
            const { admin_name, username, mobile_number, email, profile_image } = req.body;
            
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return Response.badRequestResponse(res, resp_messages(lang).id_required);
            }
            
            const admin = await AdminService.FindOneService({ _id: id });
            if (!admin) {
                return Response.notFoundResponse(res, resp_messages(lang).user_not_found);
            }
            
            // Split admin_name into firstName and lastName
            if (admin_name) {
                const nameParts = admin_name.split(' ');
                admin.firstName = nameParts[0] || admin.firstName;
                admin.lastName = nameParts.slice(1).join(' ') || admin.lastName;
            }
            
            if (mobile_number) admin.mobileNumber = mobile_number;
            if (email) admin.email = email;
            if (profile_image) admin.image = profile_image;
            
            await admin.save();
            
            return Response.ok(res, admin, 200, "Admin updated successfully");
        } catch (error) {
            console.error(error);
            return Response.serverErrorResponse(res, resp_messages(lang).internalServerError);
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
            const userId = req.userId || req.user?.id;
            
            if (!userId) {
                return Response.unauthorizedResponse(res, resp_messages(lang).unauthorized || "Unauthorized");
            }
            
            // Get notifications for this specific admin user (role = 3)
            const notifications = await NotificationService.AggregateService([
                {
                    $match: { 
                        user_id: new mongoose.Types.ObjectId(userId),
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
                user_id: new mongoose.Types.ObjectId(userId),
                role: 3
            });
            
            return Response.ok(res, notifications, 200, resp_messages(lang).fetched_data || "Notifications fetched successfully", totalCount);
        } catch (error) {
            console.error('[ADMIN-NOTIFICATIONS] Error:', error);
            return Response.serverErrorResponse(res, resp_messages(lang).internalServerError);
        }
    }

}

module.exports = adminController;