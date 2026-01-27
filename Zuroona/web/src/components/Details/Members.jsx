import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslation } from "react-i18next";

const Members = ({ members }) => {
    const { t } = useTranslation();
    const CustomPrevArrow = ({ onClick }) => (
        <button
            onClick={onClick}
            className="slick-arrow slick-prev"
            aria-label="Previous"
        >
            <Image
                src="/assets/images/icons/left-arrow.png"
                height={40}
                width={40}
                alt="Previous Arrow"
                className="w-full h-auto"
            />
        </button>
    );

    const CustomNextArrow = ({ onClick }) => (
        <button
            onClick={onClick}
            className="slick-arrow slick-next"
            aria-label="Next"
        >
            <Image
                src="/assets/images/icons/right-arrow.png"
                height={40}
                width={40}
                alt="Next Arrow"
                className="w-full h-auto"
            />
        </button>
    );

    const SliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: members?.length > 3, // Default arrow visibility for larger screens
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    arrows: members?.length > 2, // Show arrows if there are more than 2 cards
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    arrows: members?.length > 1, // Show arrows if there are more than 1 card
                },
            },
        ],
    };


    return (
        <>
            <section className="bg-[#fff] pb-16">
                <div className="mx-auto px-4 md:px-8 xl:px-28">
                    <div className="flex justify-between items-center mb-6 border-t-2 pt-10 sm:pt-16">
                        <div>
                            <h2 className="text-base sm:text-2xl font-bold">
                                {t('detail.tab14') || 'Similar Events'}
                            </h2>
                        </div>
                        <div className="slider-arrows"></div>
                    </div>
                    <Slider {...SliderSettings}>
                        {members?.map((event) => (
                            <div key={event._id} className="px-2">
                                <div className="bg-[#f8f8f8] rounded-xl overflow-hidden cursor-pointer">
                                    <div className="p-4">
                                        <span className="text-sm text-[#a797cc] font-semibold">
                                            {new Date(event.event_date).toLocaleString("en-US", {
                                                weekday: "short",
                                            })}
                                            ,{" "}
                                            {new Date(event.event_date).toLocaleString("en-US", {
                                                month: "short",
                                            })}{" "}
                                            {new Date(event.event_date).getDate()},{" "}
                                            {new Date(event.event_date).getFullYear()}{" "}
                                            {new Date(
                                                `1970-01-01T${event.event_start_time}`
                                            ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}{" "}
                                            to{" "}
                                            {new Date(
                                                `1970-01-01T${event.event_end_time}`
                                            ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}{" "}
                                            IST
                                        </span>
                                        <div className="flex justify-between items-end mt-7">
                                            <div className="max-w-[18rem]">
                                                <h2 className="text-base font-semibold mb-2">
                                                    {event.event_name}
                                                </h2>
                                                <div className="flex gap-x-2 text-gray-700">
                                                    <Image
                                                        src="/assets/images/icons/location-pin.png"
                                                        height={15}
                                                        width={18}
                                                        alt=""
                                                    />
                                                    <span className="text-sm">{event.event_address}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <p className="text-sm text-gray-800 leading-4">{t('detail.tab26') || 'Price'}</p>
                                                <p className="text-[0.900rem] font-bold text-black leading-4 whitespace-nowrap">
                                                    {event.event_price}
                                                </p>
                                                <span className="text-xs text-gray-800">/ {t('card.tab3') || 'person'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-t px-4 py-2">
                                        <h2 className="text-base font-semibold">{t('detail.tab3') || 'Attendees'}</h2>
                                        <div className="flex justify-between items-center">
                                            <div className="flex -space-x-3">
                                                {/* Render attendees dynamically */}
                                                {event?.attendees
                                                    ?.slice(0, 3)
                                                    .map((attendee, index) => (
                                                        <div
                                                            className="w-10 h-10 rounded-full border-2 border-white overflow-hidden"
                                                            key={attendee._id + index}
                                                        >
                                                            <Image
                                                                src={attendee.profile_image} // Attendee profile image
                                                                alt={`${attendee.first_name} ${attendee.last_name}`}
                                                                width={46}
                                                                height={46}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        </div>
                                                    ))}

                                                {/* Counter circle */}
                                                {event?.attendees?.length > 3 && (
                                                    <div className="w-8 h-8 mt-1.5 !-ml-4 rounded-full bg-[#a797cc] border-2 border-transparent flex items-center justify-center text-white text-xs font-bold">
                                                        +{event.attendees.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                            <Link
                                                href={{
                                                    pathname: "/upcomingEvents/detail",
                                                    query: { id: event._id },
                                                }}
                                            >
                                                <button className="bg-[#a797cc] text-white rounded-lg py-3 px-6 text-xs font-semibold">
                                                    {t('detail.tab11') || 'Book Now'}
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </section>

            <style jsx global>{`
                :global(.slick-dots .slick-active div) {
                background-color: #ab0017;
                }

                .slick-track {
                margin-left: initial;
                margin-right: initial;
                }
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
                @media (max-width: 600px) {
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
};

export default Members;
