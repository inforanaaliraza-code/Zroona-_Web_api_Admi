"use client";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { NumberInput } from "@/components/ui/number-input";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BASE_API_URL } from "@/until";
import Loader from "../Loader/Loader";
import { OrganizerEditProfileApi, UploadFileApi } from "@/app/api/setting";
import { useDataStore } from "@/app/api/store/store";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getProfile } from "@/redux/slices/profileInfo";

export default function OrganizerSignUpForm({ title, buttonText }) {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const dispatch = useDispatch();

    const detail = useDataStore((store) => store.ProfileDetail);
    const { fetchProfileDetail } = useDataStore();

    useEffect(() => {
        fetchProfileDetail().then(() => { });
    }, []);

    const formik = useFormik({
        initialValues: {
            profile_image: detail?.user?.profile_image || "",
            first_name: detail?.user?.first_name || "",
            last_name: detail?.user?.last_name || "",
            phone_number: detail?.user?.phone_number || "",
            country_code: detail?.user?.country_code || "",
            email: detail?.user?.email || "",
            gender: detail?.user?.gender || "", // (1, male; 2, female; 3, both)
            date_of_birth: detail?.user?.date_of_birth?.substr(0, 10) || "",
            bio: detail?.user?.bio || "",
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            setLoading(true);
            const payload = {
                ...values,
            };

            OrganizerEditProfileApi(payload)
                .then((res) => {
                    setLoading(false);
                    if (res.status === 1) {
                        toast.success(res.message);
                        dispatch(getProfile());
                    } else {
                        toast.error(res.message);
                    }
                })
                .catch((e) => {
                    setLoading(false);
                    toast.error("An error occurred.");
                });
        },
    });

    const handleGenderSelect = (gender) => {
        formik.setFieldValue("gender", gender);
    };

    const uploadViaApi = async (file) => {
        // Use UploadFileApi which now returns Cloudinary URL
        const result = await UploadFileApi({ 
            file: file, 
            dirName: "Zuroona" 
        });
        
        if (result?.status === 1 && result?.data?.location) {
            // Return Cloudinary URL directly (already full URL from Cloudinary)
            return result.data.location;
        } else {
            throw new Error(result?.message || "Upload failed");
        }
    };

    const handleFileChange = (file) => {
        setSelectedFile(file);
        if (file) {
            setImageLoading(true);
            uploadViaApi(file)
                .then((location) => {
                    formik.setFieldValue("profile_image", location);
                    setPreviewUrl(location);
                    setImageLoading(false);
                })
                .catch(() => {
                    toast.error("Image upload failed");
                    setImageLoading(false);
                });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileChange(file);
        }
    };

    return (
        <>


            {/* Left Sidebar for Image Upload */}
            <div className="flex flex-col items-center bg-white h-max p-7 pt-5 rounded-xl mb-8 md:mb-0">
                <div className="relative">
                    <div className="absolute right-2 top-2 z-10">
                        <Icon
                            icon="lucide:camera"
                            className="w-6 h-6 text-brand-gray-purple-2"
                        />
                    </div>
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-3">
                        {imageLoading ? (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full">
                                <Loader />
                            </div>
                        ) : (
                            <>
                                {formik.values.profile_image && !previewUrl && (
                                    <Image
                                        src={formik.values.profile_image}
                                        alt="Profile"
                                        height={200}
                                        width={200}
                                        className="object-cover w-full h-full"
                                    />
                                )}
                                {previewUrl && (
                                    <Image
                                        src={previewUrl}
                                        alt="Profile"
                                        height={118}
                                        width={118}
                                        className="object-cover w-full h-full"
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
                <label className="bg-[#a797cc] text-sm text-white px-4 py-3 rounded-xl cursor-pointer">
                    {t('signup.tab20')}
                    <input
                        type="file"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </label>
            </div>

            <form onSubmit={formik.handleSubmit} className="flex-grow bg-white h-max p-7 rounded-xl">
                <h2 className="text-2xl font-semibold mb-6">{title}</h2>

                {/* First Name - Read Only */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold" htmlFor="first_name">{t('signup.tab2')}</label>
                    <div className="relative mt-1">
                        <span className={`absolute  flex items-center ${i18n.language === "ar"
                                ? "inset-y-0 right-0 pr-3"
                                : "inset-y-0 left-0 pl-3"
                            }`}>
                            <Icon icon="lucide:user" className="w-4 h-4 text-brand-gray-purple-2" />
                        </span>
                        <input
                            type="text"
                            id="first_name"
                            readOnly
                            className={`w-full ${i18n.language === "ar" ? "pr-10" : "pl-10"
                                } py-4 border bg-gray-100 border-gray-300 rounded-xl text-black cursor-not-allowed`}
                            value={formik.values.first_name}
                        />
                    </div>
                </div>

                {/* Last Name - Read Only */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold" htmlFor="last_name">{t('signup.tab3')}</label>
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
                            readOnly
                            className={`w-full ${i18n.language === "ar" ? "pr-10" : "pl-10"
                                } py-4 border bg-gray-100 border-gray-300 rounded-xl text-black cursor-not-allowed`}
                            value={formik.values.last_name}
                        />
                    </div>
                </div>

                {/* Phone Input */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold">{t('signup.tab4')}</label>
                    <NumberInput
                        formik={formik}
                        mobileNumberField="phone_number"
                        countryCodeField="country_code"
                    />
                </div>

                {/* Email Input */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold" htmlFor="email">{t('signup.tab5')}</label>
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
                            placeholder="Enter your email address"
                            className={`w-full ${i18n.language === "ar" ? "pr-10" : "pl-10"
                                } py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm`}
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                </div>

                {/* Gender - Read Only */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold">{t('signup.tab6')}</label>
                    <div className="relative mt-1">
                        <input
                            type="text"
                            readOnly
                            className="w-full py-4 border bg-gray-100 border-gray-300 rounded-xl text-black cursor-not-allowed"
                            value={
                                formik.values.gender === "1" 
                                    ? t("signup.tab7") 
                                    : formik.values.gender === "2" 
                                        ? t("signup.tab8") 
                                        : "-"
                            }
                        />
                    </div>
                </div>

                {/* Date of Birth - Read Only */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold" htmlFor="date_of_birth">{t('signup.tab10')}</label>
                    <div className="relative mt-1">
                        <input
                            type="text"
                            readOnly
                            className="w-full py-4 border bg-gray-100 border-gray-300 rounded-xl text-black cursor-not-allowed"
                            value={formik.values.date_of_birth ? new Date(formik.values.date_of_birth).toLocaleDateString() : "-"}
                        />
                    </div>
                </div>

                {/* Description Input */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold" htmlFor="bio">{t('signup.tab15')}</label>
                    <div className="relative mt-1">
                        <span className={`absolute top-0 flex items-center ${i18n.language === "ar" ? "right-0 pr-3" : "pl-3 left-0"
                            } pt-5`}>
                            <Icon
                                icon="mdi:text-box-outline"
                                className="w-4 h-4 text-[#a797cc]"
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
                </div>
                <div>
                    <h2 className="text-2xl font-semibold">{t('signup.tab54')}</h2>
                    <p className="text-gray-800 text-xs md:text-sm mt-2">{t('signup.tab55')}</p>
                    <button className="p-4 bg-gray-50 border border-[#a797cc] rounded-xl text-[#a797cc] text-sm mt-4">{t('signup.tab56')}</button>
                </div>
                {/* Submit Button */}
                <div className="mt-10 px-10">
                    <button type="submit" className="w-full py-4 bg-[#a797cc] text-white font-semibold rounded-xl" disabled={loading}>
                        {loading ? <Loader color="#fff" height="30" /> : buttonText}
                    </button>
                </div>
            </form>
        </>
    );
}
