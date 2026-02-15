"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function RefundActionModal({ show, onClose, onConfirm, actionType, refund, loading = false }) {
  const { t } = useTranslation();
  const [adminResponse, setAdminResponse] = useState("");
  const [paymentRefundId, setPaymentRefundId] = useState("");

  const handleConfirm = () => {
    onConfirm({
      admin_response: adminResponse.trim() || undefined,
      payment_refund_id: paymentRefundId.trim() || undefined,
    });
    // Reset after confirmation
    setAdminResponse("");
    setPaymentRefundId("");
  };

  const handleClose = () => {
    // Reset on close
    setAdminResponse("");
    setPaymentRefundId("");
    onClose();
  };

  const isApproving = actionType === "approve";
  const title = isApproving ? t("refund.approveTitle") || "Approve Refund Request" : t("refund.rejectTitle") || "Reject Refund Request";
  const message = isApproving 
    ? t("refund.approveMessage") || "Are you sure you want to approve this refund request?" 
    : t("refund.rejectMessage") || "Are you sure you want to reject this refund request?";

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[10000] ${show ? '' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-800 mb-4">{message}</p>
        
        {/* Refund Details */}
        {refund && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">{t("refund.amount")}:</span> {refund.amount || 0} {refund.currency || "SAR"}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">{t("refund.bookingId")}:</span> {refund.booking_id?.slice(-8) || (t("eventTypeLegacy.notAvailable") || "N/A")}
            </p>
          </div>
        )}

        {/* Admin Response */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("refund.adminResponse") || "Admin Response"} {isApproving ? "" : <span className="text-red-500">*</span>}
          </label>
          <textarea
            value={adminResponse}
            onChange={(e) => setAdminResponse(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:border-transparent"
            rows="3"
            placeholder={isApproving 
              ? t("refund.adminResponsePlaceholder") || "Optional: Add a response message" 
              : t("refund.rejectionReasonPlaceholder") || "Please provide a reason for rejection"}
            required={!isApproving}
          />
        </div>

        {/* Payment Refund ID - Only for approval */}
        {isApproving && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("refund.paymentRefundId") || "Payment Refund ID (from Moyasar)"}
            </label>
            <input
              type="text"
              value={paymentRefundId}
              onChange={(e) => setPaymentRefundId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:border-transparent"
              placeholder={t("refund.paymentRefundIdPlaceholder") || "Optional: Moyasar refund transaction ID"}
            />
            <p className="mt-1 text-xs text-gray-500">
              {t("refund.paymentRefundIdNote") || "Leave empty if refund will be processed manually"}
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 rounded-lg text-gray-900 hover:bg-gray-400 transition"
          >
            {t("common.cancel")}
          </button>
          <button
            className={`px-4 py-2 text-white rounded-lg transition ${
              isApproving 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-red-600 hover:bg-red-700"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleConfirm}
            disabled={loading || (!isApproving && !adminResponse.trim())}
          >
            {loading
              ? (t("common.loading") || "Processing...")
              : isApproving
              ? (t("refund.approve") || "Approve")
              : (t("refund.reject") || "Reject")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RefundActionModal;
