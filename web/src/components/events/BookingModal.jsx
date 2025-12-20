"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Label from "@radix-ui/react-label";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { AddBookNowApi } from "@/app/api/setting";

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

	// Handle payment completion
	const handlePaymentCompleted = useCallback(
		(payment) => {
			console.log("Payment completed:", payment);
			if (payment && payment.status === "paid") {
				// Call the onBookEvent callback with the payment information
				onBookEvent?.({
					eventId: event?._id,
					attendees,
					paymentId: payment.id,
					amount: totalAmount,
				});
				setStep("confirmation");
			}
		},
		[event?._id, attendees, totalAmount, onBookEvent]
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
				console.error("Moyasar not loaded");
				toast.error(getTranslation(t, "events.paymentInitError", "Error initializing payment"));
				return;
			}

			// Get current language (don't modify document - let RTLHandler handle it)
			const currentLang = i18n.language || "ar";

			// Safely clear previous form only if element is still in DOM
			if (moyasarFormRef.current && moyasarFormRef.current.parentNode) {
				try {
					moyasarFormRef.current.innerHTML = "";
				} catch (error) {
					console.warn("Error clearing Moyasar form:", error);
					return;
				}
			} else {
				return;
			}

			moyasar.init({
				element: moyasarFormRef.current,
				amount: totalAmount * 100, // Convert to halala (smallest currency unit)
				currency: "SAR",
				// callback_url: `https://google.com`,
				callback_url: `${window.location.origin}/events/${event?._id}?booking_id=${event?.booked_event?._id}`,
				description: `${getTranslation(t, "events.bookEvent", "Booking for")} ${event?.event_name || getTranslation(t, "events.eventDetails", "Event")}`,
				publishable_api_key:
					process.env.NEXT_PUBLIC_MOYASAR_KEY || "pk_test_GUUdMyrNufV9xb59FBSAYi9jniyhvVDa9U2524pV",
				methods: ["creditcard"],
				language: currentLang, // Set language for Moyasar form
				apple_pay: {
					country: "SA",
					label: getTranslation(t, "events.appName", "Zuroona"),
					validate_merchant_url:
						"https://api.moyasar.com/v1/applepay/initiate",
					merchant_capabilities: [
						"supports3DS",
						"supportsCredit",
						"supportsDebit",
					],
				},
				// on_failed: () => {
				//   toast.error(" خطأ في عملية الدفع");
				//   console.log("Payment failed");
				// },
				on_completed: async function (payment) {
					console.log("Payment completed:", payment);
					handlePaymentCompleted(payment);
				},
			});
		} catch (error) {
			console.error("Payment initialization error:", error);
			toast.error(getTranslation(t, "events.paymentInitError", "Error initializing payment"));
			setStep("details");
		}
	}, [totalAmount, event?.event_name, t, event?.booked_event?._id, i18n.language, handlePaymentCompleted]);

	// Initialize Moyasar when step changes to payment (consolidated effect)
	useEffect(() => {
		if (!isOpen || step !== "payment") {
			return;
		}

		// Add a small delay to ensure the DOM is ready
		const timer = setTimeout(() => {
			if (moyasarFormRef.current && moyasarFormRef.current.parentNode) {
				initializeMoyasarForm();
			}
		}, 150);

		return () => {
			clearTimeout(timer);
			// Cleanup: Clear Moyasar form if element still exists
			if (moyasarFormRef.current && moyasarFormRef.current.parentNode) {
				try {
					moyasarFormRef.current.innerHTML = "";
				} catch (error) {
					// Silently handle cleanup errors
					console.warn("Error cleaning up Moyasar form:", error);
				}
			}
		};
	}, [step, isOpen, initializeMoyasarForm]);

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

		if (attendees < 1 || attendees > (event.no_of_attendees || 1)) {
			toast.error(getTranslation(t, "events.invalidAttendees", "Invalid number of attendees"));
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
			toast.error(error?.message || getTranslation(t, "events.reservationFailed", "Failed to make reservation"));
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
				<Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
				<Dialog.Content className="fixed left-[50%] top-[50%] max-h-[90vh] w-[90vw] max-w-[550px] translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white p-6 md:p-8 shadow-2xl transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] divide-y divide-gray-100 border border-gray-100">
					<div className="pb-6">
						<div className="flex items-start justify-between">
							<div>
								<Dialog.Title className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
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
						</div>
					</div>

					<div className="py-6">
						{step === "details" && (
							<div className="space-y-6">
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
											max={event.no_of_attendees}
											value={attendees}
											onChange={handleAttendeeChange}
											className="w-full px-14 py-3 text-center text-lg font-medium text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:border-transparent transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
										/>
										<button
											type="button"
											onClick={incrementAttendees}
											disabled={
												attendees >=
												event.no_of_attendees
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
										{getTranslation(t, "events.maxAttendeesAvailable", `Maximum ${event.no_of_attendees || 1} attendees available`, {
											count: event.no_of_attendees || 1,
										})}
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
							<div className="space-y-6">
								{/* Payment Summary */}
								<div className="bg-gradient-to-br from-[#a797cc]/5 to-orange-50 rounded-xl p-5 border border-[#a797cc]/10">
									<div className="flex items-center justify-between mb-3">
										<span className="text-sm font-medium text-gray-700">
											{getTranslation(t, "events.totalAmount", "Total Amount")}
										</span>
										<span className="text-2xl font-bold text-[#a797cc]">
											{totalAmount.toFixed(2)} SAR
										</span>
									</div>
									<p className="text-xs text-gray-500 flex items-center gap-1">
										<Icon icon="lucide:shield-check" className="w-3 h-3" />
										{getTranslation(t, "events.securePayment", "Secure payment powered by Moyasar")}
									</p>
								</div>

								{/* Payment Form Container */}
								<div className="relative">
									<div
										ref={moyasarFormRef}
										className="w-full min-h-[280px] bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm transition-all duration-300 hover:border-[#a797cc]/30 focus-within:border-[#a797cc] focus-within:shadow-md"
									>
										{/* Loading Placeholder */}
										{(!moyasarFormRef.current?.innerHTML || moyasarFormRef.current.innerHTML.trim() === "") && (
											<div className="flex flex-col justify-center items-center h-[280px] space-y-4">
												<div className="relative">
													<div className="absolute inset-0 bg-[#a797cc]/10 rounded-full animate-ping"></div>
													<Icon
														icon="lucide:credit-card"
														className="w-12 h-12 text-[#a797cc] relative z-10"
													/>
												</div>
												<div className="text-center space-y-2">
													<p className="text-sm font-medium text-gray-700">
														{getTranslation(t, "events.loadingPaymentForm", "Loading secure payment form...")}
													</p>
													<div className="flex justify-center gap-1">
														<div className="w-2 h-2 bg-[#a797cc] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
														<div className="w-2 h-2 bg-[#a797cc] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
														<div className="w-2 h-2 bg-[#a797cc] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
													</div>
												</div>
											</div>
										)}
									</div>
								</div>

								{/* Accepted Payment Methods Info */}
								<div className="flex items-center justify-center gap-2 text-xs text-gray-500">
									<Icon icon="lucide:lock" className="w-4 h-4" />
									<span>{getTranslation(t, "events.acceptedCards", "We accept Visa, Mastercard, Mada, and AMEX")}</span>
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
									{getTranslation(t, "events.thankYouForBooking", "Thank You for Your Booking")}
								</h3>
								<p className="text-gray-600">
									{getTranslation(t, "events.bookingConfirmationEmailSent", "A confirmation email has been sent to your registered email address.")}
								</p>
							</div>
						)}
					</div>

					<div className="flex gap-3 justify-end pt-6">
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

					<Dialog.Close className="absolute top-6 right-6 p-2 rounded-full transition-colors hover:bg-gray-100">
						<Icon
							icon="lucide:x"
							className="w-5 h-5 text-gray-500"
						/>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
