/**
 * Script to send review prompts to guests after events
 * Sends review prompts at T+6h and T+72h after event completion
 * 
 * Run this script periodically (e.g., every hour via cron job or setInterval)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const BookEventService = require('../services/bookEventService');
const EventService = require('../services/eventService');
const UserService = require('../services/userService');
const OrganizerService = require('../services/organizerService');
const ReviewService = require('../services/reviewService');
const notificationHelper = require('../helpers/notificationService');

const sendReviewPrompts = async () => {
    try {
        console.log('[REVIEW-PROMPT] Starting to check for completed bookings needing review prompts...');

        // Connect to database if not already connected
        const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error('MongoDB URI not configured');
        }

        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(mongoURI);
            console.log('[REVIEW-PROMPT] Connected to database');
        }

        const now = new Date();

        // Calculate time windows
        const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000); // T+6h
        const sixHoursAgoPlusOneHour = new Date(sixHoursAgo.getTime() + 60 * 60 * 1000); // T+6h to T+7h window
        const seventyTwoHoursAgo = new Date(now.getTime() - 72 * 60 * 60 * 1000); // T+72h
        const seventyTwoHoursAgoPlusOneHour = new Date(seventyTwoHoursAgo.getTime() + 60 * 60 * 1000); // T+72h to T+73h window

        // Find all completed bookings (status 5) that:
        // - Have event_date in the past
        // - Are within the review prompt time windows (T+6h or T+72h)
        // - Guest hasn't submitted a review yet
        const bookingsForReview = await BookEventService.AggregateService([
            {
                $lookup: {
                    from: 'events',
                    localField: 'event_id',
                    foreignField: '_id',
                    as: 'event'
                }
            },
            {
                $unwind: '$event'
            },
            {
                $match: {
                    'book_status': 5, // Completed
                    'event.event_date': { $exists: true, $lt: now },
                    'event.is_delete': { $ne: 1 },
                    $or: [
                        // T+6h window (6-7 hours after event)
                        {
                            'event.event_date': {
                                $gte: sixHoursAgo,
                                $lt: sixHoursAgoPlusOneHour
                            }
                        },
                        // T+72h window (72-73 hours after event)
                        {
                            'event.event_date': {
                                $gte: seventyTwoHoursAgo,
                                $lt: seventyTwoHoursAgoPlusOneHour
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'guest'
                }
            },
            {
                $unwind: '$guest'
            },
            {
                $lookup: {
                    from: 'organizers',
                    localField: 'organizer_id',
                    foreignField: '_id',
                    as: 'organizer'
                }
            },
            {
                $unwind: '$organizer'
            }
        ]);

        console.log(`[REVIEW-PROMPT] Found ${bookingsForReview.length} bookings eligible for review prompts`);

        let promptCount = 0;

        for (const booking of bookingsForReview) {
            try {
                const event = booking.event || {};
                const guest = booking.guest || {};
                const organizer = booking.organizer || {};

                // Check if guest has already submitted a review for this booking
                const existingReview = await ReviewService.FindOneService({
                    user_id: guest._id,
                    book_id: booking._id
                });

                if (existingReview) {
                    console.log(`[REVIEW-PROMPT] Guest ${guest._id} already reviewed booking ${booking._id}, skipping`);
                    continue;
                }

                // Check if we've already sent a review prompt notification for this booking
                // (to avoid sending multiple notifications)
                const NotificationService = require('../services/notificationService');
                const existingNotification = await NotificationService.FindOneService({
                    user_id: guest._id,
                    book_id: booking._id,
                    notification_type: 9 // Review prompt type
                });

                if (existingNotification) {
                    // Check if this is the second prompt (T+72h) - we allow one more
                    const eventDate = new Date(event.event_date);
                    const hoursSinceEvent = (now - eventDate) / (1000 * 60 * 60);
                    
                    if (hoursSinceEvent < 70) {
                        // Still in T+6h window, skip
                        console.log(`[REVIEW-PROMPT] Already sent T+6h prompt for booking ${booking._id}, skipping`);
                        continue;
                    }
                    // If we're in T+72h window and already sent, check if it was the T+72h one
                    if (hoursSinceEvent >= 72 && hoursSinceEvent < 73) {
                        // Check notification timestamp to see if it was sent in T+72h window
                        const notifDate = new Date(existingNotification.createdAt);
                        const hoursSinceNotif = (now - notifDate) / (1000 * 60 * 60);
                        if (hoursSinceNotif < 1) {
                            // Just sent, skip
                            console.log(`[REVIEW-PROMPT] Already sent T+72h prompt for booking ${booking._id}, skipping`);
                            continue;
                        }
                    }
                }

                // Send review prompt notification
                await notificationHelper.sendReviewPrompt({
                    guest_first_name: guest.first_name || 'Guest',
                    host_first_name: organizer.first_name || 'Host',
                    experience_title: event.event_name || 'Experience',
                    event_name: event.event_name || 'Experience',
                    experience_id: event._id,
                    event_id: event._id,
                    book_id: booking._id,
                    booking_id: booking._id
                }, guest);

                promptCount++;
                console.log(`[REVIEW-PROMPT] Sent review prompt to guest ${guest._id} for booking ${booking._id}`);
            } catch (promptError) {
                console.error(`[REVIEW-PROMPT] Error sending prompt for booking ${booking._id}:`, promptError);
            }
        }

        console.log(`[REVIEW-PROMPT] Completed! Sent ${promptCount} review prompts`);

        return { success: true, promptCount };

    } catch (error) {
        console.error('[REVIEW-PROMPT] Error:', error);
        throw error;
    }
};

// Run if called directly
if (require.main === module) {
    sendReviewPrompts()
        .then((result) => {
            console.log('[REVIEW-PROMPT] Script completed successfully:', result);
            process.exit(0);
        })
        .catch((error) => {
            console.error('[REVIEW-PROMPT] Script failed:', error);
            process.exit(1);
        });
}

module.exports = sendReviewPrompts;

