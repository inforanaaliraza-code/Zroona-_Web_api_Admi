const Event = require("../models/eventModel.js");

const EventService = {
	CreateService: async (value) => {
		return new Promise((res, rej) => {
			Event.create(value)
				.then((result) => {
					res(result);
				})
				.catch((error) => {
					console.error("[EVENT-SERVICE] Create error:", error);
					console.error("[EVENT-SERVICE] Error message:", error.message);
					console.error("[EVENT-SERVICE] Error details:", error.errors);
					console.error("[EVENT-SERVICE] Value being created:", JSON.stringify(value, null, 2));
					rej(error);
				});
		});
	},

	FindOneService: async (query) => {
		return new Promise((res, rej) => {
			Event.findOne(query)
				.then((result) => {
					res(result);
				})
				.catch((error) => {
					console.error(error.message);
					rej("could not find");
				});
		});
	},

	FindService: async (page = 1, limit = 10, query) => {
		return new Promise((res, rej) => {
			const skip = (page - 1) * limit;
			Event.find(query)
				.skip(skip)
				.limit(limit)
				.then((result) => {
					res(result);
				})
				.catch((error) => {
					console.error(error.message);
					rej("could not find");
				});
		});
	},

	FindByIdAndUpdateService: async (userId, value) => {
		return new Promise((res, rej) => {
			Event.findByIdAndUpdate(userId, value, { new: true, upsert: true })
				.then((result) => {
					res(result);
				})
				.catch((error) => {
					console.error(error.message);
					rej("could not find");
				});
		});
	},

	FindByIdAndDeleteService: async (userId) => {
		return new Promise((res, rej) => {
			Event.findByIdAndDelete(userId)
				.then((result) => {
					res(result);
				})
				.catch((error) => {
					console.error(error.message);
					rej("could not find");
				});
		});
	},

	AggregateService: async (pipeline) => {
		return new Promise((res, rej) => {
			Event.aggregate(pipeline)
				.then((result) => {
					res(result);
				})
				.catch((error) => {
					console.error(error.message);
					rej("could not aggregate");
				});
		});
	},

	CountDocumentService: async (query = {}) => {
		return new Promise((res, rej) => {
			Event.countDocuments(query)
				.then((result) => {
					res(result);
				})
				.catch((error) => {
					console.error(error.message);
					rej("could not aggregate");
				});
		});
	},
};

module.exports = EventService;
