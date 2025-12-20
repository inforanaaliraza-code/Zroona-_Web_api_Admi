"use client";

import { Bar, XAxis, YAxis, BarChart, ResponsiveContainer, Tooltip, CartesianGrid, Cell } from "recharts";
import { useState } from "react";

export default function BarCharts({ data }) {
    const [activeIndex, setActiveIndex] = useState(null); // Track hovered bar index

    const handleMouseEnter = (_, index) => {
        setActiveIndex(index); // Set active index for hovered bar
    };

    const handleMouseLeave = () => {
        setActiveIndex(null); // Reset on leave
    };

    // If no data is available, you can either return null or render an empty state message instead of a Loader
    if (!data || !data.graph_data) {
        return null; // Remove this line to render an empty state if needed
    }

    // Find the maximum value of total_earning in graph_data
    const maxEarning = Math.max(...data.graph_data.map(entry => entry.total_earning));

    // Round up the max value to the next multiple of 500
    const roundedMaxEarning = Math.ceil(maxEarning / 500) * 500;

    return (
        <div className="w-full h-96 bg-white lg:p-6 relative">
            <div className="absolute top-0 right-6 flex items-center">
                <p className="text-gray-800">
                    <span className="text-green-500">▲</span> {data.current_month_percentage}%
                </p>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.graph_data} margin={{ top: 40 }}>
                    <CartesianGrid strokeDasharray="2" stroke="#ebebeb" />
                    <XAxis dataKey="label" />
                    <YAxis
                        tickFormatter={(value) => Math.floor(value)} // Remove decimal places by rounding down to the nearest integer
                        domain={[0, roundedMaxEarning]} // Set Y-axis domain dynamically based on the rounded max total_earning
                        ticks={[0, roundedMaxEarning / 4, roundedMaxEarning / 2, (3 * roundedMaxEarning) / 4, roundedMaxEarning]} // Adjust ticks accordingly
                    />  
                    <Tooltip />
                    <Bar
                        dataKey="total_earning"
                        fillOpacity={1}
                        radius={[20, 20, 20, 20]}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        barSize={30}
                    >
                        {data.graph_data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={`url(#gradient-${index})`}
                                style={{
                                    backgroundColor: activeIndex === index ? 'transparent' : undefined,
                                }}
                            />
                        ))}
                    </Bar>
                    {data.graph_data.map((entry, index) => (
                        <defs key={`gradient-${index}`}>
                            <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={index === activeIndex ? '#FF9800' : '#B81EDD'} />
                                <stop offset="95%" stopColor={index === activeIndex ? '#FF5722' : '#7251CE'} />
                            </linearGradient>
                        </defs>
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
