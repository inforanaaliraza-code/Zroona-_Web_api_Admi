#!/usr/bin/env node
/**
 * MSEGAT Auto-Fix Tool
 * 
 * This script will:
 * 1. Auto-test all credential variations
 * 2. Prompt for new credentials if needed
 * 3. Auto-generate fixed .env content
 * 4. Verify the fix works
 */

require('dotenv').config();
const axios = require('axios');
const querystring = require('querystring');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Colors
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

const API_URL = 'https://www.msegat.com/gw/sendsms.php';
const TEST_NUMBER = '966501234567';
const TEST_MESSAGE = 'Test from Zuroona';

console.log(`\n${BOLD}${CYAN}${'='.repeat(70)}${RESET}`);
console.log(`${BOLD}${CYAN}   🔧 MSEGAT AUTO-FIX TOOL${RESET}`);
console.log(`${BOLD}${CYAN}${'='.repeat(70)}${RESET}\n`);

async function testCredential(username, apiKey, label) {
    try {
        const payload = {
            userName: username,
            apiKey: apiKey,
            userSender: process.env.MSEGAT_SENDER_NAME || 'Zuroona',
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
            return { success: true, username, apiKey, label };
        } else {
            return { success: false, code, message, label };
        }
    } catch (error) {
        return { success: false, error: error.message, label };
    }
}

async function autoTest() {
    console.log(`${BLUE}📡 STEP 1: Auto-Testing Current Credentials${RESET}\n`);

    const USERNAME = process.env.MSEGAT_USERNAME;
    const API_KEY = process.env.MSEGAT_API_KEY;
    const PASSWORD = process.env.MSEGAT_PASSWORD;

    if (!USERNAME || (!API_KEY && !PASSWORD)) {
        console.log(`${RED}❌ No credentials found in .env file${RESET}\n`);
        return null;
    }

    console.log(`   Current: ${USERNAME}\n`);

    const variations = [];

    // Generate all possible variations
    if (USERNAME && API_KEY) {
        variations.push({ label: '1. Original', username: USERNAME, apiKey: API_KEY });
        
        if (USERNAME.includes(' ')) {
            variations.push({ label: '2. No space', username: USERNAME.replace(/\s+/g, ''), apiKey: API_KEY });
            variations.push({ label: '3. Lowercase no space', username: USERNAME.toLowerCase().replace(/\s+/g, ''), apiKey: API_KEY });
            variations.push({ label: '4. First word', username: USERNAME.split(' ')[0], apiKey: API_KEY });
            variations.push({ label: '5. Last word', username: USERNAME.split(' ').pop(), apiKey: API_KEY });
            variations.push({ label: '6. Underscore', username: USERNAME.replace(/\s+/g, '_'), apiKey: API_KEY });
            variations.push({ label: '7. Lowercase underscore', username: USERNAME.toLowerCase().replace(/\s+/g, '_'), apiKey: API_KEY });
        }
        
        variations.push({ label: '8. Lowercase', username: USERNAME.toLowerCase(), apiKey: API_KEY });
        variations.push({ label: '9. Uppercase', username: USERNAME.toUpperCase(), apiKey: API_KEY });
    }

    if (USERNAME && PASSWORD) {
        variations.push({ label: '10. With PASSWORD', username: USERNAME.replace(/\s+/g, ''), apiKey: PASSWORD });
    }

    console.log(`   Testing ${variations.length} variations...\n`);

    for (let i = 0; i < variations.length; i++) {
        const v = variations[i];
        process.stdout.write(`   ${v.label}: "${v.username}" ... `);
        
        const result = await testCredential(v.username, v.apiKey, v.label);
        
        if (result.success) {
            console.log(`${GREEN}✅ SUCCESS!${RESET}\n`);
            return result;
        } else {
            console.log(`${RED}❌ ${result.code || result.error}${RESET}`);
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`\n${RED}❌ All ${variations.length} variations failed${RESET}\n`);
    return null;
}

async function promptNewCredentials() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const question = (query) => new Promise((resolve) => rl.question(query, resolve));

    console.log(`${YELLOW}🔧 Current credentials are incorrect${RESET}\n`);
    console.log(`${BOLD}Please provide correct credentials from MSEGAT Dashboard:${RESET}`);
    console.log(`   (Login: https://www.msegat.com/ → Settings → API Integration)\n`);

    const username = await question(`   ${CYAN}Enter API Username:${RESET} `);
    
    if (!username || username.trim() === '') {
        console.log(`\n${RED}❌ Username cannot be empty${RESET}\n`);
        rl.close();
        return null;
    }

    const apiKey = await question(`   ${CYAN}Enter API Key (32 chars):${RESET} `);
    
    if (!apiKey || apiKey.trim() === '') {
        console.log(`\n${RED}❌ API Key cannot be empty${RESET}\n`);
        rl.close();
        return null;
    }

    rl.close();

    console.log(`\n${BLUE}🧪 Testing new credentials...${RESET}\n`);

    const result = await testCredential(username.trim(), apiKey.trim(), 'New credentials');

    if (result.success) {
        console.log(`${GREEN}${BOLD}✅ SUCCESS! New credentials work!${RESET}\n`);
        return { username: username.trim(), apiKey: apiKey.trim() };
    } else {
        console.log(`${RED}❌ Failed: ${result.code || result.error}${RESET}`);
        console.log(`${YELLOW}⚠️  The credentials you entered are still incorrect${RESET}\n`);
        return null;
    }
}

function generateEnvFix(username, apiKey) {
    const envPath = path.join(__dirname, '.env');
    let envContent = '';

    try {
        envContent = fs.readFileSync(envPath, 'utf8');
    } catch (error) {
        console.log(`${YELLOW}⚠️  Could not read .env file${RESET}`);
        return null;
    }

    // Update credentials
    const lines = envContent.split('\n');
    let updated = false;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('MSEGAT_USERNAME=')) {
            lines[i] = `MSEGAT_USERNAME=${username}`;
            updated = true;
        }
        if (lines[i].startsWith('MSEGAT_API_KEY=')) {
            lines[i] = `MSEGAT_API_KEY=${apiKey}`;
            updated = true;
        }
    }

    return { content: lines.join('\n'), updated };
}

function saveEnvFile(content) {
    const envPath = path.join(__dirname, '.env');
    const backupPath = path.join(__dirname, '.env.backup');

    try {
        // Create backup
        if (fs.existsSync(envPath)) {
            fs.copyFileSync(envPath, backupPath);
            console.log(`${GREEN}✅ Backup created: .env.backup${RESET}`);
        }

        // Save new content
        fs.writeFileSync(envPath, content, 'utf8');
        console.log(`${GREEN}✅ Updated: .env${RESET}`);

        return true;
    } catch (error) {
        console.log(`${RED}❌ Error saving .env: ${error.message}${RESET}`);
        return false;
    }
}

async function main() {
    // Step 1: Auto-test existing credentials
    let workingCreds = await autoTest();

    // Step 2: If auto-test found working creds
    if (workingCreds) {
        console.log(`${CYAN}${'='.repeat(70)}${RESET}\n`);
        console.log(`${GREEN}${BOLD}🎉 SUCCESS! Working credentials found automatically!${RESET}\n`);
        console.log(`${BOLD}Working credentials:${RESET}`);
        console.log(`   Username: ${workingCreds.username}`);
        console.log(`   API Key:  ${workingCreds.apiKey.substring(0, 10)}...${workingCreds.apiKey.substring(workingCreds.apiKey.length - 4)}\n`);

        const envFix = generateEnvFix(workingCreds.username, workingCreds.apiKey);

        if (envFix && envFix.updated) {
            console.log(`${BLUE}📝 Updating .env file automatically...${RESET}\n`);

            if (saveEnvFile(envFix.content)) {
                console.log(`${GREEN}${BOLD}✅ .env file updated successfully!${RESET}\n`);
                console.log(`${YELLOW}🔄 Next steps:${RESET}`);
                console.log(`   1. Restart your server (Ctrl+C then npm run dev)`);
                console.log(`   2. Try registration again`);
                console.log(`   3. OTP should now be sent successfully! 🎉\n`);
            }
        } else {
            console.log(`${YELLOW}⚠️  Could not auto-update .env file${RESET}\n`);
            console.log(`${BOLD}Manual update required:${RESET}\n`);
            console.log(`Edit api/.env file and set:\n`);
            console.log(`${BOLD}MSEGAT_USERNAME=${workingCreds.username}${RESET}`);
            console.log(`${BOLD}MSEGAT_API_KEY=${workingCreds.apiKey}${RESET}\n`);
        }

        console.log(`${CYAN}${'='.repeat(70)}${RESET}\n`);
        return;
    }

    // Step 3: If auto-test failed, prompt for new credentials
    console.log(`${CYAN}${'='.repeat(70)}${RESET}\n`);
    console.log(`${BLUE}📋 STEP 2: Manual Credential Entry${RESET}\n`);

    const newCreds = await promptNewCredentials();

    if (newCreds) {
        const envFix = generateEnvFix(newCreds.username, newCreds.apiKey);

        if (envFix && envFix.updated) {
            console.log(`${BLUE}📝 Updating .env file...${RESET}\n`);

            if (saveEnvFile(envFix.content)) {
                console.log(`${GREEN}${BOLD}✅ Fixed! .env file updated successfully!${RESET}\n`);
                console.log(`${YELLOW}🔄 Next steps:${RESET}`);
                console.log(`   1. Restart your server (Ctrl+C then npm run dev)`);
                console.log(`   2. Try registration again`);
                console.log(`   3. OTP should now be sent successfully! 🎉\n`);
            }
        } else {
            console.log(`${BOLD}Manual update required:${RESET}\n`);
            console.log(`Edit api/.env file and set:\n`);
            console.log(`${BOLD}MSEGAT_USERNAME=${newCreds.username}${RESET}`);
            console.log(`${BOLD}MSEGAT_API_KEY=${newCreds.apiKey}${RESET}\n`);
        }
    } else {
        console.log(`${RED}${BOLD}❌ Unable to fix automatically${RESET}\n`);
        console.log(`${YELLOW}Please:${RESET}`);
        console.log(`   1. Login to MSEGAT: https://www.msegat.com/`);
        console.log(`   2. Go to: Settings → API Integration`);
        console.log(`   3. Get your correct API Username (NOT display name)`);
        console.log(`   4. Generate new API Key`);
        console.log(`   5. Update api/.env file manually`);
        console.log(`   6. Run this script again: node auto-fix-msegat.js\n`);
    }

    console.log(`${CYAN}${'='.repeat(70)}${RESET}\n`);
}

// Run the auto-fix
main().catch(error => {
    console.error(`${RED}❌ Fatal error: ${error.message}${RESET}`);
    process.exit(1);
});

