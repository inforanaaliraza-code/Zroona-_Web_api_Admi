"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Loader from "@/components/Loader/Loader";
import Paginations from "@/components/Paginations/Pagination";
import Image from "next/image";
import { FaFileExcel, FaPrint } from "react-icons/fa";
import { GetWalletDetailsApi, GetWithdrawalRequestsApi } from "@/api/admin/apis";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";

const WalletStatsDashboard = dynamic(() => import("@/components/Wallet/WalletStatsDashboard"), {
  ssr: false,
  loading: () => <div className="flex justify-center items-center py-10"><div className="h-10 w-10 border-4 border-gray-300 border-t-[#a797cc] rounded-full animate-spin"></div></div>
});

export default function Wallet() {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isRTL = mounted ? i18n.language === "ar" : false;

  const fetchWalletData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await GetWalletDetailsApi();
      if (res?.status === 1 || res?.code === 200) {
        setWalletData(res?.data || res);
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      toast.error(t("wallet.failedToFetch") || "Failed to fetch wallet data");
    } finally {
      setLoading(false);
    }
  }, [t]);

  const fetchWithdrawalRequests = useCallback(async () => {
    try {
      const res = await GetWithdrawalRequestsApi({ page, limit: itemsPerPage });
      if (res?.status === 1 || res?.code === 200) {
        setWithdrawalRequests(res?.data || []);
      }
    } catch (error) {
      console.error("Error fetching withdrawal requests:", error);
    }
  }, [page, itemsPerPage]);

  useEffect(() => {
    fetchWalletData();
    fetchWithdrawalRequests();
  }, [fetchWalletData, fetchWithdrawalRequests]);

  const exportToCSV = () => {
    const headers = [
      t("withdrawal.requestId"),
      t("withdrawal.host"),
      t("withdrawal.amount"),
      t("common.date"),
      t("common.status")
    ];
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
      link.setAttribute("download", `wallet_withdrawals_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 py-8 animate-fade-in" dir={isRTL ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="flex items-center mb-8 w-full">
          <h1 className={`text-3xl font-bold text-black flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>{t("wallet.walletManagement")}</h1>
        </div>

        {/* Statistics Dashboard */}
        <WalletStatsDashboard />

        <div className="mt-8">
        <div className={`flex flex-wrap items-center justify-between py-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-end mb-4 sm:mb-0 ${isRTL ? 'w-full lg:w-full justify-end' : 'lg:w-[40%]'}`}>
            <h2 className={`text-xl font-bold text-black ${isRTL ? 'text-right w-full' : 'text-left'}`}>{t("wallet.walletDetailsWithdrawals")}</h2>
          </div>

          <div className={`w-full flex gap-3 items-center mt-5 lg:mt-0 ${isRTL ? 'justify-start lg:justify-start' : 'justify-end lg:justify-end'}`}>
            {activeTab === "requests" && (
              <>
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition"
                >
                  <FaFileExcel /> {t("wallet.exportCSV")}
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
                >
                  <FaPrint /> {t("wallet.printPDF")}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex gap-2 mb-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-3 text-sm font-medium rounded-lg ${
              activeTab === "details"
                ? "bg-[#a797cc] text-white"
                : "bg-white text-[#a797cc] border-2 border-[#a797cc]"
            }`}
          >
            {t("wallet.walletDetails")}
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-3 text-sm font-medium rounded-lg ${
              activeTab === "requests"
                ? "bg-[#a797cc] text-white"
                : "bg-white text-[#a797cc] border-2 border-[#a797cc]"
            }`}
          >
            {t("wallet.withdrawalRequests")}
          </button>
        </div>

        {/* Wallet Details Tab */}
        {activeTab === "details" && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">{t("wallet.quickOverview")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-[#a797cc]/10 to-[#a797cc]/5 rounded-lg shadow-sm p-6 border border-[#a797cc]/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">{t("wallet.totalBalance")}</h3>
                  <div className="w-8 h-8 bg-[#a797cc]/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#a797cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-[#a797cc]">
                  {walletData?.total_balance?.toLocaleString() || 0} SAR
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-100/80 to-green-50 rounded-lg shadow-sm p-6 border border-green-200/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">{t("wallet.availableBalance")}</h3>
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-green-600">
                  {walletData?.available_balance?.toLocaleString() || 0} SAR
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-100/80 to-yellow-50 rounded-lg shadow-sm p-6 border border-yellow-200/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">{t("wallet.pendingBalance")}</h3>
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-yellow-600">
                  {walletData?.pending_balance?.toLocaleString() || 0} SAR
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-100/80 to-blue-50 rounded-lg shadow-sm p-6 border border-blue-200/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">{t("wallet.totalEarnings")}</h3>
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-blue-600">
                  {walletData?.total_earnings?.toLocaleString() || 0} SAR
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg shadow-sm p-6 border border-gray-200/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">{t("wallet.totalWithdrawals")}</h3>
                  <div className="w-8 h-8 bg-gray-400/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-600">
                  {walletData?.total_withdrawals?.toLocaleString() || 0} SAR
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Withdrawal Requests Tab */}
        {activeTab === "requests" && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 animate-fade-in">
            <div className="mb-4">
              <p className="text-gray-600 text-sm">
                {t("wallet.detailedManagementDirect")} <a href="/withdrawal-requests" className="text-[#a797cc] hover:underline font-semibold">{t("wallet.withdrawalRequestsPage")}</a> {t("wallet.page")}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg">
                <thead className="bg-[#f3f7ff] border-b border-gray-200">
                  <tr className="text-sm text-gray-600 uppercase">
                    <th className={`px-4 py-3 ${isRTL ? 'text-right' : 'text-left'} font-semibold`}>{t("withdrawal.requestId")}</th>
                    <th className={`px-4 py-3 ${isRTL ? 'text-right' : 'text-left'} font-semibold`}>{t("withdrawal.host")}</th>
                    <th className={`px-4 py-3 ${isRTL ? 'text-right' : 'text-left'} font-semibold`}>{t("withdrawal.amount")}</th>
                    <th className={`px-4 py-3 ${isRTL ? 'text-right' : 'text-left'} font-semibold`}>{t("common.date")}</th>
                    <th className={`px-4 py-3 ${isRTL ? 'text-right' : 'text-left'} font-semibold`}>{t("common.status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center">
                        <Loader />
                      </td>
                    </tr>
                  ) : withdrawalRequests.length > 0 ? (
                    withdrawalRequests.map((request) => (
                      <tr
                        key={request._id}
                        className="border-b border-gray-100 last:border-0 text-sm text-gray-800 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-4 py-3 font-mono text-xs">{request._id.substring(0, 12)}...</td>
                        <td className="px-4 py-3 font-semibold">{request.host_name || 'N/A'}</td>
                        <td className="px-4 py-3 font-semibold text-[#a797cc]">{request.amount} SAR</td>
                        <td className="px-4 py-3 text-gray-600">
                          {new Date(request.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            request.status === "pending" || request.status === 0 
                              ? "bg-yellow-100 text-yellow-700" 
                              : request.status === "approved" || request.status === 1 
                              ? "bg-green-100 text-green-700" 
                              : "bg-red-100 text-red-700"
                          }`}>
                            {(() => {
                              const status = request.status;
                              if (status === undefined || status === null) return t("common.unknown");
                              if (status === 0 || status === "pending") return t("withdrawal.pending");
                              if (status === 1 || status === "approved") return t("withdrawal.approved");
                              return t("withdrawal.rejected");
                            })()}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-gray-500">
                        <svg className="w-10 h-10 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {t("withdrawal.noRequestsFound")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {withdrawalRequests.length > 0 && (
              <div className="mt-6">
                <Paginations
                  handlePage={setPage}
                  page={page}
                  total={withdrawalRequests.length}
                  itemsPerPage={itemsPerPage}
                />
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </DefaultLayout>
  );
}

