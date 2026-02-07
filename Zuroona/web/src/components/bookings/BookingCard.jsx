"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip-shadcn";
import { Badge } from "@/components/ui/badge";
import EventPlaceholder from "@/components/ui/EventPlaceholder";
import InvoiceCard from "@/components/Invoice/InvoiceCard";
import { useRTL } from "@/utils/rtl";
import { format } from "date-fns";

const BookingCard = ({ booking, onCancelBooking, isRTL }) => {
  const { t } = useTranslation();
  const { textAlign, flexDirection, marginStart, marginEnd } = useRTL();

  // Status configuration
  const statusConfig = {
    1: { 
      color: "bg-yellow-100 text-yellow-800 border-yellow-300", 
      icon: "lucide:clock",
      label: t("events.waitingByHost") || t("events.pending") || "Pending"
    },
    2: { 
      color: "bg-green-100 text-green-800 border-green-300", 
      icon: "lucide:check-circle-2",
      label: t("events.approved") || "Approved"
    },
    3: { 
      color: "bg-red-100 text-red-800 border-red-300", 
      icon: "lucide:x-circle",
      label: t("events.cancelled") || "Cancelled"
    },




    4: { 
      color: "bg-gray-100 text-gray-800 border-gray-300", 
      icon: "lucide:x",
      label: t("events.rejected") || "Rejected"
    },
  };





  // Format helpers
  const formatDate = (dateString) => {
    if (!dateString) return t("events.dateNotAvailable") || t("common.notAvailable") || "N/A";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    try {
      const time = new Date(`2000-01-01T${timeString}`);
      return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return timeString;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return t("common.notAvailable") || "N/A";
    return `${amount.toLocaleString()} ${t("common.currency") || "SAR"}`;
  };

  // Check if event is upcoming
  const eventDate = new Date(booking.event?.event_date || 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isUpcoming = eventDate >= today;

  const status = statusConfig[booking.status] || statusConfig[1];
  const showInvoice = booking.status === 2 && booking.payment_status === 1 && booking.invoice_url;
  const showGroupChat = booking.status === 2 && booking.payment_status === 1 && booking.event?._id;
  const showPayment = booking.status === 2 && !booking.payment_status;
  const showCancel = (booking.status === 1 || booking.status === 2) && booking.status !== 3;
  const showRefundRequest = booking.status === 3 && booking.payment_status === 1 && !booking.refund_request_id;
  const showViewRefund = booking.refund_request_id;

  return (
    <TooltipProvider>
      <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-[#a797cc]/30 overflow-hidden">
        {/* Image Section */}
        <div className="relative h-56 overflow-hidden">
          <EventPlaceholder
            src={booking.event?.event_images?.[0] || booking.event?.event_image}
            alt={booking.event?.event_name || t("events.event") || "Event"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Status Badge */}
          <div className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} z-10`}>
            <Badge 
              variant="outline" 
              className={`${status.color} border-2 shadow-lg backdrop-blur-sm`}
            >
              <Icon icon={status.icon} className={`${marginEnd(1)} h-3.5 w-3.5`} />
              {status.label}
            </Badge>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>

        <CardHeader className="pb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-[#a797cc] transition-colors">
            {booking.event?.event_name || t("events.eventNotAvailable") || "Event not available"}
          </h3>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-sm">
            <Icon icon="lucide:calendar" className="h-4 w-4 text-[#a797cc] flex-shrink-0" />
            <span className="text-gray-700 font-medium">
              {formatDate(booking.event?.event_date)}
            </span>
            {(booking.event?.event_start_time || booking.event_start_time) && (
              <>
                <span className="text-gray-400">•</span>
                <Icon icon="lucide:clock" className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">
                  {formatTime(booking.event?.event_start_time || booking.event_start_time)}
                  {(booking.event?.event_end_time || booking.event_end_time) && 
                    ` - ${formatTime(booking.event?.event_end_time || booking.event_end_time)}`
                  }
                </span>
              </>
            )}
          </div>

          {/* Location */}
          {(booking.event?.event_address || booking.event_address) && (
            <div className="flex items-start gap-2 text-sm">
              <Icon icon="lucide:map-pin" className="h-4 w-4 text-[#a797cc] flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 line-clamp-2">
                {booking.event?.event_address || booking.event_address}
              </span>
            </div>
          )}

          {/* Organizer */}
          {(booking.organizer?.first_name || booking.event?.organizer?.first_name) && (
            <div className="flex items-center gap-2 text-sm">
              <Icon icon="lucide:user" className="h-4 w-4 text-[#a797cc] flex-shrink-0" />
              <span className="text-gray-600">
                {t("events.organizer") || "Organizer"}:{" "}
                {booking.organizer?.first_name || booking.event?.organizer?.first_name || ""}{" "}
                {booking.organizer?.last_name || booking.event?.organizer?.last_name || ""}
              </span>
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:users" className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">{t("events.attendees") || "Attendees"}</p>
                <p className="text-sm font-semibold text-gray-900">{booking.attendees || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="lucide:dollar-sign" className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">{t("events.totalAmount") || "Total"}</p>
                <p className="text-sm font-semibold text-[#a797cc]">{formatCurrency(booking.total_amount)}</p>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Icon 
                icon={booking.payment_status ? "lucide:check-circle-2" : "lucide:clock"} 
                className={`h-4 w-4 ${booking.payment_status ? "text-green-600" : "text-yellow-600"}`} 
              />
              <span className="text-sm text-gray-600">
                {booking.payment_status 
                  ? t("events.paid") || "Paid" 
                  : t("events.unpaid") || "Unpaid"}
              </span>
            </div>
            <Badge 
              variant={booking.payment_status ? "default" : "secondary"}
              className={booking.payment_status 
                ? "bg-green-100 text-green-700 border-green-300" 
                : "bg-yellow-100 text-yellow-700 border-yellow-300"}
            >
              {booking.payment_status ? t("events.paid") || "Paid" : t("events.unpaid") || "Unpaid"}
            </Badge>
          </div>

          {/* Invoice Card */}
          {showInvoice && (
            <div className="mt-4">
              <InvoiceCard booking={booking} />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-4 border-t">
          {/* Primary Actions */}
          <div className="flex gap-2 w-full">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1"
                  asChild
                >
                  <Link href={`/events/${booking.event?._id}`}>
                    <Icon icon="lucide:eye" className={`h-4 w-4 ${marginEnd(2)}`} />
                    {t("events.viewDetails") || "View Details"}
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("events.viewDetailsTooltip") || "View full event details"}</p>
              </TooltipContent>
            </Tooltip>

            {showGroupChat && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    asChild
                  >
                    <Link href={`/messaging?event_id=${booking.event._id}`}>
                      <Icon icon="lucide:message-circle" className={`h-4 w-4 ${marginEnd(2)}`} />
                      {t("events.openGroupChat") || "Group Chat"}
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("events.groupChatTooltip") || "Join group chat with other attendees"}</p>
                </TooltipContent>
              </Tooltip>
            )}

            {showPayment && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    className="flex-1 bg-gradient-to-r from-[#a797cc] to-[#8ba179] hover:shadow-lg"
                    asChild
                  >
                    <Link href={`/events/${booking.event?._id}?initiate_payment=true`}>
                      <Icon icon="lucide:credit-card" className={`h-4 w-4 ${marginEnd(2)}`} />
                      {t("events.proceedToPayment") || "Pay Now"}
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("events.paymentTooltip") || "Complete your payment to confirm booking"}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Secondary Actions */}
          <div className="flex gap-2 w-full">
            {showCancel && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => onCancelBooking(booking._id)}
                  >
                    <Icon icon="lucide:x-circle" className={`h-4 w-4 ${marginEnd(2)}`} />
                    {t("events.cancelBooking") || "Cancel"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("events.cancelTooltip") || "Cancel this booking"}</p>
                </TooltipContent>
              </Tooltip>
            )}

            {showRefundRequest && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50"
                    asChild
                  >
                    <Link href={`/refunds/request?booking_id=${booking._id}`}>
                      <Icon icon="lucide:receipt-refund" className={`h-4 w-4 ${marginEnd(2)}`} />
                      {t("events.requestRefund") || "Request Refund"}
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("events.refundRequestTooltip") || "Request refund for cancelled booking"}</p>
                </TooltipContent>
              </Tooltip>
            )}

            {showViewRefund && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                    asChild
                  >
                    <Link href={`/refunds/${booking.refund_request_id}`}>
                      <Icon icon="lucide:receipt" className={`h-4 w-4 ${marginEnd(2)}`} />
                      {t("events.viewRefund") || "View Refund"}
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("events.viewRefundTooltip") || "View refund request status"}</p>
                </TooltipContent>
              </Tooltip>
            )}

            {showInvoice && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
                    asChild
                  >
                    <a href={booking.invoice_url} target="_blank" rel="noopener noreferrer">
                      <Icon icon="lucide:file-text" className={`h-4 w-4 ${marginEnd(2)}`} />
                      {t("events.downloadInvoice") || "Invoice"}
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("events.invoiceTooltip") || "Download payment invoice"}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};

export default BookingCard;
