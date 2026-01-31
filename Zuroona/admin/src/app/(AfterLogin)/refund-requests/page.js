"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Loader from "@/components/Loader/Loader";
import Paginations from "@/components/Paginations/Pagination";
import { toast } from "react-toastify";
import { FaFileExcel, FaPrint, FaCheckCircle, FaTimesCircle, FaEye } from "react-icons/fa";
import RefundActionModal from "@/components/Modals/RefundActionModal";
import RefundDetailModal from "@/components/Modals/RefundDetailModal";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import {
  fetchRefunds,
  fetchRefundDetail,
  updateRefundStatus,
  setSearch,
  setPage,
  setStatusFilter,
  clearRefundDetail,
} from "@/redux/slices/refundSlice";
import { useState } from "react";

export default function RefundRequests() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  // Redux state
  const {
    refunds,
    refundDetail,
    loading,
    detailLoading,
    updating,
    error,
    detailError,
    totalCount,
    filters,
  } = useSelector((state) => state.refund);

  // Local state for modals
  const [showModal, setShowModal] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [actionType, setActionType] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [itemsPerPage] = useState(10);

  // Fetch refunds when filters change
  useEffect(() => {
    const queryParams = {
      page: filters.page,
      limit: itemsPerPage,
      ...(filters.search && { search: filters.search }),
      ...(filters.status !== "all" && {
        status:
          filters.status === "pending"
            ? 0
            : filters.status === "approved"
            ? 1
            : filters.status === "rejected"
            ? 2
            : filters.status === "processed"
            ? 3
            : undefined,
      }),
    };
    dispatch(fetchRefunds(queryParams));
  }, [dispatch, filters.page, filters.search, filters.status, itemsPerPage]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (detailError) {
      toast.error(detailError);
    }
  }, [detailError]);

  const handleApprove = (refund) => {
    setSelectedRefund(refund);
    setActionType("approve");
    setShowModal(true);
  };

  const handleReject = (refund) => {
    setSelectedRefund(refund);
    setActionType("reject");
    setShowModal(true);
  };

  const handleViewDetail = async (refund) => {
    setShowDetailModal(true);
    dispatch(fetchRefundDetail(refund._id));
  };

  const handleConfirm = async (formData) => {
    if (!selectedRefund || !selectedRefund._id) {
      toast.error("Refund selection is invalid. Please try again.");
      return;
    }

    const status = actionType === "approve" ? 1 : 2;
    const result = await dispatch(
      updateRefundStatus({
        refundId: selectedRefund._id,
        status,
        adminResponse: formData.admin_response,
        paymentRefundId: formData.payment_refund_id,
      })
    );

    if (updateRefundStatus.fulfilled.match(result)) {
      toast.success(
        actionType === "approve"
          ? t("refund.refundApprovedSuccess")
          : t("refund.refundRejectedSuccess")
      );
      setShowModal(false);
      setSelectedRefund(null);
      // Refetch refunds
      const queryParams = {
        page: filters.page,
        limit: itemsPerPage,
        ...(filters.search && { search: filters.search }),
        ...(filters.status !== "all" && {
          status:
            filters.status === "pending"
              ? 0
              : filters.status === "approved"
              ? 1
              : filters.status === "rejected"
              ? 2
              : filters.status === "processed"
              ? 3
              : undefined,
        }),
      };
      dispatch(fetchRefunds(queryParams));
    } else {
      toast.error(result.payload || t("refund.failedToUpdate"));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 0:
        return (
          <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
            {t("refund.pending")}
          </span>
        );
      case 1:
        return (
          <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
            {t("refund.approved")}
          </span>
        );
      case 2:
        return (
          <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
            {t("refund.rejected")}
          </span>
        );
      case 3:
        return (
          <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
            {t("refund.processed") || "Processed"}
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">
            {t("common.unknown") || "Unknown"}
          </span>
        );
    }
  };

  const exportToCSV = () => {
    const headers = [
      t("refund.refundId"),
      t("refund.bookingId"),
      t("refund.user"),
      t("refund.amount"),
      t("refund.reason"),
      t("refund.status"),
      t("refund.requestDate"),
    ];
    const csvContent = [
      headers.join(","),
      ...refunds.map((refund) =>
        [
          refund._id,
          refund.booking_id,
          refund.user?.email || "N/A",
          refund.amount,
          `"${(refund.refund_reason || "").replace(/"/g, '""')}"`,
          refund.status === 0
            ? t("refund.pending")
            : refund.status === 1
            ? t("refund.approved")
            : refund.status === 2
            ? t("refund.rejected")
            : refund.status === 3
            ? t("refund.processed") || "Processed"
            : t("common.unknown") || "Unknown",
          refund.createdAt
            ? format(new Date(refund.createdAt), "yyyy-MM-dd")
            : "N/A",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `refund-requests-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DefaultLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t("refund.title")}</h1>
          <p className="mt-1 text-sm text-gray-600">{t("refund.description")}</p>
        </div>

        {/* Filters and Actions */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder={t("refund.searchPlaceholder")}
              value={filters.search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filters.status}
              onChange={(e) => dispatch(setStatusFilter(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t("refund.allStatus")}</option>
              <option value="pending">{t("refund.pending")}</option>
              <option value="approved">{t("refund.approved")}</option>
              <option value="rejected">{t("refund.rejected")}</option>
              <option value="processed">{t("refund.processed") || "Processed"}</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FaFileExcel className="text-green-600" />
              {t("refund.exportCSV")}
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FaPrint />
              {t("refund.print")}
            </button>
          </div>
        </div>

        {/* Refunds Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : refunds.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">{t("refund.noRefundsFound")}</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("refund.refundId")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("refund.bookingId")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("refund.user")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("refund.amount")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("refund.reason")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("refund.status")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("refund.requestDate")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("refund.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {refunds.map((refund) => (
                    <tr key={refund._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {refund._id?.slice(-8) || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {refund.booking_id?.slice(-8) || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {refund.user?.email || refund.user_id || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {refund.amount || 0} {refund.currency || "SAR"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {refund.refund_reason || t("refund.noReasonProvided")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(refund.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {refund.createdAt
                          ? format(new Date(refund.createdAt), "MMM dd, yyyy")
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetail(refund)}
                            className="text-blue-600 hover:text-blue-900"
                            title={t("refund.viewDetails")}
                          >
                            <FaEye />
                          </button>
                          {refund.status === 0 && (
                            <>
                              <button
                                onClick={() => handleApprove(refund)}
                                className="text-green-600 hover:text-green-900"
                                title={t("refund.approve")}
                                disabled={updating}
                              >
                                <FaCheckCircle />
                              </button>
                              <button
                                onClick={() => handleReject(refund)}
                                className="text-red-600 hover:text-red-900"
                                title={t("refund.reject")}
                                disabled={updating}
                              >
                                <FaTimesCircle />
                              </button>
                            </>
                          )}
                          {refund.status === 1 && (
                            <span
                              className="text-xs text-gray-500"
                              title={
                                t("refund.approvedWaitingProcess") ||
                                "Approved - awaiting processing"
                              }
                            >
                              {t("refund.approved")}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              <Paginations
                handlePage={(page) => dispatch(setPage(page))}
                page={filters.page}
                total={totalCount}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </div>
        )}

        {/* Refund Action Modal */}
        <RefundActionModal
          show={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedRefund(null);
          }}
          onConfirm={handleConfirm}
          actionType={actionType}
          refund={selectedRefund}
          loading={updating}
        />

        {/* Refund Detail Modal */}
        <RefundDetailModal
          show={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            dispatch(clearRefundDetail());
          }}
          refundDetail={refundDetail}
          loading={detailLoading}
        />
      </div>
    </DefaultLayout>
  );
}
