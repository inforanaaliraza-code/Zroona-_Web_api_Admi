/**
 * Create Admin User Script
 * 
 * Creates a new admin user in MongoDB with the specified credentials
 * 
 * Usage: node src/scripts/createAdmin.js
 */

const mongoose = require("mongoose");
const { connectWithRetry, ensureConnection } = require("../config/database");
const Admin = require("../models/adminModel");
const HashPassword = require("../helpers/hashPassword");

const createAdmin = async () => {
    try {
        console.log('\n' + '='.repeat(70));
        console.log('👤 CREATE ADMIN USER');
        console.log('='.repeat(70) + '\n');

        // Admin credentials
        const email = "admin@zuroona.sa";
        const password = "admin@zuroona.sa@#123";
        const firstName = "Admin";
        const lastName = "Zuroona";

        // Connect to MongoDB
        console.log('📡 Connecting to MongoDB...');
        await connectWithRetry();
        await ensureConnection();
        console.log('✅ Connected to MongoDB\n');

        // Check if admin already exists
        console.log(`🔍 Checking if admin with email "${email}" already exists...`);
        const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
        
        if (existingAdmin) {
            console.log('⚠️  Admin with this email already exists!');
            console.log(`   Admin ID: ${existingAdmin._id}`);
            console.log(`   Name: ${existingAdmin.firstName} ${existingAdmin.lastName || ''}`);
            console.log('\n❌ Cannot create duplicate admin. Exiting...\n');
            await mongoose.connection.close();
            return;
        }

        console.log('✅ No existing admin found. Proceeding with creation...\n');

        // Hash password
        console.log('🔐 Hashing password...');
        const hashedPassword = await HashPassword.hashPassword(password);
        console.log('✅ Password hashed successfully\n');

        // Create admin data
        const adminData = {
            email: email.toLowerCase(),
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName,
            role: 3, // Admin role
            is_verified: true, // Verified by default for admin
            language: 'en'
        };

        // Create admin
        console.log('📝 Creating admin user...');
        const admin = await Admin.create(adminData);
        console.log('✅ Admin created successfully!\n');

        // Display results
        console.log('='.repeat(70));
        console.log('✅ ADMIN CREATED SUCCESSFULLY');
        console.log('='.repeat(70));
        console.log('\n📊 Admin Details:');
        console.log(`   ID: ${admin._id}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Name: ${admin.firstName} ${admin.lastName || ''}`);
        console.log(`   Role: ${admin.role}`);
        console.log(`   Verified: ${admin.is_verified}`);
        console.log(`   Language: ${admin.language}`);
        console.log('\n🔑 Login Credentials:');
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);
        console.log('\n' + '='.repeat(70) + '\n');

        // Close database connection
        await mongoose.connection.close();
        console.log('✅ Database connection closed.\n');

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.error(error.stack);
        console.log('\n⚠️  Database connection may still be open. Please check manually.\n');
        process.exit(1);
    }
};

// Run the script
if (require.main === module) {
    createAdmin()
        .then(() => {
            console.log('✅ Script completed successfully.\n');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Script failed:', error);
            process.exit(1);
        });
}

module.exports = { createAdmin };

