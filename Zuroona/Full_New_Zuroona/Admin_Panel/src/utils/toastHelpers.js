"use client";

import { toast } from "react-toastify";

/**
 * Show only a green tick icon - no message, no close button.
 * Replaces full alert toasts with minimal success indicator.
 */
export function showGreenTick() {
  const GreenTickIcon = () => (
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 shadow-lg">
      <svg
        className="w-7 h-7 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );

  toast.success(<GreenTickIcon />, {
    toastId: "green-tick-success",
    icon: false,
    closeButton: false,
    hideProgressBar: true,
    autoClose: 1500,
    theme: "light",
    style: { background: "transparent", boxShadow: "none" },
    bodyClassName: "!p-0 !bg-transparent !shadow-none !min-w-0 !m-0",
    className: "green-tick-toast !min-w-0 !max-w-none !p-0 !m-0 !bg-transparent !shadow-none !border-0 !rounded-full",
  });
}
