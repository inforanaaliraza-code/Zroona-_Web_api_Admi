import React from "react";
import Image from "next/image";
import ResetAndChangePassword from "@/components/ResetAndChangePassword/ResetAndChangePassword";

function ResetPassword() {
  return (
    <>
     <section className="bg-[url('/assets/images/bg-img.png')] bg-cover bg-center h-screen bg-[#fdf6e6]">
      <div className="container mx-auto px-4 md:px-12 lg:px-20">
        <div className="flex flex-col lg:flex-row justify-between gap-y-6 lg:gap-y-0 h-screen">
          <div className="mt-10 w-[80px] lg:w-[120px]">
            <Image 
              src="/assets/images/final_Zuroona.png" 
              alt="Zuroona Logo" 
              height={120} 
              width={120} 
              className="w-full h-auto object-contain" 
            />
          </div>
          <div className="w-full flex items-center justify-center lg:justify-end h-full">
            <div className="w-full sm:w-full md:w-9/12 lg:w-7/12">
              <div className="bg-white rounded-2xl px-4 md:px-20 md:py-10 lg:px-28 py-4 lg:py-14">
                <div className="flex justify-start items-center gap-x-5 mb-4">
                  <div className="w-[60px] lg:w-[90px]">
                      <Image
                        src="/assets/images/login/reset-img.png"
                        alt="Logo"
                        width={90}
                        height={90}
                        quality={100}
                        priority
                        className="object-contain mx-auto"
                      />
                    </div>
                    <div className="mt-7">
                    <h3 className="text-1xl lg:text-4xl font-semibold text-[#f47c0c]">
                        Reset Password
                      </h3>
                      <p className="font-semibold text-gray-900 text-sm lg:text-base">
                        Please reset your password here
                      </p>
                    </div>
                  </div>

                  <ResetAndChangePassword />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ResetPassword;
