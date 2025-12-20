"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Cookies from "js-cookie";

import Modal from "../common/Modal";
import Loader from "../Loader/Loader";
import { LoginApi } from "@/app/api/setting";
import { TOKEN_NAME } from "@/until";
import useAuthStore from "@/store/useAuthStore";

export default function EmailLoginModal({ isOpen, onClose, returnUrl = "/" }) {
    const { t, i18n } = useTranslation();
    const { push } = useRouter();
    const [loading, setLoading] = useState(false);
    const [showResendLink, setShowResendLink] = useState(false);
    const login = useAuthStore((state) => state.login);

    const validationSchema = Yup.object({
        email: Yup.string()
            .required(t("auth.emailRequired") || "Email is required")
            .email(t("auth.emailInvalid") || "Invalid email address"),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            setShowResendLink(false);

            try {
                const payload = {
                    email: values.email.toLowerCase().trim(),
                };

                console.log("[LOGIN-MODAL] Attempting login for:", payload.email);

                const response = await LoginApi(payload);

                if (response?.status === 1 || response?.data?.token) {
                    const token = response?.data?.token || response?.token;
                    const user = response?.data?.user || response?.data?.result;

                    // Store token
                    Cookies.set(TOKEN_NAME, token, { expires: 30 });

                    // Update auth store
                    login(token, user);

                    toast.success(
                        response.message || 
                        t("auth.loginSuccess") || 
                        "Login successful!"
                    );

                    // Close modal
                    onClose();

                    // Redirect
                    if (returnUrl && returnUrl !== "/") {
                        push(returnUrl);
                    } else if (user?.role === 2) {
                        push("/joinUsEvent");
                    } else {
                        push("/events");
                    }
                } else {
                    const errorMessage = response?.message || 
                        t("auth.loginFailed") || 
                        "Login failed. Please try again.";
                    
                    toast.error(errorMessage);

                    if (errorMessage.toLowerCase().includes("verify") || 
                        errorMessage.toLowerCase().includes("verification")) {
                        setShowResendLink(true);
                    }
                }
            } catch (error) {
                console.error("[LOGIN-MODAL] Error:", error);
                
                const errorMessage = error?.response?.data?.message || 
                    error?.message || 
                    t("auth.loginError") || 
                    "An error occurred. Please try again.";
                
                toast.error(errorMessage);

                if (errorMessage.toLowerCase().includes("verify") || 
                    errorMessage.toLowerCase().includes("verification")) {
                    setShowResendLink(true);
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
                "An error occurred"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6 md:p-8">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <Image
                        src="/assets/images/main-logo.png"
                        alt="Zuroona"
                        width={100}
                        height={40}
                        className="object-contain"
                    />
                </div>

                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {t("auth.welcomeBack") || "Welcome Back"}
                    </h2>
                    <p className="text-gray-600 text-sm">
                        {t("auth.loginToAccount") || "Login to your account"}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t("auth.email") || "Email"} *
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Icon icon="material-symbols:mail" className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent ${
                                    formik.touched.email && formik.errors.email
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder={t("auth.emailPlaceholder") || "your.email@example.com"}
                            />
                        </div>
                        {formik.touched.email && formik.errors.email && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                        )}
                    </div>

                    {/* Resend Link */}
                    {showResendLink && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                        >
                            <div className="flex items-start">
                                <Icon icon="material-symbols:info" className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs text-yellow-800 mb-1">
                                        {t("auth.emailNotVerified") || "Email not verified"}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleResendVerification}
                                        disabled={loading}
                                        className="text-xs font-semibold text-yellow-700 hover:text-yellow-900 underline"
                                    >
                                        {t("auth.resendVerificationEmail") || "Resend Verification"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || !formik.isValid}
                        className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
                <div className="my-6 flex items-center">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-3 text-xs text-gray-500">{t("auth.or") || "OR"}</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Sign Up Links */}
                <div className="space-y-2">
                    <p className="text-center text-sm text-gray-600">
                        {t("auth.dontHaveAccount") || "Don't have an account?"}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => {
                                onClose();
                                push("/signup/guest");
                            }}
                            className="py-2 px-3 border border-primary text-primary hover:bg-primary/10 text-sm font-semibold rounded-lg transition-colors"
                        >
                            {t("auth.signupAsGuest") || "Guest"}
                        </button>
                        <button
                            onClick={() => {
                                onClose();
                                push("/signup/host");
                            }}
                            className="py-2 px-3 border border-brand-orange text-brand-orange hover:bg-brand-orange/10 text-sm font-semibold rounded-lg transition-colors"
                        >
                            {t("auth.signupAsHost") || "Host"}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

