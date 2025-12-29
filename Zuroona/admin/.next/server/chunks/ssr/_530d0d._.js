module.exports = {

"[project]/src/components/Wallet/WalletStatsDashboard.jsx [app-ssr] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@iconify/react/dist/iconify.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$admin$2f$apis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/api/admin/apis.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Loader$2f$Loader$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/Loader/Loader.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$react$2d$toastify$2e$esm$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-toastify/dist/react-toastify.esm.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
"use client";
;
;
;
;
;
;
;
;
// Dynamically import Chart.js to reduce initial bundle size
const Bar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_require__("[project]/node_modules/react-chartjs-2/dist/index.js [app-ssr] (ecmascript, async loader)")(__turbopack_import__).then((mod)=>mod.Bar), {
    loadableGenerated: {
        modules: [
            "src/components/Wallet/WalletStatsDashboard.jsx -> " + "react-chartjs-2"
        ]
    },
    ssr: false,
    loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-80 flex items-center justify-center",
            children: "Loading chart..."
        }, void 0, false, {
            fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
            lineNumber: 13,
            columnNumber: 18
        }, this)
});
const Line = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_require__("[project]/node_modules/react-chartjs-2/dist/index.js [app-ssr] (ecmascript, async loader)")(__turbopack_import__).then((mod)=>mod.Line), {
    loadableGenerated: {
        modules: [
            "src/components/Wallet/WalletStatsDashboard.jsx -> " + "react-chartjs-2"
        ]
    },
    ssr: false,
    loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-80 flex items-center justify-center",
            children: "Loading chart..."
        }, void 0, false, {
            fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
            lineNumber: 18,
            columnNumber: 18
        }, this)
});
// Lazy register Chart.js components
let chartRegistered = false;
const registerChart = ()=>{
    if (typeof window !== 'undefined' && !chartRegistered) {
        __turbopack_require__("[project]/node_modules/chart.js/dist/chart.js [app-ssr] (ecmascript, async loader) <facade>")(__turbopack_import__).then(({ Chart: ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend })=>{
            ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);
            chartRegistered = true;
        });
    }
};
const WalletStatsDashboard = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(()=>{
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        registerChart();
        fetchStats();
    }, []);
    const fetchStats = async ()=>{
        setLoading(true);
        setError(null);
        try {
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$admin$2f$apis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GetWalletStatsApi"])();
            if (res?.status === 1 || res?.code === 200) {
                setStats(res.data);
            } else {
                setError(res?.message || 'Failed to fetch wallet statistics');
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$react$2d$toastify$2e$esm$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(res?.message || 'Failed to fetch wallet statistics');
            }
        } catch (err) {
            console.error("Error fetching wallet stats:", err);
            setError('Failed to fetch wallet statistics');
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$react$2d$toastify$2e$esm$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Failed to fetch wallet statistics');
        } finally{
            setLoading(false);
        }
    };
    // Memoize chart data to prevent unnecessary recalculations
    // IMPORTANT: All hooks must be called before any conditional returns
    const chartData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!stats?.monthly_trends) return null;
        const monthlyLabels = [];
        const earningsData = [];
        const withdrawalsData = [];
        const monthlyMap = {};
        stats.monthly_trends.forEach((trend)=>{
            const key = `${trend._id.year}-${trend._id.month}`;
            if (!monthlyMap[key]) {
                monthlyMap[key] = {
                    earnings: 0,
                    withdrawals: 0
                };
            }
            if (trend._id.type === 1) {
                monthlyMap[key].earnings = trend.total_amount;
            } else if (trend._id.type === 2) {
                monthlyMap[key].withdrawals = trend.total_amount;
            }
        });
        Object.keys(monthlyMap).sort().forEach((key)=>{
            const [year, month] = key.split('-');
            monthlyLabels.push(new Date(year, month - 1).toLocaleString('default', {
                month: 'short',
                year: 'numeric'
            }));
            earningsData.push(monthlyMap[key].earnings);
            withdrawalsData.push(monthlyMap[key].withdrawals);
        });
        return {
            labels: monthlyLabels,
            datasets: [
                {
                    label: 'Earnings',
                    data: earningsData,
                    backgroundColor: 'rgba(163, 204, 105, 0.8)',
                    borderColor: 'rgba(163, 204, 105, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Withdrawals',
                    data: withdrawalsData,
                    backgroundColor: 'rgba(244, 124, 12, 0.8)',
                    borderColor: 'rgba(244, 124, 12, 1)',
                    borderWidth: 1
                }
            ]
        };
    }, [
        stats?.monthly_trends
    ]);
    const chartOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#4a5568'
                    }
                },
                title: {
                    display: true,
                    text: 'Monthly Earnings vs Withdrawals',
                    color: '#2d3748',
                    font: {
                        size: 16,
                        weight: 'bold'
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
                                label += new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'SAR'
                                }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#4a5568'
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    }
                },
                y: {
                    ticks: {
                        color: '#4a5568'
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    }
                }
            }
        }), []);
    // Early returns AFTER all hooks
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-center items-center py-10",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Loader$2f$Loader$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                lineNumber: 161,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
            lineNumber: 160,
            columnNumber: 13
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-10 text-red-500 font-semibold",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icon"], {
                    icon: "mdi:alert-circle-outline",
                    className: "w-10 h-10 mx-auto mb-3"
                }, void 0, false, {
                    fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                    lineNumber: 169,
                    columnNumber: 17
                }, this),
                error
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
            lineNumber: 168,
            columnNumber: 13
        }, this);
    }
    if (!stats) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-10 text-gray-500",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icon"], {
                    icon: "mdi:information-outline",
                    className: "w-10 h-10 mx-auto mb-3"
                }, void 0, false, {
                    fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                    lineNumber: 178,
                    columnNumber: 17
                }, this),
                "No wallet data available"
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
            lineNumber: 177,
            columnNumber: 13
        }, this);
    }
    const StatCard = ({ title, value, icon, color, subValue })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `bg-white rounded-xl shadow-md p-5 flex items-center justify-between border border-gray-100 animate-fade-in hover:shadow-lg transition-shadow duration-300`,
            style: {
                animationDelay: '0.1s'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-sm font-medium text-gray-500",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                            lineNumber: 187,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: `text-2xl font-bold ${color} mt-1`,
                            children: value
                        }, void 0, false, {
                            fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                            lineNumber: 188,
                            columnNumber: 17
                        }, this),
                        subValue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-gray-400 mt-1",
                            children: subValue
                        }, void 0, false, {
                            fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                            lineNumber: 189,
                            columnNumber: 30
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                    lineNumber: 186,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icon"], {
                    icon: icon,
                    className: `w-10 h-10 ${color} opacity-30`
                }, void 0, false, {
                    fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                    lineNumber: 191,
                    columnNumber: 13
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
            lineNumber: 185,
            columnNumber: 9
        }, this);
    const SecondaryStatCard = ({ title, value, icon, color })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-xl shadow-sm p-4 flex items-center gap-3 border border-gray-100 animate-fade-in hover:shadow-md transition-shadow duration-300",
            style: {
                animationDelay: '0.2s'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icon"], {
                    icon: icon,
                    className: `w-7 h-7 ${color}`
                }, void 0, false, {
                    fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                    lineNumber: 197,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                            className: "text-xs font-medium text-gray-500",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                            lineNumber: 199,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: `text-lg font-semibold ${color}`,
                            children: value
                        }, void 0, false, {
                            fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                            lineNumber: 200,
                            columnNumber: 17
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                    lineNumber: 198,
                    columnNumber: 13
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
            lineNumber: 196,
            columnNumber: 9
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        title: "Total Balance",
                        value: `${stats.total_balance.toFixed(2)} SAR`,
                        icon: "mdi:wallet-outline",
                        color: "text-[#a797cc]",
                        subValue: `${stats.total_wallets} hosts`
                    }, void 0, false, {
                        fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                        lineNumber: 209,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        title: "Available Balance",
                        value: `${stats.available_balance.toFixed(2)} SAR`,
                        icon: "mdi:cash-check",
                        color: "text-green-500"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                        lineNumber: 216,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        title: "Pending Withdrawals",
                        value: `${stats.pending_withdrawals_amount.toFixed(2)} SAR`,
                        icon: "mdi:clock-time-four-outline",
                        color: "text-yellow-500",
                        subValue: `${stats.pending_withdrawals} requests`
                    }, void 0, false, {
                        fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                        lineNumber: 222,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        title: "Total Earnings",
                        value: `${stats.total_earnings.toFixed(2)} SAR`,
                        icon: "mdi:trending-up",
                        color: "text-blue-500"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                        lineNumber: 229,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                lineNumber: 208,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-4 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SecondaryStatCard, {
                        title: "Total Withdrawals",
                        value: `${stats.total_withdrawals.toFixed(2)} SAR`,
                        icon: "mdi:cash-minus",
                        color: "text-orange-500"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                        lineNumber: 239,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SecondaryStatCard, {
                        title: "Average Balance",
                        value: `${stats.avg_balance.toFixed(2)} SAR`,
                        icon: "mdi:calculator",
                        color: "text-blue-500"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                        lineNumber: 245,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SecondaryStatCard, {
                        title: "Recent Activity (7d)",
                        value: stats.recent_activity,
                        icon: "mdi:chart-line",
                        color: "text-purple-500"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                        lineNumber: 251,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SecondaryStatCard, {
                        title: "Approved Withdrawals",
                        value: stats.approved_withdrawals,
                        icon: "mdi:check-circle-outline",
                        color: "text-green-600"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                        lineNumber: 257,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                lineNumber: 238,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-fade-in",
                        style: {
                            animationDelay: '0.3s'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-gray-800 mb-4",
                                children: "Monthly Trends"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                                lineNumber: 269,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-80",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Bar, {
                                    data: chartData,
                                    options: chartOptions
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                                    lineNumber: 271,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                                lineNumber: 270,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                        lineNumber: 268,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-1 bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-fade-in",
                        style: {
                            animationDelay: '0.4s'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-gray-800 mb-4",
                                children: "Top Hosts by Balance"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                                lineNumber: 277,
                                columnNumber: 21
                            }, this),
                            stats.top_hosts.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "space-y-3",
                                children: stats.top_hosts.slice(0, 5).map((host, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold text-lg text-[#a797cc]",
                                                        children: [
                                                            index + 1,
                                                            "."
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                                                        lineNumber: 283,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                            src: host.organizer?.profile_image ? host.organizer.profile_image.includes('http') ? host.organizer.profile_image : `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3434"}${host.organizer.profile_image}` : "/assets/images/dummyImage.png",
                                                            alt: host.organizer?.first_name,
                                                            width: 40,
                                                            height: 40,
                                                            className: "object-cover w-full h-full"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                                                            lineNumber: 285,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                                                        lineNumber: 284,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-medium text-gray-700 truncate max-w-[100px]",
                                                            children: host.organizer?.group_name || `${host.organizer?.first_name} ${host.organizer?.last_name}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                                                            lineNumber: 294,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                                                        lineNumber: 293,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                                                lineNumber: 282,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-semibold text-gray-800",
                                                children: [
                                                    host.total_amount.toFixed(0),
                                                    " SAR"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                                                lineNumber: 299,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, host._id, true, {
                                        fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                                        lineNumber: 281,
                                        columnNumber: 33
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                                lineNumber: 279,
                                columnNumber: 25
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-500 text-sm",
                                children: "No hosts found"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                                lineNumber: 304,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                        lineNumber: 276,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                lineNumber: 266,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-fade-in",
                style: {
                    animationDelay: '0.5s'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold text-gray-800 mb-4",
                        children: "Top Earners (Total Earnings)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                        lineNumber: 311,
                        columnNumber: 17
                    }, this),
                    stats.top_earners.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4",
                        children: stats.top_earners.map((earner, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-16 h-16 rounded-full overflow-hidden border-2 border-[#a797cc]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    src: earner.organizer?.profile_image ? earner.organizer.profile_image.includes('http') ? earner.organizer.profile_image : `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3434"}${earner.organizer.profile_image}` : "/assets/images/dummyImage.png",
                                                    alt: earner.organizer?.first_name,
                                                    width: 64,
                                                    height: 64,
                                                    className: "object-cover w-full h-full"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                                                    lineNumber: 318,
                                                    columnNumber: 41
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                                                lineNumber: 317,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "absolute -top-1 -right-1 bg-[#a797cc] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center",
                                                children: index + 1
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                                                lineNumber: 326,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                                        lineNumber: 316,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-medium text-gray-700 text-center mb-1 truncate max-w-full",
                                        children: earner.organizer?.group_name || `${earner.organizer?.first_name} ${earner.organizer?.last_name}`
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                                        lineNumber: 330,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-lg font-bold text-[#a797cc]",
                                        children: [
                                            earner.total_earnings.toFixed(0),
                                            " SAR"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                                        lineNumber: 333,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500",
                                        children: [
                                            earner.transaction_count,
                                            " transactions"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                                        lineNumber: 334,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, earner._id, true, {
                                fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                                lineNumber: 315,
                                columnNumber: 29
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                        lineNumber: 313,
                        columnNumber: 21
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-500 text-sm",
                        children: "No earners found"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                        lineNumber: 339,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
                lineNumber: 310,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Wallet/WalletStatsDashboard.jsx",
        lineNumber: 206,
        columnNumber: 9
    }, this);
});
WalletStatsDashboard.displayName = 'WalletStatsDashboard';
const __TURBOPACK__default__export__ = WalletStatsDashboard;

})()),
"[project]/node_modules/@iconify/react/dist/iconify.js [app-ssr] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "Icon": ()=>Icon,
    "InlineIcon": ()=>InlineIcon,
    "_api": ()=>_api,
    "addAPIProvider": ()=>addAPIProvider,
    "addCollection": ()=>addCollection,
    "addIcon": ()=>addIcon,
    "buildIcon": ()=>iconToSVG,
    "calculateSize": ()=>calculateSize,
    "getIcon": ()=>getIcon,
    "iconLoaded": ()=>iconLoaded,
    "listIcons": ()=>listIcons,
    "loadIcon": ()=>loadIcon,
    "loadIcons": ()=>loadIcons,
    "replaceIDs": ()=>replaceIDs,
    "setCustomIconLoader": ()=>setCustomIconLoader,
    "setCustomIconsLoader": ()=>setCustomIconsLoader
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
'use client';
;
/**
* Resolve icon set icons
*
* Returns parent icon for each icon
*/ function getIconsTree(data, names) {
    const icons = data.icons;
    const aliases = data.aliases || Object.create(null);
    const resolved = Object.create(null);
    function resolve(name) {
        if (icons[name]) return resolved[name] = [];
        if (!(name in resolved)) {
            resolved[name] = null;
            const parent = aliases[name] && aliases[name].parent;
            const value = parent && resolve(parent);
            if (value) resolved[name] = [
                parent
            ].concat(value);
        }
        return resolved[name];
    }
    Object.keys(icons).concat(Object.keys(aliases)).forEach(resolve);
    return resolved;
}
/**
* Default values for dimensions
*/ const defaultIconDimensions = Object.freeze({
    left: 0,
    top: 0,
    width: 16,
    height: 16
});
/**
* Default values for transformations
*/ const defaultIconTransformations = Object.freeze({
    rotate: 0,
    vFlip: false,
    hFlip: false
});
/**
* Default values for all optional IconifyIcon properties
*/ const defaultIconProps = Object.freeze({
    ...defaultIconDimensions,
    ...defaultIconTransformations
});
/**
* Default values for all properties used in ExtendedIconifyIcon
*/ const defaultExtendedIconProps = Object.freeze({
    ...defaultIconProps,
    body: "",
    hidden: false
});
/**
* Merge transformations
*/ function mergeIconTransformations(obj1, obj2) {
    const result = {};
    if (!obj1.hFlip !== !obj2.hFlip) result.hFlip = true;
    if (!obj1.vFlip !== !obj2.vFlip) result.vFlip = true;
    const rotate = ((obj1.rotate || 0) + (obj2.rotate || 0)) % 4;
    if (rotate) result.rotate = rotate;
    return result;
}
/**
* Merge icon and alias
*
* Can also be used to merge default values and icon
*/ function mergeIconData(parent, child) {
    const result = mergeIconTransformations(parent, child);
    for(const key in defaultExtendedIconProps)if (key in defaultIconTransformations) {
        if (key in parent && !(key in result)) result[key] = defaultIconTransformations[key];
    } else if (key in child) result[key] = child[key];
    else if (key in parent) result[key] = parent[key];
    return result;
}
/**
* Get icon data, using prepared aliases tree
*/ function internalGetIconData(data, name, tree) {
    const icons = data.icons;
    const aliases = data.aliases || Object.create(null);
    let currentProps = {};
    function parse(name$1) {
        currentProps = mergeIconData(icons[name$1] || aliases[name$1], currentProps);
    }
    parse(name);
    tree.forEach(parse);
    return mergeIconData(data, currentProps);
}
/**
* Extract icons from an icon set
*
* Returns list of icons that were found in icon set
*/ function parseIconSet(data, callback) {
    const names = [];
    if (typeof data !== "object" || typeof data.icons !== "object") return names;
    if (data.not_found instanceof Array) data.not_found.forEach((name)=>{
        callback(name, null);
        names.push(name);
    });
    const tree = getIconsTree(data);
    for(const name in tree){
        const item = tree[name];
        if (item) {
            callback(name, internalGetIconData(data, name, item));
            names.push(name);
        }
    }
    return names;
}
/**
* Optional properties
*/ const optionalPropertyDefaults = {
    provider: "",
    aliases: {},
    not_found: {},
    ...defaultIconDimensions
};
/**
* Check props
*/ function checkOptionalProps(item, defaults) {
    for(const prop in defaults)if (prop in item && typeof item[prop] !== typeof defaults[prop]) return false;
    return true;
}
/**
* Validate icon set, return it as IconifyJSON on success, null on failure
*
* Unlike validateIconSet(), this function is very basic.
* It does not throw exceptions, it does not check metadata, it does not fix stuff.
*/ function quicklyValidateIconSet(obj) {
    if (typeof obj !== "object" || obj === null) return null;
    const data = obj;
    if (typeof data.prefix !== "string" || !obj.icons || typeof obj.icons !== "object") return null;
    if (!checkOptionalProps(obj, optionalPropertyDefaults)) return null;
    const icons = data.icons;
    for(const name in icons){
        const icon = icons[name];
        if (!name || typeof icon.body !== "string" || !checkOptionalProps(icon, defaultExtendedIconProps)) return null;
    }
    const aliases = data.aliases || Object.create(null);
    for(const name in aliases){
        const icon = aliases[name];
        const parent = icon.parent;
        if (!name || typeof parent !== "string" || !icons[parent] && !aliases[parent] || !checkOptionalProps(icon, defaultExtendedIconProps)) return null;
    }
    return data;
}
/**
* Storage by provider and prefix
*/ const dataStorage = Object.create(null);
/**
* Create new storage
*/ function newStorage(provider, prefix) {
    return {
        provider,
        prefix,
        icons: Object.create(null),
        missing: /* @__PURE__ */ new Set()
    };
}
/**
* Get storage for provider and prefix
*/ function getStorage(provider, prefix) {
    const providerStorage = dataStorage[provider] || (dataStorage[provider] = Object.create(null));
    return providerStorage[prefix] || (providerStorage[prefix] = newStorage(provider, prefix));
}
/**
* Add icon set to storage
*
* Returns array of added icons
*/ function addIconSet(storage, data) {
    if (!quicklyValidateIconSet(data)) return [];
    return parseIconSet(data, (name, icon)=>{
        if (icon) storage.icons[name] = icon;
        else storage.missing.add(name);
    });
}
/**
* Add icon to storage
*/ function addIconToStorage(storage, name, icon) {
    try {
        if (typeof icon.body === "string") {
            storage.icons[name] = {
                ...icon
            };
            return true;
        }
    } catch (err) {}
    return false;
}
/**
* List available icons
*/ function listIcons(provider, prefix) {
    let allIcons = [];
    const providers = typeof provider === "string" ? [
        provider
    ] : Object.keys(dataStorage);
    providers.forEach((provider$1)=>{
        const prefixes = typeof provider$1 === "string" && typeof prefix === "string" ? [
            prefix
        ] : Object.keys(dataStorage[provider$1] || {});
        prefixes.forEach((prefix$1)=>{
            const storage = getStorage(provider$1, prefix$1);
            allIcons = allIcons.concat(Object.keys(storage.icons).map((name)=>(provider$1 !== "" ? "@" + provider$1 + ":" : "") + prefix$1 + ":" + name));
        });
    });
    return allIcons;
}
/**
* Expression to test part of icon name.
*
* Used when loading icons from Iconify API due to project naming convension.
* Ignored when using custom icon sets - convension does not apply.
*/ const matchIconName = /^[a-z0-9]+(-[a-z0-9]+)*$/;
/**
* Convert string icon name to IconifyIconName object.
*/ const stringToIcon = (value, validate, allowSimpleName, provider = "")=>{
    const colonSeparated = value.split(":");
    if (value.slice(0, 1) === "@") {
        if (colonSeparated.length < 2 || colonSeparated.length > 3) return null;
        provider = colonSeparated.shift().slice(1);
    }
    if (colonSeparated.length > 3 || !colonSeparated.length) return null;
    if (colonSeparated.length > 1) {
        const name$1 = colonSeparated.pop();
        const prefix = colonSeparated.pop();
        const result = {
            provider: colonSeparated.length > 0 ? colonSeparated[0] : provider,
            prefix,
            name: name$1
        };
        return validate && !validateIconName(result) ? null : result;
    }
    const name = colonSeparated[0];
    const dashSeparated = name.split("-");
    if (dashSeparated.length > 1) {
        const result = {
            provider,
            prefix: dashSeparated.shift(),
            name: dashSeparated.join("-")
        };
        return validate && !validateIconName(result) ? null : result;
    }
    if (allowSimpleName && provider === "") {
        const result = {
            provider,
            prefix: "",
            name
        };
        return validate && !validateIconName(result, allowSimpleName) ? null : result;
    }
    return null;
};
/**
* Check if icon is valid.
*
* This function is not part of stringToIcon because validation is not needed for most code.
*/ const validateIconName = (icon, allowSimpleName)=>{
    if (!icon) return false;
    return !!((allowSimpleName && icon.prefix === "" || !!icon.prefix) && !!icon.name);
};
/**
* Allow storing icons without provider or prefix, making it possible to store icons like "home"
*/ let simpleNames = false;
function allowSimpleNames(allow) {
    if (typeof allow === "boolean") simpleNames = allow;
    return simpleNames;
}
/**
* Get icon data
*
* Returns:
* - IconifyIcon on success, object directly from storage so don't modify it
* - null if icon is marked as missing (returned in `not_found` property from API, so don't bother sending API requests)
* - undefined if icon is missing in storage
*/ function getIconData(name) {
    const icon = typeof name === "string" ? stringToIcon(name, true, simpleNames) : name;
    if (icon) {
        const storage = getStorage(icon.provider, icon.prefix);
        const iconName = icon.name;
        return storage.icons[iconName] || (storage.missing.has(iconName) ? null : void 0);
    }
}
/**
* Add one icon
*/ function addIcon(name, data) {
    const icon = stringToIcon(name, true, simpleNames);
    if (!icon) return false;
    const storage = getStorage(icon.provider, icon.prefix);
    if (data) return addIconToStorage(storage, icon.name, data);
    else {
        storage.missing.add(icon.name);
        return true;
    }
}
/**
* Add icon set
*/ function addCollection(data, provider) {
    if (typeof data !== "object") return false;
    if (typeof provider !== "string") provider = data.provider || "";
    if (simpleNames && !provider && !data.prefix) {
        let added = false;
        if (quicklyValidateIconSet(data)) {
            data.prefix = "";
            parseIconSet(data, (name, icon)=>{
                if (addIcon(name, icon)) added = true;
            });
        }
        return added;
    }
    const prefix = data.prefix;
    if (!validateIconName({
        prefix,
        name: "a"
    })) return false;
    const storage = getStorage(provider, prefix);
    return !!addIconSet(storage, data);
}
/**
* Check if icon data is available
*/ function iconLoaded(name) {
    return !!getIconData(name);
}
/**
* Get full icon
*/ function getIcon(name) {
    const result = getIconData(name);
    return result ? {
        ...defaultIconProps,
        ...result
    } : result;
}
/**
* Default icon customisations values
*/ const defaultIconSizeCustomisations = Object.freeze({
    width: null,
    height: null
});
const defaultIconCustomisations = Object.freeze({
    ...defaultIconSizeCustomisations,
    ...defaultIconTransformations
});
/**
* Regular expressions for calculating dimensions
*/ const unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
const unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
function calculateSize(size, ratio, precision) {
    if (ratio === 1) return size;
    precision = precision || 100;
    if (typeof size === "number") return Math.ceil(size * ratio * precision) / precision;
    if (typeof size !== "string") return size;
    const oldParts = size.split(unitsSplit);
    if (oldParts === null || !oldParts.length) return size;
    const newParts = [];
    let code = oldParts.shift();
    let isNumber = unitsTest.test(code);
    while(true){
        if (isNumber) {
            const num = parseFloat(code);
            if (isNaN(num)) newParts.push(code);
            else newParts.push(Math.ceil(num * ratio * precision) / precision);
        } else newParts.push(code);
        code = oldParts.shift();
        if (code === void 0) return newParts.join("");
        isNumber = !isNumber;
    }
}
function splitSVGDefs(content, tag = "defs") {
    let defs = "";
    const index = content.indexOf("<" + tag);
    while(index >= 0){
        const start = content.indexOf(">", index);
        const end = content.indexOf("</" + tag);
        if (start === -1 || end === -1) break;
        const endEnd = content.indexOf(">", end);
        if (endEnd === -1) break;
        defs += content.slice(start + 1, end).trim();
        content = content.slice(0, index).trim() + content.slice(endEnd + 1);
    }
    return {
        defs,
        content
    };
}
/**
* Merge defs and content
*/ function mergeDefsAndContent(defs, content) {
    return defs ? "<defs>" + defs + "</defs>" + content : content;
}
/**
* Wrap SVG content, without wrapping definitions
*/ function wrapSVGContent(body, start, end) {
    const split = splitSVGDefs(body);
    return mergeDefsAndContent(split.defs, start + split.content + end);
}
/**
* Check if value should be unset. Allows multiple keywords
*/ const isUnsetKeyword = (value)=>value === "unset" || value === "undefined" || value === "none";
/**
* Get SVG attributes and content from icon + customisations
*
* Does not generate style to make it compatible with frameworks that use objects for style, such as React.
* Instead, it generates 'inline' value. If true, rendering engine should add verticalAlign: -0.125em to icon.
*
* Customisations should be normalised by platform specific parser.
* Result should be converted to <svg> by platform specific parser.
* Use replaceIDs to generate unique IDs for body.
*/ function iconToSVG(icon, customisations) {
    const fullIcon = {
        ...defaultIconProps,
        ...icon
    };
    const fullCustomisations = {
        ...defaultIconCustomisations,
        ...customisations
    };
    const box = {
        left: fullIcon.left,
        top: fullIcon.top,
        width: fullIcon.width,
        height: fullIcon.height
    };
    let body = fullIcon.body;
    [
        fullIcon,
        fullCustomisations
    ].forEach((props)=>{
        const transformations = [];
        const hFlip = props.hFlip;
        const vFlip = props.vFlip;
        let rotation = props.rotate;
        if (hFlip) if (vFlip) rotation += 2;
        else {
            transformations.push("translate(" + (box.width + box.left).toString() + " " + (0 - box.top).toString() + ")");
            transformations.push("scale(-1 1)");
            box.top = box.left = 0;
        }
        else if (vFlip) {
            transformations.push("translate(" + (0 - box.left).toString() + " " + (box.height + box.top).toString() + ")");
            transformations.push("scale(1 -1)");
            box.top = box.left = 0;
        }
        let tempValue;
        if (rotation < 0) rotation -= Math.floor(rotation / 4) * 4;
        rotation = rotation % 4;
        switch(rotation){
            case 1:
                tempValue = box.height / 2 + box.top;
                transformations.unshift("rotate(90 " + tempValue.toString() + " " + tempValue.toString() + ")");
                break;
            case 2:
                transformations.unshift("rotate(180 " + (box.width / 2 + box.left).toString() + " " + (box.height / 2 + box.top).toString() + ")");
                break;
            case 3:
                tempValue = box.width / 2 + box.left;
                transformations.unshift("rotate(-90 " + tempValue.toString() + " " + tempValue.toString() + ")");
                break;
        }
        if (rotation % 2 === 1) {
            if (box.left !== box.top) {
                tempValue = box.left;
                box.left = box.top;
                box.top = tempValue;
            }
            if (box.width !== box.height) {
                tempValue = box.width;
                box.width = box.height;
                box.height = tempValue;
            }
        }
        if (transformations.length) body = wrapSVGContent(body, "<g transform=\"" + transformations.join(" ") + "\">", "</g>");
    });
    const customisationsWidth = fullCustomisations.width;
    const customisationsHeight = fullCustomisations.height;
    const boxWidth = box.width;
    const boxHeight = box.height;
    let width;
    let height;
    if (customisationsWidth === null) {
        height = customisationsHeight === null ? "1em" : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
        width = calculateSize(height, boxWidth / boxHeight);
    } else {
        width = customisationsWidth === "auto" ? boxWidth : customisationsWidth;
        height = customisationsHeight === null ? calculateSize(width, boxHeight / boxWidth) : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
    }
    const attributes = {};
    const setAttr = (prop, value)=>{
        if (!isUnsetKeyword(value)) attributes[prop] = value.toString();
    };
    setAttr("width", width);
    setAttr("height", height);
    const viewBox = [
        box.left,
        box.top,
        boxWidth,
        boxHeight
    ];
    attributes.viewBox = viewBox.join(" ");
    return {
        attributes,
        viewBox,
        body
    };
}
/**
* IDs usage:
*
* id="{id}"
* xlink:href="#{id}"
* url(#{id})
*
* From SVG animations:
*
* begin="0;{id}.end"
* begin="{id}.end"
* begin="{id}.click"
*/ /**
* Regular expression for finding ids
*/ const regex = /\sid="(\S+)"/g;
/**
* New random-ish prefix for ids
*
* Do not use dash, it cannot be used in SVG 2 animations
*/ const randomPrefix = "IconifyId" + Date.now().toString(16) + (Math.random() * 16777216 | 0).toString(16);
/**
* Counter for ids, increasing with every replacement
*/ let counter = 0;
/**
* Replace IDs in SVG output with unique IDs
*/ function replaceIDs(body, prefix = randomPrefix) {
    const ids = [];
    let match;
    while(match = regex.exec(body))ids.push(match[1]);
    if (!ids.length) return body;
    const suffix = "suffix" + (Math.random() * 16777216 | Date.now()).toString(16);
    ids.forEach((id)=>{
        const newID = typeof prefix === "function" ? prefix(id) : prefix + (counter++).toString();
        const escapedID = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        body = body.replace(new RegExp("([#;\"])(" + escapedID + ")([\")]|\\.[a-z])", "g"), "$1" + newID + suffix + "$3");
    });
    body = body.replace(new RegExp(suffix, "g"), "");
    return body;
}
/**
* Local storate types and entries
*/ const storage = Object.create(null);
/**
* Set API module
*/ function setAPIModule(provider, item) {
    storage[provider] = item;
}
/**
* Get API module
*/ function getAPIModule(provider) {
    return storage[provider] || storage[""];
}
/**
* Create full API configuration from partial data
*/ function createAPIConfig(source) {
    let resources;
    if (typeof source.resources === "string") resources = [
        source.resources
    ];
    else {
        resources = source.resources;
        if (!(resources instanceof Array) || !resources.length) return null;
    }
    const result = {
        resources,
        path: source.path || "/",
        maxURL: source.maxURL || 500,
        rotate: source.rotate || 750,
        timeout: source.timeout || 5e3,
        random: source.random === true,
        index: source.index || 0,
        dataAfterTimeout: source.dataAfterTimeout !== false
    };
    return result;
}
/**
* Local storage
*/ const configStorage = Object.create(null);
/**
* Redundancy for API servers.
*
* API should have very high uptime because of implemented redundancy at server level, but
* sometimes bad things happen. On internet 100% uptime is not possible.
*
* There could be routing problems. Server might go down for whatever reason, but it takes
* few minutes to detect that downtime, so during those few minutes API might not be accessible.
*
* This script has some redundancy to mitigate possible network issues.
*
* If one host cannot be reached in 'rotate' (750 by default) ms, script will try to retrieve
* data from different host. Hosts have different configurations, pointing to different
* API servers hosted at different providers.
*/ const fallBackAPISources = [
    "https://api.simplesvg.com",
    "https://api.unisvg.com"
];
const fallBackAPI = [];
while(fallBackAPISources.length > 0)if (fallBackAPISources.length === 1) fallBackAPI.push(fallBackAPISources.shift());
else if (Math.random() > .5) fallBackAPI.push(fallBackAPISources.shift());
else fallBackAPI.push(fallBackAPISources.pop());
configStorage[""] = createAPIConfig({
    resources: [
        "https://api.iconify.design"
    ].concat(fallBackAPI)
});
/**
* Add custom config for provider
*/ function addAPIProvider(provider, customConfig) {
    const config = createAPIConfig(customConfig);
    if (config === null) return false;
    configStorage[provider] = config;
    return true;
}
/**
* Get API configuration
*/ function getAPIConfig(provider) {
    return configStorage[provider];
}
/**
* List API providers
*/ function listAPIProviders() {
    return Object.keys(configStorage);
}
const detectFetch = ()=>{
    let callback;
    try {
        callback = fetch;
        if (typeof callback === "function") return callback;
    } catch (err) {}
};
/**
* Fetch function
*/ let fetchModule = detectFetch();
/**
* Set custom fetch() function
*/ function setFetch(fetch$1) {
    fetchModule = fetch$1;
}
/**
* Get fetch() function. Used by Icon Finder Core
*/ function getFetch() {
    return fetchModule;
}
/**
* Calculate maximum icons list length for prefix
*/ function calculateMaxLength(provider, prefix) {
    const config = getAPIConfig(provider);
    if (!config) return 0;
    let result;
    if (!config.maxURL) result = 0;
    else {
        let maxHostLength = 0;
        config.resources.forEach((item)=>{
            const host = item;
            maxHostLength = Math.max(maxHostLength, host.length);
        });
        const url = prefix + ".json?icons=";
        result = config.maxURL - maxHostLength - config.path.length - url.length;
    }
    return result;
}
/**
* Should query be aborted, based on last HTTP status
*/ function shouldAbort(status) {
    return status === 404;
}
/**
* Prepare params
*/ const prepare = (provider, prefix, icons)=>{
    const results = [];
    const maxLength = calculateMaxLength(provider, prefix);
    const type = "icons";
    let item = {
        type,
        provider,
        prefix,
        icons: []
    };
    let length = 0;
    icons.forEach((name, index)=>{
        length += name.length + 1;
        if (length >= maxLength && index > 0) {
            results.push(item);
            item = {
                type,
                provider,
                prefix,
                icons: []
            };
            length = name.length;
        }
        item.icons.push(name);
    });
    results.push(item);
    return results;
};
/**
* Get path
*/ function getPath(provider) {
    if (typeof provider === "string") {
        const config = getAPIConfig(provider);
        if (config) return config.path;
    }
    return "/";
}
/**
* Load icons
*/ const send = (host, params, callback)=>{
    if (!fetchModule) {
        callback("abort", 424);
        return;
    }
    let path = getPath(params.provider);
    switch(params.type){
        case "icons":
            {
                const prefix = params.prefix;
                const icons = params.icons;
                const iconsList = icons.join(",");
                const urlParams = new URLSearchParams({
                    icons: iconsList
                });
                path += prefix + ".json?" + urlParams.toString();
                break;
            }
        case "custom":
            {
                const uri = params.uri;
                path += uri.slice(0, 1) === "/" ? uri.slice(1) : uri;
                break;
            }
        default:
            callback("abort", 400);
            return;
    }
    let defaultError = 503;
    fetchModule(host + path).then((response)=>{
        const status = response.status;
        if (status !== 200) {
            setTimeout(()=>{
                callback(shouldAbort(status) ? "abort" : "next", status);
            });
            return;
        }
        defaultError = 501;
        return response.json();
    }).then((data)=>{
        if (typeof data !== "object" || data === null) {
            setTimeout(()=>{
                if (data === 404) callback("abort", data);
                else callback("next", defaultError);
            });
            return;
        }
        setTimeout(()=>{
            callback("success", data);
        });
    }).catch(()=>{
        callback("next", defaultError);
    });
};
/**
* Export module
*/ const fetchAPIModule = {
    prepare,
    send
};
/**
* Remove callback
*/ function removeCallback(storages, id) {
    storages.forEach((storage)=>{
        const items = storage.loaderCallbacks;
        if (items) storage.loaderCallbacks = items.filter((row)=>row.id !== id);
    });
}
/**
* Update all callbacks for provider and prefix
*/ function updateCallbacks(storage) {
    if (!storage.pendingCallbacksFlag) {
        storage.pendingCallbacksFlag = true;
        setTimeout(()=>{
            storage.pendingCallbacksFlag = false;
            const items = storage.loaderCallbacks ? storage.loaderCallbacks.slice(0) : [];
            if (!items.length) return;
            let hasPending = false;
            const provider = storage.provider;
            const prefix = storage.prefix;
            items.forEach((item)=>{
                const icons = item.icons;
                const oldLength = icons.pending.length;
                icons.pending = icons.pending.filter((icon)=>{
                    if (icon.prefix !== prefix) return true;
                    const name = icon.name;
                    if (storage.icons[name]) icons.loaded.push({
                        provider,
                        prefix,
                        name
                    });
                    else if (storage.missing.has(name)) icons.missing.push({
                        provider,
                        prefix,
                        name
                    });
                    else {
                        hasPending = true;
                        return true;
                    }
                    return false;
                });
                if (icons.pending.length !== oldLength) {
                    if (!hasPending) removeCallback([
                        storage
                    ], item.id);
                    item.callback(icons.loaded.slice(0), icons.missing.slice(0), icons.pending.slice(0), item.abort);
                }
            });
        });
    }
}
/**
* Unique id counter for callbacks
*/ let idCounter = 0;
/**
* Add callback
*/ function storeCallback(callback, icons, pendingSources) {
    const id = idCounter++;
    const abort = removeCallback.bind(null, pendingSources, id);
    if (!icons.pending.length) return abort;
    const item = {
        id,
        icons,
        callback,
        abort
    };
    pendingSources.forEach((storage)=>{
        (storage.loaderCallbacks || (storage.loaderCallbacks = [])).push(item);
    });
    return abort;
}
/**
* Check if icons have been loaded
*/ function sortIcons(icons) {
    const result = {
        loaded: [],
        missing: [],
        pending: []
    };
    const storage = Object.create(null);
    icons.sort((a, b)=>{
        if (a.provider !== b.provider) return a.provider.localeCompare(b.provider);
        if (a.prefix !== b.prefix) return a.prefix.localeCompare(b.prefix);
        return a.name.localeCompare(b.name);
    });
    let lastIcon = {
        provider: "",
        prefix: "",
        name: ""
    };
    icons.forEach((icon)=>{
        if (lastIcon.name === icon.name && lastIcon.prefix === icon.prefix && lastIcon.provider === icon.provider) return;
        lastIcon = icon;
        const provider = icon.provider;
        const prefix = icon.prefix;
        const name = icon.name;
        const providerStorage = storage[provider] || (storage[provider] = Object.create(null));
        const localStorage = providerStorage[prefix] || (providerStorage[prefix] = getStorage(provider, prefix));
        let list;
        if (name in localStorage.icons) list = result.loaded;
        else if (prefix === "" || localStorage.missing.has(name)) list = result.missing;
        else list = result.pending;
        const item = {
            provider,
            prefix,
            name
        };
        list.push(item);
    });
    return result;
}
/**
* Convert icons list from string/icon mix to icons and validate them
*/ function listToIcons(list, validate = true, simpleNames = false) {
    const result = [];
    list.forEach((item)=>{
        const icon = typeof item === "string" ? stringToIcon(item, validate, simpleNames) : item;
        if (icon) result.push(icon);
    });
    return result;
}
/**
* Default RedundancyConfig for API calls
*/ const defaultConfig = {
    resources: [],
    index: 0,
    timeout: 2e3,
    rotate: 750,
    random: false,
    dataAfterTimeout: false
};
/**
* Send query
*/ function sendQuery(config, payload, query, done) {
    const resourcesCount = config.resources.length;
    const startIndex = config.random ? Math.floor(Math.random() * resourcesCount) : config.index;
    let resources;
    if (config.random) {
        let list = config.resources.slice(0);
        resources = [];
        while(list.length > 1){
            const nextIndex = Math.floor(Math.random() * list.length);
            resources.push(list[nextIndex]);
            list = list.slice(0, nextIndex).concat(list.slice(nextIndex + 1));
        }
        resources = resources.concat(list);
    } else resources = config.resources.slice(startIndex).concat(config.resources.slice(0, startIndex));
    const startTime = Date.now();
    let status = "pending";
    let queriesSent = 0;
    let lastError;
    let timer = null;
    let queue = [];
    let doneCallbacks = [];
    if (typeof done === "function") doneCallbacks.push(done);
    /**
	* Reset timer
	*/ function resetTimer() {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    }
    /**
	* Abort everything
	*/ function abort() {
        if (status === "pending") status = "aborted";
        resetTimer();
        queue.forEach((item)=>{
            if (item.status === "pending") item.status = "aborted";
        });
        queue = [];
    }
    /**
	* Add / replace callback to call when execution is complete.
	* This can be used to abort pending query implementations when query is complete or aborted.
	*/ function subscribe(callback, overwrite) {
        if (overwrite) doneCallbacks = [];
        if (typeof callback === "function") doneCallbacks.push(callback);
    }
    /**
	* Get query status
	*/ function getQueryStatus() {
        return {
            startTime,
            payload,
            status,
            queriesSent,
            queriesPending: queue.length,
            subscribe,
            abort
        };
    }
    /**
	* Fail query
	*/ function failQuery() {
        status = "failed";
        doneCallbacks.forEach((callback)=>{
            callback(void 0, lastError);
        });
    }
    /**
	* Clear queue
	*/ function clearQueue() {
        queue.forEach((item)=>{
            if (item.status === "pending") item.status = "aborted";
        });
        queue = [];
    }
    /**
	* Got response from module
	*/ function moduleResponse(item, response, data) {
        const isError = response !== "success";
        queue = queue.filter((queued)=>queued !== item);
        switch(status){
            case "pending":
                break;
            case "failed":
                if (isError || !config.dataAfterTimeout) return;
                break;
            default:
                return;
        }
        if (response === "abort") {
            lastError = data;
            failQuery();
            return;
        }
        if (isError) {
            lastError = data;
            if (!queue.length) if (!resources.length) failQuery();
            else execNext();
            return;
        }
        resetTimer();
        clearQueue();
        if (!config.random) {
            const index = config.resources.indexOf(item.resource);
            if (index !== -1 && index !== config.index) config.index = index;
        }
        status = "completed";
        doneCallbacks.forEach((callback)=>{
            callback(data);
        });
    }
    /**
	* Execute next query
	*/ function execNext() {
        if (status !== "pending") return;
        resetTimer();
        const resource = resources.shift();
        if (resource === void 0) {
            if (queue.length) {
                timer = setTimeout(()=>{
                    resetTimer();
                    if (status === "pending") {
                        clearQueue();
                        failQuery();
                    }
                }, config.timeout);
                return;
            }
            failQuery();
            return;
        }
        const item = {
            status: "pending",
            resource,
            callback: (status$1, data)=>{
                moduleResponse(item, status$1, data);
            }
        };
        queue.push(item);
        queriesSent++;
        timer = setTimeout(execNext, config.rotate);
        query(resource, payload, item.callback);
    }
    setTimeout(execNext);
    return getQueryStatus;
}
/**
* Redundancy instance
*/ function initRedundancy(cfg) {
    const config = {
        ...defaultConfig,
        ...cfg
    };
    let queries = [];
    /**
	* Remove aborted and completed queries
	*/ function cleanup() {
        queries = queries.filter((item)=>item().status === "pending");
    }
    /**
	* Send query
	*/ function query(payload, queryCallback, doneCallback) {
        const query$1 = sendQuery(config, payload, queryCallback, (data, error)=>{
            cleanup();
            if (doneCallback) doneCallback(data, error);
        });
        queries.push(query$1);
        return query$1;
    }
    /**
	* Find instance
	*/ function find(callback) {
        return queries.find((value)=>{
            return callback(value);
        }) || null;
    }
    const instance = {
        query,
        find,
        setIndex: (index)=>{
            config.index = index;
        },
        getIndex: ()=>config.index,
        cleanup
    };
    return instance;
}
function emptyCallback$1() {}
const redundancyCache = Object.create(null);
/**
* Get Redundancy instance for provider
*/ function getRedundancyCache(provider) {
    if (!redundancyCache[provider]) {
        const config = getAPIConfig(provider);
        if (!config) return;
        const redundancy = initRedundancy(config);
        const cachedReundancy = {
            config,
            redundancy
        };
        redundancyCache[provider] = cachedReundancy;
    }
    return redundancyCache[provider];
}
/**
* Send API query
*/ function sendAPIQuery(target, query, callback) {
    let redundancy;
    let send;
    if (typeof target === "string") {
        const api = getAPIModule(target);
        if (!api) {
            callback(void 0, 424);
            return emptyCallback$1;
        }
        send = api.send;
        const cached = getRedundancyCache(target);
        if (cached) redundancy = cached.redundancy;
    } else {
        const config = createAPIConfig(target);
        if (config) {
            redundancy = initRedundancy(config);
            const moduleKey = target.resources ? target.resources[0] : "";
            const api = getAPIModule(moduleKey);
            if (api) send = api.send;
        }
    }
    if (!redundancy || !send) {
        callback(void 0, 424);
        return emptyCallback$1;
    }
    return redundancy.query(query, send, callback)().abort;
}
function emptyCallback() {}
/**
* Function called when new icons have been loaded
*/ function loadedNewIcons(storage) {
    if (!storage.iconsLoaderFlag) {
        storage.iconsLoaderFlag = true;
        setTimeout(()=>{
            storage.iconsLoaderFlag = false;
            updateCallbacks(storage);
        });
    }
}
/**
* Check icon names for API
*/ function checkIconNamesForAPI(icons) {
    const valid = [];
    const invalid = [];
    icons.forEach((name)=>{
        (name.match(matchIconName) ? valid : invalid).push(name);
    });
    return {
        valid,
        invalid
    };
}
/**
* Parse loader response
*/ function parseLoaderResponse(storage, icons, data) {
    function checkMissing() {
        const pending = storage.pendingIcons;
        icons.forEach((name)=>{
            if (pending) pending.delete(name);
            if (!storage.icons[name]) storage.missing.add(name);
        });
    }
    if (data && typeof data === "object") try {
        const parsed = addIconSet(storage, data);
        if (!parsed.length) {
            checkMissing();
            return;
        }
    } catch (err) {
        console.error(err);
    }
    checkMissing();
    loadedNewIcons(storage);
}
/**
* Handle response that can be async
*/ function parsePossiblyAsyncResponse(response, callback) {
    if (response instanceof Promise) response.then((data)=>{
        callback(data);
    }).catch(()=>{
        callback(null);
    });
    else callback(response);
}
/**
* Load icons
*/ function loadNewIcons(storage, icons) {
    if (!storage.iconsToLoad) storage.iconsToLoad = icons;
    else storage.iconsToLoad = storage.iconsToLoad.concat(icons).sort();
    if (!storage.iconsQueueFlag) {
        storage.iconsQueueFlag = true;
        setTimeout(()=>{
            storage.iconsQueueFlag = false;
            const { provider, prefix } = storage;
            const icons$1 = storage.iconsToLoad;
            delete storage.iconsToLoad;
            if (!icons$1 || !icons$1.length) return;
            const customIconLoader = storage.loadIcon;
            if (storage.loadIcons && (icons$1.length > 1 || !customIconLoader)) {
                parsePossiblyAsyncResponse(storage.loadIcons(icons$1, prefix, provider), (data)=>{
                    parseLoaderResponse(storage, icons$1, data);
                });
                return;
            }
            if (customIconLoader) {
                icons$1.forEach((name)=>{
                    const response = customIconLoader(name, prefix, provider);
                    parsePossiblyAsyncResponse(response, (data)=>{
                        const iconSet = data ? {
                            prefix,
                            icons: {
                                [name]: data
                            }
                        } : null;
                        parseLoaderResponse(storage, [
                            name
                        ], iconSet);
                    });
                });
                return;
            }
            const { valid, invalid } = checkIconNamesForAPI(icons$1);
            if (invalid.length) parseLoaderResponse(storage, invalid, null);
            if (!valid.length) return;
            const api = prefix.match(matchIconName) ? getAPIModule(provider) : null;
            if (!api) {
                parseLoaderResponse(storage, valid, null);
                return;
            }
            const params = api.prepare(provider, prefix, valid);
            params.forEach((item)=>{
                sendAPIQuery(provider, item, (data)=>{
                    parseLoaderResponse(storage, item.icons, data);
                });
            });
        });
    }
}
/**
* Load icons
*/ const loadIcons = (icons, callback)=>{
    const cleanedIcons = listToIcons(icons, true, allowSimpleNames());
    const sortedIcons = sortIcons(cleanedIcons);
    if (!sortedIcons.pending.length) {
        let callCallback = true;
        if (callback) setTimeout(()=>{
            if (callCallback) callback(sortedIcons.loaded, sortedIcons.missing, sortedIcons.pending, emptyCallback);
        });
        return ()=>{
            callCallback = false;
        };
    }
    const newIcons = Object.create(null);
    const sources = [];
    let lastProvider, lastPrefix;
    sortedIcons.pending.forEach((icon)=>{
        const { provider, prefix } = icon;
        if (prefix === lastPrefix && provider === lastProvider) return;
        lastProvider = provider;
        lastPrefix = prefix;
        sources.push(getStorage(provider, prefix));
        const providerNewIcons = newIcons[provider] || (newIcons[provider] = Object.create(null));
        if (!providerNewIcons[prefix]) providerNewIcons[prefix] = [];
    });
    sortedIcons.pending.forEach((icon)=>{
        const { provider, prefix, name } = icon;
        const storage = getStorage(provider, prefix);
        const pendingQueue = storage.pendingIcons || (storage.pendingIcons = /* @__PURE__ */ new Set());
        if (!pendingQueue.has(name)) {
            pendingQueue.add(name);
            newIcons[provider][prefix].push(name);
        }
    });
    sources.forEach((storage)=>{
        const list = newIcons[storage.provider][storage.prefix];
        if (list.length) loadNewIcons(storage, list);
    });
    return callback ? storeCallback(callback, sortedIcons, sources) : emptyCallback;
};
/**
* Load one icon using Promise
*/ const loadIcon = (icon)=>{
    return new Promise((fulfill, reject)=>{
        const iconObj = typeof icon === "string" ? stringToIcon(icon, true) : icon;
        if (!iconObj) {
            reject(icon);
            return;
        }
        loadIcons([
            iconObj || icon
        ], (loaded)=>{
            if (loaded.length && iconObj) {
                const data = getIconData(iconObj);
                if (data) {
                    fulfill({
                        ...defaultIconProps,
                        ...data
                    });
                    return;
                }
            }
            reject(icon);
        });
    });
};
/**
* Set custom loader for multiple icons
*/ function setCustomIconsLoader(loader, prefix, provider) {
    getStorage(provider || "", prefix).loadIcons = loader;
}
/**
* Set custom loader for one icon
*/ function setCustomIconLoader(loader, prefix, provider) {
    getStorage(provider || "", prefix).loadIcon = loader;
}
/**
* Convert IconifyIconCustomisations to FullIconCustomisations, checking value types
*/ function mergeCustomisations(defaults, item) {
    const result = {
        ...defaults
    };
    for(const key in item){
        const value = item[key];
        const valueType = typeof value;
        if (key in defaultIconSizeCustomisations) {
            if (value === null || value && (valueType === "string" || valueType === "number")) result[key] = value;
        } else if (valueType === typeof result[key]) result[key] = key === "rotate" ? value % 4 : value;
    }
    return result;
}
const separator = /[\s,]+/;
/**
* Apply "flip" string to icon customisations
*/ function flipFromString(custom, flip) {
    flip.split(separator).forEach((str)=>{
        const value = str.trim();
        switch(value){
            case "horizontal":
                custom.hFlip = true;
                break;
            case "vertical":
                custom.vFlip = true;
                break;
        }
    });
}
/**
* Get rotation value
*/ function rotateFromString(value, defaultValue = 0) {
    const units = value.replace(/^-?[0-9.]*/, "");
    function cleanup(value$1) {
        while(value$1 < 0)value$1 += 4;
        return value$1 % 4;
    }
    if (units === "") {
        const num = parseInt(value);
        return isNaN(num) ? 0 : cleanup(num);
    } else if (units !== value) {
        let split = 0;
        switch(units){
            case "%":
                split = 25;
                break;
            case "deg":
                split = 90;
        }
        if (split) {
            let num = parseFloat(value.slice(0, value.length - units.length));
            if (isNaN(num)) return 0;
            num = num / split;
            return num % 1 === 0 ? cleanup(num) : 0;
        }
    }
    return defaultValue;
}
/**
* Generate <svg>
*/ function iconToHTML(body, attributes) {
    let renderAttribsHTML = body.indexOf("xlink:") === -1 ? "" : " xmlns:xlink=\"http://www.w3.org/1999/xlink\"";
    for(const attr in attributes)renderAttribsHTML += " " + attr + "=\"" + attributes[attr] + "\"";
    return "<svg xmlns=\"http://www.w3.org/2000/svg\"" + renderAttribsHTML + ">" + body + "</svg>";
}
/**
* Encode SVG for use in url()
*
* Short alternative to encodeURIComponent() that encodes only stuff used in SVG, generating
* smaller code.
*/ function encodeSVGforURL(svg) {
    return svg.replace(/"/g, "'").replace(/%/g, "%25").replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E").replace(/\s+/g, " ");
}
/**
* Generate data: URL from SVG
*/ function svgToData(svg) {
    return "data:image/svg+xml," + encodeSVGforURL(svg);
}
/**
* Generate url() from SVG
*/ function svgToURL(svg) {
    return "url(\"" + svgToData(svg) + "\")";
}
let policy;
/**
* Attempt to create policy
*/ function createPolicy() {
    try {
        policy = window.trustedTypes.createPolicy("iconify", {
            createHTML: (s)=>s
        });
    } catch (err) {
        policy = null;
    }
}
/**
* Clean up value for innerHTML assignment
*
* This code doesn't actually clean up anything.
* It is intended be used with Iconify icon data, which has already been validated
*/ function cleanUpInnerHTML(html) {
    if (policy === void 0) createPolicy();
    return policy ? policy.createHTML(html) : html;
}
const defaultExtendedIconCustomisations = {
    ...defaultIconCustomisations,
    inline: false
};
/**
 * Default SVG attributes
 */ const svgDefaults = {
    'xmlns': 'http://www.w3.org/2000/svg',
    'xmlnsXlink': 'http://www.w3.org/1999/xlink',
    'aria-hidden': true,
    'role': 'img'
};
/**
 * Style modes
 */ const commonProps = {
    display: 'inline-block'
};
const monotoneProps = {
    backgroundColor: 'currentColor'
};
const coloredProps = {
    backgroundColor: 'transparent'
};
// Dynamically add common props to variables above
const propsToAdd = {
    Image: 'var(--svg)',
    Repeat: 'no-repeat',
    Size: '100% 100%'
};
const propsToAddTo = {
    WebkitMask: monotoneProps,
    mask: monotoneProps,
    background: coloredProps
};
for(const prefix in propsToAddTo){
    const list = propsToAddTo[prefix];
    for(const prop in propsToAdd){
        list[prefix + prop] = propsToAdd[prop];
    }
}
/**
 * Default values for customisations for inline icon
 */ const inlineDefaults = {
    ...defaultExtendedIconCustomisations,
    inline: true
};
/**
 * Fix size: add 'px' to numbers
 */ function fixSize(value) {
    return value + (value.match(/^[-0-9.]+$/) ? 'px' : '');
}
/**
 * Render icon
 */ const render = (// Icon must be validated before calling this function
icon, // Partial properties
props, // Icon name
name)=>{
    // Get default properties
    const defaultProps = props.inline ? inlineDefaults : defaultExtendedIconCustomisations;
    // Get all customisations
    const customisations = mergeCustomisations(defaultProps, props);
    // Check mode
    const mode = props.mode || 'svg';
    // Create style
    const style = {};
    const customStyle = props.style || {};
    // Create SVG component properties
    const componentProps = {
        ...mode === 'svg' ? svgDefaults : {}
    };
    if (name) {
        const iconName = stringToIcon(name, false, true);
        if (iconName) {
            const classNames = [
                'iconify'
            ];
            const props = [
                'provider',
                'prefix'
            ];
            for (const prop of props){
                if (iconName[prop]) {
                    classNames.push('iconify--' + iconName[prop]);
                }
            }
            componentProps.className = classNames.join(' ');
        }
    }
    // Get element properties
    for(let key in props){
        const value = props[key];
        if (value === void 0) {
            continue;
        }
        switch(key){
            // Properties to ignore
            case 'icon':
            case 'style':
            case 'children':
            case 'onLoad':
            case 'mode':
            case 'ssr':
            case 'fallback':
                break;
            // Forward ref
            case '_ref':
                componentProps.ref = value;
                break;
            // Merge class names
            case 'className':
                componentProps[key] = (componentProps[key] ? componentProps[key] + ' ' : '') + value;
                break;
            // Boolean attributes
            case 'inline':
            case 'hFlip':
            case 'vFlip':
                customisations[key] = value === true || value === 'true' || value === 1;
                break;
            // Flip as string: 'horizontal,vertical'
            case 'flip':
                if (typeof value === 'string') {
                    flipFromString(customisations, value);
                }
                break;
            // Color: copy to style
            case 'color':
                style.color = value;
                break;
            // Rotation as string
            case 'rotate':
                if (typeof value === 'string') {
                    customisations[key] = rotateFromString(value);
                } else if (typeof value === 'number') {
                    customisations[key] = value;
                }
                break;
            // Remove aria-hidden
            case 'ariaHidden':
            case 'aria-hidden':
                if (value !== true && value !== 'true') {
                    delete componentProps['aria-hidden'];
                }
                break;
            // Copy missing property if it does not exist in customisations
            default:
                if (defaultProps[key] === void 0) {
                    componentProps[key] = value;
                }
        }
    }
    // Generate icon
    const item = iconToSVG(icon, customisations);
    const renderAttribs = item.attributes;
    // Inline display
    if (customisations.inline) {
        style.verticalAlign = '-0.125em';
    }
    if (mode === 'svg') {
        // Add style
        componentProps.style = {
            ...style,
            ...customStyle
        };
        // Add icon stuff
        Object.assign(componentProps, renderAttribs);
        // Counter for ids based on "id" property to render icons consistently on server and client
        let localCounter = 0;
        let id = props.id;
        if (typeof id === 'string') {
            // Convert '-' to '_' to avoid errors in animations
            id = id.replace(/-/g, '_');
        }
        // Add icon stuff
        componentProps.dangerouslySetInnerHTML = {
            __html: cleanUpInnerHTML(replaceIDs(item.body, id ? ()=>id + 'ID' + localCounter++ : 'iconifyReact'))
        };
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"])('svg', componentProps);
    }
    // Render <span> with style
    const { body, width, height } = icon;
    const useMask = mode === 'mask' || (mode === 'bg' ? false : body.indexOf('currentColor') !== -1);
    // Generate SVG
    const html = iconToHTML(body, {
        ...renderAttribs,
        width: width + '',
        height: height + ''
    });
    // Generate style
    componentProps.style = {
        ...style,
        '--svg': svgToURL(html),
        'width': fixSize(renderAttribs.width),
        'height': fixSize(renderAttribs.height),
        ...commonProps,
        ...useMask ? monotoneProps : coloredProps,
        ...customStyle
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"])('span', componentProps);
};
/**
 * Initialise stuff
 */ // Enable short names
allowSimpleNames(true);
// Set API module
setAPIModule('', fetchAPIModule);
/**
 * Browser stuff
 */ if (typeof document !== 'undefined' && typeof window !== 'undefined') {
    const _window = window;
    // Load icons from global "IconifyPreload"
    if (_window.IconifyPreload !== void 0) {
        const preload = _window.IconifyPreload;
        const err = 'Invalid IconifyPreload syntax.';
        if (typeof preload === 'object' && preload !== null) {
            (preload instanceof Array ? preload : [
                preload
            ]).forEach((item)=>{
                try {
                    if (// Check if item is an object and not null/array
                    typeof item !== 'object' || item === null || item instanceof Array || // Check for 'icons' and 'prefix'
                    typeof item.icons !== 'object' || typeof item.prefix !== 'string' || // Add icon set
                    !addCollection(item)) {
                        console.error(err);
                    }
                } catch (e) {
                    console.error(err);
                }
            });
        }
    }
    // Set API from global "IconifyProviders"
    if (_window.IconifyProviders !== void 0) {
        const providers = _window.IconifyProviders;
        if (typeof providers === 'object' && providers !== null) {
            for(let key in providers){
                const err = 'IconifyProviders[' + key + '] is invalid.';
                try {
                    const value = providers[key];
                    if (typeof value !== 'object' || !value || value.resources === void 0) {
                        continue;
                    }
                    if (!addAPIProvider(key, value)) {
                        console.error(err);
                    }
                } catch (e) {
                    console.error(err);
                }
            }
        }
    }
}
function IconComponent(props) {
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(!!props.ssr);
    const [abort, setAbort] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    // Get initial state
    function getInitialState(mounted) {
        if (mounted) {
            const name = props.icon;
            if (typeof name === 'object') {
                // Icon as object
                return {
                    name: '',
                    data: name
                };
            }
            const data = getIconData(name);
            if (data) {
                return {
                    name,
                    data
                };
            }
        }
        return {
            name: ''
        };
    }
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(getInitialState(!!props.ssr));
    // Cancel loading
    function cleanup() {
        const callback = abort.callback;
        if (callback) {
            callback();
            setAbort({});
        }
    }
    // Change state if it is different
    function changeState(newState) {
        if (JSON.stringify(state) !== JSON.stringify(newState)) {
            cleanup();
            setState(newState);
            return true;
        }
    }
    // Update state
    function updateState() {
        var _a;
        const name = props.icon;
        if (typeof name === 'object') {
            // Icon as object
            changeState({
                name: '',
                data: name
            });
            return;
        }
        // New icon or got icon data
        const data = getIconData(name);
        if (changeState({
            name,
            data
        })) {
            if (data === undefined) {
                // Load icon, update state when done
                const callback = loadIcons([
                    name
                ], updateState);
                setAbort({
                    callback
                });
            } else if (data) {
                // Icon data is available: trigger onLoad callback if present
                (_a = props.onLoad) === null || _a === void 0 ? void 0 : _a.call(props, name);
            }
        }
    }
    // Mounted state, cleanup for loader
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setMounted(true);
        return cleanup;
    }, []);
    // Icon changed or component mounted
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (mounted) {
            updateState();
        }
    }, [
        props.icon,
        mounted
    ]);
    // Render icon
    const { name, data } = state;
    if (!data) {
        return props.children ? props.children : props.fallback ? props.fallback : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"])('span', {});
    }
    return render({
        ...defaultIconProps,
        ...data
    }, props, name);
}
/**
 * Block icon
 *
 * @param props - Component properties
 */ const Icon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>IconComponent({
        ...props,
        _ref: ref
    }));
/**
 * Inline icon (has negative verticalAlign that makes it behave like icon font)
 *
 * @param props - Component properties
 */ const InlineIcon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>IconComponent({
        inline: true,
        ...props,
        _ref: ref
    }));
/**
 * Internal API
 */ const _api = {
    getAPIConfig,
    setAPIModule,
    sendAPIQuery,
    setFetch,
    getFetch,
    listAPIProviders
};
;

})()),

};

//# sourceMappingURL=_530d0d._.js.map