const Organizer = require('../models/organizerModel.js');
const { ensureConnection } = require('../config/database');

const organizerService = {
    CreateService: async (value) => {
        try {
            // Ensure database connection before creating
            await ensureConnection();
            
            console.log('[ORGANIZER:SERVICE] Creating organizer with data:', {
                email: value.email,
                phone_number: value.phone_number,
                country_code: value.country_code,
                role: value.role,
                registration_step: value.registration_step
            });
            
            const result = await Organizer.create(value);
            
            console.log('[ORGANIZER:SERVICE] Organizer created successfully:', {
                id: result._id,
                email: result.email,
                phone_number: result.phone_number
            });
            
            return result;
        } catch (error) {
            console.error('[ORGANIZER:SERVICE] Error creating organizer:', error.message);
            console.error('[ORGANIZER:SERVICE] Full error:', error);
            throw new Error(`Failed to create organizer: ${error.message}`);
        }
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
