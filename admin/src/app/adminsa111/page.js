import LoginForm from "@/components/LoginForm/LoginForm";
import Image from "next/image";

export default function AdminLogin() {
    return (
        <section className="bg-white h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
                <div className="flex flex-col gap-y-6">
                    <div className="flex justify-center">
                        <div className="w-[120px]">
                            <Image
                                src="/assets/images/final_Zuroona.png"
                                alt="Zuroona Logo"
                                height={150}
                                width={150}
                                className="w-full h-auto object-contain"
                                priority
                            />
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="flex flex-col items-center gap-y-2 mb-6">
                            {/* 
                 <div className="w-[80px]">
                   <Image
                     src="/assets/images/login/Img-login.png"
                     alt="Login Icon"
                     width={80}
                     height={80}
                     className="w-full h-auto object-contain"
                   />
                 </div>
                 */}
                            <h3 className="text-2xl lg:text-3xl font-semibold text-[#f47c0c]">
                                Log in
                            </h3>
                            <p className="font-medium text-gray-500 text-sm">
                                Please login to your account
                            </p>
                        </div>
                        <LoginForm />
                    </div>
                </div>
            </div>
        </section>
    );
}
