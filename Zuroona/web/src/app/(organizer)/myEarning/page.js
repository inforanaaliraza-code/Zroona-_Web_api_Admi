"use client";

import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import BalanceCard from "@/components/Earning/BalanceCard";
import BarCharts from "@/components/Earning/BarCharts";
import IncomeCard from "@/components/Earning/IncomeCard";
import RecentTransaction from "@/components/Earning/RecentTransaction";
import Loader from "@/components/Loader/Loader";
import { getEarning } from "@/redux/slices/Earning";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@iconify/react";

export default function MyEarning() {
  const { t } = useTranslation();
  const breadcrumbItems = [
    { label: t("breadcrumb.tab1"), href: "/joinUsEvent" },
    { label: t("breadcrumb.tab6"), href: "/myEarning" },
  ];

  const [activeTab, setActiveTab] = useState("daily");
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("d");
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [loadingBar, setLoadingBar] = useState(false);

  const handlePage = (value) => {
    setPage(value);
  };

  const { Earning, loading } = useSelector((state) => state.EarningData);

  useEffect(() => {
    const fetchEarningData = async () => {
      setLoadingBar(true);
      await dispatch(
        getEarning({
          page: page,
          filter: filter,
        })
      );
      setLoadingBar(false);
    };

    fetchEarningData();
  }, [page, filter, dispatch]);

  const handleTabChange = (tab) => {
    setFilter(tab);
    setLoadingBar(true);
  };

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <section className="bg-white py-6 md:py-8 min-h-screen">
        <div className="mx-auto px-4 md:px-8 lg:px-28">
          {/* Header Section - Compact */}
          <div className="mb-4 md:mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              {t("earning.title")}
            </h1>
            <p className="text-sm text-gray-600">
              {t("earning.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Balance Card */}
            <div className="lg:col-span-1">
              <BalanceCard data={Earning} />
            </div>
            
            {/* Earnings Chart */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6 hover:shadow-xl transition-shadow duration-300">
                {/* Premium Tabs - Compact */}
                <div className="flex items-center justify-between mb-4 md:mb-6 flex-wrap gap-3">
                  <div className="flex gap-2">
                    {[
                      { key: "d", label: t("tab.tab8") },
                      { key: "w", label: t("tab.tab9") },
                      { key: "m", label: t("tab.tab10") }
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => handleTabChange(tab.key)}
                        className={`relative px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-300 ${
                          filter === tab.key
                            ? "bg-gradient-to-r from-[#a797cc] to-[#8ba179] text-white shadow-md shadow-[#a797cc]/30 scale-105"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {tab.label}
                        {filter === tab.key && (
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#a797cc] to-[#8ba179] opacity-20 blur-xl"></div>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {/* Available Balance Display - Compact */}
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-0.5">{t("earning.tab3")}</p>
                    <p className="text-lg md:text-xl font-bold text-gray-900">
                      {Earning?.total_earnings?.toLocaleString() || 0} {t("card.tab2")}
                    </p>
                  </div>
                </div>
                
                {/* Chart - Compact */}
                {loadingBar ? (
                  <div className="flex justify-center items-center h-64 md:h-80">
                    <Loader />
                  </div>
                ) : (
                  <BarCharts data={Earning} />
                )}
              </div>
            </div>
          </div>

          {/* Recent Transactions - Compact */}
          <div className="mt-6 md:mt-8">
            <RecentTransaction data={Earning} />
          </div>

          {/* Withdraw Button Section - Compact */}
          <div className="mt-6 md:mt-8 flex justify-end">
            <div className="bg-gradient-to-r from-[#a797cc]/10 to-[#8ba179]/10 rounded-xl p-4 md:p-5 border border-[#a797cc]/20 shadow-md">
              <div className="flex flex-col items-end gap-2">
                <p className="text-xs text-gray-600 font-medium">
                  {t("withdrawFee") || "Please note that 5% will be deducted for fees."}
                </p>
                <Link
                  href="/withdrawal"
                  className="group relative overflow-hidden bg-gradient-to-r from-[#a797cc] to-[#8ba179] py-2.5 px-8 md:py-3 md:px-10 rounded-lg text-sm md:text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon icon="lucide:arrow-right" className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
                    {t("earning.tab1")}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8ba179] to-[#a797cc] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
