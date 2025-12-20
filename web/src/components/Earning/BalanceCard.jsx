import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function BalanceCard({ data }) {
    const { t } = useTranslation();
    return (
        <div className="py-12 rounded-2xl text-white bg-cover" style={{ backgroundImage: "url('/assets/images/home/blance-bg.png')" }}>
            <div className="flex flex-col items-center">
                <Image src="/assets/images/icons/wallet.png" alt="Wallet Icon" width={68} height={56} />
                <div className="flex items-end my-6 gap-1">
                    <h2 className="text-4xl font-bold leading-7 text-white">{data?.total_earnings} {t('card.tab2')}</h2>
                    <div>
                        <Image src="/assets/images/home/flag.png" alt="Chevron Right" width={22} height={18} />
                    </div>
                </div>
                <Link href="/withdrawal" className="bg-[#a797cc] py-3 px-8 rounded-full text-sm text-white">
                    {t('earning.tab1')}
                </Link>
            </div>
        </div>
    );
}
