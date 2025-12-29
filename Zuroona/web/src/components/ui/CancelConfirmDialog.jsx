"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { useRTL } from "@/utils/rtl";

export default function CancelConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading,
  type = "booking", // "booking" for guest, "event" for host
  showRefundWarning = false, // Show refund warning for guest cancellations
}) {
  const { t } = useTranslation();
  const { isRTL, textAlign, flexDirection } = useRTL();
  const [reason, setReason] = useState("");
  const [showReasonInput, setShowReasonInput] = useState(false);

  // Reset reason when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setReason("");
      setShowReasonInput(false);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (type === "event" && !showReasonInput) {
      // For event cancellation, first show reason input
      setShowReasonInput(true);
      return;
    }
    // Call onConfirm with reason
    onConfirm(reason);
  };

  const title = type === "event" 
    ? t("eventsCancellation.cancelEventTitle")
    : t("eventsCancellation.cancelBookingTitle");
  
  const description = type === "event"
    ? t("eventsCancellation.cancelEventDescription")
    : t("eventsCancellation.cancelBookingDescription");

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />
        <Dialog.Content className={`fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white p-6 shadow-xl transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] z-50`}>
          <div className={`flex flex-col items-center text-center ${textAlign}`}>
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <Icon icon="lucide:alert-triangle" className="w-8 h-8 text-red-500" />
            </div>
            
            <Dialog.Title className="text-xl font-semibold text-gray-900 mb-2">
              {title}
            </Dialog.Title>
            
            <Dialog.Description className={`text-sm text-gray-600 mb-4 ${textAlign}`}>
              {description}
            </Dialog.Description>

            {showRefundWarning && type === "booking" && (
              <div className={`w-full p-3 mb-4 bg-yellow-50 border border-yellow-200 rounded-lg ${textAlign}`}>
                <p className="text-sm text-yellow-800">
                  {t("eventsCancellation.refundWarning")}
                </p>
              </div>
            )}

            {showReasonInput && (
              <div className="w-full mb-4">
                <label className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}>
                  {t("eventsCancellation.cancelReason")} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={t("eventsCancellation.enterCancelReason")}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none ${textAlign}`}
                  rows={4}
                  required
                />
              </div>
            )}
            
            <div className={`flex gap-3 w-full ${flexDirection}`}>
              <Button
                onClick={showReasonInput ? () => setShowReasonInput(false) : onClose}
                className="flex-1 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                {showReasonInput 
                  ? (t("eventsCancellation.back") || t("events.back") || "Back")
                  : (t("eventsCancellation.keepBooking") || t("events.keepBooking") || "Keep Booking")}
              </Button>
              
              <Button
                onClick={handleConfirm}
                disabled={isLoading || (type === "event" && showReasonInput && !reason.trim())}
                className="flex-1 h-10 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
                ) : (
                  showReasonInput 
                    ? (t("eventsCancellation.continue") || t("events.continue") || "Continue")
                    : (t("eventsCancellation.confirmCancel") || t("events.confirmCancel") || "Yes, Cancel")
                )}
              </Button>
            </div>
          </div>
          
          <Dialog.Close asChild>
            <button
              className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} inline-flex items-center justify-center rounded-full w-8 h-8 text-gray-500 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2`}
              aria-label="Close"
            >
              <Icon icon="lucide:x" className="w-4 h-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
