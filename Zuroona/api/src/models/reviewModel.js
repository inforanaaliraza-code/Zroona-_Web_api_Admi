const mongoose = require("mongoose");
const reviewEventSchema = new mongoose.Schema(
	{
		event_id: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		description: {
			type: String,
		},
		rating: {
			type: Number,
		},
	},
	{ timestamps: true }
);
const Review = mongoose.model(
	"event_review",
	reviewEventSchema,
	"event_review"
);

module.exports = Review;
