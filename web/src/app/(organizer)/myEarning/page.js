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
      <section className="bg-white py-16 ">
        <div className="mx-auto px-4 md:px-8 lg:px-28">
          <div className="grid grid-cols-3 gap-6">
            {/* Summary and Income Breakdown */}
            <div className="col-span-full lg:col-span-1">
              <div className="space-y-4">
                <BalanceCard data={Earning} />
                {/* <IncomeCard title="Event Fees" amount="124.48" />
                <IncomeCard title="Member Dues" amount="124.48" /> */}
              </div>
            </div>
            <div className="col-span-full lg:col-span-2">
              {/* Bar Chart and Tabs */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                {/* Tabs */}
                <div className="flex space-x-4 mb-6">
                  {[t("tab.tab8"), t("tab.tab9"), t("tab.tab10")].map((tab) => (
                    <button
                      key={tab}
                      onClick={
                        () => handleTabChange(tab.toLowerCase().charAt(0)) // d, w, m
                      }
                      className={`px-4 py-3 w-24 text-sm rounded ${
                        filter === tab.toLowerCase().charAt(0)
                          ? "bg-[#a797cc] text-gray-900 drop-shadow-[0_0px_12px_rgb(244_124_12_/_52%)]"
                          : "bg-white border text-gray-800 border-[#a797cc]"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <p className="text-gray-800">
                  {t("earning.tab3")}:
                  <span className="font-semibold">
                    {" "}
                    {Earning?.total_earnings} {t("card.tab2")}
                  </span>
                </p>
                {loadingBar ? (
                  <div className="flex justify-center items-center h-96">
                    {/* Replace this with your Loader component if available */}
                    <Loader />
                  </div>
                ) : (
                  <BarCharts data={Earning} />
                )}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="mt-8">
            <RecentTransaction data={Earning} />
          </div>

          {/* Withdraw Button */}
          <div className="mt-8 flex justify-end items-center">
            <div className="flex flex-col items-end gap-2">
              <p className="text-sm text-gray-600">{t("withdrawFee")}</p>
              <Link
                href="/withdrawal"
                className="bg-[#a797cc] py-3 px-10 rounded-lg text-base text-white hover:bg-[#8ba179] transition-colors"
              >
                {t("earning.tab1")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
