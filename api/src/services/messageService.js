const Message = require('../models/messageModel.js');

const MessageService = {
    CreateService: async (value) => {
        try {
            const result = await Message.create(value);
            return result;
        } catch (error) {
            console.error('CreateService error:', error.message);
            throw new Error('Could not create message');
        }
    },

    FindService: async (query, page = 1, limit = 50) => {
        try {
            const skip = (page - 1) * limit;
            const result = await Message.find(query)
                .sort({ createdAt: 1 }) // Oldest first for chat display
                .skip(skip)
                .limit(limit);
            return result;
        } catch (error) {
            console.error('FindService error:', error.message);
            throw new Error('Could not find messages');
        }
    },

    FindOneService: async (query) => {
        try {
            const result = await Message.findOne(query);
            return result;
        } catch (error) {
            console.error('FindOneService error:', error.message);
            throw new Error('Could not find message');
        }
    },

    CountService: async (query) => {
        try {
            const count = await Message.countDocuments(query);
            return count;
        } catch (error) {
            console.error('CountService error:', error.message);
            throw new Error('Could not count messages');
        }
    },

    UpdateManyService: async (query, update) => {
        try {
            const result = await Message.updateMany(query, update);
            return result;
        } catch (error) {
            console.error('UpdateManyService error:', error.message);
            throw new Error('Could not update messages');
        }
    },

    FindByIdAndUpdateService: async (id, value) => {
        try {
            const result = await Message.findByIdAndUpdate(id, value, { new: true });
            return result;
        } catch (error) {
            console.error('FindByIdAndUpdateService error:', error.message);
            throw new Error('Could not update message');
        }
    },
};

module.exports = MessageService;

