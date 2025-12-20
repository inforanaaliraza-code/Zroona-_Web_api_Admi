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

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("Active");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("1");
  const [loading, setLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handlePage = (value) => {
    setPage(value);
  };

  const params = {
    page: page,
    limit: 10,
    isActive: status === "1" ? true : false,
    search: search,
  };

  const GetAllUser = useDataStore((store) => store.GetAllUser);
  const { fetchGetAllUser } = useDataStore();

  useEffect(() => {
    setLoading(true);
    fetchGetAllUser(params).then(() => {
      setLoading(false);
    });
  }, [page, status, search]);

  const ChangeStatus = (data) => {
    if (!confirm("Are you sure you want to change status?")) return;
    setLoading(true);
    ActiveInActiveUserApi(data).then((res) => {
      if (res?.status === 1) {
        toast.success(res?.message);
        fetchGetAllUser(params);
        setLoading(false);
      } else {
        toast.error(res?.message);
        setLoading(false);
      }
    });
  };

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    // Assuming DeleteUserApi exists and takes ID
    // If not imported, check api/user/apis.
    // Based on imports above, it is imported.
    setLoading(true);
    DeleteUserApi({ userId: id }).then((res) => { // Check API signature, usually object or ID
      if (res?.status === 1 || res?.code === 200) {
        toast.success("User deleted successfully");
        fetchGetAllUser(params);
      } else {
        toast.error(res?.message || "Failed to delete");
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }

  const exportToCSV = () => {
    const data = GetAllUser?.data || [];
    const headers = ["User ID", "Name", "Mobile No.", "Gender", "Email ID", "Date of Birth", "City", "Nationality"];
    const csvContent = [
      headers.join(","),
      ...data.map(user => [
        user.id,
        `"${user.first_name} ${user.last_name}"`,
        `"${user.country_code} ${user.phone_number}"`,
        user.gender === 1 ? "Male" : "Female",
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
    <DefaultLayout search={search} setSearch={setSearch} setPage={setPage}>
      <div>
        <div className="flex flex-col sm:flex-row justify-between py-5">
          {/* Header */}
          <div className="flex lg:w-[40%] items-end mb-4 sm:mb-0">
            <h1 className="text-xl font-bold text-black">Guests Management</h1>
          </div>

          {/* Actions & Tabs */}
          <div className="lg:w-full flex lg:justify-end gap-3 items-center">
            {/* Export Buttons */}
            <button onClick={() => exportUsersToCSV(GetAllUser?.data || [])} className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition">
              <FaFileExcel /> Export CSV
            </button>
            <button onClick={() => exportUsersToPDF(GetAllUser?.data || [])} className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition">
              <FaPrint /> Export PDF
            </button>

            <div className="flex ml-4">
              <button
                onClick={() => handleTabChange("Active")}
                className={`px-4 py-3 text-sm w-28 font-medium rounded-s-lg ${activeTab === "Active"
                    ? "bg-[#f47c0c] text-white"
                    : "bg-white text-[#f47c0c] border-2 border-[#f47c0c]"
                  }`}
              >
                Active
              </button>
              <button
                onClick={() => handleTabChange("Inactive")}
                className={`px-4 py-3 text-sm w-28 font-medium rounded-e-lg ${activeTab === "Inactive"
                    ? "bg-[#f47c0c] text-white"
                    : "bg-white border-2 text-[#f47c0c] border-[#f47c0c]"
                  }`}
              >
                Inactive
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
                    User ID
                  </th>
                  <th className="px-2 py-4 text-left font-base text-gray-600">
                    Name
                  </th>
                  <th className="px-2 py-4 text-left font-base text-gray-600">
                    Mobile No.
                  </th>
                  <th className="px-2 py-4 text-left font-base text-gray-600">
                    Gender
                  </th>
                  <th className="px-2 py-4 text-left font-base text-gray-600">
                    Email ID
                  </th>
                  <th className="px-2 py-4 text-left font-base text-gray-600">
                    Date of Birth
                  </th>
                  <th className="px-2 py-4 text-left font-base text-gray-600">
                    City
                  </th>
                  <th className="px-2 py-4 text-left font-base text-gray-600">
                    Nationality
                  </th>
                  <th className="px-2 py-4 text-left font-base text-gray-600">
                    Status
                  </th>
                  <th className="px-2 py-4 text-center font-base text-gray-600">
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
                        {user.gender === 1 ? "Male" : "Female"}
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
                        <span className={`text-sm font-medium ${
                          user.isActive ? "text-green-500" : "text-red-500"
                        }`}>
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex gap-2 items-center justify-center">
                          <Link
                            href={`/user/detail/${user._id}`}
                            className="text-[#f47c0c] hover:text-orange-600"
                            title="View Details"
                          >
                            <Image
                              src="/assets/images/home/eye-outline.png"
                              alt=""
                              height={20}
                              width={20}
                            />
                          </Link>
                          {/*
                          <button className="text-yellow-500 hover:text-yellow-600" title="View Rating">
                             <FaStar size={18} />
                          </button>
                          */}
                          <button
                            onClick={() => ChangeStatus({ userId: user._id, isActive: !user.isActive })} // Assuming payload structure
                            className={`${user.isActive ? 'text-red-500' : 'text-green-500'} hover:opacity-80`}
                            title={user.isActive ? "Suspend" : "Activate"}
                          >
                            {user.isActive ? <FaBan size={18} /> : <FaCheckCircle size={18} />}
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
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
                      No Data Found
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
