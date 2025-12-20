import { getData, postRawData, postFormData } from "../index";

// Helper function to create FormData for file uploads
const createFormData = (data, file) => {
    const formData = {};
    
    // Add all data fields
    Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
            formData[key] = data[key];
        }
    });
    
    // Add file if provided
    if (file) {
        formData['file'] = file;
    }
    
    return formData;
};

// Get all conversations
export const GetConversationsApi = async (params) => {
    try {
        const response = await getData("user/conversations", params);
        return response;
    } catch (error) {
        console.error("GetConversationsApi error:", error);
        throw error;
    }
};

// Get messages for a specific conversation
export const GetMessagesApi = async (params) => {
    try {
        const response = await getData("user/messages", params);
        return response;
    } catch (error) {
        console.error("GetMessagesApi error:", error);
        throw error;
    }
};

// Send a message
export const SendMessageApi = async (payload) => {
    try {
        const response = await postRawData("user/message/send", payload);
        return response;
    } catch (error) {
        console.error("SendMessageApi error:", error);
        throw error;
    }
};

// Send a message with attachment (image/file)
export const SendMessageWithAttachmentApi = async (payload, file) => {
    try {
        const formData = createFormData(payload, file);
        const response = await postFormData("user/message/send-with-attachment", formData);
        return response;
    } catch (error) {
        console.error("SendMessageWithAttachmentApi error:", error);
        throw error;
    }
};

// Get or create conversation
export const GetOrCreateConversationApi = async (params) => {
    try {
        const response = await getData("user/conversation/get-or-create", params);
        return response;
    } catch (error) {
        console.error("GetOrCreateConversationApi error:", error);
        throw error;
    }
};

// Get unread message count
export const GetUnreadMessageCountApi = async () => {
    try {
        const response = await getData("user/messages/unread-count");
        return response;
    } catch (error) {
        console.error("GetUnreadMessageCountApi error:", error);
        throw error;
    }
};

// Organizer APIs
export const GetConversationsOrganizerApi = async (params) => {
    try {
        const response = await getData("organizer/conversations", params);
        return response;
    } catch (error) {
        console.error("GetConversationsOrganizerApi error:", error);
        throw error;
    }
};

export const GetMessagesOrganizerApi = async (params) => {
    try {
        const response = await getData("organizer/messages", params);
        return response;
    } catch (error) {
        console.error("GetMessagesOrganizerApi error:", error);
        throw error;
    }
};

export const SendMessageOrganizerApi = async (payload) => {
    try {
        const response = await postRawData("organizer/message/send", payload);
        return response;
    } catch (error) {
        console.error("SendMessageOrganizerApi error:", error);
        throw error;
    }
};

export const SendMessageWithAttachmentOrganizerApi = async (payload, file) => {
    try {
        const formData = createFormData(payload, file);
        const response = await postFormData("organizer/message/send-with-attachment", formData);
        return response;
    } catch (error) {
        console.error("SendMessageWithAttachmentOrganizerApi error:", error);
        throw error;
    }
};

export const GetOrCreateConversationOrganizerApi = async (params) => {
    try {
        const response = await getData("organizer/conversation/get-or-create", params);
        return response;
    } catch (error) {
        console.error("GetOrCreateConversationOrganizerApi error:", error);
        throw error;
    }
};

export const GetUnreadMessageCountOrganizerApi = async () => {
    try {
        const response = await getData("organizer/messages/unread-count");
        return response;
    } catch (error) {
        console.error("GetUnreadMessageCountOrganizerApi error:", error);
        throw error;
    }
};

// Get group chat for an event
export const GetGroupChatApi = async (eventId) => {
    try {
        const response = await getData("user/group-chat", { event_id: eventId });
        return response;
    } catch (error) {
        console.error("GetGroupChatApi error:", error);
        throw error;
    }
};

export const GetGroupChatOrganizerApi = async (eventId) => {
    try {
        const response = await getData("organizer/group-chat", { event_id: eventId });
        return response;
    } catch (error) {
        console.error("GetGroupChatOrganizerApi error:", error);
        throw error;
    }
};

