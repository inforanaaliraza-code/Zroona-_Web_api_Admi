"use client";

import { useTranslation } from "react-i18next";
import { useRTL } from "@/utils/rtl";
import { Icon } from "@iconify/react";

export default function BookDetail({ detail }) {
    const { t, i18n } = useTranslation();
    const { isRTL } = useRTL();
    
    const getEventTypeText = () => {
        if (detail?.event_type === 1) return t('detail.tab32');
        if (detail?.event_type === 2) return t('detail.tab33');
        return t('detail.tab34');
    };

    const bookStatus = detail?.book_details?.book_status;
    const rejectionReason = detail?.book_details?.rejection_reason;
    const isRejected = bookStatus === 3;

    return (
        <div className={`bg-white p-6 rounded-2xl shadow-lg ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
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
                        {t('detail.tab35')} ( x{detail?.no_of_attendees || detail?.book_details?.no_of_attendees})
                    </span>
                    <span className="text-gray-500">{detail?.total_amount_attendees || detail?.book_details?.total_amount_attendees} {t('card.tab2')}</span>
                </div>
                <div className={`flex justify-between text-sm font-semibold ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-900 font-semibold">{t('detail.tab36')}</span>
                    <span className="text-gray-500">{detail?.total_tax_attendees || detail?.book_details?.total_tax_attendees} {t('card.tab2')}</span>
                </div>
                <div className={`flex justify-between text-sm font-semibold ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-900 font-semibold">{t('detail.tab37')}</span>
                    <span className="text-gray-500">{detail?.total_amount || detail?.book_details?.total_amount} {t('card.tab2')}</span>
                </div>
                
                {/* Rejection Reason Display - Premium Design */}
                {isRejected && rejectionReason && (
                    <div className="mt-4 pt-4 border-t-2 border-red-100">
                        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-200 shadow-sm">
                            <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                                    <Icon icon="lucide:alert-circle" className="w-5 h-5 text-red-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-red-900 mb-2 flex items-center gap-2">
                                        <Icon icon="lucide:info" className="w-4 h-4" />
                                        {t('rejectReason.rejectionReason') || 'Rejection Reason'}
                                    </h3>
                                    <p className="text-sm text-red-800 leading-relaxed whitespace-pre-wrap">
                                        {rejectionReason}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
