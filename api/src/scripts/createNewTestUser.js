/**
 * Script to create a new test user for app development
 * 
 * Creates a new guest user with verified email and phone number
 * Can login with email/password or phone/OTP (dummy OTP: 123456)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const UserService = require('../services/userService');
const { hashPassword } = require('../helpers/hashPassword');

const createNewTestUser = async () => {
    try {
        console.log('🚀 Creating new test user...\n');

        // Connect to database
        const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error('MongoDB URI not configured');
        }

        await mongoose.connect(mongoURI);
        console.log('✅ Connected to database\n');

        // New Test User credentials
        const newUserData = {
            first_name: 'Demo',
            last_name: 'User',
            email: 'demouser@zuroona.com',
            password: await hashPassword('Demo@123456'),
            phone_number: '503456789',
            country_code: '+966',
            role: 1, // User/Guest
            is_verified: true, // Email verified
            is_delete: 0,
            isActive: 1, // Active user
            language: 'en',
        };

        // Check if user already exists
        let existingUser = await UserService.FindOneService({ email: newUserData.email });
        if (existingUser) {
            console.log('⚠️  User already exists. Updating...');
            await UserService.FindByIdAndUpdateService(existingUser._id, {
                ...newUserData,
                password: newUserData.password,
            });
            console.log('✅ User updated');
        } else {
            const user = await UserService.CreateService(newUserData);
            console.log('✅ New test user created:', user._id);
        }

        // Verify user was created/updated
        const user = await UserService.FindOneService({ email: newUserData.email });
        if (!user) {
            throw new Error('Failed to create/verify user');
        }

        console.log('\n📋 New Test User Credentials:');
        console.log('='.repeat(60));
        console.log('\n👤 NEW TEST USER (Guest):');
        console.log('   Email: demouser@zuroona.com');
        console.log('   Password: Demo@123456');
        console.log('   Phone: +966503456789');
        console.log('   OTP (for phone login): 123456 (dummy)');
        console.log('   Status: Verified & Active');
        console.log('\n' + '='.repeat(60));
        console.log('\n✅ New test user created successfully!');
        console.log('💡 You can login with:');
        console.log('   - Email: demouser@zuroona.com / Password: Demo@123456');
        console.log('   - Phone: +966503456789 / OTP: 123456\n');

        await mongoose.disconnect();
        return { 
            success: true,
            credentials: {
                email: 'demouser@zuroona.com',
                password: 'Demo@123456',
                phone: '+966503456789',
                otp: '123456'
            }
        };

    } catch (error) {
        console.error('❌ Error creating new test user:', error);
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
        throw error;
    }
};

// Run if called directly
if (require.main === module) {
    createNewTestUser()
        .then((result) => {
            console.log('\n✅ Script completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Script failed:', error);
            process.exit(1);
        });
}

module.exports = createNewTestUser;

