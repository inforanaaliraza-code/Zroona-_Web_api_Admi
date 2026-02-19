/**
 * Career Application Service
 * Handles database operations for career applications
 */

const CareerApplication = require('../models/careerApplicationModel');

const CareerApplicationService = {
    CreateService: async (data) => {
        const application = new CareerApplication(data);
        return await application.save();
    },

    FindOneService: async (query) => {
        return await CareerApplication.findOne(query);
    },

    FindService: async (query = {}) => {
        return await CareerApplication.find(query).sort({ createdAt: -1 });
    },

    FindByIdService: async (id) => {
        return await CareerApplication.findById(id);
    },

    FindByIdAndUpdateService: async (id, updateData) => {
        return await CareerApplication.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
    },

    CountDocumentService: async (query = {}) => {
        return await CareerApplication.countDocuments(query);
    },

    AggregateService: async (pipeline) => {
        return await CareerApplication.aggregate(pipeline);
    },
};

module.exports = CareerApplicationService;

