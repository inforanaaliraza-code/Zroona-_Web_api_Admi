import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaClock, FaInfoCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function WithdrawalHistory({ data }) {
    const { t } = useTranslation();
    const [expandedId, setExpandedId] = useState(null);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const getStatusConfig = (status) => {
        const configs = {
            0: {
                bg: "bg-gradient-to-r from-yellow-50 to-orange-50",
                border: "border-yellow-300",
                text: "text-yellow-700",
                icon: FaClock,
                iconBg: "bg-yellow-100",
                label: t("earning.pending") || "Pending"
            },
            1: {
                bg: "bg-gradient-to-r from-green-50 to-emerald-50",
                border: "border-green-300",
                text: "text-green-700",
                icon: FaCheckCircle,
                iconBg: "bg-green-100",
                label: t("earning.credited") || "Approved"
            },
            2: {
                bg: "bg-gradient-to-r from-red-50 to-rose-50",
                border: "border-red-300",
                text: "text-red-700",
                icon: FaTimesCircle,
                iconBg: "bg-red-100",
                label: t("earning.failed") || "Rejected"
            }
        };
        return configs[status] || configs[0];
    };

    return (
        <div className="space-y-4">
            {Array.isArray(data) && data.length > 0 ? (
                data.map((transition) => {
                    const statusConfig = getStatusConfig(transition.status);
                    const StatusIcon = statusConfig.icon;
                    const isExpanded = expandedId === transition._id;
                    const hasDetails = transition.rejection_reason || transition.admin_notes || transition.transaction_reference;

                    return (
                        <div
                            key={transition._id}
                            className={`relative border-2 ${statusConfig.border} rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
                                isExpanded ? 'shadow-2xl' : ''
                            }`}
                        >
                            {/* Main Content */}
                            <div className={`${statusConfig.bg} p-6`}>
                                <div className="flex justify-between items-center">
                                    {/* Left: Amount & Icon */}
                                    <div className="flex items-center gap-4">
                                        <div className={`w-16 h-16 ${statusConfig.iconBg} rounded-2xl flex items-center justify-center shadow-md`}>
                                            <StatusIcon className={`text-2xl ${statusConfig.text}`} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-2xl text-gray-900">
                                                {transition.amount} {t('card.tab2') || 'SAR'}
                                            </h4>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {new Intl.DateTimeFormat('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true,
                                                }).format(new Date(transition.createdAt))}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right: Status Badge & Expand Button */}
                                    <div className="flex items-center gap-3">
                                        <div className={`font-bold text-base py-3 px-6 rounded-xl border-2 ${statusConfig.border} ${statusConfig.bg} ${statusConfig.text} shadow-md`}>
                                            {statusConfig.label}
                                        </div>
                                        {hasDetails && (
                                            <button
                                                onClick={() => toggleExpand(transition._id)}
                                                className={`p-3 rounded-xl transition-all ${statusConfig.iconBg} ${statusConfig.text} hover:scale-110`}
                                                title={isExpanded ? "Hide details" : "Show details"}
                                            >
                                                {isExpanded ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {hasDetails && isExpanded && (
                                <div className="bg-white p-6 border-t-2 border-gray-100 animate-slide-down">
                                    <div className="space-y-4">
                                        {/* Rejection Reason */}
                                        {transition.rejection_reason && (
                                            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <FaTimesCircle className="text-red-500 text-xl mt-1 flex-shrink-0" />
                                                    <div>
                                                        <h5 className="font-bold text-red-900 mb-1">Rejection Reason</h5>
                                                        <p className="text-red-700">{transition.rejection_reason}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Admin Notes */}
                                        {transition.admin_notes && (
                                            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <FaInfoCircle className="text-blue-500 text-xl mt-1 flex-shrink-0" />
                                                    <div>
                                                        <h5 className="font-bold text-blue-900 mb-1">Admin Notes</h5>
                                                        <p className="text-blue-700">{transition.admin_notes}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Transaction Reference */}
                                        {transition.transaction_reference && (
                                            <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <FaCheckCircle className="text-green-500 text-xl mt-1 flex-shrink-0" />
                                                    <div>
                                                        <h5 className="font-bold text-green-900 mb-1">Transaction Reference</h5>
                                                        <p className="text-green-700 font-mono font-bold">{transition.transaction_reference}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Processing Info */}
                                        {transition.processed_at && (
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-600 font-medium">Processed Date</p>
                                                        <p className="text-gray-900 font-semibold">
                                                            {new Date(transition.processed_at).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                    </div>
                                                    {transition.processor && (
                                                        <div>
                                                            <p className="text-gray-600 font-medium">Processed By</p>
                                                            <p className="text-gray-900 font-semibold">
                                                                {transition.processor.first_name} {transition.processor.last_name}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })
            ) : (
                <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                            <FaClock className="text-4xl text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg font-medium">{t('earning.tab11') || 'No withdrawal history available'}</p>
                        <p className="text-gray-400 text-sm">Your withdrawal requests will appear here</p>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slide-down {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-slide-down {
                    animation: slide-down 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
