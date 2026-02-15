"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaExclamationTriangle, FaTimes, FaCheck, FaTrash, FaBan } from "react-icons/fa";

export default function ConfirmModal({ 
  show, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText, 
  cancelText,
  type = "warning", // warning, danger, success, info
  loading = false 
}) {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isRTL = mounted ? i18n.language === "ar" : false;

  if (!show) return null;

  const typeStyles = {
    warning: {
      icon: FaExclamationTriangle,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      confirmBg: "bg-yellow-600 hover:bg-yellow-700",
      headerBg: "from-yellow-50 to-orange-50"
    },
    danger: {
      icon: FaTrash,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      confirmBg: "bg-red-600 hover:bg-red-700",
      headerBg: "from-red-50 to-rose-50"
    },
    success: {
      icon: FaCheck,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      confirmBg: "bg-green-600 hover:bg-green-700",
      headerBg: "from-green-50 to-emerald-50"
    },
    suspend: {
      icon: FaBan,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      confirmBg: "bg-orange-600 hover:bg-orange-700",
      headerBg: "from-orange-50 to-amber-50"
    }
  };

  const style = typeStyles[type] || typeStyles.warning;
  const Icon = style.icon;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      dir={isRTL ? "rtl" : "ltr"}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 bg-gradient-to-r ${style.headerBg}`}>
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`w-14 h-14 ${style.iconBg} rounded-full flex items-center justify-center`}>
              <Icon className={`text-2xl ${style.iconColor}`} />
            </div>
            <div className={isRTL ? 'text-right' : ''}>
              <h2 className="text-xl font-bold text-gray-800">
                {title || t("common.confirm")}
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-gray-400 hover:text-gray-600 transition`}
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className={`text-gray-600 text-base leading-relaxed ${isRTL ? 'text-right' : ''}`}>
            {message || t("messages.confirmDelete")}
          </p>
        </div>

        {/* Footer */}
        <div className={`p-6 bg-gray-50 border-t flex gap-3 ${isRTL ? 'flex-row-reverse' : 'justify-end'}`}>
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition disabled:opacity-50"
          >
            {cancelText || t("common.cancel")}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-6 py-3 ${style.confirmBg} text-white rounded-xl font-semibold transition disabled:opacity-50 flex items-center gap-2`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {t("common.processing")}
              </>
            ) : (
              confirmText || t("common.confirm")
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
