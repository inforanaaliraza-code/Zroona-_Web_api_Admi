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
        try {
            await ensureConnection();
            const result = await Admin.findOne(query);
            return result;
        } catch (error) {
            console.error('[ADMIN:SERVICE] FindOneService error:', error.message || error);
            throw error;
        }
    },
    
    FindService: async (page = 1, limit = 10, query) => {
        try {
            await ensureConnection();
            const skip = (page - 1) * limit;
            const result = await Admin.find(query).skip(skip).limit(limit);
            return result;
        } catch (error) {
            console.error('[ADMIN:SERVICE] FindService error:', error.message || error);
            throw error;
        }
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
        try {
            await ensureConnection();
            const result = await Admin.findByIdAndDelete(userId);
            return result;
        } catch (error) {
            console.error('[ADMIN:SERVICE] FindByIdAndDeleteService error:', error.message || error);
            throw error;
        }
    },
    
    CountDocumentService: async (query = {}) => {
        try {
            await ensureConnection();
            const result = await Admin.countDocuments(query);
            return result;
        } catch (error) {
            console.error('[ADMIN:SERVICE] CountDocumentService error:', error.message || error);
            throw error;
        }
    },
};

module.exports = AdminService;
