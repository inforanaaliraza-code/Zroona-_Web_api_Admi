"use client";

import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { useRTL } from "@/utils/rtl";

/**
 * Universal Confirmation Dialog Component
 * 
 * Usage:
 * <ConfirmDialog
 *   isOpen={showDialog}
 *   onClose={() => setShowDialog(false)}
 *   onConfirm={handleAction}
 *   title="Are you sure?"
 *   description="This action cannot be undone."
 *   confirmText="Yes, Delete"
 *   cancelText="Cancel"
 *   variant="danger" // or "warning", "info", "success"
 *   isLoading={loading}
 * />
 */

export default function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title,
  description,
  confirmText,
  cancelText,
  variant = "warning", // "danger", "warning", "info", "success"
  isLoading = false,
  showIcon = true,
}) {
  const { t } = useTranslation();
  const { isRTL, textAlign, flexDirection } = useRTL();

  // Default texts if not provided
  const defaultTitle = t("confirm.areYouSure") || "Are you sure?";
  const defaultDescription = t("confirm.actionCannotBeUndone") || "This action cannot be undone.";
  const defaultConfirmText = t("confirm.yes") || "Yes, Continue";
  const defaultCancelText = t("confirm.cancel") || "Cancel";

  // Variant configurations
  const variants = {
    danger: {
      icon: "lucide:alert-triangle",
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      buttonBg: "bg-red-500 hover:bg-red-600",
      borderColor: "border-red-200",
    },
    warning: {
      icon: "lucide:alert-circle",
      iconBg: "bg-yellow-50",
      iconColor: "text-yellow-500",
      buttonBg: "bg-yellow-500 hover:bg-yellow-600",
      borderColor: "border-yellow-200",
    },
    info: {
      icon: "lucide:info",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      buttonBg: "bg-blue-500 hover:bg-blue-600",
      borderColor: "border-blue-200",
    },
    success: {
      icon: "lucide:check-circle",
      iconBg: "bg-green-50",
      iconColor: "text-green-500",
      buttonBg: "bg-green-500 hover:bg-green-600",
      borderColor: "border-green-200",
    },
  };

  const config = variants[variant] || variants.warning;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white p-6 shadow-xl transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] z-50">
          <div className={`flex flex-col items-center text-center ${textAlign}`}>
            {showIcon && (
              <div className={`w-16 h-16 ${config.iconBg} rounded-full flex items-center justify-center mb-4`}>
                <Icon icon={config.icon} className={`w-8 h-8 ${config.iconColor}`} />
              </div>
            )}
            
            <Dialog.Title className="text-xl font-semibold text-gray-900 mb-2">
              {title || defaultTitle}
            </Dialog.Title>
            
            <Dialog.Description className={`text-sm text-gray-600 mb-6 ${textAlign}`}>
              {description || defaultDescription}
            </Dialog.Description>
            
            <div className={`flex gap-3 w-full ${flexDirection}`}>
              <Button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 h-11 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {cancelText || defaultCancelText}
              </Button>
              
              <Button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 h-11 rounded-full ${config.buttonBg} text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
                    <span>{t("confirm.processing") || "Processing..."}</span>
                  </div>
                ) : (
                  confirmText || defaultConfirmText
                )}
              </Button>
            </div>
          </div>
          
          <Dialog.Close asChild>
            <button
              className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} inline-flex items-center justify-center rounded-full w-8 h-8 text-gray-500 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 transition-colors`}
              aria-label="Close"
              disabled={isLoading}
            >
              <Icon icon="lucide:x" className="w-4 h-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

