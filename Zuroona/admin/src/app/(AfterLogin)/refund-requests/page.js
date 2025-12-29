"use client";

import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Loader from "@/components/Loader/Loader";
import Paginations from "@/components/Paginations/Pagination";
import { toast } from "react-toastify";
import { FaFileExcel, FaPrint, FaCheckCircle, FaTimesCircle, FaEye } from "react-icons/fa";
import ApprovalModal from "@/components/Modals/ApprovalModal";
import { GetRefundListApi, UpdateRefundStatusApi, GetRefundDetailApi } from "@/api/setting";
import { format } from "date-fns";

export default function RefundRequests() {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
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
        ...(statusFilter !== "all" && { status: statusFilter === "pending" ? 0 : statusFilter === "approved" ? 1 : 2 }),
      };
      const res = await GetRefundListApi(queryParams);
      if (res?.status === 1 || res?.code === 200) {
        const refundData = res?.data?.refunds || res?.data || [];
        setRefunds(refundData);
      }
    } catch (error) {
      console.error("Error fetching refund requests:", error);
      toast.error("Failed to fetch refund requests");
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
        toast.error(res?.message || "Failed to load refund details");
      }
    } catch (error) {
      console.error("Error fetching refund detail:", error);
      toast.error("Failed to load refund details");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const status = actionType === "approve" ? 1 : 2; // 1=approved, 2=rejected
      const res = await UpdateRefundStatusApi({
        refund_id: selectedRefund._id,
        status: status,
      });
      
      if (res?.status === 1 || res?.code === 200) {
        toast.success(`Refund request ${actionType === "approve" ? "approved" : "rejected"} successfully`);
        setShowModal(false);
        fetchRefunds();
      } else {
        toast.error(res?.message || "Failed to update request");
      }
    } catch (error) {
      console.error("Error updating refund request:", error);
      toast.error("Failed to update request");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 0:
        return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">Pending</span>;
      case 1:
        return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Approved</span>;
      case 2:
        return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">Rejected</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">Unknown</span>;
    }
  };

  const exportToCSV = () => {
    const headers = ["Refund ID", "Booking ID", "User", "Amount", "Reason", "Status", "Request Date"];
    const csvContent = [
      headers.join(","),
      ...refunds.map(refund => [
        refund._id,
        refund.booking_id,
        refund.user?.email || "N/A",
        refund.amount,
        `"${(refund.refund_reason || "").replace(/"/g, '""')}"`,
        refund.status === 0 ? "Pending" : refund.status === 1 ? "Approved" : "Rejected",
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
          <h1 className="text-2xl font-bold text-gray-900">Refund Requests</h1>
          <p className="mt-1 text-sm text-gray-600">Manage and process refund requests from users</p>
        </div>

        {/* Filters and Actions */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search by booking ID, user email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FaFileExcel className="text-green-600" />
              Export CSV
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FaPrint />
              Print
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
            <p className="text-gray-500">No refund requests found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Refund ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
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
                        {refund.refund_reason || "No reason provided"}
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
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          {refund.status === 0 && (
                            <>
                              <button
                                onClick={() => handleApprove(refund)}
                                className="text-green-600 hover:text-green-900"
                                title="Approve"
                              >
                                <FaCheckCircle />
                              </button>
                              <button
                                onClick={() => handleReject(refund)}
                                className="text-red-600 hover:text-red-900"
                                title="Reject"
                              >
                                <FaTimesCircle />
                              </button>
                            </>
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
                currentPage={page}
                totalPages={Math.ceil(refunds.length / itemsPerPage)}
                onPageChange={setPage}
              />
            </div>
          </div>
        )}

        {/* Approval Modal */}
        <ApprovalModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirm}
          title={`${actionType === "approve" ? "Approve" : "Reject"} Refund Request`}
          message={`Are you sure you want to ${actionType} this refund request? This action will process the refund via Moyasar payment gateway.`}
          confirmText={actionType === "approve" ? "Approve" : "Reject"}
          confirmColor={actionType === "approve" ? "green" : "red"}
        />

        {/* Detail Modal */}
        {showDetailModal && refundDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Refund Details</h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Refund ID</p>
                    <p className="text-sm text-gray-900">{refundDetail._id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Booking ID</p>
                    <p className="text-sm text-gray-900">{refundDetail.booking_id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Amount</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {refundDetail.amount} {refundDetail.currency || "SAR"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Reason</p>
                    <p className="text-sm text-gray-900">{refundDetail.refund_reason || "No reason provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    {getStatusBadge(refundDetail.status)}
                  </div>
                  {refundDetail.refund_error && (
                    <div>
                      <p className="text-sm font-medium text-red-500">Error</p>
                      <p className="text-sm text-red-600">{refundDetail.refund_error}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-500">Request Date</p>
                    <p className="text-sm text-gray-900">
                      {refundDetail.createdAt ? format(new Date(refundDetail.createdAt), "MMM dd, yyyy 'at' hh:mm a") : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}

