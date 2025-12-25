"use client";
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DefaultLayout({ children, title, breadcrumbs, search, setSearch, setPage }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex min-h-screen bg-[#b0a0df] transition-all duration-300">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="overflow-auto relative flex flex-1 flex-col lg:ml-[320px] px-4 sm:px-6 transition-all duration-300">
          {/* <!-- ===== Header Start ===== --> */}
          <Header 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen} 
            title={title} 
            breadcrumbs={breadcrumbs} 
            search={search}
            setSearch={setSearch}
            setPage={setPage} 
          />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main className="flex-1 py-6 animate-fade-in">
            <div className="mx-auto max-w-screen-2xl">
              <div className="transition-all duration-300">
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
