const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event', // Must match the model name exactly
        required: true,
    },
    booking_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'book_event',
        default: null,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: function() {
            return !this.is_group; // Required only for non-group conversations
        },
    },
    organizer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organizer',
        required: true,
    },
    // Group chat fields
    is_group: {
        type: Boolean,
        default: false,
    },
    group_name: {
        type: String,
        default: null,
    },
    participants: [{
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        role: {
            type: Number,
            enum: [1, 2], // 1=User/Guest, 2=Organizer
            required: true,
        },
        joined_at: {
            type: Date,
            default: Date.now,
        },
        left_at: {
            type: Date,
            default: null,
        }
    }],
    closed_at: {
        type: Date,
        default: null, // When group chat is closed after event ends
    },
    auto_close_after_hours: {
        type: Number,
        default: 24, // Default: close 24 hours after event ends
    },
    last_message: {
        type: String,
        default: '',
    },
    last_message_at: {
        type: Date,
        default: Date.now,
    },
    last_sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
    },
    last_sender_role: {
        type: Number,
        enum: [1, 2], // 1=User, 2=Organizer
        default: null,
    },
    unread_count_user: {
        type: Number,
        default: 0,
    },
    unread_count_organizer: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['active', 'archived', 'blocked', 'closed'],
        default: 'active',
    }
}, { timestamps: true });

// Indexes for faster queries
conversationSchema.index({ user_id: 1, last_message_at: -1 });
conversationSchema.index({ organizer_id: 1, last_message_at: -1 });
conversationSchema.index({ event_id: 1 });
conversationSchema.index({ event_id: 1, is_group: 1 }); // For finding group chats by event
conversationSchema.index({ 'participants.user_id': 1 }); // For finding groups by participant

// Ensure unique conversation per event per user-organizer pair (only for non-group chats)
conversationSchema.index({ event_id: 1, user_id: 1, organizer_id: 1 }, { 
    unique: true,
    partialFilterExpression: { is_group: false }
});

// Ensure one group chat per event
conversationSchema.index({ event_id: 1, is_group: 1 }, { 
    unique: true,
    partialFilterExpression: { is_group: true }
});

const Conversation = mongoose.model('conversation', conversationSchema, 'conversations');
module.exports = Conversation;

