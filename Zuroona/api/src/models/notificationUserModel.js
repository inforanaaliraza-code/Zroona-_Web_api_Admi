const mongoose = require('mongoose');


const notification_users = new mongoose.Schema({
  notification_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });


const NotificationUsers = mongoose.model('notification_users', notification_users, 'notification_users');
module.exports = NotificationUsers;