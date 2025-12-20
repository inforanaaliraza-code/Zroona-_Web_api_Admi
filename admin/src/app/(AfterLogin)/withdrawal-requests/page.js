"use client";

import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Loader from "@/components/Loader/Loader";
import Paginations from "@/components/Paginations/Pagination";
import Image from "next/image";
import { toast } from "react-toastify";
import { FaFileExcel, FaPrint, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import ApprovalModal from "@/components/Modals/ApprovalModal";
import { GetWithdrawalRequestsApi, UpdateWithdrawalRequestApi } from "@/api/admin/apis";

export default function WithdrawalRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    fetchRequests();
  }, [page, search]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await GetWithdrawalRequestsApi({ page, limit: itemsPerPage, search });
      if (res?.status === 1 || res?.code === 200) {
        const withdrawalData = res?.data || [];
        setRequests(withdrawalData.map(req => ({
          _id: req._id,
          host_name: `${req.organizer?.first_name || ''} ${req.organizer?.last_name || ''}`.trim(),
          host_image: req.organizer?.profile_image,
          amount: req.amount,
          wallet_balance: 0, // Wallet is set to 0 when request is made
          status: req.status === 0 ? "pending" : req.status === 1 ? "approved" : "rejected",
          created_at: req.createdAt
        })));
      }
    } catch (error) {
      console.error("Error fetching withdrawal requests:", error);
      toast.error("Failed to fetch withdrawal requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (request) => {
    setSelectedRequest(request);
    setActionType("approve");
    setShowModal(true);
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setActionType("reject");
    setShowModal(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const status = actionType === "approve" ? 1 : 2; // 1=approved, 2=rejected
      const res = await UpdateWithdrawalRequestApi({
        id: selectedRequest._id,
        status: status
      });
      
      if (res?.status === 1 || res?.code === 200) {
        toast.success(`Withdrawal request ${actionType === "approve" ? "approved" : "rejected"} successfully`);
        setShowModal(false);
        fetchRequests();
      } else {
        toast.error(res?.message || "Failed to update request");
      }
    } catch (error) {
      console.error("Error updating withdrawal request:", error);
      toast.error("Failed to update request");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ["Request ID", "Host Name", "Amount", "Wallet Balance", "Request Date", "Status"];
    const csvContent = [
      headers.join(","),
      ...requests.map(req => [
        req._id,
        `"${req.host_name}"`,
        req.amount,
        req.wallet_balance,
        new Date(req.created_at).toLocaleDateString(),
        req.status
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "withdrawal_requests_export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <DefaultLayout search={search} setSearch={setSearch} setPage={setPage}>
      <div>
        <div className="flex flex-wrap justify-between py-5">
          <div className="flex lg:w-[40%] items-end mb-4 sm:mb-0">
            <h1 className="text-xl font-bold text-black">Host Withdrawal Requests</h1>
          </div>

          <div className="w-full flex lg:justify-end gap-3 items-center mt-5 lg:mt-0">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition"
            >
              <FaFileExcel /> Export CSV
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
            >
              <FaPrint /> Print/PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead className="bg-[#f3f7ff]">
                <tr className="text-sm">
                  <th className="px-4 py-4 text-left font-base text-gray-600">Request ID</th>
                  <th className="px-4 py-4 text-left font-base text-gray-600">Host</th>
                  <th className="px-4 py-4 text-left font-base text-gray-600">Amount</th>
                  <th className="px-4 py-4 text-left font-base text-gray-600">Wallet Balance</th>
                  <th className="px-4 py-4 text-left font-base text-gray-600">Request Date</th>
                  <th className="px-4 py-4 text-left font-base text-gray-600">Status</th>
                  <th className="px-4 py-4 text-center font-base text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-3">
                      <Loader />
                    </td>
                  </tr>
                ) : requests.length > 0 ? (
                  requests.map((request) => (
                    <tr
                      key={request._id}
                      className="border-b last:border-0 text-sm font-medium text-black"
                    >
                      <td className="px-2 py-2">{request._id}</td>
                      <td className="px-2 py-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <Image
                              src={request.host_image || "/assets/images/dummyImage.png"}
                              alt={request.host_name}
                              height={40}
                              width={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span>{request.host_name}</span>
                        </div>
                      </td>
                      <td className="px-2 py-2">{request.amount} SAR</td>
                      <td className="px-2 py-2">{request.wallet_balance} SAR</td>
                      <td className="px-2 py-2">
                        {new Date(request.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-2 py-2">
                        <span className={`text-sm font-medium ${
                          request.status === "pending" || request.status === 0 ? "text-yellow-500" :
                          request.status === "approved" || request.status === 1 ? "text-green-500" :
                          "text-red-500"
                        }`}>
                          {(() => {
                            const status = request.status;
                            if (status === undefined || status === null) return "Unknown";
                            const statusStr = String(status);
                            return statusStr.charAt(0).toUpperCase() + statusStr.slice(1);
                          })()}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        {request.status === "pending" && (
                          <div className="flex gap-2 justify-center items-center">
                            <button
                              onClick={() => handleApprove(request)}
                              className="text-green-600 hover:text-green-800"
                              title="Approve"
                            >
                              <FaCheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => handleReject(request)}
                              className="text-red-600 hover:text-red-800"
                              title="Reject"
                            >
                              <FaTimesCircle size={18} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-3 text-center">
                      No Withdrawal Requests Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {requests.length > 0 && (
          <Paginations
            handlePage={setPage}
            page={page}
            total={requests.length}
            itemsPerPage={itemsPerPage}
          />
        )}

        <ApprovalModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirm}
          title={actionType === "approve" ? "Approve Withdrawal" : "Reject Withdrawal"}
          message={
            actionType === "approve"
              ? "Are you sure you want to approve this withdrawal request?"
              : "Are you sure you want to reject this withdrawal request?"
          }
        />
      </div>
    </DefaultLayout>
  );
}

