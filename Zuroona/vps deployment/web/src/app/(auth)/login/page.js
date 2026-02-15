"use client";

import { Suspense } from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import EmailLoginForm from "@/components/auth/EmailLoginForm";

export default function LoginPage() {
    return (
        <>
            <Header bgColor="#fff" />
            <div className="min-h-screen bg-white py-12">
                <div className="container mx-auto px-4">
                    <Suspense fallback={<div className="min-h-[300px] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#a797cc] border-t-transparent rounded-full animate-spin" /></div>}>
                        <EmailLoginForm />
                    </Suspense>
                </div>
            </div>
            <Footer />
        </>
    );
}

