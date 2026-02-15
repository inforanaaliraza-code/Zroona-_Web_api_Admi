"use client";

// components/OrganizerBy.js
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useRTL } from "@/utils/rtl";

const OrganizerBy = ({ organizer }) => {
    const { t, i18n } = useTranslation();
    const { isRTL } = useRTL();
    
    return (
        <div className={`bg-white p-3 rounded-2xl ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <h3 className={`font-semibold text-lg ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('detail.tab4')}
            </h3>
            <div className={`flex items-center mt-2 gap-x-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="h-[46px] w-[46px] rounded-full overflow-hidden flex-shrink-0">
                    <Image
                        src={
                            organizer?.profile_image?.includes("https")
                                ? organizer?.profile_image
                                : "/assets/images/home/dummyImage.png"
                        }
                        alt={organizer?.first_name}
                        width={46}
                        height={46}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                    <p className="text-gray-800 font-semibold text-sm mb-1">
                        {organizer?.first_name} {organizer?.last_name}
                    </p>
                    <div className={`flex sm:items-center gap-x-3 flex-wrap gap-y-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex items-center gap-x-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Image
                                src="/assets/images/icons/phone-outline.png"
                                alt="Phone Call"
                                width={11}
                                height={17}
                                className="flex-shrink-0"
                            />
                            <p className="text-gray-700 font-semibold text-xs">
                                {i18n.language === 'ar' ? (
                                    <>
                                        {organizer?.phone_number} {organizer?.country_code}
                                    </>
                                ) : (
                                    <>
                                        {organizer?.country_code} {organizer?.phone_number}
                                    </>
                                )}
                            </p>
                        </div>
                        <div className={`flex items-center gap-x-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Image
                                src="/assets/images/icons/mail-outline.png"
                                alt="Email"
                                width={19}
                                height={15}
                                className="flex-shrink-0"
                            />
                            <p className="text-gray-700 font-semibold text-xs">
                                {organizer?.email}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizerBy;
