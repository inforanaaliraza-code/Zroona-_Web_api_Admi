"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Label from "@radix-ui/react-label";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { AddBookNowApi } from "@/app/api/setting";
import PaymentModal from "@/components/Modal/PaymentModal";

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
	const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

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

	// Handle payment completion from PaymentModal
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
					setIsPaymentModalOpen(false);
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

	// Open payment modal
	const initiateMoyasarPayment = () => {
		setIsPaymentModalOpen(true);
	};

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

			// Check if it's a duplicate/pending booking error (show as warning, not error)
			if (errorMessage.toLowerCase().includes("already") ||
				errorMessage.toLowerCase().includes("pending") ||
				errorMessage.toLowerCase().includes("duplicate") ||
				errorMessage.toLowerCase().includes("wait for the host")) {
				toast.warning(errorMessage, {
					duration: 6000, // Show longer for important warnings
				});
			}
			// Check if it's a seat availability error
			else if (errorMessage.toLowerCase().includes("seats not available") ||
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


	return (
		<Dialog.Root open={isOpen} onOpenChange={onClose}>
			<Dialog.Portal>
				<Dialog.Overlay className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[1050] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 ${isPaymentModalOpen ? 'opacity-0 pointer-events-none' : ''}`} />
				<Dialog.Content className={`fixed left-[50%] top-[50%] z-[1051] max-h-[95vh] w-[95vw] sm:w-[90vw] max-w-[600px] translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white shadow-2xl transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] border border-gray-100 flex flex-col overflow-hidden ${isPaymentModalOpen ? 'opacity-0 pointer-events-none translate-y-[-40%]' : ''}`}>
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
							<div className="py-8 text-center space-y-6">
								<div className="flex justify-center items-center mx-auto mb-6 w-20 h-20 text-[#a797cc] bg-[#a797cc]/10 rounded-full">
									<Icon
										icon="lucide:credit-card"
										className="w-12 h-12"
									/>
								</div>
								<h3 className="mb-2 text-xl font-semibold text-gray-900">
									{getTranslation(t, "events.readyToPay", "Ready to Pay")}
								</h3>
								<p className="text-gray-600 mb-6">
									{getTranslation(t, "events.clickToProceed", "Click the button below to proceed with payment")}
								</p>
								<Button
									onClick={initiateMoyasarPayment}
									disabled={isLoading}
									className="h-12 px-8 rounded-xl bg-gradient-to-r from-[#a797cc] to-purple-600 hover:from-[#a797cc]/90 hover:to-purple-600/90 text-white font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
								>
									{isLoading ? (
										<Icon
											icon="lucide:loader-2"
											className="w-5 h-5 animate-spin"
										/>
									) : (
										<>
											<Icon
												icon="lucide:credit-card"
												className="w-5 h-5"
											/>
											{getTranslation(t, "events.proceedToPayment", "Proceed to Payment")}
										</>
									)}
								</Button>
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

			{/* New Payment Modal */}
			<PaymentModal
				isOpen={isPaymentModalOpen}
				onClose={() => setIsPaymentModalOpen(false)}
				event={event}
				totalAmount={totalAmount}
				onPaymentComplete={handlePaymentCompleted}
			/>
		</Dialog.Root>
	);
}
