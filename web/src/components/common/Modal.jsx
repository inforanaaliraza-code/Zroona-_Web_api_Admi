import { useEffect } from 'react';

const Modal = ({ isOpen, onClose, children, width = "lg" }) => {
    useEffect(() => {
        if (typeof document === "undefined" || !document.body) {
            return;
        }
        
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            // Safely restore overflow on cleanup
            if (typeof document !== "undefined" && document.body && document.body.parentNode) {
                try {
                    document.body.style.overflow = 'auto';
                } catch (error) {
                    // Silently handle errors during unmount
                    console.warn("Modal: Error restoring body overflow", error);
                }
            }
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // Map width prop to Tailwind classes
    const widthClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        "2xl": "max-w-6xl",
        full: "max-w-full"
    };

    const modalWidth = widthClasses[width] || widthClasses.lg;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[10000] px-2 py-4 md:py-10 overflow-y-auto">
            <div className={`bg-white rounded-2xl shadow-2xl ${modalWidth} w-full relative my-auto max-h-[95vh] flex flex-col`}>
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-50 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
                >
                    <img
                        src="/assets/images/login/close.png"
                        alt="Close"
                        className="w-5 h-5"
                    />
                </button>
                <div className="overflow-y-auto flex-1 px-4 md:px-6 py-4 md:py-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
