/**
 * Create Multiple Admin Users Script
 * 
 * Creates multiple admin users in MongoDB with specified credentials
 * 
 * Usage: node src/scripts/createMultipleAdmins.js
 */

const mongoose = require("mongoose");
const { connectWithRetry, ensureConnection } = require("../config/database");
const Admin = require("../models/adminModel");
const HashPassword = require("../helpers/hashPassword");

const createMultipleAdmins = async () => {
    try {
        console.log('\n' + '='.repeat(70));
        console.log('👤 CREATE MULTIPLE ADMIN USERS');
        console.log('='.repeat(70) + '\n');

        // Admin credentials array
        const admins = [
            {
                email: "admin@pro.zuroona.sa",
                password: "@pro.zuroona55771",
                firstName: "Admin",
                lastName: "Pro"
            },
            {
                email: "admin@zuroona.sa",
                password: "@zuroona55771",
                firstName: "Admin",
                lastName: "Zuroona"
            }
        ];

        // Connect to MongoDB
        console.log('📡 Connecting to MongoDB...');
        await connectWithRetry();
        await ensureConnection();
        console.log('✅ Connected to MongoDB\n');

        const createdAdmins = [];
        const skippedAdmins = [];

        // Create each admin
        for (const adminData of admins) {
            try {
                console.log(`\n${'='.repeat(70)}`);
                console.log(`🔍 Processing: ${adminData.email}`);
                console.log('='.repeat(70));

                // Check if admin already exists
                const existingAdmin = await Admin.findOne({ email: adminData.email.toLowerCase() });
                
                if (existingAdmin) {
                    console.log(`⚠️  Admin with email "${adminData.email}" already exists!`);
                    console.log(`   Admin ID: ${existingAdmin._id}`);
                    skippedAdmins.push({
                        email: adminData.email,
                        reason: 'Already exists',
                        adminId: existingAdmin._id
                    });
                    continue;
                }

                // Hash password
                console.log('🔐 Hashing password...');
                const hashedPassword = await HashPassword.hashPassword(adminData.password);
                console.log('✅ Password hashed successfully');

                // Create admin
                const newAdmin = {
                    email: adminData.email.toLowerCase(),
                    password: hashedPassword,
                    firstName: adminData.firstName,
                    lastName: adminData.lastName,
                    role: 3, // Admin role
                    is_verified: true, // Verified by default for admin
                    language: 'en'
                };

                console.log('📝 Creating admin user...');
                const admin = await Admin.create(newAdmin);
                console.log('✅ Admin created successfully!');

                createdAdmins.push({
                    id: admin._id,
                    email: admin.email,
                    firstName: admin.firstName,
                    lastName: admin.lastName,
                    password: adminData.password // Store original password for display
                });

                console.log(`\n📊 Created Admin Details:`);
                console.log(`   ID: ${admin._id}`);
                console.log(`   Email: ${admin.email}`);
                console.log(`   Name: ${admin.firstName} ${admin.lastName || ''}`);
                console.log(`   Role: ${admin.role}`);
                console.log(`   Verified: ${admin.is_verified}`);

            } catch (error) {
                console.error(`\n❌ Error creating admin ${adminData.email}:`, error.message);
                skippedAdmins.push({
                    email: adminData.email,
                    reason: error.message
                });
            }
        }

        // Summary
        console.log('\n' + '='.repeat(70));
        console.log('📊 SUMMARY');
        console.log('='.repeat(70));

        if (createdAdmins.length > 0) {
            console.log(`\n✅ Successfully Created ${createdAdmins.length} Admin(s):`);
            createdAdmins.forEach((admin, index) => {
                console.log(`\n   ${index + 1}. ${admin.email}`);
                console.log(`      ID: ${admin.id}`);
                console.log(`      Name: ${admin.firstName} ${admin.lastName}`);
                console.log(`      Password: ${admin.password}`);
            });
        }

        if (skippedAdmins.length > 0) {
            console.log(`\n⚠️  Skipped ${skippedAdmins.length} Admin(s):`);
            skippedAdmins.forEach((admin, index) => {
                console.log(`\n   ${index + 1}. ${admin.email}`);
                console.log(`      Reason: ${admin.reason}`);
                if (admin.adminId) {
                    console.log(`      Existing ID: ${admin.adminId}`);
                }
            });
        }

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
    createMultipleAdmins()
        .then(() => {
            console.log('✅ Script completed successfully.\n');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Script failed:', error);
            process.exit(1);
        });
}

module.exports = { createMultipleAdmins };
