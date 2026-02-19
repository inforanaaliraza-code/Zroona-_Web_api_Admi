"use client";

import { EditProfileApi, UploadFileApi } from "@/app/api/setting";
import { useDataStore } from "@/app/api/store/store";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { NumberInput } from "@/components/ui/number-input";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "@/components/Loader/Loader";
import { BASE_API_URL } from "@/until";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getProfile } from "@/redux/slices/profileInfo";
import { Icon } from "@iconify/react";

export default function SignUp() {
  const { t, i18n } = useTranslation();
  const breadcrumbItems = [
    { label: t("breadcrumb.tab1"), href: "/" },
    { label: t("breadcrumb.tab3"), href: "/signup/edit" },
  ];
  const { push } = useRouter();
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const detail = useDataStore((store) => store.ProfileDetail);
  const { fetchProfileDetail } = useDataStore();

  const formik = useFormik({
    initialValues: {
      profile_image: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      country_code: "",
      email: "",
      gender: "",
      date_of_birth: "",
      description: "",
    },
    enableReinitialize: false, // We'll manually update values via useEffect
    onSubmit: (values) => {
      setLoading(true);
      const payload = {
        ...values,
      };
      EditProfileApi(payload)
        .then((res) => {
          setLoading(false);
          if (res.status === 1) {
            toast.success(res.message);
            // Refresh profile data in Redux store to update header and other components
            dispatch(getProfile()).then(() => {
              console.log("[EDIT-PROFILE] Profile refreshed in Redux store");
            });
            // Also refresh profile detail in Zustand store
            fetchProfileDetail().then(() => {
              console.log("[EDIT-PROFILE] Profile detail refreshed in Zustand store");
            });
            // Small delay to ensure data is refreshed before navigation
            setTimeout(() => {
              push("/");
            }, 1000);
          } else {
            toast.error(res.message);
          }
        })
        .catch((e) => {
          setLoading(false);
          console.error("[EDIT-PROFILE] Update error:", e);
          toast.error("An error occurred.");
        });
    },
  });

  useEffect(() => {
    fetchProfileDetail().then(() => {});
  }, [fetchProfileDetail]);

  // Track if description field exists in DB
  const [hasDescription, setHasDescription] = useState(false);

  // Update formik values when detail is loaded
  useEffect(() => {
    if (detail?.user) {
      const user = detail.user;
      
      console.log("[EDIT-PROFILE] User data loaded:", user);
      console.log("[EDIT-PROFILE] Profile image:", user.profile_image);
      
      // Update all form fields with user data
      formik.setFieldValue("profile_image", user.profile_image || "");
      formik.setFieldValue("first_name", user.first_name || "");
      formik.setFieldValue("last_name", user.last_name || "");
      formik.setFieldValue("phone_number", user.phone_number || "");
      formik.setFieldValue("country_code", user.country_code || "");
      formik.setFieldValue("email", user.email || "");
      formik.setFieldValue("gender", user.gender || "");
      
      // Handle date_of_birth safely
      if (user.date_of_birth) {
        const dob = user.date_of_birth;
        const dateStr = typeof dob === 'string' 
          ? dob.substring(0, 10) 
          : new Date(dob).toISOString().substring(0, 10);
        formik.setFieldValue("date_of_birth", dateStr);
      } else {
        formik.setFieldValue("date_of_birth", "");
      }
      
      // Check if description field exists in DB (not null, not undefined, not empty)
      const descriptionExists = user.hasOwnProperty('description') && user.description !== null && user.description !== undefined;
      setHasDescription(descriptionExists);
      
      if (descriptionExists) {
        formik.setFieldValue("description", user.description || "");
      }
      
      // Set profile image preview if exists - always update to reflect current DB value
      if (user.profile_image) {
        let imageUrl = user.profile_image;
        
        // Extract the API base URL (remove /api/ suffix)
        const apiBase = BASE_API_URL.replace(/\/api\/?$/, '');
        
        console.log("[EDIT-PROFILE] Processing profile_image from DB:", imageUrl);
        console.log("[EDIT-PROFILE] API Base URL:", apiBase);
        
        // Handle different URL formats
        if (imageUrl.startsWith('http://localhost:3000') || imageUrl.startsWith('https://localhost:3000')) {
          // Replace port 3000 with correct API base URL
          const apiBaseHost = apiBase.replace(/^https?:\/\//, '').split('/')[0];
          imageUrl = imageUrl.replace('localhost:3000', apiBaseHost);
          console.log("[EDIT-PROFILE] Fixed localhost:3000 to API base:", imageUrl);
        } else if (imageUrl.startsWith('/uploads/')) {
          // Relative path - prepend correct base URL
          imageUrl = `${apiBase}${imageUrl}`;
          console.log("[EDIT-PROFILE] Converted /uploads/ path:", imageUrl);
        } else if (imageUrl.includes('/uploads/')) {
          // Contains uploads path but might have wrong port
          const uploadsIndex = imageUrl.indexOf('/uploads/');
          imageUrl = `${apiBase}${imageUrl.substring(uploadsIndex)}`;
          console.log("[EDIT-PROFILE] Converted uploads/ substring:", imageUrl);
        } else if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://') && !imageUrl.startsWith('data:') && !imageUrl.startsWith('blob:')) {
          // Path without protocol - construct full URL
          if (imageUrl.startsWith('uploads/')) {
            imageUrl = `${apiBase}/${imageUrl}`;
            console.log("[EDIT-PROFILE] Constructed URL from uploads/:", imageUrl);
          } else {
            imageUrl = `${apiBase}/uploads/Zuroona/${imageUrl}`;
            console.log("[EDIT-PROFILE] Constructed URL with Zuroona folder:", imageUrl);
          }
        } else {
          console.log("[EDIT-PROFILE] Using URL as-is (absolute/blob):", imageUrl);
        }
        
        console.log("[EDIT-PROFILE] ✅ Final image URL set to previewUrl:", imageUrl);
        setPreviewUrl(imageUrl);
        // Also set in formik for form submission
        formik.setFieldValue("profile_image", user.profile_image);
      } else {
        // Clear preview if no image in DB
        console.log("[EDIT-PROFILE] ⚠️ No profile image found in user data");
        setPreviewUrl(null);
        formik.setFieldValue("profile_image", "");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail]);

  const uploadViaApi = async (file) => {
    // Use the UploadFileApi for local uploads
    const result = await UploadFileApi({ 
      file: file, 
      dirName: "Zuroona" 
    });
    
    if (result?.status === 1 && result?.data?.location) {
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
          // Convert relative path to absolute URL if needed
          let imageUrl = location;
          if (location && !location.includes("http://") && !location.includes("https://") && !location.startsWith("blob:")) {
            if (location.startsWith("/uploads/")) {
              const apiBase = BASE_API_URL.replace('/api/', '');
              imageUrl = `${apiBase}${location}`;
            } else if (location.includes("uploads/")) {
              const apiBase = BASE_API_URL.replace('/api/', '');
              const uploadsIndex = location.indexOf("uploads/");
              imageUrl = `${apiBase}/${location.substring(uploadsIndex)}`;
            }
          }
          
          console.log("[EDIT-PROFILE] Uploaded image location:", location);
          console.log("[EDIT-PROFILE] Constructed image URL:", imageUrl);
          
          formik.setFieldValue("profile_image", location); // Store original location for form submission
          setPreviewUrl(imageUrl); // Store full URL for immediate display
          setImageLoading(false);
          toast.success("Profile image uploaded successfully!");
        })
        .catch((error) => {
          console.error("[EDIT-PROFILE] Upload error:", error);
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

  const handleGenderSelect = (gender) => {
    console.log("[GENDER] Selecting gender:", gender);
    formik.setFieldValue("gender", String(gender));
    console.log("[GENDER] Formik gender value after set:", formik.values.gender);
  };

  return (
    <>
      <Header bgColor="#fff" />
      <Breadcrumbs items={breadcrumbItems} />
      <section className="bg-white py-16 ">
        <div className="container mx-auto px-4 md:px-8 lg:px-28">
          {loading ? (
            <div className="flex justify-center items-center">
              <Loader height="30" />
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <form
                onSubmit={formik.handleSubmit}
                className="lg:p-8 max-w-4xl w-full flex flex-col md:flex-row gap-x-6"
              >
                {/* Left Sidebar for Image Upload */}
                <div className="flex flex-col items-center bg-white h-max p-7 pt-5 rounded-xl mb-8 md:mb-0">
                  <div className="relative">
                    <div className="absolute right-2 top-2 z-10">
                      <Icon
                        icon="lucide:camera"
                        className="w-6 h-6 text-[#a797cc]"
                      />
                    </div>
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-3 bg-gray-200">
                      {imageLoading ? (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full">
                          <Loader height="30" />
                        </div>
                      ) : (
                        <>
                          {(previewUrl || formik.values.profile_image) ? (
                            <Image
                              key={`profile-img-${previewUrl || formik.values.profile_image}`}
                              src={(() => {
                                // Prefer previewUrl (already converted to full URL) over formik value
                                const imgPath = previewUrl || formik.values.profile_image;
                                console.log("[EDIT-PROFILE] Displaying image - previewUrl:", previewUrl, "formik.profile_image:", formik.values.profile_image, "imgPath:", imgPath);
                                
                                if (!imgPath) {
                                  console.log("[EDIT-PROFILE] No image path, using dummy");
                                  return "/assets/images/home/user-dummy.png";
                                }
                                
                                // If already absolute URL or blob, return as is
                                if (imgPath.includes("http://") || imgPath.includes("https://") || imgPath.startsWith("blob:")) {
                                  console.log("[EDIT-PROFILE] Using absolute/blob URL:", imgPath);
                                  return imgPath;
                                }
                                
                                // Convert relative path to absolute URL
                                let finalUrl = imgPath;
                                if (imgPath.startsWith("/uploads/")) {
                                  const apiBase = BASE_API_URL.replace('/api/', '');
                                  finalUrl = `${apiBase}${imgPath}`;
                                  console.log("[EDIT-PROFILE] Converted /uploads/ path:", finalUrl);
                                } else if (imgPath.includes("uploads/")) {
                                  const apiBase = BASE_API_URL.replace('/api/', '');
                                  const uploadsIndex = imgPath.indexOf("uploads/");
                                  finalUrl = `${apiBase}/${imgPath.substring(uploadsIndex)}`;
                                  console.log("[EDIT-PROFILE] Converted uploads/ path:", finalUrl);
                                } else {
                                  console.log("[EDIT-PROFILE] Using path as-is:", finalUrl);
                                }
                                
                                return finalUrl;
                              })()}
                              alt="Profile"
                              width={200}
                              height={200}
                              className="object-cover w-full h-full rounded-full"
                              style={{ minHeight: '100%', minWidth: '100%' }}
                              onLoad={() => {
                                console.log("[PROFILE-IMAGE] ✅ Image loaded successfully");
                              }}
                              onError={(e) => {
                                console.error("[PROFILE-IMAGE] ❌ Failed to load image:", {
                                  previewUrl,
                                  profile_image: formik.values.profile_image,
                                  attemptedUrl: e.target.src,
                                  error: e
                                });
                                // Fallback to default image
                                if (!e.target.src.includes("user-dummy.png")) {
                                  e.target.onerror = null;
                                  e.target.src = "/assets/images/home/user-dummy.png";
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-full">
                              <Icon
                                icon="lucide:camera"
                                className="w-12 h-12 text-[#a797cc] opacity-50"
                              />
                            </div>
                          )}
                          {!(previewUrl || formik.values.profile_image) && (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <Icon
                                icon="lucide:camera"
                                className="w-12 h-12 text-[#a797cc] opacity-50"
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <label className="bg-[#a797cc] text-sm text-white px-4 py-3 rounded-xl cursor-pointer">
                    {t("signup.tab20")}
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                {/* Form Section */}
                <div className="flex-grow bg-white h-max p-7 rounded-xl">
                  <h2 className="text-2xl font-semibold mb-6">
                    {t("signup.tab18")}
                  </h2>

                  {/* Name Input */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold">
                      {t("signup.tab2")}
                    </label>
                    <div className="relative mt-1">
                      <span
                        className={`absolute  flex items-center ${
                          i18n.language === "ar"
                            ? "inset-y-0 right-0 pr-3"
                            : "inset-y-0 left-0 pl-3"
                        }`}
                      >
                        <Icon
                          icon="lucide:user"
                          className="w-4 h-4 text-[#a797cc]"
                        />
                      </span>
                      <input
                        type="text"
                        name="first_name"
                        placeholder={t("signup.tab12")}
                        value={formik.values.first_name}
                        onChange={formik.handleChange}
                        className={`w-full ${
                          i18n.language === "ar" ? "pr-10" : "pl-10"
                        } py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm`}
                      />
                    </div>
                    {/* <p className="text-xs text-gray-500 mt-2">
                    Your name will be public on your Zuroona profile
                  </p> */}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold">
                      {t("signup.tab3")}
                    </label>
                    <div className="relative mt-1">
                      <span
                        className={`absolute  flex items-center ${
                          i18n.language === "ar"
                            ? "inset-y-0 right-0 pr-3"
                            : "inset-y-0 left-0 pl-3"
                        }`}
                      >
                        <Icon
                          icon="lucide:user"
                          className="w-4 h-4 text-[#a797cc]"
                        />
                      </span>
                      <input
                        type="text"
                        name="last_name"
                        placeholder={t("signup.tab13")}
                        value={formik.values.last_name}
                        onChange={formik.handleChange}
                        className={`w-full ${
                          i18n.language === "ar" ? "pr-10" : "pl-10"
                        } py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm`}
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold">
                      {t("signup.tab4")}
                    </label>
                    <div className="mt-1">
                      <NumberInput
                        formik={formik}
                        mobileNumberField="phone_number"
                        countryCodeField="country_code"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold">
                      {t("signup.tab5")}
                    </label>
                    <div className="relative mt-1">
                      <span
                        className={`absolute  flex items-center ${
                          i18n.language === "ar"
                            ? "inset-y-0 right-0 pr-3"
                            : "inset-y-0 left-0 pl-3"
                        }`}
                      >
                        <Icon
                          icon="lucide:mail"
                          className="w-4 h-4 text-[#a797cc]"
                        />
                      </span>
                      <input
                        type="text"
                        placeholder={t("signup.tab14")}
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        className={`w-full ${
                          i18n.language === "ar" ? "pr-10" : "pl-10"
                        } py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm`}
                      />
                    </div>
                  </div>

                  {/* Gender Selection - Read Only */}
                  <div className="mb-4 relative z-10">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      {t("signup.tab6")}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4 mt-1">
                      {["tab7", "tab8"].map((tab, index) => {
                        // Fetch translated text dynamically for gender labels
                        const gender = t(`signup.${tab}`);
                        const genderValue = String(index + 1);
                        const currentGender = String(formik.values.gender || "");
                        const isSelected = currentGender === genderValue;

                        // Define the mapping for gender text to icon names
                        const genderIconMap = {
                          ذكر: "lucide:user", // Arabic "ذكر" -> icon 'lucide:user'
                          أنثى: "lucide:user-round", // Arabic "أنثى" -> icon 'lucide:user-round'
                          كلاهما: "lucide:users", // Arabic "كلاهما" -> icon 'lucide:users'
                          Male: "lucide:user", // English "Male" -> icon 'lucide:user'
                          Female: "lucide:user-round", // English "Female" -> icon 'lucide:user-round'
                          Both: "lucide:users", // English "Both" -> icon 'lucide:users'
                        };

                        // Map the gender text to the icon name using genderIconMap
                        const iconName = genderIconMap[gender] || "lucide:user"; // Default to user icon
                        const iconSize = iconName === "lucide:users" ? "w-5 h-5" : "w-4 h-4";

                        return (
                          <div
                            key={`gender-${genderValue}-${gender}`}
                            className={`relative z-10 flex-1 gap-x-2 flex items-center justify-center py-3 px-4 border bg-gray-100 border-gray-300 rounded-xl text-gray-700 font-semibold text-sm ${
                              isSelected 
                                ? "bg-[#a797cc]/10 border-[#a797cc] text-[#a797cc]" 
                                : "opacity-60"
                            } cursor-not-allowed`}
                          >
                            <Icon
                              icon={iconName}
                              className={`${iconSize} ${isSelected ? "text-[#a797cc]" : "text-gray-500"} pointer-events-none select-none`}
                            />
                            <span className="ml-2 pointer-events-none select-none">{gender}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold">
                      {t("signup.tab10")}
                    </label>
                    <div className="relative mt-1">
                      {/* Calendar Icon */}
                      <span
                        className={`absolute flex items-center 
                        ${
                          i18n.language === "ar"
                            ? "inset-y-0 right-0 pr-3 hidden"
                            : "inset-y-0 left-0 pl-3"
                        }`}
                      >
                        <Icon
                          icon="lucide:calendar"
                          className="w-3 h-3 text-[#a797cc]"
                        />
                      </span>

                      {/* Date Input - Read Only */}
                      <input
                        type="text"
                        placeholder="Date of birth"
                        name="date_of_birth"
                        value={formik.values.date_of_birth ? new Date(formik.values.date_of_birth).toLocaleDateString() : ""}
                        readOnly
                        disabled
                        className={`w-full ${
                          i18n.language === "ar" ? "pl-5 pr-3" : "pl-10 pr-3"
                        } py-4 border bg-gray-100 border-gray-300 rounded-xl text-black placeholder:text-sm cursor-not-allowed`}
                      />
                    </div>
                  </div>

                  {/* Bio/Description - Only show if field exists in DB */}
                  {hasDescription && (
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-semibold">
                        {t("signup.tab15")}
                      </label>
                      <div className="relative mt-1">
                        <span
                          className={`absolute top-0  flex items-center ${
                            i18n.language === "ar"
                              ? "right-0 pr-3"
                              : "pl-3 left-0"
                          } pt-5`}
                        >
                          <Icon
                            icon="lucide:file-text"
                            className="w-3.5 h-3.5 text-[#a797cc]"
                          />
                        </span>
                        <textarea
                          placeholder={t("signup.tab15")}
                          name="description"
                          value={formik.values.description || ""}
                          onChange={formik.handleChange}
                          className={`w-full ${
                            i18n.language === "ar" ? "pr-10" : "pl-10"
                          } py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm`}
                          rows="3"
                        />
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="mt-10 px-10">
                    <button
                      type="submit"
                      className="w-full py-4 bg-[#a797cc] text-white font-semibold rounded-xl hover:bg-[#8ba179]"
                    >
                      {loading ? (
                        <Loader color="#fff" height="30" />
                      ) : (
                        t("signup.tab19")
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
