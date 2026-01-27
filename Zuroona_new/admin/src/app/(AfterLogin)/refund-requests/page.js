"use client";

import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Loader from "@/components/Loader/Loader";
import Paginations from "@/components/Paginations/Pagination";
import { toast } from "react-toastify";
import { FaFileExcel, FaPrint, FaCheckCircle, FaTimesCircle, FaEye } from "react-icons/fa";
import RefundActionModal from "@/components/Modals/RefundActionModal";
import { GetRefundListApi, UpdateRefundStatusApi, GetRefundDetailApi } from "@/api/setting";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

export default function RefundRequests() {
  const { t } = useTranslation();
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [actionType, setActionType] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [refundDetail, setRefundDetail] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all"); // all, pending, approved, rejected

  useEffect(() => {
    fetchRefunds();
  }, [page, search, statusFilter]);

  const fetchRefunds = async () => {
    setLoading(true);
    try {
      const queryParams = {
        page,
        limit: itemsPerPage,
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter === "pending" ? 0 : statusFilter === "approved" ? 1 : statusFilter === "rejected" ? 2 : statusFilter === "processed" ? 3 : undefined }),
      };
      const res = await GetRefundListApi(queryParams);
      console.log("[REFUND:ADMIN] API Response:", res);
      if (res?.status === 1 || res?.code === 200) {
        const refundData = res?.data?.refunds || res?.data || [];
        console.log("[REFUND:ADMIN] Refund Data:", refundData);
        console.log("[REFUND:ADMIN] Total Count:", res?.total_count);
        setRefunds(refundData);
        setTotalCount(res?.total_count || refundData.length);
      } else {
        console.error("[REFUND:ADMIN] API Error Response:", res);
      }
    } catch (error) {
      console.error("Error fetching refund requests:", error);
      toast.error(t("refund.failedToFetch"));
    } finally {
      setLoading(false);
    }
  };

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
    try {
      setLoading(true);
      const res = await GetRefundDetailApi({ refund_id: refund._id });
      if (res?.status === 1) {
        setRefundDetail(res.data);
        setShowDetailModal(true);
      } else {
        toast.error(res?.message || t("refund.failedToLoadDetails"));
      }
    } catch (error) {
      console.error("Error fetching refund detail:", error);
      toast.error(t("refund.failedToLoadDetails"));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (formData) => {
    setLoading(true);
    try {
      const status = actionType === "approve" ? 1 : 2; // 1=approved, 2=rejected
      const payload = {
        refund_id: selectedRefund._id,
        status: status,
        ...(formData.admin_response && { admin_response: formData.admin_response }),
        ...(formData.payment_refund_id && { payment_refund_id: formData.payment_refund_id }),
      };
      
      const res = await UpdateRefundStatusApi(payload);
      
      if (res?.status === 1 || res?.code === 200) {
        toast.success(actionType === "approve" ? t("refund.refundApprovedSuccess") : t("refund.refundRejectedSuccess"));
        setShowModal(false);
        setSelectedRefund(null);
        fetchRefunds();
      } else {
        toast.error(res?.message || t("refund.failedToUpdate"));
      }
    } catch (error) {
      console.error("Error updating refund request:", error);
      toast.error(error.response?.data?.message || t("refund.failedToUpdate"));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 0:
        return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">{t("refund.pending")}</span>;
      case 1:
        return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">{t("refund.approved")}</span>;
      case 2:
        return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">{t("refund.rejected")}</span>;
      case 3:
        return <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">{t("refund.processed") || "Processed"}</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">{t("common.unknown")}</span>;
    }
  };

  const exportToCSV = () => {
    const headers = [t("refund.refundId"), t("refund.bookingId"), t("refund.user"), t("refund.amount"), t("refund.reason"), t("refund.status"), t("refund.requestDate")];
    const csvContent = [
      headers.join(","),
      ...refunds.map(refund => [
        refund._id,
        refund.booking_id,
        refund.user?.email || "N/A",
        refund.amount,
        `"${(refund.refund_reason || "").replace(/"/g, '""')}"`,
        refund.status === 0 ? t("refund.pending") : refund.status === 1 ? t("refund.approved") : refund.status === 2 ? t("refund.rejected") : refund.status === 3 ? (t("refund.processed") || "Processed") : t("common.unknown"),
        refund.createdAt ? format(new Date(refund.createdAt), "yyyy-MM-dd") : "N/A"
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `refund-requests-${new Date().toISOString().split('T')[0]}.csv`);
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t("refund.allStatus")}</option>
              <option value="pending">{t("refund.pending")}</option>
              <option value="approved">{t("refund.approved")}</option>
              <option value="rejected">{t("refund.rejected")}</option>
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(refund.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {refund.createdAt ? format(new Date(refund.createdAt), "MMM dd, yyyy") : "N/A"}
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
                              >
                                <FaCheckCircle />
                              </button>
                              <button
                                onClick={() => handleReject(refund)}
                                className="text-red-600 hover:text-red-900"
                                title={t("refund.reject")}
                              >
                                <FaTimesCircle />
                              </button>
                            </>
                          )}
                          {refund.status === 1 && (
                            <span className="text-xs text-gray-500" title={t("refund.approvedWaitingProcess") || "Approved - awaiting processing"}>
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
                handlePage={setPage}
                page={page}
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
        />

        {/* Detail Modal */}
        {showDetailModal && refundDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{t("refund.detailsTitle")}</h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t("refund.refundId")}</p>
                    <p className="text-sm text-gray-900">{refundDetail._id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t("refund.bookingId")}</p>
                    <p className="text-sm text-gray-900">{refundDetail.booking_id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t("refund.amount")}</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {refundDetail.amount} {refundDetail.currency || "SAR"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t("refund.reason")}</p>
                    <p className="text-sm text-gray-900">{refundDetail.refund_reason || t("refund.noReasonProvided")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t("refund.status")}</p>
                    {getStatusBadge(refundDetail.status)}
                  </div>
                  {refundDetail.admin_response && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">{t("refund.adminResponse") || "Admin Response"}</p>
                      <p className="text-sm text-gray-900">{refundDetail.admin_response}</p>
                    </div>
                  )}
                  {refundDetail.payment_refund_id && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">{t("refund.paymentRefundId") || "Payment Refund ID"}</p>
                      <p className="text-sm text-gray-900 font-mono">{refundDetail.payment_refund_id}</p>
                    </div>
                  )}
                  {refundDetail.refund_error && (
                    <div>
                      <p className="text-sm font-medium text-red-500">{t("refund.error")}</p>
                      <p className="text-sm text-red-600">{refundDetail.refund_error}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t("refund.requestDate")}</p>
                    <p className="text-sm text-gray-900">
                      {refundDetail.createdAt ? format(new Date(refundDetail.createdAt), "MMM dd, yyyy 'at' hh:mm a") : "N/A"}
                    </p>
                  </div>
                  {refundDetail.processed_at && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">{t("refund.processedDate") || "Processed Date"}</p>
                      <p className="text-sm text-gray-900">
                        {format(new Date(refundDetail.processed_at), "MMM dd, yyyy 'at' hh:mm a")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}

