import { OrganizerUpdateProfileApi } from "@/app/api/setting";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";

export default function GroupNameForm({ proceedToNextStep, showStepImage, shwoSubmitButton }) {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            group_name: "", // Initialize as an empty string
        },
        validationSchema: Yup.object({
            group_name: Yup.string()
                .required(t('signup.tab16')) // Existing required validation
                .min(5, (t('signup.tab'))) // Minimum length validation
        }),
        onSubmit: (values) => {
            setLoading(true);
            const payload = {
                group_name: values.group_name,
                registration_step: 3
            };

            OrganizerUpdateProfileApi(payload).then((res) => {
                setLoading(false);
                if (res?.status === 1) {
                    toast.success(res?.message);
                    router.push("/organizerSignup/bankDetail");
                } else if (res?.status === 0) {
                    toast.error(res?.message);
                }
                console.log("res", res);
            });
        },
    });

    return (
        <>
            <div className="flex justify-between items-start gap-5">
                <div>
                    <h2 className="text-lg font-bold mb-3">
                        {t('signup.tab39')}
                    </h2>
                    <p className="mb-4 text-gray-600 text-sm">
                        {t('signup.tab40')}
                    </p>
                </div>
                {showStepImage && (
                    <Image
                        src="/assets/images/icons/step-3.png"
                        height={58}
                        width={58}
                        alt=""
                    />
                )}
            </div>

            <form onSubmit={formik.handleSubmit}>
                <div className="relative">
                    <label className="block text-gray-700 text-sm font-semibold">
                        {t('signup.tab41')}
                    </label>
                    <div className="relative mt-1">
                        <span className={`absolute  flex items-center ${i18n.language === "ar"
                                ? "inset-y-0 right-0 pr-3"
                                : "inset-y-0 left-0 pl-3"
                                }`}>
                            <Image
                                src="/assets/images/icons/city.png"
                                height={16}
                                width={18}
                                alt="City icon"
                            />
                        </span>
                        <input
                            type="text"
                            placeholder={t('signup.tab42')}
                            value={formik.values.group_name}
                            onChange={formik.handleChange}
                            name="group_name"
                            className={`w-full ${i18n.language === "ar" ? "pr-10" : "pl-10"
                            } py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm`}
                        />
                    </div>
                    {formik.errors.group_name && formik.touched.group_name && (
                        <p className="text-red-500 text-xs mt-1 font-semibold">{formik.errors.group_name}</p>
                    )}
                </div>
                {shwoSubmitButton && (
                    <div className="px-10 mt-10">
                        <button
                            className="w-full py-4 bg-[#a797cc] text-white font-semibold rounded-xl hover:bg-orange-600"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? <Loader color="#fff" height="30" /> : t('signup.tab21')}
                        </button>
                    </div>
                )}
            </form>
        </>
    );
}
