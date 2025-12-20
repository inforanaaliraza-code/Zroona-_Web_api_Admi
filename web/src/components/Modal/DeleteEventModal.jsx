"use client"

import Image from 'next/image';
import Modal from '../common/Modal';
import { useTranslation } from 'react-i18next';

const DeleteEventModal = ({ show, onConfirm, onCancel }) => {
    const { t } = useTranslation();
    return (
        <Modal isOpen={show} onClose={onCancel} width="lg">
            <div className="flex justify-center mt-10 mb-3">
                <Image
                    src="/assets/images/home/delete.png" // Replace this with the delete icon image
                    alt="Delete Icon"
                    width={86}
                    height={83}
                />
            </div>

            {/* Title */}
            <h2 className="text-center text-xl font-semibold text-[#a797cc] mb-2">
                {t('delete.tab1') || 'Delete Event'}
            </h2>

            {/* Description */}
            <p className="text-center text-gray-900 text-sm mb-10">
                {t('delete.tab2') || 'Are you sure you want to delete this event?'}
                <br />
                {t('delete.tab3') || 'This action cannot be undone.'}
            </p>

            {/* Buttons */}
            <div className="flex justify-center gap-4 px-5 sm:px-10">
                <button
                    onClick={onCancel}
                    className="w-full bg-transparent border font-semibold border-[#a797cc] text-[#a797cc] py-2 px-6 rounded-lg hover:bg-orange-50 transition"
                >
                    {t('delete.tab4') || 'Cancel'}
                </button>
                <button
                    onClick={onConfirm}
                    className="w-full bg-[#a797cc] font-semibold text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition"
                >
                    {t('delete.tab5') || 'Delete'}
                </button>
            </div>
        </Modal>
    );
};

export default DeleteEventModal;
