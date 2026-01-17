import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3434/api';

/**
 * Fetch all countries
 * @param {string} lang - Language code ('en' or 'ar')
 * @returns {Promise<Array>} Array of countries
 */
export const fetchCountries = async (lang = 'en') => {
    try {
        const response = await axios.get(`${API_BASE_URL}/location/countries`, {
            headers: {
                lang: lang
            }
        });
        
        if (response.data.status === 1) {
            return response.data.data.countries || [];
        }
        return [];
    } catch (error) {
        console.error('Error fetching countries:', error);
        return [];
    }
};

/**
 * Fetch cities by country ID
 * @param {string} countryId - Country MongoDB ID
 * @param {string} lang - Language code ('en' or 'ar')
 * @returns {Promise<Array>} Array of cities
 */
export const fetchCitiesByCountry = async (countryId, lang = 'en') => {
    try {
        if (!countryId) {
            return [];
        }
        
        const response = await axios.get(`${API_BASE_URL}/location/cities/${countryId}`, {
            headers: {
                lang: lang
            }
        });
        
        if (response.data.status === 1) {
            return response.data.data.cities || [];
        }
        return [];
    } catch (error) {
        console.error('Error fetching cities:', error);
        return [];
    }
};

