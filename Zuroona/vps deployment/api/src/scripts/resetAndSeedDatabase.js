/**
 * FULL DATABASE RESET + SEED SCRIPT
 *
 * Ye script ye kaam karega:
 * - Current MongoDB database ko PURA drop karega (saara purana data delete ho jayega)
 * - Latest models ke hisaab se seed data insert karega
 * - Indexes / schema optimizations run karega
 *
 * Usage:
 *   NODE_ENV=production node src/scripts/resetAndSeedDatabase.js
 *
 * WARNING:
 *   - Is script ko run karne se purani jeena database ka saara data delete ho jayega.
 *   - Pehle backup zaroor le lo (MongoDB Atlas ke UI / backup tools se).
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { connectWithRetry, ensureConnection } = require('../config/database');
const { seedDatabase } = require('./seedDatabase');
const { updateDatabaseSchema } = require('./updateDatabaseSchema');
const seedCountriesAndCities = require('./seedCountriesAndCities');

const resetAndSeedDatabase = async () => {
    try {
        console.log('\n' + '='.repeat(80));
        console.log('⚠️  FULL DATABASE RESET & SEED (ATLAS)'.toUpperCase());
        console.log('='.repeat(80) + '\n');

        if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
            console.log('❌ MONGO_URI / MONGODB_URI env variable set nahi hai.');
            console.log('   Pehle .env file me MongoDB Atlas connection string set karo, e.g.:');
            console.log('   MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<dbName>');
            process.exit(1);
        }

        console.log('📡 Connecting to MongoDB Atlas...');
        await connectWithRetry();
        await ensureConnection();

        const db = mongoose.connection.db;
        console.log(`✅ Connected to database: ${db.databaseName}\n`);

        console.log('📊 Existing collections BEFORE drop:');
        const existingCollections = await db.listCollections().toArray();
        existingCollections.forEach((col) => console.log('   -', col.name));
        console.log('');

        console.log('🔥 Dropping entire database (all collections & data will be removed)...');
        await db.dropDatabase();
        console.log('✅ Database dropped successfully.\n');

        // NOTE:
        // - Abhi active connection same Atlas DB pe hi open hai.
        // - Neeche seedDatabase() aur updateDatabaseSchema() khud hi
        //   connectWithRetry() use karte hain; agar connection open hai
        //   to woh simply reuse ho jayega.

        console.log('🌍 Running seedCountriesAndCities() for countries & cities...\n');
        await seedCountriesAndCities();

        console.log('🌱 Running seedDatabase() for fresh test/admin data...\n');
        await seedDatabase(); // This will close the connection when finished

        console.log('🔧 Running updateDatabaseSchema() to ensure indexes & schema...\n');
        await updateDatabaseSchema(); // This will also close its own connection

        console.log('\n' + '='.repeat(80));
        console.log('✅ FULL DATABASE RESET + SEED COMPLETED SUCCESSFULLY');
        console.log('='.repeat(80) + '\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ ERROR in resetAndSeedDatabase:', error.message);
        console.error(error.stack);
        console.log('\n⚠️  Database connection may still be open. Please check manually.\n');
        process.exit(1);
    }
};

if (require.main === module) {
    resetAndSeedDatabase();
}

module.exports = { resetAndSeedDatabase };

