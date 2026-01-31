import Papa from 'papaparse';

// Cache for parsed data
let countriesCache = null;
let citiesCache = null;
let countryTranslationsCache = null;
let cityTranslationsCache = null;

/**
 * Load and parse CSV file
 */
const loadCSV = async (filePath) => {
  try {
    const response = await fetch(filePath);
    const text = await response.text();
    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error(`Error loading CSV from ${filePath}:`, error);
    throw error;
  }
};

/**
 * Load all country and city data
 */
export const loadCountryCityData = async () => {
  try {
    // Load all CSV files in parallel
    const [countries, cities, countryTranslations, cityTranslations] = await Promise.all([
      loadCSV('/data/country.csv'),
      loadCSV('/data/cities.csv'),
      loadCSV('/data/countries_translations.csv'),
      loadCSV('/data/city_translations.csv'),
    ]);

    // Cache the data
    countriesCache = countries;
    citiesCache = cities;
    countryTranslationsCache = countryTranslations;
    cityTranslationsCache = cityTranslations;

    return {
      countries,
      cities,
      countryTranslations,
      cityTranslations,
    };
  } catch (error) {
    console.error('Error loading country/city data:', error);
    throw error;
  }
};

/**
 * Get countries with translations for a specific locale
 */
export const getCountriesWithTranslations = (locale = 'en') => {
  if (!countriesCache || !countryTranslationsCache) {
    return [];
  }

  // Create a map of country translations
  const translationsMap = {};
  countryTranslationsCache.forEach((translation) => {
    if (translation.locale === locale) {
      translationsMap[translation.country_id] = translation.name;
    }
  });

  // Combine countries with their translations
  return countriesCache
    .map((country) => {
      const translation = translationsMap[country.id];
      return {
        id: country.id,
        code: country.code,
        name: translation || country.code, // Fallback to code if translation not found
      };
    })
    .filter((country) => country.name && country.id); // Filter out invalid entries
};

/**
 * Get cities for a specific country with translations
 */
export const getCitiesForCountry = (countryId, locale = 'en') => {
  if (!citiesCache || !cityTranslationsCache) {
    return [];
  }

  // Filter cities by country_id
  const countryCities = citiesCache.filter(
    (city) => city.country_id === countryId && city.id
  );

  // Create a map of city translations
  const translationsMap = {};
  cityTranslationsCache.forEach((translation) => {
    if (translation.locale === locale) {
      translationsMap[translation.city_id] = translation.name;
    }
  });

  // Combine cities with their translations
  return countryCities
    .map((city) => {
      const translation = translationsMap[city.id];
      return {
        id: city.id,
        country_id: city.country_id,
        name: translation || `City ${city.id}`, // Fallback if translation not found
      };
    })
    .filter((city) => city.name && city.id) // Filter out invalid entries
    .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
};

/**
 * Get country name by ID and locale
 */
export const getCountryName = (countryId, locale = 'en') => {
  if (!countryTranslationsCache) {
    return '';
  }

  const translation = countryTranslationsCache.find(
    (t) => t.country_id === countryId && t.locale === locale
  );

  return translation ? translation.name : '';
};

/**
 * Get city name by ID and locale
 */
export const getCityName = (cityId, locale = 'en') => {
  if (!cityTranslationsCache) {
    return '';
  }

  const translation = cityTranslationsCache.find(
    (t) => t.city_id === cityId && t.locale === locale
  );

  return translation ? translation.name : '';
};

/**
 * Check if data is loaded
 */
export const isDataLoaded = () => {
  return (
    countriesCache !== null &&
    citiesCache !== null &&
    countryTranslationsCache !== null &&
    cityTranslationsCache !== null
  );
};
