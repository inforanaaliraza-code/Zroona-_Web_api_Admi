"use client";

import Header from "@/components/Header/Header";
import UploadId from "@/components/OrganizerSignUp/UploadId";
import Steper from "@/components/Steper/Steper";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ThankYouPage() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(4);
  const router = useRouter();

  const handleNextStep = () => {
    // After uploading CNIC, show completion message
    router.push("/organizerSignup/completion");
  };

  return (
    <>
      <Header bgColor="#fff" />
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4">
          <Steper currentStep={currentStep} />
          <div className="flex items-center justify-center mt-8">
            <div className="w-full max-w-3xl">
              <UploadId
                title={t('signup.tab28') || "Upload CNIC for Business Verification"}
                buttonName={t('signup.tab21') || "Submit"}
                labelName={t('signup.tab29') || "CNIC Document"}
                onNext={handleNextStep}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}





