"use client"

import Modal from '../common/Modal';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';

const DeleteEventModal = ({ show, onConfirm, onCancel }) => {
    const { t } = useTranslation();
    return (
        <Modal isOpen={show} onClose={onCancel} width="md">
            <div className="relative overflow-hidden rounded-2xl">
                {/* Decorative Background - Website Colors */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-[#a797cc] via-[#9688b8] to-[#8ba179]"></div>
                <div className="absolute top-0 left-0 right-0 h-32 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMSIgY3g9IjIwIiBjeT0iMjAiIHI9IjMiLz48L2c+PC9zdmc+')] opacity-30"></div>
                
                {/* Content */}
                <div className="relative pt-8 pb-6 px-6">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-[#a797cc] rounded-full blur-xl opacity-50 animate-pulse"></div>
                            {/* Icon Container */}
                            <div className="relative w-20 h-20 bg-white rounded-2xl shadow-2xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-300">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#a797cc] to-[#8ba179] rounded-xl flex items-center justify-center shadow-lg">
                                    <Icon icon="lucide:trash-2" className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            {/* Warning Badge */}
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                <Icon icon="lucide:alert-triangle" className="w-4 h-4 text-amber-900" />
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-center text-2xl font-bold text-gray-900 mb-3">
                        {t('delete.tab1') || 'Delete Event'}
                    </h2>

                    {/* Description */}
                    <div className="text-center mb-6">
                        <p className="text-gray-600 text-base mb-3">
                            {t('delete.tab2') || 'Are you sure you want to delete this event?'}
                        </p>
                        {/* Warning Box - Website Colors */}
                        <div className="bg-purple-50 border border-[#a797cc]/30 rounded-xl p-4 mx-auto max-w-sm">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                    <Icon icon="lucide:alert-circle" className="w-5 h-5 text-[#a797cc] mt-0.5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-gray-800 mb-1">Warning</p>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        {t('delete.tab3') || 'This action cannot be undone. All bookings and data associated with this event will be permanently deleted.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 px-2">
                        <button
                            onClick={onCancel}
                            className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-200 font-semibold text-gray-700 py-3.5 px-6 rounded-xl hover:bg-gray-50 hover:border-[#a797cc]/50 transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                            <Icon icon="lucide:x" className="w-5 h-5" />
                            {t('delete.tab4') || 'Cancel'}
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#a797cc] to-[#8ba179] font-semibold text-white py-3.5 px-6 rounded-xl hover:from-[#9688b8] hover:to-[#7a9168] transition-all duration-300 shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 hover:scale-105"
                        >
                            <Icon icon="lucide:trash-2" className="w-5 h-5" />
                            {t('delete.tab5') || 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteEventModal;
