const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userReviewSchema = new Schema(
	{
		reviewer_id: {
			type: Schema.Types.ObjectId,
			required: true,
			refPath: "reviewer_type",
		},
		reviewer_type: {
			type: String,
			required: true,
			enum: ["User", "Organizer"],
		},
		reviewed_id: {
			type: Schema.Types.ObjectId,
			required: true,
			refPath: "reviewed_type",
		},
		reviewed_type: {
			type: String,
			required: true,
			enum: ["User", "Organizer"],
		},
		rating: {
			type: Number,
			required: true,
			min: 1,
			max: 5,
		},
		description: {
			type: String,
		},
		is_delete: {
			type: Number,
			enum: [0, 1],
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

// Compound index to ensure one review per reviewer-reviewed pair
userReviewSchema.index(
	{
		reviewer_id: 1,
		reviewed_id: 1,
		is_delete: 1,
	},
	{ unique: true }
);

// Static method for calculating average rating
userReviewSchema.statics.calculateAverageRating = async function (id, type) {
	const avg = await this.aggregate([
		{
			$match: {
				reviewed_id: new mongoose.Types.ObjectId(id),
				reviewed_type: type,
				is_delete: 0,
			},
		},
		{
			$group: {
				_id: null,
				averageRating: { $avg: "$rating" },
				totalReviews: { $sum: 1 },
			},
		},
	]);
	return avg.length > 0 ? avg[0] : { averageRating: 0, totalReviews: 0 };
};

const UserReview = mongoose.model(
	"user_review",
	userReviewSchema,
	"user_review"
);
module.exports = UserReview;
