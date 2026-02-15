const express = require("express");
const router = express.Router();
const LocationController = require("../controllers/locationController");

// Get all countries
router.get("/countries", LocationController.getCountries);

// Get cities by country ID
router.get("/cities/:countryId", LocationController.getCitiesByCountry);

// Get all cities (optional)
router.get("/cities", LocationController.getAllCities);

module.exports = router;

