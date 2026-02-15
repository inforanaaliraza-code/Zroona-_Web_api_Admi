"use client";

import {
  ActiveInActiveOrganizerApi,
  ChangeStatusOrganizerApi,
  DeleteOrganizerApi,
} from "@/api/organizer/apis";
import { useDataStore } from "@/api/store/store";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Loader from "@/components/Loader/Loader";
import ApprovalModal from "@/components/Modals/ApprovalModal";
import StatusConfirmation from "@/components/Modals/SatutsConfirmation";
import SuspendHostModal from "@/components/Modals/SuspendHostModal";
import Paginations from "@/components/Paginations/Pagination";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaFileExcel, FaPrint } from "react-icons/fa";
import { exportOrganizersToPDF } from "@/utils/exportUtils";
import { useTranslation } from "react-i18next";

export default function ManageEventOrganizer() {
  const { t } = useTranslation();
  const [status, setStatus] = useState("1");
  const [approvedTab, setApprovedTab] = useState("Pending");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal state
  const [modalShow, setModalShow] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const [selectedOrganierEvent, setSelectedOrganierEvent] = useState(null);
  const [selectedOrganizerForSuspend, setSelectedOrganizerForSuspend] = useState(null);
  const [actionType, setActionType] = useState(""); // "approve" or "reject"

  const handleTabChange = (tab) => {
    setApprovedTab(tab);
  };

  const handlePage = (value) => {
    setPage(value);
  };

  const params = {
    page: page,
    limit: 10,
    is_approved:
      approvedTab === "Pending" ? 1 : approvedTab === "Approved" ? 2 : 3,
    is_active: approvedTab === "Approved" ? status : null,
    search: search,
  };

  const GetAllOrganizer = useDataStore((store) => store.GetAllOrganizer);
  const { fetchGetAllOrganizer } = useDataStore();

  useEffect(() => {
    setLoading(true);
    fetchGetAllOrganizer(params).then(() => {
      setLoading(false);
    });
  }, [page, search, approvedTab, status]); // Add activeTab to dependencies

  const handleToggleClick = (organizer) => {
    setSelectedOrganierEvent(organizer);
    setIsModalOpen(true);
  };

  const handleConfirmToggle = () => {
    if (!selectedOrganierEvent || !selectedOrganierEvent._id) {
      toast.error(t("organizers.invalidOrganizerId"));
      return;
    }

    setLoading(true);
    // Use the organizer's current isActive status (1 = active, 2 = inactive)
    const currentStatus = selectedOrganierEvent.isActive;
    const newStatus = currentStatus === 1 ? false : true; // Toggle: if active (1), set to inactive (false), else active (true)

    ActiveInActiveOrganizerApi({
      id: selectedOrganierEvent._id,
      isActive: newStatus,
    })
      .then((res) => {
        setLoading(false);
        // API returns { status: 1, message: "...", data: {...} }
        if (res?.status === 1) {
          toast.success(res?.message || t("organizers.statusUpdated"));
          fetchGetAllOrganizer(params);
        } else {
          toast.error(res?.message || t("organizers.failedToUpdateStatus"));
        }
        setIsModalOpen(false);
        setSelectedOrganierEvent(null);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(t("organizers.errorUpdatingStatus"));
        setIsModalOpen(false);
        setSelectedOrganierEvent(null);
      });
  };

  const handleSuspendClick = (organizer) => {
    setSelectedOrganizerForSuspend(organizer);
    setSuspendModalOpen(true);
  };

  const handleConfirmSuspend = () => {
    if (!selectedOrganizerForSuspend || !selectedOrganizerForSuspend._id) {
      toast.error(t("organizers.invalidOrganizerId"));
      return;
    }

    setLoading(true);
    const isSuspended = !selectedOrganizerForSuspend.is_suspended;

    ActiveInActiveOrganizerApi({
      id: selectedOrganizerForSuspend._id,
      isSuspended: isSuspended,
    })
      .then((res) => {
        setLoading(false);
        if (res?.status === 1) {
          toast.success(res?.message || (isSuspended ? t("organizers.hostSuspended") : t("organizers.hostUnsuspended")));
          fetchGetAllOrganizer(params);
        } else {
          toast.error(res?.message || t("organizers.failedToUpdateSuspendStatus"));
        }
        setSuspendModalOpen(false);
        setSelectedOrganizerForSuspend(null);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(t("organizers.errorUpdatingSuspendStatus"));
        setSuspendModalOpen(false);
        setSelectedOrganizerForSuspend(null);
      });
  };
  // Handle change of status (approve/reject)
  const ChangeStatus = (organizerId, newStatus) => {
    setLoading(true);
    const data = {
      userId: organizerId,
      is_approved: newStatus, // 1 for approved, 3 for rejected
    };

    ChangeStatusOrganizerApi(data)
      .then((res) => {
        setLoading(false);
        if (res?.status === 1) {
          toast.success(res?.message);
          fetchGetAllOrganizer(params); // Refresh the organizer list
        } else {
          toast.error(res?.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error(t("organizers.failedToChangeStatus"));
      });
  };

  // Function to handle modal confirm action
  const handleConfirm = () => {
    const newStatus = actionType === "approve" ? 2 : 3; // 1 for approved, 3 for rejected
    ChangeStatus(selectedOrganizer, newStatus);
    setModalShow(false);
  };

  const exportToCSV = () => {
    const data = GetAllOrganizer?.data || [];
    const headers = [t("organizers.organizerId"), t("organizers.name"), t("organizers.mobileNo"), t("organizers.gender"), t("organizers.emailId"), t("organizers.dateOfBirth"), t("organizers.city"), t("organizers.status")];
    const csvContent = [
      headers.join(","),
      ...data.map(org => [
        org.id,
        `"${org.first_name} ${org.last_name}"`,
        `"${org.country_code} ${org.phone_number}"`,
        org.gender === 1 ? t("organizers.male") : t("organizers.female"),
        org.email,
        org.date_of_birth ? new Date(org.date_of_birth).toLocaleDateString() : "N/A",
        `"${org.address || ""}"`,
        org.is_approved === 1 ? t("organizers.pending") : org.is_approved === 2 ? t("organizers.approved") : t("organizers.rejected")
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "organizers_export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  const handlePrint = () => {
    exportOrganizersToPDF(GetAllOrganizer?.data || []);
  }

  return (
    <DefaultLayout 
      search={search} 
      setSearch={setSearch} 
      setPage={setPage}
      searchPlaceholder={t("organizers.searchPlaceholder") || "Search by Hosts"}
    >
      <div>
        <div className="flex flex-wrap justify-between py-5">
          {/* Header */}
          <div className="flex lg:w-[40%] items-end mb-4 sm:mb-0">
            <h1 className="text-xl font-bold text-black">
              {t("organizers.manageHosts")}
            </h1>
          </div>

          {/* Actions & Tabs */}
          <div className="w-full flex lg:justify-end gap-3 items-center mt-5 lg:mt-0">
            {/* Export Buttons */}
            <button 
              onClick={exportToCSV} 
              className="flex items-center gap-2 bg-gradient-to-r from-brand-green to-brand-gray-green-2 text-white px-4 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 font-semibold text-sm"
            >
              <FaFileExcel /> {t("organizers.exportCSV")}
            </button>
            <button 
              onClick={handlePrint} 
              className="flex items-center gap-2 bg-gradient-to-r from-brand-pastel-gray-purple-1 to-brand-gray-purple-2 text-white px-4 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 font-semibold text-sm"
            >
              <FaPrint /> {t("organizers.printPDF")}
            </button>
          </div>

          <div className="flex justify-between w-full mt-5">
            {/* Approval Tabs */}
            <div className="flex gap-0">
              <button
                onClick={() => handleTabChange("Pending")}
                className={`px-4 py-3 text-sm w-28 font-semibold rounded-l-xl transition-all duration-300 ${
                  approvedTab === "Pending"
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/30 scale-105 z-10"
                    : "bg-white text-yellow-600 border-2 border-yellow-500/30 hover:border-yellow-500 hover:bg-yellow-50"
                }`}
              >
                {t("organizers.pending")}
              </button>
              <button
                onClick={() => handleTabChange("Approved")}
                className={`px-4 py-3 text-sm w-28 font-semibold transition-all duration-300 border-l-0 ${
                  approvedTab === "Approved"
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30 scale-105 z-10"
                    : "bg-white text-green-600 border-2 border-green-500/30 border-l-0 hover:border-green-500 hover:bg-green-50"
                }`}
              >
                {t("organizers.approved")}
              </button>
              <button
                onClick={() => handleTabChange("Rejected")}
                className={`px-4 py-3 text-sm w-28 font-semibold rounded-r-xl transition-all duration-300 border-l-0 ${
                  approvedTab === "Rejected"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 scale-105 z-10"
                    : "bg-white text-red-600 border-2 border-red-500/30 border-l-0 hover:border-red-500 hover:bg-red-50"
                }`}
              >
                {t("organizers.rejected")}
              </button>
            </div>

            {/* Active Tabs (only visible in "Approved" tab) */}
            {approvedTab === "Approved" && (
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setStatus("1"); // Active
                    setPage(1);
                  }}
                  className={`px-4 py-3 text-sm w-28 font-semibold rounded-l-xl transition-all duration-300 ${
                    status === "1"
                      ? "bg-green-600 text-white shadow-lg shadow-green-600/30 scale-105"
                      : "bg-white text-green-600 border-2 border-green-600/30 hover:border-green-600 hover:bg-green-600/5"
                  }`}
                >
                  {t("organizers.active")}
                </button>
                <button
                  onClick={() => {
                    setStatus("2"); // Inactive
                    setPage(1);
                  }}
                  className={`px-4 py-3 text-sm w-28 font-semibold rounded-r-xl transition-all duration-300 ${
                    status === "2"
                      ? "bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105"
                      : "bg-white border-2 text-red-600 border-red-600/30 hover:border-red-600 hover:bg-red-600/5"
                  }`}
                >
                  {t("organizers.inactive")}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-brand-pastel-gray-purple-1/20 p-5 mb-5 hover:shadow-xl transition-shadow duration-300">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead className="bg-gradient-to-r from-brand-pastel-gray-purple-1/10 to-brand-gray-purple-2/10">
                <tr className="text-sm">
                  <th className="px-4 py-4 text-left font-semibold text-gray-700">
                    {t("organizers.organizerId")}
                  </th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700">
                    {t("organizers.name")}
                  </th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700">
                    {t("organizers.mobileNo")}
                  </th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700">
                    {t("organizers.gender")}
                  </th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700">
                    {t("organizers.emailId")}
                  </th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700">
                    {t("organizers.dateOfBirth")}
                  </th>
                    <th className="px-4 py-4 text-left font-semibold text-gray-700">
                    {t("organizers.city")}
                  </th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700">
                    {t("organizers.registrationType")}
                  </th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700">
                    {t("organizers.status")}
                  </th>
                  <th className="px-4 py-4 text-center font-semibold text-gray-700">
                    {t("organizers.action")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={11} className="py-3">
                      <Loader />
                    </td>
                  </tr>
                ) : GetAllOrganizer?.data?.length > 0 ? (
                  GetAllOrganizer?.data?.map((organizer, i) => (
                    <tr
                      key={i}
                      className="border-b last:border-0 text-sm font-medium text-black whitespace-nowrap"
                    >
                      <td className="px-2 py-2 whitespace-nowrap">
                        {organizer.id}
                      </td>
                      <td className="px-2 py-2 flex items-center space-x-3 w-max">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                          <Image
                            src={(() => {
                              const getImageUrl = (imgPath) => {
                                if (!imgPath) return "/assets/images/dummyImage.png";
                                if (imgPath.includes("https://") || imgPath.includes("httpss://")) return imgPath;
                                if (imgPath.startsWith("/uploads/")) {
                                  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "httpss://api.zuroona.sa";
                                  const baseUrl = apiBase.replace(/\/api\/admin\/?$/, "").replace(/\/api\/?$/, "");
                                  return `${baseUrl}${imgPath}`;
                                }
                                return "/assets/images/dummyImage.png";
                              };
                              return getImageUrl(organizer?.profile_image);
                            })()}
                            alt={organizer?.first_name ? `${organizer.first_name} ${organizer.last_name || ''}`.trim() : "Organizer profile"}
                            fill
                            className="object-cover"
                            sizes="40px"
                            onError={(e) => {
                              e.target.src = "/assets/images/dummyImage.png";
                            }}
                          />
                        </div>
                        <span className="font-medium">
                          {organizer.first_name} {organizer.last_name}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        {organizer.country_code} {organizer.phone_number}
                      </td>
                      <td className="px-2 py-2">
                        {organizer.gender === 1 ? t("organizers.male") : t("organizers.female")}
                      </td>
                      <td className="px-2 py-2">{organizer.email}</td>
                      <td className="px-2 py-2">
                        {organizer.date_of_birth
                          ? new Date(
                            organizer.date_of_birth
                          ).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-2 py-2">{organizer.address || "N/A"}</td>
                      <td className="px-2 py-2">
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                          organizer.registration_type === 'Re-apply' 
                            ? 'bg-orange-100 text-orange-700 border border-orange-300' 
                            : 'bg-blue-100 text-blue-700 border border-blue-300'
                        }`}>
                          {organizer.registration_type === 'Re-apply' ? t("organizers.reApply") : t("organizers.new")}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-2">
                          {approvedTab === "Pending" && (
                            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300">
                              {t("organizers.pending")}
                            </span>
                          )}
                          {approvedTab === "Approved" && (
                            <span
                              className={`text-sm font-semibold px-3 py-1 rounded-full border ${
                                (() => {
                                  // Check if suspended
                                  if (organizer.is_suspended) {
                                    return "bg-purple-100 text-purple-700 border-purple-300";
                                  }
                                  // Check if last ticket purchase is more than 1 month ago
                                  if (organizer.last_booking_date || organizer.last_ticket_date) {
                                    const lastBookingDate = new Date(organizer.last_booking_date || organizer.last_ticket_date);
                                    const oneMonthAgo = new Date();
                                    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                                    
                                    // If last booking is more than 1 month ago, show inactive
                                    if (lastBookingDate < oneMonthAgo) {
                                      return "bg-red-100 text-red-700 border-red-300";
                                    }
                                  }
                                  // Default to organizer's isActive status
                                  return organizer.isActive === 1 ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300";
                                })()
                              }`}
                            >
                              {(() => {
                                // Check if suspended
                                if (organizer.is_suspended) {
                                  return t("organizers.suspended");
                                }
                                // Check if last ticket purchase is more than 1 month ago
                                if (organizer.last_booking_date || organizer.last_ticket_date) {
                                  const lastBookingDate = new Date(organizer.last_booking_date || organizer.last_ticket_date);
                                  const oneMonthAgo = new Date();
                                  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                                  
                                  // If last booking is more than 1 month ago, show inactive
                                  if (lastBookingDate < oneMonthAgo) {
                                    return t("organizers.inactive");
                                  }
                                  return t("organizers.active");
                                }
                                // Default to organizer's isActive status
                                return organizer.isActive === 1 ? t("organizers.active") : t("organizers.inactive");
                              })()}
                            </span>
                          )}
                          {approvedTab === "Rejected" && (
                            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700 border border-red-300">
                              {t("organizers.rejected")}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex gap-2 justify-center items-center">
                          <Link
                            href={`/organizer/detail/${organizer._id}`}
                            className="text-brand-pastel-gray-purple-1 hover:text-brand-gray-purple-2 transition-colors duration-300 p-2 rounded-lg hover:bg-brand-pastel-gray-purple-1/10"
                          >
                            <Image
                              src="/assets/images/home/eye-outline.png"
                              alt={t("organizers.view")}
                              height={20}
                              width={20}
                              className="transition-transform duration-300 hover:scale-110"
                            />
                          </Link>
                          {/* Check button for approval */}
                          {/* For Pending tab, only show view button - accept/reject moved to detail page */}
                          {approvedTab === "Approved" && (
                            <>
                              <ToggleSwitch
                                isOn={organizer.isActive === 1}
                                handleToggle={() => handleToggleClick(organizer)}
                              />
                              <button
                                onClick={() => handleSuspendClick(organizer)}
                                className={`p-2 rounded-lg transition-colors ${
                                  organizer.is_suspended 
                                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                                }`}
                                title={organizer.is_suspended ? t("organizers.unsuspendHost") : t("organizers.suspendHost")}
                              >
                                {organizer.is_suspended ? '✓' : '⏸'}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="py-3 text-center">
                      {t("common.noDataAvailable")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {GetAllOrganizer?.data?.length > 0 && (
          <Paginations
            handlePage={handlePage}
            page={page}
            total={GetAllOrganizer?.total_count}
            itemsPerPage={itemsPerPage}
          />
        )}

        {/* Approval Modal */}
        <ApprovalModal
          show={modalShow}
          onClose={() => setModalShow(false)}
          onConfirm={handleConfirm}
          title={
            actionType === "approve" ? t("organizers.approveOrganizer") : t("organizers.rejectOrganizer")
          }
          message={
            actionType === "approve"
              ? t("organizers.confirmApproveOrganizer")
              : t("organizers.confirmRejectOrganizer")
          }
        />
        <StatusConfirmation
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmToggle}
          organizer={selectedOrganierEvent}
        />
        <SuspendHostModal
          isOpen={suspendModalOpen}
          onClose={() => {
            setSuspendModalOpen(false);
            setSelectedOrganizerForSuspend(null);
          }}
          onConfirm={handleConfirmSuspend}
          organizer={selectedOrganizerForSuspend}
        />
      </div>
    </DefaultLayout>
  );
}

