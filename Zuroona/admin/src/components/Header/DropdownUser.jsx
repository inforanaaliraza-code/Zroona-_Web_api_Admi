"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
            profile_image: admin.image || "/assets/images/home/Profile.png",
          });
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setAdminData({
          admin_name: "Admin",
          profile_image: "/assets/images/home/Profile.png",
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
        <span className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-brand-pastel-gray-purple-1/30 overflow-hidden shadow-md group-hover:shadow-lg group-hover:border-brand-pastel-gray-purple-1 transition-all duration-300 group-hover:scale-105">
          <Image
            width={120}
            height={120}
            src={adminData?.profile_image || "/assets/images/home/Profile.png"}
            alt="Admin"
            className="w-full h-auto object-cover"
          />
        </span>
      </Link>
      {/* <!-- Dropdown End --> */}
    </ClickOutside>
  );
};

export default DropdownUser;
