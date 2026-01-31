/**
 * Device Detection Hook
 * 
 * React hook for device detection in components
 * Automatically detects device type and provides payment method configuration
 */

import { useState, useEffect } from 'react';
import { 
    isAppleDevice, 
    isWindowsDevice, 
    isAndroidDevice, 
    getDeviceType, 
    getPaymentMethods,
    shouldShowApplePay 
} from '@/utils/deviceDetection';

export const useDeviceDetection = () => {
    const [deviceInfo, setDeviceInfo] = useState({
        isApple: false,
        isWindows: false,
        isAndroid: false,
        deviceType: 'other',
        paymentMethods: ['creditcard'],
        showApplePay: false,
        isReady: false
    });

    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') {
            return;
        }

        // Detect device
        const isApple = isAppleDevice();
        const isWindows = isWindowsDevice();
        const isAndroid = isAndroidDevice();
        const deviceType = getDeviceType();
        const paymentMethods = getPaymentMethods();
        const showApplePay = shouldShowApplePay();

        setDeviceInfo({
            isApple,
            isWindows,
            isAndroid,
            deviceType,
            paymentMethods,
            showApplePay,
            isReady: true
        });

        console.log('[DEVICE-DETECTION-HOOK] Device detected:', {
            isApple,
            isWindows,
            isAndroid,
            deviceType,
            paymentMethods,
            showApplePay,
            userAgent: navigator.userAgent,
            platform: navigator.platform
        });
    }, []);

    return deviceInfo;
};

export default useDeviceDetection;
