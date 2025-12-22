"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import useAuthStore from "@/store/useAuthStore";
import OTPInput from "react-otp-input";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

import Modal from "../common/Modal";
import ChangeCountryInput from "../ChangeCountryInput/ChangeCountryInput";
import Loader from "../Loader/Loader";
import { SendPhoneOTPApi, VerifyPhoneOTPApi, ResendOtpApi } from "@/app/api/setting";
import { getProfile } from "@/redux/slices/profileInfo";
import { TOKEN_NAME } from "@/until";

export default function PhoneLoginModal({ isOpen, onClose, onLogin }) {
  const { t, i18n } = useTranslation();
  const { push } = useRouter();
  const dispatch = useDispatch();

  // States
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Phone input, 2: OTP verification
  const [seconds, setSeconds] = useState(30);
  const [timerActive, setTimerActive] = useState(false);

  // Phone number form
  const phoneFormik = useFormik({
    initialValues: {
      phone_number: "",
      country_code: "",
    },
    validationSchema: Yup.object({
      phone_number: Yup.string()
        .required(t("login.tab5"))
        .max(10, "Phone number cannot exceed 10 digits."),
      country_code: Yup.string().required("Country code is required."),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      const payload = {
        phone_number: values.phone_number, // Map phone_number to phone for API compatibility
        country_code: values.country_code,
      };

      try {
        const data = await SendPhoneOTPApi(payload);
        setLoading(false);
        if (data?.status === 1) {
          toast.success(data.message || "OTP sent successfully");
          if (onLogin) {
            // If onLogin prop exists, call it instead of showing the OTP step in this modal
            onClose();
            onLogin();
          } else {
            // Otherwise, handle OTP verification in this modal
            setStep(2); // Move to OTP verification step
            startTimer();
          }
        } else {
          toast.error(data.message || "Failed to send OTP");
        }
      } catch (error) {
        setLoading(false);
        const errorMessage =
          error.response?.data?.message ||
          "An error occurred. Please try again.";
        toast.error(errorMessage);
      }
    },
  });

  // OTP verification form
  const otpFormik = useFormik({
    initialValues: { otp: "" },
    validationSchema: Yup.object({
      otp: Yup.string().required(t("OTP.tab7")).length(6, t("OTP.tab8")),
    }),
    onSubmit: (values) => {
      setLoading(true);
      const payload = {
        otp: values.otp,
      };
      const verifyPayload = {
        phone_number: phoneFormik.values.phone_number,
        country_code: phoneFormik.values.country_code,
        otp: values.otp,
      };
      VerifyPhoneOTPApi(verifyPayload)
        .then((data) => {
          setLoading(false);
          if (data?.status === 1) {
            dispatch(getProfile());
            if (data?.data?.user?.role === 1) {
              toast.success(data.message);
              useAuthStore
                .getState()
                .login(data?.data?.token, data?.data?.user);
              onClose();
              push("/events");
            } else if (data?.data?.user?.role === 2) {
              if (data?.data?.user?.registration_step === 1) {
                toast.success(data.message);
                useAuthStore
                  .getState()
                  .login(data?.data?.token, data?.data?.user);
                onClose();
                push("/organizerSignup/otherInfo");
              } else if (data?.data?.user?.registration_step === 2) {
                toast.success(data.message);
                useAuthStore
                  .getState()
                  .login(data?.data?.token, data?.data?.user);
                onClose();
                push("/organizerSignup/interviewQ");
              } else if (data?.data?.user?.registration_step === 3) {
                toast.success(data.message);
                useAuthStore
                  .getState()
                  .login(data?.data?.token, data?.data?.user);
                onClose();
                push("/organizerSignup/bankDetail");
              } else if (data?.data?.user?.registration_step === 4) {
                toast.success(data.message);
                useAuthStore
                  .getState()
                  .login(data?.data?.token, data?.data?.user);
                onClose();
                push("/joinUsEvent");
              } else {
                toast.error("You are not authorized to access this page.");
              }
            } else {
              toast.error("You are not authorized to access this page.");
            }
          } else {
            toast.error(data.message);
          }
        })
        .catch((error) => {
          setLoading(false);
          toast.error("An error occurred during verification.");
          console.error(error);
        });
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
    ResendOtpApi({
      phone_number: phoneFormik.values.phone_number,
      country_code: phoneFormik.values.country_code,
    }).then((data) => {
      if (data?.status === 1) {
        toast.success(data?.message);
        startTimer();
      } else {
        toast.error(data?.message);
      }
    });
  };

  // Go back to phone input step
  const handleBackToPhone = () => {
    setStep(1);
    otpFormik.resetForm();
  };

  // Close modal and reset forms
  const handleModalClose = () => {
    phoneFormik.resetForm();
    otpFormik.resetForm();
    setStep(1);
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
    <Modal isOpen={isOpen} onClose={handleModalClose} width="lg">
      <div className="overflow-hidden relative bg-white rounded-2xl">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/10 to-transparent">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(theme('colors.brand-orange') 0.5px, transparent 0.5px), radial-gradient(theme('colors.brand-orange') 0.5px, transparent 0.5px)`,
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0,10px 10px",
              opacity: "0.1",
              zIndex: 0,
            }}
          ></div>
        </div>

        <div className="relative z-10 p-8">
          <div className="mx-auto max-w-md">
            <div className="flex justify-center mb-6">
              <Image
                src="/assets/images/main-logo.png"
                alt="Zuroona Logo"
                width={134}
                height={45}
                className="h-auto"
              />
            </div>

            <AnimatePresence
              mode="wait"
              initial={false}
              custom={step === 1 ? 1 : -1}
            >
              {step === 1 ? (
                <motion.div
                  key="phone"
                  custom={1}
                  variants={slideVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-center"
                >
                  <h2 className="mb-2 text-2xl font-bold text-gray-900">
                    {t("login.tab1")}
                  </h2>
                  <p className="mb-8 text-base text-gray-600">
                    {t("login.tab2")}
                  </p>

                  <form
                    onSubmit={phoneFormik.handleSubmit}
                    className="space-y-6"
                  >
                    <div className="flex flex-col w-full">
                      <label className="block mb-2 text-sm font-medium text-left text-gray-700">
                        {t("login.tab5")}
                      </label>
                      <div className="w-full">
                        <ChangeCountryInput
                          mobileNumber="phone_number"
                          countryCode="country_code"
                          formik={phoneFormik}
                          i18n={i18n}
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary text-white py-3 px-6 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    >
                      {loading ? <Loader /> : t("login.tab1")}
                    </button>

                    <div className="flex gap-2 justify-center items-center text-sm">
                      <span className="text-gray-600">{t("login.tab3")}</span>
                      <a
                        href="/signup"
                        className="text-brand-orange font-medium hover:text-brand-orange/90"
                      >
                        {t("login.tab4")}
                      </a>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="otp"
                  custom={-1}
                  variants={slideVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-center"
                >
                  <div className="flex items-center mb-6">
                    <button
                      onClick={handleBackToPhone}
                      className="flex items-center text-gray-600 hover:text-brand-orange transition-colors mr-auto"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-1 w-5 h-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{t("Back")}</span>
                    </button>
                  </div>

                  <div className="flex gap-3 justify-center items-center mb-7">
                    <div className="flex gap-2 items-center">
                      <div className="w-[40px]">
                        <Image
                          src="/assets/images/login/otp-img.png"
                          alt="OTP"
                          width={59}
                          height={37}
                          className="w-full h-auto"
                        />
                      </div>
                      <h2 className="text-base font-semibold whitespace-nowrap sm:text-xl">
                        {t("OTP.tab1")}
                      </h2>
                    </div>
                  </div>

                  <p className="mb-6 text-sm text-gray-600">
                    {t("OTP.tab2")} <br />
                    <span className="font-medium text-gray-800">
                      {phoneFormik.values.country_code}{" "}
                      {phoneFormik.values.phone_number}
                    </span>
                  </p>

                  <form onSubmit={otpFormik.handleSubmit} className="space-y-6">
                    <div className="flex justify-center my-4 space-x-2 sm:space-x-4 passcode-wrapper">
                      <OTPInput
                        containerStyle="flex gap-2 md:gap-5 justify-center"
                        value={otpFormik.values.otp}
                        onChange={(val) => {
                          // Allow only numeric values
                          const numericVal = val.replace(/[^0-9]/g, "");
                          otpFormik.setFieldValue("otp", numericVal);
                        }}
                        inputStyle={{
                          width: "3rem",
                          height: "3rem",
                          textAlign: "center",
                          border: "1px solid #d1d5db",
                          borderRadius: "10px",
                          fontSize: "1rem",
                          outline: "none",
                          color: "theme('colors.brand-orange')",
                          borderColor:
                            otpFormik.errors.otp && otpFormik.touched.otp
                              ? "#bc611ebd"
                              : "#d1d5db",
                        }}
                        numInputs={6}
                        separator={<span> </span>}
                        shouldAutoFocus={true}
                        renderInput={(props) => (
                          <input
                            {...props}
                            inputMode="numeric"
                            onInput={(e) => {
                              e.target.value = e.target.value.replace(
                                /[^0-9]/g,
                                ""
                              );
                            }}
                          />
                        )}
                      />
                    </div>
                    {otpFormik.errors.otp && otpFormik.touched.otp && (
                      <p className="text-brand-orange text-center text-xs mt-2 font-semibold">
                        {otpFormik.errors.otp}
                      </p>
                    )}

                    <div className="flex justify-center items-center my-4">
                      <span className="text-brand-orange text-sm">
                        00:{seconds > 9 ? seconds : `0${seconds}`}{" "}
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary text-white font-semibold py-3 rounded-xl shadow-sm hover:shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading || otpFormik.values.otp.length !== 6}
                    >
                      {loading ? (
                        <Loader color="#fff" height="25" />
                      ) : (
                        t("OTP.tab6")
                      )}
                    </button>
                  </form>

                  <div className="mt-4 text-sm text-center text-gray-800">
                    {t("OTP.tab4")}{" "}
                    {!timerActive && (
                      <span
                        className="text-brand-orange underline cursor-pointer"
                        onClick={resendCode}
                      >
                        {t("OTP.tab5")}
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Modal>
  );
}
