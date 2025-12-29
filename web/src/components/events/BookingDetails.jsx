"use client";

import { format } from "date-fns";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

// Helper functions for booking status
// Backend status mapping: 1 = Pending, 2 = Approved/Confirmed, 3 = Cancelled, 4 = Rejected
const getBookingStatusLabel = (status, t) => {
	switch (status) {
		case 0:
			return t("eventsMain.pending") || "Pending";
		case 1:
			return t("eventsMain.pending") || "Pending"; // Waiting for host approval
		case 2:
			return t("eventsMain.approved") || "Approved"; // Host approved, can pay
		case 3:
			return t("eventsMain.cancelled") || "Cancelled";
		case 4:
			return t("eventsMain.rejected") || "Rejected";
		default:
			return t("eventsMain.unknown") || "Unknown";
	}
};

const getBookingStatusIcon = (status) => {
	switch (status) {
		case 0:
			return "lucide:clock";
		case 1:
			return "lucide:check-circle";
		case 2:
			return "lucide:check-check"; // Double check for confirmed
		case 3:
			return "lucide:ban";
		case 4:
			return "lucide:x-circle";
		default:
			return "lucide:help-circle";
	}
};

const getBookingStatusColor = (status) => {
	switch (status) {
		case 0:
			return "text-yellow-500";
		case 1:
			return "text-green-500";
		case 2:
			return "text-blue-500";
		case 3:
			return "text-orange-500";
		case 4:
			return "text-red-500";
		default:
			return "text-gray-500";
	}
};

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

const getBookingStatusDescription = (status, t) => {
	switch (status) {
		case 0:
			return getTranslation(t, "events.pendingDescription", "Your booking is pending approval from the organizer.");
		case 1:
			return getTranslation(t, "events.pendingHostApproval", "Your booking request is pending. Waiting for the host to review and approve your request. You will be notified once the host makes a decision.");
		case 2:
			return getTranslation(t, "events.approvedDescription", "Your booking has been approved by the host. You can now proceed with payment.");
		case 3:
			return getTranslation(t, "events.cancelledDescription", "Your booking has been cancelled.");
		case 4:
			return getTranslation(t, "events.rejectedDescription", "Your booking request was rejected by the host. You cannot book this event.");
		default:
			return "";
	}
};

// Helper functions for payment status
const getPaymentStatusLabel = (status, t) => {
	switch (status) {
		case 0:
			return getTranslation(t, "events.unpaid", "Unpaid");
		case 1:
			return getTranslation(t, "events.paid", "Paid");
		default:
			return getTranslation(t, "events.unknown", "Unknown");
	}
};

const getPaymentStatusIcon = (status) => {
	switch (status) {
		case 0:
			return "lucide:credit-card";
		case 1:
			return "lucide:check-circle";
		default:
			return "lucide:help-circle";
	}
};

const getPaymentStatusColor = (status) => {
	switch (status) {
		case 0:
			return "text-blue-500";
		case 1:
			return "text-green-500";
		default:
			return "text-gray-500";
	}
};

export default function BookingDetails({
	booking,
	eventPrice,
	onInitiatePayment,
	onCancelBooking,
}) {
	const { t } = useTranslation();

	if (!booking) return null;

	// Check if payment button should be shown
	// Backend status mapping: 1=Pending, 2=Approved/Confirmed, 3=Cancelled, 4=Rejected
	// Payment button shows when: booking is pending (1) OR approved (2) AND payment is not completed
	const bookStatus = booking.book_status;
	const paymentStatus = booking.payment_status;
	
	// Payment button shows for: pending (1) or approved (2) bookings that are unpaid
	const isPendingOrApproved = bookStatus === 1 || bookStatus === 2;
	const isUnpaid = paymentStatus === 0 || paymentStatus === null || paymentStatus === undefined || paymentStatus === false || !paymentStatus;
	const isApproved = bookStatus === 2;
	
	// Show button for pending or approved bookings that are unpaid
	const showPaymentButton = isPendingOrApproved && isUnpaid;
	
	// Debug logging
	console.log('[BOOKING-DETAILS] Payment button check:', {
		bookStatus,
		paymentStatus,
		isPendingOrApproved,
		isApproved,
		isUnpaid,
		showPaymentButton,
		booking: {
			_id: booking._id,
			order_id: booking.order_id,
			book_status: booking.book_status,
			payment_status: booking.payment_status
		}
	});

	// Check if cancel button should be shown (only for approved (2) bookings, not pending (1))
	const showCancelButton = booking.book_status === 2 && booking.book_status !== 3;

	// Check if invoice is available (paid bookings with invoice_url)
	const showInvoiceButton =
		booking.payment_status === 1 && booking.invoice_url;

	return (
		<div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl">
			{/* Header with booking status - Professional Design */}
			<div className="flex items-start gap-4 mb-6 pb-6 border-b-2 border-gray-100">
				<div
					className={`p-4 rounded-xl ${getBookingStatusColor(
						booking.book_status
					).replace(
						"text",
						"bg"
					)}/10 flex items-center justify-center shadow-md`}
				>
					<Icon
						icon={getBookingStatusIcon(booking.book_status)}
						className={`w-7 h-7 ${getBookingStatusColor(
							booking.book_status
						)}`}
					/>
				</div>
				<div className="flex-1">
					<div className="flex justify-between items-start mb-2">
						<div className="flex-1">
							<div className="flex items-center gap-2 mb-2">
								<span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
									{getTranslation(t, "events.status", "Status")}
								</span>
								<span
									className={`text-xl font-bold ${getBookingStatusColor(
										booking.book_status
									)}`}
								>
									{getBookingStatusLabel(booking.book_status, t)}
								</span>
							</div>
							<p className="text-sm text-gray-600 leading-relaxed">
								{getBookingStatusDescription(booking.book_status, t)}
							</p>
						</div>
						<div className="px-4 py-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 shadow-sm">
							<span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
								{getTranslation(t, "events.bookingId", "Booking ID")}
							</span>
							<span className="text-sm font-bold text-gray-900">
								#{booking.order_id ||
									booking._id?.substring(0, 8).toUpperCase() || "N/A"}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Booking Details - Professional Design */}
			<div className="mb-6 space-y-3">
				{/* Booking Date */}
				<div className="flex justify-between items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50 shadow-sm">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
							<Icon
								icon="lucide:calendar"
								className="w-6 h-6 text-white"
							/>
						</div>
						<span className="text-sm font-semibold text-gray-700">
							{getTranslation(t, "events.bookingDate", "Booking Date")}
						</span>
					</div>
					<span className="font-bold text-base text-gray-900">
						{format(
							new Date(booking.createdAt || new Date()),
							"MMMM d, yyyy"
						)}
					</span>
				</div>

				{/* Attendees */}
				<div className="flex justify-between items-center p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200/50 shadow-sm">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-md">
							<Icon
								icon="lucide:users"
								className="w-6 h-6 text-white"
							/>
						</div>
						<span className="text-sm font-semibold text-gray-700">
							{getTranslation(t, "events.attendees", "Attendees")}
						</span>
					</div>
					<span className="px-4 py-2 font-bold text-purple-700 bg-white rounded-full border-2 border-purple-300 shadow-sm">
						{booking.no_of_attendees || 0}
					</span>
				</div>

				{/* Total Amount */}
				<div className="flex justify-between items-center p-4 bg-gradient-to-br from-[#a797cc]/10 via-[#a797cc]/5 to-orange-50 rounded-xl border-2 border-[#a797cc]/30 shadow-md">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-gradient-to-br from-[#a797cc] to-[#8ba179] rounded-xl flex items-center justify-center shadow-lg">
							<Icon
								icon="lucide:credit-card"
								className="w-6 h-6 text-white"
							/>
						</div>
						<span className="text-sm font-semibold text-gray-700">
							{getTranslation(t, "events.totalAmount", "Total Amount")}
						</span>
					</div>
					<span className="font-bold text-2xl bg-gradient-to-r from-[#a797cc] to-[#8ba179] bg-clip-text text-transparent">
						{(booking.total_amount || (eventPrice || 0) * (booking.no_of_attendees || 0)).toFixed(2)}{" "}
						<span className="text-lg text-gray-700">{getTranslation(t, "card.tab2", "SAR")}</span>
					</span>
				</div>

				{/* Payment Status - Only show for approved/confirmed bookings with payment status */}
				{(booking.book_status === 1 || booking.book_status === 2) &&
					booking.payment_status !== undefined && (
						<div className={`p-4 rounded-xl border shadow-sm ${
							showPaymentButton 
								? "bg-gradient-to-br from-blue-50 via-[#a797cc]/10 to-orange-50 border-2 border-[#a797cc]/30" 
								: "bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200/50"
						}`}>
							<div className="flex justify-between items-center mb-3">
								<div className="flex items-center gap-3">
									<Icon
										icon={getPaymentStatusIcon(
											booking.payment_status
										)}
										className={`w-5 h-5 ${getPaymentStatusColor(
											booking.payment_status
										)}`}
									/>
									<span className="text-sm font-semibold text-gray-700">
										{getTranslation(t, "events.paymentStatus", "Payment Status")}
									</span>
								</div>
								<span
									className={`px-3 py-1.5 font-bold rounded-lg ${
										booking.payment_status === 1
											? "bg-green-100 text-green-700 border border-green-300"
											: "bg-blue-100 text-blue-700 border border-blue-300"
									}`}
								>
									{getPaymentStatusLabel(
										booking.payment_status,
										t
									)}
								</span>
							</div>
							
							{/* Payment Button - Show prominently right below payment status if pending/approved and unpaid */}
							{showPaymentButton && (
								<div className="mt-4 pt-4 border-t-2 border-[#a797cc]/20">
									{isApproved ? (
										// Approved booking - show active payment button
										<>
											<Button
												onClick={onInitiatePayment}
												className="w-full text-white text-lg font-bold h-16 rounded-xl bg-gradient-to-r from-[#a797cc] to-[#8ba179] hover:from-[#8ba179] hover:to-[#a797cc] transition-all duration-300 flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-[1.02] transform"
											>
												<span className="inline-flex justify-center items-center gap-3">
													<Icon
														icon="lucide:credit-card"
														className="w-7 h-7"
													/>
													{getTranslation(t, "events.bookNow", "Book Now & Pay")}
												</span>
											</Button>
											<p className="text-xs text-center text-gray-500 mt-2">
												{getTranslation(t, "events.clickToPay", "Click to proceed with secure payment")}
											</p>
										</>
									) : (
										// Pending booking - show disabled button with message
										<>
											<Button
												onClick={onInitiatePayment}
												disabled={true}
												className="w-full text-white text-lg font-bold h-16 rounded-xl bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg opacity-75"
											>
												<span className="inline-flex justify-center items-center gap-3">
													<Icon
														icon="lucide:clock"
														className="w-7 h-7"
													/>
													{getTranslation(t, "events.waitingForApproval", "Waiting for Host Approval")}
												</span>
											</Button>
											<p className="text-xs text-center text-orange-600 mt-2 font-medium">
												{getTranslation(t, "events.approvalRequired", "Payment will be available after host approves your booking")}
											</p>
										</>
									)}
								</div>
							)}
						</div>
					)}

				{/* Invoice Info - Show if available */}
				{booking.invoice_id && (
					<div className="flex justify-between items-center pt-2">
						<div className="flex items-center">
							<Icon
								icon="lucide:file-text"
								className="w-4 h-4 text-gray-500 rtl:ml-3 ltr:mr-3"
							/>
							<span className="text-sm font-medium text-gray-700">
								{getTranslation(t, "events.invoice", "Invoice")}
							</span>
						</div>
						<span className="font-medium text-gray-900">
							#{booking.invoice_id}
						</span>
					</div>
				)}

				{/* Rejection Reason - Show if booking is rejected */}
				{(booking.book_status === 3 || booking.book_status === 4) && booking.rejection_reason && (
					<div className="mt-4 pt-4 border-t-2 border-red-100">
						<div className="bg-gradient-to-br from-red-50 via-orange-50 to-red-50 rounded-xl p-5 border-2 border-red-200 shadow-lg">
							<div className="flex items-start gap-4">
								<div className="p-3 bg-red-100 rounded-xl flex-shrink-0 shadow-md">
									<Icon icon="lucide:alert-circle" className="w-6 h-6 text-red-600" />
								</div>
								<div className="flex-1">
									<h3 className="text-base font-bold text-red-900 mb-2 flex items-center gap-2">
										<Icon icon="lucide:info" className="w-5 h-5" />
										{getTranslation(t, "rejectReason.rejectionReason", "Rejection Reason")}
									</h3>
									<p className="text-sm text-red-800 leading-relaxed whitespace-pre-wrap bg-white/50 p-3 rounded-lg border border-red-200">
										{booking.rejection_reason}
									</p>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Action Buttons Section */}
			<div className="space-y-3 pt-2">
				{/* Invoice Button - Show if invoice is available */}
				{showInvoiceButton && (
					<Button
						onClick={() =>
							window.open(booking.invoice_url, "_blank")
						}
						className="w-full text-green-700 text-sm font-semibold h-12 rounded-xl bg-white border-2 border-green-300 hover:bg-green-50 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-[1.02]"
					>
						<span className="inline-flex justify-center items-center gap-2">
							<Icon
								icon="lucide:file-text"
								className="w-5 h-5"
							/>
							{getTranslation(t, "events.downloadInvoice", "Download Invoice")}
						</span>
					</Button>
				)}

				{/* Payment Button - Only show if booking is approved but not paid */}
				{showPaymentButton && (
					<Button
						onClick={onInitiatePayment}
						className="w-full text-white text-sm font-semibold h-12 rounded-xl bg-gradient-to-r from-[#a797cc] to-[#8ba179] hover:from-[#8ba179] hover:to-[#a797cc] transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-[1.02]"
					>
						<span className="inline-flex justify-center items-center gap-2">
							<Icon
								icon="lucide:credit-card"
								className="w-5 h-5"
							/>
							{getTranslation(t, "events.proceedToPayment", "Proceed to Payment")}
						</span>
					</Button>
				)}

				{/* Cancel Button - Show for approved (1) and confirmed (2) statuses */}
				{showCancelButton && (
					<Button
						onClick={onCancelBooking}
						className={`w-full text-sm font-semibold h-12 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-[1.02] ${
							showPaymentButton || showInvoiceButton
								? "text-red-700 bg-white border-2 border-red-400 hover:bg-red-50"
								: "text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
						}`}
					>
						<span className="inline-flex justify-center items-center gap-2">
							<Icon
								icon="lucide:x-circle"
								className="w-5 h-5"
							/>
							{getTranslation(t, "events.cancelBooking", "Cancel Booking")}
						</span>
					</Button>
				)}
			</div>
		</div>
	);
}
