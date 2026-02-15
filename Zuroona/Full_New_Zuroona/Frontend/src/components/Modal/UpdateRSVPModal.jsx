"use client"

import Image from 'next/image';
import TicketCard from '../ui/TicketCard';
import Modal from '../common/Modal';
import { useState } from 'react';
import Link from 'next/link';

const UpdateRSVPModal = ({ isOpen, onClose }) => {
    const [count, setCount] = useState(1);

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

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            {/* Ticket Information */}
            <div className="flex justify-center mb-8">
                <TicketCard />
            </div>

            {/* Review Form */}
            <h2 className="text-2xl font-semibold text-center mb-2">Update Your RSVP</h2>

            {/* Form */}
            <div className="mt-6 md:px-12">
                <form>
                    <div className="bg-white rounded-2xl shadow-xl w-full py-6">
                        {/* Content Card */}
                        <div className="flex items-center flex-col">
                            <div className="flex items-center space-x-2 border-b-2 w-full px-5 pb-5">
                                <Image src="/assets/images/icons/double-user.png" alt="User Icon" width={35} height={21} />
                                <span className="text-gray-800 font-semibold text-base">
                                    Are you bringing anyone?
                                </span>
                            </div>

                            {/* Counter Section */}
                            <div className='flex justify-between items-center w-full px-5 pt-5'>
                                <div className="flex items-center space-x-3">
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
                                <Link href="/payment" className="bg-[#a797cc] text-white text-sm font-medium px-6 py-3 rounded-xl transition">
                                    Update
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
                <div className='mt-10'>
                    <h4 className='text-sm font-semibold'>Attendess</h4>
                    <p className='text-sm text-gray-800'>Current response: You&lsquo;re going</p>
                </div>
            </div>
        </Modal>
    );
};

export default UpdateRSVPModal;
