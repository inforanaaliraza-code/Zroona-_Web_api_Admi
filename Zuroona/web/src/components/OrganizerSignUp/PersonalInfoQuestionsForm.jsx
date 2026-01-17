"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { OrganizerUpdateProfileApi, OrganizerSignUpApi } from "@/app/api/setting";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Image from "next/image";
// PhoneNumberInput import removed - not used in this component (phone is read-only display)
import ProfileImageUpload from "@/components/ProfileImageUpload/ProfileImageUpload";
import Loader from "@/components/Loader/Loader";
import { useEffect } from "react";
import { Icon } from "@iconify/react";

const PersonalInfoQuestionsForm = ({ onSuccess }) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentQuestionStep, setCurrentQuestionStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Interview questions array
  const questions = [
    {
      id: "1",
      question: t("interview.1"),
      placeholder: t("interview.1placeholder"),
    },
    {
      id: "2",
      question: t("interview.2"),
      placeholder: t("interview.2placeholder"),
    },
    {
      id: "3",
      question: t("interview.3"),
      placeholder: t("interview.3placeholder"),
    },
    {
      id: "4",
      question: t("interview.4"),
      placeholder: t("interview.4placeholder"),
    },
  ];

  // Load basic info from Step 1 to initialize form
  // Safe for SSR - only accesses localStorage on client side
  const getInitialValues = () => {
    let parsed = {};
    
    // Only access localStorage on client side
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        const basicInfo = localStorage.getItem("organizer_basic_info");
        if (basicInfo) {
          parsed = JSON.parse(basicInfo);
        }
      } catch (error) {
        console.error("Error parsing basic info:", error);
      }
    }
    
    return {
      // These will be pre-filled from Step 1 (read-only display)
      profile_image: parsed.profile_image || "",
      first_name: parsed.first_name || "",
      last_name: parsed.last_name || "",
      country_code: parsed.country_code || "+966",
      phone_number: parsed.phone_number || "",
      // Personal Info (new fields for Step 2)
      gender: "",
      nationality: "",
      date_of_birth: "",
      city: "",
      bio: "",
      // Interview Questions
      "1": "",
      "2": "",
      "3": "",
      "4": "",
    };
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: Yup.object({
      // Personal Info validation (Step 2) - only new fields
      gender: Yup.string().required(t("signup.tab16") || "Gender is required"),
      nationality: Yup.string().required(t("signup.tab16") || "Nationality is required"),
      date_of_birth: Yup.date()
        .required(t("signup.tab16") || "Date of birth is required")
        .max(new Date(), t("auth.dobFuture") || "Date of birth cannot be in the future")
        .test('min-age', t("auth.dobMinAge") || "You must be at least 18 years old", function(value) {
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
      city: Yup.string().required(t("signup.tab16") || "City is required"),
      bio: Yup.string().required(t("signup.tab16") || "Biography is required"),
      // Interview Questions validation
     
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Ensure we're in the browser before accessing localStorage
        if (typeof window === "undefined" || typeof localStorage === "undefined") {
          toast.error(t("common.error") || "Please refresh the page and try again.");
          setLoading(false);
          return;
        }

        // Get organizer_id from localStorage (set in Step 1 by UnifiedSignUpForm)
        const organizerId = localStorage.getItem("organizer_id");
        if (!organizerId) {
          toast.error(t("common.error") || "Organizer ID not found. Please restart the signup process.");
          setLoading(false);
          return;
        }

        // Get basic info from Step 1
        const basicInfo = JSON.parse(localStorage.getItem("organizer_basic_info") || "{}");
        
        // Prepare payload for Step 2: Personal Info + Questions
        // Include basic info from Step 1 + new personal info from Step 2
        const payload = {
          organizer_id: organizerId,
          profile_image: values.profile_image || basicInfo.profile_image,
          first_name: values.first_name || basicInfo.first_name,
          last_name: values.last_name || basicInfo.last_name,
          phone_number: values.phone_number || basicInfo.phone_number,
          country_code: values.country_code || basicInfo.country_code,
          // New personal info fields
          gender: values.gender,
          nationality: values.nationality,
          date_of_birth: values.date_of_birth,
          city: values.city,
          bio: values.bio,
          interview: {
            "1": values["1"],
            "2": values["2"],
            "3": values["3"],
            "4": values["4"],
          },
          registration_step: 2, // Step 2: Personal Info + Questions
        };

        console.log("[PERSONAL-INFO] Submitting with organizer_id:", organizerId);
        console.log("[PERSONAL-INFO] Payload:", { ...payload, interview: "..." });

        const response = await OrganizerUpdateProfileApi(payload);
        
        console.log("[PERSONAL-INFO] Full API Response:", JSON.stringify(response, null, 2));
        
        // Check multiple possible success indicators
        // Backend Response.ok returns: { status: 1, message, data, total_count }
        if (response?.status === 1 || 
            response?.status === true || 
            (response?.data && response?.organizer) ||
            (response?.message && !response?.error)) {
          
          const successMsg = response?.message || 
                            t("signup.personalInfoSaved") || 
                            "Personal information saved successfully!";
          
          toast.success(successMsg);
          
          // Store in localStorage for reference (optional, for Step 3)
          localStorage.setItem("organizer_personal_info", JSON.stringify(payload));
          
          // Navigate to next step
          console.log("[PERSONAL-INFO] Success! Navigating to bank details...");
          console.log("[PERSONAL-INFO] onSuccess callback:", typeof onSuccess);
          
          if (onSuccess && typeof onSuccess === 'function') {
            console.log("[PERSONAL-INFO] Calling onSuccess callback");
            onSuccess();
          } else {
            // Fallback navigation if callback not provided
            console.log("[PERSONAL-INFO] Using fallback navigation");
            router.push("/organizerSignup/bankDetail");
          }
        } else {
          const errorMsg = response?.message || 
                          response?.data?.message || 
                          response?.error || 
                          t("common.error") || 
                          "Failed to save personal information.";
          console.error("[PERSONAL-INFO] API Error Response:", response);
          toast.error(errorMsg);
        }
      } catch (error) {
        console.error("Error saving personal info:", error);
        toast.error(error?.response?.data?.message || t("common.error") || "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleGenderSelect = (gender) => {
    formik.setFieldValue("gender", gender);
  };

  const handleNextQuestion = () => {
    if (currentQuestionStep < questions.length - 1) {
      setCurrentQuestionStep(currentQuestionStep + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionStep > 0) {
      setCurrentQuestionStep(currentQuestionStep - 1);
    }
  };

  // Handle client-side mounting to prevent hydration errors
  useEffect(() => {
    setMounted(true);
    
    // Load basic info from localStorage after mount
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      const basicInfo = localStorage.getItem("organizer_basic_info");
      if (basicInfo) {
        try {
          const parsed = JSON.parse(basicInfo);
          // Update formik values with data from localStorage
          formik.setFieldValue("profile_image", parsed.profile_image || "");
          formik.setFieldValue("first_name", parsed.first_name || "");
          formik.setFieldValue("last_name", parsed.last_name || "");
          formik.setFieldValue("phone_number", parsed.phone_number || "");
          formik.setFieldValue("country_code", parsed.country_code || "+966");
        } catch (error) {
          console.error("Error loading basic info:", error);
        }
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const countries = [
    { code: "SA", name: t("signup.countries.SA") || "Saudi Arabia" },
    { code: "AE", name: t("signup.countries.AE") || "United Arab Emirates" },
    { code: "KW", name: t("signup.countries.KW") || "Kuwait" },
    { code: "QA", name: t("signup.countries.QA") || "Qatar" },
    { code: "BH", name: t("signup.countries.BH") || "Bahrain" },
    { code: "OM", name: t("signup.countries.OM") || "Oman" },
    // Add more countries as needed
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="p-8 bg-white shadow-sm rounded-xl">
        <h2 className="mb-6 text-2xl font-bold text-[#333333]">
          {t("steper.tab2")}
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Display Basic Info from Step 1 (Read-only) */}
          <div className="mb-8 p-4 bg-gray-50 rounded-xl">
            <h3 className="mb-4 text-lg font-semibold text-[#333333]">
              {t("signup.basicInfoFromStep1") || "Basic Information (from Step 1)"}
            </h3>
            {!mounted ? (
              // Show loading state during SSR and initial render to prevent hydration mismatch
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-gray-500">{t("signup.tab2") || "First Name"}</label>
                  <p className="text-sm font-semibold text-gray-900">-</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">{t("signup.tab3") || "Last Name"}</label>
                  <p className="text-sm font-semibold text-gray-900">-</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-gray-500">{t("signup.tab4") || "Phone Number"}</label>
                  <p className="text-sm font-semibold text-gray-900">-</p>
                </div>
              </div>
            ) : (
              // Show actual values after component has mounted on client
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-gray-500">{t("signup.tab2") || "First Name"}</label>
                  <p className="text-sm font-semibold text-gray-900">{formik.values.first_name || "-"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">{t("signup.tab3") || "Last Name"}</label>
                  <p className="text-sm font-semibold text-gray-900">{formik.values.last_name || "-"}</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-gray-500">{t("signup.tab4") || "Phone Number"}</label>
                  <p className="text-sm font-semibold text-gray-900">
                    {formik.values.country_code}{formik.values.phone_number || "-"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Personal Information Section */}
          <div className="mb-8">
            <h3 className="mb-4 text-xl font-semibold text-[#333333]">
              {t("signup.personalDetails") || "Personal Details"}
            </h3>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

              {/* Gender Selection */}
              <div>
                <label className={labelClasses}>{t("signup.tab6")}</label>
                <div className="grid grid-cols-2 gap-4 mt-1">
                  <button
                    type="button"
                    onClick={() => handleGenderSelect("1")}
                    className={`p-4 text-center rounded-xl border transition-all text-[#333333] ${
                      formik.values.gender === "1"
                        ? "border-[#a797cc] bg-[#a797cc]/10 text-[#a797cc] font-medium"
                        : "border-[#f2dfba] hover:border-[#a797cc] hover:text-[#a797cc]"
                    }`}
                  >
                    {t("signup.tab7")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGenderSelect("2")}
                    className={`p-4 text-center rounded-xl border transition-all text-[#333333] ${
                      formik.values.gender === "2"
                        ? "border-[#a797cc] bg-[#a797cc]/10 text-[#a797cc] font-medium"
                        : "border-[#f2dfba] hover:border-[#a797cc] hover:text-[#a797cc]"
                    }`}
                  >
                    {t("signup.tab8")}
                  </button>
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
                <div className="relative mt-1">
                  <span className={iconContainerClasses}>
                    <Icon
                      icon="lucide:user"
                      className="w-4 h-4 text-[#a797cc]"
                    />
                  </span>
                  <select
                    id="nationality"
                    name="nationality"
                    value={formik.values.nationality}
                    onChange={formik.handleChange}
                    className={`${inputClasses} ${
                      i18n.language === "ar" ? "pr-10" : "pl-10"
                    } appearance-none`}
                  >
                    <option value="">{t("auth.selectNationality")}</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                {formik.touched.nationality && formik.errors.nationality && (
                  <p className={errorClasses}>{formik.errors.nationality}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="date_of_birth" className={labelClasses}>
                  {t("signup.tab10") || "Date of Birth"} *
                </label>
                <div className="relative mt-1">
                  <input
                    type="date"
                    id="date_of_birth"
                    className={inputClasses}
                    {...formik.getFieldProps("date_of_birth")}
                  />
                </div>
                {formik.touched.date_of_birth && formik.errors.date_of_birth && (
                  <p className={errorClasses}>{formik.errors.date_of_birth}</p>
                )}
              </div>

              {/* City */}
              <div className="sm:col-span-2">
                <label htmlFor="city" className={labelClasses}>
                  {t("signup.city") || "City"} *
                </label>
                <div className="relative mt-1">
                  <span className={iconContainerClasses}>
                    <Icon
                      icon="lucide:map-pin"
                      className="w-4 h-4 text-[#a797cc]"
                    />
                  </span>
                  <select
                    id="city"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`${inputClasses} ${
                      i18n.language === "ar" ? "pr-10" : "pl-10"
                    } appearance-none`}
                  >
                    <option value="">{t("signup.selectCity") || "Select City"}</option>
                    {[
                      "Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Khobar", "Taif", 
                      "Abha", "Tabuk", "Buraidah", "Khamis Mushait", "Hail", "Najran", 
                      "Jazan", "Yanbu", "Al Jubail", "Dhahran", "Al Khafji", "Arar", "Sakaka"
                    ].map((city) => (
                      <option key={city} value={city}>
                        {t(`signup.cities.${city}`) || city}
                      </option>
                    ))}
                  </select>
                  <span className={`absolute inset-y-0 ${i18n.language === "ar" ? "left-0 flex items-center pl-3" : "right-0 flex items-center pr-3"} pointer-events-none`}>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </span>
                </div>
                {formik.touched.city && formik.errors.city && (
                  <p className={errorClasses}>{formik.errors.city}</p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6">
              <label htmlFor="bio" className={labelClasses}>
                {t("signup.tab15")}
              </label>
              <textarea
                id="bio"
                className={`${inputClasses} min-h-[120px]`}
                placeholder={t("signup.tab15")}
                {...formik.getFieldProps("bio")}
              />
              {formik.touched.bio && formik.errors.bio && (
                <p className={errorClasses}>{formik.errors.bio}</p>
              )}
            </div>
          </div>

          {/* Interview Questions Section */}
          <div className="mb-8">
            <h3 className="mb-4 text-xl font-semibold text-[#333333]">
              {t("interview.tab1")}
            </h3>
            <p className="mb-6 text-sm text-gray-600">
              {t("interview.tab2")}
            </p>

            {/* Question Progress */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                {questions.map((q, index) => (
                  <div
                    key={q.id}
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                      index <= currentQuestionStep
                        ? "bg-[#a797cc] text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="bg-[#a797cc] h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestionStep + 1) / questions.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Current Question */}
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="mb-4">
                <h4 className="mb-2 text-lg font-semibold text-gray-800">
                  {questions[currentQuestionStep].question}
                </h4>
                <textarea
                  id={questions[currentQuestionStep].id}
                  name={questions[currentQuestionStep].id}
                  rows={6}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] text-black placeholder:text-gray-400 transition-all ${
                    formik.touched[questions[currentQuestionStep].id] &&
                    formik.errors[questions[currentQuestionStep].id]
                      ? "border-red-500"
                      : formik.values[questions[currentQuestionStep].id]?.trim().length >= 10
                      ? "border-green-500"
                      : "border-gray-300"
                  }`}
                  placeholder={questions[currentQuestionStep].placeholder}
                  {...formik.getFieldProps(questions[currentQuestionStep].id)}
                  onBlur={(e) => {
                    formik.handleBlur(e);
                    // Validate on blur
                    const value = e.target.value;
                    if (value && value.trim().length < 10) {
                      formik.setFieldTouched(questions[currentQuestionStep].id, true);
                    }
                  }}
                  onChange={(e) => {
                    formik.handleChange(e);
                    // Auto-validate as user types
                    const value = e.target.value;
                    if (value && value.trim().length >= 10) {
                      formik.setFieldError(questions[currentQuestionStep].id, undefined);
                    }
                  }}
                />
                {formik.touched[questions[currentQuestionStep].id] &&
                  formik.errors[questions[currentQuestionStep].id] && (
                    <p className="mt-1 text-sm text-red-500">
                      {formik.errors[questions[currentQuestionStep].id]}
                    </p>
                  )}
                {formik.values[questions[currentQuestionStep].id] && 
                  formik.values[questions[currentQuestionStep].id].trim().length > 0 &&
                  formik.values[questions[currentQuestionStep].id].trim().length < 10 && (
                    <p className="mt-1 text-sm text-amber-600">
                      {t("interview.minLength") || "Answer must be at least 10 characters"} ({formik.values[questions[currentQuestionStep].id].trim().length}/10)
                    </p>
                  )}
                {formik.values[questions[currentQuestionStep].id]?.trim().length >= 10 && (
                  <p className="mt-1 text-sm text-green-600 font-medium flex items-center gap-1">
                    <span className="text-green-500">✓</span>
                    <span>{t("signup.answerValid") || "Answer is valid and complete"}</span>
                  </p>
                )}
              </div>

              {/* Question Navigation */}
              <div className="flex gap-4 justify-between">
                <button
                  type="button"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionStep === 0}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    currentQuestionStep === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-[#a797cc] border-2 border-[#a797cc] hover:bg-[#a797cc] hover:text-white"
                  }`}
                >
                  {t("common.back")}
                </button>
                {currentQuestionStep < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    disabled={
                      !formik.values[questions[currentQuestionStep].id] ||
                      formik.values[questions[currentQuestionStep].id]?.trim().length < 10 ||
                      (formik.touched[questions[currentQuestionStep].id] &&
                        formik.errors[questions[currentQuestionStep].id])
                    }
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      !formik.values[questions[currentQuestionStep].id] ||
                      formik.values[questions[currentQuestionStep].id]?.trim().length < 10 ||
                      (formik.touched[questions[currentQuestionStep].id] &&
                        formik.errors[questions[currentQuestionStep].id])
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-[#a797cc] text-white hover:bg-[#8ba179] shadow-md hover:shadow-lg"
                    }`}
                  >
                    {t("signup.tab21") || "Next"}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={
                      loading ||
                      !formik.values[questions[currentQuestionStep].id] ||
                      formik.values[questions[currentQuestionStep].id]?.trim().length < 10 ||
                      (formik.touched[questions[currentQuestionStep].id] &&
                        formik.errors[questions[currentQuestionStep].id])
                    }
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      loading ||
                      !formik.values[questions[currentQuestionStep].id] ||
                      formik.values[questions[currentQuestionStep].id]?.trim().length < 10 ||
                      (formik.touched[questions[currentQuestionStep].id] &&
                        formik.errors[questions[currentQuestionStep].id])
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-[#a797cc] text-white hover:bg-[#8ba179] shadow-md hover:shadow-lg"
                    }`}
                    onClick={async (e) => {
                      // Prevent default form submission to handle validation first
                      e.preventDefault();
                      
                      // Log validation state before submit
                      console.log("[PERSONAL-INFO] Last question submit clicked");
                      console.log("[PERSONAL-INFO] Current question:", questions[currentQuestionStep].id);
                      console.log("[PERSONAL-INFO] Question value:", formik.values[questions[currentQuestionStep].id]);
                      console.log("[PERSONAL-INFO] All form values:", formik.values);
                      
                      // Validate all questions before submitting
                      const allQuestionsAnswered = questions.every(q => {
                        const value = formik.values[q.id];
                        const hasValue = value && typeof value === 'string' && value.trim().length >= 10;
                        console.log(`[PERSONAL-INFO] Question ${q.id}:`, { 
                          value, 
                          hasValue,
                          length: value?.trim().length 
                        });
                        return hasValue;
                      });
                      
                      // Validate all personal info fields with detailed logging
                      const personalInfoFields = {
                        gender: formik.values.gender || "",
                        nationality: formik.values.nationality || "",
                        date_of_birth: formik.values.date_of_birth || "",
                        city: formik.values.city || "",
                        bio: formik.values.bio || "",
                      };
                      
                      console.log("[PERSONAL-INFO] Personal info fields:", personalInfoFields);
                      
                      // Check each field properly (non-empty string)
                      // Handle both string and number types (gender might be "1" or "2")
                      const genderValid = personalInfoFields.gender && String(personalInfoFields.gender).trim().length > 0;
                      const nationalityValid = personalInfoFields.nationality && String(personalInfoFields.nationality).trim().length > 0;
                      const dobValid = personalInfoFields.date_of_birth && String(personalInfoFields.date_of_birth).trim().length > 0;
                      const cityValid = personalInfoFields.city && String(personalInfoFields.city).trim().length > 0;
                      const bioValid = personalInfoFields.bio && String(personalInfoFields.bio).trim().length > 0;
                      
                      const personalInfoValid = genderValid && nationalityValid && dobValid && cityValid && bioValid;
                      
                      console.log("[PERSONAL-INFO] Field validation details:", {
                        gender: { value: personalInfoFields.gender, valid: genderValid },
                        nationality: { value: personalInfoFields.nationality, valid: nationalityValid },
                        date_of_birth: { value: personalInfoFields.date_of_birth, valid: dobValid },
                        city: { value: personalInfoFields.city, valid: cityValid },
                        bio: { value: personalInfoFields.bio, valid: bioValid },
                      });
                      
                      console.log("[PERSONAL-INFO] All questions answered:", allQuestionsAnswered);
                      console.log("[PERSONAL-INFO] Personal info valid:", personalInfoValid);
                      
                      // Detailed validation with specific missing fields
                      if (!allQuestionsAnswered) {
                        const unansweredQuestions = questions.filter(q => {
                          const value = formik.values[q.id];
                          return !value || typeof value !== 'string' || value.trim().length < 10;
                        });
                        toast.error(
                          t("signup.answerAllQuestions", { 
                            questions: unansweredQuestions.map(q => `Question ${q.id}`).join(", ") 
                          }) || `Please answer all questions completely (minimum 10 characters). Missing or incomplete: ${unansweredQuestions.map(q => `Question ${q.id}`).join(", ")}`
                        );
                        return;
                      }
                      
                      if (!personalInfoValid) {
                        const missingFields = [];
                        if (!genderValid) missingFields.push("Gender");
                        if (!nationalityValid) missingFields.push("Nationality");
                        if (!dobValid) missingFields.push("Date of Birth");
                        if (!cityValid) missingFields.push("City");
                        if (!bioValid) missingFields.push("Bio");
                        
                        console.error("[PERSONAL-INFO] Missing fields:", missingFields);
                        console.error("[PERSONAL-INFO] Field validation status:", {
                          gender: { value: personalInfoFields.gender, valid: genderValid },
                          nationality: { value: personalInfoFields.nationality, valid: nationalityValid },
                          date_of_birth: { value: personalInfoFields.date_of_birth, valid: dobValid },
                          city: { value: personalInfoFields.city, valid: cityValid },
                          bio: { value: personalInfoFields.bio, valid: bioValid },
                        });
                        
                        toast.error(t("signup.fillAllPersonalInfo", { fields: missingFields.join(", ") }) || `Please fill all personal information fields. Missing: ${missingFields.join(", ")}`);
                        return;
                      }
                      
                      // If all validations pass, trigger form submission
                      console.log("[PERSONAL-INFO] All validations passed, submitting form...");
                      await formik.submitForm();
                    }}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader className="w-4 h-4" />
                        {t("common.submitting") || "Submitting..."}
                      </span>
                    ) : (
                      t("signup.tab21") || "Continue"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading || !formik.isValid}
              className="w-full px-4 py-4 text-white bg-[#a797cc] rounded-xl hover:bg-[#8ba179] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={(e) => {
                // Log validation state before submit
                console.log("[PERSONAL-INFO] Form submit clicked");
                console.log("[PERSONAL-INFO] Form isValid:", formik.isValid);
                console.log("[PERSONAL-INFO] Form errors:", formik.errors);
                console.log("[PERSONAL-INFO] Form touched:", formik.touched);
                console.log("[PERSONAL-INFO] Form values:", formik.values);
                
                if (!formik.isValid) {
                  e.preventDefault();
                  const errorFields = Object.keys(formik.errors);
                  console.error("[PERSONAL-INFO] Validation failed. Error fields:", errorFields);
                  if (errorFields.length > 0) {
                    toast.error(t("signup.fillAllRequiredFields", { fields: errorFields.join(", ") }) || `Please fill all required fields: ${errorFields.join(", ")}`);
                  } else {
                    toast.error(t("signup.fillAllRequiredFieldsGeneric") || "Please fill all required fields");
                  }
                }
              }}
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

export default PersonalInfoQuestionsForm;





