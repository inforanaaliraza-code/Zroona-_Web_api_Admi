/**
 * Script to create test users for development
 * Creates:
 * 1. Guest account (role 1) with OTP 123456
 * 2. Host account (role 2) with OTP 123456
 * 
 * Run: node api/src/scripts/createTestUsers.js
 */

require('dotenv').config();
const UserService = require('../services/userService');
const organizerService = require('../services/organizerService');
const { ensureConnection } = require('../config/database');

const createTestUsers = async () => {
    try {
        console.log('🚀 Starting test users creation...\n');

        // Connect to database
        await ensureConnection();
        console.log('✅ Connected to database\n');

        // Check if users already exist
        const existingGuest = await UserService.FindOneService({
            email: 'guest@test.com'
        });

        const existingHost = await organizerService.FindOneService({
            email: 'host@test.com'
        });

        // 1. Create Guest User (role 1)
        if (existingGuest) {
            console.log('⚠️  Guest user already exists with email: guest@test.com');
            console.log('   Updating phone number, OTP, and verification status...\n');
            await UserService.FindByIdAndUpdateService(existingGuest._id, {
                phone_number: 501234567, // Saudi: 9 digits starting with 5
                otp: '123456',
                is_verified: true, // Mark as fully verified
                phone_verified: true,
                email_verified_at: new Date(),
                phone_verified_at: new Date()
            });
            console.log('✅ Guest user updated successfully!\n');
        } else {
            console.log('📝 Creating Guest user...');
            const guestData = {
                first_name: 'Test',
                last_name: 'Guest',
                email: 'guest@test.com',
                phone_number: 501234567, // Saudi: 9 digits starting with 5
                country_code: '+966',
                gender: 1, // 1=Male, 2=Female, 3=Other
                date_of_birth: new Date('1990-01-01'),
                role: 1, // Guest role
                otp: '123456', // Fixed OTP for testing
                is_verified: true, // Mark as fully verified for testing
                phone_verified: true,
                email_verified_at: new Date(),
                phone_verified_at: new Date(),
                language: 'en',
                isActive: 1,
                is_suspended: false,
                registration_step: 1
            };

            const guestUser = await UserService.CreateService(guestData);
            console.log('✅ Guest user created successfully!');
            console.log('   ID:', guestUser._id);
            console.log('   Email:', guestUser.email);
            console.log('   Phone:', guestUser.country_code + guestUser.phone_number);
            console.log('   OTP: 123456\n');
        }

        // 2. Create Host/Organizer User (role 2)
        if (existingHost) {
            console.log('⚠️  Host user already exists with email: host@test.com');
            console.log('   Updating phone number, OTP, and verification status...\n');
            await organizerService.FindByIdAndUpdateService(existingHost._id, {
                phone_number: 598765432, // Saudi: 9 digits starting with 5
                otp: '123456',
                is_verified: true, // Mark as fully verified
                phone_verified: true,
                email_verified_at: new Date(),
                phone_verified_at: new Date()
            });
            console.log('✅ Host user updated successfully!\n');
        } else {
            console.log('📝 Creating Host/Organizer user...');
            const hostData = {
                first_name: 'Test',
                last_name: 'Host',
                email: 'host@test.com',
                phone_number: 598765432, // Saudi: 9 digits starting with 5
                country_code: '+966',
                gender: 1, // 1=Male, 2=Female, 3=Other
                date_of_birth: new Date('1985-05-15'),
                role: 2, // Host/Organizer role
                otp: '123456', // Fixed OTP for testing
                is_verified: true, // Mark as fully verified for testing
                phone_verified: true,
                email_verified_at: new Date(),
                phone_verified_at: new Date(),
                language: 'en',
                isActive: 1,
                is_suspended: false,
                is_approved: 2, // 1=pending, 2=approved, 3=rejected
                registration_step: 4, // Complete registration
                registration_type: 'New',
                max_event_capacity: 100
            };

            const hostUser = await organizerService.CreateService(hostData);
            console.log('✅ Host user created successfully!');
            console.log('   ID:', hostUser._id);
            console.log('   Email:', hostUser.email);
            console.log('   Phone:', hostUser.country_code + hostUser.phone_number);
            console.log('   OTP: 123456\n');
        }

        console.log('🎉 Test users setup completed!\n');
        console.log('📋 Test Users Summary:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('1. Guest Account:');
        console.log('   Email: guest@test.com');
        console.log('   Phone: +966501234567');
        console.log('   OTP: 123456');
        console.log('   Role: 1 (Guest)');
        console.log('');
        console.log('2. Host Account:');
        console.log('   Email: host@test.com');
        console.log('   Phone: +966598765432');
        console.log('   OTP: 123456');
        console.log('   Role: 2 (Host/Organizer)');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating test users:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
};

// Run the script
createTestUsers();

