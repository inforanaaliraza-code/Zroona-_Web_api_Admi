const Response = require("../helpers/response");
const UserReviewService = require("../services/userReviewService");
const resp_messages = require("../helpers/resp_messages");

const getRequesterContext = (req) => {
	const requesterId =
		req.user?._id?.toString?.() ||
		(req.userId ? req.userId.toString() : null);
	const requesterRole = req.user?.role || req.role || null;

	return { requesterId, requesterRole };
};

const UserReviewController = {
	createReview: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const { reviewed_id, reviewed_type, rating, description } =
				req.body;

			// Validate rating
			if (!rating || rating < 1 || rating > 5) {
				return Response.validationErrorResponse(
					res,
					resp_messages?.[lang]?.invalid_rating ||
						"Rating must be between 1 and 5"
				);
			}

			// Validate reviewed_type
			if (
				!reviewed_type ||
				!["User", "Organizer"].includes(reviewed_type)
			) {
				return Response.validationErrorResponse(
					res,
					resp_messages?.[lang]?.invalid_reviewed_type ||
						"Invalid reviewed type"
				);
			}

			const { requesterId, requesterRole } = getRequesterContext(req);

			if (!requesterId || !requesterRole) {
				return Response.unauthorizedResponse(
					res,
					{},
					401,
					"Authentication required"
				);
			}

			// Set reviewer type based on role (1 for User, 2 for Organizer)
			const reviewer_type = requesterRole === 1 ? "User" : "Organizer";

			// Prevent self-review
			if (reviewed_id.toString() === requesterId.toString()) {
				return Response.validationErrorResponse(
					res,
					resp_messages?.[lang]?.cannot_review_self ||
						"You cannot review yourself"
				);
			}

			// Check if review already exists
			const existingReview = await UserReviewService.FindOneService({
				reviewer_id: requesterId,
				reviewed_id,
				is_delete: 0,
			});

			if (existingReview) {
				return Response.conflictResponse(
					res,
					{},
					409,
					resp_messages?.[lang]?.review_already_exists ||
						"You have already reviewed this user/organizer"
				);
			}

			const reviewData = {
				reviewer_id: requesterId,
				reviewer_type,
				reviewed_id,
				reviewed_type,
				rating,
				description,
			};

			const review = await UserReviewService.CreateService(reviewData);
			return Response.ok(
				res,
				review,
				201,
				resp_messages?.[lang]?.review_created ||
					"Review created successfully"
			);
		} catch (error) {
			console.error("Review creation error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages?.[lang]?.internalServerError ||
					"Something went wrong"
			);
		}
	},

	getEntityReviews: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const { entityId, entityType } = req.params;
			const page = parseInt(req.query.page) || 1;
			const limit = parseInt(req.query.limit) || 10;

			if (!["User", "Organizer"].includes(entityType)) {
				return Response.validationErrorResponse(
					res,
					resp_messages?.[lang]?.invalid_entity_type ||
						"Invalid entity type"
				);
			}

			const result = await UserReviewService.GetEntityReviews(
				entityId,
				entityType,
				page,
				limit
			);
			return Response.ok(
				res,
				result,
				200,
				resp_messages?.[lang]?.reviews_fetched ||
					"Reviews fetched successfully"
			);
		} catch (error) {
			console.error("Get reviews error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages?.[lang]?.internalServerError ||
					"Something went wrong"
			);
		}
	},

	updateReview: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const reviewId = req.params.reviewId;
			const { rating, description } = req.body;
			const { requesterId } = getRequesterContext(req);

			if (!requesterId) {
				return Response.unauthorizedResponse(
					res,
					{},
					401,
					"Authentication required"
				);
			}

			// Validate rating if provided
			if (rating && (rating < 1 || rating > 5)) {
				return Response.validationErrorResponse(
					res,
					resp_messages?.[lang]?.invalid_rating ||
						"Rating must be between 1 and 5"
				);
			}

			// Check if review exists and belongs to the user
			const existingReview = await UserReviewService.FindOneService({
				_id: reviewId,
				reviewer_id: requesterId,
				is_delete: 0,
			});

			if (!existingReview) {
				return Response.notFoundResponse(
					res,
					resp_messages?.[lang]?.review_not_found ||
						"Review not found"
				);
			}

			const updatedReview =
				await UserReviewService.FindByIdAndUpdateService(reviewId, {
					rating: rating || existingReview.rating,
					description: description || existingReview.description,
				});

			return Response.ok(
				res,
				updatedReview,
				200,
				resp_messages?.[lang]?.review_updated ||
					"Review updated successfully"
			);
		} catch (error) {
			console.error("Update review error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages?.[lang]?.internalServerError ||
					"Something went wrong"
			);
		}
	},

	deleteReview: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const reviewId = req.params.reviewId;
			const { requesterId } = getRequesterContext(req);

			if (!requesterId) {
				return Response.unauthorizedResponse(
					res,
					{},
					401,
					"Authentication required"
				);
			}

			// Check if review exists and belongs to the user
			const existingReview = await UserReviewService.FindOneService({
				_id: reviewId,
				reviewer_id: requesterId,
				is_delete: 0,
			});

			if (!existingReview) {
				return Response.notFoundResponse(
					res,
					resp_messages?.[lang]?.review_not_found ||
						"Review not found"
				);
			}

			await UserReviewService.DeleteReview(reviewId);
			return Response.ok(
				res,
				{},
				200,
				resp_messages?.[lang]?.review_deleted ||
					"Review deleted successfully"
			);
		} catch (error) {
			console.error("Delete review error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages?.[lang]?.internalServerError ||
					"Something went wrong"
			);
		}
	},

	getUserRating: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const { userId, userType } = req.params;

			if (!["User", "Organizer"].includes(userType)) {
				return Response.validationErrorResponse(
					res,
					resp_messages?.[lang]?.invalid_entity_type ||
						"Invalid user type"
				);
			}

			const result = await UserReviewService.GetUserOverallRating(
				userId,
				userType
			);
			return Response.ok(
				res,
				result,
				200,
				resp_messages?.[lang]?.rating_fetched ||
					"Rating fetched successfully"
			);
		} catch (error) {
			console.error("Get user rating error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages?.[lang]?.internalServerError ||
					"Something went wrong"
			);
		}
	},
};

module.exports = UserReviewController;
