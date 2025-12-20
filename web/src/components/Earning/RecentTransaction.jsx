import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function RecentTransaction({ data }) {
    const { t } = useTranslation();
    return (
        <div className="">
            <h3 className="text-2xl font-bold mb-4 lg:mb-8">{t('earning.tab2')}</h3>
            {/* Apply grid layout with 2 columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8 gap-y-14">
                {data?.transactions?.length > 0 ? (
                    data.transactions.map((transition) => (
                        <div
                            key={transition._id}
                            className="relative flex justify-between items-center py-6 border p-4 bg-white rounded-2xl shadow-lg w-full"
                        >
                            <span className="absolute -top-9 right-10 px-4 py-1 bg-[#a797cc] text-white rounded-t-lg text-sm flex items-center gap-x-2">
                                <div>
                                    <Image
                                        src="/assets/images/icons/calendar2.png"
                                        alt="Clock Icon"
                                        width={25}
                                        height={27}
                                    />
                                </div>
                                {new Intl.DateTimeFormat('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                }).format(new Date(transition.createdAt))}
                            </span>
                            <div className="flex items-center space-x-4">
                                <div className="w-[65px] h-[65px] rounded-full overflow-hidden shadow-md">
                                    <Image
                                        src={
                                            transition.profile_image ||
                                            "/assets/images/default-profile.png"
                                        }
                                        alt={`${transition.first_name} ${transition.last_name}`}
                                        height={65}
                                        width={65}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold text-base md:text-xl">
                                        {transition.first_name} {transition.last_name}
                                    </h4>
                                </div>
                            </div>
                            <div className="text-gray-800 font-semibold text-base md:text-xl">
                                {transition.total_amount} {t('card.tab2')}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="w-full">
                        <p className="text-gray-500">{t('earning.tab11')}</p>
                    </div>
                )}
            </div>

        </div>
    );
}
