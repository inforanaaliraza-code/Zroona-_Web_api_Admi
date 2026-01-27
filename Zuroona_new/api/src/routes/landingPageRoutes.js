const express = require("express");
const router = express.Router();
const LandingPageController = require("../controllers/landingPageController");
const { ExtractUserIdFromToken } = require("../middleware/authenticate");

// Route to get paginated events with optional filters
router.get("/events", LandingPageController.getEvents);

// Route to get featured events - Extract userId from token if available (optional auth)
router.get("/featured-events", ExtractUserIdFromToken, LandingPageController.getFeaturedEvents);

// Route to get event details - using our new middleware
router.get(
	"/events/:eventId",
	ExtractUserIdFromToken,
	LandingPageController.getEventDetails
);

// Route to get similar events
router.get(
	"/events/:eventId/similar",
	ExtractUserIdFromToken,
	LandingPageController.getSimilarEvents
);

// Route to get organizer/host details (public)
router.get(
	"/organizer/:organizerId",
	LandingPageController.getOrganizerDetails
);

module.exports = router;