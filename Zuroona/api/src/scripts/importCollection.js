/**
 * Generic MongoDB Collection Import Script
 * 
 * Usage:
 *   node src/scripts/importCollection.js <collection_name> <json_file_path>
 * 
 * Example:
 *   node src/scripts/importCollection.js refund_request ./data/refund_request.json
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const importCollection = async (collectionName, jsonFilePath) => {
    try {
        // Validate inputs
        if (!collectionName || !jsonFilePath) {
            console.error('❌ Usage: node importCollection.js <collection_name> <json_file_path>');
            console.error('   Example: node importCollection.js refund_request ./data/refund_request.json');
            process.exit(1);
        }

        // Connect to MongoDB
        const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.MONGO_URL;
        if (!mongoUrl) {
            console.error('❌ MongoDB URI not found in environment variables');
            console.error('   Please set MONGO_URI, MONGODB_URI, or MONGO_URL in .env file');
            console.error('   Example: MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database');
            process.exit(1);
        }

        // Show connection info (without password)
        const safeUrl = mongoUrl.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
        console.log('🔄 Connecting to MongoDB...');
        console.log(`   Connection: ${safeUrl}`);

        await mongoose.connect(mongoUrl);
        
        const dbName = mongoose.connection.db.databaseName;
        console.log(`✅ MongoDB connected successfully`);
        console.log(`   Database: ${dbName}`);

        // Read JSON file
        const fullPath = path.isAbsolute(jsonFilePath) 
            ? jsonFilePath 
            : path.join(__dirname, '../../', jsonFilePath);
        
        if (!fs.existsSync(fullPath)) {
            console.error(`❌ File not found: ${fullPath}`);
            process.exit(1);
        }

        console.log(`📂 Reading file: ${fullPath}`);
        const fileContent = fs.readFileSync(fullPath, 'utf8');
        const jsonData = JSON.parse(fileContent);

        // Get database and collection
        const db = mongoose.connection.db;
        const collection = db.collection(collectionName);

        // Check if collection exists and has data
        const existingCount = await collection.countDocuments();
        if (existingCount > 0) {
            console.log(`⚠️  Warning: Collection "${collectionName}" already has ${existingCount} documents`);
            console.log('   Existing data will be kept. New data will be added.');
        }

        // Insert data
        let insertedCount = 0;
        if (Array.isArray(jsonData)) {
            if (jsonData.length === 0) {
                console.log('⚠️  JSON array is empty');
                process.exit(0);
            }
            const result = await collection.insertMany(jsonData, { ordered: false });
            insertedCount = result.insertedCount || jsonData.length;
            console.log(`✅ Imported ${insertedCount} documents into "${collectionName}"`);
        } else {
            await collection.insertOne(jsonData);
            insertedCount = 1;
            console.log(`✅ Imported 1 document into "${collectionName}"`);
        }

        // Show final count
        const finalCount = await collection.countDocuments();
        console.log(`📊 Total documents in "${collectionName}": ${finalCount}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.stack) {
            console.error('Stack:', error.stack);
        }
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
    }
};

// Get command line arguments
const args = process.argv.slice(2);
const collectionName = args[0];
const jsonFilePath = args[1];

// Run if called directly
if (require.main === module) {
    importCollection(collectionName, jsonFilePath);
}

module.exports = importCollection;
