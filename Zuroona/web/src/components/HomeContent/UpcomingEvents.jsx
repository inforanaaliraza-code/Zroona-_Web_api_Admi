"use client";

import EventCard from "../common/EventCard";
import { useDataStore } from "@/app/api/store/store";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import Loader from "../Loader/Loader";
import { useTranslation } from "react-i18next";
import useAuthStore from "@/store/useAuthStore";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryEventList } from "@/redux/slices/CategoryEventList";

export default function UpcomingEvents() {
	const { t, i18n } = useTranslation();
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [filteredEvents, setFilteredEvents] = useState([]);

	const { CategoryEventList } = useSelector(
		(state) => state.CategoryEventData
	);

	useEffect(() => {
		dispatch(getCategoryEventList({ page: 1, limit: 20 }));
	}, [dispatch, i18n.language]);


	const params = {
		page: 1,
		limit: 100, // Fetch more to shuffle from
		event_type: 1,
		search: "",
	};

	const GetAllEvents = useDataStore((store) => store.GetAllEvents);
	const { fetchGetAllEvents } = useDataStore();

	// Shuffle array function for randomization - only on client side
	const shuffleArray = (array) => {
		let shuffled = [...array];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	};

	// Track if component has mounted to prevent hydration mismatch
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				setLoading(true);
				console.log("[UPCOMING-EVENTS] Fetching events...");
				await fetchGetAllEvents(params);
				console.log("[UPCOMING-EVENTS] Events fetched successfully");
			} catch (error) {
				console.error("[UPCOMING-EVENTS] Error fetching events:", error);
				// On error, set empty array
				setFilteredEvents([]);
			} finally {
				setLoading(false);
			}
		};
		
		fetchEvents();
	}, []);

	// Filter events: Only show "Everyone" events (event_for = 3) and randomize
	useEffect(() => {
		// Only shuffle on client side after mount to prevent hydration mismatch
		if (!isMounted) {
			return;
		}

		// Check if GetAllEvents has data in different possible formats
		let eventsArray = [];
		
		if (GetAllEvents?.data && Array.isArray(GetAllEvents.data)) {
			eventsArray = GetAllEvents.data;
		} else if (GetAllEvents?.events && Array.isArray(GetAllEvents.events)) {
			eventsArray = GetAllEvents.events;
		} else if (Array.isArray(GetAllEvents)) {
			eventsArray = GetAllEvents;
		}
		
		if (eventsArray.length > 0) {
			// Filter: Only "Everyone" (event_for == 3)
			let filteredEvents = eventsArray.filter((event) => {
				const eventFor = event.event_for || 3;
				return eventFor === 3;
			});

			// Randomize the filtered events only on client side
			filteredEvents = shuffleArray(filteredEvents);

			setFilteredEvents(filteredEvents);
		} else {
			// Set empty array when API is empty
			if (!loading) {
				setFilteredEvents([]);
			}
		}
	}, [GetAllEvents, loading, isMounted]);

	// Carousel Settings
	const settings = {
		dots: true,
		infinite: filteredEvents.length > 3,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 3000,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
					infinite: filteredEvents.length > 2,
				}
			},
			{
				breakpoint: 640,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					dots: false
				}
			}
		]
	};

	return (
		<section className="pb-12 bg-white">
			<div className="mx-auto px-4 md:px-8 xl:px-28">
				<div className="flex justify-between items-end mb-6">
					<h1 className="text-3xl font-bold">{t("home.tab8")}</h1>
					{filteredEvents?.length > 0 && (
						<Link
							href="/upcomingEvents"
							className="text-[#a797cc] text-sm font-semibold"
						>
							View All
						</Link>
					)}
				</div>
				{loading ? (
					<div className="flex justify-center items-center w-full">
						<Loader />
					</div>
				) : (
					<>
						{filteredEvents?.length > 0 ? (
							<div className="px-2">
								<Slider {...settings}>
									{filteredEvents.map((event) => (
										<div key={event._id} className="p-4">
											<Link
												href={`/events/${event._id}`}
												className="block transition-all duration-300 transform hover:-translate-y-1 h-full"
											>
								<EventCard
									event={event}
									showAttendees={true}
									categories={CategoryEventList || []}
								/>
											</Link>
										</div>
									))}
								</Slider>
							</div>
						) : (
							<div className="text-gray-800">No Data Found</div>
						)}
					</>
				)}
			</div>
		</section>
	);
}
