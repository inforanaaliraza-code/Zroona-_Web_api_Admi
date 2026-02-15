const Country = require("../models/countryModel");

module.exports = {
    FindService: (page = 1, limit = 1000, query = {}) => {
        const skip = (page - 1) * limit;
        return new Promise((resolve, reject) => {
            Country.find(query)
                .skip(skip)
                .limit(Number(limit))
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    console.error(error.message);
                    reject("Could not find countries");
                });
        });
    },

    FindOneService: (query = {}) => {
        return new Promise((resolve, reject) => {
            Country.findOne(query)
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    console.error(error.message);
                    reject("Could not find country");
                });
        });
    },

    CreateService: (data) => {
        return new Promise((resolve, reject) => {
            Country.create(data)
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    console.error(error.message);
                    reject("Could not create country");
                });
        });
    },

    CountDocumentService: (query = {}) => {
        return new Promise((resolve, reject) => {
            Country.countDocuments(query)
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    console.error(error.message);
                    reject("Could not count countries");
                });
        });
    },

    InsertManyService: (data) => {
        return new Promise((resolve, reject) => {
            Country.insertMany(data)
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    console.error(error.message);
                    reject("Could not insert countries");
                });
        });
    }
};

