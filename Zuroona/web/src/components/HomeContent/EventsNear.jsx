"use client";

import Image from "next/image";
import EventCard from "../common/EventCard";
import { useEffect, useState, useMemo } from "react";
import Loader from "../Loader/Loader";
import { useTranslation } from "react-i18next";
import { GetEvents } from "@/app/api/landing/apis";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function EventsNear() {
	const { t } = useTranslation();
	const [loading, setLoading] = useState(true);
	const [events, setEvents] = useState([]);
	const [isMounted, setIsMounted] = useState(false);

	// Track if component has mounted to prevent hydration mismatch
	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Carousel Settings
	const settings = {
		dots: true,
		infinite: events.length > 3,
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
					infinite: events.length > 2,
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

	const shuffleArray = (array) => {
		let shuffled = [...array];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	};

	const params = {
		page: 1,
		limit: 100, // Fetch more to shuffle from
	};

	useEffect(() => {
		// Only fetch and shuffle on client side after mount
		if (!isMounted) {
			return;
		}

		setLoading(true);
		GetEvents(params).then((data) => {
			const fetchedEvents = data?.data?.events || [];

			// Filter: Only "Everyone" (event_for == 3)
			let filteredEvents = fetchedEvents.filter((event) => {
				const eventFor = event.event_for || 3;
				return eventFor === 3;
			});

			// Randomize only on client side
			filteredEvents = shuffleArray(filteredEvents);

			// Limit display count if needed, e.g., take top 10 after shuffle
			// filteredEvents = filteredEvents.slice(0, 10); 

			// Use API events only (no dummy events)
			setEvents(filteredEvents);
			setLoading(false);
		}).catch((error) => {
			console.error("Error fetching events:", error);
			// Set empty array on error
			setEvents([]);
			setLoading(false);
		});
	}, [isMounted]);

	return (
		<section className="relative py-20 overflow-hidden">
			{/* Decorative background */}
			<div className="absolute inset-0 bg-gradient-to-b to-white from-gray-50/80"></div>

			<div className="relative px-4 mx-auto md:px-8 xl:px-28">
				{/* Section header */}
				<div className="flex flex-col justify-center items-center mb-12">
					<h2 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
						{t("home.tab6")}
					</h2>
					<div className="h-1 w-20 bg-brand-orange mt-4 rounded-full"></div>
				</div>

				{loading ? (
					<div className="min-h-[400px] flex justify-center items-center">
						<Loader />
					</div>
				) : (
					<>
						{events?.length > 0 ? (
							<div className="px-2">
								<Slider {...settings}>
									{events.map((event) => (
										<div key={event._id} className="p-4">
											<Link
												href={`/events/${event._id}`}
												className="block transition-all duration-300 transform hover:-translate-y-1 h-full"
											>
												<EventCard
													event={event}
													showAttendees={true}
												/>
											</Link>
										</div>
									))}
								</Slider>
							</div>
						) : (
							<div className="col-span-full min-h-[300px] flex flex-col items-center justify-center">
								<div className="relative mb-6 w-20 h-20">
                                    <div className="absolute inset-0 bg-brand-orange/10 rounded-full blur-xl animate-pulse"></div>
                                    <Image
                                        src="/assets/images/x_F_logo.png"
										width={120}
										height={40}
										alt="No Events"
										className="object-contain relative z-10 opacity-40"
									/>
								</div>
								<p className="font-medium text-gray-600">
									{t("home.noEvents")}
								</p>
							</div>
						)}

						{events?.length > 0 && (
							<div className="flex justify-center mt-12">
                                <Link
                                    href="/events"
                                    className="text-white text-sm font-semibold bg-primary py-2 px-4 rounded-3xl hover:bg-primary/90 transition duration-300 hover:scale-105"
								>
									{t("events.viewAllEvents")}
								</Link>
							</div>
						)}
					</>
				)}
			</div>
		</section>
	);
}
