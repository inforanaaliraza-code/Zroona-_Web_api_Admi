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
        className={`fixed left-0 top-0 z-[9999] flex h-screen w-[320px] flex-col bg-gradient-to-br from-brand-gray-purple-2 via-brand-pastel-gray-purple-1 to-brand-gray-purple-3 shadow-2xl duration-300 ease-in-out lg:translate-x-0 overflow-y-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "linear-gradient(135deg, #a797cc 0%, #b0a0df 50%, #a08ec8 100%)",
        }}
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none" />
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-center mt-6 mb-4 px-5 relative z-10 animate-fade-in flex-shrink-0">
          <Link href="/" className="group relative">
            <div className="absolute inset-0 bg-white/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
            <Image
              width={140}
              height={45}
              src="/assets/images/main-logo.png"
              alt="Zuroona Logo"
              className="object-contain relative z-10 transform group-hover:scale-105 transition-transform duration-300 w-auto h-auto max-h-[50px]"
            />
          </Link>
        </div>

        {/* Sidebar Menu */}
        <div className="flex flex-col flex-grow relative z-10 w-full px-5 min-w-0">
          <nav 
            className="py-2 w-full scroll-smooth" 
            style={{ scrollbarWidth: "thin" }}
          >
            {menuGroups.map((group, groupIndex) => (
              <div 
                key={groupIndex}
                className="animate-fade-in w-full"
                style={{ animationDelay: `${groupIndex * 0.1}s` }}
              >
                <ul className="mb-2 flex flex-col gap-2 w-full">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                      index={menuIndex}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="mt-auto px-5 py-4 relative z-10 border-t border-white/20 flex-shrink-0">
          <div className="flex items-center justify-center">
            <span className="text-xs text-white/80 font-medium text-center">
              © 2024 All Rights Reserved
            </span>
          </div>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
