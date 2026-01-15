#!/usr/bin/env node
/**
 * Test Specific MSEGAT Credentials
 * Testing usernames from dashboard with provided API key
 */

const axios = require('axios');
const querystring = require('querystring');

const API_KEY = 'CAA97EE614835DE96F1165C86C23A6C2';
const API_URL = 'https://www.msegat.com/gw/sendsms.php';
const TEST_NUMBER = '966501234567';
const TEST_MESSAGE = 'Test from Zuroona';

// ANSI colors
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

console.log(`\n${BOLD}${CYAN}${'='.repeat(70)}${RESET}`);
console.log(`${BOLD}${CYAN}   🔍 Testing Specific Credentials from Dashboard${RESET}`);
console.log(`${BOLD}${CYAN}${'='.repeat(70)}${RESET}\n`);

console.log(`${BLUE}API Key: ${API_KEY}${RESET}\n`);

// Username variations to test based on dashboard info
const usernameVariations = [
    { label: '1. User ID', username: '140091' },
    { label: '2. Email', username: 'alkahtaninaif7@gmail.com' },
    { label: '3. Phone with country code', username: '966509683587' },
    { label: '4. Phone without country code', username: '509683587' },
    { label: '5. Original (with space)', username: 'Naif Alkahtani' },
    { label: '6. No space', username: 'NaifAlkahtani' },
    { label: '7. Lowercase email prefix', username: 'alkahtaninaif7' },
    { label: '8. User ID as string', username: 'user_140091' },
];

async function testUsername(username, label) {
    try {
        const payload = {
            userName: username,
            apiKey: API_KEY,
            userSender: 'Zuroona',
            msgEncoding: 'UTF8',
            numbers: TEST_NUMBER,
            msg: TEST_MESSAGE
        };

        console.log(`${YELLOW}${label}${RESET}`);
        console.log(`   Username: ${BOLD}${username}${RESET}`);
        console.log(`   Testing... `);

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

        if (code === '1' || code === 'M0000' || code === 1) {
            console.log(`   ${GREEN}${BOLD}✅ SUCCESS!!!${RESET}\n`);
            return { success: true, username, code, message };
        } else {
            console.log(`   ${RED}❌ Failed: ${code} - ${message}${RESET}\n`);
            return { success: false, username, code, message };
        }
    } catch (error) {
        console.log(`   ${RED}❌ Error: ${error.message}${RESET}\n`);
        return { success: false, username, error: error.message };
    }
}

async function runTests() {
    console.log(`${BLUE}Testing ${usernameVariations.length} username variations...${RESET}\n`);
    console.log(`${CYAN}${'─'.repeat(70)}${RESET}\n`);

    let successfulUsername = null;

    for (const variation of usernameVariations) {
        const result = await testUsername(variation.username, variation.label);
        
        if (result.success) {
            successfulUsername = result.username;
            break;
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`${CYAN}${'='.repeat(70)}${RESET}\n`);

    if (successfulUsername) {
        console.log(`${GREEN}${BOLD}🎉 SUCCESS! Working username found!${RESET}\n`);
        console.log(`${BOLD}Use these credentials in your .env file:${RESET}\n`);
        console.log(`${GREEN}MSEGAT_USERNAME=${successfulUsername}${RESET}`);
        console.log(`${GREEN}MSEGAT_API_KEY=${API_KEY}${RESET}`);
        console.log(`${GREEN}MSEGAT_SENDER_NAME=Zuroona${RESET}\n`);
        
        console.log(`${YELLOW}Next steps:${RESET}`);
        console.log(`   1. Update api/.env with above values`);
        console.log(`   2. Save the file`);
        console.log(`   3. Restart your server`);
        console.log(`   4. Try registration - OTP should work! 🎉\n`);
    } else {
        console.log(`${RED}${BOLD}❌ All username variations failed!${RESET}\n`);
        console.log(`${YELLOW}Possible reasons:${RESET}`);
        console.log(`   1. API Key might be incorrect or expired`);
        console.log(`   2. Account might be inactive or suspended`);
        console.log(`   3. API access might not be enabled\n`);
        
        console.log(`${YELLOW}What to do:${RESET}`);
        console.log(`   1. Go back to MSEGAT dashboard`);
        console.log(`   2. Click "API Key" in left sidebar`);
        console.log(`   3. Look for "Username" or "API Username" field`);
        console.log(`   4. Screenshot that page and share it`);
        console.log(`   5. Or contact MSEGAT support: support@msegat.com\n`);
    }

    console.log(`${CYAN}${'='.repeat(70)}${RESET}\n`);
}

runTests().catch(error => {
    console.error(`${RED}Fatal error: ${error.message}${RESET}`);
    process.exit(1);
});

