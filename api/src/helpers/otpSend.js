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
        if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️  Development mode: OTP not sent via SMS, but generated:', otp);
        } else {
            throw new Error('Failed to send OTP. Please try again later.');
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
        return { verified: true, phoneNumber, isDummy: true };
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

module.exports = {
    sendOtp,
    verifyOtp,
    sendOtpToPhone,
    verifyLoginOtp
};
