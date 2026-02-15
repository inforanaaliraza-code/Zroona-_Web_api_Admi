/**
 * 🔐 Create New Admin Script
 * 
 * This script creates a new admin user in the database
 * Email: admin@Zuroona.com
 * Password: 87654321
 * 
 * Usage: node src/scripts/createNewAdmin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const AdminService = require('../services/adminService');
const { hashPassword } = require('../helpers/hashPassword');

const createNewAdmin = async () => {
    try {
        console.log('\n🚀 Creating New Admin for Zuroona...\n');

        // Connect to database
        const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error('❌ MongoDB URI not configured in .env file');
        }

        await mongoose.connect(mongoURI);
        console.log('✅ Connected to database\n');

        // New Admin credentials (requested)
        const adminEmail = 'dyna@admin.com'; // LOWERCASE - matches login API
        const adminPassword = '@api';

        const newAdminData = {
            firstName: 'Admin',
            lastName: 'Zuroona',
            email: adminEmail, // Saved as lowercase
            password: adminPassword, // Will be hashed by AdminService
            mobileNumber: 500000000,
            countryCode: '+966',
            role: 3, // Admin role
            is_verified: true, // Email verified
            language: 'en',
        };

        // Check if admin already exists (check both cases)
        let existingAdmin = await AdminService.FindOneService({ 
            $or: [
                { email: adminEmail },
                { email: 'admin@Zuroona.com' } // Old case
            ]
        });
        
        if (existingAdmin) {
            console.log('⚠️  Admin already exists. Updating password and email...');
            
            // Hash password manually for update
            const hashedPassword = await hashPassword(adminPassword);
            
            await AdminService.FindByIdAndUpdateService(existingAdmin._id, {
                email: adminEmail, // Update to lowercase
                password: hashedPassword,
                is_verified: true,
            });
            
            console.log('✅ Admin email and password updated successfully!');
        } else {
            // Create new admin (password will be auto-hashed by AdminService)
            const admin = await AdminService.CreateService(newAdminData);
            console.log('✅ New admin created successfully!');
            console.log('   Admin ID:', admin._id);
        }

        // Verify admin was created/updated (check lowercase email)
        const admin = await AdminService.FindOneService({ email: adminEmail });
        if (!admin) {
            console.log('❌ Admin verification failed. Trying with capital Z...');
            const adminAlt = await AdminService.FindOneService({ email: 'admin@Zuroona.com' });
            if (!adminAlt) {
                throw new Error('❌ Failed to create/verify admin');
            }
            // Found with capital Z, update it to lowercase
            await AdminService.FindByIdAndUpdateService(adminAlt._id, {
                email: adminEmail,
            });
            console.log('✅ Updated email to lowercase');
        }

        console.log('\n📋 New Admin Credentials:');
        console.log('='.repeat(70));
        console.log('   Email:    ', adminEmail);
        console.log('   Password: ', adminPassword);
        console.log('   Role:     ', 'Admin (3)');
        console.log('   Status:   ', 'Verified');
        console.log('='.repeat(70));
        console.log('\n✅ Admin created successfully in database!');
        console.log('\n🔐 You can now login to admin panel:');
        console.log('   URL:      httpss://admin.zuroona.sa/adminsa111xyz');
        console.log('   Email:    ', adminEmail);
        console.log('   Password: ', adminPassword);
        console.log('\n');

        // Close database connection
        await mongoose.connection.close();
        console.log('✅ Database connection closed\n');
        
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error creating admin:', error.message);
        console.error(error);
        
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
        
        process.exit(1);
    }
};

// Run the script
createNewAdmin();

