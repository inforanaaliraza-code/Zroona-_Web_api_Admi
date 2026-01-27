/**
 * Refund Request Model
 * 
 * Tracks refund requests submitted by users for cancelled bookings
 */

const mongoose = require("mongoose");

const refundRequestSchema = new mongoose.Schema(
	{
		booking_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'book_event',
			required: true,
		},
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
			required: true,
		},
		event_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'event',
			required: true,
		},
		organizer_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'organizer',
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		refund_reason: {
			type: String,
			required: true,
		},
		status: {
			type: Number,
			enum: [0, 1, 2, 3], // 0 pending, 1 approved, 2 rejected, 3 processed
			default: 0,
		},
		admin_response: {
			type: String,
			default: null,
		},
		processed_by: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'admin',
			default: null,
		},
		processed_at: {
			type: Date,
			default: null,
		},
		payment_refund_id: {
			type: String,
			default: null,
		},
		refund_transaction_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'transaction',
			default: null,
		},
		refund_error: {
			type: String,
			default: null,
		},
	},
	{ timestamps: true }
);

// Index for faster queries
refundRequestSchema.index({ user_id: 1, status: 1 });
refundRequestSchema.index({ booking_id: 1 });
refundRequestSchema.index({ status: 1 });

const RefundRequest = mongoose.model("refund_request", refundRequestSchema, "refund_request");

module.exports = RefundRequest;

