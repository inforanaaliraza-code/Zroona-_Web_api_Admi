import Image from 'next/image';
import { useTranslation } from 'react-i18next';

export default function CommunitySection() {
  const { t } = useTranslation();
  return (
    <div>
      {/* Header Section */}
      <div className="bg-orange-500 text-white py-16 px-4 md:px-8 lg:px-28">
        <div className=" md:w-xl lg:w-1/2">
          <h1 className="text-4xl md:text-5xl !leading-[1.2] text-white">
            {t('about.tab1')}
          </h1>
          <p className="mt-4 text-sm font-light max-w-2xl">
            {t('about.tab2')}
          </p>
        </div>
      </div>

      {/* Content Section */}                 
      <div className="grid grid-cols-1 lg:grid-cols-2 mt-5 md:mt-0 bg-[#FFF0F1]">
        {/* Left Image */}
        <div className='px-8 lg:px-0'>
          <Image
            src="/assets/images/about/img2.png"
            alt="Event Image"
            width={800}
            height={450}
            className="w-full object-cover"
          />
        </div>

        {/* Right Text */}
        <div className="flex pt-8 lg:pt-10 bg-[#FFF0F1] lg:pl-8 lg:pr-36 pl-8 pr-8 mb-5 lg:mb-0">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-5">
              {t('about.tab3')}
            </h2>
            <p className="text-base text-gray-700 font-light">
              {t('about.tab4')}
            </p>
            <p className="mt-5 text-base text-gray-700 font-light">
              {t('about.tab4')}
            </p>
          </div>
        </div>

        {/* Second Section: Text and Image */}
        <div className="flex pt-8 lg:pt-20 bg-[#FFF0F1] pr-8 lg:pl-36 pl-8 order-1 lg:order-0">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-5">
              {t('about.tab5')}
            </h2>
            <p className="text-base text-gray-700 font-light">
              {t('about.tab4')}
            </p>
            <p className="mt-5 text-base text-gray-700 font-light">
              {t('about.tab4')}
            </p>
          </div>
        </div>

        {/* Right Image */}
        <div className='px-8 lg:px-0 order-0 lg:order-1'>
          <Image
            src="/assets/images/about/img1.png"
            alt="Event Image"
            width={800}
            height={450}
            className="w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
