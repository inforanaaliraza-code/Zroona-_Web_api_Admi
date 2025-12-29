"use client";

import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import GroupAboutForm from "@/components/InterviewQ/GroupAboutForm";
import ProfileImageUpload from "@/components/ProfileImageUpload/ProfileImageUpload";
import Steper from "@/components/Steper/Steper";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function InterviewQStep2() {
  const { t } = useTranslation();
  const breadcrumbItems = [
    // { label: t('breadcrumb.tab1'), href: "/" },
    { label: t("breadcrumb.tab2"), href: "/organizerSignup" },
    { label: t("signup.tab60"), href: "/organizerSignup/interviewQ" },
    { label: t("signup.tab61"), href: "/organizerSignup/interviewQ/step2" },
  ];

  const [currentStep, setCurrentStep] = useState(3);
  const router = useRouter();

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      router.push("/organizerSignup/interviewQ/step3");
    }
  };

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <Steper currentStep={currentStep} />

      <section className="bg-[#FFF0F1] py-10">
        <div className="container px-4 mx-auto md:px-8 lg:px-28">
          <div className="flex justify-center items-center">
            <div className="flex flex-col gap-x-6 w-full max-w-3xl lg:p-8 md:flex-row">
              {/* <ProfileImageUpload /> */}
              <div className="flex-grow p-5 bg-white rounded-xl h-max sm:p-7">
                <GroupAboutForm
                  handleFormSubmit={handleFormSubmit}
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
