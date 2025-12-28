"use client";

import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Loader from "@/components/Loader/Loader";
import Paginations from "@/components/Paginations/Pagination";
import StatsDashboard from "@/components/Withdrawal/StatsDashboard";
import WithdrawalActionModal from "@/components/Modals/WithdrawalActionModal";
import Image from "next/image";
import { toast } from "react-toastify";
import { 
  FaFileExcel, FaPrint, FaCheckCircle, FaTimesCircle,  
  FaFilter, FaEye, FaCalendar, FaSearch, FaDownload 
} from "react-icons/fa";
import { GetWithdrawalRequestsApi, UpdateWithdrawalRequestApi, GetWithdrawalStatsApi } from "@/api/admin/apis";

export default function WithdrawalRequests() {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState("");

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [page, search, statusFilter, fromDate, toDate]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await GetWithdrawalStatsApi();
      if (res?.status === 1 || res?.code === 200) {
        setStats(res.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = { 
        page, 
        limit: itemsPerPage, 
        search 
      };

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      if (fromDate) {
        params.from_date = fromDate;
      }

      if (toDate) {
        params.to_date = toDate;
      }

      const res = await GetWithdrawalRequestsApi(params);
      if (res?.status === 1 || res?.code === 200) {
        const withdrawalData = res?.data || [];
        setRequests(withdrawalData);
        setTotalCount(res?.total_count || 0);
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

  const handleConfirm = async (data) => {
    try {
      const res = await UpdateWithdrawalRequestApi(data);
      
      if (res?.status === 1 || res?.code === 200) {
        toast.success(`Withdrawal request ${data.status === 1 ? "approved" : "rejected"} successfully`);
        setShowModal(false);
        fetchRequests();
        fetchStats(); // Refresh stats
      } else {
        toast.error(res?.message || "Failed to update request");
      }
    } catch (error) {
      console.error("Error updating withdrawal request:", error);
      toast.error("Failed to update request");
    }
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setFromDate("");
    setToDate("");
    setSearch("");
  };

  const exportToCSV = () => {
    const headers = [
      "Request ID", "Host Name", "Email", "Phone", "Amount (SAR)", "Currency",
      "Request Date", "Status", "Processed Date", "Rejection Reason", "Admin Notes"
    ];
    
    const csvContent = [
      headers.join(","),
      ...requests.map(req => [
        req._id,
        `"${req.organizer?.first_name || ''} ${req.organizer?.last_name || ''}"`,
        req.organizer?.email || '',
        req.organizer?.phone_number || '',
        req.amount,
        req.currency || 'SAR',
        new Date(req.createdAt).toLocaleDateString(),
        req.status === 0 ? "Pending" : req.status === 1 ? "Approved" : "Rejected",
        req.processed_at ? new Date(req.processed_at).toLocaleDateString() : '',
        `"${req.rejection_reason || ''}"`,
        `"${req.admin_notes || ''}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `withdrawal_requests_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      0: { text: "Pending", class: "bg-yellow-100 text-yellow-800 border border-yellow-300" },
      1: { text: "Approved", class: "bg-green-100 text-green-800 border border-green-300" },
      2: { text: "Rejected", class: "bg-red-100 text-red-800 border border-red-300" }
    };

    const badge = badges[status] || badges[0];
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badge.class}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <DefaultLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">
              Host Withdrawal Requests
            </h1>
            <p className="text-gray-600 mt-1">Manage and process withdrawal requests</p>
          </div>

          <div className="flex gap-3 mt-4 lg:mt-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition shadow-md ${
                showFilters 
                  ? 'bg-[#a797cc] text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FaFilter /> {showFilters ? 'Hide' : 'Show'} Filters
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition shadow-md font-semibold"
            >
              <FaFileExcel /> Export CSV
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow-md font-semibold"
            >
              <FaPrint /> Print
            </button>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <StatsDashboard stats={stats} loading={statsLoading} />

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaSearch className="inline mr-2" />
                  Search
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email, phone..."
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-[#a3cc69] focus:ring-4 focus:ring-[#a3cc69]/20 transition"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status Filter
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-[#a3cc69] focus:ring-4 focus:ring-[#a3cc69]/20 transition"
                >
                  <option value="all">All Status</option>
                  <option value="0">Pending</option>
                  <option value="1">Approved</option>
                  <option value="2">Rejected</option>
                </select>
              </div>

              {/* From Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaCalendar className="inline mr-2" />
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-[#a3cc69] focus:ring-4 focus:ring-[#a3cc69]/20 transition"
                />
              </div>

              {/* To Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaCalendar className="inline mr-2" />
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-[#a3cc69] focus:ring-4 focus:ring-[#a3cc69]/20 transition"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={clearFilters}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Clear Filters
              </button>
              <button
                onClick={fetchRequests}
                className="px-6 py-2 bg-gradient-to-r from-[#a3cc69] to-[#a797cc] text-white rounded-xl font-semibold hover:opacity-90 transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Requests Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Host</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Request Date</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12">
                      <div className="flex justify-center">
                        <Loader />
                      </div>
                    </td>
                  </tr>
                ) : requests.length > 0 ? (
                  requests.map((request) => (
                    <tr
                      key={request._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
                            <Image
                              src={request.organizer?.profile_image || "/assets/images/dummyImage.png"}
                              alt={request.organizer?.first_name || "Host"}
                              height={48}
                              width={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {request.organizer?.first_name || ''} {request.organizer?.last_name || ''}
                            </p>
                            <p className="text-sm text-gray-500">ID: {request._id.slice(-8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{request.organizer?.email || '-'}</p>
                        <p className="text-sm text-gray-600">
                          {request.organizer?.phone_number ? `+${request.organizer.country_code || ''} ${request.organizer.phone_number}` : '-'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xl font-bold text-[#a3cc69]">{request.amount}</p>
                        <p className="text-sm text-gray-600">{request.currency || 'SAR'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(request.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(request.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(request.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          {request.status === 0 && (
                            <>
                              <button
                                onClick={() => handleApprove(request)}
                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                                title="Approve"
                              >
                                <FaCheckCircle size={20} />
                              </button>
                              <button
                                onClick={() => handleReject(request)}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                                title="Reject"
                              >
                                <FaTimesCircle size={20} />
                              </button>
                            </>
                          )}
                          {request.status !== 0 && (
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                // Could open a view details modal
                              }}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                              title="View Details"
                            >
                              <FaEye size={20} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <FaDownload className="text-6xl text-gray-300" />
                        <p className="text-gray-500 text-lg font-medium">No Withdrawal Requests Found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalCount > itemsPerPage && (
          <div className="mt-6">
            <Paginations
              handlePage={setPage}
              page={page}
              total={totalCount}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}

        {/* Action Modal */}
        <WithdrawalActionModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirm}
          request={selectedRequest}
          actionType={actionType}
        />
      </div>
    </DefaultLayout>
  );
}
