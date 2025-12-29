const mongoose = require("mongoose");

const EmailVerificationTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'user_type' // Dynamic reference based on user_type
    },
    user_type: {
        type: String,
        required: true,
        enum: ['user', 'organizer', 'admin'], // 'user' for guest, 'organizer' for host, 'admin' for admin
    },
    email: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: true
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    usedAt: {
        type: Date,
        default: null
    },
    token_type: {
        type: String,
        enum: ['email_verification', 'password_reset'],
        default: 'email_verification'
    }
}, { timestamps: true });

// Index for faster lookup
EmailVerificationTokenSchema.index({ token: 1, isUsed: 1 });
EmailVerificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired tokens

const EmailVerificationToken = mongoose.model('email_verification_token', EmailVerificationTokenSchema);

module.exports = EmailVerificationToken;

