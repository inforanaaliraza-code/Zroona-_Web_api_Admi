"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Suspense, useState, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import RTLHandler from "@/components/RTLHandler/RTLHandler";

// Dynamic ToastContainer that respects RTL/LTR (GLOBAL)
function DynamicToastContainer() {
    const [isRTL, setIsRTL] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        
        // Get language from localStorage or default
        const getIsRTL = () => {
            if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
                try {
                    const lang = localStorage.getItem("i18nextLng") || "en";
                    return lang === "ar";
                } catch (e) {
                    return false; // Default to LTR (English)
                }
            }
            return false; // Default to LTR (English)
        };

        setIsRTL(getIsRTL());
        
        // Listen for language changes globally (from i18n)
        const handleLanguageChange = (lang) => {
            setIsRTL(lang === "ar");
        };
        
        i18n.on("languageChanged", handleLanguageChange);
        
        // Also listen for storage events (language changes in other tabs/components)
        const handleStorageChange = (e) => {
            if (e.key === "i18nextLng" && e.newValue) {
                setIsRTL(e.newValue === "ar");
            }
        };
        
        window.addEventListener("storage", handleStorageChange);
        
        return () => {
            i18n.off("languageChanged", handleLanguageChange);
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    // Prevent hydration mismatch by not rendering until mounted
    if (!isMounted) {
        return (
            <ToastContainer
                position="top-right"
                autoClose={3000}
                rtl={false}
            />
        );
    }

    return (
        <ToastContainer
            position={isRTL ? "top-left" : "top-right"}
            autoClose={3000}
            rtl={isRTL}
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
                    <RTLHandler />
                    <DynamicToastContainer />
                    {children}
                </I18nextProvider>
            </Suspense>
        </Provider>
    );
}
