"use client";

import { FaMoneyBillWave, FaClock, FaCheckCircle, FaTimesCircle, FaChartLine, FaTrophy } from "react-icons/fa";
import Image from "next/image";

export default function StatsDashboard({ stats, loading }) {
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
      title: "Total Requests",
      value: stats?.total_requests || 0,
      icon: FaMoneyBillWave,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Pending",
      value: stats?.pending_requests || 0,
      amount: `${stats?.pending_amount || 0} SAR`,
      icon: FaClock,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600"
    },
    {
      title: "Approved",
      value: stats?.approved_requests || 0,
      amount: `${stats?.approved_amount || 0} SAR`,
      icon: FaCheckCircle,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Rejected",
      value: stats?.rejected_requests || 0,
      amount: `${stats?.rejected_amount || 0} SAR`,
      icon: FaTimesCircle,
      color: "from-red-500 to-rose-600",
      bgColor: "bg-red-50",
      textColor: "text-red-600"
    }
  ];

  return (
    <div className="mb-8 space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-105"
          >
            <div className={`h-2 bg-gradient-to-r ${card.color}`}></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                  <card.icon className={`text-2xl ${card.textColor}`} />
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                  <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
                </div>
              </div>
              {card.amount && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-gray-600 text-sm">Total Amount</p>
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
          <div className="flex items-center gap-3 mb-2">
            <FaChartLine className="text-3xl" />
            <h3 className="text-lg font-semibold">Total Amount</h3>
          </div>
          <p className="text-4xl font-bold mb-1">{stats?.total_amount || 0}</p>
          <p className="text-sm opacity-90">SAR (All Requests)</p>
        </div>

        {/* Average Processing Time */}
        <div className="bg-gradient-to-br from-[#a797cc] to-[#b0a0df] rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <FaClock className="text-3xl" />
            <h3 className="text-lg font-semibold">Avg. Processing Time</h3>
          </div>
          <p className="text-4xl font-bold mb-1">{stats?.avg_processing_time_hours || 0}</p>
          <p className="text-sm opacity-90">Hours</p>
        </div>

        {/* Success Rate */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <FaTrophy className="text-3xl" />
            <h3 className="text-lg font-semibold">Approval Rate</h3>
          </div>
          <p className="text-4xl font-bold mb-1">
            {stats?.total_requests ? ((stats.approved_requests / stats.total_requests) * 100).toFixed(1) : 0}%
          </p>
          <p className="text-sm opacity-90">
            {stats?.approved_requests || 0} of {stats?.total_requests || 0} approved
          </p>
        </div>
      </div>

      {/* Monthly Trend - Simple Bar Chart */}
      {stats?.monthly_trend && stats.monthly_trend.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaChartLine className="text-[#a3cc69]" />
            Monthly Trend (Last 6 Months)
          </h3>
          <div className="flex items-end justify-between gap-2 h-48">
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
                          <p className="font-bold">{month.total_requests} requests</p>
                          <p>{month.total_amount} SAR</p>
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
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaTrophy className="text-yellow-500" />
            Top Hosts (Most Withdrawn)
          </h3>
          <div className="space-y-3">
            {stats.top_hosts.slice(0, 5).map((host, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition"
              >
                <div className="flex items-center gap-4">
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
                      src={host.profile_image ? (host.profile_image.includes('http') ? host.profile_image : `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3434"}${host.profile_image}`) : "/assets/images/dummyImage.png"}
                      alt={host.host_name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{host.host_name}</p>
                    <p className="text-sm text-gray-600">{host.request_count} requests</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#a3cc69]">{host.total_withdrawn}</p>
                  <p className="text-sm text-gray-600">SAR</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

