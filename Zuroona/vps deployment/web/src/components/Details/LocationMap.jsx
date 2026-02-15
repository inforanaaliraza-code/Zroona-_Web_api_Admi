"use client";

import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { useRTL } from "@/utils/rtl";

const LocationMap = ({ location }) => {
    const { t } = useTranslation();
    const { isRTL } = useRTL();
    
    return (
        <div className={`bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#a797cc] to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Icon icon="lucide:map-pin" className="w-6 h-6 text-white" />
                </div>
                <h3 className={`font-bold text-lg text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('detail.tab7')}
                </h3>
            </div>
            <div className="rounded-xl w-full overflow-hidden border-2 border-gray-200 shadow-inner">
                <iframe
                    src={`httpss://maps.google.com/maps?q=${encodeURIComponent(location?.event_address || '')}&output=embed`}
                    width="100%"
                    height="280"
                    className="rounded-lg"
                    allowFullScreen=""
                    loading="lazy"
                    style={{ border: 0 }}
                ></iframe>
            </div>
            {location?.event_address && (
                <div className={`mt-4 p-3 bg-gray-50 rounded-lg ${isRTL ? 'text-right' : 'text-left'}`}>
                    <p className={`text-sm text-gray-700 font-medium flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Icon icon="lucide:navigation" className="w-4 h-4 text-[#a797cc] flex-shrink-0" />
                        {location.event_address}
                    </p>
                </div>
            )}
        </div>
    );
};

export default LocationMap;
