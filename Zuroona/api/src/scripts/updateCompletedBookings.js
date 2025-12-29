/**
 * Script to automatically update booking status to "Completed" (5)
 * when event date has passed
 * 
 * Run this script periodically (e.g., via cron job) to mark bookings as completed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const BookEventService = require('../services/bookEventService');
const EventService = require('../services/eventService');
const NotificationService = require('../services/notificationService');

const updateCompletedBookings = async () => {
    try {
        console.log('[AUTO-COMPLETE] Starting to update completed bookings...');

        // Connect to database
        const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error('MongoDB URI not configured');
        }

        await mongoose.connect(mongoURI);
        console.log('[AUTO-COMPLETE] Connected to database');

        // Find all confirmed bookings (status 2) for events that have ended
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Start of today

        const bookings = await BookEventService.AggregateService([
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
                    'book_status': 2, // Confirmed
                    'event.event_date': { $lt: currentDate },
                    'event.is_delete': { $ne: 1 }
                }
            }
        ]);

        console.log(`[AUTO-COMPLETE] Found ${bookings.length} bookings to mark as completed`);

        let updatedCount = 0;

        for (const booking of bookings) {
            // Update booking status to completed (5)
            await BookEventService.FindByIdAndUpdateService(booking._id, {
                book_status: 5, // Completed
            });

            // Send notification to user
            try {
                const event = booking.event || {};
                await NotificationService.CreateService({
                    user_id: booking.user_id,
                    role: 1, // User role
                    title: 'Event Completed',
                    description: `The event "${event.event_name || 'your event'}" has been completed. Thank you for attending!`,
                    isRead: false,
                    notification_type: 5, // Event completion type
                    event_id: booking.event_id,
                    book_id: booking._id,
                });
            } catch (notifError) {
                console.error(`[AUTO-COMPLETE] Error sending notification for booking ${booking._id}:`, notifError);
            }

            updatedCount++;
            console.log(`[AUTO-COMPLETE] Updated booking ${booking._id} to completed`);
        }

        console.log(`[AUTO-COMPLETE] Completed! Updated ${updatedCount} bookings to completed status`);

        await mongoose.disconnect();
        return { success: true, updatedCount };

    } catch (error) {
        console.error('[AUTO-COMPLETE] Error:', error);
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
        throw error;
    }
};

// Run if called directly
if (require.main === module) {
    updateCompletedBookings()
        .then((result) => {
            console.log('[AUTO-COMPLETE] Script completed successfully:', result);
            process.exit(0);
        })
        .catch((error) => {
            console.error('[AUTO-COMPLETE] Script failed:', error);
            process.exit(1);
        });
}

module.exports = updateCompletedBookings;

