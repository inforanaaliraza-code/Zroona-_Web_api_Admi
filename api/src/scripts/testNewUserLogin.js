/**
 * Test script to verify new test user login
 */

require('dotenv').config();
const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3434/api';

const testLogin = async () => {
    try {
        console.log('🧪 Testing new user login...\n');

        // Test 1: Email/Password Login
        console.log('📧 Test 1: Email/Password Login');
        const emailLoginResponse = await axios.post(`${BASE_URL}/user/login`, {
            email: 'demouser@zuroona.com',
            password: 'Demo@123456'
        });

        if (emailLoginResponse.data.status === 1) {
            console.log('✅ Email/Password Login: SUCCESS');
            console.log('   Token:', emailLoginResponse.data.data.token.substring(0, 50) + '...');
            console.log('   User ID:', emailLoginResponse.data.data.user._id);
            console.log('   Name:', emailLoginResponse.data.data.user.first_name, emailLoginResponse.data.data.user.last_name);
        } else {
            console.log('❌ Email/Password Login: FAILED');
            console.log('   Error:', emailLoginResponse.data.message);
        }

        console.log('\n');

        // Test 2: Phone OTP Login (Send OTP)
        console.log('📱 Test 2: Phone OTP Login (Send OTP)');
        const sendOTPResponse = await axios.post(`${BASE_URL}/user/login/phone/send-otp`, {
            phone_number: '503456789',
            country_code: '+966'
        });

        if (sendOTPResponse.data.status === 1) {
            console.log('✅ OTP Sent: SUCCESS');
            console.log('   Message:', sendOTPResponse.data.message);
        } else {
            console.log('❌ OTP Send: FAILED');
            console.log('   Error:', sendOTPResponse.data.message);
        }

        console.log('\n');

        // Test 3: Phone OTP Login (Verify OTP)
        console.log('📱 Test 3: Phone OTP Login (Verify OTP)');
        const verifyOTPResponse = await axios.post(`${BASE_URL}/user/login/phone/verify-otp`, {
            phone_number: '503456789',
            country_code: '+966',
            otp: '123456' // Dummy OTP for testing
        });

        if (verifyOTPResponse.data.status === 1) {
            console.log('✅ OTP Verification: SUCCESS');
            console.log('   Token:', verifyOTPResponse.data.data.token.substring(0, 50) + '...');
            console.log('   User ID:', verifyOTPResponse.data.data.user._id);
            console.log('   Name:', verifyOTPResponse.data.data.user.first_name, verifyOTPResponse.data.data.user.last_name);
        } else {
            console.log('❌ OTP Verification: FAILED');
            console.log('   Error:', verifyOTPResponse.data.message);
        }

        console.log('\n');
        console.log('='.repeat(60));
        console.log('✅ All tests completed!');
        console.log('='.repeat(60));

    } catch (error) {
        console.error('❌ Test Error:', error.response?.data || error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
};

// Run test
testLogin();

