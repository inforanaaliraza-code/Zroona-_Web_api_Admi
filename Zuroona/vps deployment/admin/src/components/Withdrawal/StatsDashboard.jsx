"use client";

import { useState, useEffect } from "react";
import { FaMoneyBillWave, FaClock, FaCheckCircle, FaTimesCircle, FaChartLine, FaTrophy } from "react-icons/fa";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function StatsDashboard({ stats, loading }) {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isRTL = mounted ? i18n.language === "ar" : false;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: t("withdrawalStats.totalRequests"),
      value: stats?.total_requests || 0,
      icon: FaMoneyBillWave,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: t("withdrawalStats.pending"),
      value: stats?.pending_requests || 0,
      amount: `${stats?.pending_amount || 0} ${t("common.currency")}`,
      icon: FaClock,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600"
    },
    {
      title: t("withdrawalStats.approved"),
      value: stats?.approved_requests || 0,
      amount: `${stats?.approved_amount || 0} ${t("common.currency")}`,
      icon: FaCheckCircle,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: t("withdrawalStats.rejected"),
      value: stats?.rejected_requests || 0,
      amount: `${stats?.rejected_amount || 0} ${t("common.currency")}`,
      icon: FaTimesCircle,
      color: "from-red-500 to-rose-600",
      bgColor: "bg-red-50",
      textColor: "text-red-600"
    }
  ];

  return (
    <div className="mb-8 space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-105"
          >
            <div className={`h-2 bg-gradient-to-r ${card.color}`}></div>
            <div className="p-6">
              <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`w-14 h-14 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                  <card.icon className={`text-2xl ${card.textColor}`} />
                </div>
                <div className={isRTL ? 'text-left' : 'text-right'}>
                  <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                  <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
                </div>
              </div>
              {card.amount && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-gray-600 text-sm">{t("withdrawalStats.totalAmount")}</p>
                  <p className="text-gray-900 font-bold text-lg">{card.amount}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Amount */}
        <div className="bg-gradient-to-br from-[#a3cc69] to-[#9fb68b] rounded-2xl p-6 text-white shadow-lg">
          <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <FaChartLine className="text-3xl" />
            <h3 className="text-lg font-semibold">{t("withdrawalStats.totalAmount")}</h3>
          </div>
          <p className="text-4xl font-bold mb-1">{stats?.total_amount || 0}</p>
          <p className="text-sm opacity-90">{t("common.currency")} ({t("withdrawalStats.allRequests")})</p>
        </div>

        {/* Average Processing Time */}
        <div className="bg-gradient-to-br from-[#a797cc] to-[#b0a0df] rounded-2xl p-6 text-white shadow-lg">
          <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <FaClock className="text-3xl" />
            <h3 className="text-lg font-semibold">{t("withdrawalStats.avgProcessingTime")}</h3>
          </div>
          <p className="text-4xl font-bold mb-1">{stats?.avg_processing_time_hours || 0}</p>
          <p className="text-sm opacity-90">{t("withdrawalStats.hours")}</p>
        </div>

        {/* Success Rate */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <FaTrophy className="text-3xl" />
            <h3 className="text-lg font-semibold">{t("withdrawalStats.approvalRate")}</h3>
          </div>
          <p className="text-4xl font-bold mb-1">
            {stats?.total_requests ? ((stats.approved_requests / stats.total_requests) * 100).toFixed(1) : 0}%
          </p>
          <p className="text-sm opacity-90">
            {t("withdrawalStats.approvedOf", { approved: stats?.approved_requests || 0, total: stats?.total_requests || 0 })}
          </p>
        </div>
      </div>

      {/* Monthly Trend - Simple Bar Chart */}
      {stats?.monthly_trend && stats.monthly_trend.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className={`text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <FaChartLine className="text-[#a3cc69]" />
            {t("withdrawalStats.monthlyTrend")}
          </h3>
          <div className={`flex items-end justify-between gap-2 h-48 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {stats.monthly_trend.map((month, index) => {
              const maxValue = Math.max(...stats.monthly_trend.map(m => m.total_requests));
              const height = (month.total_requests / maxValue) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gray-100 rounded-t-lg relative group cursor-pointer hover:opacity-90 transition">
                    <div
                      className="bg-gradient-to-t from-[#a3cc69] to-[#a797cc] rounded-t-lg transition-all duration-500"
                      style={{ height: `${height}%` }}
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                          <p className="font-bold">{month.total_requests} {t("withdrawalStats.requests")}</p>
                          <p>{month.total_amount} {t("common.currency")}</p>
                          <p className="text-green-400">✓ {month.approved}</p>
                          <p className="text-red-400">✗ {month.rejected}</p>
                          <p className="text-yellow-400">⏳ {month.pending}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-600">{month.month_name}</p>
                  <p className="text-lg font-bold text-gray-800">{month.total_requests}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Hosts */}
      {stats?.top_hosts && stats.top_hosts.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className={`text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <FaTrophy className="text-yellow-500" />
            {t("withdrawalStats.topHosts")}
          </h3>
          <div className="space-y-3">
            {stats.top_hosts.slice(0, 5).map((host, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-500' :
                    'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow">
                    <Image
                      src={host.profile_image ? (host.profile_image.includes('https') ? host.profile_image : `${process.env.NEXT_PUBLIC_API_BASE || "httpss://api.zuroona.sa"}${host.profile_image}`) : "/assets/images/dummyImage.png"}
                      alt={host.host_name || "Host"}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="font-bold text-gray-900">{host.host_name}</p>
                    <p className="text-sm text-gray-600">{host.request_count} {t("withdrawalStats.requests")}</p>
                  </div>
                </div>
                <div className={isRTL ? 'text-left' : 'text-right'}>
                  <p className="text-2xl font-bold text-[#a3cc69]">{host.total_withdrawn}</p>
                  <p className="text-sm text-gray-600">{t("common.currency")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
