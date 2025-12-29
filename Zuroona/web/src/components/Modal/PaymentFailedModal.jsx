"use client";

import Image from 'next/image';
import Modal from '../common/Modal';
import Link from 'next/link';

const PaymentFailedModal = ({ isOpen, onClose }) => {

    return (
        <Modal isOpen={isOpen} onClose={onClose} width="lg">
            <div className="pb-5 text-center">
                <div className="flex justify-center mb-4">
                    <div className="p-4">
                        <Image
                            src="/assets/images/home/failed-img.png"
                            alt="approve-img"
                            width={170}
                            height={50}
                            className="object-cover"
                        />
                    </div>
                </div>
                <div className='mb-10 px-16'>
                    <h2 className="text-xl font-semibold text-orange-500 mb-2">
                        Payment Failed
                    </h2>
                    <p className="text-gray-700">
                        Sorry! Your Payment was not sucessful. Please try again or contact support if the problem continues.
                    </p>
                </div>
                <div className='flex flex-col gap-y-4 justify-center items-center'>
                    <Link href="/myEvents" className="w-fit bg-orange-500 text-white py-4 px-20 rounded-lg hover:bg-orange-600 transition">
                        Retry
                    </Link>
                    <Link href="/myEvents" className="underline text-orange-500 hover:text-orange-600 transition">
                        Cancel
                    </Link>
                </div>
            </div>
        </Modal>
    );
};

export default PaymentFailedModal;
