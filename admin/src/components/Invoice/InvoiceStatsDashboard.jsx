"use client";
import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { GetInvoiceStatsApi } from '@/api/admin/apis';
import Loader from '../Loader/Loader';
import { toast } from 'react-toastify';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const InvoiceStatsDashboard = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await GetInvoiceStatsApi();
            if (res?.status === 1 || res?.code === 200) {
                setStats(res.data);
            } else {
                setError(res?.message || t('invoice.stats.fetchError'));
                toast.error(res?.message || t('invoice.stats.fetchError'));
            }
        } catch (err) {
            console.error("Error fetching invoice stats:", err);
            setError(t('invoice.stats.fetchError'));
            toast.error(t('invoice.stats.fetchError'));
        } finally {
            setLoading(false);
        }
    };

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
                {t('invoice.stats.noData')}
            </div>
        );
    }

    const monthlyData = stats.monthly_trends.map(m => m.total_amount);
    const monthlyLabels = stats.monthly_trends.map(m => new Date(m._id.year, m._id.month - 1).toLocaleString('default', { month: 'short', year: 'numeric' }));
    const monthlyInvoiceCount = stats.monthly_trends.map(m => m.total_invoices);

    const chartData = {
        labels: monthlyLabels,
        datasets: [
            {
                label: t('invoice.stats.revenue'),
                data: monthlyData,
                backgroundColor: 'rgba(167, 151, 204, 0.8)', // Purple
                borderColor: 'rgba(167, 151, 204, 1)',
                borderWidth: 1,
                yAxisID: 'y',
            },
            {
                label: t('invoice.stats.invoiceCount'),
                data: monthlyInvoiceCount,
                backgroundColor: 'rgba(163, 204, 105, 0.8)', // Green
                borderColor: 'rgba(163, 204, 105, 1)',
                borderWidth: 1,
                yAxisID: 'y1',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#4a5568', // Gray-700
                }
            },
            title: {
                display: true,
                text: t('invoice.stats.monthlyTrendTitle'),
                color: '#2d3748', // Gray-900
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
                            if (context.datasetIndex === 0) {
                                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'SAR' }).format(context.parsed.y);
                            } else {
                                label += context.parsed.y + ' invoices';
                            }
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
                type: 'linear',
                display: true,
                position: 'left',
                ticks: { color: '#4a5568' },
                grid: { color: 'rgba(0,0,0,0.05)' },
                title: {
                    display: true,
                    text: 'Revenue (SAR)',
                    color: '#4a5568',
                }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                ticks: { color: '#4a5568' },
                grid: { drawOnChartArea: false },
                title: {
                    display: true,
                    text: 'Invoice Count',
                    color: '#4a5568',
                }
            },
        }
    };

    const StatCard = ({ title, value, icon, color, bgColor, subValue }) => (
        <div className={`bg-white rounded-xl shadow-md p-5 flex items-center justify-between border border-gray-100 animate-fade-in hover:shadow-lg transition-shadow duration-300`} style={{ animationDelay: '0.1s' }}>
            <div>
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
                {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
            </div>
            <Icon icon={icon} className={`w-10 h-10 ${color} opacity-30`} />
        </div>
    );

    const SecondaryStatCard = ({ title, value, icon, color }) => (
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3 border border-gray-100 animate-fade-in hover:shadow-md transition-shadow duration-300" style={{ animationDelay: '0.2s' }}>
            <Icon icon={icon} className={`w-7 h-7 ${color}`} />
            <div>
                <h4 className="text-xs font-medium text-gray-500">{title}</h4>
                <p className={`text-lg font-semibold ${color}`}>{value}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Main Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title={t('invoice.stats.totalInvoices')}
                    value={stats.total_invoices}
                    icon="mdi:file-document-multiple-outline"
                    color="text-[#a797cc]"
                    subValue={`${stats.recent_invoices} ${t('invoice.stats.lastSevenDays')}`}
                />
                <StatCard
                    title={t('invoice.stats.pendingInvoices')}
                    value={stats.pending_invoices}
                    icon="mdi:clock-time-four-outline"
                    color="text-yellow-500"
                />
                <StatCard
                    title={t('invoice.stats.confirmedInvoices')}
                    value={stats.confirmed_invoices}
                    icon="mdi:check-circle-outline"
                    color="text-green-500"
                />
                <StatCard
                    title={t('invoice.stats.completedInvoices')}
                    value={stats.completed_invoices}
                    icon="mdi:checkbox-marked-circle-outline"
                    color="text-blue-500"
                />
            </div>

            {/* Secondary Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SecondaryStatCard
                    title={t('invoice.stats.totalRevenue')}
                    value={`${stats.total_amount.toFixed(2)} SAR`}
                    icon="mdi:currency-usd"
                    color="text-[#a797cc]"
                />
                <SecondaryStatCard
                    title={t('invoice.stats.avgInvoiceAmount')}
                    value={`${stats.avg_amount.toFixed(2)} SAR`}
                    icon="mdi:calculator"
                    color="text-blue-500"
                />
                <SecondaryStatCard
                    title={t('invoice.stats.maxInvoiceAmount')}
                    value={`${stats.max_amount.toFixed(2)} SAR`}
                    icon="mdi:arrow-up-bold-circle-outline"
                    color="text-green-600"
                />
                <SecondaryStatCard
                    title={t('invoice.stats.cancelledInvoices')}
                    value={stats.cancelled_invoices}
                    icon="mdi:close-circle-outline"
                    color="text-red-500"
                />
            </div>

            {/* Monthly Trend Chart and Top Events */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('invoice.stats.monthlyTrendTitle')}</h3>
                    <div className="h-80">
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>

                <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('invoice.stats.topEvents')}</h3>
                    {stats.top_events.length > 0 ? (
                        <ul className="space-y-3">
                            {stats.top_events.map((event, index) => (
                                <li key={event._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-lg text-[#a797cc]">{index + 1}.</span>
                                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                            <Image
                                                src={event.event_image ? (event.event_image.includes('http') ? event.event_image : `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3434"}${event.event_image}`) : "/assets/images/dummyImage.png"}
                                                alt={event.event_name}
                                                width={40}
                                                height={40}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 truncate max-w-[150px]">{event.event_name}</p>
                                            <p className="text-xs text-gray-500">{event.total_invoices} {t('invoice.stats.invoices')}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-800">{event.total_amount.toFixed(0)} SAR</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm">{t('invoice.stats.noTopEvents')}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoiceStatsDashboard;

