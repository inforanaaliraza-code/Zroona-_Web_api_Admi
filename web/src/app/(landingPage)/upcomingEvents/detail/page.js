"use client";

import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import OrganizerBy from "@/components/Details/OrganizerBy";
import LocationMap from "@/components/Details/LocationMap";
import TimeSchedule from "@/components/Details/TimeSchedule";
import Attendees from "@/components/Details/Attendess";
import AdditionalCard from "@/components/Details/AdditionalCard";
import BookNow from "@/components/Details/BookNow";
import ProfileDetail from "@/components/Details/ProfileDetail";
import { useDispatch, useSelector } from "react-redux";
import { getUserEventListDetail } from "@/redux/slices/UserEventListDetail";
import Members from "@/components/Details/Members";
import Loader from "@/components/Loader/Loader";
import { useTranslation } from "react-i18next";

export default function EventDetail() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const EventListId = searchParams.get("id");
  const { UserEventListdetails = {}, loadingDetail } = useSelector(
    (state) => state.UserEventDetailData || {}
  );

  const title = UserEventListdetails?.event_name;

  useEffect(() => {
    if (EventListId) {
      dispatch(getUserEventListDetail({ id: EventListId }));
    }
  }, [EventListId, dispatch]);

  const breadcrumbItems = [
    { label: t('breadcrumb.tab1'), href: "/" },
    { label: t('breadcrumb.tab9'), href: "/upcomingEvents" },
    {
      label: title || "Event Details",
      href: "/upcomingEvents/detail",
    },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />

      {loadingDetail ? (
        <div className="flex justify-center items-center w-full h-screen bg-[#FFF0F1]">
          <Loader />
        </div>
      ) : (
        <>
          <section className="bg-gradient-to-b from-[#FFF0F1] to-[#fff] py-8 md:py-16">
            <div className="mx-auto px-4 md:px-8 xl:px-28">
              {/* Main Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 xl:gap-10">
                {/* Left Content Section */}
                <div className="lg:col-span-2">
                  <ProfileDetail profile={UserEventListdetails} />

                  {/* Attendees Section */}
                  <Attendees
                    attendees={UserEventListdetails?.attendees || []}
                  />
                </div>

                {/* Right Sidebar Section */}
                <div className="space-y-8 mt-10 lg:mt-0">
                  {/* Organizer Card */}
                  <OrganizerBy organizer={UserEventListdetails?.organizer} />

                  {/* Time Schedule Card */}
                  <TimeSchedule schedule={UserEventListdetails} />

                  <div className="flex flex-col md:flex-row lg:flex-col justify-between items-center lg:gap-y-10 gap-y-0 gap-x-10">
                    {/* Location Map */}
                    <LocationMap location={UserEventListdetails} />

                    {/* Additional Card */}
                    <AdditionalCard />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Members Interested */}
          <Members members={UserEventListdetails?.related_events} />

          {/* Book Now */}
          <BookNow props={UserEventListdetails} pageType="book" />
        </>
      )}
    </>
  );
}
