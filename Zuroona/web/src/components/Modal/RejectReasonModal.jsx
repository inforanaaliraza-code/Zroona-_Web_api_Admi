"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { useRTL } from "@/utils/rtl";

export default function RejectReasonModal({ isOpen, onClose, onConfirm, guestName, eventName, isLoading = false }) {
  const { t } = useTranslation();
  const { isRTL, textAlign, flexDirection } = useRTL();
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [selectedReason, setSelectedReason] = useState("");

  // Predefined rejection reasons
  const predefinedReasons = [
    { id: "capacity", label: t("rejectReason.capacityFull"), icon: "lucide:users-x" },
    { id: "requirements", label: t("rejectReason.requirementsNotMet"), icon: "lucide:file-x" },
    { id: "timing", label: t("rejectReason.timingIssue"), icon: "lucide:clock-x" },
    { id: "other", label: t("rejectReason.other"), icon: "lucide:more-horizontal" },
  ];

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setError("");
      setSelectedReason("");
    }
  }, [isOpen]);

  const handleReasonSelect = (reasonId) => {
    setSelectedReason(reasonId);
    setError("");
    
    // Set default text for predefined reasons
    if (reasonId !== "other") {
      const selected = predefinedReasons.find(r => r.id === reasonId);
      setReason(selected?.label || "");
    } else {
      setReason("");
    }
  };

  const handleConfirm = () => {
    // Validate reason
    if (!reason || reason.trim().length < 10) {
      setError(t("rejectReason.minLengthError"));
      return;
    }

    onConfirm(reason.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Premium Header with Gradient */}
        <div className="relative bg-gradient-to-r from-red-500 via-red-600 to-orange-600 p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <Icon icon="lucide:alert-circle" className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {t("rejectReason.title")}
                </h3>
                <p className="text-white/90 text-sm mt-1">
                  {t("rejectReason.subtitle")}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
            >
              <Icon icon="lucide:x" className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Guest & Event Info */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Icon icon="lucide:user" className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">
                  {t("rejectReason.guest")}
                </p>
                <p className="font-semibold text-gray-900">{guestName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 mt-3 pt-3 border-t border-gray-200">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Icon icon="lucide:calendar" className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">
                  {t("rejectReason.event")}
                </p>
                <p className="font-semibold text-gray-900">{eventName}</p>
              </div>
            </div>
          </div>

          {/* Predefined Reasons */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              {t("rejectReason.selectReason")}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {predefinedReasons.map((predefined) => (
                <button
                  key={predefined.id}
                  onClick={() => handleReasonSelect(predefined.id)}
                  disabled={isLoading}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    selectedReason === predefined.id
                      ? "border-red-500 bg-red-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      selectedReason === predefined.id
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      <Icon icon={predefined.icon} className="w-5 h-5" />
                    </div>
                    <span className={`text-sm font-medium ${
                      selectedReason === predefined.id
                        ? "text-red-700"
                        : "text-gray-700"
                    }`}>
                      {predefined.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Reason Textarea */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("rejectReason.reasonLabel")} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError("");
              }}
              disabled={isLoading}
              rows={5}
              placeholder={t("rejectReason.placeholder")}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 resize-none focus:outline-none focus:ring-2 ${
                error
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 focus:border-red-500 focus:ring-red-500/20"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            <div className="flex items-center justify-between mt-2">
              {error && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <Icon icon="lucide:alert-circle" className="w-4 h-4" />
                  {error}
                </p>
              )}
              <p className={`text-xs ml-auto ${reason.length < 10 ? "text-gray-500" : "text-green-600"}`}>
                {reason.length}/10 {t("rejectReason.characters")}
              </p>
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
            <Icon icon="lucide:info" className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-900">
                {t("rejectReason.warningTitle")}
              </p>
              <p className="text-xs text-orange-700 mt-1">
                {t("rejectReason.warningMessage")}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("rejectReason.cancel")}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || !reason || reason.trim().length < 10}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Icon icon="lucide:loader-2" className="w-5 h-5 animate-spin" />
                {t("rejectReason.processing")}
              </>
            ) : (
              <>
                <Icon icon="lucide:x-circle" className="w-5 h-5" />
                {t("rejectReason.confirmReject")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}











