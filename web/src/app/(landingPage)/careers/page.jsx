"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SubmitCareerApplicationApi, GetCareerPositionsApi, UploadFileApi } from "@/app/api/setting";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Loader from "@/components/Loader/Loader";
import { useRTL } from "@/utils/rtl";

export default function CareersPage() {
  const { t, i18n } = useTranslation();
  const { isRTL, textAlign, flexDirection, marginStart, marginEnd } = useRTL();
  const router = useRouter();
  
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const breadcrumbItems = [
    { label: t("breadcrumb.tab1") || "Home", href: "/" },
    { label: t("careers.title") || "Careers", href: "/careers" },
  ];

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const response = await GetCareerPositionsApi();
      if (response?.status === 1) {
        setPositions(response.data?.positions || response.data || []);
      }
    } catch (error) {
      console.error("Error fetching positions:", error);
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required(t("careers.validation.firstNameRequired") || "First name is required"),
    last_name: Yup.string().required(t("careers.validation.lastNameRequired") || "Last name is required"),
    email: Yup.string()
      .email(t("careers.validation.emailInvalid") || "Invalid email address")
      .required(t("careers.validation.emailRequired") || "Email is required"),
    position: Yup.string().required(t("careers.validation.positionRequired") || "Position is required"),
    cover_letter: Yup.string()
      .required(t("careers.validation.coverLetterRequired") || "Cover letter is required")
      .min(50, t("careers.validation.coverLetterMin") || "Cover letter must be at least 50 characters")
      .max(2000, t("careers.validation.coverLetterMax") || "Cover letter must not exceed 2000 characters"),
    resume_url: Yup.string().required(t("careers.validation.resumeRequired") || "Resume is required"),
  });

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      position: "",
      cover_letter: "",
      resume_url: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        const response = await SubmitCareerApplicationApi(values);
        if (response?.status === 1) {
          toast.success(response.message || t("careers.applicationSuccess") || "Application submitted successfully");
          formik.resetForm();
          router.push("/");
        } else {
          toast.error(response?.message || t("careers.applicationError") || "Failed to submit application");
        }
      } catch (error) {
        console.error("Error submitting application:", error);
        toast.error(error.response?.data?.message || t("careers.applicationError") || "Failed to submit application");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(t("careers.resumeInvalidType") || "Please upload a PDF or Word document");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("careers.resumeTooLarge") || "File size must be less than 5MB");
      return;
    }

    try {
      setUploadingResume(true);
      const uploadResponse = await UploadFileApi({
        file,
        dirName: "careers/resumes",
      });

      if (uploadResponse?.status === 1 && uploadResponse?.data?.file_url) {
        formik.setFieldValue("resume_url", uploadResponse.data.file_url);
        toast.success(t("careers.resumeUploaded") || "Resume uploaded successfully");
      } else {
        toast.error(uploadResponse?.message || t("careers.resumeUploadError") || "Failed to upload resume");
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error(t("careers.resumeUploadError") || "Failed to upload resume");
    } finally {
      setUploadingResume(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="container px-4 py-8 mx-auto md:px-8 lg:px-28">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900">
              {t("careers.title") || "Join Our Team"}
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              {t("careers.subtitle") || "We're always looking for talented individuals to join our team"}
            </p>
          </div>

          {/* Available Positions */}
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader />
            </div>
          ) : positions.length > 0 && (
            <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                {t("careers.availablePositions") || "Available Positions"}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {positions.map((position) => (
                  <div
                    key={position}
                    className="p-4 border border-gray-200 rounded-lg hover:border-[#a797cc] transition-colors"
                  >
                    <Icon icon="lucide:briefcase" className="w-6 h-6 text-[#a797cc] mb-2" />
                    <h3 className="font-semibold text-gray-900">{position}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Application Form */}
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">
              {t("careers.applyNow") || "Apply Now"}
            </h2>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    {t("careers.firstName") || "First Name"} *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] ${
                      formik.touched.first_name && formik.errors.first_name
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  {formik.touched.first_name && formik.errors.first_name && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.first_name}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    {t("careers.lastName") || "Last Name"} *
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] ${
                      formik.touched.last_name && formik.errors.last_name
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  {formik.touched.last_name && formik.errors.last_name && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.last_name}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  {t("careers.email") || "Email"} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                )}
              </div>

              {/* Position */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  {t("careers.position") || "Position"} *
                </label>
                <input
                  type="text"
                  name="position"
                  value={formik.values.position}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={t("careers.positionPlaceholder") || "e.g., Software Developer, Marketing Manager"}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] ${
                    formik.touched.position && formik.errors.position
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                />
                {formik.touched.position && formik.errors.position && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.position}</p>
                )}
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  {t("careers.resume") || "Resume/CV"} * (PDF or Word, max 5MB)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    disabled={uploadingResume}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#a797cc] file:text-white hover:file:bg-[#8b7ba8]"
                  />
                  {uploadingResume && <Loader />}
                </div>
                {formik.values.resume_url && (
                  <p className="mt-2 text-sm text-green-600">
                    <Icon icon="lucide:check-circle" className="inline w-4 h-4 mr-1" />
                    {t("careers.resumeUploaded") || "Resume uploaded successfully"}
                  </p>
                )}
                {formik.touched.resume_url && formik.errors.resume_url && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.resume_url}</p>
                )}
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  {t("careers.coverLetter") || "Cover Letter"} *
                </label>
                <textarea
                  name="cover_letter"
                  rows={8}
                  value={formik.values.cover_letter}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={t("careers.coverLetterPlaceholder") || "Tell us why you're interested in this position..."}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] resize-none ${
                    formik.touched.cover_letter && formik.errors.cover_letter
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                />
                {formik.touched.cover_letter && formik.errors.cover_letter && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.cover_letter}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formik.values.cover_letter.length}/2000 {t("careers.characters") || "characters"}
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting || uploadingResume}
                  className="w-full px-6 py-3 bg-[#a797cc] text-white rounded-lg font-semibold hover:bg-[#8b7ba8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader color="#fff" height="20" />
                      {t("careers.submitting") || "Submitting..."}
                    </span>
                  ) : (
                    t("careers.submit") || "Submit Application"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

