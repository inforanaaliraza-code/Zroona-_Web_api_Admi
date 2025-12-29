"use client"

import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslation } from "react-i18next";

const Attendees = ({ attendees }) => {
    const { t } = useTranslation();
    const sliderSettings = {
        dots: attendees?.length > 5,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: false,
        dotsClass: "slick-dots flex justify-center items-center mt-4",
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <>
            <div className="mt-8">
                <h2 className="text-lg md:text-xl font-semibold mb-4">{t('detail.tab3')} ({attendees?.length})</h2>
                <Slider {...sliderSettings}>
                    {attendees?.map((attendee) => (
                        <div key={attendee._id} className="px-2 pb-7">
                            <div className="rounded-2xl shadow-lg overflow-hidden bg-white px-5 py-6 h-[170px] flex flex-col items-center">
                                <div className="flex justify-center items-center w-full">
                                    <div className="w-[81px] h-[81px] rounded-full overflow-hidden">
                                        <Image
                                            src={attendee?.profile_image}
                                            alt={attendee?.first_name}
                                            width={81}
                                            height={81}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <p className="text-sm mt-3 text-gray-800 font-semibold text-center">
                                    {attendee?.first_name} {attendee?.last_name}
                                </p>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>

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

export default Attendees;
