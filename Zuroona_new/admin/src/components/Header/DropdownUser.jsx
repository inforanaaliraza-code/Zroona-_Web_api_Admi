"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import ClickOutside from "./ClickOutside";
import Cookies from "js-cookie";
import { TOKEN_NAME } from "@/until";
import { GetCurrentAdminApi } from "@/api/admin/apis";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await GetCurrentAdminApi();
        if (res?.status === 1 || res?.code === 200) {
          const admin = res?.data || res;
          setAdminData({
            admin_name: `${admin.firstName || ''} ${admin.lastName || ''}`.trim() || "Admin",
          });
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setAdminData({
          admin_name: "Admin",
        });
      }
    };
    fetchAdminData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-x-2 sm:gap-x-3 group hover:bg-white/50 rounded-xl px-2 py-1.5 transition-all duration-300"
        href="#"
      >
        <span className="text-right">
          <span className="block text-[0.600rem] sm:text-xs font-medium text-gray-600 group-hover:text-brand-pastel-gray-purple-1 transition-colors duration-300">
            {getGreeting()}
          </span>
          <h1 className="text-sm sm:text-lg leading-5 font-semibold text-gray-800 group-hover:text-brand-gray-purple-2 transition-colors duration-300">
            {adminData?.admin_name || "Admin"}
          </h1>
        </span>
        <span className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-[#a797cc] to-[#8b7ab8] flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105 border-2 border-brand-pastel-gray-purple-1/30 group-hover:border-brand-pastel-gray-purple-1">
          <FaUserCircle className="text-white text-2xl sm:text-3xl" />
        </span>
      </Link>
      {/* <!-- Dropdown End --> */}
    </ClickOutside>
  );
};

export default DropdownUser;
