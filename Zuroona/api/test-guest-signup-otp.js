/**
 * Test Script: Guest Signup OTP Test
 * 
 * This script tests if OTP is being sent to phone number +966597832290
 * when a guest user signs up.
 * 
 * Usage:
 *   node test-guest-signup-otp.js
 * 
 * Test Number: +966597832290
 */

require('dotenv').config();
const axios = require('axios');
const { sendOTP } = require('./src/helpers/msegatService');
const { sendSignupOtp } = require('./src/helpers/otpSend');
const UserService = require('./src/services/userService');

// Test configuration
const TEST_PHONE_NUMBER = '+966597832290';
const TEST_EMAIL = `test.guest.${Date.now()}@gmail.com`;
const BASE_API_URL = process.env.BASE_API_URL || 'http://localhost:5000/api/';

console.log('\n' + '='.repeat(70));
console.log('🧪 GUEST SIGNUP OTP TEST');
console.log('='.repeat(70));
console.log(`📱 Test Phone Number: ${TEST_PHONE_NUMBER}`);
console.log(`📧 Test Email: ${TEST_EMAIL}`);
console.log(`🌐 API URL: ${BASE_API_URL}`);
console.log('='.repeat(70) + '\n');

/**
 * Test 1: Direct OTP sending via msegatService
 */
async function testDirectOTPSending() {
    console.log('\n📋 TEST 1: Direct OTP Sending via msegatService');
    console.log('-'.repeat(70));
    
    try {
        const testOTP = '123456';
        console.log(`📤 Sending test OTP (${testOTP}) to ${TEST_PHONE_NUMBER}...`);
        
        const result = await sendOTP(TEST_PHONE_NUMBER, testOTP, 'en');
        
        if (result && result.success) {
            console.log('✅ SUCCESS: OTP sent successfully via MSGATE!');
            console.log(`   Response: ${JSON.stringify(result, null, 2)}`);
            return true;
        } else {
            console.log('❌ FAILED: OTP sending returned unexpected result');
            console.log(`   Response: ${JSON.stringify(result, null, 2)}`);
            return false;
        }
    } catch (error) {
        console.error('❌ FAILED: Error sending OTP directly');
        console.error(`   Error: ${error.message}`);
        console.error(`   Stack: ${error.stack}`);
        return false;
    }
}

/**
 * Test 2: Full Guest Signup Flow
 */
async function testGuestSignupFlow() {
    console.log('\n📋 TEST 2: Full Guest Signup Flow');
    console.log('-'.repeat(70));
    
    try {
        // Step 1: Create a test user via signup API
        console.log('\n📝 Step 1: Creating guest user account...');
        
        const signupPayload = {
            first_name: 'Test',
            last_name: 'Guest',
            email: TEST_EMAIL,
            phone_number: '597832290', // Without country code
            country_code: '+966',
            gender: 1,
            date_of_birth: '1990-01-01',
            nationality: 'SA',
            city: 'SA',
            acceptPrivacy: true,
            acceptTerms: true,
            role: 1, // Guest role
            language: 'en'
        };
        
        console.log('   Payload:', JSON.stringify(signupPayload, null, 2));
        
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
        
        console.log('   Response Status:', signupResponse.status);
        console.log('   Response Data:', JSON.stringify(signupResponse.data, null, 2));
        
        if (signupResponse.data && (signupResponse.data.status === 1 || signupResponse.data.status === true)) {
            const userId = signupResponse.data.data?.user?._id || signupResponse.data.user?._id;
            console.log(`✅ User created successfully! User ID: ${userId}`);
            
            // Check if OTP was sent (it should be sent automatically during signup)
            if (signupResponse.data.data?.otp_for_testing) {
                console.log(`\n⚠️  OTP for testing (dev mode): ${signupResponse.data.data.otp_for_testing}`);
            }
            
            console.log('\n📱 Step 2: Checking if OTP was sent to phone...');
            console.log('   Please check your phone (+966597832290) for OTP SMS');
            console.log('   The OTP should have been sent automatically during signup');
            
            return { success: true, userId };
        } else {
            console.error('❌ User creation failed');
            console.error('   Response:', signupResponse.data);
            return { success: false };
        }
    } catch (error) {
        console.error('❌ FAILED: Error in guest signup flow');
        if (error.response) {
            console.error(`   HTTP Status: ${error.response.status}`);
            console.error(`   Response: ${JSON.stringify(error.response.data, null, 2)}`);
        } else {
            console.error(`   Error: ${error.message}`);
            console.error(`   Stack: ${error.stack}`);
        }
        return { success: false };
    }
}

/**
 * Test 3: Resend OTP Test
 */
async function testResendOTP(userId) {
    console.log('\n📋 TEST 3: Resend OTP Test');
    console.log('-'.repeat(70));
    
    if (!userId) {
        console.log('⚠️  Skipping: No user ID available');
        return false;
    }
    
    try {
        console.log(`📤 Resending OTP to ${TEST_PHONE_NUMBER}...`);
        
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
        
        console.log('   Response Status:', resendResponse.status);
        console.log('   Response Data:', JSON.stringify(resendResponse.data, null, 2));
        
        if (resendResponse.data && (resendResponse.data.status === 1 || resendResponse.data.success)) {
            console.log('✅ SUCCESS: OTP resent successfully!');
            console.log('   Please check your phone (+966597832290) for OTP SMS');
            return true;
        } else {
            console.error('❌ FAILED: OTP resend failed');
            console.error('   Response:', resendResponse.data);
            return false;
        }
    } catch (error) {
        console.error('❌ FAILED: Error resending OTP');
        if (error.response) {
            console.error(`   HTTP Status: ${error.response.status}`);
            console.error(`   Response: ${JSON.stringify(error.response.data, null, 2)}`);
        } else {
            console.error(`   Error: ${error.message}`);
        }
        return false;
    }
}

/**
 * Test 4: Direct sendSignupOtp function test
 */
async function testSendSignupOtpFunction() {
    console.log('\n📋 TEST 4: Direct sendSignupOtp Function Test');
    console.log('-'.repeat(70));
    
    try {
        // First, create a test user in database
        console.log('📝 Creating test user in database...');
        const testUser = await UserService.CreateService({
            first_name: 'Test',
            last_name: 'Guest',
            email: `test.otp.${Date.now()}@gmail.com`,
            phone_number: '597832290',
            country_code: '+966',
            gender: 1,
            date_of_birth: new Date('1990-01-01'),
            nationality: 'SA',
            city: 'SA',
            role: 1,
            is_verified: false
        });
        
        console.log(`✅ Test user created: ${testUser._id}`);
        
        // Now test sending OTP
        console.log(`\n📤 Sending OTP via sendSignupOtp function...`);
        const fullPhoneNumber = '+966597832290';
        const otp = await sendSignupOtp(testUser._id.toString(), fullPhoneNumber, 1, 'en');
        
        console.log(`✅ SUCCESS: OTP sent successfully!`);
        console.log(`   Generated OTP: ${otp}`);
        console.log(`   Phone Number: ${fullPhoneNumber}`);
        console.log('   Please check your phone for OTP SMS');
        
        // Clean up test user
        try {
            await UserService.DeleteService(testUser._id);
            console.log('   ✅ Test user cleaned up');
        } catch (cleanupError) {
            console.log('   ⚠️  Could not clean up test user:', cleanupError.message);
        }
        
        return true;
    } catch (error) {
        console.error('❌ FAILED: Error in sendSignupOtp function test');
        console.error(`   Error: ${error.message}`);
        console.error(`   Stack: ${error.stack}`);
        return false;
    }
}

/**
 * Main test runner
 */
async function runTests() {
    const results = {
        test1: false,
        test2: false,
        test3: false,
        test4: false
    };
    
    try {
        // Test 1: Direct OTP sending
        results.test1 = await testDirectOTPSending();
        
        // Wait 2 seconds between tests
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Test 4: Direct sendSignupOtp function (before full signup to avoid conflicts)
        results.test4 = await testSendSignupOtpFunction();
        
        // Wait 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Test 2: Full signup flow
        const signupResult = await testGuestSignupFlow();
        results.test2 = signupResult.success;
        
        // Wait 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Test 3: Resend OTP (if signup was successful)
        if (signupResult.success && signupResult.userId) {
            results.test3 = await testResendOTP(signupResult.userId);
        } else {
            console.log('\n⚠️  Skipping Test 3: Signup was not successful');
        }
        
    } catch (error) {
        console.error('\n❌ CRITICAL ERROR:', error.message);
        console.error(error.stack);
    }
    
    // Print summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(70));
    console.log(`Test 1 - Direct OTP Sending:        ${results.test1 ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Test 2 - Full Guest Signup Flow:    ${results.test2 ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Test 3 - Resend OTP:                ${results.test3 ? '✅ PASSED' : '⚠️  SKIPPED'}`);
    console.log(`Test 4 - sendSignupOtp Function:   ${results.test4 ? '✅ PASSED' : '❌ FAILED'}`);
    console.log('='.repeat(70));
    
    const allPassed = results.test1 && results.test2 && results.test4;
    if (allPassed) {
        console.log('\n✅ ALL CRITICAL TESTS PASSED!');
        console.log('📱 Please verify that you received OTP SMS on +966597832290');
    } else {
        console.log('\n❌ SOME TESTS FAILED');
        console.log('   Please check the error messages above');
    }
    
    console.log('\n');
}

// Run tests
runTests().catch(error => {
    console.error('\n❌ FATAL ERROR:', error);
    process.exit(1);
});
