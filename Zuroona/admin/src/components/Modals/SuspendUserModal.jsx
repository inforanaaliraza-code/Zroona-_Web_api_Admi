"use client";

import { useState } from "react";
import Image from "next/image";

export default function SuspendUserModal({ isOpen, onClose, onConfirm, user }) {
  if (!isOpen) return null;

  const isSuspended = user?.isActive === false || user?.isActive === 2;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {isSuspended ? "Activate Guest" : "Suspend Guest"}
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
              ? `Are you sure you want to activate ${user?.first_name} ${user?.last_name}?`
              : `Are you sure you want to suspend ${user?.first_name} ${user?.last_name}?`
            }
          </p>
          
          {!isSuspended && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-purple-800 mb-2">
                <strong>Important:</strong> When a guest is suspended, they will receive a notification with the following information:
              </p>
              <ul className="text-sm text-purple-700 list-disc list-inside space-y-1">
                <li>Review the Terms & Conditions and Privacy Policy</li>
                <li>If you feel there is any wrongdoing, contact us at:</li>
                <li className="font-semibold">info@zaroona.sa</li>
              </ul>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-white transition-colors ${
              isSuspended 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {isSuspended ? "Activate" : "Suspend"}
          </button>
        </div>
      </div>
    </div>
  );
}

