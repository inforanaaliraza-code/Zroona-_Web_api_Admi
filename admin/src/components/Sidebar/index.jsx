"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LogOutIcon } from "lucide-react";
import SidebarItem from "./SidebarItem";
import ClickOutside from "../Header/ClickOutside";
import useLocalStorage from "../hooks/useLocalStorage";
import { TOKEN_NAME, menuGroups } from "@/until";
import Cookies from "js-cookie";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");



  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed overflow-hidden left-0 top-0 z-[9999] px-6 flex h-screen w-72.5 flex-col bg-gradient-to-br from-brand-gray-purple-2 via-brand-pastel-gray-purple-1 to-brand-gray-purple-3 shadow-elevated duration-300 ease-linear lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-center mt-8">
          <Link href="/" className="">
            <Image
              width={100}
              height={100}
              src="/assets/images/final_Zuroona.png"
              alt="Zuroona Logo"
              className="object-contain"
            />
          </Link>
        </div>

        {/* Sidebar Menu */}
        <div className="flex flex-col flex-grow">
          <nav className="mt-5 py-4 overflow-y-auto w-full h-[63vh] scroll-smooth" style={{ scrollbarWidth: "none" }}>
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <ul className="mb-6 flex flex-col gap-5">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="mt-auto p-4">
          <span className="text-sm">2024 All Right Reserved</span>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
