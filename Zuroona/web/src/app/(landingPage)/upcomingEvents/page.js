"use client";

import { useEffect, useState, useMemo } from "react";
import EventCard from "@/components/common/EventCard";
import Calendar from "@/components/common/Calender";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Image from "next/image";
import Link from "next/link";
import Dropdown from "@/components/common/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import { getUserEventList } from "@/redux/slices/UserEventList";
import Loader from "@/components/Loader/Loader";
import { format } from "date-fns";
import Paginations from "@/components/Paginations/Pagination";
import { useTranslation } from "react-i18next";
import { getCategoryEventList } from "@/redux/slices/CategoryEventList";

//   {
//     id: 1,
//     title: "The Nature of Metlife's business is long-terms",
//     date: "19 JUN",
//     location: "8118, Al Arid Dist.RIYADH",
//     price: "44.48 SAR",
//     image: "/assets/images/home/event1.png",
//     attendees: [
//       "/assets/images/home/p1.png",
//       "/assets/images/home/p2.png",
//       "/assets/images/home/p3.png",
//     ],
//     totalAttendees: 23,
//   },
//   {
//     id: 2,
//     title: "The Nature of Metlife's business is long-terms",
//     date: "19 JUN",
//     location: "8118, Al Arid Dist.RIYADH",
//     price: "44.48 SAR",
//     image: "/assets/images/home/event2.png",
//     attendees: [
//       "/assets/images/home/p1.png",
//       "/assets/images/home/p2.png",
//       "/assets/images/home/p3.png",
//     ],
//     totalAttendees: 23,
//   },
//   {
//     id: 3,
//     title: "The Nature of Metlife's business is long-terms",
//     date: "19 JUN",
//     location: "8118, Al Arid Dist.RIYADH",
//     price: "44.48 SAR",
//     image: "/assets/images/home/event3.png",
//     attendees: [
//       "/assets/images/home/p1.png",
//       "/assets/images/home/p2.png",
//       "/assets/images/home/p3.png",
//     ],
//     totalAttendees: 23,
//   },
//   {
//     id: 4,
//     title: "The Nature of Metlife's business is long-terms",
//     date: "19 JUN",
//     location: "8118, Al Arid Dist.RIYADH",
//     price: "44.48 SAR",
//     image: "/assets/images/home/event4.png",
//     attendees: [
//       "/assets/images/home/p1.png",
//       "/assets/images/home/p2.png",
//       "/assets/images/home/p3.png",
//     ],
//     totalAttendees: 23,
//   },
//   {
//     id: 5,
//     title: "The Nature of Metlife's business is long-terms",
//     date: "19 JUN",
//     location: "8118, Al Arid Dist.RIYADH",
//     price: "44.48 SAR",
//     image: "/assets/images/home/event5.png",
//     attendees: [
//       "/assets/images/home/p1.png",
//       "/assets/images/home/p2.png",
//       "/assets/images/home/p3.png",
//     ],
//     totalAttendees: 23,
//   },
//   {
//     id: 6,
//     title: "The Nature of Metlife's business is long-terms",
//     date: "19 JUN",
//     location: "8118, Al Arid Dist.RIYADH",
//     price: "44.48 SAR",
//     image: "/assets/images/home/event6.png",
//     attendees: [
//       "/assets/images/home/p1.png",
//       "/assets/images/home/p2.png",
//       "/assets/images/home/p3.png",
//     ],
//     totalAttendees: 23,
//   },
// ];

export default function UpComingEvents() {
  const { t, i18n } = useTranslation();
  const breadcrumbItems = [
    { label: t("breadcrumb.tab1"), href: "/" },
    { label: t("breadcrumb.tab9"), href: "/upcomingEvents" },
  ];
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [type, setType] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [activePage, setActivePage] = useState(6);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);


  const handlePage = (value) => {
    setPage(value);
  };

  const { UserEventList, loading } = useSelector(
    (state) => state.UserEventData
  );

  const { CategoryEventList, loadingCategory } = useSelector(
    (state) => state.CategoryEventData
  );

  useEffect(() => {
    dispatch(getCategoryEventList({ page: page, limit: 20 }));
  }, [page, dispatch, i18n.language]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(categoryId); // Highlight selected category
    setCategoryFilter(categoryId); // Update the category filter
  };

  useEffect(() => {
    dispatch(
      getUserEventList({
        page: page,
        limit: activePage,
        search: search,
        event_type: type,
        event_category: categoryFilter,
        event_date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
      })
    );
  }, [page, type, search, selectedDate, categoryFilter]);

  const handleTabChange = (tab) => {
    setType(tab);
    setPage(1);
  };

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <section className="bg-white py-16 ">
        <div className="mx-auto px-4 md:px-8 xl:px-28">
          <div className="mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-10">
              <div className="lg:col-span-2">
                <div className="flex flex-col md:flex-row lg:flex-col justify-between items-center mb-4 gap-x-10">
                  {/* <Calendar onDateChange={setSelectedDate} /> */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Category</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      {loadingCategory ? (
                        <div className="flex justify-center items-center w-full">
                          <Loader height="30" />
                        </div>
                      ) : CategoryEventList && CategoryEventList.length > 0 ? (
                        CategoryEventList.map((category) => {
                          const isSelected =
                            selectedCategoryId === category._id; // Check if category is selected
                          return (
                            <button
                              key={category._id}
                              className={`flex items-center gap-x-2 border-2 rounded-xl px-3 py-3 text-sm font-semibold ${
                                isSelected
                                  ? "bg-[#a797cc] text-white border-[#a797cc]" // Selected styles
                                  : "bg-white text-[#a797cc] border-[#a797cc]" // Default styles
                              }`}
                              onClick={() => handleCategoryClick(category._id)} // Handle click
                            >
                              <div>
                                <Image
                                  src={
                                    isSelected
                                      ? category.selected_image // Show selected image
                                      : category.unselected_image ||
                                        "/assets/images/icons/Topics.png" // Show unselected/default image
                                  }
                                  height={20} // Adjust as needed
                                  width={20} // Adjust as needed
                                  alt={category.name || "Category"}
                                  className=""
                                />
                              </div>
                              <span>{category.name || t("home.tab9")}</span>{" "}
                              {/* Display category name */}
                            </button>
                          );
                        })
                      ) : (
                        <div className="text-gray-800">No categories available.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-4">
                <h2 className="text-3xl font-bold mb-6">
                  {t("breadcrumb.tab9")}
                </h2>

                <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-5">
                  <div className="flex bg-[#a797cc] rounded-lg w-full sm:w-auto">
                    <button
                      onClick={() => handleTabChange(1)}
                      className={`py-3 px-4 sm:py-3 sm:px-6 text-sm font-semibold rounded-lg w-full lg:w-auto ${
                        type === 1
                          ? "bg-[#a797cc] text-white"
                          : "border-2 border-[#a797cc] text-[#a797cc] bg-white"
                      }`}
                    >
                      {t("tab.tab4")}
                    </button>
                    <button
                      onClick={() => handleTabChange(2)}
                      className={`py-3 px-4 sm:py-3 sm:px-6 text-sm font-semibold rounded-lg w-full lg:w-auto whitespace-nowrap ${
                        type === 2
                          ? "bg-[#a797cc] text-white"
                          : "border-2 border-[#a797cc] text-gray-700 bg-white"
                      }`}
                    >
                      {t("tab.tab5")}
                    </button>
                  </div>

                  {/* Distance Dropdown */}
                  {/* <Dropdown /> */}
                </div>
                {loading ? (
                  <div className="flex justify-center items-center w-full mb-4">
                    <Loader />
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10 mb-10">
                    {(UserEventList?.data || []).map((event, i) => (
                      <EventCard
                        key={event._id || i}
                        event={event}
                        showBookNow={true}
                        BookNowBtn={true}
                        btnName={t("card.tab10") || "Book Now"}
                        categories={CategoryEventList || []}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {UserEventList?.total_count > 6 && (
                  <Paginations
                    handlePage={handlePage}
                    page={page}
                    total={UserEventList.total_count}
                    itemsPerPage={activePage}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
