const crypto = require("crypto");
const { sendEmail: sendEmailViaMailJS } = require("./mailJSService");

/**
 * Email Service for Zuroona Platform
 * Handles all email sending operations including verification emails
 * Uses MailJS (jsmail) API for email delivery
 */
class EmailService {
    constructor() {
        // MailJS credentials check
        const publicKey = process.env.MAILJS_PUBLIC_KEY || 'OSfCgupc61 dwFtXNI';
        const privateKey = process.env.MAILJS_PRIVATE_KEY || 'fj4w33dz06Qafqvr4	6ZrK';
        
        if (publicKey && privateKey) {
            console.log("✅ MailJS credentials loaded successfully");
            console.log(`🔑 Public Key: ${publicKey.substring(0, 10)}...`);
            console.log(`🔐 Private Key: ${privateKey.substring(0, 10)}...`);
        } else {
            console.warn("⚠️  MailJS credentials not configured. Please set MAILJS_PUBLIC_KEY and MAILJS_PRIVATE_KEY in environment variables.");
        }
    }

    /**
     * Generate a random verification token
     * @param {number} length - Token length (default: 48)
     * @returns {string} - Random token
     */
    generateVerificationToken(length = 48) {
        return crypto.randomBytes(Math.ceil(length / 2)).toString("hex").slice(0, length);
    }

    /**
     * Generate email verification link
     * @param {string} token - Verification token
     * @param {string} role - User role (1 for guest, 2 for organizer)
     * @param {string} language - Language preference
     * @returns {string} - Verification URL
     */
    generateVerificationLink(token, role = 1, language = "en") {
        const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        const roleType = role === 2 ? "host" : "guest";
        return `${baseUrl}/auth/verify-email?token=${encodeURIComponent(token)}&role=${roleType}&lang=${language}`;
    }

    /**
     * Render guest verification email HTML
     * @param {string} name - User's name
     * @param {string} link - Verification link
     * @param {string} language - Language preference
     * @returns {string} - HTML email content
     */
    renderGuestVerificationEmail(name, link, language = "en") {
        const isArabic = language === "ar";

        if (isArabic) {
            return `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
                    <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0; font-size: 28px;">مرحباً بك في Zuroona</h1>
                    </div>
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #333; margin-top: 0;">مرحباً ${name}!</h2>
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            شكراً لك على التسجيل في منصة Zuroona. لإكمال تفعيل حسابك، يرجى النقر على الزر أدناه:
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${link}" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                تفعيل الحساب
                            </a>
                        </div>
                        <p style="color: #999; font-size: 14px;">
                            إذا لم تتمكن من النقر على الزر، انسخ والصق الرابط التالي في متصفحك:<br>
                            <a href="${link}" style="color: #3b82f6; word-break: break-all;">${link}</a>
                        </p>
                        <p style="color: #999; font-size: 12px; margin-top: 30px;">
                            هذا الرابط صالح لمدة 24 ساعة فقط لأسباب أمنية.
                        </p>
                        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            إذا لم تقم بإنشاء هذا الحساب، يرجى تجاهل هذا البريد الإلكتروني.
                        </p>
                    </div>
                </div>
            `;
        } else {
            return `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0; font-size: 28px;">Welcome to Zuroona</h1>
                    </div>
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #333; margin-top: 0;">Hello ${name}!</h2>
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            Thank you for registering with Zuroona platform. To complete your account activation, please click the button below:
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${link}" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                Verify Email Address
                            </a>
                        </div>
                        <p style="color: #999; font-size: 14px;">
                            If you can't click the button, copy and paste the following link into your browser:<br>
                            <a href="${link}" style="color: #3b82f6; word-break: break-all;">${link}</a>
                        </p>
                        <p style="color: #999; font-size: 12px; margin-top: 30px;">
                            This verification link will expire in 24 hours for security reasons.
                        </p>
                        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            If you didn't create this account, please ignore this email.
                        </p>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Render host/organizer verification email HTML
     * @param {string} name - User's name
     * @param {string} link - Verification link
     * @param {string} language - Language preference
     * @returns {string} - HTML email content
     */
    renderHostVerificationEmail(name, link, language = "en") {
        const isArabic = language === "ar";

        if (isArabic) {
            return `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
                    <div style="background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0; font-size: 28px;">مرحباً بك كمضيف في Zuroona</h1>
                    </div>
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #333; margin-top: 0;">مرحباً ${name}!</h2>
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            شكراً لك على تقديم طلبك لتصبح مضيفاً على منصة Zuroona. لإكمال التسجيل، يرجى تأكيد بريدك الإلكتروني:
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${link}" style="background: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                تأكيد البريد الإلكتروني
                            </a>
                        </div>
                        <div style="background: #fff3cd; border-right: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0; color: #856404; font-size: 14px;">
                                <strong>⚠️ ملاحظة هامة:</strong> بعد تأكيد بريدك الإلكتروني، سيتم مراجعة حسابك من قبل فريقنا. سنقوم بإعلامك عبر البريد الإلكتروني بمجرد الموافقة على حسابك.
                            </p>
                        </div>
                        <p style="color: #999; font-size: 14px;">
                            إذا لم تتمكن من النقر على الزر، انسخ والصق الرابط التالي في متصفحك:<br>
                            <a href="${link}" style="color: #f97316; word-break: break-all;">${link}</a>
                        </p>
                        <p style="color: #999; font-size: 12px; margin-top: 30px;">
                            هذا الرابط صالح لمدة 24 ساعة فقط لأسباب أمنية.
                        </p>
                        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            إذا لم تقم بإنشاء هذا الحساب، يرجى تجاهل هذا البريد الإلكتروني.
                        </p>
                    </div>
                </div>
            `;
        } else {
            return `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0; font-size: 28px;">Welcome as a Host on Zuroona</h1>
                    </div>
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #333; margin-top: 0;">Hello ${name}!</h2>
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            Thank you for applying to become a host on Zuroona platform. To complete your registration, please verify your email address:
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${link}" style="background: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                Verify Email Address
                            </a>
                        </div>
                        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0; color: #856404; font-size: 14px;">
                                <strong>⚠️ Important Note:</strong> After verifying your email, your account will be reviewed by our team. We will notify you via email once your account is approved.
                            </p>
                        </div>
                        <p style="color: #999; font-size: 14px;">
                            If you can't click the button, copy and paste the following link into your browser:<br>
                            <a href="${link}" style="color: #f97316; word-break: break-all;">${link}</a>
                        </p>
                        <p style="color: #999; font-size: 12px; margin-top: 30px;">
                            This verification link will expire in 24 hours for security reasons.
                        </p>
                        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            If you didn't create this account, please ignore this email.
                        </p>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Render host approval email HTML
     * @param {string} name - User's name
     * @param {string} language - Language preference
     * @returns {string} - HTML email content
     */
    renderHostApprovalEmail(name, language = "en") {
        const isArabic = language === "ar";
        const loginUrl = process.env.FRONTEND_URL || "http://localhost:3000";

        if (isArabic) {
            return `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
                    <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0; font-size: 28px;">✅ تم الموافقة على حسابك!</h1>
                    </div>
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #333; margin-top: 0;">مبروك ${name}!</h2>
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            يسعدنا إبلاغك بأنه تمت الموافقة على حسابك كمضيف على منصة Zuroona. يمكنك الآن تسجيل الدخول وبدء إنشاء الفعاليات!
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${loginUrl}/login" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                تسجيل الدخول الآن
                            </a>
                        </div>
                        <p style="color: #666; font-size: 14px;">
                            ابدأ الآن في:
                        </p>
                        <ul style="color: #666; font-size: 14px; line-height: 1.8;">
                            <li>إنشاء فعاليات مميزة</li>
                            <li>إدارة الحجوزات</li>
                            <li>كسب الأرباح</li>
                            <li>بناء مجتمعك الخاص</li>
                        </ul>
                        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            نتطلع إلى رؤية فعالياتك الرائعة على المنصة!
                        </p>
                    </div>
                </div>
            `;
        } else {
            return `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0; font-size: 28px;">✅ Your Account is Approved!</h1>
                    </div>
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #333; margin-top: 0;">Congratulations ${name}!</h2>
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            We're excited to inform you that your host account on Zuroona platform has been approved. You can now login and start creating events!
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${loginUrl}/login" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                Login Now
                            </a>
                        </div>
                        <p style="color: #666; font-size: 14px;">
                            You can now:
                        </p>
                        <ul style="color: #666; font-size: 14px; line-height: 1.8;">
                            <li>Create amazing events</li>
                            <li>Manage bookings</li>
                            <li>Earn money</li>
                            <li>Build your community</li>
                        </ul>
                        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            We look forward to seeing your amazing events on the platform!
                        </p>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Render host rejection email HTML
     * @param {string} name - User's name
     * @param {string} reason - Rejection reason
     * @param {string} language - Language preference
     * @returns {string} - HTML email content
     */
    renderHostRejectionEmail(name, reason, language = "en") {
        const isArabic = language === "ar";

        if (isArabic) {
            return `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
                    <div style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0; font-size: 28px;">تحديث بشأن طلبك</h1>
                    </div>
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #333; margin-top: 0;">مرحباً ${name},</h2>
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            شكراً لاهتمامك بأن تصبح مضيفاً على منصة Zuroona. بعد مراجعة طلبك، نأسف لإبلاغك بأننا غير قادرين على الموافقة على حسابك في الوقت الحالي.
                        </p>
                        <div style="background: #fee2e2; border-right: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0; color: #991b1b; font-size: 14px;">
                                <strong>السبب:</strong> ${reason}
                            </p>
                        </div>
                        <p style="color: #666; font-size: 14px;">
                            يمكنك التقديم مرة أخرى في المستقبل بعد معالجة المشكلات المذكورة أعلاه.
                        </p>
                        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            إذا كان لديك أي أسئلة، يرجى التواصل مع فريق الدعم.
                        </p>
                    </div>
                </div>
            `;
        } else {
            return `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0; font-size: 28px;">Update on Your Application</h1>
                    </div>
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #333; margin-top: 0;">Hello ${name},</h2>
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            Thank you for your interest in becoming a host on Zuroona platform. After reviewing your application, we regret to inform you that we are unable to approve your account at this time.
                        </p>
                        <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0; color: #991b1b; font-size: 14px;">
                                <strong>Reason:</strong> ${reason}
                            </p>
                        </div>
                        <p style="color: #666; font-size: 14px;">
                            You may apply again in the future after addressing the issues mentioned above.
                        </p>
                        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            If you have any questions, please contact our support team.
                        </p>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Generate password reset link
     * @param {string} token - Reset token
     * @param {string} role - User role (1 for guest, 2 for organizer, 3 for admin)
     * @param {string} language - Language preference
     * @returns {string} - Reset URL
     */
    generatePasswordResetLink(token, role = 1, language = "en") {
        const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        const roleType = role === 2 ? "host" : role === 3 ? "admin" : "guest";
        return `${baseUrl}/auth/reset-password?token=${encodeURIComponent(token)}&role=${roleType}&lang=${language}`;
    }

    /**
     * Render password reset email HTML
     * @param {string} name - User's name
     * @param {string} link - Reset link
     * @param {string} language - Language preference
     * @returns {string} - HTML email content
     */
    renderPasswordResetEmail(name, link, language = "en") {
        const isArabic = language === "ar";

        if (isArabic) {
            return `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
                    <div style="background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0; font-size: 28px;">إعادة تعيين كلمة المرور</h1>
                    </div>
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #333; margin-top: 0;">مرحباً ${name}!</h2>
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            لقد طلبت إعادة تعيين كلمة المرور لحسابك على منصة Zuroona. انقر على الزر أدناه لإعادة تعيين كلمة المرور:
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${link}" style="background: #6366f1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                إعادة تعيين كلمة المرور
                            </a>
                        </div>
                        <p style="color: #999; font-size: 14px;">
                            إذا لم تتمكن من النقر على الزر، انسخ والصق الرابط التالي في متصفحك:<br>
                            <a href="${link}" style="color: #6366f1; word-break: break-all;">${link}</a>
                        </p>
                        <div style="background: #fee2e2; border-right: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0; color: #991b1b; font-size: 14px;">
                                <strong>⚠️ ملاحظة أمنية:</strong> إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد الإلكتروني. هذا الرابط صالح لمدة ساعة واحدة فقط.
                            </p>
                        </div>
                        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            لأسباب أمنية، لا تشارك هذا الرابط مع أي شخص آخر.
                        </p>
                    </div>
                </div>
            `;
        } else {
            return `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0; font-size: 28px;">Password Reset Request</h1>
                    </div>
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #333; margin-top: 0;">Hello ${name}!</h2>
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            You have requested to reset your password for your Zuroona account. Click the button below to reset your password:
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${link}" style="background: #6366f1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                Reset Password
                            </a>
                        </div>
                        <p style="color: #999; font-size: 14px;">
                            If you can't click the button, copy and paste the following link into your browser:<br>
                            <a href="${link}" style="color: #6366f1; word-break: break-all;">${link}</a>
                        </p>
                        <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0; color: #991b1b; font-size: 14px;">
                                <strong>⚠️ Security Notice:</strong> If you didn't request a password reset, please ignore this email. This link will expire in 1 hour for security reasons.
                            </p>
                        </div>
                        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            For security reasons, do not share this link with anyone else.
                        </p>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Send email via MailJS API
     * @param {string} to - Recipient email
     * @param {string} subject - Email subject
     * @param {string} html - Email HTML content
     * @returns {Promise<boolean>} - Success status
     */
    async send(to, subject, html) {
        console.log(`[EMAIL] Attempting to send email to: ${to}`);
        console.log(`[EMAIL] Subject: ${subject}`);

        try {
            // Use configured MAIL_FROM or default
            const fromAddress = process.env.MAIL_FROM || 'Zuroona Platform <noreply@zuroona.com>';

            console.log("[EMAIL] Sending email via MailJS API");
            console.log("[EMAIL] From:", fromAddress);
            console.log("[EMAIL] To:", to);
            console.log("[EMAIL] Subject:", subject);

            // Send email via MailJS
            const result = await sendEmailViaMailJS(to, subject, html, fromAddress);

            if (result.success) {
                console.log("[EMAIL:SUCCESS] Email sent successfully via MailJS!");
                console.log("[EMAIL] Target:", to);
                console.log("[EMAIL] Response:", result.data);
                return true;
            } else {
                console.error("[EMAIL:ERROR] MailJS returned unsuccessful response");
                return false;
            }
        } catch (error) {
            console.error("[EMAIL:ERROR] Failed to send email via MailJS:", error);
            console.error("[EMAIL] To:", to);
            console.error("[EMAIL] Subject:", subject);
            console.error("[EMAIL] Error message:", error.message);
            
            // Don't fail completely - log error but return false
            return false;
        }
    }

    /**
     * Render event approval email HTML
     * @param {string} organizerEmail - Organizer's email
     * @param {string} organizerName - Organizer's name
     * @param {string} eventName - Event name
     * @param {string} language - Language preference
     * @returns {Promise<boolean>} - Success status
     */
    async sendEventApprovalEmail(organizerEmail, organizerName, eventName, language = "en") {
        const isArabic = language === "ar";
        const loginUrl = process.env.FRONTEND_URL || "http://localhost:3001";
        
        let html, subject;
        
        if (isArabic) {
            subject = "تمت الموافقة على فعاليتك - Zuroona";
            html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
                    <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0; font-size: 28px;">✅ تمت الموافقة على فعاليتك!</h1>
                    </div>
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #333; margin-top: 0;">مبروك ${organizerName}!</h2>
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            يسعدنا إبلاغك بأنه تمت الموافقة على فعاليتك "<strong>${eventName}</strong>" على منصة Zuroona. يمكن للمستخدمين الآن حجز تذاكر لحضور فعاليتك!
                        </p>
                        <div style="background: #d1fae5; border-right: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0; color: #065f46; font-size: 14px;">
                                <strong>✓ فعاليتك الآن مرئية للجميع</strong><br>
                                يمكنك الآن إدارة الحجوزات ومتابعة الأرباح من لوحة التحكم الخاصة بك.
                            </p>
                        </div>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${loginUrl}/joinUsEvent" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                عرض فعاليتي
                            </a>
                        </div>
                        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            شكراً لاستخدامك منصة Zuroona!
                        </p>
                    </div>
                </div>
            `;
        } else {
            subject = "Your Event Has Been Approved - Zuroona";
            html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0; font-size: 28px;">✅ Your Event Has Been Approved!</h1>
                    </div>
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #333; margin-top: 0;">Congratulations ${organizerName}!</h2>
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            We're excited to inform you that your event "<strong>${eventName}</strong>" has been approved on Zuroona platform. Users can now book tickets to attend your event!
                        </p>
                        <div style="background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0; color: #065f46; font-size: 14px;">
                                <strong>✓ Your event is now visible to everyone</strong><br>
                                You can now manage bookings and track earnings from your dashboard.
                            </p>
                        </div>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${loginUrl}/joinUsEvent" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                View My Event
                            </a>
                        </div>
                        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            Thank you for using Zuroona platform!
                        </p>
                    </div>
                </div>
            `;
        }
        
        return await this.send(organizerEmail, subject, html);
    }

    /**
     * Render event rejection email HTML
     * @param {string} organizerEmail - Organizer's email
     * @param {string} organizerName - Organizer's name
     * @param {string} eventName - Event name
     * @param {string} rejectionReason - Reason for rejection
     * @param {string} language - Language preference
     * @returns {Promise<boolean>} - Success status
     */
    async sendEventRejectionEmail(organizerEmail, organizerName, eventName, rejectionReason, language = "en") {
        const isArabic = language === "ar";
        const loginUrl = process.env.FRONTEND_URL || "http://localhost:3001";
        
        let html, subject;
        
        if (isArabic) {
            subject = "تحديث بشأن فعاليتك - Zuroona";
            html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
                    <div style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0; font-size: 28px;">تحديث بشأن فعاليتك</h1>
                    </div>
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #333; margin-top: 0;">مرحباً ${organizerName},</h2>
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            نأسف لإبلاغك بأنه تم رفض فعاليتك "<strong>${eventName}</strong>" على منصة Zuroona بعد مراجعة طلبك.
                        </p>
                        <div style="background: #fee2e2; border-right: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0; color: #991b1b; font-size: 14px;">
                                <strong>السبب:</strong><br>
                                ${rejectionReason || "لم يتم تحديد سبب محدد"}
                            </p>
                        </div>
                        <p style="color: #666; font-size: 14px;">
                            يمكنك إنشاء فعالية جديدة بعد معالجة المشكلات المذكورة أعلاه. نحن نشجعك على تقديم طلب جديد.
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${loginUrl}/joinUsEvent" style="background: #ef4444; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                إنشاء فعالية جديدة
                            </a>
                        </div>
                        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            إذا كان لديك أي أسئلة، يرجى التواصل مع فريق الدعم.
                        </p>
                    </div>
                </div>
            `;
        } else {
            subject = "Update on Your Event - Zuroona";
            html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0; font-size: 28px;">Update on Your Event</h1>
                    </div>
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #333; margin-top: 0;">Hello ${organizerName},</h2>
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            We regret to inform you that your event "<strong>${eventName}</strong>" has been rejected on Zuroona platform after reviewing your submission.
                        </p>
                        <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0; color: #991b1b; font-size: 14px;">
                                <strong>Reason:</strong><br>
                                ${rejectionReason || "No specific reason provided"}
                            </p>
                        </div>
                        <p style="color: #666; font-size: 14px;">
                            You can create a new event after addressing the issues mentioned above. We encourage you to submit a new application.
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${loginUrl}/joinUsEvent" style="background: #ef4444; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                Create New Event
                            </a>
                        </div>
                        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            If you have any questions, please contact our support team.
                        </p>
                    </div>
                </div>
            `;
        }
        
        return await this.send(organizerEmail, subject, html);
    }
}

// Export singleton instance
const emailService = new EmailService();

// Export helper functions for direct use
module.exports = emailService;
module.exports.sendEventApprovalEmail = async (organizerEmail, organizerName, eventName, language = "en") => {
    return await emailService.sendEventApprovalEmail(organizerEmail, organizerName, eventName, language);
};

module.exports.sendEventRejectionEmail = async (organizerEmail, organizerName, eventName, rejectionReason, language = "en") => {
    return await emailService.sendEventRejectionEmail(organizerEmail, organizerName, eventName, rejectionReason, language);
};

module.exports.sendOrganizerApprovalEmail = async (organizerEmail, organizerName, language = "en") => {
    const html = emailService.renderHostApprovalEmail(organizerName, language);
    const subject = language === "ar" ? "تم الموافقة على حسابك - Zuroona" : "Your account has been approved - Zuroona";
    return await emailService.send(organizerEmail, subject, html);
};

module.exports.sendOrganizerRejectionEmail = async (organizerEmail, organizerName, rejectionReason, language = "en") => {
    const html = emailService.renderHostRejectionEmail(organizerName, rejectionReason, language);
    const subject = language === "ar" ? "تحديث بشأن طلبك - Zuroona" : "Update on Your Application - Zuroona";
    return await emailService.send(organizerEmail, subject, html);
};
