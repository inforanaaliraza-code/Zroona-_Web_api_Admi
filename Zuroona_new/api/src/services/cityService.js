const City = require("../models/cityModel");

module.exports = {
    FindService: (page = 1, limit = 1000, query = {}) => {
        const skip = (page - 1) * limit;
        return new Promise((resolve, reject) => {
            City.find(query)
                .skip(skip)
                .limit(Number(limit))
                .populate('country_id')
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    console.error(error.message);
                    reject("Could not find cities");
                });
        });
    },

    FindOneService: (query = {}) => {
        return new Promise((resolve, reject) => {
            City.findOne(query)
                .populate('country_id')
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    console.error(error.message);
                    reject("Could not find city");
                });
        });
    },

    CreateService: (data) => {
        return new Promise((resolve, reject) => {
            City.create(data)
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    console.error(error.message);
                    reject("Could not create city");
                });
        });
    },

    CountDocumentService: (query = {}) => {
        return new Promise((resolve, reject) => {
            City.countDocuments(query)
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    console.error(error.message);
                    reject("Could not count cities");
                });
        });
    },

    InsertManyService: (data) => {
        return new Promise((resolve, reject) => {
            City.insertMany(data)
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    console.error(error.message);
                    reject("Could not insert cities");
                });
        });
    }
};

