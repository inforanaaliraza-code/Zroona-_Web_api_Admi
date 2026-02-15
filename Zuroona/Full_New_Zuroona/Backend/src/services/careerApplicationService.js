/**
 * Career Application Service
 * Handles database operations for career applications
 */

const CareerApplication = require('../models/careerApplicationModel');

const CareerApplicationService = {
    CreateService: async (data) => {
        try {
            const application = new CareerApplication(data);
            return await application.save();
        } catch (error) {
            throw error;
        }
    },

    FindOneService: async (query) => {
        try {
            return await CareerApplication.findOne(query);
        } catch (error) {
            throw error;
        }
    },

    FindService: async (query = {}) => {
        try {
            return await CareerApplication.find(query).sort({ createdAt: -1 });
        } catch (error) {
            throw error;
        }
    },

    FindByIdService: async (id) => {
        try {
            return await CareerApplication.findById(id);
        } catch (error) {
            throw error;
        }
    },

    FindByIdAndUpdateService: async (id, updateData) => {
        try {
            return await CareerApplication.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );
        } catch (error) {
            throw error;
        }
    },

    CountDocumentService: async (query = {}) => {
        try {
            return await CareerApplication.countDocuments(query);
        } catch (error) {
            throw error;
        }
    },

    AggregateService: async (pipeline) => {
        try {
            return await CareerApplication.aggregate(pipeline);
        } catch (error) {
            throw error;
        }
    },
};

module.exports = CareerApplicationService;

