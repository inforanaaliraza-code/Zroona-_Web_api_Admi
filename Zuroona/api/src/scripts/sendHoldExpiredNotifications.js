/**
 * Script to send hold expired notifications
 * Sends notifications to guests whose hold has expired (30 minutes after acceptance)
 * 
 * Run this script periodically (e.g., every 15 minutes via cron job or setInterval)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const BookEventService = require('../services/bookEventService');
const _EventService = require('../services/eventService');
const _UserService = require('../services/userService');
const notificationHelper = require('../helpers/notificationService');

const sendHoldExpiredNotifications = async () => {
    try {
        console.log('[HOLD-EXPIRED] Starting to check for expired holds...');

        if (mongoose.connection.readyState !== 1) {
            const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;
            if (!mongoURI) {
                throw new Error('MongoDB URI not configured');
            }
            await mongoose.connect(mongoURI);
            console.log('[HOLD-EXPIRED] Connected to database');
        }

        const now = new Date();

        // Find all bookings that are:
        // - Confirmed (book_status = 2)
        // - Not paid (payment_status = 0)
        // - Have hold_expires_at set and it's in the past
        const expiredHolds = await BookEventService.AggregateService([
            {
                $match: {
                    book_status: 2, // Confirmed
                    payment_status: 0, // Unpaid
                    hold_expires_at: { $exists: true, $lt: now }
                }
            },
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
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'guest'
                }
            },
            {
                $unwind: '$guest'
            }
        ]);

        console.log(`[HOLD-EXPIRED] Found ${expiredHolds.length} expired holds`);

        let notificationCount = 0;

        for (const booking of expiredHolds) {
            try {
                const event = booking.event || {};
                const guest = booking.guest || {};

                // Check if we've already sent a hold expired notification for this booking
                // (to avoid sending multiple notifications)
                const NotificationService = require('../services/notificationService');
                const existingNotification = await NotificationService.FindOneService({
                    user_id: guest._id,
                    book_id: booking._id,
                    notification_type: 8 // Hold expired type
                });

                if (existingNotification) {
                    console.log(`[HOLD-EXPIRED] Notification already sent for booking ${booking._id}, skipping`);
                    continue;
                }

                // Send hold expired notification
                await notificationHelper.sendHoldExpired({
                    guest_first_name: guest.first_name || 'Guest',
                    experience_title: event.event_name || 'Experience',
                    event_name: event.event_name || 'Experience',
                    experience_id: event._id,
                    event_id: event._id
                }, guest);

                notificationCount++;
                console.log(`[HOLD-EXPIRED] Sent notification to guest ${guest._id} for expired hold ${booking._id}`);
            } catch (notifError) {
                console.error(`[HOLD-EXPIRED] Error sending notification for booking ${booking._id}:`, notifError);
            }
        }

        console.log(`[HOLD-EXPIRED] Completed! Sent ${notificationCount} notifications`);

        return { success: true, notificationCount };

    } catch (error) {
        console.error('[HOLD-EXPIRED] Error:', error);
        throw error;
    }
};

// Run if called directly
if (require.main === module) {
    sendHoldExpiredNotifications()
        .then((result) => {
            console.log('[HOLD-EXPIRED] Script completed successfully:', result);
            process.exit(0);
        })
        .catch((error) => {
            console.error('[HOLD-EXPIRED] Script failed:', error);
            process.exit(1);
        });
}

module.exports = sendHoldExpiredNotifications;

