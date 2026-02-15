const crypto = require("crypto");
// Try SMTP first, fallback to MailJS
let sendEmailService;
try {
    sendEmailService = require("./smtpService");
    console.log("✅ Using SMTP service for email sending");
} catch (error) {
    console.warn("⚠️  SMTP service not available, trying MailJS");
    try {
        sendEmailService = require("./mailJSService");
        console.log("✅ Using MailJS service for email sending");
    } catch (mailJSError) {
        console.error("❌ No email service available");
        sendEmailService = null;
    }
}

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
        // Use WEB_URL for web frontend, fallback to FRONTEND_URL, then localhost
        const baseUrl = process.env.WEB_URL || process.env.FRONTEND_URL || process.env.CLIENT_URL || "httpss://zuroona.sa";
        const cleanUrl = this._validateFrontendUrl(baseUrl);
        
        const roleType = role === 2 ? "host" : "guest";
        const verificationUrl = `${cleanUrl}/auth/verify-email?token=${encodeURIComponent(token)}&role=${roleType}&lang=${language}`;
        
        console.log(`[EMAIL] Generated verification URL: ${verificationUrl}`);
        return verificationUrl;
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
        const baseUrl = process.env.WEB_URL || process.env.FRONTEND_URL || process.env.CLIENT_URL || "httpss://zuroona.sa";
        const loginUrl = this._validateFrontendUrl(baseUrl);

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
     * Validate and clean frontend URL
     * @param {string} url - URL to validate
     * @returns {string} - Valid URL (defaults to httpss://zuroona.sa if invalid)
     */
    _validateFrontendUrl(url) {
        if (!url) return "httpss://zuroona.sa";
        
        let cleanUrl = url.trim().replace(/\/+$/, '');
        const invalidDomains = ['bedpage', 'yourdomain.com', 'yourdomain', 'example.com', 'example', 'localhost.com'];
        const hasInvalidDomain = invalidDomains.some(domain => cleanUrl.includes(domain));
        const has404 = cleanUrl.includes('404');
        
        if (hasInvalidDomain || has404 || (!cleanUrl.startsWith('https://') && !cleanUrl.startsWith('httpss://'))) {
            console.warn(`⚠️  Invalid WEB_URL detected: "${cleanUrl}", using default httpss://zuroona.sa`);
            return "httpss://zuroona.sa";
        }
        
        return cleanUrl;
    }

    /**
     * Generate password reset link
     * @param {string} token - Reset token
     * @param {string} role - User role (1 for guest, 2 for organizer, 3 for admin)
     * @param {string} language - Language preference
     * @returns {string} - Reset URL
     */
    generatePasswordResetLink(token, role = 1, language = "en") {
        const baseUrl = process.env.WEB_URL || process.env.FRONTEND_URL || process.env.CLIENT_URL || "httpss://zuroona.sa";
        const cleanUrl = this._validateFrontendUrl(baseUrl);
        const roleType = role === 2 ? "host" : role === 3 ? "admin" : "guest";
        return `${cleanUrl}/auth/reset-password?token=${encodeURIComponent(token)}&role=${roleType}&lang=${language}`;
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

        if (!sendEmailService) {
            console.error("[EMAIL:ERROR] No email service available");
            return false;
        }

        try {
            // Use configured MAIL_FROM or default
            const fromAddress = process.env.MAIL_FROM || 'Zuroona Platform <noreply@zuroona.com>';

            // Try SMTP first if available
            if (sendEmailService.sendEmail) {
                console.log("[EMAIL] Sending email via SMTP");
                console.log("[EMAIL] From:", fromAddress);
                console.log("[EMAIL] To:", to);
                console.log("[EMAIL] Subject:", subject);

                const result = await sendEmailService.sendEmail(to, subject, html, fromAddress);

                if (result.success) {
                    console.log("[EMAIL:SUCCESS] Email sent successfully via SMTP!");
                    console.log("[EMAIL] Target:", to);
                    console.log("[EMAIL] Message ID:", result.messageId);
                    return true;
                } else {
                    console.error("[EMAIL:ERROR] SMTP returned unsuccessful response");
                    return false;
                }
            } else {
                // Fallback to MailJS
                console.log("[EMAIL] Sending email via MailJS API");
                console.log("[EMAIL] From:", fromAddress);
                console.log("[EMAIL] To:", to);
                console.log("[EMAIL] Subject:", subject);

                const result = await sendEmailService.sendEmail(to, subject, html, fromAddress);

                if (result.success) {
                    console.log("[EMAIL:SUCCESS] Email sent successfully via MailJS!");
                    console.log("[EMAIL] Target:", to);
                    console.log("[EMAIL] Response:", result.data);
                    return true;
                } else {
                    console.error("[EMAIL:ERROR] MailJS returned unsuccessful response");
                    return false;
                }
            }
        } catch (error) {
            console.error("[EMAIL:ERROR] Failed to send email:", error);
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
        const loginUrl = process.env.ADMIN_URL || process.env.FRONTEND_URL || "httpss://admin.zuroona.sa";
        
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
        const loginUrl = process.env.ADMIN_URL || process.env.FRONTEND_URL || "httpss://admin.zuroona.sa";
        
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

    /**
     * Render career application confirmation email
     */
    renderCareerApplicationConfirmation(name, position, language = "en") {
        const isArabic = language === "ar";
        const baseUrl = process.env.WEB_URL || process.env.FRONTEND_URL || "httpss://zuroona.sa";
        const loginUrl = this._validateFrontendUrl(baseUrl);

        if (isArabic) {
            return `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
                    <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0; font-size: 28px;">شكراً لتقديم طلب التوظيف</h1>
                    </div>
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #333; margin-top: 0;">مرحباً ${name}!</h2>
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            شكراً لك على تقديم طلب التوظيف لموقع <strong>${position}</strong> في منصة Zuroona.
                        </p>
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                           我们已经收到您的申请，我们的团队将在近期审查您的申请并与您联系。
                        </p>
                        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            إذا كان لديك أي أسئلة، يرجى التواصل معنا.
                        </p>
                    </div>
                </div>
            `;
        } else {
            return `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0; font-size: 28px;">Thank You for Your Application</h1>
                    </div>
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #333; margin-top: 0;">Hello ${name}!</h2>
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            Thank you for applying for the <strong>${position}</strong> position at Zuroona.
                        </p>
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            We have received your application and our team will review it shortly. We will contact you soon.
                        </p>
                        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            If you have any questions, please feel free to contact us.
                        </p>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Render career application notification email (for admin)
     */
    renderCareerApplicationNotification(name, email, position, coverLetter, language = "en") {
        const isArabic = language === "ar";
        const adminUrl = process.env.ADMIN_URL || "httpss://admin.zuroona.sa";

        if (isArabic) {
            return `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
                    <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0; font-size: 28px;">طلب توظيف جديد</h1>
                    </div>
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #333; margin-top: 0;">طلب توظيف جديد</h2>
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            تم استلام طلب توظيف جديد:
                        </p>
                        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p><strong>الاسم:</strong> ${name}</p>
                            <p><strong>البريد الإلكتروني:</strong> ${email}</p>
                            <p><strong>المنصب:</strong> ${position}</p>
                            <p><strong>رسالة التقديم:</strong></p>
                            <p style="background: #f3f4f6; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${coverLetter}</p>
                        </div>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${adminUrl}/careers" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                عرض الطلبات
                            </a>
                        </div>
                    </div>
                </div>
            `;
        } else {
            return `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0; font-size: 28px;">New Job Application</h1>
                    </div>
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #333; margin-top: 0;">New Job Application Received</h2>
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            A new job application has been received:
                        </p>
                        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p><strong>Name:</strong> ${name}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Position:</strong> ${position}</p>
                            <p><strong>Cover Letter:</strong></p>
                            <p style="background: #f3f4f6; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${coverLetter}</p>
                        </div>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${adminUrl}/careers" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                View Applications
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    /**
     * A) Guest — Request Sent (A/B variants)
     * Variant A: Friendly
     */
    renderGuestRequestSentEmailA(data, language = "en") {
        const isArabic = language === "ar";
        const baseUrl = this._validateFrontendUrl(process.env.WEB_URL || process.env.FRONTEND_URL || "httpss://zuroona.sa");
        const bookingUrl = `${baseUrl}/bookings/${data.book_id || ''}`;

        if (isArabic) {
            return {
                subject: `تم إرسال طلبك لـ «${data.experience_title}» 🎟️`,
                preview: `بلغنا ${data.host_first_name}—بتوصلك الإجابة قريب.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
                        <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">تم إرسال طلبك 🎟️</h1>
                        </div>
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2 style="color: #333; margin-top: 0;">مرحباً ${data.guest_first_name}،</h2>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                تم إرسال طلب <strong>${data.tickets_count}</strong> تذكرة بتاريخ <strong>${data.start_at}</strong>.
                            </p>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                المضيف <strong>${data.host_first_name}</strong> تقييمه ⭐️ <strong>${data.rating_avg}</strong> (${data.rating_count})—اختيار موفّق.
                            </p>
                            <div style="background: #fff3cd; border-right: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                                <p style="margin: 0; color: #856404; font-size: 14px;">
                                    <strong>تنبيه:</strong> التأكيد بعد الدفع.
                                </p>
                            </div>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${bookingUrl}" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                    عرض الطلب
                                </a>
                            </div>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                subject: `Request sent for "${data.experience_title}" 🎟️`,
                preview: `We pinged ${data.host_first_name} — you'll get an answer soon.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">Request Sent 🎟️</h1>
                        </div>
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2 style="color: #333; margin-top: 0;">Hi ${data.guest_first_name},</h2>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                your request for <strong>${data.tickets_count}</strong> ticket(s) on <strong>${data.start_at}</strong> is in.
                            </p>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                Host <strong>${data.host_first_name}</strong> has a ⭐️ <strong>${data.rating_avg}</strong> (${data.rating_count}) — nice pick.
                            </p>
                            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                                <p style="margin: 0; color: #856404; font-size: 14px;">
                                    <strong>Heads-up:</strong> not confirmed until you pay.
                                </p>
                            </div>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${bookingUrl}" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                    View request
                                </a>
                            </div>
                        </div>
                    </div>
                `
            };
        }
    }

    /**
     * A) Guest — Request Sent (A/B variants)
     * Variant B: Urgency
     */
    renderGuestRequestSentEmailB(data, language = "en") {
        const isArabic = language === "ar";
        const baseUrl = this._validateFrontendUrl(process.env.WEB_URL || process.env.FRONTEND_URL || "httpss://zuroona.sa");
        const bookingUrl = `${baseUrl}/bookings/${data.book_id || ''}`;

        if (isArabic) {
            return {
                subject: `أنت في قائمة الانتظار لـ «${data.experience_title}» — ${data.tickets_count} تذكرة`,
                preview: `بنعلمك أول ما يرد المضيف.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
                        <div style="background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">أنت في قائمة الانتظار 🎟️</h1>
                        </div>
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2 style="color: #333; margin-top: 0;">مرحباً ${data.guest_first_name}،</h2>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                تم إرسال طلب <strong>${data.tickets_count}</strong> تذكرة بتاريخ <strong>${data.start_at}</strong>.
                            </p>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                المضيف <strong>${data.host_first_name}</strong> تقييمه ⭐️ <strong>${data.rating_avg}</strong> (${data.rating_count})—اختيار موفّق.
                            </p>
                            <div style="background: #fee2e2; border-right: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
                                <p style="margin: 0; color: #991b1b; font-size: 14px;">
                                    <strong>⚠️ هذا التاريخ مطلوب اليوم.</strong>
                                </p>
                            </div>
                            <div style="background: #fff3cd; border-right: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                                <p style="margin: 0; color: #856404; font-size: 14px;">
                                    <strong>تنبيه:</strong> التأكيد بعد الدفع.
                                </p>
                            </div>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${bookingUrl}" style="background: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                    عرض الطلب
                                </a>
                            </div>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                subject: `You're in line for "${data.experience_title}" — ${data.tickets_count} ticket(s)`,
                preview: `We'll let you know as soon as the host replies.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">You're in Line 🎟️</h1>
                        </div>
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2 style="color: #333; margin-top: 0;">Hi ${data.guest_first_name},</h2>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                your request for <strong>${data.tickets_count}</strong> ticket(s) on <strong>${data.start_at}</strong> is in.
                            </p>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                Host <strong>${data.host_first_name}</strong> has a ⭐️ <strong>${data.rating_avg}</strong> (${data.rating_count}) — nice pick.
                            </p>
                            <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
                                <p style="margin: 0; color: #991b1b; font-size: 14px;">
                                    <strong>⚠️ This date is popular today.</strong>
                                </p>
                            </div>
                            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                                <p style="margin: 0; color: #856404; font-size: 14px;">
                                    <strong>Heads-up:</strong> not confirmed until you pay.
                                </p>
                            </div>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${bookingUrl}" style="background: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                    View request
                                </a>
                            </div>
                        </div>
                    </div>
                `
            };
        }
    }

    /**
     * B) Host — New Request (with action buttons)
     */
    renderHostNewRequestEmail(data, language = "en") {
        const isArabic = language === "ar";
        const baseUrl = this._validateFrontendUrl(process.env.WEB_URL || process.env.FRONTEND_URL || "httpss://zuroona.sa");
        const acceptUrl = `${baseUrl}/organizer/bookings/${data.book_id}/accept`;
        const declineUrl = `${baseUrl}/organizer/bookings/${data.book_id}/decline`;
        const chatUrl = `${baseUrl}/chat/${data.event_id}`;

        if (isArabic) {
            return {
                subject: `طلب جديد: ${data.guest_first_name} على «${data.experience_title}» (${data.tickets_count})`,
                preview: `${data.start_at} · ${data.venue_area || 'منطقة الدرعية'}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
                        <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">طلب جديد 🎟️</h1>
                        </div>
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2 style="color: #333; margin-top: 0;">${data.host_first_name}،</h2>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                <strong>${data.guest_first_name}</strong> طلب <strong>${data.tickets_count}</strong> تذكرة بتاريخ <strong>${data.start_at}</strong>.
                            </p>
                            <p style="color: #666; font-size: 16px; line-height: 1.6; font-weight: bold;">
                                الرد السريع = حجوزات أكثر.
                            </p>
                            <div style="display: flex; gap: 10px; margin: 30px 0; flex-direction: row-reverse; flex-wrap: wrap;">
                                <a href="${acceptUrl}" style="flex: 1; min-width: 120px; background: #10b981; color: white; padding: 15px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; text-align: center; display: inline-block;">
                                    قبول
                                </a>
                                <a href="${declineUrl}" style="flex: 1; min-width: 120px; background: #ef4444; color: white; padding: 15px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; text-align: center; display: inline-block;">
                                    رفض
                                </a>
                                <a href="${chatUrl}" style="flex: 1; min-width: 120px; background: #3b82f6; color: white; padding: 15px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; text-align: center; display: inline-block;">
                                    مراسلة
                                </a>
                            </div>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                subject: `New request: ${data.guest_first_name} → "${data.experience_title}" (${data.tickets_count})`,
                preview: `${data.start_at} · ${data.venue_area || 'Diriyah area'}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">New Request 🎟️</h1>
                        </div>
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2 style="color: #333; margin-top: 0;">${data.host_first_name},</h2>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                <strong>${data.guest_first_name}</strong> wants <strong>${data.tickets_count}</strong> ticket(s) for <strong>${data.start_at}</strong>.
                            </p>
                            <p style="color: #666; font-size: 16px; line-height: 1.6; font-weight: bold;">
                                Fast replies = more bookings.
                            </p>
                            <div style="display: flex; gap: 10px; margin: 30px 0; flex-wrap: wrap;">
                                <a href="${acceptUrl}" style="flex: 1; min-width: 120px; background: #10b981; color: white; padding: 15px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; text-align: center; display: inline-block;">
                                    Accept
                                </a>
                                <a href="${declineUrl}" style="flex: 1; min-width: 120px; background: #ef4444; color: white; padding: 15px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; text-align: center; display: inline-block;">
                                    Decline
                                </a>
                                <a href="${chatUrl}" style="flex: 1; min-width: 120px; background: #3b82f6; color: white; padding: 15px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; text-align: center; display: inline-block;">
                                    Message
                                </a>
                            </div>
                        </div>
                    </div>
                `
            };
        }
    }

    /**
     * C) Guest — Accepted → Pay Now (A/B variants)
     * Variant A: Scarcity
     */
    renderGuestAcceptedPayNowEmailA(data, language = "en") {
        const isArabic = language === "ar";
        const baseUrl = this._validateFrontendUrl(process.env.WEB_URL || process.env.FRONTEND_URL || "httpss://zuroona.sa");
        const payUrl = `${baseUrl}/bookings/${data.book_id}/pay`;

        if (isArabic) {
            return {
                subject: `تمت الموافقة! احجز ${data.tickets_count} مقعد خلال ${data.hold_minutes} دقيقة`,
                preview: `أكمل الدفع لتأكيد مكانك.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
                        <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">تمت الموافقة! ✅</h1>
                        </div>
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2 style="color: #333; margin-top: 0;">تمام يا ${data.guest_first_name}—</h2>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                <strong>${data.host_first_name}</strong> وافق على طلبك.
                            </p>
                            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #10b981;">
                                <p style="margin: 0; color: #333; font-size: 18px; font-weight: bold;">
                                    مهلة الحجز: <strong style="color: #ef4444;">${data.hold_minutes} دقيقة</strong>
                                </p>
                                <p style="margin: 10px 0 0 0; color: #666; font-size: 16px;">
                                    الإجمالي: <strong>${data.total_amount} ${data.currency || 'SAR'}</strong>
                                </p>
                            </div>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                تقدر تدفع بطاقة.
                            </p>
                            ${data.remaining_seats ? `<p style="color: #ef4444; font-size: 14px; font-weight: bold;">باقي <strong>${data.remaining_seats}</strong> مقعد/مقاعد في هذا اليوم.</p>` : ''}
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${payUrl}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 18px;">
                                    ادفع الآن
                                </a>
                            </div>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                subject: `Accepted! Hold ${data.tickets_count} seat(s) for "${data.experience_title}"`,
                preview: `Complete payment in ${data.hold_minutes} min to lock your spot.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">Accepted! ✅</h1>
                        </div>
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2 style="color: #333; margin-top: 0;">Yes, ${data.guest_first_name} —</h2>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                <strong>${data.host_first_name}</strong> approved your request.
                            </p>
                            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #10b981;">
                                <p style="margin: 0; color: #333; font-size: 18px; font-weight: bold;">
                                    Hold: <strong style="color: #ef4444;">${data.hold_minutes} min</strong>
                                </p>
                                <p style="margin: 10px 0 0 0; color: #666; font-size: 16px;">
                                    Total: <strong>${data.total_amount} ${data.currency || 'SAR'}</strong>
                                </p>
                            </div>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                Pay with card.
                            </p>
                            ${data.remaining_seats ? `<p style="color: #ef4444; font-size: 14px; font-weight: bold;">Only <strong>${data.remaining_seats}</strong> seats left for this date.</p>` : ''}
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${payUrl}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 18px;">
                                    Pay now
                                </a>
                            </div>
                        </div>
                    </div>
                `
            };
        }
    }

    /**
     * C) Guest — Accepted → Pay Now (A/B variants)
     * Variant B: Speed
     */
    renderGuestAcceptedPayNowEmailB(data, language = "en") {
        const isArabic = language === "ar";
        const baseUrl = this._validateFrontendUrl(process.env.WEB_URL || process.env.FRONTEND_URL || "httpss://zuroona.sa");
        const payUrl = `${baseUrl}/bookings/${data.book_id}/pay`;

        if (isArabic) {
            return {
                subject: `تمت الموافقة — تأكيد بخطوة واحدة`,
                preview: `بطاقة متاحة.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
                        <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">تمت الموافقة! ✅</h1>
                        </div>
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2 style="color: #333; margin-top: 0;">تمام يا ${data.guest_first_name}—</h2>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                <strong>${data.host_first_name}</strong> وافق على طلبك.
                            </p>
                            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #10b981;">
                                <p style="margin: 0; color: #333; font-size: 18px; font-weight: bold;">
                                    مهلة الحجز: <strong style="color: #ef4444;">${data.hold_minutes} دقيقة</strong>
                                </p>
                                <p style="margin: 10px 0 0 0; color: #666; font-size: 16px;">
                                    الإجمالي: <strong>${data.total_amount} ${data.currency || 'SAR'}</strong>
                                </p>
                            </div>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                تقدر تدفع بطاقة.
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${payUrl}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 18px;">
                                    ادفع الآن
                                </a>
                            </div>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                subject: `You're approved — 1-tap to confirm`,
                preview: `Card payment available.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">You're Approved! ✅</h1>
                        </div>
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2 style="color: #333; margin-top: 0;">Yes, ${data.guest_first_name} —</h2>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                <strong>${data.host_first_name}</strong> approved your request.
                            </p>
                            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #10b981;">
                                <p style="margin: 0; color: #333; font-size: 18px; font-weight: bold;">
                                    Hold: <strong style="color: #ef4444;">${data.hold_minutes} min</strong>
                                </p>
                                <p style="margin: 10px 0 0 0; color: #666; font-size: 16px;">
                                    Total: <strong>${data.total_amount} ${data.currency || 'SAR'}</strong>
                                </p>
                            </div>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                Pay with card.
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${payUrl}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 18px;">
                                    Pay now
                                </a>
                            </div>
                        </div>
                    </div>
                `
            };
        }
    }

    /**
     * D) Guest — Payment Failed (gentle but urgent)
     */
    renderGuestPaymentFailedEmail(data, language = "en") {
        const isArabic = language === "ar";
        const baseUrl = this._validateFrontendUrl(process.env.WEB_URL || process.env.FRONTEND_URL || "httpss://zuroona.sa");
        const payUrl = `${baseUrl}/bookings/${data.book_id}/pay`;

        if (isArabic) {
            return {
                subject: `مشكلة بسيطة في الدفع — جرّب مرة ثانية`,
                preview: `بطاقة`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
                        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">مشكلة في الدفع ⚠️</h1>
                        </div>
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2 style="color: #333; margin-top: 0;">مرحباً ${data.guest_first_name}،</h2>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                ما اكتمل الدفع لـ <strong>«${data.experience_title}»</strong> (طلب ${data.order_id}).
                            </p>
                            <p style="color: #666; font-size: 16px; line-height: 1.6; font-weight: bold;">
                                أعد المحاولة الآن—المقاعد تنفد بسرعة.
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${payUrl}" style="background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 18px;">
                                    إعادة المحاولة
                                </a>
                            </div>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                subject: `Payment hiccup — one more tap to confirm`,
                preview: `Card payment`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">Payment Issue ⚠️</h1>
                        </div>
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2 style="color: #333; margin-top: 0;">Hi ${data.guest_first_name},</h2>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                We couldn't process your payment for <strong>"${data.experience_title}"</strong> (Order ${data.order_id}).
                            </p>
                            <p style="color: #666; font-size: 16px; line-height: 1.6; font-weight: bold;">
                                Try again now — seats move fast.
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${payUrl}" style="background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 18px;">
                                    Retry payment
                                </a>
                            </div>
                        </div>
                    </div>
                `
            };
        }
    }

    /**
     * E) Guest — Booking Confirmed (upsell to calendar + share)
     */
    renderGuestBookingConfirmedEmail(data, language = "en") {
        const isArabic = language === "ar";
        const baseUrl = this._validateFrontendUrl(process.env.WEB_URL || process.env.FRONTEND_URL || "httpss://zuroona.sa");
        const bookingUrl = `${baseUrl}/bookings/${data.book_id}`;
        const calendarUrl = `${baseUrl}/bookings/${data.book_id}/calendar.ics`;
        const shareUrl = `${baseUrl}/events/${data.experience_id}?ref=share`;

        if (isArabic) {
            return {
                subject: `تم تأكيد حجزك! «${data.experience_title}» بتاريخ ${data.start_at}`,
                preview: `تذاكرك جاهزة—أضفها للتقويم.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
                        <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">تم الحجز! 🎉</h1>
                        </div>
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2 style="color: #333; margin-top: 0;">تمام! تم تأكيد ${data.tickets_count} تذكرة.</h2>
                            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <p style="margin: 0; color: #666; font-size: 14px;">طلب ${data.order_id}</p>
                                <p style="margin: 5px 0 0 0; color: #333; font-size: 18px; font-weight: bold;">الإجمالي: ${data.total_amount} ${data.currency || 'SAR'}</p>
                            </div>
                            <div style="display: flex; gap: 10px; margin: 30px 0; flex-direction: row-reverse; flex-wrap: wrap;">
                                <a href="${bookingUrl}" style="flex: 1; min-width: 120px; background: #10b981; color: white; padding: 15px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; text-align: center; display: inline-block;">
                                    عرض الحجز
                                </a>
                                <a href="${calendarUrl}" style="flex: 1; min-width: 120px; background: #3b82f6; color: white; padding: 15px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; text-align: center; display: inline-block;">
                                    إضافة للتقويم
                                </a>
                                <a href="${shareUrl}" style="flex: 1; min-width: 120px; background: #8b5cf6; color: white; padding: 15px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; text-align: center; display: inline-block;">
                                    شارك الأصدقاء
                                </a>
                            </div>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                subject: `You're booked! "${data.experience_title}" on ${data.start_at}`,
                preview: `Your tickets are ready. Add to calendar.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">You're Booked! 🎉</h1>
                        </div>
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2 style="color: #333; margin-top: 0;">Done! ${data.tickets_count} ticket(s) confirmed.</h2>
                            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <p style="margin: 0; color: #666; font-size: 14px;">Order ${data.order_id}</p>
                                <p style="margin: 5px 0 0 0; color: #333; font-size: 18px; font-weight: bold;">Total: ${data.total_amount} ${data.currency || 'SAR'}</p>
                            </div>
                            <div style="display: flex; gap: 10px; margin: 30px 0; flex-wrap: wrap;">
                                <a href="${bookingUrl}" style="flex: 1; min-width: 120px; background: #10b981; color: white; padding: 15px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; text-align: center; display: inline-block;">
                                    View booking
                                </a>
                                <a href="${calendarUrl}" style="flex: 1; min-width: 120px; background: #3b82f6; color: white; padding: 15px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; text-align: center; display: inline-block;">
                                    Add to calendar
                                </a>
                                <a href="${shareUrl}" style="flex: 1; min-width: 120px; background: #8b5cf6; color: white; padding: 15px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; text-align: center; display: inline-block;">
                                    Share with friends
                                </a>
                            </div>
                        </div>
                    </div>
                `
            };
        }
    }

    /**
     * F) Host — Response Reminder (adds "boost tips")
     */
    renderHostResponseReminderEmail(data, language = "en") {
        const isArabic = language === "ar";
        const baseUrl = this._validateFrontendUrl(process.env.WEB_URL || process.env.FRONTEND_URL || "httpss://zuroona.sa");
        const acceptUrl = `${baseUrl}/organizer/bookings/${data.book_id}/accept`;
        const declineUrl = `${baseUrl}/organizer/bookings/${data.book_id}/decline`;

        if (isArabic) {
            return {
                subject: `تذكير سريع: ردّ على ${data.guest_first_name}`,
                preview: `الردود السريعة ترفع ترتيبك.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
                        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">تذكير سريع ⏰</h1>
                        </div>
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2 style="color: #333; margin-top: 0;">${data.host_first_name}،</h2>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                <strong>${data.guest_first_name}</strong> ينتظر على <strong>«${data.experience_title}»</strong> (${data.start_at}).
                            </p>
                            <div style="background: #dbeafe; border-right: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
                                <p style="margin: 0; color: #1e40af; font-size: 14px;">
                                    <strong>💡 نصيحة:</strong> القبول خلال ساعة يرفع ظهور إعلانك.
                                </p>
                            </div>
                            <div style="display: flex; gap: 10px; margin: 30px 0; flex-direction: row-reverse; flex-wrap: wrap;">
                                <a href="${acceptUrl}" style="flex: 1; min-width: 120px; background: #10b981; color: white; padding: 15px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; text-align: center; display: inline-block;">
                                    قبول
                                </a>
                                <a href="${declineUrl}" style="flex: 1; min-width: 120px; background: #ef4444; color: white; padding: 15px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; text-align: center; display: inline-block;">
                                    رفض
                                </a>
                            </div>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                subject: `Quick nudge: reply to ${data.guest_first_name}`,
                preview: `Fast replies increase your ranking.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">Quick Nudge ⏰</h1>
                        </div>
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2 style="color: #333; margin-top: 0;">${data.host_first_name},</h2>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                <strong>${data.guest_first_name}</strong> is waiting for <strong>"${data.experience_title}"</strong> (${data.start_at}).
                            </p>
                            <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
                                <p style="margin: 0; color: #1e40af; font-size: 14px;">
                                    <strong>💡 Boost tip:</strong> accept within 1h to improve visibility.
                                </p>
                            </div>
                            <div style="display: flex; gap: 10px; margin: 30px 0; flex-wrap: wrap;">
                                <a href="${acceptUrl}" style="flex: 1; min-width: 120px; background: #10b981; color: white; padding: 15px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; text-align: center; display: inline-block;">
                                    Accept
                                </a>
                                <a href="${declineUrl}" style="flex: 1; min-width: 120px; background: #ef4444; color: white; padding: 15px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; text-align: center; display: inline-block;">
                                    Decline
                                </a>
                            </div>
                        </div>
                    </div>
                `
            };
        }
    }

    /**
     * G) Hold Expired (re-request shortcut)
     */
    renderHoldExpiredEmail(data, language = "en") {
        const isArabic = language === "ar";
        const baseUrl = this._validateFrontendUrl(process.env.WEB_URL || process.env.FRONTEND_URL || "httpss://zuroona.sa");
        const experienceUrl = `${baseUrl}/events/${data.experience_id}`;

        if (isArabic) {
            return {
                subject: `انتهت المهلة — اطلب من جديد بخطوتين`,
                preview: `التاريخ هذا مطلوب.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
                        <div style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">انتهت المهلة ⏰</h1>
                        </div>
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2 style="color: #333; margin-top: 0;">مرحباً ${data.guest_first_name}،</h2>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                انتهت مهلة حجز <strong>«${data.experience_title}»</strong>.
                            </p>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                ارسل طلب جديد من الرابط—بننبهك أول ما يرد المضيف.
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${experienceUrl}" style="background: #ef4444; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 18px;">
                                    أعد الطلب
                                </a>
                            </div>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                subject: `Your hold expired — 2 taps to re-request`,
                preview: `This date is popular.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">Hold Expired ⏰</h1>
                        </div>
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2 style="color: #333; margin-top: 0;">Hi ${data.guest_first_name},</h2>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                Your hold for <strong>"${data.experience_title}"</strong> has expired.
                            </p>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                Tap below to send a fresh request — we'll prioritize notifications.
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${experienceUrl}" style="background: #ef4444; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 18px;">
                                    Request again
                                </a>
                            </div>
                        </div>
                    </div>
                `
            };
        }
    }

    /**
     * H) Reviews (make it fun + photo ask)
     */
    renderReviewPromptEmail(data, language = "en") {
        const isArabic = language === "ar";
        const baseUrl = this._validateFrontendUrl(process.env.WEB_URL || process.env.FRONTEND_URL || "httpss://zuroona.sa");
        const reviewUrl = `${baseUrl}/reviews/${data.experience_id}?book_id=${data.book_id}`;

        if (isArabic) {
            return {
                subject: `كيف كانت؟ تقييم سريع خلال 30 ثانية`,
                preview: `نجوم + ملاحظة قصيرة (الصور مرحّب بها).`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
                        <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">كيف كانت التجربة؟ ⭐️</h1>
                        </div>
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2 style="color: #333; margin-top: 0;">مرحباً ${data.guest_first_name}،</h2>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                عساك استمتعت في <strong>«${data.experience_title}»</strong> 🎉
                            </p>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                قيّم <strong>${data.host_first_name}</strong> (⭐️ بخطوتين) وأضف صورة لو حاب.
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${reviewUrl}" style="background: #8b5cf6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 18px;">
                                    اكتب تقييمك
                                </a>
                            </div>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                subject: `How was it? 30-sec review for ${data.host_first_name}`,
                preview: `Stars + a quick note (photos welcome).`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">How Was It? ⭐️</h1>
                        </div>
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2 style="color: #333; margin-top: 0;">Hi ${data.guest_first_name},</h2>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                Hope you had a great time at <strong>"${data.experience_title}"</strong> 🎉
                            </p>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                Rate <strong>${data.host_first_name}</strong> (⭐️ in 2 taps) and add a photo if you like.
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${reviewUrl}" style="background: #8b5cf6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 18px;">
                                    Leave a review
                                </a>
                            </div>
                        </div>
                    </div>
                `
            };
        }
    }

    /**
     * I) Wallet — Withdrawal Approved (adds certainty)
     */
    renderWithdrawalApprovedEmail(data, language = "en") {
        const isArabic = language === "ar";
        const baseUrl = this._validateFrontendUrl(process.env.WEB_URL || process.env.FRONTEND_URL || "httpss://zuroona.sa");
        const walletUrl = `${baseUrl}/organizer/wallet`;

        if (isArabic) {
            return {
                subject: `تم اعتماد السحب — ${data.amount} ${data.currency || 'SAR'} في الطريق`,
                preview: `خلال 5 أيام عمل (مرجع ${data.payout_ref}).`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
                        <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">تم اعتماد السحب ✅</h1>
                        </div>
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2 style="color: #333; margin-top: 0;">${data.host_first_name}،</h2>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                تم اعتماد سحبك إلى <strong>${data.bank_short}</strong>.
                            </p>
                            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <p style="margin: 0; color: #666; font-size: 14px;">المبلغ: <strong>${data.amount} ${data.currency || 'SAR'}</strong></p>
                                <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">المرجع: <strong>${data.payout_ref}</strong></p>
                            </div>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                تظهر عادة خلال <strong>5 أيام عمل</strong>.
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${walletUrl}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 18px;">
                                    تتبع التحويل
                                </a>
                            </div>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                subject: `Withdrawal approved — ${data.amount} ${data.currency || 'SAR'} on the way`,
                preview: `Expect within 5 business days (ref ${data.payout_ref}).`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">Withdrawal Approved ✅</h1>
                        </div>
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2 style="color: #333; margin-top: 0;">${data.host_first_name},</h2>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                We approved your withdrawal to <strong>${data.bank_short}</strong>.
                            </p>
                            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <p style="margin: 0; color: #666; font-size: 14px;">Amount: <strong>${data.amount} ${data.currency || 'SAR'}</strong></p>
                                <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Ref: <strong>${data.payout_ref}</strong></p>
                            </div>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                Banks usually post within <strong>5 business days</strong>.
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${walletUrl}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 18px;">
                                    Track payout
                                </a>
                            </div>
                        </div>
                    </div>
                `
            };
        }
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
