"use client";

import SignupHeader from "@/components/Header/SignupHeader";
import Steper from "@/components/Steper/Steper";
import BasicInfoForm from "@/components/OrganizerSignUp/BasicInfoForm";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OrganizerSignUp() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Function to handle form submission - go to personal info & questions step
  const handleFormSuccess = () => {
    setCurrentStep(2);
    router.push("/organizerSignup/personalInfo");
  };

  return (
    <>
      <SignupHeader bgColor="#fff" />
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4">
          <Steper currentStep={currentStep} />
          <div className="flex items-center justify-center mt-8">
            <div className="w-full max-w-4xl">
              <BasicInfoForm onSuccess={handleFormSuccess} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
