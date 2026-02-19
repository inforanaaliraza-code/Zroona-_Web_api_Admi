const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    role: {
        type: Number,
        enum: [1, 2, 3] // 1=User, 2=Organizer, 3=Admin
    },
    title: {
        type: String,
    },
    title_ar: {
        type: String,
    },
    description: {
        type: String,
    },
    description_ar: {
        type: String,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    profile_image: {
        type: String,
    },
    username: {
        type: String,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    notification_type: {
        type: Number,
    },
    status:{
        type: Number,
    }
}, { timestamps: true });

const Notification = mongoose.model('notification', notificationSchema, 'notification');
module.exports = Notification;