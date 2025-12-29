"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { NumberInput } from "@/components/ui/number-input";
import ProfileImageUpload from "@/components/ProfileImageUpload/ProfileImageUpload";
import Loader from "@/components/Loader/Loader";
import Link from "next/link";
import { useRTL } from "@/utils/rtl";
import { OrganizerSignUpApi } from "@/app/api/setting";
import { Icon } from "@iconify/react";

const BasicInfoForm = ({ onSuccess }) => {
  const { t, i18n } = useTranslation();
  const { isRTL, textAlign, flexDirection, marginStart, marginEnd } = useRTL();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      // Account creation essentials
      email: "",
      password: "",
      confirmPassword: "",
      profile_image: "",
      first_name: "",
      last_name: "",
      country_code: "+966",
      phone_number: "",
      acceptTerms: false,
      acceptPrivacy: false,
    },
    validationSchema: Yup.object({
      // Account credentials
      email: Yup.string()
        .email(t("auth.emailInvalid") || t("auth.invalidEmail") || "Invalid email")
        .required(t("signup.tab16") || "Email is required"),
      password: Yup.string()
        .required(t("auth.passwordRequired") || "Password is required")
        .min(8, t("auth.passwordMinLength") || "Password must be at least 8 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          t("auth.passwordStrength") || "Password must contain uppercase, lowercase, and number"
        ),
      confirmPassword: Yup.string()
        .required(t("auth.confirmPasswordRequired") || "Please confirm your password")
        .oneOf([Yup.ref("password")], t("auth.passwordsMustMatch") || "Passwords must match"),
      // Basic identification
      profile_image: Yup.string().required(t("signup.tab16") || "Profile image is required"),
      first_name: Yup.string().required(t("signup.tab16") || "First name is required"),
      last_name: Yup.string().required(t("signup.tab16") || "Last name is required"),
      phone_number: Yup.string().required(t("signup.tab16") || "Phone number is required"),
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
      if (!values.profile_image || values.profile_image.trim() === "") {
        setFieldTouched("profile_image", true);
        setFieldError("profile_image", t("signup.profileImageRequired") || "Profile image is required");
        toast.error(t("signup.profileImageRequired") || "Please upload your profile image to continue");
        return;
      }

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

      if (!values.password || values.password.trim() === "") {
        setFieldTouched("password", true);
        toast.error(t("auth.passwordRequired") || "Please enter your password");
        return;
      }

      if (!values.confirmPassword || values.confirmPassword.trim() === "") {
        setFieldTouched("confirmPassword", true);
        toast.error(t("auth.confirmPasswordRequired") || "Please confirm your password");
        return;
      }

      if (values.password !== values.confirmPassword) {
        setFieldTouched("confirmPassword", true);
        toast.error(t("auth.passwordsMustMatch") || "Passwords do not match");
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
        // Step 1: Create organizer account with basic info
        const registrationPayload = {
          email: values.email.toLowerCase().trim(),
          password: values.password,
          confirmPassword: values.confirmPassword,
          first_name: values.first_name,
          last_name: values.last_name,
          phone_number: values.phone_number,
          country_code: values.country_code,
          profile_image: values.profile_image,
          registration_step: 1, // Step 1: Basic Info only
        };

        console.log("[BASIC-INFO] Creating organizer account...");
        
        const response = await OrganizerSignUpApi(registrationPayload);
        
        if (response?.status === 1 || response?.data?.organizer?._id) {
          const organizerId = response?.data?.organizer?._id || response?.organizer?._id;
          
          // Store organizer_id for Step 2
          localStorage.setItem("organizer_id", organizerId);
          
          // Store basic info (without password) for Step 2 reference
          const basicInfoData = {
            organizer_id: organizerId,
            profile_image: values.profile_image,
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email.toLowerCase().trim(),
            phone_number: values.phone_number,
            country_code: values.country_code,
            registration_step: 1,
          };
          
          localStorage.setItem("organizer_basic_info", JSON.stringify(basicInfoData));
          
          toast.success(
            response?.message || 
            t("signup.accountCreated") || 
            "Account created successfully! Please continue to the next step."
          );
          
          // Move to next step (Personal Info & Questions)
          onSuccess?.();
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
            {!formik.values.profile_image && (
              <p className="mt-2 text-xs text-gray-500 text-center">
                {t("signup.profileImageHint") || "Please upload your profile image to continue"}
              </p>
            )}
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

              {/* Password */}
              <div>
                <label htmlFor="password" className={labelClasses}>
                  {t("auth.password") || "Password"} *
                </label>
                <div className="relative mt-1">
                  <span className={iconContainerClasses}>
                    <Icon
                      icon="lucide:lock"
                      className="w-4 h-4 text-[#a797cc]"
                    />
                  </span>
                  <input
                    type="password"
                    id="password"
                    className={`${inputClasses} ${
                      i18n.language === "ar" ? "pr-10" : "pl-10"
                    }`}
                    placeholder={t("auth.enterPassword") || "Enter your password"}
                    {...formik.getFieldProps("password")}
                  />
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className={errorClasses}>{formik.errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className={labelClasses}>
                  {t("auth.confirmPassword") || "Confirm Password"} *
                </label>
                <div className="relative mt-1">
                  <span className={iconContainerClasses}>
                    <Icon
                      icon="lucide:lock"
                      className="w-4 h-4 text-[#a797cc]"
                    />
                  </span>
                  <input
                    type="password"
                    id="confirmPassword"
                    className={`${inputClasses} ${
                      i18n.language === "ar" ? "pr-10" : "pl-10"
                    }`}
                    placeholder={t("auth.confirmPasswordPlaceholder") || "Confirm your password"}
                    {...formik.getFieldProps("confirmPassword")}
                  />
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <p className={errorClasses}>{formik.errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="mb-6 space-y-4">
            {/* Terms and Conditions Checkbox */}
            <div className={`flex items-start ${flexDirection}`}>
              <div className="flex items-center h-5">
                <input
                  id="acceptTerms"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-[#a797cc] text-[#a797cc]"
                  {...formik.getFieldProps("acceptTerms")}
                  checked={formik.values.acceptTerms}
                />
              </div>
              <div className={`${marginStart(3)} text-sm`}>
                <label
                  htmlFor="acceptTerms"
                  className={`font-medium text-gray-900 ${textAlign}`}
                >
                  {t("signup.tab22") || "I accept the"}{" "}
                  <Link
                    href="/termsCondition"
                    target="_blank"
                    className="text-[#a797cc] hover:underline"
                  >
                    {t("signup.tab23") || "Terms & Condition"}
                  </Link>
                  {" *"}
                </label>
                {formik.touched.acceptTerms && formik.errors.acceptTerms && (
                  <p className={errorClasses}>{formik.errors.acceptTerms}</p>
                )}
              </div>
            </div>

            {/* Privacy Policy Checkbox */}
            <div className={`flex items-start ${flexDirection}`}>
              <div className="flex items-center h-5">
                <input
                  id="acceptPrivacy"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-[#a797cc] text-[#a797cc]"
                  {...formik.getFieldProps("acceptPrivacy")}
                  checked={formik.values.acceptPrivacy}
                />
              </div>
              <div className={`${marginStart(3)} text-sm`}>
                <label
                  htmlFor="acceptPrivacy"
                  className={`font-medium text-gray-900 ${textAlign}`}
                >
                  {t("signup.tab22") || "I accept the"}{" "}
                  <Link
                    href="/privacyPolicy"
                    target="_blank"
                    className="text-[#a797cc] hover:underline"
                  >
                    {t("signup.tab25") || "Privacy Policy"}
                  </Link>
                  {" *"}
                </label>
                {formik.touched.acceptPrivacy && formik.errors.acceptPrivacy && (
                  <p className={errorClasses}>{formik.errors.acceptPrivacy}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-4 text-white bg-[#a797cc] rounded-xl hover:bg-[#8ba179] transition-colors disabled:opacity-50"
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
    </div>
  );
};

export default BasicInfoForm;

