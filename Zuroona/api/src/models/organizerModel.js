const mongoose = require("mongoose");

const OrganizerSchema = new mongoose.Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    address: {
        type: String,
    },
    country_code: {
        type: String
    },
    phone_number: {
        type: Number
    },
    gender: {
        type: Number,
        enum: [1, 2,3],
    },
    email: {
        type: String
    },
    password: {
        type: String,
        required: false, // Password is now optional (passwordless authentication)
        select: false, // Don't return password in queries by default
    },
    date_of_birth: {
        type: Date,
    },
    bio: {
        type: String,
    },
    govt_id: {
        type: String,
    },

    group_location: [
        {
            location: {
                type: {
                    type: String,
                    enum: ['Point'],
                    default: 'Point'
                },
                coordinates: {
                    type: [Number],
                    default: [0, 0],
                }
            },
            city_name: {
                type: String
            }
        }
    ],

    group_category: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    group_name: {
        type: String,
    },

    profile_image: {
        type: String,
    },
    role: {
        type: Number,
        default: 2,
        enum: [2]
    },
    otp: {
        type: String,
        default: '123456'
    },
    registration_step: {
        type: Number,
        enum: [1, 2, 3, 4],
        default: 1
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
    
    isActive:{
        type:Number,
        enum: [1, 2],
        default: 1
    },
    is_approved: {
        type: Number,
        enum: [1, 2,3],/* Allowed values are :2 - approved 3 - not approved */
        default: 1
    },
    registration_type: {
        type: String,
        enum: ['New', 'Re-apply'],
        default: 'New'
    },
    is_suspended: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });

const Organizer = mongoose.model('organizer', OrganizerSchema);

module.exports = Organizer;
