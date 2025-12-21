/**
 * Script to create test users (User and Host) for app development
 * 
 * This script creates:
 * 1. A test user (guest) with phone number and verified email
 * 2. A test host (organizer) with phone number and verified email (approved)
 * 
 * Both users can login with phone number using dummy OTP: 123456
 */

require('dotenv').config();
const mongoose = require('mongoose');
const UserService = require('../services/userService');
const OrganizerService = require('../services/organizerService');
const { hashPassword } = require('../helpers/hashPassword');

const createTestUsers = async () => {
    try {
        console.log('🚀 Creating test users...\n');

        // Connect to database
        const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error('MongoDB URI not configured');
        }

        await mongoose.connect(mongoURI);
        console.log('✅ Connected to database\n');

        // Test User (Guest) credentials
        const testUserData = {
            first_name: 'Test',
            last_name: 'User',
            email: 'testuser@zuroona.com',
            password: await hashPassword('Test@123456'),
            phone_number: '501234567',
            country_code: '+966',
            role: 1, // User/Guest
            is_verified: true, // Email verified
            is_delete: 0,
            language: 'en',
        };

        // Test Host (Organizer) credentials
        const testHostData = {
            first_name: 'Test',
            last_name: 'Host',
            email: 'testhost@zuroona.com',
            password: await hashPassword('Test@123456'),
            phone_number: '502345678',
            country_code: '+966',
            role: 2, // Organizer/Host
            is_verified: true, // Email verified
            is_approved: 2, // Approved by admin (2 = approved)
            is_delete: 0,
            language: 'en',
            registration_step: 4, // Complete registration
        };

        // Check if test user already exists
        let existingUser = await UserService.FindOneService({ email: testUserData.email });
        if (existingUser) {
            console.log('⚠️  Test user already exists. Updating...');
            await UserService.FindByIdAndUpdateService(existingUser._id, {
                ...testUserData,
                password: testUserData.password,
            });
            console.log('✅ Test user updated');
        } else {
            const user = await UserService.CreateService(testUserData);
            console.log('✅ Test user created:', user._id);
        }

        // Check if test host already exists
        let existingHost = await OrganizerService.FindOneService({ email: testHostData.email });
        if (existingHost) {
            console.log('⚠️  Test host already exists. Updating...');
            await OrganizerService.FindByIdAndUpdateService(existingHost._id, {
                ...testHostData,
                password: testHostData.password,
            });
            console.log('✅ Test host updated');
        } else {
            const host = await OrganizerService.CreateService(testHostData);
            console.log('✅ Test host created:', host._id);
        }

        console.log('\n📋 Test Account Credentials:');
        console.log('='.repeat(60));
        console.log('\n👤 TEST USER (Guest):');
        console.log('   Email: testuser@zuroona.com');
        console.log('   Password: Test@123456');
        console.log('   Phone: +966501234567');
        console.log('   OTP (for phone login): 123456 (dummy)');
        console.log('\n🏠 TEST HOST (Organizer):');
        console.log('   Email: testhost@zuroona.com');
        console.log('   Password: Test@123456');
        console.log('   Phone: +966502345678');
        console.log('   OTP (for phone login): 123456 (dummy)');
        console.log('   Status: Approved (can login)');
        console.log('\n' + '='.repeat(60));
        console.log('\n✅ Test users created successfully!');
        console.log('💡 You can now login with phone number using dummy OTP: 123456\n');

        await mongoose.disconnect();
        return { success: true };

    } catch (error) {
        console.error('❌ Error creating test users:', error);
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
        throw error;
    }
};

// Run if called directly
if (require.main === module) {
    createTestUsers()
        .then((result) => {
            console.log('✅ Script completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Script failed:', error);
            process.exit(1);
        });
}

module.exports = createTestUsers;

