/**
 * Custom Hook for Gmail Email Validation
 * Provides real-time email format and existence checking
 */

import { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { BASE_API_URL } from '@/until';
import { toast } from 'react-toastify';

export const useEmailValidation = () => {
    const [emailStatus, setEmailStatus] = useState({
        isValid: false,
        exists: false,
        message: '',
        status: 'idle', // 'idle' | 'checking' | 'valid' | 'invalid' | 'not_exists'
        isChecking: false
    });

    const debounceTimer = useRef(null);

    /**
     * Validate Gmail format locally (client-side)
     */
    const validateGmailFormat = useCallback((email) => {
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

        // Gmail local part validation
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
    }, []);

    /**
     * Check email format and existence via API
     */
    const checkEmail = useCallback(async (email, role = 'user') => {
        if (!email || email.trim() === '') {
            setEmailStatus({
                isValid: false,
                exists: false,
                message: '',
                status: 'idle',
                isChecking: false
            });
            return;
        }

        // First validate format locally
        const formatValidation = validateGmailFormat(email);
        if (!formatValidation.isValid) {
            setEmailStatus({
                isValid: false,
                exists: false,
                message: formatValidation.message,
                status: 'invalid',
                isChecking: false
            });
            return;
        }

        // Set checking state
        setEmailStatus(prev => ({
            ...prev,
            isChecking: true,
            status: 'checking',
            message: 'Checking email...'
        }));

        try {
            // Determine API endpoint based on role
            const endpoint = role === 'organizer' || role === 'host' 
                ? 'organizer/check-email' 
                : 'user/check-email';

            const response = await axios.post(
                `${BASE_API_URL}${endpoint}`,
                { email: email.toLowerCase().trim() },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data && response.data.status === 1) {
                const data = response.data.data || response.data;
                setEmailStatus({
                    isValid: data.isValid || false,
                    exists: data.exists || false,
                    message: data.message || response.data.message || '',
                    status: data.status || (data.exists ? 'valid' : 'not_exists'),
                    isChecking: false
                });

                // Show toast based on status
                if (data.status === 'valid' && data.exists) {
                    toast.success('Valid Gmail address. Verification email will be sent.');
                } else if (data.status === 'not_exists') {
                    toast.warning('This Gmail account may not exist. Please verify your email address.');
                }
            } else {
                setEmailStatus({
                    isValid: false,
                    exists: false,
                    message: response.data?.message || 'Error checking email',
                    status: 'invalid',
                    isChecking: false
                });
                toast.error(response.data?.message || 'Error checking email');
            }
        } catch (error) {
            console.error('[EMAIL_VALIDATION] Error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Error checking email';
            setEmailStatus({
                isValid: false,
                exists: false,
                message: errorMessage,
                status: 'error',
                isChecking: false
            });
            toast.error('Error checking email. Please try again.');
        }
    }, [validateGmailFormat]);

    /**
     * Debounced email check (waits 500ms after user stops typing)
     */
    const checkEmailDebounced = useCallback((email, role = 'user') => {
        // Clear previous timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // First validate format immediately
        const formatValidation = validateGmailFormat(email);
        if (!formatValidation.isValid && email.trim() !== '') {
            setEmailStatus({
                isValid: false,
                exists: false,
                message: formatValidation.message,
                status: 'invalid',
                isChecking: false
            });
            return;
        }

        // If format is valid, wait 500ms then check existence
        if (formatValidation.isValid) {
            debounceTimer.current = setTimeout(() => {
                checkEmail(email, role);
            }, 500);
        } else {
            setEmailStatus({
                isValid: false,
                exists: false,
                message: '',
                status: 'idle',
                isChecking: false
            });
        }
    }, [checkEmail, validateGmailFormat]);

    /**
     * Reset email status
     */
    const resetEmailStatus = useCallback(() => {
        setEmailStatus({
            isValid: false,
            exists: false,
            message: '',
            status: 'idle',
            isChecking: false
        });
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
    }, []);

    return {
        emailStatus,
        checkEmail,
        checkEmailDebounced,
        validateGmailFormat,
        resetEmailStatus
    };
};

