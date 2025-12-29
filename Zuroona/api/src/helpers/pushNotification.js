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

        const data = {
            profile_image: message.profile_image || '',
            username: `${message.first_name} ${message.last_name}`,
            userId: message.userId,
            event_id: message.event_id || null,
            book_id: message.book_id || null,
            notification_type: message.notification_type,
            status: message.status
        };

        // Create notification in database
        const notification = await NotificationService.CreateService({
            user_id: userId,
            role,
            title: message.title,
            description: message.description,
            profile_image: message.profile_image,
            senderId: message.userId,
            event_id: message.event_id,
            notification_type: message.notification_type,
            book_id: message.book_id,
            status: message.status
        });

        // OneSignal notification payload
        const oneSignalPayload = {
            include_player_ids: [user.fcm_token], // OneSignal player ID
            headings: {
                en: message.title,
                ar: message.title
            },
            contents: {
                en: message.description,
                ar: message.description
            },
            data: {
                userId: userId.toString(),
                role: role.toString(),
                profile_image: message.profile_image || '',
                username: message.user_name || '',
                senderId: message.userId ? message.userId.toString() : '',
                event_id: message.event_id ? message.event_id.toString() : '',
                book_id: message.book_id ? message.book_id.toString() : '',
                notification_type: message.notification_type || '',
                status: message.status || ''
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
