/**
 * Password Validation Helper
 * 
 * Validates password strength according to security requirements:
 * - Minimum 8 characters
 * - At least one lowercase letter
 * - At least one uppercase letter
 * - At least one number
 * - At least one special character
 */

const validatePasswordStrength = (password) => {
    if (!password) {
        return {
            isValid: false,
            message: "Password is required"
        };
    }

    // Minimum length check
    if (password.length < 8) {
        return {
            isValid: false,
            message: "Password must be at least 8 characters long"
        };
    }

    // Maximum length check (prevent DoS attacks)
    if (password.length > 128) {
        return {
            isValid: false,
            message: "Password must not exceed 128 characters"
        };
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
        return {
            isValid: false,
            message: "Password must contain at least one lowercase letter"
        };
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
        return {
            isValid: false,
            message: "Password must contain at least one uppercase letter"
        };
    }

    // Check for number
    if (!/[0-9]/.test(password)) {
        return {
            isValid: false,
            message: "Password must contain at least one number"
        };
    }

    // Check for special character
    if (!/[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/]/.test(password)) {
        return {
            isValid: false,
            message: "Password must contain at least one special character (@$!%*?&#^()_+-=[]{};':\"|,.<>/)"
        };
    }

    return {
        isValid: true,
        message: "Password is strong"
    };
};

const validatePasswordMatch = (password, confirmPassword) => {
    if (password !== confirmPassword) {
        return {
            isValid: false,
            message: "Passwords do not match"
        };
    }

    return {
        isValid: true,
        message: "Passwords match"
    };
};

module.exports = {
    validatePasswordStrength,
    validatePasswordMatch
};


