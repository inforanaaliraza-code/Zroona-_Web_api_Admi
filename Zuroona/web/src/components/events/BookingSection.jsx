'use client';

import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Icon } from '@iconify/react';

export default function BookingSection({ 
  eventPrice, 
  isReserving, 
  bookStatus, 
  paymentStatus, 
  onBookNowClick 
}) {
  const { t } = useTranslation();

  return (
    <div className="p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="text-center mb-6">
        <div className="flex items-baseline justify-center gap-2 mb-2">
          <span className="text-5xl font-bold text-[#a797cc]">
            {eventPrice}
          </span>
          <span className="text-2xl font-semibold text-[#a797cc]">
            {t("card.tab2")}
          </span>
        </div>
        <span className="text-sm font-medium text-gray-600">
          {t("Per Person")}
        </span>
      </div>

      <Button
        className={`w-full text-white text-lg font-bold h-14 rounded-xl shadow-lg transition-all duration-300 ${
          isReserving || bookStatus === 1 || (bookStatus !== 2 && bookStatus !== undefined)
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-[#a797cc] to-[#8ba179] hover:from-[#8ba179] hover:to-[#a797cc] hover:shadow-xl transform hover:-translate-y-0.5"
        }`}

        
        onClick={onBookNowClick}
        disabled={isReserving || bookStatus === 1 || (bookStatus !== 2 && bookStatus !== undefined)}
      >
        {isReserving ? (
          <span className="flex items-center gap-2">
            <Icon icon="lucide:loader-2" className="w-5 h-5 animate-spin" />
            {t("eventsMain.processing") || "Processing payment..."}
          </span>
        ) : bookStatus === 1 ? (
          <span className="flex items-center gap-2">
            <Icon icon="lucide:clock" className="w-5 h-5" />
            {t("eventsMain.pending") || "Pending - Waiting for host approval"}
          </span>
        ) : bookStatus === 2 && paymentStatus === 0 ? (
          <span className="flex items-center gap-2">
            <Icon icon="lucide:credit-card" className="w-5 h-5" />
            {t("eventsMain.proceedToPayment") || "Proceed to Payment"}
          </span>
        ) : bookStatus === 3 || bookStatus === 4 ? (
          <span className="flex items-center gap-2">
            <Icon icon="lucide:x-circle" className="w-5 h-5" />
            {t("eventsMain.rejected") || "Rejected"}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Icon icon="lucide:calendar-plus" className="w-5 h-5" />
            {t("card.tab10")}
          </span>
        )}
      </Button>

      <div className="mt-6 flex justify-center items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
        <Icon
          icon="lucide:shield-check"
          className="w-5 h-5 text-green-600"
        />
        <span className="text-sm font-semibold text-gray-700">
          {t("detail.tab12")}
        </span>
      </div>
    </div>
  );
}
