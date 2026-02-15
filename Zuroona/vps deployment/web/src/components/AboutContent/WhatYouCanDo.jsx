    import Image from 'next/image';
import { useTranslation } from 'react-i18next';

export default function WhatYouCanDo() {
    const { t } = useTranslation();
    return (
        <>
            <section className="bg-[#FFF0F1] py-16 pb-0 px-8">
                <div className='mx-auto px-4 md:px-8 xl:px-28'>
                    {/* Section Title */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-3xl font-extrabold">{t('about.tab6')}</h2>
                    </div>

                    {/* Three Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        {/* Explore your city */}
                        <div className="flex flex-col items-center">
                            <div className='h-[150px] mb-5'>
                                <Image
                                    src="/assets/images/about/city.png"
                                    alt="Explore your city"
                                    width={150}
                                    height={150}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-xl font-semibold">{t('about.tab7')}</h3>
                            <p className="mt-2 text-gray-600 ">
                                {t('about.tab8')}
                            </p>
                        </div>

                        {/* Build your career */}
                        <div className="flex flex-col items-center">
                            <div className='h-[150px] mb-5'>
                                <Image
                                    src="/assets/images/about/career.png"
                                    alt="Build your career"
                                    width={150}
                                    height={150}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-xl font-semibold">{t('about.tab9')}</h3>
                            <p className="mt-2 text-gray-600 ">
                                {t('about.tab10')}
                            </p>
                        </div>

                        {/* Get creative */}
                        <div className="flex flex-col items-center">
                            <div className='h-[150px] mb-5'>
                                <Image
                                    src="/assets/images/about/creative.png"
                                    alt="Get creative"
                                    width={150}
                                    height={150}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-xl font-semibold">{t('about.tab11')}</h3>
                            <p className="mt-2 text-gray-600 ">
                                {t('about.tab12')}
                            </p>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        {/* First Stat */}
                        <div className="bg-gradient-to-b from-[#0eac51] to-[#010e07] rounded-xl py-7 md:py-3 lg:py-7 pl-10 md:pl-3 lg:pl-10 flex items-center space-x-4 text-white shadow-lg">
                            <div className="">
                                <Image src="/assets/images/about/calendar.png" width={72} height={72} alt="Stat icon" className="text-green-500" />
                            </div>
                            <div className='text-left'>
                                <h2 className=" text-3xl md:text-2xl lg:text-4xl font-bold text-white">100000+</h2>
                                <p className="text-sm sm:text-xs md:text-sm">{t('about.tab13')}</p>
                            </div>
                        </div>

                        {/* Second Stat */}
                        <div className="bg-gradient-to-b from-[#b80063] to-[#010e07] rounded-xl py-7 md:py-3 lg:py-7 pl-10 md:pl-3 lg:pl-10 flex items-center space-x-4 text-white shadow-lg">
                            <div className="">
                                <Image src="/assets/images/x_F_logo.png" width={120} height={40} alt="Zuroona Logo" className="object-contain" />
                            </div>
                            <div className='text-left'>
                                <h2 className=" text-3xl md:text-2xl lg:text-4xl font-bold text-white">100000+</h2>
                                <p className="text-sm sm:text-xs md:text-sm">{t('about.tab14')}</p>
                            </div>
                        </div>
                        {/* Third Stat */}
                        <div className="bg-gradient-to-b from-[#e6750c] to-[#010e07] rounded-xl py-7 md:py-3 lg:py-7 pl-10 md:pl-3 lg:pl-10 flex items-center space-x-4 text-white shadow-lg">
                            <div className="">
                                <Image src="/assets/images/about/users-icon.png" width={70} height={70} alt="Stat icon" className="text-green-500" />
                            </div>
                            <div className='text-left'>
                                <h2 className=" text-2xl md:text-1xl lg:text-3xl font-bold text-white">{t('about.tab16')}</h2>
                                <p className="text-sm sm:text-xs md:text-sm">{t('about.tab15')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className='bg-[#fff6f7]'>
                <Image src="/assets/images/about/img-footer.png" height={100} width={1600} alt='' />
            </div>
        </>
    );
}
