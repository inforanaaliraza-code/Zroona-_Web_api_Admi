(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_components_Invoice_InvoiceStatsDashboard_jsx_a53226._.js", {

"[project]/src/components/Invoice/InvoiceStatsDashboard.jsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@iconify/react/dist/iconify.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$admin$2f$apis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/api/admin/apis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Loader$2f$Loader$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/Loader/Loader.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$react$2d$toastify$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-toastify/dist/react-toastify.esm.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_import__("[project]/node_modules/react-i18next/dist/es/index.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-i18next/dist/es/useTranslation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
var _s = __turbopack_refresh__.signature();
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
const Bar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_require__("[project]/node_modules/react-chartjs-2/dist/index.js [app-client] (ecmascript, async loader)")(__turbopack_import__).then((mod)=>mod.Bar), {
    loadableGenerated: {
        modules: [
            "src/components/Invoice/InvoiceStatsDashboard.jsx -> " + "react-chartjs-2"
        ]
    },
    ssr: false,
    loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-80 flex items-center justify-center",
            children: "Loading chart..."
        }, void 0, false, {
            fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
            lineNumber: 14,
            columnNumber: 18
        }, this)
});
_c = Bar;
// Lazy register Chart.js components
let chartRegistered = false;
const registerChart = ()=>{
    if (typeof window !== 'undefined' && !chartRegistered) {
        __turbopack_require__("[project]/node_modules/chart.js/dist/chart.js [app-client] (ecmascript, async loader) <facade>")(__turbopack_import__).then(({ Chart: ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend })=>{
            ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
            chartRegistered = true;
        });
    }
};
const InvoiceStatsDashboard = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c1 = _s(()=>{
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"])();
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        registerChart();
        fetchStats();
    }, []);
    const fetchStats = async ()=>{
        setLoading(true);
        setError(null);
        try {
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$admin$2f$apis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GetInvoiceStatsApi"])();
            console.log("Invoice Stats API Response:", res);
            // Check if response exists and has valid data
            if (res && (res.status === 1 || res.code === 200)) {
                if (res.data) {
                    setStats(res.data);
                } else {
                    // Response is successful but no data
                    setError(t('invoice.stats.noData'));
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$react$2d$toastify$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].warning(t('invoice.stats.noData'));
                }
            } else if (res) {
                // Response exists but indicates error
                const errorMsg = res.message || res.error || t('invoice.stats.fetchError');
                setError(errorMsg);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$react$2d$toastify$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(errorMsg);
            } else {
                // No response at all
                setError(t('invoice.stats.fetchError'));
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$react$2d$toastify$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(t('invoice.stats.fetchError'));
            }
        } catch (err) {
            console.error("Error fetching invoice stats:", err);
            const errorMsg = err?.response?.data?.message || err?.message || t('invoice.stats.fetchError');
            setError(errorMsg);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$react$2d$toastify$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(errorMsg);
        } finally{
            setLoading(false);
        }
    };
    // Memoize chart data to prevent unnecessary recalculations
    // IMPORTANT: All hooks must be called before any conditional returns
    const chartData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!stats?.monthly_trends) return null;
        const monthlyData = stats.monthly_trends.map((m)=>m.total_amount);
        const monthlyLabels = stats.monthly_trends.map((m)=>new Date(m._id.year, m._id.month - 1).toLocaleString('default', {
                month: 'short',
                year: 'numeric'
            }));
        const monthlyInvoiceCount = stats.monthly_trends.map((m)=>m.total_invoices);
        return {
            labels: monthlyLabels,
            datasets: [
                {
                    label: t('invoice.stats.revenue'),
                    data: monthlyData,
                    backgroundColor: 'rgba(167, 151, 204, 0.8)',
                    borderColor: 'rgba(167, 151, 204, 1)',
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: t('invoice.stats.invoiceCount'),
                    data: monthlyInvoiceCount,
                    backgroundColor: 'rgba(163, 204, 105, 0.8)',
                    borderColor: 'rgba(163, 204, 105, 1)',
                    borderWidth: 1,
                    yAxisID: 'y1'
                }
            ]
        };
    }, [
        stats?.monthly_trends,
        t
    ]);
    const chartOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#4a5568'
                    }
                },
                title: {
                    display: true,
                    text: t('invoice.stats.monthlyTrendTitle'),
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
                                if (context.datasetIndex === 0) {
                                    label += new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'SAR'
                                    }).format(context.parsed.y);
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
                    ticks: {
                        color: '#4a5568'
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks: {
                        color: '#4a5568'
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    },
                    title: {
                        display: true,
                        text: 'Revenue (SAR)',
                        color: '#4a5568'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    ticks: {
                        color: '#4a5568'
                    },
                    grid: {
                        drawOnChartArea: false
                    },
                    title: {
                        display: true,
                        text: 'Invoice Count',
                        color: '#4a5568'
                    }
                }
            }
        }), [
        t
    ]);
    // Early returns AFTER all hooks
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-center items-center py-10",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Loader$2f$Loader$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                lineNumber: 184,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
            lineNumber: 183,
            columnNumber: 13
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-10 text-red-500 font-semibold",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                    icon: "mdi:alert-circle-outline",
                    className: "w-10 h-10 mx-auto mb-3"
                }, void 0, false, {
                    fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                    lineNumber: 192,
                    columnNumber: 17
                }, this),
                error
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
            lineNumber: 191,
            columnNumber: 13
        }, this);
    }
    if (!stats) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-10 text-gray-500",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                    icon: "mdi:information-outline",
                    className: "w-10 h-10 mx-auto mb-3"
                }, void 0, false, {
                    fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                    lineNumber: 201,
                    columnNumber: 17
                }, this),
                t('invoice.stats.noData')
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
            lineNumber: 200,
            columnNumber: 13
        }, this);
    }
    const StatCard = ({ title, value, icon, color, bgColor, subValue })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `bg-white rounded-xl shadow-md p-5 flex items-center justify-between border border-gray-100 animate-fade-in hover:shadow-lg transition-shadow duration-300`,
            style: {
                animationDelay: '0.1s'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-sm font-medium text-gray-500",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                            lineNumber: 210,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: `text-2xl font-bold ${color} mt-1`,
                            children: value
                        }, void 0, false, {
                            fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                            lineNumber: 211,
                            columnNumber: 17
                        }, this),
                        subValue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-gray-400 mt-1",
                            children: subValue
                        }, void 0, false, {
                            fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                            lineNumber: 212,
                            columnNumber: 30
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                    lineNumber: 209,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                    icon: icon,
                    className: `w-10 h-10 ${color} opacity-30`
                }, void 0, false, {
                    fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                    lineNumber: 214,
                    columnNumber: 13
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
            lineNumber: 208,
            columnNumber: 9
        }, this);
    const SecondaryStatCard = ({ title, value, icon, color })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-xl shadow-sm p-4 flex items-center gap-3 border border-gray-100 animate-fade-in hover:shadow-md transition-shadow duration-300",
            style: {
                animationDelay: '0.2s'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                    icon: icon,
                    className: `w-7 h-7 ${color}`
                }, void 0, false, {
                    fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                    lineNumber: 220,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                            className: "text-xs font-medium text-gray-500",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                            lineNumber: 222,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: `text-lg font-semibold ${color}`,
                            children: value
                        }, void 0, false, {
                            fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                            lineNumber: 223,
                            columnNumber: 17
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                    lineNumber: 221,
                    columnNumber: 13
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
            lineNumber: 219,
            columnNumber: 9
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        title: t('invoice.stats.totalInvoices'),
                        value: stats.total_invoices,
                        icon: "mdi:file-document-multiple-outline",
                        color: "text-[#a797cc]",
                        subValue: `${stats.recent_invoices} ${t('invoice.stats.lastSevenDays')}`
                    }, void 0, false, {
                        fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                        lineNumber: 232,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        title: t('invoice.stats.pendingInvoices'),
                        value: stats.pending_invoices,
                        icon: "mdi:clock-time-four-outline",
                        color: "text-yellow-500"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                        lineNumber: 239,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        title: t('invoice.stats.confirmedInvoices'),
                        value: stats.confirmed_invoices,
                        icon: "mdi:check-circle-outline",
                        color: "text-green-500"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                        lineNumber: 245,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        title: t('invoice.stats.completedInvoices'),
                        value: stats.completed_invoices,
                        icon: "mdi:checkbox-marked-circle-outline",
                        color: "text-blue-500"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                        lineNumber: 251,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                lineNumber: 231,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-4 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SecondaryStatCard, {
                        title: t('invoice.stats.totalRevenue'),
                        value: `${stats.total_amount.toFixed(2)} SAR`,
                        icon: "mdi:currency-usd",
                        color: "text-[#a797cc]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                        lineNumber: 261,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SecondaryStatCard, {
                        title: t('invoice.stats.avgInvoiceAmount'),
                        value: `${stats.avg_amount.toFixed(2)} SAR`,
                        icon: "mdi:calculator",
                        color: "text-blue-500"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                        lineNumber: 267,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SecondaryStatCard, {
                        title: t('invoice.stats.maxInvoiceAmount'),
                        value: `${stats.max_amount.toFixed(2)} SAR`,
                        icon: "mdi:arrow-up-bold-circle-outline",
                        color: "text-green-600"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                        lineNumber: 273,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SecondaryStatCard, {
                        title: t('invoice.stats.cancelledInvoices'),
                        value: stats.cancelled_invoices,
                        icon: "mdi:close-circle-outline",
                        color: "text-red-500"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                        lineNumber: 279,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                lineNumber: 260,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-fade-in",
                        style: {
                            animationDelay: '0.3s'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-gray-800 mb-4",
                                children: t('invoice.stats.monthlyTrendTitle')
                            }, void 0, false, {
                                fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                                lineNumber: 290,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-80",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Bar, {
                                    data: chartData,
                                    options: chartOptions
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                                    lineNumber: 292,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                                lineNumber: 291,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                        lineNumber: 289,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-1 bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-fade-in",
                        style: {
                            animationDelay: '0.4s'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-gray-800 mb-4",
                                children: t('invoice.stats.topEvents')
                            }, void 0, false, {
                                fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                                lineNumber: 297,
                                columnNumber: 21
                            }, this),
                            stats.top_events.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "space-y-3",
                                children: stats.top_events.map((event, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold text-lg text-[#a797cc]",
                                                        children: [
                                                            index + 1,
                                                            "."
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                                                        lineNumber: 303,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-10 h-10 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            src: event.event_image ? event.event_image.includes('http') ? event.event_image : `${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_BASE || "http://localhost:3434"}${event.event_image}` : "/assets/images/dummyImage.png",
                                                            alt: event.event_name,
                                                            width: 40,
                                                            height: 40,
                                                            className: "object-cover w-full h-full"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                                                            lineNumber: 305,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                                                        lineNumber: 304,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm font-medium text-gray-700 truncate max-w-[150px]",
                                                                children: event.event_name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                                                                lineNumber: 314,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-gray-500",
                                                                children: [
                                                                    event.total_invoices,
                                                                    " ",
                                                                    t('invoice.stats.invoices')
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                                                                lineNumber: 315,
                                                                columnNumber: 45
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                                                        lineNumber: 313,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                                                lineNumber: 302,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-semibold text-gray-800",
                                                children: [
                                                    event.total_amount.toFixed(0),
                                                    " SAR"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                                                lineNumber: 318,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, event._id, true, {
                                        fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                                        lineNumber: 301,
                                        columnNumber: 33
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                                lineNumber: 299,
                                columnNumber: 25
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-500 text-sm",
                                children: t('invoice.stats.noTopEvents')
                            }, void 0, false, {
                                fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                                lineNumber: 323,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                        lineNumber: 296,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
                lineNumber: 288,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Invoice/InvoiceStatsDashboard.jsx",
        lineNumber: 229,
        columnNumber: 9
    }, this);
}, "UKX5l36oCKVlcIZCVLahDiSlCZ0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
})), "UKX5l36oCKVlcIZCVLahDiSlCZ0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c2 = InvoiceStatsDashboard;
InvoiceStatsDashboard.displayName = 'InvoiceStatsDashboard';
const __TURBOPACK__default__export__ = InvoiceStatsDashboard;
var _c, _c1, _c2;
__turbopack_refresh__.register(_c, "Bar");
__turbopack_refresh__.register(_c1, "InvoiceStatsDashboard$memo");
__turbopack_refresh__.register(_c2, "InvoiceStatsDashboard");

})()),
}]);

//# sourceMappingURL=src_components_Invoice_InvoiceStatsDashboard_jsx_a53226._.js.map