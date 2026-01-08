"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SignUpApi } from "@/app/api/setting";
import { toast } from "react-toastify";
import OtpVerificationModal from "../Modal/OtpVerificationModal";
import ProfileImageUpload from "../ProfileImageUpload/ProfileImageUpload";
import { NumberInput } from "@/components/ui/number-input";
import Loader from "../Loader/Loader";
import S3 from "react-aws-s3";
import { config, BASE_API_URL } from "@/until";
import { Icon } from "@iconify/react";
import axios from "axios";

export default function SignUpForm({ title = "Sign Up", buttonText = "Sign Up" }) {
    const [loading, setLoading] = useState(false);
    const [isOtpOpen, setIsOtpOpen] = useState(false);
    const [showEmailVerificationMessage, setShowEmailVerificationMessage] = useState(false);
    const [signupPhoneNumber, setSignupPhoneNumber] = useState("");
    const [signupCountryCode, setSignupCountryCode] = useState("+966");
    const [signupUserId, setSignupUserId] = useState(null);
    const [userEmail, setUserEmail] = useState("");
    const { t, i18n } = useTranslation();
    const ReactS3Client = new S3(config);

    const closeOtpModal = () => setIsOtpOpen(false);

    const formik = useFormik({
        initialValues: {
            first_name: "",
            last_name: "",
            email: "",
            country_code: "+966",
            phone: "",
            gender: "",
            nationality: "",
            date_of_birth: "",
            description: "",
            profile_image: null,
        },
        validationSchema: Yup.object({
            first_name: Yup.string().required(t('signup.tab16')),
            last_name: Yup.string().required(t('signup.tab16')),
            email: Yup.string()
                .required(t('signup.tab16'))
                .test('gmail-only', "Only Gmail addresses are allowed. Please use an email ending with @gmail.com", function(value) {
                    if (!value) return true;
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
                .email("Invalid email"),
            phone: Yup.string().required(t('signup.tab16')),
            gender: Yup.string().required(t('signup.tab16')),
            nationality: Yup.string().required(t('signup.tab16')),
            date_of_birth: Yup.string().required(t('signup.tab16')),
            description: Yup.string().required(t('signup.tab16')),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                // Convert to JSON payload (passwordless)
                const payload = {
                    first_name: values.first_name,
                    last_name: values.last_name,
                    email: values.email.toLowerCase().trim(),
                    phone_number: parseInt(values.phone),
                    country_code: values.country_code || "+966",
                    gender: parseInt(values.gender),
                    nationality: values.nationality,
                    date_of_birth: values.date_of_birth,
                    description: values.description,
                    profile_image: values.profile_image || "",
                    language: i18n.language || "en",
                };

                const response = await SignUpApi(payload);
                
                if (response?.status === 1 || response?.status === true) {
                    setSignupUserId(response.user?._id);
                    setSignupPhoneNumber(response.user?.phone_number);
                    setSignupCountryCode(response.user?.country_code || "+966");
                    setUserEmail(response.user?.email);

                    if (response.verification_status?.email_sent) {
                        setShowEmailVerificationMessage(true);
                        toast.success(
                            response.message || 
                            t("auth.verificationEmailSent") || 
                            "Account created! Please check your email and phone for verification."
                        );
                    }
                    if (response.verification_status?.otp_sent) {
                        setIsOtpOpen(true);
                    }
                } else {
                    toast.error(response?.message || t("auth.signupError") || "Signup failed. Please try again.");
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

    const handleGenderSelect = (gender) => {
        formik.setFieldValue("gender", gender);
    };

    const handleResendEmailVerification = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${BASE_API_URL}user/resend-verification`,
                { email: userEmail },
                {
                    headers: {
                        "Content-Type": "application/json",
                        lang: i18n.language || "en",
                    },
                }
            );
            const data = response.data;
            if (data?.status === 1 || data?.success) {
                toast.success(data.message || t("auth.verificationEmailResent") || "Verification email resent successfully!");
            } else {
                toast.error(data.message || t("auth.resendFailed") || "Failed to resend verification email.");
            }
        } catch (error) {
            console.error("Resend email error:", error);
            toast.error(error?.response?.data?.message || t("auth.resendError") || "Failed to resend verification email. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_API_URL}user/resend-signup-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'lang': i18n.language || 'en'
                },
                body: JSON.stringify({
                    user_id: signupUserId,
                    phone_number: signupPhoneNumber,
                    country_code: signupCountryCode,
                    role: 1,
                })
            });
            const data = await response.json();
            if (data?.status === 1 || data?.success) {
                toast.success(data.message || t("auth.otpResent") || "OTP resent successfully!");
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

    const inputClasses = `w-full px-4 py-3 rounded-lg border bg-white/90 transition-all duration-200
        ${formik.touched && formik.errors ? 'border-red-300' : 'border-gray-200 hover:border-gray-300 focus:border-[#a797cc]'}
        focus:ring-2 focus:ring-orange-100 focus:outline-none text-gray-700`;
    
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
    const iconContainerClasses = "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400";
    const errorClasses = "mt-1 text-sm text-red-500";

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container px-4 py-12 mx-auto sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl">
                    {/* Form Header */}
                    <div className="mb-8 text-center">
                        <h2 className="mb-2 text-3xl font-bold text-gray-900">
                            {t('signup.title')}
                        </h2>
                        <p className="text-gray-600">{t('signup.subtitle')}</p>
                    </div>

                    {/* Main Form */}
                    <div className="p-8 bg-white rounded-xl shadow-sm">
                        <form onSubmit={formik.handleSubmit} className="space-y-6">
                            {/* Profile Image Upload */}
                            <div className="flex justify-center mb-8">
                                <div className="relative">
                                    <ProfileImageUpload
                                        formik={formik}
                                        ReactS3Client={ReactS3Client}
                                        fieldName="profile_image"
                                    />
                                </div>
                            </div>

                            {/* Name Fields */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="first_name" className={labelClasses}>
                                        {t("signup.tab2")}
                                    </label>
                                    <div className="relative">
                                        <span className={iconContainerClasses}>
                                            <Icon
                                                icon="lucide:user"
                                                className="w-4 h-4 text-[#a797cc]"
                                            />
                                        </span>
                                        <input
                                            type="text"
                                            id="first_name"
                                            className={`pl-10 ${inputClasses}`}
                                            placeholder={t("signup.tab12")}
                                            {...formik.getFieldProps("first_name")}
                                        />
                                    </div>
                                    {formik.touched.first_name && formik.errors.first_name && (
                                        <p className={errorClasses}>{formik.errors.first_name}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="last_name" className={labelClasses}>
                                        {t("signup.tab3")}
                                    </label>
                                    <div className="relative">
                                        <span className={iconContainerClasses}>
                                            <Icon
                                                icon="lucide:user"
                                                className="w-4 h-4 text-[#a797cc]"
                                            />
                                        </span>
                                        <input
                                            type="text"
                                            id="last_name"
                                            className={`pl-10 ${inputClasses}`}
                                            placeholder={t("signup.tab13")}
                                            {...formik.getFieldProps("last_name")}
                                        />
                                    </div>
                                    {formik.touched.last_name && formik.errors.last_name && (
                                        <p className={errorClasses}>{formik.errors.last_name}</p>
                                    )}
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <label htmlFor="email" className={labelClasses}>
                                    {t("signup.tab5")}
                                </label>
                                <div className="relative">
                                    <span className={iconContainerClasses}>
                                        <Icon
                                            icon="lucide:mail"
                                            className="w-4 h-4 text-[#a797cc]"
                                        />
                                    </span>
                                    <input
                                        type="email"
                                        id="email"
                                        className={`pl-10 ${inputClasses}`}
                                        placeholder={t("signup.tab14")}
                                        {...formik.getFieldProps("email")}
                                    />
                                </div>
                                {formik.touched.email && formik.errors.email && (
                                    <p className={errorClasses}>{formik.errors.email}</p>
                                )}
                            </div>

                            {/* Phone Input */}
                            <div>
                                <label className={labelClasses}>
                                    {t("signup.tab4")}
                                </label>
                                <NumberInput
                                    formik={formik}
                                    mobileNumberField="phone"
                                    countryCodeField="country_code"
                                />
                            </div>

                            {/* Gender Selection */}
                            <div>
                                <label className={labelClasses}>
                                    {t("signup.tab6")}
                                </label>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    {["tab7", "tab8"].map((tab, index) => {
                                        const genderText = t(`signup.${tab}`);
                                        const genderImageMap = {
                                            ذكر: "male",
                                            أنثى: "female",
                                            Male: "male",
                                            Female: "female",
                                        };
                                        const imageFile = genderImageMap[genderText] || "";
                                        const isSelected = formik.values.gender === String(index + 1);

                                        return (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => handleGenderSelect(String(index + 1))}
                                                className={`flex-1 flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border transition-all duration-200
                                                    ${isSelected
                                                        ? "border-[#a797cc] bg-orange-50 text-[#a797cc]"
                                                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                                                    }`}
                                            >
                                                <Image
                                                    src={`/assets/images/signup/${imageFile}.png`}
                                                    height={18}
                                                    width={18}
                                                    alt={genderText}
                                                    priority
                                                    unoptimized
                                                />
                                                <span>
                                                    {genderText}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                                {formik.touched.gender && formik.errors.gender && (
                                    <p className={errorClasses}>{formik.errors.gender}</p>
                                )}
                            </div>

                            {/* Nationality */}
                            <div>
                                <label htmlFor="nationality" className={labelClasses}>
                                    {t("auth.nationality")}
                                </label>
                                <div className="relative">
                                    <span className={iconContainerClasses}>
                                        <Icon
                                            icon="lucide:user"
                                            className="w-4 h-4 text-[#a797cc]"
                                        />
                                    </span>
                                    <input
                                        type="text"
                                        id="nationality"
                                        className={`pl-10 ${inputClasses}`}
                                        placeholder={t("auth.enterNationality")}
                                        {...formik.getFieldProps("nationality")}
                                    />
                                </div>
                                {formik.touched.nationality && formik.errors.nationality && (
                                    <p className={errorClasses}>{formik.errors.nationality}</p>
                                )}
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label htmlFor="date_of_birth" className={labelClasses}>
                                    {t("signup.tab10")}
                                </label>
                                <div className="relative">
                                    <span className={iconContainerClasses}>
                                        <Image
                                            src="/assets/images/signup/calendar-event.png"
                                            height={18}
                                            width={18}
                                            alt="Calendar Icon"
                                            priority
                                            unoptimized
                                        />
                                    </span>
                                    <input
                                        type="date"
                                        id="date_of_birth"
                                        className={`pl-10 ${inputClasses}`}
                                        max={new Date().toISOString().split("T")[0]}
                                        {...formik.getFieldProps("date_of_birth")}
                                    />
                                </div>
                                {formik.touched.date_of_birth && formik.errors.date_of_birth && (
                                    <p className={errorClasses}>{formik.errors.date_of_birth}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className={labelClasses}>
                                    {t("signup.tab15")}
                                </label>
                                <div className="relative">
                                    <span className="absolute top-3 left-3 text-gray-400 pointer-events-none">
                                        <Image
                                            src="/assets/images/signup/bio.png"
                                            height={18}
                                            width={18}
                                            alt="Bio Icon"
                                            priority
                                            unoptimized
                                        />
                                    </span>
                                    <textarea
                                        id="description"
                                        rows="4"
                                        className={`pl-10 resize-none ${inputClasses}`}
                                        placeholder={t("signup.tab15")}
                                        {...formik.getFieldProps("description")}
                                    />
                                </div>
                                {formik.touched.description && formik.errors.description && (
                                    <p className={errorClasses}>{formik.errors.description}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200
                                        ${loading
                                            ? "bg-orange-400/80 cursor-not-allowed"
                                            : "bg-[#a797cc] hover:bg-[#e06a0b] active:bg-[#d66408]"
                                        }`}
                                >
                                    {loading ? (
                                        <div className="flex gap-2 justify-center items-center">
                                            <Loader color="#fff" height="20" />
                                            <span>{t('signup.processing')}</span>
                                        </div>
                                    ) : (
                                        t('signup.submit')
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Email Verification Message */}
            {showEmailVerificationMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-md mx-4">
                        <div className="text-center mb-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Icon icon="material-symbols:check-circle" className="w-12 h-12 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {t("auth.registrationSuccessful") || "Registration Successful!"}
                            </h2>
                            <p className="text-gray-600 mb-6">
                                {t("auth.verificationEmailSent") || 
                                `We've sent a verification link to ${userEmail}. Please check your inbox and click the link to verify your email address.`}
                            </p>
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={handleResendEmailVerification}
                                disabled={loading}
                                className="w-full py-3 px-4 bg-[#a797cc] hover:bg-[#d66a0a] text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <Loader /> {t("auth.sending") || "Sending..."}
                                    </span>
                                ) : (
                                    t("auth.resendVerificationEmail") || "Resend Verification Email"
                                )}
                            </button>
                            <button
                                onClick={() => setShowEmailVerificationMessage(false)}
                                className="w-full py-3 px-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition-colors"
                            >
                                {t("auth.close") || "Close"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* OTP Verification Modal - Simple inline version for signup */}
            {isOtpOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-md mx-4">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {t("auth.verifyPhone") || "Verify Your Phone Number"}
                            </h2>
                            <p className="text-gray-600 mb-4">
                                {t("auth.otpSentTo") || `We've sent a verification code to ${signupCountryCode}${signupPhoneNumber}`}
                            </p>
                        </div>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const otp = e.target.otp.value;
                            if (!otp || otp.length !== 6) {
                                toast.error(t("auth.invalidOtp") || "Please enter a valid 6-digit OTP");
                                return;
                            }
                            setLoading(true);
                            try {
                                const response = await fetch(`${BASE_API_URL}user/verify-signup-otp`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'lang': i18n.language || 'en'
                                    },
                                    body: JSON.stringify({
                                        user_id: signupUserId,
                                        phone_number: signupPhoneNumber,
                                        country_code: signupCountryCode,
                                        otp: otp
                                    })
                                });
                                const data = await response.json();
                                if (data?.status === 1 || data?.success) {
                                    setIsOtpOpen(false);
                                    if (data?.data?.user?.is_verified) {
                                        toast.success(data.message || t("auth.accountVerified") || "Account verified successfully! You can now login.");
                                        setTimeout(() => {
                                            window.location.href = "/login";
                                        }, 2000);
                                    } else {
                                        toast.success(data.message || t("auth.phoneVerified") || "Phone verified! Please verify your email to complete registration.");
                                    }
                                } else {
                                    toast.error(data.message || t("auth.invalidOtp") || "Invalid OTP. Please try again.");
                                }
                            } catch (error) {
                                console.error("Verify OTP error:", error);
                                toast.error(t("auth.otpVerifyFailed") || "Failed to verify OTP. Please try again.");
                            } finally {
                                setLoading(false);
                            }
                        }}>
                            <div className="mb-6">
                                <input
                                    type="text"
                                    name="otp"
                                    maxLength={6}
                                    pattern="[0-9]{6}"
                                    placeholder="000000"
                                    className="w-full px-4 py-3 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#a797cc] focus:ring-2 focus:ring-[#a797cc] outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-[#a797cc] hover:bg-[#d66a0a] text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <Loader /> {t("auth.verifying") || "Verifying..."}
                                        </span>
                                    ) : (
                                        t("auth.verify") || "Verify"
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={loading}
                                    className="w-full py-3 px-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {t("auth.resendOtp") || "Resend OTP"}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeOtpModal}
                                    className="w-full py-3 px-4 text-gray-600 hover:text-gray-800 font-semibold rounded-lg transition-colors"
                                >
                                    {t("auth.close") || "Close"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
