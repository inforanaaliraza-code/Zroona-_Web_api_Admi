"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Icon } from "@iconify/react";
import Loader from "@/components/Loader/Loader";

const RefundDetailModal = ({ show, onClose, refundDetail, loading }) => {
  const { t } = useTranslation();

  if (!show) return null;

  const getStatusBadge = (status) => {
    const statusConfig = {
      0: { color: "bg-yellow-100 text-yellow-700 border-yellow-300", label: t("refund.pending") || "Pending" },
      1: { color: "bg-green-100 text-green-700 border-green-300", label: t("refund.approved") || "Approved" },
      2: { color: "bg-red-100 text-red-700 border-red-300", label: t("refund.rejected") || "Rejected" },
      3: { color: "bg-blue-100 text-blue-700 border-blue-300", label: t("refund.processed") || "Processed" },
    };
    
    const config = statusConfig[status] || statusConfig[0];
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {t("refund.detailsTitle") || "Refund Details"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <Icon icon="mdi:close" className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader />
            </div>
          ) : !refundDetail ? (
            <div className="text-center py-12">
              <Icon icon="mdi:alert-circle" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">{t("refund.failedToLoadDetails") || "Failed to load refund details"}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Refund ID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {t("refund.refundId") || "Refund ID"}
                  </p>
                  <p className="text-sm text-gray-900 font-mono break-all">
                    {refundDetail._id || (t("eventTypeLegacy.notAvailable") || "N/A")}
                  </p>
                </div>

                {/* Booking ID */}
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {t("refund.bookingId") || "Booking ID"}
                  </p>
                  <p className="text-sm text-gray-900 font-mono break-all">
                    {refundDetail.booking_id?._id || refundDetail.booking_id || (t("eventTypeLegacy.notAvailable") || "N/A")}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className="bg-gradient-to-r from-[#a797cc] to-[#8ba179] rounded-lg p-4">
                <p className="text-sm font-medium text-white mb-1">
                  {t("refund.amount") || "Amount"}
                </p>
                <p className="text-2xl font-bold text-white">
                  {refundDetail.amount || 0} {refundDetail.currency || t("common.currency") || "SAR"}
                </p>
              </div>

              {/* Reason */}
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  {t("refund.reason") || "Reason"}
                </p>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {refundDetail.refund_reason || t("refund.noReasonProvided") || "No reason provided"}
                </p>
              </div>

              {/* Status */}
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  {t("refund.status") || "Status"}
                </p>
                {getStatusBadge(refundDetail.status)}
              </div>

              {/* Admin Response */}
              {refundDetail.admin_response && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    {t("refund.adminResponse") || "Admin Response"}
                  </p>
                  <p className="text-sm text-gray-900 bg-blue-50 p-3 rounded-lg border border-blue-200">
                    {refundDetail.admin_response}
                  </p>
                </div>
              )}

              {/* Payment Refund ID */}
              {refundDetail.payment_refund_id && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    {t("refund.paymentRefundId") || "Payment Refund ID (Moyasar)"}
                  </p>
                  <p className="text-sm text-gray-900 font-mono bg-gray-50 p-3 rounded-lg break-all">
                    {refundDetail.payment_refund_id}
                  </p>
                </div>
              )}

              {/* Error Message */}
              {refundDetail.refund_error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Icon icon="mdi:alert-circle" className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800 mb-1">
                        {t("refund.error") || "Error"}
                      </p>
                      <p className="text-sm text-red-700">
                        {refundDetail.refund_error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {t("refund.requestDate") || "Request Date"}
                  </p>
                  <p className="text-sm text-gray-900">
                    {refundDetail.createdAt
                      ? format(new Date(refundDetail.createdAt), "MMM dd, yyyy 'at' hh:mm a")
                      : (t("eventTypeLegacy.notAvailable") || "N/A")}
                  </p>
                </div>

                {refundDetail.processed_at && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      {t("refund.processedDate") || "Processed Date"}
                    </p>
                    <p className="text-sm text-gray-900">
                      {format(new Date(refundDetail.processed_at), "MMM dd, yyyy 'at' hh:mm a")}
                    </p>
                  </div>
                )}
              </div>

              {/* User Info (if available) */}
              {refundDetail.user && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    {t("refund.user") || "User"}
                  </p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-900">
                      {refundDetail.user.first_name && refundDetail.user.last_name
                        ? `${refundDetail.user.first_name} ${refundDetail.user.last_name}`
                        : refundDetail.user.email || (t("eventTypeLegacy.notAvailable") || "N/A")}
                    </p>
                    {refundDetail.user.email && (
                      <p className="text-xs text-gray-500 mt-1">{refundDetail.user.email}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {t("common.close") || "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundDetailModal;
