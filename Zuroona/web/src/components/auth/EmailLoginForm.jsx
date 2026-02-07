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

import { SendPhoneOTPApi, VerifyPhoneOTPApi } from "@/app/api/setting";
import Loader from "../Loader/Loader";
import { NumberInput } from "@/components/ui/number-input";
import OTPInput from "react-otp-input";
import { TOKEN_NAME } from "@/until";
import useAuthStore from "@/store/useAuthStore";
import { useDispatch } from "react-redux";
import { getProfile } from "@/redux/slices/profileInfo";
import { AnimatePresence } from "framer-motion";

export default function EmailLoginForm() {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Phone input, 2: OTP verification
    const [seconds, setSeconds] = useState(60); // 1 minute timer
    const [timerActive, setTimerActive] = useState(false);
    const [otpExpired, setOtpExpired] = useState(false);
    const [otpSentTime, setOtpSentTime] = useState(null); // Track when OTP was sent
    const login = useAuthStore((state) => state.login);

    // Phone number form validation
    const phoneValidationSchema = Yup.object({
        phone_number: Yup.string()
            .required(t("auth.phoneRequired") || "Phone number is required")
            .min(9, t("phone Min Length") || "Phone number must be at least 9 digits"),
        country_code: Yup.string()
            .required(t("auth.countryCodeRequired") || "Country code is required"),
    });

    const phoneFormik = useFormik({
        initialValues: {
            phone_number: "",
            country_code: "+966",
        },
        validationSchema: phoneValidationSchema,
        onSubmit: async (values) => {
            setLoading(true);

            try {
                const payload = {
                    phone_number: values.phone_number,
                    country_code: values.country_code,
                };

                console.log("[LOGIN] Sending OTP to:", payload);

                const response = await SendPhoneOTPApi(payload);

                setLoading(false);
                if (response?.status === 1) {
                    toast.success(response.message || t("OTP.otpSentSuccess") || "OTP sent successfully!");
                    setStep(2); // Move to OTP verification step
                    setOtpSentTime(Date.now()); // Record when OTP was sent
                    setOtpExpired(false);
                    startTimer();
                } else {
                    toast.error(response.message || t("OTP.failedToSendOTP") || "Failed to send OTP");
                }
            } catch (error) {
                setLoading(false);
                console.error("[LOGIN] Error:", error);
                const errorMessage = error?.response?.data?.message ||
                    error?.message ||
                    "An error occurred. Please try again.";
                toast.error(errorMessage);
            }
        },
    });

    // OTP verification form
    const otpValidationSchema = Yup.object({
        otp: Yup.string()
            .required(t("OTP.tab7") || "OTP is required")
            .length(6, t("OTP.tab8") || "OTP must be 6 digits"),
    });

    const otpFormik = useFormik({
        initialValues: {
            otp: "",
        },
        validationSchema: otpValidationSchema,
        onSubmit: async (values) => {
            setLoading(true);

            // Check if OTP has expired (1 minute = 60000 ms)
            if (otpSentTime && (Date.now() - otpSentTime) > 60000) {
                setLoading(false);
                toast.error(t("auth.otpExpired") || "OTP has expired. Please request a new one.");
                setOtpExpired(true);
                otpFormik.setFieldValue("otp", "");
                return;
            }
            if (otpExpired) {
                setLoading(false);
                toast.error(t("auth.otpExpired") || "OTP has expired. Please request a new one.");
                otpFormik.setFieldValue("otp", "");
                return;
            }

            try {
                const payload = {
                    phone_number: phoneFormik.values.phone_number,
                    country_code: phoneFormik.values.country_code,
                    otp: values.otp,
                };

                console.log("[LOGIN] Verifying OTP for:", payload.phone_number);

                const response = await VerifyPhoneOTPApi(payload);

                setLoading(false);
                if (response?.status === 1) {
                    const token = response?.data?.token;
                    const user = response?.data?.user || response?.data?.organizer;

                    if (!user) {
                        toast.error(t("auth.loginFailed") || "Login failed. User data not found.");
                        return;
                    }

                    // Store token
                    Cookies.set(TOKEN_NAME, token, { expires: 30 });

                    // Store role in localStorage
                    if (user.role) {
                        localStorage.setItem("user_role", user.role.toString());
                    }

                    // Update auth store
                    dispatch(getProfile());
                    login(token, user);

                    toast.success(response.message || t("auth.loginSuccess") || "Login successful!");

                    // Navigate based on role
                    if (user.role === 2) {
                        // Organizer/Host
                        router.push("/joinUsEvent");
                    } else if (user.role === 1) {
                        // Guest
                        router.push("/events");
                    } else {
                        router.push("/events");
                    }
                } else {
                    toast.error(response?.message || "Invalid OTP. Please try again.");
                }
            } catch (error) {
                setLoading(false);
                console.error("[LOGIN] Error:", error);
                const errorMessage = error?.response?.data?.message ||
                    error?.message ||
                    "An error occurred. Please try again.";
                toast.error(errorMessage);
            }
        },
    });

    // Timer for OTP resend
    const startTimer = () => {
        setSeconds(60); // 1 minute
        setTimerActive(true);
        setOtpExpired(false);

        const interval = setInterval(() => {
            setSeconds((prevSeconds) => {
                if (prevSeconds <= 1) {
                    clearInterval(interval);
                    setTimerActive(false);
                    setOtpExpired(true);
                    return 0;
                }
                return prevSeconds - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    };

    // Resend OTP
    const resendCode = () => {
        setLoading(true);
        SendPhoneOTPApi({
            phone_number: phoneFormik.values.phone_number,
            country_code: phoneFormik.values.country_code,
        }).then((data) => {
            setLoading(false);
            if (data?.status === 1) {
                setOtpSentTime(Date.now()); // Record when OTP was sent
                setOtpExpired(false);
                otpFormik.setFieldValue("otp", ""); // Clear previous OTP
                toast.success(data?.message || "OTP resent successfully!");
                startTimer();
            } else {
                toast.error(data?.message || "Failed to resend OTP");
            }
        }).catch((error) => {
            setLoading(false);
            toast.error("Failed to resend OTP");
        });
    };

    // Go back to phone input step
    const handleBackToPhone = () => {
        setStep(1);
        otpFormik.resetForm();
    };

    // Slide animation variants
    const slideVariants = {
        hidden: (direction) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
        }),
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300,
            },
        },
        exit: (direction) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300,
            },
        }),
    };


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
        >
            <div className="relative bg-gradient-to-br from-white via-white to-purple-50/30 rounded-3xl shadow-2xl p-8 border border-gray-100/50 backdrop-blur-sm overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-56 h-56 bg-orange-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10">
                    {/* Logo with glow effect */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex justify-center mb-6"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#a797cc]/20 to-brand-orange/20 rounded-2xl blur-xl"></div>
                            <Image
                                src="/assets/images/x_F_logo.png"
                                alt="Zuroona"
                                width={240}
                                height={70}
                                className="object-contain relative z-10 drop-shadow-lg"
                            />
                        </div>
                    </motion.div>

                    {/* Header with gradient text */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-[#a797cc] to-gray-900 bg-clip-text text-transparent mb-2">
                            {t("auth.welcomeBack") || "Welcome Back"}
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {t("auth.loginSubtitle") || "Sign in to continue to your account"}
                        </p>
                    </motion.div>

                    {/* Form with Step-based Flow */}
                    <AnimatePresence mode="wait" initial={false} custom={step === 1 ? 1 : -1}>
                        {step === 1 ? (
                            <motion.form
                                key="phone"
                                custom={1}
                                variants={slideVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                onSubmit={phoneFormik.handleSubmit}
                                className="space-y-6"
                            >
                                {/* Phone Number Field */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <Icon icon="material-symbols:phone-android" className="w-4 h-4 text-[#a797cc]" />
                                        {t("auth.phoneNumber") || "Phone Number"} *
                                    </label>
                                    <div className="relative group" style={{ zIndex: 10 }}>
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#a797cc]/10 to-brand-orange/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-1 shadow-sm group-hover:border-[#a797cc]/50 transition-all duration-300" style={{ zIndex: 10 }}>
                                            <NumberInput
                                                formik={phoneFormik}
                                                mobileNumberField="phone_number"
                                                countryCodeField="country_code"
                                                disabled={loading}
                                                enableSearch={true}
                                                onlyCountries={['sa']}
                                                countryCodeEditable={false}
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Send OTP Button */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="pt-2"
                                    style={{ zIndex: 1 }}
                                >
                                    <button
                                        type="submit"
                                        disabled={loading || !phoneFormik.isValid}
                                        className="group relative w-full bg-gradient-to-r from-[#a797cc] via-[#9d8bc0] to-[#a797cc] text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 overflow-hidden"
                                    >
                                        {/* Animated background */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/20 to-[#a797cc]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                                        {/* Button content */}
                                        <span className="relative z-10 flex items-center gap-2">
                                            {loading ? (
                                                <>
                                                    <Loader />
                                                    <span>Sending OTP...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Icon icon="material-symbols:sms" className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                    <span>Send OTP</span>
                                                    <Icon icon="material-symbols:arrow-forward" className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </motion.div>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="otp"
                                custom={-1}
                                variants={slideVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                onSubmit={otpFormik.handleSubmit}
                                className="space-y-6"
                            >
                                {/* Back Button */}
                                <div className="flex items-center mb-4">
                                    <button
                                        type="button"
                                        onClick={handleBackToPhone}
                                        className="flex items-center text-gray-600 hover:text-[#a797cc] transition-colors"
                                    >
                                        <Icon icon="material-symbols:arrow-back" className="w-5 h-5 mr-1" />
                                        <span className="text-sm">{t("Back") || "Back"}</span>
                                    </button>
                                </div>

                                {/* OTP Header */}
                                <div className="text-center mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {t("OTP.tab1") || "Enter OTP"}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {t("OTP.tab2") || "We sent a verification code to"} <br />
                                        <span className="font-semibold text-gray-800">
                                            {phoneFormik.values.country_code} {phoneFormik.values.phone_number}
                                        </span>
                                    </p>
                                </div>

                                {/* OTP Input */}
                                <div className="flex justify-center my-6">
                                    <OTPInput
                                        containerStyle="flex gap-2 md:gap-4 justify-center"
                                        value={otpFormik.values.otp}
                                        onChange={(val) => {
                                            const numericVal = val.replace(/[^0-9]/g, "");
                                            otpFormik.setFieldValue("otp", numericVal);
                                        }}
                                        inputStyle={{
                                            width: "3rem",
                                            height: "3rem",
                                            textAlign: "center",
                                            border: "2px solid #e5e7eb",
                                            borderRadius: "12px",
                                            fontSize: "1.25rem",
                                            fontWeight: "600",
                                            outline: "none",
                                            color: "#a797cc",
                                            borderColor: otpFormik.errors.otp && otpFormik.touched.otp ? "#ef4444" : "#e5e7eb",
                                        }}
                                        numInputs={6}
                                        separator={<span className="mx-1"></span>}
                                        shouldAutoFocus={true}
                                        renderInput={(props) => (
                                            <input
                                                {...props}
                                                inputMode="numeric"
                                                onInput={(e) => {
                                                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                {otpFormik.errors.otp && otpFormik.touched.otp && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center text-sm text-red-500 flex items-center justify-center gap-1"
                                    >
                                        <Icon icon="material-symbols:error-outline" className="w-4 h-4" />
                                        {otpFormik.errors.otp}
                                    </motion.p>
                                )}

                                {/* Timer */}
                                <div className="flex justify-center items-center my-4">
                                    <span className="text-[#a797cc] text-sm font-medium">
                                        Resend code in 00:{seconds > 9 ? seconds : `0${seconds}`}
                                    </span>
                                </div>

                                {/* Verify OTP Button */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="pt-2"
                                >
                                    <button
                                        type="submit"
                                        disabled={loading || otpFormik.values.otp.length !== 6}
                                        className="group relative w-full bg-gradient-to-r from-[#a797cc] via-[#9d8bc0] to-[#a797cc] text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 overflow-hidden"
                                    >
                                        {/* Animated background */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/20 to-[#a797cc]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                                        {/* Button content */}
                                        <span className="relative z-10 flex items-center gap-2">
                                            {loading ? (
                                                <span className="w-full flex justify-center items-center text-center font-semibold mx-auto">Verifying</span>
                                            ) : (
                                                <>
                                                    <Icon icon="material-symbols:verified" className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                    <span>{t("OTP.tab6") || "Verify & Login"}</span>
                                                    <Icon icon="material-symbols:arrow-forward" className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </motion.div>

                                {/* Resend OTP Link */}
                                <div className="text-center text-sm mt-4 flex items-center justify-center gap-3">
                                    {seconds > 0 && !otpExpired ? (
                                        <span className="text-gray-600 font-medium">
                                            {t("auth.otpTimer") || "Resend in"} {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
                                        </span>
                                    ) : (
                                        <>
                                            <span className="text-gray-600">{t("OTP.tab4") || "Didn't receive the code?"}</span>
                                            <button
                                                type="button"
                                                onClick={resendCode}
                                                disabled={loading}
                                                className="text-[#a797cc] font-semibold hover:text-brand-orange underline transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                                            >
                                                {t("OTP.tab5") || "Resend"}
                                            </button>
                                        </>
                                    )}
                                    {otpExpired && (
                                        <span className="text-red-600 text-sm font-medium">
                                            {t("auth.otpExpired") || "OTP Expired"}
                                        </span>
                                    )}
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>


                    {/* Sign Up Links */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="space-y-4 mt-8"
                    >
                        <p className="text-center text-gray-500 text-sm">
                            {t("auth.dontHaveAccount") || "Don't have an account?"}
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => router.push("/signup/guest")}
                                className="group py-2.5 px-3 border-2 border-brand-orange text-brand-orange hover:bg-gradient-to-r hover:from-brand-orange/10 hover:to-orange-50 font-semibold rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {t("auth.signupAsGuest") || "Guest"}
                                    <Icon icon="material-symbols:arrow-forward" className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => router.push("/signup/host")}
                                className="group py-2.5 px-3 bg-gradient-to-r from-[#a797cc] to-[#9d8bc0] hover:from-[#9d8bc0] hover:to-[#a797cc] text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {t("auth.signupAsHost") || "Host"}
                                    <Icon icon="material-symbols:arrow-forward" className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </span>
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Help Text */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-8 text-center"
                    >
                        <p className="text-sm text-gray-500">
                            {t("auth.needHelp") || "Need help?"}{" "}
                            <a
                                href="mailto:infozuroona@gmail.com"
                                className="text-[#a797cc] hover:text-brand-orange font-semibold transition-colors duration-300 inline-flex items-center gap-1 group"
                            >
                                {t("auth.contactSupport") || "Contact Support"}
                                <Icon icon="material-symbols:mail" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </p>
                    </motion.div>

                    {/* Info Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="mt-6 bg-gradient-to-r from-brand-light-orange-1/50 to-orange-50/50 border-2 border-brand-light-orange-1/50 rounded-2xl p-4 backdrop-blur-sm shadow-sm"
                    >
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-brand-orange/10 rounded-lg">
                                <Icon icon="material-symbols:info" className="w-5 h-5 text-brand-orange" />
                            </div>
                            <p className="text-sm text-orange-900 leading-relaxed">
                                {t("auth.loginInfo") || "Login with your Saudi Arabia phone number. We'll send you an OTP code to verify your account."}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

