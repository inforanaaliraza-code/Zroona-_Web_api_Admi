const Event = require("../models/eventModel.js");
const UserReviewService = require("./userReviewService.js");
const mongoose = require("mongoose");
const BookEventService = require("./bookEventService.js");

const LandingPageService = {
	getEventsForLanding: async (page = 1, limit = 10, filters = {}) => {
		try {
			const skip = (page - 1) * limit;

			// Build the query based on filters
			const query = {
				...filters,
				is_delete: 0,
				is_approved: 1, // Only show approved events to guests
				event_date: { $gt: new Date() },
			};

			// Convert date filters to match schema
			if (filters.startDate) {
				query.event_date = { $gte: new Date(filters.startDate) };
			}
			if (filters.endDate) {
				query.event_date = {
					...query.event_date,
					$lte: new Date(filters.endDate),
				};
			}
			
			// Time filter (event_start_time)
			if (filters.startTime) {
				query.event_start_time = { $gte: filters.startTime };
			}
			if (filters.endTime) {
				query.event_end_time = { $lte: filters.endTime };
			}
			
			// Price filter
			if (filters.minPrice || filters.maxPrice) {
				query.event_price = {};
				if (filters.minPrice) {
					query.event_price.$gte = parseFloat(filters.minPrice);
				}
				if (filters.maxPrice) {
					query.event_price.$lte = parseFloat(filters.maxPrice);
				}
			}
			
			// Location filter (city or address)
			if (filters.location || filters.city) {
				const locationQuery = filters.location || filters.city;
				query.$or = [
					{ event_address: { $regex: locationQuery, $options: 'i' } },
					{ city: { $regex: locationQuery, $options: 'i' } },
				];
			}
			
			// Geographic location filter (latitude/longitude with radius)
			if (filters.latitude && filters.longitude && filters.radius) {
				const radius = parseFloat(filters.radius) || 10; // Default 10km
				const lat = parseFloat(filters.latitude);
				const lon = parseFloat(filters.longitude);
				
				// MongoDB geospatial query
				query.location = {
					$near: {
						$geometry: {
							type: 'Point',
							coordinates: [lon, lat]
						},
						$maxDistance: radius * 1000 // Convert km to meters
					}
				};
			}

			// Get total count for pagination
			const total = await Event.countDocuments(query);

			// Fetch events with pagination
			const events = await Event.find(query)
				.populate({
					path: "organizer_id",
					select: "first_name last_name profile_image",
					model: "organizer",
				})
				.select(
					"event_name event_description event_image event_images event_date event_start_time event_end_time event_address event_price organizer_id event_for"
				)
				.sort({ event_date: 1 })
				.skip(skip)
				.limit(limit)
				.lean();

			// Get organizer ratings for all events
			const eventsWithRatings = await Promise.all(
				events.map(async (event) => {
					if (event.organizer_id) {
						event.organizer_rating =
							await UserReviewService.GetUserOverallRating(
								event.organizer_id._id,
								"Organizer"
							);
					}
					return event;
				})
			);
			
			// Filter by minimum rating if specified
			let filteredEvents = eventsWithRatings;
			if (filters.minRating) {
				const minRating = parseFloat(filters.minRating);
				filteredEvents = eventsWithRatings.filter(event => {
					const rating = event.organizer_rating?.averageRating || 0;
					return rating >= minRating;
				});
			}
			
			// Sort by rating if requested
			if (filters.sortBy === 'rating') {
				filteredEvents.sort((a, b) => {
					const ratingA = a.organizer_rating?.averageRating || 0;
					const ratingB = b.organizer_rating?.averageRating || 0;
					return ratingB - ratingA; // Descending order
				});
			}

			return {
				events: filteredEvents,
				pagination: {
					currentPage: page,
					totalPages: Math.ceil(filteredEvents.length / limit),
					totalEvents: filteredEvents.length,
					hasMore: skip + filteredEvents.length < filteredEvents.length,
				},
			};
		} catch (error) {
			console.error("Landing page service error:", error.message);
			throw new Error("Could not fetch events");
		}
	},

	getFeaturedEvents: async (limit = 5, userId = null) => {
		try {
			const events = await Event.find({
				is_delete: 0,
				is_approved: 1, // Only show approved events
				event_date: { $gt: new Date() },
			})
				.populate({
					path: "organizer_id",
					select: "first_name last_name profile_image",
					model: "organizer",
				})
				.select(
					"event_name event_description event_image event_images event_date event_start_time event_end_time event_address event_price organizer_id event_for"
				)
				.sort({ event_date: 1 })
				.limit(limit)
				.lean();

			// Get organizer ratings and user bookings for featured events
			const eventsWithRatings = await Promise.all(
				events.map(async (event) => {
					try {
						if (event.organizer_id && event.organizer_id._id) {
							event.organizer_rating =
								await UserReviewService.GetUserOverallRating(
									event.organizer_id._id,
									"Organizer"
								);
						}
						
						// If userId is provided, check for user's booking
						if (userId) {
							try {
								const BookEventService = require("./bookEventService");
								const userBooking = await BookEventService.AggregateService([
									{
										$match: {
											event_id: event._id,
											user_id: userId,
											book_status: { $ne: 3 }, // Not canceled bookings
										},
									},
									{
										$project: {
											_id: 1,
											book_status: 1,
											payment_status: 1,
											no_of_attendees: 1,
											total_amount: 1,
										},
									},
								]);
								
								if (userBooking && userBooking.length > 0) {
									event.user_booking = userBooking[0];
									event.book_status = userBooking[0].book_status;
									event.payment_status = userBooking[0].payment_status;
								}
							} catch (bookingError) {
								console.error("[FEATURED-EVENTS] Error fetching user booking:", bookingError);
								// Continue without booking info
							}
						}
					} catch (ratingError) {
						console.error("[FEATURED-EVENTS] Error fetching rating:", ratingError);
						event.organizer_rating = null; // Set to null on error
					}
					return event;
				})
			);

			console.log("[FEATURED-EVENTS] Service returning events:", eventsWithRatings.length);
			return eventsWithRatings;
		} catch (error) {
			console.error("Featured events service error:", error.message);
			throw new Error("Could not fetch featured events");
		}
	},

	getEventDetails: async (eventId, userId) => {
		try {
			// Validate and convert eventId to ObjectId
			if (!mongoose.Types.ObjectId.isValid(eventId)) {
				throw new Error("Invalid event ID format");
			}

			const event = await Event.findOne({
				_id: new mongoose.Types.ObjectId(eventId),
				is_delete: 0,
				is_approved: 1, // Only show approved events to guests
			})
				.populate({
					path: "organizer_id",
					select: "first_name last_name profile_image",
					model: "organizer",
				})
				.lean();

			if (!event) {
				throw new Error("Event not found");
			}

			// Get organizer rating and add full name
			if (event.organizer_id) {
				// Get organizer rating
				event.organizer_id.rating =
					await UserReviewService.GetUserOverallRating(
						event.organizer_id._id,
						"Organizer"
					);

				// Rename organizer_id to organizer
				event.organizer = event.organizer_id;
				delete event.organizer_id;
			}

			if (userId) {
				const bookEvent = await BookEventService.FindOneService({
					event_id: new mongoose.Types.ObjectId(eventId),
					user_id: new mongoose.Types.ObjectId(userId),
				});
				if (bookEvent) {
					event.booked_event = bookEvent;
				}
			}

			return event;
		} catch (error) {
			console.error("Event details service error:", error.message);
			throw new Error(
				error.message === "Event not found"
					? error.message
					: "Could not fetch event details"
			);
		}
	},

	getSimilarEvents: async (eventId, categoryId, userId) => {
		try {
			// Validate eventId
			if (!mongoose.Types.ObjectId.isValid(eventId)) {
				throw new Error("Invalid event ID format");
			}

			const eventObjectId = new mongoose.Types.ObjectId(eventId);
			let query = {
				_id: { $ne: eventObjectId }, // Exclude the current event
				is_delete: 0,
				is_approved: 1, // Only show approved events to guests
				event_date: { $gt: new Date() }, // Only future events
			};

			// If category is provided, filter by it
			if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
				query.event_category = new mongoose.Types.ObjectId(categoryId);
			}

			// Find similar events (by category if provided, otherwise random)
			const similarEvents = await Event.find(query)
				.populate({
					path: "organizer_id",
					select: "first_name last_name profile_image",
					model: "organizer",
				})
				.select(
					"event_name event_description event_image event_date event_start_time event_end_time event_address event_price organizer_id event_for"
				)
				.sort({ event_date: 1 })
				.limit(3) // Limit to 3 similar events
				.lean();

			// Get organizer ratings for all events
			const eventsWithRatings = await Promise.all(
				similarEvents.map(async (event) => {
					if (event.organizer_id) {
						event.organizer_rating =
							await UserReviewService.GetUserOverallRating(
								event.organizer_id._id,
								"Organizer"
							);
					}

					// Check if user has booked this event
					if (userId) {
						const bookEvent = await BookEventService.FindOneService(
							{
								event_id: event._id,
								user_id: new mongoose.Types.ObjectId(userId),
							}
						);
						if (bookEvent) {
							event.booked_event = bookEvent;
						}
					}

					return event;
				})
			);

			// If no similar events by category, get random events
			if (eventsWithRatings.length === 0) {
				const randomEvents = await Event.find({
					_id: { $ne: eventObjectId },
					is_delete: 0,
					is_approved: 1, // Only show approved events to guests
					event_date: { $gt: new Date() },
				})
					.populate({
						path: "organizer_id",
						select: "first_name last_name profile_image",
						model: "organizer",
					})
					.select(
						"event_name event_description event_image event_date event_start_time event_end_time event_address event_price organizer_id event_for"
					)
					.sort({ createdAt: -1 })
					.limit(3)
					.lean();

				// Get organizer ratings for random events
				return await Promise.all(
					randomEvents.map(async (event) => {
						if (event.organizer_id) {
							event.organizer_rating =
								await UserReviewService.GetUserOverallRating(
									event.organizer_id._id,
									"Organizer"
								);
						}

						// Check if user has booked this event
						if (userId) {
							const bookEvent =
								await BookEventService.FindOneService({
									event_id: event._id,
									user_id: new mongoose.Types.ObjectId(
										userId
									),
								});
							if (bookEvent) {
								event.booked_event = bookEvent;
							}
						}

						return event;
					})
				);
			}

			return eventsWithRatings;
		} catch (error) {
			console.error("Similar events service error:", error.message);
			throw new Error("Could not fetch similar events");
		}
	},
};

module.exports = LandingPageService;
