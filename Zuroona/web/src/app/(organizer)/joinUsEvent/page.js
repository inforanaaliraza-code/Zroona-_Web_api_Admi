"use client";

import { useEffect, useMemo, useState } from "react";
import EventCard from "@/components/common/EventCard";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { getEventList } from "@/redux/slices/EventList";
import AddEditJoinEventModal from "@/components/Modal/AddEditJoinEventModal";
import Paginations from "@/components/Paginations/Pagination";
import Loader from "@/components/Loader/Loader";
import { useTranslation } from "react-i18next";
import { useRTL } from "@/utils/rtl";

export default function JoinUsEvent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();
  const { isRTL, flexDirection, textAlign } = useRTL();
  const breadcrumbItems = [
    { label: t('breadcrumb.tab1'), href: "/joinUsEvent" },
    { label: t('myEventOnly'), href: "/joinUsEvent" },
  ];

  const dispatch = useDispatch();
  const { EventList, loading } = useSelector((state) => state.EventData);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [event_type, setEvent_type] = useState("1");
  const [activePage, setActivePage] = useState(9);
  const [statusFilter, setStatusFilter] = useState("all"); // all, accepted, rejected, pending, completed

  useEffect(() => {
    dispatch(
      getEventList({
        page: page,
        limit: activePage,
        event_type: event_type,
      })
    );
  }, [dispatch, page, activePage, event_type]);

  //handle search
  const handleSearch = (e) => {
    setSearch(e.target.value);
    dispatch(getEventList({ page: 1, search: e.target.value }));
  };

  //handle pagination
  const handlePage = (value) => {
    setPage(value);
  };

  // Filter events based on status
  const getFilteredEvents = () => {
    if (!EventList?.data) return [];
    
    let filtered = EventList.data;
    
    // Filter by admin approval status
    // is_approved: 0 or null = Pending, 1 = Accepted, 2 = Rejected
    if (statusFilter === "accepted") {
      filtered = filtered.filter(event => event.is_approved === 1);
    } else if (statusFilter === "rejected") {
      filtered = filtered.filter(event => event.is_approved === 2);
    } else if (statusFilter === "pending") {
      filtered = filtered.filter(event => event.is_approved === 0 || event.is_approved === null || event.is_approved === undefined);
    } else if (statusFilter === "completed") {
      // Completed events: approved events where event_date is in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter(event => {
        if (event.is_approved !== 1) return false; // Must be approved
        if (!event.event_date) return false;
        const eventDate = new Date(event.event_date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate < today; // Event date is in the past
      });
    }
    
    return filtered;
  };

  const filteredEvents = getFilteredEvents();

  // Apply search filter on real events
  const displayEvents = useMemo(() => {
    let base = filteredEvents || [];
    
    // Apply search filter if search term exists
    if (search && base.length > 0) {
      const term = search.toLowerCase();
      base = base.filter(
        (e) =>
          e.event_name?.toLowerCase().includes(term) ||
          e.event_address?.toLowerCase().includes(term) ||
          e.event_description?.toLowerCase().includes(term)
      );
    }
    
    return base;
  }, [filteredEvents, search]);

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <section className="bg-white min-h-screen py-8 sm:py-12" style={{ overscrollBehavior: 'contain' }}>
        <div className="mx-auto px-4 md:px-8 xl:px-28 max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[80%] xl:max-w-7xl">
          {/* Enhanced Header Section */}
          <div className="mb-8">
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 ${flexDirection}`}>
              <div className="flex-1">
                <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 ${textAlign}`}>
                  Events
                </h1>
                <p className={`text-gray-600 text-sm sm:text-base mt-1 ${textAlign}`}>
                  {t('events.manageYourEvents') || 'Manage and organize your events'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className={`group relative bg-gradient-to-r from-[#a797cc] to-[#8ba179] flex items-center justify-center text-white px-6 sm:px-8 gap-x-2 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 whitespace-nowrap ${flexDirection}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#8ba179] to-[#a797cc] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Image
                  src="/assets/images/icons/bx-calendar-plus.png"
                  height={20} 
                  width={20}
                  alt="Create Event"
                  className="relative z-10"
                />
                <span className="relative z-10">{t('card.tab15') || 'Create Event'}</span>
              </button>
            </div>

            {/* Enhanced Status Filters */}
            <div className={`mb-6 flex flex-wrap gap-2.5 ${flexDirection}`}>
              <button
                onClick={() => setStatusFilter("all")}
                className={`group relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  statusFilter === "all"
                    ? "bg-gradient-to-r from-[#a797cc] to-[#8ba179] text-white shadow-lg shadow-[#a797cc]/30 scale-105"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-[#a797cc] hover:bg-[#a797cc]/5 hover:shadow-md"
                }`}
              >
                {statusFilter === "all" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8ba179] to-[#a797cc] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
                <span className="relative z-10">{t('events.all') || "All"}</span>
              </button>
              <button
                onClick={() => setStatusFilter("accepted")}
                className={`group relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  statusFilter === "accepted"
                    ? "bg-gradient-to-r from-[#10b981] to-[#34d399] text-white shadow-lg shadow-green-500/30 scale-105"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 hover:shadow-md"
                }`}
              >
                {statusFilter === "accepted" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#34d399] to-[#10b981] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
                <span className="relative z-10">{t('events.approved')}</span>
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className={`group relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  statusFilter === "pending"
                    ? "bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-white shadow-lg shadow-yellow-500/30 scale-105"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-yellow-500 hover:bg-yellow-50 hover:shadow-md"
                }`}
              >
                {statusFilter === "pending" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
                <span className="relative z-10">{t('events.pending')}</span>
              </button>
              <button
                onClick={() => setStatusFilter("rejected")}
                className={`group relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  statusFilter === "rejected"
                    ? "bg-gradient-to-r from-[#ef4444] to-[#f87171] text-white shadow-lg shadow-red-500/30 scale-105"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 hover:shadow-md"
                }`}
              >
                {statusFilter === "rejected" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#f87171] to-[#ef4444] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
                <span className="relative z-10">{t('events.rejected')}</span>
              </button>
              <button
                onClick={() => setStatusFilter("completed")}
                className={`group relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  statusFilter === "completed"
                    ? "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white shadow-lg shadow-indigo-500/30 scale-105"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-md"
                }`}
              >
                {statusFilter === "completed" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
                <span className="relative z-10">{t('events.completed') || 'Completed'}</span>
              </button>
            </div>

            {/* Enhanced Search Bar */}
            <div className="mb-8 relative">
              <div className="relative">
                <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none z-10`}>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder={t('placeholder.search') || 'Search events...'}
                  className={`w-full ${isRTL ? 'pr-4 pl-12' : 'pl-12 pr-4'} py-4 rounded-xl border-2 border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:border-transparent shadow-sm hover:shadow-md transition-all duration-300 text-sm sm:text-base`}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-4' : 'right-0 pr-4'} flex items-center z-10`}
                  >
                    <svg className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* Events Grid */}
          {loading ? (
            <div className="flex justify-center items-center w-full min-h-[400px]">
              <div className="flex flex-col items-center gap-4">
                <Loader />
                <p className="text-gray-500 text-sm">{t('common.loading') || 'Loading events...'}</p>
              </div>
            </div>
          ) : (
            <>
              {displayEvents?.length > 0 ? (
                <>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mb-10">
                    {displayEvents?.map((event, i) => (
                      <div 
                        key={event._id || i}
                        className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                      >
                        <Link
                          href={{
                            pathname: statusFilter === "completed" ? "/joinUsEvent/completed/detail" : "/joinUsEvent/detail",
                            query: { id: event._id },
                          }}
                          className="block h-full"
                        >
                          <EventCard event={event} />
                        </Link>
                      </div>
                    ))}
                  </div>
                  
                  {/* Enhanced Pagination */}
                  {EventList?.total_count > activePage && (
                    <div className="mt-12 mb-8">
                      <Paginations
                        handlePage={handlePage}
                        page={page}
                        total={EventList.total_count}
                        itemsPerPage={activePage}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20 px-4">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-[#a797cc]/10 to-[#8ba179]/10 rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <div className="w-24 h-24 bg-gradient-to-br from-[#a797cc]/20 to-[#8ba179]/20 rounded-full flex items-center justify-center">
                        <Image
                          src="/assets/images/icons/bx-calendar-plus.png"
                          height={56}
                          width={56}
                          alt={t('events.noEventsFound') || "No events"}
                          className="opacity-60"
                        />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {t('events.noEventsFound', 'No events found')}
                  </h3>
                  <p className="text-gray-600 text-base mb-8 max-w-md text-center">
                    {statusFilter === "all" 
                      ? t('events.createFirstEvent', 'Create your first event to get started and share amazing experiences with others')
                      : t('events.noEventsForFilter', `No ${statusFilter} events found for this filter`)
                    }
                  </p>
                  {statusFilter === "all" && (
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="group relative bg-gradient-to-r from-[#a797cc] to-[#8ba179] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#8ba179] to-[#a797cc] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10 flex items-center gap-2">
                        <Image
                          src="/assets/images/icons/bx-calendar-plus.png"
                          height={20}
                          width={20}
                          alt=""
                          className="relative z-10"
                        />
                        {t('card.tab15') || 'Create Event'}
                      </span>
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <AddEditJoinEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventpage={page}
        eventlimit={activePage}
      />
    </>
  );
}
