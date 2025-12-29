"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import ProfileImageUpload from "@/components/ProfileImageUpload/ProfileImageUpload";
import Steper from "@/components/Steper/Steper";
import GroupNameForm from "@/components/InterviewQ/GroupNameForm";
import { useTranslation } from "react-i18next";

export default function InterviewQStep2() {
  const { t } = useTranslation();
  const breadcrumbItems = [
    // { label: t('breadcrumb.tab1'), href: "/" },
    { label: t("breadcrumb.tab2"), href: "/organizerSignup" },
    { label: t("signup.tab60"), href: "/organizerSignup/interviewQ" },
    { label: t("signup.tab62"), href: "/organizerSignup/interviewQ/step3" },
  ];

  const [currentStep, setCurrentStep] = useState(3);

  const router = useRouter();

  const proceedToNextStep = () => {
    setCurrentStep(currentStep + 1);
    router.push("/organizerSignup/bankDetail");
  };

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <Steper currentStep={currentStep} />

      <section className="bg-[#FFF0F1] py-10">
        <div className="container mx-auto px-4 md:px-8 lg:px-28">
          <div className="flex justify-center items-center">
            <div className="lg:p-8 max-w-3xl w-full flex flex-col md:flex-row gap-x-6">
              {/* <ProfileImageUpload /> */}
              <div className="flex-grow bg-white h-max p-5 sm:p-7 rounded-xl">
                <GroupNameForm
                  proceedToNextStep={proceedToNextStep}
                  showStepImage={true}
                  shwoSubmitButton={true}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
