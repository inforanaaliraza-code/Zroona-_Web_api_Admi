/**
 * Create Test Event Categories
 * Creates dummy event categories for testing
 */

const path = require('path');
const fs = require('fs');

// Try to load dotenv if available
try {
    // Try to find .env file in api directory
    const apiEnvPath = path.join(__dirname, 'api', '.env');
    if (fs.existsSync(apiEnvPath)) {
        require('dotenv').config({ path: apiEnvPath });
    } else {
        // Try root .env
        const rootEnvPath = path.join(__dirname, '.env');
        if (fs.existsSync(rootEnvPath)) {
            require('dotenv').config({ path: rootEnvPath });
        } else {
            // Try to require dotenv from api/node_modules
            const apiDotenvPath = path.join(__dirname, 'api', 'node_modules', 'dotenv');
            if (fs.existsSync(apiDotenvPath)) {
                require(apiDotenvPath).config({ path: apiEnvPath });
            }
        }
    }
} catch (error) {
    console.log('⚠️  dotenv not found, using environment variables if set');
    // Continue without dotenv - environment variables might be set externally
}

const { connectWithRetry } = require(path.join(__dirname, 'api', 'src', 'config', 'database'));
const EventCategories = require(path.join(__dirname, 'api', 'src', 'models', 'eventCategoryModel'));

const testCategories = [
    {
        name: {
            en: 'Cultural & Traditional Events',
            ar: 'الفعاليات الثقافية والتقليدية'
        },
        selected_image: 'https://via.placeholder.com/100',
        unselected_image: 'https://via.placeholder.com/100',
        is_delete: 0
    },
    {
        name: {
            en: 'Outdoor & Adventure',
            ar: 'المغامرات والأنشطة الخارجية'
        },
        selected_image: 'https://via.placeholder.com/100',
        unselected_image: 'https://via.placeholder.com/100',
        is_delete: 0
    },
    {
        name: {
            en: 'Educational & Workshops',
            ar: 'الفعاليات التعليمية وورش العمل'
        },
        selected_image: 'https://via.placeholder.com/100',
        unselected_image: 'https://via.placeholder.com/100',
        is_delete: 0
    },
    {
        name: {
            en: 'Sports & Fitness',
            ar: 'الرياضة واللياقة البدنية'
        },
        selected_image: 'https://via.placeholder.com/100',
        unselected_image: 'https://via.placeholder.com/100',
        is_delete: 0
    },
    {
        name: {
            en: 'Music & Arts',
            ar: 'الموسيقى والفنون'
        },
        selected_image: 'https://via.placeholder.com/100',
        unselected_image: 'https://via.placeholder.com/100',
        is_delete: 0
    },
    {
        name: {
            en: 'Family & Kids Activities',
            ar: 'أنشطة العائلة والأطفال'
        },
        selected_image: 'https://via.placeholder.com/100',
        unselected_image: 'https://via.placeholder.com/100',
        is_delete: 0
    },
    {
        name: {
            en: 'Food & Culinary Experiences',
            ar: 'تجارب الطعام والطهي'
        },
        selected_image: 'https://via.placeholder.com/100',
        unselected_image: 'https://via.placeholder.com/100',
        is_delete: 0
    },
    {
        name: {
            en: 'Wellness & Relaxation',
            ar: 'العافية والاسترخاء'
        },
        selected_image: 'https://via.placeholder.com/100',
        unselected_image: 'https://via.placeholder.com/100',
        is_delete: 0
    },
    {
        name: {
            en: 'Heritage & History Tours',
            ar: 'جولات التراث والتاريخ'
        },
        selected_image: 'https://via.placeholder.com/100',
        unselected_image: 'https://via.placeholder.com/100',
        is_delete: 0
    },
    {
        name: {
            en: 'Nightlife & Entertainment',
            ar: 'الحياة الليلية والترفيه'
        },
        selected_image: 'https://via.placeholder.com/100',
        unselected_image: 'https://via.placeholder.com/100',
        is_delete: 0
    },
    {
        name: {
            en: 'Eco & Sustainable Tourism',
            ar: 'السياحة البيئية والمستدامة'
        },
        selected_image: 'https://via.placeholder.com/100',
        unselected_image: 'https://via.placeholder.com/100',
        is_delete: 0
    },
    {
        name: {
            en: 'Business & Networking',
            ar: 'الأعمال والتواصل'
        },
        selected_image: 'https://via.placeholder.com/100',
        unselected_image: 'https://via.placeholder.com/100',
        is_delete: 0
    },
    {
        name: {
            en: 'Volunteering',
            ar: 'التطوع'
        },
        selected_image: 'https://via.placeholder.com/100',
        unselected_image: 'https://via.placeholder.com/100',
        is_delete: 0
    },
    {
        name: {
            en: 'Photography & Sightseeing',
            ar: 'التصوير الفوتوغرافي ومشاهدة المعالم'
        },
        selected_image: 'https://via.placeholder.com/100',
        unselected_image: 'https://via.placeholder.com/100',
        is_delete: 0
    }
];

async function createTestCategories() {
    try {
        console.log('🚀 Creating all event categories...\n');
        console.log(`📋 Total categories to create: ${testCategories.length}\n`);
        
        await connectWithRetry();
        console.log('✅ Connected to database\n');

        let createdCount = 0;
        let existingCount = 0;

        for (const category of testCategories) {
            // Check if category already exists (by English name)
            const existing = await EventCategories.findOne({
                'name.en': category.name.en,
                is_delete: { $ne: 1 }
            });

            if (existing) {
                console.log(`⚠️  Category "${category.name.en}" already exists (ID: ${existing._id})`);
                existingCount++;
            } else {
                const created = await EventCategories.create(category);
                console.log(`✅ Created category: ${category.name.en}`);
                console.log(`   Arabic: ${category.name.ar}`);
                console.log(`   ID: ${created._id}\n`);
                createdCount++;
            }
        }

        console.log('\n📊 Summary:');
        console.log(`   ✅ Created: ${createdCount} categories`);
        console.log(`   ⚠️  Already existed: ${existingCount} categories`);
        console.log(`   📦 Total: ${testCategories.length} categories\n`);
        console.log('✅ All categories setup complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating categories:', error);
        console.error('Error details:', error.message);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
        process.exit(1);
    }
}

createTestCategories();

