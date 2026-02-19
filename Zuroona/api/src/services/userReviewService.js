const UserReview = require("../models/userReviewModel.js");
const mongoose = require("mongoose");

const UserReviewService = {
	CreateService: async (value) => {
		return new Promise((res, _rej) => {
			UserReview.create(value)
				.then((result) => {
					res(result);
				})
				.catch((error) => {
					console.error(error.message);
					_rej("could not create");
				});
		});
	},

	FindOneService: async (query) => {
		return new Promise((res, _rej) => {
			UserReview.findOne(query)
				.then((result) => {
					res(result);
				})
				.catch((error) => {
					console.error(error.message);
					_rej("could not find");
				});
		});
	},

	FindService: async (page = 1, limit = 10, query) => {
		return new Promise((res, rej) => {
			const skip = (page - 1) * limit;
			UserReview.find(query)
				.skip(skip)
				.limit(limit)
				.populate("reviewer_id", "first_name last_name profile_image")
				.populate("reviewed_id", "first_name last_name profile_image")
				.then((result) => {
					res(result);
				})
				.catch((error) => {
					console.error(error.message);
					rej("could not find");
				});
		});
	},

	GetEntityReviews: async (entityId, entityType, page = 1, limit = 10) => {
		return (async () => {
			try {
				const skip = (page - 1) * limit;
				const reviews = await UserReview.find({
					reviewed_id: entityId,
					reviewed_type: entityType,
					is_delete: 0,
				})
					.skip(skip)
					.limit(limit)
					.populate(
						"reviewer_id",
						"first_name last_name profile_image"
					)
					.sort({ createdAt: -1 });

				const stats = await UserReview.calculateAverageRating(
					entityId,
					entityType
				);

				return {
					reviews,
					stats,
				};
			} catch (error) {
				console.error(error.message);
				throw new Error("could not find reviews");
			}
		})();
	},

	FindByIdAndUpdateService: async (reviewId, value) => {
		return new Promise((res, rej) => {
			UserReview.findByIdAndUpdate(reviewId, value, { new: true })
				.then((result) => {
					res(result);
				})
				.catch((error) => {
					console.error(error.message);
					rej("could not update");
				});
		});
	},

	DeleteReview: async (reviewId) => {
		return new Promise((res, rej) => {
			UserReview.findByIdAndUpdate(
				reviewId,
				{ is_delete: 1 },
				{ new: true }
			)
				.then((result) => {
					res(result);
				})
				.catch((error) => {
					console.error(error.message);
					rej("could not delete");
				});
		});
	},

	AggregateService: async (pipeline) => {
		return new Promise((res, rej) => {
			UserReview.aggregate(pipeline)
				.then((result) => {
					res(result);
				})
				.catch((error) => {
					console.error(error.message);
					rej("could not aggregate");
				});
		});
	},

	CountDocumentService: async (query = {}) => {
		return new Promise((res, rej) => {
			UserReview.countDocuments(query)
				.then((result) => {
					res(result);
				})
				.catch((error) => {
					console.error(error.message);
					rej("could not count");
				});
		});
	},

	GetUserOverallRating: async (userId, userType) => {
		return (async () => {
			try {
				// Get reviews received by the user
				const receivedReviews = await UserReview.aggregate([
					{
						$match: {
							reviewed_id: new mongoose.Types.ObjectId(userId),
							reviewed_type: userType,
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

				// Get reviews given by the user
				const givenReviews = await UserReview.aggregate([
					{
						$match: {
							reviewer_id: new mongoose.Types.ObjectId(userId),
							reviewer_type: userType,
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

				const received =
					receivedReviews.length > 0
						? receivedReviews[0]
						: { averageRating: 0, totalReviews: 0 };
				const given =
					givenReviews.length > 0
						? givenReviews[0]
						: { averageRating: 0, totalReviews: 0 };

				// Calculate overall stats
				const totalReviews = received.totalReviews + given.totalReviews;
				const overallRating =
					totalReviews > 0
						? (received.averageRating * received.totalReviews +
								given.averageRating * given.totalReviews) /
						totalReviews
						: 0;

				return {
					overall: {
						rating: Number(overallRating.toFixed(1)),
						totalReviews: totalReviews,
					},
					received: {
						rating: Number(received.averageRating.toFixed(1)),
						totalReviews: received.totalReviews,
					},
					given: {
						rating: Number(given.averageRating.toFixed(1)),
						totalReviews: given.totalReviews,
					},
				};
			} catch (error) {
				console.error(error.message);
				throw new Error("could not calculate rating");
			}
		})();
	},
};

module.exports = UserReviewService;
