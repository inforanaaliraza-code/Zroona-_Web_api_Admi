import { OrganizerUpdateProfileApi } from "@/app/api/setting";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from 'yup';

export default function GroupNameForm({ proceedToNextStep, showStepImage, shwoSubmitButton }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            group_name: "", // Initialize as an empty string
        },
        validationSchema: Yup.object({
            group_name: Yup.string()
                .min(5, "Group name must be at least 5 characters")
                .required("Group name is required"),
        }),
        onSubmit: (values) => {
            setLoading(true);
            const payload = {
                group_name: values.group_name,
                // registration_step: 3
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
                        What’s the name of your group?
                    </h2>
                    <p className="mb-4 text-gray-600 text-sm">
                        Choose a name that will give people a clear idea of what
                        the group is about. You can edit this later if you change
                        your mind.
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
                        Group Name
                    </label>
                    <div className="relative mt-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Image
                                src="/assets/images/icons/city.png"
                                height={16}
                                width={18}
                                alt="City icon"
                            />
                        </span>
                        <input
                            type="text"
                            placeholder="Enter group name..."
                            value={formik.values.group_name}
                            onChange={formik.handleChange}
                            name="group_name"
                            className="w-full pl-10 py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm"
                        />
                    </div>
                    {formik.errors.group_name && formik.touched.group_name && (
                        <div className="text-red-500">{formik.errors.group_name}</div>
                    )}
                </div>
                {shwoSubmitButton && (
                    <div className="px-10 mt-10">
                        <button
                            className="w-full py-4 bg-[#a797cc] text-white font-semibold rounded-xl hover:bg-orange-600"
                            type="submit"
                            disabled={loading}
                        >
                            Next
                        </button>
                    </div>
                )}
            </form>
        </>
    );
}
