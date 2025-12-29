const Conversation = require('../models/conversationModel.js');
// Ensure Event model is registered before using populate
require('../models/eventModel.js');

const ConversationService = {
    CreateService: async (value) => {
        try {
            const result = await Conversation.create(value);
            return result;
        } catch (error) {
            console.error('CreateService error:', error.message);
            throw new Error('Could not create conversation');
        }
    },

    FindService: async (query, page = 1, limit = 20) => {
        try {
            const skip = (page - 1) * limit;
            const result = await Conversation.find(query)
                .populate('event_id', 'event_name event_image event_type event_date event_end_time')
                .populate('user_id', 'first_name last_name profile_image')
                .populate('organizer_id', 'first_name last_name profile_image')
                .populate('participants.user_id', 'first_name last_name profile_image')
                .sort({ last_message_at: -1 }) // Most recent first
                .skip(skip)
                .limit(limit);
            return result;
        } catch (error) {
            console.error('FindService error:', error.message);
            throw new Error('Could not find conversations');
        }
    },

    FindOneService: async (query) => {
        try {
            const result = await Conversation.findOne(query)
                .populate('event_id', 'event_name event_image event_type event_date event_address')
                .populate('user_id', 'first_name last_name profile_image email phone')
                .populate('organizer_id', 'first_name last_name profile_image email phone');
            return result;
        } catch (error) {
            console.error('FindOneService error:', error.message);
            throw new Error('Could not find conversation');
        }
    },

    FindByIdAndUpdateService: async (id, value) => {
        try {
            const result = await Conversation.findByIdAndUpdate(id, value, { new: true })
                .populate('event_id', 'event_name event_image event_type')
                .populate('user_id', 'first_name last_name profile_image')
                .populate('organizer_id', 'first_name last_name profile_image');
            return result;
        } catch (error) {
            console.error('FindByIdAndUpdateService error:', error.message);
            throw new Error('Could not update conversation');
        }
    },

    FindOrCreateService: async (query, value) => {
        try {
            let conversation = await Conversation.findOne(query)
                .populate('event_id', 'event_name event_image event_type event_date')
                .populate('user_id', 'first_name last_name profile_image')
                .populate('organizer_id', 'first_name last_name profile_image');
            
            if (!conversation) {
                conversation = await Conversation.create(value);
                conversation = await Conversation.findById(conversation._id)
                    .populate('event_id', 'event_name event_image event_type event_date')
                    .populate('user_id', 'first_name last_name profile_image')
                    .populate('organizer_id', 'first_name last_name profile_image');
            }
            
            return conversation;
        } catch (error) {
            console.error('FindOrCreateService error:', error.message);
            throw new Error('Could not find or create conversation');
        }
    },

    CountService: async (query) => {
        try {
            const count = await Conversation.countDocuments(query);
            return count;
        } catch (error) {
            console.error('CountService error:', error.message);
            throw new Error('Could not count conversations');
        }
    },

    // Group Chat Methods
    CreateGroupChatService: async (eventId, organizerId, eventName) => {
        try {
            const groupChat = await Conversation.create({
                event_id: eventId,
                organizer_id: organizerId,
                is_group: true,
                group_name: `${eventName} - Group Chat`,
                participants: [{
                    user_id: organizerId,
                    role: 2, // Organizer
                    joined_at: new Date()
                }],
                status: 'active'
            });
            
            return await Conversation.findById(groupChat._id)
                .populate('event_id', 'event_name event_image event_type event_date event_address event_end_time')
                .populate('organizer_id', 'first_name last_name profile_image')
                .populate('participants.user_id', 'first_name last_name profile_image');
        } catch (error) {
            console.error('CreateGroupChatService error:', error.message);
            throw new Error('Could not create group chat');
        }
    },

    AddParticipantToGroupService: async (eventId, userId, role = 1) => {
        try {
            const groupChat = await Conversation.findOne({
                event_id: eventId,
                is_group: true
            });

            if (!groupChat) {
                throw new Error('Group chat not found for this event');
            }

            // Check if participant already exists
            const existingParticipant = groupChat.participants.find(
                p => p.user_id.toString() === userId.toString() && !p.left_at
            );

            if (existingParticipant) {
                return groupChat; // Already a participant
            }

            // Add new participant
            groupChat.participants.push({
                user_id: userId,
                role: role,
                joined_at: new Date()
            });

            await groupChat.save();

            return await Conversation.findById(groupChat._id)
                .populate('event_id', 'event_name event_image event_type event_date event_address event_end_time')
                .populate('organizer_id', 'first_name last_name profile_image')
                .populate('participants.user_id', 'first_name last_name profile_image');
        } catch (error) {
            console.error('AddParticipantToGroupService error:', error.message);
            throw new Error('Could not add participant to group chat');
        }
    },

    CloseGroupChatService: async (eventId) => {
        try {
            const groupChat = await Conversation.findOne({
                event_id: eventId,
                is_group: true,
                status: 'active'
            });

            if (!groupChat) {
                return null;
            }

            groupChat.status = 'closed';
            groupChat.closed_at = new Date();
            await groupChat.save();

            return groupChat;
        } catch (error) {
            console.error('CloseGroupChatService error:', error.message);
            throw new Error('Could not close group chat');
        }
    },

    IsGroupChatClosedService: async (conversationId) => {
        try {
            const conversation = await Conversation.findById(conversationId)
                .populate('event_id', 'event_date event_end_time');
            
            if (!conversation || !conversation.is_group) {
                return false;
            }

            // Check if explicitly closed
            if (conversation.status === 'closed' || conversation.closed_at) {
                return true;
            }

            // Check if should be auto-closed based on event end time
            if (conversation.event_id && conversation.event_id.event_date && conversation.event_id.event_end_time) {
                const eventDate = new Date(conversation.event_id.event_date);
                const [hours, minutes] = conversation.event_id.event_end_time.split(':').map(Number);
                eventDate.setHours(hours, minutes, 0, 0);
                
                const autoCloseTime = new Date(eventDate);
                autoCloseTime.setHours(autoCloseTime.getHours() + (conversation.auto_close_after_hours || 24));
                
                if (new Date() > autoCloseTime) {
                    // Auto-close the group
                    await ConversationService.CloseGroupChatService(conversation.event_id);
                    return true;
                }
            }

            return false;
        } catch (error) {
            console.error('IsGroupChatClosedService error:', error.message);
            return false;
        }
    },

    GetGroupChatByEventService: async (eventId) => {
        try {
            const groupChat = await Conversation.findOne({
                event_id: eventId,
                is_group: true
            })
                .populate('event_id', 'event_name event_image event_type event_date event_address event_end_time')
                .populate('organizer_id', 'first_name last_name profile_image')
                .populate('participants.user_id', 'first_name last_name profile_image');
            
            return groupChat;
        } catch (error) {
            console.error('GetGroupChatByEventService error:', error.message);
            throw new Error('Could not find group chat');
        }
    },
};

module.exports = ConversationService;

