const express = require("express");
const router = express.Router();
const UserReviewController = require("../controllers/userReviewController");
const { AuthenticateUser } = require("../middleware/authenticate");

// Create a new review
router.post("/", AuthenticateUser, UserReviewController.createReview);

// Get reviews for a user or organizer
router.get("/:entityType/:entityId", UserReviewController.getEntityReviews);

// Get overall rating for a user or organizer
router.get("/rating/:userType/:userId", UserReviewController.getUserRating);

// Update a review
router.put("/:reviewId", AuthenticateUser, UserReviewController.updateReview);

// Delete a review
router.delete("/:reviewId", AuthenticateUser, UserReviewController.deleteReview);

module.exports = router;
