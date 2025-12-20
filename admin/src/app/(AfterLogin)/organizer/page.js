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
import Paginations from "@/components/Paginations/Pagination";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaFileExcel, FaPrint } from "react-icons/fa";
import { exportOrganizersToPDF } from "@/utils/exportUtils";

export default function ManageEventOrganizer() {
  const [status, setStatus] = useState("1");
  const [approvedTab, setApprovedTab] = useState("Pending");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal state
  const [modalShow, setModalShow] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const [selectedOrganierEvent, setSelectedOrganierEvent] = useState(null);
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
      toast.error("Invalid organizer ID");
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
          toast.success(res?.message || "Status updated successfully");
          fetchGetAllOrganizer(params);
        } else {
          toast.error(res?.message || "Failed to update status");
        }
        setIsModalOpen(false);
        setSelectedOrganierEvent(null);
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Error updating organizer status");
        setIsModalOpen(false);
        setSelectedOrganierEvent(null);
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
        toast.error("Failed to change status");
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
    const headers = ["Organizer ID", "Name", "Mobile No.", "Gender", "Email ID", "Date of Birth", "City", "Status"];
    const csvContent = [
      headers.join(","),
      ...data.map(org => [
        org.id,
        `"${org.first_name} ${org.last_name}"`,
        `"${org.country_code} ${org.phone_number}"`,
        org.gender === 1 ? "Male" : "Female",
        org.email,
        org.date_of_birth ? new Date(org.date_of_birth).toLocaleDateString() : "N/A",
        `"${org.address || ""}"`,
        org.is_approved === 1 ? "Pending" : org.is_approved === 2 ? "Approved" : "Rejected"
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
    <DefaultLayout search={search} setSearch={setSearch} setPage={setPage}>
      <div>
        <div className="flex flex-wrap justify-between py-5">
          {/* Header */}
          <div className="flex lg:w-[40%] items-end mb-4 sm:mb-0">
            <h1 className="text-xl font-bold text-black">
              Manage Event Organizer
            </h1>
          </div>

          {/* Actions & Tabs */}
          <div className="w-full flex lg:justify-end gap-3 items-center mt-5 lg:mt-0">
            {/* Export Buttons */}
            <button onClick={exportToCSV} className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition">
              <FaFileExcel /> Export CSV
            </button>
            <button onClick={handlePrint} className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition">
              <FaPrint /> Print/PDF
            </button>
          </div>

          <div className="flex justify-between w-full mt-5">
            {/* Approvel Tabs */}
            <div className="flex">
              <button
                onClick={() => handleTabChange("Pending")}
                className={`px-4 py-3 text-sm w-28 font-medium rounded-l-lg ${approvedTab === "Pending"
                  ? "bg-[#f47c0c] text-white"
                  : "bg-white text-[#f47c0c] border-2 border-[#f47c0c]"
                  }`}
              >
                Pending
              </button>
              <button
                onClick={() => handleTabChange("Approved")}
                className={`px-4 py-3 text-sm w-28 font-medium ${approvedTab === "Approved"
                  ? "bg-[#f47c0c] text-white"
                  : "bg-white text-[#f47c0c] border-t-2 border-b-2 border-[#f47c0c]"
                  }`}
              >
                Approved
              </button>
              <button
                onClick={() => handleTabChange("Rejected")}
                className={`px-4 py-3 text-sm w-28 font-medium rounded-r-lg ${approvedTab === "Rejected"
                  ? "bg-[#f47c0c] text-white"
                  : "bg-white border-2 text-[#f47c0c] border-[#f47c0c]"
                  }`}
              >
                Rejected
              </button>
            </div>

            {/* Active Tabs (only visible in "Approved" tab) */}
            {approvedTab === "Approved" && (
              <div className="flex">
                <button
                  onClick={() => {
                    setStatus("1"); // Active
                    setPage(1);
                  }}
                  className={`px-4 py-3 text-sm w-28 font-medium rounded-s-lg ${status === "1"
                    ? "bg-[#f47c0c] text-white"
                    : "bg-white text-[#f47c0c] border-2 border-[#f47c0c]"
                    }`}
                >
                  Active
                </button>
                <button
                  onClick={() => {
                    setStatus("2"); // Inactive
                    setPage(1);
                  }}
                  className={`px-4 py-3 text-sm w-28 font-medium rounded-e-lg ${status === "2"
                    ? "bg-[#f47c0c] text-white"
                    : "bg-white border-2 text-[#f47c0c] border-[#f47c0c]"
                    }`}
                >
                  Inactive
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5 mb-5">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead className="bg-[#f3f7ff]">
                <tr className="text-sm">
                  <th className="px-4 py-4 text-left font-base text-gray-600">
                    Organizer ID
                  </th>
                  <th className="px-4 py-4 text-left font-base text-gray-600">
                    Name
                  </th>
                  <th className="px-4 py-4 text-left font-base text-gray-600">
                    Mobile No.
                  </th>
                  <th className="px-4 py-4 text-left font-base text-gray-600">
                    Gender
                  </th>
                  <th className="px-4 py-4 text-left font-base text-gray-600">
                    Email ID
                  </th>
                  <th className="px-4 py-4 text-left font-base text-gray-600">
                    Date of Birth
                  </th>
                    <th className="px-4 py-4 text-left font-base text-gray-600">
                    City
                  </th>
                  <th className="px-4 py-4 text-left font-base text-gray-600">
                    Status
                  </th>
                  <th className="px-4 py-4 text-center font-base text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="py-3">
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
                                if (imgPath.includes("http://") || imgPath.includes("https://")) return imgPath;
                                if (imgPath.startsWith("/uploads/")) {
                                  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3434";
                                  const baseUrl = apiBase.replace(/\/api\/admin\/?$/, "").replace(/\/api\/?$/, "");
                                  return `${baseUrl}${imgPath}`;
                                }
                                return "/assets/images/dummyImage.png";
                              };
                              return getImageUrl(organizer?.profile_image);
                            })()}
                            alt={organizer.first_name || "Organizer"}
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
                        {organizer.gender === 1 ? "Male" : "Female"}
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
                        <div className="flex items-center gap-2">
                          {approvedTab === "Pending" && (
                            <span className="text-sm font-medium text-yellow-500">
                              Pending
                            </span>
                          )}
                          {approvedTab === "Approved" && (
                            <span
                              className={`text-sm font-medium ${
                                (() => {
                                  // Check if last ticket purchase is more than 1 month ago
                                  if (organizer.last_booking_date || organizer.last_ticket_date) {
                                    const lastBookingDate = new Date(organizer.last_booking_date || organizer.last_ticket_date);
                                    const oneMonthAgo = new Date();
                                    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                                    
                                    // If last booking is more than 1 month ago, show inactive
                                    if (lastBookingDate < oneMonthAgo) {
                                      return "text-red-500";
                                    }
                                  }
                                  // Default to organizer's isActive status
                                  return organizer.isActive === 1 ? "text-green-500" : "text-red-500";
                                })()
                              }`}
                            >
                              {(() => {
                                // Check if last ticket purchase is more than 1 month ago
                                if (organizer.last_booking_date || organizer.last_ticket_date) {
                                  const lastBookingDate = new Date(organizer.last_booking_date || organizer.last_ticket_date);
                                  const oneMonthAgo = new Date();
                                  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                                  
                                  // If last booking is more than 1 month ago, show inactive
                                  if (lastBookingDate < oneMonthAgo) {
                                    return "Inactive";
                                  }
                                  return "Active";
                                }
                                // Default to organizer's isActive status
                                return organizer.isActive === 1 ? "Active" : "Inactive";
                              })()}
                            </span>
                          )}
                          {approvedTab === "Rejected" && (
                            <span className="text-sm font-medium text-red-500">
                              Rejected
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex gap-2 justify-center items-center">
                          <Link
                            href={`/organizer/detail/${organizer._id}`}
                            className="text-[#f47c0c] hover:text-orange-600"
                          >
                            <Image
                              src="/assets/images/home/eye-outline.png"
                              alt="View"
                              height={20}
                              width={20}
                            />
                          </Link>
                          {/* Check button for approval */}
                          {/* For Pending tab, only show view button - accept/reject moved to detail page */}
                          {approvedTab === "Approved" && (
                            <ToggleSwitch
                              isOn={organizer.isActive === 1}
                              handleToggle={() => handleToggleClick(organizer)}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-3 text-center">
                      No Data Available
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
            actionType === "approve" ? "Approve Organizer" : "Reject Organizer"
          }
          message={
            actionType === "approve"
              ? "Are you sure you want to approve this organizer?"
              : "Are you sure you want to reject this organizer?"
          }
        />
        <StatusConfirmation
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmToggle}
          organizer={selectedOrganierEvent}
        />
      </div>
    </DefaultLayout>
  );
}

