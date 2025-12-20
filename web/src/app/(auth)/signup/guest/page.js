"use client";

import Header from "@/components/Header/Header";
import GuestSignUpForm from "@/components/auth/GuestSignUpForm";

export default function GuestSignUpPage() {
    return (
        <>
            <Header bgColor="#fff" />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12">
                <div className="container mx-auto px-4">
                    <GuestSignUpForm />
                </div>
            </div>
        </>
    );
}

