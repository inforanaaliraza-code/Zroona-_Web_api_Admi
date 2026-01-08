const User = require('../models/userModel.js');
const { ensureConnection } = require('../config/database');

const UserService = {
    CreateService: async (value) => {
        try {
            // Ensure database connection before creating
            await ensureConnection();
            
            console.log('[USER:SERVICE] Creating user with data:', {
                email: value.email,
                phone_number: value.phone_number,
                country_code: value.country_code,
                role: value.role
            });
            
            const result = await User.create(value);
            
            console.log('[USER:SERVICE] User created successfully:', {
                id: result._id,
                email: result.email,
                phone_number: result.phone_number
            });
            
            return result;
        } catch (error) {
            console.error('[USER:SERVICE] Error creating user:', error.message);
            console.error('[USER:SERVICE] Full error:', error);
            throw new Error(`Failed to create user: ${error.message}`);
        }
    },

    FindOneService: async (query) => {
        return new Promise((res, rej) => {
            User.findOne(query).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej('could not find');
            });
        });
    },
    FindOneAndSelectService: async (query) => {
        return new Promise((res, rej) => {
            User.findOne(query).select('-group_category -group_location').then((result) => {
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
            User.find(query).skip(skip).limit(limit).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej("could not find");
            });
        });
    },

    FindByIdService: async (userId) => {
        return new Promise((res, rej) => {
            User.findById(userId).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej('could not find');
            });
        });
    },

    FindByIdAndUpdateService: async (userId, value) => {
        return new Promise((res, rej) => {
            User.findByIdAndUpdate(userId, value, { new: true }).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej('could not find');
            });
        });
    },

    FindByIdAndDeleteService: async (userId) => {
        return new Promise((res, rej) => {
            User.findByIdAndDelete(userId).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej('could not find');
            });
        });
    },

    CountDocumentService: async (query = {}) => {
        return new Promise((res, rej) => {
            User.countDocuments(query).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej('could not aggregate');
            });
        });
    },

    AggregateService: async (pipeline) => {
        return new Promise((res, rej) => {
            User.aggregate(pipeline).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej('could not aggregate');
            });
        });
    },
    updateMany: async (query, update) => {
        try {
            const result = await User.updateMany(query, update, { new: true });
            return result;
        } catch (error) {
            console.log(error.message);
            throw new Error('Failed to update ads');

        }
    }
};

module.exports = UserService;
