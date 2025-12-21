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
		eventFor: {
			everyone: false, // 3 (not selected by default - all filters optional)
			male: false, // 1
			female: false, // 2
		},
	});

	// Sorting options
	const [sortBy, setSortBy] = useState("none"); // none, date-asc, date-desc

	// Store user's gender for filter logic
	const [userGender, setUserGender] = useState(null);

	// Prevent hydration errors by ensuring component is mounted AND translations loaded
	const [isMounted, setIsMounted] = useState(false);
	const [i18nReady, setI18nReady] = useState(false);

	useEffect(() => {
		setIsMounted(true);
		// Set i18n ready immediately - translations will load in background
		// Don't block data fetching for translations
		setI18nReady(true);
	}, []);

	/**
	 * Set user gender when authenticated and validate it
	 * According to requirements, only gender values "1" (male) and "2" (female) are supported
	 * Value "3" (both) has been removed as per requirements
	 */
	useEffect(() => {
		if (isAuthenticated && user) {
			// Helper function to safely parse gender values to numbers
			const parseGenderValue = (value) => {
				if (value === undefined || value === null) return 3; // Default to everyone

				// Handle string values
				if (typeof value === "string") {
					const trimmed = value.trim();
					// Handle empty strings
					if (trimmed === "") return 3;

					// Try to parse as integer
					const parsed = parseInt(trimmed);
					if (
						!isNaN(parsed) &&
						(parsed === 1 || parsed === 2 || parsed === 3)
					) {
						return parsed;
					}

					// Handle decimal strings that might be passed
					if (trimmed === "1.0" || trimmed === "1,0") return 1;
					if (trimmed === "2.0" || trimmed === "2,0") return 2;
					if (trimmed === "3.0" || trimmed === "3,0") return 3;
				}

				// Handle number values
				if (typeof value === "number") {
					if (value === 1 || value === 2 || value === 3) {
						return value;
					}

					// Handle potential floating point values
					if (Math.abs(value - 1) < 0.1) return 1;
					if (Math.abs(value - 2) < 0.1) return 2;
					if (Math.abs(value - 3) < 0.1) return 3;
				}

				// Default to everyone for any other case
				return 3;
			};

			// Try to extract gender from different possible locations
			let genderValue = null;

			// Check direct gender property
			if ("gender" in user) {
				genderValue = parseGenderValue(user.gender);
			}
			// Check nested locations if gender not found or invalid
			else if (user._doc && "gender" in user._doc) {
				genderValue = parseGenderValue(user._doc.gender);
			} else if (user.profile && "gender" in user.profile) {
				genderValue = parseGenderValue(user.profile.gender);
			} else {
				// Check for alternative gender property names
				const possibleGenderFields = [
					"gender_id",
					"genderId",
					"sex",
					"user_gender",
				];
				for (const field of possibleGenderFields) {
					if (field in user) {
						genderValue = parseGenderValue(user[field]);
						break;
					}
				}
			}

			// Set gender state based on found and normalized value
			if (genderValue) {
				setUserGender(genderValue);
			} else {
				setUserGender(null);
			}
		} else {
			setUserGender(null);
		}
	}, [isAuthenticated, user]);


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
					event_for: event.event_for || 3, // Default to everyone
					event_image: event.event_image || event.event_images?.[0],
					event_images: event.event_images || (event.event_image ? [event.event_image] : []),
					no_of_attendees: event.no_of_attendees,
					organizer: event.organizer_id || event.organizer,
					organizer_rating: event.organizer_rating,
					category_name: event.category_name || event.event_category,
					// Include booking status if available
					book_status: event.book_status || event.user_booking?.book_status,
					payment_status: event.payment_status || event.user_booking?.payment_status,
					user_booking: event.user_booking,
					booked_event: event.user_booking, // For compatibility
				}));
				
				// Use API events as-is (no dummy events)
				setAllEvents(mappedEvents);
				setEvents(mappedEvents);
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

	// Filter and sort events based on search term, filters, sort option, and user gender
	useEffect(() => {
		if (!allEvents.length) return;

		let filteredEvents = [...allEvents];

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

		// Apply gender filter from UI controls (if explicitly selected)
		const { everyone, male, female } = filters.eventFor;

		// Apply gender filters - only if at least one is selected from UI
		if (everyone || male || female) {
			// First apply strict gender validation rules based on authentication
			// Ensure we don't show gender-specific events that don't match the user's gender
			let validGenderFilters = {
				everyone: everyone, // Always a valid filter option
				male: male && isAuthenticated && userGender === 1,
				female: female && isAuthenticated && userGender === 2,
			};

			filteredEvents = filteredEvents.filter((event) => {
				// Event for value: 1 = male only, 2 = female only, 3 = everyone

				// Default to "all genders" (3) if event_for is not specified
				const eventFor = event.event_for || 3;

				// Convert to number for consistent comparison
				const eventForNum =
					typeof eventFor === "string"
						? parseInt(eventFor)
						: eventFor;

				if (
					validGenderFilters.everyone &&
					(eventForNum === 3 || !event.event_for)
				)
					return true;
				if (validGenderFilters.male && eventForNum === 1) return true;
				if (validGenderFilters.female && eventForNum === 2) return true;
				return false;
			});
		}
		// If no explicit filter is selected, filter based on authentication and gender
		else {
			// Apply default gender filtering based on authentication status AND valid gender
			if (isAuthenticated && userGender) {
				// Only filter by gender if user has a valid gender value set
				const userGenderValue = parseInt(userGender);

				// Show events matching user's gender or events for "all genders"
				filteredEvents = filteredEvents.filter((event) => {
					// Default to "all genders" (3) if event_for is not specified
					const eventFor = event.event_for || 3;

					// Convert event_for to number for consistent comparison
					const eventForNum =
						typeof eventFor === "string"
							? parseInt(eventFor)
							: eventFor;

					// Show if event is specifically for user's gender OR is for everyone (3)
					return eventForNum === userGenderValue || eventForNum === 3;
				});
			} else {
				// For authenticated users without gender OR non-authenticated users
				// Show ALL events (don't filter by gender)
				// This allows users to see all events even if gender is not set
				// The API will handle any necessary filtering
				console.log("[EVENTS] No gender filter applied - showing all events");
			}
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
	}, [searchTerm, filters, sortBy, allEvents, isAuthenticated, userGender]);

	// Reset gender filters when authentication state changes
	useEffect(() => {
		// Reset gender-specific filters when user logs out or gender changes
		setFilters((prev) => ({
			...prev,
			eventFor: {
				...prev.eventFor,
				// Keep "everyone" filter as is
				// Reset male/female based on auth state and gender
				male: prev.eventFor.male && isAuthenticated && userGender === 1,
				female:
					prev.eventFor.female && isAuthenticated && userGender === 2,
			},
		}));
	}, [isAuthenticated, userGender]);

	const handleSortChange = (value) => {
		setSortBy(value);
	};

	const toggleFilter = () => {
		setShowFilters(!showFilters);
	};

	const clearFilters = () => {
		// Clear search term
		setSearchTerm("");

		// Reset filters to default - make all gender filters optional (none selected)
		setFilters({
			eventFor: {
				everyone: false,
				male: false,
				female: false,
			},
		});

		// Reset sorting
		setSortBy("none");

		// Reset to all events immediately
		setEvents(allEvents);
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
					{getTranslation(t, "events.upcomingEvents", "Upcoming Events")}
				</h1>
				<p className="mb-6 text-gray-600">
					{getTranslation(t, "events.discoverEvents", "Discover and book amazing events happening in your city")}
				</p>
				
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
						<div className={`absolute inset-y-0 ${isRTL ? "right-0" : "left-0"} flex items-center ${isRTL ? "pr-3" : "pl-3"} pointer-events-none`}>
							<Icon
								icon="lucide:search"
								className="h-5 w-5 text-[#a797cc]"
							/>
						</div>
					<Input
						type="text"
						placeholder={getTranslation(t, "events.searchEvents", "Search events...")}
						className={`${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"} py-2.5 w-full rounded-lg border-2 border-gray-200 bg-gray-50 shadow-sm focus:ring-[#a797cc] focus:border-[#a797cc] text-gray-700 font-medium ${textAlign}`}
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					</div>
					<Button
						onClick={toggleFilter}
						variant="outline"
						className={`flex items-center gap-2 font-semibold border-2 py-2.5 ${
							showFilters
								? "bg-[#a797cc]/10 text-[#a797cc] border-[#a797cc]"
								: "border-gray-300 bg-gray-50 text-gray-800 shadow-sm hover:bg-[#a797cc]/5 hover:border-[#a797cc]/50 hover:text-[#a797cc]"
						}`}
					>
						<Icon
							icon="lucide:filter"
							className={`h-5 w-5 ${
								showFilters ? "text-[#a797cc]" : "text-gray-700"
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

							<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
								{/* Gender Filter */}
								<div className="p-4 space-y-4 bg-white border border-gray-200 rounded-lg shadow-sm">
									<h4 className={`flex items-center pb-2 font-semibold text-gray-800 border-b border-gray-200 ${flexDirection}`}>
										<Icon
											icon="lucide:users"
											className={`${marginEnd(2)} h-4 w-4 text-[#a797cc]`}
										/>
										{getTranslation(t, "events.audience", "Audience")}
									</h4>

									{/* Gender Filter Information Alert */}
									{!isAuthenticated && (
										<div className="p-2 mb-2 border border-yellow-200 rounded-md bg-yellow-50">
											<div className={`flex items-start ${flexDirection}`}>
												<Icon
													icon="lucide:alert-triangle"
													className={`h-4 w-4 text-yellow-600 mt-0.5 ${marginEnd(2)} flex-shrink-0`}
												/>
												<p className={`text-xs text-yellow-700 ${textAlign}`}>
													{getTranslation(t, "events.genderFilterLoginMessage", "Please login to filter events by gender.")}{" "}
													<Link
														href="/login"
														className="text-[#a797cc] underline font-medium"
													>
														{getTranslation(t, "events.loginNow", "Login Now")}
													</Link>
												</p>
											</div>
										</div>
									)}

									{/* Alert for authenticated users with no gender set */}
									{isAuthenticated && user && !userGender && (
										<div className="p-2 mb-2 border border-red-200 rounded-md bg-red-50">
											<div className={`flex items-start ${flexDirection}`}>
												<Icon
													icon="lucide:alert-circle"
													className={`h-4 w-4 text-red-600 mt-0.5 ${marginEnd(2)} flex-shrink-0`}
												/>
												<p className={`text-xs text-red-700 ${textAlign}`}>
													{getTranslation(t, "events.noGenderProfile", "Please update your profile with your gender to filter events.")}{" "}
													<Link
														href="/profile"
														className="text-[#a797cc] underline font-medium"
													>
														{getTranslation(t, "events.updateProfile", "Update Profile")}
													</Link>
												</p>
											</div>
										</div>
									)}

									<div className="p-1 space-y-3">
										{/* Everyone filter - always shown and enabled */}
										<div className={`flex items-center p-2 ${flexDirection} transition-colors rounded-md hover:bg-gray-50`}>
											<Checkbox
												id="filter-everyone"
												checked={
													filters.eventFor.everyone
												}
												onCheckedChange={(checked) => {
													setFilters((prev) => ({
														...prev,
														eventFor: {
															...prev.eventFor,
															everyone: checked,
														},
													}));
												}}
												className="text-[#a797cc] border-2 border-gray-300 h-5 w-5"
											/>
											<Label
												htmlFor="filter-everyone"
												className={`flex items-center font-medium text-gray-700 cursor-pointer ${flexDirection}`}
											>
												<span className={`${marginEnd(1.5)} text-lg`}>
													👥
												</span>{" "}
												{getTranslation(t, "events.allWelcome", "All Welcome")}
											</Label>
										</div>

										{/* Male filter - conditionally enabled */}
										<div
											className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
												// Disable for non-authenticated users or non-male users
												isAuthenticated &&
												userGender === 1
													? "hover:bg-gray-50"
													: "opacity-60 cursor-not-allowed"
											}`}
										>
											<Checkbox
												id="filter-men"
												checked={filters.eventFor.male}
												disabled={
													!(
														isAuthenticated &&
														userGender === 1
													)
												}
												onCheckedChange={(checked) => {
													if (
														isAuthenticated &&
														userGender === 1
													) {
														setFilters((prev) => ({
															...prev,
															eventFor: {
																...prev.eventFor,
																male: checked,
															},
														}));
													}
												}}
												className="text-[#a797cc] border-2 border-gray-300 h-5 w-5 disabled:opacity-50"
											/>
											<Label
												htmlFor="filter-men"
												className={`flex items-center font-medium ${
													isAuthenticated &&
													userGender === 1
														? "cursor-pointer text-gray-700"
														: "cursor-not-allowed text-gray-500"
												}`}
											>
												<span className="mr-1.5 text-lg">
													👨
												</span>{" "}
												{getTranslation(t, "events.menOnly", "Men Only")}
												{!isAuthenticated && (
													<span className="ml-2 text-xs font-normal text-red-500">
														(
														{getTranslation(t, "events.loginRequired", "Login Required")}
														)
													</span>
												)}
												{isAuthenticated &&
													!userGender && (
														<span className="ml-2 text-xs font-normal text-red-500">
															(
															{getTranslation(t, "events.genderRequired", "Gender Required")}
															)
														</span>
													)}
											</Label>
										</div>

										{/* Female filter - conditionally enabled */}
										<div
											className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
												// Disable for non-authenticated users or non-female users
												isAuthenticated &&
												userGender === 2
													? "hover:bg-gray-50"
													: "opacity-60 cursor-not-allowed"
											}`}
										>
											<Checkbox
												id="filter-women"
												checked={
													filters.eventFor.female
												}
												disabled={
													!(
														isAuthenticated &&
														userGender === 2
													)
												}
												onCheckedChange={(checked) => {
													if (
														isAuthenticated &&
														userGender === 2
													) {
														setFilters((prev) => ({
															...prev,
															eventFor: {
																...prev.eventFor,
																female: checked,
															},
														}));
													}
												}}
												className="text-[#a797cc] border-2 border-gray-300 h-5 w-5 disabled:opacity-50"
											/>
											<Label
												htmlFor="filter-women"
												className={`flex items-center font-medium ${
													isAuthenticated &&
													userGender === 2
														? "cursor-pointer text-gray-700"
														: "cursor-not-allowed text-gray-500"
												}`}
											>
												<span className="mr-1.5 text-lg">
													👩
												</span>{" "}
												{getTranslation(t, "events.womenOnly", "Women Only")}
												{!isAuthenticated && (
													<span className="ml-2 text-xs font-normal text-red-500">
														(
														{getTranslation(t, "events.loginRequired", "Login Required")}
														)
													</span>
												)}
												{isAuthenticated &&
													!userGender && (
														<span className="ml-2 text-xs font-normal text-red-500">
															(
															{getTranslation(t, "events.genderRequired", "Gender Required")}
															)
														</span>
													)}
											</Label>
										</div>
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
						Object.values(filters.eventFor).some((v) => v) ||
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
						{getTranslation(t, "events.noEventsFound", "No events found matching your criteria")}
					</h3>
					<p className="max-w-md mb-6 text-gray-500">
						{getTranslation(t, "events.tryAdjustingFilters", "Try adjusting your filters or search terms")}
					</p>
					<Button
						onClick={clearFilters}
						className="bg-[#a797cc] hover:bg-[#e06b0b] text-white font-semibold px-6 py-2.5 shadow-md"
					>
						{getTranslation(t, "events.showAllEvents", "Show All Events")}
					</Button>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{events.map((event, index) => {
							// Get event for label - safe version that always returns proper translation
							let eventForIcon = "👥";
							let eventForLabel = "All Welcome";
							
							if (event.event_for === 1) {
								eventForIcon = "👨";
								eventForLabel = getTranslation(t, "events.menOnly", "Men Only");
							} else if (event.event_for === 2) {
								eventForIcon = "👩";
								eventForLabel = getTranslation(t, "events.womenOnly", "Women Only");
							} else {
								eventForIcon = "👥";
								eventForLabel = getTranslation(t, "events.allWelcome", "All Welcome");
							}
							
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
															const apiBase = "http://localhost:3434";
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

												{/* Badges */}
												<div className="absolute flex flex-wrap gap-2 top-4 left-4">
													<Badge
														className={`bg-white/95 font-medium px-3 py-1 rounded-full text-sm shadow-lg backdrop-blur-sm border border-white/20 ${
															event.event_for ===
															1
																? "text-blue-600"
																: event.event_for ===
																  2
																? "text-pink-600"
																: "text-purple-600"
														}`}
													>
														{eventForIcon}{" "}
														{eventForLabel}
													</Badge>
													
													{/* Booking Status Badge - Show if user has booked this event */}
													{isAuthenticated && event.book_status !== undefined && (
														<Badge
															className={`bg-white/95 font-medium px-3 py-1 rounded-full text-sm shadow-lg backdrop-blur-sm border border-white/20 ${
																event.book_status === 2 && event.payment_status === 1
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
															className={`w-full font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${flexDirection} ${
																event.book_status === 2 && event.payment_status === 1
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

				{events.length === 0 && !loading && (
					<div className="py-12 text-center">
						<Icon
							icon="lucide:search-x"
							className="w-16 h-16 mx-auto mb-4 text-gray-400"
						/>
					<h3 className="mb-2 text-xl font-semibold text-gray-900">
						{getTranslation(t, "events.noEventsFound", "No events found matching your criteria")}
					</h3>
					<p className="text-gray-600">
						{getTranslation(t, "events.tryAdjustingFilters", "Try adjusting your filters or search terms")}
					</p>
					<Button
						variant="outline"
						className="mt-4 border-[#a797cc] text-[#a797cc] hover:bg-[#a797cc]/10"
						onClick={() => {
							// Refresh events
							GetUpcomingEvents().then((response) => {
								setEvents(response.data || []);
							});
						}}
					>
						{getTranslation(t, "events.showAllEvents", "Show All Events")}
					</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default EventsPage;
