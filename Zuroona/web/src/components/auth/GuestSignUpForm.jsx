"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import { SignUpApi } from "@/app/api/setting";
import { NumberInput } from "@/components/ui/number-input";
import ProfileImageUpload from "../ProfileImageUpload/ProfileImageUpload";
import Loader from "../Loader/Loader";
import LoginModal from "../Modal/LoginModal";
import TermsOfServiceModal from "../Modal/TermsOfServiceModal";
import PrivacyPolicyModal from "../Modal/PrivacyPolicyModal";
import { TOKEN_NAME, BASE_API_URL } from "@/until";
import useAuthStore from "@/store/useAuthStore";
import { useRTL } from "@/utils/rtl";
import { useEmailValidation } from "@/hooks/useEmailValidation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip-shadcn";
import { useDispatch, useSelector } from "react-redux";
import { updateField, setFieldTouched, resetForm } from "@/redux/slices/signupFormSlice";
import CountryCitySelect from "../CountryCitySelect/CountryCitySelect";

const countries = [
    { code: "AF", name: "Afghanistan" }, { code: "AL", name: "Albania" }, { code: "DZ", name: "Algeria" },
    { code: "AD", name: "Andorra" }, { code: "AO", name: "Angola" }, { code: "AG", name: "Antigua and Barbuda" },
    { code: "AR", name: "Argentina" }, { code: "AM", name: "Armenia" }, { code: "AU", name: "Australia" },
    { code: "AT", name: "Austria" }, { code: "AZ", name: "Azerbaijan" }, { code: "BS", name: "Bahamas" },
    { code: "BH", name: "Bahrain" }, { code: "BD", name: "Bangladesh" }, { code: "BB", name: "Barbados" },
    { code: "BY", name: "Belarus" }, { code: "BE", name: "Belgium" }, { code: "BZ", name: "Belize" },
    { code: "BJ", name: "Benin" }, { code: "BT", name: "Bhutan" }, { code: "BO", name: "Bolivia" },
    { code: "BA", name: "Bosnia and Herzegovina" }, { code: "BW", name: "Botswana" }, { code: "BR", name: "Brazil" },
    { code: "BN", name: "Brunei" }, { code: "BG", name: "Bulgaria" }, { code: "BF", name: "Burkina Faso" },
    { code: "BI", name: "Burundi" }, { code: "CV", name: "Cabo Verde" }, { code: "KH", name: "Cambodia" },
    { code: "CM", name: "Cameroon" }, { code: "CA", name: "Canada" }, { code: "CF", name: "Central African Republic" },
    { code: "TD", name: "Chad" }, { code: "CL", name: "Chile" }, { code: "CN", name: "China" },
    { code: "CO", name: "Colombia" }, { code: "KM", name: "Comoros" }, { code: "CG", name: "Congo" },
    { code: "CR", name: "Costa Rica" }, { code: "HR", name: "Croatia" }, { code: "CU", name: "Cuba" },
    { code: "CY", name: "Cyprus" }, { code: "CZ", name: "Czech Republic" }, { code: "DK", name: "Denmark" },
    { code: "DJ", name: "Djibouti" }, { code: "DM", name: "Dominica" }, { code: "DO", name: "Dominican Republic" },
    { code: "EC", name: "Ecuador" }, { code: "EG", name: "Egypt" }, { code: "SV", name: "El Salvador" },
    { code: "GQ", name: "Equatorial Guinea" }, { code: "ER", name: "Eritrea" }, { code: "EE", name: "Estonia" },
    { code: "SZ", name: "Eswatini" }, { code: "ET", name: "Ethiopia" }, { code: "FJ", name: "Fiji" },
    { code: "FI", name: "Finland" }, { code: "FR", name: "France" }, { code: "GA", name: "Gabon" },
    { code: "GM", name: "Gambia" }, { code: "GE", name: "Georgia" }, { code: "DE", name: "Germany" },
    { code: "GH", name: "Ghana" }, { code: "GR", name: "Greece" }, { code: "GD", name: "Grenada" },
    { code: "GT", name: "Guatemala" }, { code: "GN", name: "Guinea" }, { code: "GW", name: "Guinea-Bissau" },
    { code: "GY", name: "Guyana" }, { code: "HT", name: "Haiti" }, { code: "HN", name: "Honduras" },
    { code: "HU", name: "Hungary" }, { code: "IS", name: "Iceland" }, { code: "IN", name: "India" },
    { code: "ID", name: "Indonesia" }, { code: "IR", name: "Iran" }, { code: "IQ", name: "Iraq" },
    { code: "IE", name: "Ireland" }, { code: "IL", name: "Israel" }, { code: "IT", name: "Italy" },
    { code: "JM", name: "Jamaica" }, { code: "JP", name: "Japan" }, { code: "JO", name: "Jordan" },
    { code: "KZ", name: "Kazakhstan" }, { code: "KE", name: "Kenya" }, { code: "KI", name: "Kiribati" },
    { code: "KP", name: "North Korea" }, { code: "KR", name: "South Korea" }, { code: "KW", name: "Kuwait" },
    { code: "KG", name: "Kyrgyzstan" }, { code: "LA", name: "Laos" }, { code: "LV", name: "Latvia" },
    { code: "LB", name: "Lebanon" }, { code: "LS", name: "Lesotho" }, { code: "LR", name: "Liberia" },
    { code: "LY", name: "Libya" }, { code: "LI", name: "Liechtenstein" }, { code: "LT", name: "Lithuania" },
    { code: "LU", name: "Luxembourg" }, { code: "MG", name: "Madagascar" }, { code: "MW", name: "Malawi" },
    { code: "MY", name: "Malaysia" }, { code: "MV", name: "Maldives" }, { code: "ML", name: "Mali" },
    { code: "MT", name: "Malta" }, { code: "MH", name: "Marshall Islands" }, { code: "MR", name: "Mauritania" },
    { code: "MU", name: "Mauritius" }, { code: "MX", name: "Mexico" }, { code: "FM", name: "Micronesia" },
    { code: "MD", name: "Moldova" }, { code: "MC", name: "Monaco" }, { code: "MN", name: "Mongolia" },
    { code: "ME", name: "Montenegro" }, { code: "MA", name: "Morocco" }, { code: "MZ", name: "Mozambique" },
    { code: "MM", name: "Myanmar" }, { code: "NA", name: "Namibia" }, { code: "NR", name: "Nauru" },
    { code: "NP", name: "Nepal" }, { code: "NL", name: "Netherlands" }, { code: "NZ", name: "New Zealand" },
    { code: "NI", name: "Nicaragua" }, { code: "NE", name: "Niger" }, { code: "NG", name: "Nigeria" },
    { code: "MK", name: "North Macedonia" }, { code: "NO", name: "Norway" }, { code: "OM", name: "Oman" },
    { code: "PK", name: "Pakistan" }, { code: "PW", name: "Palau" }, { code: "PS", name: "Palestine" },
    { code: "PA", name: "Panama" }, { code: "PG", name: "Papua New Guinea" }, { code: "PY", name: "Paraguay" },
    { code: "PE", name: "Peru" }, { code: "PH", name: "Philippines" }, { code: "PL", name: "Poland" },
    { code: "PT", name: "Portugal" }, { code: "QA", name: "Qatar" }, { code: "RO", name: "Romania" },
    { code: "RU", name: "Russia" }, { code: "RW", name: "Rwanda" }, { code: "KN", name: "Saint Kitts and Nevis" },
    { code: "LC", name: "Saint Lucia" }, { code: "VC", name: "Saint Vincent and the Grenadines" },
    { code: "WS", name: "Samoa" }, { code: "SM", name: "San Marino" }, { code: "ST", name: "Sao Tome and Principe" },
    { code: "SA", name: "Saudi Arabia" }, { code: "SN", name: "Senegal" }, { code: "RS", name: "Serbia" },
    { code: "SC", name: "Seychelles" }, { code: "SL", name: "Sierra Leone" }, { code: "SG", name: "Singapore" },
    { code: "SK", name: "Slovakia" }, { code: "SI", name: "Slovenia" }, { code: "SB", name: "Solomon Islands" },
    { code: "SO", name: "Somalia" }, { code: "ZA", name: "South Africa" }, { code: "SS", name: "South Sudan" },
    { code: "ES", name: "Spain" }, { code: "LK", name: "Sri Lanka" }, { code: "SD", name: "Sudan" },
    { code: "SR", name: "Suriname" }, { code: "SE", name: "Sweden" }, { code: "CH", name: "Switzerland" },
    { code: "SY", name: "Syria" }, { code: "TW", name: "Taiwan" }, { code: "TJ", name: "Tajikistan" },
    { code: "TZ", name: "Tanzania" }, { code: "TH", name: "Thailand" }, { code: "TL", name: "Timor-Leste" },
    { code: "TG", name: "Togo" }, { code: "TO", name: "Tonga" }, { code: "TT", name: "Trinidad and Tobago" },
    { code: "TN", name: "Tunisia" }, { code: "TR", name: "Turkey" }, { code: "TM", name: "Turkmenistan" },
    { code: "TV", name: "Tuvalu" }, { code: "UG", name: "Uganda" }, { code: "UA", name: "Ukraine" },
    { code: "AE", name: "United Arab Emirates" }, { code: "GB", name: "United Kingdom" },
    { code: "US", name: "United States" }, { code: "UY", name: "Uruguay" }, { code: "UZ", name: "Uzbekistan" },
    { code: "VU", name: "Vanuatu" }, { code: "VE", name: "Venezuela" }, { code: "VN", name: "Vietnam" },
    { code: "YE", name: "Yemen" }, { code: "ZM", name: "Zambia" }, { code: "ZW", name: "Zimbabwe" },
];

export default function GuestSignUpForm() {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const { isRTL } = useRTL();
    const [loading, setLoading] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [showVerificationStep, setShowVerificationStep] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [userId, setUserId] = useState(null);
    const [otp, setOtp] = useState("");
    const [otpVerifying, setOtpVerifying] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
    const [maxDate, setMaxDate] = useState("");
    const [todayDate, setTodayDate] = useState(null);
    const [otpTimer, setOtpTimer] = useState(60); // 1 minute timer for OTP
    const [emailTimer, setEmailTimer] = useState(60); // 1 minute timer for email verification
    const [otpExpired, setOtpExpired] = useState(false);
    const [emailExpired, setEmailExpired] = useState(false);
    const [otpError, setOtpError] = useState(null); // For showing prominent OTP errors
    const [phoneBlocked, setPhoneBlocked] = useState(false); // For phone blocked state
    const [blockTimeRemaining, setBlockTimeRemaining] = useState(0); // Minutes remaining for block

    // Set max date only on client side to prevent hydration mismatch
    useEffect(() => {
        setMaxDate(new Date().toISOString().split("T")[0]);
        setTodayDate(new Date());
    }, []);

    // OTP Timer Effect
    useEffect(() => {
        if (showVerificationStep && !phoneVerified && otpTimer > 0) {
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
    }, [showVerificationStep, phoneVerified, otpTimer]);

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

    // Email validation hook
    const { emailStatus, checkEmailDebounced, resetEmailStatus } = useEmailValidation();

    // Memoize validation schema to prevent hydration mismatch
    const validationSchema = useMemo(() => {
        if (!todayDate) {
            // Return a schema without date validation until client-side date is set
            return Yup.object({
                first_name: Yup.string()
                    .required(t("auth.firstNameRequired") || "First name is required")
                    .min(2, t("auth.firstNameMin") || "First name must be at least 2 characters"),
                last_name: Yup.string()
                    .required(t("auth.lastNameRequired") || "Last name is required")
                    .min(2, t("auth.lastNameMin") || "Last name must be at least 2 characters"),
                email: Yup.string()
                    .required(t("auth.emailRequired") || "Email is required")
                    .test('gmail-only', t("auth.gmailOnly") || "Only Gmail addresses are allowed. Please use an email ending with @gmail.com", function (value) {
                        if (!value) return true;
                        const emailLower = value.toLowerCase().trim();
                        return emailLower.endsWith('@gmail.com');
                    })
                    .test('gmail-format', t("auth.gmailFormat") || "Invalid Gmail address format", function (value) {
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
                gender: Yup.mixed()
                    .required(t("auth.genderRequired") || "Gender is required")
                    .test('is-valid-gender', t("auth.genderInvalid") || "Please select a valid gender", function (value) {
                        if (value === "" || value === null || value === undefined) return false;
                        const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
                        return !isNaN(numValue) && [1, 2, 3].includes(numValue);
                    }),
                date_of_birth: Yup.string()
                    .required(t("auth.dobRequired") || "Date of birth is required")
                    .test('valid-format', t("auth.dobInvalidFormat") || "Date must be in DD/MM/YYYY format", function (value) {
                        if (!value) return false;
                        // Check if it's a complete DD/MM/YYYY format
                        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
                            return false;
                        }
                        return true;
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
        }

        return Yup.object({
            first_name: Yup.string()
                .required(t("auth.firstNameRequired") || "First name is required")
                .min(2, t("auth.firstNameMin") || "First name must be at least 2 characters"),
            last_name: Yup.string()
                .required(t("auth.lastNameRequired") || "Last name is required")
                .min(2, t("auth.lastNameMin") || "Last name must be at least 2 characters"),
            email: Yup.string()
                .required(t("auth.emailRequired") || "Email is required")
                .test('gmail-only', t("auth.gmailOnly") || "Only Gmail addresses are allowed. Please use an email ending with @gmail.com", function (value) {
                    if (!value) return true;
                    const emailLower = value.toLowerCase().trim();
                    return emailLower.endsWith('@gmail.com');
                })
                .test('gmail-format', t("auth.gmailFormat") || "Invalid Gmail address format", function (value) {
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
            gender: Yup.mixed()
                .required(t("auth.genderRequired") || "Gender is required")
                .test('is-valid-gender', t("auth.genderInvalid") || "Please select a valid gender", function (value) {
                    if (value === "" || value === null || value === undefined) return false;
                    const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
                    return !isNaN(numValue) && [1, 2, 3].includes(numValue);
                }),
            date_of_birth: Yup.string()
                .required(t("auth.dobRequired") || "Date of birth is required")
                .test('valid-format', t("auth.dobInvalidFormat") || "Date must be in DD/MM/YYYY format", function (value) {
                    if (!value) return false;
                    // Check if it's a complete DD/MM/YYYY format
                    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
                        return false;
                    }
                    return true;
                })
                .test('valid-date', t("auth.dobInvalidDate") || "Please enter a valid date", function (value) {
                    if (!value) return false;
                    const [day, month, year] = value.split('/');
                    const dayNum = parseInt(day, 10);
                    const monthNum = parseInt(month, 10);
                    const yearNum = parseInt(year, 10);

                    // Validate month and day ranges
                    if (monthNum < 1 || monthNum > 12) return false;
                    if (dayNum < 1 || dayNum > 31) return false;

                    // Check for valid date
                    const dateObj = new Date(`${year}-${month}-${day}`);
                    if (isNaN(dateObj.getTime())) return false;

                    // Check if date is in future
                    if (dateObj > new Date()) return false;

                    return true;
                })
                .test('min-age', t("auth.dobMinAge") || "You must be at least 18 years old", function (value) {
                    if (!value) return false;
                    const [day, month, year] = value.split('/');
                    const birthDate = new Date(`${year}-${month}-${day}`);
                    const today = new Date();
                    const age = today.getFullYear() - birthDate.getFullYear();
                    const monthDiff = today.getMonth() - birthDate.getMonth();
                    const dayDiff = today.getDate() - birthDate.getDate();

                    // Check if user has reached 18th birthday
                    if (age > 18) return true;
                    if (age === 18) {
                        if (monthDiff > 0) return true;
                        if (monthDiff === 0 && dayDiff >= 0) return true;
                    }
                    return false;
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
    }, [t, todayDate]);

    const formik = useFormik({
        initialValues: {
            first_name: "",
            last_name: "",
            email: "",
            phone_number: "",
            country_code: "+966", // Default to Saudi Arabia
            gender: "", // Empty string for select dropdown
            date_of_birth: "", // Keep as string for date input
            country: "",
            city: "",
            acceptPrivacy: false,
            acceptTerms: false,
        },
        validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        enableReinitialize: false,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                // Normalize date_of_birth for API
                let dateOfBirth = values.date_of_birth;

                // If user typed DD/MM/YYYY, convert safely to YYYY-MM-DD
                if (dateOfBirth && /^\d{2}\/\d{2}\/\d{4}$/.test(dateOfBirth)) {
                    const [day, month, year] = dateOfBirth.split('/');
                    const dayNum = parseInt(day, 10);
                    const monthNum = parseInt(month, 10);

                    // Basic guard against invalid dates like 02/20/2002 (month 20)
                    if (
                        Number.isInteger(dayNum) &&
                        Number.isInteger(monthNum) &&
                        monthNum >= 1 &&
                        monthNum <= 12 &&
                        dayNum >= 1 &&
                        dayNum <= 31
                    ) {
                        dateOfBirth = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
                    } else {
                        throw new Error("Invalid date of birth format. Please use DD/MM/YYYY (e.g., 25/12/1990).");
                    }
                }

                // If not DD/MM/YYYY but also not ISO, reject instead of sending a broken value
                if (dateOfBirth && !/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
                    throw new Error("Invalid date of birth format. Please use DD/MM/YYYY (e.g., 25/12/1990).");
                }

                const payload = {
                    ...values,
                    date_of_birth: dateOfBirth,
                    profile_image: profileImage || "",
                    role: 1, // Guest role
                    language: i18n.language || "en",
                    country: values.country,
                    city: values.city,
                };

                const response = await SignUpApi(payload);

                if (response?.status === 1 || response?.status === true) {
                    // Store user ID for OTP verification
                    setUserId(response?.data?.user?._id);
                    setShowVerificationStep(true);
                    toast.success(
                        response.message ||
                        t("auth.verificationEmailSent") ||
                        "Account created! Please verify your email and enter the OTP sent to your phone."
                    );
                } else {
                    toast.error(response.message || t("auth.signupError") || "Signup failed. Please try again.");
                }
            } catch (error) {
                console.error("Signup error:", error);
                toast.error(
                    error?.response?.data?.message ||
                    error?.message ||
                    t("auth.signupError") ||
                    "An error occurred. Please try again."
                );
            } finally {
                setLoading(false);
            }
        },
    });

    const handleResendVerification = async () => {
        try {
            const response = await fetch(`${BASE_API_URL}user/resend-verification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'lang': i18n.language || 'en'
                },
                body: JSON.stringify({
                    email: formik.values.email
                })
            });
            const data = await response.json();
            if (data?.status === 1 || data?.success) {
                // Reset email timer
                setEmailTimer(60);
                setEmailExpired(false);
                toast.success(data.message || t("auth.verificationEmailResentSuccess") || "Verification email resent successfully!");
            } else {
                toast.error(data.message || t("auth.failedToResendVerificationEmail") || "Failed to resend verification email.");
            }
        } catch (error) {
            console.error("Resend verification error:", error);
            toast.error(t("auth.failedToResendVerificationEmailTryAgain") || "Failed to resend verification email. Please try again.");
        }
    };

    const handleResendOtp = async () => {
        if (!userId || !formik.values.phone_number || !formik.values.country_code) {
            toast.error(t("auth.missingInfoResend") || "Missing information to resend OTP");
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`${BASE_API_URL}user/resend-signup-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'lang': i18n.language || 'en'
                },
                body: JSON.stringify({
                    user_id: userId,
                    phone_number: formik.values.phone_number,
                    country_code: formik.values.country_code
                })
            });
            const data = await response.json();
            if (data?.status === 1 || data?.success) {
                // Reset OTP timer
                setOtpTimer(60);
                setOtpExpired(false);
                setOtp(""); // Clear previous OTP
                toast.success(data.message || t("auth.otpResentSuccess") || "OTP resent successfully!");
            } else {
                toast.error(data.message || t("OTP.failedToResendOTP") || "Failed to resend OTP.");
            }
        } catch (error) {
            console.error("Resend OTP error:", error);
            toast.error(t("OTP.failedToResendOTP") || "Failed to resend OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otpExpired) {
            toast.error(t("auth.otpExpired") || "OTP has expired. Please request a new one.");
            return;
        }
        if (!otp || otp.length !== 6) {
            toast.error(t("auth.validOTPRequired") || "Please enter a valid 6-digit OTP");
            return;
        }
        if (!userId || !formik.values.phone_number || !formik.values.country_code) {
            toast.error(t("auth.missingInfoVerify") || "Missing information to verify OTP");
            return;
        }
        try {
            setOtpVerifying(true);
            setOtpError(null); // Clear previous errors
            const response = await fetch(`${BASE_API_URL}user/verify-signup-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'lang': i18n.language || 'en'
                },
                body: JSON.stringify({
                    user_id: userId,
                    phone_number: formik.values.phone_number,
                    country_code: formik.values.country_code,
                    otp: otp
                })
            });
            const data = await response.json();
            if (data?.status === 1 || data?.success) {
                setPhoneVerified(true);
                setOtpTimer(0); // Stop timer
                setOtpError(null);
                setPhoneBlocked(false);
                if (data?.data?.user?.is_verified) {
                    // Both verified - success!
                    toast.success(data.message || t("auth.accountVerifiedLogin") || "Account verified successfully! You can now login.");
                    setTimeout(() => {
                        router.push("/login");
                    }, 2000);
                } else {
                    toast.success(data.message || t("auth.phoneVerifiedEmail") || "Phone verified! Please verify your email to complete registration.");
                }
            } else {
                // Parse error message for blocked phone or too many attempts
                const errorMessage = data.message || "";
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
                toast.error(errorMessage || t("auth.invalidOTP") || "Invalid OTP. Please try again.");
            }
        } catch (error) {
            console.error("Verify OTP error:", error);
            const errorMsg = t("auth.otpVerifyFailed") || "Failed to verify OTP. Please try again.";
            setOtpError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setOtpVerifying(false);
        }
    };

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
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <Icon icon="material-symbols:person-add" className="w-6 h-6 text-[#a797cc]" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        {t("auth.createGuestAccount") || "Create Guest Account"}
                    </h1>
                    <p className="text-sm text-gray-600">
                        {t("auth.guestSignupSubtitle") || "Join Zuroona and discover amazing events"}
                    </p>
                </div>

                <TooltipProvider>
                    {/* Form */}
                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        {/* Profile Image */}
                        <div className="flex justify-center mb-4">
                            <ProfileImageUpload
                                onImageChange={(image) => {
                                    setProfileImage(image);
                                    console.log("[GUEST-SIGNUP] Profile image set:", image);
                                }}
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
                                        {t("signup.tab5") || "Email"} *
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
                                        checkEmailDebounced(e.target.value, 'user');
                                    }}
                                    onBlur={(e) => {
                                        formik.handleBlur(e);
                                        if (e.target.value) {
                                            checkEmailDebounced(e.target.value, 'user');
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
                                    placeholder={t("auth.gmailPlaceholder") || "your.email@gmail.com"}
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
                        <button
                            onClick={() => setIsLoginModalOpen(true)}
                            className="text-[#a797cc] hover:text-[#8ba179] font-semibold"
                        >
                            <span suppressHydrationWarning>{t("auth.login") || "Login"}</span>
                        </button>
                    </p>
                    <p className="text-gray-600 mt-2">
                        {t("auth.wantToBeHost") || "Want to become a host?"}{" "}
                        <button
                            onClick={() => router.push("/signup/host")}
                            className="text-[#a797cc] hover:text-[#8ba179] font-semibold"
                        >
                            {t("auth.signupAsHostOrGuest") || "Join as Host or Guest"}
                        </button>
                    </p>
                </div>
            </div>

            {/* Verification Step Modal */}
            {showVerificationStep && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
                    >
                        <div className="text-center">
                            {/* Success Icon */}
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                                <Icon icon="material-symbols:mark-email-read" className="w-10 h-10 text-green-600" />
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {t("auth.verifyYourAccount") || "Verify Your Account"}
                            </h2>

                            {/* Verification Status */}
                            <div className="mb-6 space-y-3">
                                {/* Email Verification Status */}
                                <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${emailVerified ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                                    }`}>
                                    <Icon
                                        icon={emailVerified ? "material-symbols:check-circle" : "material-symbols:schedule"}
                                        className="w-5 h-5"
                                    />
                                    <span className="text-sm font-medium">
                                        {emailVerified
                                            ? t("auth.emailVerified") || "Email Verified ✓"
                                            : t("auth.checkEmailLink") || "Check your email and click the verification link"}
                                    </span>
                                </div>

                                {/* Phone Verification Status */}
                                <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${phoneVerified ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                                    }`}>
                                    <Icon
                                        icon={phoneVerified ? "material-symbols:check-circle" : "material-symbols:schedule"}
                                        className="w-5 h-5"
                                    />
                                    <span className="text-sm font-medium">
                                        {phoneVerified
                                            ? t("auth.phoneVerified") || "Phone Verified ✓"
                                            : t("auth.enterOTPPhone") || "Enter OTP sent to your phone"}
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
                                    {otpExpired && (
                                        <p className="mt-2 text-sm text-red-600 font-medium">
                                            {t("auth.otpExpired") || "OTP has expired. Please request a new one."}
                                        </p>
                                    )}
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
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="space-y-3">
                                {!phoneVerified && (
                                    <button
                                        onClick={handleVerifyOtp}
                                        disabled={otpVerifying || otp.length !== 6 || otpExpired || phoneBlocked}
                                        className="w-full py-3 px-4 bg-[#a797cc] hover:bg-[#8ba179] text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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

                                <div className="space-y-2">
                                    <button
                                        onClick={handleResendVerification}
                                        disabled={loading || (emailTimer > 0 && !emailExpired)}
                                        className={`w-full py-3 px-4 border-2 rounded-lg font-semibold transition-colors ${
                                            loading || (emailTimer > 0 && !emailExpired)
                                                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                                                : "border-gray-300 hover:border-gray-400 text-gray-700"
                                        }`}
                                    >
                                        {t("auth.resendVerificationEmail") || "Resend Verification Email"}
                                    </button>
                                    {emailTimer > 0 && !emailExpired && (
                                        <p className="text-center text-sm text-gray-600">
                                            {t("auth.emailTimer") || "Resend in"} {Math.floor(emailTimer / 60)}:{(emailTimer % 60).toString().padStart(2, '0')}
                                        </p>
                                    )}
                                    {emailExpired && (
                                        <p className="text-center text-sm text-red-600 font-medium">
                                            {t("auth.emailLinkExpired") || "Verification link has expired. Please request a new one."}
                                        </p>
                                    )}
                                </div>

                                {/* Login Button - Always Visible */}
                                <button
                                    onClick={() => {
                                        setShowVerificationStep(false);
                                        setIsLoginModalOpen(true);
                                    }}
                                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <Icon icon="material-symbols:login" className="w-5 h-5" />
                                    <span>{t("auth.login") || "Login"}</span>
                                </button>

                                {(emailVerified && phoneVerified) && (
                                    <button
                                        onClick={() => router.push("/login")}
                                        className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                                    >
                                        {t("goToLogin") || "Go to Login"}
                                    </button>
                                )}

                                <button
                                    onClick={() => setShowVerificationStep(false)}
                                    className="w-full py-2 px-4 text-gray-500 hover:text-gray-700 text-sm font-medium"
                                >
                                    {t("close") || t("auth.close") || "Close"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Login Modal */}
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />

            {/* Terms & Conditions and Privacy Policy Modals */}
            <TermsOfServiceModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />
            <PrivacyPolicyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
        </motion.div>
    );
}

