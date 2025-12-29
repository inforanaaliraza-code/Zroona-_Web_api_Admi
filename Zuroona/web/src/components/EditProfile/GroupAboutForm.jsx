import { OrganizerUpdateProfileApi } from "@/app/api/setting";
import { getCategoryList } from "@/redux/slices/CategoryList";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function GroupAboutForm({ handleFormSubmit, showStepImage, shwoSubmitButton }) {
    const [search, setSearch] = useState("");
    const [selectedTopics, setSelectedTopics] = useState([]);
    
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { CategoryList } = useSelector((state) => state.CategoryData || {});

    useEffect(() => {
        dispatch(getCategoryList({ page: page }));
    }, [dispatch, page]);

    const formik = useFormik({
        initialValues: {
            group_category: [], // Initialize as an empty array
        },
        onSubmit: (values) => {
            setLoading(true);
            const payload = {
                group_category: values.group_category,
            };

            OrganizerUpdateProfileApi(payload).then((res) => {
                setLoading(false);
                if (res?.status === 1) {
                    router.push("/organizerSignup/interviewQ/step3");
                } else if (res?.status === 0) {
                    toast.error(res?.message);
                }
                console.log("res", res);
            });
        },
    });

    const toggleTopic = (topicId) => {
        const updatedTopics = selectedTopics.includes(topicId)
            ? selectedTopics.filter((_id) => _id !== topicId) // Remove ID if already selected
            : [...selectedTopics, topicId]; // Add ID if not selected

        setSelectedTopics(updatedTopics);
        formik.setFieldValue("group_category", updatedTopics); // Update formik field
    };

    return (
        <>
            <div className="flex justify-between items-start gap-5">
                <div>
                    <h2 className="text-lg font-bold mb-3">
                        Where will your group be about?
                    </h2>
                    <p className="mb-4 text-gray-600 text-sm">
                        Meet-ly groups meet locally, in person and online.
                        We&lsquo;ll connect you with people in your area, and more
                        can join you online.
                    </p>
                </div>
                {
                    showStepImage && (
                        <Image
                            src="/assets/images/icons/step-2.png"
                            height={58}
                            width={58}
                            alt=""
                        />
                    )
                }
            </div>
            <form onSubmit={formik.handleSubmit}>
                <div className="relative">
                    <label className="block text-gray-700 text-sm font-semibold">
                        Search
                    </label>
                    <div className="relative mt-1 mb-4">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Image
                                src="/assets/images/icons/city.png"
                                height={16}
                                width={18}
                                alt=""
                            />
                        </span>
                        <input
                            type="text"
                            placeholder="Search for topics"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm"
                        />
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                            <Image
                                src="/assets/images/icons/search-icon.png"
                                height={27}
                                width={27}
                                alt=""
                            />
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    {CategoryList
                        ?.data?.filter((topic) =>
                            topic.name.toLowerCase().includes(search.toLowerCase())
                        )
                        ?.map((topic, index) => (
                            <div
                                key={index}
                                onClick={() => toggleTopic(topic._id)} // Use topic.id
                                className={`relative cursor-pointer flex items-center gap-2 py-4 px-2 text-xs font-semibold rounded-xl border bg-[#fff6f7] ${selectedTopics.includes(topic._id)
                                    ? "bg-orange-500 text-white"
                                    : "border border-orange-500 text-gray-900"
                                    }`}
                            >
                                {selectedTopics.includes(topic._id)
                                    ? <Image
                                        src={topic.selected_image}
                                        height={20}
                                        width={20}
                                        alt={`${topic.name} icon`}
                                    />
                                    :
                                    <Image
                                        src={topic.unselected_image}
                                        height={20}
                                        width={20}
                                        alt={`${topic.name} icon`}
                                    />
                                }
                                {selectedTopics.includes(topic._id) && (
                                    <span className="absolute mr-1 right-0 top-0 mt-1">
                                        <Image
                                            src="/assets/images/icons/close-filled.png"
                                            height={16}
                                            width={16}
                                            alt=""
                                        />
                                    </span>
                                )}
                                {topic.name}
                                <Image
                                    src="/assets/images/icons/plus.png"
                                    height={14}
                                    width={14}
                                    alt=""
                                />
                            </div>
                        ))}
                </div>

                {
                    shwoSubmitButton && (
                        <div className="px-10 mt-10">
                            <button
                                className="w-full py-4 bg-[#a797cc] text-white font-semibold rounded-xl hover:bg-orange-600"
                                type="submit"
                            >
                                Next
                            </button>
                        </div>
                    )
                }
            </form>
        </>
    )
}
