/**
 * Quick Test: MSGATE Configuration
 * 
 * This script tests if MSGATE credentials are correctly loaded
 * 
 * Usage:
 *   node test-msgate-config.js
 */

require('dotenv').config();

console.log('\n' + '='.repeat(70));
console.log('🧪 MSGATE CONFIGURATION TEST');
console.log('='.repeat(70));

// Check environment variables
const MSEGAT_USERNAME = process.env.MSEGAT_USERNAME || process.env.MSEGAT_USER_NAME;
const MSEGAT_API_KEY = process.env.MSEGAT_API_KEY;
const MSEGAT_SENDER = process.env.MSEGAT_SENDER_NAME || process.env.MSEGAT_USER_SENDER || 'Zuroona';
const MSEGAT_ENCODING = process.env.MSEGAT_ENCODING || 'UTF8';

console.log('\n📋 Configuration Check:');
console.log('-'.repeat(70));
console.log(`MSEGAT_USERNAME: ${MSEGAT_USERNAME ? '✅ ' + MSEGAT_USERNAME : '❌ Not set'}`);
console.log(`MSEGAT_API_KEY: ${MSEGAT_API_KEY ? '✅ ' + MSEGAT_API_KEY.substring(0, 8) + '...' + MSEGAT_API_KEY.substring(MSEGAT_API_KEY.length - 4) : '❌ Not set'}`);
console.log(`MSEGAT_SENDER: ${MSEGAT_SENDER ? '✅ ' + MSEGAT_SENDER : '❌ Not set'}`);
console.log(`MSEGAT_ENCODING: ${MSEGAT_ENCODING ? '✅ ' + MSEGAT_ENCODING : '⚠️  Using default: UTF8'}`);
console.log('-'.repeat(70));

// Validation
let hasErrors = false;

if (!MSEGAT_USERNAME) {
    console.error('\n❌ ERROR: MSEGAT_USERNAME or MSEGAT_USER_NAME not found!');
    console.error('   Please set it in .env file');
    hasErrors = true;
}

if (!MSEGAT_API_KEY) {
    console.error('\n❌ ERROR: MSEGAT_API_KEY not found!');
    console.error('   Please set it in .env file');
    hasErrors = true;
}

if (MSEGAT_SENDER !== 'Zuroona') {
    console.warn('\n⚠️  WARNING: Sender name is not "Zuroona"');
    console.warn(`   Current: ${MSEGAT_SENDER}`);
    console.warn('   Expected: Zuroona');
}

// Check username format
if (MSEGAT_USERNAME) {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(MSEGAT_USERNAME);
    const isNumeric = /^\d+$/.test(MSEGAT_USERNAME);
    
    if (!isEmail && !isNumeric) {
        console.warn('\n⚠️  WARNING: Username format might be incorrect');
        console.warn(`   Current: ${MSEGAT_USERNAME}`);
        console.warn('   MSGATE usually expects:');
        console.warn('     - Email: user@example.com');
        console.warn('     - User ID: 123456');
        console.warn('     - Phone: 966509683587');
    } else if (isEmail) {
        console.log('\n✅ Username format: Email (correct)');
    } else if (isNumeric) {
        console.log('\n✅ Username format: Numeric ID/Phone (correct)');
    }
}

if (hasErrors) {
    console.log('\n' + '='.repeat(70));
    console.log('❌ CONFIGURATION INCOMPLETE');
    console.log('='.repeat(70));
    console.log('\nPlease update your .env file with missing values.');
    process.exit(1);
} else {
    console.log('\n' + '='.repeat(70));
    console.log('✅ CONFIGURATION LOOKS GOOD!');
    console.log('='.repeat(70));
    console.log('\n📝 Next Steps:');
    console.log('1. Make sure server is restarted after .env changes');
    console.log('2. Test OTP sending with: node test-guest-signup-otp.js');
    console.log('3. Or test via web app guest signup');
    console.log('\n');
}
