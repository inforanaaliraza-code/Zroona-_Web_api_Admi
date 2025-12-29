"use client";

import Image from "next/image";
import Modal from "../common/Modal";
import { useRouter } from "next/navigation";

const PaymentStatusModal = ({ isOpen, onClose, status, BookingListId }) => {
    const router = useRouter();

    const renderContent = () => {
        switch (status) {
            case "paid":
                return {
                    title: "Payment Successfully!",
                    message: "Thank you for event booking",
                    image: "/assets/images/home/approve-img.png",
                    alt: "approve-img",
                    bookingId: BookingListId,
                    buttonLabel: "Go to Home",
                    href: "/myEvents",
                };
            case "failed":
                return {
                    title: "Payment Failed",
                    message: "Sorry! Your Payment was not sucessful. Please try again or contact support if the problem continues.",
                    image: "/assets/images/home/failed-img.png",
                    alt: "failed-img",
                    buttonLabel2: "Retry",
                    buttonLable3: "Cancel",
                    href: "/payment",
                };
            default:
                return null;
        }
    };

    const content = renderContent();

    if (!content) return null;

    const handleRetryClick = () => {
        if (BookingListId) {
            router.push(`/payment?id=${BookingListId}`);
            onClose();
        }
    };

    console.log(handleRetryClick, "handleRetryClick");

    const handleGoToHomeClick = () => {
        onClose();
        router.push("/myEvents");
        router.replace("/myEvents"); 
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} width="lg">
            <div className="pb-5 text-center">
                <div className="flex justify-center mb-4">
                    <div className="p-4">
                        <Image
                            src={content.image}
                            alt={content.alt}
                            width={170}
                            height={100}
                            className="object-contain"
                        />
                    </div>
                </div>
                <div className="px-16">
                    <h2 className="text-xl font-semibold text-orange-500 mb-2">
                        {content.title}
                    </h2>
                    <p className="text-gray-700">{content.message} </p>
                    {content.bookingId && (
                        <p className="text-gray-700">
                            Your booking ID is : <br />
                            <span className="text-black font-semibold text-lg ">
                                {content.bookingId}
                            </span>
                        </p>

                    )}
                </div>
                <div className="mt-10 flex flex-col items-center gap-y-4">
                    {content.buttonLabel && (
                        <button
                            onClick={handleGoToHomeClick}
                            className="bg-orange-500 w-fit text-white py-3 px-20 rounded-lg hover:bg-orange-600 transition"
                        >
                            {content.buttonLabel}
                        </button>
                    )}
                    {content.buttonLabel2 && (
                        <button
                            onClick={handleRetryClick}
                            className="bg-orange-500 w-fit text-white py-3 px-20 rounded-lg hover:bg-orange-600 transition"
                        >
                            {content.buttonLabel2}
                        </button>
                    )}
                    <button
                        onClick={handleGoToHomeClick}
                        className="underline text-orange-500 hover:text-orange-600 transition"
                    >
                        {content.buttonLable3}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default PaymentStatusModal;
