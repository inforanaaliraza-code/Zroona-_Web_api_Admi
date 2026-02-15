"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { BASE_API_URL } from "@/until";
import { getData } from "@/app/api/landing/apis";
import axios from "axios";

const getTranslation = (t, key, fallback) => {
	const translation = t(key);
	return translation && translation !== key ? translation : fallback;
};

export default function HostProfilePage() {
	const { t } = useTranslation();
	const params = useParams();
	const [host, setHost] = useState(null);
	const [reviews, setReviews] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("about");

	useEffect(() => {
		const fetchHostDetails = async () => {
			try {
				setLoading(true);
				console.log("[HOST-PROFILE] Fetching host details for ID:", params.id);
				
				// Fetch host details from landing page API (public endpoint)
				// Use axios directly to get better error handling
				try {
					const apiUrl = `${BASE_API_URL}landing/organizer/${params.id}`;
					console.log("[HOST-PROFILE] Making request to:", apiUrl);
					
					const response = await axios.get(apiUrl, {
						headers: {
							lang: 'en'
						},
						timeout: 10000 // 10 second timeout
					});
					
					console.log("[HOST-PROFILE] Response status:", response.status);
					console.log("[HOST-PROFILE] Host data response:", response.data);
					
					const hostData = response.data;
					
					// API returns: { status: 1, message: "...", data: {...}, total_count: 0 }
					if (hostData?.status === 1 && hostData?.data) {
						console.log("[HOST-PROFILE] Host found! Setting host data:", hostData.data);
						setHost(hostData.data);
					} else if (hostData?.status === 0) {
						// API returned error (404, 400, etc.)
						console.error("[HOST-PROFILE] API returned error status:", hostData.message);
						setHost(null);
					} else if (hostData?.data && !hostData.status) {
						// Handle case where data is returned directly
						console.log("[HOST-PROFILE] Host data set (direct format)");
						setHost(hostData.data);
					} else if (hostData && !hostData.status && hostData.first_name) {
						// Handle case where host object is returned directly
						console.log("[HOST-PROFILE] Host data set (object format)");
						setHost(hostData);
					} else {
						console.error("[HOST-PROFILE] Host not found or invalid response format:", hostData);
						setHost(null);
					}
				} catch (apiError) {
					console.error("[HOST-PROFILE] API Error:", apiError);
					console.error("[HOST-PROFILE] Error response:", apiError.response?.data);
					console.error("[HOST-PROFILE] Error status:", apiError.response?.status);
					
					if (apiError.response) {
						// Server responded with error
						const errorData = apiError.response.data;
						if (apiError.response.status === 404 || (errorData?.status === 0 && errorData?.message?.includes("not found"))) {
							console.log("[HOST-PROFILE] Host not found (404)");
							setHost(null);
						} else if (apiError.response.status === 400 || (errorData?.status === 0 && errorData?.message?.includes("Invalid"))) {
							console.log("[HOST-PROFILE] Invalid organizer ID (400)");
							setHost(null);
						} else {
							console.error("[HOST-PROFILE] Server error:", errorData);
							setHost(null);
						}
					} else if (apiError.request) {
						// Request made but no response
						console.error("[HOST-PROFILE] No response from server:", apiError.message);
						setHost(null);
					} else {
						// Error setting up request
						console.error("[HOST-PROFILE] Request setup error:", apiError.message);
						setHost(null);
					}
				}

				// Fetch host reviews from user review API (public endpoint)
				try {
					const reviewsResponse = await axios.get(`${BASE_API_URL}user-reviews/Organizer/${params.id}`, {
						headers: {
							lang: 'en'
						}
					});
					
					console.log("[HOST-PROFILE] Reviews data response:", reviewsResponse.data);
					
					const reviewsData = reviewsResponse.data;
					
					if (reviewsData?.status === 1 && reviewsData?.data) {
						setReviews(reviewsData.data?.reviews || reviewsData.data || []);
					} else if (reviewsData?.data) {
						setReviews(reviewsData.data?.reviews || reviewsData.data || []);
					} else if (Array.isArray(reviewsData)) {
						setReviews(reviewsData);
					} else {
						setReviews([]);
					}
				} catch (reviewError) {
					console.error("[HOST-PROFILE] Error fetching reviews:", reviewError);
					console.error("[HOST-PROFILE] Review error details:", {
						message: reviewError.message,
						response: reviewError.response?.data,
						status: reviewError.response?.status
					});
					setReviews([]);
				}
			} catch (error) {
				console.error("[HOST-PROFILE] Error fetching host details:", error);
				console.error("[HOST-PROFILE] Error details:", {
					message: error.message,
					response: error.response?.data,
					status: error.response?.status
				});
				setHost(null);
			} finally {
				setLoading(false);
			}
		};

		if (params.id) {
			fetchHostDetails();
		}
	}, [params.id]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#a797cc]"></div>
			</div>
		);
	}

	if (!host) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-50">
				<div className="text-center max-w-md px-4">
					<Icon icon="lucide:user-x" className="w-24 h-24 mx-auto mb-6 text-gray-400" />
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						{getTranslation(t, "host.notFound", "Host not found")}
					</h2>
					<p className="text-gray-600 mb-6">
						{getTranslation(t, "host.notFoundDescription", "The host profile you're looking for doesn't exist or has been removed.")}
					</p>
					<a
						href="/events"
						className="inline-flex items-center gap-2 px-6 py-3 bg-[#a797cc] text-white rounded-lg hover:bg-[#8ba179] transition-colors"
					>
						<Icon icon="lucide:arrow-left" className="w-5 h-5" />
						{getTranslation(t, "host.backToEvents", "Back to Events")}
					</a>
				</div>
			</div>
		);
	}

	const getImageUrl = (imgPath) => {
		if (!imgPath) return "/assets/images/home/user-dummy.png";
		if (imgPath.includes("https://") || imgPath.includes("httpss://")) return imgPath;
		if (imgPath.startsWith("/uploads/")) {
			const apiBase = BASE_API_URL.replace('/api/', '');
			return `${apiBase}${imgPath}`;
		}
		return "/assets/images/home/user-dummy.png";
	};

	const rating = host.rating?.overall || { rating: 0, totalReviews: 0 };

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container px-4 py-8 mx-auto max-w-7xl">
				{/* Header Section */}
				<div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
					<div className="flex flex-col md:flex-row items-start md:items-center gap-6">
						<div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-[#a797cc]/20 shadow-lg">
							<Image
								src={getImageUrl(host.profile_image)}
								alt={`${host.first_name} ${host.last_name}`}
								width={128}
								height={128}
								className="object-cover w-full h-full"
								onError={(e) => {
									e.target.src = "/assets/images/home/user-dummy.png";
								}}
							/>
						</div>
						<div className="flex-1">
							<h1 className="text-4xl font-bold text-gray-900 mb-2">
								{host.first_name} {host.last_name}
							</h1>
							<div className="flex items-center gap-4 mb-4">
								<div className="flex items-center gap-2 bg-[#a797cc]/10 px-4 py-2 rounded-lg">
									<Icon icon="lucide:star" className="w-5 h-5 text-[#a797cc] fill-[#a797cc]" />
									<span className="text-lg font-bold text-gray-900">{rating.rating || "N/A"}</span>
								</div>
								<span className="text-gray-600">
									({rating.totalReviews || 0} {getTranslation(t, "host.reviews", "Reviews")})
								</span>
							</div>
							{host.bio && (
								<p className="text-gray-700 text-lg leading-relaxed">{host.bio}</p>
							)}
						</div>
					</div>
				</div>

				{/* Tabs */}
				<div className="bg-white rounded-2xl shadow-xl mb-6">
					<div className="border-b border-gray-200">
						<nav className="flex -mb-px">
							<button
								onClick={() => setActiveTab("about")}
								className={`px-6 py-4 font-semibold text-sm border-b-2 transition-colors ${
									activeTab === "about"
										? "border-[#a797cc] text-[#a797cc]"
										: "border-transparent text-gray-500 hover:text-gray-700"
								}`}
							>
								{getTranslation(t, "host.about", "About")}
							</button>
							<button
								onClick={() => setActiveTab("reviews")}
								className={`px-6 py-4 font-semibold text-sm border-b-2 transition-colors ${
									activeTab === "reviews"
										? "border-[#a797cc] text-[#a797cc]"
										: "border-transparent text-gray-500 hover:text-gray-700"
								}`}
							>
								{getTranslation(t, "host.reviews", "Reviews")} ({reviews.length})
							</button>
						</nav>
					</div>

					<div className="p-8">
						{activeTab === "about" && (
							<div className="space-y-6">
								{host.bio && (
									<div>
										<h3 className="text-xl font-bold text-gray-900 mb-3">
											{getTranslation(t, "host.bio", "Bio")}
										</h3>
										<p className="text-gray-700 leading-relaxed whitespace-pre-line">{host.bio}</p>
									</div>
								)}
								<div>
									<h3 className="text-xl font-bold text-gray-900 mb-3">
										{getTranslation(t, "host.contactInfo", "Contact Information")}
									</h3>
									<div className="space-y-2">
										{host.email && (
											<div className="flex items-center gap-2 text-gray-700">
												<Icon icon="lucide:mail" className="w-5 h-5 text-[#a797cc]" />
												<span>{host.email}</span>
											</div>
										)}
										{host.phone_number && (
											<div className="flex items-center gap-2 text-gray-700">
												<Icon icon="lucide:phone" className="w-5 h-5 text-[#a797cc]" />
												<span>{host.country_code} {host.phone_number}</span>
											</div>
										)}
									</div>
								</div>
							</div>
						)}

						{activeTab === "reviews" && (
							<div className="space-y-6">
								{reviews.length > 0 ? (
									reviews.map((review, index) => (
										<div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
											<div className="flex items-start gap-4">
												<div className="relative w-12 h-12 rounded-full overflow-hidden">
													<Image
														src={getImageUrl(
															review.reviewer_id?.profile_image || 
															review.profile_image
														)}
														alt={
															review.reviewer_id?.first_name || 
															review.first_name || 
															"User"
														}
														width={48}
														height={48}
														className="object-cover w-full h-full"
														onError={(e) => {
															e.target.src = "/assets/images/home/user-dummy.png";
														}}
													/>
												</div>
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-2">
														<h4 className="font-semibold text-gray-900">
															{review.reviewer_id 
																? `${review.reviewer_id.first_name || ''} ${review.reviewer_id.last_name || ''}`.trim()
																: `${review.first_name || ''} ${review.last_name || ''}`.trim() || 'Anonymous'
															}
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
														</div>
													</div>
													{review.description && (
														<p className="text-gray-700 mb-2">{review.description}</p>
													)}
													{review.comment && (
														<p className="text-gray-700 mb-2">{review.comment}</p>
													)}
													<p className="text-sm text-gray-500">
														{review.createdAt
															? new Date(review.createdAt).toLocaleDateString()
															: ""}
													</p>
												</div>
											</div>
										</div>
									))
								) : (
									<div className="text-center py-12">
										<Icon icon="lucide:message-square" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
										<p className="text-gray-500 text-lg">
											{getTranslation(t, "host.noReviews", "No reviews yet")}
										</p>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

