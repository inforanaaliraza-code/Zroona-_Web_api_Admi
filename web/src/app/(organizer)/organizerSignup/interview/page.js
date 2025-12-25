"use client";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import InterviewForm from "@/components/InterviewForm/InterviewForm";
import { useTranslation } from "react-i18next";
import Steper from "@/components/Steper/Steper";

export default function InterviewPage() {
  const { t } = useTranslation();

  return (
    <>
    <Steper currentStep={3} />

      <section className="py-10 min-h-screen bg-white">
        <div className="container px-4 mx-auto md:px-8 lg:px-28">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              {t("interview.title")}
            </h1>
            <p className="mx-auto max-w-2xl text-gray-600">
              {t("interview.description")}
            </p>
          </div>

          {/* Interview Form */}
          <InterviewForm />
        </div>
      </section>
    </>
  );
}
