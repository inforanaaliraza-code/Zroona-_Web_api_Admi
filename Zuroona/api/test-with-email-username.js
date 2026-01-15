#!/usr/bin/env node
/**
 * Test MSEGAT with Email as Username
 * Based on MSEGAT API docs: https://msegat.docs.apiary.io/
 */

const axios = require('axios');
const querystring = require('querystring');

// From screenshots
const API_KEY = 'CAA97EE614835DE96F1165C86C23A6C2';
const EMAIL = 'alkahtaninaif7@gmail.com';
const USER_ID = '140091';
const API_URL = 'https://www.msegat.com/gw/sendsms.php';
const TEST_NUMBER = '966509683587'; // User's actual number from dashboard
const TEST_MESSAGE = 'رمز التحقق: 123456\n\nZuroona - Test message';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

console.log(`\n${BOLD}${CYAN}${'='.repeat(70)}${RESET}`);
console.log(`${BOLD}${CYAN}   🔍 Testing with Email as Username${RESET}`);
console.log(`${BOLD}${CYAN}${'='.repeat(70)}${RESET}\n`);

async function testWithUsername(username, label) {
    try {
        console.log(`${YELLOW}${label}${RESET}`);
        console.log(`   Username: ${BOLD}${username}${RESET}`);
        console.log(`   API Key:  ${API_KEY}`);
        console.log(`   Testing... `);

        const payload = {
            userName: username,
            apiKey: API_KEY,
            userSender: 'Zuroona',
            msgEncoding: 'UTF8',
            numbers: TEST_NUMBER,
            msg: TEST_MESSAGE
        };

        console.log(`   Payload: ${JSON.stringify(payload, null, 2)}\n`);

        const response = await axios.post(
            API_URL,
            querystring.stringify(payload),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                timeout: 10000
            }
        );

        const code = response.data?.code || response.data;
        const message = response.data?.message || '';

        console.log(`   Response Code: ${code}`);
        console.log(`   Response Message: ${message}\n`);

        if (code === '1' || code === 'M0000' || code === 1) {
            console.log(`   ${GREEN}${BOLD}✅ SUCCESS!!!${RESET}\n`);
            return { success: true, username };
        } else {
            console.log(`   ${RED}❌ Failed: ${code} - ${message}${RESET}\n`);
            return { success: false, code, message };
        }
    } catch (error) {
        console.log(`   ${RED}❌ Error: ${error.message}${RESET}\n`);
        if (error.response) {
            console.log(`   Response Data: ${JSON.stringify(error.response.data)}\n`);
        }
        return { success: false, error: error.message };
    }
}

async function runTests() {
    console.log(`${BLUE}Based on your dashboard:${RESET}`);
    console.log(`   Email: ${EMAIL}`);
    console.log(`   User ID: ${USER_ID}`);
    console.log(`   API Key: ${API_KEY}\n`);
    console.log(`${CYAN}${'─'.repeat(70)}${RESET}\n`);

    // Test with email (most common for MSEGAT)
    const result1 = await testWithUsername(EMAIL, 'Test 1: Email as Username');
    
    if (result1.success) {
        console.log(`${CYAN}${'='.repeat(70)}${RESET}\n`);
        console.log(`${GREEN}${BOLD}🎉 WORKING CREDENTIALS FOUND!${RESET}\n`);
        console.log(`${BOLD}Update your .env file:${RESET}\n`);
        console.log(`${GREEN}MSEGAT_USERNAME=${EMAIL}${RESET}`);
        console.log(`${GREEN}MSEGAT_API_KEY=${API_KEY}${RESET}`);
        console.log(`${GREEN}MSEGAT_SENDER_NAME=Zuroona${RESET}\n`);
        return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test with User ID
    const result2 = await testWithUsername(USER_ID, 'Test 2: User ID as Username');
    
    if (result2.success) {
        console.log(`${CYAN}${'='.repeat(70)}${RESET}\n`);
        console.log(`${GREEN}${BOLD}🎉 WORKING CREDENTIALS FOUND!${RESET}\n`);
        console.log(`${BOLD}Update your .env file:${RESET}\n`);
        console.log(`${GREEN}MSEGAT_USERNAME=${USER_ID}${RESET}`);
        console.log(`${GREEN}MSEGAT_API_KEY=${API_KEY}${RESET}`);
        console.log(`${GREEN}MSEGAT_SENDER_NAME=Zuroona${RESET}\n`);
        return;
    }

    console.log(`${CYAN}${'='.repeat(70)}${RESET}\n`);
    console.log(`${RED}${BOLD}❌ Both tests failed${RESET}\n`);
    console.log(`${YELLOW}CRITICAL: Please click the "here" link on API Key page!${RESET}\n`);
    console.log(`The link says: "To view the connection method, please click here"`);
    console.log(`That will show your exact username format.\n`);
    console.log(`${CYAN}${'='.repeat(70)}${RESET}\n`);
}

runTests().catch(error => {
    console.error(`${RED}Fatal error: ${error.message}${RESET}`);
    process.exit(1);
});

