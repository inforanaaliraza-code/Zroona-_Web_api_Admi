"use client";

import { Bar, XAxis, YAxis, BarChart, ResponsiveContainer, Tooltip, CartesianGrid, Cell } from "recharts";
import { useState } from "react";
import { Icon } from "@iconify/react";

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-2xl p-4">
                <p className="text-sm font-semibold text-gray-800 mb-2">{payload[0].payload.label}</p>
                <p className="text-lg font-bold text-[#a797cc]">
                    {payload[0].value.toLocaleString()} SAR
                </p>
            </div>
        );
    }
    return null;
};

export default function BarCharts({ data }) {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleMouseEnter = (_, index) => {
        setActiveIndex(index);
    };

    const handleMouseLeave = () => {
        setActiveIndex(null);
    };

    if (!data || !data.graph_data || data.graph_data.length === 0) {
        return (
            <div className="w-full h-64 md:h-80 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl md:rounded-2xl">
                <div className="text-center">
                    <Icon icon="lucide:bar-chart-3" className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 md:mb-4" />
                    <p className="text-sm md:text-base text-gray-500 font-medium">No data available</p>
                </div>
            </div>
        );
    }

    const maxEarning = Math.max(...data.graph_data.map(entry => entry.total_earning || 0));
    const roundedMaxEarning = Math.ceil(maxEarning / 500) * 500 || 500;

    return (
        <div className="w-full h-64 md:h-80 lg:h-96 relative bg-gradient-to-br from-white to-gray-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100 shadow-inner">
            {/* Growth Indicator - Compact */}
            <div className="absolute top-3 md:top-4 right-3 md:right-4 z-10">
                <div className="flex items-center gap-1.5 md:gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full border border-green-200 shadow-sm md:shadow-md">
                    <Icon icon="lucide:trending-up" className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                    <span className="text-xs md:text-sm font-bold text-green-700">
                        {data.current_month_percentage || 0}%
                    </span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.graph_data} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                    <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke="#e5e7eb" 
                        opacity={0.5}
                        vertical={false}
                    />
                    <XAxis 
                        dataKey="label" 
                        tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                        tickFormatter={(value) => Math.floor(value).toLocaleString()}
                        domain={[0, roundedMaxEarning]}
                        ticks={[0, roundedMaxEarning / 4, roundedMaxEarning / 2, (3 * roundedMaxEarning) / 4, roundedMaxEarning]}
                        tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickLine={{ stroke: '#e5e7eb' }}
                    />  
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(167, 151, 204, 0.1)' }} />
                    <Bar
                        dataKey="total_earning"
                        fillOpacity={1}
                        radius={[12, 12, 0, 0]}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        barSize={40}
                        animationDuration={800}
                    >
                        {data.graph_data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={`url(#gradient-${index})`}
                                style={{
                                    filter: activeIndex === index ? 'brightness(1.1)' : 'none',
                                    transition: 'all 0.3s ease',
                                }}
                            />
                        ))}
                    </Bar>
                    {data.graph_data.map((entry, index) => (
                        <defs key={`gradient-${index}`}>
                            <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                <stop 
                                    offset="0%" 
                                    stopColor={activeIndex === index ? '#FF9800' : '#a797cc'} 
                                    stopOpacity={1}
                                />
                                <stop 
                                    offset="100%" 
                                    stopColor={activeIndex === index ? '#FF5722' : '#8ba179'} 
                                    stopOpacity={0.9}
                                />
                            </linearGradient>
                        </defs>
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
