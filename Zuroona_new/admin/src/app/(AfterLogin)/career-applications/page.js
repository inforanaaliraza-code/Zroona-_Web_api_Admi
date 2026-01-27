"use client";

import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Loader from "@/components/Loader/Loader";
import Paginations from "@/components/Paginations/Pagination";
import { toast } from "react-toastify";
import { FaFileExcel, FaPrint, FaCheckCircle, FaTimesCircle, FaEye, FaDownload } from "react-icons/fa";
import ApprovalModal from "@/components/Modals/ApprovalModal";
import { GetCareerApplicationsApi, UpdateCareerApplicationStatusApi, GetCareerApplicationDetailApi } from "@/api/setting";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

export default function CareerApplications() {
  const { t } = useTranslation();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [actionType, setActionType] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [applicationDetail, setApplicationDetail] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all"); // all, pending, approved, rejected
  const [positionFilter, setPositionFilter] = useState("");

  useEffect(() => {
    fetchApplications();
  }, [page, search, statusFilter, positionFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const queryParams = {
        page,
        limit: itemsPerPage,
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter === "pending" ? 0 : statusFilter === "approved" ? 1 : 2 }),
        ...(positionFilter && { position: positionFilter }),
      };
      const res = await GetCareerApplicationsApi(queryParams);
      if (res?.status === 1 || res?.code === 200) {
        const appData = res?.data?.applications || res?.data || [];
        setApplications(appData);
      }
    } catch (error) {
      console.error("Error fetching career applications:", error);
      toast.error(t("career.failedToFetch"));
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (application) => {
    setSelectedApplication(application);
    setActionType("approve");
    setShowModal(true);
  };

  const handleReject = (application) => {
    setSelectedApplication(application);
    setActionType("reject");
    setShowModal(true);
  };

  const handleViewDetail = async (application) => {
    try {
      setLoading(true);
      const res = await GetCareerApplicationDetailApi({ application_id: application._id });
      if (res?.status === 1) {
        setApplicationDetail(res.data);
        setShowDetailModal(true);
      } else {
        toast.error(res?.message || t("career.failedToLoadDetails"));
      }
    } catch (error) {
      console.error("Error fetching application detail:", error);
      toast.error(t("career.failedToLoadDetails"));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const status = actionType === "approve" ? 1 : 2; // 1=approved, 2=rejected
      const res = await UpdateCareerApplicationStatusApi({
        application_id: selectedApplication._id,
        status: status,
      });
      
      if (res?.status === 1 || res?.code === 200) {
        toast.success(actionType === "approve" ? t("career.applicationApprovedSuccess") : t("career.applicationRejectedSuccess"));
        setShowModal(false);
        fetchApplications();
      } else {
        toast.error(res?.message || t("career.failedToUpdate"));
      }
    } catch (error) {
      console.error("Error updating application:", error);
      toast.error(t("career.failedToUpdate"));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 0:
        return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">{t("career.pending")}</span>;
      case 1:
        return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">{t("career.approved")}</span>;
      case 2:
        return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">{t("career.rejected")}</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">{t("common.unknown")}</span>;
    }
  };

  const exportToCSV = () => {
    const headers = [t("career.applicationId"), t("career.name"), t("career.email"), t("career.position"), t("career.status"), t("career.appliedDate")];
    const csvContent = [
      headers.join(","),
      ...applications.map(app => [
        app._id,
        `"${app.first_name} ${app.last_name}"`,
        app.email,
        `"${app.position || ""}"`,
        app.status === 0 ? t("career.pending") : app.status === 1 ? t("career.approved") : t("career.rejected"),
        app.createdAt ? format(new Date(app.createdAt), "yyyy-MM-dd") : "N/A"
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `career-applications-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const uniquePositions = [...new Set(applications.map(app => app.position).filter(Boolean))];

  return (
    <DefaultLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t("career.title")}</h1>
          <p className="mt-1 text-sm text-gray-600">{t("career.description")}</p>
        </div>

        {/* Filters and Actions */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder={t("career.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t("career.allStatus")}</option>
              <option value="pending">{t("career.pending")}</option>
              <option value="approved">{t("career.approved")}</option>
              <option value="rejected">{t("career.rejected")}</option>
            </select>
            {uniquePositions.length > 0 && (
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t("career.allPositions")}</option>
                {uniquePositions.map(position => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FaFileExcel className="text-green-600" />
              {t("career.exportCSV")}
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FaPrint />
              {t("career.print")}
            </button>
          </div>
        </div>

        {/* Applications Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">{t("career.noApplicationsFound")}</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("career.applicationId")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("career.name")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("career.email")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("career.position")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("career.status")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("career.appliedDate")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("career.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((application) => (
                    <tr key={application._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {application._id?.slice(-8) || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {application.first_name} {application.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {application.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {application.position || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(application.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.createdAt ? format(new Date(application.createdAt), "MMM dd, yyyy") : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetail(application)}
                            className="text-blue-600 hover:text-blue-900"
                            title={t("career.viewDetails")}
                          >
                            <FaEye />
                          </button>
                          {application.resume_url && (
                            <a
                              href={application.resume_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-900"
                              title={t("career.downloadResume")}
                            >
                              <FaDownload />
                            </a>
                          )}
                          {application.status === 0 && (
                            <>
                              <button
                                onClick={() => handleApprove(application)}
                                className="text-green-600 hover:text-green-900"
                                title={t("career.approve")}
                              >
                                <FaCheckCircle />
                              </button>
                              <button
                                onClick={() => handleReject(application)}
                                className="text-red-600 hover:text-red-900"
                                title={t("career.reject")}
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
                totalPages={Math.ceil(applications.length / itemsPerPage)}
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
          title={actionType === "approve" ? t("career.approveTitle") : t("career.rejectTitle")}
          message={actionType === "approve" ? t("career.approveMessage") : t("career.rejectMessage")}
          confirmText={actionType === "approve" ? t("career.approve") : t("career.reject")}
          confirmColor={actionType === "approve" ? "green" : "red"}
        />

        {/* Detail Modal */}
        {showDetailModal && applicationDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{t("career.detailsTitle")}</h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t("career.name")}</p>
                    <p className="text-sm text-gray-900">
                      {applicationDetail.first_name} {applicationDetail.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t("career.email")}</p>
                    <p className="text-sm text-gray-900">{applicationDetail.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t("career.position")}</p>
                    <p className="text-sm text-gray-900">{applicationDetail.position || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t("career.coverLetter")}</p>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{applicationDetail.cover_letter || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t("career.resume")}</p>
                    {applicationDetail.resume_url ? (
                      <a
                        href={applicationDetail.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-900"
                      >
                        <FaDownload />
                        {t("career.downloadResume")}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-500">{t("career.noResumeUploaded")}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t("career.status")}</p>
                    {getStatusBadge(applicationDetail.status)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t("career.appliedDate")}</p>
                    <p className="text-sm text-gray-900">
                      {applicationDetail.createdAt ? format(new Date(applicationDetail.createdAt), "MMM dd, yyyy 'at' hh:mm a") : "N/A"}
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

