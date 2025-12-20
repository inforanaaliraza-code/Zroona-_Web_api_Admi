"use client";

import { format } from "date-fns";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

// Helper functions for booking status
const getBookingStatusLabel = (status, t) => {
	switch (status) {
		case 0:
			return t("eventsMain.pending") || "Pending";
		case 1:
			return t("eventsMain.approved") || "Approved";
		case 2:
			return t("eventsMain.confirmed") || "Confirmed";
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
			return getTranslation(t, "events.approvedDescription", "Your booking has been approved. Please proceed to payment.");
		case 2:
			return getTranslation(t, "events.confirmedDescription", "Your booking is confirmed. Payment completed.");
		case 3:
			return getTranslation(t, "events.cancelledDescription", "Your booking has been cancelled.");
		case 4:
			return getTranslation(t, "events.rejectedDescription", "Your booking request was rejected.");
		default:
			return "";
	}
};

// Helper functions for payment status
const getPaymentStatusLabel = (status, t) => {
	switch (status) {
		case 0:
			return t("events.unpaid");
		case 1:
			return t("events.paid");
		default:
			return t("events.unknown");
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

	// Check if payment button should be shown (only for approved status=2, not paid yet)
	// Status mapping: 0=Pending, 1=Pending (old), 2=Approved, 3=Rejected/Cancelled
	const showPaymentButton =
		(booking.book_status === 2 || booking.book_status === 1) &&
		(booking.payment_status === 0 || booking.payment_status === undefined);

	// Check if cancel button should be shown (only for approved bookings - book_status === 2)
	// According to requirements: "After the event is approved there should be 1 option, 1. Cancel Event"
	const showCancelButton = booking.book_status === 2;

	// Check if invoice is available (paid bookings with invoice_url)
	const showInvoiceButton =
		booking.payment_status === 1 && booking.invoice_url;

	return (
		<div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-xl transition-all duration-300 hover:shadow-2xl">
			{/* Header with booking status - Professional Design */}
			<div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-200">
				<div
					className={`p-3 rounded-xl rtl:ml-4 ltr:mr-4 ${getBookingStatusColor(
						booking.book_status
					).replace(
						"text",
						"bg"
					)}/10 flex items-center justify-center shadow-sm`}
				>
					<Icon
						icon={getBookingStatusIcon(booking.book_status)}
						className={`w-6 h-6 ${getBookingStatusColor(
							booking.book_status
						)}`}
					/>
				</div>
				<div className="flex-1">
					<div className="flex justify-between items-start mb-2">
						<div>
							<div className="flex items-center gap-2 mb-1">
								<span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
									{getTranslation(t, "events.status", getTranslation(t, "tab.tab7", "Status"))}
								</span>
								<span
									className={`text-lg font-bold ${getBookingStatusColor(
										booking.book_status
									)}`}
								>
									{getBookingStatusLabel(booking.book_status, t)}
								</span>
							</div>
							<p className="text-sm text-gray-600 mt-1">
								{getBookingStatusDescription(booking.book_status, t)}
							</p>
						</div>
						<span className="px-3 py-1.5 text-xs font-bold text-gray-700 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border border-gray-300 shadow-sm">
							#
							{booking.order_id ||
								booking._id.substring(0, 6).toUpperCase()}
						</span>
					</div>
				</div>
			</div>

			{/* Booking Details - Professional Design */}
			<div className="mb-6 space-y-4">
				{/* Booking Date */}
				<div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
							<Icon
								icon="lucide:calendar"
								className="w-5 h-5 text-blue-600"
							/>
						</div>
						<span className="text-sm font-semibold text-gray-700">
							{getTranslation(t, "events.bookingDate", "Booking Date")}
						</span>
					</div>
					<span className="font-bold text-gray-900">
						{format(
							new Date(booking.createdAt || new Date()),
							"MMMM d, yyyy"
						)}
					</span>
				</div>

				{/* Attendees */}
				<div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
							<Icon
								icon="lucide:users"
								className="w-5 h-5 text-purple-600"
							/>
						</div>
						<span className="text-sm font-semibold text-gray-700">
							{getTranslation(t, "events.attendees", "Attendees")}
						</span>
					</div>
					<span className="px-4 py-1.5 font-bold text-purple-800 bg-purple-100 rounded-full border border-purple-200">
						{booking.no_of_attendees}
					</span>
				</div>

				{/* Total Amount */}
				<div className="flex justify-between items-center p-4 bg-gradient-to-br from-[#a797cc]/5 to-orange-50 rounded-lg border border-[#a797cc]/20">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-[#a797cc] rounded-lg flex items-center justify-center shadow-md">
							<Icon
								icon="lucide:credit-card"
								className="w-5 h-5 text-white"
							/>
						</div>
						<span className="text-sm font-semibold text-gray-700">
							{getTranslation(t, "events.totalAmount", "Total Amount")}
						</span>
					</div>
					<span className="font-bold text-2xl text-[#a797cc]">
						{(booking.total_amount || eventPrice * booking.no_of_attendees).toFixed(2)}{" "}
						<span className="text-lg">{t("card.tab2")}</span>
					</span>
				</div>

				{/* Payment Status - Only show for approved bookings with payment status */}
				{(booking.book_status === 2 || booking.book_status === 1) &&
					booking.payment_status !== undefined && (
						<div className="flex justify-between items-center pt-2">
							<div className="flex items-center">
								<Icon
									icon={getPaymentStatusIcon(
										booking.payment_status
									)}
									className={`w-4 h-4 rtl:ml-3 ltr:mr-3 ${getPaymentStatusColor(
										booking.payment_status
									)}`}
								/>
								<span className="text-sm font-medium text-gray-700">
									{getTranslation(t, "events.paymentStatus", "Payment Status")}
								</span>
							</div>
							<span
								className={`font-medium ${getPaymentStatusColor(
									booking.payment_status
								)}`}
							>
								{getPaymentStatusLabel(
									booking.payment_status,
									t
								)}
							</span>
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
			</div>

			{/* Action Buttons Section */}
			<div className="space-y-3">
				{/* Invoice Button - Show if invoice is available */}
				{showInvoiceButton && (
					<Button
						onClick={() =>
							window.open(booking.invoice_url, "_blank")
						}
						className="w-full text-green-600 text-sm font-medium h-10 rounded-full bg-white border border-green-300 hover:bg-green-50 transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow"
					>
						<span className="inline-flex justify-center items-center">
							<Icon
								icon="lucide:file-text"
								className="w-4 h-4 rtl:ml-3 ltr:mr-3"
							/>
							{t("events.downloadInvoice")}
						</span>
					</Button>
				)}

				{/* Payment Button - Only show if booking is approved but not paid */}
				{showPaymentButton && (
					<Button
						onClick={onInitiatePayment}
						className="w-full text-white text-sm font-medium h-10 rounded-full bg-[#a797cc] hover:bg-[#e56b00] transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow"
					>
						<span className="inline-flex justify-center items-center">
							<Icon
								icon="lucide:credit-card"
								className="w-4 h-4 rtl:ml-3 ltr:mr-3"
							/>
							{t("events.proceedToPayment")}
						</span>
					</Button>
				)}

				{/* Cancel Button - Show for pending (0) and approved (1) statuses */}
				{showCancelButton && (
					<Button
						onClick={onCancelBooking}
						className={`w-full text-sm font-medium h-10 rounded-full transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow ${
							showPaymentButton || showInvoiceButton
								? "text-red-600 bg-white border border-red-300 hover:bg-red-50"
								: "text-white bg-red-500 hover:bg-red-600"
						}`}
					>
						<span className="inline-flex justify-center items-center">
							<Icon
								icon="lucide:x"
								className="w-4 h-4 rtl:ml-3 ltr:mr-3"
							/>
							{t("events.cancelBooking")}
						</span>
					</Button>
				)}
			</div>
		</div>
	);
}
