/**
 * Delete Phone Number from Database
 * 
 * This script deletes all users (and organizers) with phone number 597832290
 * 
 * Usage:
 *   node delete-phone-number.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/userModel');
const Organizer = require('./src/models/organizerModel');

// Phone number to delete
const PHONE_NUMBER = 597832290;

// Database connection
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error('MONGO_URI or MONGODB_URI not found in .env file');
        }
        
        await mongoose.connect(mongoURI);
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

async function deletePhoneNumber() {
    try {
        await connectDB();
        
        console.log('\n' + '='.repeat(70));
        console.log('🗑️  DELETE PHONE NUMBER FROM DATABASE');
        console.log('='.repeat(70));
        console.log(`📱 Phone Number: ${PHONE_NUMBER}`);
        console.log('='.repeat(70) + '\n');
        
        // Find users with this phone number
        console.log('🔍 Searching for users with phone number:', PHONE_NUMBER);
        const users = await User.find({ 
            phone_number: PHONE_NUMBER 
        });
        
        console.log(`   Found ${users.length} user(s) with this phone number`);
        
        if (users.length > 0) {
            console.log('\n📋 User Details:');
            users.forEach((user, index) => {
                console.log(`   ${index + 1}. ID: ${user._id}`);
                console.log(`      Name: ${user.first_name} ${user.last_name}`);
                console.log(`      Email: ${user.email}`);
                console.log(`      Country Code: ${user.country_code}`);
                console.log(`      Phone: ${user.phone_number}`);
                console.log(`      Role: ${user.role}`);
                console.log(`      Is Deleted: ${user.is_delete}`);
                console.log(`      Is Verified: ${user.is_verified}`);
                console.log('');
            });
        }
        
        // Find organizers with this phone number
        console.log('🔍 Searching for organizers with phone number:', PHONE_NUMBER);
        const organizers = await Organizer.find({ 
            phone_number: PHONE_NUMBER 
        });
        
        console.log(`   Found ${organizers.length} organizer(s) with this phone number`);
        
        if (organizers.length > 0) {
            console.log('\n📋 Organizer Details:');
            organizers.forEach((organizer, index) => {
                console.log(`   ${index + 1}. ID: ${organizer._id}`);
                console.log(`      Name: ${organizer.first_name} ${organizer.last_name}`);
                console.log(`      Email: ${organizer.email}`);
                console.log(`      Country Code: ${organizer.country_code}`);
                console.log(`      Phone: ${organizer.phone_number}`);
                console.log(`      Role: ${organizer.role}`);
                console.log(`      Is Deleted: ${organizer.is_delete}`);
                console.log(`      Is Verified: ${organizer.is_verified}`);
                console.log('');
            });
        }
        
        const totalRecords = users.length + organizers.length;
        
        if (totalRecords === 0) {
            console.log('✅ No records found with phone number:', PHONE_NUMBER);
            console.log('   Nothing to delete.');
            await mongoose.connection.close();
            console.log('\n✅ Database connection closed');
            return;
        }
        
        // Confirm deletion
        console.log('\n⚠️  WARNING: This will permanently delete the following records:');
        console.log(`   - ${users.length} user(s)`);
        console.log(`   - ${organizers.length} organizer(s)`);
        console.log(`   Total: ${totalRecords} record(s)`);
        console.log('\n⚠️  This action cannot be undone!');
        
        // Delete users
        if (users.length > 0) {
            console.log('\n🗑️  Deleting users...');
            const userDeleteResult = await User.deleteMany({ 
                phone_number: PHONE_NUMBER 
            });
            console.log(`✅ Deleted ${userDeleteResult.deletedCount} user(s)`);
        }
        
        // Delete organizers
        if (organizers.length > 0) {
            console.log('\n🗑️  Deleting organizers...');
            const organizerDeleteResult = await Organizer.deleteMany({ 
                phone_number: PHONE_NUMBER 
            });
            console.log(`✅ Deleted ${organizerDeleteResult.deletedCount} organizer(s)`);
        }
        
        console.log('\n' + '='.repeat(70));
        console.log('✅ DELETION COMPLETE');
        console.log('='.repeat(70));
        console.log(`📱 Phone Number: ${PHONE_NUMBER}`);
        console.log(`🗑️  Total Records Deleted: ${totalRecords}`);
        console.log('='.repeat(70));
        
        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.error(error.stack);
        await mongoose.connection.close();
        process.exit(1);
    }
}

// Run the script
deletePhoneNumber();
