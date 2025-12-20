import { OrganizerEditProfileApi } from "@/app/api/setting";
import { useDataStore } from "@/app/api/store/store";
import { useFormik } from "formik";
import Image from "next/image";
import { useEffect, useState } from "react";
import Autocomplete from "react-google-autocomplete";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getCategoryList } from "@/redux/slices/CategoryList";
import { useTranslation } from "react-i18next";
import Loader from "../Loader/Loader";
import * as Yup from 'yup';

export default function InterviewQ() {
    const { t, i18n } = useTranslation();
    const YOUR_GOOGLE_MAPS_API_KEY = "AIzaSyBOsw8h9LFNKaZpmGAeoIkv9OcgMsaPuK0";
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [localLocations, setLocalLocations] = useState([]);

    const dispatch = useDispatch();
    const { CategoryList, loadingCategory } = useSelector((state) => state.CategoryData || {});

    useEffect(() => {
        dispatch(getCategoryList({ page: page }));
    }, [dispatch, page, i18n.language]);

    const detail = useDataStore((store) => store.ProfileDetail);
    const { fetchProfileDetail } = useDataStore();

    useEffect(() => {
        fetchProfileDetail().then(() => {
            if (localLocations.length === 0 && detail?.user?.group_location) {
                setLocalLocations(detail?.user?.group_location);
            }
        });
    }, []);

    const formik = useFormik({
        initialValues: {
            // registration_step: 3,
            group_category: detail?.user?.group_category || [],
            group_location: detail?.user?.group_location || [],
            group_name: detail?.user?.group_name || "",
        },
        validationSchema: Yup.object({
            group_name: Yup.string()
                .min(5, "Group name must be at least 5 characters")
                .required("Group name is required"),
        }),
        enableReinitialize: true,
        onSubmit: (values) => {
            setLoading(true);
            const updatedValues = { ...values, group_location: localLocations };
            OrganizerEditProfileApi(updatedValues)
                .then((res) => {
                    setLoading(false);
                    if (res.status === 1) {
                        toast.success(res.message);
                    } else {
                        toast.error(res.message);
                    }
                })
                .catch(() => {
                    setLoading(false);
                    toast.error("An error occurred.");
                });
        },
    });

    const removeLocation = (index) => {
        setLocalLocations(localLocations.filter((_, i) => i !== index));
    };

    const handleSelect = (place) => {
        if (place.geometry) {
            const latitude = place.geometry.location.lat();
            const longitude = place.geometry.location.lng();
            const formatted_address = place.formatted_address;

            let city_name = "";
            place.address_components.forEach((component) => {
                if (component.types.includes("locality")) {
                    city_name = component.long_name;
                }
            });

            const newLocation = {
                longitude,
                latitude,
                city_name: formatted_address,
            };

            const isDuplicate = localLocations.some(
                (location) =>
                    location.longitude === newLocation.longitude &&
                    location.latitude === newLocation.latitude
            );

            if (isDuplicate) {
                toast.error("This location is already added.");
                return;
            }

            // Append new location without overwriting
            setLocalLocations((prevLocations) => [...prevLocations, newLocation]);
        } else {
            console.error("Location details are not available.");
        }
    };

    const toggleTopic = (topicId) => {
        const updatedTopics = formik.values.group_category.some(
            (item) => item._id === topicId
        )
            ? formik.values.group_category.filter((item) => item._id !== topicId)
            : [...formik.values.group_category, { _id: topicId }];

        formik.setFieldValue("group_category", updatedTopics);
    };

    const selectedIds = formik.values.group_category.map((category) => category._id);

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                {/* group be located */}
                <div>
                    <div className="flex justify-between items-start gap-5">
                        <div>
                            <h2 className="text-lg font-bold mb-3">
                                {t('signup.tab31')}
                            </h2>
                            <p className="mb-4 text-gray-600 text-sm">
                                {t('signup.tab32')}
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        <label className="block text-gray-700 text-sm font-semibold">{t('signup.tab33')}</label>
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
                            <Autocomplete
                                apiKey={YOUR_GOOGLE_MAPS_API_KEY}
                                // style={{ width: "90%" }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault(); // Prevent Enter key for this field
                                    }
                                }}
                                onPlaceSelected={handleSelect}
                                options={{ types: ["(regions)"] }}
                                className={`w-full ${i18n.language === "ar" ? "pr-10" : "pl-10"
                                    } py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm`}
                            />
                            <span className={`absolute ${i18n.language === "ar" ? " inset-y-0 left-0 rotate-180 pr-4 pl-10" : "right-0 pr-4 inset-y-0   "} flex items-center  bg-[#fdfdfd] border border-l-0 rounded-l-none border-[#f2dfba] rounded-xl transform`}>
                                <Image
                                    src="/assets/images/icons/search-icon.png"
                                    height={27}
                                    width={27}
                                    alt="Search icon"
                                    className={`transform ${i18n.language === "ar" ? "rotate-180" : ""}`}
                                />
                            </span>
                        </div>

                        <div className="mt-2">
                            {loading ? (
                                <div className="flex justify-center items-center w-full">
                                    <Loader height={25} />
                                </div>
                            ) : localLocations.length > 0 ? (
                                <>
                                    <h3 className="text-sm font-semibold mb-2">Selected Locations:</h3>
                                    <ul className="flex flex-wrap gap-2">
                                        {localLocations.map((location, index) => (
                                            <li key={index} className="relative flex items-center gap-2 py-4 px-2 pr-8 text-sm font-semibold rounded-xl bg-[#a797cc] text-white">
                                                <span>{location.city_name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeLocation(index)}
                                                    className="absolute right-1 top-1"
                                                >
                                                    <Image
                                                        src="/assets/images/icons/close-filled.png"
                                                        height={16}
                                                        width={16}
                                                        alt="Remove"
                                                    />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : (
                                <span className="text-sm text-gray-800">
                                    No Locations Added
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* group be about */}
                <div className="mt-5">
                    <div className="flex justify-between items-start gap-5">
                        <div>
                            <h2 className="text-lg font-bold mb-3">
                                {t('signup.tab35')}
                            </h2>
                        </div>
                    </div>
                    <div className="relative">
                        <label className="block text-gray-700 text-sm font-semibold">
                            {t('signup.tab37')}
                        </label>
                        <div className="relative mt-1 mb-4">
                            <span className={`absolute  flex items-center ${i18n.language === "ar"
                                ? "inset-y-0 right-0 pr-3"
                                : "inset-y-0 left-0 pl-3"
                                }`}>
                                <Image
                                    src="/assets/images/icons/city.png"
                                    height={16}
                                    width={18}
                                    alt=""
                                />
                            </span>
                            <input
                                type="text"
                                placeholder={t('signup.tab38')}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={`w-full ${i18n.language === "ar" ? "pr-10" : "pl-10"
                                    } py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm`}
                            />
                            <span className={`absolute ${i18n.language === "ar" ? "left-0 pl-4" : "right-0 pr-4"} inset-y-0  flex items-center`}>
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
                        {loadingCategory ? (
                            <div className="flex justify-center items-center w-full">
                                <Loader height={25} />
                            </div>
                        ) : (
                            CategoryList?.data?.map((topic) => {
                                const isSelected = formik.values.group_category.some(
                                    (item) => item._id === topic._id
                                );

                                return (
                                    <div
                                        key={topic._id}
                                        onClick={() => toggleTopic(topic._id)}
                                        className={`relative cursor-pointer flex items-center gap-2 py-4 px-4 text-xs font-semibold rounded-xl border ${isSelected
                                            ? "bg-orange-500 text-white"
                                            : "bg-[#fff6f7] border border-orange-500 text-gray-900"
                                            }`}
                                    >
                                        <Image
                                            src={isSelected ? topic.selected_image : topic.unselected_image}
                                            height={20}
                                            width={20}
                                            alt={`${topic.name} icon`}
                                        />
                                        {isSelected && (
                                            <span
                                                className="absolute right-0 top-0 mt-1 mr-1"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent parent click
                                                    toggleTopic(topic._id); // Remove topic
                                                }}
                                            >
                                                <Image
                                                    src="/assets/images/icons/close-filled.png"
                                                    height={16}
                                                    width={16}
                                                    alt="Close icon"
                                                />
                                            </span>
                                        )}
                                        {topic.name}
                                        {!isSelected && (
                                            <Image
                                                src="/assets/images/icons/plus.png"
                                                height={14}
                                                width={14}
                                                alt="Add icon"
                                            />
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* group be name */}
                <div>
                    <div className="flex justify-between items-start gap-5">
                        <div>
                            <h2 className="text-lg font-bold mb-3">
                                {t('signup.tab39')}
                            </h2>
                        </div>
                    </div>

                    <div className="relative">
                        <label className="block text-gray-700 text-sm font-semibold">
                            {t('signup.tab40')}
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
                                placeholder="Enter group name..."
                                value={formik.values.group_name}
                                onChange={formik.handleChange}
                                name="group_name"
                                className={`w-full ${i18n.language === "ar" ? "pr-10" : "pl-10"
                                    } py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm`}
                            />
                        </div>
                        {formik.errors.group_name && formik.touched.group_name && (
                            <div className="text-red-500">{formik.errors.group_name}</div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="px-10 mt-10">
                    <button
                        className="w-full py-4 bg-[#a797cc] text-white font-semibold rounded-xl hover:bg-orange-600"
                        type="submit"
                    >
                        {loading ? <Loader height="30" color="#fff" /> : t('signup.tab57')}
                    </button>
                </div>
            </form>
        </>
    )
}
