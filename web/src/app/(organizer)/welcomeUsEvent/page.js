"use client";

import { useEffect, useState } from "react";
import EventCard from "@/components/common/EventCard";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { getEventList } from "@/redux/slices/EventList";
import AddEditWelcomeEventModal from "@/components/Modal/AddEditWelcomeEventModal";
import Paginations from "@/components/Paginations/Pagination";
import Loader from "@/components/Loader/Loader";
import { useTranslation } from "react-i18next";

export default function WelcomeEvent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useTranslation();
  const breadcrumbItems = [
    { label: t('breadcrumb.tab1'), href: "/joinUsEvent" },
    { label: t('breadcrumb.tab15'), href: "/welcomeUsEvent" },
  ];

  const dispatch = useDispatch();
  const cookie = new Cookies();
  const { EventList, loading } = useSelector((state) => state.EventData);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [event_type, setEvent_type] = useState("2");
  const [activePage, setActivePage] = useState(9);

  // Prevent hydration errors by ensuring component is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      dispatch(
        getEventList({
          page: page,
          limit: activePage,
          event_type: event_type,
        })
      );
    }
  }, [dispatch, page, event_type, isMounted]);

  //handle pagination
  const handlePage = (value) => {
    setPage(value);
  };

  // Show loading state during SSR/hydration to prevent mismatch
  if (!isMounted) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <section className="bg-white py-16 ">
        <div className="mx-auto px-4 md:px-8 xl:px-28">
          <div className="mx-auto">
            <div className="">
              <div className="lg:col-span-4">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl sm:text-3xl font-bold mb-0 sm:mb-3">{t('breadcrumb.tab15')}</h2>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#a797cc] flex items-center text-white px-5 gap-x-2 py-3 sm:py-4 rounded-xl text-xs font-semibold transition-colors duration-200 ease-in-out border border-transparent hover:border-[#a797cc] whitespace-nowrap"
                  >
                    <Image
                      src="/assets/images/icons/bx-calendar-plus.png"
                      height={16}
                      width={16}
                      alt=""
                    />
                    {t('card.tab15')}
                  </button>
                </div>
                {loading ? (
                  <div className="flex justify-center items-center w-full h-screen">
                    <Loader />
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
                    {EventList?.data?.length > 0 ? (
                      EventList?.data?.map((event, i) => (
                        <div key={event._id || i}>
                          <Link
                            href={{
                              pathname: "/welcomeUsEvent/detail",
                              query: { id: event._id },
                            }}
                          >
                            <EventCard event={event} />
                          </Link>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-800">{t('tab.tab7')}</span>
                    )}
                  </div>
                )}

                {/* Pagination */}
                {EventList?.total_count > 9 && (
                  <Paginations
                    handlePage={handlePage}
                    page={page}
                    total={EventList.total_count}
                    itemsPerPage={activePage}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <AddEditWelcomeEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventpage={page}
        eventlimit={activePage}
      />
    </>
  );
}
