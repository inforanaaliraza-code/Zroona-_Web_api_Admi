#!/usr/bin/env node
/**
 * MSEGAT Detailed Credential Tester
 * This script tests your MSEGAT credentials and provides detailed diagnostics
 */

require('dotenv').config();
const axios = require('axios');
const querystring = require('querystring');

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m',
};

const log = {
    error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
    header: (msg) => console.log(`\n${colors.bold}${colors.cyan}${'='.repeat(60)}${colors.reset}`),
    title: (msg) => console.log(`${colors.bold}${colors.cyan}${msg}${colors.reset}`),
};

// Get credentials from environment
const MSEGAT_USERNAME = process.env.MSEGAT_USERNAME;
const MSEGAT_PASSWORD = process.env.MSEGAT_PASSWORD;
const MSEGAT_API_KEY = process.env.MSEGAT_API_KEY;
const MSEGAT_SENDER = process.env.MSEGAT_SENDER_NAME || 'Zuroona';
const MSEGAT_API_URL = process.env.MSEGAT_API_URL || 'https://www.msegat.com/gw/sendsms.php';

async function testMsegatAuth() {
    log.header();
    log.title('   🔍 MSEGAT DETAILED CREDENTIAL TEST');
    log.header();

    // Step 1: Check environment variables
    console.log('\n📋 STEP 1: Checking Environment Variables\n');
    
    console.log(`   MSEGAT_USERNAME: ${MSEGAT_USERNAME ? colors.green + '✅ ' + MSEGAT_USERNAME + colors.reset : colors.red + '❌ Not set' + colors.reset}`);
    console.log(`   MSEGAT_PASSWORD: ${MSEGAT_PASSWORD ? colors.green + '✅ Set (hidden)' + colors.reset : colors.red + '❌ Not set' + colors.reset}`);
    console.log(`   MSEGAT_API_KEY:  ${MSEGAT_API_KEY ? colors.green + '✅ ' + MSEGAT_API_KEY + colors.reset : colors.red + '❌ Not set' + colors.reset}`);
    console.log(`   MSEGAT_SENDER:   ${colors.green}✅ ${MSEGAT_SENDER}${colors.reset}`);
    console.log(`   API URL:         ${colors.green}✅ ${MSEGAT_API_URL}${colors.reset}`);

    if (!MSEGAT_USERNAME) {
        log.error('\nMSEGAT_USERNAME is required! Please set it in your .env file.');
        process.exit(1);
    }

    if (!MSEGAT_API_KEY && !MSEGAT_PASSWORD) {
        log.error('\nEither MSEGAT_API_KEY or MSEGAT_PASSWORD is required! Please set one in your .env file.');
        process.exit(1);
    }

    // Step 2: Test API Connection
    console.log('\n📡 STEP 2: Testing API Connection\n');
    log.info(`   Target URL: ${MSEGAT_API_URL}`);

    // Test phone number (Saudi Arabia)
    const testNumber = '966501234567';
    const testMessage = 'Test message from Zuroona - رسالة اختبار';

    // Method 1: Test with API_KEY
    if (MSEGAT_API_KEY) {
        console.log('\n🔐 METHOD 1: Testing with USERNAME + API_KEY\n');
        
        const payload1 = {
            userName: MSEGAT_USERNAME,
            apiKey: MSEGAT_API_KEY,
            userSender: MSEGAT_SENDER,
            msgEncoding: 'UTF8',
            numbers: testNumber,
            msg: testMessage
        };

        console.log('   📦 Payload:');
        console.log(`      userName: ${payload1.userName}`);
        console.log(`      apiKey: ${payload1.apiKey}`);
        console.log(`      userSender: ${payload1.userSender}`);
        console.log(`      numbers: ${payload1.numbers}`);
        console.log(`      msg: ${payload1.msg.substring(0, 30)}...`);

        try {
            const response = await axios.post(
                MSEGAT_API_URL,
                querystring.stringify(payload1),
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    timeout: 15000
                }
            );

            console.log(`\n   📥 Response Status: ${response.status}`);
            console.log(`   📥 Response Data:`, response.data);

            if (response.data) {
                const code = response.data.code || response.data;
                const message = response.data.message || '';

                if (code === '1' || code === 'M0000' || code === 1) {
                    log.success('\n   ✅ SUCCESS! API_KEY authentication working!');
                    log.success('   Your MSEGAT credentials are correct!');
                    log.header();
                    process.exit(0);
                } else if (code === 'M0002') {
                    log.error(`   ❌ FAILED: ${message}`);
                    log.warning('   Your USERNAME or API_KEY is incorrect!');
                    console.log('\n   📝 Troubleshooting:');
                    console.log('      1. Login to https://www.msegat.com/');
                    console.log('      2. Go to Settings → API Integration');
                    console.log('      3. Copy your EXACT username (case-sensitive)');
                    console.log('      4. Generate a NEW API key');
                    console.log('      5. Update your .env file with exact values');
                } else {
                    log.warning(`   ⚠️  Unexpected response code: ${code} - ${message}`);
                }
            }
        } catch (error) {
            log.error(`   ❌ API_KEY method failed: ${error.message}`);
            if (error.response) {
                console.log(`   Response:`, error.response.data);
            }
        }
    }

    // Method 2: Test with PASSWORD
    if (MSEGAT_PASSWORD) {
        console.log('\n🔐 METHOD 2: Testing with USERNAME + PASSWORD\n');
        
        const payload2 = {
            userName: MSEGAT_USERNAME,
            apiKey: MSEGAT_PASSWORD, // MSEGAT uses 'apiKey' field for password too
            userSender: MSEGAT_SENDER,
            msgEncoding: 'UTF8',
            numbers: testNumber,
            msg: testMessage
        };

        console.log('   📦 Payload:');
        console.log(`      userName: ${payload2.userName}`);
        console.log(`      apiKey: [PASSWORD - hidden]`);
        console.log(`      userSender: ${payload2.userSender}`);
        console.log(`      numbers: ${payload2.numbers}`);
        console.log(`      msg: ${payload2.msg.substring(0, 30)}...`);

        try {
            const response = await axios.post(
                MSEGAT_API_URL,
                querystring.stringify(payload2),
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    timeout: 15000
                }
            );

            console.log(`\n   📥 Response Status: ${response.status}`);
            console.log(`   📥 Response Data:`, response.data);

            if (response.data) {
                const code = response.data.code || response.data;
                const message = response.data.message || '';

                if (code === '1' || code === 'M0000' || code === 1) {
                    log.success('\n   ✅ SUCCESS! PASSWORD authentication working!');
                    log.success('   Your MSEGAT credentials are correct!');
                    log.header();
                    process.exit(0);
                } else if (code === 'M0002') {
                    log.error(`   ❌ FAILED: ${message}`);
                    log.warning('   Your USERNAME or PASSWORD is incorrect!');
                    console.log('\n   📝 Troubleshooting:');
                    console.log('      1. Login to https://www.msegat.com/');
                    console.log('      2. Verify your account credentials');
                    console.log('      3. Reset your password if needed');
                    console.log('      4. Update your .env file with correct password');
                } else {
                    log.warning(`   ⚠️  Unexpected response code: ${code} - ${message}`);
                }
            }
        } catch (error) {
            log.error(`   ❌ PASSWORD method failed: ${error.message}`);
            if (error.response) {
                console.log(`   Response:`, error.response.data);
            }
        }
    }

    // Final diagnosis
    log.header();
    log.error('\n❌ AUTHENTICATION FAILED WITH ALL METHODS');
    log.header();
    
    console.log('\n📋 Your current credentials:');
    console.log(`   USERNAME: ${MSEGAT_USERNAME}`);
    console.log(`   API_KEY:  ${MSEGAT_API_KEY || 'Not set'}`);
    console.log(`   PASSWORD: ${MSEGAT_PASSWORD ? '[Set but hidden]' : 'Not set'}`);
    
    console.log('\n🔧 To fix this:');
    console.log('   1. Login to MSEGAT Dashboard: https://www.msegat.com/');
    console.log('   2. Verify your account is active and has balance');
    console.log('   3. Copy your EXACT username from dashboard');
    console.log('   4. Generate a NEW API key from Settings');
    console.log('   5. Update api/.env file:');
    console.log('');
    console.log('      MSEGAT_USERNAME=your_exact_username');
    console.log('      MSEGAT_API_KEY=your_new_api_key_32_characters');
    console.log('      MSEGAT_SENDER_NAME=Zuroona');
    console.log('');
    console.log('   6. Make sure there are NO spaces around = sign');
    console.log('   7. Run this test again: node test-msegat-detailed.js');
    console.log('');
    
    log.header();
}

// Run the test
testMsegatAuth().catch(error => {
    log.error(`\nTest failed with error: ${error.message}`);
    process.exit(1);
});

