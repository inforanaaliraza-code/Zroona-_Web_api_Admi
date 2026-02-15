const RefundRequest = require('../models/refundRequestModel');

const RefundRequestService = {
    CreateService: async (value) => {
        return new Promise((res, rej) => {
            console.log("[REFUND:SERVICE] Creating refund request:", value);
            RefundRequest.create(value).then((result) => {
                console.log("[REFUND:SERVICE] Refund request created:", result?._id);
                res(result);
            }).catch((error) => {
                console.error("[REFUND:SERVICE] CreateService error:", error);
                console.error("[REFUND:SERVICE] Error details:", error.message, error.stack);
                rej(error.message || 'could not create refund request');
            });
        });
    },

    FindOneService: async (query, options = {}) => {
        return new Promise((res, rej) => {
            try {
                console.log("[REFUND:SERVICE] FindOneService query:", query, "options:", options);
                let queryBuilder = RefundRequest.findOne(query);
                
                // Only populate if populate option is not explicitly false (default: true for backward compatibility)
                const shouldPopulate = options.populate !== false;
                
                if (shouldPopulate) {
                    try {
                        queryBuilder = queryBuilder
                            .populate('booking_id')
                            .populate('user_id', 'first_name last_name email phone_number')
                            .populate('event_id', 'event_name event_date event_image')
                            .populate('organizer_id', 'first_name last_name email')
                            .populate('processed_by', 'first_name last_name email');
                    } catch (populateError) {
                        console.warn("[REFUND:SERVICE] Populate setup failed, continuing without populate:", populateError.message);
                        // Continue without populate if setup fails
                    }
                }
                
                queryBuilder
                    .then((result) => {
                        console.log("[REFUND:SERVICE] FindOneService result:", result ? "Found" : "Not found");
                        res(result);
                    }).catch((error) => {
                        console.error("[REFUND:SERVICE] FindOneService error:", error);
                        console.error("[REFUND:SERVICE] Error details:", error.message, error.stack);
                        
                        // If populate failed, retry without populate
                        if (error.message && error.message.includes('Schema hasn\'t been registered')) {
                            console.log("[REFUND:SERVICE] Populate failed, retrying without populate...");
                            RefundRequest.findOne(query)
                                .then((result) => {
                                    console.log("[REFUND:SERVICE] FindOneService (no populate) result:", result ? "Found" : "Not found");
                                    res(result);
                                }).catch((retryError) => {
                                    console.error("[REFUND:SERVICE] FindOneService retry error:", retryError);
                                    res(null);
                                });
                        } else {
                            res(null);
                        }
                    });
            } catch (error) {
                console.error("[REFUND:SERVICE] FindOneService catch error:", error);
                res(null);
            }
        });
    },

    FindService: async (query = {}, page = 1, limit = 10) => {
        return new Promise((res, rej) => {
            try {
                const skip = (page - 1) * limit;
                RefundRequest.find(query)
                    .populate('booking_id')
                    .populate('user_id', 'first_name last_name email phone_number')
                    .populate('event_id', 'event_name event_date event_image')
                    .populate('organizer_id', 'first_name last_name email')
                    .populate('processed_by', 'first_name last_name email')
                    .skip(skip)
                    .limit(Number(limit))
                    .sort({ createdAt: -1 })
                    .then((result) => {
                        res(result || []);
                    }).catch((error) => {
                        console.error("[REFUND:SERVICE] FindService error:", error);
                        console.error("[REFUND:SERVICE] Error details:", error.message, error.stack);
                        // Return empty array instead of rejecting
                        res([]);
                    });
            } catch (error) {
                console.error("[REFUND:SERVICE] FindService catch error:", error);
                res([]);
            }
        });
    },

    FindByIdAndUpdateService: async (id, value) => {
        return new Promise((res, rej) => {
            RefundRequest.findByIdAndUpdate(id, value, { new: true })
                .populate('booking_id')
                .populate('user_id', 'first_name last_name email')
                .populate('event_id', 'event_name')
                .then((result) => {
                    res(result);
                }).catch((error) => {
                    console.error(error.message);
                    rej('could not update refund request');
                });
        });
    },

    AggregateService: async (pipeline) => {
        return new Promise((res, rej) => {
            RefundRequest.aggregate(pipeline).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error);
                rej('could not aggregate refund requests');
            });
        });
    },

    CountDocumentService: async (query = {}) => {
        return new Promise((res, rej) => {
            RefundRequest.countDocuments(query).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej('could not count refund requests');
            });
        });
    },
};

module.exports = RefundRequestService;

