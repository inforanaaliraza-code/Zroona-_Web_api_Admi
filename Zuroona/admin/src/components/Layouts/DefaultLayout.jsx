"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DefaultLayout({ children, title, breadcrumbs, search, setSearch, setPage, searchPlaceholder }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isRTL } = useSelector((state) => state.language);

  return (
    <>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex min-h-screen bg-[#b0a0df] transition-all duration-300">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div 
          className={`min-w-0 w-full overflow-auto relative flex flex-1 flex-col px-3 sm:px-6 transition-all duration-300 ${
            isRTL ? 'lg:mr-[320px]' : 'lg:ml-[320px]'
          }`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* <!-- ===== Header Start ===== --> */}
          <Header 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen} 
            title={title} 
            breadcrumbs={breadcrumbs} 
            search={search}
            setSearch={setSearch}
            setPage={setPage}
            searchPlaceholder={searchPlaceholder}
          />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main className="flex-1 py-4 sm:py-6 w-full min-w-0 animate-fade-in">
            <div className="w-full min-w-0 max-w-screen-2xl mx-auto px-0 sm:px-0">
              <div className="w-full min-w-0 transition-all duration-300">
                {children}
              </div>
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
}
