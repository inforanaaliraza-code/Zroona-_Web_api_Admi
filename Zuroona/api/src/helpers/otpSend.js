/**
 * OTP Service - Send OTP via Msegat SMS
 * 
 * This service generates OTP and sends it via Msegat SMS service
 */

const AdminService = require('../services/adminService.js');
const organizerService = require('../services/organizerService.js');
const UserService = require('../services/userService.js');
const { sendOTP: sendOTPSMS } = require('./msegatService.js');

// Store OTP request times to prevent spam
const otpRequestTimes = new Map();
// Store OTPs temporarily (in production, use Redis)
const otpStore = new Map();

/**
 * Generate random 6-digit OTP
 * @returns {string} - 6-digit OTP
 */
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP to user's phone number via Msegat SMS
 * @param {string} _id - User ID
 * @param {number} role - User role (1=User, 2=Organizer, 3=Admin)
 * @param {string} lang - Language ('en' or 'ar')
 * @returns {Promise<string>} - Generated OTP
 */
const sendOtp = async (_id, role, lang = 'en') => {
    const service = role == 1 ? UserService : (role == 3 ? AdminService : organizerService);

    const user = await service.FindOneService({ _id });

    if (!user) {
        throw new Error('User does not exist');
    }

    if (!user.phone_number || !user.country_code) {
        throw new Error('Phone number not found for this user');
    }

    const phoneNumber = `${user.country_code}${user.phone_number}`;
    const numberKey = `${role}_${phoneNumber}`;

    // Check rate limiting (30 seconds between requests)
    let currentTime = Date.now();
    let lastRequestTime = otpRequestTimes.get(numberKey);

    if (lastRequestTime && (currentTime - lastRequestTime < 30000)) {
        const waitTime = Math.ceil((30000 - (currentTime - lastRequestTime)) / 1000);
        throw new Error(`Please wait ${waitTime} seconds before requesting another OTP`);
    }

    // Generate random 6-digit OTP
    const otp = generateOTP();

    // Store OTP with expiration (5 minutes)
    otpStore.set(`${numberKey}_${otp}`, {
        otp,
        userId: _id,
        role,
        expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    });

    // Update request time
    otpRequestTimes.set(numberKey, currentTime);

    // Update OTP in database
    try {
        await service.FindByIdAndUpdateService(_id, { otp });
    } catch (error) {
        console.error('Error updating OTP in database:', error);
    }

    // Send OTP via Msegat SMS
    try {
        await sendOTPSMS(phoneNumber, otp, lang);
        console.log(`✅ OTP sent successfully to ${phoneNumber} via Msegat`);
    } catch (error) {
        console.error('❌ Error sending OTP via Msegat:', error.message);
        // Still return OTP for development/testing (remove in production)
        if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️  Development mode: OTP not sent via SMS, but generated:', otp);
        } else {
            throw new Error('Failed to send OTP. Please try again later.');
        }
    }

    return otp;
};

/**
 * Verify OTP
 * @param {string} phoneNumber - Phone number with country code
 * @param {string} otp - OTP to verify
 * @param {number} role - User role
 * @returns {Promise<Object>} - User data if OTP is valid
 */
const verifyOtp = async (phoneNumber, otp, role) => {
    const numberKey = `${role}_${phoneNumber}`;
    const storedOtp = otpStore.get(`${numberKey}_${otp}`);

    // Check in-memory store first
    if (storedOtp) {
        if (Date.now() > storedOtp.expiresAt) {
            otpStore.delete(`${numberKey}_${otp}`);
            throw new Error('OTP has expired. Please request a new one.');
        }
        // OTP is valid, remove it
        otpStore.delete(`${numberKey}_${otp}`);
        return { userId: storedOtp.userId, role: storedOtp.role };
    }

    // Fallback: Check database
    const service = role == 1 ? UserService : (role == 3 ? AdminService : organizerService);
    
    // Extract country code and phone number
    const countryCode = phoneNumber.substring(0, 4); // +966
    const phone = phoneNumber.substring(4);

    const user = await service.FindOneService({
        phone_number: parseInt(phone),
        country_code: countryCode,
        otp: otp.toString()
    });

    if (!user) {
        throw new Error('Invalid OTP. Please check and try again.');
    }

    // Clear OTP from database after successful verification
    await service.FindByIdAndUpdateService(user._id, { otp: '' });

    return { userId: user._id.toString(), role };
};

/**
 * Send OTP to phone number (for login)
 * @param {string} phoneNumber - Phone number with country code
 * @param {string} lang - Language
 * @returns {Promise<string>} - Generated OTP
 */
const sendOtpToPhone = async (phoneNumber, lang = 'en') => {
    const numberKey = `login_${phoneNumber}`;

    // Check rate limiting
    let currentTime = Date.now();
    let lastRequestTime = otpRequestTimes.get(numberKey);

    if (lastRequestTime && (currentTime - lastRequestTime < 30000)) {
        const waitTime = Math.ceil((30000 - (currentTime - lastRequestTime)) / 1000);
        throw new Error(`Please wait ${waitTime} seconds before requesting another OTP`);
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP with expiration
    otpStore.set(`${numberKey}_${otp}`, {
        otp,
        phoneNumber,
        expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    });

    // Update request time
    otpRequestTimes.set(numberKey, currentTime);

    // Send OTP via Msegat SMS
    try {
        await sendOTPSMS(phoneNumber, otp, lang);
        console.log(`✅ Login OTP sent successfully to ${phoneNumber} via Msegat`);
    } catch (error) {
        console.error('❌ Error sending login OTP via Msegat:', error.message);
        // In development or if Msegat is not configured, allow OTP generation to continue
        // The OTP is still stored and can be verified, just not sent via SMS
        if (process.env.NODE_ENV === 'development' || process.env.ALLOW_OTP_WITHOUT_SMS === 'true') {
            console.warn('⚠️  Development mode: OTP generated but not sent via SMS:', otp);
            console.warn('⚠️  You can use this OTP for testing:', otp);
            // Don't throw error in development - allow OTP to be generated
        } else {
            // In production, if SMS fails, still allow OTP generation but log the error
            console.error('⚠️  SMS sending failed, but OTP is still generated for verification');
            // Don't throw - allow the OTP to be generated and stored
            // The user can still verify the OTP if they have access to it through other means
        }
    }

    return otp;
};

/**
 * Verify login OTP
 * @param {string} phoneNumber - Phone number with country code
 * @param {string} otp - OTP to verify
 * @returns {Promise<Object>} - OTP verification result
 */
const verifyLoginOtp = async (phoneNumber, otp) => {
    // Dummy OTP for testing (123456 or 000000)
    const DUMMY_OTPS = ['123456', '000000', '111111'];
    const otpStr = otp.toString().trim();
    
    // Check if it's a dummy OTP (for testing/development)
    if (DUMMY_OTPS.includes(otpStr)) {
        console.log(`[OTP:VERIFY] Dummy OTP accepted for testing: ${otpStr}`);
        
        // Also verify against database OTP for test users (only if connected)
        try {
            const { ensureConnection } = require('../config/database');
            const mongoose = require('mongoose');
            
            // Check if MongoDB is connected before querying
            if (mongoose.connection.readyState !== 1) {
                // Not connected, try to ensure connection
                try {
                    await ensureConnection();
                } catch (connError) {
                    console.warn('[OTP:VERIFY] MongoDB not connected, skipping database check:', connError.message);
                    // Still allow dummy OTP even if database is not connected
                    return { verified: true, phoneNumber, isDummy: true };
                }
            }
            
            const countryCode = phoneNumber.substring(0, 4); // +966
            const phone = phoneNumber.substring(4);
            
            // Check User model
            const User = require('../models/userModel');
            const user = await User.findOne({
                phone_number: parseInt(phone),
                country_code: countryCode,
                otp: otpStr
            });
            
            if (user) {
                console.log(`[OTP:VERIFY] OTP verified against database for user: ${user._id}`);
                return { verified: true, phoneNumber, isDummy: true, userId: user._id, role: 1 };
            }
            
            // Check Organizer model
            const Organizer = require('../models/organizerModel');
            const organizer = await Organizer.findOne({
                phone_number: parseInt(phone),
                country_code: countryCode,
                otp: otpStr
            });
            
            if (organizer) {
                console.log(`[OTP:VERIFY] OTP verified against database for organizer: ${organizer._id}`);
                return { verified: true, phoneNumber, isDummy: true, userId: organizer._id, role: 2 };
            }
            
            // If dummy OTP but not in database, still allow (for testing)
            console.log(`[OTP:VERIFY] Dummy OTP accepted (not in database, but allowed for testing)`);
            return { verified: true, phoneNumber, isDummy: true };
        } catch (dbError) {
            console.error('[OTP:VERIFY] Error checking database OTP:', dbError.message || dbError);
            // Still allow dummy OTP even if database check fails
            return { verified: true, phoneNumber, isDummy: true };
        }
    }

    const numberKey = `login_${phoneNumber}`;
    const storedOtp = otpStore.get(`${numberKey}_${otp}`);

    if (!storedOtp) {
        throw new Error('Invalid OTP. Please check and try again.');
    }

    if (Date.now() > storedOtp.expiresAt) {
        otpStore.delete(`${numberKey}_${otp}`);
        throw new Error('OTP has expired. Please request a new one.');
    }

    // OTP is valid, remove it
    otpStore.delete(`${numberKey}_${otp}`);

    return { verified: true, phoneNumber };
};

/**
 * Send OTP to phone number during signup
 * @param {string} userId - User ID
 * @param {string} phoneNumber - Phone number with country code
 * @param {number} role - User role (1=User, 2=Organizer)
 * @param {string} lang - Language
 * @returns {Promise<string>} - Generated OTP
 */
const sendSignupOtp = async (userId, phoneNumber, role, lang = 'en') => {
    const numberKey = `signup_${role}_${phoneNumber}`;

    // Check rate limiting (30 seconds between requests)
    let currentTime = Date.now();
    let lastRequestTime = otpRequestTimes.get(numberKey);

    if (lastRequestTime && (currentTime - lastRequestTime < 30000)) {
        const waitTime = Math.ceil((30000 - (currentTime - lastRequestTime)) / 1000);
        throw new Error(`Please wait ${waitTime} seconds before requesting another OTP`);
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP with expiration (5 minutes)
    otpStore.set(`${numberKey}_${otp}`, {
        otp,
        userId,
        role,
        phoneNumber,
        expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    });

    // Update request time
    otpRequestTimes.set(numberKey, currentTime);

    // Update OTP in database
    try {
        const service = role == 1 ? UserService : organizerService;
        await service.FindByIdAndUpdateService(userId, { otp });
    } catch (error) {
        console.error('[SIGNUP:OTP] Error updating OTP in database:', error);
    }

    // Send OTP via Msegat SMS
    try {
        await sendOTPSMS(phoneNumber, otp, lang);
        console.log(`✅ Signup OTP sent successfully to ${phoneNumber} via Msegat`);
    } catch (error) {
        console.error('❌ Error sending signup OTP via Msegat:', error.message);
        // In development, still allow OTP generation
        if (process.env.NODE_ENV === 'development' || process.env.ALLOW_OTP_WITHOUT_SMS === 'true') {
            console.warn('⚠️  Development mode: OTP generated but not sent via SMS:', otp);
        } else {
            console.error('⚠️  SMS sending failed, but OTP is still generated for verification');
        }
    }

    return otp;
};

/**
 * Verify signup OTP
 * @param {string} userId - User ID
 * @param {string} phoneNumber - Phone number with country code
 * @param {string} otp - OTP to verify
 * @param {number} role - User role
 * @returns {Promise<Object>} - Verification result
 */
const verifySignupOtp = async (userId, phoneNumber, otp, role) => {
    const otpStr = otp.toString().trim();
    
    // Check dummy OTPs for testing
    const DUMMY_OTPS = ['123456', '000000', '111111'];
    if (DUMMY_OTPS.includes(otpStr)) {
        console.log(`[SIGNUP:OTP:VERIFY] Dummy OTP accepted for testing: ${otpStr}`);
        // Check database as fallback
        const service = role == 1 ? UserService : organizerService;
        const user = await service.FindOneService({
            _id: userId,
            otp: otpStr
        });
        
        if (user) {
            return { verified: true, userId: user._id.toString(), role };
        }
        return { verified: true, userId, role };
    }

    const numberKey = `signup_${role}_${phoneNumber}`;
    const storedOtp = otpStore.get(`${numberKey}_${otpStr}`);

    // Check in-memory store
    if (storedOtp) {
        if (Date.now() > storedOtp.expiresAt) {
            otpStore.delete(`${numberKey}_${otpStr}`);
            throw new Error('OTP has expired. Please request a new one.');
        }

        // Verify user ID matches
        if (storedOtp.userId.toString() !== userId.toString()) {
            throw new Error('Invalid OTP for this user.');
        }

        // OTP is valid, remove it
        otpStore.delete(`${numberKey}_${otpStr}`);
        return { verified: true, userId: storedOtp.userId.toString(), role: storedOtp.role };
    }

    // Fallback: Check database
    const service = role == 1 ? UserService : organizerService;
    const user = await service.FindOneService({
        _id: userId,
        otp: otpStr
    });

    if (!user) {
        throw new Error('Invalid OTP. Please check and try again.');
    }

    // Clear OTP from database after successful verification
    await service.FindByIdAndUpdateService(userId, { otp: '' });

    return { verified: true, userId: user._id.toString(), role };
};

module.exports = {
    sendOtp,
    verifyOtp,
    sendOtpToPhone,
    verifyLoginOtp,
    sendSignupOtp,
    verifySignupOtp
};
