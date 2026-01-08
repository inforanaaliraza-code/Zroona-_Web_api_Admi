/**
 * Comprehensive Notification Service
 * Handles email and push notifications with:
 * - Bilingual support (EN/AR)
 * - Quiet hours (10:00-22:00 KSA)
 * - Failover (push → email if push fails)
 * - OneSignal data tags
 * - Template variants (A/B testing)
 */

const emailService = require('./emailService');
const { pushNotification } = require('./pushNotification');
const NotificationService = require('../services/notificationService');

class NotificationHelper {
    /**
     * Check if current time is within quiet hours (10:00-22:00 KSA)
     * @returns {boolean}
     */
    isQuietHours() {
        const now = new Date();
        // Convert to KSA time (UTC+3)
        const ksaTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Riyadh" }));
        const hour = ksaTime.getHours();
        return hour >= 10 && hour < 22;
    }

    /**
     * Get user language preference, fallback to 'en'
     * @param {Object} user - User object
     * @returns {string} - 'en' or 'ar'
     */
    getUserLanguage(user) {
        return (user && user.language) || 'en';
    }

    /**
     * Format date/time for display
     * @param {Date|string} date - Date to format
     * @param {string} language - Language preference
     * @returns {string} - Formatted date string
     */
    formatDateTime(date, language = 'en') {
        if (!date) return '';
        
        const d = new Date(date);
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            timeZone: 'Asia/Riyadh',
            timeZoneName: 'short'
        };

        if (language === 'ar') {
            return d.toLocaleDateString('ar-SA', options);
        }
        return d.toLocaleDateString('en-US', options);
    }

    /**
     * Format date as ISO string for OneSignal data tags
     * @param {Date|string} date - Date to format
     * @returns {string} - ISO date string
     */
    formatDateTimeISO(date) {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString();
    }

    /**
     * Calculate hold minutes remaining
     * @param {Date|string} holdExpiresAt - Hold expiration date
     * @returns {number} - Minutes remaining
     */
    getHoldMinutesRemaining(holdExpiresAt) {
        if (!holdExpiresAt) return 30; // Default 30 minutes
        
        const now = new Date();
        const expires = new Date(holdExpiresAt);
        const diffMs = expires - now;
        const diffMins = Math.max(0, Math.floor(diffMs / 60000));
        return diffMins || 30; // Default to 30 if invalid
    }

    /**
     * Validate and clean frontend URL
     * @param {string} url - URL to validate
     * @returns {string} - Valid URL (defaults to http://localhost:3000 if invalid)
     */
    _validateFrontendUrl(url) {
        if (!url) return "http://localhost:3000";
        
        let cleanUrl = url.trim().replace(/\/+$/, '');
        const invalidDomains = ['bedpage', 'yourdomain.com', 'yourdomain', 'example.com', 'example', 'localhost.com'];
        const hasInvalidDomain = invalidDomains.some(domain => cleanUrl.includes(domain));
        const has404 = cleanUrl.includes('404');
        
        if (hasInvalidDomain || has404 || (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://'))) {
            console.warn(`⚠️  Invalid WEB_URL detected: "${cleanUrl}", using default http://localhost:3000`);
            return "http://localhost:3000";
        }
        
        return cleanUrl;
    }

    /**
     * A) Guest — Request Sent
     * @param {Object} data - Notification data
     * @param {Object} guest - Guest user object
     * @param {string} variant - 'A' or 'B' (default: 'A')
     */
    async sendGuestRequestSent(data, guest, variant = 'A') {
        try {
            const language = this.getUserLanguage(guest);
            const emailData = {
                guest_first_name: guest.first_name || 'Guest',
                experience_title: data.experience_title || data.event_name || 'Experience',
                host_first_name: data.host_first_name || 'Host',
                tickets_count: data.tickets_count || data.no_of_attendees || 1,
                start_at: this.formatDateTime(data.start_at || data.event_date, language),
                rating_avg: data.rating_avg || '4.5',
                rating_count: data.rating_count || '0',
                book_id: data.book_id || data.booking_id
            };

            // Get email template
            const emailTemplate = variant === 'B' 
                ? emailService.renderGuestRequestSentEmailB(emailData, language)
                : emailService.renderGuestRequestSentEmailA(emailData, language);

            // Send email
            if (guest.email) {
                await emailService.send(guest.email, emailTemplate.subject, emailTemplate.html);
            }

            // Generate URLs for deep linking
            const baseUrl = this._validateFrontendUrl(process.env.WEB_URL || process.env.FRONTEND_URL || "http://localhost:3000");
            const bookingUrl = `${baseUrl}/bookings/${data.book_id || data.booking_id}`;

            // Send push notification with bilingual support
            const pushTitleEn = 'Request sent. We\'ll notify you when ' + emailData.host_first_name + ' replies.';
            const pushTitleAr = 'تم الإرسال. بنعلمك أول ما يرد ' + emailData.host_first_name + '.';
            const pushDescriptionEn = `${emailData.tickets_count} ticket request for "${emailData.experience_title}"`;
            const pushDescriptionAr = `طلب ${emailData.tickets_count} تذكرة لـ «${emailData.experience_title}»`;

            await this.sendPushWithFailover(
                null, // res (not needed for helper)
                1, // role (guest)
                guest._id,
                {
                    title: language === 'ar' ? pushTitleAr : pushTitleEn,
                    title_en: pushTitleEn,
                    title_ar: pushTitleAr,
                    description: language === 'ar' ? pushDescriptionAr : pushDescriptionEn,
                    description_en: pushDescriptionEn,
                    description_ar: pushDescriptionAr,
                    notification_type: 1, // Request sent
                    event_id: data.event_id,
                    experience_id: data.event_id,
                    experience_title: emailData.experience_title,
                    host_id: data.host_id,
                    host_first_name: emailData.host_first_name,
                    tickets_count: emailData.tickets_count,
                    start_at_iso: this.formatDateTimeISO(data.start_at || data.event_date),
                    rating_avg: emailData.rating_avg,
                    rating_count: emailData.rating_count,
                    booking_url: bookingUrl,
                    book_id: data.book_id || data.booking_id,
                    first_name: guest.first_name,
                    last_name: guest.last_name,
                    profile_image: guest.profile_image
                },
                guest
            );

            return { success: true };
        } catch (error) {
            console.error('[NOTIFICATION] Error sending guest request sent:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * B) Host — New Request
     * @param {Object} data - Notification data
     * @param {Object} host - Host user object
     */
    async sendHostNewRequest(data, host) {
        try {
            const language = this.getUserLanguage(host);
            const baseUrl = this._validateFrontendUrl(process.env.WEB_URL || process.env.FRONTEND_URL || "http://localhost:3000");
            const emailData = {
                host_first_name: host.first_name || 'Host',
                guest_first_name: data.guest_first_name || data.user_first_name || 'Guest',
                experience_title: data.experience_title || data.event_name || 'Experience',
                tickets_count: data.tickets_count || data.no_of_attendees || 1,
                start_at: this.formatDateTime(data.start_at || data.event_date, language),
                venue_area: data.venue_area || 'Diriyah',
                book_id: data.book_id || data.booking_id,
                event_id: data.event_id
            };

            // Generate URLs for deep linking
            const acceptUrl = `${baseUrl}/organizer/bookings/${emailData.book_id}/accept`;
            const declineUrl = `${baseUrl}/organizer/bookings/${emailData.book_id}/decline`;
            const chatUrl = `${baseUrl}/chat/${emailData.event_id}`;

            // Get email template
            const emailTemplate = emailService.renderHostNewRequestEmail(emailData, language);

            // Send email
            if (host.email) {
                await emailService.send(host.email, emailTemplate.subject, emailTemplate.html);
            }

            // Send push notification with bilingual support
            const pushTitleEn = `New request (${emailData.tickets_count}) for "${emailData.experience_title}". Accept/Decline.`;
            const pushTitleAr = `طلب جديد (${emailData.tickets_count}) لـ «${emailData.experience_title}». قبول/رفض.`;
            const pushDescriptionEn = `${emailData.guest_first_name} wants ${emailData.tickets_count} ticket(s)`;
            const pushDescriptionAr = `${emailData.guest_first_name} طلب ${emailData.tickets_count} تذكرة`;

            await this.sendPushWithFailover(
                null,
                2, // role (host)
                host._id,
                {
                    title: language === 'ar' ? pushTitleAr : pushTitleEn,
                    title_en: pushTitleEn,
                    title_ar: pushTitleAr,
                    description: language === 'ar' ? pushDescriptionAr : pushDescriptionEn,
                    description_en: pushDescriptionEn,
                    description_ar: pushDescriptionAr,
                    notification_type: 1, // New request
                    event_id: data.event_id,
                    experience_id: data.event_id,
                    experience_title: emailData.experience_title,
                    host_id: host._id,
                    host_first_name: emailData.host_first_name,
                    tickets_count: emailData.tickets_count,
                    start_at_iso: this.formatDateTimeISO(data.start_at || data.event_date),
                    venue_area: emailData.venue_area,
                    book_id: data.book_id || data.booking_id,
                    accept_url: acceptUrl,
                    decline_url: declineUrl,
                    chat_url: chatUrl,
                    first_name: host.first_name,
                    last_name: host.last_name,
                    profile_image: host.profile_image,
                    userId: data.guest_id || data.user_id
                },
                host
            );

            return { success: true };
        } catch (error) {
            console.error('[NOTIFICATION] Error sending host new request:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * C) Guest — Accepted → Pay Now
     * @param {Object} data - Notification data
     * @param {Object} guest - Guest user object
     * @param {string} variant - 'A' (scarcity) or 'B' (speed)
     */
    async sendGuestAcceptedPayNow(data, guest, variant = 'A') {
        try {
            const language = this.getUserLanguage(guest);
            const holdMinutes = this.getHoldMinutesRemaining(data.hold_expires_at);
            
            const emailData = {
                guest_first_name: guest.first_name || 'Guest',
                host_first_name: data.host_first_name || 'Host',
                experience_title: data.experience_title || data.event_name || 'Experience',
                tickets_count: data.tickets_count || data.no_of_attendees || 1,
                hold_minutes: holdMinutes,
                total_amount: data.total_amount || data.price_total || 0,
                currency: data.currency || 'SAR',
                remaining_seats: data.remaining_seats,
                book_id: data.book_id || data.booking_id
            };

            // Get email template
            const emailTemplate = variant === 'B'
                ? emailService.renderGuestAcceptedPayNowEmailB(emailData, language)
                : emailService.renderGuestAcceptedPayNowEmailA(emailData, language);

            // Send email
            if (guest.email) {
                await emailService.send(guest.email, emailTemplate.subject, emailTemplate.html);
            }

            // Send push notification with bilingual support
            const pushTitleEn = `Accepted! ${holdMinutes}-min hold. Pay now to confirm.`;
            const pushTitleAr = `تمت الموافقة! مهلة ${holdMinutes} دقيقة. ادفع الآن للتأكيد.`;
            const pushDescriptionEn = `${emailData.host_first_name} approved your request`;
            const pushDescriptionAr = `${emailData.host_first_name} وافق على طلبك`;

            // Generate URLs for deep linking
            const baseUrl = this._validateFrontendUrl(process.env.WEB_URL || process.env.FRONTEND_URL || "http://localhost:3000");
            const payUrl = `${baseUrl}/events/${data.event_id}?booking_id=${data.book_id || data.booking_id}&step=payment`;

            await this.sendPushWithFailover(
                null,
                1, // role (guest)
                guest._id,
                {
                    title: language === 'ar' ? pushTitleAr : pushTitleEn,
                    title_en: pushTitleEn,
                    title_ar: pushTitleAr,
                    description: language === 'ar' ? pushDescriptionAr : pushDescriptionEn,
                    description_en: pushDescriptionEn,
                    description_ar: pushDescriptionAr,
                    notification_type: 2, // Accepted
                    event_id: data.event_id,
                    experience_id: data.event_id,
                    experience_title: emailData.experience_title,
                    host_id: data.host_id,
                    host_first_name: emailData.host_first_name,
                    tickets_count: emailData.tickets_count,
                    start_at_iso: this.formatDateTimeISO(data.start_at || data.event_date),
                    hold_expires_at: data.hold_expires_at ? this.formatDateTimeISO(data.hold_expires_at) : '',
                    price_total: emailData.total_amount,
                    currency: emailData.currency,
                    remaining_seats: data.remaining_seats || 0,
                    hold_minutes: emailData.hold_minutes || 30,
                    pay_url: payUrl,
                    book_id: data.book_id || data.booking_id,
                    first_name: guest.first_name,
                    last_name: guest.last_name,
                    profile_image: guest.profile_image,
                    status: 2 // Accepted
                },
                guest
            );

            return { success: true };
        } catch (error) {
            console.error('[NOTIFICATION] Error sending guest accepted pay now:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * D) Guest — Payment Failed
     * @param {Object} data - Notification data
     * @param {Object} guest - Guest user object
     */
    async sendGuestPaymentFailed(data, guest) {
        try {
            const language = this.getUserLanguage(guest);
            const emailData = {
                guest_first_name: guest.first_name || 'Guest',
                experience_title: data.experience_title || data.event_name || 'Experience',
                order_id: data.order_id || data.book_id || 'N/A',
                book_id: data.book_id || data.booking_id
            };

            // Get email template
            const emailTemplate = emailService.renderGuestPaymentFailedEmail(emailData, language);

            // Send email
            if (guest.email) {
                await emailService.send(guest.email, emailTemplate.subject, emailTemplate.html);
            }

            // Send push notification with bilingual support
            const pushTitleEn = 'Payment failed. Tap to retry and keep your spot.';
            const pushTitleAr = 'فشل الدفع. اضغط لإعادة المحاولة وتثبيت مكانك.';
            const pushDescriptionEn = `Payment issue for "${emailData.experience_title}"`;
            const pushDescriptionAr = `مشكلة في الدفع لـ «${emailData.experience_title}»`;

            // Generate URLs for deep linking
            const baseUrl = this._validateFrontendUrl(process.env.WEB_URL || process.env.FRONTEND_URL || "http://localhost:3000");
            const payUrl = `${baseUrl}/events/${data.event_id}?booking_id=${data.book_id || data.booking_id}&step=payment`;

            await this.sendPushWithFailover(
                null,
                1, // role (guest)
                guest._id,
                {
                    title: language === 'ar' ? pushTitleAr : pushTitleEn,
                    title_en: pushTitleEn,
                    title_ar: pushTitleAr,
                    description: language === 'ar' ? pushDescriptionAr : pushDescriptionEn,
                    description_en: pushDescriptionEn,
                    description_ar: pushDescriptionAr,
                    notification_type: 5, // Payment failed
                    event_id: data.event_id,
                    experience_id: data.event_id,
                    experience_title: emailData.experience_title,
                    order_id: emailData.order_id,
                    pay_url: payUrl,
                    book_id: data.book_id || data.booking_id,
                    first_name: guest.first_name,
                    last_name: guest.last_name,
                    profile_image: guest.profile_image
                },
                guest
            );

            return { success: true };
        } catch (error) {
            console.error('[NOTIFICATION] Error sending payment failed:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * E) Guest — Booking Confirmed
     * @param {Object} data - Notification data
     * @param {Object} guest - Guest user object
     */
    async sendGuestBookingConfirmed(data, guest) {
        try {
            const language = this.getUserLanguage(guest);
            const emailData = {
                guest_first_name: guest.first_name || 'Guest',
                experience_title: data.experience_title || data.event_name || 'Experience',
                tickets_count: data.tickets_count || data.no_of_attendees || 1,
                start_at: this.formatDateTime(data.start_at || data.event_date, language),
                order_id: data.order_id || data.book_id || 'N/A',
                total_amount: data.total_amount || data.price_total || 0,
                currency: data.currency || 'SAR',
                book_id: data.book_id || data.booking_id,
                experience_id: data.experience_id || data.event_id
            };

            // Get email template
            const emailTemplate = emailService.renderGuestBookingConfirmedEmail(emailData, language);

            // Send email
            if (guest.email) {
                await emailService.send(guest.email, emailTemplate.subject, emailTemplate.html);
            }

            // Send push notification with bilingual support
            const pushTitleEn = 'You\'re in 🎉 See tickets & details.';
            const pushTitleAr = 'تم الحجز 🎉 شوف التذاكر والتفاصيل.';
            const pushDescriptionEn = `${emailData.tickets_count} ticket(s) confirmed`;
            const pushDescriptionAr = `تم تأكيد ${emailData.tickets_count} تذكرة`;

            // Generate URLs for deep linking
            const baseUrl = this._validateFrontendUrl(process.env.WEB_URL || process.env.FRONTEND_URL || "http://localhost:3000");
            const bookingUrl = `${baseUrl}/bookings/${data.book_id || data.booking_id}`;
            const calendarUrl = `${baseUrl}/bookings/${data.book_id || data.booking_id}/calendar.ics`;
            const shareUrl = `${baseUrl}/events/${data.experience_id || data.event_id}?ref=share`;

            await this.sendPushWithFailover(
                null,
                1, // role (guest)
                guest._id,
                {
                    title: language === 'ar' ? pushTitleAr : pushTitleEn,
                    title_en: pushTitleEn,
                    title_ar: pushTitleAr,
                    description: language === 'ar' ? pushDescriptionAr : pushDescriptionEn,
                    description_en: pushDescriptionEn,
                    description_ar: pushDescriptionAr,
                    notification_type: 6, // Booking confirmed
                    event_id: data.event_id,
                    experience_id: data.experience_id || data.event_id,
                    experience_title: emailData.experience_title,
                    tickets_count: emailData.tickets_count,
                    start_at_iso: this.formatDateTimeISO(data.start_at || data.event_date),
                    price_total: emailData.total_amount,
                    currency: emailData.currency,
                    order_id: emailData.order_id,
                    booking_url: bookingUrl,
                    calendar_url: calendarUrl,
                    share_url: shareUrl,
                    book_id: data.book_id || data.booking_id,
                    first_name: guest.first_name,
                    last_name: guest.last_name,
                    profile_image: guest.profile_image,
                    status: 2 // Confirmed
                },
                guest
            );

            return { success: true };
        } catch (error) {
            console.error('[NOTIFICATION] Error sending booking confirmed:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * F) Host — Response Reminder
     * @param {Object} data - Notification data
     * @param {Object} host - Host user object
     */
    async sendHostResponseReminder(data, host) {
        try {
            const language = this.getUserLanguage(host);
            const emailData = {
                host_first_name: host.first_name || 'Host',
                guest_first_name: data.guest_first_name || data.user_first_name || 'Guest',
                experience_title: data.experience_title || data.event_name || 'Experience',
                start_at: this.formatDateTime(data.start_at || data.event_date, language),
                book_id: data.book_id || data.booking_id
            };

            // Get email template
            const emailTemplate = emailService.renderHostResponseReminderEmail(emailData, language);

            // Send email
            if (host.email) {
                await emailService.send(host.email, emailTemplate.subject, emailTemplate.html);
            }

            // Send push notification with bilingual support
            const pushTitleEn = `Reply needed for "${emailData.experience_title}".`;
            const pushTitleAr = `مطلوب رد لتجربة «${emailData.experience_title}».`;
            const pushDescriptionEn = `${emailData.guest_first_name} is waiting`;
            const pushDescriptionAr = `${emailData.guest_first_name} ينتظر`;

            // Generate URLs for deep linking
            const baseUrl = this._validateFrontendUrl(process.env.WEB_URL || process.env.FRONTEND_URL || "http://localhost:3000");
            const acceptUrl = `${baseUrl}/organizer/bookings/${emailData.book_id}/accept`;
            const declineUrl = `${baseUrl}/organizer/bookings/${emailData.book_id}/decline`;

            await this.sendPushWithFailover(
                null,
                2, // role (host)
                host._id,
                {
                    title: language === 'ar' ? pushTitleAr : pushTitleEn,
                    title_en: pushTitleEn,
                    title_ar: pushTitleAr,
                    description: language === 'ar' ? pushDescriptionAr : pushDescriptionEn,
                    description_en: pushDescriptionEn,
                    description_ar: pushDescriptionAr,
                    notification_type: 7, // Response reminder
                    event_id: data.event_id,
                    experience_id: data.event_id,
                    experience_title: emailData.experience_title,
                    book_id: data.book_id || data.booking_id,
                    accept_url: acceptUrl,
                    decline_url: declineUrl,
                    first_name: host.first_name,
                    last_name: host.last_name,
                    profile_image: host.profile_image
                },
                host
            );

            return { success: true };
        } catch (error) {
            console.error('[NOTIFICATION] Error sending host response reminder:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * G) Hold Expired
     * @param {Object} data - Notification data
     * @param {Object} guest - Guest user object
     */
    async sendHoldExpired(data, guest) {
        try {
            const language = this.getUserLanguage(guest);
            const emailData = {
                guest_first_name: guest.first_name || 'Guest',
                experience_title: data.experience_title || data.event_name || 'Experience',
                experience_id: data.experience_id || data.event_id
            };

            // Get email template
            const emailTemplate = emailService.renderHoldExpiredEmail(emailData, language);

            // Send email
            if (guest.email) {
                await emailService.send(guest.email, emailTemplate.subject, emailTemplate.html);
            }

            // Send push notification with bilingual support
            const pushTitleEn = 'Hold expired. Request again now.';
            const pushTitleAr = 'انتهت المهلة. أعد الطلب الآن.';
            const pushDescriptionEn = `Hold expired for "${emailData.experience_title}"`;
            const pushDescriptionAr = `انتهت مهلة حجز «${emailData.experience_title}»`;

            // Generate URLs for deep linking
            const baseUrl = this._validateFrontendUrl(process.env.WEB_URL || process.env.FRONTEND_URL || "http://localhost:3000");
            const experienceUrl = `${baseUrl}/events/${data.experience_id || data.event_id}`;

            await this.sendPushWithFailover(
                null,
                1, // role (guest)
                guest._id,
                {
                    title: language === 'ar' ? pushTitleAr : pushTitleEn,
                    title_en: pushTitleEn,
                    title_ar: pushTitleAr,
                    description: language === 'ar' ? pushDescriptionAr : pushDescriptionEn,
                    description_en: pushDescriptionEn,
                    description_ar: pushDescriptionAr,
                    notification_type: 8, // Hold expired
                    event_id: data.event_id,
                    experience_id: data.experience_id || data.event_id,
                    experience_title: emailData.experience_title,
                    experience_url: experienceUrl,
                    first_name: guest.first_name,
                    last_name: guest.last_name,
                    profile_image: guest.profile_image
                },
                guest
            );

            return { success: true };
        } catch (error) {
            console.error('[NOTIFICATION] Error sending hold expired:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * H) Review Prompt
     * @param {Object} data - Notification data
     * @param {Object} guest - Guest user object
     */
    async sendReviewPrompt(data, guest) {
        try {
            const language = this.getUserLanguage(guest);
            const emailData = {
                guest_first_name: guest.first_name || 'Guest',
                host_first_name: data.host_first_name || 'Host',
                experience_title: data.experience_title || data.event_name || 'Experience',
                experience_id: data.experience_id || data.event_id,
                book_id: data.book_id || data.booking_id
            };

            // Get email template
            const emailTemplate = emailService.renderReviewPromptEmail(emailData, language);

            // Send email
            if (guest.email) {
                await emailService.send(guest.email, emailTemplate.subject, emailTemplate.html);
            }

            // Send push notification with bilingual support
            const pushTitleEn = 'Got 30 sec? Rate your host ⭐️';
            const pushTitleAr = 'عندك 30 ثانية؟ قيّم المضيف ⭐️';
            const pushDescriptionEn = `How was "${emailData.experience_title}"?`;
            const pushDescriptionAr = `كيف كانت «${emailData.experience_title}»؟`;

            // Generate URLs for deep linking
            const baseUrl = this._validateFrontendUrl(process.env.WEB_URL || process.env.FRONTEND_URL || "http://localhost:3000");
            const reviewUrl = `${baseUrl}/reviews/${data.experience_id || data.event_id}?book_id=${data.book_id || data.booking_id}`;

            await this.sendPushWithFailover(
                null,
                1, // role (guest)
                guest._id,
                {
                    title: language === 'ar' ? pushTitleAr : pushTitleEn,
                    title_en: pushTitleEn,
                    title_ar: pushTitleAr,
                    description: language === 'ar' ? pushDescriptionAr : pushDescriptionEn,
                    description_en: pushDescriptionEn,
                    description_ar: pushDescriptionAr,
                    notification_type: 9, // Review prompt
                    event_id: data.event_id,
                    experience_id: data.experience_id || data.event_id,
                    experience_title: emailData.experience_title,
                    host_first_name: emailData.host_first_name,
                    review_url: reviewUrl,
                    book_id: data.book_id || data.booking_id,
                    first_name: guest.first_name,
                    last_name: guest.last_name,
                    profile_image: guest.profile_image
                },
                guest
            );

            return { success: true };
        } catch (error) {
            console.error('[NOTIFICATION] Error sending review prompt:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * I) Withdrawal Approved
     * @param {Object} data - Notification data
     * @param {Object} host - Host user object
     */
    async sendWithdrawalApproved(data, host) {
        try {
            const language = this.getUserLanguage(host);
            const emailData = {
                host_first_name: host.first_name || 'Host',
                amount: data.amount || 0,
                currency: data.currency || 'SAR',
                bank_short: data.bank_short || data.bank_name || 'Bank',
                payout_ref: data.payout_ref || data.transaction_reference || 'N/A'
            };

            // Get email template
            const emailTemplate = emailService.renderWithdrawalApprovedEmail(emailData, language);

            // Send email
            if (host.email) {
                await emailService.send(host.email, emailTemplate.subject, emailTemplate.html);
            }

            // Send push notification with bilingual support
            const pushTitleEn = 'Withdrawal approved. Funds on the way.';
            const pushTitleAr = 'تم اعتماد السحب. المبلغ في الطريق.';
            const pushDescriptionEn = `${emailData.amount} ${emailData.currency} approved`;
            const pushDescriptionAr = `تم اعتماد ${emailData.amount} ${emailData.currency}`;

            // Generate URLs for deep linking
            const baseUrl = this._validateFrontendUrl(process.env.WEB_URL || process.env.FRONTEND_URL || "http://localhost:3000");
            const walletUrl = `${baseUrl}/organizer/wallet`;

            await this.sendPushWithFailover(
                null,
                2, // role (host)
                host._id,
                {
                    title: language === 'ar' ? pushTitleAr : pushTitleEn,
                    title_en: pushTitleEn,
                    title_ar: pushTitleAr,
                    description: language === 'ar' ? pushDescriptionAr : pushDescriptionEn,
                    description_en: pushDescriptionEn,
                    description_ar: pushDescriptionAr,
                    notification_type: 4, // Withdrawal
                    price_total: emailData.amount,
                    amount: emailData.amount,
                    currency: emailData.currency,
                    payout_ref: emailData.payout_ref,
                    bank_short: emailData.bank_short,
                    wallet_url: walletUrl,
                    first_name: host.first_name,
                    last_name: host.last_name,
                    profile_image: host.profile_image,
                    status: 1 // Approved
                },
                host
            );

            return { success: true };
        } catch (error) {
            console.error('[NOTIFICATION] Error sending withdrawal approved:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Send push notification with failover to email
     * If push fails or is outside quiet hours, send email
     * @param {Object} res - Express response object (optional)
     * @param {number} role - User role (1=guest, 2=host)
     * @param {string} userId - User ID
     * @param {Object} message - Notification message
     * @param {Object} user - User object (for email failover)
     */
    async sendPushWithFailover(res, role, userId, message, user) {
        try {
            // Check quiet hours - if outside, send email immediately and schedule push
            if (!this.isQuietHours()) {
                console.log('[NOTIFICATION] Outside quiet hours, sending email now and scheduling push');
                if (user && user.email) {
                    // Send email immediately
                    const language = this.getUserLanguage(user);
                    const emailSubject = message.title || 'Notification';
                    const emailHtml = `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; ${language === 'ar' ? 'direction: rtl;' : ''}">
                            <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
                                <h2 style="color: #333;">${message.title || 'Notification'}</h2>
                                <p style="color: #666; font-size: 16px; line-height: 1.6;">${message.description || ''}</p>
                            </div>
                        </div>
                    `;
                    await emailService.send(user.email, emailSubject, emailHtml);
                }
                // Note: In production, you'd schedule push for morning (10:00 KSA)
                // For now, we'll still try to send push
            }

            // Try to send push notification
            try {
                await pushNotification(res, role, userId, message);
                
                // Set a timeout to check if push was delivered (2 minutes)
                setTimeout(async () => {
                    // In production, check OneSignal delivery status
                    // For now, we'll assume it was delivered if no error
                }, 120000); // 2 minutes
            } catch (pushError) {
                console.error('[NOTIFICATION] Push notification failed, sending email as failover:', pushError);
                
                // Failover: send email if push fails
                if (user && user.email) {
                    const language = this.getUserLanguage(user);
                    const emailSubject = message.title || 'Notification';
                    const emailHtml = `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; ${language === 'ar' ? 'direction: rtl;' : ''}">
                            <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
                                <h2 style="color: #333;">${message.title || 'Notification'}</h2>
                                <p style="color: #666; font-size: 16px; line-height: 1.6;">${message.description || ''}</p>
                            </div>
                        </div>
                    `;
                    await emailService.send(user.email, emailSubject, emailHtml);
                }
            }
        } catch (error) {
            console.error('[NOTIFICATION] Error in sendPushWithFailover:', error);
            throw error;
        }
    }
}

// Export singleton instance
const notificationHelper = new NotificationHelper();
module.exports = notificationHelper;

