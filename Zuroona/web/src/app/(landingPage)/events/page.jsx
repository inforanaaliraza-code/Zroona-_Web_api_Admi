"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { GetUpcomingEvents, GetAllCategories } from "@/app/api/landing/apis";
import {
	isWithinInterval,
	startOfDay,
	endOfDay,
	startOfWeek,
	endOfWeek,
	isSameDay,
} from "date-fns";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import useAuthStore from "@/store/useAuthStore";
import { useRTL } from "@/utils/rtl";
import { BASE_API_URL } from "@/until";

const MotionDiv = motion.div;

// Helper function to safely get translations with fallbacks
const getTranslation = (t, key, fallback) => {
	try {
		const translation = t(key);
		// If translation returns the key itself, it means translation is missing
		if (translation === key || !translation) {
			return fallback;
		}
		return translation;
	} catch (error) {
		return fallback;
	}
};

const formatTime = (time) => {
	return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
};

const getEventForLabel = (eventFor, t) => {
	switch (eventFor) {
		case 1:
			return { label: getTranslation(t, "events.menOnly", "Men Only"), icon: "👨" };
		case 2:
			return { label: getTranslation(t, "events.womenOnly", "Women Only"), icon: "👩" };
		case 3:
			return { label: getTranslation(t, "events.allWelcome", "All Welcome"), icon: "👥" };
		default:
			return { label: getTranslation(t, "events.allWelcome", "All Welcome"), icon: "👥" };
	}
};

// Permanent Event Categories List (name used as fallback; display uses t())
const PERMANENT_CATEGORIES = [
	{ _id: 'cultural-traditional', key: 'categoryCulturalTraditional', name: 'Cultural & Traditional Events' },
	{ _id: 'outdoor-adventure', key: 'categoryOutdoorAdventure', name: 'Outdoor & Adventure' },
	{ _id: 'educational-workshops', key: 'categoryEducationalWorkshops', name: 'Educational & Workshops' },
	{ _id: 'sports-fitness', key: 'categorySportsFitness', name: 'Sports & Fitness' },
	{ _id: 'music-arts', key: 'categoryMusicArts', name: 'Music & Arts' },
	{ _id: 'family-kids', key: 'categoryFamilyKids', name: 'Family & Kids Activities' },
	{ _id: 'food-culinary', key: 'categoryFoodCulinary', name: 'Food & Culinary Experiences' },
	{ _id: 'wellness-relaxation', key: 'categoryWellnessRelaxation', name: 'Wellness & Relaxation' },
	{ _id: 'heritage-history', key: 'categoryHeritageHistory', name: 'Heritage & History Tours' },
	{ _id: 'nightlife-entertainment', key: 'categoryNightlifeEntertainment', name: 'Nightlife & Entertainment' },
	{ _id: 'eco-sustainable', key: 'categoryEcoSustainable', name: 'Eco & Sustainable Tourism' },
	{ _id: 'business-networking', key: 'categoryBusinessNetworking', name: 'Business & Networking' },
	{ _id: 'volunteering', key: 'categoryVolunteering', name: 'Volunteering' },
	{ _id: 'photography-sightseeing', key: 'categoryPhotographySightseeing', name: 'Photography & Sightseeing' },
];

const EventsPage = () => {
	const { t, i18n, ready } = useTranslation();
	const { isRTL, textAlign, flexDirection, marginStart, marginEnd } = useRTL();
	const { user, isAuthenticated } = useAuthStore();
	const [events, setEvents] = useState([]);
	const [allEvents, setAllEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [showFilters, setShowFilters] = useState(false);
	const [filters, setFilters] = useState({
		categories: []
	});

	// Sorting options
	const [sortBy, setSortBy] = useState("none"); // none, date-asc, date-desc

	// Booking status tabs: all | approved | waiting | rejected | cancelled
	const [bookingTab, setBookingTab] = useState("all");

	// Prevent hydration errors by ensuring component is mounted AND translations loaded
	const [isMounted, setIsMounted] = useState(false);
	const [i18nReady, setI18nReady] = useState(false);

	useEffect(() => {
		setIsMounted(true);
		// Set i18n ready immediately - translations will load in background
		// Don't block data fetching for translations
		setI18nReady(true);
	}, []);

	useEffect(() => {
		// Only fetch data if component is mounted and i18n is ready (or timeout reached)
		if (!isMounted) return;

		const fetchData = async () => {
			try {
				setLoading(true);
				console.log("[EVENTS] Fetching events...");
				const eventsResponse = await GetUpcomingEvents();
				console.log("[EVENTS] API Response:", eventsResponse);

				// Handle different response formats - API returns { status, message, data, total_count }
				let eventsData = [];

				// Check if response is directly an array
				if (Array.isArray(eventsResponse)) {
					eventsData = eventsResponse;
				}
				// Check for standard API response format
				else if (eventsResponse && (eventsResponse.status === 1 || eventsResponse.status === true)) {
					if (Array.isArray(eventsResponse.data)) {
						eventsData = eventsResponse.data;
					} else if (eventsResponse?.events && Array.isArray(eventsResponse.events)) {
						eventsData = eventsResponse.events;
					} else if (eventsResponse?.result && Array.isArray(eventsResponse.result)) {
						eventsData = eventsResponse.result;
					}
				}
				// Check for data property
				else if (eventsResponse?.data) {
					if (Array.isArray(eventsResponse.data)) {
						eventsData = eventsResponse.data;
					} else if (Array.isArray(eventsResponse.data.events)) {
						eventsData = eventsResponse.data.events;
					}
				}

				// If still no data, try to extract from any nested structure
				if (eventsData.length === 0 && eventsResponse) {
					// Try to find any array in the response
					for (const key in eventsResponse) {
						if (Array.isArray(eventsResponse[key])) {
							eventsData = eventsResponse[key];
							break;
						}
					}
				}

				console.log("[EVENTS] Extracted events data:", eventsData);
				console.log("[EVENTS] Number of events:", eventsData.length);

				// Map API response to frontend format
				const mappedEvents = eventsData.map(event => ({
					_id: event._id,
					event_name: event.event_name,
					event_description: event.event_description,
					event_address: event.event_address,
					event_price: event.event_price,
					event_date: event.event_date,
					event_start_time: event.event_start_time,
					event_end_time: event.event_end_time,
					event_type: event.event_type,
					event_for: event.event_for || 3,
					event_image: event.event_image || event.event_images?.[0],
					event_images: event.event_images || (event.event_image ? [event.event_image] : []),
					no_of_attendees: event.no_of_attendees,
					organizer: event.organizer_id || event.organizer,
					organizer_rating: event.organizer_rating,
					category_name: event.category_name || event.event_category,
					is_cancelled: event.is_cancelled,
					event_status: event.event_status,
					book_status: event.book_status || event.user_booking?.book_status,
					payment_status: event.payment_status || event.user_booking?.payment_status,
					user_booking: event.user_booking,
					booked_event: event.user_booking,
				}));

				// Exclude cancelled events from Events of the Week / All Events (defense in depth)
				const nonCancelled = mappedEvents.filter((e) => {
					const cancelled = e.is_cancelled === true || e.is_cancelled === 1;
					const statusCancelled = String(e.event_status || "").toLowerCase() === "cancelled";
					return !cancelled && !statusCancelled;
				});

				setAllEvents(nonCancelled);
				setEvents(nonCancelled);
				console.log("[EVENTS] Using API events:", mappedEvents.length);
				setLoading(false);
			} catch (error) {
				console.error("[EVENTS] Error fetching events:", error);
				console.error("[EVENTS] Error details:", {
					message: error.message,
					response: error.response?.data,
					status: error.response?.status
				});

				// On error, set empty array (no dummy events)
				console.log("[EVENTS] Error occurred, setting empty array");
				setAllEvents([]);
				setEvents([]);
				setLoading(false);
			}
		};

		// Fetch data immediately after mount, don't wait for i18n
		// i18n will load in background and translations will update
		fetchData();
	}, [isMounted, isAuthenticated]);

	// Filter and sort events based on booking tab, search term, filters, sort option
	useEffect(() => {
		if (!allEvents.length) return;

		let filteredEvents = [...allEvents];

		// Apply booking status tab filter (when authenticated)
		if (isAuthenticated && bookingTab !== "all") {
			if (bookingTab === "approved") {
				filteredEvents = filteredEvents.filter((e) => e.book_status === 2);
			} else if (bookingTab === "waiting") {
				filteredEvents = filteredEvents.filter((e) => e.book_status === 0 || e.book_status === 1);
			} else if (bookingTab === "rejected") {
				filteredEvents = filteredEvents.filter((e) => e.book_status === 4);
			} else if (bookingTab === "cancelled") {
				filteredEvents = filteredEvents.filter((e) => e.book_status === 3);
			}
		}

		// Apply search filter
		if (searchTerm.trim()) {
			const term = searchTerm.toLowerCase();
			filteredEvents = filteredEvents.filter(
				(event) =>
					event.event_name?.toLowerCase().includes(term) ||
					event.event_description?.toLowerCase().includes(term) ||
					event.event_address?.toLowerCase().includes(term)
			);
		}

		// Apply category filter
		if (filters.categories && filters.categories.length > 0) {
			filteredEvents = filteredEvents.filter((event) => {
				// Check if event category matches any selected category
				const eventCategory = event.category_name; // This is the ID string (e.g. 'music-arts')

				if (!eventCategory) return false;

				return filters.categories.includes(eventCategory);
			});
		}

		// Apply sorting
		if (sortBy !== "none") {
			filteredEvents.sort((a, b) => {
				// Sort by date (newest to oldest)
				if (sortBy === "date-desc") {
					return new Date(b.event_date) - new Date(a.event_date);
				}
				// Sort by date (oldest to newest)
				else if (sortBy === "date-asc") {
					return new Date(a.event_date) - new Date(b.event_date);
				}
				return 0;
			});
		}

		setEvents(filteredEvents);
	}, [searchTerm, filters, sortBy, allEvents, bookingTab, isAuthenticated]);


	const handleSortChange = (value) => {
		setSortBy(value);
	};

	const toggleFilter = () => {
		setShowFilters(!showFilters);
	};

	const clearFilters = () => {
		// Clear search term
		setSearchTerm("");

		// Reset filters to default
		setFilters({
			categories: []
		});

		// Reset sorting
		setSortBy("none");

		// Reset to all events immediately
		setEvents(allEvents);
	};

	const toggleCategoryFilter = (categoryId) => {
		setFilters(prev => {
			const currentCategories = prev.categories || [];
			// Check if already selected
			const isSelected = currentCategories.includes(categoryId);

			if (isSelected) {
				// Remove id
				return {
					...prev,
					categories: currentCategories.filter(id => id !== categoryId)
				};
			} else {
				// Add id
				return {
					...prev,
					categories: [...currentCategories, categoryId]
				};
			}
		});
	};

	// Show loading state during SSR/hydration to prevent mismatch
	// Only wait for mount, not i18n (i18n will load in background)
	if (!isMounted) {
		return (
			<div className="container px-4 py-8 mx-auto">
				<div className="mx-auto max-w-7xl">
					<div className="animate-pulse space-y-4">
						<div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
						<div className="h-4 bg-gray-200 rounded w-96 mb-6"></div>
						<div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<div className="h-64 bg-gray-200 rounded"></div>
							<div className="h-64 bg-gray-200 rounded"></div>
							<div className="h-64 bg-gray-200 rounded"></div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Show loading spinner if data is still loading
	if (loading) {
		return (
			<div className="container px-4 py-8 mx-auto">
				<div className="mx-auto max-w-7xl">
					<div className="flex flex-col items-center justify-center min-h-[400px]">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a797cc] mb-4"></div>
						<p className="text-gray-600">{getTranslation(t, "events.loading", "Loading events...")}</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container px-4 py-8 mx-auto">
			<div className="mx-auto max-w-7xl">
				<h1 className="mb-2 text-3xl font-bold text-gray-900">
					{getTranslation(t, "events.upcomingEvents", "Events of the Week")}
				</h1>
				<p className="mb-6 text-gray-600">
					{getTranslation(t, "events.discoverEvents", "Discover and book amazing events happening in your city")}
				</p>

				{/* Booking status tabs */}
				<div className={`mb-6 flex flex-wrap gap-2 ${flexDirection}`}>
					{[
						{ key: "all", labelKey: "events.bookingTabAll", labelFallback: "All Events" },
						{ key: "approved", labelKey: "events.bookingTabApproved", labelFallback: "Approved" },
						{ key: "waiting", labelKey: "events.bookingTabWaitingByHost", labelFallback: "Waiting by Host" },
						{ key: "rejected", labelKey: "events.bookingTabRejected", labelFallback: "Rejected" },
						{ key: "cancelled", labelKey: "events.bookingTabCancelled", labelFallback: "Cancelled" },
					].map((tab) => (
						<button
							key={tab.key}
							type="button"
							onClick={() => setBookingTab(tab.key)}
							className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
								bookingTab === tab.key
									? "bg-[#a797cc] text-white shadow-md"
									: "bg-white border-2 border-gray-200 text-gray-700 hover:border-[#a797cc] hover:bg-[#a797cc]/5"
							}`}
						>
							{getTranslation(t, tab.labelKey, tab.labelFallback)}
						</button>
					))}
				</div>

				{/* Booking Flow Guide - Show for authenticated users */}
				{isAuthenticated && (
					<div className="mb-8 bg-gradient-to-r from-[#a797cc]/10 to-orange-50 rounded-xl p-6 border border-[#a797cc]/20">
						<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
							<Icon icon="lucide:info" className="w-5 h-5 text-[#a797cc]" />
							{getTranslation(t, "events.howItWorks", "How It Works")}
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							<div className="flex items-start gap-3">
								<div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white font-bold flex-shrink-0">
									1
								</div>
								<div>
									<h4 className="font-semibold text-gray-900 text-sm mb-1">
										{getTranslation(t, "events.step1", "Book Event")}
									</h4>
									<p className="text-xs text-gray-600">
										{getTranslation(t, "events.step1Desc", "Click 'Book Now' on any event")}
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500 text-white font-bold flex-shrink-0">
									2
								</div>
								<div>
									<h4 className="font-semibold text-gray-900 text-sm mb-1">
										{getTranslation(t, "events.step2", "Wait for Approval")}
									</h4>
									<p className="text-xs text-gray-600">
										{getTranslation(t, "events.step2Desc", "Host will review your booking")}
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500 text-white font-bold flex-shrink-0">
									3
								</div>
								<div>
									<h4 className="font-semibold text-gray-900 text-sm mb-1">
										{getTranslation(t, "events.step3", "Make Payment")}
									</h4>
									<p className="text-xs text-gray-600">
										{getTranslation(t, "events.step3Desc", "Pay securely after approval")}
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white font-bold flex-shrink-0">
									4
								</div>
								<div>
									<h4 className="font-semibold text-gray-900 text-sm mb-1">
										{getTranslation(t, "events.step4", "Join Group Chat")}
									</h4>
									<p className="text-xs text-gray-600">
										{getTranslation(t, "events.step4Desc", "Chat with host and other guests")}
									</p>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Search and Filter Bar */}
				<div className={`flex flex-col gap-4 mb-6 md:${flexDirection}`}>
					<div className="relative flex-grow">
							<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
								<Icon
									icon="lucide:search"
									className="h-5 w-5 text-[#a797cc]"
								/>
							</div>
						<Input
							type="text"
							placeholder={getTranslation(t, "events.searchEvents", "Search events...")}
							className={`pl-10 pr-4 py-2.5 w-full rounded-lg border-2 border-gray-200 bg-gray-50 shadow-sm focus:ring-[#a797cc] focus:border-[#a797cc] text-gray-700 font-medium ${textAlign}`}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					<Button
						onClick={toggleFilter}
						variant="outline"
						className={`flex items-center gap-2 font-semibold border-2 py-2.5 ${showFilters
							? "bg-[#a797cc]/10 text-[#a797cc] border-[#a797cc]"
							: "border-gray-300 bg-gray-50 text-gray-800 shadow-sm hover:bg-[#a797cc]/5 hover:border-[#a797cc]/50 hover:text-[#a797cc]"
							}`}
					>
						<Icon
							icon="lucide:filter"
							className={`h-5 w-5 ${showFilters ? "text-[#a797cc]" : "text-gray-700"
								}`}
						/>
						{getTranslation(t, "events.filter", "Filter")}
					</Button>
				</div>

				{/* Filter Panel */}
				<AnimatePresence>
					{showFilters && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}
							className="p-6 mb-6 border-2 border-gray-200 shadow-lg bg-gray-50 rounded-xl"
						>
							<div className={`flex items-center justify-between mb-6 ${flexDirection}`}>
								<h3 className={`flex items-center text-xl font-semibold text-gray-800 ${flexDirection}`}>
									<Icon
										icon="lucide:sliders-horizontal"
										className={`${marginEnd(2)} h-5 w-5 text-[#a797cc]`}
									/>
									{getTranslation(t, "events.filters", "Filters")}
								</h3>
								<Button
									variant="ghost"
									size="sm"
									onClick={clearFilters}
									className="text-gray-700 hover:text-[#a797cc] hover:bg-[#a797cc]/10 font-semibold"
								>
									{getTranslation(t, "events.clearFilters", "Clear Filters")}
								</Button>
							</div>

							<div className="space-y-6">
								{/* Category Filter */}
								<div className="p-4 space-y-4 bg-white border border-gray-200 rounded-lg shadow-sm">
									<h4 className={`flex items-center pb-2 font-semibold text-gray-800 border-b border-gray-200 ${flexDirection}`}>
										<Icon
											icon="lucide:tag"
											className={`${marginEnd(2)} h-4 w-4 text-[#a797cc]`}
										/>
										{getTranslation(t, "events.categories", "Categories")}
									</h4>

									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
										{PERMANENT_CATEGORIES.map((category) => (
											<div
												key={category._id}
												className={`flex items-center space-x-2 p-2 rounded-md transition-colors hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 ${filters.categories.includes(category._id) ? 'bg-[#a797cc]/5 border-[#a797cc]/30' : ''
													}`}
												onClick={() => toggleCategoryFilter(category._id)}
											>
												<Checkbox
													id={`filter-cat-${category._id}`}
													checked={filters.categories.includes(category._id)}
													onCheckedChange={() => toggleCategoryFilter(category._id)}
													className="text-[#a797cc] border-2 border-gray-300 h-5 w-5 pointer-events-none"
												/>
												<div
													className={`flex-1 font-medium text-gray-700 pointer-events-none ${flexDirection}`}
												>
													{getTranslation(t, `events.${category.key}`, category.name)}
												</div>
											</div>
										))}
									</div>
								</div>

								{/* Sorting Options */}
								<div className="p-4 space-y-4 bg-white border border-gray-200 rounded-lg shadow-sm">
									<h4 className="flex items-center pb-2 font-semibold text-gray-800 border-b border-gray-200">
										<Icon
											icon="lucide:sort"
											className="mr-2 h-4 w-4 text-[#a797cc]"
										/>
										{getTranslation(t, "events.sortBy", "Sort By")}
									</h4>
									<div className="p-1 space-y-3">
										{/* Date: Newest to Oldest */}
										<div className="flex items-center p-2 space-x-2 transition-colors rounded-md hover:bg-gray-50">
											<Checkbox
												id="sort-date-desc"
												checked={sortBy === "date-desc"}
												onCheckedChange={(checked) => {
													if (checked)
														handleSortChange(
															"date-desc"
														);
													else
														handleSortChange(
															"none"
														);
												}}
												className="text-[#a797cc] border-2 border-gray-300 h-5 w-5"
											/>
											<Label
												htmlFor="sort-date-desc"
												className="flex items-center font-medium text-gray-700 cursor-pointer"
											>
												<Icon
													icon="lucide:calendar"
													className="mr-2 h-4 w-4 text-[#a797cc]"
												/>
												{getTranslation(t, "events.newestToOldest", "Date: Newest to Oldest")}
											</Label>
										</div>

										{/* Date: Oldest to Newest */}
										<div className="flex items-center p-2 space-x-2 transition-colors rounded-md hover:bg-gray-50">
											<Checkbox
												id="sort-date-asc"
												checked={sortBy === "date-asc"}
												onCheckedChange={(checked) => {
													if (checked)
														handleSortChange(
															"date-asc"
														);
													else
														handleSortChange(
															"none"
														);
												}}
												className="text-[#a797cc] border-2 border-gray-300 h-5 w-5"
											/>
											<Label
												htmlFor="sort-date-asc"
												className="flex items-center font-medium text-gray-700 cursor-pointer"
											>
												<Icon
													icon="lucide:calendar"
													className="mr-2 h-4 w-4 text-[#a797cc]"
												/>
												{getTranslation(t, "events.oldestToNewest", "Date: Oldest to Newest")}
											</Label>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Results Summary */}
				<div className="flex items-center justify-between p-3 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
					<div className="flex items-center font-medium text-gray-700">
						<Icon
							icon="lucide:calendar"
							className="h-5 w-5 mr-2 text-[#a797cc]"
						/>
						<span className="text-[#a797cc] font-bold text-lg mr-1">
							{events.length}
						</span>{" "}
						{getTranslation(t, "events.eventsFound", "events found")}
					</div>
					{(searchTerm ||
						(filters.categories && filters.categories.length > 0) ||
						sortBy !== "none") && (
							<Button
								variant="outline"
								size="sm"
								onClick={clearFilters}
								className="text-sm text-gray-800 hover:text-[#a797cc] border border-gray-300 hover:border-[#a797cc] hover:bg-[#a797cc]/5 font-semibold"
							>
								<Icon
									icon="lucide:x"
									className="h-3.5 w-3.5 mr-1 text-gray-700"
								/>
								{getTranslation(t, "events.clearFilters", "Clear Filters")}
							</Button>
						)}
				</div>

				{loading ? (
					<div className="flex items-center justify-center py-20">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a797cc]"></div>
					</div>
				) : events.length === 0 ? (
					<div className="flex flex-col items-center justify-center p-8 py-16 text-center bg-white border border-gray-200 shadow-md rounded-xl">
						<Icon
							icon="lucide:calendar-x"
							className="w-16 h-16 mb-4 text-gray-300"
						/>
						<h3 className="mb-2 text-xl font-semibold text-gray-700">
							{bookingTab !== "all" && !isAuthenticated
								? getTranslation(t, "events.loginToSeeBookingsByStatus", "Log in to see your bookings by status")
								: bookingTab !== "all" && isAuthenticated
									? getTranslation(t, "events.noBookingsForThisStatus", "No bookings in this category")
									: getTranslation(t, "events.noEventsFoundFilter", "No events found matching your criteria")}
						</h3>
						<p className="max-w-md mb-6 text-gray-500">
							{bookingTab !== "all" && !isAuthenticated
								? getTranslation(t, "events.loginToSeeBookingsByStatusDesc", "Sign in to view your approved, pending, rejected and cancelled bookings.")
								: bookingTab !== "all" && isAuthenticated
									? getTranslation(t, "events.noBookingsForThisStatusDesc", "You have no events in this category yet.")
									: getTranslation(t, "events.tryAdjustingFilters", "Try adjusting your filters or search terms")}
						</p>
						{bookingTab !== "all" && !isAuthenticated ? (
							<Link href="/login">
								<Button className="bg-[#a797cc] hover:bg-[#8b7bb8] text-white font-semibold px-6 py-2.5 shadow-md">
									{getTranslation(t, "events.login", "Log in")}
								</Button>
							</Link>
						) : (
							<Button
								onClick={() => { setBookingTab("all"); clearFilters(); }}
								className="bg-[#a797cc] hover:bg-[#e06b0b] text-white font-semibold px-6 py-2.5 shadow-md"
							>
								{getTranslation(t, "events.showAllEvents", "Show All Events")}
							</Button>
						)}
					</div>
				) : (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{events.map((event, index) => {
							return (
								<MotionDiv
									key={event._id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{
										duration: 0.3,
										delay: index * 0.1,
										ease: "easeOut",
									}}
								>
									<Link href={`/events/${event._id}`} className="block h-full">
										<div className="h-full overflow-hidden transition-shadow bg-white shadow-md rounded-xl hover:shadow-lg">
											{/* Image */}
											<div className="relative h-48 overflow-hidden bg-gray-200">
												{(() => {
													const getImageUrl = (imgPath) => {
														if (!imgPath) return "/assets/images/home/event1.png";
														if (imgPath.includes("http://") || imgPath.includes("https://")) return imgPath;
														if (imgPath.startsWith("/uploads/")) {
															const apiBase = BASE_API_URL.replace(/\/api\/?$/, "");
															return `${apiBase}${imgPath}`;
														}
														return "/assets/images/home/event1.png";
													};
													const imageUrl = event.event_images?.[0] || event.event_image;
													return (
														<img
															src={getImageUrl(imageUrl)}
															alt={event.event_name || getTranslation(t, "events.eventDetails", "Event")}
															className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
															onError={(e) => {
																e.target.src = "/assets/images/home/event1.png";
															}}
														/>
													);
												})()}

												{/* Badges - Only booking status (Everyone Welcome badge removed) */}
												<div className="absolute flex flex-wrap gap-2 top-4 left-4">
													{/* Booking Status Badge - Show if user has booked this event */}
													{isAuthenticated && event.book_status !== undefined && (
														<Badge
															className={`bg-white/95 font-medium px-3 py-1 rounded-full text-sm shadow-lg backdrop-blur-sm border border-white/20 ${event.book_status === 2 && event.payment_status === 1
																? "bg-green-500/90 text-white"
																: event.book_status === 2 && event.payment_status === 0
																	? "bg-orange-500/90 text-white"
																	: event.book_status === 1 || event.book_status === 0
																		? "bg-yellow-500/90 text-white"
																		: event.book_status === 3
																			? "bg-red-500/90 text-white"
																			: "bg-gray-500/90 text-white"
																}`}
														>
															{event.book_status === 2 && event.payment_status === 1
																? "✓ Paid"
																: event.book_status === 2 && event.payment_status === 0
																	? "💳 Pay Now"
																	: event.book_status === 1 || event.book_status === 0
																		? "⏳ Pending"
																		: event.book_status === 3
																			? "✗ Rejected"
																			: ""}
														</Badge>
													)}
												</div>
											</div>

											{/* Content */}
											<div className="p-6">
												<h3 className="mb-2 text-xl font-semibold text-gray-900 line-clamp-1">
													{event.event_name}
												</h3>
												<p className="mb-4 text-sm text-gray-600 line-clamp-2">
													{event.event_description}
												</p>

												{/* Event Details */}
												<div className="space-y-2">
													<div className={`flex items-center text-sm text-gray-600 ${flexDirection}`}>
														<Icon
															icon="lucide:calendar"
															className={`h-4 w-4 ${marginEnd(2)} text-[#a797cc]`}
														/>
														<span className={textAlign}>
															{format(
																new Date(
																	event.event_date
																),
																"MMMM d, yyyy"
															)}
														</span>
													</div>
													<div className={`flex items-center text-sm text-gray-600 ${flexDirection}`}>
														<Icon
															icon="lucide:clock"
															className={`h-4 w-4 ${marginEnd(2)} text-[#a797cc]`}
														/>
														<span className={textAlign}>
															{formatTime(
																event.event_start_time
															)}{" "}
															-{" "}
															{formatTime(
																event.event_end_time
															)}
														</span>
													</div>
													<div className={`flex items-center text-sm text-gray-600 ${flexDirection}`}>
														<Icon
															icon="lucide:map-pin"
															className={`h-4 w-4 ${marginEnd(2)} text-[#a797cc]`}
														/>
														<span className={`line-clamp-1 ${textAlign}`}>
															{
																event.event_address
															}
														</span>
													</div>
												</div>

												{/* Price and Action */}
												<div className={`flex items-center justify-between mt-6 ${flexDirection}`}>
													<div className={textAlign}>
														<div className="text-lg font-semibold text-gray-900">
															{event.event_price}{" "}
															SAR
														</div>
														<div className="text-sm text-gray-500">
															{getTranslation(t, "events.perPerson", "per person")}
														</div>
													</div>
												</div>

												{/* Book Now Button - Show different states based on booking status */}
												<div className="mt-4" onClick={(e) => e.stopPropagation()}>
													{isAuthenticated && event.book_status !== undefined ? (
														// User has booked this event - show status-based button
														<Button
															onClick={(e) => {
																e.preventDefault();
																e.stopPropagation();
																if (event.book_status === 2 && event.payment_status === 0) {
																	// Redirect to event detail page for payment
																	window.location.href = `/events/${event._id}`;
																} else {
																	// Redirect to My Bookings page
																	window.location.href = `/myEvents`;
																}
															}}
															className={`w-full font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${flexDirection} ${event.book_status === 2 && event.payment_status === 1
																? "bg-green-600 hover:bg-green-700 text-white"
																: event.book_status === 2 && event.payment_status === 0
																	? "bg-orange-600 hover:bg-orange-700 text-white"
																	: event.book_status === 1 || event.book_status === 0
																		? "bg-yellow-600 hover:bg-yellow-700 text-white"
																		: "bg-gradient-to-r from-[#a797cc] to-[#8ba179] hover:from-[#8ba179] hover:to-[#7a9069] text-white"
																}`}
														>
															<Icon
																icon={
																	event.book_status === 2 && event.payment_status === 1
																		? "lucide:check-circle-2"
																		: event.book_status === 2 && event.payment_status === 0
																			? "lucide:credit-card"
																			: event.book_status === 1 || event.book_status === 0
																				? "lucide:clock"
																				: "lucide:calendar-plus"
																}
																className="h-5 w-5"
															/>
															{event.book_status === 2 && event.payment_status === 1
																? getTranslation(t, "events.viewBooking", "View Booking")
																: event.book_status === 2 && event.payment_status === 0
																	? getTranslation(t, "events.payNow", "Pay Now")
																	: event.book_status === 1 || event.book_status === 0
																		? getTranslation(t, "events.pendingApproval", "Pending Approval")
																		: getTranslation(t, "card.tab10", getTranslation(t, "card.tab16", "Book Now"))}
														</Button>
													) : (
														// User hasn't booked - show Book Now button
														<Button
															onClick={(e) => {
																e.preventDefault();
																e.stopPropagation();
																window.location.href = `/events/${event._id}`;
															}}
															className={`w-full bg-gradient-to-r from-[#a797cc] to-[#8ba179] hover:from-[#8ba179] hover:to-[#7a9069] text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${flexDirection}`}
														>
															<Icon
																icon="lucide:calendar-plus"
																className="h-5 w-5"
															/>
															{getTranslation(t, "card.tab10", getTranslation(t, "card.tab16", "Book Now"))}
														</Button>
													)}
												</div>
											</div>
										</div>
									</Link>
								</MotionDiv>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};

export default EventsPage;
