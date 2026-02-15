const Review = require("../models/reviewModel.js");

const ReviewService = {
	CreateService: async (value) => {
		return new Promise((res, rej) => {
			Review.create(value)
				.then((result) => {
					res(result);
				})
				.catch((error) => {
					console.error(error.message);
					rej("could not create");
				});
		});
	},

	FindOneService: async (query) => {
		return new Promise((res, rej) => {
			Review.findOne(query)
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
			Review.find(query)
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
			Review.findByIdAndUpdate(userId, value, { new: true, upsert: true })
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
			Review.findByIdAndDelete(userId)
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
			Review.aggregate(pipeline)
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
			Review.countDocuments(query)
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

module.exports = ReviewService;
