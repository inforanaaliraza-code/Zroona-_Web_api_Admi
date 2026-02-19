const Event = require("../models/eventModel.js");
const Organizer = require("../models/organizerModel.js");
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
			const _total = await Event.countDocuments(query);

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
				is_approved: 1,
				event_date: { $gt: new Date() },
				// Exclude cancelled events from Events of the Week (All Events tab)
				is_cancelled: { $nin: [true, 1] },
				$or: [
					{ event_status: { $exists: false } },
					{ event_status: null },
					{ event_status: { $ne: "cancelled" } },
				],
			})
				.populate({
					path: "organizer_id",
					select: "first_name last_name profile_image",
					model: "organizer",
				})
				.select(
					"event_name event_description event_image event_images event_date event_start_time event_end_time event_address event_price organizer_id event_for is_cancelled event_status"
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
								// Include all user bookings (including cancelled) so Cancelled tab can show them
								const userBooking = await BookEventService.AggregateService([
									{
										$match: {
											event_id: event._id,
											user_id: userId,
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
					select: "first_name last_name profile_image _id",
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

				// Rename organizer_id to organizer and ensure _id is included
				event.organizer = {
					...event.organizer_id,
					_id: event.organizer_id._id, // Ensure _id is explicitly included
					id: event.organizer_id._id.toString(), // Also include as string for compatibility
				};
				delete event.organizer_id;
			}

		// Calculate available seats
		const bookedSeatsResult = await BookEventService.AggregateService([
			{
				$match: {
					event_id: new mongoose.Types.ObjectId(eventId),
					book_status: { $in: [1, 2] }, // 1 = pending, 2 = confirmed (exclude cancelled/rejected)
				},
			},
			{
				$group: {
					_id: null,
					totalBooked: { $sum: "$no_of_attendees" },
				},
			},
		]);

		const totalBookedSeats = bookedSeatsResult.length > 0 ? (bookedSeatsResult[0].totalBooked || 0) : 0;
		const totalSeats = event.no_of_attendees || 0;
		const availableSeats = totalSeats - totalBookedSeats;

		// Add capacity information to event object
		event.total_seats = totalSeats;
		event.booked_seats = totalBookedSeats;
		event.available_seats = Math.max(0, availableSeats); // Never show negative

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

			// If category is provided, filter by it (now accepts string categories)
			if (categoryId) {
				// Support both string categories (new format) and ObjectId (old format for backward compatibility)
				query.event_category = mongoose.Types.ObjectId.isValid(categoryId) 
					? { $in: [categoryId, new mongoose.Types.ObjectId(categoryId)] }
					: categoryId;
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

	getOrganizerDetails: async (organizerId) => {
		try {
			if (!mongoose.Types.ObjectId.isValid(organizerId)) {
				throw new Error("Invalid organizer ID format");
			}

			console.log("[ORGANIZER-DETAILS] Fetching organizer with ID:", organizerId);

			// Query organizer - Organizer schema doesn't have is_delete field, so we don't filter by it
			const organizer = await Organizer.findOne({
				_id: new mongoose.Types.ObjectId(organizerId)
			})
				.select("first_name last_name profile_image bio email phone_number country_code _id")
				.lean();

			if (!organizer) {
				console.log("[ORGANIZER-DETAILS] Organizer not found in database");
				throw new Error("Organizer not found");
			}

			console.log("[ORGANIZER-DETAILS] Organizer found:", {
				id: organizer._id,
				name: `${organizer.first_name} ${organizer.last_name}`,
				hasBio: !!organizer.bio
			});

			// Get organizer rating
			organizer.rating = await UserReviewService.GetUserOverallRating(
				organizer._id,
				"Organizer"
			);

			console.log("[ORGANIZER-DETAILS] Organizer rating:", organizer.rating);

			return organizer;
		} catch (error) {
			console.error("[ORGANIZER-DETAILS] Service error:", error.message);
			console.error("[ORGANIZER-DETAILS] Error stack:", error.stack);
			throw new Error(
				error.message === "Organizer not found"
					? error.message
					: "Could not fetch organizer details"
			);
		}
	},
};

module.exports = LandingPageService;
