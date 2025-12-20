"use client";

import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Loader from "@/components/Loader/Loader";
import { getUserBookingDetail } from "@/redux/slices/UserBookingDetail";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

export default function PaymentPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const BookingListId = searchParams.get("id");
  const { UserBookingdetails = {}, loadingDetail } = useSelector(
    (state) => state.UserBookingDetailData || {}
  );
  const title = UserBookingdetails?.event_name;
  const total_amount = UserBookingdetails?.book_details?.total_amount;

  useEffect(() => {
    if (BookingListId) {
      dispatch(getUserBookingDetail({ id: BookingListId }));
    }
  }, [BookingListId, dispatch]);
  const breadcrumbItems = [
    { label: t("breadcrumb.tab1"), href: "/" },
    {
      label: t("breadcrumb.tab4"),
      href: "/myEvents",
    },
    {
      label: title || t("breadcrumb.tab13"),
      href: "",
    },
  ];

  useEffect(() => {
    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = "https://cdn.moyasar.com/mpf/1.7.3/moyasar.css";
    document.head.appendChild(cssLink);
    const script = document.createElement("script");
    script.src = "https://cdn.moyasar.com/mpf/1.7.3/moyasar.js";
    script.async = true;
    script.onload = () => {
      if (window.Moyasar) {
        window.Moyasar.init({
          element: ".mysr-form",
          amount: Number(total_amount.toFixed(0)) * 100,
          currency: "SAR",
          description: "Event Payment",
          metadata: {
            order_id: BookingListId,
          },
          publishable_api_key:
            "pk_test_opk43Fh4b4rrdgR32TTUnKNe3Hd72VP35ZTHDn32",
          callback_url: `https://jeena-website.vercel.app/myEvents?id=${BookingListId}`,
          methods: ["creditcard"],
          fixed_width: false,
        });
      } else {
        console.error("Moyasar script failed to load.");
      }
    };
    
    script.onerror = () => {
      console.error("Failed to load the Moyasar script.");
    };
    document.body.appendChild(script);
    return () => {
      document.head.removeChild(cssLink);
      document.body.removeChild(script);
    };
  }, [total_amount]);

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="bg-[#FFF0F1] py-10">
        <div className="mx-auto px-4 md:px-8 xl:px-28">
          <h1 className="text-4xl font-bold mb-6">{t("breadcrumb.tab12")}</h1>
          {loadingDetail ? (
            <div className="flex justify-center items-center w-full h-40">
              <Loader />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
              {/* Left Section: Payment Details Form */}
              {loading ? (
                <div className="flex justify-center items-center w-full h-40">
                  <Loader />
                </div>
              ) : (
                <div className="col-span-full lg:col-span-7 bg-white p-4 sm:p-10 rounded-2xl order-1 lg:order-0">
                  <div className="mysr-form"></div>
                </div>
              )}

              {/* Right Section: Order Summary and Payment Methods */}
              <div className="space-y-8 col-span-full lg:col-span-5 order-0 lg:order-1">
                {/* Order Summary */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-2 items-center">
                      <Image
                        src={UserBookingdetails?.event_image}
                        height={40}
                        width={50}
                        alt=""
                        className="rounded-lg w-[50px] h-[50px] object-cover"
                      />
                      <h2 className="font-bold text-sm leading-4">
                        {UserBookingdetails?.event_name}
                      </h2>
                    </div>
                    <p className="text-xs text-gray-500 font-semibold">
                      {t("card.tab1")}{" "}
                      <span className="font-semibold text-gray-900 text-sm">
                        {UserBookingdetails?.event_price} {t("card.tab2")}
                      </span>
                      / {t("card.tab3")}
                    </p>
                  </div>

                  <div className="mb-6 flex gap-1 border-b border-gray-500 pb-2">
                    <Image
                      src="/assets/images/icons/location-pin.png"
                      height={24}
                      width={14}
                      alt=""
                      className=""
                    />
                    <p className="text-xs text-gray-600">
                      {UserBookingdetails?.event_address}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-gray-800">
                        {t("card.tab1")}
                      </span>
                      <span className="text-gray-800">
                        {UserBookingdetails?.event_price} {t("card.tab2")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-gray-800">
                        {t("card.tab5")} (x1)
                      </span>
                      <span className="text-gray-800">
                        {
                          UserBookingdetails?.book_details
                            ?.total_amount_attendees
                        }{" "}
                        {t("card.tab2")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-gray-800">
                        {t("card.tab11")}
                      </span>
                      <span className="text-gray-800">
                        {UserBookingdetails?.book_details?.total_tax_attendees}{" "}
                        {t("card.tab2")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-gray-800">
                        {t("card.tab12")}
                      </span>
                      <span className="font-semibold text-gray-800">
                        {UserBookingdetails?.book_details?.total_amount}{" "}
                        {t("card.tab2")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
