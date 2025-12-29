"use client";
import React, { useState } from "react";

function RejectEventModal({ show, onClose, onConfirm, title, message }) {
  const [rejectionReason, setRejectionReason] = useState("");

  const handleConfirm = () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    onConfirm(rejectionReason);
    setRejectionReason(""); // Reset after confirmation
  };

  const handleClose = () => {
    setRejectionReason(""); // Reset on close
    onClose();
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[10000] ${show ? '' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-800 mb-4">{message}</p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rejection Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:border-transparent"
            rows="4"
            placeholder="Please specify the reason for rejecting this event..."
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 rounded-lg text-gray-900 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-[#e94e2e] text-white rounded-lg hover:bg-[#d43e1e] transition"
            onClick={handleConfirm}
          >
            Reject Event
          </button>
        </div>
      </div>
    </div>
  );
}

export default RejectEventModal;

