"use client";

import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Loader from "@/components/Loader/Loader";
import Paginations from "@/components/Paginations/Pagination";
import { toast } from "react-toastify";
import { FaFileExcel, FaPrint, FaPlus, FaEdit, FaTrash, FaUserCircle } from "react-icons/fa";
import { exportToPDF } from "@/utils/exportUtils";
import AdminModal from "@/components/Modals/AdminModal";
import { GetAllAdminsApi, DeleteAdminApi } from "@/api/admin/apis";
import { useTranslation } from "react-i18next";

export default function AdminManagement() {
  const { t } = useTranslation();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, [page, search]);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await GetAllAdminsApi({ page, limit: itemsPerPage, search });
      if (res?.status === 1 || res?.code === 200) {
        setAdmins(res?.data || []);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error(t("common.failedToFetchAdmins"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t("common.confirmDeleteAdmin"))) return;
    setLoading(true);
    try {
      const res = await DeleteAdminApi({ id });
      if (res?.status === 1 || res?.code === 200) {
        toast.success(t("common.adminDeleted"));
        fetchAdmins();
      } else {
        toast.error(res?.message || t("common.failedToDeleteAdmin"));
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast.error(t("common.failedToDeleteAdmin"));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingAdmin(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingAdmin(null);
    fetchAdmins();
  };

  const exportToCSV = () => {
    const headers = [t("common.adminId"), t("common.adminName"), t("common.username"), t("common.mobileNumber"), t("common.email")];
    const csvContent = [
      headers.join(","),
      ...admins.map(admin => [
        admin._id,
        `"${admin.admin_name}"`,
        `"${admin.username}"`,
        `"${admin.mobile_number}"`,
        admin.email
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "admins_export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DefaultLayout search={search} setSearch={setSearch} setPage={setPage}>
      <div>
        <div className="flex flex-wrap justify-between py-5">
          <div className="flex lg:w-[40%] items-end mb-4 sm:mb-0">
            <h1 className="text-xl font-bold text-black">{t("common.adminManagement")}</h1>
          </div>

          <div className="w-full flex lg:justify-end gap-3 items-center mt-5 lg:mt-0">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-[#a797cc] text-white px-4 py-2 rounded hover:bg-[#a08ec8] transition"
            >
              <FaPlus /> {t("common.addAdmin")}
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition"
            >
              <FaFileExcel /> {t("common.exportCSV")}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
            >
              <FaPrint /> {t("common.printPDF")}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead className="bg-[#f3f7ff]">
                <tr className="text-sm">
                  <th className="px-4 py-4 text-left font-base text-gray-600">{t("common.adminId")}</th>
                  <th className="px-4 py-4 text-left font-base text-gray-600">{t("common.photo")}</th>
                  <th className="px-4 py-4 text-left font-base text-gray-600">{t("common.adminName")}</th>
                  <th className="px-4 py-4 text-left font-base text-gray-600">{t("common.username")}</th>
                  <th className="px-4 py-4 text-left font-base text-gray-600">{t("common.mobileNumber")}</th>
                  <th className="px-4 py-4 text-left font-base text-gray-600">{t("common.email")}</th>
                  <th className="px-4 py-4 text-left font-base text-gray-600">{t("common.type")}</th>
                  <th className="px-4 py-4 text-center font-base text-gray-600">{t("common.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-3">
                      <Loader />
                    </td>
                  </tr>
                ) : admins.length > 0 ? (
                  admins.map((admin) => (
                    <tr
                      key={admin._id}
                      className="border-b last:border-0 text-sm font-medium text-black"
                    >
                      <td className="px-2 py-2">{admin._id}</td>
                      <td className="px-2 py-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#a797cc] to-[#8b7ab8] flex items-center justify-center shadow-md">
                          <FaUserCircle className="text-white text-xl" />
                        </div>
                      </td>
                      <td className="px-2 py-2">{admin.admin_name}</td>
                      <td className="px-2 py-2">{admin.username}</td>
                      <td className="px-2 py-2">{admin.mobile_number}</td>
                      <td className="px-2 py-2">{admin.email || (t("eventTypeLegacy.notAvailable") || "N/A")}</td>
                      <td className="px-2 py-2">
                        <span className={`text-sm font-medium ${
                          admin.is_main ? "text-[#a797cc]" : "text-gray-600"
                        }`}>
                          {admin.is_main ? t("common.mainAdmin") : t("common.admin")}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex gap-2 justify-center items-center">
                          <button
                            onClick={() => handleEdit(admin)}
                            className="text-[#a797cc] hover:text-[#a08ec8]"
                            title={t("common.edit")}
                          >
                            <FaEdit size={18} />
                          </button>
                          {!admin.is_main && (
                            <button
                              onClick={() => handleDelete(admin._id)}
                              className="text-red-600 hover:text-red-800"
                              title={t("common.delete")}
                            >
                              <FaTrash size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-3 text-center">
                      {t("common.noDataAvailable")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {admins.length > 0 && (
          <Paginations
            handlePage={setPage}
            page={page}
            total={admins.length}
            itemsPerPage={itemsPerPage}
          />
        )}

        {showModal && (
          <AdminModal
            show={showModal}
            onClose={handleModalClose}
            admin={editingAdmin}
            onSuccess={() => {
              fetchAdmins();
            }}
          />
        )}
      </div>
    </DefaultLayout>
  );
}

