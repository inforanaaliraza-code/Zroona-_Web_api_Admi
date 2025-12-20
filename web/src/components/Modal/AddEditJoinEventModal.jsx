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
import SelectDate from '../common/SelectDate';
import { getCategoryEventList } from '@/redux/slices/CategoryEventList';
import { getEventList } from '@/redux/slices/EventList';
import { useTranslation } from 'react-i18next';
import { getProfile } from '@/redux/slices/profileInfo';
import { format } from 'date-fns';
import { BASE_API_URL } from '@/until';

// Predefined Event Types
const EVENT_TYPES = [
    { value: 'conference', label: 'Conference' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'exhibition', label: 'Exhibition' },
    { value: 'concert', label: 'Concert' },
    { value: 'festival', label: 'Festival' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'webinar', label: 'Webinar' },
    { value: 'networking', label: 'Networking Event' },
    { value: 'corporate', label: 'Corporate Event' },
    { value: 'privateParty', label: 'Private Party' },
];

// Note: Event Categories are fetched from API (CategoryEventList) - see line 60 and 75

const AddEditJoinEventModal = ({ isOpen, onClose, eventId, eventpage, eventlimit }) => {
    const { t } = useTranslation();
    const [previewUrls, setPreviewUrls] = useState([]);
    const [eventImages, setEventImages] = useState([]);
    const [imageLoading, setImageLoading] = useState(false);
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [loading, setLoding] = useState(false);
    const { CategoryEventList = [] } = useSelector((state) => state.CategoryEventData || {});
    
    // Debug: Log category list
    useEffect(() => {
        console.log('[CATEGORY-DEBUG] CategoryEventList from Redux:', CategoryEventList);
        console.log('[CATEGORY-DEBUG] Is Array:', Array.isArray(CategoryEventList));
        console.log('[CATEGORY-DEBUG] Length:', CategoryEventList?.length);
    }, [CategoryEventList]);
    const { profile } = useSelector((state) => state.profileData || {});
    const EventListId = searchParams.get("id");
    const { EventListdetails = {}, loadingDetail } = useSelector(
        (state) => state.EventDetailData || {}
    );
    const hostGender = profile?.user?.gender; // 1 = male, 2 = female

    useEffect(() => {
        if (eventId) {
            dispatch(getEventListDetail({ id: eventId }));
        }
    }, [eventId, dispatch]);

    useEffect(() => {
        dispatch(getCategoryEventList({ page: page, limit: 20 }));
        dispatch(getProfile());
    }, [dispatch, page]);

    // Helper function to get proper image URL
    // Now supports both Cloudinary URLs and local storage URLs
    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/assets/images/dummyImage.png';
        
        // If blob URL (for preview), return as is
        if (imagePath.startsWith("blob:")) {
            return imagePath;
        }
        
        // If already absolute URL (http/https) - includes Cloudinary URLs
        if (imagePath.includes("http://") || imagePath.includes("https://")) {
            return imagePath;
        }
        
        // If Cloudinary URL format (res.cloudinary.com)
        if (imagePath.includes("res.cloudinary.com")) {
            return imagePath;
        }
        
        // Legacy: If relative path (starts with /uploads/), construct absolute URL
        // This is for backward compatibility with old local storage URLs
        const apiBase = BASE_API_URL.replace('/api/', '');
        
        if (imagePath.startsWith("/uploads/")) {
            return `${apiBase}${imagePath}`;
        }
        
        if (imagePath.includes("uploads/")) {
            const uploadsIndex = imagePath.indexOf("uploads/");
            return `${apiBase}/${imagePath.substring(uploadsIndex)}`;
        }
        
        if (imagePath.startsWith("/")) {
            return `${apiBase}${imagePath}`;
        }
        
        // Default fallback
        return '/assets/images/dummyImage.png';
    };

    useEffect(() => {
        if (EventListId && EventListdetails) {
            const images = Array.isArray(EventListdetails.event_images) && EventListdetails.event_images.length > 0
                ? EventListdetails.event_images 
                : EventListdetails.event_image 
                    ? [EventListdetails.event_image]
                    : [];
            
            if (images.length > 0) {
                setEventImages(images);
                // Convert server URLs to display URLs for preview
                setPreviewUrls(images.map(img => getImageUrl(img)));
            }
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
            event_type: EventListId ? EventListdetails?.event_type : 1,
            event_for: EventListId ? EventListdetails?.event_for : 3,
            event_category: EventListId ? (() => {
                // Get category values from event details
                const categories = Array.isArray(EventListdetails?.event_category) 
                    ? EventListdetails.event_category 
                    : (EventListdetails?.event_category ? [EventListdetails.event_category] : []);
                
                // Filter to only include valid ObjectIds (24 character hex strings)
                // This prevents old string values like "entertainment" from being included
                return categories
                    .filter(cat => {
                        if (!cat) return false;
                        // If it's an object with _id, use _id
                        if (typeof cat === 'object' && cat._id) {
                            return /^[0-9a-fA-F]{24}$/.test(String(cat._id));
                        }
                        // If it's a string, check if it's a valid ObjectId
                        if (typeof cat === 'string') {
                            return /^[0-9a-fA-F]{24}$/.test(cat);
                        }
                        return false;
                    })
                    .map(cat => {
                        // Normalize to string ID
                        if (typeof cat === 'object' && cat._id) return String(cat._id);
                        return String(cat);
                    });
            })() : [],
            event_types: EventListId ? (Array.isArray(EventListdetails?.event_types) ? EventListdetails?.event_types : (EventListdetails?.event_types ? [EventListdetails?.event_types] : [])) : [],
            dos_instruction: EventListId ? EventListdetails?.dos_instruction || "" : "",
            do_not_instruction: EventListId ? EventListdetails?.do_not_instruction || "" : "",
            latitude: EventListId ? (EventListdetails?.location?.coordinates?.[1] || "") : "",
            longitude: EventListId ? (EventListdetails?.location?.coordinates?.[0] || "") : "",
        },
        validationSchema: Yup.object({
            event_date: Yup.string()
                .required(t('common.required') || 'Event date is required')
                .test('future-date', 'Event date must be today or in the future', function(value) {
                    if (!value) return true;
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return selectedDate >= today;
                }),
            event_start_time: Yup.string()
                .required(t('common.required') || 'Start time is required'),
            event_end_time: Yup.string()
                .required(t('common.required') || 'End time is required')
                .test('after-start', t('events.endTimeAfterStart') || 'End time must be after start time', function(value) {
                    const { event_start_time, event_date } = this.parent;
                    if (!value || !event_start_time || !event_date) return true;
                    
                    // Convert time strings (HH:MM) to minutes for comparison
                    const timeToMinutes = (timeStr) => {
                        if (!timeStr || !timeStr.includes(':')) return 0;
                        const [hours, minutes] = timeStr.split(':').map(Number);
                        return hours * 60 + minutes;
                    };
                    
                    const startMinutes = timeToMinutes(event_start_time);
                    const endMinutes = timeToMinutes(value);
                    
                    // End time must be at least 1 minute after start time
                    return endMinutes > startMinutes;
                }),
            event_name: Yup.string()
                .required(t('common.required') || 'Event title is required')
                .min(3, 'Event title must be at least 3 characters')
                .max(100, 'Event title cannot exceed 100 characters'),
            event_description: Yup.string()
                .required(t('common.required') || 'Event description is required')
                .min(20, 'Event description must be at least 20 characters')
                .max(2000, 'Event description cannot exceed 2000 characters'),
            event_address: Yup.string()
                .required(t('common.required') || 'Event address is required')
                .min(5, 'Event address must be at least 5 characters'),
            no_of_attendees: Yup.number()
                .min(1, "Event capacity must be at least 1")
                .max(10, "Event capacity cannot exceed 10")
                .required("Event capacity is required")
                .integer("Event capacity must be a whole number"),
            event_price: Yup.number()
                .required(t('common.required') || 'Event price is required')
                .positive('Event price must be greater than 0')
                .min(1, 'Event price must be at least 1 SAR')
                .max(10000, 'Event price cannot exceed 10,000 SAR'),
            event_category: Yup.array()
                .min(1, "Please select at least one category")
                .required(t('common.required') || 'At least one category is required'),
            event_for: Yup.number()
                .required(t('common.required') || 'Event audience is required')
                .oneOf([1, 2, 3], 'Please select a valid event audience'),
            event_types: Yup.array()
                .min(1, "Please select at least one event type")
                .required(t('common.required') || 'At least one event type is required'),
            dos_instruction: Yup.string()
                .max(1000, 'Do\'s instructions cannot exceed 1000 characters'),
            do_not_instruction: Yup.string()
                .max(1000, 'Don\'ts instructions cannot exceed 1000 characters'),
            latitude: Yup.number()
                .nullable()
                .min(-90, 'Latitude must be between -90 and 90')
                .max(90, 'Latitude must be between -90 and 90'),
            longitude: Yup.number()
                .nullable()
                .min(-180, 'Longitude must be between -180 and 180')
                .max(180, 'Longitude must be between -180 and 180'),
        }),
        enableReinitialize: true,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            // Validate images
            if (eventImages.length === 0) {
                toast.error(t('events.imageRequired') || "Please upload at least one event image");
                setSubmitting(false);
                return;
            }

            // Validate end time is after start time
            if (values.event_start_time && values.event_end_time) {
                // Convert time strings (HH:MM) to minutes for comparison
                const timeToMinutes = (timeStr) => {
                    if (!timeStr || !timeStr.includes(':')) return 0;
                    const [hours, minutes] = timeStr.split(':').map(Number);
                    return hours * 60 + minutes;
                };
                
                const startMinutes = timeToMinutes(values.event_start_time);
                const endMinutes = timeToMinutes(values.event_end_time);
                
                if (endMinutes <= startMinutes) {
                    toast.error(t('events.endTimeAfterStart') || "End time must be after start time");
                    setSubmitting(false);
                    return;
                }
            }
            
            setLoding(true);
            setSubmitting(true);
            let payload;
            // Ensure event_category is an array and contains valid ObjectIds
            const eventCategoryIds = Array.isArray(values.event_category) 
                ? values.event_category.filter(cat => cat) // Filter out empty/null values
                : values.event_category ? [values.event_category] : [];

            // Validate that all category IDs are valid ObjectIds (24 character hex strings)
            const validCategoryIds = eventCategoryIds.filter(cat => {
                const isValid = typeof cat === 'string' && /^[0-9a-fA-F]{24}$/.test(cat);
                if (!isValid) {
                    console.warn('Invalid category ID:', cat);
                }
                return isValid;
            });

            if (validCategoryIds.length === 0 && eventCategoryIds.length > 0) {
                toast.error('Please select valid event categories');
                setLoding(false);
                setSubmitting(false);
                return;
            }

            // Ensure event_types is an array
            const eventTypesArray = Array.isArray(values.event_types) 
                ? values.event_types 
                : values.event_types ? [values.event_types] : [];

            console.log('[EVENT-SUBMIT] Category IDs being sent:', validCategoryIds);
            console.log('[EVENT-SUBMIT] Raw event_category values:', values.event_category);

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
                event_category: validCategoryIds,
                event_types: eventTypesArray,
                no_of_attendees: Number(values.no_of_attendees),
                event_price: Number(values.event_price),
                dos_instruction: values.dos_instruction || '',
                do_not_instruction: values.do_not_instruction || '',
                ...(values.latitude && values.longitude && {
                    latitude: Number(values.latitude),
                    longitude: Number(values.longitude),
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
            try {
                if (EventListId) {
                    const res = await EditEventListApi(payload);
                    setLoding(false);
                    setSubmitting(false);
                    if (res?.status == 1) {
                        toast.success(res?.message || t('events.eventUpdated') || 'Event updated successfully');
                        onClose();
                        dispatch(getEventListDetail({ id: EventListId }));
                        // Refresh event list
                        dispatch(getEventList({ event_type: 1, page: eventpage, limit: eventlimit }));
                    } else {
                        toast.error(res?.message || t('common.error') || 'Failed to update event');
                    }
                } else {
                    const res = await AddEventListApi(payload);
                    setLoding(false);
                    setSubmitting(false);
                    if (res?.status == 1) {
                        toast.success(res?.message || t('events.eventCreated') || 'Event created successfully');
                        onClose();
                        dispatch(getEventList({ event_type: 1, page: eventpage, limit: eventlimit }));
                        resetForm();
                        setEventImages([]);
                        setPreviewUrls([]);
                        setImageLoading(false);
                    } else {
                        toast.error(res?.message || t('common.error') || 'Failed to create event');
                    }
                }
            } catch (error) {
                console.error("[EVENT-SUBMIT] Error:", error);
                setLoding(false);
                setSubmitting(false);
                toast.error(error?.response?.data?.message || t('common.error') || 'An error occurred. Please try again.');
            }
        },
    });

    const handleFile = async (file) => {
        if (!file) return;
        
        if (eventImages.length >= 6) {
            toast.error("Maximum 6 images allowed");
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
            const resp = await UploadFileApi({ file, dirName: "Jeena" });
            
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
                    console.warn("AddEditJoinEventModal: Error revoking object URL", error);
                }
            }
            return prev.filter((_, i) => i !== index);
        });
    };

    const [activeSection, setActiveSection] = useState('basic');

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    formik.setFieldValue('latitude', position.coords.latitude.toFixed(6));
                    formik.setFieldValue('longitude', position.coords.longitude.toFixed(6));
                    toast.success('Location captured successfully!');
                },
                (error) => {
                    toast.error('Unable to get your location. Please enter manually.');
                    console.error('Geolocation error:', error);
                }
            );
        } else {
            toast.error('Geolocation is not supported by your browser.');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} width="2xl">
            <div className="space-y-6 max-h-[90vh] overflow-y-auto">
                {/* Enhanced Header */}
                <div className="sticky top-0 bg-white z-10 pb-4 border-b-2 border-gray-200">
                    <div className="mb-4">
                        <h2 className="text-3xl font-bold text-gray-900">
                            {EventListId ? t('add.tab21') || 'Edit Event' : t('add.tab1') || 'Create Event'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {EventListId ? 'Update your event details' : 'Fill in all the details to create an amazing event'}
                        </p>
                    </div>
                    
                    {/* Section Navigation Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {[
                            { id: 'basic', label: 'Basic Info' },
                            { id: 'details', label: 'Details' },
                            { id: 'location', label: 'Location' },
                            { id: 'instructions', label: 'Instructions' },
                        ].map((section) => (
                            <button
                                key={section.id}
                                type="button"
                                onClick={() => setActiveSection(section.id)}
                                className={`px-5 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                                    activeSection === section.id
                                        ? 'bg-[#a797cc] text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {section.label}
                            </button>
                        ))}
                    </div>
                </div>
                
                <form onSubmit={formik.handleSubmit} className="space-y-6">

                {/* Basic Information Section */}
                {activeSection === 'basic' && (
                    <div className="space-y-5 p-6 bg-white rounded-lg border border-gray-200">
                        <div className="mb-5">
                            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                        </div>

                        {/* Calendar */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <label className="block text-gray-700 text-sm font-semibold mb-3">
                                {t('detail.tab5') || 'Event Date'} <span className="text-red-500">*</span>
                            </label>
                            <SelectDate
                                selectedDate={formik.values.event_date}
                                onDateChange={(date) => {
                                    const formattedDate = typeof date === 'string' 
                                        ? date 
                                        : date instanceof Date 
                                            ? format(date, 'yyyy-MM-dd')
                                            : date;
                                    formik.setFieldValue("event_date", formattedDate);
                                    formik.setFieldTouched("event_date", true);
                                }}
                            />
                            {formik.touched.event_date && formik.errors.event_date ? (
                                <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {formik.errors.event_date}
                                </p>
                            ) : null}
                            {formik.values.event_date && !formik.errors.event_date && (
                                <p className="text-green-600 text-xs mt-2 font-medium flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    {(() => {
                                        // Try to get translation, with fallback if key is returned as-is
                                        let translated = t('events.selectedDate');
                                        // If translation returns the key itself, it means translation wasn't found
                                        if (translated === 'events.selectedDate') {
                                          translated = t('add.selectedDate');
                                          if (translated === 'add.selectedDate') {
                                            translated = 'Selected date';
                                          }
                                        }
                                        return `${translated}: ${formik.values.event_date}`;
                                      })()}
                                </p>
                            )}
                        </div>

                        {/* Time Selection */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">
                                    {t('eventTime') || 'Event Start Time'} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-[1]">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#a797cc]/10 to-orange-50 border border-[#a797cc]/20 shadow-sm group-hover:shadow-md transition-all">
                                            <Image
                                                src="/assets/images/icons/time.png"
                                                height={18}
                                                width={18}
                                                alt="Start Time"
                                                className="opacity-80 group-hover:opacity-100 transition-opacity"
                                            />
                                        </div>
                                    </span>
                                    <input
                                        type="time"
                                        {...formik.getFieldProps('event_start_time')}
                                        onChange={(e) => {
                                            formik.setFieldValue('event_start_time', e.target.value);
                                            if (formik.values.event_end_time) {
                                                setTimeout(() => {
                                                    formik.validateField('event_end_time');
                                                }, 100);
                                            }
                                        }}
                                        className="relative z-[2] w-full pl-14 pr-4 py-3 border bg-white border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:border-transparent text-gray-900 text-sm transition-all cursor-pointer shadow-sm hover:border-[#a797cc]/30"
                                    />
                                </div>
                                {formik.touched.event_start_time && formik.errors.event_start_time ? (
                                    <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {formik.errors.event_start_time}
                                    </p>
                                ) : null}
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">
                                    {t('add.tab13') || 'Event End Time'} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-[1]">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#a797cc]/10 to-orange-50 border border-[#a797cc]/20 shadow-sm group-hover:shadow-md transition-all">
                                            <Image
                                                src="/assets/images/icons/time.png"
                                                height={18}
                                                width={18}
                                                alt="End Time"
                                                className="opacity-80 group-hover:opacity-100 transition-opacity"
                                            />
                                        </div>
                                    </span>
                                    <input
                                        type="time"
                                        {...formik.getFieldProps('event_end_time')}
                                        min={formik.values.event_start_time ? (() => {
                                            if (formik.values.event_start_time) {
                                                const [hours, minutes] = formik.values.event_start_time.split(':').map(Number);
                                                const totalMinutes = hours * 60 + minutes + 1;
                                                const minHours = Math.floor(totalMinutes / 60);
                                                const minMins = totalMinutes % 60;
                                                return `${String(minHours).padStart(2, '0')}:${String(minMins).padStart(2, '0')}`;
                                            }
                                            return undefined;
                                        })() : undefined}
                                        onChange={(e) => {
                                            formik.setFieldValue('event_end_time', e.target.value);
                                            setTimeout(() => {
                                                formik.validateField('event_end_time');
                                            }, 100);
                                        }}
                                        className="relative z-[2] w-full pl-14 pr-4 py-3 border bg-white border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:border-transparent text-gray-900 text-sm transition-all cursor-pointer shadow-sm hover:border-[#a797cc]/30"
                                    />
                                </div>
                                {formik.touched.event_end_time && formik.errors.event_end_time ? (
                                    <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {formik.errors.event_end_time}
                                    </p>
                                ) : null}
                            </div>
                        </div>

                        {/* Event Title */}
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                {t('add.tab2') || 'Event Title'} <span className="text-red-500">*</span>
                                <span className="text-gray-400 text-xs font-normal ml-2">
                                    ({formik.values.event_name?.length || 0}/100 characters)
                                </span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Image
                                        src="/assets/images/icons/event-name.png"
                                        height={20}
                                        width={20}
                                        alt="Event Title"
                                    />
                                </span>
                                <input
                                    type="text"
                                    placeholder={t('add.tab2') || 'Enter event title'}
                                    {...formik.getFieldProps('event_name')}
                                    maxLength={100}
                                    className="w-full pl-10 pr-4 py-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:border-transparent text-gray-900 placeholder:text-gray-400 text-sm transition-all"
                                />
                            </div>
                            {formik.touched.event_name && formik.errors.event_name ? (
                                <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {formik.errors.event_name}
                                </p>
                            ) : null}
                        </div>
                        {/* Event Images */}
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                {t('add.tab4') || 'Event Images'} <span className="text-red-500">*</span>
                                <span className="text-gray-400 text-xs font-normal ml-2">
                                    ({previewUrls.length}/6 uploaded)
                                </span>
                            </label>
                            
                            {/* Image Preview Grid */}
                            {previewUrls.length > 0 && (
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    {previewUrls.map((url, index) => (
                                        <div key={index} className="relative group">
                                            <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-300 bg-gray-100">
                                                <img
                                                    src={getImageUrl(url)}
                                                    alt={`Event image ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = "/assets/images/dummyImage.png";
                                                        e.target.onerror = null;
                                                    }}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold z-10"
                                                title="Remove"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Upload Box */}
                            {previewUrls.length < 6 && (
                                <div className="w-full cursor-pointer">
                                    <div className="w-full h-40 border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg flex items-center justify-center hover:border-[#a797cc] hover:bg-gray-100 transition-all">
                                        <label htmlFor="file-upload" className="flex justify-center flex-col items-center cursor-pointer w-full h-full py-4">
                                            {imageLoading ? (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Loader />
                                                </div>
                                            ) : (
                                                <>
                                                    <Image
                                                        src="/assets/images/icons/upload.png"
                                                        height={32}
                                                        width={32}
                                                        alt="Upload Icon"
                                                        className="mb-2 opacity-60"
                                                    />
                                                    <p className="text-gray-600 text-sm font-medium">
                                                        {t('add.tab4') || 'Event Images'}
                                                    </p>
                                                    <p className="text-gray-400 text-xs mt-1">
                                                        Max 6 images
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
                                        disabled={imageLoading || previewUrls.length >= 6}
                                    />
                                </div>
                            )}
                            {eventImages.length === 0 && formik.touched.event_images && (
                                <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    At least one image is required
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Details Section */}
                {activeSection === 'details' && (
                    <div className="space-y-5 p-6 bg-white rounded-lg border border-gray-200">
                        <div className="mb-5">
                            <h3 className="text-lg font-semibold text-gray-900">Event Details</h3>
                        </div>

                        {/* Event Description */}
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                {t('add.tab3') || 'Event Description'} <span className="text-red-500">*</span>
                                <span className="text-gray-400 text-xs font-normal ml-2">
                                    ({formik.values.event_description?.length || 0}/2000 characters)
                                </span>
                            </label>
                            <div className="relative">
                                <span className="absolute top-0 left-0 flex items-start pl-3 pt-3 pointer-events-none">
                                    <Image
                                        src="/assets/images/signup/bio.png"
                                        height={16}
                                        width={16}
                                        alt="Description"
                                    />
                                </span>
                                <textarea
                                    placeholder={t('add.tab3') || 'Describe your event...'}
                                    {...formik.getFieldProps('event_description')}
                                    maxLength={2000}
                                    className="w-full pl-10 pr-4 py-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:border-transparent text-gray-900 placeholder:text-gray-400 text-sm transition-all resize-y"
                                    rows="6"
                                />
                            </div>
                            {formik.touched.event_description && formik.errors.event_description ? (
                                <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {formik.errors.event_description}
                                </p>
                            ) : null}
                        </div>

                        {/* Event Types */}
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                {t('add.tab55') || t('detail.tab55') || 'Event Types'} <span className="text-red-500">*</span>
                                <span className="text-gray-400 text-xs font-normal ml-2">
                                    (Select multiple)
                                </span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-start pl-3 pt-3 pointer-events-none z-10">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                </div>
                                <select
                                    multiple
                                    value={Array.isArray(formik.values.event_types) ? formik.values.event_types : []}
                                    onChange={(e) => {
                                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                                        formik.setFieldValue('event_types', selected);
                                    }}
                                    className="w-full pl-10 py-4 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] text-gray-900 text-sm min-h-[120px]"
                                    size={Math.min(EVENT_TYPES.length, 5)}
                                >
                                    {EVENT_TYPES.map((type) => {
                                        const translationKey = `add.eventTypes.${type.value}`;
                                        const translated = t(translationKey);
                                        const displayText = translated !== translationKey ? translated : type.label;
                                        return (
                                            <option key={type.value} value={type.value}>
                                                {displayText}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                Hold Ctrl (Windows) or Cmd (Mac) to select multiple event types
                            </p>
                            {formik.touched.event_types && formik.errors.event_types ? (
                                <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {formik.errors.event_types}
                                </p>
                            ) : null}
                        </div>

                        {/* Event Category */}
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                {t('add.tab8') || t('add.tab56') || 'Event Categories'} <span className="text-red-500">*</span>
                                <span className="text-gray-400 text-xs font-normal ml-2">
                                    (Select multiple)
                                </span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-start pl-3 pt-3 pointer-events-none z-10">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                </div>
                                <select
                                    multiple
                                    value={Array.isArray(formik.values.event_category) ? formik.values.event_category : []}
                                    onChange={(e) => {
                                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                                        formik.setFieldValue('event_category', selected);
                                    }}
                                    className="w-full pl-10 py-4 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] text-gray-900 text-sm min-h-[120px]"
                                    size={Math.min((CategoryEventList || []).length || 5, 5)}
                                >
                                    {CategoryEventList && Array.isArray(CategoryEventList) && CategoryEventList.length > 0 ? (
                                        CategoryEventList.map((category) => {
                                            // Use category._id as value (must be ObjectId string)
                                            const categoryId = category._id || category.id;
                                            if (!categoryId) {
                                                console.warn('Category missing _id:', category);
                                                return null;
                                            }
                                            return (
                                                <option key={categoryId} value={categoryId}>
                                                    {category.name || category.category_name || 'Unnamed Category'}
                                                </option>
                                            );
                                        }).filter(Boolean) // Remove any null entries
                                    ) : (
                                        <option disabled>Loading categories...</option>
                                    )}
                                </select>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                Hold Ctrl (Windows) or Cmd (Mac) to select multiple categories
                            </p>
                            {formik.touched.event_category && formik.errors.event_category ? (
                                <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {formik.errors.event_category}
                                </p>
                            ) : null}
                        </div>

                        {/* Event For (Audience) */}
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-3">
                                {t('add.tab6') || 'Event For'} <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { value: 1, label: t('signup.tab7') || 'Male', icon: 'male' },
                                    { value: 2, label: t('signup.tab8') || 'Female', icon: 'female' },
                                    { value: 3, label: t('signup.tab9') || 'Both', icon: 'both' }
                                ].map((option) => {
                                    const isSelected = formik.values.event_for === option.value;
                                    const isDisabled = hostGender && (
                                        (hostGender === 1 && option.value === 2) ||
                                        (hostGender === 2 && option.value === 1)
                                    );

                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            disabled={isDisabled}
                                            onClick={() => !isDisabled && formik.setFieldValue('event_for', option.value)}
                                            className={`relative flex flex-col items-center justify-center p-5 border-2 rounded-xl transition-all duration-200 ${
                                                isSelected
                                                    ? 'bg-gradient-to-br from-[#a797cc] to-orange-600 border-[#a797cc] text-white shadow-lg shadow-[#a797cc]/30'
                                                    : 'bg-white border-gray-300 text-gray-700 hover:border-[#a797cc]/50 hover:bg-orange-50'
                                            } ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02]'}`}
                                            title={isDisabled ? (hostGender === 1 ? "Male hosts cannot create female-only events" : "Female hosts cannot create male-only events") : ""}
                                        >
                                            {/* Icon */}
                                            <div className={`mb-3 flex items-center justify-center w-12 h-12 rounded-full ${
                                                isSelected 
                                                    ? 'bg-white/20' 
                                                    : 'bg-gray-100'
                                            }`}>
                                                <Image
                                                    src={`/assets/images/signup/${option.icon}.png`}
                                                    height={option.icon === 'both' ? 28 : 20}
                                                    width={option.icon === 'both' ? 28 : 20}
                                                    alt={option.label}
                                                    className="object-contain"
                                                />
                                            </div>
                                            
                                            {/* Label */}
                                            <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                                                {option.label}
                                            </span>
                                            
                                            {/* Selected Indicator */}
                                            {isSelected && (
                                                <div className="absolute top-2 right-2">
                                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                            {formik.errors.event_for && formik.touched.event_for && (
                                <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {formik.errors.event_for}
                                </p>
                            )}
                        </div>

                        {/* Event Price - Professional Enhanced Design */}
                        <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6 rounded-2xl border-2 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#a797cc] to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                                    <Image
                                        src="/assets/images/icons/amount.png"
                                        height={24}
                                        width={24}
                                        alt="Price"
                                        className="filter brightness-0 invert"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-800 text-base font-bold">
                                        {t('add.tab14') || 'Event Price'} <span className="text-red-500">*</span>
                                    </label>
                                    <p className="text-gray-500 text-xs mt-0.5">Enter the price per person in SAR</p>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-orange-200">
                                        <span className="text-orange-600 font-bold text-sm">ر.س</span>
                                    </div>
                                </div>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    {...formik.getFieldProps('event_price')}
                                    min="1"
                                    max="10000"
                                    step="0.01"
                                    className="w-full pl-16 pr-20 py-4 bg-white border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-[#a797cc] text-gray-900 placeholder:text-gray-400 font-semibold text-base shadow-sm hover:border-orange-300 transition-all"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                    <div className="bg-gradient-to-r from-[#a797cc] to-orange-600 text-white font-bold px-4 py-2 rounded-lg shadow-sm">
                                        SAR
                                    </div>
                                </div>
                            </div>
                            {formik.touched.event_price && formik.errors.event_price ? (
                                <div className="mt-3 bg-red-50 border-l-4 border-red-500 p-3 rounded-lg">
                                    <p className="text-red-700 text-sm font-medium flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {formik.errors.event_price}
                                    </p>
                                </div>
                            ) : formik.values.event_price && formik.values.event_price > 0 ? (
                                <div className="mt-3 bg-green-50 border-l-4 border-green-500 p-3 rounded-lg">
                                    <p className="text-green-700 text-sm font-medium flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Price set: {formik.values.event_price} SAR per person
                                    </p>
                                </div>
                            ) : null}
                        </div>

                        {/* Event Duration and Capacity - Professional Enhanced Design */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            {/* Event Duration */}
                            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-2xl border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                                        <Image
                                            src="/assets/images/icons/time.png"
                                            height={24}
                                            width={24}
                                            alt="Duration"
                                            className="filter brightness-0 invert"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-800 text-base font-bold">
                                            Event Duration <span className="text-red-500">*</span>
                                        </label>
                                        <p className="text-gray-500 text-xs mt-0.5">Calculated from start and end time</p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-blue-200">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        value={(() => {
                                            if (formik.values.event_start_time && formik.values.event_end_time) {
                                                const start = formik.values.event_start_time.split(':').map(Number);
                                                const end = formik.values.event_end_time.split(':').map(Number);
                                                const startMinutes = start[0] * 60 + start[1];
                                                const endMinutes = end[0] * 60 + end[1];
                                                const durationMinutes = endMinutes - startMinutes;
                                                
                                                if (durationMinutes <= 0) return '';
                                                
                                                const hours = Math.floor(durationMinutes / 60);
                                                const minutes = durationMinutes % 60;
                                                
                                                if (hours > 0 && minutes > 0) {
                                                    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
                                                } else if (hours > 0) {
                                                    return `${hours} hour${hours > 1 ? 's' : ''}`;
                                                } else {
                                                    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
                                                }
                                            }
                                            return '';
                                        })()}
                                        readOnly
                                        placeholder="Duration will be calculated automatically"
                                        className="w-full pl-16 pr-4 py-4 bg-white border-2 border-blue-200 rounded-xl text-gray-700 font-semibold text-base shadow-sm cursor-not-allowed"
                                    />
                                </div>
                                {!formik.values.event_start_time || !formik.values.event_end_time ? (
                                    <div className="mt-3 bg-blue-50 border-l-4 border-blue-500 p-3 rounded-lg">
                                        <p className="text-blue-700 text-sm font-medium flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                            Please select start and end time to see duration
                                        </p>
                                    </div>
                                ) : formik.values.event_start_time && formik.values.event_end_time ? (
                                    <div className="mt-3 bg-green-50 border-l-4 border-green-500 p-3 rounded-lg">
                                        <p className="text-green-700 text-sm font-medium flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Duration calculated successfully
                                        </p>
                                    </div>
                                ) : null}
                            </div>

                            {/* Event Capacity */}
                            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6 rounded-2xl border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <label className="block text-gray-800 text-base font-bold">
                                            {t('add.tab10') || 'Event Capacity'} <span className="text-red-500">*</span>
                                        </label>
                                        <p className="text-gray-500 text-xs mt-0.5">Select maximum number of attendees</p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-green-200">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <select
                                        {...formik.getFieldProps('no_of_attendees')}
                                        className="w-full pl-16 pr-12 py-4 bg-white border-2 border-green-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 text-gray-900 font-semibold text-base shadow-sm hover:border-green-300 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Capacity</option>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                            <option key={num} value={num}>
                                                {num} {num === 1 ? 'person' : 'people'}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                {formik.touched.no_of_attendees && formik.errors.no_of_attendees ? (
                                    <div className="mt-3 bg-red-50 border-l-4 border-red-500 p-3 rounded-lg">
                                        <p className="text-red-700 text-sm font-medium flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {formik.errors.no_of_attendees}
                                        </p>
                                    </div>
                                ) : formik.values.no_of_attendees && formik.values.no_of_attendees > 0 ? (
                                    <div className="mt-3 bg-green-50 border-l-4 border-green-500 p-3 rounded-lg">
                                        <p className="text-green-700 text-sm font-medium flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Capacity set: {formik.values.no_of_attendees} {formik.values.no_of_attendees === 1 ? 'person' : 'people'}
                                        </p>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                )}

                {/* Location Section */}
                {activeSection === 'location' && (
                    <div className="space-y-5 p-6 bg-white rounded-lg border border-gray-200">
                        <div className="mb-5">
                            <h3 className="text-lg font-semibold text-gray-900">Event Location</h3>
                        </div>

                        {/* Event Address */}
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                {t('add.tab7') || 'Event Address'} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Image
                                        src="/assets/images/icons/location-pin.png"
                                        height={20}
                                        width={20}
                                        alt="Location"
                                    />
                                </span>
                                <input
                                    type="text"
                                    placeholder={t('add.tab7') || 'Enter event address'}
                                    {...formik.getFieldProps('event_address')}
                                    className="w-full pl-10 pr-4 py-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:border-transparent text-gray-900 placeholder:text-gray-400 text-sm transition-all"
                                />
                            </div>
                            {formik.touched.event_address && formik.errors.event_address ? (
                                <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {formik.errors.event_address}
                                </p>
                            ) : null}
                        </div>

                        {/* Location Coordinates */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-gray-700 text-sm font-semibold">
                                    Location Coordinates (Optional)
                                </label>
                                <button
                                    type="button"
                                    onClick={handleGetCurrentLocation}
                                    className="text-xs bg-[#a797cc] hover:bg-[#8ba179] text-white px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Get Current Location
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mb-3">
                                Optional: Add coordinates for map integration
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-gray-600 text-xs font-medium mb-1">
                                        Latitude
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="24.7136"
                                        {...formik.getFieldProps('latitude')}
                                        step="any"
                                        min="-90"
                                        max="90"
                                        className="w-full px-3 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:border-transparent text-gray-900 text-sm"
                                    />
                                    {formik.touched.latitude && formik.errors.latitude ? (
                                        <p className="text-red-500 text-xs mt-1">{formik.errors.latitude}</p>
                                    ) : null}
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-xs font-medium mb-1">
                                        Longitude
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="46.6753"
                                        {...formik.getFieldProps('longitude')}
                                        step="any"
                                        min="-180"
                                        max="180"
                                        className="w-full px-3 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:border-transparent text-gray-900 text-sm"
                                    />
                                    {formik.touched.longitude && formik.errors.longitude ? (
                                        <p className="text-red-500 text-xs mt-1">{formik.errors.longitude}</p>
                                    ) : null}
                                </div>
                            </div>
                            {(formik.values.latitude && formik.values.longitude) && (
                                <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Location coordinates saved
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Instructions Section */}
                {activeSection === 'instructions' && (
                    <div className="space-y-5 p-6 bg-white rounded-lg border border-gray-200">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Event Instructions</h3>
                            <p className="text-xs text-gray-500 mt-1">Optional: Add guidelines for attendees</p>
                        </div>

                        {/* Do's Instructions */}
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                Do's
                                <span className="text-gray-400 text-xs font-normal ml-2">
                                    ({formik.values.dos_instruction?.length || 0}/1000 characters)
                                </span>
                            </label>
                            <div className="relative">
                                <textarea
                                    placeholder="Enter guidelines for attendees..."
                                    {...formik.getFieldProps('dos_instruction')}
                                    maxLength={1000}
                                    className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:border-[#a797cc] text-gray-900 placeholder:text-gray-400 text-sm transition-all resize-y"
                                    rows="6"
                                />
                            </div>
                            {formik.touched.dos_instruction && formik.errors.dos_instruction ? (
                                <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {formik.errors.dos_instruction}
                                </p>
                            ) : null}
                        </div>

                        {/* Don'ts Instructions */}
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                Don'ts
                                <span className="text-gray-400 text-xs font-normal ml-2">
                                    ({formik.values.do_not_instruction?.length || 0}/1000 characters)
                                </span>
                            </label>
                            <div className="relative">
                                <textarea
                                    placeholder="Enter restrictions or prohibited items..."
                                    {...formik.getFieldProps('do_not_instruction')}
                                    maxLength={1000}
                                    className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:border-[#a797cc] text-gray-900 placeholder:text-gray-400 text-sm transition-all resize-y"
                                    rows="6"
                                />
                            </div>
                            {formik.touched.do_not_instruction && formik.errors.do_not_instruction ? (
                                <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {formik.errors.do_not_instruction}
                                </p>
                            ) : null}
                        </div>
                    </div>
                )}

                    {/* Navigation and Submit Section */}
                    <div className="sticky bottom-0 bg-white pt-6 border-t-2 border-gray-200 mt-8">
                        {/* Section Navigation */}
                        <div className="flex justify-between items-center mb-4">
                            <button
                                type="button"
                                onClick={() => {
                                    const sections = ['basic', 'details', 'location', 'instructions'];
                                    const currentIndex = sections.indexOf(activeSection);
                                    if (currentIndex > 0) {
                                        setActiveSection(sections[currentIndex - 1]);
                                    }
                                }}
                                disabled={activeSection === 'basic' || !activeSection}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Previous
                            </button>
                            <div className="flex gap-1">
                                {['basic', 'details', 'location', 'instructions'].map((section, index) => (
                                    <div
                                        key={section}
                                        className={`w-2 h-2 rounded-full ${
                                            activeSection === section || (!activeSection && index === 0)
                                                ? 'bg-[#a797cc] w-6'
                                                : 'bg-gray-300'
                                        } transition-all`}
                                    />
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    const sections = ['basic', 'details', 'location', 'instructions'];
                                    const currentIndex = sections.indexOf(activeSection);
                                    if (currentIndex < sections.length - 1) {
                                        setActiveSection(sections[currentIndex + 1]);
                                    }
                                }}
                                disabled={activeSection === 'instructions'}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                Next
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-3">
                            <button 
                                type='button'
                                onClick={onClose}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3.5 px-6 rounded-lg transition-all"
                            >
                                {t('delete.tab4') || 'Cancel'}
                            </button>
                            <button 
                                type='submit' 
                                className="flex-1 bg-[#a797cc] hover:bg-[#8ba179] text-white font-semibold py-3.5 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
                                disabled={formik.isSubmitting || loading || eventImages.length === 0}
                            >
                                {loading || formik.isSubmitting ? (
                                    <>
                                        <Loader color="#fff" height="20" width="20" />
                                        <span>{EventListId ? t('common.updating') || 'Updating...' : t('common.creating') || 'Creating...'}</span>
                                    </>
                                ) : (
                                    <>
                                        {EventListId ? (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {t('add.tab22') || t('add.tab21') || 'Update Event'}
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                {t('add.tab1') || 'Create Event'}
                                            </>
                                        )}
                                    </>
                                )}
                            </button>
                        </div>
                        {eventImages.length === 0 && (
                            <p className="text-red-500 text-xs mt-2 text-center font-medium">
                                Please upload at least one event image to continue
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default AddEditJoinEventModal;
