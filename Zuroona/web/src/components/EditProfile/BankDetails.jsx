"use client";

import { OrganizerEditProfileApi, OrganizerUpdateProfileApi } from "@/app/api/setting";
import { useDataStore } from "@/app/api/store/store";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import { Icon } from "@iconify/react";
import { useDispatch } from "react-redux";
import { getProfile } from "@/redux/slices/profileInfo";

const BankDetails = ({ title, buttonName, onNext }) => {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const detail = useDataStore((store) => store.ProfileDetail);
    const { fetchProfileDetail } = useDataStore();

    useEffect(() => {
        fetchProfileDetail().then(() => { });
    }, []);

    const formik = useFormik({
        initialValues: {
            account_holder_name: detail?.user?.bank_details?.account_holder_name || "",
            bank_name: detail?.user?.bank_details?.bank_name || "",
            // account_number: detail?.user?.bank_details?.account_number || "",
            // ifsc_code: detail?.user?.bank_details?.ifsc_code || "",
            iban: detail?.user?.bank_details?.iban || ""
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            setLoading(true);
            const payload = {
                account_holder_name: values.account_holder_name || "",
                bank_name: values.bank_name || "",
                iban: values.iban || "",
                // Only include registration_step if we want to trigger that specific logic
                // For profile editing, we don't need it - backend will detect bank fields
            };
            
            console.log("[BANK-DETAILS] Saving bank details payload:", payload);

            OrganizerEditProfileApi(payload)
                .then((res) => {
                    setLoading(false);
                    if (res.status === 1) {
                        toast.success(res.message || "Bank details saved successfully");
                        console.log("[BANK-DETAILS] Save successful, refreshing profile data...");
                        // Refresh profile data from both stores
                        fetchProfileDetail().then((updatedDetail) => {
                            console.log("[BANK-DETAILS] Profile refreshed, updating form values...");
                            console.log("[BANK-DETAILS] Updated bank details:", updatedDetail?.user?.bank_details);
                            // Update form values with fresh data
                            if (updatedDetail?.user?.bank_details) {
                                formik.setValues({
                                    account_holder_name: updatedDetail.user.bank_details.account_holder_name || "",
                                    bank_name: updatedDetail.user.bank_details.bank_name || "",
                                    iban: updatedDetail.user.bank_details.iban || "",
                                });
                            }
                            // Also update Redux store if needed
                            dispatch(getProfile());
                        }).catch((error) => {
                            console.error("[BANK-DETAILS] Error refreshing profile:", error);
                        });
                    } else {
                        toast.error(res.message || "Failed to save bank details");
                        console.error("[BANK-DETAILS] Save failed:", res);
                    }
                })
                .catch((e) => {
                    setLoading(false);
                    toast.error("An error occurred.");
                    console.error("Error saving bank details:", e);
                });
        },
    });

    // Update form values when detail changes (after refresh) - placed after formik initialization
    useEffect(() => {
        if (detail?.user?.bank_details && formik) {
            const bankDetails = detail.user.bank_details;
            // Only update if values are actually different to avoid unnecessary re-renders
            if (formik.values.account_holder_name !== (bankDetails.account_holder_name || "")) {
                formik.setFieldValue('account_holder_name', bankDetails.account_holder_name || "");
            }
            if (formik.values.bank_name !== (bankDetails.bank_name || "")) {
                formik.setFieldValue('bank_name', bankDetails.bank_name || "");
            }
            if (formik.values.iban !== (bankDetails.iban || "")) {
                formik.setFieldValue('iban', bankDetails.iban || "");
            }
        }
    }, [detail?.user?.bank_details]);

    return (
        <div className="flex-grow bg-white h-max p-7 rounded-xl">
            <h2 className="text-2xl font-semibold mb-6">
                {title}
            </h2>

            <form onSubmit={formik.handleSubmit}>
                {/* Account Holder Name Input */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold">
                        {t('signup.tab44')}
                    </label>
                    <div className="relative mt-1">
                        <span className={`absolute  flex items-center ${
                        i18n.language === "ar"
                          ? "inset-y-0 right-0 pr-3"
                          : "inset-y-0 left-0 pl-3"
                      }`}>
                            <Icon
                                icon="lucide:user"
                                className="w-4 h-4 text-[#a797cc]"
                            />
                        </span>
                        <input
                            type="text"
                            name="account_holder_name"
                            placeholder={t('signup.tab49')}
                            value={formik.values.account_holder_name}
                            onChange={formik.handleChange}
                            className={`w-full ${
                        i18n.language === "ar" ? "pr-10" : "pl-10"
                      } py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm`}
                        />
                    </div>
                </div>

                {/* Bank Name Input */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold">
                            {t('signup.tab45')}
                    </label>
                    <div className="relative mt-1">
                        <span className={`absolute  flex items-center ${
                        i18n.language === "ar"
                          ? "inset-y-0 right-0 pr-3"
                          : "inset-y-0 left-0 pl-3"
                      }`}>
                            <Icon
                                icon="mdi:bank-outline"
                                className="w-4 h-4 text-[#a797cc]"
                            />
                        </span>
                        <input
                            type="text"
                            name="bank_name"
                            placeholder={t('signup.tab50')}
                            value={formik.values.bank_name}
                            onChange={formik.handleChange}
                            className={`w-full ${
                        i18n.language === "ar" ? "pr-10" : "pl-10"
                      } py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm`}
                        />
                    </div>
                </div>

                {/* Account Number Input */}
                {/* <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold">
                        Account Number
                    </label>
                    <div className="relative mt-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Image
                                src="/assets/images/icons/accounting.png"
                                height={15}
                                width={13}
                                alt=""
                            />
                        </span>
                        <input
                            type="text"
                            name="account_number"
                            placeholder="Enter your account number"
                            value={formik.values.account_number}
                            onChange={formik.handleChange}
                            className={`w-full ${
                        i18n.language === "ar" ? "pr-10" : "pl-10"
                      } py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm`}
                        />
                    </div>
                </div> */}

                {/* IFSC Code Input */}
                {/* <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold">
                        IFSC Code
                    </label>
                    <div className="relative mt-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Image
                                src="/assets/images/icons/ifsc.png"
                                height={14}
                                width={16}
                                alt=""
                            />
                        </span>
                        <input
                            type="text"
                            name="ifsc_code"
                            placeholder="IFSC Code"
                            value={formik.values.ifsc_code}
                            onChange={formik.handleChange}
                            className={`w-full ${
                        i18n.language === "ar" ? "pr-10" : "pl-10"
                      } py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm`}
                        />
                    </div>
                </div> */}

                {/* IBAN Input */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold">
                        {t('signup.tab48')}
                    </label>
                    <div className="relative mt-1">
                        <span className={`absolute  flex items-center ${
                        i18n.language === "ar"
                          ? "inset-y-0 right-0 pr-3"
                          : "inset-y-0 left-0 pl-3"
                      }`}>
                            <Icon
                                icon="mdi:card-account-details-outline"
                                className="w-4 h-4 text-[#a797cc]"
                            />
                        </span>
                        <input
                            type="text"
                            name="iban"
                            placeholder="Enter your account number"
                            value={formik.values.iban}
                            onChange={formik.handleChange}
                            className={`w-full ${
                        i18n.language === "ar" ? "pr-10" : "pl-10"
                      } py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm`}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-10 px-10">
                    <button
                        type="submit"
                        className="w-full py-4 bg-[#a797cc] text-white font-semibold rounded-xl hover:bg-[#8b85b1]"
                        disabled={loading}
                    >
                        {loading ? <Loader height="25" color="#fff" /> : buttonName}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default BankDetails;
