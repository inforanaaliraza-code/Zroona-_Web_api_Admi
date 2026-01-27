"use client";

import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import OrganizerBy from "@/components/Details/OrganizerBy";
import TimeSchedule from "@/components/Details/TimeSchedule";
import LocationMap from "@/components/Details/LocationMap";
import ProfileDetail from "@/components/Details/ProfileDetail";
import BookNow from "@/components/Details/BookNow";
import BookDetail from "@/components/Details/BookDetail";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getBookingDetail } from "@/redux/slices/OrgaizerBookingDetail";
import Loader from "@/components/Loader/Loader";
import { useTranslation } from "react-i18next";
import { useRTL } from "@/utils/rtl";

export default function BookingDetail() {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const BookingListId = searchParams.get("id");
  const { Bookingdetails = {}, loadingDetail } = useSelector(
    (state) => state.BookingDetailData || {}
  );
  const title = Bookingdetails?.event_name;
  useEffect(() => {
    if (BookingListId) {
      dispatch(getBookingDetail({ id: BookingListId }));
    }
  }, [BookingListId, dispatch]);

  const breadcrumbItems = [
    { label: t('breadcrumb.tab1'), href: "/joinUsEvent" },
    { label: t('breadcrumb.tab4'), href: "/myBookings" },
    {
      label: title || t('detail.tab1'),
      href: "/myBookings/detail",
    },
  ];
  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      {loadingDetail ? (
        <div className="flex justify-center items-center w-full h-screen bg-white">
          <Loader />
        </div>
      ) : (
        <>
          <section className={`bg-white py-8 md:py-16 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="mx-auto px-4 md:px-8 xl:px-28">
              {/* Main Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 xl:gap-10">
                {/* Left Content Section */}
                <div className={`lg:col-span-2 ${isRTL ? 'lg:order-2' : ''}`}>
                  <ProfileDetail
                    profile={Bookingdetails}
                    showJoinButton={true}
                  />
                </div>

                {/* Right Sidebar Section */}
                <div className={`space-y-8 mt-10 lg:mt-0 ${isRTL ? 'lg:order-1' : ''}`}>
                  {/* Organizer Card */}
                  <OrganizerBy organizer={Bookingdetails?.userDetail} />

                  {/* Time Schedule Card */}
                  <TimeSchedule schedule={Bookingdetails} />

                  {/* Booking Detail */}
                  <BookDetail detail={Bookingdetails} />

                  <div className="flex flex-col md:flex-row lg:flex-col justify-between items-center lg:gap-y-10 gap-y-0 gap-x-10">
                    {/* Location Map */}
                    <LocationMap location={Bookingdetails} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Book Now */}
          <BookNow props={Bookingdetails} pageType="accept" />
        </>
      )}
    </>
  );
}
