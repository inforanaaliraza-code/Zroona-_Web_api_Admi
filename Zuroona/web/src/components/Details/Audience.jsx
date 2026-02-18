import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { useRTL } from "@/utils/rtl";

const Audience = ({ organizer }) => {
    const { t } = useTranslation();
    const { isRTL } = useRTL();
    
    const getAudienceLabel = () => {
        return organizer?.event_for_label ||
            (organizer?.event_for == 1
                ? (t('detail.tab28') || 'Men Only')
                : organizer?.event_for == 2
                    ? (t('detail.tab29') || 'Women Only')
                    : organizer?.event_for == 3
                        ? (t('detail.tab20') || 'Both')
                        : (t('detail.tab27') || 'All'));
    };

    const getAudienceIcon = () => {
        if (organizer?.event_for == 1) return "lucide:user";
        if (organizer?.event_for == 2) return "lucide:user";
        return "lucide:users";
    };

    const getAudienceColor = () => {
        if (organizer?.event_for == 1) return "from-blue-500 to-blue-600";
        if (organizer?.event_for == 2) return "from-pink-500 to-pink-600";
        return "from-purple-500 to-purple-600";
    };

    return (
        <div className={`bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <h3 className={`font-bold text-lg text-gray-900 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('detail.tab27') || 'Event Audience'}</h3>
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${getAudienceColor()} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon icon={getAudienceIcon()} className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`text-gray-900 font-bold text-lg ${isRTL ? 'text-right' : 'text-left'}`}>
                        {getAudienceLabel()}
                    </p>
                    <p className={`text-gray-500 text-sm mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>{t('detail.whoCanAttend') || 'Who can attend'}</p>
                </div>
            </div>
        </div>
    );
};

export default Audience;
