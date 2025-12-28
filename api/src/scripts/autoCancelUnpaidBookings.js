/**
 * Script to automatically cancel bookings that were confirmed (status = 2)
 * but have not been paid within 6 hours
 * 
 * Run this script periodically (e.g., every hour via cron job or setInterval)
 * to auto-cancel unpaid confirmed bookings
 */

require('dotenv').config();
const mongoose = require('mongoose');
const BookEventService = require('../services/bookEventService');
const EventService = require('../services/eventService');
const NotificationService = require('../services/notificationService');

const autoCancelUnpaidBookings = async () => {
    try {
        console.log('[AUTO-CANCEL-UNPAID] Starting to check for unpaid confirmed bookings...');

        // Connect to database
        const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error('MongoDB URI not configured');
        }

        await mongoose.connect(mongoURI);
        console.log('[AUTO-CANCEL-UNPAID] Connected to database');

        // Calculate 6 hours ago
        const sixHoursAgo = new Date();
        sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);

        // Find all bookings that are:
        // - Confirmed (book_status = 2)
        // - Not paid (payment_status = 0)
        // - Confirmed more than 6 hours ago (confirmed_at < sixHoursAgo)
        const bookingsToCancel = await BookEventService.AggregateService([
            {
                $match: {
                    book_status: 2, // Confirmed
                    payment_status: 0, // Unpaid
                    confirmed_at: { $exists: true, $lt: sixHoursAgo }
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
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            }
        ]);

        console.log(`[AUTO-CANCEL-UNPAID] Found ${bookingsToCancel.length} bookings to cancel`);

        let cancelledCount = 0;

        for (const booking of bookingsToCancel) {
            try {
                // Update booking status to cancelled (3)
                await BookEventService.FindByIdAndUpdateService(booking._id, {
                    book_status: 3, // Cancelled
                });

                // Update event attendees count (add back the cancelled tickets)
                if (booking.event && booking.event._id) {
                    const event = await EventService.FindOneService({ _id: booking.event._id });
                    if (event && event.no_of_attendees !== undefined) {
                        event.no_of_attendees = (event.no_of_attendees || 0) + (booking.no_of_attendees || 0);
                        await event.save();
                    }
                }

                // Send notification to user
                try {
                    const event = booking.event || {};
                    await NotificationService.CreateService({
                        user_id: booking.user_id,
                        role: 1, // User role
                        title: 'Booking Cancelled',
                        description: `Your booking for "${event.event_name || 'the event'}" has been automatically cancelled because payment was not completed within 6 hours of confirmation.`,
                        isRead: false,
                        notification_type: 3, // Booking cancellation type
                        event_id: booking.event_id,
                        book_id: booking._id,
                    });
                } catch (notifError) {
                    console.error(`[AUTO-CANCEL-UNPAID] Error sending notification for booking ${booking._id}:`, notifError);
                }

                cancelledCount++;
                console.log(`[AUTO-CANCEL-UNPAID] Cancelled booking ${booking._id} - User: ${booking.user?.first_name || 'N/A'}, Event: ${booking.event?.event_name || 'N/A'}`);
            } catch (bookingError) {
                console.error(`[AUTO-CANCEL-UNPAID] Error processing booking ${booking._id}:`, bookingError);
            }
        }

        console.log(`[AUTO-CANCEL-UNPAID] Completed! Cancelled ${cancelledCount} unpaid bookings`);

        await mongoose.disconnect();
        return { success: true, cancelledCount };

    } catch (error) {
        console.error('[AUTO-CANCEL-UNPAID] Error:', error);
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
        throw error;
    }
};

// Run if called directly
if (require.main === module) {
    autoCancelUnpaidBookings()
        .then((result) => {
            console.log('[AUTO-CANCEL-UNPAID] Script completed successfully:', result);
            process.exit(0);
        })
        .catch((error) => {
            console.error('[AUTO-CANCEL-UNPAID] Script failed:', error);
            process.exit(1);
        });
}

module.exports = autoCancelUnpaidBookings;

