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

import { LoginApi, PasswordLoginApi } from "@/app/api/setting";
import Loader from "../Loader/Loader";
import { TOKEN_NAME } from "@/until";
import useAuthStore from "@/store/useAuthStore";

export default function EmailLoginForm() {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showResendLink, setShowResendLink] = useState(false);
    const login = useAuthStore((state) => state.login);

    const validationSchema = Yup.object({
        email: Yup.string()
            .required(t("auth.emailRequired") || "Email is required")
            .email(t("auth.emailInvalid") || "Invalid email address"),
        password: Yup.string()
            .required(t("auth.passwordRequired") || "Password is required"),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            setShowResendLink(false);

            try {
                const loginPayload = {
                    email: values.email.toLowerCase().trim(),
                    password: values.password,
                };

                console.log("[LOGIN] Attempting password-based login for:", loginPayload.email);

                // Use the unified login API that handles both users and organizers
                const response = await LoginApi(loginPayload);

                console.log("[LOGIN] Response:", response);

                if (response?.status === 1 || response?.status === true || response?.data?.token) {
                    const token = response?.data?.token || response?.token;
                    const user = response?.data?.user || response?.data?.organizer || response?.data?.result;

                    if (!user) {
                        toast.error(t("auth.loginFailed") || "Login failed. User data not found.");
                        return;
                    }

                    // API handles all validation (email verification, approval status)
                    // But store role for navigation

                    // Store token
                    Cookies.set(TOKEN_NAME, token, { expires: 30 });

                    // Store role in localStorage
                    if (user.role) {
                        localStorage.setItem("user_role", user.role.toString());
                        console.log("[LOGIN] Role stored in localStorage:", user.role);
                    }

                    // Update auth store
                    login(token, user);

                    toast.success(
                        response.message || 
                        t("auth.loginSuccess") || 
                        "Login successful!"
                    );

                    // Navigate based on role
                    if (user.role === 2) {
                        // Organizer/Host - navigate to organizer routes
                        router.push("/joinUsEvent");
                    } else if (user.role === 1) {
                        // Guest - navigate to guest routes
                        router.push("/events");
                    } else {
                        // Fallback
                        router.push("/events");
                    }
                } else {
                    // Show error from API
                    const errorMessage = response?.message || 
                        t("auth.loginFailed") || 
                        "Login failed. Please try again.";
                    
                    toast.error(errorMessage);

                    // Check if it's email verification issue
                    if (errorMessage.toLowerCase().includes("verify") || 
                        errorMessage.toLowerCase().includes("verification") ||
                        errorMessage.toLowerCase().includes("not verified")) {
                        setShowResendLink(true);
                    } else {
                        setShowResendLink(false);
                    }
                }
            } catch (error) {
                console.error("[LOGIN] Error:", error);
                
                const errorMessage = error?.response?.data?.message || 
                    error?.message || 
                    t("auth.loginError") || 
                    "An error occurred. Please try again.";
                
                toast.error(errorMessage);

                // Check if it's email verification issue
                if (errorMessage.toLowerCase().includes("verify") || 
                    errorMessage.toLowerCase().includes("verification") ||
                    errorMessage.toLowerCase().includes("not verified")) {
                    setShowResendLink(true);
                } else if (errorMessage.toLowerCase().includes("approval") || 
                    errorMessage.toLowerCase().includes("pending") ||
                    errorMessage.toLowerCase().includes("rejected")) {
                    // Don't show resend link for approval issues
                    setShowResendLink(false);
                } else {
                    setShowResendLink(false);
                }
            } finally {
                setLoading(false);
            }
        },
    });

    const handleResendVerification = async () => {
        if (!formik.values.email) {
            toast.error(t("auth.enterEmailFirst") || "Please enter your email first");
            return;
        }

        setLoading(true);

        try {
            const axios = require("axios");
            const { BASE_API_URL } = require("@/until");

            const response = await axios.post(
                `${BASE_API_URL}user/resend-verification`,
                {
                    email: formik.values.email.toLowerCase().trim(),
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        lang: i18n.language || "en",
                    },
                }
            );

            if (response.data?.status === 1) {
                toast.success(
                    t("auth.verificationEmailResent") || 
                    "Verification email sent! Please check your inbox."
                );
                setShowResendLink(false);
            } else {
                toast.error(
                    response.data?.message || 
                    t("auth.resendFailed") || 
                    "Failed to resend verification email"
                );
            }
        } catch (error) {
            console.error("[RESEND] Error:", error);
            toast.error(
                error?.response?.data?.message || 
                t("auth.resendError") || 
                "An error occurred while resending verification email"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
        >
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <Image
                        src="/assets/images/main-logo.png"
                        alt="Zuroona"
                        width={120}
                        height={48}
                        className="object-contain"
                    />
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {t("auth.welcomeBack") || "Welcome Back"}
                    </h1>
                    <p className="text-gray-600">
                        {t("auth.loginSubtitle") || "Login to your Zuroona account"}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t("auth.email") || "Email"} *
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Icon icon="material-symbols:mail" className="w-5 h-5 text-brand-orange" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent ${
                                    formik.touched.email && formik.errors.email
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder={t("auth.emailPlaceholder") || "your.email@example.com"}
                                autoComplete="email"
                            />
                        </div>
                        {formik.touched.email && formik.errors.email && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t("auth.password") || "Password"} *
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Icon icon="material-symbols:lock" className="w-5 h-5 text-brand-orange" />
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent ${
                                    formik.touched.password && formik.errors.password
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder={t("auth.enterPassword") || "Enter your password"}
                                autoComplete="current-password"
                            />
                        </div>
                        {formik.touched.password && formik.errors.password && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
                        )}
                    </div>

                    {/* Resend Verification Link */}
                    {showResendLink && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                        >
                            <div className="flex items-start">
                                <Icon icon="material-symbols:info" className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm text-yellow-800 mb-2">
                                        {t("auth.emailNotVerified") || "Your email is not verified yet."}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleResendVerification}
                                        disabled={loading}
                                        className="text-sm font-semibold text-yellow-700 hover:text-yellow-900 underline"
                                    >
                                        {t("auth.resendVerificationEmail") || "Resend Verification Email"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || !formik.isValid}
                        className="w-full py-4 px-6 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        {loading ? (
                            <>
                                <Loader />
                                <span>{t("auth.loggingIn") || "Logging in..."}</span>
                            </>
                        ) : (
                            <>
                                <Icon icon="material-symbols:login" className="w-5 h-5" />
                                <span>{t("auth.login") || "Login"}</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="my-8 flex items-center">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-4 text-sm text-gray-500">
                        {t("auth.or") || "OR"}
                    </span>
                    <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Sign Up Links */}
                <div className="space-y-3">
                    <p className="text-center text-gray-600">
                        {t("auth.dontHaveAccount") || "Don't have an account?"}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => router.push("/signup/guest")}
                            className="py-3 px-4 border-2 border-brand-orange text-brand-orange hover:bg-brand-orange/10 font-semibold rounded-lg transition-colors"
                        >
                            {t("auth.signupAsGuest") || "Signup as Guest"}
                        </button>
                        <button
                            onClick={() => router.push("/signup/host")}
                            className="py-3 px-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors"
                        >
                            {t("auth.signupAsHost") || "Signup as Host"}
                        </button>
                    </div>
                </div>

                {/* Help Text */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        {t("auth.needHelp") || "Need help?"}{" "}
                        <a href="mailto:infozuroona@gmail.com" className="text-brand-orange hover:text-brand-orange/90 font-semibold">
                            {t("auth.contactSupport") || "Contact Support"}
                        </a>
                    </p>
                </div>

                {/* Info Box */}
                <div className="mt-6 bg-brand-light-orange-1 border border-brand-light-orange-1 rounded-lg p-4">
                    <div className="flex items-start">
                        <Icon icon="material-symbols:info" className="w-5 h-5 text-brand-orange mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-orange-900">
                            {t("auth.loginInfo") || "Login with the email address you used during registration. Make sure your email is verified."}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

