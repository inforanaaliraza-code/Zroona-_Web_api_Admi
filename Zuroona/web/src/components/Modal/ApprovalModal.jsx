import React from "react";
import { useTranslation } from "react-i18next";

function ApprovalModal({ show, onClose, onConfirm, title, message }) {
  const { t } = useTranslation();
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[10000] ${show ? '' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-800">{message}</p>
        <div className="flex justify-center space-x-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg text-gray-900"
          >
            {t('approve.tab5')}
          </button>
          <button
            className="px-4 py-2 bg-[#a797cc] text-white rounded-lg"
            onClick={onConfirm} // Call onConfirm passed from ManageEventOrganizer
          >
            {title.includes("Approve") ? t('approve.tab6') : t('approve.tab7')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApprovalModal;
