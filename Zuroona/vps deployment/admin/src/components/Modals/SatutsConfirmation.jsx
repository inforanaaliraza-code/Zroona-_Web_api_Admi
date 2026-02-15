import React from 'react';

const StatusConfirmation = ({ isOpen, onClose, onConfirm, organizer }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[10000]">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-lg font-semibold text-gray-900">Confirm Status</h2>
                <p className="text-sm text-gray-800">
                    Are you sure you want to {organizer.is_Active ? 'Inactive' : 'Active'} {organizer.first_name} {organizer.last_name}?
                </p>
                <div className="flex justify-center  space-x-3 mt-5">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg text-gray-900">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-[#a797cc] text-white rounded-lg hover:bg-[#a08ec8] transition">{organizer.is_Active ? 'Inactive' : 'Active'}</button>
                </div>
            </div>
        </div>
    );
};

export default StatusConfirmation;
