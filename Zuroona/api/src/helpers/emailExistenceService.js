/**
 * Email Existence Verification Service
 * Checks if a Gmail account exists by attempting SMTP verification
 * 
 * Note: This is not 100% reliable as Gmail may block verification attempts
 * for security reasons. The best approach is to send verification email
 * and handle bounces.
 */

const dns = require('dns').promises;
const _net = require('net');

/**
 * Verify if Gmail account exists using SMTP verification
 * @param {string} email - Gmail address to verify
 * @returns {Promise<Object>} - { exists: boolean, message: string }
 */
const verifyGmailExistence = async (email) => {
    try {
        const emailLower = email.toLowerCase().trim();
        
        // Validate it's a Gmail address
        if (!emailLower.endsWith('@gmail.com')) {
            return {
                exists: false,
                message: "Only Gmail addresses are allowed"
            };
        }

        // Extract local part
        const localPart = emailLower.split('@')[0];
        if (!localPart || localPart.length === 0) {
            return {
                exists: false,
                message: "Invalid Gmail address format"
            };
        }

        // For Gmail, we can't directly verify existence via SMTP
        // Gmail blocks VRFY and RCPT TO commands for security
        // The best approach is to:
        // 1. Validate format (already done)
        // 2. Send verification email
        // 3. If email bounces, account doesn't exist

        // However, we can check MX records to ensure Gmail domain is valid
        try {
            const mxRecords = await dns.resolveMx('gmail.com');
            if (!mxRecords || mxRecords.length === 0) {
                return {
                    exists: false,
                    message: "Gmail domain verification failed"
                };
            }
        } catch (dnsError) {
            console.error('[EMAIL_EXISTENCE] DNS lookup failed:', dnsError.message);
            // Continue anyway - DNS might be temporarily unavailable
        }

        // Since we can't reliably verify Gmail existence via SMTP,
        // we'll return true if format is valid
        // The actual verification will happen when we send the email
        // If email bounces, we'll know the account doesn't exist
        
        return {
            exists: true, // Assume exists if format is valid
            message: "Gmail address format is valid. Verification email will be sent.",
            canSendVerification: true
        };

    } catch (error) {
        console.error('[EMAIL_EXISTENCE] Error verifying email:', error.message);
        return {
            exists: false,
            message: "Error verifying email address. Please try again.",
            error: error.message
        };
    }
};

/**
 * Check if email format is valid Gmail
 * @param {string} email - Email to check
 * @returns {Object} - { isValid: boolean, message: string }
 */
const validateGmailFormat = (email) => {
    if (!email || typeof email !== 'string') {
        return {
            isValid: false,
            message: "Email is required"
        };
    }

    const emailLower = email.toLowerCase().trim();
    
    // Basic email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLower)) {
        return {
            isValid: false,
            message: "Invalid email format"
        };
    }

    // Must be Gmail
    if (!emailLower.endsWith('@gmail.com')) {
        return {
            isValid: false,
            message: "Only Gmail addresses are allowed. Please use an email ending with @gmail.com"
        };
    }

    // Validate local part
    const localPart = emailLower.split('@')[0];
    if (!localPart || localPart.length === 0 || localPart.length > 64) {
        return {
            isValid: false,
            message: "Invalid Gmail address format"
        };
    }

    // Gmail local part: letters, numbers, dots, plus signs
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

module.exports = {
    verifyGmailExistence,
    validateGmailFormat
};

