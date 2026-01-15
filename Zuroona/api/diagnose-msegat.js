#!/usr/bin/env node
/**
 * MSEGAT Diagnostic Script
 * 
 * This script will:
 * 1. Show exactly what's wrong with your credentials
 * 2. Test different username formats automatically
 * 3. Provide exact fix instructions
 */

require('dotenv').config();
const axios = require('axios');
const querystring = require('querystring');

// Colors
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

console.log(`\n${BOLD}${CYAN}${'='.repeat(70)}${RESET}`);
console.log(`${BOLD}${CYAN}   🔍 MSEGAT DIAGNOSTIC & AUTO-FIX TOOL${RESET}`);
console.log(`${BOLD}${CYAN}${'='.repeat(70)}${RESET}\n`);

// Get credentials
const USERNAME = process.env.MSEGAT_USERNAME;
const API_KEY = process.env.MSEGAT_API_KEY;
const PASSWORD = process.env.MSEGAT_PASSWORD;
const SENDER = process.env.MSEGAT_SENDER_NAME || 'Zuroona';
const API_URL = 'https://www.msegat.com/gw/sendsms.php';

// Test message
const TEST_NUMBER = '966501234567';
const TEST_MESSAGE = 'Test from Zuroona';

console.log(`${BLUE}📋 STEP 1: Current Credentials Analysis${RESET}\n`);

console.log(`   USERNAME: ${BOLD}${USERNAME}${RESET}`);
console.log(`   API_KEY:  ${API_KEY ? API_KEY : 'Not set'}`);
console.log(`   PASSWORD: ${PASSWORD ? '[Set]' : 'Not set'}`);
console.log(`   SENDER:   ${SENDER}\n`);

// Analyze username issues
console.log(`${YELLOW}⚠️  DETECTED ISSUES:${RESET}\n`);

let issues = [];

if (USERNAME && USERNAME.includes(' ')) {
    issues.push({
        severity: 'HIGH',
        issue: `Username has SPACE: "${USERNAME}"`,
        why: 'MSEGAT usernames typically do NOT have spaces',
        fix: `Remove space: "${USERNAME.replace(/\s+/g, '')}"`
    });
}

if (USERNAME && USERNAME.length < 5) {
    issues.push({
        severity: 'MEDIUM',
        issue: `Username is very short: "${USERNAME}"`,
        why: 'MSEGAT usernames are usually longer',
        fix: 'Verify exact username from dashboard'
    });
}

if (USERNAME && /^[A-Z][a-z]+\s+[A-Z]/.test(USERNAME)) {
    issues.push({
        severity: 'HIGH',
        issue: 'Username looks like a DISPLAY NAME',
        why: `"${USERNAME}" is likely your display name, not API username`,
        fix: 'Get actual username from API Settings in dashboard'
    });
}

if (!API_KEY && !PASSWORD) {
    issues.push({
        severity: 'CRITICAL',
        issue: 'No API_KEY or PASSWORD set',
        why: 'Cannot authenticate without credentials',
        fix: 'Set MSEGAT_API_KEY in .env file'
    });
}

if (API_KEY && API_KEY.length !== 32) {
    issues.push({
        severity: 'MEDIUM',
        issue: `API Key length is ${API_KEY.length} (expected: 32)`,
        why: 'MSEGAT API keys are typically 32 characters',
        fix: 'Verify you copied the complete key'
    });
}

issues.forEach((item, i) => {
    console.log(`   ${i + 1}. ${item.severity === 'CRITICAL' ? RED : item.severity === 'HIGH' ? YELLOW : BLUE}[${item.severity}]${RESET}`);
    console.log(`      ❌ ${item.issue}`);
    console.log(`      ℹ️  ${item.why}`);
    console.log(`      ✅ ${item.fix}\n`);
});

if (issues.length === 0) {
    console.log(`   ${GREEN}✅ No obvious issues detected${RESET}\n`);
}

// Auto-test different username formats
console.log(`${BLUE}📡 STEP 2: Auto-Testing Different Username Formats${RESET}\n`);

async function testCredentials(username, apiKey, label) {
    try {
        const payload = {
            userName: username,
            apiKey: apiKey,
            userSender: SENDER,
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

        if (code === '1' || code === 'M0000' || code === 1) {
            console.log(`   ${GREEN}✅ SUCCESS!${RESET} ${label}`);
            console.log(`      Username: ${BOLD}${username}${RESET}`);
            console.log(`      Response: ${code} - Success\n`);
            return { success: true, username, apiKey };
        } else {
            console.log(`   ${RED}❌ FAILED${RESET} ${label}`);
            console.log(`      Username: ${username}`);
            console.log(`      Error: ${code} - ${message}\n`);
            return { success: false, code, message };
        }
    } catch (error) {
        console.log(`   ${RED}❌ ERROR${RESET} ${label}`);
        console.log(`      ${error.message}\n`);
        return { success: false, error: error.message };
    }
}

async function runTests() {
    let workingCredentials = null;

    // Generate test variations
    const testVariations = [];

    if (USERNAME && API_KEY) {
        // Test 1: Original
        testVariations.push({
            label: 'Original (with space)',
            username: USERNAME,
            apiKey: API_KEY
        });

        // Test 2: Remove spaces
        if (USERNAME.includes(' ')) {
            testVariations.push({
                label: 'Without space (combined)',
                username: USERNAME.replace(/\s+/g, ''),
                apiKey: API_KEY
            });
        }

        // Test 3: Lowercase
        testVariations.push({
            label: 'Lowercase',
            username: USERNAME.toLowerCase().replace(/\s+/g, ''),
            apiKey: API_KEY
        });

        // Test 4: First word only
        if (USERNAME.includes(' ')) {
            testVariations.push({
                label: 'First name only',
                username: USERNAME.split(' ')[0],
                apiKey: API_KEY
            });
        }

        // Test 5: With password if available
        if (PASSWORD) {
            testVariations.push({
                label: 'With PASSWORD instead of API_KEY',
                username: USERNAME.replace(/\s+/g, ''),
                apiKey: PASSWORD
            });
        }
    }

    console.log(`   Testing ${testVariations.length} credential combinations...\n`);

    for (const variation of testVariations) {
        const result = await testCredentials(variation.username, variation.apiKey, variation.label);
        
        if (result.success) {
            workingCredentials = result;
            break;
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`${CYAN}${'='.repeat(70)}${RESET}\n`);

    if (workingCredentials) {
        console.log(`${GREEN}${BOLD}🎉 SUCCESS! Working credentials found!${RESET}\n`);
        console.log(`${BLUE}📝 Update your .env file with these values:${RESET}\n`);
        console.log(`${BOLD}MSEGAT_USERNAME=${workingCredentials.username}${RESET}`);
        console.log(`${BOLD}MSEGAT_API_KEY=${workingCredentials.apiKey}${RESET}`);
        console.log(`MSEGAT_SENDER_NAME=${SENDER}\n`);
        console.log(`${GREEN}✅ Copy these values to api/.env file (lines 49-52)${RESET}`);
        console.log(`${GREEN}✅ Save the file${RESET}`);
        console.log(`${GREEN}✅ Restart your server${RESET}`);
        console.log(`${GREEN}✅ OTP will now be sent successfully!${RESET}\n`);
    } else {
        console.log(`${RED}${BOLD}❌ AUTHENTICATION FAILED WITH ALL VARIATIONS${RESET}\n`);
        console.log(`${YELLOW}🔧 What to do next:${RESET}\n`);
        console.log(`   ${BOLD}1. The credentials in your .env are INCORRECT${RESET}`);
        console.log(`      Current USERNAME: "${USERNAME}"`);
        console.log(`      This is likely your DISPLAY NAME, not API username\n`);
        
        console.log(`   ${BOLD}2. Get correct credentials from MSEGAT:${RESET}`);
        console.log(`      a. Login: https://www.msegat.com/`);
        console.log(`      b. Go to: Settings → API Integration`);
        console.log(`      c. Find: "Username" or "API Username" field`);
        console.log(`      d. This is your ACTUAL username (not display name)\n`);
        
        console.log(`   ${BOLD}3. Generate NEW API Key:${RESET}`);
        console.log(`      a. In API Integration section`);
        console.log(`      b. Click "Generate New API Key"`);
        console.log(`      c. Copy the FULL key (32 characters)\n`);
        
        console.log(`   ${BOLD}4. Update api/.env file:${RESET}`);
        console.log(`      ${BOLD}MSEGAT_USERNAME=your_exact_api_username${RESET}`);
        console.log(`      ${BOLD}MSEGAT_API_KEY=your_new_32_char_api_key${RESET}`);
        console.log(`      MSEGAT_SENDER_NAME=Zuroona\n`);
        
        console.log(`   ${BOLD}5. Run this script again:${RESET}`);
        console.log(`      node diagnose-msegat.js\n`);
        
        console.log(`${RED}⚠️  Common mistake: Using DISPLAY NAME instead of API USERNAME${RESET}`);
        console.log(`   Display Name: "Naif Alkahtani" ❌ (what you have now)`);
        console.log(`   API Username: "naifalkhtani" or "naif@example.com" ✅ (what you need)\n`);
        
        console.log(`${YELLOW}📞 Need help? Contact MSEGAT Support:${RESET}`);
        console.log(`   Email: support@msegat.com`);
        console.log(`   Tell them: "Need my API username for M0002 error"\n`);
    }

    console.log(`${CYAN}${'='.repeat(70)}${RESET}\n`);
}

// Run diagnostics
if (!USERNAME || !API_KEY) {
    console.log(`${RED}❌ Cannot run tests: Missing credentials in .env file${RESET}\n`);
    console.log(`${YELLOW}Add these to api/.env file:${RESET}\n`);
    console.log(`MSEGAT_USERNAME=your_username`);
    console.log(`MSEGAT_API_KEY=your_api_key`);
    console.log(`MSEGAT_SENDER_NAME=Zuroona\n`);
    process.exit(1);
}

runTests().catch(error => {
    console.error(`${RED}❌ Error: ${error.message}${RESET}`);
    process.exit(1);
});

