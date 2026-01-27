/**
 * MSEGAT OTP Test Script
 * 
 * Ye script directly MSEGAT API ko test karta hai
 * Usage: node src/scripts/testMsegatOTP.js
 */

require('dotenv').config();
const { sendOTP } = require('../helpers/msegatService');

const testMsegatOTP = async () => {
    try {
        console.log('\n' + '='.repeat(70));
        console.log('🧪 MSEGAT OTP TEST SCRIPT');
        console.log('='.repeat(70) + '\n');

        // Test phone number
        const testPhoneNumber = '+966597832290';
        const testMessage = 'A.o.a Mr Syed Safeer Testing (Zuroona)';
        const lang = 'en';

        console.log('📱 Test Details:');
        console.log(`   Phone Number: ${testPhoneNumber}`);
        console.log(`   Message: ${testMessage}`);
        console.log(`   Language: ${lang}\n`);

        // Check environment variables
        console.log('🔍 Checking Environment Variables:');
        console.log(`   MSEGAT_API_URL: ${process.env.MSEGAT_API_URL || 'Not set (using default)'}`);
        console.log(`   MSEGAT_USERNAME: ${process.env.MSEGAT_USERNAME || process.env.MSEGAT_USER_NAME || 'Not set'}`);
        console.log(`   MSEGAT_API_KEY: ${process.env.MSEGAT_API_KEY ? process.env.MSEGAT_API_KEY.substring(0, 8) + '...' : 'Not set'}`);
        console.log(`   MSEGAT_SENDER_NAME: ${process.env.MSEGAT_SENDER_NAME || process.env.MSEGAT_USER_SENDER || 'Not set (using default: Zuroona)'}\n`);

        // Validate credentials
        if (!process.env.MSEGAT_USERNAME && !process.env.MSEGAT_USER_NAME) {
            console.error('❌ ERROR: MSEGAT_USERNAME not set in .env file');
            console.error('   Please add: MSEGAT_USERNAME=Naif Alkahtani');
            process.exit(1);
        }

        if (!process.env.MSEGAT_API_KEY) {
            console.error('❌ ERROR: MSEGAT_API_KEY not set in .env file');
            console.error('   Please add: MSEGAT_API_KEY=AEEA859CB40BCFCD0DFE385A93927A31');
            process.exit(1);
        }

        console.log('✅ Environment variables validated\n');

        // Generate test OTP
        const testOTP = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`🔐 Generated Test OTP: ${testOTP}\n`);

        // Option 1: Send custom message (for testing)
        console.log('📤 Option 1: Sending Custom Message...');
        try {
            const { sendSMS } = require('../helpers/msegatService');
            const result = await sendSMS(testPhoneNumber, testMessage);
            console.log('✅ Custom message sent successfully!');
            console.log('   Response:', JSON.stringify(result, null, 2));
        } catch (error) {
            console.error('❌ Error sending custom message:', error.message);
            console.error('   Full error:', error);
        }

        console.log('\n' + '-'.repeat(70) + '\n');

        // Option 2: Send OTP (standard OTP format)
        console.log('📤 Option 2: Sending OTP Message...');
        try {
            const result = await sendOTP(testPhoneNumber, testOTP, lang);
            console.log('✅ OTP sent successfully!');
            console.log('   Response:', JSON.stringify(result, null, 2));
            console.log(`\n📱 OTP ${testOTP} should be received on ${testPhoneNumber}`);
        } catch (error) {
            console.error('❌ Error sending OTP:', error.message);
            console.error('   Full error:', error);
            if (error.response) {
                console.error('   HTTP Status:', error.response.status);
                console.error('   Response Data:', error.response.data);
            }
        }

        console.log('\n' + '='.repeat(70));
        console.log('✅ TEST COMPLETED');
        console.log('='.repeat(70) + '\n');

        console.log('📋 Summary:');
        console.log(`   Phone: ${testPhoneNumber}`);
        console.log(`   Custom Message: ${testMessage}`);
        console.log(`   Test OTP: ${testOTP}`);
        console.log('\n💡 Check your phone for the SMS!\n');

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
};

// Run the test
testMsegatOTP()
    .then(() => {
        console.log('✅ Script completed.\n');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Script failed:', error);
        process.exit(1);
    });
