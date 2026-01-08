const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	seq: {
		type: Number,
		default: 0,
	},
});

const Counter = mongoose.model("counter", counterSchema);

const bookEventSchema = new mongoose.Schema(
	{
		event_id: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		no_of_attendees: {
			type: Number,
			required: true,
		},
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		total_amount_attendees: {
			type: Number,
			required: true,
		},
		total_tax_attendees: {
			type: Number,
			required: true,
		},
		total_amount: {
			type: Number,
			required: true,
		},
		book_status: {
			type: Number,
			enum: [1, 2, 3, 4, 5, 6], // 1 pending, 2 confirmed, 3 cancelled, 4 rejected, 5 completed, 6 refunded
			default: 1,
		},
		refund_request_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'refund_request',
			default: null,
		},
		payment_status: {
			type: Number,
			enum: [0, 1], // 0 pending, 1 paid , 2 unpaid
			default: 0,
		},
		organizer_id: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		payment_id: {
			type: String,
		},
		order_id: {
			type: String,
		},
		payment_data: {
			type: Object,
			default: null,
		},
		invoice_id: {
			type: String,
			default: null,
		},
		invoice_url: {
			type: String,
			default: null,
		},
		rejection_reason: {
			type: String,
			default: null,
		},
		confirmed_at: {
			type: Date,
			default: null,
		},
		hold_expires_at: {
			type: Date,
			default: null,
		},
	},
	{ timestamps: true }
);

bookEventSchema.pre("save", async function (next) {
	if (this.isNew) {
		const counter = await Counter.findOneAndUpdate(
			{ name: "order_id" },
			{ $inc: { seq: 1 } },
			{ new: true, upsert: true }
		);
		this.order_id = `JN-OD-${counter.seq}`;
	}
	next();
});

const BookEvent = mongoose.model("book_event", bookEventSchema, "book_event");

module.exports = BookEvent;
