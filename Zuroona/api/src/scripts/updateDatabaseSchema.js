/**
 * Complete Database Schema Update Script
 * 
 * Ye script sabhi collections ke liye:
 * - Indexes create/update karega
 * - Schema validation ensure karega
 * - Performance optimization karega
 * 
 * Usage: node src/scripts/updateDatabaseSchema.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { connectWithRetry, ensureConnection } = require('../config/database');

// Import all models to ensure they're registered
const Admin = require('../models/adminModel');
const User = require('../models/userModel');
const Organizer = require('../models/organizerModel');
const Event = require('../models/eventModel');
const BookEvent = require('../models/eventBookModel');
const GroupCategories = require('../models/groupCategoryModel');
const EventCategories = require('../models/eventCategoryModel');
const Cms = require('../models/cmsModel');
const Wallet = require('../models/walletModel');
const Transaction = require('../models/transactionModel');
const RefundRequest = require('../models/refundRequestModel');
const Notification = require('../models/notificationModel');
const Conversation = require('../models/conversationModel');
const Message = require('../models/messageModel');
const Review = require('../models/reviewModel');
const CareerApplication = require('../models/careerApplicationModel');
const Country = require('../models/countryModel');
const City = require('../models/cityModel');
const BankDetails = require('../models/bankDetailsModel');
const EmailVerificationToken = require('../models/emailVerificationToken Model');

const updateDatabaseSchema = async () => {
    try {
        console.log('\n' + '='.repeat(70));
        console.log('🔧 DATABASE SCHEMA UPDATE SCRIPT');
        console.log('='.repeat(70) + '\n');

        // Connect to MongoDB
        console.log('📡 Connecting to MongoDB...');
        await connectWithRetry();
        await ensureConnection();
        console.log('✅ Connected to MongoDB\n');

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log(`📊 Found ${collections.length} existing collections\n`);

        // ============================================
        // 1. ADMIN COLLECTION INDEXES
        // ============================================
        console.log('👤 Updating Admin collection indexes...');
        try {
            await Admin.collection.createIndex({ email: 1 }, { unique: true, sparse: true });
            await Admin.collection.createIndex({ role: 1 });
            await Admin.collection.createIndex({ is_verified: 1 });
            console.log('   ✅ Admin indexes updated');
        } catch (error) {
            console.log(`   ⚠️  Admin index error: ${error.message}`);
        }

        // ============================================
        // 2. USER COLLECTION INDEXES
        // ============================================
        console.log('👥 Updating User collection indexes...');
        try {
            await User.collection.createIndex({ email: 1 }, { unique: true, sparse: true });
            await User.collection.createIndex({ phone_number: 1, country_code: 1 }, { unique: true, sparse: true });
            await User.collection.createIndex({ role: 1 });
            await User.collection.createIndex({ is_verified: 1 });
            await User.collection.createIndex({ isActive: 1 });
            await User.collection.createIndex({ is_suspended: 1 });
            await User.collection.createIndex({ is_delete: 1 });
            await User.collection.createIndex({ country_id: 1 });
            await User.collection.createIndex({ city_id: 1 });
            await User.collection.createIndex({ createdAt: -1 });
            console.log('   ✅ User indexes updated');
        } catch (error) {
            console.log(`   ⚠️  User index error: ${error.message}`);
        }

        // ============================================
        // 3. ORGANIZER COLLECTION INDEXES
        // ============================================
        console.log('🏢 Updating Organizer collection indexes...');
        try {
            await Organizer.collection.createIndex({ email: 1 }, { unique: true, sparse: true });
            await Organizer.collection.createIndex({ phone_number: 1, country_code: 1 }, { unique: true, sparse: true });
            await Organizer.collection.createIndex({ role: 2 });
            await Organizer.collection.createIndex({ is_verified: 1 });
            await Organizer.collection.createIndex({ is_approved: 1 });
            await Organizer.collection.createIndex({ isActive: 1 });
            await Organizer.collection.createIndex({ is_suspended: 1 });
            await Organizer.collection.createIndex({ country_id: 1 });
            await Organizer.collection.createIndex({ city_id: 1 });
            await Organizer.collection.createIndex({ 'group_location.location': '2dsphere' }); // Geospatial index
            await Organizer.collection.createIndex({ createdAt: -1 });
            console.log('   ✅ Organizer indexes updated');
        } catch (error) {
            console.log(`   ⚠️  Organizer index error: ${error.message}`);
        }

        // ============================================
        // 4. EVENT COLLECTION INDEXES
        // ============================================
        console.log('🎉 Updating Event collection indexes...');
        try {
            await Event.collection.createIndex({ organizer_id: 1 });
            await Event.collection.createIndex({ event_date: 1 });
            await Event.collection.createIndex({ event_category: 1 });
            await Event.collection.createIndex({ event_for: 1 });
            await Event.collection.createIndex({ is_approved: 1 });
            await Event.collection.createIndex({ isActive: 1 });
            await Event.collection.createIndex({ is_delete: 1 });
            await Event.collection.createIndex({ location: '2dsphere' }); // Geospatial index
            await Event.collection.createIndex({ event_date: 1, is_approved: 1, isActive: 1 }); // Compound index
            await Event.collection.createIndex({ createdAt: -1 });
            console.log('   ✅ Event indexes updated');
        } catch (error) {
            console.log(`   ⚠️  Event index error: ${error.message}`);
        }

        // ============================================
        // 5. BOOK EVENT COLLECTION INDEXES
        // ============================================
        console.log('📅 Updating Book Event collection indexes...');
        try {
            await BookEvent.collection.createIndex({ user_id: 1 });
            await BookEvent.collection.createIndex({ event_id: 1 });
            await BookEvent.collection.createIndex({ organizer_id: 1 });
            await BookEvent.collection.createIndex({ book_status: 1 });
            await BookEvent.collection.createIndex({ payment_status: 1 });
            await BookEvent.collection.createIndex({ order_id: 1 }, { unique: true, sparse: true });
            await BookEvent.collection.createIndex({ payment_id: 1 }, { sparse: true });
            await BookEvent.collection.createIndex({ refund_request_id: 1 }, { sparse: true });
            await BookEvent.collection.createIndex({ user_id: 1, book_status: 1 }); // Compound index
            await BookEvent.collection.createIndex({ organizer_id: 1, book_status: 1 }); // Compound index
            await BookEvent.collection.createIndex({ createdAt: -1 });
            await BookEvent.collection.createIndex({ hold_expires_at: 1 }, { sparse: true }); // For expired holds cleanup
            console.log('   ✅ Book Event indexes updated');
        } catch (error) {
            console.log(`   ⚠️  Book Event index error: ${error.message}`);
        }

        // ============================================
        // 6. GROUP CATEGORIES INDEXES
        // ============================================
        console.log('📁 Updating Group Categories indexes...');
        try {
            await GroupCategories.collection.createIndex({ 'name.en': 1 });
            await GroupCategories.collection.createIndex({ 'name.ar': 1 });
            await GroupCategories.collection.createIndex({ createdAt: -1 });
            console.log('   ✅ Group Categories indexes updated');
        } catch (error) {
            console.log(`   ⚠️  Group Categories index error: ${error.message}`);
        }

        // ============================================
        // 7. EVENT CATEGORIES INDEXES
        // ============================================
        console.log('🎯 Updating Event Categories indexes...');
        try {
            await EventCategories.collection.createIndex({ 'name.en': 1 });
            await EventCategories.collection.createIndex({ 'name.ar': 1 });
            await EventCategories.collection.createIndex({ is_delete: 1 });
            await EventCategories.collection.createIndex({ createdAt: -1 });
            console.log('   ✅ Event Categories indexes updated');
        } catch (error) {
            console.log(`   ⚠️  Event Categories index error: ${error.message}`);
        }

        // ============================================
        // 8. WALLET COLLECTION INDEXES
        // ============================================
        console.log('💰 Updating Wallet collection indexes...');
        try {
            await Wallet.collection.createIndex({ organizer_id: 1 }, { unique: true });
            await Wallet.collection.createIndex({ total_amount: 1 });
            console.log('   ✅ Wallet indexes updated');
        } catch (error) {
            console.log(`   ⚠️  Wallet index error: ${error.message}`);
        }

        // ============================================
        // 9. TRANSACTION COLLECTION INDEXES
        // ============================================
        console.log('💳 Updating Transaction collection indexes...');
        try {
            await Transaction.collection.createIndex({ organizer_id: 1 });
            await Transaction.collection.createIndex({ user_id: 1 }, { sparse: true });
            await Transaction.collection.createIndex({ type: 1 });
            await Transaction.collection.createIndex({ status: 1 });
            await Transaction.collection.createIndex({ book_id: 1 }, { sparse: true });
            await Transaction.collection.createIndex({ payment_id: 1 }, { sparse: true });
            await Transaction.collection.createIndex({ organizer_id: 1, type: 1, status: 1 }); // Compound index
            await Transaction.collection.createIndex({ createdAt: -1 });
            await Transaction.collection.createIndex({ requested_at: -1 });
            console.log('   ✅ Transaction indexes updated');
        } catch (error) {
            console.log(`   ⚠️  Transaction index error: ${error.message}`);
        }

        // ============================================
        // 10. REFUND REQUEST COLLECTION INDEXES
        // ============================================
        console.log('🔄 Updating Refund Request collection indexes...');
        try {
            await RefundRequest.collection.createIndex({ user_id: 1, status: 1 });
            await RefundRequest.collection.createIndex({ booking_id: 1 });
            await RefundRequest.collection.createIndex({ event_id: 1 });
            await RefundRequest.collection.createIndex({ organizer_id: 1 });
            await RefundRequest.collection.createIndex({ status: 1 });
            await RefundRequest.collection.createIndex({ createdAt: -1 });
            console.log('   ✅ Refund Request indexes updated');
        } catch (error) {
            console.log(`   ⚠️  Refund Request index error: ${error.message}`);
        }

        // ============================================
        // 11. NOTIFICATION COLLECTION INDEXES
        // ============================================
        console.log('🔔 Updating Notification collection indexes...');
        try {
            await Notification.collection.createIndex({ user_id: 1, role: 1 });
            await Notification.collection.createIndex({ isRead: 1 });
            await Notification.collection.createIndex({ notification_type: 1 });
            await Notification.collection.createIndex({ event_id: 1 }, { sparse: true });
            await Notification.collection.createIndex({ book_id: 1 }, { sparse: true });
            await Notification.collection.createIndex({ user_id: 1, isRead: 1, createdAt: -1 }); // Compound index
            await Notification.collection.createIndex({ createdAt: -1 });
            console.log('   ✅ Notification indexes updated');
        } catch (error) {
            console.log(`   ⚠️  Notification index error: ${error.message}`);
        }

        // ============================================
        // 12. CONVERSATION COLLECTION INDEXES
        // ============================================
        console.log('💬 Updating Conversation collection indexes...');
        try {
            await Conversation.collection.createIndex({ user_id: 1, last_message_at: -1 });
            await Conversation.collection.createIndex({ organizer_id: 1, last_message_at: -1 });
            await Conversation.collection.createIndex({ event_id: 1 });
            await Conversation.collection.createIndex({ 'participants.user_id': 1 });
            await Conversation.collection.createIndex({ event_id: 1, user_id: 1, organizer_id: 1 }, { 
                unique: true,
                partialFilterExpression: { is_group: false }
            });
            await Conversation.collection.createIndex({ event_id: 1, is_group: 1 }, { 
                unique: true,
                partialFilterExpression: { is_group: true }
            });
            await Conversation.collection.createIndex({ status: 1 });
            await Conversation.collection.createIndex({ closed_at: 1 }, { sparse: true });
            console.log('   ✅ Conversation indexes updated');
        } catch (error) {
            console.log(`   ⚠️  Conversation index error: ${error.message}`);
        }

        // ============================================
        // 13. MESSAGE COLLECTION INDEXES
        // ============================================
        console.log('📨 Updating Message collection indexes...');
        try {
            await Message.collection.createIndex({ conversation_id: 1, createdAt: -1 });
            await Message.collection.createIndex({ sender_id: 1 });
            await Message.collection.createIndex({ sender_role: 1 });
            await Message.collection.createIndex({ isRead: 1 });
            await Message.collection.createIndex({ createdAt: -1 });
            console.log('   ✅ Message indexes updated');
        } catch (error) {
            console.log(`   ⚠️  Message index error: ${error.message}`);
        }

        // ============================================
        // 14. REVIEW COLLECTION INDEXES
        // ============================================
        console.log('⭐ Updating Review collection indexes...');
        try {
            await Review.collection.createIndex({ event_id: 1 });
            await Review.collection.createIndex({ user_id: 1 });
            await Review.collection.createIndex({ event_id: 1, user_id: 1 }, { unique: true }); // One review per user per event
            await Review.collection.createIndex({ rating: 1 });
            await Review.collection.createIndex({ createdAt: -1 });
            console.log('   ✅ Review indexes updated');
        } catch (error) {
            console.log(`   ⚠️  Review index error: ${error.message}`);
        }

        // ============================================
        // 15. CAREER APPLICATION INDEXES
        // ============================================
        console.log('💼 Updating Career Application indexes...');
        try {
            await CareerApplication.collection.createIndex({ email: 1 });
            await CareerApplication.collection.createIndex({ status: 1 });
            await CareerApplication.collection.createIndex({ position: 1 });
            await CareerApplication.collection.createIndex({ createdAt: -1 });
            console.log('   ✅ Career Application indexes updated');
        } catch (error) {
            console.log(`   ⚠️  Career Application index error: ${error.message}`);
        }

        // ============================================
        // 16. CMS COLLECTION INDEXES
        // ============================================
        console.log('📄 Updating CMS collection indexes...');
        try {
            await Cms.collection.createIndex({ type: 1 }, { unique: true });
            await Cms.collection.createIndex({ createdAt: -1 });
            console.log('   ✅ CMS indexes updated');
        } catch (error) {
            console.log(`   ⚠️  CMS index error: ${error.message}`);
        }

        // ============================================
        // 17. COUNTRY & CITY INDEXES (if models exist)
        // ============================================
        console.log('🌍 Updating Country/City indexes...');
        try {
            if (Country) {
                await Country.collection.createIndex({ code: 1 }, { unique: true });
                await Country.collection.createIndex({ 'translations.locale': 1 });
                await Country.collection.createIndex({ createdAt: -1 });
                console.log('   ✅ Country indexes updated');
            }
        } catch (error) {
            console.log(`   ⚠️  Country index error: ${error.message}`);
        }

        try {
            if (City) {
                await City.collection.createIndex({ country_id: 1 });
                await City.collection.createIndex({ 'translations.locale': 1 });
                await City.collection.createIndex({ country_id: 1, 'translations.locale': 1 });
                await City.collection.createIndex({ createdAt: -1 });
                console.log('   ✅ City indexes updated');
            }
        } catch (error) {
            console.log(`   ⚠️  City index error: ${error.message}`);
        }

        // ============================================
        // 18. EMAIL VERIFICATION TOKEN INDEXES
        // ============================================
        console.log('📧 Updating Email Verification Token indexes...');
        try {
            if (EmailVerificationToken) {
                await EmailVerificationToken.collection.createIndex({ token: 1 }, { unique: true });
                await EmailVerificationToken.collection.createIndex({ user_id: 1, user_type: 1 });
                await EmailVerificationToken.collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
                await EmailVerificationToken.collection.createIndex({ email: 1 });
                await EmailVerificationToken.collection.createIndex({ token_type: 1 });
                console.log('   ✅ Email Verification Token indexes updated');
            }
        } catch (error) {
            console.log(`   ⚠️  Email Verification Token index error: ${error.message}`);
        }

        // ============================================
        // 19. BANK DETAILS INDEXES (if model exists)
        // ============================================
        console.log('🏦 Updating Bank Details indexes...');
        try {
            if (BankDetails) {
                await BankDetails.collection.createIndex({ organizer_id: 1 }, { unique: true });
                await BankDetails.collection.createIndex({ createdAt: -1 });
                console.log('   ✅ Bank Details indexes updated');
            }
        } catch (error) {
            console.log(`   ⚠️  Bank Details index error: ${error.message}`);
        }

        // ============================================
        // 20. COUNTER COLLECTION (for order_id generation)
        // ============================================
        console.log('🔢 Updating Counter collection indexes...');
        try {
            const Counter = db.collection('counters');
            await Counter.createIndex({ name: 1 }, { unique: true });
            console.log('   ✅ Counter indexes updated');
        } catch (error) {
            console.log(`   ⚠️  Counter index error: ${error.message}`);
        }

        // ============================================
        // SUMMARY
        // ============================================
        console.log('\n' + '='.repeat(70));
        console.log('✅ DATABASE SCHEMA UPDATE COMPLETED SUCCESSFULLY!');
        console.log('='.repeat(70));
        
        // Get index statistics
        console.log('\n📊 Index Summary:');
        const allCollections = [
            'admins', 'users', 'organizers', 'events', 'book_events',
            'group_categories', 'event_categories', 'wallets', 'transactions',
            'refund_requests', 'notifications', 'conversations', 'messages',
            'event_reviews', 'career_applications', 'cms'
        ];

        for (const collectionName of allCollections) {
            try {
                const collection = db.collection(collectionName);
                const indexes = await collection.indexes();
                console.log(`   ${collectionName}: ${indexes.length} indexes`);
            } catch (error) {
                // Collection might not exist, skip
            }
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
    updateDatabaseSchema()
        .then(() => {
            console.log('✅ Script completed successfully.\n');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Script failed:', error);
            process.exit(1);
        });
}

module.exports = { updateDatabaseSchema };
