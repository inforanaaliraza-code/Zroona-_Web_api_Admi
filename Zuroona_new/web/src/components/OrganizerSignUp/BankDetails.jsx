"use client";

import { OrganizerUpdateProfileApi } from "@/app/api/setting";
import { useFormik } from "formik";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import * as IBAN from "iban";

const BankDetails = ({ title, buttonName, onNext }) => {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            account_holder_name: "",
            bank_name: "",
            // account_number: "",
            // ifsc_code: "",
            iban: "",
        },
        validationSchema: Yup.object({
            account_holder_name: Yup.string().required(t('signup.tab16')),
            bank_name: Yup.string().required(t('signup.tab16')),
            iban: Yup.string()
                .required(t('signup.tab16'))
                .test('is-valid-iban', t('signup.ibanInvalid') || 'Invalid IBAN format', function(value) {
                    if (!value) return true;
                    // Remove spaces and convert to uppercase
                    const cleanedIban = value.replace(/\s/g, '').toUpperCase();
                    return IBAN.isValid(cleanedIban);
                })
        }),
        onSubmit: (values, { setFieldTouched, setFieldError }) => {
            // Pre-submit validation with specific error messages
            if (!values.account_holder_name || values.account_holder_name.trim() === "") {
                setFieldTouched("account_holder_name", true);
                toast.error(t("signup.accountHolderRequired") || "Please enter account holder name");
                return;
            }

            if (!values.bank_name || values.bank_name.trim() === "") {
                setFieldTouched("bank_name", true);
                toast.error(t("signup.bankNameRequired") || "Please enter bank name");
                return;
            }

            if (!values.iban || values.iban.trim() === "") {
                setFieldTouched("iban", true);
                toast.error(t("signup.ibanRequired") || "Please enter IBAN");
                return;
            }

            setLoading(true);
            // Get organizer ID from localStorage (saved during registration)
            const organizerId = localStorage.getItem("organizer_id");
            
            // Get personal info from localStorage (from Step 2)
            const personalInfoStr = localStorage.getItem("organizer_personal_info");
            const personalInfo = personalInfoStr ? JSON.parse(personalInfoStr) : {};
            
            const payload = {
                account_holder_name: values.account_holder_name,
                bank_name: values.bank_name,
                iban: values.iban,
                registration_step: 3, // Step 3: Bank Details
                organizer_id: organizerId, // Include organizer ID
            };

            console.log("[BANK-DETAILS] Submitting with organizer_id:", organizerId);

            OrganizerUpdateProfileApi(payload).then((res) => {
                setLoading(false);
                if (res?.status === 1) {
                    toast.success(res?.message || t("signup.bankDetailsSaved") || "Bank details saved successfully");
                    // Store bank details in localStorage for final submission
                    const bankData = {
                        ...personalInfo,
                        ...payload,
                        registration_step: 3,
                    };
                    localStorage.setItem("organizer_bank_info", JSON.stringify(bankData));
                    onNext?.(); // Go to next step (Upload CNIC)
                } else if (res?.status === 0) {
                    toast.error(res?.message || t("common.error") || "Failed to save bank details");
                }
                console.log("res", res);
            }).catch((error) => {
                setLoading(false);
                console.error("[BANK-DETAILS] Error:", error);
                toast.error(error?.response?.data?.message || t("common.error") || "Failed to save bank details");
            });
        },
    });

    return (
        <div className="flex-grow bg-white h-max p-5 sm:p-7 rounded-xl">
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
                    {formik.errors.account_holder_name && formik.touched.account_holder_name && (
                        <p className="text-red-500 text-xs mt-1 font-semibold">{formik.errors.account_holder_name}</p>
                    )}
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
                            <Icon icon="lucide:building-2" className="w-4 h-4 text-[#a797cc]" />
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
                    {formik.errors.bank_name && formik.touched.bank_name && (
                        <p className="text-red-500 text-xs mt-1 font-semibold">{formik.errors.bank_name}</p>
                    )}
                </div>

                {/* Account Number Input */}
                {/* <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold">
                        Account Number
                    </label>
                    <div className="relative mt-1">
                        <span className={`absolute  flex items-center ${
                        i18n.language === "ar"
                          ? "inset-y-0 right-0 pr-3"
                          : "inset-y-0 left-0 pl-3"
                      }`}>
                            <Icon icon="lucide:calculator" className="w-4 h-4 text-[#a797cc]" />
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
                        <span className={`absolute  flex items-center ${
                        i18n.language === "ar"
                          ? "inset-y-0 right-0 pr-3"
                          : "inset-y-0 left-0 pl-3"
                      }`}>
                            <Icon icon="lucide:hash" className="w-4 h-4 text-[#a797cc]" />
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
                            <Icon icon="lucide:hash" className="w-4 h-4 text-[#a797cc]" />
                        </span>
                        <input
                            type="text"
                            name="iban"
                            placeholder={t('signup.tab51')}
                            value={formik.values.iban}
                            onChange={(e) => {
                                // Allow only alphanumeric characters and spaces
                                const value = e.target.value.toUpperCase().replace(/[^A-Z0-9\s]/g, '');
                                formik.setFieldValue('iban', value);
                            }}
                            onBlur={formik.handleBlur}
                            className={`w-full ${
                        i18n.language === "ar" ? "pr-10" : "pl-10"
                      } py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm uppercase`}
                        />
                    </div>
                    {formik.errors.iban && formik.touched.iban && (
                        <p className="text-red-500 text-xs mt-1 font-semibold">{formik.errors.iban}</p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="mt-10 px-10">
                    <button
                        type="submit"
                        className="w-full py-4 bg-[#a797cc] text-white font-semibold rounded-xl hover:bg-[#8ba179]"
                        disabled={loading}
                    >
                        {loading ? <Loader color="#fff" height="30" /> : buttonName}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default BankDetails;
