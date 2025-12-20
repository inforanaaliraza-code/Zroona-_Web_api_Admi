import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function WithdrawalHistory({ data }) {
    const { t } = useTranslation();
    return (
        <div className="">
            {/* Apply grid layout with 2 columns */}
            <div className="grid grid-cols-1 gap-y-4">
                {Array.isArray(data) && data.length > 0 ? (
                    data.map((transition) => (
                        <div
                            key={transition._id}
                            className="relative flex justify-between items-center py-6 border p-4 bg-white rounded-2xl shadow-lg w-full"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-[65px] h-[65px] rounded-full overflow-hidden shadow-md">
                                    <Image
                                        src="/assets/images/icons/card.png"
                                        alt=""
                                        height={65}
                                        width={65}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold text-base md:text-xl">
                                        {transition.amount} {t('card.tab2')}
                                    </h4>
                                </div>
                            </div>
                            <div className="flex items-center gap-x-8">
                                <div className="text-sm flex items-center gap-x-2 text-gray-600">
                                    <div>
                                        <Image src="/assets/images/icons/calendar2.png" alt="Clock Icon" width={25} height={27} />
                                    </div>
                                    {new Intl.DateTimeFormat('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true, // Use `false` for 24-hour format
                                    }).format(new Date(transition.createdAt))}
                                </div>
                                <div
                                    className={`font-semibold text-base py-2 px-4 w-28 flex justify-center rounded-lg ${transition.status === 0
                                            ? "bg-[#faf6d5] text-[#f4871d]"
                                            : transition.status === 1
                                                ? "bg-[#e0f6d4] text-[#4ecb0c]"
                                                : transition.status === 2
                                                    ? "bg-[#ffd2d242] text-[#f32525d1]"
                                                    : "bg-gray-200 text-gray-900"
                                        }`}
                                >
                                    {transition.status === 0
                                        ? t("earning.pending")
                                        : transition.status === 1
                                            ? t("earning.credited")
                                            : transition.status === 2
                                                ? t("earning.failed")
                                                : t("earning.unknown")}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">{t('earning.tab11')}</p>
                )}

            </div>
        </div>
    );
}
