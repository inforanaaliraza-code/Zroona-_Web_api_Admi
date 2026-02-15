"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { NumberInput } from "@/components/ui/number-input";
import ProfileImageUpload from "@/components/ProfileImageUpload/ProfileImageUpload";
import Loader from "@/components/Loader/Loader";
import { useRTL } from "@/utils/rtl";
import { OrganizerSignUpApi } from "@/app/api/setting";
import { Icon } from "@iconify/react";
import axios from "axios";
import { BASE_API_URL } from "@/until";
import { motion } from "framer-motion";
import TermsOfServiceModal from "@/components/Modal/TermsOfServiceModal";
import PrivacyPolicyModal from "@/components/Modal/PrivacyPolicyModal";
import CountryCitySelect from "@/components/CountryCitySelect/CountryCitySelect";

const BasicInfoForm = ({ onSuccess }) => {
  const { t, i18n } = useTranslation();
  const { isRTL, textAlign, flexDirection, marginStart, marginEnd } = useRTL();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showVerificationStep, setShowVerificationStep] = useState(false);
  const [organizerId, setOrganizerId] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60); // 1 minute timer for OTP
  const [otpExpired, setOtpExpired] = useState(false);
  const [otpSentTime, setOtpSentTime] = useState(null); // Track when OTP was sent
  const [otpError, setOtpError] = useState(null); // For showing prominent OTP errors
  const [phoneBlocked, setPhoneBlocked] = useState(false); // For phone blocked state
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0); // Minutes remaining for block

  const formik = useFormik({
    initialValues: {
      // Account creation essentials
      email: "",
      profile_image: "",
      first_name: "",
      last_name: "",
      country_code: "+966",
      phone_number: "",
      country: "",
      city: "",
      acceptTerms: false,
      acceptPrivacy: false,
    },
    validationSchema: Yup.object({
      // Account credentials
      email: Yup.string()
        .required(t("signup.tab16") || "Email is required")
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
        .email(t("auth.emailInvalid") || t("auth.invalidEmail") || "Invalid email"),
      // Basic identification
      profile_image: Yup.string(), // Optional - user can upload later
      first_name: Yup.string().required(t("signup.tab16") || "First name is required"),
      last_name: Yup.string().required(t("signup.tab16") || "Last name is required"),
      phone_number: Yup.string().required(t("signup.tab16") || "Phone number is required"),
      country: Yup.string().required(t("signup.countryRequired") || "Country is required"),
      city: Yup.string().required(t("signup.cityRequired") || "City is required"),
      // Terms acceptance
      acceptTerms: Yup.boolean()
        .oneOf([true], t("signup.tab23") || "You must accept the terms and conditions")
        .required(t("signup.tab23") || "You must accept the terms and conditions"),
      acceptPrivacy: Yup.boolean()
        .oneOf([true], t("signup.tab25") || "You must accept the privacy policy")
        .required(t("signup.tab25") || "You must accept the privacy policy"),
    }),
    onSubmit: async (values, { setFieldTouched, setFieldError }) => {
      // Pre-submit validation with specific error messages
      if (!values.first_name || values.first_name.trim() === "") {
        setFieldTouched("first_name", true);
        toast.error(t("signup.firstNameRequired") || "Please enter your first name");
        return;
      }

      if (!values.last_name || values.last_name.trim() === "") {
        setFieldTouched("last_name", true);
        toast.error(t("signup.lastNameRequired") || "Please enter your last name");
        return;
      }

      if (!values.email || values.email.trim() === "") {
        setFieldTouched("email", true);
        toast.error(t("signup.emailRequired") || "Please enter your email address");
        return;
      }

      if (!values.phone_number || values.phone_number.trim() === "") {
        setFieldTouched("phone_number", true);
        toast.error(t("signup.phoneRequired") || "Please enter your phone number");
        return;
      }

      if (!values.acceptTerms) {
        setFieldTouched("acceptTerms", true);
        toast.error(t("signup.tab23") || "Please accept the terms and conditions");
        return;
      }

      if (!values.acceptPrivacy) {
        setFieldTouched("acceptPrivacy", true);
        toast.error(t("signup.tab25") || "Please accept the privacy policy");
        return;
      }

      setLoading(true);
      try {
        // Step 1: Create organizer account with basic info (passwordless)
        const registrationPayload = {
          email: values.email.toLowerCase().trim(),
          first_name: values.first_name,
          last_name: values.last_name,
          phone_number: values.phone_number,
          country_code: values.country_code,
          country: values.country,
          city: values.city,
          registration_step: 1, // Step 1: Basic Info only
        };

        // Only include profile_image if it exists
        if (values.profile_image && values.profile_image.trim() !== "") {
          registrationPayload.profile_image = values.profile_image;
        }

        console.log("[BASIC-INFO] Creating organizer account...");
        
        const response = await OrganizerSignUpApi(registrationPayload);
        
        if (response?.status === 1 || response?.data?.organizer?._id) {
          const organizerId = response?.data?.organizer?._id || response?.organizer?._id;
          
          // Store organizer_id for Step 2
          localStorage.setItem("organizer_id", organizerId);
          setOrganizerId(organizerId);
          setUserEmail(values.email.toLowerCase().trim());
          setShowVerificationStep(true);
          setOtpSentTime(Date.now()); // Record when OTP was sent
          setOtpTimer(60); // Reset timer
          setOtpExpired(false);
          
          // Store basic info (without password) for Step 2 reference
          const basicInfoData = {
            organizer_id: organizerId,
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email.toLowerCase().trim(),
            phone_number: values.phone_number,
            country_code: values.country_code,
            country: values.country,
            city: values.city,
            registration_step: 1,
          };

          // Only include profile_image if it exists
          if (values.profile_image && values.profile_image.trim() !== "") {
            basicInfoData.profile_image = values.profile_image;
          }
          
          localStorage.setItem("organizer_basic_info", JSON.stringify(basicInfoData));
          
          toast.success(
            response?.message || 
            t("signup.accountCreated") || 
            "Account created! Please verify your email and phone to continue."
          );
        } else {
          toast.error(response?.message || t("common.error") || "Failed to create account");
        }
      } catch (error) {
        console.error("Error saving basic info:", error);
        toast.error(t("common.error") || "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
  });

  const inputClasses = `w-full px-4 py-4 rounded-xl border bg-[#fdfdfd] transition-all duration-200
    ${formik.touched && formik.errors ? "border-red-300" : "border-[#f2dfba]"}
    focus:outline-none text-[#333333] placeholder:text-[#666666] focus:border-[#a797cc]
    [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer`;

  const labelClasses = "block text-sm font-semibold text-[#333333] mb-1";
  const iconContainerClasses = `absolute flex items-center ${
    i18n.language === "ar"
      ? "inset-y-0 right-0 pr-3"
      : "inset-y-0 left-0 pl-3"
  }`;
  const errorClasses = "mt-1 text-xs font-semibold text-red-500";

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

  // Reset timer when verification step is shown
  useEffect(() => {
    if (showVerificationStep) {
      setOtpTimer(60);
      setOtpExpired(false);
    }
  }, [showVerificationStep]);

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
        setOtpTimer(60);
        setOtpExpired(false);
        setOtpSentTime(Date.now());
        setOtp("");
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
          toast.success(response.data.message || "Account verified successfully!");
          // Proceed to next step
          onSuccess?.();
        } else {
          toast.success(response.data.message || "Phone verified! Please verify your email to continue.");
        }
      } else {
        // Parse error message for blocked phone or too many attempts
        const errorMessage = response.data.message || "";
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

  const handleResendEmailVerification = async () => {
    if (!userEmail) {
      toast.error("Email not found");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_API_URL}organizer/resend-verification`,
        { email: userEmail },
        {
          headers: {
            "Content-Type": "application/json",
            lang: i18n.language || "en",
          },
        }
      );
      if (response.data?.status === 1 || response.data?.success) {
        toast.success(response.data.message || "Verification email sent! Please check your inbox.");
      } else {
        toast.error(response.data.message || "Failed to resend verification email");
      }
    } catch (error) {
      console.error("Resend email verification error:", error);
      toast.error("Failed to resend verification email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show verification step after registration
  if (showVerificationStep) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto"
      >
        <div className="p-8 bg-white shadow-sm rounded-xl">
          <h2 className={`mb-6 text-2xl font-bold text-[#333333] ${textAlign}`}>
            {t("steper.tab1") || "Verify Your Account"}
          </h2>
          
          <div className="space-y-6">
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
                <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
                      <div className={`mt-2 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
                <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
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
                      {t("auth.otpTimer") || "Resend in"} {Math.floor(otpTimer / 60)}:
                      {(otpTimer % 60).toString().padStart(2, "0")}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Email Resend */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <Icon icon="material-symbols:mail-outline" className="w-5 h-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-orange-800 mb-2">
                    {t("verificationEmailSent") || 
                    `Verification link sent to ${userEmail}`}
                  </p>
                  <button
                    onClick={handleResendEmailVerification}
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
              
              {/* Next Button - ONLY show if BOTH email AND phone are verified */}
              {(emailVerified && phoneVerified) ? (
                <button
                  onClick={() => onSuccess?.()}
                  className="w-full py-3 px-6 bg-[#a797cc] hover:bg-[#8ba179] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>{t("signup.tab21") || "Next"}</span>
                  <Icon icon="material-symbols:arrow-forward" className="w-5 h-5" />
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-3 px-6 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                  title={!emailVerified ? (t("auth.verifyEmailFirst") || "Please verify your email first") : (t("auth.verifyPhoneFirst") || "Please verify your phone first")}
                >
                  <span>{t("signup.tab21") || "Next"}</span>
                  <Icon icon="material-symbols:arrow-forward" className="w-5 h-5" />
                </button>
              )}
              
              {/* Show what's pending */}
              {!emailVerified && phoneVerified && (
                <div className="text-center text-sm text-orange-600 font-medium">
                  ⚠️ {t("auth.emailVerificationRequired") || "Please verify your email to proceed"}
                </div>
              )}
              
              {/* Show success message if both verified */}
              {(emailVerified && phoneVerified) && (
                <div className="text-center text-sm text-green-600 font-medium">
                  ✓ {t("auth.allVerified") || "All verifications complete! Click Next to continue."}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="p-8 bg-white shadow-sm rounded-xl">
        <h2 className={`mb-6 text-2xl font-bold text-[#333333] ${textAlign}`}>
          {t("steper.tab1") || "Basic Information"}
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center mb-8">
            <ProfileImageUpload
              formik={formik}
              fieldName="profile_image"
            />
            {formik.touched.profile_image && formik.errors.profile_image && (
              <p className="mt-2 text-xs font-semibold text-red-500 text-center">
                {formik.errors.profile_image}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500 text-center">
              {t("signup.profileImageOptional") || "Profile image is optional - you can upload it later"}
            </p>
          </div>

          {/* Basic Information Section */}
          <div className="mb-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* First Name */}
              <div>
                <label htmlFor="first_name" className={labelClasses}>
                  {t("signup.tab2") || "First Name"} *
                </label>
                <div className="relative mt-1">
                  <span className={iconContainerClasses}>
                    <Icon
                      icon="lucide:user"
                      className="w-4 h-4 text-[#a797cc]"
                    />
                  </span>
                  <input
                    type="text"
                    id="first_name"
                    className={`${inputClasses} ${
                      i18n.language === "ar" ? "pr-10" : "pl-10"
                    }`}
                    placeholder={t("signup.tab12") || "Enter your first name"}
                    {...formik.getFieldProps("first_name")}
                  />
                </div>
                {formik.touched.first_name && formik.errors.first_name && (
                  <p className={errorClasses}>{formik.errors.first_name}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="last_name" className={labelClasses}>
                  {t("signup.tab3") || "Last Name"} *
                </label>
                <div className="relative mt-1">
                  <span className={iconContainerClasses}>
                    <Icon
                      icon="lucide:user"
                      className="w-4 h-4 text-[#a797cc]"
                    />
                  </span>
                  <input
                    type="text"
                    id="last_name"
                    className={`${inputClasses} ${
                      i18n.language === "ar" ? "pr-10" : "pl-10"
                    }`}
                    placeholder={t("signup.tab13") || "Enter your last name"}
                    {...formik.getFieldProps("last_name")}
                  />
                </div>
                {formik.touched.last_name && formik.errors.last_name && (
                  <p className={errorClasses}>{formik.errors.last_name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={labelClasses}>
                  {t("signup.tab5") || "Email"} *
                </label>
                <div className="relative mt-1">
                  <span className={iconContainerClasses}>
                    <Icon
                      icon="lucide:mail"
                      className="w-4 h-4 text-[#a797cc]"
                    />
                  </span>
                  <input
                    type="email"
                    id="email"
                    className={`${inputClasses} ${
                      i18n.language === "ar" ? "pr-10" : "pl-10"
                    }`}
                    placeholder={t("signup.tab14") || "Enter your email"}
                    {...formik.getFieldProps("email")}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className={errorClasses}>{formik.errors.email}</p>
                )}
              </div>

              {/* Phone Input */}
              <div>
                <label className={labelClasses}>{t("signup.tab4") || "Phone Number"} *</label>
                <NumberInput
                  formik={formik}
                  mobileNumberField="phone_number"
                  countryCodeField="country_code"
                />
              </div>
            </div>

            {/* Country and City Selection */}
            <div className="mt-6">
              <CountryCitySelect
                formik={formik}
                countryFieldName="country"
                cityFieldName="city"
                showLabels={true}
                required={true}
              />
            </div>
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
          <div>
            <button
              type="submit"
              disabled={loading || !formik.values.acceptTerms || !formik.values.acceptPrivacy}
              className="w-full px-4 py-4 text-white bg-[#a797cc] rounded-xl hover:bg-[#8ba179] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader className="w-6 h-6 mx-auto" />
              ) : (
                t("signup.tab21") || "Continue"
              )}
            </button>
          </div>
        </form>
      </div>
      {/* Terms & Conditions and Privacy Policy Modals */}
      <TermsOfServiceModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />
      <PrivacyPolicyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
    </div>
  );
};

export default BasicInfoForm;

