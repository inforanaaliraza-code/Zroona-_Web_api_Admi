import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const AdditionalCard = ({ cardContent }) => {
    const { t } = useTranslation();
    return (
        <div className="relative w-full mb-8 mt-10 lg:mt-0">
            <Image
                src="/assets/images/home/group-img.png"
                height={192}
                width={406}
                alt=""
                className="w-full lg:w-auto h-auto"
            />
            <Link
                href=""
                className="underline absolute bottom-5 right-5 text-xs font-semibold text-blue-800"
            >
                {t('detail.tab7')}
            </Link>
        </div>
    );
};

export default AdditionalCard;
