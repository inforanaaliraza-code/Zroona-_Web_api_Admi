const admin = require('../config/config.js');
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

        const data = {
            profile_image: message.profile_image || '',
            username: `${message.first_name} ${message.last_name}`,
            userId: message.userId,
            event_id: message.event_id || null,
            book_id: message.book_id || null,
            notification_type: message.notification_type,
            status: message.status
        };

        const payload = {
            notification: {
                title: message.title,
                body: message.description,
            },
            data: {
                data: JSON.stringify({
                    userId: userId,
                    role,
                    profile_image: message.profile_image,
                    username: message.user_name,
                    senderId: message.userId,
                    event_id: message.event_id,
                    book_id: message.book_id,
                    notification_type: message.notification_type,
                    status: message.status
                })
            },
            token: user.fcm_token,
        };
        console.log('start', payload, 'payload data');


        const notification = await NotificationService.CreateService({
            user_id: userId,
            role,
            title: message.title,
            description: message.description,
            role,
            profile_image: message.profile_image,
            senderId: message.userId,
            event_id: message.event_id,
            notification_type: message.notification_type,
            book_id: message.book_id,
            status: message.status

        });


        const response = await admin.messaging().send(payload);
        console.log(response, 'notification send success');
        return response;
    } catch (error) {
        console.log(error, ' error sending notification')
        if (error.code == 'messaging/mismatched-credential') {
            // return resp.bad_request(res, {}, 400, 'SenderId mismatch - Please update your FCM token');
            console.log('SenderId mismatch - Please update your FCM token')
        }
        if (error.code == 'messaging/registration-token-not-registered') {
            // return resp.bad_request(res, {}, 400, 'FCM token is invalid or expired');
            console.log('FCM token is invalid or expired')
        }
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
