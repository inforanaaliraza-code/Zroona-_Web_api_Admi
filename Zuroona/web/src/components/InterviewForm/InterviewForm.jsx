"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { OrganizerUpdateProfileApi } from "@/app/api/setting";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Image from "next/image";

const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

const InterviewForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  // Interview questions array
  const questions = [
    {
      id: "1",
      question: t("interview.1"),
      placeholder: t("interview.1placeholder"),
      type: "textarea",
    },
    {
      id: "2",
      question: t("interview.2"),
      placeholder: t("interview.2placeholder"),
      type: "textarea",
    },
    {
      id: "3",
      question: t("interview.3"),
      placeholder: t("interview.3placeholder"),
      type: "textarea",
    },
    {
      id: "4",
      question: t("interview.4"),
      placeholder: t("interview.4placeholder"),
      type: "textarea",
    },
  ];

  // Form validation schema
  const validationSchema = Yup.object().shape({
    "1": Yup.string()
      .required(t("common.required"))
      .min(24, t("validation.minLength", { count: 24 })),
    "2": Yup.string()
      .required(t("common.required"))
      .min(24, t("validation.minLength", { count: 24 })),
    "3": Yup.string()
      .required(t("common.required"))
      .min(24, t("validation.minLength", { count: 24 })),
    "4": Yup.string()
      .required(t("common.required"))
      .min(24, t("validation.minLength", { count: 24 })),
  });

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      "1": "",
      "2": "",
      "3": "",
      "4": "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await OrganizerUpdateProfileApi({
          interview: values
        });
        if (response?.status === 1) {
          router.push("/organizerSignup/bankDetail"); // Redirect to dashboard after successful submission
        } else {
          toast.error(response?.message);
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    },
  });

  // Handle next step
  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Get current question
  const currentQuestion = questions[currentStep];

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                index <= currentStep
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
              width: `${((currentStep + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="p-6 bg-white rounded-xl shadow-sm">
          {/* Question */}
          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-semibold text-gray-800 animate-fade-in">
              {currentQuestion.question}
            </h2>
            <div className="relative animate-fade-in">
              <textarea
                id={currentQuestion.id}
                name={currentQuestion.id}
                rows={6}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] text-black placeholder:text-gray-400 transition-all duration-300 ${
                  formik.touched[currentQuestion.id] &&
                  formik.errors[currentQuestion.id]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder={currentQuestion.placeholder}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[currentQuestion.id]}
              />
              {formik.touched[currentQuestion.id] &&
                formik.errors[currentQuestion.id] && (
                  <div className="mt-1 text-sm text-red-500 animate-fade-in">
                    {formik.errors[currentQuestion.id]}
                  </div>
                )}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-4 justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`px-6 py-2 rounded-lg font-medium ${
                currentStep === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-[#a797cc] border-2 border-[#a797cc] hover:bg-[#a797cc] hover:text-white transition-colors"
              }`}
            >
              {t("common.previous")}
            </button>
            {currentStep === questions.length - 1 ? (
              <button
                type="submit"
                className="px-6 py-2 bg-[#a797cc] text-white rounded-lg font-medium hover:bg-[#e16600] transition-colors"
                disabled={formik.isSubmitting}
              >
                {t("common.submit")}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={
                  !formik.values[currentQuestion.id] ||
                  (formik.touched[currentQuestion.id] &&
                    formik.errors[currentQuestion.id])
                }
                className={`px-6 py-2 rounded-lg font-medium ${
                  !formik.values[currentQuestion.id] ||
                  (formik.touched[currentQuestion.id] &&
                    formik.errors[currentQuestion.id])
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[#a797cc] text-white hover:bg-[#e16600] transition-colors"
                }`}
              >
                {t("common.next")}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default InterviewForm;
