/**
 * Comprehensive Database Seed Script
 * 
 * Ye script admin panel ke liye sab required test data create karega:
 * - Admin user
 * - Test users (guests)
 * - Test organizers (hosts)
 * - Group categories
 * - Event categories
 * - Test events
 * - CMS data
 * 
 * Usage: node src/scripts/seedDatabase.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { connectWithRetry, ensureConnection } = require('../config/database');
const HashPassword = require('../helpers/hashPassword');

// Models
const Admin = require('../models/adminModel');
const User = require('../models/userModel');
const Organizer = require('../models/organizerModel');
const Event = require('../models/eventModel');
const GroupCategories = require('../models/groupCategoryModel');
const EventCategories = require('../models/eventCategoryModel');
const Cms = require('../models/cmsModel');

const seedDatabase = async () => {
    try {
        console.log('\n' + '='.repeat(70));
        console.log('🌱 DATABASE SEEDING SCRIPT');
        console.log('='.repeat(70) + '\n');

        // Connect to MongoDB
        console.log('📡 Connecting to MongoDB...');
        await connectWithRetry();
        await ensureConnection();
        console.log('✅ Connected to MongoDB\n');

        // ============================================
        // 1. CREATE ADMIN USER
        // ============================================
        console.log('👤 Creating Admin User...');
        const adminEmail = 'zuroona@admin.com';
        const adminPassword = '12345678';
        
        let admin = await Admin.findOne({ email: adminEmail.toLowerCase() });
        
        if (!admin) {
            const hashedPassword = await HashPassword.hashPassword(adminPassword);
            admin = await Admin.create({
                email: adminEmail.toLowerCase(),
                password: hashedPassword,
                firstName: 'Admin',
                lastName: 'Zuroona',
                role: 3,
                is_verified: true,
                language: 'en'
            });
            console.log('✅ Admin created successfully!');
        } else {
            console.log('⚠️  Admin already exists, skipping...');
        }
        console.log(`   Email: ${adminEmail}`);
        console.log(`   Password: ${adminPassword}\n`);

        // ============================================
        // 2. CREATE TEST USERS (GUESTS)
        // ============================================
        console.log('👥 Creating Test Users (Guests)...');
        const testUsers = [
            {
                first_name: 'Ahmed',
                last_name: 'Ali',
                email: 'ahmed@test.com',
                phone_number: 501234567,
                country_code: '+966',
                gender: 1,
                date_of_birth: new Date('1990-01-15'),
                role: 1,
                is_verified: true,
                phone_verified: true,
                email_verified_at: new Date(),
                phone_verified_at: new Date(),
                language: 'en',
                isActive: 1,
                is_suspended: false,
                registration_step: 1
            },
            {
                first_name: 'Fatima',
                last_name: 'Hassan',
                email: 'fatima@test.com',
                phone_number: 502345678,
                country_code: '+966',
                gender: 2,
                date_of_birth: new Date('1995-03-20'),
                role: 1,
                is_verified: true,
                phone_verified: true,
                email_verified_at: new Date(),
                phone_verified_at: new Date(),
                language: 'ar',
                isActive: 1,
                is_suspended: false,
                registration_step: 1
            },
            {
                first_name: 'Mohammed',
                last_name: 'Saud',
                email: 'mohammed@test.com',
                phone_number: 503456789,
                country_code: '+966',
                gender: 1,
                date_of_birth: new Date('1988-07-10'),
                role: 1,
                is_verified: true,
                phone_verified: true,
                email_verified_at: new Date(),
                phone_verified_at: new Date(),
                language: 'en',
                isActive: 1,
                is_suspended: false,
                registration_step: 1
            }
        ];

        const createdUsers = [];
        for (const userData of testUsers) {
            let user = await User.findOne({ email: userData.email.toLowerCase() });
            if (!user) {
                user = await User.create(userData);
                createdUsers.push(user);
                console.log(`   ✅ Created user: ${userData.first_name} ${userData.last_name}`);
            } else {
                console.log(`   ⚠️  User already exists: ${userData.email}`);
                createdUsers.push(user);
            }
        }
        console.log(`✅ Total users: ${createdUsers.length}\n`);

        // ============================================
        // 3. CREATE TEST ORGANIZERS (HOSTS)
        // ============================================
        console.log('🏢 Creating Test Organizers (Hosts)...');
        const testOrganizers = [
            {
                first_name: 'Omar',
                last_name: 'Khalid',
                email: 'omar@host.com',
                phone_number: 504567890,
                country_code: '+966',
                gender: 1,
                date_of_birth: new Date('1985-05-15'),
                role: 2,
                is_verified: true,
                phone_verified: true,
                email_verified_at: new Date(),
                phone_verified_at: new Date(),
                language: 'en',
                isActive: 1,
                is_suspended: false,
                is_approved: 2, // Approved
                registration_step: 4,
                registration_type: 'New',
                max_event_capacity: 100,
                bio: 'Professional event organizer with 10+ years of experience'
            },
            {
                first_name: 'Layla',
                last_name: 'Ahmed',
                email: 'layla@host.com',
                phone_number: 505678901,
                country_code: '+966',
                gender: 2,
                date_of_birth: new Date('1990-08-22'),
                role: 2,
                is_verified: true,
                phone_verified: true,
                email_verified_at: new Date(),
                phone_verified_at: new Date(),
                language: 'ar',
                isActive: 1,
                is_suspended: false,
                is_approved: 2, // Approved
                registration_step: 4,
                registration_type: 'New',
                max_event_capacity: 150,
                bio: 'Creative event planner specializing in cultural events'
            }
        ];

        const createdOrganizers = [];
        for (const orgData of testOrganizers) {
            let organizer = await Organizer.findOne({ email: orgData.email.toLowerCase() });
            if (!organizer) {
                organizer = await Organizer.create(orgData);
                createdOrganizers.push(organizer);
                console.log(`   ✅ Created organizer: ${orgData.first_name} ${orgData.last_name}`);
            } else {
                console.log(`   ⚠️  Organizer already exists: ${orgData.email}`);
                createdOrganizers.push(organizer);
            }
        }
        console.log(`✅ Total organizers: ${createdOrganizers.length}\n`);

        // ============================================
        // 4. CREATE GROUP CATEGORIES
        // ============================================
        console.log('📁 Creating Group Categories...');
        const groupCategories = [
            {
                name: {
                    en: 'Music & Concerts',
                    ar: 'الموسيقى والحفلات'
                },
                selected_image: 'https://example.com/music-selected.png',
                unselected_image: 'https://example.com/music-unselected.png'
            },
            {
                name: {
                    en: 'Sports & Fitness',
                    ar: 'الرياضة واللياقة البدنية'
                },
                selected_image: 'https://example.com/sports-selected.png',
                unselected_image: 'https://example.com/sports-unselected.png'
            },
            {
                name: {
                    en: 'Food & Dining',
                    ar: 'الطعام والمطاعم'
                },
                selected_image: 'https://example.com/food-selected.png',
                unselected_image: 'https://example.com/food-unselected.png'
            },
            {
                name: {
                    en: 'Arts & Culture',
                    ar: 'الفنون والثقافة'
                },
                selected_image: 'https://example.com/arts-selected.png',
                unselected_image: 'https://example.com/arts-unselected.png'
            },
            {
                name: {
                    en: 'Business & Networking',
                    ar: 'الأعمال والشبكات'
                },
                selected_image: 'https://example.com/business-selected.png',
                unselected_image: 'https://example.com/business-unselected.png'
            }
        ];

        const createdGroupCategories = [];
        for (const catData of groupCategories) {
            let category = await GroupCategories.findOne({ 'name.en': catData.name.en });
            if (!category) {
                category = await GroupCategories.create(catData);
                createdGroupCategories.push(category);
                console.log(`   ✅ Created category: ${catData.name.en}`);
            } else {
                console.log(`   ⚠️  Category already exists: ${catData.name.en}`);
                createdGroupCategories.push(category);
            }
        }
        console.log(`✅ Total group categories: ${createdGroupCategories.length}\n`);

        // ============================================
        // 5. CREATE EVENT CATEGORIES
        // ============================================
        console.log('🎯 Creating Event Categories...');
        const eventCategories = [
            {
                name: {
                    en: 'Concert',
                    ar: 'حفلة موسيقية'
                },
                selected_image: 'https://example.com/concert-selected.png',
                unselected_image: 'https://example.com/concert-unselected.png',
                is_delete: 0
            },
            {
                name: {
                    en: 'Workshop',
                    ar: 'ورشة عمل'
                },
                selected_image: 'https://example.com/workshop-selected.png',
                unselected_image: 'https://example.com/workshop-unselected.png',
                is_delete: 0
            },
            {
                name: {
                    en: 'Conference',
                    ar: 'مؤتمر'
                },
                selected_image: 'https://example.com/conference-selected.png',
                unselected_image: 'https://example.com/conference-unselected.png',
                is_delete: 0
            },
            {
                name: {
                    en: 'Festival',
                    ar: 'مهرجان'
                },
                selected_image: 'https://example.com/festival-selected.png',
                unselected_image: 'https://example.com/festival-unselected.png',
                is_delete: 0
            },
            {
                name: {
                    en: 'Exhibition',
                    ar: 'معرض'
                },
                selected_image: 'https://example.com/exhibition-selected.png',
                unselected_image: 'https://example.com/exhibition-unselected.png',
                is_delete: 0
            }
        ];

        const createdEventCategories = [];
        for (const catData of eventCategories) {
            let category = await EventCategories.findOne({ 'name.en': catData.name.en });
            if (!category) {
                category = await EventCategories.create(catData);
                createdEventCategories.push(category);
                console.log(`   ✅ Created event category: ${catData.name.en}`);
            } else {
                console.log(`   ⚠️  Event category already exists: ${catData.name.en}`);
                createdEventCategories.push(category);
            }
        }
        console.log(`✅ Total event categories: ${createdEventCategories.length}\n`);

        // ============================================
        // 6. CREATE TEST EVENTS
        // ============================================
        console.log('🎉 Creating Test Events...');
        
        if (createdOrganizers.length > 0 && createdEventCategories.length > 0) {
            const testEvents = [
                {
                    organizer_id: createdOrganizers[0]._id,
                    event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                    event_start_time: '18:00',
                    event_end_time: '22:00',
                    event_name: 'Summer Music Festival 2024',
                    event_images: [
                        'https://example.com/event1-1.jpg',
                        'https://example.com/event1-2.jpg'
                    ],
                    event_image: 'https://example.com/event1-main.jpg',
                    event_description: 'Join us for an amazing summer music festival featuring top artists and bands. Food and drinks available.',
                    event_address: 'King Fahd Cultural Center, Riyadh',
                    location: {
                        type: 'Point',
                        coordinates: [46.6753, 24.7136] // Riyadh coordinates
                    },
                    event_category: createdEventCategories[0]._id.toString(), // String required
                    event_for: 1, // 1=Male, 2=Female, 3=Both
                    event_price: 150,
                    no_of_attendees: 500,
                    is_approved: 2, // 2 = Approved
                    isActive: 1
                },
                {
                    organizer_id: createdOrganizers[0]._id,
                    event_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
                    event_start_time: '10:00',
                    event_end_time: '16:00',
                    event_name: 'Business Networking Workshop',
                    event_images: [
                        'https://example.com/event2-1.jpg'
                    ],
                    event_image: 'https://example.com/event2-main.jpg',
                    event_description: 'Learn networking strategies and connect with industry professionals.',
                    event_address: 'Business Center, Jeddah',
                    location: {
                        type: 'Point',
                        coordinates: [39.1829, 21.4858] // Jeddah coordinates
                    },
                    event_category: createdEventCategories[1]._id.toString(),
                    event_for: 3, // Both
                    event_price: 200,
                    no_of_attendees: 100,
                    is_approved: 2,
                    isActive: 1
                },
                {
                    organizer_id: createdOrganizers[1]._id,
                    event_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
                    event_start_time: '19:00',
                    event_end_time: '23:00',
                    event_name: 'Cultural Art Exhibition',
                    event_images: [
                        'https://example.com/event3-1.jpg',
                        'https://example.com/event3-2.jpg',
                        'https://example.com/event3-3.jpg'
                    ],
                    event_image: 'https://example.com/event3-main.jpg',
                    event_description: 'Explore beautiful artworks from local and international artists.',
                    event_address: 'Art Gallery, Dammam',
                    location: {
                        type: 'Point',
                        coordinates: [50.1033, 26.4207] // Dammam coordinates
                    },
                    event_category: createdEventCategories[4]._id.toString(),
                    event_for: 3, // Both
                    event_price: 50,
                    no_of_attendees: 300,
                    is_approved: 2,
                    isActive: 1
                }
            ];

            const createdEvents = [];
            for (const eventData of testEvents) {
                let event = await Event.findOne({ 
                    event_name: eventData.event_name,
                    organizer_id: eventData.organizer_id
                });
                if (!event) {
                    event = await Event.create(eventData);
                    createdEvents.push(event);
                    console.log(`   ✅ Created event: ${eventData.event_name}`);
                } else {
                    console.log(`   ⚠️  Event already exists: ${eventData.event_name}`);
                    createdEvents.push(event);
                }
            }
            console.log(`✅ Total events: ${createdEvents.length}\n`);
        } else {
            console.log('⚠️  Cannot create events: Need organizers and categories first\n');
        }

        // ============================================
        // 7. CREATE CMS DATA (if model exists)
        // ============================================
        console.log('📄 Creating CMS Data...');
        try {
            const cmsDataList = [
                {
                    type: '1', // About Us
                    description: 'Zuroona is a leading event management platform in Saudi Arabia. We connect event organizers with attendees, making it easy to discover and book amazing events.',
                    description_ar: 'زورونا هي منصة رائدة لإدارة الفعاليات في المملكة العربية السعودية. نحن نربط منظمي الفعاليات بالحضور، مما يجعل من السهل اكتشاف وحجز الفعاليات الرائعة.'
                },
                {
                    type: '2', // Terms & Conditions
                    description: 'By using Zuroona, you agree to our terms and conditions. Please read them carefully before using our services.',
                    description_ar: 'باستخدام زورونا، أنت توافق على شروطنا وأحكامنا. يرجى قراءتها بعناية قبل استخدام خدماتنا.'
                },
                {
                    type: '3', // Privacy Policy
                    description: 'Your privacy is important to us. We collect and use your personal information only to provide and improve our services.',
                    description_ar: 'خصوصيتك مهمة بالنسبة لنا. نجمع ونستخدم معلوماتك الشخصية فقط لتقديم وتحسين خدماتنا.'
                }
            ];

            for (const cmsData of cmsDataList) {
                let cms = await Cms.findOne({ type: cmsData.type });
                if (!cms) {
                    await Cms.create(cmsData);
                    console.log(`   ✅ Created CMS data (type: ${cmsData.type})`);
                } else {
                    console.log(`   ⚠️  CMS data already exists (type: ${cmsData.type})`);
                }
            }
        } catch (error) {
            console.log('   ⚠️  CMS model not found or error:', error.message);
        }
        console.log('');

        // ============================================
        // SUMMARY
        // ============================================
        console.log('='.repeat(70));
        console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
        console.log('='.repeat(70));
        console.log('\n📊 Summary:');
        console.log(`   👤 Admin Users: 1`);
        console.log(`   👥 Guest Users: ${createdUsers.length}`);
        console.log(`   🏢 Organizers: ${createdOrganizers.length}`);
        console.log(`   📁 Group Categories: ${createdGroupCategories.length}`);
        console.log(`   🎯 Event Categories: ${createdEventCategories.length}`);
        
        const eventCount = await Event.countDocuments();
        console.log(`   🎉 Events: ${eventCount}`);
        
        console.log('\n🔑 Admin Login Credentials:');
        console.log(`   Email: ${adminEmail}`);
        console.log(`   Password: ${adminPassword}`);
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
    seedDatabase()
        .then(() => {
            console.log('✅ Script completed successfully.\n');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Script failed:', error);
            process.exit(1);
        });
}

module.exports = { seedDatabase };
