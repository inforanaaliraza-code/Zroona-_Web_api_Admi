const BookEvent = require('../models/eventBookModel');

const BookEventService = {
    CreateService: async (value) => {
        return new Promise((res, rej) => {
            BookEvent.create(value).then((result) => {
                res(result);
            }).catch((error) => { 
                // console.error(error.message,'yhan hai error');
                rej('could not create');
            });
        });
    },

    FindOneService: async (query) => {
        return new Promise((res, rej) => {
            BookEvent.findOne(query).then((result) => {
                res(result);
            }).catch((error) => { 
                console.error(error.message);
                rej('could not find');
            });
        });
    },

    FindService: async (page = 1, limit = 10, query) => {
        return new Promise((res, rej) => {
            const skip = (page - 1) * limit;
            BookEvent.find(query).skip(skip).limit(limit).sort({createdAt:-1}).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej("could not find");
            });
        });
    },

    FindByIdAndUpdateService: async (userId, value) => {
        return new Promise((res, rej) => {
            BookEvent.findByIdAndUpdate(userId, value, { new: true, upsert: true }).then((result) => {
                res(result);
            }).catch((error) => { 
                console.error(error.message);
                rej('could not find');
            });
        });
    },

    FindByIdAndDeleteService: async (userId) => {
        return new Promise((res, rej) => {
            BookEvent.findByIdAndDelete(userId).then((result) => {
                res(result);
            }).catch((error) => { 
                console.error(error.message);
                rej('could not find');
            });
        });
    },

    AggregateService: async (pipeline) => {
        return new Promise((res, rej) => {
            BookEvent.aggregate(pipeline).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error);
                rej('could not aggregate');
            });
        });
    },

    CountDocumentService: async (query = {}) => {
        return new Promise((res, rej) => {
            BookEvent.countDocuments(query).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej('could not aggregate');
            });
        });
    },

    updateMany: async (query, update) => {
        try {
            const result = await BookEvent.updateMany(query, update, { new: true });
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error('Failed to update bookings');
        }
    },
};

module.exports = BookEventService;
