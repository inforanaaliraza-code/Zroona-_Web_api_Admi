"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState("verifying"); // verifying, success, error
    const [message, setMessage] = useState("");
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const verifyEmail = async () => {
            // Don't run if already verified or error state is set (prevents multiple runs)
            if (status === "success" || status === "error") {
                return;
            }
            
            const token = searchParams.get("token");
            const role = searchParams.get("role"); // 'guest' or 'host'
            const lang = searchParams.get("lang") || "en";

            if (!token) {
                setStatus("error");
                setMessage("Verification token is missing");
                return;
            }

            setUserRole(role);

            try {
                // Determine which endpoint to try first based on role parameter
                const isHost = role === "host" || role === "organizer";
                
                // Get the API base URL - user/organizer endpoints are at /api/ not /api/admin/
                const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE 
                    ? process.env.NEXT_PUBLIC_API_BASE.replace('/admin/', '/')
                    : (process.env.NODE_ENV === "development"
                        ? "httpss://api.zuroona.sa/api/"
                        : "httpss://domianName.com:3434/api/");
                
                let response;
                let actualRole = role;
                let verificationSuccessful = false;
                
                // Try the appropriate endpoint first based on role
                if (isHost) {
                    // Try organizer endpoint first for hosts
                    try {
                        const apiEndpoint = `${apiBaseUrl}organizer/verify-email?token=${encodeURIComponent(token)}`;
                        console.log("[VERIFY-EMAIL] Trying organizer endpoint first (role=host):", apiEndpoint);
                        
                        response = await axios.get(apiEndpoint, {
                            headers: {
                                lang: lang || "en",
                            },
                        });
                        
                        console.log("[VERIFY-EMAIL] Organizer endpoint response:", response.data);
                        
                        // Check if verification was successful - check for status: true or status: 1
                        if (response.data?.status === true || response.data?.status === 1 || 
                            (response.status === 200 && (response.data?.data?.organizer || response.data?.data?.user))) {
                            actualRole = "host";
                            verificationSuccessful = true;
                            console.log("[VERIFY-EMAIL] Organizer endpoint succeeded - verification successful");
                            // Exit early - don't try fallback
                            setStatus("success");
                            setMessage(
                                "Email verified successfully! Your application is now pending admin approval. We will notify you via email once approved."
                            );
                            setUserRole(actualRole);
                            return; // Exit early to prevent fallback
                        } else {
                            throw new Error("Organizer verification not successful");
                        }
                    } catch (organizerError) {
                        // Only try fallback if we got a 404 or specific error indicating wrong endpoint
                        const errorStatus = organizerError.response?.status;
                        const errorMessage = organizerError.response?.data?.message || "";
                        
                        // If token is invalid/expired, don't try fallback
                        if (errorStatus === 400 || errorStatus === 401 || 
                            errorMessage.toLowerCase().includes("invalid") || 
                            errorMessage.toLowerCase().includes("expired")) {
                            console.log("[VERIFY-EMAIL] Token invalid/expired, not trying fallback");
                            throw organizerError;
                        }
                        
                        console.log("[VERIFY-EMAIL] Organizer endpoint failed, trying guest endpoint as fallback");
                        console.log("[VERIFY-EMAIL] Organizer error:", errorStatus, organizerError.response?.data);
                        
                        // Fallback to guest endpoint only if organizer endpoint failed with wrong endpoint error
                        try {
                            const apiEndpoint = `${apiBaseUrl}user/verify-email?token=${encodeURIComponent(token)}`;
                            console.log("[VERIFY-EMAIL] Trying guest endpoint as fallback:", apiEndpoint);
                            
                            response = await axios.get(apiEndpoint, {
                                headers: {
                                    lang: lang || "en",
                                },
                            });
                            
                            if (response.data?.status === true || response.data?.status === 1 || 
                                (response.status === 200 && response.data?.data?.user)) {
                                actualRole = "guest";
                                verificationSuccessful = true;
                                console.log("[VERIFY-EMAIL] Guest endpoint succeeded - verification successful");
                                setStatus("success");
                                setMessage(
                                    "Email verified successfully! You can now login to your account."
                                );
                                setUserRole(actualRole);
                                return; // Exit early
                            } else {
                                throw new Error("Guest verification not successful");
                            }
                        } catch (guestError) {
                            // Both failed, throw the organizer error (more relevant)
                            console.error("[VERIFY-EMAIL] Both endpoints failed");
                            throw organizerError.response?.data || organizerError;
                        }
                    }
                } else {
                    // Try guest endpoint first for guests
                    try {
                        const apiEndpoint = `${apiBaseUrl}user/verify-email?token=${encodeURIComponent(token)}`;
                        console.log("[VERIFY-EMAIL] Trying guest endpoint first (role=guest):", apiEndpoint);
                        
                        response = await axios.get(apiEndpoint, {
                            headers: {
                                lang: lang || "en",
                            },
                        });
                        
                        console.log("[VERIFY-EMAIL] Guest endpoint response:", response.data);
                        
                        // Check if verification was successful - check for status: true or status: 1
                        if (response.data?.status === true || response.data?.status === 1 || 
                            (response.status === 200 && response.data?.data?.user)) {
                            actualRole = "guest";
                            verificationSuccessful = true;
                            console.log("[VERIFY-EMAIL] Guest endpoint succeeded - verification successful");
                            // Exit early - don't try fallback
                            setStatus("success");
                            setMessage(
                                "Email verified successfully! You can now login to your account."
                            );
                            setUserRole(actualRole);
                            return; // Exit early to prevent fallback
                        } else {
                            throw new Error("Guest verification not successful");
                        }
                    } catch (guestError) {
                        // Only try fallback if we got a 404 or specific error indicating wrong endpoint
                        const errorStatus = guestError.response?.status;
                        const errorMessage = guestError.response?.data?.message || "";
                        
                        // If token is invalid/expired, don't try fallback
                        if (errorStatus === 400 || errorStatus === 401 || 
                            errorMessage.toLowerCase().includes("invalid") || 
                            errorMessage.toLowerCase().includes("expired")) {
                            console.log("[VERIFY-EMAIL] Token invalid/expired, not trying fallback");
                            throw guestError;
                        }
                        
                        console.log("[VERIFY-EMAIL] Guest endpoint failed, trying organizer endpoint as fallback");
                        console.log("[VERIFY-EMAIL] Guest error:", errorStatus, guestError.response?.data);
                        
                        // Fallback to organizer endpoint only if guest endpoint failed with wrong endpoint error
                        try {
                            const apiEndpoint = `${apiBaseUrl}organizer/verify-email?token=${encodeURIComponent(token)}`;
                            console.log("[VERIFY-EMAIL] Trying organizer endpoint as fallback:", apiEndpoint);
                            
                            response = await axios.get(apiEndpoint, {
                                headers: {
                                    lang: lang || "en",
                                },
                            });
                            
                            console.log("[VERIFY-EMAIL] Organizer endpoint response:", response.data);
                            
                            if (response.data?.status === true || response.data?.status === 1 || 
                                (response.status === 200 && (response.data?.data?.organizer || response.data?.data?.user))) {
                                actualRole = "host";
                                verificationSuccessful = true;
                                console.log("[VERIFY-EMAIL] Organizer endpoint succeeded - verification successful");
                                setStatus("success");
                                setMessage(
                                    "Email verified successfully! Your application is now pending admin approval. We will notify you via email once approved."
                                );
                                setUserRole(actualRole);
                                return; // Exit early
                            } else {
                                throw new Error("Organizer verification not successful");
                            }
                        } catch (organizerError) {
                            // Both failed, throw the more informative error
                            console.error("[VERIFY-EMAIL] Both endpoints failed");
                            throw guestError.response?.data || guestError;
                        }
                    }
                }
            } catch (error) {
                // Only handle errors if we haven't already set success status
                console.error("[VERIFY-EMAIL] Error:", error);
                console.error("[VERIFY-EMAIL] Error response:", error.response?.data);
                console.error("[VERIFY-EMAIL] Error status:", error.response?.status);
                
                // Check if the error response actually indicates success (200 with status 1)
                if (error.response?.status === 200 && 
                    (error.response?.data?.status === 1 || error.response?.data?.status === true)) {
                    setStatus("success");
                    const actualRole = error.response.data.data?.user?.role === 2 ? "host" : "guest";
                    
                    if (actualRole === "host") {
                        setMessage(
                            "Email verified successfully! Your application is now pending admin approval. We will notify you via email once approved."
                        );
                    } else {
                        setMessage(
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
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/assets/images/logo.png"
                            alt="Zuroona"
                            width={120}
                            height={48}
                            className="object-contain"
                        />
                    </div>

                    {/* Status Icon */}
                    <div className="flex justify-center mb-6">
                        {status === "verifying" && (
                            <div className="w-20 h-20 border-4 border-[#a797cc] border-t-transparent rounded-full animate-spin" />
                        )}

                        {status === "success" && (
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}

                        {status === "error" && (
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">
                        {status === "verifying" && "Verifying Email..."}
                        {status === "success" && "Email Verified!"}
                        {status === "error" && "Verification Failed"}
                    </h1>

                    {/* Message */}
                    <p className="text-center text-gray-600 mb-8">
                        {message || "Please wait while we verify your email..."}
                    </p>

                    {/* Actions */}
                    {status === "success" && (
                        <div className="space-y-3">
                            <button
                                onClick={() => router.push("/")}
                                className="w-full py-3 px-4 bg-[#a797cc] hover:bg-[#a08ec8] text-white font-semibold rounded-lg transition-colors"
                            >
                                Go to Homepage
                            </button>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="space-y-3">
                            <button
                                onClick={() => router.push("/")}
                                className="w-full py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                            >
                                Go to Homepage
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full py-3 px-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Help Text */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            Need help?{" "}
                            <a href="mailto:infozuroona@gmail.com" className="text-[#a797cc] hover:text-[#a08ec8] font-semibold">
                                Contact Support
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                        <div className="flex justify-center mb-6">
                            <Image
                                src="/assets/images/logo.png"
                                alt="Zuroona"
                                width={120}
                                height={48}
                                className="object-contain"
                            />
                        </div>
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 border-4 border-[#a797cc] border-t-transparent rounded-full animate-spin" />
                        </div>
                        <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">
                            Loading...
                        </h1>
                    </div>
                </div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}


