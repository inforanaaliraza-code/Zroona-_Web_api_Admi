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

    // Set max date only on client side to prevent hydration mismatch
    useEffect(() => {
        setMaxDate(new Date().toISOString().split("T")[0]);
        setTodayDate(new Date());
    }, []);

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
                date_of_birth: Yup.date()
                    .required(t("auth.dobRequired") || "Date of birth is required"),
                nationality: Yup.string()
                    .required(t("auth.nationalityRequired") || "Nationality is required"),
                city: Yup.string()
                    .required(t("auth.countryOfResidenceRequired") || "Country of Residence is required"),
                acceptPrivacy: Yup.boolean()
                    .oneOf([true], t("auth.privacyRequired") || "You must accept the privacy policy"),
                acceptTerms: Yup.boolean()
                    .oneOf([true], t("termsRequired") || "You must accept the terms and conditions"),
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
            date_of_birth: Yup.date()
                .required(t("auth.dobRequired") || "Date of birth is required")
                .max(todayDate, t("auth.dobFuture") || "Date of birth cannot be in the future")
                .test('min-age', t("auth.dobMinAge") || "You must be at least 18 years old", function (value) {
                    if (!value) return true;
                    const today = new Date();
                    const birthDate = new Date(value);
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
            nationality: Yup.string()
                .required(t("auth.nationalityRequired") || "Nationality is required"),
            city: Yup.string()
                .required(t("auth.countryOfResidenceRequired") || "Country of Residence is required"),
            acceptPrivacy: Yup.boolean()
                .oneOf([true], t("auth.privacyRequired") || "You must accept the privacy policy"),
            acceptPrivacy: Yup.boolean()
                .oneOf([true], t("auth.privacyRequired") || "You must accept the privacy policy"),
            acceptTerms: Yup.boolean()
                .oneOf([true], t("termsRequired") || "You must accept the terms and conditions"),
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
            nationality: "SA", // Default to Saudi Arabia
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
                const payload = {
                    ...values,
                    profile_image: profileImage || "",
                    role: 1, // Guest role
                    language: i18n.language || "en",
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
                toast.success(data.message || t("auth.verificationEmailResent") || "Verification email resent successfully!");
            } else {
                toast.error(data.message || t("auth.resendFailed") || "Failed to resend verification email.");
            }
        } catch (error) {
            console.error("Resend verification error:", error);
            toast.error(t("auth.resendFailed") || "Failed to resend verification email. Please try again.");
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
                toast.success(data.message || t("auth.otpResentSuccess") || "OTP resent successfully!");
            } else {
                toast.error(data.message || t("auth.otpResendFailed") || "Failed to resend OTP.");
            }
        } catch (error) {
            console.error("Resend OTP error:", error);
            toast.error(t("auth.otpResendFailed") || "Failed to resend OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
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
                toast.error(data.message || t("auth.invalidOTP") || "Invalid OTP. Please try again.");
            }
        } catch (error) {
            console.error("Verify OTP error:", error);
            toast.error(t("auth.otpVerifyFailed") || "Failed to verify OTP. Please try again.");
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
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                            <Icon icon="material-symbols:person-add" className="w-8 h-8 text-[#a797cc]" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {t("auth.createGuestAccount") || "Create Guest Account"}
                    </h1>
                    <p className="text-gray-600">
                        {t("auth.guestSignupSubtitle") || "Join Zuroona and discover amazing events"}
                    </p>
                </div>


                {/* Form */}
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    {/* Profile Image */}
                    <div className="flex justify-center mb-6">
                        <ProfileImageUpload
                            onImageChange={(image) => {
                                setProfileImage(image);
                                console.log("[GUEST-SIGNUP] Profile image set:", image);
                            }}
                        />
                    </div>

                    {/* Name Fields */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t("auth.firstName") || "First Name"} *
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                value={formik.values.first_name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#a797cc] focus:border-transparent ${formik.touched.first_name && formik.errors.first_name
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    }`}
                                placeholder={t("auth.firstNamePlaceholder") || "Enter your first name"}
                            />
                            {formik.touched.first_name && formik.errors.first_name && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.first_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t("auth.lastName") || "Last Name"} *
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                value={formik.values.last_name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#a797cc] focus:border-transparent ${formik.touched.last_name && formik.errors.last_name
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    }`}
                                placeholder={t("auth.lastNamePlaceholder") || "Enter your last name"}
                            />
                            {formik.touched.last_name && formik.errors.last_name && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.last_name}</p>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t("signup.tab5") || "Email"} *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formik.values.email}
                            onChange={(e) => {
                                formik.handleChange(e);
                                // Real-time email validation
                                checkEmailDebounced(e.target.value, 'user');
                            }}
                            onBlur={(e) => {
                                formik.handleBlur(e);
                                // Final check on blur
                                if (e.target.value) {
                                    checkEmailDebounced(e.target.value, 'user');
                                }
                            }}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#a797cc] focus:border-transparent ${formik.touched.email && formik.errors.email
                                ? "border-red-500"
                                : emailStatus.status === 'valid'
                                    ? "border-green-500"
                                    : emailStatus.status === 'invalid' || emailStatus.status === 'not_exists'
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            placeholder={t("auth.gmailPlaceholder") || "your.email@gmail.com"}
                        />
                        {/* Real-time status message */}
                        {formik.values.email && (
                            <div className="mt-1">
                                {emailStatus.isChecking && (
                                    <p className="text-sm text-blue-600 flex items-center gap-1">
                                        <span className="animate-spin">⏳</span> {t("auth.checkingEmail") || "Checking email..."}
                                    </p>
                                )}
                                {!emailStatus.isChecking && emailStatus.message && (
                                    <p className={`text-sm ${emailStatus.status === 'valid'
                                        ? "text-green-600"
                                        : emailStatus.status === 'invalid' || emailStatus.status === 'not_exists'
                                            ? "text-red-600"
                                            : "text-gray-600"
                                        }`}>
                                        {emailStatus.status === 'valid' && '✓ '}
                                        {emailStatus.message}
                                    </p>
                                )}
                            </div>
                        )}
                        {/* Formik validation error */}
                        {formik.touched.email && formik.errors.email && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                        )}
                    </div>


                    {/* Phone Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t("auth.phoneNumber") || "Phone Number"} *
                        </label>
                        <NumberInput
                            formik={formik}
                            mobileNumberField="phone_number"
                            countryCodeField="country_code"
                        />
                    </div>

                    {/* Gender & DOB */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t("auth.gender") || "Gender"} *
                            </label>
                            <select
                                name="gender"
                                value={formik.values.gender === undefined || formik.values.gender === null ? "" : String(formik.values.gender)}
                                onChange={(e) => {
                                    // Convert string to number for formik validation
                                    const value = e.target.value;
                                    const numValue = value ? parseInt(value, 10) : "";
                                    formik.setFieldValue("gender", numValue, false);
                                }}
                                onBlur={formik.handleBlur}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#a797cc] focus:border-transparent ${formik.touched.gender && formik.errors.gender
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    }`}
                            >
                                <option value="">{t("auth.selectGender") || "Select gender"}</option>
                                <option value="1">{t("auth.male") || "Male"}</option>
                                <option value="2">{t("auth.female") || "Female"}</option>
                                <option value="3">{t("auth.other") || "Other"}</option>
                            </select>
                            {formik.touched.gender && formik.errors.gender && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.gender}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t("auth.dateOfBirth") || "Date of Birth"} *
                            </label>
                            <input
                                type="date"
                                name="date_of_birth"
                                value={formik.values.date_of_birth}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                max={maxDate}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#a797cc] focus:border-transparent ${formik.touched.date_of_birth && formik.errors.date_of_birth
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    }`}
                            />
                            {formik.touched.date_of_birth && formik.errors.date_of_birth && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.date_of_birth}</p>
                            )}
                        </div>
                    </div>

                    {/* Nationality */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t("auth.nationality") || "Nationality"} *
                        </label>
                        <select
                            name="nationality"
                            value={formik.values.nationality}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formik.touched.nationality && formik.errors.nationality
                                ? "border-red-500"
                                : "border-gray-300"
                                }`}
                        >
                            <option value="">{t("auth.selectNationality") || "Select nationality"}</option>
                            {countries.map((country) => (
                                <option key={country.code} value={country.code}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                        {formik.touched.nationality && formik.errors.nationality && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.nationality}</p>
                        )}
                    </div>

                    {/* Country of Residence */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t("countryOfResidence") || "Country of Residence"} *
                        </label>
                        <select
                            name="city"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#a797cc] focus:border-transparent ${formik.touched.city && formik.errors.city
                                ? "border-red-500"
                                : "border-gray-300"
                                }`}
                        >
                            <option value="">{t("auth.selectCountryOfResidence") || "Select Country of Residence"}</option>
                            {countries.map((country) => (
                                <option key={country.code} value={country.code}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                        {formik.touched.city && formik.errors.city && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.city}</p>
                        )}
                    </div>

                    {/* Terms and Conditions & Privacy Policy */}
                    <div className="mb-6">
                        <div className="flex items-start gap-3">
                            <div className="flex items-center h-5">
                                <input
                                    id="acceptTermsAndPrivacy"
                                    type="checkbox"
                                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-[#a797cc] text-[#a797cc]"
                                    checked={formik.values.acceptTerms && formik.values.acceptPrivacy}
                                    onChange={(e) => {
                                        const isChecked = e.target.checked;
                                        formik.setFieldValue("acceptTerms", isChecked);
                                        formik.setFieldValue("acceptPrivacy", isChecked);
                                        formik.setFieldTouched("acceptTerms", true);
                                        formik.setFieldTouched("acceptPrivacy", true);
                                    }}
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label
                                    htmlFor="acceptTermsAndPrivacy"
                                    className="font-medium text-gray-900 cursor-pointer"
                                >
                                    {t("signup.tab22") || "By signing up, you agree to our"}{" "}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setIsTermsModalOpen(true);
                                        }}
                                        className="text-[#a797cc] hover:underline font-semibold focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:ring-offset-1 rounded"
                                    >
                                        {t("termsAndConditions") || "Terms & Conditions"}
                                    </button>
                                    {" "}{t("signup.tab24") || "and"}{" "}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setIsPrivacyModalOpen(true);
                                        }}
                                        className="text-[#a797cc] hover:underline font-semibold focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:ring-offset-1 rounded"
                                    >
                                        {t("privacyPolicy") || "Privacy Policy"}
                                    </button>
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                {(formik.touched.acceptTerms && formik.errors.acceptTerms) ||
                                    (formik.touched.acceptPrivacy && formik.errors.acceptPrivacy) ? (
                                    <p className="mt-1 text-sm text-red-600">
                                        {formik.errors.acceptTerms || formik.errors.acceptPrivacy ||
                                            "You must accept the Terms & Conditions and Privacy Policy"}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || !formik.values.acceptTerms || !formik.values.acceptPrivacy}
                        className="w-full py-4 px-6 bg-[#a797cc] hover:bg-[#8ba179] text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        {loading ? (
                            <>
                                <Loader />
                                <span>{t("auth.creating") || "Creating..."}</span>
                            </>
                        ) : (
                            <>
                                <Icon icon="material-symbols:arrow-forward" className="w-5 h-5" />
                                <span>{t("auth.createAccount") || "Create Account"}</span>
                            </>
                        )}
                    </button>
                </form>

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
                                        }}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a797cc] focus:border-transparent text-center text-2xl tracking-widest"
                                        placeholder="000000"
                                        maxLength={6}
                                    />
                                    <button
                                        onClick={handleResendOtp}
                                        disabled={loading}
                                        className="mt-2 text-sm text-[#a797cc] hover:text-[#8ba179] font-medium"
                                    >
                                        {t("auth.resendOTP") || "Resend OTP"}
                                    </button>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="space-y-3">
                                {!phoneVerified && (
                                    <button
                                        onClick={handleVerifyOtp}
                                        disabled={otpVerifying || otp.length !== 6}
                                        className="w-full py-3 px-4 bg-[#a797cc] hover:bg-[#8ba179] text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {otpVerifying ? t("auth.verifyingOTP") || "Verifying..." : t("auth.verifyOTP") || "Verify OTP"}
                                    </button>
                                )}

                                <button
                                    onClick={handleResendVerification}
                                    className="w-full py-3 px-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition-colors"
                                >
                                    {t("auth.resendVerificationEmail") || "Resend Verification Email"}
                                </button>

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

