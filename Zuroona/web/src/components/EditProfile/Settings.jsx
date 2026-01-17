"use client";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import Loader from "../Loader/Loader";
import { OrganizerEditProfileApi, DeactivateOrganizerApi } from "@/app/api/setting";
import { useDataStore } from "@/app/api/store/store";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getProfile } from "@/redux/slices/profileInfo";
import * as Yup from "yup";
import Modal from "../common/Modal";

export default function Settings({ title, buttonText }) {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
    const dispatch = useDispatch();

    const detail = useDataStore((store) => store.ProfileDetail);
    const { fetchProfileDetail } = useDataStore();

    useEffect(() => {
        fetchProfileDetail().then(() => { });
    }, []);

    const formik = useFormik({
        initialValues: {
            max_event_capacity: detail?.user?.max_event_capacity || 100,
        },
        validationSchema: Yup.object({
            max_event_capacity: Yup.number()
                .min(1, "Max event capacity must be at least 1")
                .max(1000, "Max event capacity cannot exceed 1000")
                .required("Max event capacity is required")
                .integer("Max event capacity must be a whole number")
                .positive("Max event capacity must be a positive number"),
        }),
        enableReinitialize: true,
        onSubmit: (values) => {
            setLoading(true);
            const payload = {
                max_event_capacity: values.max_event_capacity,
            };

            OrganizerEditProfileApi(payload)
                .then((res) => {
                    setLoading(false);
                    if (res.status === 1) {
                        toast.success(res.message || t('Saved') || "Settings saved successfully");
                        dispatch(getProfile());
                    } else {
                        toast.error(res.message || "Failed to save settings");
                    }
                })
                .catch((e) => {
                    setLoading(false);
                    toast.error("An error occurred.");
                });
        },
    });

    const handleDeactivate = () => {
        setShowDeactivateConfirm(true);
    };

    const confirmDeactivate = async () => {
        setLoading(true);
        try {
            const response = await DeactivateOrganizerApi({});
            if (response?.status === 1) {
                toast.success(response.message || t('settings.deactivateSuccess') || "Account deactivated successfully");
                setShowDeactivateConfirm(false);
                // Optionally logout user after deactivation
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            } else {
                toast.error(response?.message || "Failed to deactivate account");
            }
        } catch (error) {
            console.error("Error deactivating account:", error);
            toast.error("An error occurred while deactivating your account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex-grow bg-white h-max p-7 rounded-xl">
                <h2 className="text-2xl font-semibold mb-6">{title || t('Settings') || 'Settings'}</h2>

                {/* Max Event Capacity - Hidden */}
                {/* 
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        {t('Max Event Capacity') || 'Max Event Capacity'} <span className="text-red-500">*</span>
                    </label>
                   
                    <div className="relative">
                        <span className={`absolute flex items-center ${i18n.language === "ar"
                            ? "inset-y-0 right-0 pr-3"
                            : "inset-y-0 left-0 pl-3"
                        }`}>
                            <Icon icon="lucide:users" className="w-5 h-5 text-[#a797cc]" />
                        </span>
                        <input
                            type="number"
                            id="max_event_capacity"
                            min="1"
                            max="1000"
                            className={`w-full ${i18n.language === "ar" ? "pr-12" : "pl-12"
                                } py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a797cc] text-black placeholder:text-sm`}
                            value={formik.values.max_event_capacity}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    {formik.touched.max_event_capacity && formik.errors.max_event_capacity ? (
                        <p className="text-red-500 text-xs mt-1 font-semibold">
                            {formik.errors.max_event_capacity}
                        </p>
                    ) : null}
                </div>
                */}

                {/* Info message */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-start gap-3">
                        <Icon icon="lucide:info" className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-blue-800 font-medium">
                                {t('settings.capacityInfo') || 'Event Capacity Settings'}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                                {t('settings.capacityInfoDesc') || 'Event capacity is now managed individually for each event you create. You can set specific capacity limits when creating or editing events.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Submit Button - Hidden since there's no field to save */}
                {/* 
                <div className="mt-10 px-10">
                    <button 
                        type="button"
                        onClick={formik.handleSubmit}
                        className="w-full py-4 bg-[#a797cc] text-white font-semibold rounded-xl hover:bg-[#8ba179] transition-colors disabled:opacity-50" 
                        disabled={loading}
                    >
                        {loading ? <Loader color="#fff" height="30" /> : buttonText || t('Save') || 'Save Settings'}
                    </button>
                </div>
                */}

                {/* Deactivate Account Section */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {t('Danger Zone') || 'Danger Zone'}
                    </h3>
                 
                    <button
                        type="button"
                        onClick={handleDeactivate}
                        className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
                    >
                        Deactivate Account
                    </button>
                </div>
            </div>

            {/* Deactivate Confirmation Modal */}
            {showDeactivateConfirm && (
                <Modal isOpen={showDeactivateConfirm} onClose={() => setShowDeactivateConfirm(false)} width="md">
                    <div className="p-6 text-center">
                        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <Icon icon="lucide:alert-triangle" className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {t('settings.confirmDeactivate') || 'Are you sure you want to deactivate your account?'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {t('settings.deactivateWarning') || 'This action will disable all your events and prevent you from creating new ones. You can reactivate your account later by contacting support.'}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeactivateConfirm(false)}
                                className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                            >
                                {t('common.cancel') || 'Cancel'}
                            </button>
                            <button
                                onClick={confirmDeactivate}
                                className="flex-1 py-3 px-6 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                            >
                                {t('settings.confirmDeactivate') || 'Yes, Deactivate'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
}

