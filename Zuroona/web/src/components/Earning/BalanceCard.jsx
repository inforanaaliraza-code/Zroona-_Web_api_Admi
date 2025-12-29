import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";

export default function BalanceCard({ data }) {
    const { t } = useTranslation();
    const balance = data?.total_earnings || 0;
    
    return (
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl transition-all duration-300 hover:shadow-xl md:hover:shadow-2xl hover:scale-[1.01] md:hover:scale-[1.02]">
            {/* Premium Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#a797cc] via-[#8ba179] to-[#7251CE] opacity-95"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20"></div>
            
            {/* Decorative Elements - Smaller */}
            <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-white/10 rounded-full -mr-24 md:-mr-32 -mt-24 md:-mt-32 blur-2xl md:blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-36 h-36 md:w-48 md:h-48 bg-white/10 rounded-full -ml-18 md:-ml-24 -mb-18 md:-mb-24 blur-xl md:blur-2xl"></div>
            
            {/* Content - Compact */}
            <div className="relative py-6 md:py-8 px-5 md:px-7 text-white">
                <div className="flex flex-col items-center">
                    {/* Wallet Icon with Premium Effect - Smaller */}
                    <div className="relative mb-4 md:mb-5">
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-lg"></div>
                        <div className="relative bg-white/20 backdrop-blur-sm rounded-full p-3 md:p-4 border border-white/30 shadow-md">
                            <Icon icon="lucide:wallet" className="w-8 h-8 md:w-10 md:h-10 text-white" />
                        </div>
                    </div>
                    
                    {/* Balance Display - Compact */}
                    <div className="flex items-end justify-center gap-1.5 md:gap-2 mb-4 md:mb-6">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white drop-shadow-lg">
                            {balance.toLocaleString()}
                        </h2>
                        <div className="mb-0.5 md:mb-1">
                            <span className="inline-flex items-center px-2 md:px-2.5 py-0.5 md:py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs md:text-sm font-semibold text-white border border-white/30 shadow-sm">
                                {t('card.tab2')}
                            </span>
                        </div>
                    </div>
                    
                    {/* Available Balance Label - Compact */}
                    <p className="text-white/80 text-xs md:text-sm font-medium mb-4 md:mb-5">
                        {t('earning.tab3')}
                    </p>
                    
                    {/* Withdraw Button - Compact */}
                    <Link 
                        href="/withdrawal" 
                        className="group relative overflow-hidden bg-white text-[#a797cc] py-2.5 md:py-3 px-6 md:px-8 rounded-full text-sm md:text-base font-semibold shadow-lg md:shadow-xl hover:shadow-xl md:hover:shadow-2xl transition-all duration-300 hover:scale-105 transform"
                    >
                        <span className="relative z-10 flex items-center gap-1.5 md:gap-2">
                            <Icon icon="lucide:arrow-right" className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
                            {t('earning.tab1')}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#a797cc] to-[#8ba179] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="absolute inset-0 bg-white/20 group-hover:bg-white/10 transition-colors duration-300"></span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
