"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LogOutIcon } from "lucide-react";
import { useSelector } from "react-redux";
import SidebarItem from "./SidebarItem";
import ClickOutside from "../Header/ClickOutside";
import useLocalStorage from "../hooks/useLocalStorage";
import { TOKEN_NAME, menuGroups } from "@/until";
import Cookies from "js-cookie";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const { isRTL } = useSelector((state) => state.language);

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed top-0 z-[9999] flex h-screen w-[320px] flex-col shadow-2xl duration-300 ease-in-out lg:translate-x-0 overflow-y-auto border-r-2 border-purple-200/40 ${
          isRTL ? 'right-0' : 'left-0'
        } ${
          sidebarOpen ? "translate-x-0" : isRTL ? "translate-x-full" : "-translate-x-full"
        }`}
        style={{
          background: "linear-gradient(180deg, #faf5ff 0%, #ffffff 50%, #faf5ff 100%)",
        }}
      >
        {/* Light purple background pattern */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(167, 151, 204, 0.12) 0%, transparent 50%),
                             radial-gradient(circle at 80% 80%, rgba(196, 181, 253, 0.08) 0%, transparent 50%),
                             radial-gradient(circle at 40% 20%, rgba(167, 151, 204, 0.1) 0%, transparent 50%)`,
          }} />
        </div>
        
        {/* Sidebar Header with logo */}
        <div className="flex items-center justify-center mt-8 mb-6 px-5 relative z-10 animate-fade-in flex-shrink-0 border-b-2 border-purple-200/60 pb-6">
          <Link href="/" className="group relative block">
            {/* Glow effect on hover */}
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-200/40 via-green-200/40 to-purple-200/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Logo container with purple border */}
            <div className="relative z-10 p-4 rounded-xl bg-white shadow-md border-2 border-purple-200 group-hover:border-purple-400 group-hover:shadow-lg group-hover:shadow-purple-200/50 transition-all duration-300 group-hover:scale-105">
              <Image
                width={280}
                height={80}
                src="/assets/images/x_F_logo.png"
                alt="Zuroona Logo"
                className="object-contain relative z-10 transform transition-transform duration-300 w-full h-auto max-h-[70px]"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Sidebar Menu */}
        <div className="flex flex-col flex-grow relative z-10 w-full px-4 min-w-0">
          <nav 
            className="py-2 w-full scroll-smooth" 
            style={{ 
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(167, 151, 204, 0.5) transparent"
            }}
          >
            {menuGroups.map((group, groupIndex) => (
              <div 
                key={groupIndex}
                className="animate-fade-in w-full"
                style={{ animationDelay: `${groupIndex * 0.1}s` }}
              >
                <ul className="mb-3 flex flex-col gap-2 w-full">
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

        {/* Footer with purple border */}
        <div className="mt-auto px-5 py-5 relative z-10 flex-shrink-0 border-t-2 border-purple-200/60 bg-white/60">
          <div className="flex items-center justify-center">
            <span className="text-xs font-medium text-center text-purple-700/70">
              © 2024 All Rights Reserved
            </span>
          </div>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
