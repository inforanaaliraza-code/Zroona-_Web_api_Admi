const Admin = require('../models/adminModel.js');
const HashPassword = require('../helpers/hashPassword.js');

const AdminService = {
    CreateService: async (value) => {
        value.password = await HashPassword.hashPassword(value.password);
        return new Promise((res, rej) => {
            Admin.create(value).then((result) => {
                res(result);
            }).catch((error) => { 
                console.error(error.message);
                rej('could not create');
            });
        });
    },
    
    FindOneService: async (query) => {
        return new Promise((res, rej) => {
            Admin.findOne(query).then((result) => {
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
            Admin.find(query).skip(skip).limit(limit).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej("could not find");
            });
        });
    },
    
    FindByIdAndUpdateService: async (userId, value) => {
        return new Promise((res, rej) => {
            Admin.findByIdAndUpdate(userId, value, { new: true, upsert: true }).then((result) => {
                res(result);
            }).catch((error) => { 
                console.error(error.message);
                rej('could not find');
            });
        });
    },
    
    FindByIdAndDeleteService: async (userId) => {
        return new Promise((res, rej) => {
            Admin.findByIdAndDelete(userId).then((result) => {
                res(result);
            }).catch((error) => { 
                console.error(error.message);
                rej('could not find');
            });
        });
    },
    
    CountDocumentService: async (query = {}) => {
        return new Promise((res, rej) => {
            Admin.countDocuments(query).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej('could not count');
            });
        });
    },
};

module.exports = AdminService;
