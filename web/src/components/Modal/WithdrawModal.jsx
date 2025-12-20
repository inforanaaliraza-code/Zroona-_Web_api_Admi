import { useState } from 'react';
import Modal from '../common/Modal';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { WithdrawalApi } from '@/app/api/setting';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { getWithdrawalList } from '@/redux/slices/WithdrawalList';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import Loader from '../Loader/Loader';
import { Icon } from '@iconify/react';

const WithdrawModal = ({ isOpen, onClose, data, page, limit }) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            amount: "",
        },
        validationSchema: Yup.object({
            amount: Yup.number()
                .required(t("earning.tab9")) // Example: "Amount is required"
                .min(1, t("earning.tab10")), // Example: "Amount must be greater than 0"
        }),
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            setLoading(true);
            WithdrawalApi(values)
                .then((response) => {
                    setLoading(false);
                    if (response?.status === 1) {
                        toast.success(response.message);
                        onClose(); 
                        dispatch(getWithdrawalList({ page: page, limit: limit }));
                        resetForm();
                    } else {
                        toast.error(response.message);
                    }
                })
                .catch(() => {
                    setLoading(false);
                    toast.error(t("error.submitFailed")); // Example: "Failed to submit the request"
                });
        },
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose} width="lg">
            {/* Top Section */}
            <div className='px-14 mt-10'>
                <div className="relative flex flex-col items-center bg-gradient-to-b from-[#a797cc] to-[#8b85b1] text-white rounded-xl p-6 pt-10">
                    <div className="absolute -top-8 w-16 h-16 rounded-full bg-white p-2 shadow-md">
                        <Image
                            src="/assets/images/icons/withdrawal.png"
                            alt="Wallet Icon"
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <p className="mt-3 font-medium text-sm">{t('earning.tab5')}</p>
                    <h2 className="text-3xl font-bold text-white">{data?.total_earnings} {t('card.tab2')}</h2>
                </div>
            </div>

            {/* Input Section */}
            <form className="mt-8 px-8" onSubmit={formik.handleSubmit}>
                <label htmlFor="amount" className="block text-sm font-bold text-gray-800">
                    {t('earning.tab6')}
                </label>
                <div className="relative mt-2">
                    <div className={`absolute flex items-center ${i18n.language === "ar"
                        ? "inset-y-0 right-0 pr-3"
                        : "inset-y-0 left-0 pl-3"
                        }`}>
                        <Icon
                            icon="mdi:currency-usd"
                            className="w-5 h-5 text-[#a797cc]"
                        />
                    </div>
                    <input
                        type="number"
                        id="amount"
                        placeholder={t('earning.tab8')}
                        {...formik.getFieldProps('amount')}
                        className={`w-full ${i18n.language === "ar" ? "pr-10" : "pl-10"
                            } py-4 px-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm`}
                    />
                    {formik.touched.amount && formik.errors.amount && (
                        <p className="text-red-500 text-sm mt-1">
                            {formik.errors.amount}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <div className='flex justify-center'>
                    <button
                        type="submit"
                        className="mt-6 py-3 px-16 text-white bg-[#a797cc] rounded-xl font-semibold hover:bg-[#8b85b1] transition"
                        disabled={loading}
                    >
                        {loading ? <Loader color="#fff" height="25" /> : t('earning.tab7')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default WithdrawModal;
