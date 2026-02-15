import Image from 'next/image';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';

const TicketCard = ({ data }) => {
    const { i18n } = useTranslation();
    return (
        <div className="border-2 border-[#a797cc] rounded-2xl p-2 py-3 relative w-56">
            {/* Ticket Notch (on the side) */}
            <div
                className={`absolute top-1/2 ${i18n.language === 'ar' ? 'left-[-14px] right-auto rounded-r-full border-l-white' : 'right-[10px] left-auto rounded-l-full border-r-white'} transform translate-x-1/2 -translate-y-1/2 w-6 h-10  bg-white border-2 border-[#a797cc]`}
            ></div>

            {/* Image and Title */}
            <div className="flex items-center mb-4 gap-x-3">
                <Image
                    src={
                        data?.event_image?.includes("https")
                            ? data?.event_image
                            : "/assets/images/home/dummyImage.png"
                    }  // replace with your image path
                    alt="Toastmasters Club Meeting"
                    width={50}
                    height={60}
                    className="rounded-lg h-12 w-14"
                />
                <div className="max-w-[10rem]">
                    <h3 className="font-semibold text-sm leading-4">{data?.event_name}</h3>
                </div>
            </div>
            <div className="text-xs text-gray-700 flex items-start gap-x-2 pr-5">
                <Icon icon="lucide:map-pin" className="w-4 h-4 text-brand-gray-purple-2 flex-shrink-0" />
                {data?.event_address}
            </div>

            {/* Price Section */}
            <div className="border-t border-[#a797cc] pt-2 mt-2 mx-2 text-center">
                <p className="text-sm text-gray-900">
                    Price{' '}
                    <span className="font-bold">
                        {data?.event_price} SAR
                    </span>{' '}
                    / person
                </p>
            </div>
        </div>
    );
};

export default TicketCard;
