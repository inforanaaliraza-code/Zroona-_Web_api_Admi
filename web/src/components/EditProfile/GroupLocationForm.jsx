import { OrganizerUpdateProfileApi } from "@/app/api/setting";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Autocomplete from "react-google-autocomplete";
import { toast } from "react-toastify";

const GroupLocationForm = ({ handleFormSubmit, showStepImage, shwoSubmitButton }) => {
    const YOUR_GOOGLE_MAPS_API_KEY = "AIzaSyC6cKp791aygkeF6blRdhoWR0EEl8WwLTk";
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            group_location: [{
                longitude: "",
                latitude: "",
                city_name: ""
            }],
        },
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
            console.log(latitude, longitude, formatted_address, "data");
            formik.setFieldValue("group_location", [
                {
                    longitude: latitude,
                    latitude: longitude,
                    city_name: formatted_address
                }
            ]);
        } else {
            console.error("Location details are not available.");
        }
    };

    return (
        <>
            <div className="flex justify-between items-start gap-5">
                <div>
                    <h2 className="text-lg font-bold mb-3">
                        Where will your group be located?
                    </h2>
                    <p className="mb-4 text-gray-600 text-sm">
                        Meet-ly groups meet locally, in person and online. We&lsquo;ll
                        connect you with people in your area, and more can join
                        you online.
                    </p>
                </div>
                {showStepImage && (
                    <Image
                        src="/assets/images/icons/step-1.png"
                        height={58}
                        width={58}
                        alt=""
                    />
                )}
            </div>

            <form onSubmit={formik.handleSubmit}>
                <div className="relative">
                    <label className="block text-gray-700 text-sm font-semibold">
                        City
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
                        <Autocomplete
                            apiKey={YOUR_GOOGLE_MAPS_API_KEY}
                            style={{ width: "90%" }}
                            onPlaceSelected={handleSelect}
                            options={{
                                types: ["(regions)"],
                            }}
                            className="w-full pl-10 py-4 pr-4 border border-r-0 rounded-r-none bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm"
                        />
                        <span className="absolute inset-y-0 right-0 flex items-center px-5 bg-[#fdfdfd] border border-l-0 rounded-l-none border-[#f2dfba] rounded-xl">
                            <Image
                                src="/assets/images/icons/search-icon.png"
                                height={27}
                                width={27}
                                alt="Search icon"
                            />
                        </span>
                    </div>
                </div>

                {/* Display added locations */}
                {/* <div className="mt-4">
                    <h3 className="text-sm font-semibold mb-2">Selected Locations:</h3>
                    {formik.values.group_location.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-gray-700">
                            {formik.values.group_location.map((location, index) => (
                                <li key={index}>
                                    {location.city_name} (Lat: {location.latitude}, Lng: {location.longitude})
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm">No locations selected.</p>
                    )}
                </div> */}

                {shwoSubmitButton && (
                    <div className="px-10 mt-10">
                        <button
                            type="submit"
                            className="w-full py-4 bg-[#a797cc] text-white font-semibold rounded-xl hover:bg-orange-600"
                            disabled={formik.values.group_location.length === 0} // Disable button if no location selected
                        >
                            Next
                        </button>
                    </div>
                )}
            </form>
        </>
    );
};

export default GroupLocationForm;
