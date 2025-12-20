"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to admin login page with complicated link
    router.replace("/adminsa111xyz");
  }, [router]);

  return (
    <section className="bg-white h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f47c0c] mx-auto"></div>
        <p className="text-gray-600 mt-4">Redirecting to Admin Panel...</p>
      </div>
    </section>
  );
}
