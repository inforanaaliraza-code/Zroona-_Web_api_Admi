"use client";

import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Loader from "../Loader/Loader";
import axios from "axios";
import { BASE_API_URL } from "@/until";

const AttendeeReviewsModal = ({ isOpen, onClose, userId, userName }) => {
    const { t } = useTranslation();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && userId) {
            fetchReviews();
        } else {
            setReviews([]);
            setError(null);
        }
    }, [isOpen, userId]);

    const fetchReviews = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch reviews for this user (attendee) from other hosts
            const response = await axios.get(`${BASE_API_URL}user-reviews/User/${userId}`, {
                headers: {
                    lang: 'en'
                }
            });

            const reviewsData = response.data;
            if (reviewsData?.status === 1 && reviewsData?.data) {
                setReviews(reviewsData.data?.reviews || reviewsData.data || []);
            } else if (reviewsData?.data) {
                setReviews(reviewsData.data?.reviews || reviewsData.data || []);
            } else if (Array.isArray(reviewsData)) {
                setReviews(reviewsData);
            } else {
                setReviews([]);
            }
        } catch (err) {
            console.error("[ATTENDEE-REVIEWS] Error fetching reviews:", err);
            setError(err.message || "Failed to load reviews");
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (imgPath) => {
        if (!imgPath) return "/assets/images/home/user-dummy.png";
        if (imgPath.includes("https://") || imgPath.includes("httpss://")) return imgPath;
        if (imgPath.startsWith("/uploads/")) {
            return `${BASE_API_URL.replace('/api/', '')}${imgPath}`;
        }
        return "/assets/images/home/user-dummy.png";
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <Modal isOpen={isOpen} onClose={onClose} width="lg">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {t("reviews.attendeeReviews") || "Reviews for"} {userName}
                        </h2>
                        {reviews.length > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Icon
                                            key={i}
                                            icon="lucide:star"
                                            className={`w-5 h-5 ${
                                                i < Math.round(averageRating)
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-gray-300"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-lg font-semibold text-gray-700">
                                    {averageRating} ({reviews.length} {t("reviews.reviews") || "reviews"})
                                </span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <Icon icon="lucide:x" className="w-6 h-6" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader />
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <Icon icon="lucide:alert-circle" className="w-16 h-16 mx-auto mb-4 text-red-400" />
                        <p className="text-red-600">{error}</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-12">
                        <Icon icon="lucide:message-square" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500 text-lg">
                            {t("reviews.noReviews") || "No reviews from other hosts yet"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {reviews.map((review, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden">
                                        <Image
                                            src={getImageUrl(
                                                review.organizer_id?.profile_image ||
                                                review.organizer?.profile_image ||
                                                review.profile_image
                                            )}
                                            alt="Host"
                                            width={48}
                                            height={48}
                                            className="object-cover w-full h-full"
                                            onError={(e) => {
                                                e.target.src = "/assets/images/home/user-dummy.png";
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold text-gray-900">
                                                {review.organizer_id
                                                    ? `${review.organizer_id.first_name || ''} ${review.organizer_id.last_name || ''}`.trim()
                                                    : review.organizer
                                                    ? `${review.organizer.first_name || ''} ${review.organizer.last_name || ''}`.trim()
                                                    : review.first_name || 'Host'}
                                            </h4>
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Icon
                                                        key={i}
                                                        icon="lucide:star"
                                                        className={`w-4 h-4 ${
                                                            i < (review.rating || 0)
                                                                ? "text-yellow-400 fill-yellow-400"
                                                                : "text-gray-300"
                                                        }`}
                                                    />
                                                ))}
                                                <span className="ml-1 text-sm font-medium text-gray-700">
                                                    {review.rating || 0}
                                                </span>
                                            </div>
                                        </div>
                                        {review.description && (
                                            <p className="text-gray-700 mb-2">{review.description}</p>
                                        )}
                                        {review.comment && (
                                            <p className="text-gray-700 mb-2">{review.comment}</p>
                                        )}
                                        {review.event_name && (
                                            <p className="text-xs text-gray-500 mb-1">
                                                {t("reviews.event") || "Event"}: {review.event_name}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500">
                                            {review.createdAt
                                                ? new Date(review.createdAt).toLocaleDateString()
                                                : ""}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default AttendeeReviewsModal;

