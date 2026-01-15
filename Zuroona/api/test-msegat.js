/**
 * MSEGAT SMS Test Script
 * 
 * This script tests your MSEGAT credentials before using them in the main app.
 * 
 * Usage:
 * 1. Set your credentials in .env file
 * 2. Run: node test-msegat.js
 */

require('dotenv').config();
const axios = require('axios');
const querystring = require('querystring');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

console.log(`\n${colors.cyan}════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}   MSEGAT SMS CREDENTIAL TESTER${colors.reset}`);
console.log(`${colors.cyan}════════════════════════════════════════${colors.reset}\n`);

// Check environment variables
console.log(`${colors.blue}📋 Checking Environment Variables:${colors.reset}`);
console.log(`   MSEGAT_USERNAME: ${process.env.MSEGAT_USERNAME ? '✅ Set' : '❌ Not set'}`);
console.log(`   MSEGAT_PASSWORD: ${process.env.MSEGAT_PASSWORD ? '✅ Set' : '❌ Not set'}`);
console.log(`   MSEGAT_API_KEY: ${process.env.MSEGAT_API_KEY ? '✅ Set' : '❌ Not set'}`);
console.log(`   MSEGAT_SENDER_NAME: ${process.env.MSEGAT_SENDER_NAME || 'Zuroona (default)'}\n`);

// Test credentials
async function testMsegatCredentials() {
    const MSEGAT_API_URL = 'https://www.msegat.com/gw/sendsms.php';
    const testNumber = process.env.TEST_PHONE_NUMBER || '966501234567'; // Use your number
    const testMessage = 'Test OTP: 123456 - Zuroona SMS Test';

    console.log(`${colors.blue}🧪 Testing MSEGAT API Connection:${colors.reset}`);
    console.log(`   API URL: ${MSEGAT_API_URL}`);
    console.log(`   Test Number: ${testNumber}\n`);

    // Try Method 1: Username + API Key
    if (process.env.MSEGAT_USERNAME && process.env.MSEGAT_API_KEY) {
        console.log(`${colors.yellow}📝 Method 1: Testing with Username + API Key${colors.reset}`);
        
        const payload = {
            userName: process.env.MSEGAT_USERNAME,
            apiKey: process.env.MSEGAT_API_KEY,
            userSender: process.env.MSEGAT_SENDER_NAME || 'Zuroona',
            msgEncoding: 'UTF8',
            numbers: testNumber,
            msg: testMessage
        };

        console.log(`   Username: ${payload.userName.substring(0, 8)}...`);
        console.log(`   API Key: ${payload.apiKey.substring(0, 8)}...`);
        console.log(`   Sender: ${payload.userSender}`);

        try {
            const response = await axios.post(MSEGAT_API_URL, querystring.stringify(payload), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                timeout: 15000,
            });

            console.log(`\n${colors.green}✅ SUCCESS! Response:${colors.reset}`);
            console.log(`   Status: ${response.status}`);
            console.log(`   Data:`, response.data);
            
            // Check response
            if (typeof response.data === 'string') {
                const responseStr = response.data.toString().toLowerCase();
                if (responseStr.includes('m0002') || responseStr.includes('invalid')) {
                    console.log(`\n${colors.red}❌ Authentication Failed!${colors.reset}`);
                    console.log(`   Error: ${response.data}`);
                    console.log(`\n${colors.yellow}💡 Troubleshooting:${colors.reset}`);
                    console.log(`   1. Check if your USERNAME is correct (should be your MSEGAT username)`);
                    console.log(`   2. Check if your API_KEY is correct (should be your MSEGAT API key/password)`);
                    console.log(`   3. Verify credentials at: https://www.msegat.com/`);
                    console.log(`   4. Make sure your account is active and not suspended`);
                } else if (responseStr.includes('success') || responseStr.includes('m0000') || !isNaN(parseInt(responseStr))) {
                    console.log(`\n${colors.green}🎉 CREDENTIALS ARE VALID!${colors.reset}`);
                    console.log(`   SMS sent successfully. Check your phone!`);
                }
            }

            return true;
        } catch (error) {
            console.log(`\n${colors.red}❌ Request Failed:${colors.reset}`);
            console.log(`   Error: ${error.message}`);
            if (error.response) {
                console.log(`   Response Status: ${error.response.status}`);
                console.log(`   Response Data:`, error.response.data);
            }
        }
    }

    // Try Method 2: Username + Password
    if (process.env.MSEGAT_USERNAME && process.env.MSEGAT_PASSWORD) {
        console.log(`\n${colors.yellow}📝 Method 2: Testing with Username + Password${colors.reset}`);
        
        const payload = {
            userName: process.env.MSEGAT_USERNAME,
            apiKey: process.env.MSEGAT_PASSWORD,
            userSender: process.env.MSEGAT_SENDER_NAME || 'Zuroona',
            msgEncoding: 'UTF8',
            numbers: testNumber,
            msg: testMessage
        };

        console.log(`   Username: ${payload.userName.substring(0, 8)}...`);
        console.log(`   Password: ${payload.apiKey.substring(0, 8)}...`);

        try {
            const response = await axios.post(MSEGAT_API_URL, querystring.stringify(payload), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                timeout: 15000,
            });

            console.log(`\n${colors.green}✅ SUCCESS!${colors.reset}`);
            console.log(`   Response:`, response.data);
            return true;
        } catch (error) {
            console.log(`\n${colors.red}❌ Failed:${colors.reset} ${error.message}`);
        }
    }

    console.log(`\n${colors.red}═══════════════════════════════════${colors.reset}`);
    console.log(`${colors.red}❌ ALL METHODS FAILED!${colors.reset}`);
    console.log(`${colors.red}═══════════════════════════════════${colors.reset}\n`);
    
    console.log(`${colors.yellow}📝 Required Environment Variables:${colors.reset}\n`);
    console.log(`Add these to your .env file:\n`);
    console.log(`# MSEGAT SMS Configuration`);
    console.log(`MSEGAT_USERNAME=your_username_here`);
    console.log(`MSEGAT_API_KEY=your_api_key_here`);
    console.log(`MSEGAT_SENDER_NAME=Zuroona`);
    console.log(`TEST_PHONE_NUMBER=966501234567  # Your test number\n`);
    
    console.log(`${colors.yellow}🔑 How to get credentials:${colors.reset}`);
    console.log(`   1. Login to: https://www.msegat.com/`);
    console.log(`   2. Go to API Settings`);
    console.log(`   3. Copy your Username and API Key`);
    console.log(`   4. Add them to .env file`);
    console.log(`   5. Restart your server\n`);
}

// Run test
testMsegatCredentials().catch(err => {
    console.error(`\n${colors.red}Fatal Error:${colors.reset}`, err.message);
    process.exit(1);
});

