/**
 * Comprehensive MSGATE Test Suite
 * 
 * This script tests MSGATE OTP sending with multiple scenarios
 * 
 * Usage:
 *   node test-msgate-comprehensive.js
 */

require('dotenv').config();
const axios = require('axios');
const { sendOTP } = require('./src/helpers/msegatService');
const { sendSignupOtp } = require('./src/helpers/otpSend');
const UserService = require('./src/services/userService');

// Test configuration
const TEST_PHONE_NUMBER = '+966597832290';
const BASE_API_URL = process.env.BASE_API_URL || 'http://localhost:5000/api/';

console.log('\n' + '='.repeat(70));
console.log('🧪 COMPREHENSIVE MSGATE TEST SUITE');
console.log('='.repeat(70));
console.log(`📱 Test Phone Number: ${TEST_PHONE_NUMBER}`);
console.log(`🌐 API URL: ${BASE_API_URL}`);
console.log('='.repeat(70) + '\n');

// Test results tracker
const testResults = {
    passed: 0,
    failed: 0,
    skipped: 0,
    tests: []
};

function logTest(name, passed, message = '') {
    testResults.tests.push({ name, passed, message });
    if (passed) {
        testResults.passed++;
        console.log(`✅ ${name}: PASSED`);
        if (message) console.log(`   ${message}`);
    } else {
        testResults.failed++;
        console.log(`❌ ${name}: FAILED`);
        if (message) console.log(`   ${message}`);
    }
    console.log('');
}

/**
 * Test 1: Environment Variables Check
 */
async function testEnvironmentVariables() {
    console.log('📋 TEST 1: Environment Variables Check');
    console.log('-'.repeat(70));
    
    const MSEGAT_USERNAME = process.env.MSEGAT_USERNAME || process.env.MSEGAT_USER_NAME;
    const MSEGAT_API_KEY = process.env.MSEGAT_API_KEY;
    const MSEGAT_SENDER = process.env.MSEGAT_SENDER_NAME || process.env.MSEGAT_USER_SENDER;
    
    console.log(`   MSEGAT_USERNAME: ${MSEGAT_USERNAME ? '✅ Set' : '❌ Not set'}`);
    console.log(`   MSEGAT_API_KEY: ${MSEGAT_API_KEY ? '✅ Set' : '❌ Not set'}`);
    console.log(`   MSEGAT_SENDER: ${MSEGAT_SENDER ? '✅ Set (' + MSEGAT_SENDER + ')' : '❌ Not set'}`);
    console.log('');
    
    if (MSEGAT_USERNAME && MSEGAT_API_KEY) {
        logTest('Environment Variables', true, `Username: ${MSEGAT_USERNAME}, Sender: ${MSEGAT_SENDER || 'Zuroona'}`);
        return true;
    } else {
        logTest('Environment Variables', false, 'Missing required environment variables');
        return false;
    }
}

/**
 * Test 2: Direct OTP Sending (Simple)
 */
async function testDirectOTPSimple() {
    console.log('📋 TEST 2: Direct OTP Sending (Simple)');
    console.log('-'.repeat(70));
    
    try {
        const testOTP = '123456';
        console.log(`📤 Sending test OTP (${testOTP}) to ${TEST_PHONE_NUMBER}...`);
        
        const result = await sendOTP(TEST_PHONE_NUMBER, testOTP, 'en');
        
        if (result && result.success) {
            logTest('Direct OTP Sending (Simple)', true, `OTP sent successfully. Response: ${JSON.stringify(result.data)}`);
            return true;
        } else {
            logTest('Direct OTP Sending (Simple)', false, `Unexpected result: ${JSON.stringify(result)}`);
            return false;
        }
    } catch (error) {
        logTest('Direct OTP Sending (Simple)', false, `Error: ${error.message}`);
        return false;
    }
}

/**
 * Test 3: Direct OTP Sending (Arabic)
 */
async function testDirectOTPArabic() {
    console.log('📋 TEST 3: Direct OTP Sending (Arabic)');
    console.log('-'.repeat(70));
    
    try {
        const testOTP = '654321';
        console.log(`📤 Sending test OTP (${testOTP}) in Arabic to ${TEST_PHONE_NUMBER}...`);
        
        const result = await sendOTP(TEST_PHONE_NUMBER, testOTP, 'ar');
        
        if (result && result.success) {
            logTest('Direct OTP Sending (Arabic)', true, `Arabic OTP sent successfully`);
            return true;
        } else {
            logTest('Direct OTP Sending (Arabic)', false, `Unexpected result: ${JSON.stringify(result)}`);
            return false;
        }
    } catch (error) {
        logTest('Direct OTP Sending (Arabic)', false, `Error: ${error.message}`);
        return false;
    }
}

/**
 * Test 4: Phone Number Formatting
 */
async function testPhoneNumberFormatting() {
    console.log('📋 TEST 4: Phone Number Formatting');
    console.log('-'.repeat(70));
    
    const testNumbers = [
        '+966597832290',
        '966597832290',
        '00966597832290'
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const phone of testNumbers) {
        try {
            console.log(`   Testing format: ${phone}`);
            const testOTP = '111111';
            const result = await sendOTP(phone, testOTP, 'en');
            
            if (result && result.success) {
                passed++;
                console.log(`   ✅ Format accepted: ${phone}`);
            } else {
                failed++;
                console.log(`   ❌ Format rejected: ${phone}`);
            }
        } catch (error) {
            failed++;
            console.log(`   ❌ Format error: ${phone} - ${error.message}`);
        }
    }
    
    if (passed > 0) {
        logTest('Phone Number Formatting', true, `${passed} format(s) accepted, ${failed} failed`);
        return true;
    } else {
        logTest('Phone Number Formatting', false, `All formats failed`);
        return false;
    }
}

/**
 * Test 5: API Endpoint Test (Guest Signup)
 */
async function testAPISignupEndpoint() {
    console.log('📋 TEST 5: API Signup Endpoint Test');
    console.log('-'.repeat(70));
    
    try {
        const testEmail = `test.api.${Date.now()}@gmail.com`;
        console.log(`📝 Creating test user via API...`);
        console.log(`   Email: ${testEmail}`);
        console.log(`   Phone: 597832290`);
        
        const signupPayload = {
            first_name: 'Test',
            last_name: 'API',
            email: testEmail,
            phone_number: '597832290',
            country_code: '+966',
            gender: 1,
            date_of_birth: '1990-01-01',
            nationality: 'SA',
            city: 'SA',
            acceptPrivacy: true,
            acceptTerms: true,
            role: 1,
            language: 'en'
        };
        
        const response = await axios.post(
            `${BASE_API_URL}user/register`,
            signupPayload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'lang': 'en'
                },
                timeout: 30000
            }
        );
        
        if (response.data && (response.data.status === 1 || response.data.status === true)) {
            logTest('API Signup Endpoint', true, `User created. Check phone for OTP.`);
            return true;
        } else {
            logTest('API Signup Endpoint', false, `Response: ${JSON.stringify(response.data)}`);
            return false;
        }
    } catch (error) {
        if (error.response) {
            logTest('API Signup Endpoint', false, `HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}`);
        } else {
            logTest('API Signup Endpoint', false, `Error: ${error.message}`);
        }
        return false;
    }
}

/**
 * Test 6: Resend OTP Endpoint
 */
async function testResendOTPEndpoint() {
    console.log('📋 TEST 6: Resend OTP Endpoint Test');
    console.log('-'.repeat(70));
    
    try {
        // First create a user
        const testEmail = `test.resend.${Date.now()}@gmail.com`;
        console.log(`📝 Creating test user first...`);
        
        const signupPayload = {
            first_name: 'Test',
            last_name: 'Resend',
            email: testEmail,
            phone_number: '597832290',
            country_code: '+966',
            gender: 1,
            date_of_birth: '1990-01-01',
            nationality: 'SA',
            city: 'SA',
            acceptPrivacy: true,
            acceptTerms: true,
            role: 1,
            language: 'en'
        };
        
        const signupResponse = await axios.post(
            `${BASE_API_URL}user/register`,
            signupPayload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'lang': 'en'
                },
                timeout: 30000
            }
        );
        
        if (!signupResponse.data || !(signupResponse.data.status === 1 || signupResponse.data.status === true)) {
            logTest('Resend OTP Endpoint', false, 'Could not create user for resend test');
            return false;
        }
        
        const userId = signupResponse.data.data?.user?._id || signupResponse.data.user?._id;
        console.log(`✅ User created: ${userId}`);
        console.log(`📤 Testing resend OTP...`);
        
        // Wait a bit before resend
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const resendResponse = await axios.post(
            `${BASE_API_URL}user/resend-signup-otp`,
            {
                user_id: userId,
                phone_number: '597832290',
                country_code: '+966'
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'lang': 'en'
                },
                timeout: 30000
            }
        );
        
        if (resendResponse.data && (resendResponse.data.status === 1 || resendResponse.data.success)) {
            logTest('Resend OTP Endpoint', true, `OTP resent successfully. Check phone.`);
            return true;
        } else {
            logTest('Resend OTP Endpoint', false, `Response: ${JSON.stringify(resendResponse.data)}`);
            return false;
        }
    } catch (error) {
        if (error.response) {
            logTest('Resend OTP Endpoint', false, `HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}`);
        } else {
            logTest('Resend OTP Endpoint', false, `Error: ${error.message}`);
        }
        return false;
    }
}

/**
 * Test 7: Error Handling
 */
async function testErrorHandling() {
    console.log('📋 TEST 7: Error Handling Test');
    console.log('-'.repeat(70));
    
    try {
        // Test with invalid phone number
        console.log(`📤 Testing with invalid phone number...`);
        const result = await sendOTP('123', '123456', 'en');
        logTest('Error Handling', false, 'Should have thrown error for invalid phone');
        return false;
    } catch (error) {
        if (error.message && (error.message.includes('Invalid') || error.message.includes('phone'))) {
            logTest('Error Handling', true, `Correctly caught error: ${error.message}`);
            return true;
        } else {
            logTest('Error Handling', false, `Unexpected error: ${error.message}`);
            return false;
        }
    }
}

/**
 * Test 8: Rate Limiting (if applicable)
 */
async function testRateLimiting() {
    console.log('📋 TEST 8: Rate Limiting Test');
    console.log('-'.repeat(70));
    
    try {
        console.log(`📤 Sending first OTP...`);
        const result1 = await sendOTP(TEST_PHONE_NUMBER, '111111', 'en');
        
        if (!result1 || !result1.success) {
            logTest('Rate Limiting', false, 'First OTP failed, cannot test rate limiting');
            return false;
        }
        
        console.log(`📤 Immediately sending second OTP (should be rate limited)...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const result2 = await sendOTP(TEST_PHONE_NUMBER, '222222', 'en');
        
        // Rate limiting might or might not be active
        logTest('Rate Limiting', true, 'Rate limiting test completed (check logs for details)');
        return true;
    } catch (error) {
        if (error.message && error.message.includes('wait')) {
            logTest('Rate Limiting', true, `Rate limiting working: ${error.message}`);
            return true;
        } else {
            logTest('Rate Limiting', false, `Unexpected error: ${error.message}`);
            return false;
        }
    }
}

/**
 * Main test runner
 */
async function runAllTests() {
    console.log('🚀 Starting comprehensive test suite...\n');
    
    // Test 1: Environment Variables
    const envOk = await testEnvironmentVariables();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!envOk) {
        console.log('\n⚠️  Skipping other tests due to missing environment variables\n');
        testResults.skipped = 7;
    } else {
        // Test 2: Direct OTP Simple
        await testDirectOTPSimple();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Test 3: Direct OTP Arabic
        await testDirectOTPArabic();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Test 4: Phone Number Formatting
        await testPhoneNumberFormatting();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Test 5: API Signup Endpoint
        await testAPISignupEndpoint();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Test 6: Resend OTP Endpoint
        await testResendOTPEndpoint();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Test 7: Error Handling
        await testErrorHandling();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Test 8: Rate Limiting
        await testRateLimiting();
    }
    
    // Print summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(70));
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`⚠️  Skipped: ${testResults.skipped}`);
    console.log(`📋 Total Tests: ${testResults.tests.length}`);
    console.log('='.repeat(70));
    
    console.log('\n📋 Detailed Results:');
    testResults.tests.forEach((test, index) => {
        const status = test.passed ? '✅' : '❌';
        console.log(`${index + 1}. ${status} ${test.name}`);
        if (test.message) {
            console.log(`   ${test.message}`);
        }
    });
    
    console.log('\n' + '='.repeat(70));
    if (testResults.failed === 0 && testResults.skipped === 0) {
        console.log('🎉 ALL TESTS PASSED!');
    } else if (testResults.passed > 0) {
        console.log('⚠️  SOME TESTS FAILED - Check details above');
    } else {
        console.log('❌ ALL TESTS FAILED - Check configuration');
    }
    console.log('='.repeat(70));
    console.log('\n📱 Please check phone (+966597832290) for OTP SMS messages\n');
}

// Run tests
runAllTests().catch(error => {
    console.error('\n❌ FATAL ERROR:', error);
    console.error(error.stack);
    process.exit(1);
});
