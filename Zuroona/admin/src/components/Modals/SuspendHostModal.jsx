"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function SuspendHostModal({ isOpen, onClose, onConfirm, organizer }) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  const isSuspended = organizer?.is_suspended;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {isSuspended ? t("common.unsuspendHost") : t("common.suspendHost")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <Image
              src="/assets/images/home/close-circle-outline.png"
              alt="Close"
              width={24}
              height={24}
            />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            {isSuspended 
              ? t("common.unsuspendConfirm", { name: `${organizer?.first_name} ${organizer?.last_name}` })
              : t("common.suspendConfirm", { name: `${organizer?.first_name} ${organizer?.last_name}` })
            }
          </p>
          
          {!isSuspended && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-purple-800 mb-2">
                <strong>{t("common.important")}:</strong> {t("common.suspendNotification", { type: t("common.host") })}
              </p>
              <ul className="text-sm text-purple-700 list-disc list-inside space-y-1">
                <li>{t("common.reviewTerms")}</li>
                <li>{t("common.contactInfo")}</li>
                <li className="font-semibold">{t("common.contactEmail")}</li>
              </ul>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-white transition-colors ${
              isSuspended 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {isSuspended ? t("common.unsuspendHost") : t("common.suspendHost")}
          </button>
        </div>
      </div>
    </div>
  );
}

