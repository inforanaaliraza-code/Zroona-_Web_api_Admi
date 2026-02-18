"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Image from "next/image";
import axios from "axios";
import { BASE_API_URL } from "@/until";
import LanguageSwitcher from "@/components/LanguageSwitcher/LanguageSwitcher";

export default function VerifyEmailPage() {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState("verifying"); // verifying, success, error
    const [message, setMessage] = useState("");
    const [userRole, setUserRole] = useState(null);

    const handleLanguageChange = (newLang) => {
        i18n.changeLanguage(newLang);
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    };

    useEffect(() => {
        const verifyEmail = async () => {
            // Don't run if already verified or error state is set (prevents multiple runs)
            if (status === "success" || status === "error") {
                return;
            }
            
            const token = searchParams.get("token");
            const role = searchParams.get("role"); // 'guest' or 'host'
            const lang = searchParams.get("lang") || "en";

            // Set language
            if (lang && i18n.language !== lang) {
                i18n.changeLanguage(lang);
            }

            if (!token) {
                setStatus("error");
                setMessage(t("auth.verificationTokenMissing") || "Verification token is missing");
                return;
            }

            setUserRole(role);

            try {
                // Determine which endpoint to try first based on role parameter
                const isHost = role === "host" || role === "organizer";
                
                let response;
                let actualRole = role;
                let verificationSuccessful = false;
                
                // Try the appropriate endpoint first based on role
                if (isHost) {
                    // Try organizer endpoint first for hosts
                    try {
                        const apiEndpoint = `${BASE_API_URL}organizer/verify-email?token=${encodeURIComponent(token)}`;
                        console.log("[VERIFY-EMAIL] Trying organizer endpoint first (role=host):", apiEndpoint);
                        
                        response = await axios.get(apiEndpoint, {
                            headers: {
                                lang: lang || "en",
                            },
                        });
                        
                        console.log("[VERIFY-EMAIL] Organizer endpoint response:", response.data);
                        console.log("[VERIFY-EMAIL] Response status:", response.status);
                        console.log("[VERIFY-EMAIL] Response data status:", response.data?.status);
                        
                        // Check if verification was successful
                        if (response.data?.status === 1 || (response.status === 200 && (response.data?.data?.organizer || response.data?.data?.user))) {
                            actualRole = "host";
                            verificationSuccessful = true;
                            console.log("[VERIFY-EMAIL] Organizer endpoint succeeded - verification successful");
                        } else {
                            throw new Error("Organizer verification not successful");
                        }
                    } catch (organizerError) {
                        console.log("[VERIFY-EMAIL] Organizer endpoint failed, trying guest endpoint as fallback");
                        console.log("[VERIFY-EMAIL] Organizer error:", organizerError.response?.status, organizerError.response?.data);
                        
                        if (!verificationSuccessful) {
                            // Fallback to guest endpoint
                            try {
                                const apiEndpoint = `${BASE_API_URL}user/verify-email?token=${encodeURIComponent(token)}`;
                                console.log("[VERIFY-EMAIL] Trying guest endpoint as fallback:", apiEndpoint);
                                
                                response = await axios.get(apiEndpoint, {
                                    headers: {
                                        lang: lang || "en",
                                    },
                                });
                                
                                if (response.data?.status === 1 || (response.status === 200 && response.data?.data?.user)) {
                                    actualRole = "guest";
                                    verificationSuccessful = true;
                                    console.log("[VERIFY-EMAIL] Guest endpoint succeeded - verification successful");
                                } else {
                                    throw new Error("Guest verification not successful");
                                }
                            } catch (guestError) {
                                // Both failed, throw the organizer error (more relevant)
                                console.error("[VERIFY-EMAIL] Both endpoints failed");
                                throw organizerError.response?.data || organizerError;
                            }
                        }
                    }
                } else {
                    // Try guest endpoint first for guests
                    try {
                        const apiEndpoint = `${BASE_API_URL}user/verify-email?token=${encodeURIComponent(token)}`;
                        console.log("[VERIFY-EMAIL] Trying guest endpoint first (role=guest):", apiEndpoint);
                        
                        response = await axios.get(apiEndpoint, {
                            headers: {
                                lang: lang || "en",
                            },
                        });
                        
                        console.log("[VERIFY-EMAIL] Guest endpoint response:", response.data);
                        console.log("[VERIFY-EMAIL] Response status:", response.status);
                        console.log("[VERIFY-EMAIL] Response data status:", response.data?.status);
                        
                        // Check if verification was successful
                        if (response.data?.status === 1 || (response.status === 200 && response.data?.data?.user)) {
                            actualRole = "guest";
                            verificationSuccessful = true;
                            console.log("[VERIFY-EMAIL] Guest endpoint succeeded - verification successful");
                        } else {
                            throw new Error("Guest verification not successful, trying organizer");
                        }
                    } catch (guestError) {
                        console.log("[VERIFY-EMAIL] Guest endpoint failed, trying organizer endpoint as fallback");
                        console.log("[VERIFY-EMAIL] Guest error:", guestError.response?.status, guestError.response?.data);
                        
                        if (!verificationSuccessful) {
                            try {
                                const apiEndpoint = `${BASE_API_URL}organizer/verify-email?token=${encodeURIComponent(token)}`;
                                console.log("[VERIFY-EMAIL] Trying organizer endpoint as fallback:", apiEndpoint);
                                
                                response = await axios.get(apiEndpoint, {
                                    headers: {
                                        lang: lang || "en",
                                    },
                                });
                                
                                console.log("[VERIFY-EMAIL] Organizer endpoint response:", response.data);
                                
                                if (response.data?.status === 1 || (response.status === 200 && (response.data?.data?.organizer || response.data?.data?.user))) {
                                    actualRole = "host";
                                    verificationSuccessful = true;
                                    console.log("[VERIFY-EMAIL] Organizer endpoint succeeded - verification successful");
                                } else {
                                    throw new Error("Organizer verification not successful");
                                }
                            } catch (organizerError) {
                                // Both failed, throw the more informative error
                                console.error("[VERIFY-EMAIL] Both endpoints failed");
                                throw organizerError.response?.data || organizerError;
                            }
                        }
                    }
                }

                // If we got here and verification was successful, show success
                if (verificationSuccessful && response) {
                    setStatus("success");
                    
                    // Show success message based on role
                    if (actualRole === "host") {
                        setMessage(
                            t("auth.verificationSuccessPendingApproval") || 
                            "Email verified successfully! Your application is now pending admin approval. We will notify you via email once approved."
                        );
                    } else {
                        setMessage(
                            t("auth.verificationSuccessLogin") || 
                            "Email verified successfully! You can now login to your account."
                        );
                    }
                    
                    // Update actualRole state for button display
                    setUserRole(actualRole);
                } else {
                    // If we get here, verification was not successful
                    setStatus("error");
                    const errorMsg = response?.data?.message || response?.message || t("auth.verificationFailed") || "Verification failed";
                    setMessage(errorMsg);
                    console.error("[VERIFY-EMAIL] Verification unsuccessful. Response:", response?.data);
                }
            } catch (error) {
                // Only handle errors if we haven't already set success status
                console.error("[VERIFY-EMAIL] Error:", error);
                console.error("[VERIFY-EMAIL] Error response:", error.response?.data);
                console.error("[VERIFY-EMAIL] Error status:", error.response?.status);
                
                // Check if the error response actually indicates success (200 with status 1)
                if (error.response?.status === 200 && error.response?.data?.status === 1) {
                    setStatus("success");
                    const actualRole = error.response.data.data?.user?.role === 2 ? "host" : "guest";
                    
                    if (actualRole === "host") {
                        setMessage(
                            t("auth.verificationSuccessPendingApproval") || 
                            "Email verified successfully! Your application is now pending admin approval. We will notify you via email once approved."
                        );
                    } else {
                        setMessage(
                            t("auth.verificationSuccessLogin") || 
                            "Email verified successfully! You can now login to your account."
                        );
                    }
                    setUserRole(actualRole);
                } else if (status !== "success") {
                    // Only set error if we haven't already set success
                    setStatus("error");
                    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error ||
                        error.message ||
                        t("auth.verificationError") || 
                        "An error occurred during verification. The link may be expired or invalid.";
                    
                    setMessage(errorMessage);
                    console.error("[VERIFY-EMAIL] Final error state. Error:", error);
                }
            }
        };

        verifyEmail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once on mount

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            {/* Language Switcher - Fixed Top Right */}
            <div className="fixed top-6 right-6 z-50">
                <LanguageSwitcher ChangeLanguage={handleLanguageChange} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full"
            >
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/assets/images/x_F_logo.png"
                            alt="Zuroona"
                            width={180}
                            height={50}
                            className="object-contain"
                        />
                    </div>

                    {/* Status Icon */}
                    <div className="flex justify-center mb-6">
                        {status === "verifying" && (
                            <div className="w-20 h-20 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
                        )}

                        {status === "success" && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", duration: 0.5 }}
                                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
                            >
                                <Icon icon="material-symbols:check-circle" className="w-12 h-12 text-green-600" />
                            </motion.div>
                        )}

                        {status === "error" && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", duration: 0.5 }}
                                className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center"
                            >
                                <Icon icon="material-symbols:error" className="w-12 h-12 text-red-600" />
                            </motion.div>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">
                        {status === "verifying" && (t("auth.verifying") || "Verifying Email...")}
                        {status === "success" && (t("auth.verificationSuccess") || "Email Verified!")}
                        {status === "error" && (t("auth.verificationFailed") || "Verification Failed")}
                    </h1>

                    {/* Message */}
                    <p className="text-center text-gray-600 mb-8">
                        {message || (t("auth.pleaseWait") || "Please wait while we verify your email...")}
                    </p>

                    {/* Actions */}
                    {status === "success" && (
                        <div className="space-y-3">
                            <button
                                onClick={() => router.push("/login")}
                                className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors"
                            >
                                {t("auth.goToLogin") || "Go to Login"}
                            </button>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="space-y-3">
                            <button
                                onClick={() => router.push("/")}
                                className="w-full py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                            >
                                {t("auth.goToHome") || "Go to Homepage"}
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full py-3 px-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition-colors"
                            >
                                {t("auth.tryAgain") || "Try Again"}
                            </button>
                        </div>
                    )}

                    {/* Help Text */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            {t("auth.needHelp") || "Need help?"}{" "}
                            <a href="mailto:infozuroona@gmail.com" className="text-brand-orange hover:text-brand-orange/90 font-semibold">
                                {t("auth.contactSupport") || "Contact Support"}
                            </a>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

