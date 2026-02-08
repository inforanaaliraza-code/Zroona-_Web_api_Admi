"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { useRTL } from '@/utils/rtl';
import { formatDate, formatTime } from "@/utils/dateUtils";
import Link from "next/link";
import Image from "next/image";
import BookingModal from "@/components/events/BookingModal";
import BookingDetails from "@/components/events/BookingDetails";
import BookingSection from "@/components/events/BookingSection";
import { GetEventDetails, GetSimilarEvents } from "@/app/api/landing/apis";
import {
	AddBookNowApi,
	CancelBookingApi,
	PayemntApi,
	UpdatePaymentApi,
} from "@/app/api/setting";
import useAuthStore from "@/store/useAuthStore";
import { toast } from "react-toastify";
import CancelConfirmDialog from "@/components/ui/CancelConfirmDialog";
import { Tooltip } from "@/components/ui/tooltip";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import LoginModal from "@/components/Modal/LoginModal";
import { BASE_API_URL } from "@/until";

const getEventForLabel = (eventFor, t) => {
	// Helper to safely get translation
	const safeTranslate = (key, fallback) => {
		if (!t) return fallback;
		try {
			const translation = t(key);
			// Check if translation exists and is not the key itself
			if (translation && translation !== key && typeof translation === 'string') {
				return translation;
			}
			return fallback;
		} catch (error) {
			return fallback;
		}
	};
	
	switch (eventFor) {
		case 1:
			return { label: safeTranslate("events.menOnly", "Men Only"), icon: "👨" };
		case 2:
			return { label: safeTranslate("events.womenOnly", "Women Only"), icon: "👩" };
		case 3:
			return { label: safeTranslate("events.allWelcome", "Everyone Welcome"), icon: "👥" };
		default:
			return { label: safeTranslate("events.allWelcome", "Everyone Welcome"), icon: "👥" };
	}
};

// Helper function to get translation with fallback
const getTranslation = (t, key, fallback) => {
	const translation = t(key);
	return translation && translation !== key ? translation : fallback;
};


export default function EventDetailsPage() {
	const { t, i18n } = useTranslation();
	const params = useParams();
	const isRTL = t("direction") === "rtl";
	const [event, setEvent] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [isReserving, setIsReserving] = useState(false);
	const [reservationStatus, setReservationStatus] = useState(null);
	const [initialStep, setInitialStep] = useState("details");
	const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
	const [similarEvents, setSimilarEvents] = useState([]);
	const [attendees, setAttendees] = useState([]);
	const [loadingSimilarEvents, setLoadingSimilarEvents] = useState(true);
	const currentLocale = i18n.language;
	const [showAttendeesModal, setShowAttendeesModal] = useState(false);
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

	// Get authentication state from the store
	const { token, isAuthenticated } = useAuthStore();

	// Check for payment callback parameters (optimized)
	useEffect(() => {
		const checkForPaymentCallback = async () => {
			// Check URL for payment callback parameters
			const urlParams = new URLSearchParams(window.location.search);
			const bookingId = urlParams.get("booking_id");
			const paymentId = urlParams.get("id");
			const status = urlParams.get("status");

			if (bookingId && paymentId && status === "paid") {
				console.log("Payment callback detected:", {
					bookingId,
					paymentId,
					status,
				});
				try {
					setIsReserving(true);
					
					// Optimize: Run API calls in parallel where possible
					const [paymentResponse, updatedEventData] = await Promise.allSettled([
						// Update payment status in backend
						UpdatePaymentApi({
							booking_id: bookingId,
							payment_id: paymentId,
							amount: event?.booked_event?.total_amount || 0,
						}),
						// Refresh event details in parallel
						GetEventDetails(params.id),
					]);

					const paymentResult = paymentResponse.status === 'fulfilled' ? paymentResponse.value : null;
					const eventResult = updatedEventData.status === 'fulfilled' ? updatedEventData.value : null;

					if (paymentResult?.status) {
						toast.success(getTranslation(t, "events.paymentSuccess", "Payment completed successfully"));
						// Update event if we got the data
						if (eventResult?.data) {
							setEvent(eventResult.data);
						}
					} else {
						console.error(
							"Payment update failed:",
							paymentResult?.message || paymentResponse.reason
						);
						toast.error(
							paymentResult?.message || getTranslation(t, "events.paymentFailed", "Payment failed. Please try again")
						);
					}
				} catch (error) {
					console.error("Error processing payment callback:", error);
					toast.error(getTranslation(t, "events.paymentFailed", "Error processing payment. Please contact support"));
				} finally {
					setIsReserving(false);

					// Clean up URL immediately to prevent repeated processing
					if (window.history && window.history.replaceState) {
						const cleanUrl = window.location.pathname;
						window.history.replaceState(
							{},
							document.title,
							cleanUrl
						);
					}
				}
			}
		};

		if (event) {
			checkForPaymentCallback();
		}
	}, [event, params.id, t]);

	useEffect(() => {
		const fetchEvent = async () => {
			try {
				// No dummy events - only fetch from API
				if (params.id.startsWith('dummy')) {
					// Dummy events are no longer supported
					toast.error(getTranslation(t, "events.eventNotAvailable", "Event not found"));
					setEvent(null);
					setAttendees([]);
					setSimilarEvents([]);
					setLoading(false);
					setLoadingSimilarEvents(false);
					return;
				}

				// Fetch real event from API
				const response = await GetEventDetails(params.id);
				setEvent(response.data);
				setLoading(false);

				// Extract attendees from event data
				if (response.data?.attendees_info && Array.isArray(response.data.attendees_info)) {
					const attendeesData = response.data.attendees_info.map((attendee) => ({
						id: attendee._id || attendee.id,
						name: `${attendee.first_name || ''} ${attendee.last_name || ''}`.trim() || getTranslation(t, "events.unknown", "Unknown"),
						avatar: attendee.profile_image || null,
						first_name: attendee.first_name,
						last_name: attendee.last_name,
					}));
					setAttendees(attendeesData);
				} else {
					setAttendees([]);
				}

				// Fetch similar events
				setLoadingSimilarEvents(true);
				try {
					console.log(
						"Fetching similar events for:",
						params.id,
						"category:",
						response.data.event_category
					);
					const similarEventsData = await GetSimilarEvents(
						params.id,
						response.data.event_category
					);
					console.log("Similar events response:", similarEventsData);
					if (similarEventsData && similarEventsData.status) {
						setSimilarEvents(similarEventsData.data || []);
					} else {
						console.log("No similar events found or API error");
						setSimilarEvents([]);
					}
				} catch (similarError) {
					console.error(
						"Error fetching similar events:",
						similarError
					);
					setSimilarEvents([]);
				} finally {
					setLoadingSimilarEvents(false);
				}
			} catch (error) {
				console.error("Error fetching event:", error);
				setLoading(false);
				setLoadingSimilarEvents(false);
			}
		};

		fetchEvent();
	}, [params.id]);

	// Get event for label with proper translation - must be before conditional return
	const eventFor = useMemo(() => {
		if (!event) return { label: getTranslation(t, "events.allWelcome", "Everyone Welcome"), icon: "👥" };
		return getEventForLabel(event.event_for, t);
	}, [event?.event_for, t, i18n.language]);

	if (loading || !event) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#a797cc]"></div>
			</div>
		);
	}

	// Helper function to check if image URL is external
	const isExternalImage = (url) => {
		if (!url) return false;
		return url.startsWith("http://") || url.startsWith("https://");
	};

	// Helper function to get proper image URL
	const getImageUrl = (imagePath) => {
		if (!imagePath) return "/assets/images/home/event1.png";
		
		// If already absolute URL (http/https), return as is
		if (imagePath.includes("http://") || imagePath.includes("https://")) {
			return imagePath;
		}
		
		// If relative path (starts with /uploads/), construct absolute URL
		if (imagePath.startsWith("/uploads/")) {
			const apiBase = BASE_API_URL.replace('/api/', '');
			return `${apiBase}${imagePath}`;
		}
		
		// If it's a relative path without /uploads/, try to construct URL
		if (imagePath.startsWith("/")) {
			const apiBase = BASE_API_URL.replace('/api/', '');
			return `${apiBase}${imagePath}`;
		}
		
		// Default fallback
		return "/assets/images/home/event1.png";
	};

	// Get all event images (up to 6)
	const images = [];
	if (event.event_images && Array.isArray(event.event_images) && event.event_images.length > 0) {
		// Use event_images array (up to 6 images)
		images.push(...event.event_images.slice(0, 6).map(img => getImageUrl(img)));
	} else if (event.event_image) {
		// Fallback to single event_image
		images.push(getImageUrl(event.event_image));
	}
	
	// Ensure we have at least one image
	if (images.length === 0) {
		images.push("/assets/images/home/event1.png");
	}

	const nextImage = () => {
		setCurrentImageIndex((prev) => (prev + 1) % images.length);
	};

	const previousImage = () => {
		setCurrentImageIndex(
			(prev) => (prev - 1 + images.length) % images.length
		);
	};

	// This function is called when the user clicks the Book Now button
	const handleBookNowClick = () => {
		if (!token || !isAuthenticated) {
			toast.error(getTranslation(t, "events.loginToBookEvent", "Please login to book this event"));
			return;
		}

		// Check if event is already booked
		if (event.booked_event) {
			toast.info(getTranslation(t, "events.alreadyBooked", "You have already booked this event"));
			return;
		}

		// Status mapping: 0=Pending, 1=Pending (old), 2=Approved, 3=Rejected/Cancelled
		// If approved (2) and payment pending (0), go to payment
		if ((event.book_status === 2 || event.book_status === 1) && event.payment_status === 0) {
			setInitialStep("payment");
			setIsBookingModalOpen(true);
			return;
		}

		// If waiting for approval (0 or 1)
		if (event.book_status === 0 || event.book_status === 1) {
			toast.info(getTranslation(t, "events.waitingForApproval", "Your booking is waiting for organizer approval"));
			return;
		}

		// If rejected (3)
		if (event.book_status === 3) {
			toast.error(getTranslation(t, "events.bookingRejected", "Your booking request was rejected"));
			return;
		}

		// Open the booking modal to select number of attendees
		setIsBookingModalOpen(true);
	};

	// This function is called when the user submits the booking modal
	const handleReservation = async (noOfAttendees) => {
		// Prevent double submission
		if (isReserving) {
			console.warn("[BOOKING] Already processing reservation, ignoring duplicate request");
			return;
		}

		// Check if already booked to prevent duplicate
		if (event.booked_event || event.book_status === 0 || event.book_status === 1) {
			toast.info(getTranslation(t, "events.alreadyBooked", "You already have a pending booking for this event"));
			setIsBookingModalOpen(false);
			return;
		}

		try {
			setIsReserving(true);
			const payload = {
				event_id: event._id,
				no_of_attendees: noOfAttendees,
			};

			console.log("[BOOKING] Creating booking request:", payload);
			const response = await AddBookNowApi(payload);

			if (response.status) {
				toast.success(getTranslation(t, "events.reservationRequested", "Booking request sent! Waiting for approval"));
				setReservationStatus("pending");
				event.book_status = 1; // Set to pending (1) initially
				// Close modal after successful booking
				setIsBookingModalOpen(false);
			} else {
				// Handle duplicate booking error from backend
				if (response.message && (response.message.includes("already") || response.message.includes("duplicate") || response.message.includes("pending"))) {
					toast.warning(response.message || getTranslation(t, "events.alreadyBooked", "You already have a pending booking for this event"));
				} else {
					toast.error(response.message || getTranslation(t, "events.reservationFailed", "Failed to book event. Please try again"));
				}
			}
		} catch (error) {
			console.error("Reservation error:", error);
			toast.error(getTranslation(t, "events.reservationFailed", "Failed to book event. Please try again"));
		} finally {
			setIsReserving(false);
		}
	};

	// This function is called when the user wants to proceed to payment
	const handleInitiatePayment = () => {
		if (!token || !isAuthenticated) {
			toast.error(getTranslation(t, "events.loginToBookEvent", "Please login to proceed with payment"));
			return;
		}

		if (!event.booked_event || !event.booked_event._id) {
			toast.error(getTranslation(t, "events.noBookingFound", "No booking found to process payment"));
			return;
		}

		// CRITICAL: Check if booking is approved by host (status = 2)
		// Payment can only be initiated if host has approved the booking
		if (event.booked_event.book_status !== 2) {
			if (event.booked_event.book_status === 1) {
				toast.error(
					getTranslation(t, "events.paymentPendingApproval", 
						"Your booking request is still pending approval from the host. Please wait for the host to accept your request before making payment.")
				);
			} else if (event.booked_event.book_status === 3 || event.booked_event.book_status === 4) {
				toast.error(
					getTranslation(t, "events.paymentBookingRejected", 
						"Your booking request was rejected by the host. You cannot make payment for a rejected booking.")
				);
			} else {
				toast.error(
					getTranslation(t, "events.paymentBookingNotApproved", 
						"Your booking must be approved by the host before you can make payment.")
				);
			}
			return;
		}

		// Check if payment already completed
		if (event.booked_event.payment_status === 1) {
			toast.info(getTranslation(t, "events.paymentAlreadyCompleted", "Payment has already been completed for this booking."));
			return;
		}

		// Open the booking modal with payment step
		setInitialStep("payment");
		setIsBookingModalOpen(true);
	};

	// This function is called when the user wants to cancel their booking
	const handleCancelBookingClick = () => {
		if (!token || !isAuthenticated) {
			toast.error(getTranslation(t, "events.loginToBookEvent", "Please login to cancel booking"));
			return;
		}

		if (!event.booked_event || !event.booked_event._id) {
			toast.error(getTranslation(t, "events.noBookingFound", "No booking found to cancel"));
			return;
		}

		// Open the cancel confirmation dialog
		setIsCancelDialogOpen(true);
	};

	// This function is called when the user confirms cancellation in the dialog
	const handleCancelBooking = async (reason = "") => {
		try {
			setIsReserving(true);
			const response = await CancelBookingApi({
				book_id: event.booked_event._id,
				reason: reason || undefined
			});

		if (response.status) {
			toast.success(getTranslation(t, "events.bookingCancelled", "Booking cancelled successfully"));
			// Refresh the event details to update the booking status
			const updatedEvent = await GetEventDetails(params.id);
			setEvent(updatedEvent.data);
		} else {
			toast.error(response.message || getTranslation(t, "events.operationFailed", "Failed to cancel booking. Please try again"));
		}
	} catch (error) {
		console.error("Cancel booking error:", error);
		toast.error(getTranslation(t, "events.operationFailed", "Failed to cancel booking. Please try again"));
	} finally {
			setIsReserving(false);
			setIsCancelDialogOpen(false);
		}
	};

	const handleBookEvent = async (bookingDetails) => {
		try {
			setIsReserving(true);
			console.log("Booking event with details:", bookingDetails);
			console.log("Using token:", token ? "Token exists" : "No token");

			// If we have a payment ID, this is a payment completion
			if (bookingDetails.paymentId) {
				console.log(
					"Processing payment with ID:",
					bookingDetails.paymentId
				);

				// Validate booking status before processing payment
			if (event.booked_event.book_status !== 2) {
				toast.error(
					getTranslation(t, "events.paymentBookingNotApproved", 
						"Your booking must be approved by the host before you can make payment.")
				);
				setIsReserving(false);
				return;
			}

			// Update payment status
				const response = await UpdatePaymentApi({
					booking_id: event.booked_event._id,
					payment_id: bookingDetails.paymentId,
					amount: bookingDetails.amount,
				});

			if (response.status) {
				toast.success(getTranslation(t, "events.paymentSuccess", "Payment completed successfully! You have been added to the event group chat."));
				// Refresh the event details to show updated payment status
				const updatedEvent = await GetEventDetails(params.id);
				if (updatedEvent && updatedEvent.data) {
					setEvent(updatedEvent.data);
				}
				// Close the modal after successful payment
				setIsBookingModalOpen(false);
				// Optionally redirect to messaging to show group chat
				// setTimeout(() => {
				// 	window.location.href = `/messaging?event_id=${event._id}`;
				// }, 2000);
			} else {
				console.error("Payment failed:", response.message);
				toast.error(response.message || getTranslation(t, "events.paymentFailed", "Payment failed. Please try again"));
			}
		} else {
			// This is a new booking
			console.log(
				"Creating new booking for event:",
				bookingDetails.eventId
			);
			const response = await AddBookNowApi({
				event_id: bookingDetails.eventId,
				no_of_attendees: bookingDetails.attendees,
			});

			if (response.status) {
				toast.success(getTranslation(t, "events.bookingSuccessful", "Booking successful! Waiting for approval"));
				// Refresh the event details to show the new booking
				const updatedEvent = await GetEventDetails(params.id);
				setEvent(updatedEvent.data);
			} else {
				console.error("Reservation failed:", response.message);
				toast.error(
					response.message || getTranslation(t, "events.reservationFailed", "Failed to book event. Please try again")
				);
			}
		}
	} catch (error) {
		console.error("Booking/Payment error:", error);
		toast.error(getTranslation(t, "events.operationFailed", "Operation failed. Please try again"));
	} finally {
			setIsReserving(false);
			setIsBookingModalOpen(false);
		}
	};

	// Helper function to get initials from a name
	function getInitials(name) {
		return name
			.split(" ")
			.map((part) => part.charAt(0))
			.join("")
			.toUpperCase()
			.substring(0, 2);
	}

	// Helper function to generate a consistent color based on name
	function getAvatarColor(name) {
		// List of pleasant colors for avatars
		const colors = [
			"#F44336",
			"#E91E63",
			"#9C27B0",
			"#673AB7",
			"#3F51B5",
			"#2196F3",
			"#03A9F4",
			"#00BCD4",
			"#009688",
			"#4CAF50",
			"#8BC34A",
			"#CDDC39",
			"#FFC107",
			"#FF9800",
			"#FF5722",
		];

		// Generate a simple hash from the name
		let hash = 0;
		for (let i = 0; i < name.length; i++) {
			hash = name.charCodeAt(i) + ((hash << 5) - hash);
		}

		// Use the hash to pick a color
		const index = Math.abs(hash) % colors.length;
		return colors[index];
	}

	// Helper function to fetch attendees from API
	async function fetchEventAttendees(eventId) {
		try {
			// The event details already include attendees from the API
			// Extract attendees from event data if available
			if (event?.attendees_info && Array.isArray(event.attendees_info)) {
				return event.attendees_info.map((attendee) => ({
					id: attendee._id || attendee.id,
					name: `${attendee.first_name || ''} ${attendee.last_name || ''}`.trim() || getTranslation(t, "events.unknown", "Unknown"),
					avatar: attendee.profile_image || null,
					first_name: attendee.first_name,
					last_name: attendee.last_name,
				}));
			}
			return [];
		} catch (error) {
			console.error("Error fetching attendees:", error);
			return [];
		}
	}

	return (
		<div className="min-h-screen bg-white">
			<div className="container px-4 py-8 mx-auto">
				<div className="mx-auto max-w-7xl">
					{/* Header Section - Professional Design */}
					<div className="mb-10 text-center">
						<div className="inline-block mb-4">
							<span className="px-4 py-2 text-sm font-semibold text-[#a797cc] bg-[#a797cc]/10 rounded-full border border-[#a797cc]/20">
								{eventFor.label}
							</span>
						</div>
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
							{event.event_name}
						</h1>
						<div className="flex items-center justify-center gap-2 text-gray-600">
							<Icon icon="lucide:map-pin" className="w-5 h-5 text-gray-600" />
							<span className="text-lg font-medium">{event.event_address || getTranslation(t, "events.locationTBA", "Location TBA")}</span>
						</div>
					</div>

				{/* Login Prompt Banner - Show when not authenticated */}
				{!isAuthenticated && (
					<div className="mb-6 overflow-hidden bg-gradient-to-r from-[#a797cc]/10 to-[#a797cc]/5 border-2 border-[#a797cc]/30 rounded-2xl shadow-md">
						<div className="p-6">
							<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
								<div className="flex items-center gap-4">
									<div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#a797cc]/20">
										<Icon
											icon="lucide:lock"
											className="w-6 h-6 text-[#a797cc]"
										/>
									</div>
									<div>
										<h3 className="text-lg font-bold text-gray-900">
											{getTranslation(t, "events.loginRequired", "Login Required")}
										</h3>
										<p className="text-sm text-gray-600">
											{getTranslation(t, "events.loginToRegister", "Please login or create an account to register for this event")}
										</p>
									</div>
								</div>
								<button
									onClick={() => setIsLoginModalOpen(true)}
									className="px-8 py-3 bg-[#a797cc] text-white font-medium rounded-xl hover:bg-[#8ba179] transition-all shadow-md hover:shadow-lg whitespace-nowrap"
								>
									{getTranslation(t, "events.loginNow", "Login Now")}
								</button>
							</div>
						</div>
					</div>
				)}

					{/* Main Content */}
					<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
						{/* Left Column */}
						<div className="space-y-6 lg:col-span-2">
							{/* Event Information Cards - Professional Design */}
							<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
								<div className="group relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-2xl border border-gray-100 hover:shadow-2xl hover:border-[#a797cc]/30 transition-all duration-300 transform hover:-translate-y-1">
									<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#a797cc] to-[#8ba179] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
									<div className="w-14 h-14 bg-gradient-to-br from-[#a797cc]/10 to-[#8ba179]/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
										<Icon
											icon="lucide:calendar"
											className="w-7 h-7 text-[#a797cc]"
										/>
									</div>
									<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
										{getTranslation(t, "events.date", "Date")}
									</p>
									<p className="font-bold text-gray-900 text-center text-sm md:text-base">
										{formatDate(
											event.event_date,
											"MMM d, yyyy",
											currentLocale
										)}
									</p>
								</div>
								<div className="group relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-2xl border border-gray-100 hover:shadow-2xl hover:border-[#a797cc]/30 transition-all duration-300 transform hover:-translate-y-1">
									<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#a797cc] to-[#8ba179] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
									<div className="w-14 h-14 bg-gradient-to-br from-[#a797cc]/10 to-[#8ba179]/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
										<Icon
											icon="lucide:clock"
											className="w-7 h-7 text-[#a797cc]"
										/>
									</div>
									<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
										{getTranslation(t, "events.time", "Time")}
									</p>
									<p className="font-bold text-gray-900 text-center text-sm md:text-base">
										{formatTime(
											event.event_start_time,
											currentLocale
										)}{" "}
										-{" "}
										{formatTime(
											event.event_end_time,
											currentLocale
										)}
									</p>
								</div>
								<div className="group relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-2xl border border-gray-100 hover:shadow-2xl hover:border-[#a797cc]/30 transition-all duration-300 transform hover:-translate-y-1">
									<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#a797cc] to-[#8ba179] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
									<div className="w-14 h-14 bg-gradient-to-br from-[#a797cc]/10 to-[#8ba179]/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
										<Icon
											icon="lucide:users"
											className="w-7 h-7 text-[#a797cc]"
										/>
									</div>
									<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
										{getTranslation(t, "events.attendees", "Attendees")}
									</p>
									<p className="font-bold text-gray-900 text-center text-sm md:text-base">
										{event.no_of_attendees || 0}{" "}
										<span className="text-xs font-normal text-gray-600">{getTranslation(t, "events.persons", "Persons")}</span>
									</p>
								</div>
								<div className="group relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-2xl border border-gray-100 hover:shadow-2xl hover:border-[#a797cc]/30 transition-all duration-300 transform hover:-translate-y-1">
									<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#a797cc] to-[#8ba179] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
									<div className="w-14 h-14 bg-gradient-to-br from-[#a797cc]/10 to-[#8ba179]/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
										<Icon
											icon="lucide:map-pin"
											className="w-7 h-7 text-[#a797cc]"
										/>
									</div>
									<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
										{getTranslation(t, "events.location", "Location")}
									</p>
									<p className="font-bold text-gray-900 text-center text-xs md:text-sm max-w-full px-2 line-clamp-2">
										{event.event_address || getTranslation(t, "events.locationTBA", "TBA")}
									</p>
								</div>
							</div>

						{/* Description and Instructions - Professional Design */}
						<div className="p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-12 h-12 bg-gradient-to-br from-[#a797cc] to-[#8ba179] rounded-xl flex items-center justify-center shadow-lg">
									<Icon icon="lucide:file-text" className="w-6 h-6 text-white" />
								</div>
								<h2 className="text-3xl font-bold text-gray-900">
									{getTranslation(t, "events.eventDetails", "Event Details")}
								</h2>
							</div>
							<div className="prose prose-lg max-w-none">
								<p className="mb-6 text-base leading-relaxed text-gray-700 whitespace-pre-line">
									{event.event_description || getTranslation(t, "events.noDescriptionAvailable", "No description available.")}
								</p>
							</div>
							{(event.dos_instruction || event.do_not_instruction) && (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-gray-200">
									{event.dos_instruction && (
										<div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
											<div className="flex items-center gap-3 mb-4">
												<div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
													<Icon icon="lucide:check" className="w-6 h-6 text-white" />
												</div>
												<h3 className="text-lg font-bold text-green-800">
													{getTranslation(t, "events.whatToBringDo", "What to Bring/Do")}
												</h3>
											</div>
											<ul className="space-y-2">
												{event.dos_instruction
													.split("\n")
													.filter(instruction => instruction.trim())
													.map((instruction, index) => (
														<li
															key={index}
															className="text-sm text-gray-700 flex items-start gap-2"
														>
															<Icon icon="lucide:check-circle" className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
															<span>{instruction}</span>
														</li>
													))}
											</ul>
										</div>
									)}
									{event.do_not_instruction && (
										<div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border border-red-100">
											<div className="flex items-center gap-3 mb-4">
												<div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
													<Icon icon="lucide:x" className="w-6 h-6 text-white" />
												</div>
												<h3 className="text-lg font-bold text-red-800">
													{getTranslation(t, "events.whatNotToBringDo", "What Not to Bring/Do")}
												</h3>
											</div>
											<ul className="space-y-2">
												{event.do_not_instruction
													.split("\n")
													.filter(instruction => instruction.trim())
													.map((instruction, index) => (
														<li
															key={index}
															className="text-sm text-gray-700 flex items-start gap-2"
														>
															<Icon icon="lucide:x-circle" className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
															<span>{instruction}</span>
														</li>
													))}
											</ul>
										</div>
									)}
								</div>
							)}
						</div>

							{/* Image Gallery - Professional Design */}
							{images.length > 0 && (
								<div className="overflow-hidden bg-white shadow-xl rounded-2xl border border-gray-100">
									<div className="relative aspect-video group">
										<Image
											src={images[currentImageIndex]}
											alt={event.event_name}
											fill
											className="object-cover transition-transform duration-500 group-hover:scale-105"
											priority
											unoptimized={isExternalImage(images[currentImageIndex])}
											onError={(e) => {
												e.target.src = "/assets/images/home/event1.png";
											}}
										/>
										{/* Gradient overlay on hover */}
										<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
										{images.length > 1 && (
											<>
												<button
													onClick={previousImage}
													className="absolute flex items-center justify-center w-12 h-12 text-white transition-all -translate-y-1/2 rounded-full left-4 top-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm z-10 shadow-lg hover:scale-110"
													aria-label={getTranslation(t, "events.previousImage", "Previous Image")}
												>
													<Icon
														icon="lucide:chevron-left"
														className="w-6 h-6"
													/>
												</button>
												<button
													onClick={nextImage}
													className="absolute flex items-center justify-center w-12 h-12 text-white transition-all -translate-y-1/2 rounded-full right-4 top-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm z-10 shadow-lg hover:scale-110"
													aria-label={getTranslation(t, "events.nextImage", "Next Image")}
												>
													<Icon
														icon="lucide:chevron-right"
														className="w-6 h-6"
													/>
												</button>
												<div className="absolute flex gap-2 -translate-x-1/2 bottom-4 left-1/2 z-10">
													{images.map((_, index) => (
														<button
															key={index}
															onClick={() =>
																setCurrentImageIndex(
																	index
																)
															}
															className={`w-2.5 h-2.5 rounded-full transition-all ${
																index ===
																currentImageIndex
																	? "bg-white w-8"
																	: "bg-white/50 hover:bg-white/75"
															}`}
															aria-label={`Image ${
																index + 1
															}`}
														/>
													))}
												</div>
												{/* Image counter */}
												{(() => {
													const { isRTL } = useRTL();
													const pos = isRTL ? 'left-4' : 'right-4';
													return (
														<div className={`absolute top-4 ${pos} bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold z-10 shadow-lg`}>
															{currentImageIndex + 1} / {images.length}
														</div>
													);
												})()}
											</>
										)}
									</div>
									{/* Thumbnail gallery below main image */}
									{images.length > 1 && (
										<div className="p-4 bg-gradient-to-br from-gray-50 to-white border-t border-gray-100">
											<div className="flex items-center justify-between mb-3">
												<p className="text-sm font-semibold text-gray-700">{getTranslation(t, "events.eventImages", "Event Images")} ({images.length})</p>
												<p className="text-xs text-gray-500">{getTranslation(t, "events.clickToView", "Click to view")}</p>
											</div>
											<div className="grid grid-cols-6 gap-2">
												{images.map((img, index) => (
													<button
														key={index}
														onClick={() => setCurrentImageIndex(index)}
														className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
															index === currentImageIndex
																? "border-[#a797cc] ring-2 ring-[#a797cc]/20 scale-105"
																: "border-gray-200 hover:border-gray-300 hover:scale-105"
														}`}
													>
														<Image
															src={img}
															alt={`Event image ${index + 1}`}
															fill
															className="object-cover"
															unoptimized={isExternalImage(img)}
															onError={(e) => {
																e.target.src = "/assets/images/home/event1.png";
															}}
														/>
													</button>
												))}
											</div>
										</div>
									)}
								</div>
							)}
						</div>

					{/* Right Column - Sidebar */}
					<div className="space-y-6 lg:col-span-1">
						{/* Booking Section or Booking Details Section */}
						{!isAuthenticated ? (
							// Show Login Prompt when not authenticated
							<div className="p-6 bg-white rounded-xl shadow-lg">
								<div className="text-center">
									<div className="flex justify-center mb-4">
										<div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#a797cc]/10">
											<Icon
												icon="lucide:lock"
												className="w-8 h-8 text-[#a797cc]"
											/>
										</div>
									</div>
									<h3 className="mb-2 text-xl font-bold text-gray-900">
										{getTranslation(t, "events.loginRequired", "Login Required")}
									</h3>
									<p className="mb-6 text-sm text-gray-600">
										{getTranslation(t, "events.loginToBookEvent", "Please login to book this event and join other attendees")}
									</p>
									<button
										onClick={() => setIsLoginModalOpen(true)}
										className="w-full bg-[#a797cc] text-white font-medium py-3 px-6 rounded-xl hover:bg-[#8ba179] transition-all shadow-md hover:shadow-lg"
									>
										{getTranslation(t, "events.loginNow", "Login Now")}
									</button>
									<div className="mt-4 text-sm text-gray-500">
										<span>{getTranslation(t, "events.dontHaveAccount", "Don't have an account?")} </span>
										<Link
											href="/signup"
											className="text-[#a797cc] font-medium hover:underline"
										>
											{getTranslation(t, "events.signUp", "Sign Up")}
										</Link>
									</div>
								</div>
							</div>
						) : event.booked_event ? (
							<BookingDetails
								booking={event.booked_event}
								eventPrice={event.event_price}
								onInitiatePayment={handleInitiatePayment}
								onCancelBooking={handleCancelBookingClick}
							/>
						) : (
							<BookingSection
								eventPrice={event.event_price}
								isReserving={isReserving}
								bookStatus={event.book_status}
								paymentStatus={event.payment_status}
								onBookNowClick={handleBookNowClick}
							/>
						)}

						{/* Organizer Section - Professional Design */}
						{event.organizer && (
							<div className="p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
								<div className="flex items-center gap-3 mb-6">
									<div className="w-12 h-12 bg-gradient-to-br from-[#a797cc] to-[#8ba179] rounded-xl flex items-center justify-center shadow-lg">
										<Icon icon="lucide:user" className="w-6 h-6 text-white" />
									</div>
									<h2 className="text-2xl font-bold text-gray-900">
										{getTranslation(t, "events.organizer", "Organizer")}
									</h2>
								</div>
								<div className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
									<div className="relative w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-[#a797cc] to-[#8ba179] ring-4 ring-[#a797cc]/20 shadow-lg">
										<Image
											src={(() => {
												const getImageUrl = (imgPath) => {
													if (!imgPath) return "/assets/images/home/user-dummy.png";
													if (imgPath.includes("http://") || imgPath.includes("https://")) return imgPath;
													if (imgPath.startsWith("/uploads/")) {
														const apiBase = BASE_API_URL.replace('/api/', '');
														return `${apiBase}${imgPath}`;
													}
													return "/assets/images/home/user-dummy.png";
												};
												return getImageUrl(event.organizer?.profile_image);
											})()}
											alt={event.organizer?.first_name || getTranslation(t, "events.organizer", "Organizer")}
											width={80}
											height={80}
											className="object-cover w-full h-full"
											onError={(e) => {
												e.target.src = "/assets/images/home/user-dummy.png";
											}}
										/>
									</div>
									<div className="flex-1">
										<h3 className="text-lg font-bold text-gray-900 mb-1">
											{event.organizer?.first_name || getTranslation(t, "events.organizer", "Organizer")}{" "}
											{event.organizer?.last_name || ""}
										</h3>
										<div className="flex items-center gap-2 mb-3">
											<div className="flex items-center gap-1 bg-[#a797cc]/10 px-2 py-1 rounded-lg">
												<Icon
													icon="lucide:star"
													className="w-4 h-4 text-[#a797cc] fill-[#a797cc]"
												/>
												<span className="text-sm font-bold text-gray-900">
													{
														event.organizer?.rating
															?.overall?.rating || "N/A"
													}
												</span>
											</div>
											<span className="text-sm text-gray-600">
												(
												{
													event.organizer?.rating
														?.overall?.totalReviews || 0
												}{" "}
												{getTranslation(t, "header.reviews", "Reviews")})
											</span>
										</div>
										{/* Only show View Host Profile link if organizer ID exists and is valid */}
										{(() => {
											const organizerId = event.organizer?._id || event.organizer?.id;
											// Convert to string and validate
											const organizerIdStr = organizerId ? 
												(typeof organizerId === 'string' ? organizerId : organizerId.toString()) : 
												null;
											const isValidId = organizerIdStr && organizerIdStr.length === 24;
											
											console.log("[EVENT-DETAILS] Organizer ID check:", {
												organizerId,
												organizerIdStr,
												isValidId,
												organizer: event.organizer
											});
											
											if (isValidId) {
												return (
													<Link
														href={`/host/${organizerIdStr}`}
														className="inline-flex items-center gap-2 text-[#a797cc] hover:text-[#8ba179] font-semibold text-sm transition-colors"
													>
														{getTranslation(t, "events.viewHostProfile", "View Host Profile")}
														<Icon icon="lucide:arrow-right" className="w-4 h-4" />
													</Link>
												);
											} else {
												console.warn("[EVENT-DETAILS] Organizer ID is invalid or missing:", {
													organizerId,
													organizerIdStr,
													organizer: event.organizer
												});
												return null; // Don't show link if ID is invalid
											}
										})()}
									</div>
								</div>
							</div>
						)}

						{/* Attendees Section - New Card */}
						<div className="p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-12 h-12 bg-gradient-to-br from-[#a797cc] to-[#8ba179] rounded-xl flex items-center justify-center shadow-lg">
									<Icon icon="lucide:users" className="w-6 h-6 text-white" />
								</div>
								<h2 className="text-2xl font-bold text-gray-900">
									{getTranslation(t, "events.attendees", "Attendees")}
								</h2>
							</div>
							
							{attendees.length > 0 ? (
								<div className="space-y-4">
									<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
										{attendees.map((attendee, index) => (
											<div
												key={attendee.id || index}
												className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all"
											>
												<div className="relative w-16 h-16 rounded-full overflow-hidden mb-3 ring-2 ring-[#a797cc]/20">
													{attendee.avatar ? (
														<Image
															src={(() => {
																const getImageUrl = (imgPath) => {
																	if (!imgPath) return "/assets/images/home/user-dummy.png";
																	if (imgPath.includes("http://") || imgPath.includes("https://")) return imgPath;
																	if (imgPath.startsWith("/uploads/")) {
																		const apiBase = BASE_API_URL.replace('/api/', '');
																		return `${apiBase}${imgPath}`;
																	}
																	return "/assets/images/home/user-dummy.png";
																};
																return getImageUrl(attendee.avatar);
															})()}
															alt={attendee.name}
															width={64}
															height={64}
															className="object-cover w-full h-full"
															onError={(e) => {
																e.target.src = "/assets/images/home/user-dummy.png";
															}}
														/>
													) : (
														<div
															className="flex items-center justify-center w-full h-full font-semibold text-white text-lg"
															style={{
																backgroundColor: getAvatarColor(attendee.name),
															}}
														>
															{getInitials(attendee.name)}
														</div>
													)}
												</div>
												<p className="text-sm font-semibold text-gray-900 text-center">
													{attendee.name}
												</p>
											</div>
										))}
									</div>
									{attendees.length > 8 && (
										<div className="text-center pt-4">
											<button
												onClick={() => setShowAttendeesModal(true)}
												className="text-[#a797cc] hover:text-[#8ba179] font-semibold text-sm underline"
											>
												{getTranslation(t, "events.viewAllAttendees", "View All Attendees")} ({attendees.length})
											</button>
										</div>
									)}
								</div>
							) : (
								<div className="text-center py-8">
									<Icon
										icon="lucide:users"
										className="w-16 h-16 mx-auto mb-4 text-gray-300"
									/>
									<p className="text-gray-500 text-lg">
										{getTranslation(t, "events.noAttendeesYet", "No attendees yet")}
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Booking Modal */}
			<BookingModal
				isOpen={isBookingModalOpen}
				onClose={() => setIsBookingModalOpen(false)}
				event={event}
				onBookEvent={handleBookEvent}
				initialStep={initialStep}
				totalAmount={event.booked_event?.total_amount || 0}
			/>

			{/* Cancel Confirmation Dialog */}
			<CancelConfirmDialog
				isOpen={isCancelDialogOpen}
				onClose={() => setIsCancelDialogOpen(false)}
				onConfirm={handleCancelBooking}
				isLoading={isReserving}
				type="booking"
				showRefundWarning={true}
			/>

			{/* Similar Events Section */}
			<div className="container px-4 mx-auto mt-12 mb-16">
			<div className="flex items-center justify-between mb-8">
				<h3 className="text-2xl font-semibold">
					{getTranslation(t, "events.similarEvents", "Similar Events")}
				</h3>
				<Link
					href="/events"
					className="text-[#a797cc] hover:underline flex items-center"
				>
					{getTranslation(t, "events.viewAllEvents", "View All Events")}
					<Icon
						icon="lucide:arrow-right"
						className="w-4 h-4 ml-1"
					/>
				</Link>
			</div>

				{loadingSimilarEvents ? (
					<div className="flex items-center justify-center p-12">
						<div className="w-12 h-12 border-t-2 border-b-2 border-[#a797cc] rounded-full animate-spin"></div>
					</div>
				) : similarEvents.length > 0 ? (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{similarEvents.map((similarEvent) => (
							<Link
								href={`/events/${
									similarEvent.id || similarEvent._id
								}`}
								key={similarEvent.id || similarEvent._id}
								className="block group"
							>
								<div className="h-full overflow-hidden transition-all duration-300 bg-white border rounded-lg shadow-sm group-hover:shadow-md">
									<div className="relative w-full h-48 overflow-hidden bg-gray-100">
										<img
											src={getImageUrl(
												similarEvent.image ||
												similarEvent.event_image ||
												similarEvent.event_images?.[0]
											)}
											alt={
												similarEvent.title ||
												similarEvent.event_name ||
												getTranslation(t, "events.eventImage", "Event image")
											}
											className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
											onError={(e) => {
												e.target.src = "/assets/images/home/event1.png";
											}}
										/>
									</div>
									<div className="p-4">
										<h4 className="mb-2 text-lg font-medium group-hover:text-[#a797cc] transition-colors">
											{similarEvent.title ||
												similarEvent.event_name}
										</h4>
										<div className="flex items-center mb-2 text-sm text-gray-600">
											<Icon
												icon="lucide:calendar"
												className="w-4 h-4 mr-1"
											/>
											<p>
												{new Date(
													similarEvent.date ||
														similarEvent.event_date
												).toLocaleDateString()}
											</p>
										</div>
										<div className="flex items-center text-sm text-gray-500">
											<Icon
												icon="lucide:map-pin"
												className="w-4 h-4 mr-1"
											/>
											<span>
												{similarEvent.location ||
													similarEvent.venue_address ||
													similarEvent.event_address}
											</span>
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
				) : (
					<div className="p-8 text-center bg-white rounded-lg shadow-sm">
						<Icon
							icon="lucide:calendar-x"
							className="w-12 h-12 mx-auto mb-4 text-gray-400"
						/>
						<p className="mb-2 text-gray-500">
							{getTranslation(t, "events.noSimilarEvents", "No similar events found")}
						</p>
						<Link
							href="/events"
							className="text-[#a797cc] hover:underline"
						>
							{getTranslation(t, "events.browseAllEvents", "Browse All Events")}
						</Link>
					</div>
				)}
			</div>

			{/* Attendees Modal */}
			<Dialog
				open={showAttendeesModal}
				onOpenChange={setShowAttendeesModal}
			>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{getTranslation(t, "events.eventAttendees", "Event Attendees")}</DialogTitle>
				</DialogHeader>
				<div className="max-h-[60vh] overflow-y-auto">
						<ul className="divide-y divide-gray-200">
							{attendees.map((attendee, index) => (
								<li
									key={index}
									className="py-3 flex items-center"
								>
									<div className="h-10 w-10 rounded-full overflow-hidden mr-3">
										<div
											className="flex items-center justify-center w-full h-full font-medium text-white"
											style={{
												backgroundColor: getAvatarColor(
													attendee.name
												),
											}}
										>
											{getInitials(attendee.name)}
										</div>
									</div>
									<div>
										<p className="font-medium">
											{attendee.name}
										</p>
									</div>
								</li>
							))}
						</ul>
					</div>
				</DialogContent>
			</Dialog>

			{/* Login Modal - with return URL to redirect back after login */}
			<LoginModal
				isOpen={isLoginModalOpen}
				onClose={() => setIsLoginModalOpen(false)}
				returnUrl={`/events/${params.id}`}
			/>
			</div>
		</div>
	);
}
