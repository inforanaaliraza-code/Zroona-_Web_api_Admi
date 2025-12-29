import { useState } from 'react';
import TicketCard from '../ui/TicketCard';
import Modal from '../common/Modal';
import ReactStars from "react-rating-stars-component";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { AddReviewApi } from '@/app/api/review/apis';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { getUserBookingDetail } from '@/redux/slices/UserBookingDetail';

const AddReviewModal = ({ isOpen, onClose, eventId, eventdata }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            event_id: eventId, // Pre-fill the event_id with the passed id
            rating: 0,
            description: "",
        },
        validationSchema: Yup.object({
            rating: Yup.number().required("Rating is required").min(1, "Please provide a rating"),
            description: Yup.string().required("Review description is required"),
        }),
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            setLoading(true);

            // Ensure the event_id is included in the review data
            const reviewData = { ...values, event_id: eventId };

            AddReviewApi(reviewData)
                .then((data) => {
                    setLoading(false);
                    if (data?.status === 1) {
                        toast.success(data.message);
                        onClose(); // Close the modal

                        // Ensure this order for consistency
                        dispatch(getUserBookingDetail({ id: eventId })).then(() => {
                            // Navigate after data is fetched
                            router.replace(`/myEvents/detail?id=${eventId}`);
                        });

                        resetForm();
                    } else {
                        toast.error(data.message);
                    }
                })
                .catch(() => {
                    setLoading(false);
                    toast.error("Failed to submit the review");
                });
        },
    });

    const ratingChanged = (newRating) => {
        formik.setFieldValue('rating', newRating);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} width="xl">
            {/* Ticket Information */}
            <div className="flex justify-center mb-8">
                <TicketCard data={eventdata} />
            </div>

            {/* Review Form */}
            <h2 className="text-2xl font-semibold text-center mb-8">How was your Experience?</h2>
            <p className="text-center text-sm text-gray-800">Your overall ratings</p>

            {/* Star Rating */}
            <div className="flex justify-center mb-6 -mt-2">
                <ReactStars
                    count={5}
                    onChange={ratingChanged}
                    size={50}
                    activeColor="#a797cc"
                    value={formik.values.rating || 0} // Ensure a default value of 0 for rating
                />
                {formik.touched.rating && formik.errors.rating ? (
                    <div className="text-red-500 text-sm">{formik.errors.rating}</div>
                ) : null}
            </div>

            {/* Review Input */}
            <div className="sm:px-8">
                <label className="block text-gray-800 text-sm mb-1">
                    Add Detailed Review
                </label>
                <div className="relative mt-1">
                    <textarea
                        className="w-full p-4 border text-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#a797cc]"
                        rows="4"
                        placeholder="Enter here"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="description"
                    ></textarea>
                    {formik.touched.description && formik.errors.description ? (
                        <div className="text-red-500 text-sm">{formik.errors.description}</div>
                    ) : null}
                </div>
            </div>

            {/* Submit Button */}
            <button
                onClick={formik.handleSubmit}
                type='submit'
                className={`w-full mt-6 py-3 bg-[#a797cc] text-white font-semibold rounded-lg hover:bg-orange-600 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
            >
                {loading ? 'Submitting...' : 'Submit'}
            </button>
        </Modal>
    );
};

export default AddReviewModal;
