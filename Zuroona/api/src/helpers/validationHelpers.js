/**
 * Validation Helpers for Authentication Flow
 * Comprehensive validations for email, phone, and OTP
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {Object} - { isValid: boolean, message: string }
 */
const validateEmail = (email) => {
    if (!email || typeof email !== 'string') {
        return {
            isValid: false,
            message: "Email is required"
        };
    }

    // Basic email format validation (RFC 5322 compliant)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        return {
            isValid: false,
            message: "Invalid email format"
        };
    }

    // Check length (maximum 255 characters as per RFC 5321)
    if (email.length > 255) {
        return {
            isValid: false,
            message: "Email address is too long (maximum 255 characters)"
        };
    }

    // Check for common disposable email domains (optional security measure)
    const disposableDomains = [
        'tempmail.com', 'guerrillamail.com', '10minutemail.com',
        'mailinator.com', 'throwaway.email'
    ];
    
    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (disposableDomains.includes(emailDomain)) {
        return {
            isValid: false,
            message: "Disposable email addresses are not allowed"
        };
    }

    return {
        isValid: true,
        message: "Valid email"
    };
};

/**
 * Validate Saudi Arabia phone number
 * @param {string|number} phone_number - Phone number to validate
 * @param {string} country_code - Country code (must be +966)
 * @returns {Object} - { isValid: boolean, message: string, cleanPhone: string }
 */
const validateSaudiPhone = (phone_number, country_code) => {
    // Country code must be +966
    if (!country_code || country_code !== "+966") {
        return {
            isValid: false,
            message: "Only Saudi Arabia phone numbers (+966) are allowed",
            cleanPhone: null
        };
    }

    if (!phone_number) {
        return {
            isValid: false,
            message: "Phone number is required",
            cleanPhone: null
        };
    }

    // Convert to string and remove all spaces
    const phoneStr = phone_number.toString().replace(/\s+/g, '');

    // Must be exactly 9 digits (Saudi phone format)
    if (!/^\d{9}$/.test(phoneStr)) {
        return {
            isValid: false,
            message: "Invalid Saudi Arabia phone number format. Please enter 9 digits (e.g., 501234567)",
            cleanPhone: null
        };
    }

    // Validate Saudi phone number patterns (starts with 5)
    if (!phoneStr.startsWith('5')) {
        return {
            isValid: false,
            message: "Saudi phone numbers must start with 5 (e.g., 501234567)",
            cleanPhone: null
        };
    }

    return {
        isValid: true,
        message: "Valid phone number",
        cleanPhone: phoneStr
    };
};

/**
 * Validate OTP format
 * @param {string|number} otp - OTP to validate
 * @returns {Object} - { isValid: boolean, message: string, cleanOtp: string }
 */
const validateOTP = (otp) => {
    if (!otp) {
        return {
            isValid: false,
            message: "OTP is required",
            cleanOtp: null
        };
    }

    // Convert to string and trim
    const otpStr = otp.toString().trim();

    // Must be exactly 6 digits
    if (!/^\d{6}$/.test(otpStr)) {
        return {
            isValid: false,
            message: "OTP must be exactly 6 digits",
            cleanOtp: null
        };
    }

    return {
        isValid: true,
        message: "Valid OTP format",
        cleanOtp: otpStr
    };
};

/**
 * Check if email/phone already exists
 * @param {Object} service - UserService or OrganizerService
 * @param {string} email - Email to check
 * @param {string} phone_number - Phone number to check
 * @param {string} country_code - Country code
 * @param {string} excludeUserId - User ID to exclude from check (for updates)
 * @returns {Promise<Object>} - { emailExists: boolean, phoneExists: boolean, existingAccount: Object|null }
 */
const checkExistingAccount = async (service, email, phone_number, country_code, excludeUserId = null) => {
    const conditions = {};
    if (excludeUserId) {
        conditions._id = { $ne: excludeUserId };
    }

    let emailExists = false;
    let phoneExists = false;
    let existingAccount = null;

    if (email) {
        const emailAccount = await service.FindOneService({
            ...conditions,
            email: email.toLowerCase().trim()
        });
        
        if (emailAccount) {
            emailExists = true;
            existingAccount = emailAccount;
        }
    }

    if (phone_number && country_code && !existingAccount) {
        const phoneAccount = await service.FindOneService({
            ...conditions,
            phone_number: parseInt(phone_number),
            country_code: country_code
        });
        
        if (phoneAccount) {
            phoneExists = true;
            if (!existingAccount) {
                existingAccount = phoneAccount;
            }
        }
    }

    return {
        emailExists,
        phoneExists,
        existingAccount
    };
};

module.exports = {
    validateEmail,
    validateSaudiPhone,
    validateOTP,
    checkExistingAccount
};

