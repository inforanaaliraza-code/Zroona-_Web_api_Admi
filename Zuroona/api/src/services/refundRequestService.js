const RefundRequest = require('../models/refundRequestModel');

const RefundRequestService = {
    CreateService: async (value) => {
        return new Promise((res, rej) => {
            RefundRequest.create(value).then((result) => {
                res(result);
            }).catch((error) => {
                console.error(error.message);
                rej('could not create refund request');
            });
        });
    },

    FindOneService: async (query) => {
        return new Promise((res, rej) => {
            RefundRequest.findOne(query)
                .populate('booking_id')
                .populate('user_id', 'first_name last_name email phone_number')
                .populate('event_id', 'event_name event_date event_image')
                .populate('organizer_id', 'first_name last_name email')
                .then((result) => {
                    res(result);
                }).catch((error) => {
                    console.error(error.message);
                    rej('could not find refund request');
                });
        });
    },

    FindService: async (query = {}, page = 1, limit = 10) => {
        return new Promise((res, rej) => {
            const skip = (page - 1) * limit;
            RefundRequest.find(query)
                .populate('booking_id')
                .populate('user_id', 'first_name last_name email phone_number')
                .populate('event_id', 'event_name event_date event_image')
                .populate('organizer_id', 'first_name last_name email')
                .populate('processed_by', 'first_name last_name email')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .then((result) => {
                    res(result);
                }).catch((error) => {
                    console.error(error.message);
                    rej("could not find refund requests");
                });
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

