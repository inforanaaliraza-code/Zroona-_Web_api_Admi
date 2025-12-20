"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SignUpApi } from "@/app/api/setting";
import { toast } from "react-toastify";
import OtpVerificationModal from "../Modal/OtpVerificationModal";
import ProfileImageUpload from "../ProfileImageUpload/ProfileImageUpload";
import { PhoneNumberInput } from "@/components/ui/phone-input";
import Loader from "../Loader/Loader";
import S3 from "react-aws-s3";
import { config } from "@/until";
import { Icon } from "@iconify/react";

export default function SignUpForm({ title = "Sign Up", buttonText = "Sign Up" }) {
    const [loading, setLoading] = useState(false);
    const [isOtpOpen, setIsOtpOpen] = useState(false);
    const { t, i18n } = useTranslation();
    const ReactS3Client = new S3(config);

    const closeOtpModal = () => setIsOtpOpen(false);

    const formik = useFormik({
        initialValues: {
            first_name: "",
            last_name: "",
            email: "",
            country_code: "+966",
            phone: "",
            gender: "",
            nationality: "",
            date_of_birth: "",
            description: "",
            profile_image: null,
        },
        validationSchema: Yup.object({
            first_name: Yup.string().required(t('signup.tab16')),
            last_name: Yup.string().required(t('signup.tab16')),
            email: Yup.string().email("Invalid email").required(t('signup.tab16')),
            phone: Yup.string().required(t('signup.tab16')),
            gender: Yup.string().required(t('signup.tab16')),
            nationality: Yup.string().required(t('signup.tab16')),
            date_of_birth: Yup.string().required(t('signup.tab16')),
            description: Yup.string().required(t('signup.tab16')),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const formData = new FormData();
                Object.keys(values).forEach((key) => {
                    if (values[key] !== null) {
                        formData.append(key, values[key]);
                    }
                });

                const response = await SignUpApi(formData);
                if (response?.status === 1) {
                    toast.success(response?.message);
                    setIsOtpOpen(true);
                } else {
                    toast.error(response?.message);
                }
            } catch (error) {
                toast.error("Something went wrong");
            } finally {
                setLoading(false);
            }
        },
    });

    const handleGenderSelect = (gender) => {
        formik.setFieldValue("gender", gender);
    };

    const inputClasses = `w-full px-4 py-3 rounded-lg border bg-white/90 transition-all duration-200
        ${formik.touched && formik.errors ? 'border-red-300' : 'border-gray-200 hover:border-gray-300 focus:border-[#a797cc]'}
        focus:ring-2 focus:ring-orange-100 focus:outline-none text-gray-700`;
    
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
    const iconContainerClasses = "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400";
    const errorClasses = "mt-1 text-sm text-red-500";

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container px-4 py-12 mx-auto sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl">
                    {/* Form Header */}
                    <div className="mb-8 text-center">
                        <h2 className="mb-2 text-3xl font-bold text-gray-900">
                            {t('signup.title')}
                        </h2>
                        <p className="text-gray-600">{t('signup.subtitle')}</p>
                    </div>

                    {/* Main Form */}
                    <div className="p-8 bg-white rounded-xl shadow-sm">
                        <form onSubmit={formik.handleSubmit} className="space-y-6">
                            {/* Profile Image Upload */}
                            <div className="flex justify-center mb-8">
                                <div className="relative">
                                    <ProfileImageUpload
                                        formik={formik}
                                        ReactS3Client={ReactS3Client}
                                        fieldName="profile_image"
                                    />
                                </div>
                            </div>

                            {/* Name Fields */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="first_name" className={labelClasses}>
                                        {t("signup.tab2")}
                                    </label>
                                    <div className="relative">
                                        <span className={iconContainerClasses}>
                                            <Icon
                                                icon="lucide:user"
                                                className="w-4 h-4 text-[#a797cc]"
                                            />
                                        </span>
                                        <input
                                            type="text"
                                            id="first_name"
                                            className={`pl-10 ${inputClasses}`}
                                            placeholder={t("signup.tab12")}
                                            {...formik.getFieldProps("first_name")}
                                        />
                                    </div>
                                    {formik.touched.first_name && formik.errors.first_name && (
                                        <p className={errorClasses}>{formik.errors.first_name}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="last_name" className={labelClasses}>
                                        {t("signup.tab3")}
                                    </label>
                                    <div className="relative">
                                        <span className={iconContainerClasses}>
                                            <Icon
                                                icon="lucide:user"
                                                className="w-4 h-4 text-[#a797cc]"
                                            />
                                        </span>
                                        <input
                                            type="text"
                                            id="last_name"
                                            className={`pl-10 ${inputClasses}`}
                                            placeholder={t("signup.tab13")}
                                            {...formik.getFieldProps("last_name")}
                                        />
                                    </div>
                                    {formik.touched.last_name && formik.errors.last_name && (
                                        <p className={errorClasses}>{formik.errors.last_name}</p>
                                    )}
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <label htmlFor="email" className={labelClasses}>
                                    {t("signup.tab5")}
                                </label>
                                <div className="relative">
                                    <span className={iconContainerClasses}>
                                        <Icon
                                            icon="lucide:mail"
                                            className="w-4 h-4 text-[#a797cc]"
                                        />
                                    </span>
                                    <input
                                        type="email"
                                        id="email"
                                        className={`pl-10 ${inputClasses}`}
                                        placeholder={t("signup.tab14")}
                                        {...formik.getFieldProps("email")}
                                    />
                                </div>
                                {formik.touched.email && formik.errors.email && (
                                    <p className={errorClasses}>{formik.errors.email}</p>
                                )}
                            </div>

                            {/* Phone Input */}
                            <div>
                                <label className={labelClasses}>
                                    {t("signup.tab4")}
                                </label>
                                <PhoneNumberInput
                                    value={formik.values.phone ? `${formik.values.country_code}${formik.values.phone}` : formik.values.country_code}
                                    onChange={(value, country) => {
                                        if (country) {
                                            const countryCode = `+${country.dialCode}`;
                                            const number = value.substring(country.dialCode.length);
                                            formik.setFieldValue("country_code", countryCode);
                                            formik.setFieldValue("phone", number);
                                        }
                                    }}
                                    error={formik.touched.phone && formik.errors.phone ? formik.errors.phone : null}
                                />
                            </div>

                            {/* Gender Selection */}
                            <div>
                                <label className={labelClasses}>
                                    {t("signup.tab6")}
                                </label>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    {["tab7", "tab8"].map((tab, index) => {
                                        const genderText = t(`signup.${tab}`);
                                        const genderImageMap = {
                                            ذكر: "male",
                                            أنثى: "female",
                                            Male: "male",
                                            Female: "female",
                                        };
                                        const imageFile = genderImageMap[genderText] || "";
                                        const isSelected = formik.values.gender === String(index + 1);

                                        return (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => handleGenderSelect(String(index + 1))}
                                                className={`flex-1 flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border transition-all duration-200
                                                    ${isSelected
                                                        ? "border-[#a797cc] bg-orange-50 text-[#a797cc]"
                                                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                                                    }`}
                                            >
                                                <Image
                                                    src={`/assets/images/signup/${imageFile}.png`}
                                                    height={18}
                                                    width={18}
                                                    alt={genderText}
                                                    priority
                                                    unoptimized
                                                />
                                                <span>
                                                    {genderText}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                                {formik.touched.gender && formik.errors.gender && (
                                    <p className={errorClasses}>{formik.errors.gender}</p>
                                )}
                            </div>

                            {/* Nationality */}
                            <div>
                                <label htmlFor="nationality" className={labelClasses}>
                                    {t("auth.nationality")}
                                </label>
                                <div className="relative">
                                    <span className={iconContainerClasses}>
                                        <Icon
                                            icon="lucide:user"
                                            className="w-4 h-4 text-[#a797cc]"
                                        />
                                    </span>
                                    <input
                                        type="text"
                                        id="nationality"
                                        className={`pl-10 ${inputClasses}`}
                                        placeholder={t("auth.enterNationality")}
                                        {...formik.getFieldProps("nationality")}
                                    />
                                </div>
                                {formik.touched.nationality && formik.errors.nationality && (
                                    <p className={errorClasses}>{formik.errors.nationality}</p>
                                )}
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label htmlFor="date_of_birth" className={labelClasses}>
                                    {t("signup.tab10")}
                                </label>
                                <div className="relative">
                                    <span className={iconContainerClasses}>
                                        <Image
                                            src="/assets/images/signup/calendar-event.png"
                                            height={18}
                                            width={18}
                                            alt="Calendar Icon"
                                            priority
                                            unoptimized
                                        />
                                    </span>
                                    <input
                                        type="date"
                                        id="date_of_birth"
                                        className={`pl-10 ${inputClasses}`}
                                        max={new Date().toISOString().split("T")[0]}
                                        {...formik.getFieldProps("date_of_birth")}
                                    />
                                </div>
                                {formik.touched.date_of_birth && formik.errors.date_of_birth && (
                                    <p className={errorClasses}>{formik.errors.date_of_birth}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className={labelClasses}>
                                    {t("signup.tab15")}
                                </label>
                                <div className="relative">
                                    <span className="absolute top-3 left-3 text-gray-400 pointer-events-none">
                                        <Image
                                            src="/assets/images/signup/bio.png"
                                            height={18}
                                            width={18}
                                            alt="Bio Icon"
                                            priority
                                            unoptimized
                                        />
                                    </span>
                                    <textarea
                                        id="description"
                                        rows="4"
                                        className={`pl-10 resize-none ${inputClasses}`}
                                        placeholder={t("signup.tab15")}
                                        {...formik.getFieldProps("description")}
                                    />
                                </div>
                                {formik.touched.description && formik.errors.description && (
                                    <p className={errorClasses}>{formik.errors.description}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200
                                        ${loading
                                            ? "bg-orange-400/80 cursor-not-allowed"
                                            : "bg-[#a797cc] hover:bg-[#e06a0b] active:bg-[#d66408]"
                                        }`}
                                >
                                    {loading ? (
                                        <div className="flex gap-2 justify-center items-center">
                                            <Loader color="#fff" height="20" />
                                            <span>{t('signup.processing')}</span>
                                        </div>
                                    ) : (
                                        t('signup.submit')
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <OtpVerificationModal isOpen={isOtpOpen} onClose={closeOtpModal} />
        </div>
    );
}
