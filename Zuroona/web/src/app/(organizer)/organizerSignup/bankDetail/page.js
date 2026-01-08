"use client";

import SignupHeader from "@/components/Header/SignupHeader";
import BankDetails from "@/components/OrganizerSignUp/BankDetails";
import Steper from "@/components/Steper/Steper";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function BankDetail() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(3);
  const router = useRouter();

  const handleFormSubmit = () => {
    setCurrentStep(4);
    router.push("/organizerSignup/otherInfo");
  };

  return (
    <>
      <SignupHeader bgColor="#fff" />
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4">
          <Steper currentStep={currentStep} />
          <div className="flex items-center justify-center mt-8">
            <div className="w-full max-w-3xl">
              <BankDetails
                title={t("signup.tab43")}
                buttonName={t("signup.tab21") || "Next"}
                onNext={handleFormSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
