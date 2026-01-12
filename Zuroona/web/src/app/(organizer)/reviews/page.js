"use client";

import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Loader from "@/components/Loader/Loader";
import { getReviewList } from "@/redux/slices/ReviewsList";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactStars from "react-rating-stars-component";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@iconify/react";

export default function Reviews() {
  const { t, i18n } = useTranslation();
  const [showMore, setShowMore] = useState(false);
  const [starSize, setStarSize] = useState(25); // Default size for desktop
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const breadcrumbItems = [
    { label: t("breadcrumb.tab1"), href: "/joinUsEvent" },
    { label: t("breadcrumb.tab16"), href: "/reviews" },
  ];
  const { ReviewsList, loading } = useSelector(
    (state) => state.ReviewsListData
  );
  useEffect(() => {
    dispatch(getReviewList({ page: page }));

    const updateStarSize = () => {
      if (window.innerWidth < 768) {
        setStarSize(20); // For mobile screens (or below 768px)
      } else {
        setStarSize(25); // Default size for larger screens
      }
    };

    // Listen to window resize
    window.addEventListener("resize", updateStarSize);

    // Set initial size on mount
    updateStarSize();

    return () => {
      window.removeEventListener("resize", updateStarSize);
    };
  }, [dispatch, page]);

  const ratingSummary = useMemo(() => {
    const avg = ReviewsList?.data?.ratings?.avg_rating || 0;
    const total = ReviewsList?.data?.ratings?.total_count || 0;
    const counts = ReviewsList?.data?.ratings?.ratings_counts || [];
    return {
      avg,
      total,
      breakdown: [5, 4, 3, 2, 1].map(
        (star) => counts.find((c) => c.star === star)?.count || 0
      ),
    };
  }, [ReviewsList]);

  const percentage = (count) => {
    if (!ratingSummary.total) return 0;
    return Math.round((count / ratingSummary.total) * 100);
  };

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <section className="bg-white min-h-screen py-12 md:py-16">
        <div className="mx-auto px-4 md:px-8 xl:px-28 max-w-7xl">
          {loading ? (
            <div className="flex justify-center items-center w-full min-h-[400px]">
              <Loader />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Rating Summary - Professional Card */}
              <div className="col-span-1 bg-white rounded-2xl shadow-xl p-6 md:p-8 h-fit border border-gray-100 sticky top-6">
                <div className="text-center mb-6 pb-6 border-b border-gray-200">
                  <div className="text-6xl font-bold text-gray-900 leading-none mb-3">
                    {ratingSummary.avg?.toFixed(1) || "0.0"}
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <ReactStars
                      count={5}
                      size={24}
                      activeColor="#a797cc"
                      value={ratingSummary.avg}
                      isHalf={true}
                      edit={false}
                    />
                  </div>
                  <p className="text-base text-gray-600 font-medium">
                    {ratingSummary.total} {t("events.totalReviews") || t("review.tab1") || "Total Reviews"}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{t("events.ratingBreakdown") || "Rating Breakdown"}</h3>
                  {[5, 4, 3, 2, 1].map((star, idx) => (
                    <div key={star} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-700 font-semibold">
                          <span>{star}</span>
                          <Icon icon="lucide:star" className="w-4 h-4 text-[#a797cc] fill-[#a797cc]" />
                        </div>
                        <span className="text-gray-700 font-semibold">
                          {ratingSummary.breakdown[idx]}
                        </span>
                      </div>
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-3 bg-gradient-to-r from-[#a797cc] to-[#8ba179] rounded-full transition-all duration-500"
                          style={{ width: `${percentage(ratingSummary.breakdown[idx])}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 text-right">
                        {percentage(ratingSummary.breakdown[idx])}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews List - Professional Design */}
              <div className="col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">
                        {t("events.customerFeedback") || t("review.tab3") || "Customer Feedback"}
                      </p>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        {t("events.allReviews") || t("review.tab2") || "All Reviews"}
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {ReviewsList?.data?.reviews?.length > 0 ? (
                      ReviewsList.data.reviews.map((review, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 rounded-xl p-6 hover:shadow-lg hover:border-[#a797cc]/30 transition-all duration-300"
                        >
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-[#a797cc] to-orange-600 border-2 border-white shadow-lg">
                                <Image
                                  src={(() => {
                                    const getImageUrl = (imgPath) => {
                                      if (!imgPath) return "/assets/images/home/user-dummy.png";
                                      if (imgPath.includes("http://") || imgPath.includes("https://")) return imgPath;
                                      if (imgPath.startsWith("/uploads/")) {
                                        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3434";
                                        return `${apiBase}${imgPath}`;
                                      }
                                      return "/assets/images/home/user-dummy.png";
                                    };
                                    return getImageUrl(review?.profile_image);
                                  })()}
                                  alt="User avatar"
                                  width={56}
                                  height={56}
                                  className="object-cover w-full h-full"
                                  onError={(e) => {
                                    e.target.src = "/assets/images/home/user-dummy.png";
                                  }}
                                />
                              </div>
                              <div>
                                <p className="text-base font-bold text-gray-900">
                                  {review?.first_name} {review?.last_name}
                                </p>
                                {review?.email && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {review.email}
                                  </p>
                                )}
                                <p className="text-xs text-gray-400 mt-1">
                                  {review?.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              <div className="flex items-center gap-2">
                                <ReactStars
                                  count={5}
                                  size={starSize}
                                  activeColor="#a797cc"
                                  value={review?.rating || 0}
                                  isHalf={true}
                                  edit={false}
                                />
                                <span className="text-lg font-bold text-gray-900">
                                  {review?.rating?.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-700 leading-relaxed text-base">
                            {review?.description || "No description provided."}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
                        <Icon icon="lucide:message-square" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-lg font-semibold text-gray-600 mb-2">
                          {t("review.noReviews") || "No Reviews Yet"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {t("review.noReviewsDesc") || "Be the first to leave a review!"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
