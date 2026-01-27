"use client";

import { useState } from "react";
import Modal from "../common/Modal";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import { postRawData } from "@/app/api/index";
import { BASE_API_URL } from "@/until";
import Cookies from "js-cookie";
import { TOKEN_NAME } from "@/until";

const AttendeeReviewModal = ({ isOpen, onClose, attendee, onReviewSubmitted }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const formik = useFormik({
        initialValues: {
            rating: 0,
            description: "",
        },
        validationSchema: Yup.object({
            rating: Yup.number()
                .min(1, "Rating must be at least 1")
                .max(5, "Rating cannot exceed 5")
                .required("Rating is required"),
            description: Yup.string()
                .required("Review description is required")
                .min(10, "Description must be at least 10 characters")
                .max(500, "Description cannot exceed 500 characters"),
        }),
        enableReinitialize: true,
        onSubmit: async (values) => {
            if (!showConfirm) {
                setShowConfirm(true);
                return;
            }

            setLoading(true);
            try {
                const token = Cookies.get(TOKEN_NAME);
                // Use the correct user-review endpoint with proper payload format
                const payload = {
                    reviewed_id: attendee?.userId,
                    reviewed_type: "User", // Host is reviewing a User/Attendee
                    rating: values.rating,
                    description: values.description,
                };

                const response = await postRawData("user-reviews", payload);
                
                if (response?.status === 1) {
                    toast.success(response.message || t("reviews.reviewSubmitted") || "Review submitted successfully");
                    formik.resetForm();
                    setShowConfirm(false);
                    if (onReviewSubmitted) {
                        onReviewSubmitted();
                    }
                    onClose();
                } else {
                    toast.error(response?.message || "Failed to submit review");
                }
            } catch (error) {
                console.error("Error submitting review:", error);
                toast.error("Failed to submit review. Please try again.");
            } finally {
                setLoading(false);
            }
        },
    });

    const handleStarClick = (rating) => {
        formik.setFieldValue("rating", rating);
    };

    if (!isOpen || !attendee) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} width="lg">
            <div className="p-6">
                {!showConfirm ? (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {t("reviews.reviewAttendee") || "Review Attendee"}
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <Icon icon="lucide:x" className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-600 mb-2">
                                <span className="font-semibold">{t("reviews.attendee") || "Attendee"}:</span> {attendee.userName}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-semibold">{t("reviews.event") || "Event"}:</span> {attendee.eventName}
                            </p>
                        </div>

                        <form onSubmit={formik.handleSubmit}>
                            {/* Rating */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    {t("reviews.rating") || "Rating"} <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => handleStarClick(star)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Icon
                                                icon="lucide:star"
                                                className={`w-10 h-10 ${
                                                    star <= formik.values.rating
                                                        ? "text-yellow-400 fill-yellow-400"
                                                        : "text-gray-300"
                                                }`}
                                            />
                                        </button>
                                    ))}
                                    {formik.values.rating > 0 && (
                                        <span className="ml-2 text-sm font-medium text-gray-700">
                                            {formik.values.rating} / 5
                                        </span>
                                    )}
                                </div>
                                {formik.touched.rating && formik.errors.rating && (
                                    <p className="text-red-500 text-xs mt-1">{formik.errors.rating}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {t("reviews.comment") || "Comment"} <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows="5"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:border-transparent"
                                    placeholder={t("reviews.writeReview") || "Write your review about this attendee..."}
                                    {...formik.getFieldProps("description")}
                                />
                                {formik.touched.description && formik.errors.description && (
                                    <p className="text-red-500 text-xs mt-1">{formik.errors.description}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    {formik.values.description.length} / 500 {t("common.characters") || "characters"}
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                                >
                                    {t("common.cancel") || "Cancel"}
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3 px-6 bg-[#a797cc] text-white rounded-lg font-semibold hover:bg-[#8ba179] transition disabled:opacity-50"
                                >
                                    {loading ? <Loader color="#fff" height="20" /> : t("reviews.submit") || "Submit Review"}
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                                <Icon icon="lucide:alert-circle" className="w-8 h-8 text-yellow-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {t("reviews.confirmSubmit") || "Are you sure you want to submit this review?"}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {t("reviews.confirmSubmitDesc") || "Once submitted, this review cannot be edited."}
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                                <p className="text-sm text-gray-700 mb-2">
                                    <span className="font-semibold">{t("reviews.attendee") || "Attendee"}:</span> {attendee.userName}
                                </p>
                                <p className="text-sm text-gray-700 mb-2">
                                    <span className="font-semibold">{t("reviews.rating") || "Rating"}:</span> {formik.values.rating} / 5
                                </p>
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold">{t("reviews.comment") || "Comment"}:</span> {formik.values.description}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                                >
                                    {t("common.goBack") || "Go Back"}
                                </button>
                                <button
                                    onClick={formik.handleSubmit}
                                    disabled={loading}
                                    className="flex-1 py-3 px-6 bg-[#a797cc] text-white rounded-lg font-semibold hover:bg-[#8ba179] transition disabled:opacity-50"
                                >
                                    {loading ? <Loader color="#fff" height="20" /> : t("reviews.confirmSubmit") || "Yes, Submit"}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default AttendeeReviewModal;

