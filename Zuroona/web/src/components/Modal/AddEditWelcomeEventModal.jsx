"use client"

import Modal from '../common/Modal';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getEventListDetail } from '@/redux/slices/EventListDetail';
import { useFormik } from 'formik';
import { AddEventListApi, EditEventListApi, UploadFileApi } from '@/app/api/setting';
import * as Yup from "yup";
import { toast } from 'react-toastify';
import Loader from '../Loader/Loader';
import { DatePickerTime } from '@/components/ui/date-picker-time';
import { getCategoryEventList } from '@/redux/slices/CategoryEventList';
import { getEventList } from '@/redux/slices/EventList';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';

const AddEditWelcomeEventModal = ({ isOpen, onClose, eventId, eventpage, eventlimit }) => {
    const { t } = useTranslation();
    const [previewUrls, setPreviewUrls] = useState([]);
    const [eventImages, setEventImages] = useState([]);
    const [imageLoading, setImageLoading] = useState(false);
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [loading, setLoding] = useState(false);
    const [showCreateConfirm, setShowCreateConfirm] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [pendingPayload, setPendingPayload] = useState(null);
    const { CategoryEventList } = useSelector((state) => state.CategoryEventData || {});
    const { profile } = useSelector((state) => state.profileData || {});
    const EventListId = searchParams.get("id");
    const { EventListdetails = {}, loadingDetail } = useSelector(
        (state) => state.EventDetailData || {}
    );
    const maxEventCapacity = profile?.user?.max_event_capacity || 100; // Get max capacity from settings

    useEffect(() => {
        if (eventId) {
            dispatch(getEventListDetail({ id: eventId }));
        }
    }, [eventId, dispatch]);

    useEffect(() => {
        dispatch(getCategoryEventList({ page: page, limit: 20 }));
    }, [dispatch, page]);

    useEffect(() => {
        if (EventListId && EventListdetails?.event_images) {
            const images = Array.isArray(EventListdetails.event_images) 
                ? EventListdetails.event_images 
                : [EventListdetails.event_image].filter(Boolean);
            setEventImages(images);
            setPreviewUrls(images);
        }
    }, [EventListId, EventListdetails]);

    const formik = useFormik({
        initialValues: {
            event_date: EventListId ? EventListdetails?.event_date?.substr(0, 10) : "",
            event_start_time: EventListId ? EventListdetails?.event_start_time : "",
            event_end_time: EventListId ? EventListdetails?.event_end_time : "",
            event_name: EventListId ? EventListdetails?.event_name : "",
            event_description: EventListId ? EventListdetails?.event_description : "",
            event_address: EventListId ? EventListdetails?.event_address : "",
            no_of_attendees: EventListId ? EventListdetails?.no_of_attendees : 1,
            event_price: EventListId ? EventListdetails?.event_price : 0,
            event_type: EventListId ? EventListdetails?.event_type : 2,
            event_for: EventListId ? EventListdetails?.event_for : 3,
            event_category: EventListId ? (Array.isArray(EventListdetails?.event_category) ? EventListdetails?.event_category : [EventListdetails?.event_category].filter(Boolean)) : [],
            latitude: EventListId ? EventListdetails?.location?.coordinates?.[1] : "",
            longitude: EventListId ? EventListdetails?.location?.coordinates?.[0] : "",
            neighborhood: EventListId ? EventListdetails?.area_name || EventListdetails?.neighborhood : "",
        },
        validationSchema: Yup.object({
            event_date: Yup.string().required(t('signup.tab16')),
            event_start_time: Yup.string().required(t('signup.tab16')),
            event_end_time: Yup.string().required(t('signup.tab16')),
            event_name: Yup.string()
                .required(t('signup.tab16'))
                .min(3, 'Event title must be at least 3 characters')
                .max(200, 'Event title cannot exceed 200 characters'),
            event_description: Yup.string()
                .required(t('signup.tab16'))
                .min(20, 'Event description must be at least 20 characters')
                .max(1000, 'Event description cannot exceed 1000 characters'),
            event_address: Yup.string().required(t('signup.tab16')),
            no_of_attendees: Yup.number()
                .min(1, "Event capacity must be at least 1")
                .max(maxEventCapacity, `Event capacity cannot exceed ${maxEventCapacity} (your max event capacity setting)`)
                .required("This field is required"),
            event_price: Yup.number().required(t('signup.tab16')).positive(t('signup.tab16')),
            event_for: Yup.string()
                .required(t('signup.tab16'))
                .oneOf(['1', '2', '3'], t('signup.tab17')),
            event_category: Yup.array()
            .min(1, "Please select at least one category")
            .required(t('signup.tab16')),
        }),
        enableReinitialize: true,
        onSubmit: async (values, { resetForm }) => {
            if (eventImages.length === 0) {
                toast.error("Please upload at least one event image");
                return;
            }
            
            // If editing, proceed directly. If creating, show confirmation first
            if (EventListId) {
                await submitEvent(values, resetForm);
            } else {
                setPendingPayload({ values, resetForm });
                setShowCreateConfirm(true);
            }
        },
    });

    // Custom submit handler to validate and show toast on validation errors
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        // Manually validate the form
        const errors = await formik.validateForm();
        
        // Check for image requirement (not in Yup schema)
        if (eventImages.length === 0) {
            // Mark all fields as touched to show errors
            const allFields = Object.keys(formik.values);
            const touchedFields = {};
            allFields.forEach(field => {
                touchedFields[field] = true;
            });
            formik.setTouched(touchedFields);
            toast.error(t('events.imageRequired') || "Please upload at least one event image");
            return;
        }
        
        // If there are validation errors, show toast and mark fields as touched
        if (Object.keys(errors).length > 0) {
            // Mark all fields with errors as touched
            const touchedFields = {};
            Object.keys(errors).forEach(field => {
                touchedFields[field] = true;
            });
            formik.setTouched(touchedFields);
            
            // Show toast message
            toast.error(t('events.missingRequiredFields') || "Some required information or selection is missing. Please check the form and try again.");
            return;
        }
        
        // If validation passes, proceed with normal Formik submission
        formik.handleSubmit(e);
    };

    const submitEvent = async (valuesOrPayload, resetForm) => {
        const values = valuesOrPayload?.values || valuesOrPayload;
        const actualResetForm = valuesOrPayload?.resetForm || resetForm;
        
        setLoding(true);
        let payload;
        // Ensure event_category is an array
        const eventCategoryIds = Array.isArray(values.event_category) 
            ? values.event_category 
            : values.event_category ? [values.event_category] : [];

        const basePayload = {
            event_date: values.event_date,
            event_start_time: values.event_start_time,
            event_end_time: values.event_end_time,
            event_name: values.event_name,
            event_images: eventImages,
            event_description: values.event_description || '',
            event_address: values.event_address,
            event_type: Number(values.event_type),
            event_for: Number(values.event_for),
            event_category: eventCategoryIds,
            no_of_attendees: Number(values.no_of_attendees),
            event_price: Number(values.event_price),
            ...(values.latitude && values.longitude && {
                latitude: Number(values.latitude),
                longitude: Number(values.longitude),
            }),
            ...(values.neighborhood && {
                area_name: values.neighborhood, // Save area name from map
            }),
        };

        if (EventListId) {
            payload = {
                event_id: EventListId,
                ...basePayload,
            };
        } else {
            payload = basePayload;
        }
        
        if (EventListId) {
            EditEventListApi(payload).then((res) => {
                setLoding(false);
                if (res?.status == 1) {
                    toast.success(res?.message);
                    onClose();
                    dispatch(getEventListDetail({ id: EventListId }));
                }
                if (res.status == 0) {
                    toast.error(res?.message);
                }
            });
        } else {
            AddEventListApi(payload).then((res) => {
                setLoding(false);
                if (res?.status == 1) {
                    // Show success popup for new events
                    setShowSuccessPopup(true);
                    setShowCreateConfirm(false);
                    // Close modal and reset after a delay
                    setTimeout(() => {
                        onClose();
                        dispatch(getEventList({ event_type: 2, page: eventpage, limit: eventlimit }));
                        if (actualResetForm) actualResetForm();
                        setEventImages([]);
                        setPreviewUrls([]);
                        setShowSuccessPopup(false);
                    }, 3000);
                }
                if (res.status == 0) {
                    toast.error(res?.message);
                    setShowCreateConfirm(false);
                }
            });
        }
    };

    const handleFile = async (file) => {
        if (!file) return;
        
        if (eventImages.length >= 5) {
            toast.error("Maximum 5 images allowed");
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Only JPG, JPEG, PNG, and WebP files are allowed");
            return;
        }

        setImageLoading(true);
        
        try {
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setPreviewUrls(prev => [...prev, previewUrl]);

            // Upload to server
            const resp = await UploadFileApi({ file, dirName: "Zuroona" });
            
            if (resp?.status === 1 && resp?.data?.location) {
                setEventImages(prev => [...prev, resp.data.location]);
                toast.success("Image uploaded successfully");
            } else {
                throw new Error(resp?.message || "Upload failed");
            }
        } catch (error) {
            console.error("[EVENT-IMAGE-UPLOAD] Error:", error);
            toast.error(error?.message || "Image upload failed");
            // Remove preview URL on error
            setPreviewUrls(prev => prev.slice(0, -1));
        } finally {
            setImageLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        files.forEach(file => handleFile(file));
        // Reset input
        e.target.value = '';
    };

    const removeImage = (index) => {
        setEventImages(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => {
            const url = prev[index];
            if (url && url.startsWith('blob:') && typeof URL !== "undefined" && URL.revokeObjectURL) {
                try {
                    URL.revokeObjectURL(url);
                } catch (error) {
                    // Silently handle errors (e.g., URL already revoked)
                    console.warn("AddEditWelcomeEventModal: Error revoking object URL", error);
                }
            }
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleEventForSelect = (gender) => {
        formik.setFieldValue("event_for", gender);
    };

    return (
        <>
        <Modal isOpen={isOpen} onClose={onClose} width="xl">
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 text-center">
                    {EventListId ? t('add.tab21') || 'Edit Event' : t('add.tab18') || 'Create Event'}
                </h2>
                
                <form onSubmit={handleFormSubmit} className="space-y-6">

                {/* Calendar */}
                <div>
                    <DatePickerTime
                        date={formik.values.event_date}
                        onDateChange={(date) => {
                            formik.setFieldValue("event_date", date);
                            formik.setFieldTouched("event_date", true);
                        }}
                        dateLabel="Event Date"
                        dateId="event_date"
                        showDate={true}
                        showTime={false}
                        fullWidth={true}
                        minDate={new Date().toISOString().split('T')[0]}
                        dateError={formik.touched.event_date && !!formik.errors.event_date}
                        dateErrorMessage={formik.errors.event_date}
                        className="w-full"
                    />
                </div>

                {/* Time and Event Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold">
                            {t('add.tab1')}
                        </label>
                        <div className="relative mt-1">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-[1]">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#a797cc]/10 to-orange-50 border border-[#a797cc]/20 shadow-sm transition-all">
                                    <Image
                                        src="/assets/images/icons/time.png"
                                        height={18}
                                        width={18}
                                        alt="Start Time"
                                        className="opacity-80 transition-opacity"
                                    />
                                </div>
                            </span>
                            <input
                                type="time"
                                placeholder="Start Time"
                                {...formik.getFieldProps('event_start_time')}
                                className="relative z-[2] w-full pl-14 py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:border-transparent text-black placeholder:text-sm hover:border-[#a797cc]/30 transition-all shadow-sm"
                            />
                        </div>
                        {formik.touched.event_start_time && formik.errors.event_start_time ? (
                            <p className="text-red-500 text-xs mt-1 font-semibold">
                                {formik.errors.event_start_time}
                            </p>
                        ) : null}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold">
                            {t('add.tab2')}
                        </label>
                        <div className="relative mt-1">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-[1]">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#a797cc]/10 to-orange-50 border border-[#a797cc]/20 shadow-sm transition-all">
                                    <Image
                                        src="/assets/images/icons/time.png"
                                        height={18}
                                        width={18}
                                        alt="End Time"
                                        className="opacity-80 transition-opacity"
                                    />
                                </div>
                            </span>
                            <input
                                type="time"
                                placeholder="End Time"
                                {...formik.getFieldProps('event_end_time')}
                                className="relative z-[2] w-full pl-14 py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:border-transparent text-black placeholder:text-sm hover:border-[#a797cc]/30 transition-all shadow-sm"
                            />
                        </div>
                        {formik.touched.event_end_time && formik.errors.event_end_time ? (
                            <p className="text-red-500 text-xs mt-1 font-semibold">
                                {formik.errors.event_end_time}
                            </p>
                        ) : null}
                    </div>
                    <div className="col-span-full mb-4">
                        <label className="block text-gray-700 text-sm font-semibold">
                            {t('add.tab3')}
                        </label>
                        <div className="relative mt-1">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Image
                                    src="/assets/images/icons/event-name.png"
                                    height={22}
                                    width={22}
                                    alt=""
                                />
                            </span>
                            <input
                                type="text"
                                placeholder={t('add.tab3')}
                                {...formik.getFieldProps('event_name')}
                                maxLength={200}
                                className="w-full pl-10 py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                ({formik.values.event_name?.length || 0}/200 characters)
                            </p>
                        </div>
                        {formik.touched.event_name && formik.errors.event_name ? (
                            <p className="text-red-500 text-xs mt-1 font-semibold">
                                {formik.errors.event_name}
                            </p>
                        ) : null}
                    </div>
                    <div className='mb-4'>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                            {t('add.tab4')} ({previewUrls.length}/5)
                        </label>

                        {/* Image Preview Grid */}
                        {previewUrls.length > 0 && (
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                {previewUrls.map((url, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={url}
                                            alt={`Event image ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upload Box */}
                        {previewUrls.length < 5 && (
                            <div className="w-full cursor-pointer">
                                <div className="w-full h-36 border-2 border-dashed bg-[#fdfdfd] border-orange-300 rounded-lg flex items-center justify-center hover:border-orange-400 transition-colors">
                                    <label htmlFor="file-upload" className="flex justify-center flex-col items-center cursor-pointer w-full h-full">
                                        {imageLoading ? (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Loader />
                                            </div>
                                        ) : (
                                            <>
                                                <Image
                                                    src="/assets/images/icons/upload.png"
                                                    height={40}
                                                    width={40}
                                                    alt="Upload Icon"
                                                />
                                                <p className="text-gray-500 text-xs mt-2 font-medium">
                                                    {t('add.tab4')} (Max 5 images)
                                                </p>
                                            </>
                                        )}
                                    </label>
                                </div>
                                <input
                                    id="file-upload"
                                    onChange={handleImageChange}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    disabled={imageLoading || previewUrls.length >= 5}
                                />
                            </div>
                        )}
                        {eventImages.length === 0 && formik.touched.event_images && (
                            <p className="text-red-500 text-xs mt-1 font-semibold">
                                At least one image is required
                            </p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold">
                            {t('add.tab6')}
                        </label>
                        <div className="relative mt-1">
                            <span className="absolute top-0 left-0 flex items-center pl-3 pt-5">
                                <Image
                                    src="/assets/images/signup/bio.png"
                                    height={14}
                                    width={14}
                                    alt=""
                                />
                            </span>
                            <textarea
                                placeholder={t('add.tab6')}
                                {...formik.getFieldProps('event_description')}
                                maxLength={1000}
                                className="w-full pl-10 py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm"
                                rows="5"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                ({formik.values.event_description?.length || 0}/1000 characters)
                            </p>
                        </div>
                        {formik.touched.event_description && formik.errors.event_description ? (
                            <p className="text-red-500 text-xs mt-1 font-semibold">
                                {formik.errors.event_description}
                            </p>
                        ) : null}
                    </div>
                    <div className="col-span-full mb-4">
                        <label className="block text-gray-700 text-sm font-semibold">
                            {t('add.tab7')}
                        </label>
                        <div className="relative mt-1">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Image
                                    src="/assets/images/icons/location-pin.png"
                                    height={24}
                                    width={18}
                                    alt=""
                                />
                            </span>
                            <input
                                type="text"
                                placeholder={t('add.tab7')}
                                {...formik.getFieldProps('event_address')}
                                className="w-full pl-10 py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm"
                            />
                        </div>
                        {formik.touched.event_address && formik.errors.event_address ? (
                            <p className="text-red-500 text-xs mt-1 font-semibold">
                                {formik.errors.event_address}
                            </p>
                        ) : null}
                    </div>
                    <div className="col-span-full mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-3">
                            {t('add.tab8')} <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {CategoryEventList.length > 0 ? (
                                CategoryEventList.map((category) => {
                                    const selectedCategories = Array.isArray(formik.values.event_category) ? formik.values.event_category : [];
                                    const isSelected = selectedCategories.includes(category._id);
                                    return (
                                        <button
                                            key={category._id}
                                            type="button"
                                            onClick={() => {
                                                const currentCategories = Array.isArray(formik.values.event_category) ? formik.values.event_category : [];
                                                if (isSelected) {
                                                    formik.setFieldValue('event_category', currentCategories.filter(id => id !== category._id));
                                                } else {
                                                    formik.setFieldValue('event_category', [...currentCategories, category._id]);
                                                }
                                            }}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                                isSelected
                                                    ? 'bg-gradient-to-r from-[#a797cc] to-[#8ba179] text-white shadow-md shadow-[#a797cc]/30'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                                            }`}
                                        >
                                            {category.name}
                                        </button>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-gray-500">No Categories Available</p>
                            )}
                        </div>
                        {formik.touched.event_category && formik.errors.event_category ? (
                            <p className="text-red-500 text-xs mt-1 font-semibold">
                                {formik.errors.event_category}
                            </p>
                        ) : null}
                    </div>
                </div>

                <div className="mb-4 hidden">
                    <label className="block text-gray-700 text-sm font-semibold">{t('events.eventType', 'Event Type')}</label>
                    <div className="flex flex-col sm:flex-row gap-4 mt-1">
                        {['tab10', 'tab11', 'tab12'].map((tab, index) => {
                            const genderText = t(`add.${tab}`); // Dynamically fetch the translated text
                            const isSelected = formik.values.event_for === index + 1;

                            // Mapping of translated gender text to image filenames (including both Arabic and English mappings)
                            const genderImageMap = {
                                'ذكر': 'male',  // Arabic "ذكر" -> image 'male.png'
                                'أنثى': 'female', // Arabic "أنثى" -> image 'female.png'
                                'كلاهما': 'both', // Arabic "كلاهما" -> image 'both.png'
                                'Male': 'male',   // English "Male" -> image 'male.png'
                                'Female': 'female', // English "Female" -> image 'female.png'
                                'Both': 'both',   // English "Both" -> image 'both.png'
                            };

                            const imageFile = genderImageMap[genderText] || '';
                            const imageSize = imageFile === 'both' ? { width: 40, height: 40 } : { width: 15, height: 25 };

                            return (
                                <button
                                    key={tab}  // Use 'tab' value for the key
                                    type="button"
                                    className={`flex-1 flex items-center py-2 px-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl hover:bg-gray-100 text-gray-700 font-semibold text-sm ${isSelected ? 'bg-gray-200' : ''}`}
                                    onClick={() => handleEventForSelect(index + 1)}
                                >
                                    <div className={`w-[${imageSize.width}] h-[${imageSize.height}] flex items-center justify-center mr-2`}>
                                        <Image
                                            src={`/assets/images/signup/${imageFile}.png`}  // Dynamically reference the correct image based on gender
                                            height={40}
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
                    {formik.errors.event_for && formik.touched.event_for && (
                        <p className="text-red-500 text-xs mt-1 font-semibold">{formik.errors.event_for}</p>
                    )}
                </div>

                {/* Additional Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold">
                            {t('add.tab13')}
                        </label>
                        <div className="relative mt-1">

                            <input
                                type="number"
                                min="1"
                                max={maxEventCapacity}
                                placeholder={`Enter No. of Attendees (Max: ${maxEventCapacity})`}
                                {...formik.getFieldProps('no_of_attendees')}
                                className="w-full pl-10 py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm"
                            />
                            <p className="text-gray-500 text-xs mt-1">
                                {t('settings.maxCapacity') || `Maximum capacity: ${maxEventCapacity}`}
                            </p>
                        </div>
                        {formik.touched.no_of_attendees && formik.errors.no_of_attendees ? (
                            <p className="text-red-500 text-xs mt-1 font-semibold">
                                {formik.errors.no_of_attendees}
                            </p>
                        ) : null}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold">
                            {t('add.tab14')}
                        </label>
                        <div className="relative mt-1">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Image
                                    src="/assets/images/icons/amount.png"
                                    height={22}
                                    width={22}
                                    alt=""
                                />
                            </span>
                            <input
                                type="number"
                                placeholder="Enter Amount"
                                {...formik.getFieldProps('event_price')}
                                className="w-full pl-10 py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none text-black placeholder:text-sm"
                            />
                        </div>
                        {formik.touched.event_price && formik.errors.event_price ? (
                            <p className="text-red-500 text-xs mt-1 font-semibold">
                                {formik.errors.event_price}
                            </p>
                        )   : null}
                    </div>
                </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button 
                            type='submit' 
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                            disabled={formik.isSubmitting || loading || eventImages.length === 0}
                        >
                            {loading ? <Loader color="#fff" height="30" /> : (EventListId ? t('add.tab22') || t('add.tab21') || 'Update Event' : t('add.tab18') || 'Create Event')}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
        
        {/* Create Event Confirmation Modal */}
        {showCreateConfirm && (
            <Modal isOpen={showCreateConfirm} onClose={() => setShowCreateConfirm(false)} width="md">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#a797cc] to-[#8ba179] rounded-full flex items-center justify-center mb-4">
                        <Icon icon="lucide:alert-circle" className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {t('ConfirmCreateEvent') || 'Are you sure you want to create this event?'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {t('ConfirmCreateEventDesc') || 'Once submitted, your event will be reviewed by our team before being published.'}
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowCreateConfirm(false)}
                            className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                        >
                            {t('common.cancel') || 'Cancel'}
                        </button>
                        <button
                            onClick={() => {
                                if (pendingPayload) {
                                    submitEvent(pendingPayload.values, pendingPayload.resetForm);
                                }
                            }}
                            className="flex-1 py-3 px-6 bg-gradient-to-r from-[#a797cc] to-[#8ba179] text-white rounded-lg font-semibold hover:shadow-lg transition"
                        >
                            {t('common.yes') || 'Yes, Create Event'}
                        </button>
                    </div>
                </div>
            </Modal>
        )}

        {/* Success Popup - Event Submitted for Review */}
        {showSuccessPopup && (
            <Modal isOpen={showSuccessPopup} onClose={() => setShowSuccessPopup(false)} width="md">
                <div className="p-8 text-center">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                        <Icon icon="lucide:check-circle" className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {t('eventSubmitted') || 'Event Submitted for Review'}
                    </h3>
                
                    <p className="text-sm text-gray-500 mt-4">
                        {t('Check Email') || 'Please check your email for confirmation.'}
                    </p>
                </div>
            </Modal>
        )}
        </>
    );
};

export default AddEditWelcomeEventModal;
