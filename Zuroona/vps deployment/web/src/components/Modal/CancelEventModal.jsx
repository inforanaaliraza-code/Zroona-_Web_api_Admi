"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { useRTL } from "@/utils/rtl";

export default function CancelEventModal({
  show = false,
  eventName = "",
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(reason);
    setReason("");
  };

  const handleClose = () => {
    setReason("");
    onCancel();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all relative z-50 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Website Color Scheme */}
          <div className="bg-gradient-to-r from-[#a797cc] via-[#9688b8] to-[#8ba179] px-6 py-6 relative">
            {/* Decorative Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMSIgY3g9IjIwIiBjeT0iMjAiIHI9IjMiLz48L2c+PC9zdmc+')] opacity-30"></div>
            <div className="flex items-center gap-4 relative">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                <Icon icon="lucide:calendar-x" className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {t("events.cancelEvent", "Cancel Event")}
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  {t("events.thisActionWillCancelEvent", "This action will cancel the event")}
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Event Name Display - Website Colors */}
            <div className="bg-gradient-to-r from-purple-50 to-green-50 border border-[#a797cc]/30 rounded-xl p-4">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Icon icon="lucide:calendar" className="w-4 h-4 text-[#a797cc]" />
                {t("events.eventName", "Event Name")}:
              </p>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {eventName}
              </p>
            </div>

            {/* Warning Message - Amber/Warning Color */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 bg-amber-100 rounded-lg p-2">
                  <Icon icon="lucide:alert-triangle" className="h-5 w-5 text-amber-600" />
                </div>
                <div className="text-sm text-amber-900">
                  <p className="font-bold mb-2">
                    {t("events.warningCancellation", "Important Notice")}:
                  </p>
                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-2">
                      <Icon icon="lucide:undo-2" className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>{t("events.refundWillBeIssued", "Refunds will be issued to all guests")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon icon="lucide:wallet" className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>{t("events.amountWillBeDeducted", "Amount will be deducted from your wallet")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon icon="lucide:bell" className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>{t("events.guestsWillBeNotified", "All guests will be notified")}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Reason Input - Website Colors */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Icon icon="lucide:message-square" className="w-4 h-4 text-[#a797cc]" />
                {t("events.cancellationReason", "Cancellation Reason")}
                <span className="text-gray-400 font-normal text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                  {t("common.optional", "Optional")}
                </span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t(
                  "events.reasonPlaceholder",
                  "Tell us why you're cancelling this event..."
                )}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#a797cc]/20 focus:border-[#a797cc] resize-vertical min-h-24 transition-all hover:border-[#a797cc]/50"
                maxLength={500}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-400 mt-1.5 flex items-center justify-between">
                <span>{reason.length}/500 characters</span>
              </p>
            </div>
          </div>

          {/* Footer - Enhanced */}
          <div className={`px-6 py-5 bg-gray-50 border-t border-gray-100 flex gap-3 ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-5 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Icon icon="lucide:arrow-left" className="h-4 w-4" />
              {t("common.goBack", "Go Back")}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 px-5 py-3 bg-gradient-to-r from-[#a797cc] to-[#8ba179] text-white rounded-xl font-semibold hover:from-[#9688b8] hover:to-[#7a9168] transition-all shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>{t("common.processing", "Processing...")}</span>
                </>
              ) : (
                <>
                  <Icon icon="lucide:calendar-x" className="h-4 w-4" />
                  <span>{t("events.confirmCancel2", "Cancel Event")}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
