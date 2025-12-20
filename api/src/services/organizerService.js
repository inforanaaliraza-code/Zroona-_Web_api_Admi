const Organizer = require('../models/organizerModel.js');

const organizerService = {
    CreateService: async (value) => {
        return new Promise((res, rej) => {
            Organizer.create(value).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej('could not create');
            });
        });
    },

    FindOneService: async (query) => {
        return new Promise((res, rej) => {
            Organizer.findOne(query).then((result) => {
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
            Organizer.find(query).skip(skip).limit(limit).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej("could not find");
            });
        });
    },

    FindByIdAndUpdateService: async (userId, value) => {
        return new Promise((res, rej) => {
            Organizer.findByIdAndUpdate(userId, value, { new: true, upsert: true }).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej('could not find');
            });
        });
    },
    FindOneAndSelectService: async (query) => {
        return new Promise((res, rej) => {
            Organizer.findOne(query).select('-group_category -group_location').then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej('could not find');
            });
        });
    },
    FindByIdAndUpdateAndSelectService: async (userId, value) => {
        return new Promise((res, rej) => {
            Organizer.findByIdAndUpdate(userId, value, { new: true, upsert: true }).select('-group_category -group_location').then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej('could not find');
            });
        });
    },
    updateMany: async (query, update) => {
        try {
            const result = await Organizer.updateMany(query, update, { new: true });
            return result;
        } catch (error) {
            console.log(error.message);
            throw new Error('Failed to update ads');

        }
    },
    FindByIdAndDeleteService: async (userId) => {
        return new Promise((res, rej) => {
            Organizer.findByIdAndDelete(userId).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej('could not find');
            });
        });
    },
    CountDocumentService: async (query = {}) => {
        return new Promise((res, rej) => {
            Organizer.countDocuments(query).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej('could not aggregate');
            });
        });
    },

    AggregateService: async (pipeline) => {
        return new Promise((res, rej) => {
            Organizer.aggregate(pipeline).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej('could not aggregate');
            });
        });
    },
    
    FindByIdService: async (userId) => {
        return new Promise((res, rej) => {
            Organizer.findById(userId).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej('could not find');
            });
        });
    },
};

module.exports = organizerService;
