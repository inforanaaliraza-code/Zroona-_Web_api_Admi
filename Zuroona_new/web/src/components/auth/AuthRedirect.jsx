"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import Loader from "@/components/Loader/Loader";

export default function AuthRedirect() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        if (isAuthenticated && user) {
            setIsRedirecting(true);
            if (user.role === 2) {
                // Host/Organizer
                router.replace("/joinUsEvent");
            } else if (user.role === 1) {
                // Guest
                router.replace("/events");
            } else {
                // Fallback if role is unknown or we just want to stop spinning
                setIsRedirecting(false);
            }
        }
    }, [isAuthenticated, user, router, isMounted]);

    if (isRedirecting) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                <Loader />
            </div>
        );
    }

    return null;
}
