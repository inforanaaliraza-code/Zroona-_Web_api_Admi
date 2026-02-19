/**
 * Script to send host response reminders
 * Sends reminders to hosts who haven't responded to booking requests after 12 hours
 * 
 * Run this script periodically (e.g., every hour via cron job or setInterval)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const BookEventService = require('../services/bookEventService');
const _EventService = require('../services/eventService');
const _OrganizerService = require('../services/organizerService');
const _UserService = require('../services/userService');
const notificationHelper = require('../helpers/notificationService');

const sendHostResponseReminders = async () => {
    try {
        console.log('[HOST-REMINDER] Starting to check for pending booking requests...');

        if (mongoose.connection.readyState !== 1) {
            const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;
            if (!mongoURI) {
                throw new Error('MongoDB URI not configured');
            }
            await mongoose.connect(mongoURI);
            console.log('[HOST-REMINDER] Connected to database');
        }

        // Calculate 12 hours ago
        const twelveHoursAgo = new Date();
        twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);

        // Find all bookings that are:
        // - Pending (book_status = 1)
        // - Created more than 12 hours ago
        // - Not yet responded to by host
        const pendingBookings = await BookEventService.AggregateService([
            {
                $match: {
                    book_status: 1, // Pending
                    createdAt: { $lt: twelveHoursAgo }
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
                    from: 'organizers',
                    localField: 'organizer_id',
                    foreignField: '_id',
                    as: 'organizer'
                }
            },
            {
                $unwind: '$organizer'
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

        console.log(`[HOST-REMINDER] Found ${pendingBookings.length} pending bookings requiring host response`);

        let reminderCount = 0;

        for (const booking of pendingBookings) {
            try {
                const event = booking.event || {};
                const organizer = booking.organizer || {};
                const guest = booking.guest || {};

                // Send reminder notification to host
                await notificationHelper.sendHostResponseReminder({
                    host_first_name: organizer.first_name || 'Host',
                    guest_first_name: guest.first_name || 'Guest',
                    user_first_name: guest.first_name || 'Guest',
                    experience_title: event.event_name || 'Experience',
                    event_name: event.event_name || 'Experience',
                    start_at: event.event_date || event.start_date,
                    event_date: event.event_date || event.start_date,
                    book_id: booking._id,
                    booking_id: booking._id,
                    event_id: event._id
                }, organizer);

                reminderCount++;
                console.log(`[HOST-REMINDER] Sent reminder to host ${organizer._id} for booking ${booking._id}`);
            } catch (reminderError) {
                console.error(`[HOST-REMINDER] Error sending reminder for booking ${booking._id}:`, reminderError);
            }
        }

        console.log(`[HOST-REMINDER] Completed! Sent ${reminderCount} reminders`);

        return { success: true, reminderCount };

    } catch (error) {
        console.error('[HOST-REMINDER] Error:', error);
        throw error;
    }
};

// Run if called directly
if (require.main === module) {
    sendHostResponseReminders()
        .then((result) => {
            console.log('[HOST-REMINDER] Script completed successfully:', result);
            process.exit(0);
        })
        .catch((error) => {
            console.error('[HOST-REMINDER] Script failed:', error);
            process.exit(1);
        });
}

module.exports = sendHostResponseReminders;

