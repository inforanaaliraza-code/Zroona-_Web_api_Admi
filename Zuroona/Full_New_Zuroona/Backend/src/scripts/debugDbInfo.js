/**
 * Simple DB Info Script
 *
 * Ye script:
 * - Current MongoDB connection se DB name print karega
 * - Kuch important collections ka document count show karega
 *
 * Usage:
 *   node src/scripts/debugDbInfo.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { connectWithRetry, ensureConnection } = require('../config/database');

const debugDbInfo = async () => {
    try {
        console.log('\n' + '='.repeat(60));
        console.log('🔍 MongoDB Debug Info');
        console.log('='.repeat(60) + '\n');

        console.log('MONGO_URI:', process.env.MONGO_URI || 'NOT SET');
        console.log('MONGODB_URI:', process.env.MONGODB_URI || 'NOT SET');
        console.log('');

        await connectWithRetry();
        await ensureConnection();

        const db = mongoose.connection.db;
        console.log('✅ Connected to database:', db.databaseName);
        console.log('');

        console.log('📊 Collections & document counts:');
        const collectionsToInspect = [
            'admins',
            'users',
            'organizers',
            'events',
            'group_categories',
            'event_categories',
            'countries',
            'cities',
            'book_events',
            'wallets',
            'transactions'
        ];

        for (const name of collectionsToInspect) {
            try {
                const collection = db.collection(name);
                const count = await collection.countDocuments();
                console.log(`   - ${name}: ${count} docs`);
            } catch (e) {
                console.log(`   - ${name}: (collection not found)`);
            }
        }

        console.log('\n' + '='.repeat(60) + '\n');
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error in debugDbInfo:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
};

if (require.main === module) {
    debugDbInfo();
}

module.exports = { debugDbInfo };

