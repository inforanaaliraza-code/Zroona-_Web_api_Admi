"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import useAuthStore from "@/store/useAuthStore";
import { GetRefundDetailApi } from "@/app/api/setting";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Loader from "@/components/Loader/Loader";
import { useRTL } from "@/utils/rtl";

export default function RefundDetailPage() {
  const { t, i18n } = useTranslation();
  const { isRTL, textAlign, flexDirection, marginStart, marginEnd } = useRTL();
  const router = useRouter();
  const params = useParams();
  const { token, isAuthenticated } = useAuthStore();
  
  const refundId = params?.id;
  const [refund, setRefund] = useState(null);
  const [loading, setLoading] = useState(true);

  const breadcrumbItems = [
    { label: t("breadcrumb.tab1") || "Home", href: "/" },
    { label: t("refunds.title") || "Refunds", href: "/refunds" },
    { label: t("refunds.details") || "Refund Details", href: `/refunds/${refundId}` },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (refundId) {
      fetchRefundDetail();
    }
  }, [isAuthenticated, refundId]);

  const fetchRefundDetail = async () => {
    try {
      setLoading(true);
      const response = await GetRefundDetailApi({ refund_id: refundId });
      if (response?.status === 1) {
        setRefund(response.data);
      } else {
        toast.error(response?.message || "Failed to load refund details");
        router.push("/refunds");
      }
    } catch (error) {
      console.error("Error fetching refund detail:", error);
      toast.error("Failed to load refund details");
      router.push("/refunds");
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
          description: t("refunds.status.pendingDesc") || "Your refund request is under review",
        };
      case 1: // Approved
        return {
          color: "bg-green-100 text-green-800",
          icon: "lucide:check-circle",
          label: t("refunds.status.approved") || "Approved",
          description: t("refunds.status.approvedDesc") || "Your refund request has been approved",
        };
      case 2: // Rejected
        return {
          color: "bg-red-100 text-red-800",
          icon: "lucide:x-circle",
          label: t("refunds.status.rejected") || "Rejected",
          description: t("refunds.status.rejectedDesc") || "Your refund request has been rejected",
        };
      case 3: // Processed
        return {
          color: "bg-blue-100 text-blue-800",
          icon: "lucide:check-circle-2",
          label: t("refunds.status.processed") || "Processed",
          description: t("refunds.status.processedDesc") || "Your refund has been processed",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: "lucide:help-circle",
          label: t("refunds.status.unknown") || "Unknown",
          description: "",
        };
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="container px-4 py-8 mx-auto md:px-8 lg:px-28">
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  if (!refund) {
    return (
      <div className="min-h-screen bg-white">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="container px-4 py-8 mx-auto md:px-8 lg:px-28">
          <div className={`text-center py-16 ${textAlign}`}>
            <Icon icon="lucide:alert-circle" className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {t("refunds.notFound") || "Refund not found"}
            </h3>
            <div className="mt-6">
              <Link
                href="/refunds"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-[#a797cc] to-[#8ba179] hover:shadow-lg"
              >
                {t("refunds.backToList") || "Back to Refunds"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(refund.status);

  return (
    <div className="min-h-screen bg-white">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="container px-4 py-8 mx-auto md:px-8 lg:px-28">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold text-gray-900 ${textAlign}`}>
                {t("refunds.details") || "Refund Details"}
              </h1>
              <p className={`mt-2 text-gray-600 ${textAlign}`}>
                {t("refunds.detailsDesc") || "View details of your refund request"}
              </p>
            </div>
            <Link
              href="/refunds"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Icon icon={isRTL ? "lucide:arrow-right" : "lucide:arrow-left"} className="w-4 h-4" />
              {t("refunds.backToList") || "Back"}
            </Link>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${statusConfig.color.replace('text-', 'bg-').split(' ')[0]}`}>
                  <Icon icon={statusConfig.icon} className={`w-6 h-6 ${statusConfig.color.split(' ')[1]}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{statusConfig.label}</h3>
                  <p className="text-sm text-gray-600">{statusConfig.description}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                <Icon icon={statusConfig.icon} className={`${marginEnd(1)} h-3 w-3`} />
                {statusConfig.label}
              </span>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {t("refunds.refundInformation") || "Refund Information"}
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Refund ID */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {t("refunds.refundId") || "Refund ID"}
                  </p>
                  <p className="text-sm text-gray-900 font-mono">{refund._id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {t("refunds.bookingId") || "Booking ID"}
                  </p>
                  <p className="text-sm text-gray-900 font-mono">{refund.booking_id}</p>
                </div>
              </div>

              {/* Amount */}
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  {t("refunds.amount") || "Refund Amount"}
                </p>
                <p className="text-2xl font-bold text-[#a797cc]">
                  {refund.amount || 0} {refund.currency || "SAR"}
                </p>
              </div>

              {/* Reason */}
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  {t("refunds.reason") || "Refund Reason"}
                </p>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {refund.refund_reason || t("refunds.noReason") || "No reason provided"}
                </p>
              </div>

              {/* Dates */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {t("refunds.requestedOn") || "Requested On"}
                  </p>
                  <p className="text-sm text-gray-900">
                    {refund.createdAt
                      ? format(new Date(refund.createdAt), "MMM dd, yyyy 'at' hh:mm a")
                      : "N/A"}
                  </p>
                </div>
                {refund.processed_at && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      {t("refunds.processedOn") || "Processed On"}
                    </p>
                    <p className="text-sm text-gray-900">
                      {format(new Date(refund.processed_at), "MMM dd, yyyy 'at' hh:mm a")}
                    </p>
                  </div>
                )}
              </div>

              {/* Admin Response */}
              {refund.admin_response && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {t("refunds.adminResponse") || "Admin Response"}
                  </p>
                  <p className="text-sm text-gray-900 bg-blue-50 p-3 rounded-lg border border-blue-200">
                    {refund.admin_response}
                  </p>
                </div>
              )}

              {/* Payment Refund ID */}
              {refund.payment_refund_id && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {t("refunds.paymentRefundId") || "Payment Refund ID"}
                  </p>
                  <p className="text-sm text-gray-900 font-mono bg-gray-50 p-3 rounded-lg">
                    {refund.payment_refund_id}
                  </p>
                </div>
              )}

              {/* Error Message */}
              {refund.refund_error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Icon icon="lucide:alert-circle" className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800 mb-1">
                        {t("refunds.error") || "Error"}
                      </p>
                      <p className="text-sm text-red-700">{refund.refund_error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
