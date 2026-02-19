/**
 * Auto-Close Group Chats Script
 * 
 * This script automatically closes group chats after the event ends + set time period.
 * Should be run periodically (e.g., every hour) via cron job or scheduler.
 */

// Ensure all models are registered before using them
require('../models/eventModel.js');
require('../models/conversationModel.js');
require('../models/userModel.js');
require('../models/organizerModel.js');

const ConversationService = require('../services/conversationService.js');
const EventService = require('../services/eventService.js');
const _mongoose = require('mongoose');

const autoCloseGroupChats = async () => {
    try {
        console.log('[AUTO-CLOSE] Starting auto-close group chats process...');
        
        // Find all active group chats
        const activeGroupChats = await ConversationService.FindService({
            is_group: true,
            status: 'active',
            closed_at: null
        }, 1, 1000); // Get up to 1000 group chats

        let closedCount = 0;

        for (const groupChat of activeGroupChats) {
            try {
                // Populate event if not already populated
                if (!groupChat.event_id || typeof groupChat.event_id === 'string') {
                    const event = await EventService.FindOneService({ _id: groupChat.event_id });
                    if (!event) continue;
                    groupChat.event_id = event;
                }

                const event = groupChat.event_id;
                
                if (!event.event_date || !event.event_end_time) {
                    continue; // Skip if event date/time not available
                }

                // Calculate event end time
                const eventDate = new Date(event.event_date);
                const [hours, minutes] = event.event_end_time.split(':').map(Number);
                eventDate.setHours(hours, minutes, 0, 0);
                
                // Calculate auto-close time (event end + auto_close_after_hours)
                const autoCloseTime = new Date(eventDate);
                autoCloseTime.setHours(autoCloseTime.getHours() + (groupChat.auto_close_after_hours || 24));
                
                // Check if current time is past auto-close time
                if (new Date() > autoCloseTime) {
                    await ConversationService.CloseGroupChatService(event._id);
                    closedCount++;
                    console.log(`[AUTO-CLOSE] Closed group chat for event: ${event.event_name} (${event._id})`);
                }
            } catch (error) {
                console.error(`[AUTO-CLOSE] Error processing group chat ${groupChat._id}:`, error.message);
                continue;
            }
        }

        console.log(`[AUTO-CLOSE] Process completed. Closed ${closedCount} group chat(s).`);
        return { closedCount, totalProcessed: activeGroupChats.length };
    } catch (error) {
        console.error('[AUTO-CLOSE] Fatal error:', error);
        throw error;
    }
};

// If run directly (not imported), execute the function
if (require.main === module) {
    // Connect to database
    const mongoose = require('mongoose');
    require('dotenv').config();
    
    mongoose.connect(process.env.MONGODB_URI || process.env.DATABASE_URL)
        .then(() => {
            console.log('[AUTO-CLOSE] Database connected');
            return autoCloseGroupChats();
        })
        .then((result) => {
            console.log('[AUTO-CLOSE] Result:', result);
            process.exit(0);
        })
        .catch((error) => {
            console.error('[AUTO-CLOSE] Error:', error);
            process.exit(1);
        });
}

module.exports = autoCloseGroupChats;

