"use client";

import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Loader from "@/components/Loader/Loader";
import Paginations from "@/components/Paginations/Pagination";
import Image from "next/image";
import { FaFileExcel, FaPrint } from "react-icons/fa";
import { GetWalletDetailsApi, GetWithdrawalRequestsApi } from "@/api/admin/apis";
import { toast } from "react-toastify";

export default function Wallet() {
  const [walletData, setWalletData] = useState(null);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchWalletData();
    fetchWithdrawalRequests();
  }, [page]);

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const res = await GetWalletDetailsApi();
      if (res?.status === 1 || res?.code === 200) {
        setWalletData(res?.data || res);
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      toast.error("Failed to fetch wallet data");
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawalRequests = async () => {
    try {
      const res = await GetWithdrawalRequestsApi({ page, limit: itemsPerPage });
      if (res?.status === 1 || res?.code === 200) {
        setWithdrawalRequests(res?.data || []);
      }
    } catch (error) {
      console.error("Error fetching withdrawal requests:", error);
    }
  };

  const exportToCSV = () => {
    const headers = ["Request ID", "Host", "Amount", "Date", "Status"];
    const csvContent = [
      headers.join(","),
      ...withdrawalRequests.map(req => [
        req._id,
        `"${req.host_name}"`,
        req.amount,
        new Date(req.created_at).toLocaleDateString(),
        req.status
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "wallet_withdrawals_export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <DefaultLayout>
      <div>
        <div className="flex flex-wrap justify-between py-5">
          <div className="flex lg:w-[40%] items-end mb-4 sm:mb-0">
            <h1 className="text-xl font-bold text-black">Wallet Management</h1>
          </div>

          <div className="w-full flex lg:justify-end gap-3 items-center mt-5 lg:mt-0">
            {activeTab === "requests" && (
              <>
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
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-3 text-sm font-medium rounded-lg ${
              activeTab === "details"
                ? "bg-[#f47c0c] text-white"
                : "bg-white text-[#f47c0c] border-2 border-[#f47c0c]"
            }`}
          >
            Wallet Details
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-3 text-sm font-medium rounded-lg ${
              activeTab === "requests"
                ? "bg-[#f47c0c] text-white"
                : "bg-white text-[#f47c0c] border-2 border-[#f47c0c]"
            }`}
          >
            Withdrawal Requests
          </button>
        </div>

        {/* Wallet Details Tab */}
        {activeTab === "details" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Balance</h3>
              <p className="text-2xl font-bold text-[#f47c0c]">
                {walletData?.total_balance?.toLocaleString() || 0} SAR
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Available Balance</h3>
              <p className="text-2xl font-bold text-green-600">
                {walletData?.available_balance?.toLocaleString() || 0} SAR
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Pending Balance</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {walletData?.pending_balance?.toLocaleString() || 0} SAR
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Earnings</h3>
              <p className="text-2xl font-bold text-blue-600">
                {walletData?.total_earnings?.toLocaleString() || 0} SAR
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Withdrawals</h3>
              <p className="text-2xl font-bold text-gray-600">
                {walletData?.total_withdrawals?.toLocaleString() || 0} SAR
              </p>
            </div>
          </div>
        )}

        {/* Withdrawal Requests Tab */}
        {activeTab === "requests" && (
          <div className="bg-white rounded-lg shadow p-5">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg">
                <thead className="bg-[#f3f7ff]">
                  <tr className="text-sm">
                    <th className="px-4 py-4 text-left font-base text-gray-600">Request ID</th>
                    <th className="px-4 py-4 text-left font-base text-gray-600">Host</th>
                    <th className="px-4 py-4 text-left font-base text-gray-600">Amount</th>
                    <th className="px-4 py-4 text-left font-base text-gray-600">Date</th>
                    <th className="px-4 py-4 text-left font-base text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-3">
                        <Loader />
                      </td>
                    </tr>
                  ) : withdrawalRequests.length > 0 ? (
                    withdrawalRequests.map((request) => (
                      <tr
                        key={request._id}
                        className="border-b last:border-0 text-sm font-medium text-black"
                      >
                        <td className="px-2 py-2">{request._id}</td>
                        <td className="px-2 py-2">{request.host_name}</td>
                        <td className="px-2 py-2">{request.amount} SAR</td>
                        <td className="px-2 py-2">
                          {new Date(request.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-2 py-2">
                          <span className={`text-sm font-medium ${
                            request.status === "pending" ? "text-yellow-500" :
                            request.status === "approved" ? "text-green-500" :
                            "text-red-500"
                          }`}>
                            {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-3 text-center">
                        No Withdrawal Requests Available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {withdrawalRequests.length > 0 && (
              <Paginations
                handlePage={setPage}
                page={page}
                total={withdrawalRequests.length}
                itemsPerPage={itemsPerPage}
              />
            )}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}

