"use client";

import { useDataStore } from "@/api/store/store";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ActiveInActiveUserApi, DeleteUserApi } from "@/api/user/apis";
import { FaStar, FaTrash, FaBan, FaCheckCircle } from "react-icons/fa";
import SuspendUserModal from "@/components/Modals/SuspendUserModal";

export default function UserDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const detail = useDataStore((store) => store.UserDetail);
  const { fetchUserDetail } = useDataStore();

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchUserDetail({ id: id })
        .then(() => setLoading(false))
        .catch((err) => {
          setLoading(false);
          toast.error("Failed to fetch User details");
        });
    }
  }, [id, fetchUserDetail]);

  const handleSuspend = () => {
    setSuspendModalOpen(true);
  };

  const handleConfirmSuspend = () => {
    setLoading(true);
    ActiveInActiveUserApi({ userId: detail?.user?._id, isActive: false })
      .then((res) => {
        if (res?.status === 1) {
          toast.success(res?.message || "Account suspended successfully");
          fetchUserDetail({ id: id });
          setSuspendModalOpen(false);
        } else {
          toast.error(res?.message || "Failed to suspend account");
        }
      })
      .catch((err) => {
        toast.error("Failed to suspend account");
      })
      .finally(() => {
        setLoading(false);
        setSuspendModalOpen(false);
      });
  };

  const handleActivate = () => {
    if (!confirm("Are you sure you want to activate this account?")) return;
    setLoading(true);
    ActiveInActiveUserApi({ userId: detail?.user?._id, isActive: true })
      .then((res) => {
        if (res?.status === 1) {
          toast.success(res?.message || "Account activated successfully");
          fetchUserDetail({ id: id });
        } else {
          toast.error(res?.message || "Failed to activate account");
        }
      })
      .catch((err) => {
        toast.error("Failed to activate account");
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this account? This action cannot be undone.")) return;
    setLoading(true);
    DeleteUserApi({ userId: detail?.user?._id })
      .then((res) => {
        if (res?.status === 1 || res?.code === 200) {
          toast.success("Account deleted successfully");
          router.push("/user");
        } else {
          toast.error(res?.message || "Failed to delete account");
        }
      })
      .catch((err) => {
        toast.error("Failed to delete account");
      })
      .finally(() => setLoading(false));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 1:
        return "Pending";
      case 2:
        return "Approved";
      case 3:
        return "Cancelled";
      default:
        return "Unknown Status";
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 1:
        return "text-green-600"; // Green for Approved
      case 2:
        return "text-yellow-600"; // Yellow for Pending
      case 3:
        return "text-blue-600"; // Blue for Paid
      default:
        return "#9e9e9e"; // Default color for unknown status
    }
  };

  return (
    <DefaultLayout>
      <div className="min-h-screen pb-10">
        <div className="py-5">
          <h1 className="text-xl font-bold text-black">User Detail</h1>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Organizer Info */}
            <div className="flex items-center sm:items-start flex-col sm:flex-row md:flex-row xl:flex-col lg:items-start xl:items-center col-span-full lg:col-span-full xl:col-span-1">
              <Image
                src={
                  detail?.user?.profile_image?.includes("http")
                    ? detail?.user?.profile_image
                    : "/assets/images/dummyImage.png"
                }
                alt="Organizer Photo"
                width={290}
                height={290}
                className="rounded-lg w-full sm:w-[290px] h-auto"
              />
              <div className="w-full py-5 sm:py-0 xl:py-5 px-0 sm:px-5 xl:px-0">
                <table className="table-auto w-full">
                  <tbody>
                    {/* Table Row - Organizer ID */}
                    <tr className="border-b border-gray-300">
                      <td className="w-2/5 py-2 xl:py-1 text-left text-sm font-semibold text-gray-800 whitespace-nowrap">
                        Organizer ID:
                      </td>
                      <td className="py-2 xl:py-1 text-left text-sm text-gray-600 font-semibold break-all">
                        {detail?.user?._id}
                      </td>
                    </tr>

                    {/* Table Row - Name */}
                    <tr className="border-b border-gray-300">
                      <td className="w-2/5 py-2 xl:py-1 text-left text-sm font-semibold text-gray-800 whitespace-nowrap">
                        Name:
                      </td>
                      <td className="py-2 xl:py-1 text-left text-sm text-gray-600 font-semibold break-all">
                        {detail?.user?.first_name} {detail?.user?.last_name}
                      </td>
                    </tr>

                    {/* Table Row - Email */}
                    <tr className="border-b border-gray-300">
                      <td className="flex py-2 xl:py-1 text-left text-sm font-semibold text-gray-800 whitespace-nowrap">
                        Email Address:
                      </td>
                      <td className="py-2 xl:py-1 text-left text-sm text-gray-600 font-semibold break-all">
                        {detail?.user?.email}
                      </td>
                    </tr>

                    {/* Table Row - Phone No */}
                    <tr className="border-b border-gray-300">
                      <td className="w-2/5 py-2 xl:py-1 text-left text-sm font-semibold text-gray-800 whitespace-nowrap">
                        Phone No:
                      </td>
                      <td className="py-2 xl:py-1 text-left text-sm text-gray-600 font-semibold break-all">
                        {detail?.user?.country_code}{" "}
                        {detail?.user?.phone_number}
                      </td>
                    </tr>

                    {/* Table Row - Gender */}
                    <tr className="border-b border-gray-300">
                      <td className="w-2/5 py-2 xl:py-1 text-left text-sm font-semibold text-gray-800 whitespace-nowrap">
                        Gender:
                      </td>
                      <td className="py-2 xl:py-1 text-left text-sm text-gray-600 font-semibold break-all">
                        {detail?.user?.gender === 1 ? "Male" : "Female"}
                      </td>
                    </tr>

                    {/* Table Row - Date of birth */}
                    <tr className="border-b border-gray-300">
                      <td className="w-2/5 py-2 xl:py-1 text-left text-sm font-semibold text-gray-800 whitespace-nowrap">
                        Date of birth:
                      </td>
                      <td className="py-2 xl:py-1 text-left text-sm text-gray-600 font-semibold break-all">
                        {detail?.user?.date_of_birth
                          ? new Date(
                              detail?.user?.date_of_birth
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>

                    {/* Table Row - City */}
                    <tr>
                      <td className="flex py-2 xl:py-1 text-left text-sm font-semibold text-gray-800">
                        City:
                      </td>
                      <td className="py-2 xl:py-1 text-left text-sm text-gray-600 font-semibold break-all">
                        {detail?.user?.address}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bio Section */}
            <div className="col-span-full lg:col-span-full xl:col-span-3">
              {/* Action Buttons */}
              <div className="bg-white p-6 rounded-lg mb-6">
                <div className="flex flex-wrap gap-3 items-center justify-between">
                  <h2 className="font-bold text-lg text-gray-900">Account Actions</h2>
                  <div className="flex flex-wrap gap-3">
                    {/* View Rating Button */}
                    <button
                      onClick={() => {
                        // Show rating modal or navigate to rating section
                        const ratingSection = document.getElementById('rating-section');
                        if (ratingSection) {
                          ratingSection.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          toast.info("Rating information will be displayed here");
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                    >
                      <FaStar /> View Rating
                    </button>
                    {/* Suspend/Activate Button */}
                    {detail?.user?.isActive ? (
                      <button
                        onClick={handleSuspend}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                      >
                        <FaBan /> Suspend Account
                      </button>
                    ) : (
                      <button
                        onClick={handleActivate}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                      >
                        <FaCheckCircle /> Activate Account
                      </button>
                    )}
                    {/* Delete Button */}
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      <FaTrash /> Delete Account
                    </button>
                  </div>
                </div>
              </div>

              {/* Rating Section */}
              <div id="rating-section" className="bg-white p-6 rounded-lg mb-6">
                <h2 className="font-bold text-lg text-gray-900 mb-4">User Rating</h2>
                {detail?.user?.rating || detail?.user?.average_rating ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      {Array(5).fill(0).map((_, index) => (
                        <FaStar
                          key={index}
                          className={`text-xl ${
                            index < Math.floor(detail?.user?.rating || detail?.user?.average_rating || 0)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold text-gray-800">
                      {(detail?.user?.rating || detail?.user?.average_rating || 0).toFixed(1)}
                    </span>
                    {detail?.user?.total_reviews && (
                      <span className="text-sm text-gray-600">
                        ({detail.user.total_reviews} reviews)
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No ratings available</p>
                )}
              </div>

              <div className="bg-white p-6 rounded-lg py-8">
                <h2 className="font-bold text-lg text-gray-900">Bio:</h2>
                <p className="text-sm text-gray-800 font-semibold mt-2">
                  {detail?.user?.description || "No bio available"}
                </p>
                {/* <p className="text-sm text-gray-800 font-semibold mt-10">
                  consectetur adipisci elit, sed eiusmod tempor incididunt ut
                  labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                  nostrum exercitationem ullam corporis suscipit laboriosam,
                  nisi ut aliquid ex ea commodi consequatur.consectetur adipisci
                  elit, sed eiusmod tempor incididunt ut labore et dolore magna
                  aliqua. Ut enim ad minim veniam, quis nostrum exercitationem
                  ullam corporis suscipit laboriosam, nisi ut aliquid ex ea
                  commodi consequatur.
                </p> */}
              </div>
              <div className="pt-7 pb-3">
                <h1 className="text-xl font-bold text-black">Booking Events</h1>
              </div>
              {/* Table */}
              <div className="bg-white rounded-lg p-5">
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg">
                    <thead className="bg-[#f3f7ff]">
                      <tr className="text-sm">
                        <th className="px-2 py-4 text-left font-base text-gray-600">
                          Event Name
                        </th>
                        <th className="px-2 py-4 text-left font-base text-gray-600">
                          Organizer
                        </th>
                        <th className="px-2 py-4 text-left font-base text-gray-600">
                          Date
                        </th>
                        <th className="px-2 py-4 text-left font-base text-gray-600">
                          Time
                        </th>
                        <th className="px-2 py-4 text-center font-base text-gray-600">
                          City
                        </th>
                        <th className="px-2 py-4 text-left font-base text-gray-600">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail?.book_events?.map((event) => (
                        <tr
                          key={event._id}
                          className="border-b last:border-0 text-xs font-semibold text-gray-600 whitespace-nowrap"
                        >
                          <td className="px-2 py-3">
                            <div className="flex items-center space-x-1 w-max">
                              <div className="w-16 h-9 rounded-lg overflow-hidden">
                                <Image
                                  src={
                                    (() => {
                                      const img = event?.event?.event_image || (event?.event?.event_images?.[0]);
                                      if (!img) return "/assets/images/dummyImage.png";
                                      if (img.includes("http://") || img.includes("https://")) return img;
                                      if (img.startsWith("/uploads/")) {
                                        const baseUrl = (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3434").replace(/\/api\/admin\/?$/, "").replace(/\/api\/?$/, "");
                                        return `${baseUrl}${img}`;
                                      }
                                      return "/assets/images/dummyImage.png";
                                    })()
                                  }
                                  alt={event.eventName}
                                  height={42}
                                  width={42}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span>{event?.event?.event_name}</span>
                            </div>
                          </td>
                          <td className="px-2 py-3">
                            <div className="flex items-center space-x-3 w-max">
                              <div className="w-10 h-10 rounded-full overflow-hidden">
                                <Image
                                  src={
                                    event?.organizer?.profile_image?.includes(
                                      "http"
                                    )
                                      ? event?.organizer?.profile_image
                                      : "/assets/images/dummyImage.png"
                                  }
                                  alt={event.name}
                                  height={42}
                                  width={42}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span>
                                {event?.organizer?.first_name}{" "}
                                {event?.organizer?.last_name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            {new Date(event?.event?.event_date).getDate()}{" "}
                            {new Date(event?.event?.event_date).toLocaleString(
                              "en-US",
                              { month: "short" }
                            )}{" "}
                            {new Date(event?.event?.event_date).getFullYear()}
                          </td>
                          <td className="px-4 py-4">
                            {new Date(
                              `1970-01-01T${event?.event?.event_start_time}`
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            -
                            {new Date(
                              `1970-01-01T${event?.event?.event_end_time}`
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="px-4 py-4">
                            {event?.event?.event_address || "N/A"}
                          </td>
                          <td
                            className={`px-4 py-4 ${getStatusColor(
                              event?.book_status
                            )}`}
                          >
                            {getStatusClass(event?.book_status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SuspendUserModal
        isOpen={suspendModalOpen}
        onClose={() => setSuspendModalOpen(false)}
        onConfirm={handleConfirmSuspend}
        user={detail?.user}
      />
    </DefaultLayout>
  );
}
