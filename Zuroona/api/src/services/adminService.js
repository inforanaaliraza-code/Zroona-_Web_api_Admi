const Admin = require('../models/adminModel.js');
const HashPassword = require('../helpers/hashPassword.js');
const { ensureConnection } = require('../config/database');

const AdminService = {
    CreateService: async (value) => {
        try {
            // Ensure database connection before creating
            await ensureConnection();
            
            value.password = await HashPassword.hashPassword(value.password);
            
            console.log('[ADMIN:SERVICE] Creating admin with data:', {
                email: value.email,
                role: value.role
            });
            
            const result = await Admin.create(value);
            
            console.log('[ADMIN:SERVICE] Admin created successfully:', {
                id: result._id,
                email: result.email
            });
            
            return result;
        } catch (error) {
            console.error('[ADMIN:SERVICE] Error creating admin:', error.message);
            console.error('[ADMIN:SERVICE] Full error:', error);
            throw new Error(`Failed to create admin: ${error.message}`);
        }
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
        try {
            await ensureConnection();
            const result = await Admin.findByIdAndUpdate(userId, { $set: value }, { new: true, runValidators: true });
            if (!result) {
                throw new Error('Admin not found');
            }
            return result;
        } catch (error) {
            console.error('[ADMIN:SERVICE] FindByIdAndUpdate error:', error.message);
            console.error('[ADMIN:SERVICE] Full error:', error);
            throw error;
        }
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
