"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ResetAndChangePassword from "@/components/ResetAndChangePassword/ResetAndChangePassword";
import Image from "next/image";
import { useState } from "react";

export default function Setting() {
  return (
    <DefaultLayout>
      <div>
        <div className="flex justify-between py-5">
          {/* Header */}
          <h1 className="text-xl font-bold text-black">Change Password</h1>
        </div>

        <div className="w-full flex items-center justify-center h-full">
          <div className="w-full sm:w-full md:w-9/12 lg:w-6/12">
            <div className="bg-white rounded-2xl px-4 md:px-16 lg:px-24 py-7">
              <div className="flex justify-start items-center gap-x-4 mb-8">
                <div className="w-[60px] lg:w-[90px]">
                  <Image
                    src="/assets/images/login/reset-img.png"
                    alt="OTP"
                    width={80}
                    height={80}
                    quality={100}
                    priority
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="mt-2 text-2xl md:text-4xl font-semibold text-[#f47c0c]">
                    Change Password
                  </h3>
                  <p className="font-semibold text-gray-900">
                    Please change your assword here
                  </p>
                </div>
              </div>
              <ResetAndChangePassword page="change" />
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
