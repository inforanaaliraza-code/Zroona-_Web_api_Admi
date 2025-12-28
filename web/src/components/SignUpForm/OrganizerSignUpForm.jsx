"use client";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import S3 from "react-aws-s3";
import { config, TOKEN_NAME } from "@/until";
import Loader from "../Loader/Loader";
import ProfileImageUpload from "../ProfileImageUpload/ProfileImageUpload";
import { OrganizerSignUpApi } from "@/app/api/setting";
import Link from "next/link";
import LoginModal from "../Modal/LoginModal";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { NumberInput } from "@/components/ui/number-input";

export default function OrganizerSignUpForm({ title, buttonText, showDeactiveButton }) {
    const { t, i18n } = useTranslation();
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isOtpOpen, setIsOtpOpen] = useState(false);
    const ReactS3Client = new S3(config);
    const [loading, setLoading] = useState(false);
    const { push } = useRouter();

    const openLoginModal = () => setLoginModalOpen(true);
    const closeLoginModal = () => setLoginModalOpen(false);



    const formik = useFormik({
        initialValues: {
            profile_image: "",
            first_name: "",
            last_name: "",
            phone_number: "",
            country_code: "+966",
            email: "",
            gender: "", // (1, male; 2, female)
            nationality: "",
            date_of_birth: "",
            bio: "",
            termsAccepted: false,
        },
        validationSchema: Yup.object({
            email: Yup.string().required("Required"),
            profile_image: Yup.string().required("Required"),
            first_name: Yup.string().required("Required"),
            last_name: Yup.string().required("Required"),
            country_code: Yup.string().required("Required"),
            phone_number: Yup.string().required("Required"),
            gender: Yup.string().required("Required"),
            nationality: Yup.string().required("Required"),
            date_of_birth: Yup.string().required("Required"),
            bio: Yup.string().required("Required"),
            termsAccepted: Yup.boolean().oneOf([true]),
        }),
        onSubmit: (values) => {
            setLoading(true);
            const payload = {
                ...values,
                phone: values.phone_number, // Map phone_number to phone for API compatibility
            };

            const apiCall = OrganizerSignUpApi;

            apiCall(payload).then((data) => {
                setLoading(false);
                if (data?.status === 1) {
                    toast.success(data.message);
                    Cookies.set(TOKEN_NAME, data?.data?.token);
                    // Redirect to success page - email verification will be sent
                    push("/signup/success");
                } else {
                    toast.error(data.message);
                }
            });
        },
    });

    const handleGenderSelect = (gender) => {
        formik.setFieldValue("gender", gender);
    };

    return (
        <>


            {/* Profile Image Input */}
            <div>
                <ProfileImageUpload
                    formik={formik}
                    ReactS3Client={ReactS3Client}
                    fieldName="profile_image"
                />

                {formik.touched.profile_image && formik.errors.profile_image ? (
                    <p className="mt-1 text-xs text-red-500">
                        {formik.errors.profile_image}
                    </p>
                ) : null}
            </div>

            <div className="flex-grow p-5 bg-white rounded-xl h-max sm:p-7">
                <form onSubmit={formik.handleSubmit} >
                    <h2 className="mb-6 text-2xl font-semibold">{title}xx</h2>

                    {/* First Name Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700" htmlFor="first_name">{t('signup.tab2')}</label>
                        <div className="relative mt-1">
                            <span className={`absolute  flex items-center ${i18n.language === "ar"
                                ? "inset-y-0 right-0 pr-3"
                                : "inset-y-0 left-0 pl-3"
                            }`}>
                                <Icon icon="lucide:user" className="w-4 h-4 text-[#a797cc]" />
                            </span>
                            <input
                                type="text"
                                id="first_name"
                                placeholder={t('signup.tab12')}
                                className={`w-full ${i18n.language === "ar" ? "pr-10" : "pl-10"
                                } py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm`}
                                value={formik.values.first_name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.errors.first_name && formik.touched.first_name && (
                            <p className="mt-1 text-xs font-semibold text-red-500">{formik.errors.first_name}</p>
                        )}
                    </div>

                    {/* Last Name Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700" htmlFor="last_name">{t('signup.tab3')}</label>
                        <div className="relative mt-1">
                            <span className={`absolute  flex items-center ${i18n.language === "ar"
                                ? "inset-y-0 right-0 pr-3"
                                : "inset-y-0 left-0 pl-3"
                            }`}>
                                <Icon icon="lucide:user" className="w-4 h-4 text-[#a797cc]" />
                            </span>
                            <input
                                type="text"
                                id="last_name"
                                placeholder={t('signup.tab13')}
                                className={`w-full ${i18n.language === "ar" ? "pr-10" : "pl-10"
                                } py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm`}
                                value={formik.values.last_name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.errors.last_name && formik.touched.last_name && (
                            <p className="mt-1 text-xs font-semibold text-red-500">{formik.errors.last_name}</p>
                        )}
                    </div>

                    {/* Phone Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700">{t('signup.tab4')}</label>
                        <NumberInput
                            formik={formik}
                            mobileNumberField="phone_number"
                            countryCodeField="country_code"
                        />
                    </div>

                    {/* Email Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700" htmlFor="email">{t('signup.tab5')}</label>
                        <div className="relative mt-1">
                            <span className={`absolute  flex items-center ${i18n.language === "ar"
                                ? "inset-y-0 right-0 pr-3"
                                : "inset-y-0 left-0 pl-3"
                            }`}>
                                <Icon icon="lucide:mail" className="w-4 h-4 text-brand-gray-purple-2" />
                            </span>
                            <input
                                type="email"
                                id="email"
                                placeholder={t('signup.tab14')}
                                className={`w-full ${i18n.language === "ar" ? "pr-10" : "pl-10"
                                } py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm`}
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.errors.email && formik.touched.email && (
                            <p className="mt-1 text-xs font-semibold text-red-500">{formik.errors.email}</p>
                        )}
                    </div>

                    {/* Gender Selection */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700">{t('signup.tab6')}</label>
                        <div className="flex flex-col gap-4 mt-1 sm:flex-row">
                            {['tab7', 'tab8'].map((tab, index) => {
                                const genderText = t(`signup.${tab}`); // Dynamically fetch the translated text
                                const isSelected = formik.values.gender === String(index + 1);

                                // Mapping of translated gender text to image filenames (including both Arabic and English mappings)
                                const genderImageMap = {
                                    'ذكر': 'male',  // Arabic "ذكر" -> image 'male.png'
                                    'أنثى': 'female', // Arabic "أنثى" -> image 'female.png'
                                    'Male': 'male',   // English "Male" -> image 'male.png'
                                    'Female': 'female', // English "Female" -> image 'female.png'
                                };

                                const imageFile = genderImageMap[genderText] || ''; // Get the corresponding image name

                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`flex-1 gap-x-2 flex items-center py-2 px-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl hover:bg-gray-100 text-gray-700 font-semibold text-sm ${isSelected ? 'bg-gray-200' : ''}`}
                                        onClick={() => handleGenderSelect(String(index + 1))}
                                    >
                                        <div className="w-[15px] h-[25px] flex items-center justify-center mr-2">
                                            <Image
                                                src={`/assets/images/signup/${imageFile}.png`}
                                                height={44}
                                                width={22}
                                                alt={genderText}
                                                className="w-full h-full"
                                            />
                                        </div>
                                        {genderText}
                                    </button>
                                );
                            })}
                        </div>
                        {formik.errors.gender && formik.touched.gender && (
                            <p className="mt-1 text-xs font-semibold text-red-500">{formik.errors.gender}</p>
                        )}
                    </div>

                    {/* Nationality Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700" htmlFor="nationality">{t('auth.nationality')}</label>
                        <div className="relative mt-1">
                            <span className={`absolute flex items-center ${i18n.language === "ar"
                                ? "inset-y-0 right-0 pr-3"
                                : "inset-y-0 left-0 pl-3"
                            }`}>
                                <Icon icon="lucide:user" className="w-4 h-4 text-[#a797cc]" />
                            </span>
                            <input
                                type="text"
                                id="nationality"
                                placeholder={t('auth.enterNationality')}
                                className={`w-full ${i18n.language === "ar" ? "pr-10" : "pl-10"
                                } py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm`}
                                value={formik.values.nationality}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.errors.nationality && formik.touched.nationality && (
                            <p className="mt-1 text-xs font-semibold text-red-500">{formik.errors.nationality}</p>
                        )}
                    </div>

                    {/* Date of Birth Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700" htmlFor="date_of_birth">{t('signup.tab10')}</label>
                        <div className="relative mt-1">
                            <span className={`absolute flex items-center 
                                ${i18n.language === "ar"
                                ? "inset-y-0 right-0 pr-3 hidden"
                                : "inset-y-0 left-0 pl-3"
                            }`}>
                                <Image src="/assets/images/signup/calendar-event.png" height={13} width={13} alt="" />
                            </span>
                            <input
                                type="date"
                                id="date_of_birth"
                                className={`w-full ${i18n.language === "ar" ? "pl-5 pr-3" : "pl-10 pr-3"
                                } py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm`}
                                value={formik.values.date_of_birth}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                max={new Date().toISOString().split('T')[0]}
                            />

                        </div>
                        {formik.errors.date_of_birth && formik.touched.date_of_birth && (
                            <p className="mt-1 text-xs font-semibold text-red-500">{formik.errors.date_of_birth}</p>
                        )}
                    </div>

                    {/* Description Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700" htmlFor="bio">{t('signup.tab15')}</label>
                        <div className="relative mt-1">
                            <span className={`absolute top-0  flex items-center ${i18n.language === "ar" ? "right-0 pr-3" : "pl-3 left-0"
                            } pt-5`}>
                                <Image
                                    src="/assets/images/signup/bio.png"
                                    height={14}
                                    width={14}
                                    alt=""
                                />
                            </span>
                            <textarea
                                id="bio"
                                rows="4"
                                placeholder={t('signup.tab15')}
                                className={`w-full ${i18n.language === "ar" ? "pr-10" : "pl-10"
                                } py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm`}
                                value={formik.values.bio}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />

                        </div>
                        {formik.errors.bio && formik.touched.bio && (
                            <p className="mt-1 text-xs font-semibold text-red-500">{formik.errors.bio}</p>
                        )}
                    </div>

                    {/* Checkbox Input */}
                    <div className="flex gap-x-2 items-center mb-4">
                        <input
                            type="checkbox"
                            id="termsAccepted"
                            className="w-4 h-4 text-[#a797cc] bg-gray-100 border-gray-300 rounded focus:ring-0"
                            checked={formik.values.termsAccepted}
                            onChange={() => formik.setFieldValue("termsAccepted", !formik.values.termsAccepted)}
                            required
                        />
                        <label
                            htmlFor="termsAccepted"
                            className="text-sm text-gray-800 md:text-sm"
                        >
                            {t('signup.tab22')}{" "}
                            <Link href="#" className="text-[#a797cc] underline">
                                {t('signup.tab23')}
                            </Link>{" "}
                            {t('signup.tab24')}{" "}
                            <Link href="#" className="text-[#a797cc] underline">
                                {t('signup.tab25')}
                            </Link>
                            .
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="px-10 mt-10">
                        <button type="submit" className="w-full py-4 bg-[#a797cc] text-white font-semibold rounded-xl" disabled={loading}>
                            {loading ? <Loader color="#fff" height="30" /> : buttonText}
                        </button>
                    </div>

                </form>
                <p className="pt-5 text-base text-center text-gray-900 capitalize">
                    {t('signup.tab26')}{" "}
                    <button onClick={openLoginModal} className="text-[#a797cc] font-semibold">
                        {t('signup.tab27')}
                    </button>
                </p>
            </div>
            <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
        </>
    );
}
