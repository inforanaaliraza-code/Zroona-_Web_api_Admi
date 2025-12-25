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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[10000] px-2 py-4 md:py-10 overflow-y-auto animate-fadeIn">
            <div className={`bg-white rounded-2xl shadow-2xl ${modalWidth} w-full relative my-auto max-h-[95vh] flex flex-col animate-slideUp`}>
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-50 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all duration-300 hover:scale-110 hover:rotate-90"
                    aria-label="Close modal"
                >
                    <img
                        src="/assets/images/login/close.png"
                        alt="Close"
                        className="w-5 h-5"
                    />
                </button>
                <div className="overflow-y-auto flex-1">
                    {children}
                </div>
            </div>
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default Modal;
