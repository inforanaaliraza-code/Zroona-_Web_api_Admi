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
import ChangeCountryInput from "../ChangeCountryInput/ChangeCountryInput";
import OTPInput from "react-otp-input";
import { SendPhoneOTPApi, VerifyPhoneOTPApi } from "@/app/api/setting";
import { TOKEN_NAME } from "@/until";
import useAuthStore from "@/store/useAuthStore";
import { useDispatch } from "react-redux";
import { getProfile } from "@/redux/slices/profileInfo";
import { AnimatePresence } from "framer-motion";

export default function EmailLoginModal({ isOpen, onClose, returnUrl = "/" }) {
    const { t, i18n } = useTranslation();
    const { push } = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Phone input, 2: OTP verification
    const [seconds, setSeconds] = useState(30);
    const [timerActive, setTimerActive] = useState(false);
    const login = useAuthStore((state) => state.login);

    // Phone number form validation
    const phoneValidationSchema = Yup.object({
        phone_number: Yup.string()
            .required(t("auth.phoneRequired") || "Phone number is required")
            .min(9, t("auth.phoneMinLength") || "Phone number must be at least 9 digits"),
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

                console.log("[LOGIN-MODAL] Sending OTP to:", payload);

                const response = await SendPhoneOTPApi(payload);

                setLoading(false);
                if (response?.status === 1) {
                    toast.success(response.message || "OTP sent successfully!");
                    setStep(2); // Move to OTP verification step
                    startTimer();
                } else {
                    toast.error(response.message || "Failed to send OTP");
                }
            } catch (error) {
                setLoading(false);
                console.error("[LOGIN-MODAL] Error:", error);
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

            try {
                const payload = {
                    phone_number: phoneFormik.values.phone_number,
                    country_code: phoneFormik.values.country_code,
                    otp: values.otp,
                };

                console.log("[LOGIN-MODAL] Verifying OTP for:", payload.phone_number);

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

                    // Update auth store
                    dispatch(getProfile());
                    login(token, user);

                    toast.success(response.message || t("auth.loginSuccess") || "Login successful!");

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
                    toast.error(response?.message || "Invalid OTP. Please try again.");
                }
            } catch (error) {
                setLoading(false);
                console.error("[LOGIN-MODAL] Error:", error);
                const errorMessage = error?.response?.data?.message || 
                    error?.message || 
                    "An error occurred. Please try again.";
                toast.error(errorMessage);
            }
        },
    });

    // Timer for OTP resend
    const startTimer = () => {
        setSeconds(30);
        setTimerActive(true);

        const interval = setInterval(() => {
            setSeconds((prevSeconds) => {
                if (prevSeconds <= 1) {
                    clearInterval(interval);
                    setTimerActive(false);
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

    // Reset form when modal is closed
    const handleModalClose = () => {
        phoneFormik.resetForm();
        otpFormik.resetForm();
        setStep(1);
        setTimerActive(false);
        setSeconds(30);
        onClose();
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
        <Modal isOpen={isOpen} onClose={handleModalClose}>
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
                            className="space-y-4"
                        >
                            {/* Phone Number Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t("auth.phoneNumber") || "Phone Number"} * (Saudi Arabia Only)
                                </label>
                                <ChangeCountryInput
                                    mobileNumber="phone_number"
                                    countryCode="country_code"
                                    formik={phoneFormik}
                                    i18n={i18n}
                                    disabled={loading}
                                />
                                {phoneFormik.touched.phone_number && phoneFormik.errors.phone_number && (
                                    <p className="mt-1 text-sm text-red-600">{phoneFormik.errors.phone_number}</p>
                                )}
                                {phoneFormik.touched.country_code && phoneFormik.errors.country_code && (
                                    <p className="mt-1 text-sm text-red-600">{phoneFormik.errors.country_code}</p>
                                )}
                            </div>

                            {/* Send OTP Button */}
                            <button
                                type="submit"
                                disabled={loading || !phoneFormik.isValid}
                                className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader />
                                        <span>Sending OTP...</span>
                                    </>
                                ) : (
                                    <>
                                        <Icon icon="material-symbols:sms" className="w-5 h-5" />
                                        <span>Send OTP</span>
                                    </>
                                )}
                            </button>
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
                            className="space-y-4"
                        >
                            {/* Back Button */}
                            <div className="flex items-center mb-2">
                                <button
                                    type="button"
                                    onClick={handleBackToPhone}
                                    className="flex items-center text-gray-600 hover:text-primary transition-colors"
                                >
                                    <Icon icon="material-symbols:arrow-back" className="w-4 h-4 mr-1" />
                                    <span className="text-xs">{t("Back") || "Back"}</span>
                                </button>
                            </div>

                            {/* OTP Header */}
                            <div className="text-center mb-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                    {t("OTP.tab1") || "Enter OTP"}
                                </h3>
                                <p className="text-xs text-gray-600">
                                    {t("OTP.tab2") || "We sent a verification code to"} <br />
                                    <span className="font-semibold text-gray-800">
                                        {phoneFormik.values.country_code} {phoneFormik.values.phone_number}
                                    </span>
                                </p>
                            </div>

                            {/* OTP Input */}
                            <div className="flex justify-center my-4">
                                <OTPInput
                                    containerStyle="flex gap-2 justify-center"
                                    value={otpFormik.values.otp}
                                    onChange={(val) => {
                                        const numericVal = val.replace(/[^0-9]/g, "");
                                        otpFormik.setFieldValue("otp", numericVal);
                                    }}
                                    inputStyle={{
                                        width: "2.5rem",
                                        height: "2.5rem",
                                        textAlign: "center",
                                        border: "2px solid #e5e7eb",
                                        borderRadius: "8px",
                                        fontSize: "1rem",
                                        fontWeight: "600",
                                        outline: "none",
                                        color: "#a797cc",
                                        borderColor: otpFormik.errors.otp && otpFormik.touched.otp ? "#ef4444" : "#e5e7eb",
                                    }}
                                    numInputs={6}
                                    separator={<span className="mx-0.5"></span>}
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
                                <p className="text-center text-xs text-red-500">{otpFormik.errors.otp}</p>
                            )}

                            {/* Timer */}
                            <div className="flex justify-center items-center my-2">
                                <span className="text-primary text-xs">
                                    Resend code in 00:{seconds > 9 ? seconds : `0${seconds}`}
                                </span>
                            </div>

                            {/* Verify OTP Button */}
                            <button
                                type="submit"
                                disabled={loading || otpFormik.values.otp.length !== 6}
                                className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader />
                                        <span>Verifying...</span>
                                    </>
                                ) : (
                                    <>
                                        <Icon icon="material-symbols:verified" className="w-5 h-5" />
                                        <span>{t("OTP.tab6") || "Verify & Login"}</span>
                                    </>
                                )}
                            </button>

                            {/* Resend OTP Link */}
                            <div className="text-center text-xs text-gray-600 mt-2">
                                {t("OTP.tab4") || "Didn't receive the code?"}{" "}
                                {!timerActive && (
                                    <button
                                        type="button"
                                        onClick={resendCode}
                                        disabled={loading}
                                        className="text-primary font-semibold underline"
                                    >
                                        {t("OTP.tab5") || "Resend"}
                                    </button>
                                )}
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>


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

