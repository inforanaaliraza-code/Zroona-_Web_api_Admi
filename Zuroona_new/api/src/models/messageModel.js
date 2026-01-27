const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'conversation',
        required: true,
    },
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    sender_role: {
        type: Number,
        enum: [1, 2], // 1=User, 2=Organizer
        required: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    message_type: {
        type: String,
        enum: ['text', 'image', 'file'],
        default: 'text',
    },
    attachment_url: {
        type: String,
        default: null,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    readAt: {
        type: Date,
        default: null,
    }
}, { timestamps: true });

// Index for faster queries
messageSchema.index({ conversation_id: 1, createdAt: -1 });
messageSchema.index({ sender_id: 1 });

const Message = mongoose.model('message', messageSchema, 'messages');
module.exports = Message;

