import LoginForm from "@/components/LoginForm/LoginForm";
import Image from "next/image";

export default function AdminLogin() {
    return (
        <section className="relative bg-gradient-to-br from-[#b0a0df] via-[#a797cc] to-[#8b7bb3] min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div 
                    className="absolute inset-0" 
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* Gradient Orbs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* Login Card */}
            <div className="relative w-full max-w-md mx-4">
                {/* Card Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-white/40 via-white/20 to-white/40 rounded-3xl blur-xl"></div>
                
                <div className="relative p-8 md:p-10 bg-white rounded-2xl shadow-2xl border border-white/20">
                    <div className="flex flex-col gap-y-6">
                        {/* Logo Section */}
                        <div className="flex justify-center mb-2">
                            <div className="relative">
                                {/* Logo Glow */}
                                <div className="absolute inset-0 bg-gradient-to-r from-[#a797cc]/20 to-[#b0a0df]/20 rounded-2xl blur-xl"></div>
                                
                                <div className="relative w-[180px] md:w-[200px]">
                                    <Image
                                        src="/assets/images/x_F_logo.png"
                                        alt="Zuroona Logo"
                                        height={100}
                                        width={250}
                                        className="w-full h-auto object-contain drop-shadow-lg"
                                        priority
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Login Form Section */}
                        <div className="w-full">
                            <div className="flex flex-col items-center gap-y-2 mb-8">
                                <h3 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#a797cc] to-[#8b7bb3] bg-clip-text text-transparent">
                                    Log in
                                </h3>
                                <p className="font-medium text-gray-500 text-sm">
                                    Please login to your account
                                </p>
                                {/* Decorative Line */}
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="h-0.5 w-8 bg-gradient-to-r from-transparent to-[#a797cc]"></div>
                                    <div className="h-1.5 w-1.5 bg-[#a797cc] rounded-full"></div>
                                    <div className="h-0.5 w-16 bg-gradient-to-r from-[#a797cc] to-[#b0a0df]"></div>
                                    <div className="h-1.5 w-1.5 bg-[#a797cc] rounded-full"></div>
                                    <div className="h-0.5 w-8 bg-gradient-to-l from-transparent to-[#a797cc]"></div>
                                </div>
                            </div>
                            <LoginForm />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
