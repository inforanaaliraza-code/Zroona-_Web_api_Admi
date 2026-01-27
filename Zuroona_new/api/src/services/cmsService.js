const Cms = require('../models/cmsModel');

const CmsService = {
    CreateService: async (value) => {
        return new Promise((res, rej) => {
            Cms.create(value).then((result) => {
                res(result);
            }).catch((error) => { 
                console.error(error.message);
                rej('could not create');
            });
        });
    },

    FindOneService: async (query) => {
        return new Promise((res, rej) => {
            Cms.findOne(query).then((result) => {
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
            Cms.find(query).skip(skip).limit(limit).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej("could not find");
            });
        });
    },

    FindByIdAndUpdateService: async (id, value) => {
        return new Promise((res, rej) => {
            Cms.findByIdAndUpdate(id, value, { new: true }).then((result) => {
                res(result);
            }).catch((error) => { 
                console.error(error.message);
                rej('could not find');
            });
        });
    },
    AggregateService: async (pipeline) => {
        return new Promise((res, rej) => {
            Cms.aggregate(pipeline).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej('could not aggregate');
            });
        });
    },
    FindByIdAndDeleteService: async (userId) => {
        return new Promise((res, rej) => {
            Cms.findByIdAndDelete(userId).then((result) => {
                res(result);
            }).catch((error) => { 
                console.error(error.message);
                rej('could not find');
            });
        });
    },
};

module.exports = CmsService;
