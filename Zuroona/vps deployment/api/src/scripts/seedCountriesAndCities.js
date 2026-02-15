const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables - try api/.env first, then root
const apiEnvPath = path.join(__dirname, '../../.env');
const rootEnvPath = path.join(__dirname, '../../../.env');

if (fs.existsSync(apiEnvPath)) {
    console.log('Loading .env from:', apiEnvPath);
    dotenv.config({ path: apiEnvPath });
} else if (fs.existsSync(rootEnvPath)) {
    console.log('Loading .env from:', rootEnvPath);
    dotenv.config({ path: rootEnvPath });
} else {
    console.log('No .env file found, using environment variables');
    dotenv.config();
}

console.log('MongoDB URL:', (process.env.MONGO_URI || process.env.MONGODB_URI || process.env.MONGO_URL) ? '✓ Found' : '✗ Not found');

const Country = require('../models/countryModel');
const City = require('../models/cityModel');

// CSV file paths (adjust based on your CSV location)
const COUNTRY_CSV = path.join(__dirname, '../../data/country.csv');
const COUNTRY_TRANSLATIONS_CSV = path.join(__dirname, '../../data/countries_translations.csv');
const CITY_CSV = path.join(__dirname, '../../data/cities.csv');
const CITY_TRANSLATIONS_CSV = path.join(__dirname, '../../data/city_translations.csv');

// Connect to MongoDB
const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.MONGO_URL;
        await mongoose.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Read CSV file
const readCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};

// Seed countries
const seedCountries = async () => {
    try {
        console.log('\n📦 Seeding Countries...');
        
        // Clear existing data
        await Country.deleteMany({});
        console.log('   Cleared existing countries');

        // Read CSV files
        const countries = await readCSV(COUNTRY_CSV);
        const translations = await readCSV(COUNTRY_TRANSLATIONS_CSV);

        console.log(`   Found ${countries.length} countries and ${translations.length} translations`);

        // Map countries with translations
        const countryMap = new Map();
        
        countries.forEach(country => {
            countryMap.set(country.id, {
                code: country.code,
                translations: []
            });
        });

        // Add translations
        translations.forEach(trans => {
            if (countryMap.has(trans.country_id)) {
                countryMap.get(trans.country_id).translations.push({
                    locale: trans.locale,
                    name: trans.name
                });
            }
        });

        // Insert countries
        const countriesToInsert = Array.from(countryMap.values());
        const insertedCountries = await Country.insertMany(countriesToInsert);
        
        console.log(`   ✅ Inserted ${insertedCountries.length} countries`);

        // Return map of old ID to new MongoDB ID
        const idMap = new Map();
        let index = 0;
        for (const [oldId, _] of countryMap) {
            idMap.set(oldId, insertedCountries[index]._id);
            index++;
        }

        return idMap;
    } catch (error) {
        console.error('❌ Error seeding countries:', error);
        throw error;
    }
};

// Seed cities
const seedCities = async (countryIdMap) => {
    try {
        console.log('\n📦 Seeding Cities...');
        
        // Clear existing data
        await City.deleteMany({});
        console.log('   Cleared existing cities');

        // Read CSV files
        const cities = await readCSV(CITY_CSV);
        const translations = await readCSV(CITY_TRANSLATIONS_CSV);

        console.log(`   Found ${cities.length} cities and ${translations.length} translations`);

        // Map cities with translations
        const cityMap = new Map();
        
        cities.forEach(city => {
            const mongoCountryId = countryIdMap.get(city.country_id);
            if (mongoCountryId) {
                cityMap.set(city.id, {
                    country_id: mongoCountryId,
                    translations: []
                });
            }
        });

        // Add translations
        translations.forEach(trans => {
            if (cityMap.has(trans.city_id)) {
                cityMap.get(trans.city_id).translations.push({
                    locale: trans.locale,
                    name: trans.name
                });
            }
        });

        // Insert cities in batches to avoid memory issues
        const citiesToInsert = Array.from(cityMap.values());
        const batchSize = 1000;
        let insertedCount = 0;

        for (let i = 0; i < citiesToInsert.length; i += batchSize) {
            const batch = citiesToInsert.slice(i, i + batchSize);
            await City.insertMany(batch);
            insertedCount += batch.length;
            console.log(`   Inserted ${insertedCount}/${citiesToInsert.length} cities`);
        }
        
        console.log(`   ✅ Inserted ${insertedCount} cities`);
    } catch (error) {
        console.error('❌ Error seeding cities:', error);
        throw error;
    }
};

// Main seed function
const seed = async () => {
    console.log('🌍 Starting Countries and Cities Seeding...\n');
    
    try {
        await connectDB();
        
        const countryIdMap = await seedCountries();
        await seedCities(countryIdMap);
        
        console.log('\n✅ Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Seeding failed:', error);
        process.exit(1);
    }
};

// Run seed if this file is executed directly
if (require.main === module) {
    seed();
}

module.exports = seed;

