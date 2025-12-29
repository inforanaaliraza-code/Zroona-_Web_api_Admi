"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HostSignUpPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the existing organizer signup flow
        router.replace("/organizerSignup");
    }, [router]);

    return null;
}

