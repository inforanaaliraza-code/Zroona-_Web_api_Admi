"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import LoginModal from "../Modal/LoginModal";
import { TOKEN_NAME } from "@/until";
import useAuthStore from "@/store/useAuthStore";
import axios from "axios";
import { BASE_API_URL } from "@/until";

export default function HostSignUpForm() {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [registrationComplete, setRegistrationComplete] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const validationSchema = Yup.object({
        first_name: Yup.string()
            .required(t("auth.firstNameRequired") || "First name is required")
            .min(2, t("auth.firstNameMin") || "First name must be at least 2 characters"),
        last_name: Yup.string()
            .required(t("auth.lastNameRequired") || "Last name is required")
            .min(2, t("auth.lastNameMin") || "Last name must be at least 2 characters"),
        email: Yup.string()
            .required(t("auth.emailRequired") || "Email is required")
            .email(t("auth.emailInvalid") || "Invalid email address"),
        password: Yup.string()
            .required(t("auth.passwordRequired") || "Password is required")
            .min(8, t("auth.passwordMinLength") || "Password must be at least 8 characters")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/])/,
                t("auth.passwordStrength") || "Password must contain uppercase, lowercase, number, and special character"
            ),
        confirmPassword: Yup.string()
            .required(t("auth.confirmPasswordRequired") || "Please confirm your password")
            .oneOf([Yup.ref('password')], t("auth.passwordsMustMatch") || 'Passwords must match'),
        phone_number: Yup.string()
            .required(t("auth.phoneRequired") || "Phone number is required")
            .matches(/^[0-9]+$/, t("auth.phoneInvalid") || "Phone number must contain only digits"),
        country_code: Yup.string()
            .required(t("auth.countryCodeRequired") || "Country code is required"),
        gender: Yup.number()
            .required(t("auth.genderRequired") || "Gender is required")
            .oneOf([1, 2, 3], t("auth.genderInvalid") || "Please select a valid gender"),
        date_of_birth: Yup.date()
            .required(t("auth.dobRequired") || "Date of birth is required")
            .max(new Date(), t("auth.dobFuture") || "Date of birth cannot be in the future"),
    });

    const formik = useFormik({
        initialValues: {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone_number: "",
            country_code: "+966",
            gender: "",
            date_of_birth: "",
            bio: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const payload = {
                    email: values.email.toLowerCase().trim(),
                    password: values.password,
                    confirmPassword: values.confirmPassword,
                    first_name: values.first_name,
                    last_name: values.last_name,
                    phone_number: values.phone_number ? parseInt(values.phone_number) : null,
                    country_code: values.country_code,
                    gender: parseInt(values.gender),
                    date_of_birth: values.date_of_birth,
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
                    setRegistrationComplete(true);
                    toast.success(
                        response.message || 
                        t("auth.hostSignupSuccess") || 
                        "Registration successful! Please check your email to verify your account."
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

    // Show success message after registration
    if (registrationComplete) {
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

                    {/* Email Verification Box */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6 text-left">
                        <div className="flex items-start">
                            <Icon icon="material-symbols:mail-outline" className="w-6 h-6 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-orange-900 mb-2">
                                    {t("auth.verifyYourEmail") || "Verify Your Email"}
                                </h3>
                                <p className="text-sm text-orange-800 mb-4">
                                    {t("auth.verificationEmailSent") || 
                                    `We've sent a verification link to ${userEmail}. Please check your inbox and click the link to verify your email address.`}
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
                        <button
                            onClick={() => router.push("/login")}
                            className="w-full py-3 px-6 bg-[#a797cc] hover:bg-[#d66a0a] text-white font-semibold rounded-lg transition-colors"
                        >
                            {t("auth.goToLogin") || "Go to Login"}
                        </button>
                        <button
                            onClick={() => router.push("/")}
                            className="w-full py-3 px-6 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition-colors"
                        >
                            {t("auth.backToHome") || "Back to Homepage"}
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
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#a797cc] to-[#d66a0a] rounded-full flex items-center justify-center">
                            <Icon icon="material-symbols:star" className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {t("auth.becomeHost") || "Become a Host"}
                    </h1>
                    <p className="text-gray-600">
                        {t("auth.hostSignupSubtitle") || "Create and manage your own events on Zuroona"}
                    </p>
                </div>

                {/* Info Box */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                        <Icon icon="material-symbols:info" className="w-5 h-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-orange-900">
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

                {/* Form */}
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    {/* Profile Image */}
                    <div className="flex justify-center">
                        <ProfileImageUpload
                            onImageChange={(image) => setProfileImage(image)}
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
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#a797cc] focus:border-transparent ${
                                    formik.touched.first_name && formik.errors.first_name
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
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#a797cc] focus:border-transparent ${
                                    formik.touched.last_name && formik.errors.last_name
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
                            {t("auth.email") || "Email"} *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#a797cc] focus:border-transparent ${
                                formik.touched.email && formik.errors.email
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            placeholder={t("auth.emailPlaceholder") || "your.email@example.com"}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                        )}
                    </div>
                    
                    {/* Password Fields */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t("auth.password") || "Password"} *
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#a797cc] focus:border-transparent ${
                                    formik.touched.password && formik.errors.password
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder={t("auth.enterPassword") || "Enter your password"}
                            />
                            {formik.touched.password && formik.errors.password && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
                            )}
                            </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t("auth.confirmPassword") || "Confirm Password"} *
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#a797cc] focus:border-transparent ${
                                    formik.touched.confirmPassword && formik.errors.confirmPassword
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder={t("auth.confirmYourPassword") || "Confirm your password"}
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</p>
                            )}
                            </div>
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
                                value={formik.values.gender}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#a797cc] focus:border-transparent ${
                                    formik.touched.gender && formik.errors.gender
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
                                max={new Date().toISOString().split("T")[0]}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#a797cc] focus:border-transparent ${
                                    formik.touched.date_of_birth && formik.errors.date_of_birth
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            />
                            {formik.touched.date_of_birth && formik.errors.date_of_birth && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.date_of_birth}</p>
                            )}
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t("auth.bio") || "Bio"} (Optional)
                        </label>
                        <textarea
                            name="bio"
                            value={formik.values.bio}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            rows={4}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#a797cc] focus:border-transparent ${
                                formik.touched.bio && formik.errors.bio
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            placeholder={t("auth.bioPlaceholder") || "Tell us about yourself..."}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || !formik.isValid}
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
                            {t("auth.login") || "Login"}
                        </button>
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

            {/* Login Modal */}
            <LoginModal 
                isOpen={isLoginModalOpen} 
                onClose={() => setIsLoginModalOpen(false)} 
            />
        </motion.div>
    );
}
