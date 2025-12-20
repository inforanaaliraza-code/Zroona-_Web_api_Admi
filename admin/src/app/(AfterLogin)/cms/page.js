"use client";

import PrivacyPolicy from "@/components/CMS/PrivacyPolicy";
import TermsConditions from "@/components/CMS/TermsConditions";
import AboutUs from "@/components/CMS/AboutUs"; // Make sure to adjust the import path
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState } from "react";

export default function ManageCms() {
  const [status, setStatus] = useState("2");
  
  return (
    <>
      <DefaultLayout>
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex justify-between py-5">
            <h1 className="text-2xl font-bold text-black mt-8">Manage CMS</h1>
          </div>

          <div className="mt-3">
            <div className="text-center mb-4">
              <ul className="flex justify-center space-x-4">
                <li>
                  <button
                    className={`px-6 py-4 border-2 rounded-xl text-sm font-semibold bg-white ${
                      status === "2" ? "border-2 border-[#f47c0c] text-[#f47c0c]" : "border-2 border-transparent text-[#c8b68b]"
                    }`}
                    onClick={() => setStatus("2")}
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    className={`px-6 py-4 border-2 rounded-xl text-sm font-semibold bg-white ${
                      status === "1" ? "border-2 border-[#f47c0c] text-[#f47c0c]" : "border-2 border-transparent text-[#c8b68b]"
                    }`}
                    onClick={() => setStatus("1")}
                  >
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button
                    className={`px-6 py-4 border-2 rounded-xl text-sm font-semibold bg-white ${
                      status === "3" ? "border-2 border-[#f47c0c] text-[#f47c0c]" : "border-2 border-transparent text-[#c8b68b]"
                    }`}
                    onClick={() => setStatus("3")}
                  >
                    About Us
                  </button>
                </li>
              </ul>
            </div>
            <div className="mb-4">
              {status === "2" ? (
                <PrivacyPolicy status={status} />
              ) : status === "1" ? (
                <TermsConditions status={status} />
              ) : status === "3" ? (
                <AboutUs status={status} />
              ) : null}
            </div>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
}
