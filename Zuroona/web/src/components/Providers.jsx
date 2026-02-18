"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Suspense, useState, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import RTLHandler from "@/components/RTLHandler/RTLHandler";
import ChunkLoadErrorHandler from "@/components/ChunkLoadErrorHandler";
import { HydrationSafeWrapper } from "@/components/HydrationSafeWrapper";

/** Don't show toast for auth/token-missing messages (guest users on public pages) */
function isAuthTokenMessage(msg) {
  if (typeof msg !== "string") return false;
  const m = msg.toLowerCase();
  return (
    m.includes("authentication token is missing") ||
    (m.includes("token") && (m.includes("missing") || m.includes("invalid") || m.includes("expired"))) ||
    (m.includes("authentication") && (m.includes("login") || m.includes("required")))
  );
}

/**
 * DynamicToastContainer - Handles RTL/LTR without hydration mismatch
 * CRITICAL: Uses useEffect to delay RTL detection until after hydration
 * This ensures server and client render identical HTML initially
 */
function DynamicToastContainer() {
    const [isRTL, setIsRTL] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // Suppress "Authentication token is missing" (and similar) toasts site-wide
        const originalError = toast.error;
        toast.error = (msg, opts) => {
            if (isAuthTokenMessage(String(msg ?? ""))) return;
            originalError(msg, opts);
        };
        return () => { toast.error = originalError; };
    }, []);

    useEffect(() => {
        // CRITICAL: Only update RTL AFTER hydration via useEffect
        // This ensures server-rendered HTML matches client-rendered HTML
        
        const updateRTL = () => {
            if (typeof window === "undefined" || typeof localStorage === "undefined") {
                return;
            }

            try {
                const lang = localStorage.getItem("i18nextLng") || "en";
                const isArabic = lang === "ar";
                setIsRTL(isArabic);
            } catch (error) {
                console.warn("[DynamicToastContainer] Error reading localStorage:", error);
                setIsRTL(false);
            }
        };

        // Update immediately on mount
        updateRTL();
        setIsMounted(true);

        // Listen for language changes
        const handleLanguageChange = (lang) => {
            setIsRTL(lang === "ar");
        };

        i18n.on("languageChanged", handleLanguageChange);

        // Listen for storage changes in other tabs
        const handleStorageChange = (e) => {
            if (e.key === "i18nextLng" && e.newValue) {
                setIsRTL(e.newValue === "ar");
            }
        };

        if (typeof window !== "undefined") {
            window.addEventListener("storage", handleStorageChange);
        }

        return () => {
            i18n.off("languageChanged", handleLanguageChange);
            if (typeof window !== "undefined") {
                window.removeEventListener("storage", handleStorageChange);
            }
        };
    }, []);

    // Always render with LTR until mounted to prevent hydration mismatch
    // The rtl prop and position are only set after hydration is complete
    return (
        <ToastContainer
            position={isMounted && isRTL ? "top-left" : "top-right"}
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={isMounted && isRTL}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            data-hydrated={isMounted}
        />
    );
}

export default function Providers({ children }) {
    return (
        <Provider store={store}>
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-[#a797cc] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading...</p>
                    </div>
                </div>
            }>
                <I18nextProvider i18n={i18n}>
                    <ChunkLoadErrorHandler />
                    <RTLHandler />
                    <DynamicToastContainer />
                    <HydrationSafeWrapper fallback={
                        <div className="flex items-center justify-center min-h-[60vh]" aria-hidden="true">
                            <div className="w-10 h-10 border-2 border-[#a797cc] border-t-transparent rounded-full animate-spin" />
                        </div>
                    }>
                        {children}
                    </HydrationSafeWrapper>
                </I18nextProvider>
            </Suspense>
        </Provider>
    );
}
