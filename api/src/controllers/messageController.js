const Response = require('../helpers/response.js');
const MessageService = require('../services/messageService.js');
const ConversationService = require('../services/conversationService.js');
const UserService = require('../services/userService.js');
const OrganizerService = require('../services/organizerService.js');
const EventService = require('../services/eventService.js');
const BookEventService = require('../services/bookEventService.js');
const resp_messages = require('../helpers/resp_messages.js');
const mongoose = require('mongoose');

const MessageController = {
    // Get all conversations for a user
    getConversations: async (req, res) => {
        try {
            const userId = req.userId;
            const role = req.role; // 1=User, 2=Organizer
            const { page = 1, limit = 20 } = req.query;

            // Determine query based on role
            const query = role === 1 
                ? { user_id: userId, status: 'active' }
                : { organizer_id: userId, status: 'active' };

            const conversations = await ConversationService.FindService(
                query,
                parseInt(page),
                parseInt(limit)
            );

            const total = await ConversationService.CountService(query);

            return Response.ok(res, {
                conversations,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / parseInt(limit))
                }
            }, 200, 'Conversations fetched successfully');

        } catch (error) {
            console.error('getConversations error:', error);
            return Response.serverErrorResponse(
                res,
                resp_messages(req.lang).internalServerError
            );
        }
    },

    // Get messages for a specific conversation
    getMessages: async (req, res) => {
        try {
            const userId = req.userId;
            const role = req.role;
            const { conversation_id } = req.query;
            const { page = 1, limit = 50 } = req.query;

            if (!conversation_id) {
                return Response.badRequestResponse(
                    res,
                    'Conversation ID is required'
                );
            }

            // Verify conversation exists and user has access
            const conversation = await ConversationService.FindOneService({
                _id: conversation_id
            });

            if (!conversation) {
                return Response.notFoundResponse(
                    res,
                    'Conversation not found'
                );
            }

            // Check if user has access to this conversation
            const hasAccess = role === 1
                ? conversation.user_id._id.toString() === userId.toString()
                : conversation.organizer_id._id.toString() === userId.toString();

            if (!hasAccess) {
                return Response.unauthorizedResponse(
                    res,
                    'You do not have access to this conversation'
                );
            }

            // Get messages
            const messages = await MessageService.FindService(
                { conversation_id },
                parseInt(page),
                parseInt(limit)
            );

            const total = await MessageService.CountService({ conversation_id });

            // Mark messages as read
            if (role === 1) {
                await MessageService.UpdateManyService(
                    { conversation_id, sender_role: 2, isRead: false },
                    { isRead: true, readAt: new Date() }
                );
                await ConversationService.FindByIdAndUpdateService(
                    conversation_id,
                    { unread_count_user: 0 }
                );
            } else {
                await MessageService.UpdateManyService(
                    { conversation_id, sender_role: 1, isRead: false },
                    { isRead: true, readAt: new Date() }
                );
                await ConversationService.FindByIdAndUpdateService(
                    conversation_id,
                    { unread_count_organizer: 0 }
                );
            }

            return Response.ok(res, {
                messages,
                conversation,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / parseInt(limit))
                }
            }, 200, 'Messages fetched successfully');

        } catch (error) {
            console.error('getMessages error:', error);
            return Response.serverErrorResponse(
                res,
                resp_messages(req.lang).internalServerError
            );
        }
    },

    // Send a message
    sendMessage: async (req, res) => {
        try {
            const userId = req.userId;
            const role = req.role;
            const { event_id, message, receiver_id, is_group_chat } = req.body;

            // Check if this is a group chat request
            const isGroupChat = is_group_chat === true;

            if (!event_id || !message) {
                return Response.badRequestResponse(
                    res,
                    'Event ID and message are required'
                );
            }

            // receiver_id is only required for one-on-one chats
            if (!isGroupChat && !receiver_id) {
                return Response.badRequestResponse(
                    res,
                    'Receiver ID is required for one-on-one conversations'
                );
            }

            // Verify event exists
            const event = await EventService.FindOneService({ _id: event_id });
            if (!event) {
                return Response.notFoundResponse(
                    res,
                    'Event not found'
                );
            }

            let conversation;
            let user_id, organizer_id;
            
            // For group chats, skip user_id/organizer_id validation
            if (!isGroupChat) {
                // Determine user_id and organizer_id based on sender role (for one-on-one chats)
                if (role === 1) {
                    // Sender is user, receiver is organizer
                    user_id = userId;
                    organizer_id = receiver_id;
                    
                    // Verify receiver is the event organizer
                    if (event.organizer_id.toString() !== receiver_id.toString()) {
                        return Response.badRequestResponse(
                            res,
                            'Invalid receiver ID'
                        );
                    }
                } else {
                    // Sender is organizer, receiver is user
                    user_id = receiver_id;
                    organizer_id = userId;
                    
                    // Verify sender is the event organizer
                    if (event.organizer_id.toString() !== userId.toString()) {
                        return Response.unauthorizedResponse(
                            res,
                            'You are not authorized to message about this event'
                        );
                    }
                }
            }
            
            if (isGroupChat) {
                // Handle group chat message
                conversation = await ConversationService.GetGroupChatByEventService(event_id);
                
                if (!conversation) {
                    return Response.notFoundResponse(
                        res,
                        'Group chat not found for this event'
                    );
                }

                // Check if group chat is closed
                const isClosed = await ConversationService.IsGroupChatClosedService(conversation._id);
                if (isClosed) {
                    return Response.badRequestResponse(
                        res,
                        'This group chat has been closed. Messages can no longer be sent.'
                    );
                }

                // Verify user is a participant in the group
                const isParticipant = conversation.participants.some(
                    p => p.user_id.toString() === userId.toString() && !p.left_at
                );
                
                if (!isParticipant) {
                    return Response.unauthorizedResponse(
                        res,
                        'You are not a participant in this group chat'
                    );
                }
            } else {
                // Handle one-on-one conversation
                conversation = await ConversationService.FindOrCreateService(
                    { event_id, user_id, organizer_id },
                    {
                        event_id,
                        user_id,
                        organizer_id,
                        last_message: message.substring(0, 100),
                        last_message_at: new Date(),
                        last_sender_id: userId,
                        last_sender_role: role
                    }
                );
            }

            // Create message
            const newMessage = await MessageService.CreateService({
                conversation_id: conversation._id,
                sender_id: userId,
                sender_role: role,
                message,
                message_type: 'text'
            });

            // Update conversation
            const updateData = {
                last_message: message.substring(0, 100),
                last_message_at: new Date(),
                last_sender_id: userId,
                last_sender_role: role
            };

            // Check if this is a group chat (update if conversation confirms it's a group)
            const isGroupChatFinal = isGroupChat || conversation.is_group === true;

            if (isGroupChatFinal) {
                // For group chats, increment unread count for all participants except sender
                if (conversation.participants && conversation.participants.length > 0) {
                    conversation.participants.forEach(participant => {
                        if (participant.user_id.toString() !== userId.toString() && !participant.left_at) {
                            if (participant.role === 1) {
                                updateData.unread_count_user = (conversation.unread_count_user || 0) + 1;
                            } else {
                                updateData.unread_count_organizer = (conversation.unread_count_organizer || 0) + 1;
                            }
                        }
                    });
                }
            } else {
                // For one-on-one conversations
                if (role === 1) {
                    updateData.unread_count_organizer = (conversation.unread_count_organizer || 0) + 1;
                } else {
                    updateData.unread_count_user = (conversation.unread_count_user || 0) + 1;
                }
            }

            await ConversationService.FindByIdAndUpdateService(
                conversation._id,
                updateData
            );

            // Get updated conversation with populated fields
            const updatedConversation = await ConversationService.FindOneService({
                _id: conversation._id
            });

            return Response.ok(res, {
                message: newMessage,
                conversation: updatedConversation
            }, 200, 'Message sent successfully');

        } catch (error) {
            console.error('sendMessage error:', error);
            return Response.serverErrorResponse(
                res,
                resp_messages(req.lang).internalServerError
            );
        }
    },

    // Get or create conversation (for starting a chat from event page)
    getOrCreateConversation: async (req, res) => {
        try {
            const userId = req.userId;
            const role = req.role;
            const { event_id, other_user_id } = req.query;

            if (!event_id) {
                return Response.badRequestResponse(
                    res,
                    'Event ID is required'
                );
            }

            // Verify event exists
            const event = await EventService.FindOneService({ _id: event_id });
            if (!event) {
                return Response.notFoundResponse(
                    res,
                    'Event not found'
                );
            }

            // Determine user_id and organizer_id
            let user_id, organizer_id;
            
            if (role === 1) {
                // Current user is guest
                user_id = userId;
                organizer_id = event.organizer_id;
            } else {
                // Current user is organizer
                organizer_id = userId;
                user_id = other_user_id || null;
                
                if (!user_id) {
                    return Response.badRequestResponse(
                        res,
                        'User ID is required when organizer initiates conversation'
                    );
                }
            }

            // Find or create conversation
            const conversation = await ConversationService.FindOrCreateService(
                { event_id, user_id, organizer_id },
                {
                    event_id,
                    user_id,
                    organizer_id,
                    last_message: '',
                    last_message_at: new Date()
                }
            );

            return Response.ok(res, conversation, 200, 'Conversation retrieved successfully');

        } catch (error) {
            console.error('getOrCreateConversation error:', error);
            return Response.serverErrorResponse(
                res,
                resp_messages(req.lang).internalServerError
            );
        }
    },

    // Get unread message count
    getUnreadCount: async (req, res) => {
        try {
            const userId = req.userId;
            const role = req.role;

            const query = role === 1
                ? { user_id: userId, unread_count_user: { $gt: 0 } }
                : { organizer_id: userId, unread_count_organizer: { $gt: 0 } };

            const conversations = await ConversationService.FindService(query, 1, 100);
            
            const totalUnread = conversations.reduce((sum, conv) => {
                return sum + (role === 1 ? conv.unread_count_user : conv.unread_count_organizer);
            }, 0);

            return Response.ok(res, {
                unread_count: totalUnread,
                conversations_with_unread: conversations.length
            }, 200, 'Unread count fetched successfully');

        } catch (error) {
            console.error('getUnreadCount error:', error);
            return Response.serverErrorResponse(
                res,
                resp_messages(req.lang).internalServerError
            );
        }
    },

    // Get group chat for an event
    getGroupChat: async (req, res) => {
        try {
            const { event_id } = req.query;
            const userId = req.userId;
            const role = req.role;

            if (!event_id) {
                return Response.badRequestResponse(
                    res,
                    'Event ID is required'
                );
            }

            const groupChat = await ConversationService.GetGroupChatByEventService(event_id);

            if (!groupChat) {
                return Response.notFoundResponse(
                    res,
                    'Group chat not found for this event'
                );
            }

            // Verify user is a participant (organizer is always a participant)
            const isParticipant = role === 2 || groupChat.participants.some(
                p => p.user_id.toString() === userId.toString() && !p.left_at
            );

            if (!isParticipant) {
                return Response.unauthorizedResponse(
                    res,
                    'You are not a participant in this group chat'
                );
            }

            // Check if group is closed
            const isClosed = await ConversationService.IsGroupChatClosedService(groupChat._id);

            return Response.ok(res, {
                conversation: groupChat,
                is_closed: isClosed
            }, 200, 'Group chat retrieved successfully');

        } catch (error) {
            console.error('getGroupChat error:', error);
            return Response.serverErrorResponse(
                res,
                resp_messages(req.lang).internalServerError
            );
        }
    }
};

module.exports = MessageController;

