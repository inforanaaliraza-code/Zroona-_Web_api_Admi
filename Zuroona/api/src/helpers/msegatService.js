/**
 * Msegat SMS Service
 * 
 * This service handles SMS sending via MSGATE API for OTP verification.
 * Supports Saudi Arabia (+966) and Pakistan (+92) phone numbers.
 * 
 * Required Environment Variables:
 * - MSEGAT_API_KEY: Your Msegat API Key
 * - MSEGAT_SENDER_NAME: Your Msegat Sender Name (optional, default: "Zuroona")
 * 
 * Msegat API Documentation: https://www.msegat.com/en/api/
 */

const axios = require('axios');
const querystring = require('querystring');

// Msegat API Configuration
// Correct endpoint: https://www.msegat.com/gw/sendsms.php
const MSEGAT_API_URL = process.env.MSEGAT_API_URL || 'https://www.msegat.com/gw/sendsms.php';
// MsgGate supports both username+password OR apiKey alone
const MSEGAT_USERNAME = process.env.MSEGAT_USERNAME;
const MSEGAT_PASSWORD = process.env.MSEGAT_PASSWORD;
const MSEGAT_API_KEY = process.env.MSEGAT_API_KEY;
const SENDER_NAME = process.env.MSEGAT_SENDER_NAME || 'Zuroona';

// Debug: Log what credentials are loaded
console.log('🔍 [MSEGAT] Configuration loaded:');
console.log(`   - MSEGAT_USERNAME: ${MSEGAT_USERNAME ? '✅ Set (' + MSEGAT_USERNAME.substring(0, 4) + '...)' : '❌ Not set'}`);
console.log(`   - MSEGAT_PASSWORD: ${MSEGAT_PASSWORD ? '✅ Set (' + MSEGAT_PASSWORD.substring(0, 4) + '...)' : '❌ Not set'}`);
console.log(`   - MSEGAT_API_KEY: ${MSEGAT_API_KEY ? '✅ Set (' + MSEGAT_API_KEY.substring(0, 4) + '...)' : '❌ Not set'}`);
console.log(`   - SENDER_NAME: ${SENDER_NAME}`);

/**
 * Send SMS via Msegat
 * @param {string} phoneNumber - Phone number with country code (e.g., +966501234567)
 * @param {string} message - SMS message content
 * @returns {Promise<Object>} - Response from Msegat API
 */
const sendSMS = async (phoneNumber, message) => {
    try {
        // Validate API credentials - Must have USERNAME and (API_KEY or PASSWORD)
        if (!MSEGAT_USERNAME) {
            console.error('❌ [MSEGAT] MSEGAT_USERNAME is not set!');
            throw new Error('MSEGAT_USERNAME is required. Please set it in your .env file.');
        }
        
        if (!MSEGAT_API_KEY && !MSEGAT_PASSWORD) {
            console.error('❌ [MSEGAT] Neither MSEGAT_API_KEY nor MSEGAT_PASSWORD is set!');
            throw new Error('MSEGAT_API_KEY or MSEGAT_PASSWORD is required. Please set one in your .env file.');
        }

        // Format phone number (remove + if present, ensure it starts with country code)
        let formattedNumber = phoneNumber.replace(/\s+/g, '').replace(/^\+/, '');
        
        // Validate phone number format
        if (!formattedNumber || formattedNumber.length < 9) {
            throw new Error(`Invalid phone number format: ${formattedNumber}`);
        }

        console.log(`📱 [MSEGAT] Sending SMS to: ${formattedNumber} (Original: ${phoneNumber})`);
        console.log(`📝 [MSEGAT] Message: ${message.substring(0, 50)}...`);
        console.log(`🔑 [MSEGAT] Username: ${MSEGAT_USERNAME ? MSEGAT_USERNAME.substring(0, 4) + '...' : 'Not set'}`);
        console.log(`🔑 [MSEGAT] API Key: ${MSEGAT_API_KEY ? MSEGAT_API_KEY.substring(0, 8) + '...' : 'Using PASSWORD'}`);
        console.log(`📤 [MSEGAT] Sender Name: ${SENDER_NAME}`);

        // Msegat API request payload
        // MSGATE API format:
        // - userName: Your MSEGAT username
        // - apiKey: Your MSEGAT API key/password
        // - userSender: Sender name
        // - msgEncoding: 'UTF8' for Arabic/English
        // - numbers: Phone number without +
        // - msg: Message text
        
        // Try different authentication combinations
        let response;
        let lastError;
        
        // Method 1: userName + apiKey (most common)
        if (MSEGAT_API_KEY) {
            try {
                console.log(`🔐 [MSEGAT] Attempting authentication with USERNAME + API_KEY`);
                const payload = {
                    userName: MSEGAT_USERNAME,
                    apiKey: MSEGAT_API_KEY,
                    userSender: SENDER_NAME,
                    msgEncoding: 'UTF8',
                    numbers: formattedNumber,
                    msg: message
                };

                console.log(`📦 [MSEGAT] Request Payload:`, {
                    userName: payload.userName,
                    apiKey: payload.apiKey ? payload.apiKey.substring(0, 10) + '****' + payload.apiKey.substring(payload.apiKey.length - 4) : 'Not set',
                    userSender: payload.userSender,
                    msgEncoding: payload.msgEncoding,
                    numbers: payload.numbers,
                    msg: payload.msg.substring(0, 50) + (payload.msg.length > 50 ? '...' : '')
                });
                
                console.log(`🚀 [MSEGAT] Sending request to: ${MSEGAT_API_URL}`);

                response = await axios.post(MSEGAT_API_URL, querystring.stringify(payload), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    timeout: 15000,
                });
                
                // Check if we got M0002 error
                if (response.data && response.data.code === 'M0002' && MSEGAT_PASSWORD) {
                    console.log(`⚠️  [MSEGAT] API_KEY failed with M0002, trying with PASSWORD...`);
                    throw new Error('M0002'); // Trigger fallback
                }
            } catch (error) {
                lastError = error;
                console.log(`⚠️  [MSEGAT] Method 1 (API_KEY) failed:`, error.message);
            }
        }
        
        // Method 2: userName + password (fallback)
        if (!response && MSEGAT_PASSWORD) {
            try {
                console.log(`🔐 [MSEGAT] Attempting authentication with USERNAME + PASSWORD`);
                const payload = {
                    userName: MSEGAT_USERNAME,
                    apiKey: MSEGAT_PASSWORD, // MSEGAT uses 'apiKey' field for both API key and password
                    userSender: SENDER_NAME,
                    msgEncoding: 'UTF8',
                    numbers: formattedNumber,
                    msg: message
                };

                console.log(`📦 [MSEGAT] Request Payload (with PASSWORD):`, {
                    userName: payload.userName,
                    apiKey: '[PASSWORD]',
                    userSender: payload.userSender,
                    msgEncoding: payload.msgEncoding,
                    numbers: payload.numbers,
                    msg: payload.msg.substring(0, 50) + (payload.msg.length > 50 ? '...' : '')
                });
                
                console.log(`🚀 [MSEGAT] Sending request to: ${MSEGAT_API_URL}`);

                response = await axios.post(MSEGAT_API_URL, querystring.stringify(payload), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    timeout: 15000,
                });
            } catch (error) {
                lastError = error;
                console.log(`⚠️  [MSEGAT] Method 2 (PASSWORD) failed:`, error.message);
            }
        }
        
        // If both methods failed, throw the last error
        if (!response) {
            console.error(`❌ [MSEGAT] All authentication methods failed!`);
            throw lastError || new Error('Unable to authenticate with MSEGAT');
        }

        console.log(`📥 [MSEGAT] API Response Status: ${response.status}`);
        console.log(`📥 [MSEGAT] API Response Headers:`, JSON.stringify(response.headers));
        console.log(`📥 [MSEGAT] API Response Data Type: ${typeof response.data}`);
        console.log(`📥 [MSEGAT] API Response Data:`, response.data);

        // Msegat returns different response formats
        // Check for error codes first
        if (response.data) {
            // Check if response has error code
            if (response.data.code && response.data.code !== '1' && response.data.code !== 'M0000') {
                const errorMessage = response.data.message || response.data.error || `Error code: ${response.data.code}`;
                console.error(`❌ [MSEGAT] SMS failed. Code: ${response.data.code}, Message: ${errorMessage}`);
                throw new Error(`Msegat API Error (${response.data.code}): ${errorMessage}`);
            }

            // Check for error in string response
            if (typeof response.data === 'string') {
                const responseStr = response.data.toString().trim();
                const lowerResponse = responseStr.toLowerCase();
                
                // Check for common error codes and messages
                if (lowerResponse.includes('error') || 
                    lowerResponse.includes('invalid') || 
                    lowerResponse.includes('failed') ||
                    lowerResponse.includes('denied') ||
                    lowerResponse.includes('unauthorized') ||
                    lowerResponse.includes('forbidden') ||
                    lowerResponse.includes('m0002') ||
                    lowerResponse.includes('m0001') ||
                    lowerResponse.includes('m0003') ||
                    lowerResponse.includes('m0004')) {
                    console.error(`❌ [MSEGAT] SMS failed. Response: ${responseStr}`);
                    throw new Error(`Msegat API Error: ${responseStr}`);
                }
                
                // Check for success indicators
                if (lowerResponse.includes('success') || 
                    lowerResponse.includes('sent') ||
                    lowerResponse.includes('ok') ||
                    responseStr === '1' ||
                    responseStr === 'M0000') {
                    console.log(`✅ [MSEGAT] SMS sent successfully. Response: ${responseStr}`);
                    return {
                        success: true,
                        message: 'SMS sent successfully',
                        data: responseStr,
                        phoneNumber: formattedNumber
                    };
                }
                
                // Check if it's a numeric success code
                if (/^\d+$/.test(responseStr) && parseInt(responseStr) > 0) {
                    console.log(`✅ [MSEGAT] SMS sent successfully. Response code: ${responseStr}`);
                    return {
                        success: true,
                        message: 'SMS sent successfully',
                        data: responseStr,
                        phoneNumber: formattedNumber
                    };
                }
            }

            // Check for success in object response
            if (typeof response.data === 'object') {
                // Check various success indicators
                if (response.data.code === '1' || 
                    response.data.code === 'M0000' || 
                    response.data.status === 'success' ||
                    response.data.success === true ||
                    response.data.result === 'success') {
                    console.log(`✅ [MSEGAT] SMS sent successfully. Response:`, response.data);
                    return {
                        success: true,
                        message: 'SMS sent successfully',
                        data: response.data,
                        phoneNumber: formattedNumber
                    };
                }
                
                // Check for error in object
                if (response.data.code && response.data.code !== '1' && response.data.code !== 'M0000') {
                    const errorMsg = response.data.message || response.data.error || `Error code: ${response.data.code}`;
                    console.error(`❌ [MSEGAT] SMS failed. Response:`, response.data);
                    throw new Error(`Msegat API Error (${response.data.code}): ${errorMsg}`);
                }
            }
        }

        // If we can't determine success/failure, log warning and throw error
        console.error(`❌ [MSEGAT] Unable to determine SMS status. Response:`, response.data);
        console.error(`❌ [MSEGAT] Response type: ${typeof response.data}`);
        console.error(`❌ [MSEGAT] Full response object:`, JSON.stringify(response.data, null, 2));
        throw new Error(`Msegat API returned unexpected response: ${JSON.stringify(response.data)}`);

    } catch (error) {
        // If error was already thrown by us (has our error prefix), rethrow as-is
        if (error.message && error.message.includes('Msegat API Error:')) {
            console.error('❌ [MSEGAT] API Error (already formatted):', error.message);
            throw error;
        }
        
        console.error('❌ [MSEGAT] Error sending SMS:', error.message);
        console.error('❌ [MSEGAT] Error stack:', error.stack);
        
        if (error.response) {
            console.error('❌ [MSEGAT] HTTP Status:', error.response.status);
            console.error('❌ [MSEGAT] API Error Response:', error.response.data);
            console.error('❌ [MSEGAT] API Error Headers:', error.response.headers);
            
            const errorData = error.response.data || {};
            const errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
            throw new Error(`Msegat API Error (HTTP ${error.response.status}): ${errorMessage}`);
        } else if (error.request) {
            console.error('❌ [MSEGAT] No response received from API');
            console.error('❌ [MSEGAT] Request details:', {
                url: MSEGAT_API_URL,
                method: 'POST',
                timeout: '15000ms'
            });
            throw new Error('Msegat API request failed - no response received. Please check your internet connection and MsgGate service status.');
        } else {
            // If it's already our formatted error, rethrow; otherwise wrap it
            const finalError = error.message.includes('Msegat') ? error : new Error(`Msegat SMS Error: ${error.message}`);
            throw finalError;
        }
    }
};

/**
 * Send OTP via SMS
 * @param {string} phoneNumber - Phone number with country code
 * @param {string} otp - OTP code to send
 * @param {string} lang - Language ('en' or 'ar')
 * @returns {Promise<Object>} - Response from Msegat API
 */
const sendOTP = async (phoneNumber, otp, lang = 'en') => {
    try {
        // Create OTP message based on language
        let message;
        if (lang === 'ar') {
            message = `رمز التحقق الخاص بك هو: ${otp}\n\nZuroona - لا تشارك هذا الرمز مع أي شخص`;
        } else {
            message = `Your verification code is: ${otp}\n\nZuroona - Do not share this code with anyone`;
        }

        return await sendSMS(phoneNumber, message);
    } catch (error) {
        console.error('❌ [MSEGAT] Error sending OTP:', error.message);
        throw error;
    }
};

module.exports = {
    sendSMS,
    sendOTP
};

