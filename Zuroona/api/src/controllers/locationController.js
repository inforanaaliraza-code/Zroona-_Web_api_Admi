const Response = require("../helpers/response");
const CountryService = require("../services/countryService");
const CityService = require("../services/cityService");

module.exports = {
    /**
     * Get all countries with translations
     */
    getCountries: async (req, res) => {
        const lang = req.headers["lang"] || "en";
        
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 1000;
            
            const countries = await CountryService.FindService(page, limit, {});
            const totalCount = await CountryService.CountDocumentService({});
            
            // Format countries based on language
            const formattedCountries = countries.map(country => {
                const translation = country.translations.find(t => t.locale === lang) || country.translations[0];
                return {
                    _id: country._id,
                    code: country.code,
                    name: translation ? translation.name : '',
                };
            }).sort((a, b) => a.name.localeCompare(b.name));
            
            return Response.ok(
                res,
                {
                    countries: formattedCountries,
                    pagination: {
                        page,
                        limit,
                        totalCount,
                        totalPages: Math.ceil(totalCount / limit),
                    },
                },
                200,
                "Countries fetched successfully"
            );
        } catch (error) {
            console.error("Get countries error:", error);
            return Response.serverErrorResponse(
                res,
                "Failed to fetch countries"
            );
        }
    },

    /**
     * Get cities by country ID with translations
     */
    getCitiesByCountry: async (req, res) => {
        const lang = req.headers["lang"] || "en";
        
        try {
            const { countryId } = req.params;
            
            if (!countryId) {
                return Response.badRequestResponse(
                    res,
                    "Country ID is required"
                );
            }
            
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 1000;
            
            const cities = await CityService.FindService(page, limit, {
                country_id: countryId
            });
            
            const totalCount = await CityService.CountDocumentService({
                country_id: countryId
            });
            
            // Format cities based on language
            const formattedCities = cities.map(city => {
                const translation = city.translations.find(t => t.locale === lang) || city.translations[0];
                return {
                    _id: city._id,
                    name: translation ? translation.name : '',
                    country_id: city.country_id,
                };
            }).sort((a, b) => a.name.localeCompare(b.name));
            
            return Response.ok(
                res,
                {
                    cities: formattedCities,
                    pagination: {
                        page,
                        limit,
                        totalCount,
                        totalPages: Math.ceil(totalCount / limit),
                    },
                },
                200,
                "Cities fetched successfully"
            );
        } catch (error) {
            console.error("Get cities error:", error);
            return Response.serverErrorResponse(
                res,
                "Failed to fetch cities"
            );
        }
    },

    /**
     * Get all cities (optional, for admin purposes)
     */
    getAllCities: async (req, res) => {
        const lang = req.headers["lang"] || "en";
        
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 1000;
            
            const cities = await CityService.FindService(page, limit, {});
            const totalCount = await CityService.CountDocumentService({});
            
            // Format cities based on language
            const formattedCities = cities.map(city => {
                const translation = city.translations.find(t => t.locale === lang) || city.translations[0];
                return {
                    _id: city._id,
                    name: translation ? translation.name : '',
                    country_id: city.country_id,
                };
            }).sort((a, b) => a.name.localeCompare(b.name));
            
            return Response.ok(
                res,
                {
                    cities: formattedCities,
                    pagination: {
                        page,
                        limit,
                        totalCount,
                        totalPages: Math.ceil(totalCount / limit),
                    },
                },
                200,
                "Cities fetched successfully"
            );
        } catch (error) {
            console.error("Get all cities error:", error);
            return Response.serverErrorResponse(
                res,
                "Failed to fetch cities"
            );
        }
    }
};

