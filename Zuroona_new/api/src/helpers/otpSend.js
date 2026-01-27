/**
 * OTP Service - Send OTP via MSEGAT SMS
 * 
 * Features:
 * - OTP expires in 30 seconds
 * - Resend cooldown: 30 seconds
 * - Wrong attempts tracking: 5 attempts = 1 hour block
 * - Real phone number OTP via MSEGAT
 */

const AdminService = require('../services/adminService.js');
const organizerService = require('../services/organizerService.js');
const UserService = require('../services/userService.js');
const { sendOTP: sendOTPSMS } = require('./msegatService.js');

// Store OTP request times to prevent spam (30 seconds cooldown)
const otpRequestTimes = new Map();

// Store OTPs temporarily (in production, use Redis)
const otpStore = new Map();

// Store wrong OTP attempts (phone number -> { attempts: number, blockedUntil: timestamp })
const wrongAttemptsStore = new Map();

// Constants
const OTP_EXPIRY_TIME = 30 * 1000; // 30 seconds
const RESEND_COOLDOWN = 30 * 1000; // 30 seconds
const MAX_WRONG_ATTEMPTS = 5;
const BLOCK_DURATION = 60 * 60 * 1000; // 1 hour

/**
 * Generate random 6-digit OTP
 * @returns {string} - 6-digit OTP
 */
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Check if phone number is blocked due to wrong attempts
 * @param {string} phoneNumber - Phone number with country code
 * @returns {Object|null} - Block info or null
 */
const checkBlockStatus = (phoneNumber) => {
    const blockInfo = wrongAttemptsStore.get(phoneNumber);
    if (!blockInfo) return null;

    // Check if still blocked
    if (blockInfo.blockedUntil && Date.now() < blockInfo.blockedUntil) {
        const remainingMinutes = Math.ceil((blockInfo.blockedUntil - Date.now()) / (60 * 1000));
        return {
            isBlocked: true,
            blockedUntil: blockInfo.blockedUntil,
            remainingMinutes
        };
    }

    // Block expired, reset attempts
    if (blockInfo.blockedUntil && Date.now() >= blockInfo.blockedUntil) {
        wrongAttemptsStore.delete(phoneNumber);
        return null;
    }

    return null;
};

/**
 * Record wrong OTP attempt
 * @param {string} phoneNumber - Phone number
 */
const recordWrongAttempt = (phoneNumber) => {
    const blockInfo = wrongAttemptsStore.get(phoneNumber) || { attempts: 0 };
    blockInfo.attempts += 1;

    // If reached max attempts, block for 1 hour
    if (blockInfo.attempts >= MAX_WRONG_ATTEMPTS) {
        blockInfo.blockedUntil = Date.now() + BLOCK_DURATION;
        blockInfo.attempts = 0; // Reset for next block cycle
        console.log(`🚫 [OTP] Phone ${phoneNumber} blocked for 1 hour due to ${MAX_WRONG_ATTEMPTS} wrong attempts`);
    }

    wrongAttemptsStore.set(phoneNumber, blockInfo);
};

/**
 * Clear wrong attempts on successful verification
 * @param {string} phoneNumber - Phone number
 */
const clearWrongAttempts = (phoneNumber) => {
    wrongAttemptsStore.delete(phoneNumber);
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

    // Check if blocked due to wrong attempts
    const blockStatus = checkBlockStatus(phoneNumber);
    if (blockStatus && blockStatus.isBlocked) {
        throw new Error(`Too many wrong attempts. Please try again after ${blockStatus.remainingMinutes} minutes.`);
    }

    // Check rate limiting (30 seconds between requests)
    let currentTime = Date.now();
    let lastRequestTime = otpRequestTimes.get(numberKey);

    if (lastRequestTime && (currentTime - lastRequestTime < RESEND_COOLDOWN)) {
        const waitTime = Math.ceil((RESEND_COOLDOWN - (currentTime - lastRequestTime)) / 1000);
        throw new Error(`Please wait ${waitTime} seconds before requesting another OTP`);
    }

    // Generate random 6-digit OTP
    const otp = generateOTP();

    // Store OTP with expiration (30 seconds)
    otpStore.set(`${numberKey}_${otp}`, {
        otp,
        userId: _id,
        role,
        expiresAt: Date.now() + OTP_EXPIRY_TIME // 30 seconds
    });

    // Update request time
    otpRequestTimes.set(numberKey, currentTime);

    // Update OTP in database
    try {
        await service.FindByIdAndUpdateService(_id, { otp });
    } catch (error) {
        console.error('Error updating OTP in database:', error);
    }

    // Send OTP via MSEGAT SMS
    try {
        await sendOTPSMS(phoneNumber, otp, lang);
        console.log(`✅ OTP sent successfully to ${phoneNumber} via MSEGAT`);
    } catch (error) {
        console.error('❌ Error sending OTP via MSEGAT:', error.message);
        throw new Error(`Failed to send OTP via SMS: ${error.message}. Please try again later.`);
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
    // Check if blocked
    const blockStatus = checkBlockStatus(phoneNumber);
    if (blockStatus && blockStatus.isBlocked) {
        throw new Error(`Too many wrong attempts. Please try again after ${blockStatus.remainingMinutes} minutes.`);
    }

    const numberKey = `${role}_${phoneNumber}`;
    const otpStr = otp.toString().trim();
    const storedOtp = otpStore.get(`${numberKey}_${otpStr}`);

    // Check in-memory store first
    if (storedOtp) {
        if (Date.now() > storedOtp.expiresAt) {
            otpStore.delete(`${numberKey}_${otpStr}`);
            recordWrongAttempt(phoneNumber);
            throw new Error('OTP has expired. Please request a new one.');
        }
        // OTP is valid, remove it and clear wrong attempts
        otpStore.delete(`${numberKey}_${otpStr}`);
        clearWrongAttempts(phoneNumber);
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
        otp: otpStr
    });

    if (!user) {
        recordWrongAttempt(phoneNumber);
        throw new Error('Invalid OTP. Please check and try again.');
    }

    // Clear OTP from database after successful verification
    await service.FindByIdAndUpdateService(user._id, { otp: '' });
    clearWrongAttempts(phoneNumber);

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

    // Check if blocked
    const blockStatus = checkBlockStatus(phoneNumber);
    if (blockStatus && blockStatus.isBlocked) {
        throw new Error(`Too many wrong attempts. Please try again after ${blockStatus.remainingMinutes} minutes.`);
    }

    // Check rate limiting
    let currentTime = Date.now();
    let lastRequestTime = otpRequestTimes.get(numberKey);

    if (lastRequestTime && (currentTime - lastRequestTime < RESEND_COOLDOWN)) {
        const waitTime = Math.ceil((RESEND_COOLDOWN - (currentTime - lastRequestTime)) / 1000);
        throw new Error(`Please wait ${waitTime} seconds before requesting another OTP`);
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP with expiration (30 seconds)
    otpStore.set(`${numberKey}_${otp}`, {
        otp,
        phoneNumber,
        expiresAt: Date.now() + OTP_EXPIRY_TIME // 30 seconds
    });

    // Update request time
    otpRequestTimes.set(numberKey, currentTime);

    // Send OTP via MSEGAT SMS
    try {
        await sendOTPSMS(phoneNumber, otp, lang);
        console.log(`✅ Login OTP sent successfully to ${phoneNumber} via MSEGAT`);
    } catch (error) {
        console.error('❌ Error sending login OTP via MSEGAT:', error.message);
        throw new Error(`Failed to send OTP via SMS: ${error.message}. Please try again later.`);
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
    // Check if blocked
    const blockStatus = checkBlockStatus(phoneNumber);
    if (blockStatus && blockStatus.isBlocked) {
        throw new Error(`Too many wrong attempts. Please try again after ${blockStatus.remainingMinutes} minutes.`);
    }

    const otpStr = otp.toString().trim();
    const numberKey = `login_${phoneNumber}`;
    const storedOtp = otpStore.get(`${numberKey}_${otpStr}`);

    // Check in-memory store first
    if (storedOtp) {
        if (Date.now() > storedOtp.expiresAt) {
            otpStore.delete(`${numberKey}_${otpStr}`);
            recordWrongAttempt(phoneNumber);
            throw new Error('OTP has expired. Please request a new one.');
        }

        // OTP is valid, remove it and clear wrong attempts
        otpStore.delete(`${numberKey}_${otpStr}`);
        clearWrongAttempts(phoneNumber);
        return { verified: true, phoneNumber };
    }

    // If not found, record wrong attempt
    recordWrongAttempt(phoneNumber);
    throw new Error('Invalid OTP. Please check and try again.');
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

    // Check if blocked
    const blockStatus = checkBlockStatus(phoneNumber);
    if (blockStatus && blockStatus.isBlocked) {
        throw new Error(`Too many wrong attempts. Please try again after ${blockStatus.remainingMinutes} minutes.`);
    }

    // Check rate limiting (30 seconds between requests)
    let currentTime = Date.now();
    let lastRequestTime = otpRequestTimes.get(numberKey);

    if (lastRequestTime && (currentTime - lastRequestTime < RESEND_COOLDOWN)) {
        const waitTime = Math.ceil((RESEND_COOLDOWN - (currentTime - lastRequestTime)) / 1000);
        throw new Error(`Please wait ${waitTime} seconds before requesting another OTP`);
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP with expiration (30 seconds)
    otpStore.set(`${numberKey}_${otp}`, {
        otp,
        userId,
        role,
        phoneNumber,
        expiresAt: Date.now() + OTP_EXPIRY_TIME // 30 seconds
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

    // Send OTP via MSEGAT SMS
    try {
        await sendOTPSMS(phoneNumber, otp, lang);
        console.log(`✅ Signup OTP sent successfully to ${phoneNumber} via MSEGAT`);
    } catch (error) {
        console.error('❌ Error sending signup OTP via MSEGAT:', error.message);
        console.error('❌ Error details:', {
            phoneNumber,
            userId,
            role,
            lang,
            error: error.message,
            stack: error.stack
        });
        
        // Always throw error - no dummy OTPs, real OTP required
        console.error('⚠️  SMS sending failed. User must receive real OTP.');
        throw new Error(`Failed to send OTP via SMS: ${error.message}. Please check your phone number and try again.`);
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
    // Check if blocked
    const blockStatus = checkBlockStatus(phoneNumber);
    if (blockStatus && blockStatus.isBlocked) {
        throw new Error(`Too many wrong attempts. Please try again after ${blockStatus.remainingMinutes} minutes.`);
    }

    const otpStr = otp.toString().trim();
    const numberKey = `signup_${role}_${phoneNumber}`;
    const storedOtp = otpStore.get(`${numberKey}_${otpStr}`);

    // Check in-memory store
    if (storedOtp) {
        if (Date.now() > storedOtp.expiresAt) {
            otpStore.delete(`${numberKey}_${otpStr}`);
            recordWrongAttempt(phoneNumber);
            throw new Error('OTP has expired. Please request a new one.');
        }

        // Verify user ID matches
        if (storedOtp.userId.toString() !== userId.toString()) {
            recordWrongAttempt(phoneNumber);
            throw new Error('Invalid OTP for this user.');
        }

        // OTP is valid, remove it and clear wrong attempts
        otpStore.delete(`${numberKey}_${otpStr}`);
        clearWrongAttempts(phoneNumber);
        return { verified: true, userId: storedOtp.userId.toString(), role: storedOtp.role };
    }

    // Fallback: Check database (only if MongoDB is connected)
    try {
        const service = role == 1 ? UserService : organizerService;
        
        // First check if user exists by ID
        const userById = await service.FindByIdService(userId);
        if (!userById) {
            recordWrongAttempt(phoneNumber);
            throw new Error('User not found. Invalid OTP.');
        }
        
        // Check if OTP matches
        if (userById.otp && userById.otp.toString().trim() === otpStr) {
            // Clear OTP from database after successful verification
            await service.FindByIdAndUpdateService(userId, { otp: '' });
            clearWrongAttempts(phoneNumber);
            return { verified: true, userId: userById._id.toString(), role };
        }
        
        recordWrongAttempt(phoneNumber);
        throw new Error('Invalid OTP. Please check and try again.');
    } catch (dbError) {
        // If database query fails, log but don't fail verification if OTP was found in memory
        console.error('[OTP:VERIFY] Database check error:', dbError.message);
        // If we reach here, OTP was not found in memory store and database check failed
        recordWrongAttempt(phoneNumber);
        throw new Error('Invalid or expired OTP. Please request a new one.');
    }
};

module.exports = {
    sendOtp,
    verifyOtp,
    sendOtpToPhone,
    verifyLoginOtp,
    sendSignupOtp,
    verifySignupOtp
};
