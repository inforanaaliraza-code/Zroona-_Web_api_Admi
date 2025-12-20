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
        className="flex items-center gap-x-2 sm:gap-x-3"
        href="#"
      >
        <span className="text-right">
          <span className="block text-[0.600rem] sm:text-xs font-medium text-black">
            {getGreeting()}
          </span>
          <h1 className="text-sm sm:text-lg leading-5 text-black">
            {adminData?.admin_name || "Admin"}
          </h1>
        </span>
        <span className="h-10 w-10 rounded-full border border-white overflow-hidden">
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
