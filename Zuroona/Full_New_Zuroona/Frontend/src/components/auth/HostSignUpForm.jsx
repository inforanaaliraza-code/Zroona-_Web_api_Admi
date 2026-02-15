"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import { OrganizerSignUpApi } from "@/app/api/setting";
import { NumberInput } from "@/components/ui/number-input";
import ProfileImageUpload from "../ProfileImageUpload/ProfileImageUpload";
import Loader from "../Loader/Loader";
import { TOKEN_NAME } from "@/until";
import useAuthStore from "@/store/useAuthStore";
import axios from "axios";
import { BASE_API_URL } from "@/until";
import { useEmailValidation } from "@/hooks/useEmailValidation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip-shadcn";
import { Checkbox } from "@/components/ui/checkbox";
import TermsOfServiceModal from "../Modal/TermsOfServiceModal";
import PrivacyPolicyModal from "../Modal/PrivacyPolicyModal";
import CountryCitySelect from "../CountryCitySelect/CountryCitySelect";

export default function HostSignUpForm() {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [showVerificationStep, setShowVerificationStep] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [organizerId, setOrganizerId] = useState(null);
    const [otp, setOtp] = useState("");
    const [otpVerifying, setOtpVerifying] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
    const [otpTimer, setOtpTimer] = useState(60); // 1 minute timer for OTP
    const [emailTimer, setEmailTimer] = useState(60); // 1 minute timer for email verification
    const [otpExpired, setOtpExpired] = useState(false);
    const [emailExpired, setEmailExpired] = useState(false);
    const [otpSentTime, setOtpSentTime] = useState(null); // Track when OTP was sent
    const [otpError, setOtpError] = useState(null); // For showing prominent OTP errors
    const [phoneBlocked, setPhoneBlocked] = useState(false); // For phone blocked state
    const [blockTimeRemaining, setBlockTimeRemaining] = useState(0); // Minutes remaining for block
    
    // Email validation hook
    const { emailStatus, checkEmailDebounced, resetEmailStatus } = useEmailValidation();

    // OTP Timer Effect
    useEffect(() => {
        if (showVerificationStep && !phoneVerified && otpTimer > 0 && otpSentTime) {
            const timer = setInterval(() => {
                setOtpTimer((prev) => {
                    if (prev <= 1) {
                        setOtpExpired(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [showVerificationStep, phoneVerified, otpTimer, otpSentTime]);

    // Email Verification Timer Effect
    useEffect(() => {
        if (showVerificationStep && !emailVerified && emailTimer > 0) {
            const timer = setInterval(() => {
                setEmailTimer((prev) => {
                    if (prev <= 1) {
                        setEmailExpired(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [showVerificationStep, emailVerified, emailTimer]);

    // Reset timers when verification step is shown
    useEffect(() => {
        if (showVerificationStep) {
            setOtpTimer(60);
            setEmailTimer(60);
            setOtpExpired(false);
            setEmailExpired(false);
        }
    }, [showVerificationStep]);

    const validationSchema = Yup.object({
        first_name: Yup.string()
            .required(t("auth.firstNameRequired") || "First name is required")
            .min(2, t("auth.firstNameMin") || "First name must be at least 2 characters"),
        last_name: Yup.string()
            .required(t("auth.lastNameRequired") || "Last name is required")
            .min(2, t("auth.lastNameMin") || "Last name must be at least 2 characters"),
        email: Yup.string()
            .required(t("auth.emailRequired") || "Email is required")
            .test('gmail-only', "Only Gmail addresses are allowed. Please use an email ending with @gmail.com", function(value) {
                if (!value) return true; // Let required handle empty
                const emailLower = value.toLowerCase().trim();
                return emailLower.endsWith('@gmail.com');
            })
            .test('gmail-format', "Invalid Gmail address format", function(value) {
                if (!value) return true;
                const emailLower = value.toLowerCase().trim();
                const localPart = emailLower.split('@')[0];
                if (!localPart) return false;
                return /^[a-z0-9.+]+$/.test(localPart);
            })
            .email(t("auth.emailInvalid") || "Invalid email address"),
        phone_number: Yup.string()
            .required(t("auth.phoneRequired") || "Phone number is required")
            .matches(/^[0-9]+$/, t("auth.phoneInvalid") || "Phone number must contain only digits"),
        country_code: Yup.string()
            .required(t("auth.countryCodeRequired") || "Country code is required"),
        gender: Yup.number()
            .required(t("auth.genderRequired") || "Gender is required")
            .oneOf([1, 2, 3], t("auth.genderInvalid") || "Please select a valid gender"),
        date_of_birth: Yup.string()
            .required(t("auth.dobRequired") || "Date of birth is required")
            .test('valid-format', t("auth.dobInvalidFormat") || "Date must be in DD/MM/YYYY format", function (value) {
                if (!value) return true;
                // Check if it's already in YYYY-MM-DD format (from onBlur conversion)
                if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return true;
                // Check DD/MM/YYYY format
                if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
                const [day, month, year] = value.split('/');
                const dateObj = new Date(`${year}-${month}-${day}`);
                return !isNaN(dateObj.getTime());
            })
            .test('not-future', t("auth.dobFuture") || "Date of birth cannot be in the future", function (value) {
                if (!value) return true;
                let dateObj;
                if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                    dateObj = new Date(value);
                } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
                    const [day, month, year] = value.split('/');
                    dateObj = new Date(`${year}-${month}-${day}`);
                } else {
                    return false;
                }
                return dateObj <= new Date();
            }),
        country: Yup.string()
            .required(t("signup.countryRequired") || "Country is required"),
        city: Yup.string()
            .required(t("signup.cityRequired") || "City is required"),
        acceptPrivacy: Yup.boolean()
            .oneOf([true], t("auth.privacyRequired") || "You must accept the privacy policy"),
        acceptTerms: Yup.boolean()
            .oneOf([true], t("auth.termsRequired") || "You must accept the terms and conditions"),
    });

    const formik = useFormik({
        initialValues: {
            first_name: "",
            last_name: "",
            email: "",
            phone_number: "",
            country_code: "+966",
            gender: "",
            date_of_birth: "",
            country: "",
            city: "",
            bio: "",
            acceptPrivacy: false,
            acceptTerms: false,
        },





        
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                // Convert DD/MM/YYYY to YYYY-MM-DD format for API
                let dateOfBirth = values.date_of_birth;
                if (dateOfBirth && /^\d{2}\/\d{2}\/\d{4}$/.test(dateOfBirth)) {
                    const [day, month, year] = dateOfBirth.split('/');
                    dateOfBirth = `${year}-${month}-${day}`;
                }

                const payload = {
                    email: values.email.toLowerCase().trim(),
                    first_name: values.first_name,
                    last_name: values.last_name,
                    phone_number: values.phone_number ? parseInt(values.phone_number) : null,
                    country_code: values.country_code,
                    gender: parseInt(values.gender),
                    date_of_birth: dateOfBirth,
                    country: values.country,
                    city: values.city,
                    bio: values.bio || "",
                    profile_image: profileImage || "",
                    registration_step: 4, // Complete registration
                    language: i18n.language || "en",
                };

                console.log("[HOST:REGISTRATION] Registration request:", { ...payload, password: "***" });

                const response = await OrganizerSignUpApi(payload);

                console.log("[HOST:REGISTRATION] Response:", response);

                if (response?.status === 1 || response?.status === true) {
                    setUserEmail(values.email.toLowerCase().trim());
                    setOrganizerId(response?.data?.organizer?._id);
                    setShowVerificationStep(true);
                    setOtpSentTime(Date.now()); // Record when OTP was sent
                    setOtpTimer(60); // Reset timer
                    setOtpExpired(false);
                    toast.success(
                        response.message || 
                        t("auth.hostSignupSuccess") || 
                        "Registration successful! Please verify your email and enter the OTP sent to your phone."
                    );
                } else {
                    toast.error(
                        response?.message || 
                        t("auth.signupError") || 
                        "Signup failed. Please try again."
                    );
                }
            } catch (error) {
                console.error("[HOST:REGISTRATION] Error:", error);
                toast.error(
                    error?.response?.data?.message || 
                    t("auth.signupError") || 
                    "An error occurred. Please try again."
                );
            } finally {
                setLoading(false);
            }
        },
    });

    const handleResendVerification = async () => {
        if (!userEmail) {
            toast.error(t("auth.enterEmailFirst") || "Email not found");
            return;
        }

        setLoading(true);
        try {
            // Try organizer-specific endpoint first, fallback to user endpoint
            let response;
            try {
                response = await axios.post(
                    `${BASE_API_URL}organizer/resend-verification`,
                    { email: userEmail },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            lang: i18n.language || "en",
                        },
                    }
                );
            } catch (error) {
                // Fallback to user endpoint if organizer endpoint doesn't exist
                response = await axios.post(
                    `${BASE_API_URL}user/resend-verification`,
                    { email: userEmail },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            lang: i18n.language || "en",
                        },
                    }
                );
            }

            if (response.data?.status === 1 || response.data?.status === true) {
                toast.success(
                    t("auth.verificationEmailResent") || 
                    "Verification email sent! Please check your inbox."
                );
            } else {
                toast.error(
                    response.data?.message || 
                    t("auth.resendFailed") || 
                    "Failed to resend verification email"
                );
            }
        } catch (error) {
            console.error("[HOST:RESEND] Error:", error);
            toast.error(
                error?.response?.data?.message || 
                t("auth.resendError") || 
                "An error occurred while resending verification email"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!organizerId || !formik.values.phone_number || !formik.values.country_code) {
            toast.error("Missing information to resend OTP");
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post(
                `${BASE_API_URL}organizer/resend-signup-otp`,
                {
                    organizer_id: organizerId,
                    phone_number: formik.values.phone_number,
                    country_code: formik.values.country_code
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        lang: i18n.language || "en",
                    },
                }
            );
            if (response.data?.status === 1 || response.data?.success) {
                // Reset OTP timer
                setOtpTimer(60);
                setOtpExpired(false);
                setOtpSentTime(Date.now());
                setOtp(""); // Clear previous OTP
                toast.success(response.data.message || "OTP resent successfully!");
            } else {
                toast.error(response.data.message || "Failed to resend OTP.");
            }
        } catch (error) {
            console.error("Resend OTP error:", error);
            toast.error("Failed to resend OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }
        // Check if OTP has expired (1 minute = 60000 ms)
        if (otpSentTime && (Date.now() - otpSentTime) > 60000) {
            toast.error(t("auth.otpExpired") || "OTP has expired. Please request a new one.");
            setOtpExpired(true);
            setOtp("");
            return;
        }
        if (otpExpired) {
            toast.error(t("auth.otpExpired") || "OTP has expired. Please request a new one.");
            setOtp("");
            return;
        }
        if (!organizerId || !formik.values.phone_number || !formik.values.country_code) {
            toast.error("Missing information to verify OTP");
            return;
        }
        try {
            setOtpVerifying(true);
            setOtpError(null); // Clear previous errors
            const response = await axios.post(
                `${BASE_API_URL}organizer/verify-signup-otp`,
                {
                    organizer_id: organizerId,
                    phone_number: formik.values.phone_number,
                    country_code: formik.values.country_code,
                    otp: otp
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        lang: i18n.language || "en",
                    },
                }
            );
            if (response.data?.status === 1 || response.data?.success) {
                setPhoneVerified(true);
                setOtpError(null);
                setPhoneBlocked(false);
                if (response.data?.data?.organizer?.is_verified) {
                    // Both verified - success!
                    toast.success(response.data.message || "Account verified successfully! Your application is pending admin approval.");
                    setTimeout(() => {
                        router.push("/login");
                    }, 2000);
                } else {
                    toast.success(response.data.message || "Phone verified! Please verify your email to complete registration.");
                }
            } else {
                // Parse error message for blocked phone or too many attempts
                const errorMessage = response.data.message || "";
                const isBlocked = errorMessage.toLowerCase().includes("blocked") || 
                                  errorMessage.toLowerCase().includes("too many") ||
                                  errorMessage.toLowerCase().includes("محاولات");
                
                // Extract minutes from message if present
                const minutesMatch = errorMessage.match(/(\d+)\s*(minutes?|دقيقة)/i);
                if (minutesMatch) {
                    setBlockTimeRemaining(parseInt(minutesMatch[1]));
                }
                
                if (isBlocked) {
                    setPhoneBlocked(true);
                    setOtpError(errorMessage);
                } else {
                    setOtpError(errorMessage || t("auth.invalidOTP") || "Invalid OTP. Please try again.");
                }
                toast.error(errorMessage || "Invalid OTP. Please try again.");
            }
        } catch (error) {
            console.error("Verify OTP error:", error);
            const errorMessage = error?.response?.data?.message || "";
            const isBlocked = errorMessage.toLowerCase().includes("blocked") || 
                              errorMessage.toLowerCase().includes("too many") ||
                              errorMessage.toLowerCase().includes("محاولات");
            
            const minutesMatch = errorMessage.match(/(\d+)\s*(minutes?|دقيقة)/i);
            if (minutesMatch) {
                setBlockTimeRemaining(parseInt(minutesMatch[1]));
            }
            
            if (isBlocked) {
                setPhoneBlocked(true);
                setOtpError(errorMessage);
            } else {
                setOtpError(errorMessage || "Failed to verify OTP. Please try again.");
            }
            toast.error(errorMessage || "Failed to verify OTP. Please try again.");
        } finally {
            setOtpVerifying(false);
        }
    };

    // Show verification step after registration
    if (showVerificationStep) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto"
            >
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon icon="material-symbols:check-circle" className="w-12 h-12 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {t("auth.registrationSuccessful") || "Registration Successful!"}
                        </h1>
                        <p className="text-gray-600 mb-6">
                            {t("auth.hostRegistrationMessage") || 
                            "Your host account has been created successfully. Please verify your email to continue."}
                        </p>
                    </div>

                    {/* Verification Status */}
                    <div className="mb-6 space-y-3">
                        {/* Email Verification Status */}
                        <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
                            emailVerified ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                        }`}>
                            <Icon 
                                icon={emailVerified ? "material-symbols:check-circle" : "material-symbols:schedule"} 
                                className="w-5 h-5" 
                            />
                            <span className="text-sm font-medium">
                                {emailVerified 
                                    ? "Email Verified ✓" 
                                    : "Check your email and click the verification link"}
                            </span>
                        </div>

                        {/* Phone Verification Status */}
                        <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
                            phoneVerified ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                        }`}>
                            <Icon 
                                icon={phoneVerified ? "material-symbols:check-circle" : "material-symbols:schedule"} 
                                className="w-5 h-5" 
                            />
                            <span className="text-sm font-medium">
                                {phoneVerified 
                                    ? "Phone Verified ✓" 
                                    : "Enter OTP sent to your phone"}
                            </span>
                        </div>
                    </div>

                    {/* OTP Error Alert - Prominent Display */}
                    {otpError && !phoneVerified && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-4 p-4 rounded-lg border-2 ${
                                phoneBlocked 
                                    ? 'bg-red-100 border-red-400 text-red-800' 
                                    : 'bg-orange-100 border-orange-400 text-orange-800'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <Icon 
                                    icon={phoneBlocked ? "material-symbols:block" : "material-symbols:warning"} 
                                    className={`w-6 h-6 flex-shrink-0 mt-0.5 ${phoneBlocked ? 'text-red-600' : 'text-orange-600'}`}
                                />
                                <div className="flex-1">
                                    <h4 className={`font-semibold mb-1 ${phoneBlocked ? 'text-red-800' : 'text-orange-800'}`}>
                                        {phoneBlocked 
                                            ? (t("auth.phoneBlockedTitle") || "Phone Number Blocked")
                                            : (t("auth.otpErrorTitle") || "Verification Failed")
                                        }
                                    </h4>
                                    <p className="text-sm">
                                        {otpError}
                                    </p>
                                    {phoneBlocked && blockTimeRemaining > 0 && (
                                        <div className="mt-2 flex items-center gap-2">
                                            <Icon icon="material-symbols:schedule" className="w-4 h-4" />
                                            <span className="text-sm font-medium">
                                                {t("auth.tryAgainIn") || "Try again in"}: {blockTimeRemaining} {t("auth.minutes") || "minutes"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <button 
                                    onClick={() => { setOtpError(null); setPhoneBlocked(false); }}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <Icon icon="material-symbols:close" className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* OTP Input */}
                    {!phoneVerified && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                {t("auth.enterOTP") || "Enter OTP"}
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                    setOtp(value);
                                    if (otpError) setOtpError(null); // Clear error on input change
                                }}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#a797cc] focus:border-transparent text-center text-2xl tracking-widest ${
                                    otpExpired || phoneBlocked ? "border-red-500 bg-red-50" : otpError ? "border-orange-500 bg-orange-50" : "border-gray-300"
                                }`}
                                placeholder="000000"
                                maxLength={6}
                                disabled={otpExpired || phoneBlocked}
                            />
                            <div className="mt-2 flex items-center justify-between">
                                <button
                                    onClick={handleResendOtp}
                                    disabled={loading || phoneBlocked || (otpTimer > 0 && !otpExpired)}
                                    className={`text-sm font-medium transition-colors ${
                                        loading || phoneBlocked || (otpTimer > 0 && !otpExpired)
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "text-[#a797cc] hover:text-[#8ba179]"
                                    }`}
                                >
                                    {t("auth.resendOTP") || "Resend OTP"}
                                </button>
                                {otpTimer > 0 && !otpExpired && (
                                    <span className="text-sm text-gray-600">
                                        {t("auth.otpTimer") || "Resend in"} {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}
                                    </span>
                                )}
                                {otpExpired && (
                                    <span className="text-sm text-red-600 font-medium">
                                        {t("auth.otpExpired") || "OTP Expired"}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Email Resend */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 text-left">
                        <div className="flex items-start">
                            <Icon icon="material-symbols:mail-outline" className="w-5 h-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm text-orange-800 mb-2">
                                    {t("auth.verificationEmailSent") || 
                                    `Verification link sent to ${userEmail}`}
                                </p>
                                <button
                                    onClick={handleResendVerification}
                                    disabled={loading}
                                    className="text-sm font-semibold text-orange-700 hover:text-orange-900 underline"
                                >
                                    {loading ? (
                                        <span className="flex items-center">
                                            <Loader /> {t("auth.sending") || "Sending..."}
                                        </span>
                                    ) : (
                                        t("auth.resendVerificationEmail") || "Resend Verification Email"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Admin Approval Notice */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
                        <div className="flex items-start">
                            <Icon icon="material-symbols:admin-panel-settings" className="w-6 h-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-blue-900 mb-2">
                                    {t("auth.adminApprovalRequired") || "Admin Approval Required"}
                                </h3>
                                <p className="text-sm text-blue-800">
                                    {t("auth.adminApprovalMessage") || 
                                    "After verifying your email, your account will be reviewed by our admin team. You will receive an email notification once your account is approved. You cannot login until your account is approved."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        {!phoneVerified && (
                            <button
                                onClick={handleVerifyOtp}
                                disabled={otpVerifying || otp.length !== 6 || otpExpired || phoneBlocked}
                                className="w-full py-3 px-6 bg-[#a797cc] hover:bg-[#8ba179] text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {otpVerifying 
                                    ? (t("auth.verifyingOTP") || "Verifying...") 
                                    : phoneBlocked 
                                        ? (t("auth.phoneBlocked") || "Phone Blocked")
                                        : otpExpired 
                                            ? (t("auth.otpExpired") || "OTP Expired") 
                                            : (t("auth.verifyOTP") || "Verify OTP")
                                }
                            </button>
                        )}
                        {(emailVerified && phoneVerified) && (
                            <button
                                onClick={() => router.push("/login")}
                                className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                            >
                                {t("auth.goToLogin") || "Go to Login"}
                            </button>
                        )}
                        <button
                            onClick={() => setShowVerificationStep(false)}
                            className="w-full py-3 px-6 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition-colors"
                        >
                            {t("auth.close") || "Close"}
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
        >
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#a797cc] to-[#d66a0a] rounded-full flex items-center justify-center">
                            <Icon icon="material-symbols:star" className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        {t("auth.joinAsHostOrGuest") || "Join as Host or Guest"}
                    </h1>
                    <p className="text-sm text-gray-600">
                        {t("auth.hostSignupSubtitle") || "Create and manage your own events on Zuroona"}
                    </p>
                </div>

                {/* Info Box */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start">
                        <Icon icon="material-symbols:info" className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-orange-900">
                            <p className="font-semibold mb-1">
                                {t("auth.requiresApproval") || "Requires Approval"}
                            </p>
                            <p>
                                {t("auth.approvalInfo") || 
                                "Your account will need admin approval after email verification. You'll be notified via email once approved."}
                            </p>
                            </div>
                    </div>
                </div>

                <TooltipProvider>
                    {/* Form */}
                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        {/* Profile Image */}
                        <div className="flex justify-center mb-4">
                            <ProfileImageUpload
                                onImageChange={(image) => setProfileImage(image)}
                            />
                        </div>

                        {/* Row 1: First Name & Last Name */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="first_name" className="text-sm font-medium">
                                        {t("auth.firstName") || "First Name"} *
                                    </Label>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Icon icon="mdi:information-outline" className="w-4 h-4 text-gray-400 cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-xs">Enter your legal first name</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    value={formik.values.first_name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={formik.touched.first_name && formik.errors.first_name ? "border-red-500" : ""}
                                    placeholder={t("auth.firstNamePlaceholder") || "Enter your first name"}
                                />
                                {formik.touched.first_name && formik.errors.first_name && (
                                    <p className="text-xs text-red-600">{formik.errors.first_name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="last_name" className="text-sm font-medium">
                                        {t("auth.lastName") || "Last Name"} *
                                    </Label>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Icon icon="mdi:information-outline" className="w-4 h-4 text-gray-400 cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-xs">Enter your legal last name</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    value={formik.values.last_name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={formik.touched.last_name && formik.errors.last_name ? "border-red-500" : ""}
                                    placeholder={t("auth.lastNamePlaceholder") || "Enter your last name"}
                                />
                                {formik.touched.last_name && formik.errors.last_name && (
                                    <p className="text-xs text-red-600">{formik.errors.last_name}</p>
                                )}
                            </div>
                        </div>

                        {/* Row 2: Email & Phone Number */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="email" className="text-sm font-medium">
                                        {t("auth.email") || "Email"} *
                                    </Label>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Icon icon="mdi:information-outline" className="w-4 h-4 text-gray-400 cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-xs">Only Gmail addresses are allowed</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        checkEmailDebounced(e.target.value, 'organizer');
                                    }}
                                    onBlur={(e) => {
                                        formik.handleBlur(e);
                                        if (e.target.value) {
                                            checkEmailDebounced(e.target.value, 'organizer');
                                        }
                                    }}
                                    className={`${formik.touched.email && formik.errors.email
                                        ? "border-red-500"
                                        : emailStatus.status === 'valid'
                                        ? "border-green-500"
                                        : emailStatus.status === 'invalid' || emailStatus.status === 'not_exists'
                                        ? "border-red-500"
                                        : ""
                                    }`}
                                    placeholder="your.email@gmail.com"
                                />
                                {formik.touched.email && formik.errors.email ? (
                                    <p className="text-xs text-red-600">{formik.errors.email}</p>
                                ) : (
                                    formik.values.email && !emailStatus.isChecking && emailStatus.message && (
                                        <p className={`text-xs ${emailStatus.status === 'valid' ? "text-green-600" : emailStatus.status === 'invalid' || emailStatus.status === 'not_exists' ? "text-red-600" : "text-gray-600"}`}>
                                            {emailStatus.status === 'valid' && '✓ '}
                                            {emailStatus.message}
                                        </p>
                                    )
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Label className="text-sm font-medium">
                                        {t("auth.phoneNumber") || "Phone Number"} *
                                    </Label>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Icon icon="mdi:information-outline" className="w-4 h-4 text-gray-400 cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-xs">Enter your phone number with country code</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <NumberInput
                                    formik={formik}
                                    mobileNumberField="phone_number"
                                    countryCodeField="country_code"
                                />
                            </div>
                        </div>

                        {/* Row 3: Gender & Date of Birth */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Label className="text-sm font-medium">
                                        {t("auth.gender") || "Gender"} *
                                    </Label>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Icon icon="mdi:information-outline" className="w-4 h-4 text-gray-400 cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-xs">Select your gender identity</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <Select
                                    value={formik.values.gender === undefined || formik.values.gender === null ? "" : String(formik.values.gender)}
                                    onValueChange={(value) => {
                                        const numValue = value ? parseInt(value, 10) : "";
                                        formik.setFieldValue("gender", numValue, false);
                                    }}
                                >
                                    <SelectTrigger className={formik.touched.gender && formik.errors.gender ? "border-red-500" : ""}>
                                        <SelectValue placeholder={t("auth.selectGender") || "Select gender"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">{t("auth.male") || "Male"}</SelectItem>
                                        <SelectItem value="2">{t("auth.female") || "Female"}</SelectItem>
                                        <SelectItem value="3">{t("auth.other") || "Other"}</SelectItem>
                                    </SelectContent>
                                </Select>
                                {formik.touched.gender && formik.errors.gender && (
                                    <p className="text-xs text-red-600">{formik.errors.gender}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Label className="text-sm font-medium">
                                        {t("auth.dateOfBirth") || "Date of Birth"} *
                                    </Label>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Icon icon="mdi:information-outline" className="w-4 h-4 text-gray-400 cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-xs">You must be at least 18 years old. Format: DD/MM/YYYY</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <div className="relative">
                                    <Input
                                        type="text"
                                        id="date_of_birth"
                                        name="date_of_birth"
                                        value={formik.values.date_of_birth || ""}
                                        onChange={(e) => {
                                            let value = e.target.value;
                                            // Allow only digits and slashes
                                            value = value.replace(/[^\d/]/g, '');
                                            // Auto-format as DD/MM/YYYY
                                            if (value.length <= 10) {
                                                // Remove existing slashes and add new ones
                                                const digits = value.replace(/\//g, '');
                                                if (digits.length <= 2) {
                                                    value = digits;
                                                } else if (digits.length <= 4) {
                                                    value = digits.slice(0, 2) + '/' + digits.slice(2);
                                                } else {
                                                    value = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4, 8);
                                                }
                                            }
                                            formik.setFieldValue("date_of_birth", value);
                                            formik.setFieldTouched("date_of_birth", true);
                                        }}
                                        onBlur={(e) => {
                                            formik.setFieldTouched("date_of_birth", true);
                                            // Convert DD/MM/YYYY to Date object for validation
                                            const value = e.target.value;
                                            if (value && value.length === 10) {
                                                const [day, month, year] = value.split('/');
                                                if (day && month && year) {
                                                    const dateObj = new Date(`${year}-${month}-${day}`);
                                                    if (!isNaN(dateObj.getTime())) {
                                                        formik.setFieldValue("date_of_birth", dateObj.toISOString().split('T')[0]);
                                                    }
                                                }
                                            }
                                        }}
                                        placeholder="DD/MM/YYYY"
                                        maxLength={10}
                                        className={`w-full min-h-[44px] px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                                            formik.touched.date_of_birth && formik.errors.date_of_birth
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300 focus:border-[#a797cc] focus:ring-2 focus:ring-[#a797cc] focus:ring-offset-2"
                                        }`}
                                    />
                                    <p className="mt-1.5 text-xs text-gray-500">
                                        {t("auth.dateFormatHint") || "Format: DD/MM/YYYY (e.g., 25/12/1990)"}
                                    </p>
                                </div>
                                {formik.touched.date_of_birth && formik.errors.date_of_birth && (
                                    <p className="text-xs text-red-600 font-medium">{formik.errors.date_of_birth}</p>
                                )}
                            </div>
                        </div>

                        {/* Country and City Selection */}
                        <CountryCitySelect
                            formik={formik}
                            countryFieldName="country"
                            cityFieldName="city"
                            showLabels={true}
                            required={true}
                        />

                        {/* Bio - Full Width */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Label className="text-sm font-medium">
                                    {t("auth.bio") || "Bio"} <span className="text-xs text-gray-500 font-normal">(Optional)</span>
                                </Label>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Icon icon="mdi:information-outline" className="w-4 h-4 text-gray-400 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs">Tell us about yourself and your experience</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <textarea
                                name="bio"
                                value={formik.values.bio}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                rows={3}
                                className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-[#a797cc] focus:border-transparent resize-none ${
                                    formik.touched.bio && formik.errors.bio
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder={t("auth.bioPlaceholder") || "Tell us about yourself..."}
                            />
                            {formik.touched.bio && formik.errors.bio && (
                                <p className="text-xs text-red-600">{formik.errors.bio}</p>
                            )}
                        </div>

                        {/* Terms and Conditions & Privacy Policy */}
                        <div className="flex items-start gap-3 pt-2">
                            <Checkbox
                                id="acceptTermsAndPrivacy"
                                checked={formik.values.acceptTerms && formik.values.acceptPrivacy}
                                onCheckedChange={(checked) => {
                                    formik.setFieldValue("acceptTerms", checked);
                                    formik.setFieldValue("acceptPrivacy", checked);
                                    formik.setFieldTouched("acceptTerms", true);
                                    formik.setFieldTouched("acceptPrivacy", true);
                                }}
                                className={formik.touched.acceptTerms && formik.errors.acceptTerms ? "border-red-500" : ""}
                            />
                            <div className="text-sm">
                                <Label
                                    htmlFor="acceptTermsAndPrivacy"
                                    className="font-normal cursor-pointer text-gray-700"
                                >
                                    {t("signup.tab22") || "By signing up, you agree to our"}{" "}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsTermsModalOpen(true);
                                        }}
                                        className="text-[#a797cc] hover:underline font-semibold"
                                    >
                                        {t("termsAndConditions") || "Terms & Conditions"}
                                    </button>
                                    {" "}{t("signup.tab24") || "and"}{" "}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsPrivacyModalOpen(true);
                                        }}
                                        className="text-[#a797cc] hover:underline font-semibold"
                                    >
                                        {t("privacyPolicy") || "Privacy Policy"}
                                    </button>
                                    <span className="text-red-500 ml-1">*</span>
                                </Label>
                                {(formik.touched.acceptTerms && formik.errors.acceptTerms) ||
                                    (formik.touched.acceptPrivacy && formik.errors.acceptPrivacy) ? (
                                    <p className="mt-1 text-xs text-red-600">
                                        {formik.errors.acceptTerms || formik.errors.acceptPrivacy ||
                                            "You must accept the Terms & Conditions and Privacy Policy"}
                                    </p>
                                ) : null}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={loading || !formik.values.acceptTerms || !formik.values.acceptPrivacy}
                            className="w-full bg-[#a797cc] hover:bg-[#8ba179] text-white"
                        >
                            {loading ? (
                                <>
                                    <Loader />
                                    <span className="ml-2">{t("auth.creating") || "Creating..."}</span>
                                </>
                            ) : (
                                <>
                                    <Icon icon="material-symbols:arrow-forward" className="w-4 h-4 mr-2" />
                                    <span>{t("auth.createAccount") || "Create Account"}</span>
                                </>
                            )}
                        </Button>
                    </form>
                </TooltipProvider>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        {t("auth.alreadyHaveAccount") || "Already have an account?"}{" "}
                        <Link
                            href="/login"
                            className="text-[#a797cc] hover:text-[#8ba179] font-semibold"
                        >
                            <span suppressHydrationWarning>{t("auth.login") || "Login"}</span>
                        </Link>
                    </p>
                    <p className="text-gray-600 mt-2">
                        {t("auth.wantToBeGuest") || "Want to join as a guest?"}{" "}
                        <button
                            onClick={() => router.push("/signup/guest")}
                            className="text-[#a797cc] hover:text-[#8ba179] font-semibold"
                        >
                            {t("auth.signupAsGuest") || "Signup as Guest"}
                        </button>
                    </p>
                </div>
            </div>


            {/* Terms & Conditions and Privacy Policy Modals */}
            <TermsOfServiceModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />
            <PrivacyPolicyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
        </motion.div>
    );
}
