"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip-shadcn";
import { toast } from "react-toastify";
import { setSelectedMethod, setProcessing, resetPaymentState } from "@/redux/slices/paymentMethodSlice";
import { isAppleDevice, shouldShowApplePay } from "@/utils/deviceDetection";

// Helper function to safely get translations with fallbacks
const getTranslation = (t, key, fallback) => {
  try {
    const translation = t(key);
    if (translation === key || !translation) {
      return fallback;
    }
    return translation;
  } catch (error) {
    return fallback;
  }
};

export default function PaymentModal({
  isOpen,
  onClose,
  event,
  totalAmount,
  onPaymentComplete,
}) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { selectedMethod, isProcessing } = useSelector((state) => state.paymentMethod);
  
  const [showApplePay, setShowApplePay] = useState(false);
  const moyasarFormRef = useRef(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Check if Apple Pay should be shown
  useEffect(() => {
    if (isOpen) {
      const isApple = isAppleDevice();
      setShowApplePay(isApple && shouldShowApplePay());
      // Reset payment state when modal opens
      dispatch(resetPaymentState());
    }
  }, [isOpen, dispatch]);

  // Handle payment method selection
  const handleMethodSelect = (method) => {
    dispatch(setSelectedMethod(method));
  };

  // Initialize Moyasar payment form
  const initializeMoyasarForm = useCallback(() => {
    if (!moyasarFormRef.current || !selectedMethod) return;

    try {
      const moyasar = window.Moyasar;
      if (!moyasar) {
        console.error("[PAYMENT-MODAL] Moyasar not loaded");
        toast.error(getTranslation(t, "events.paymentInitError", "Payment gateway not loaded. Please refresh and try again."));
        return;
      }

      const currentLang = i18n.language || "ar";
      const apiKey = process.env.NEXT_PUBLIC_MOYASAR_KEY;
      if (!apiKey) {
        console.error("[PAYMENT-MODAL] Moyasar API key not configured");
        toast.error(getTranslation(t, "events.paymentInitError", "Payment gateway configuration error."));
        return;
      }

      // Clear previous form
      if (moyasarFormRef.current && moyasarFormRef.current.parentNode) {
        try {
          while (moyasarFormRef.current.firstChild) {
            moyasarFormRef.current.removeChild(moyasarFormRef.current.firstChild);
          }
        } catch (error) {
          moyasarFormRef.current.textContent = "";
        }
      }

      if (!totalAmount || totalAmount <= 0) {
        console.error("[PAYMENT-MODAL] Invalid amount:", totalAmount);
        toast.error(getTranslation(t, "events.invalidAmount", "Invalid payment amount."));
        return;
      }

      const amountInHalala = Math.round(totalAmount * 100);
      const callbackUrl = `${window.location.origin}/events/${event?._id}?booking_id=${event?.booked_event?._id}&status=paid`;

      // Determine payment methods based on selection
      let paymentMethods = ['creditcard'];
      if (selectedMethod === 'applepay' && showApplePay) {
        paymentMethods = ['applepay', 'creditcard'];
      }

      const moyasarConfig = {
        element: moyasarFormRef.current,
        amount: amountInHalala,
        currency: "SAR",
        callback_url: callbackUrl,
        description: `${getTranslation(t, "events.bookEvent", "Booking for")} ${event?.event_name || getTranslation(t, "events.eventDetails", "Event")}`,
        publishable_api_key: apiKey,
        methods: paymentMethods,
        language: currentLang,
        three_d_secure: {
          enabled: true,
          timeout: 30000,
        },
      };

      // Add Apple Pay config if selected
      if (selectedMethod === 'applepay' && showApplePay) {
        moyasarConfig.apple_pay = {
          country: "SA",
          label: getTranslation(t, "events.appName", "Zuroona"),
          validate_merchant_url: "https://api.moyasar.com/v1/applepay/initiate",
          merchant_capabilities: [
            "supports3DS",
            "supportsCredit",
            "supportsDebit",
          ],
        };
      }

      moyasar.init({
        ...moyasarConfig,
        on_failed: (error) => {
          console.error("[PAYMENT-MODAL] Payment failed:", error);
          toast.error(getTranslation(t, "events.paymentFailed", "Payment failed. Please try again."));
          dispatch(setProcessing(false));
        },
        on_completed: async function (payment) {
          console.log("[PAYMENT-MODAL] Payment completed:", payment);
          dispatch(setProcessing(true));
          try {
            if (payment && payment.status === "paid") {
              await onPaymentComplete?.(payment);
              toast.success(getTranslation(t, "events.paymentSuccess", "Payment completed successfully!"));
              onClose();
            } else {
              toast.error(getTranslation(t, "events.paymentFailed", "Payment was not successful."));
            }
          } catch (error) {
            console.error("[PAYMENT-MODAL] Error handling payment:", error);
            toast.error(getTranslation(t, "events.paymentProcessingError", "Error processing payment."));
          } finally {
            dispatch(setProcessing(false));
          }
        },
      });

      console.log("[PAYMENT-MODAL] Moyasar form initialized successfully");
    } catch (error) {
      console.error("[PAYMENT-MODAL] Payment initialization error:", error);
      toast.error(getTranslation(t, "events.paymentInitError", "Error initializing payment."));
      dispatch(setProcessing(false));
    }
  }, [totalAmount, event, selectedMethod, showApplePay, t, i18n.language, onPaymentComplete, onClose, dispatch]);

  // Load Moyasar script and initialize form when method is selected
  useEffect(() => {
    if (!isOpen || !selectedMethod) return;

    const loadMoyasarScript = () => {
      return new Promise((resolve, reject) => {
        if (window.Moyasar) {
          resolve();
          return;
        }

        const existingScript = document.querySelector('script[src*="moyasar"]');
        if (existingScript) {
          existingScript.onload = () => {
            if (window.Moyasar) resolve();
            else reject(new Error('Moyasar not available'));
          };
          existingScript.onerror = () => reject(new Error('Failed to load Moyasar'));
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.moyasar.com/mpf/1.15.0/moyasar.js';
        script.async = true;
        script.onload = () => {
          if (window.Moyasar) {
            window.MoyasarReady = true;
            resolve();
          } else {
            reject(new Error('Moyasar not available'));
          }
        };
        script.onerror = () => reject(new Error('Failed to load Moyasar'));
        document.body.appendChild(script);
      });
    };

    const initForm = async () => {
      if (!moyasarFormRef.current) return;

      setIsInitializing(true);
      try {
        if (!window.Moyasar) {
          await loadMoyasarScript();
        }
        await new Promise(resolve => setTimeout(resolve, 100));
        if (window.Moyasar && moyasarFormRef.current) {
          initializeMoyasarForm();
        }
      } catch (error) {
        console.error('[PAYMENT-MODAL] Error loading Moyasar:', error);
        toast.error(getTranslation(t, "events.paymentInitError", "Failed to load payment gateway."));
      } finally {
        setIsInitializing(false);
      }
    };

    const timeoutId = setTimeout(() => {
      initForm();
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      if (moyasarFormRef.current) {
        try {
          while (moyasarFormRef.current.firstChild) {
            moyasarFormRef.current.removeChild(moyasarFormRef.current.firstChild);
          }
        } catch (error) {
          moyasarFormRef.current.textContent = "";
        }
      }
    };
  }, [isOpen, selectedMethod, initializeMoyasarForm, t]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Icon icon="lucide:credit-card" className="w-6 h-6 text-[#a797cc]" />
            {getTranslation(t, "events.processPayment", "Process Payment")}
          </DialogTitle>
          <DialogDescription>
            {getTranslation(t, "events.selectPaymentMethod", "Select your preferred payment method to complete the booking")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Payment Summary Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#a797cc]/10 via-purple-50/30 to-[#8ba179]/10 p-6 border border-[#a797cc]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  {getTranslation(t, "events.totalAmount", "Total Amount")}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black bg-gradient-to-r from-[#a797cc] via-purple-600 to-[#8ba179] bg-clip-text text-transparent">
                    {totalAmount.toFixed(2)}
                  </span>
                  <span className="text-xl font-bold text-gray-700">SAR</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Including all fees and taxes</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-[#a797cc] via-purple-500 to-[#8ba179] rounded-2xl flex items-center justify-center shadow-xl">
                <Icon icon="lucide:wallet" className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Icon icon="lucide:shield-check" className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800">
                {getTranslation(t, "events.securePayment", "Secure payment powered by Moyasar")}
              </p>
              <p className="text-xs text-gray-600">256-bit SSL encryption • PCI DSS compliant</p>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">
              {getTranslation(t, "events.selectPaymentMethod", "Select Payment Method")}
            </h3>
            
            <div className="grid gap-4">
              {/* Apple Pay Option (Mac only) */}
              {showApplePay && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleMethodSelect('applepay')}
                        disabled={isProcessing}
                        className={`relative w-full p-6 rounded-2xl border-2 transition-all duration-300 ${
                          selectedMethod === 'applepay'
                            ? 'border-[#a797cc] bg-[#a797cc]/5 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-[#a797cc]/50 hover:bg-gray-50'
                        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                              selectedMethod === 'applepay'
                                ? 'bg-gradient-to-br from-[#a797cc] to-purple-600'
                                : 'bg-gray-100'
                            }`}>
                              <Icon 
                                icon="lucide:smartphone" 
                                className={`w-7 h-7 ${
                                  selectedMethod === 'applepay' ? 'text-white' : 'text-gray-600'
                                }`}
                              />
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-gray-900">Apple Pay</p>
                              <p className="text-sm text-gray-500">Pay securely with Face ID or Touch ID</p>
                            </div>
                          </div>
                          {selectedMethod === 'applepay' && (
                            <div className="w-6 h-6 rounded-full bg-[#a797cc] flex items-center justify-center">
                              <Icon icon="lucide:check" className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Quick and secure payment using Apple Pay</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {/* Credit Card Option */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleMethodSelect('card')}
                      disabled={isProcessing}
                      className={`relative w-full p-6 rounded-2xl border-2 transition-all duration-300 ${
                        selectedMethod === 'card'
                          ? 'border-[#a797cc] bg-[#a797cc]/5 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-[#a797cc]/50 hover:bg-gray-50'
                      } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                            selectedMethod === 'card'
                              ? 'bg-gradient-to-br from-[#a797cc] to-purple-600'
                              : 'bg-gray-100'
                          }`}>
                            <Icon 
                              icon="lucide:credit-card" 
                              className={`w-7 h-7 ${
                                selectedMethod === 'card' ? 'text-white' : 'text-gray-600'
                              }`}
                            />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-gray-900">
                              {getTranslation(t, "events.creditCard", "Credit / Debit Card")}
                            </p>
                            <p className="text-sm text-gray-500">Visa, Mastercard, Mada, AMEX</p>
                          </div>
                        </div>
                        {selectedMethod === 'card' && (
                          <div className="w-6 h-6 rounded-full bg-[#a797cc] flex items-center justify-center">
                            <Icon icon="lucide:check" className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enter your card details to complete payment</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Payment Form (shown when method is selected) */}
          {selectedMethod && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Icon icon="lucide:credit-card" className="w-5 h-5 text-[#a797cc]" />
                <h3 className="text-lg font-bold text-gray-900">
                  {getTranslation(t, "events.paymentDetails", "Payment Details")}
                </h3>
              </div>

              <div className="relative">
                <div
                  ref={moyasarFormRef}
                  id="moyasar-payment-form"
                  className="w-full min-h-[400px] bg-white rounded-2xl p-6 border-2 border-gray-100"
                >
                  {isInitializing && (
                    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#a797cc] to-purple-600 rounded-2xl flex items-center justify-center animate-pulse">
                          <Icon icon="lucide:credit-card" className="w-10 h-10 text-white" />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-800">
                          {getTranslation(t, "events.loadingPaymentForm", "Loading secure payment form...")}
                        </p>
                        <p className="text-sm text-gray-500">Please wait</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Accepted Cards */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <Icon icon="lucide:lock" className="w-5 h-5 text-emerald-600" />
                  <p className="text-sm font-semibold text-gray-800">
                    {getTranslation(t, "events.acceptedCards", "We accept Visa, Mastercard, Mada, and AMEX")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                    VISA
                  </div>
                  <div className="w-12 h-8 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                    MC
                  </div>
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                    MADA
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
            className="px-6"
          >
            {getTranslation(t, "events.cancel", "Cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
