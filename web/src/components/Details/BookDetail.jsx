"use client";

import { useTranslation } from "react-i18next";
import { useRTL } from "@/utils/rtl";

export default function BookDetail({ detail }) {
    const { t, i18n } = useTranslation();
    const { isRTL } = useRTL();
    
    const getEventTypeText = () => {
        if (detail?.event_type === 1) return t('detail.tab32');
        if (detail?.event_type === 2) return t('detail.tab33');
        return t('detail.tab34');
    };

    return (
        <div className={`bg-white p-6 rounded-2xl ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <h2 className={`text-xl font-bold mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('detail.tab30')}
            </h2>
            <div className="space-y-3">
                <div className={`flex justify-between text-sm font-semibold ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-900 font-semibold">{t('detail.tab31')}</span>
                    <span className="text-gray-500">{getEventTypeText()}</span>
                </div>
                <div className={`flex justify-between text-sm font-semibold ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-900 font-semibold">
                        {t('detail.tab35')} ( x{detail?.no_of_attendees})
                    </span>
                    <span className="text-gray-500">{detail?.total_amount_attendees} {t('card.tab2')}</span>
                </div>
                <div className={`flex justify-between text-sm font-semibold ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-900 font-semibold">{t('detail.tab36')}</span>
                    <span className="text-gray-500">{detail?.total_tax_attendees} {t('card.tab2')}</span>
                </div>
                <div className={`flex justify-between text-sm font-semibold ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-900 font-semibold">{t('detail.tab37')}</span>
                    <span className="text-gray-500">{detail?.total_amount} {t('card.tab2')}</span>
                </div>
            </div>
        </div>
    );
}
