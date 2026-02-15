"use client";
import React, { useEffect, useState, useMemo, memo, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { GetWalletStatsApi } from '@/api/admin/apis';
import Loader from '../Loader/Loader';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

// Dynamically import Chart.js to reduce initial bundle size
const Bar = dynamic(() => import('react-chartjs-2').then(mod => mod.Bar), {
  ssr: false,
  loading: () => <div className="h-80 flex items-center justify-center">Loading...</div>
});

const Line = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), {
  ssr: false,
  loading: () => <div className="h-80 flex items-center justify-center">Loading...</div>
});

// Lazy register Chart.js components
let chartRegistered = false;
const registerChart = () => {
  if (typeof window !== 'undefined' && !chartRegistered) {
    import('chart.js').then(({ Chart: ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend }) => {
      ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);
      chartRegistered = true;
    });
  }
};

const WalletStatsDashboard = memo(() => {
    const { t, i18n } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      setMounted(true);
    }, []);

    const isRTL = mounted ? i18n.language === "ar" : false;

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await GetWalletStatsApi();
            if (res?.status === 1 || res?.code === 200) {
                setStats(res.data);
            } else {
                setError(res?.message || t("wallet.failedToFetch"));
                toast.error(res?.message || t("wallet.failedToFetch"));
            }
        } catch (err) {
            console.error("Error fetching wallet stats:", err);
            setError(t("wallet.failedToFetch"));
            toast.error(t("wallet.failedToFetch"));
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        registerChart();
        fetchStats();
    }, [fetchStats]);

    // Memoize chart data to prevent unnecessary recalculations
    // IMPORTANT: All hooks must be called before any conditional returns
    const chartData = useMemo(() => {
        if (!stats?.monthly_trends) return null;
        
        const monthlyLabels = [];
        const earningsData = [];
        const withdrawalsData = [];

        const monthlyMap = {};
        stats.monthly_trends.forEach(trend => {
            const key = `${trend._id.year}-${trend._id.month}`;
            if (!monthlyMap[key]) {
                monthlyMap[key] = { earnings: 0, withdrawals: 0 };
            }
            if (trend._id.type === 1) {
                monthlyMap[key].earnings = trend.total_amount;
            } else if (trend._id.type === 2) {
                monthlyMap[key].withdrawals = trend.total_amount;
            }
        });

        Object.keys(monthlyMap).sort().forEach(key => {
            const [year, month] = key.split('-');
            monthlyLabels.push(new Date(year, month - 1).toLocaleString('default', { month: 'short', year: 'numeric' }));
            earningsData.push(monthlyMap[key].earnings);
            withdrawalsData.push(monthlyMap[key].withdrawals);
        });

        return {
            labels: monthlyLabels,
            datasets: [
                {
                    label: t("wallet.earnings"),
                    data: earningsData,
                    backgroundColor: 'rgba(163, 204, 105, 0.8)',
                    borderColor: 'rgba(163, 204, 105, 1)',
                    borderWidth: 1,
                },
                {
                    label: t("withdrawal.title"),
                    data: withdrawalsData,
                    backgroundColor: 'rgba(244, 124, 12, 0.8)',
                    borderColor: 'rgba(244, 124, 12, 1)',
                    borderWidth: 1,
                },
            ],
        };
    }, [stats?.monthly_trends]);

    const chartOptions = useMemo(() => ({
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#4a5568',
                }
            },
            title: {
                display: true,
                text: t("wallet.monthlyEarningsVsWithdrawals"),
                color: '#2d3748',
                font: {
                    size: 16,
                    weight: 'bold',
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'SAR' }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: { color: '#4a5568' },
                grid: { color: 'rgba(0,0,0,0.05)' }
            },
            y: {
                ticks: { color: '#4a5568' },
                grid: { color: 'rgba(0,0,0,0.05)' }
            }
        }
    }), []);

    // Early returns AFTER all hooks
    if (loading) {
        return (
            <div className="flex justify-center items-center py-10">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 text-red-500 font-semibold">
                <Icon icon="mdi:alert-circle-outline" className="w-10 h-10 mx-auto mb-3" />
                {error}
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-10 text-gray-500">
                <Icon icon="mdi:information-outline" className="w-10 h-10 mx-auto mb-3" />
                {t("wallet.failedToFetch")}
            </div>
        );
    }

    const StatCard = ({ title, value, icon, color, subValue }) => (
        <div className={`bg-white rounded-xl shadow-md p-5 flex items-center justify-between border border-gray-100 animate-fade-in hover:shadow-lg transition-shadow duration-300 ${isRTL ? 'flex-row-reverse' : ''}`} style={{ animationDelay: '0.1s' }}>
            <div className={isRTL ? 'text-right' : 'text-left'}>
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
                {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
            </div>
            <Icon icon={icon} className={`w-10 h-10 ${color} opacity-30`} />
        </div>
    );

    const SecondaryStatCard = ({ title, value, icon, color }) => (
        <div className={`bg-white rounded-xl shadow-sm p-4 flex items-center gap-3 border border-gray-100 animate-fade-in hover:shadow-md transition-shadow duration-300 ${isRTL ? 'flex-row-reverse' : ''}`} style={{ animationDelay: '0.2s' }}>
            <Icon icon={icon} className={`w-7 h-7 ${color}`} />
            <div className={isRTL ? 'text-right' : 'text-left'}>
                <h4 className="text-xs font-medium text-gray-500">{title}</h4>
                <p className={`text-lg font-semibold ${color}`}>{value}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
            {/* Main Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title={t("wallet.totalBalance")}
                    value={`${stats.total_balance.toFixed(2)} SAR`}
                    icon="mdi:wallet-outline"
                    color="text-[#a797cc]"
                    subValue={`${stats.total_wallets} ${t("common.name")}s`}
                />
                <StatCard
                    title={t("wallet.availableBalance")}
                    value={`${stats.available_balance.toFixed(2)} SAR`}
                    icon="mdi:cash-check"
                    color="text-green-500"
                />
                <StatCard
                    title={t("withdrawal.title")}
                    value={`${stats.pending_withdrawals_amount.toFixed(2)} SAR`}
                    icon="mdi:clock-time-four-outline"
                    color="text-yellow-500"
                    subValue={`${stats.pending_withdrawals} ${t("withdrawalStats.requests")}`}
                />
                <StatCard
                    title={t("wallet.totalEarnings")}
                    value={`${stats.total_earnings.toFixed(2)} SAR`}
                    icon="mdi:trending-up"
                    color="text-blue-500"
                />
            </div>

            {/* Secondary Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SecondaryStatCard
                    title={t("withdrawal.title")}
                    value={`${stats.total_withdrawals.toFixed(2)} SAR`}
                    icon="mdi:cash-minus"
                    color="text-orange-500"
                />
                <SecondaryStatCard
                    title={t("wallet.averageBalance")}
                    value={`${stats.avg_balance.toFixed(2)} SAR`}
                    icon="mdi:calculator"
                    color="text-blue-500"
                />
                <SecondaryStatCard
                    title={t("wallet.recentActivity")}
                    value={stats.recent_activity}
                    icon="mdi:chart-line"
                    color="text-purple-500"
                />
                <SecondaryStatCard
                    title={t("withdrawal.approved")}
                    value={stats.approved_withdrawals}
                    icon="mdi:check-circle-outline"
                    color="text-green-600"
                />
            </div>

            {/* Monthly Trend Chart and Top Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <h3 className={`text-lg font-semibold text-gray-800 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t("wallet.monthlyTrends")}</h3>
                    <div className="h-80">
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* Top Hosts by Balance */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <h3 className={`text-lg font-semibold text-gray-800 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t("wallet.topHostsByBalance")}</h3>
                    {stats.top_hosts.length > 0 ? (
                        <ul className="space-y-3">
                            {stats.top_hosts.slice(0, 5).map((host, index) => (
                                <li key={host._id} className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <span className="font-bold text-lg text-[#a797cc]">{index + 1}.</span>
                                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                            <Image
                                                src={host.organizer?.profile_image ? (host.organizer.profile_image.includes('https') ? host.organizer.profile_image : `${process.env.NEXT_PUBLIC_API_BASE || "httpss://api.zuroona.sa"}${host.organizer.profile_image}`) : "/assets/images/dummyImage.png"}
                                                alt={host.organizer?.first_name}
                                                width={40}
                                                height={40}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 truncate max-w-[100px]">
                                                {host.organizer?.group_name || `${host.organizer?.first_name} ${host.organizer?.last_name}`}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-800">{host.total_amount.toFixed(0)} SAR</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm">{t("wallet.noHostsFound")}</p>
                    )}
                </div>
            </div>

            {/* Top Earners */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <h3 className={`text-lg font-semibold text-gray-800 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t("wallet.topEarners")}</h3>
                {stats.top_earners.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {stats.top_earners.map((earner, index) => (
                            <div key={earner._id} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                <div className="relative mb-3">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#a797cc]">
                                        <Image
                                            src={earner.organizer?.profile_image ? (earner.organizer.profile_image.includes('https') ? earner.organizer.profile_image : `${process.env.NEXT_PUBLIC_API_BASE || "httpss://api.zuroona.sa"}${earner.organizer.profile_image}`) : "/assets/images/dummyImage.png"}
                                            alt={earner.organizer?.first_name}
                                            width={64}
                                            height={64}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <span className="absolute -top-1 -right-1 bg-[#a797cc] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                        {index + 1}
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-gray-700 text-center mb-1 truncate max-w-full">
                                    {earner.organizer?.group_name || `${earner.organizer?.first_name} ${earner.organizer?.last_name}`}
                                </p>
                                <p className="text-lg font-bold text-[#a797cc]">{earner.total_earnings.toFixed(0)} SAR</p>
                                <p className="text-xs text-gray-500">{earner.transaction_count} {t("wallet.transactions")}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">{t("wallet.noEarnersFound")}</p>
                )}
            </div>
        </div>
    );
});

WalletStatsDashboard.displayName = 'WalletStatsDashboard';

export default WalletStatsDashboard;

