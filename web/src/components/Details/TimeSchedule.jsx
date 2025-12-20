"use client";

import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { useRTL } from "@/utils/rtl";

const TimeSchedule = ({ schedule }) => {
    const { t, i18n } = useTranslation();
    const { isRTL } = useRTL();
    
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';
        
        return date.toLocaleDateString(locale, {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const time = new Date(`1970-01-01T${timeString}`);
        const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';
        
        return time.toLocaleTimeString(locale, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };

    return (
        <div className={`bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#a797cc] to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Icon icon="lucide:calendar" className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                    <h3 className={`font-bold text-lg text-gray-900 mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('detail.tab46')}
                    </h3>
                    <div className="space-y-2">
                        <div className={`flex items-center gap-2 text-gray-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Icon icon="lucide:calendar-days" className="w-4 h-4 text-[#a797cc] flex-shrink-0" />
                            <span className="text-sm font-medium">{formatDate(schedule?.event_date)}</span>
                        </div>
                        <div className={`flex items-center gap-2 text-gray-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Icon icon="lucide:clock" className="w-4 h-4 text-[#a797cc] flex-shrink-0" />
                            <span className="text-sm font-medium">
                                {formatTime(schedule?.event_start_time)}
                                {" "}{t('detail.tab45')}{" "}
                                {formatTime(schedule?.event_end_time)}
                            </span>
                        </div>
                        {schedule?.event_address && (
                            <div className={`flex items-center gap-2 text-gray-700 mt-3 pt-3 border-t border-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <Icon icon="lucide:map-pin" className="w-4 h-4 text-[#a797cc] flex-shrink-0" />
                                <span className="text-sm">{schedule.event_address}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimeSchedule;
