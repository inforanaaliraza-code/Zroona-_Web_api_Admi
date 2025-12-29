"use client";

import Image from 'next/image';
import TicketCard from '../ui/TicketCard';
import Modal from '../common/Modal';
import { useState } from 'react';
import Link from 'next/link';
import { useFormik } from 'formik';
import { AddBookNowApi } from '@/app/api/setting';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Loader from '../Loader/Loader';
import { useTranslation } from 'react-i18next';

const AddBookModal = ({ isOpen, onClose, eventId, eventData }) => {
    const { t } = useTranslation();
    const { push } = useRouter();
    const [count, setCount] = useState(1);
    const [loading, setLoading] = useState(false);

    // Function to increment count
    const increment = (e) => {
        e.preventDefault();
        setCount(prevCount => prevCount + 1);
    };

    const decrement = (e) => {
        e.preventDefault();
        if (count > 1) {
            setCount(prevCount => prevCount - 1);
        }
    };
    
    const formik = useFormik({
        initialValues: {
            event_id: eventId,
            no_of_attendees: count,
        },
        enableReinitialize: true, // Reinitialize form when count changes
        onSubmit: async (values) => {
            setLoading(true);
            const payload = {
                ...values,
                no_of_attendees: count, // Include the updated count
            };

            try {
                const data = await AddBookNowApi(payload);
                setLoading(false);
                if (data?.status === 1) {
                    toast.success(data.message);
                    push('/myEvents'); // Navigate to payment page on success
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                setLoading(false);
                toast.error("Something went wrong. Please try again.");
            }
        },
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose} width="xl">
            {/* Ticket Information */}
            <div className="flex justify-center mb-8">
                <TicketCard data={eventData} />
            </div>

            {/* Review Form */}
            <h2 className="text-2xl font-semibold text-center mb-2">{t('add.tab19')}</h2>

            {/* Form */}
            <div className="my-6 md:px-12">
                <form onSubmit={formik.handleSubmit}>
                    <div className="bg-white rounded-2xl shadow-xl w-full py-6">
                        {/* Content Card */}
                        <div className="flex items-center flex-col">
                            <div className="flex items-center space-x-2 border-b-2 w-full px-5 pb-5">
                                <Image src="/assets/images/icons/double-user.png" alt="User Icon" width={35} height={21} />
                                <span className="text-gray-800 font-semibold text-base">
                                   {t('add.tab20')}
                                </span>
                            </div>

                            {/* Counter Section */}
                            <div className='flex justify-between items-center w-full px-5 pt-5'>
                                <div className="flex items-center gap-x-3">
                                    <button
                                        onClick={decrement}
                                        className="focus:outline-none"
                                    >
                                        <Image src="/assets/images/icons/minus-icon.png" alt="Minus Icon" width={29} height={29} />
                                    </button>
                                    <span className="text-gray-700 text-lg">{count}</span>
                                    <button
                                        onClick={increment}
                                        className="focus:outline-none"
                                    >
                                        <Image src="/assets/images/icons/plus-icon.png" alt="Plus Icon" width={29} height={29} />
                                    </button>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="bg-[#a797cc] text-white text-sm font-medium px-6 py-3 rounded-xl transition"
                                    disabled={loading}
                                >
                                    {loading ? <Loader color="#fff" height="25"/> : t('add.tab18')}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default AddBookModal;
