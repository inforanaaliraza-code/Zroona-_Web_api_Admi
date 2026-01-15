#!/usr/bin/env node
/**
 * Test with CORRECT email: alkahtaninaif17@gmail.com
 */

const axios = require('axios');
const querystring = require('querystring');

const API_KEY = 'CAA97EE614835DE96F1165C86C23A6C2';
const CORRECT_EMAIL = 'alkahtaninaif17@gmail.com'; // CORRECT!
const API_URL = 'https://www.msegat.com/gw/sendsms.php';
const TEST_NUMBER = '966509683587';
const TEST_MESSAGE = 'رمز التحقق: 123456\n\nZuroona - Test';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

console.log(`\n${BOLD}${CYAN}${'='.repeat(70)}${RESET}`);
console.log(`${BOLD}${CYAN}   🔍 Testing with CORRECT Email${RESET}`);
console.log(`${BOLD}${CYAN}${'='.repeat(70)}${RESET}\n`);

async function test() {
    try {
        console.log(`${YELLOW}CORRECT Email Found:${RESET}`);
        console.log(`   Email: ${BOLD}${CORRECT_EMAIL}${RESET}`);
        console.log(`   API Key: ${API_KEY}`);
        console.log(`\n   Testing...`);

        const payload = {
            userName: CORRECT_EMAIL,
            apiKey: API_KEY,
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

        console.log(`\n   Response Code: ${code}`);
        console.log(`   Response Message: ${message}\n`);

        if (code === '1' || code === 'M0000' || code === 1) {
            console.log(`${GREEN}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
            console.log(`${GREEN}${BOLD}   ✅ SUCCESS! WORKING CREDENTIALS FOUND!${RESET}`);
            console.log(`${GREEN}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n`);
            
            console.log(`${BOLD}Update your .env file NOW:${RESET}\n`);
            console.log(`${GREEN}MSEGAT_USERNAME=${CORRECT_EMAIL}${RESET}`);
            console.log(`${GREEN}MSEGAT_API_KEY=${API_KEY}${RESET}`);
            console.log(`${GREEN}MSEGAT_SENDER_NAME=Zuroona${RESET}\n`);
            
            console.log(`${YELLOW}Next steps:${RESET}`);
            console.log(`   1. Open api/.env file`);
            console.log(`   2. Update MSEGAT_USERNAME=${CORRECT_EMAIL}`);
            console.log(`   3. Keep MSEGAT_API_KEY=${API_KEY}`);
            console.log(`   4. Save file`);
            console.log(`   5. Restart server: npm run dev`);
            console.log(`   6. Try registration - OTP will work! 🎉\n`);
            
            return true;
        } else {
            console.log(`   ${RED}❌ Failed: ${code} - ${message}${RESET}\n`);
            return false;
        }
    } catch (error) {
        console.log(`   ${RED}❌ Error: ${error.message}${RESET}\n`);
        return false;
    }
}

test().then(success => {
    if (!success) {
        console.log(`${CYAN}${'='.repeat(70)}${RESET}\n`);
        console.log(`${RED}${BOLD}Still not working!${RESET}\n`);
        console.log(`${YELLOW}This means account/API issue.${RESET}`);
        console.log(`${YELLOW}Please contact MSEGAT support: support@msegat.com${RESET}\n`);
        console.log(`${CYAN}${'='.repeat(70)}${RESET}\n`);
    }
}).catch(error => {
    console.error(`${RED}Fatal error: ${error.message}${RESET}`);
    process.exit(1);
});

