import React from 'react';
import { useTranslation } from 'react-i18next';

const StatusConfirmation = ({ isOpen, onClose, onConfirm, organizer }) => {
    const { t } = useTranslation();
    if (!isOpen || !organizer) return null;

    const isActive = organizer.isActive === 1 || organizer.is_Active === true;
    const actionKey = isActive ? 'organizers.inactive' : 'organizers.active';
    const name = [organizer.first_name, organizer.last_name].filter(Boolean).join(' ') || '';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[10000]">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-lg font-semibold text-gray-900">{t('organizers.confirmStatus')}</h2>
                <p className="text-sm text-gray-800">
                    {t('organizers.confirmStatusMessage', { action: t(actionKey), name })}
                </p>
                <div className="flex justify-center space-x-3 mt-5">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg text-gray-900">{t('common.cancel')}</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-[#a797cc] text-white rounded-lg hover:bg-[#a08ec8] transition">{t(actionKey)}</button>
                </div>
            </div>
        </div>
    );
};

export default StatusConfirmation;
