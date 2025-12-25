"use client";

import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Loader from "@/components/Loader/Loader";
import Paginations from "@/components/Paginations/Pagination";
import Image from "next/image";
import { toast } from "react-toastify";
import { FaFileExcel, FaPrint, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { exportToPDF } from "@/utils/exportUtils";
import AdminModal from "@/components/Modals/AdminModal";
import { GetAllAdminsApi, DeleteAdminApi } from "@/api/admin/apis";

export default function AdminManagement() {
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
      toast.error("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;
    setLoading(true);
    try {
      const res = await DeleteAdminApi({ id });
      if (res?.status === 1 || res?.code === 200) {
        toast.success("Admin deleted successfully");
        fetchAdmins();
      } else {
        toast.error(res?.message || "Failed to delete admin");
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast.error("Failed to delete admin");
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
    const headers = ["Admin ID", "Admin Name", "Username", "Mobile Number", "Email"];
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
            <h1 className="text-xl font-bold text-black">Admin Management</h1>
          </div>

          <div className="w-full flex lg:justify-end gap-3 items-center mt-5 lg:mt-0">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-[#a797cc] text-white px-4 py-2 rounded hover:bg-[#a08ec8] transition"
            >
              <FaPlus /> Add Admin
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition"
            >
              <FaFileExcel /> Export CSV
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
            >
              <FaPrint /> Print/PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead className="bg-[#f3f7ff]">
                <tr className="text-sm">
                  <th className="px-4 py-4 text-left font-base text-gray-600">Admin ID</th>
                  <th className="px-4 py-4 text-left font-base text-gray-600">Photo</th>
                  <th className="px-4 py-4 text-left font-base text-gray-600">Admin Name</th>
                  <th className="px-4 py-4 text-left font-base text-gray-600">Username</th>
                  <th className="px-4 py-4 text-left font-base text-gray-600">Mobile Number</th>
                  <th className="px-4 py-4 text-left font-base text-gray-600">Email</th>
                  <th className="px-4 py-4 text-left font-base text-gray-600">Type</th>
                  <th className="px-4 py-4 text-center font-base text-gray-600">Action</th>
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
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={admin.profile_image || "/assets/images/home/Profile.png"}
                            alt={admin.admin_name}
                            height={40}
                            width={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-2 py-2">{admin.admin_name}</td>
                      <td className="px-2 py-2">{admin.username}</td>
                      <td className="px-2 py-2">{admin.mobile_number}</td>
                      <td className="px-2 py-2">{admin.email || "N/A"}</td>
                      <td className="px-2 py-2">
                        <span className={`text-sm font-medium ${
                          admin.is_main ? "text-[#a797cc]" : "text-gray-600"
                        }`}>
                          {admin.is_main ? "Main Admin" : "Admin"}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex gap-2 justify-center items-center">
                          <button
                            onClick={() => handleEdit(admin)}
                            className="text-[#a797cc] hover:text-[#a08ec8]"
                            title="Edit"
                          >
                            <FaEdit size={18} />
                          </button>
                          {!admin.is_main && (
                            <button
                              onClick={() => handleDelete(admin._id)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete"
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
                      No Data Available
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
          />
        )}
      </div>
    </DefaultLayout>
  );
}

