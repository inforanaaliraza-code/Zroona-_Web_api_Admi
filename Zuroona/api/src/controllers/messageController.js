const Response = require('../helpers/response.js');
const MessageService = require('../services/messageService.js');
const ConversationService = require('../services/conversationService.js');
const UserService = require('../services/userService.js');
const OrganizerService = require('../services/organizerService.js');
const EventService = require('../services/eventService.js');
const BookEventService = require('../services/bookEventService.js');
const resp_messages = require('../helpers/resp_messages.js');
const mongoose = require('mongoose');
const fs = require('fs');
const { uploadToS3 } = require('../utils/awsS3.js');

const MessageController = {
    // Get all conversations for a user
    getConversations: async (req, res) => {
        try {
            const userId = req.userId;
            const role = req.role; // 1=User, 2=Organizer
            const { page = 1, limit = 20 } = req.query;
            const mongoose = require('mongoose');

            // For one-on-one conversations, use role-based query
            const oneOnOneQuery = role === 1 
                ? { user_id: userId, is_group: false, status: 'active' }
                : { organizer_id: userId, is_group: false, status: 'active' };

            // Get one-on-one conversations - fetch more to ensure we have space for group chats
            const oneOnOneConversations = await ConversationService.FindService(oneOnOneQuery, 1, parseInt(limit) * 2);

            // For group chats - different logic for guests vs organizers
            let groupConversations = [];
            
            if (role === 1) {
                // GUEST: Show group chats for events where user has paid bookings
                // Strategy: First find all paid bookings, then get group chats for those events
                const BookEvent = require('../models/eventBookModel');
                
                // Step 1: Find all paid bookings for this user
                const paidBookings = await BookEvent.find({
                    user_id: new mongoose.Types.ObjectId(userId),
                    payment_status: 1, // Only paid bookings
                    book_status: { $in: [1, 2] } // Pending or Confirmed (not cancelled/rejected)
                }).select('event_id').lean();
                
                // Get event IDs from paid bookings
                const paidEventIds = paidBookings
                    .map(booking => booking.event_id?.toString())
                    .filter(Boolean);
                
                console.log(`[CONVERSATIONS-GUEST] Found ${paidBookings.length} paid bookings for user ${userId}`);
                console.log(`[CONVERSATIONS-GUEST] Event IDs with paid bookings:`, paidEventIds);
                
                if (paidEventIds.length > 0) {
                    // Step 2: Get all group chats for these events
                    const eventObjectIds = paidEventIds.map(id => new mongoose.Types.ObjectId(id));
                    
                    // Find group chats for these events
                    const allGroupChatsForEvents = await ConversationService.FindService({
                        is_group: true,
                        status: 'active',
                        event_id: { $in: eventObjectIds }
                    }, 1, 10000);
                    
                    console.log(`[CONVERSATIONS-GUEST] Found ${allGroupChatsForEvents.length} group chats for paid events`);
                    
                    // Step 3: Filter to only group chats where user is a participant OR add them if not
                    groupConversations = [];
                    
                    for (const groupChat of allGroupChatsForEvents) {
                        const eventId = (groupChat.event_id?._id || groupChat.event_id)?.toString();
                        
                        // Check if user is already a participant
                        const isParticipant = groupChat.participants?.some(p => {
                            if (!p || p.left_at) return false;
                            const participantUserId = p.user_id?._id ? p.user_id._id : p.user_id;
                            return participantUserId && participantUserId.toString() === userId.toString();
                        });
                        
                        if (isParticipant) {
                            // User is already a participant, include this group chat
                            groupConversations.push(groupChat);
                        } else {
                            // User is not a participant yet, but has paid booking
                            // This can happen if payment was completed but participant wasn't added
                            // Try to add them now, then include the group chat
                            try {
                                console.log(`[CONVERSATIONS-GUEST] User ${userId} not in participants for event ${eventId}, attempting to add...`);
                                await ConversationService.AddParticipantToGroupService(
                                    groupChat.event_id?._id || groupChat.event_id,
                                    userId,
                                    1 // Role: User/Guest
                                );
                                // Re-fetch the group chat to get updated participants
                                const updatedGroupChat = await ConversationService.GetGroupChatByEventService(
                                    groupChat.event_id?._id || groupChat.event_id
                                );
                                if (updatedGroupChat) {
                                    groupConversations.push(updatedGroupChat);
                                    console.log(`[CONVERSATIONS-GUEST] Successfully added user ${userId} to group chat for event ${eventId}`);
                                }
                            } catch (addError) {
                                // If adding fails (e.g., already added), still include the group chat
                                console.warn(`[CONVERSATIONS-GUEST] Could not add user to group chat, but including it anyway:`, addError.message);
                                groupConversations.push(groupChat);
                            }
                        }
                    }
                    
                    console.log(`[CONVERSATIONS-GUEST] Final group conversations count: ${groupConversations.length}`);
                }
            } else {
                // ORGANIZER: Show ALL group chats (no pagination limit for hosts)
                const groupChatQuery = {
                    is_group: true,
                    status: 'active',
                    organizer_id: userId
                };
                // Fetch all group chats for organizers (no limit)
                groupConversations = await ConversationService.FindService(groupChatQuery, 1, 10000);
            }
      
            // Combine and sort by last_message_at
            const allConversations = [...oneOnOneConversations, ...groupConversations]
                .sort((a, b) => {
                    const dateA = new Date(a.last_message_at || a.createdAt);
                    const dateB = new Date(b.last_message_at || b.createdAt);
                    return dateB - dateA; // Most recent first
                });
            
            // Apply limit only if specified, otherwise return all
            const finalLimit = parseInt(limit) || 1000;
            const limitedConversations = allConversations.slice(0, finalLimit);

            // Get total count
            const oneOnOneTotal = await ConversationService.CountService(oneOnOneQuery);
            let groupTotal;
            if (role === 1) {
                // For guests, count only paid group chats
                groupTotal = groupConversations.length;
            } else {
                // For organizers, count all group chats
                groupTotal = await ConversationService.CountService({
                    is_group: true,
                    status: 'active',
                    organizer_id: userId
                });
            }
            const total = oneOnOneTotal + groupTotal;

            // Debug logging
            console.log(`[CONVERSATIONS] Role: ${role === 1 ? 'Guest' : 'Organizer'}, UserId: ${userId}`);
            console.log(`[CONVERSATIONS] One-on-one: ${oneOnOneConversations.length}, Group chats: ${groupConversations.length}`);
            console.log(`[CONVERSATIONS] Total conversations: ${allConversations.length}, Limited: ${limitedConversations.length}`);
            console.log(`[CONVERSATIONS] Group chat event IDs:`, groupConversations.map(c => c.event_id?._id || c.event_id));

            return Response.ok(res, {
                conversations: limitedConversations,
                pagination: {
                    page: parseInt(page),
                    limit: finalLimit,
                    total,
                    totalPages: Math.ceil(total / finalLimit)
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
            let hasAccess = false;
            
            if (conversation.is_group === true) {
                // For group chats, check if user is a participant
                // Add null checks to prevent errors
                if (!conversation.participants || !Array.isArray(conversation.participants)) {
                    console.error('[MESSAGE] Invalid participants array in conversation:', conversation._id);
                    return Response.serverErrorResponse(
                        res,
                        'Invalid conversation data'
                    );
                }

                // Check if user is organizer (organizers have full access)
                const isOrganizer = conversation.organizer_id && conversation.organizer_id.toString() === userId.toString();
                
                // Check if user is a participant
                const isParticipant = conversation.participants.some(
                    p => p && p.user_id && p.user_id.toString() === userId.toString() && !p.left_at
                );

                if (role === 1 && isParticipant && !isOrganizer) {
                    // GUEST: Additional check - must have paid booking for this event
                    const BookEvent = require('../models/eventBookModel');
                    const eventId = conversation.event_id?._id || conversation.event_id;
                    
                    if (eventId) {
                        const paidBooking = await BookEvent.findOne({
                            user_id: new mongoose.Types.ObjectId(userId),
                            event_id: eventId,
                            payment_status: 1, // Paid
                            book_status: { $in: [1, 2] } // Pending or Confirmed
                        });
                        
                        hasAccess = !!paidBooking;
                    } else {
                        hasAccess = false;
                    }
                } else if (role === 2 || isOrganizer) {
                    // ORGANIZER: Full access to their group chats
                    hasAccess = true;
                } else {
                    hasAccess = false;
                }
            } else {
                // For one-on-one conversations, use role-based check
                // Add null checks
                if (role === 1) {
                    hasAccess = conversation.user_id && 
                        (conversation.user_id._id ? conversation.user_id._id.toString() : conversation.user_id.toString()) === userId.toString();
                } else {
                    hasAccess = conversation.organizer_id && 
                        (conversation.organizer_id._id ? conversation.organizer_id._id.toString() : conversation.organizer_id.toString()) === userId.toString();
                }
            }

            if (!hasAccess) {
                return Response.unauthorizedResponse(
                    res,
                    'You do not have access to this conversation'
                );
            }

            // Get messages
            let messages = await MessageService.FindService(
                { conversation_id },
                parseInt(page),
                parseInt(limit)
            );

            // Populate sender profiles efficiently - batch lookup by role
            const userIds = [];
            const organizerIds = [];
            messages.forEach(msg => {
                if (msg.sender_role === 1 && msg.sender_id) {
                    userIds.push(new mongoose.Types.ObjectId(msg.sender_id));
                } else if (msg.sender_role === 2 && msg.sender_id) {
                    organizerIds.push(new mongoose.Types.ObjectId(msg.sender_id));
                }
            });

            // Batch fetch users and organizers
            const User = require('../models/userModel');
            const Organizer = require('../models/organizerModel');
            
            const [users, organizers] = await Promise.all([
                userIds.length > 0 ? User.find({ _id: { $in: userIds } }).select('_id first_name last_name profile_image').lean() : [],
                organizerIds.length > 0 ? Organizer.find({ _id: { $in: organizerIds } }).select('_id first_name last_name profile_image').lean() : []
            ]);

            // Create lookup maps
            const userMap = new Map(users.map(u => [u._id.toString(), u]));
            const organizerMap = new Map(organizers.map(o => [o._id.toString(), o]));

            // Attach sender info to messages
            messages = messages.map(msg => {
                // Convert mongoose document to plain object first
                const msgObj = msg.toObject ? msg.toObject() : JSON.parse(JSON.stringify(msg));
                const senderIdStr = msgObj.sender_id?.toString();
                
                // Add sender profile based on role
                if (msgObj.sender_role === 1 && userMap.has(senderIdStr)) {
                    const user = userMap.get(senderIdStr);
                    msgObj.sender = {
                        _id: user._id,
                        first_name: user.first_name || '',
                        last_name: user.last_name || '',
                        profile_image: user.profile_image || null
                    };
                } else if (msgObj.sender_role === 2 && organizerMap.has(senderIdStr)) {
                    const organizer = organizerMap.get(senderIdStr);
                    msgObj.sender = {
                        _id: organizer._id,
                        first_name: organizer.first_name || '',
                        last_name: organizer.last_name || '',
                        profile_image: organizer.profile_image || null
                    };
                }
                
                return msgObj;
            });

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
                // Add null checks to prevent errors
                if (!conversation.participants || !Array.isArray(conversation.participants)) {
                    console.error('[MESSAGE] Invalid participants array in conversation:', conversation._id);
                    return Response.serverErrorResponse(
                        res,
                        'Invalid conversation data'
                    );
                }

                // Check if user is organizer (organizer is always a participant)
                const organizerId = conversation.organizer_id?._id || conversation.organizer_id;
                const isOrganizer = organizerId && organizerId.toString() === userId.toString();

                // Check if user is in participants list
                // Handle both populated (object with _id) and non-populated (ObjectId) user_id
                const isParticipant = conversation.participants.some(p => {
                    if (!p || p.left_at) return false;
                    
                    // Handle populated user_id (object with _id) or direct ObjectId
                    const participantUserId = p.user_id?._id ? p.user_id._id : p.user_id;
                    if (!participantUserId) return false;
                    
                    return participantUserId.toString() === userId.toString();
                });
                
                if (!isParticipant && !isOrganizer) {
                    console.error('[MESSAGE] User not a participant:', {
                        userId,
                        conversationId: conversation._id,
                        participants: conversation.participants.map(p => ({
                            user_id: p.user_id?._id || p.user_id,
                            left_at: p.left_at
                        })),
                        organizer_id: organizerId
                    });
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
                        if (!participant || participant.left_at) return;
                        
                        // Handle both populated (object with _id) and non-populated (ObjectId) user_id
                        const participantUserId = participant.user_id?._id ? participant.user_id._id : participant.user_id;
                        if (!participantUserId) return;
                        
                        if (participantUserId.toString() !== userId.toString()) {
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
            // Add null checks to prevent errors
            if (!groupChat.participants || !Array.isArray(groupChat.participants)) {
                console.error('[GROUP-CHAT] Invalid participants array in group chat:', groupChat._id);
                return Response.serverErrorResponse(
                    res,
                    'Invalid group chat data'
                );
            }

            // Check if user is organizer (role 2) or in participants list
            // Handle both populated (object with _id) and non-populated (ObjectId) user_id
            const isParticipant = role === 2 || groupChat.participants.some(p => {
                if (!p || p.left_at) return false;
                
                // Handle populated user_id (object with _id) or direct ObjectId
                const participantUserId = p.user_id?._id ? p.user_id._id : p.user_id;
                if (!participantUserId) return false;
                
                return participantUserId.toString() === userId.toString();
            });

            if (!isParticipant) {
                console.error('[GROUP-CHAT] User not a participant:', {
                    userId,
                    role,
                    conversationId: groupChat._id,
                    participants: groupChat.participants.map(p => ({
                        user_id: p.user_id?._id || p.user_id,
                        left_at: p.left_at
                    }))
                });
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
    },

    // Send message with attachment (image/file)
    sendMessageWithAttachment: async (req, res) => {
        try {
            const userId = req.userId;
            const role = req.role;
            const { event_id, message, receiver_id, is_group_chat } = req.body;

            // Validate required fields
            if (!userId) {
                return Response.unauthorizedResponse(
                    res,
                    'User ID is required. Please login again.'
                );
            }

            if (!role || (role !== 1 && role !== 2)) {
                return Response.badRequestResponse(
                    res,
                    'Invalid user role'
                );
            }

            // Check if file is uploaded
            if (!req.files || !req.files.file) {
                return Response.badRequestResponse(
                    res,
                    'File is required for attachment message'
                );
            }

            const uploadedFile = req.files.file;
            const isGroupChat = is_group_chat === true;

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

            // Determine message type based on file MIME type
            let messageType = 'file';
            if (uploadedFile.mimetype && uploadedFile.mimetype.startsWith('image/')) {
                messageType = 'image';
            }

            // Upload file to Cloudinary
            let attachmentUrl = null;
            try {
                // Read file data
                let fileData;
                let fileName;
                
                if (uploadedFile.tempFilePath) {
                    // File was saved to temp directory
                    fileData = fs.readFileSync(uploadedFile.tempFilePath);
                    fileName = uploadedFile.name || uploadedFile.tempFilePath.split('/').pop() || `attachment-${Date.now()}`;
                } else if (uploadedFile.data) {
                    // File is in memory
                    fileData = uploadedFile.data;
                    fileName = uploadedFile.name || `attachment-${Date.now()}`;
                } else {
                    return Response.badRequestResponse(
                        res,
                        'File data not found'
                    );
                }

                // Upload to AWS S3 in messages folder
                const s3Result = await uploadToS3(
                    fileData,
                    'Zuroona/messages',
                    fileName,
                    uploadedFile.mimetype || 'application/octet-stream'
                );

                attachmentUrl = s3Result.url;

                // Clean up temp file if it was used
                if (uploadedFile.tempFilePath) {
                    try {
                        fs.unlinkSync(uploadedFile.tempFilePath);
                    } catch (err) {
                        console.warn('Failed to delete temp file:', err.message);
                    }
                }
            } catch (uploadError) {
                console.error('File upload error:', uploadError);
                return Response.serverErrorResponse(
                    res,
                    `Failed to upload file: ${uploadError.message}`
                );
            }

            let conversation;
            let user_id, organizer_id;
            
            // Get organizer_id from event (handle both populated and non-populated)
            const eventOrganizerId = event.organizer_id?._id 
                ? event.organizer_id._id 
                : event.organizer_id;
            
            if (!eventOrganizerId) {
                return Response.serverErrorResponse(
                    res,
                    'Event organizer information is missing'
                );
            }
            
            // For group chats, skip user_id/organizer_id validation
            if (!isGroupChat) {
                // Validate receiver_id exists
                if (!receiver_id) {
                    return Response.badRequestResponse(
                        res,
                        'Receiver ID is required for one-on-one conversations'
                    );
                }

                // Determine user_id and organizer_id based on sender role (for one-on-one chats)
                if (role === 1) {
                    // Sender is user, receiver is organizer
                    user_id = userId;
                    organizer_id = receiver_id;
                    
                    // Verify receiver is the event organizer - safe toString comparison
                    try {
                        if (eventOrganizerId && receiver_id && 
                            typeof eventOrganizerId.toString === 'function' && 
                            typeof receiver_id.toString === 'function' &&
                            eventOrganizerId.toString() !== receiver_id.toString()) {
                            return Response.badRequestResponse(
                                res,
                                'Invalid receiver ID'
                            );
                        }
                    } catch (err) {
                        console.error('[MESSAGE] Error comparing eventOrganizerId and receiver_id:', err);
                        return Response.badRequestResponse(
                            res,
                            'Invalid receiver ID'
                        );
                    }
                } else {
                    // Sender is organizer, receiver is user
                    user_id = receiver_id;
                    organizer_id = userId;
                    
                    // Verify sender is the event organizer - safe toString comparison
                    try {
                        if (eventOrganizerId && userId && 
                            typeof eventOrganizerId.toString === 'function' && 
                            typeof userId.toString === 'function' &&
                            eventOrganizerId.toString() !== userId.toString()) {
                            return Response.unauthorizedResponse(
                                res,
                                'You are not authorized to message about this event'
                            );
                        }
                    } catch (err) {
                        console.error('[MESSAGE] Error comparing eventOrganizerId and userId:', err);
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
                // Add null checks to prevent errors
                if (!conversation.participants || !Array.isArray(conversation.participants)) {
                    console.error('[MESSAGE] Invalid participants array in conversation:', conversation._id);
                    return Response.serverErrorResponse(
                        res,
                        'Invalid conversation data'
                    );
                }

                // Validate userId exists
                if (!userId) {
                    console.error('[MESSAGE] UserId is missing in sendMessageWithAttachment');
                    return Response.unauthorizedResponse(
                        res,
                        'User ID is required. Please login again.'
                    );
                }

                // Check if user is organizer (organizer is always a participant)
                const organizerId = conversation.organizer_id?._id || conversation.organizer_id;
                
                // Safe toString comparison for organizer check
                let isOrganizer = false;
                if (organizerId && userId && typeof organizerId.toString === 'function' && typeof userId.toString === 'function') {
                    try {
                        isOrganizer = organizerId.toString() === userId.toString();
                    } catch (err) {
                        console.error('[MESSAGE] Error comparing organizer ID:', err);
                    }
                }

                // Check if user is in participants list
                // Handle both populated (object with _id) and non-populated (ObjectId) user_id
                const isParticipant = conversation.participants.some(p => {
                    if (!p || p.left_at || !userId) return false;
                    
                    // Handle populated user_id (object with _id) or direct ObjectId
                    const participantUserId = p.user_id?._id ? p.user_id._id : p.user_id;
                    if (!participantUserId) return false;
                    
                    // Safe toString comparison
                    try {
                        if (typeof participantUserId.toString === 'function' && typeof userId.toString === 'function') {
                            return participantUserId.toString() === userId.toString();
                        }
                    } catch (err) {
                        console.error('[MESSAGE] Error comparing participant user IDs:', err);
                    }
                    return false;
                });
                
                if (!isParticipant && !isOrganizer) {
                    console.error('[MESSAGE] User not a participant:', {
                        userId,
                        conversationId: conversation._id,
                        participants: conversation.participants.map(p => ({
                            user_id: p.user_id?._id || p.user_id,
                            left_at: p.left_at
                        })),
                        organizer_id: organizerId
                    });
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
                        last_message: message || `Sent ${messageType}`,
                        last_message_at: new Date(),
                        last_sender_id: userId,
                        last_sender_role: role
                    }
                );
            }

            // Validate conversation exists
            if (!conversation || !conversation._id) {
                console.error('[MESSAGE] Conversation not found or invalid:', {
                    conversation,
                    event_id,
                    isGroupChat
                });
                return Response.serverErrorResponse(
                    res,
                    'Conversation not found or invalid'
                );
            }

            // Create message with attachment
            const messageText = message || (messageType === 'image' ? '📷 Image' : '📎 File');
            
            if (!attachmentUrl) {
                console.error('[MESSAGE] Attachment URL is missing after upload');
                return Response.serverErrorResponse(
                    res,
                    'Failed to upload attachment'
                );
            }

            const newMessage = await MessageService.CreateService({
                conversation_id: conversation._id,
                sender_id: userId,
                sender_role: role,
                message: messageText,
                message_type: messageType,
                attachment_url: attachmentUrl
            });

            // Update conversation
            const updateData = {
                last_message: messageText.substring(0, 100),
                last_message_at: new Date(),
                last_sender_id: userId,
                last_sender_role: role
            };

            // Check if this is a group chat (update if conversation confirms it's a group)
            const isGroupChatFinal = isGroupChat || conversation.is_group === true;

            if (isGroupChatFinal) {
                // For group chats, increment unread count for all participants except sender
                if (conversation.participants && conversation.participants.length > 0 && userId) {
                    conversation.participants.forEach(participant => {
                        if (!participant || participant.left_at) return;
                        
                        // Handle both populated (object with _id) and non-populated (ObjectId) user_id
                        const participantUserId = participant.user_id?._id ? participant.user_id._id : participant.user_id;
                        if (!participantUserId) return;
                        
                        // Safe toString comparison
                        try {
                            if (typeof participantUserId.toString === 'function' && typeof userId.toString === 'function' && 
                                participantUserId.toString() !== userId.toString()) {
                                if (participant.role === 1) {
                                    updateData.unread_count_user = (conversation.unread_count_user || 0) + 1;
                                } else {
                                    updateData.unread_count_organizer = (conversation.unread_count_organizer || 0) + 1;
                                }
                            }
                        } catch (err) {
                            console.error('[MESSAGE] Error comparing participant user IDs in unread count:', err);
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
            }, 200, 'Message with attachment sent successfully');

        } catch (error) {
            console.error('sendMessageWithAttachment error:', error);
            console.error('Error stack:', error.stack);
            console.error('Error details:', {
                message: error.message,
                name: error.name,
                userId: req.userId,
                role: req.role,
                event_id: req.body?.event_id,
                is_group_chat: req.body?.is_group_chat
            });
            return Response.serverErrorResponse(
                res,
                error.message || resp_messages(req.lang).internalServerError
            );
        }
    }
};

module.exports = MessageController;

