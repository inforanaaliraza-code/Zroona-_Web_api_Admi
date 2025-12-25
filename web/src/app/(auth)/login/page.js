"use client";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import EmailLoginForm from "@/components/auth/EmailLoginForm";

export default function LoginPage() {
    return (
        <>
            <Header bgColor="#fff" />
            <div className="min-h-screen bg-white py-12">
                <div className="container mx-auto px-4">
                    <EmailLoginForm />
                </div>
            </div>
            <Footer />
        </>
    );
}

