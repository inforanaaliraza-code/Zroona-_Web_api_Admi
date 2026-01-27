import Image from 'next/image';
import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[10000]">
            <div className="bg-white p-6 rounded-[15px] shadow-lg max-w-sm w-full">
                <div className="flex justify-end">
                    <button onClick={onClose}>
                        <Image src="/images/cross.png" alt="Close" width={20} height={20} />
                    </button>
                </div>
                <div className="text-lg font-semibold mb-4">{title}</div>
                {children}
            </div>
        </div>
    );
};

export default Modal;
