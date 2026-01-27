"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Label from "@radix-ui/react-label";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { AddBookNowApi } from "@/app/api/setting";
import { getPaymentMethods, isAppleDevice, shouldShowApplePay } from "@/utils/deviceDetection";

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

export default function BookingModal({
	isOpen,
	onClose,
	event,
	onBookEvent,
	initialStep = "details",
}) {
	const { t, i18n } = useTranslation();
	const [attendees, setAttendees] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [step, setStep] = useState("details");
	const moyasarFormRef = useRef(null);

	const ticketPrice = event?.event_price || 0;
	// Use booked_event total_amount if available (includes tax), otherwise calculate
	const totalAmount =
		event?.booked_event?.total_amount || 
		(ticketPrice * attendees);

	useEffect(() => {
		// Reset state when modal is opened
		if (isOpen) {
			// Use initialStep if provided, otherwise determine based on booking status
			if (initialStep && initialStep !== "details") {
				setStep(initialStep);
			} else if (
				event?.book_status === 2 &&
				event?.payment_status === 0
			) {
				// If the event is already booked and approved with payment pending, go to payment step
				setStep("payment");
			} else if (event?.book_status === 1) {
				// If waiting for approval, show reservation step
				setStep("reservation");
			} else {
				setStep("details");
			}
			setAttendees(1);
			setIsLoading(false);
		}
	}, [isOpen, event?.book_status, event?.payment_status, initialStep]);

	// Handle payment completion (optimized)
	const handlePaymentCompleted = useCallback(
		async (payment) => {
			console.log("Payment completed:", payment);
			if (payment && payment.status === "paid") {
				try {
					// Call the onBookEvent callback with the payment information
					const result = await onBookEvent?.({
						eventId: event?._id,
						attendees,
						paymentId: payment.id,
						amount: totalAmount,
					});
					
					// If callback returns a promise, wait for it
					if (result && typeof result.then === 'function') {
						await result;
					}
					
					setStep("confirmation");
					toast.success(getTranslation(t, "events.paymentSuccess", "Payment completed successfully!"));
				} catch (error) {
					console.error("Error in payment completion:", error);
					toast.error(getTranslation(t, "events.paymentProcessingError", "Error processing payment. Please contact support."));
				}
			} else {
				toast.error(getTranslation(t, "events.paymentFailed", "Payment was not successful. Please try again."));
			}
		},
		[event?._id, attendees, totalAmount, onBookEvent, t]
	);

	// Function to initialize Moyasar payment form
	const initializeMoyasarForm = useCallback(() => {
		if (!moyasarFormRef.current) return;

		// Check if element is still in DOM
		if (!moyasarFormRef.current.parentNode) {
			console.warn("Moyasar form element not in DOM");
			return;
		}

		try {
			const moyasar = window.Moyasar;
			if (!moyasar) {
				console.error("[PAYMENT-FORM] Moyasar not loaded");
				toast.error(getTranslation(t, "events.paymentInitError", "Payment gateway not loaded. Please refresh and try again."));
				return;
			}

			// Get current language (don't modify document - let RTLHandler handle it)
			const currentLang = i18n.language || "ar";

			// Validate API key
			const apiKey = process.env.NEXT_PUBLIC_MOYASAR_KEY;
			if (!apiKey) {
				console.error("[PAYMENT-FORM] Moyasar API key not configured");
				toast.error(getTranslation(t, "events.paymentInitError", "Payment gateway configuration error. Please contact support."));
				return;
			}

			// Validate form element
			if (!moyasarFormRef.current || !moyasarFormRef.current.parentNode) {
				console.error("[PAYMENT-FORM] Form element not ready");
				return;
			}

			// Safely clear previous form only if element is still in DOM
			try {
				if (moyasarFormRef.current && moyasarFormRef.current.parentNode && moyasarFormRef.current.isConnected) {
					// Use textContent instead of innerHTML for safer clearing
					// This avoids issues with event listeners and nested elements
					const formElement = moyasarFormRef.current;
					
					// First, try to remove children safely
					try {
						while (formElement.firstChild) {
							const child = formElement.firstChild;
							// Double check the child is still a child of this element
							if (child.parentNode === formElement && formElement.contains(child)) {
								formElement.removeChild(child);
							} else {
								// If not, break to avoid infinite loop
								break;
							}
						}
					} catch (removeError) {
						// If removeChild fails, use textContent as fallback
						console.warn("[PAYMENT-FORM] removeChild failed, using textContent:", removeError);
						formElement.textContent = "";
					}
					
					console.log("[PAYMENT-FORM] Cleared previous form content");
				}
			} catch (error) {
				console.warn("[PAYMENT-FORM] Error clearing form:", error);
				// Final fallback: try textContent
				try {
					if (moyasarFormRef.current && moyasarFormRef.current.isConnected) {
						moyasarFormRef.current.textContent = "";
					}
				} catch (fallbackError) {
					console.warn("[PAYMENT-FORM] All cleanup methods failed:", fallbackError);
				}
				// Don't return here, continue with initialization
			}

			// Validate amount
			if (!totalAmount || totalAmount <= 0) {
				console.error("[PAYMENT-FORM] Invalid amount:", totalAmount);
				toast.error(getTranslation(t, "events.invalidAmount", "Invalid payment amount. Please contact support."));
				return;
			}

			const amountInHalala = Math.round(totalAmount * 100); // Convert to halala (smallest currency unit)
			const callbackUrl = `${window.location.origin}/events/${event?._id}?booking_id=${event?.booked_event?._id}&status=paid`;

			console.log("[PAYMENT-FORM] Initializing Moyasar with:", {
				amount: amountInHalala,
				currency: "SAR",
				callbackUrl,
				apiKey: apiKey.substring(0, 10) + "...", // Log partial key for debugging
				language: currentLang
			});

			// Detect device and get appropriate payment methods
			const paymentMethods = getPaymentMethods();
			const isApple = isAppleDevice();
			
			console.log("[PAYMENT-FORM] Device detection:", {
				isApple,
				paymentMethods,
				userAgent: window.navigator.userAgent,
				platform: window.navigator.platform
			});

			// Build Moyasar config based on device
			const moyasarConfig = {
				element: moyasarFormRef.current,
				amount: amountInHalala,
				currency: "SAR",
				callback_url: callbackUrl,
				description: `${getTranslation(t, "events.bookEvent", "Booking for")} ${event?.event_name || getTranslation(t, "events.eventDetails", "Event")}`,
				publishable_api_key: apiKey,
				methods: paymentMethods, // Dynamic based on device
				language: currentLang,
				// Optimize 3DS authentication
				three_d_secure: {
					enabled: true,
					timeout: 30000, // 30 seconds
				},
			};

			// Only add Apple Pay config if device is Apple
			if (isApple) {
				moyasarConfig.apple_pay = {
					country: "SA",
					label: getTranslation(t, "events.appName", "Zuroona"),
					validate_merchant_url: "https://api.moyasar.com/v1/applepay/initiate",
					merchant_capabilities: [
						"supports3DS",
						"supportsCredit",
						"supportsDebit",
					],
				};
				console.log("[PAYMENT-FORM] Apple Pay enabled for Apple device");
			} else {
				console.log("[PAYMENT-FORM] Apple Pay disabled - non-Apple device detected");
			}

			moyasar.init({
				...moyasarConfig,
				on_failed: (error) => {
					console.error("[PAYMENT-FORM] Payment failed:", error);
					toast.error(getTranslation(t, "events.paymentFailed", "Payment failed. Please try again."));
					setIsLoading(false);
				},
				on_completed: async function (payment) {
					console.log("[PAYMENT-FORM] Payment completed:", payment);
					setIsLoading(true);
					try {
						await handlePaymentCompleted(payment);
					} catch (error) {
						console.error("[PAYMENT-FORM] Error handling payment completion:", error);
						toast.error(getTranslation(t, "events.paymentProcessingError", "Error processing payment. Please contact support."));
					} finally {
						setIsLoading(false);
					}
				},
			});

			console.log("[PAYMENT-FORM] Moyasar form initialized successfully");
		} catch (error) {
			console.error("[PAYMENT-FORM] Payment initialization error:", error);
			toast.error(getTranslation(t, "events.paymentInitError", "Error initializing payment. Please refresh and try again."));
			setStep("details");
		}
	}, [totalAmount, event?.event_name, t, event?.booked_event?._id, i18n.language, handlePaymentCompleted]);

	// Initialize Moyasar when step changes to payment (optimized)
	useEffect(() => {
		if (!isOpen || step !== "payment") {
			return;
		}

		console.log('[PAYMENT-MODAL] Payment step activated, initializing Moyasar...');
		console.log('[PAYMENT-MODAL] Moyasar available:', !!window.Moyasar);
		console.log('[PAYMENT-MODAL] MoyasarReady:', !!window.MoyasarReady);
		console.log('[PAYMENT-MODAL] Form ref:', !!moyasarFormRef.current);
		console.log('[PAYMENT-MODAL] Total amount:', totalAmount);
		console.log('[PAYMENT-MODAL] API Key:', process.env.NEXT_PUBLIC_MOYASAR_KEY ? 'Present' : 'Missing');

		// Function to load Moyasar script if not already loaded
		const loadMoyasarScript = () => {
			return new Promise((resolve, reject) => {
				// Check if already loaded
				if (window.Moyasar) {
					console.log('[PAYMENT-MODAL] Moyasar already loaded');
					resolve();
					return;
				}

				// Check if script is already in DOM
				const existingScript = document.querySelector('script[src*="moyasar"]');
				if (existingScript) {
					console.log('[PAYMENT-MODAL] Moyasar script tag found, waiting for load...');
					// Wait for it to load
					existingScript.onload = () => {
						if (window.Moyasar) {
							console.log('[PAYMENT-MODAL] Moyasar loaded from existing script');
							resolve();
						} else {
							reject(new Error('Moyasar script loaded but window.Moyasar not available'));
						}
					};
					existingScript.onerror = () => reject(new Error('Failed to load Moyasar script'));
					return;
				}

				// Load script dynamically
				console.log('[PAYMENT-MODAL] Loading Moyasar script dynamically...');
				const script = document.createElement('script');
				script.src = 'https://cdn.moyasar.com/mpf/1.15.0/moyasar.js';
				script.async = true;
				script.onload = () => {
					if (window.Moyasar) {
						console.log('[PAYMENT-MODAL] Moyasar script loaded successfully');
						window.MoyasarReady = true;
						resolve();
					} else {
						reject(new Error('Moyasar script loaded but window.Moyasar not available'));
					}
				};
				script.onerror = () => reject(new Error('Failed to load Moyasar script'));
				document.body.appendChild(script);
			});
		};

		// Check if Moyasar is ready, if not wait for it
		const initForm = async () => {
			if (!moyasarFormRef.current || !moyasarFormRef.current.parentNode) {
				console.warn('[PAYMENT-MODAL] Form ref not ready');
				return;
			}

			try {
				// Ensure Moyasar is loaded
				if (!window.Moyasar) {
					console.log('[PAYMENT-MODAL] Moyasar not found, loading...');
					await loadMoyasarScript();
				}

				// Wait a bit for DOM to be ready
				await new Promise(resolve => setTimeout(resolve, 100));

				// Now initialize the form
				if (window.Moyasar && moyasarFormRef.current && moyasarFormRef.current.parentNode) {
					console.log('[PAYMENT-MODAL] Initializing Moyasar form...');
					initializeMoyasarForm();
				} else {
					console.error('[PAYMENT-MODAL] Cannot initialize: Moyasar or form ref not ready');
					toast.error(getTranslation(t, "events.paymentInitError", "Error initializing payment form. Please refresh and try again."));
				}
			} catch (error) {
				console.error('[PAYMENT-MODAL] Error loading Moyasar:', error);
				toast.error(getTranslation(t, "events.paymentInitError", "Failed to load payment gateway. Please refresh the page and try again."));
			}
		};

		// Use setTimeout to ensure DOM is ready
		const timeoutId = setTimeout(() => {
			initForm();
		}, 200);

		return () => {
			clearTimeout(timeoutId);
			// Cleanup: Clear Moyasar form if element still exists
			if (moyasarFormRef.current) {
				try {
					const formElement = moyasarFormRef.current;
					
					// Check if element is still connected to DOM
					if (formElement.isConnected && formElement.parentNode) {
						// Safely remove all child nodes
						try {
							while (formElement.firstChild) {
								const child = formElement.firstChild;
								// Verify the child is still a child of this element
								if (child.parentNode === formElement && formElement.contains(child)) {
									formElement.removeChild(child);
								} else {
									// Child is no longer a child, break to avoid infinite loop
									break;
								}
							}
							console.log('[PAYMENT-MODAL] Cleaned up Moyasar form');
						} catch (removeError) {
							// If removeChild fails, use textContent as safer alternative
							console.warn("removeChild failed, using textContent:", removeError);
							try {
								formElement.textContent = "";
							} catch (textError) {
								console.warn("textContent also failed:", textError);
							}
						}
					} else {
						// Element is no longer in DOM, just log
						console.log('[PAYMENT-MODAL] Form element no longer in DOM, skipping cleanup');
					}
				} catch (error) {
					console.warn("Error cleaning up Moyasar form:", error);
					// Final fallback: try textContent
					try {
						if (moyasarFormRef.current && moyasarFormRef.current.isConnected) {
							moyasarFormRef.current.textContent = "";
						}
					} catch (fallbackError) {
						console.warn("All cleanup methods failed:", fallbackError);
					}
				}
			}
		};
	}, [step, isOpen, initializeMoyasarForm, t, totalAmount]);

	// Check for payment result when modal is opened
	useEffect(() => {
		if (isOpen) {
			const paymentResult = localStorage.getItem("paymentResult");
			if (paymentResult) {
				try {
					const { status, id } = JSON.parse(paymentResult);
					if (status === "paid") {
						onBookEvent?.({
							eventId: event?._id,
							attendees,
							paymentId: id,
							amount: totalAmount,
						});
						setStep("confirmation");
					}
					// Clear the payment result
					localStorage.removeItem("paymentResult");
				} catch (error) {
					console.error("Error processing payment result:", error);
				}
			}
		}
	}, [isOpen, event?._id, attendees, totalAmount, onBookEvent]);

	const handleAttendeeChange = (e) => {
		const value = parseInt(e.target.value);
		if (value >= 1 && value <= event.no_of_attendees) {
			setAttendees(value);
		}
	};

	const incrementAttendees = () => {
		if (attendees < event.no_of_attendees) {
			setAttendees((prev) => prev + 1);
		}
	};

	const decrementAttendees = () => {
		if (attendees > 1) {
			setAttendees((prev) => prev - 1);
		}
	};

	const handleReservation = async () => {
		if (!event || !event._id) {
			toast.error(getTranslation(t, "events.eventNotAvailable", "Event not available"));
			return;
		}

		// Check if it's a dummy event
		if (typeof event._id === 'string' && event._id.startsWith('dummy')) {
			toast.error(getTranslation(t, "events.dummyEventNotBookable", "This is a demo event and cannot be booked. Please select a real event."));
			return;
		}

		// Check if event is sold out
		if (event.available_seats !== undefined && event.available_seats === 0) {
			toast.error(getTranslation(t, "events.eventSoldOut", "Sorry, this event is sold out. No seats available."), {
				duration: 5000,
			});
			return;
		}

		// Validate attendees count
		if (attendees < 1) {
			toast.error(getTranslation(t, "events.invalidAttendees", "Number of attendees must be at least 1"));
			return;
		}
		
		// Check against available seats with detailed error message
		if (event.available_seats !== undefined) {
			if (attendees > event.available_seats) {
				toast.error(
					getTranslation(
						t, 
						"events.exceedsAvailableSeats", 
						`Cannot book ${attendees} seat(s). Only ${event.available_seats} seat(s) available.`
					),
					{
						duration: 5000,
					}
				);
				return;
			}
		} else if (event.no_of_attendees && attendees > event.no_of_attendees) {
			// Fallback to checking total seats if available_seats not provided
			toast.error(getTranslation(t, "events.exceedsTotalSeats", `Cannot book more than ${event.no_of_attendees} seats`));
			return;
		}

		setIsLoading(true);
		try {
			// Call the onBookEvent callback with the selected number of attendees
			const bookingResult = await onBookEvent?.({
				attendees: attendees,
				eventId: event._id,
			});

			// If onBookEvent returns a promise or result, wait for it
			if (bookingResult && typeof bookingResult.then === 'function') {
				const result = await bookingResult;
				if (result && result.status) {
					setStep("reservation");
				} else {
					throw new Error(result?.message || "Booking failed");
				}
			} else if (bookingResult && bookingResult.status) {
				setStep("reservation");
			} else {
				// If no callback or callback doesn't handle it, make API call directly
				const response = await AddBookNowApi({
					event_id: event._id,
					no_of_attendees: attendees,
				});

				if (response && (response.status === 1 || response.status === true)) {
					setStep("reservation");
					toast.success(getTranslation(t, "events.reservationRequested", "Reservation requested successfully"));
				} else {
					throw new Error(response?.message || "Booking failed");
				}
			}
		} catch (error) {
			console.error("Reservation error:", error);
			// Show user-friendly error message
			const errorMessage = error?.message || getTranslation(t, "events.reservationFailed", "Failed to make reservation");
			
			// Check if it's a seat availability error
			if (errorMessage.toLowerCase().includes("seats not available") || 
			    errorMessage.toLowerCase().includes("seat") ||
			    errorMessage.toLowerCase().includes("sold out") ||
			    errorMessage.toLowerCase().includes("capacity")) {
				toast.error(errorMessage, {
					duration: 5000, // Show longer for important errors
				});
			} else {
				toast.error(errorMessage);
			}
		} finally {
			setIsLoading(false);
		}
	};

	const initiateMoyasarPayment = () => {
		setIsLoading(true);
		try {
			setStep("payment");
		} catch (error) {
			console.error("Payment initialization error:", error);
			toast.error(getTranslation(t, "events.paymentInitError", "Error initializing payment"));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog.Root open={isOpen} onOpenChange={onClose}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
				<Dialog.Content className="fixed left-[50%] top-[50%] z-50 max-h-[95vh] w-[95vw] sm:w-[90vw] max-w-[600px] translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white shadow-2xl transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] border border-gray-100 flex flex-col overflow-hidden">
					{/* Header - Fixed */}
					<div className="flex-shrink-0 px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 pb-4 border-b border-gray-100">
						<div className="flex items-start justify-between gap-4">
							<div className="flex-1 min-w-0">
								<Dialog.Title className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
									{step === "payment" && (
										<Icon icon="lucide:credit-card" className="w-6 h-6 text-[#a797cc]" />
									)}
									{step === "confirmation" && (
										<Icon icon="lucide:check-circle" className="w-6 h-6 text-green-500" />
									)}
									{step === "reservation" && (
										<Icon icon="lucide:clock" className="w-6 h-6 text-yellow-500" />
									)}
									{getTranslation(t, "events.bookEvent", "Book Event")}
								</Dialog.Title>
								<Dialog.Description className="mt-2 text-sm md:text-base text-gray-600 font-medium">
									{step === "details" &&
										getTranslation(t, "events.enterBookingDetails", "Enter booking details")}
									{step === "reservation" &&
										getTranslation(t, "events.reservationPending", "Reservation Pending")}
									{step === "payment" && getTranslation(t, "events.processPayment", "Process Payment")}
									{step === "confirmation" &&
										getTranslation(t, "events.bookingConfirmed", "Booking Confirmed")}
								</Dialog.Description>
							</div>
							<Dialog.Close className="flex-shrink-0 p-2 rounded-full transition-colors hover:bg-gray-100">
								<Icon
									icon="lucide:x"
									className="w-5 h-5 text-gray-500"
								/>
							</Dialog.Close>
						</div>
					</div>

					{/* Scrollable Content Area */}
					<div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 md:px-8 py-4 sm:py-6">
						{step === "details" && (
							<div className="space-y-6">
								{/* Event Capacity Information */}
								{event.available_seats !== undefined && (
									<div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
										<div className="flex items-center gap-3">
											<div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
												<Icon icon="lucide:users" className="w-5 h-5 text-[#a797cc]" />
											</div>
											<div className="flex-1">
												<p className="text-sm font-semibold text-gray-900">
													{getTranslation(t, "events.seatsAvailable", "Seats Available")}
												</p>
												<p className="text-lg font-bold text-[#a797cc]">
													{event.available_seats} {getTranslation(t, "events.of", "of")} {event.total_seats}
												</p>
											</div>
											{event.available_seats === 0 && (
												<div className="px-3 py-1 bg-red-100 rounded-full">
													<span className="text-xs font-bold text-red-700">
														{getTranslation(t, "events.soldOut", "SOLD OUT")}
													</span>
												</div>
											)}
											{event.available_seats > 0 && event.available_seats <= 5 && (
												<div className="px-3 py-1 bg-orange-100 rounded-full">
													<span className="text-xs font-bold text-orange-700">
														{getTranslation(t, "events.fewLeft", "FEW LEFT")}
													</span>
												</div>
											)}
										</div>
									</div>
								)}
								
								<div className="space-y-2">
									<Label.Root className="text-sm font-medium text-gray-900">
										{getTranslation(t, "events.numberOfAttendees", "Number of Attendees")}
									</Label.Root>
									<div className="flex relative items-center">
										<button
											type="button"
											onClick={decrementAttendees}
											disabled={attendees <= 1}
											className="absolute left-0 h-full px-4 text-gray-500 hover:text-[#a797cc] disabled:opacity-50 disabled:hover:text-gray-500 transition-colors"
										>
											<Icon
												icon="lucide:minus"
												className="w-5 h-5"
											/>
										</button>
										<input
											type="number"
											min={1}
											max={event.available_seats !== undefined ? event.available_seats : event.no_of_attendees}
											value={attendees}
											onChange={handleAttendeeChange}
											disabled={event.available_seats === 0}
											className="w-full px-14 py-3 text-center text-lg font-medium text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:border-transparent transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
										/>
										<button
											type="button"
											onClick={incrementAttendees}
											disabled={
												event.available_seats !== undefined 
													? attendees >= event.available_seats || event.available_seats === 0
													: attendees >= event.no_of_attendees
											}
											className="absolute right-0 h-full px-4 text-gray-500 hover:text-[#a797cc] disabled:opacity-50 disabled:hover:text-gray-500 transition-colors"
										>
											<Icon
												icon="lucide:plus"
												className="w-5 h-5"
											/>
										</button>
									</div>
									<p className="flex gap-2 items-center text-sm text-gray-500">
										<Icon
											icon="lucide:info"
											className="w-4 h-4"
										/>
										{event.available_seats !== undefined 
											? getTranslation(t, "events.maxAttendeesAvailable", `Maximum ${event.available_seats || 0} attendees available`, {
												count: event.available_seats || 0,
											})
											: getTranslation(t, "events.maxAttendeesAvailable", `Maximum ${event.no_of_attendees || 1} attendees available`, {
												count: event.no_of_attendees || 1,
											})
										}
									</p>
								</div>

								<div className="p-4 space-y-4 bg-gray-50 rounded-xl">
									<div className="flex justify-between text-sm text-gray-600">
										<span>{getTranslation(t, "events.ticketPrice", "Ticket Price")}</span>
										<span className="font-medium">
											{ticketPrice} SAR × {attendees}
										</span>
									</div>
									<div className="flex justify-between pt-4 font-semibold text-gray-900 border-t border-gray-200">
										<span>{getTranslation(t, "events.total", "Total")}</span>
										<span>
											{totalAmount.toFixed(2)} SAR
										</span>
									</div>
								</div>
							</div>
						)}

						{step === "reservation" && (
							<div className="py-8 text-center">
								<div className="flex justify-center items-center mx-auto mb-6 w-20 h-20 text-yellow-500 bg-yellow-50 rounded-full">
									<Icon
										icon="lucide:clock"
										className="w-12 h-12"
									/>
								</div>
								<h3 className="mb-2 text-xl font-semibold text-gray-900">
									{getTranslation(t, "events.reservationPending", "Reservation Pending")}
								</h3>
								<p className="text-gray-600">
									{getTranslation(t, "events.reservationPendingDescription", "Your reservation is pending approval from the organizer. You will be notified once it's approved.")}
								</p>
							</div>
						)}

						{step === "payment" && (
							<div className="space-y-5 sm:space-y-7">
								{/* Ultra Premium Payment Summary Card */}
								<div className="relative overflow-hidden group">
									{/* Animated Gradient Background */}
									<div className="absolute inset-0 bg-gradient-to-br from-[#a797cc]/20 via-purple-50/30 to-[#8ba179]/20 rounded-[2rem] opacity-100"></div>
									<div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent rounded-[2rem]"></div>
									
									{/* Animated Orbs */}
									<div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#a797cc]/10 to-purple-300/10 rounded-full blur-3xl -mr-20 -mt-20 animate-pulse"></div>
									<div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#8ba179]/10 to-emerald-300/10 rounded-full blur-2xl -ml-16 -mb-16 animate-pulse" style={{ animationDelay: '1s' }}></div>
									
									{/* Shimmer Effect */}
									<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
									
									<div className="relative z-10 p-5 sm:p-6 md:p-8 border border-white/50 backdrop-blur-xl bg-white/70 rounded-[2rem] shadow-[0_8px_32px_rgba(167,151,204,0.15)] overflow-hidden">
										{/* Header with Icon */}
										<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
											<div className="flex-1 min-w-0 w-full sm:w-auto">
												<div className="flex items-center gap-2 sm:gap-3 mb-3">
													<div className="relative flex-shrink-0">
														<div className="absolute inset-0 bg-gradient-to-br from-[#a797cc] to-[#8ba179] rounded-2xl blur-md opacity-50 animate-pulse"></div>
														<div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#a797cc] via-purple-500 to-[#8ba179] rounded-2xl shadow-xl transform hover:scale-110 transition-all duration-300">
															<Icon icon="lucide:receipt" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
														</div>
													</div>
													<div className="min-w-0">
														<span className="text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
															{getTranslation(t, "events.totalAmount", "Total Amount")}
														</span>
													</div>
												</div>
												
												{/* Amount Display - Ultra Premium with proper wrapping */}
												<div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-2">
													<span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-[#a797cc] via-purple-600 to-[#8ba179] bg-clip-text text-transparent tracking-tight leading-none break-words">
														{totalAmount.toFixed(2)}
													</span>
													<span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-700 whitespace-nowrap">SAR</span>
												</div>
												<p className="text-xs sm:text-sm text-gray-500 font-medium">Including all fees and taxes</p>
											</div>
											
											{/* Premium Wallet Icon */}
											<div className="relative flex-shrink-0 ml-0 sm:ml-4">
												<div className="absolute inset-0 bg-gradient-to-br from-[#a797cc] to-[#8ba179] rounded-3xl blur-xl opacity-40 animate-pulse"></div>
												<div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#a797cc] via-purple-500 to-[#8ba179] rounded-3xl shadow-2xl transform hover:scale-110 hover:rotate-3 transition-all duration-500">
													<Icon icon="lucide:wallet" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white drop-shadow-lg" />
												</div>
											</div>
										</div>
										
										{/* Security Badge - Enhanced */}
										<div className="pt-5 sm:pt-6 border-t border-gradient-to-r from-[#a797cc]/20 via-transparent to-[#8ba179]/20">
											<div className="relative overflow-hidden bg-gradient-to-r from-emerald-50 via-green-50/80 to-emerald-50 rounded-2xl p-3 sm:p-4 border border-emerald-200/60 shadow-lg backdrop-blur-sm">
												{/* Animated Background Pattern */}
												<div className="absolute inset-0 opacity-5">
													<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIiBmaWxsPSIjMTA3YzQwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+')]"></div>
												</div>
												<div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
													<div className="relative flex-shrink-0">
														<div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl blur-md opacity-50"></div>
														<div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 rounded-xl shadow-xl">
															<Icon icon="lucide:shield-check" className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-md" />
														</div>
													</div>
													<div className="flex-1 min-w-0">
														<p className="text-xs sm:text-sm font-bold text-gray-800 mb-1.5 sm:mb-1 flex flex-wrap items-center gap-2">
															<span className="break-words">{getTranslation(t, "events.securePayment", "Secure payment powered by Moyasar")}</span>
															<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 whitespace-nowrap flex-shrink-0">
																<Icon icon="lucide:lock" className="w-3 h-3 mr-1" />
																Secure
															</span>
														</p>
														<p className="text-xs text-gray-600 font-medium flex flex-wrap items-center gap-1.5 sm:gap-2">
															<Icon icon="lucide:shield" className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
															<span className="break-words">256-bit SSL encryption • PCI DSS compliant</span>
														</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Ultra Premium Payment Form Container */}
								<div className="relative">
									{/* Section Header - Enhanced */}
									<div className="mb-4 sm:mb-5 md:mb-6">
										<div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
											<div className="relative flex-shrink-0">
												<div className="absolute inset-0 bg-gradient-to-br from-[#a797cc] to-[#8ba179] rounded-xl blur-lg opacity-30"></div>
												<div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gradient-to-br from-[#a797cc] via-purple-500 to-[#8ba179] rounded-xl shadow-xl">
													<Icon icon="lucide:credit-card" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
												</div>
											</div>
											<div className="flex-1 min-w-0">
												<h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight break-words">
													{getTranslation(t, "events.paymentDetails", "Payment Details")}
												</h3>
												<p className="text-xs sm:text-sm text-gray-500 font-medium mt-1 break-words">
													{getTranslation(t, "events.enterCardInfo", "Enter your card information to complete the payment")}
												</p>
											</div>
										</div>
									</div>

									{/* Form Container - Ultra Premium */}
									<div className="relative group">
										{/* Multi-layer Glow Effect */}
										<div className="absolute -inset-1 bg-gradient-to-r from-[#a797cc] via-purple-500 to-[#8ba179] rounded-[2rem] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500"></div>
										<div className="absolute -inset-0.5 bg-gradient-to-r from-[#8ba179] via-emerald-400 to-[#a797cc] rounded-[2rem] opacity-10 blur-xl"></div>
										
										<div
											ref={moyasarFormRef}
											id="moyasar-payment-form"
											className="relative w-full min-h-[360px] sm:min-h-[400px] md:min-h-[420px] bg-white rounded-[2rem] p-4 sm:p-6 md:p-8 lg:p-12 shadow-[0_20px_60px_rgba(167,151,204,0.15)] border-2 border-gray-100/80 transition-all duration-700 group-hover:border-[#a797cc]/50 group-hover:shadow-[0_25px_70px_rgba(167,151,204,0.25)] focus-within:border-[#a797cc] focus-within:shadow-[0_0_40px_rgba(167,151,204,0.3)] overflow-hidden"
											style={{ minHeight: '360px' }}
										>
											{/* Premium Loading Placeholder */}
											{(!moyasarFormRef.current?.innerHTML || moyasarFormRef.current.innerHTML.trim() === "") && (
												<div className="flex flex-col justify-center items-center min-h-[360px] sm:min-h-[400px] md:min-h-[420px] space-y-6">
													<div className="relative">
														{/* Animated Gradient Rings */}
														<div className="absolute inset-0 bg-gradient-to-r from-[#a797cc] to-[#8ba179] rounded-full animate-ping opacity-20"></div>
														<div className="absolute inset-0 bg-gradient-to-r from-[#8ba179] to-purple-500 rounded-full animate-pulse opacity-30" style={{ animationDelay: '0.5s' }}></div>
														<div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-[#a797cc] rounded-full animate-pulse opacity-25" style={{ animationDelay: '1s' }}></div>
														
														{/* Icon Container with 3D Effect */}
														<div className="relative z-10 flex items-center justify-center w-28 h-28 bg-gradient-to-br from-[#a797cc] via-purple-500 to-[#8ba179] rounded-3xl shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-500">
															<div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-3xl"></div>
															<Icon
																icon="lucide:credit-card"
																className="w-14 h-14 text-white drop-shadow-lg relative z-10"
															/>
														</div>
													</div>
													
													<div className="text-center space-y-5 px-2">
														<div>
															<p className="text-lg sm:text-xl font-black text-gray-800 mb-2 break-words">
																{getTranslation(t, "events.loadingPaymentForm", "Loading secure payment form...")}
															</p>
															<p className="text-xs sm:text-sm text-gray-500 font-medium break-words">Please wait while we securely load the payment gateway</p>
														</div>
														
														{/* Premium Loading Dots */}
														<div className="flex justify-center gap-2.5">
															<div className="w-3 h-3 bg-gradient-to-r from-[#a797cc] to-purple-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0ms' }}></div>
															<div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-[#8ba179] rounded-full animate-bounce shadow-lg" style={{ animationDelay: '150ms' }}></div>
															<div className="w-3 h-3 bg-gradient-to-r from-[#8ba179] to-[#a797cc] rounded-full animate-bounce shadow-lg" style={{ animationDelay: '300ms' }}></div>
														</div>
													</div>
												</div>
											)}
										</div>
									</div>
								</div>

								{/* Ultra Premium Payment Methods Card */}
								<div className="relative overflow-hidden group">
									{/* Background Effects */}
									<div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-[2rem]"></div>
									<div className="absolute inset-0 bg-gradient-to-br from-[#a797cc]/5 via-transparent to-[#8ba179]/5 rounded-[2rem]"></div>
									
									{/* Subtle Pattern */}
									<div className="absolute inset-0 opacity-[0.03]">
										<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxLjUiIGZpbGw9IiM2NjYiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')]"></div>
									</div>
									
									<div className="relative z-10 p-4 sm:p-6 md:p-7 border border-gray-200/60 rounded-[2rem] shadow-xl backdrop-blur-sm bg-white/80 overflow-hidden">
										<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5">
											{/* Left Section - Lock Icon & Text */}
											<div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
												<div className="relative flex-shrink-0">
													<div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl blur-md opacity-40"></div>
													<div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 rounded-xl shadow-xl">
														<Icon icon="lucide:lock" className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-md" />
													</div>
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-xs sm:text-sm font-black text-gray-800 mb-1 sm:mb-1.5 break-words">
														{getTranslation(t, "events.acceptedCards", "We accept Visa, Mastercard, Mada, and AMEX")}
													</p>
													<p className="text-xs text-gray-600 font-medium break-words">All major credit and debit cards supported</p>
												</div>
											</div>
											
											{/* Right Section - Card Icons - Enhanced */}
											<div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-start sm:justify-end w-full sm:w-auto">
												<div className="relative group/card flex-shrink-0">
													<div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg blur-sm opacity-50 group-hover/card:opacity-75 transition-opacity"></div>
													<div className="relative w-12 h-8 sm:w-14 sm:h-9 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white text-[10px] sm:text-xs font-black shadow-lg transform group-hover/card:scale-110 transition-transform">
														<span className="drop-shadow-md">VISA</span>
													</div>
												</div>
												<div className="relative group/card flex-shrink-0">
													<div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg blur-sm opacity-50 group-hover/card:opacity-75 transition-opacity"></div>
													<div className="relative w-12 h-8 sm:w-14 sm:h-9 bg-gradient-to-r from-red-500 via-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white text-[10px] sm:text-xs font-black shadow-lg transform group-hover/card:scale-110 transition-transform">
														<span className="drop-shadow-md">MC</span>
													</div>
												</div>
												<div className="relative group/card flex-shrink-0">
													<div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg blur-sm opacity-50 group-hover/card:opacity-75 transition-opacity"></div>
													<div className="relative w-12 h-8 sm:w-14 sm:h-9 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-[10px] sm:text-xs font-black shadow-lg transform group-hover/card:scale-110 transition-transform">
														<span className="drop-shadow-md">MADA</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}

						{step === "confirmation" && (
							<div className="py-8 text-center">
								<div className="flex justify-center items-center mx-auto mb-6 w-20 h-20 text-green-500 bg-green-50 rounded-full">
									<Icon
										icon="lucide:check-circle"
										className="w-12 h-12"
									/>
								</div>
								<h3 className="mb-2 text-xl font-semibold text-gray-900">
									{getTranslation(t, "events.paymentSuccess", "Payment Successful!")}
								</h3>
								<p className="text-gray-600 mb-4">
									{getTranslation(t, "events.paymentSuccessDescription", "Your payment has been processed successfully. You have been added to the event group chat.")}
								</p>
								<div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
									<div className="flex items-center justify-center gap-2 text-blue-700">
										<Icon icon="lucide:message-circle" className="w-5 h-5" />
										<p className="text-sm font-medium">
											{getTranslation(t, "events.groupChatAdded", "You can now chat with other participants in the group chat!")}
										</p>
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Footer - Fixed */}
					<div className="flex-shrink-0 px-4 sm:px-6 md:px-8 pt-4 pb-4 sm:pb-6 border-t border-gray-100 bg-white">
						<div className="flex gap-3 justify-end">
						{step === "details" && (
							<Button
								onClick={handleReservation}
								disabled={isLoading}
								className="h-12 px-6 rounded-xl bg-[#a797cc] hover:bg-[#a797cc]/90 text-white font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isLoading ? (
									<Icon
										icon="lucide:loader-2"
										className="w-5 h-5 animate-spin"
									/>
								) : (
									<Icon
										icon="lucide:check"
										className="w-5 h-5"
									/>
								)}
								{getTranslation(t, "events.reserveSpot", "Reserve Spot")}
							</Button>
						)}

						{step === "payment" && (
							<Button
								onClick={onClose}
								className="px-6 h-12 font-medium text-gray-700 rounded-xl border border-gray-200 transition-colors hover:bg-gray-50"
							>
								{getTranslation(t, "events.cancel", "Cancel")}
							</Button>
						)}

						{step === "reservation" && (
							<Button
								onClick={onClose}
								className="px-6 h-12 font-medium text-gray-700 rounded-xl border border-gray-200 transition-colors hover:bg-gray-50"
							>
								{getTranslation(t, "events.close", "Close")}
							</Button>
						)}

						{step === "confirmation" && (
							<Button
								onClick={onClose}
								className="px-6 h-12 font-medium text-gray-700 rounded-xl border border-gray-200 transition-colors hover:bg-gray-50"
							>
								{getTranslation(t, "events.close", "Close")}
							</Button>
						)}
						</div>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
