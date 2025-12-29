const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
    image: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    countryCode: {
        type: String,
    },
    mobileNumber: {
        type: Number,
    },
    email: {
        type: String,
    },
    otp: {
        type: String,
        default:'123456'
    },
    gender: {
        type: Number,
    },
    dateOfBirth: {
        type: Date,
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    bio: {
        type: String,
    },
    role: {
        type: Number,
        default: 3,
    },
    password: {
        type: String
    },
    language: {
        type:String,
        default: 'en',
    }
}, { timestamps: true });

const Admin = mongoose.model('admin', adminSchema);

module.exports = Admin;