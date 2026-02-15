import { OrganizerUpdateProfileApi } from "@/app/api/setting";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
import Autocomplete from "react-google-autocomplete";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";

const GroupLocationForm = ({ handleFormSubmit, showStepImage, shwoSubmitButton }) => {
    const { t, i18n } = useTranslation();
    // Get API key from environment variable
    const YOUR_GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Local state to hold locations before updating Formik field
    const [locations, setLocations] = useState([]);

    const formik = useFormik({
        initialValues: {
            group_location: locations, // Initially set to locations state
        },
        validationSchema: Yup.object({
            group_location: Yup.array().of(
                Yup.object({
                    longitude: Yup.string(),
                    latitude: Yup.string(),
                    city_name: Yup.string().required(t('signup.tab16')),
                })
            ),
        }),
        onSubmit: (values) => {
            setLoading(true);
            const payload = {
                group_location: values.group_location,
            };

            OrganizerUpdateProfileApi(payload).then((res) => {
                setLoading(false);
                if (res?.status === 1) {
                    router.push("/organizerSignup/interviewQ/step2");
                } else if (res?.status === 0) {
                    toast.error(res?.message);
                }
                console.log("res", res);
            });
        },
    });

    const handleSelect = (place) => {
        if (place.geometry) {
            const latitude = place.geometry.location.lat();
            const longitude = place.geometry.location.lng();
            const formatted_address = place.formatted_address;

            let city_name = '';
            place.address_components.forEach(component => {
                if (component.types.includes("locality")) {
                    city_name = component.long_name;
                }
            });

            // Create new location object
            const newLocation = {
                longitude: longitude,
                latitude: latitude,
                city_name: city_name || formatted_address,
            };

            // Update local state (locations)
            setLocations((prevLocations) => {
                const updatedLocations = [...prevLocations, newLocation];
                formik.setFieldValue("group_location", updatedLocations); // Sync with Formik
                return updatedLocations;
            });
        } else {
            console.error("Location details are not available.");
        }
    };

    const handleRemoveLocation = (index) => {
        // Remove location from the local state array
        const updatedLocations = locations.filter((_, idx) => idx !== index);
        setLocations(updatedLocations);

        // Sync the updated locations with Formik's group_location
        formik.setFieldValue("group_location", updatedLocations);
    };

    return (
        <>
            <div className="flex justify-between items-start gap-5">
                <div>
                    <h2 className="text-lg font-bold mb-3">
                        {t('signup.tab31')}
                    </h2>
                    <p className="mb-4 text-gray-600 text-sm">
                        {t('signup.tab32')}
                    </p>
                </div>
                {showStepImage && (
                    <Image
                        src="/assets/images/icons/step-1.png"
                        height={58}
                        width={58}
                        alt="Step 1"
                    />
                )}
            </div>

            <form onSubmit={formik.handleSubmit}>
                <div className="relative">
                    <label className="block text-gray-700 text-sm font-semibold">
                        {t('signup.tab33')}
                    </label>
                    <div className="relative mt-1">
                        <span className={`absolute flex items-center ${i18n.language === "ar" ? "inset-y-0 right-0 pr-3" : "inset-y-0 left-0 pl-3"}`}>
                            <Image
                                src="/assets/images/icons/city.png"
                                height={16}
                                width={18}
                                alt="City icon"
                            />
                        </span>
                        {YOUR_GOOGLE_MAPS_API_KEY ? (
                            <Autocomplete
                                apiKey={YOUR_GOOGLE_MAPS_API_KEY}
                                style={{ width: "90%" }}
                                onPlaceSelected={handleSelect}
                                options={{
                                    types: ["(regions)"],
                                }}
                                className={`w-full ${i18n.language === "ar" ? "pr-10 rounded-l-none  border-l-0" : "pl-10 rounded-r-none  border-r-0"} py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm`}
                            />
                        ) : (
                            <div className={`w-full ${i18n.language === "ar" ? "pr-10 rounded-l-none  border-l-0" : "pl-10 rounded-r-none  border-r-0"} py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl text-xs text-red-600 flex items-center`}>
                                Google Maps API key missing. Please set <span className="mx-1 font-mono text-[10px]">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</span> in <span className="ml-1 font-mono text-[10px]">web/.env.local</span>.
                            </div>
                        )}
                        <span className={`absolute ${i18n.language === "ar" ? "inset-y-0 left-0 rotate-180 pr-4 pl-10" : "inset-y-0 right-0 pr-4 pl-10"} flex items-center bg-[#fdfdfd] border border-l-0 rounded-l-none border-[#f2dfba] rounded-xl transform`}>
                            <Image
                                src="/assets/images/icons/search-icon.png"
                                height={27}
                                width={27}
                                alt="Search icon"
                                className={`transform ${i18n.language === "ar" ? "rotate-180" : ""}`}
                            />
                        </span>
                    </div>
                    {formik.errors.group_location &&
                        formik.touched.group_location &&
                        Array.isArray(formik.errors.group_location) && (
                            <div className="text-red-500 text-xs mt-1 font-semibold">
                                {formik.errors.group_location.map((error, index) => (
                                    <p key={index}>
                                        {error.city_name && t('signup.tab16')}
                                    </p>
                                ))}
                            </div>
                        )}
                </div>

                {/* Display added locations */}
                <div className="mt-4">
                    {locations.length > 0 ? (
                        <>
                            <h3 className="text-sm font-semibold mb-2">Selected Locations:</h3>
                            <ul className="flex flex-wrap gap-2">
                                {locations.map((location, index) => (
                                    <li key={index} className="relative flex items-center gap-2 py-4 px-2 pr-8 text-sm font-semibold rounded-xl bg-[#a797cc] text-white">
                                        <span>{location.city_name}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveLocation(index)}
                                            className="absolute mr-1 right-0 top-0 mt-1"
                                        >
                                            <Image
                                                src="/assets/images/icons/close-filled.png"
                                                height={16}
                                                width={16}
                                                alt=""
                                            />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : null}
                </div>

                {shwoSubmitButton && (
                    <div className="px-10 mt-10">
                        <button
                            type="submit"
                            className="w-full py-4 bg-[#a797cc] text-white font-semibold rounded-xl hover:bg-orange-600"
                            disabled={locations.length === 0} // Disable button if no location selected
                        >
                            {loading ? <Loader color="#fff" height="30" /> : t('signup.tab34')}
                        </button>
                    </div>
                )}
            </form>
        </>
    );
};

export default GroupLocationForm;


