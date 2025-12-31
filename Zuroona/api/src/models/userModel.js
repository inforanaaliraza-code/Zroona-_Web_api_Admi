const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    profile_image: {
        type: String,
    },
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    country_code: {
        type: String,
    },
    phone_number: {
        type: Number,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        required: false, // Password is now optional (passwordless authentication)
        select: false, // Don't return password in queries by default
    },
    gender: {
        type: Number,
        enum: [1, 2, 3],
    },
    date_of_birth: {
        type: Date,
    },
    description: {
        type: String,
    },
    is_delete: {
        type: Number,
        enum: [0, 1],
        default: 0
    },
    registration_step: {
        type: Number,
        enum: [1, 2],
        default: 1
    },
    role: {
        type: Number,
        default: 1,
        enum: [1]
    },
    otp: {
        type: String,
        default: '123456'
    },
    is_verified: {
        type: Boolean,
        default: false // Only true when both email AND phone are verified
    },
    phone_verified: {
        type: Boolean,
        default: false
    },
    phone_verified_at: {
        type: Date,
        default: null
    },
    email_verified_at: {
        type: Date,
        default: null
    },
    language: {
        type: String,
        enum: ['en', 'ar'],
        default: 'en'
    },
    fcm_token: {
        type: String,
        default: ''
    },
    device_id: {
        type: String,
        default: ''
    },
    nationality: {
        type: String,
        default: ''
    },
    isActive: {
        type: Number,
        enum: [1, 2],
        default: 1 // 1 = active, 2 = inactive
    }
}, { timestamps: true });

const User = mongoose.model('user', UserSchema);

module.exports = User;