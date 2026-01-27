/**
 * Device Detection Utility
 * 
 * Detects user's device type and OS to show appropriate payment methods:
 * - Mac/iOS: Apple Pay
 * - Windows/Android: Credit Card only
 */

/**
 * Detect if user is on Mac/iOS device
 * @returns {boolean} - True if Mac/iOS, false otherwise
 */
export const isAppleDevice = () => {
    if (typeof window === 'undefined') {
        return false; // SSR - default to false
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    const platform = window.navigator.platform?.toLowerCase() || '';

    // Check for iOS devices (iPhone, iPad, iPod)
    const isIOS = /iphone|ipad|ipod/.test(userAgent) || 
                  (platform === 'macintel' && navigator.maxTouchPoints > 1); // iPad on iOS 13+

    // Check for Mac devices
    const isMac = /macintosh|mac os x/.test(userAgent) || 
                  platform.includes('mac');

    // Check for Safari browser (common on Apple devices)
    const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);

    // Additional check: Check if Apple Pay is available (most reliable)
    let hasApplePay = false;
    try {
        if (typeof window !== 'undefined' && 
            window.ApplePaySession && 
            typeof ApplePaySession.canMakePayments === 'function') {
            hasApplePay = ApplePaySession.canMakePayments();
        }
    } catch (error) {
        // Apple Pay API not available or error
        console.log('[DEVICE-DETECTION] Apple Pay API check failed:', error.message);
    }

    console.log('[DEVICE-DETECTION] Device info:', {
        userAgent,
        platform,
        isIOS,
        isMac,
        isSafari,
        hasApplePay,
        maxTouchPoints: navigator.maxTouchPoints
    });

    // Return true if:
    // 1. iOS device, OR
    // 2. Mac device (desktop), OR
    // 3. Apple Pay is available (most reliable indicator)
    return isIOS || isMac || hasApplePay;
};

/**
 * Detect if user is on Windows device
 * @returns {boolean} - True if Windows, false otherwise
 */
export const isWindowsDevice = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    const platform = window.navigator.platform?.toLowerCase() || '';

    return /windows/.test(userAgent) || platform.includes('win');
};

/**
 * Detect if user is on Android device
 * @returns {boolean} - True if Android, false otherwise
 */
export const isAndroidDevice = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    return /android/.test(userAgent);
};

/**
 * Get device type for payment method selection
 * @returns {string} - 'apple' | 'windows' | 'android' | 'other'
 */
export const getDeviceType = () => {
    if (isAppleDevice()) {
        return 'apple';
    }
    if (isWindowsDevice()) {
        return 'windows';
    }
    if (isAndroidDevice()) {
        return 'android';
    }
    return 'other';
};

/**
 * Check if Apple Pay should be shown
 * @returns {boolean} - True if Apple Pay should be available
 */
export const shouldShowApplePay = () => {
    return isAppleDevice();
};

/**
 * Check if only credit card should be shown
 * @returns {boolean} - True if only credit card should be shown
 */
export const shouldShowCreditCardOnly = () => {
    return !isAppleDevice();
};

/**
 * Get payment methods based on device
 * @returns {Array<string>} - Array of payment methods to enable
 */
export const getPaymentMethods = () => {
    if (isAppleDevice()) {
        // Apple devices: Show both Apple Pay and Credit Card
        return ['applepay', 'creditcard'];
    }
    // Windows/Android/Other: Only Credit Card
    return ['creditcard'];
};
