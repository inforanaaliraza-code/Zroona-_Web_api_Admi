"use client";

import { useEffect, useState } from "react";
import EventCard from "@/components/common/EventCard";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Loader from "@/components/Loader/Loader";
import { format } from "date-fns";
import Paginations from "@/components/Paginations/Pagination";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getUserEventList } from "@/redux/slices/UserEventList";
import { Icon } from "@iconify/react";

// All categories used in event creation
const ALL_CATEGORIES = [
  { _id: "cultural-traditional", name: "Cultural & Traditional Events", key: "categoryCulturalTraditional" },
  { _id: "outdoor-adventure", name: "Outdoor & Adventure", key: "categoryOutdoorAdventure" },
  { _id: "educational-workshops", name: "Educational & Workshops", key: "categoryEducationalWorkshops" },
  { _id: "sports-fitness", name: "Sports & Fitness", key: "categorySportsFitness" },
  { _id: "music-arts", name: "Music & Arts", key: "categoryMusicArts" },
  { _id: "family-kids", name: "Family & Kids Activities", key: "categoryFamilyKids" },
  { _id: "food-culinary", name: "Food & Culinary Experiences", key: "categoryFoodCulinary" },
  { _id: "wellness-relaxation", name: "Wellness & Relaxation", key: "categoryWellnessRelaxation" },
  { _id: "heritage-history", name: "Heritage & History Tours", key: "categoryHeritageHistory" },
  { _id: "nightlife-entertainment", name: "Nightlife & Entertainment", key: "categoryNightlifeEntertainment" },
  { _id: "eco-sustainable", name: "Eco & Sustainable Tourism", key: "categoryEcoSustainable" },
  { _id: "business-networking", name: "Business & Networking", key: "categoryBusinessNetworking" },
  { _id: "volunteering", name: "Volunteering", key: "categoryVolunteering" },
  { _id: "photography-sightseeing", name: "Photography & Sightseeing", key: "categoryPhotographySightseeing" },
];

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
// ];

export default function UpComingEvents() {
  const { t, i18n } = useTranslation();
  const breadcrumbItems = [
    { label: t("breadcrumb.tab1"), href: "/" },
    { label: t("breadcrumb.tab9"), href: "/upcomingEvents" },
  ];
  
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [activePage, setActivePage] = useState(12);

  const { UserEventList, loading } = useSelector(
    (state) => state.UserEventData
  );

  // Fetch all events (type not separated) with category filter
  useEffect(() => {
    dispatch(
      getUserEventList({
        page: page,
        limit: activePage,
        search: "",
        event_type: 0, // 0 = fetch all events (both types)
        event_category: categoryFilter,
        event_date: "",
      })
    );
  }, [page, categoryFilter, dispatch]);

  const handleCategoryClick = (categoryId) => {
    setPage(1); // Reset to first page when category changes
    if (selectedCategoryId === categoryId) {
      // If clicking the same category, deselect it
      setSelectedCategoryId(null);
      setCategoryFilter("");
    } else {
      // Select new category
      setSelectedCategoryId(categoryId);
      setCategoryFilter(categoryId);
    }
  };

  const handlePage = (value) => {
    setPage(value);
  };

  const handleClearFilters = () => {
    setPage(1);
    setSelectedCategoryId(null);
    setCategoryFilter("");
  };

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <section className="bg-white py-12">
        <div className="mx-auto px-4 md:px-8 xl:px-28">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {t("breadcrumb.tab9", "Events of the Week")}
            </h1>
            <p className="text-gray-600 text-lg">
              {t("events.discoverEvents", "Discover and book amazing events happening in your city")}
            </p>
          </div>

          {/* Categories Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {t("events.category", "SELECT CATEGORY")}
              </h3>
              {selectedCategoryId && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-[#a797cc] font-semibold hover:text-[#8ba179] flex items-center gap-1"
                >
                  <Icon icon="lucide:x-circle" className="w-4 h-4" />
                  Clear Filter
                </button>
              )}
            </div>

            {/* Categories Grid */}
            <div className="flex flex-wrap gap-3">
              {ALL_CATEGORIES.map((category) => {
                const isSelected = selectedCategoryId === category._id;
                return (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryClick(category._id)}
                    className={`px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 border-2 ${
                      isSelected
                        ? "bg-[#a797cc] text-white border-[#a797cc] shadow-md"
                        : "bg-white text-[#a797cc] border-[#a797cc] hover:bg-[#a797cc]/5 hover:shadow-sm"
                    }`}
                  >
                    {t(`events.${category.key}`, category.name)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Events Section */}
          <div>
            <div className="mb-6">
              <p className="text-gray-600">
                <span className="font-semibold text-[#a797cc]">{UserEventList?.total_count || 0}</span> events found
                {selectedCategoryId && (
                  <span> in {ALL_CATEGORIES.find(c => c._id === selectedCategoryId)?.name}</span>
                )}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader />
              </div>
            ) : (UserEventList?.data || []).length > 0 ? (
              <>
                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                  {(UserEventList?.data || []).map((event, i) => (
                    <EventCard
                      key={event._id || i}
                      event={event}
                      showBookNow={true}
                      BookNowBtn={true}
                      btnName={t("card.tab10", "Book Now")}
                      categories={ALL_CATEGORIES || []}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {UserEventList?.total_count > activePage && (
                  <div className="flex justify-center">
                    <Paginations
                      handlePage={handlePage}
                      page={page}
                      total={UserEventList?.total_count}
                      itemsPerPage={activePage}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Icon
                  icon="lucide:calendar-x"
                  className="w-16 h-16 text-gray-300 mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {t("events.noEventsFound", "No events found")}
                </h3>
                <p className="text-gray-500 max-w-md mb-6">
                  {selectedCategoryId
                    ? "No events available in this category. Try selecting a different category."
                    : "No events available at the moment. Please check back later."}
                </p>
                {selectedCategoryId && (
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-2.5 bg-[#a797cc] hover:bg-[#8ba179] text-white font-semibold rounded-lg transition-all duration-200"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
