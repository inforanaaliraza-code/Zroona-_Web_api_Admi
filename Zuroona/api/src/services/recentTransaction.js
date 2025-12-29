const Transaction = require('../models/transactionModel');

const TransactionService = {
    CreateService: async (value) => {
        return new Promise((res, rej) => {
            Transaction.create(value).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej('could not create');
            });
        });
    },

    FindOneService: async (query) => {
        return new Promise((res, rej) => {
            Transaction.findOne(query).then((result) => {
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
            Transaction.find(query).skip(skip).limit(limit).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej("could not find");
            });
        });
    },

    FindByIdAndUpdateService: async (Id, value) => {
        return new Promise((res, rej) => {
            Transaction.findByIdAndUpdate(Id, value, { new: true, upsert: true }).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej('could not find');
            });
        });
    },
    FindOneAndSelectService: async (query) => {
        return new Promise((res, rej) => {
            Transaction.findOne(query).select('-group_category -group_location').then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej('could not find');
            });
        });
    },
    FindByIdAndUpdateAndSelectService: async (userId, value) => {
        return new Promise((res, rej) => {
            Transaction.findByIdAndUpdate(userId, value, { new: true, upsert: true }).select('-group_category -group_location').then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej('could not find');
            });
        });
    },
    updateMany: async (query, update) => {
        try {
            const result = await Transaction.updateMany(query, update, { new: true });
            return result;
        } catch (error) {
            console.log(error.message);
            throw new Error('Failed to update ads');

        }
    },
    FindByIdAndDeleteService: async (userId) => {
        return new Promise((res, rej) => {
            Transaction.findByIdAndDelete(userId).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej('could not find');
            });
        });
    },
    CountDocumentService: async (query = {}) => {
        return new Promise((res, rej) => {
            Transaction.countDocuments(query).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej('could not aggregate');
            });
        });
    },

    AggregateService: async (pipeline) => {
        return new Promise((res, rej) => {
            Transaction.aggregate(pipeline).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error);
                rej('could not aggregate');
            });
        });
    },
};

module.exports = TransactionService;
