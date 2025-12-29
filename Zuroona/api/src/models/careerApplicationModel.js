/**
 * Career Application Model
 * Stores job applications submitted through careers page
 */

const mongoose = require('mongoose');

const careerApplicationSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    phone_number: {
        type: String,
        required: false,
        trim: true,
    },
    position: {
        type: String,
        required: true,
        trim: true,
    },
    cover_letter: {
        type: String,
        required: true,
        trim: true,
    },
    resume_url: {
        type: String,
        required: false,
        default: null,
    },
    status: {
        type: Number,
        enum: [0, 1, 2, 3], // 0: Pending, 1: Under Review, 2: Accepted, 3: Rejected
        default: 0,
    },
    notes: {
        type: String,
        default: null,
    },
    reviewed_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        default: null,
    },
    reviewed_at: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

// Index for faster queries
careerApplicationSchema.index({ email: 1 });
careerApplicationSchema.index({ status: 1 });
careerApplicationSchema.index({ position: 1 });
careerApplicationSchema.index({ createdAt: -1 });

const CareerApplication = mongoose.model('career_application', careerApplicationSchema, 'career_application');

module.exports = CareerApplication;

