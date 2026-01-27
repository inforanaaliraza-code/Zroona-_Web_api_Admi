"use client";

import { useDataStore } from "@/api/store/store";
import { ActiveInActiveUserApi, DeleteUserApi } from "@/api/user/apis"; // Ensure DeleteUserApi is imported
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Loader from "@/components/Loader/Loader";
import Paginations from "@/components/Paginations/Pagination";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaFileExcel, FaPrint, FaTrash, FaBan, FaCheckCircle, FaStar } from "react-icons/fa"; 
import { exportUsersToCSV, exportUsersToPDF } from "@/utils/exportUtils";
import { useTranslation } from "react-i18next";

export default function UserManagement() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("Active");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1); // Reset to first page when changing tabs
  };

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("1");
  const [loading, setLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handlePage = (value) => {
    setPage(value);
  };

  // Build params based on active tab
  const params = {
    page: page,
    limit: 10,
    search: search,
    ...(activeTab === "Active" ? { status: "Active" } : 
        activeTab === "Inactive" ? { status: "Inactive" } : 
        activeTab === "Suspended" ? { status: "Suspended" } : 
        activeTab === "Deleted" ? { status: "Deleted" } :
        { isActive: status === "1" ? true : false }) // Legacy fallback
  };

  const GetAllUser = useDataStore((store) => store.GetAllUser);
  const { fetchGetAllUser } = useDataStore();

  useEffect(() => {
    setLoading(true);
    fetchGetAllUser(params).then(() => {
      setLoading(false);
    });
  }, [page, activeTab, search]);

  const ChangeStatus = (data) => {
    if (!confirm(t("common.changeStatus"))) return;
    setLoading(true);
    ActiveInActiveUserApi(data).then((res) => {
      if (res?.status === 1) {
        toast.success(res?.message);
        fetchGetAllUser(params).then(() => {
          setLoading(false);
        });
      } else {
        toast.error(res?.message);
        setLoading(false);
      }
    }).catch((error) => {
      console.error("Error changing status:", error);
      toast.error(t("users.failedToChangeStatus") || "Failed to change status");
      setLoading(false);
    });
  };

  const handleDelete = (id) => {
    if (!confirm(t("users.confirmDeleteUser"))) return;
    // Assuming DeleteUserApi exists and takes ID
    // If not imported, check api/user/apis.
    // Based on imports above, it is imported.
    setLoading(true);
    DeleteUserApi({ userId: id }).then((res) => { // Check API signature, usually object or ID
      if (res?.status === 1 || res?.code === 200) {
        toast.success(t("users.userDeleted"));
        fetchGetAllUser(params);
      } else {
        toast.error(res?.message || t("users.failedToDeleteUser"));
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }

  const exportToCSV = () => {
    const data = GetAllUser?.data || [];
    const headers = [t("users.userId"), t("users.name"), t("users.mobileNo"), t("users.gender"), t("users.emailId"), t("users.dateOfBirth"), t("users.city"), t("users.nationality")];
    const csvContent = [
      headers.join(","),
      ...data.map(user => [
        user.id,
        `"${user.first_name} ${user.last_name}"`,
        `"${user.country_code} ${user.phone_number}"`,
        user.gender === 1 ? t("users.male") : t("users.female"),
        user.email,
        user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : "N/A",
        `"${user.address || ""}"`,
        `"${user.nationality || ""}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "guests_export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  const handlePrint = () => {
    window.print();
  }

  return (
    <DefaultLayout 
      search={search} 
      setSearch={setSearch} 
      setPage={setPage}
      searchPlaceholder={t("users.searchPlaceholder") || "Search by Guests"}
    >
      <div>
        <div className="flex flex-col sm:flex-row justify-between py-5">
          {/* Header */}
          <div className="flex lg:w-[40%] items-end mb-4 sm:mb-0">
            <h1 className="text-xl font-bold text-black">{t("users.guestsManagement")}</h1>
          </div>

          {/* Actions & Tabs */}
          <div className="lg:w-full flex lg:justify-end gap-3 items-center">
            {/* Export Buttons */}
            <button onClick={() => exportUsersToCSV(GetAllUser?.data || [])} className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition">
              <FaFileExcel /> {t("users.exportCSV")}
            </button>
            <button onClick={() => exportUsersToPDF(GetAllUser?.data || [])} className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition">
              <FaPrint /> {t("users.exportPDF")}
            </button>

            <div className="flex ml-4">
              <button
                onClick={() => handleTabChange("Active")}
                className={`px-4 py-3 text-sm w-28 font-medium rounded-s-lg ${activeTab === "Active"
                    ? "bg-green-600 text-white"
                    : "bg-white text-green-600 border-2 border-green-600"
                  }`}
              >
                {t("users.active")}
              </button>
              <button
                onClick={() => handleTabChange("Inactive")}
                className={`px-4 py-3 text-sm w-28 font-medium rounded-none border-l-0 ${activeTab === "Inactive"
                    ? "bg-red-600 text-white"
                    : "bg-white border-2 text-red-600 border-red-600"
                  }`}
              >
                {t("users.inactive")}
              </button>
              <button
                onClick={() => handleTabChange("Suspended")}
                className={`px-4 py-3 text-sm w-28 font-medium rounded-none border-l-0 ${activeTab === "Suspended"
                    ? "bg-yellow-600 text-white"
                    : "bg-white border-2 text-yellow-600 border-yellow-600"
                  }`}
              >
                {t("users.suspended") || "Suspended"}
              </button>
              <button
                onClick={() => handleTabChange("Deleted")}
                className={`px-4 py-3 text-sm w-28 font-medium rounded-e-lg ${activeTab === "Deleted"
                    ? "bg-gray-600 text-white"
                    : "bg-white border-2 text-gray-600 border-gray-600"
                  }`}
              >
                {t("users.deleted") || "Deleted"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead className="bg-[#f3f7ff]">
                <tr className="text-sm">
                  <th className="px-2 py-4 text-left font-base text-gray-600">
                    {t("users.userId")}
                  </th>
                  <th className="px-2 py-4 text-left font-base text-gray-600">
                    {t("users.name")}
                  </th>
                  <th className="px-2 py-4 text-left font-base text-gray-600">
                    {t("users.mobileNo")}
                  </th>
                  <th className="px-2 py-4 text-left font-base text-gray-600">
                    {t("users.gender")}
                  </th>
                  <th className="px-2 py-4 text-left font-base text-gray-600">
                    {t("users.emailId")}
                  </th>
                  <th className="px-2 py-4 text-left font-base text-gray-600">
                    {t("users.dateOfBirth")}
                  </th>
                  <th className="px-2 py-4 text-left font-base text-gray-600">
                    {t("users.city")}
                  </th>
                  <th className="px-2 py-4 text-left font-base text-gray-600">
                    {t("users.nationality")}
                  </th>
                  <th className="px-2 py-4 text-left font-base text-gray-600">
                    {t("users.status")}
                  </th>
                  <th className="px-2 py-4 text-center font-base text-gray-600">
                    {t("users.action")}
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
                ) : GetAllUser?.data?.length > 0 ? (
                  GetAllUser?.data?.map((user, i) => (
                    <tr
                      key={i}
                      className="border-b last:border-0 text-sm font-medium text-black whitespace-nowrap"
                    >
                      <td className="px-2 py-2 whitespace-nowrap">{user.id}</td>
                      <td className="px-2 py-2 flex items-center space-x-3 w-max">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={
                              user?.profile_image?.includes("http")
                                ? user?.profile_image
                                : "/assets/images/dummyImage.png"
                            }
                            alt={user.name}
                            height={42}
                            width={42}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span>
                          {user.first_name} {user.last_name}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        {user.country_code} {user.phone_number}
                      </td>
                      <td className="px-2 py-2">
                        {user.gender === 1 ? t("users.male") : t("users.female")}
                      </td>
                      <td className="px-2 py-2">{user.email}</td>
                      <td className="px-2 py-2">
                        {user.date_of_birth
                          ? new Date(user.date_of_birth).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-2 py-2">{user.address || "N/A"}</td>
                      <td className="px-2 py-2">{user.nationality || "N/A"}</td>
                      <td className="px-2 py-2">
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${
                          user.is_delete === 1
                            ? "bg-gray-100 text-gray-700 border-gray-300"
                            : user.is_suspended 
                            ? "bg-yellow-100 text-yellow-700 border-yellow-300" 
                            : user.isActive 
                            ? "bg-green-100 text-green-700 border-green-300" 
                            : "bg-red-100 text-red-700 border-red-300"
                        }`}>
                          {user.is_delete === 1
                            ? (t("users.deleted") || "Deleted")
                            : user.is_suspended 
                            ? (t("users.suspended") || "Suspended")
                            : user.isActive 
                            ? t("users.active") 
                            : t("users.inactive")}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex gap-2 items-center justify-center">
                          <Link
                            href={`/user/detail/${user._id}`}
                            className="text-[#a797cc] hover:text-[#a08ec8]"
                            title={t("users.viewDetails")}
                          >
                            <Image
                              src="/assets/images/home/eye-outline.png"
                              alt={t("users.viewDetails")}
                              height={20}
                              width={20}
                            />
                          </Link>
                          {/*
                          <button className="text-yellow-500 hover:text-yellow-600" title="View Rating">
                             <FaStar size={18} />
                          </button>
                          */}
                          {user.is_delete === 1 ? (
                            <button
                              onClick={() => {
                                // Reactivate deleted account
                                ChangeStatus({ userId: user._id, reactivate: true });
                              }}
                              className="text-green-500 hover:opacity-80"
                              title={t("users.reactivate") || "Reactivate Account"}
                            >
                              <FaCheckCircle size={18} />
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (user.is_suspended) {
                                  // Unsuspend: set isSuspended to false and isActive to true
                                  ChangeStatus({ userId: user._id, isSuspended: false, isActive: true });
                                } else if (!user.isActive) {
                                  // Activate: set isActive to true
                                  ChangeStatus({ userId: user._id, isActive: true });
                                } else {
                                  // Suspend: set isSuspended to true
                                  ChangeStatus({ userId: user._id, isSuspended: true });
                                }
                              }}
                              className={`${
                                user.is_suspended 
                                  ? 'text-yellow-500' 
                                  : user.isActive 
                                  ? 'text-red-500' 
                                  : 'text-green-500'
                              } hover:opacity-80`}
                              title={
                                user.is_suspended 
                                  ? (t("users.unsuspend") || "Unsuspend")
                                  : user.isActive 
                                  ? t("users.suspend") 
                                  : t("users.activate")
                              }
                            >
                              {user.is_suspended 
                                ? <FaBan size={18} /> 
                                : user.isActive 
                                ? <FaBan size={18} /> 
                                : <FaCheckCircle size={18} />}
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="text-red-600 hover:text-red-800"
                            title={t("users.delete")}
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan={13} className="pt-2">
                      {t("users.noDataFound")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {GetAllUser?.data?.length > 0 && (
          <Paginations
            handlePage={handlePage}
            page={page}
            total={GetAllUser?.total_count}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>
    </DefaultLayout>
  );
}
