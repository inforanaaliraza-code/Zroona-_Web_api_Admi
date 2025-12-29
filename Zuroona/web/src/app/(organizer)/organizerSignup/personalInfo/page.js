"use client";

import SignupHeader from "@/components/Header/SignupHeader";
import Steper from "@/components/Steper/Steper";
import PersonalInfoQuestionsForm from "@/components/OrganizerSignUp/PersonalInfoQuestionsForm";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PersonalInfoPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(2);

  // Function to handle form submission - go to bank details step
  const handleFormSuccess = () => {
    setCurrentStep(3);
    router.push("/organizerSignup/bankDetail");
  };

  return (
    <>
      <SignupHeader bgColor="#fff" />
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4">
          <Steper currentStep={currentStep} />
          <div className="flex items-center justify-center mt-8">
            <div className="w-full max-w-4xl">
              <PersonalInfoQuestionsForm onSuccess={handleFormSuccess} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

