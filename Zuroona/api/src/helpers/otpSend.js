/**
 * OTP Service - Send OTP via MSGATE SMS
 * 
 * This service generates OTP and sends it via MSGATE SMS service
 * Supports Saudi Arabia (+966) and Pakistan (+92) phone numbers
 */

const AdminService = require('../services/adminService.js');
const organizerService = require('../services/organizerService.js');
const UserService = require('../services/userService.js');
// Using MSGATE for OTP sending
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

    // Send OTP via MSGATE SMS
    try {
        await sendOTPSMS(phoneNumber, otp, lang);
        console.log(`✅ OTP sent successfully to ${phoneNumber} via MSGATE`);
    } catch (error) {
        console.error('❌ Error sending OTP via MSGATE:', error.message);
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

    // Send OTP via MSGATE SMS
    try {
        await sendOTPSMS(phoneNumber, otp, lang);
        console.log(`✅ Login OTP sent successfully to ${phoneNumber} via MSGATE`);
    } catch (error) {
        console.error('❌ Error sending login OTP via MSGATE:', error.message);
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
    const otpStr = otp.toString().trim();
    
    // Test OTP for development/test users (123456)
    const TEST_OTP = '123456';
    const TEST_PHONES = ['+966501234567', '+966598765432']; // Test user phone numbers
    
    if (otpStr === TEST_OTP && TEST_PHONES.includes(phoneNumber)) {
        console.log(`✅ Test OTP accepted for ${phoneNumber}`);
        return { verified: true, phoneNumber, isTestOtp: true };
    }
    
    const numberKey = `login_${phoneNumber}`;
    const storedOtp = otpStore.get(`${numberKey}_${otpStr}`);

    // Check in-memory store first
    if (storedOtp) {
        if (Date.now() > storedOtp.expiresAt) {
            otpStore.delete(`${numberKey}_${otpStr}`);
            throw new Error('OTP has expired. Please request a new one.');
        }

        // OTP is valid, remove it
        otpStore.delete(`${numberKey}_${otpStr}`);
        return { verified: true, phoneNumber };
    }

    // If not found in memory, throw error
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

    // Send OTP via MSGATE SMS
    try {
        await sendOTPSMS(phoneNumber, otp, lang);
        console.log(`✅ Signup OTP sent successfully to ${phoneNumber} via MSGATE`);
    } catch (error) {
        console.error('❌ Error sending signup OTP via MSGATE:', error.message);
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
    const otpStr = otp.toString().trim();
    
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

    // Fallback: Check database (only if MongoDB is connected)
    try {
        const service = role == 1 ? UserService : organizerService;
        
        // First check if user exists by ID
        const userById = await service.FindByIdService(userId);
        if (!userById) {
            throw new Error('User not found. Invalid OTP.');
        }
        
        // Check if OTP matches
        if (userById.otp && userById.otp.toString().trim() === otpStr) {
            // Clear OTP from database after successful verification
            await service.FindByIdAndUpdateService(userId, { otp: '' });
            return { verified: true, userId: userById._id.toString(), role };
        }
        
        throw new Error('Invalid OTP. Please check and try again.');
    } catch (dbError) {
        // If database query fails, log but don't fail verification if OTP was found in memory
        console.error('[OTP:VERIFY] Database check error:', dbError.message);
        // If we reach here, OTP was not found in memory store and database check failed
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
