/**
 * Quick MSEGAT Credentials Verification
 * Run this to check if your credentials are loaded correctly
 */

require('dotenv').config();

console.log('\n═══════════════════════════════════════════════════');
console.log('   🔍 MSEGAT Credentials Verification');
console.log('═══════════════════════════════════════════════════\n');

const username = process.env.MSEGAT_USERNAME;
const apiKey = process.env.MSEGAT_API_KEY;
const password = process.env.MSEGAT_PASSWORD;
const senderName = process.env.MSEGAT_SENDER_NAME || 'Zuroona';

console.log('📋 Environment Variables Status:\n');

if (username) {
    console.log(`✅ MSEGAT_USERNAME: ${username.substring(0, 6)}****`);
} else {
    console.log('❌ MSEGAT_USERNAME: NOT SET');
}

if (apiKey) {
    console.log(`✅ MSEGAT_API_KEY: ${apiKey.substring(0, 10)}****${apiKey.substring(apiKey.length - 4)}`);
} else {
    console.log('❌ MSEGAT_API_KEY: NOT SET');
}

if (password) {
    console.log(`✅ MSEGAT_PASSWORD: ${password.substring(0, 6)}****`);
} else {
    console.log('❌ MSEGAT_PASSWORD: NOT SET');
}

console.log(`📤 MSEGAT_SENDER_NAME: ${senderName}\n`);

// Check if credentials are valid
if (!username) {
    console.log('⚠️  ERROR: MSEGAT_USERNAME is required!');
    console.log('   Add this to your .env file:');
    console.log('   MSEGAT_USERNAME=your_username_here\n');
}

if (!apiKey && !password) {
    console.log('⚠️  ERROR: Either MSEGAT_API_KEY or MSEGAT_PASSWORD is required!');
    console.log('   Add one of these to your .env file:');
    console.log('   MSEGAT_API_KEY=your_api_key_here');
    console.log('   OR');
    console.log('   MSEGAT_PASSWORD=your_password_here\n');
}

if (username && (apiKey || password)) {
    console.log('✅ All required credentials are set!\n');
    console.log('📝 Your .env file should look like this:');
    console.log('   MSEGAT_USERNAME=your_username');
    console.log('   MSEGAT_API_KEY=your_api_key');
    console.log('   MSEGAT_SENDER_NAME=Zuroona\n');
    console.log('🔄 Next steps:');
    console.log('   1. Restart your server');
    console.log('   2. Try registering again');
    console.log('   3. OTP should be sent successfully!\n');
} else {
    console.log('❌ MSEGAT is NOT configured correctly!');
    console.log('   Please check your .env file and ensure credentials are set.\n');
}

console.log('═══════════════════════════════════════════════════\n');

