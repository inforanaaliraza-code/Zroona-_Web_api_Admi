"use client";

import { useMemo, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import EditProfileSidebar from "@/components/EditProfileSidebar/EditProfileSidebar";
import GroupLocationForm from "@/components/InterviewQ/GroupLocationForm";
import GroupAboutForm from "@/components/InterviewQ/GroupAboutForm";
import GroupNameForm from "@/components/InterviewQ/GroupNameForm";
import OrganizerSignUpForm from "@/components/EditProfile/OrganizerSignUpForm";
import UploadId from "@/components/EditProfile/UploadId";
import BankDetails from "@/components/EditProfile/BankDetails";
import InterviewQ from "@/components/EditProfile/InterviewQ";
import { useTranslation } from "react-i18next";

export default function EditProfile() {
  const { t } = useTranslation();
  const sections = useMemo(
    () => ({
      PERSONAL: "personal",
      BANK: "bank",
    }),
    []
  );
  const breadcrumbItems = [
    { label: t('breadcrumb.tab1'), href: "/joinUsEvent" },
    { label: t('breadcrumb.tab3'), href: "/editProfile" },
  ];

  const [activeSection, setActiveSection] = useState(sections.PERSONAL); 

  const handleSidebarItemClick = (sectionKey) => {
    setActiveSection(sectionKey);
  };

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <section className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Sidebar */}
            <div className="md:col-span-2 lg:col-span-3">
              <EditProfileSidebar
                onItemClick={handleSidebarItemClick}
                activeSection={activeSection}
              />
            </div>

            {/* Main content */}
            <div className="md:col-span-9 md:flex gap-x-4">
              {/* Conditionally render content based on active section */}
              {activeSection === sections.PERSONAL ? (
                <OrganizerSignUpForm
                  title={t('signup.tab53')}
                  buttonText={t('signup.tab57')}
                />
              ) : activeSection === sections.BANK ? (
                <BankDetails
                  title={t('signup.tab43')}
                  buttonName={t('signup.tab57')}
                />
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
