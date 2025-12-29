const EventCategories = require('../models/eventCategoryModel');

const EventCategoryService = {
    CreateService: async (value) => {
        return new Promise((res, rej) => {
            EventCategories.create(value).then((result) => {
                res(result);
            }).catch((error) => { 
                console.error(error.message);
                rej('could not create');
            });
        });
    },

    FindOneService: async (query) => {
        return new Promise((res, rej) => {
            EventCategories.findOne(query).then((result) => {
                res(result);
            }).catch((error) => { 
                console.error(error.message);
                rej('could not find');
            });
        });
    },

    FindService: async ( query) => {
        return new Promise((res, rej) => {
            EventCategories.find(query).sort({ createdAt: -1 }).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej("could not find");
            });
        });
    },

    FindByIdAndUpdateService: async (userId, value) => {
        return new Promise((res, rej) => {
            EventCategories.findByIdAndUpdate(userId, value, { new: true, upsert: true }).then((result) => {
                res(result);
            }).catch((error) => { 
                console.error(error.message);
                rej('could not find');
            });
        });
    },

    FindByIdAndDeleteService: async (userId) => {
        return new Promise((res, rej) => {
            EventCategories.findByIdAndDelete(userId).then((result) => {
                res(result);
            }).catch((error) => { 
                console.error(error.message);
                rej('could not find');
            });
        });
    },

    AggregateService: async (pipeline) => {
        return new Promise((res, rej) => {
            EventCategories.aggregate(pipeline).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej('could not aggregate');
            });
        });
    },

    CountDocumentService: async (query = {}) => {
        return new Promise((res, rej) => {
            EventCategories.countDocuments(query).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej('could not aggregate');
            });
        });
    },
};

module.exports = EventCategoryService;
