/**
 * Msegat SMS Service
 * 
 * This service handles sending SMS via Msegat API
 * 
 * Required Environment Variables:
 * - MSEGAT_API_KEY: Your Msegat API Key
 * - MSEGAT_SENDER_NAME: Your Msegat Sender Name (optional, default: "Zuroona")
 * 
 * Msegat API Documentation: https://www.msegat.com/en/api/
 */

const axios = require('axios');

// Msegat API Configuration
const MSEGAT_API_URL = 'https://www.msegat.com/gw/sendsms.php';
const API_KEY = process.env.MSEGAT_API_KEY || '3808F5D4D89B1B23E61632C0B475A342';
const SENDER_NAME = process.env.MSEGAT_SENDER_NAME || 'Zuroona';

/**
 * Send SMS via Msegat
 * @param {string} phoneNumber - Phone number with country code (e.g., +966501234567)
 * @param {string} message - SMS message content
 * @returns {Promise<Object>} - Response from Msegat API
 */
const sendSMS = async (phoneNumber, message) => {
    try {
        // Validate API key
        if (!API_KEY) {
            throw new Error('Msegat API Key is not configured. Please set MSEGAT_API_KEY in environment variables.');
        }

        // Format phone number (remove + if present, ensure it starts with country code)
        let formattedNumber = phoneNumber.replace(/\s+/g, '').replace(/^\+/, '');
        
        // Validate phone number format
        if (!formattedNumber || formattedNumber.length < 9) {
            throw new Error('Invalid phone number format');
        }

        console.log(`📱 [MSEGAT] Sending SMS to: ${formattedNumber}`);
        console.log(`📝 [MSEGAT] Message: ${message.substring(0, 50)}...`);

        // Msegat API request payload
        const payload = {
            userName: API_KEY, // Msegat uses API key as userName
            apiKey: API_KEY,
            numbers: formattedNumber,
            msg: message,
            msgEncoding: 'UTF8',
            sender: SENDER_NAME
        };

        // Send SMS via Msegat API
        const response = await axios.post(MSEGAT_API_URL, payload, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            timeout: 10000, // 10 seconds timeout
        });

        console.log(`📥 [MSEGAT] API Response:`, response.data);

        // Msegat returns different response formats
        // Check for error codes first
        if (response.data) {
            // Check if response has error code
            if (response.data.code && response.data.code !== '1' && response.data.code !== 'M0000') {
                const errorMessage = response.data.message || `Error code: ${response.data.code}`;
                console.error(`❌ [MSEGAT] SMS failed. Code: ${response.data.code}, Message: ${errorMessage}`);
                throw new Error(`Msegat API Error: ${errorMessage}`);
            }

            // Check for error in string response
            if (typeof response.data === 'string') {
                const lowerResponse = response.data.toLowerCase();
                // Check for error indicators
                if (lowerResponse.includes('error') || 
                    lowerResponse.includes('invalid') || 
                    lowerResponse.includes('failed') ||
                    lowerResponse.includes('m0002') ||
                    lowerResponse.includes('m0001')) {
                    console.error(`❌ [MSEGAT] SMS failed. Response: ${response.data}`);
                    throw new Error(`Msegat API Error: ${response.data}`);
                }
                
                // Check for success indicators
                if (lowerResponse.includes('success') || 
                    lowerResponse.includes('sent') ||
                    response.data === '1') {
                    console.log(`✅ [MSEGAT] SMS sent successfully. Response:`, response.data);
                    return {
                        success: true,
                        message: 'SMS sent successfully',
                        data: response.data
                    };
                }
            }

            // Check for success in object response
            if (typeof response.data === 'object') {
                if (response.data.code === '1' || response.data.code === 'M0000' || response.data.status === 'success') {
                    console.log(`✅ [MSEGAT] SMS sent successfully. Response:`, response.data);
                    return {
                        success: true,
                        message: 'SMS sent successfully',
                        data: response.data
                    };
                }
            }
        }

        // If we can't determine success/failure, log warning and throw error
        console.error(`❌ [MSEGAT] Unable to determine SMS status. Response:`, response.data);
        throw new Error(`Msegat API returned unexpected response: ${JSON.stringify(response.data)}`);

    } catch (error) {
        // If error was already thrown by us (has our error prefix), rethrow as-is
        if (error.message && error.message.includes('Msegat API Error:')) {
            throw error;
        }
        
        console.error('❌ [MSEGAT] Error sending SMS:', error.message);
        
        if (error.response) {
            console.error('❌ [MSEGAT] API Error Response:', error.response.data);
            throw new Error(`Msegat API Error: ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
            console.error('❌ [MSEGAT] No response received from API');
            throw new Error('Msegat API request failed - no response received');
        } else {
            // If it's already our formatted error, rethrow; otherwise wrap it
            throw error.message.includes('Msegat') ? error : new Error(`Msegat SMS Error: ${error.message}`);
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

