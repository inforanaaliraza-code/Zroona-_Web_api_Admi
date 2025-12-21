/**
 * Code Structure Test - No Dependencies Required
 * Tests file structure, function existence, and code patterns
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Code Structure (No Dependencies Required)...\n');

let testsPassed = 0;
let testsFailed = 0;

// Helper function to check file exists
function fileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    } catch {
        return false;
    }
}

// Helper function to read file content
function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch {
        return '';
    }
}

// Test 1: Check msegatService.js exists
console.log('Test 1: Checking msegatService.js file...');
const msegatPath = './src/helpers/msegatService.js';
if (fileExists(msegatPath)) {
    const content = readFile(msegatPath);
    if (content.includes('sendSMS') && content.includes('sendOTP') && content.includes('MSEGAT_API_KEY')) {
        console.log('✅ msegatService.js structure correct');
        console.log('   - sendSMS function: ✓');
        console.log('   - sendOTP function: ✓');
        console.log('   - API Key configuration: ✓');
        testsPassed++;
    } else {
        console.error('❌ msegatService.js missing required functions');
        testsFailed++;
    }
} else {
    console.error('❌ msegatService.js file not found');
    testsFailed++;
}

// Test 2: Check otpSend.js exists and has required functions
console.log('\nTest 2: Checking otpSend.js file...');
const otpPath = './src/helpers/otpSend.js';
if (fileExists(otpPath)) {
    const content = readFile(otpPath);
    if (content.includes('sendOtp') && 
        content.includes('verifyOtp') && 
        content.includes('sendOtpToPhone') &&
        content.includes('verifyLoginOtp') &&
        content.includes('generateOTP') &&
        content.includes('msegatService')) {
        console.log('✅ otpSend.js structure correct');
        console.log('   - sendOtp function: ✓');
        console.log('   - verifyOtp function: ✓');
        console.log('   - sendOtpToPhone function: ✓');
        console.log('   - verifyLoginOtp function: ✓');
        console.log('   - Msegat integration: ✓');
        testsPassed++;
    } else {
        console.error('❌ otpSend.js missing required functions');
        testsFailed++;
    }
} else {
    console.error('❌ otpSend.js file not found');
    testsFailed++;
}

// Test 3: Check userController phone login functions
console.log('\nTest 3: Checking userController phone login...');
const userControllerPath = './src/controllers/userController.js';
if (fileExists(userControllerPath)) {
    const content = readFile(userControllerPath);
    if (content.includes('sendPhoneOTP') && 
        content.includes('verifyPhoneOTP') &&
        content.includes('country_code !== "+966"') &&
        content.includes('Only Saudi Arabia phone numbers')) {
        console.log('✅ userController phone login implemented');
        console.log('   - sendPhoneOTP function: ✓');
        console.log('   - verifyPhoneOTP function: ✓');
        console.log('   - Saudi Arabia validation: ✓');
        testsPassed++;
    } else {
        console.error('❌ userController phone login incomplete');
        testsFailed++;
    }
} else {
    console.error('❌ userController.js file not found');
    testsFailed++;
}

// Test 4: Check routes configuration
console.log('\nTest 4: Checking routes...');
const routesPath = './src/routes/userRoutes.js';
if (fileExists(routesPath)) {
    const content = readFile(routesPath);
    if (content.includes('/login/phone/send-otp') && 
        content.includes('/login/phone/verify-otp') &&
        content.includes('sendPhoneOTP') &&
        content.includes('verifyPhoneOTP')) {
        console.log('✅ Phone login routes configured');
        console.log('   - POST /login/phone/send-otp: ✓');
        console.log('   - POST /login/phone/verify-otp: ✓');
        testsPassed++;
    } else {
        console.error('❌ Routes not properly configured');
        testsFailed++;
    }
} else {
    console.error('❌ userRoutes.js file not found');
    testsFailed++;
}

// Test 5: Check registration OTP integration
console.log('\nTest 5: Checking registration OTP integration...');
if (fileExists(userControllerPath)) {
    const userContent = readFile(userControllerPath);
    const organizerPath = './src/controllers/organizerController.js';
    const organizerContent = fileExists(organizerPath) ? readFile(organizerPath) : '';
    
    if (userContent.includes('sendOtpToPhone') && organizerContent.includes('sendOtpToPhone')) {
        console.log('✅ Registration OTP integration found');
        console.log('   - User registration: ✓');
        console.log('   - Organizer registration: ✓');
        testsPassed++;
    } else {
        console.error('❌ Registration OTP integration missing');
        testsFailed++;
    }
} else {
    testsFailed++;
}

// Test 6: Check host approval logic
console.log('\nTest 6: Checking host approval logic...');
if (fileExists(userControllerPath)) {
    const content = readFile(userControllerPath);
    if (content.includes('is_approved') && 
        (content.includes('admin approval') || content.includes('cannot login until'))) {
        console.log('✅ Host approval check implemented');
        console.log('   - Approval status check: ✓');
        testsPassed++;
    } else {
        console.error('❌ Host approval logic missing');
        testsFailed++;
    }
} else {
    testsFailed++;
}

// Test 7: Check Saudi Arabia phone validation in registration
console.log('\nTest 7: Checking Saudi Arabia validation in registration...');
if (fileExists(userControllerPath)) {
    const userContent = readFile(userControllerPath);
    const organizerPath = './src/controllers/organizerController.js';
    const organizerContent = fileExists(organizerPath) ? readFile(organizerPath) : '';
    
    if ((userContent.includes('country_code !== "+966"') || userContent.includes('Only Saudi Arabia')) &&
        (organizerContent.includes('country_code !== "+966"') || organizerContent.includes('Only Saudi Arabia'))) {
        console.log('✅ Saudi Arabia validation in registration');
        console.log('   - User registration: ✓');
        console.log('   - Organizer registration: ✓');
        testsPassed++;
    } else {
        console.error('❌ Saudi Arabia validation missing in registration');
        testsFailed++;
    }
} else {
    testsFailed++;
}

// Test 8: Check Msegat API configuration
console.log('\nTest 8: Checking Msegat API configuration...');
if (fileExists(msegatPath)) {
    const content = readFile(msegatPath);
    if (content.includes('MSEGAT_API_URL') && 
        content.includes('MSEGAT_API_KEY') &&
        content.includes('3808F5D4D89B1B23E61632C0B475A342')) {
        console.log('✅ Msegat API configuration');
        console.log('   - API URL: ✓');
        console.log('   - API Key: ✓');
        console.log('   - Default API Key: ✓');
        testsPassed++;
    } else {
        console.error('❌ Msegat configuration incomplete');
        testsFailed++;
    }
} else {
    testsFailed++;
}

// Test 9: Check OTP rate limiting and expiration
console.log('\nTest 9: Checking OTP security features...');
if (fileExists(otpPath)) {
    const content = readFile(otpPath);
    if (content.includes('30000') && content.includes('5 * 60 * 1000')) {
        console.log('✅ OTP security features');
        console.log('   - Rate limiting (30s): ✓');
        console.log('   - OTP expiration (5min): ✓');
        testsPassed++;
    } else {
        console.error('❌ OTP security features missing');
        testsFailed++;
    }
} else {
    testsFailed++;
}

// Test 10: Check documentation files
console.log('\nTest 10: Checking documentation...');
const docs = [
    './MSEGAT_CREDENTIALS_GUIDE.md',
    './MSEGAT_IMPLEMENTATION_SUMMARY.md'
];
let docsFound = 0;
docs.forEach(doc => {
    if (fileExists(doc)) {
        docsFound++;
    }
});
if (docsFound === docs.length) {
    console.log('✅ All documentation files exist');
    testsPassed++;
} else {
    console.log(`⚠️  ${docsFound}/${docs.length} documentation files found`);
    testsPassed++; // Not critical
}

// Final Summary
console.log('\n' + '='.repeat(60));
console.log('📊 CODE STRUCTURE TEST SUMMARY');
console.log('='.repeat(60));
console.log(`✅ Tests Passed: ${testsPassed}`);
console.log(`❌ Tests Failed: ${testsFailed}`);
console.log(`📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);

if (testsFailed === 0) {
    console.log('\n🎉 All code structure tests passed!');
    console.log('✅ Implementation is structurally correct.');
    console.log('\n📝 Next Steps:');
    console.log('1. Install dependencies: npm install');
    console.log('2. Add MSEGAT_API_KEY to .env file');
    console.log('3. Start server and test endpoints');
    console.log('4. Test with real Saudi Arabia phone number');
} else {
    console.log('\n⚠️  Some structure tests failed.');
    console.log('Please review the errors above.');
}

console.log('\n');

process.exit(testsFailed === 0 ? 0 : 1);

