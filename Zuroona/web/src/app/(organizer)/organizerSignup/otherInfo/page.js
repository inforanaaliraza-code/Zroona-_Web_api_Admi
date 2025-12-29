"use client";

import SignupHeader from "@/components/Header/SignupHeader";
import UploadId from "@/components/OrganizerSignUp/UploadId";
import Steper from "@/components/Steper/Steper";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function OtherInfo() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(4);
  const router = useRouter();

  const handleNextStep = () => {
    // After uploading CNIC, go to thank you/completion page
    // Clear all localStorage data
    localStorage.removeItem("organizer_basic_info");
    localStorage.removeItem("organizer_personal_info");
    localStorage.removeItem("organizer_bank_info");
    localStorage.removeItem("organizer_cnic");
    localStorage.removeItem("organizer_id");
    router.push("/organizerSignup/completion");
  };

  return (
    <>
      <SignupHeader bgColor="#fff" />
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4">
          <Steper currentStep={currentStep} />
          <div className="flex items-center justify-center mt-8">
            <div className="w-full max-w-3xl">
              <UploadId
                title={t('signup.tab28')}
                buttonName={t('signup.tab21')}
                labelName={t('signup.tab29')}
                onNext={handleNextStep}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
