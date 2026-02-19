const oneSignalClient = require('../config/oneSignalConfig.js');
const Response = require('../helpers/response.js');
const mongoose = require('mongoose');
const UserService = require('../services/userService.js');
const OrganizerService = require('../services/organizerService.js');
const NotificationService = require('../services/notificationService.js');

const pushNotification = async (res, role, userId, message) => {

    console.log('message   start', message, 'message daa')
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return Response.badRequestResponse(res, {}, 402, 'Invalid user id');
        }
        const service = role == 1 ? UserService : OrganizerService;

        const user = await service.FindOneService({ _id: userId });

        // Check if user has a device token (OneSignal player ID)
        if (!user.fcm_token) {
            console.log('⚠️  User does not have a device token (OneSignal player ID)');
            return null;
        }

        const _data = {
            profile_image: message.profile_image || '',
            username: `${message.first_name} ${message.last_name}`,
            userId: message.userId,
            event_id: message.event_id || null,
            book_id: message.book_id || null,
            notification_type: message.notification_type,
            status: message.status
        };

        // Create notification in database (store both EN and AR for admin/UI locale)
        const _notification = await NotificationService.CreateService({
            user_id: userId,
            role,
            title: message.title,
            title_ar: message.title_ar || null,
            description: message.description,
            description_ar: message.description_ar || null,
            profile_image: message.profile_image,
            senderId: message.userId,
            event_id: message.event_id,
            notification_type: message.notification_type,
            book_id: message.book_id,
            status: message.status
        });

        // Get user language preference for bilingual support
        const _userLanguage = user.language || 'en';
        
        // Support bilingual messages - if title_en/title_ar provided, use them; otherwise use single title
        const titleEn = message.title_en || message.title || 'Notification';
        const titleAr = message.title_ar || message.title || 'إشعار';
        const descriptionEn = message.description_en || message.description || '';
        const descriptionAr = message.description_ar || message.description || '';

        // OneSignal notification payload with bilingual support
        const oneSignalPayload = {
            include_player_ids: [user.fcm_token], // OneSignal player ID
            headings: {
                en: titleEn,
                ar: titleAr
            },
            contents: {
                en: descriptionEn,
                ar: descriptionAr
            },
            data: {
                userId: userId.toString(),
                role: role.toString(),
                profile_image: message.profile_image || '',
                username: message.user_name || `${message.first_name || ''} ${message.last_name || ''}`.trim(),
                senderId: message.userId ? message.userId.toString() : '',
                event_id: message.event_id ? message.event_id.toString() : '',
                book_id: message.book_id ? message.book_id.toString() : '',
                notification_type: message.notification_type || '',
                status: message.status || '',
                // Additional data tags as per document requirements
                experience_id: message.experience_id ? message.experience_id.toString() : '',
                experience_title: message.experience_title || '',
                host_id: message.host_id ? message.host_id.toString() : '',
                host_first_name: message.host_first_name || '',
                tickets_count: message.tickets_count || message.no_of_attendees || '',
                start_at_iso: message.start_at_iso || '',
                venue_area: message.venue_area || '',
                hold_expires_at: message.hold_expires_at || '',
                price_total: message.price_total || message.total_amount || '',
                currency: message.currency || 'SAR',
                rating_avg: message.rating_avg || '',
                rating_count: message.rating_count || '',
                // Deep link URLs for app navigation
                booking_url: message.booking_url || '',
                accept_url: message.accept_url || '',
                decline_url: message.decline_url || '',
                chat_url: message.chat_url || '',
                pay_url: message.pay_url || '',
                order_id: message.order_id || '',
                calendar_url: message.calendar_url || '',
                share_url: message.share_url || '',
                review_url: message.review_url || '',
                wallet_url: message.wallet_url || '',
                amount: message.amount || '',
                payout_ref: message.payout_ref || '',
                bank_short: message.bank_short || '',
                remaining_seats: message.remaining_seats || '',
                hold_minutes: message.hold_minutes || '',
                experience_url: message.experience_url || ''
            }
        };
        console.log('🚀 OneSignal payload:', JSON.stringify(oneSignalPayload, null, 2));


        // Send notification via OneSignal
        const response = await oneSignalClient.createNotification(oneSignalPayload);
        console.log('✅ OneSignal notification sent successfully:', response.body);
        return response;
    } catch (error) {
        console.error('❌ Error sending OneSignal notification:', error);
        if (error.statusCode === 400) {
            console.log('⚠️  Invalid request - Check player ID or payload format');
        } else if (error.statusCode === 401) {
            console.log('⚠️  OneSignal authentication failed - Check REST API Key');
        } else if (error.statusCode === 404) {
            console.log('⚠️  OneSignal player ID not found or invalid');
        }
        throw error; // Re-throw to allow caller to handle
    }
};



const sendEventBookingNotification = async (res, user_id, data) => {

    const msg = {
        title: data.title,
        first_name: data.first_name,
        last_name: data.last_name,
        description: data.description,
        userId: data.userId,
        profile_image: data.profile_image,
        event_id: data.event_id,
        book_id: data.book_id,
        notification_type: data.notification_type,
        status: data.status
    };
    return pushNotification(res, 2, user_id, msg);
};
const sendEventBookingAcceptNotification = async (res, user_id, data) => {
    const msg = {
        title: data.title,
        first_name: data.first_name,
        last_name: data.last_name,
        description: data.description,
        userId: data.userId,
        profile_image: data.profile_image,
        event_id: data.event_id,
        book_id: data.book_id,
        notification_type: data.notification_type,
        status: data.status

    };
    return pushNotification(res, 1, user_id, msg);
};


module.exports = { pushNotification, sendEventBookingNotification, sendEventBookingAcceptNotification };
