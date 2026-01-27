import Image from 'next/image';
import React, { useState } from 'react';
import AddReviewModal from '../Modal/AddReviewModal';
import ReactStars from "react-rating-stars-component";
import { useTranslation } from 'react-i18next';

const ReviewSection = ({ id, data, reviewData }) => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className='w-full lg:w-1/2'>
            <div className='flex flex-wrap items-center gap-3 justify-between'>
                <h2 className="text-2xl font-semibold mb-4">{t('detail.tab24')}</h2>
                <button className="text-[#a797cc] font-semibold flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
                    <Image src="/assets/images/icons/add-review.png" alt="Add Review" width={20} height={20} />
                    {t('detail.tab25')}
                </button>
            </div>
            {reviewData?.map((review, index) => (
                <div className="bg-white shadow-xl rounded-lg p-5 pb-6 py-5 mb-6" key={index}>
                    <div className="flex items-start justify-between mb-4">
                        <div className='flex items-center gap-x-2'>
                            <div className='w-[46px] h-[46px] rounded-full overflow-hidden'>
                                <Image
                                    src={review?.profile_image}
                                    alt="Reviewer"
                                    height={46}
                                    width={46}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold">{review?.first_name} {review?.last_name}</h3>
                            </div>
                        </div>
                        <div className="flex items-center">
                            {/* Star Rating */}
                            <ReactStars
                                count={5}
                                size={25}
                                activeColor="#a797cc"
                                value={review?.rating || 0}
                                // Disable hover effect
                                onMouseEnter={() => {}}
                                onMouseLeave={() => {}}
                                edit={false} // Set to false to disable editing if you want to show a static star rating
                            />
                        </div>
                    </div>
                    <p className="text-gray-700 max-w-lg">
                        {review?.description}
                    </p>
                </div>
            ))}
            <AddReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} eventId={id} eventdata={data} />
        </div>
    );
};

export default ReviewSection;
