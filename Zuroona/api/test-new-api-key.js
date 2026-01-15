#!/usr/bin/env node
/**
 * Test with NEW API Key
 */

const axios = require('axios');
const querystring = require('querystring');

const NEW_API_KEY = '3808F5D4D89B1B23E61632C0B475A342'; // NEW!
const EMAIL = 'alkahtaninaif17@gmail.com';
const USER_ID = '140091';
const API_URL = 'https://www.msegat.com/gw/sendsms.php';
const TEST_NUMBER = '966509683587';
const TEST_MESSAGE = 'رمز التحقق: 123456\n\nZuroona - Test message';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

console.log(`\n${BOLD}${CYAN}${'='.repeat(70)}${RESET}`);
console.log(`${BOLD}${CYAN}   🔍 Testing with NEW API Key${RESET}`);
console.log(`${BOLD}${CYAN}${'='.repeat(70)}${RESET}\n`);

console.log(`${BLUE}NEW API Key: ${NEW_API_KEY}${RESET}\n`);

async function testUsername(username, label) {
    try {
        console.log(`${YELLOW}${label}${RESET}`);
        console.log(`   Username: ${BOLD}${username}${RESET}`);
        console.log(`   Testing... `);

        const payload = {
            userName: username,
            apiKey: NEW_API_KEY,
            userSender: 'Zuroona',
            msgEncoding: 'UTF8',
            numbers: TEST_NUMBER,
            msg: TEST_MESSAGE
        };

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
            console.log(`${GREEN}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
            console.log(`${GREEN}${BOLD}   🎉🎉🎉 SUCCESS! WORKING CREDENTIALS FOUND! 🎉🎉🎉${RESET}`);
            console.log(`${GREEN}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n`);
            return { success: true, username };
        } else {
            console.log(`   ${RED}❌ Failed: ${code} - ${message}${RESET}\n`);
            return { success: false, code, message };
        }
    } catch (error) {
        console.log(`   ${RED}❌ Error: ${error.message}${RESET}\n`);
        if (error.response) {
            console.log(`   Response: ${JSON.stringify(error.response.data)}\n`);
        }
        return { success: false, error: error.message };
    }
}

async function runTests() {
    const tests = [
        { label: '1. Email (alkahtaninaif17@gmail.com)', username: EMAIL },
        { label: '2. User ID (140091)', username: USER_ID },
        { label: '3. Phone with country code', username: '966509683587' },
        { label: '4. Phone without country code', username: '509683587' },
    ];

    console.log(`${BLUE}Testing username variations with NEW API key...${RESET}\n`);
    console.log(`${CYAN}${'─'.repeat(70)}${RESET}\n`);

    let workingCreds = null;

    for (const test of tests) {
        const result = await testUsername(test.username, test.label);
        
        if (result.success) {
            workingCreds = { username: result.username, apiKey: NEW_API_KEY };
            break;
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`${CYAN}${'='.repeat(70)}${RESET}\n`);

    if (workingCreds) {
        console.log(`${GREEN}${BOLD}✅ PROBLEM SOLVED!${RESET}\n`);
        console.log(`${BOLD}Working Credentials:${RESET}\n`);
        console.log(`${GREEN}MSEGAT_USERNAME=${workingCreds.username}${RESET}`);
        console.log(`${GREEN}MSEGAT_API_KEY=${NEW_API_KEY}${RESET}`);
        console.log(`${GREEN}MSEGAT_SENDER_NAME=Zuroona${RESET}\n`);
        
        console.log(`${YELLOW}${BOLD}NEXT STEPS:${RESET}\n`);
        console.log(`${BOLD}1. Update api/.env file:${RESET}`);
        console.log(`   Open: api/.env`);
        console.log(`   Update these lines:\n`);
        console.log(`   MSEGAT_USERNAME=${workingCreds.username}`);
        console.log(`   MSEGAT_API_KEY=${NEW_API_KEY}`);
        console.log(`   MSEGAT_SENDER_NAME=Zuroona\n`);
        
        console.log(`${BOLD}2. Save the file (Ctrl+S)${RESET}\n`);
        
        console.log(`${BOLD}3. Restart your server:${RESET}`);
        console.log(`   Press Ctrl+C in terminal`);
        console.log(`   Then: cd api && npm run dev\n`);
        
        console.log(`${BOLD}4. Test registration:${RESET}`);
        console.log(`   Go to your website`);
        console.log(`   Try to register`);
        console.log(`   OTP should be sent successfully! 🎉\n`);
        
        console.log(`${GREEN}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
        console.log(`${GREEN}${BOLD}   🎊 CONGRATULATIONS! OTP WILL NOW WORK! 🎊${RESET}`);
        console.log(`${GREEN}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n`);
    } else {
        console.log(`${RED}${BOLD}❌ All tests failed with new API key${RESET}\n`);
        console.log(`${YELLOW}This new key also has same issue.${RESET}`);
        console.log(`${YELLOW}Please contact MSEGAT support: support@msegat.com${RESET}\n`);
    }

    console.log(`${CYAN}${'='.repeat(70)}${RESET}\n`);
}

runTests().catch(error => {
    console.error(`${RED}Fatal error: ${error.message}${RESET}`);
    process.exit(1);
});

