import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";

export default function RecentTransaction({ data }) {
    const { t } = useTranslation();
    
    return (
        <div className="w-full">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-5">
                <div className="p-1.5 md:p-2 bg-gradient-to-br from-[#a797cc] to-[#8ba179] rounded-lg md:rounded-xl shadow-md">
                    <Icon icon="lucide:history" className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">{t('earning.tab2')}</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                {data?.transactions?.length > 0 ? (
                    data.transactions.map((transition, index) => (
                        <div
                            key={transition._id}
                            className="group relative bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden hover:scale-[1.01]"
                        >
                            {/* Premium Gradient Accent */}
                            <div className="absolute top-0 left-0 right-0 h-0.5 md:h-1 bg-gradient-to-r from-[#a797cc] via-[#8ba179] to-[#7251CE]"></div>
                            
                            {/* Content - Compact */}
                            <div className="p-4 md:p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        {/* Profile Image with Premium Border - Smaller */}
                                        <div className="relative flex-shrink-0">
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#a797cc] to-[#8ba179] rounded-full blur-sm opacity-50"></div>
                                            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden ring-2 ring-white shadow-md">
                                                <Image
                                                    src={
                                                        transition.profile_image ||
                                                        "/assets/images/home/user-dummy.png"
                                                    }
                                                    alt={`${transition.first_name} ${transition.last_name}`}
                                                    height={56}
                                                    width={56}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = "/assets/images/home/user-dummy.png";
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* User Info - Compact */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-sm md:text-base text-gray-900 truncate group-hover:text-[#a797cc] transition-colors">
                                                {transition.first_name} {transition.last_name}
                                            </h4>
                                            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                                                {t('earning.paymentReceived')}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Amount - Compact */}
                                    <div className="ml-2 text-right flex-shrink-0">
                                        <div className="flex items-center gap-1">
                                            <Icon icon="lucide:arrow-down-circle" className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                                            <span className="text-lg md:text-xl font-bold text-gray-900">
                                                {parseFloat(transition.total_amount || 0).toLocaleString()}
                                            </span>
                                        </div>
                                        <span className="text-xs md:text-sm font-semibold text-gray-500">
                                            {t('card.tab2')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Hover Effect Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#a797cc]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
                            <Icon icon="lucide:inbox" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg font-medium">{t('earning.tab11')}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
