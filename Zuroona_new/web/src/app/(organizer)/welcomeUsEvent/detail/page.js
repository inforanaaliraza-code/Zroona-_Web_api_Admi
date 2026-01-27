"use client";

import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { useEffect, useState } from "react";
import RegistrationModal from "@/components/Modal/AddBookModal";
import TimeSchedule from "@/components/Details/TimeSchedule";
import ProfileDetail from "@/components/Details/ProfileDetail";
import BookNow from "@/components/Details/BookNow";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getEventListDetail } from "@/redux/slices/EventListDetail";
import { useTranslation } from "react-i18next";

export default function WelcomeUsDetail() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const EventListId = searchParams.get("id");
  const { EventListdetails = {}, loadingDetail } = useSelector(
    (state) => state.EventDetailData || {}
  );

  const title = EventListdetails?.event_name;

  useEffect(() => {
    if (EventListId) {
      dispatch(getEventListDetail({ id: EventListId }));
    }
  }, [EventListId, dispatch]);

  const breadcrumbItems = [
    { label: t('breadcrumb.tab1'), href: "/joinUsEvent" },
    { label: t('breadcrumb.tab15'), href: "/welcomeUsEvent" },
    {
      label: title || "Event Details", // Default to "Event Details" if title is undefined
      href: "/welcomeUsEvent/detail",
    },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <section className="bg-white py-8 md:py-16">
        <div className="mx-auto px-4 md:px-8 xl:px-28">
          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 xl:gap-10">
            {/* Left Content Section */}
            <div className="lg:col-span-2">
              <ProfileDetail profile={EventListdetails} showJoinButton={true} />
            </div>

            {/* Right Sidebar Section */}
            <div className="space-y-8 mt-10 lg:mt-0">
              {/* Time Schedule Card */}
              <TimeSchedule schedule={EventListdetails} />
            </div>
          </div>
        </div>
      </section>

      {/* Book Now */}
      <BookNow props={EventListdetails} pageType="edit" />

      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <style jsx>{`
        :global(.slick-dots .slick-active div) {
          background-color: #ab0017;
        }
      `}</style>
      <style jsx global>{`
        .slick-dots li {
          width: 10px;
          height: 10px;
          margin: 0 5px;
        }
        .slick-prev,
        .slick-next {
          width: 40px;
          height: 40px;
          z-index: 1;
          top: -50px;
        }
        .slick-prev {
          right: 50px;
          left: auto;
        }
        .slick-next {
          right: 0;
        }
        .slick-next:before,
        .slick-prev:before {
          content: "";
        }
        @media (max-width: 480px) {
          .slick-prev,
          .slick-next {
            width: 30px;
            height: 30px;
            top: -40px;
          }
          .slick-prev {
            right: 45px;
          }
          .slick-next {
            right: 5px;
          }
          .slick-dots li {
            width: 15px;
            height: 15px;
            margin: 0 2px;
          }
        }
      `}</style>
    </>
  );
}
