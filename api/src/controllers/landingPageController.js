const Response = require("../helpers/response");
const LandingPageService = require("../services/landingPageService");
const resp_messages = require("../helpers/resp_messages");
const mongoose = require("mongoose");
const { verifyToken } = require("../helpers/generateToken");

const LandingPageController = {
	getEvents: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const page = parseInt(req.query.page) || 1;
			const limit = parseInt(req.query.limit) || 10;

			// Handle filters from query parameters
			const filters = {};
			if (req.query.startDate)
				filters.startDate = new Date(req.query.startDate);
			if (req.query.endDate)
				filters.endDate = new Date(req.query.endDate);
			if (req.query.minPrice)
				filters.minPrice = parseFloat(req.query.minPrice);
			if (req.query.maxPrice)
				filters.maxPrice = parseFloat(req.query.maxPrice);

			const result = await LandingPageService.getEventsForLanding(
				page,
				limit,
				filters
			);

			return Response.ok(
				res,
				result,
				200,
				resp_messages?.[lang]?.events_fetched_successfully ||
					"Events fetched successfully"
			);
		} catch (error) {
			console.error("Landing page controller error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages?.[lang]?.internalServerError ||
					"Something went wrong"
			);
		}
	},

	getFeaturedEvents: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const limit = parseInt(req.query.limit) || 50; // Increased default limit
			
			// Get userId from middleware (ExtractUserIdFromToken) - optional, can be null
			const userId = req.userId || null;
			
			if (userId) {
				console.log("[FEATURED-EVENTS] User authenticated, will include booking status");
			} else {
				console.log("[FEATURED-EVENTS] No user token, showing events without booking status");
			}
			
			const featuredEvents = await LandingPageService.getFeaturedEvents(
				limit,
				userId
			);

			console.log("[FEATURED-EVENTS] Fetched events:", featuredEvents?.length || 0);

			// Ensure we always return an array, even if empty
			const eventsArray = Array.isArray(featuredEvents) 
				? featuredEvents 
				: featuredEvents?.events || [];

			return Response.ok(
				res,
				eventsArray, // Return array directly for easier frontend handling
				200,
				resp_messages?.[lang]?.featured_events_fetched_successfully ||
					"Featured events fetched successfully"
			);
		} catch (error) {
			console.error("[FEATURED-EVENTS] Controller error:", error);
			// Return empty array on error instead of error response to prevent frontend loading issues
			return Response.ok(
				res,
				[],
				200,
				"Events fetched (empty result)"
			);
		}
	},

	getEventDetails: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			const { eventId } = req.params;
			const { userId } = req;

			// Validate eventId format
			if (!mongoose.Types.ObjectId.isValid(eventId)) {
				// If it's a dummy event ID, return empty data (frontend handles dummy events)
				if (eventId.startsWith('dummy')) {
					return Response.ok(
						res,
						null,
						200,
						"Dummy event - handled by frontend"
					);
				}
				return Response.validationErrorResponse(
					res,
					resp_messages?.[lang]?.invalid_event_id ||
						"Invalid event ID"
				);
			}

			const event = await LandingPageService.getEventDetails(
				eventId,
				userId
			);
			return Response.ok(
				res,
				event,
				200,
				resp_messages?.[lang]?.event_details_fetched ||
					"Event details fetched successfully"
			);
		} catch (error) {
			console.error("Get event details error:", error);
			if (error === "Event not found") {
				return Response.notFoundResponse(
					res,
					resp_messages?.[lang]?.event_not_found || "Event not found"
				);
			}
			return Response.serverErrorResponse(
				res,
				resp_messages?.[lang]?.internalServerError ||
					"Something went wrong"
			);
		}
	},

	getSimilarEvents: async (req, res) => {
		const lang = req.headers["lang"] || "en";
		try {
			console.log("getSimilarEvents called with params:", req.params);
			console.log("Query parameters:", req.query);
			console.log("User ID:", req.userId);

			const { eventId } = req.params;
			const { event_category } = req.query;
			const { userId } = req;

			// Validate eventId format
			if (!mongoose.Types.ObjectId.isValid(eventId)) {
				console.log("Invalid event ID format:", eventId);
				// If it's a dummy event ID, return empty array (frontend handles similar events for dummies)
				if (eventId.startsWith('dummy')) {
					return Response.ok(
						res,
						[],
						200,
						"Dummy event - no similar events"
					);
				}
				return Response.validationErrorResponse(
					res,
					resp_messages?.[lang]?.invalid_event_id ||
						"Invalid event ID"
				);
			}

			// Get similar events based on category or random events if no category
			const similarEvents = await LandingPageService.getSimilarEvents(
				eventId,
				event_category,
				userId
			);

			console.log(`Found ${similarEvents.length} similar events`);

			return Response.ok(
				res,
				similarEvents,
				200,
				resp_messages?.[lang]?.similar_events_fetched ||
					"Similar events fetched successfully"
			);
		} catch (error) {
			console.error("Get similar events error:", error);
			return Response.serverErrorResponse(
				res,
				resp_messages?.[lang]?.internalServerError ||
					"Something went wrong"
			);
		}
	},
};

module.exports = LandingPageController;
