/**
 * Validation Helpers for Authentication Flow
 * Comprehensive validations for email, phone, and OTP
 */

/**
 * Validate email format - Gmail only
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

    const emailLower = email.toLowerCase().trim();

    // Basic email format validation (RFC 5322 compliant)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(emailLower)) {
        return {
            isValid: false,
            message: "Invalid email format"
        };
    }

    // Check length (maximum 255 characters as per RFC 5321)
    if (emailLower.length > 255) {
        return {
            isValid: false,
            message: "Email address is too long (maximum 255 characters)"
        };
    }

    // CRITICAL: Only accept Gmail addresses
    const emailDomain = emailLower.split('@')[1];
    if (emailDomain !== 'gmail.com') {
        return {
            isValid: false,
            message: "Only Gmail addresses are allowed. Please use an email ending with @gmail.com"
        };
    }

    // Validate Gmail format (local part should be valid)
    const localPart = emailLower.split('@')[0];
    if (!localPart || localPart.length === 0) {
        return {
            isValid: false,
            message: "Invalid Gmail address format"
        };
    }

    // Gmail local part validation (alphanumeric, dots, plus signs allowed)
    if (!/^[a-z0-9.+]+$/.test(localPart)) {
        return {
            isValid: false,
            message: "Invalid Gmail address format. Gmail addresses can contain letters, numbers, dots, and plus signs"
        };
    }

    return {
        isValid: true,
        message: "Valid Gmail address"
    };
};

/**
 * Validate phone number for Saudi Arabia (+966) or Pakistan (+92)
 * @param {string|number} phone_number - Phone number to validate
 * @param {string} country_code - Country code (+966 for Saudi, +92 for Pakistan)
 * @returns {Object} - { isValid: boolean, message: string, cleanPhone: string }
 */
const validatePhone = (phone_number, country_code) => {
    // Only allow Saudi Arabia (+966) or Pakistan (+92)
    if (!country_code || (country_code !== "+966" && country_code !== "+92")) {
        return {
            isValid: false,
            message: "Only Saudi Arabia (+966) and Pakistan (+92) phone numbers are allowed",
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
    let phoneStr = phone_number.toString().replace(/\s+/g, '');
    
    // Debug logging
    console.log(`[VALIDATE_PHONE] Input - phone_number: "${phone_number}", country_code: "${country_code}", cleaned: "${phoneStr}"`);

    // Saudi Arabia validation (+966)
    if (country_code === "+966") {
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
    }

    // Pakistan validation (+92)
    if (country_code === "+92") {
        // Pakistan mobile numbers formats:
        // - 10 digits with leading 0: 0305471777 (0 + 9 digits starting with 3)
        // - 9 digits without leading 0: 305471777 (9 digits starting with 3)
        // - Sometimes might come with country code: 923054717777
        let cleanNumber = phoneStr;
        
        // Remove country code if accidentally included (923054717777 -> 3054717777)
        if (cleanNumber.startsWith('92') && cleanNumber.length >= 11) {
            cleanNumber = cleanNumber.substring(2);
        }
        
        // IMPORTANT: Keep leading 0 for 10-digit numbers! Don't remove it.
        // We need to preserve the original format: 0305471777 should stay as 0305471777
        // The controller will format it correctly for MSGATE
        
        // After validation, must be 9 or 10 digits
        if (!/^\d{9,10}$/.test(cleanNumber)) {
            console.log(`[VALIDATE_PHONE] Pakistan validation failed - Original: "${phoneStr}", Cleaned: "${cleanNumber}", Length: ${cleanNumber.length}`);
            return {
                isValid: false,
                message: `Invalid Pakistan phone number format. Received: "${phoneStr}" (${phoneStr.length} digits). Expected: 10 digits with 0 (e.g., 03001234567) or 9 digits (e.g., 3001234567)`,
                cleanPhone: null
            };
        }
        
        // Ensure it starts with 3 (for mobile numbers)
        // If 10 digits, it should start with 0, then we check second digit (should be 3)
        let numberToCheck = cleanNumber;
        if (cleanNumber.length === 10 && cleanNumber.startsWith('0')) {
            numberToCheck = cleanNumber.substring(1); // Check after removing 0
        }
        
        console.log(`[VALIDATE_PHONE] Pakistan validation - Original: "${phoneStr}", Cleaned: "${cleanNumber}", Checking: "${numberToCheck}"`);

        // Pakistan mobile numbers must start with 3 (mobile operators: 30XX, 31XX, 32XX, 33XX, 34XX, 35XX, 36XX)
        if (!numberToCheck.startsWith('3')) {
            return {
                isValid: false,
                message: "Pakistan mobile numbers must start with 3 (e.g., 3001234567, 3101234567)",
                cleanPhone: null
            };
        }

        // Additional validation: Second digit should be 0-6 for valid mobile operators
        // Check the actual mobile number part (after removing leading 0 if present)
        const secondDigit = parseInt(numberToCheck[1]);
        if (secondDigit > 6) {
            return {
                isValid: false,
                message: "Invalid Pakistan mobile operator. Number should start with 30-36 (e.g., 3001234567)",
                cleanPhone: null
            };
        }

        console.log(`[VALIDATE_PHONE] Pakistan validation passed - Final: "${cleanNumber}" (length: ${cleanNumber.length}) - PRESERVING LEADING 0`);
        return {
            isValid: true,
            message: "Valid phone number",
            cleanPhone: cleanNumber // Return as-is (9 or 10 digits, preserving leading 0)
        };
    }

    return {
        isValid: true,
        message: "Valid phone number",
        cleanPhone: phoneStr
    };
};

// Keep old function name for backward compatibility
const validateSaudiPhone = (phone_number, country_code) => {
    return validatePhone(phone_number, country_code);
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
    validatePhone,
    validateSaudiPhone, // Backward compatibility
    validateOTP,
    checkExistingAccount
};

