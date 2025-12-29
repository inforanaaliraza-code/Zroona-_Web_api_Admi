// This page is no longer needed - email/password is now part of Step 1 (Basic Info)
// Keeping for backward compatibility but redirecting to main signup
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function EmailSignUpPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main signup page
    router.replace("/organizerSignup");
  }, [router]);

  return null;
}

