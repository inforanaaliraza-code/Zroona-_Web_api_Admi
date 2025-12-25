import { useState } from 'react';
import Modal from '../common/Modal';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { WithdrawalApi } from '@/app/api/setting';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { getWithdrawalList } from '@/redux/slices/WithdrawalList';
import { getEarning } from '@/redux/slices/Earning';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import Loader from '../Loader/Loader';
import { Icon } from '@iconify/react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const WithdrawModal = ({ isOpen, onClose, data, page, limit }) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const availableBalance = data?.total_earnings || 0;
    const minWithdrawal = 50; // Minimum withdrawal amount
    const maxWithdrawal = availableBalance;

    const formik = useFormik({
        initialValues: {
            amount: "",
        },
        validationSchema: Yup.object({
            amount: Yup.number()
                .required(t("earning.tab9") || "Amount is required")
                .min(minWithdrawal, `Minimum withdrawal amount is ${minWithdrawal} SAR`)
                .max(maxWithdrawal, `Maximum withdrawal amount is ${maxWithdrawal} SAR`),
        }),
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            if (!showConfirm) {
                setShowConfirm(true);
                return;
            }

            setLoading(true);
            WithdrawalApi(values)
                .then((response) => {
                    setLoading(false);
                    if (response?.status === 1) {
                        toast.success(response.message || "Withdrawal request submitted successfully!");
                        onClose(); 
                        dispatch(getWithdrawalList({ page: page, limit: limit }));
                        dispatch(getEarning({ page: 1 })); // Refresh balance
                        resetForm();
                        setShowConfirm(false);
                    } else {
                        toast.error(response.message || "Failed to submit withdrawal request");
                        setShowConfirm(false);
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    toast.error(t("error.submitFailed") || "Failed to submit the request");
                    setShowConfirm(false);
                });
        },
    });

    const handleClose = () => {
        formik.resetForm();
        setShowConfirm(false);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} width="lg">
            {!showConfirm ? (
                <>
                    {/* Top Section - Balance Card */}
                    <div className='px-8 md:px-14 mt-10'>
                        <div className="relative flex flex-col items-center bg-gradient-to-br from-[#a3cc69] via-[#a797cc] to-[#b0a0df] text-white rounded-2xl p-8 pt-12 shadow-2xl">
                            {/* Icon */}
                            <div className="absolute -top-10 w-20 h-20 rounded-full bg-white p-3 shadow-xl">
                                <Image
                                    src="/assets/images/icons/withdrawal.png"
                                    alt="Wallet Icon"
                                    width={60}
                                    height={60}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            
                            {/* Balance */}
                            <p className="mt-4 font-semibold text-sm opacity-90">{t('earning.tab5') || 'Available Balance'}</p>
                            <h2 className="text-5xl font-bold text-white mb-2">{availableBalance}</h2>
                            <p className="text-lg font-medium opacity-90">{t('card.tab2') || 'SAR'}</p>

                            {/* Info Badge */}
                            <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                                <p className="text-sm font-medium">Minimum: {minWithdrawal} SAR</p>
                            </div>
                        </div>
                    </div>

                    {/* Input Section */}
                    <form className="mt-8 px-8 md:px-12" onSubmit={formik.handleSubmit}>
                        <label htmlFor="amount" className="block text-base font-bold text-gray-800 mb-3">
                            {t('earning.tab6') || 'Withdrawal Amount'}
                        </label>
                        
                        <div className="relative">
                            <div className={`absolute flex items-center ${i18n.language === "ar"
                                ? "inset-y-0 right-0 pr-4"
                                : "inset-y-0 left-0 pl-4"
                                }`}>
                                <Icon
                                    icon="mdi:currency-usd"
                                    className="w-6 h-6 text-[#a797cc]"
                                />
                            </div>
                            <input
                                type="number"
                                id="amount"
                                placeholder={t('earning.tab8') || 'Enter amount'}
                                {...formik.getFieldProps('amount')}
                                className={`w-full ${i18n.language === "ar" ? "pr-12" : "pl-12"
                                    } py-4 px-4 border-2 bg-white border-gray-300 rounded-xl focus:outline-none focus:border-[#a3cc69] focus:ring-4 focus:ring-[#a3cc69]/20 text-black text-lg font-semibold placeholder:text-gray-400 placeholder:text-base placeholder:font-normal transition-all`}
                            />
                        </div>

                        {/* Error Message */}
                        {formik.touched.amount && formik.errors.amount && (
                            <div className="mt-3 bg-red-50 border-l-4 border-red-500 rounded-lg p-3 flex items-start gap-2">
                                <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
                                <p className="text-red-700 text-sm font-medium">
                                    {formik.errors.amount}
                                </p>
                            </div>
                        )}

                        {/* Quick Amount Buttons */}
                        <div className="mt-4 grid grid-cols-4 gap-2">
                            {[100, 250, 500, 1000].map((amount) => (
                                <button
                                    key={amount}
                                    type="button"
                                    onClick={() => formik.setFieldValue('amount', amount)}
                                    disabled={amount > availableBalance}
                                    className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                                        amount > availableBalance
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-[#a3cc69]/10 to-[#a797cc]/10 text-gray-700 hover:from-[#a3cc69]/20 hover:to-[#a797cc]/20 border-2 border-transparent hover:border-[#a3cc69]'
                                    }`}
                                >
                                    {amount}
                                </button>
                            ))}
                        </div>

                        {/* Info Box */}
                        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <FaInfoCircle className="text-blue-500 text-xl mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-blue-900">
                                    <p className="font-semibold mb-1">Important Information:</p>
                                    <ul className="space-y-1 text-blue-800">
                                        <li>• Minimum withdrawal: {minWithdrawal} SAR</li>
                                        <li>• Processing time: 3-5 business days</li>
                                        <li>• Amount will be transferred to your registered bank account</li>
                                        <li>• You'll receive a notification once processed</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className='flex justify-center mt-8'>
                            <button
                                type="submit"
                                className="py-4 px-20 text-white bg-gradient-to-r from-[#a3cc69] to-[#a797cc] rounded-xl text-lg font-bold hover:from-[#9fb68b] hover:to-[#a08ec8] transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                disabled={loading || !formik.values.amount || formik.errors.amount}
                            >
                                {loading ? <Loader color="#fff" height="25" /> : (t('earning.tab7') || 'Submit Request')}
                            </button>
                        </div>
                    </form>
                </>
            ) : (
                // Confirmation Screen
                <div className="px-8 md:px-14 py-12">
                    <div className="text-center">
                        {/* Success Icon */}
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#a3cc69] to-[#a797cc] rounded-full flex items-center justify-center shadow-2xl mb-6">
                            <FaCheckCircle className="text-white text-5xl" />
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Confirm Withdrawal</h2>
                        <p className="text-gray-600 mb-8">Please confirm your withdrawal request details</p>

                        {/* Amount Display */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 mb-8">
                            <p className="text-gray-600 text-sm font-medium mb-2">Withdrawal Amount</p>
                            <p className="text-5xl font-bold text-[#a3cc69] mb-2">{formik.values.amount}</p>
                            <p className="text-gray-600 font-medium">SAR</p>
                        </div>

                        {/* Info */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
                            <p className="text-yellow-800 text-sm font-medium">
                                ⚠️ Your wallet balance will be set to 0 after submitting this request.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setShowConfirm(false)}
                                disabled={loading}
                                className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition disabled:opacity-50"
                            >
                                Go Back
                            </button>
                            <button
                                type="button"
                                onClick={formik.handleSubmit}
                                disabled={loading}
                                className="flex-1 py-4 px-6 bg-gradient-to-r from-[#a3cc69] to-[#a797cc] text-white rounded-xl font-bold hover:from-[#9fb68b] hover:to-[#a08ec8] transition shadow-lg disabled:opacity-50"
                            >
                                {loading ? <Loader color="#fff" height="25" /> : 'Confirm & Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default WithdrawModal;
