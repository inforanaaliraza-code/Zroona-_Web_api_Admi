"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import useAuthStore from "@/store/useAuthStore";
import { GetRefundListApi } from "@/app/api/setting";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Loader from "@/components/Loader/Loader";
import { useRTL } from "@/utils/rtl";

export default function RefundsPage() {
  const { t, i18n } = useTranslation();
  const { isRTL, textAlign, flexDirection, marginStart, marginEnd } = useRTL();
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();
  
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all"); // all, pending, approved, rejected

  const breadcrumbItems = [
    { label: t("breadcrumb.tab1") || "Home", href: "/" },
    { label: t("refunds.title") || "Refunds", href: "/refunds" },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fetchRefunds();
  }, [isAuthenticated]);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const response = await GetRefundListApi({ page: 1, limit: 50 });
      if (response?.status === 1) {
        setRefunds(response.data?.refunds || response.data || []);
      } else {
        toast.error(response?.message || "Failed to load refunds");
      }
    } catch (error) {
      console.error("Error fetching refunds:", error);
      toast.error("Failed to load refunds");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 0: // Pending
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: "lucide:clock",
          label: t("refunds.status.pending") || "Pending",
        };
      case 1: // Approved
        return {
          color: "bg-green-100 text-green-800",
          icon: "lucide:check-circle",
          label: t("refunds.status.approved") || "Approved",
        };
      case 2: // Rejected
        return {
          color: "bg-red-100 text-red-800",
          icon: "lucide:x-circle",
          label: t("refunds.status.rejected") || "Rejected",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: "lucide:help-circle",
          label: t("refunds.status.unknown") || "Unknown",
        };
    }
  };

  const filteredRefunds = refunds.filter((refund) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "pending") return refund.status === 0;
    if (activeFilter === "approved") return refund.status === 1;
    if (activeFilter === "rejected") return refund.status === 2;
    return true;
  });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="container px-4 py-8 mx-auto md:px-8 lg:px-28">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold text-gray-900 ${textAlign}`}>
            {t("refunds.title") || "My Refunds"}
          </h1>
          <p className={`mt-2 text-gray-600 ${textAlign}`}>
            {t("refunds.subtitle") || "View and track your refund requests"}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 bg-white rounded-xl shadow-sm p-2 inline-flex border border-gray-200">
          {[
            { key: "all", label: t("refunds.filter.all") || "All", icon: "lucide:list" },
            { key: "pending", label: t("refunds.filter.pending") || "Pending", icon: "lucide:clock" },
            { key: "approved", label: t("refunds.filter.approved") || "Approved", icon: "lucide:check-circle" },
            { key: "rejected", label: t("refunds.filter.rejected") || "Rejected", icon: "lucide:x-circle" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 ${
                activeFilter === tab.key
                  ? "bg-[#a797cc] text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon icon={tab.icon} className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Request New Refund Button */}
        <div className={`mb-6 ${isRTL ? "text-left" : "text-right"}`}>
          <Link
            href="/refunds/request"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#a797cc] text-white rounded-xl font-semibold hover:bg-[#8b7ba8] transition-colors shadow-sm hover:shadow-md"
          >
            <Icon icon="lucide:plus" className="w-5 h-5" />
            {t("refunds.requestNew") || "Request New Refund"}
          </Link>
        </div>

        {/* Refunds List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : filteredRefunds.length === 0 ? (
          <div className={`text-center py-16 bg-white rounded-xl shadow-sm ${textAlign}`}>
            <Icon icon="lucide:receipt-refund" className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {t("refunds.noRefunds") || "No refunds found"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeFilter === "all"
                ? t("refunds.noRefundsDesc") || "You haven't requested any refunds yet"
                : t("refunds.noRefundsFilter") || `No ${activeFilter} refunds found`}
            </p>
            {activeFilter === "all" && (
              <div className="mt-6">
                <Link
                  href="/refunds/request"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-[#a797cc] to-[#8ba179] hover:shadow-lg"
                >
                  {t("refunds.requestNew") || "Request New Refund"}
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredRefunds.map((refund) => {
              const statusConfig = getStatusConfig(refund.status);
              return (
                <div
                  key={refund._id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {t("refunds.bookingId") || "Booking ID"}: {refund.booking_id?.slice(-8) || refund._id?.slice(-8)}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {t("refunds.requestedOn") || "Requested on"}:{" "}
                          {refund.createdAt
                            ? format(new Date(refund.createdAt), "MMM dd, yyyy 'at' hh:mm a")
                            : "N/A"}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
                      >
                        <Icon icon={statusConfig.icon} className={`${marginEnd(1)} h-3 w-3`} />
                        {statusConfig.label}
                      </span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {t("refunds.amount") || "Amount"}
                        </p>
                        <p className="mt-1 text-lg font-bold text-[#a797cc]">
                          {refund.amount || 0} {refund.currency || "SAR"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {t("refunds.reason") || "Reason"}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          {refund.refund_reason || t("refunds.noReason") || "No reason provided"}
                        </p>
                      </div>
                    </div>

                    {refund.refund_error && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                          <Icon icon="lucide:alert-circle" className="inline w-4 h-4 mr-1" />
                          {t("refunds.error") || "Error"}: {refund.refund_error}
                        </p>
                      </div>
                    )}

                    <div className={`mt-4 ${isRTL ? "text-left" : "text-right"}`}>
                      <Link
                        href={`/refunds/${refund._id}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#a797cc] hover:text-[#8b7ba8]"
                      >
                        {t("refunds.viewDetails") || "View Details"}
                        <Icon icon={isRTL ? "lucide:arrow-left" : "lucide:arrow-right"} className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

