"use client"

import Modal from '../common/Modal';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { getEventListDetail } from '@/redux/slices/EventListDetail';
import { useFormik } from 'formik';
import { AddEventListApi, EditEventListApi, UploadFileApi } from '@/app/api/setting';
import * as Yup from "yup";
import { toast } from 'react-toastify';
import Loader from '../Loader/Loader';
import SelectDate from '../common/SelectDate';
import { getEventList } from '@/redux/slices/EventList';
import { useTranslation } from 'react-i18next';
import { getProfile } from '@/redux/slices/profileInfo';
import { format } from 'date-fns';
import { BASE_API_URL } from '@/until';
import { useJsApiLoader, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import { getCategoryEventList } from '@/redux/slices/CategoryEventList';

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
    const [map, setMap] = useState(null);
    const [markerPosition, setMarkerPosition] = useState(null);
    const [autocomplete, setAutocomplete] = useState(null);
    const [activeSection, setActiveSection] = useState('basic');
    const [mapError, setMapError] = useState(null);
    const GOOGLE_MAPS_API_KEY = "AIzaSyC6cKp791aygkeF6blRdhoWR0EEl8WwLTk";
    
    // Load Google Maps API - libraries array should be static to avoid reload warnings
    const libraries = ['places'];
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries,
    });
    const { profile } = useSelector((state) => state.profileData || {});
    const EventListId = searchParams.get("id");
    const { EventListdetails = {}, loadingDetail } = useSelector(
        (state) => state.EventDetailData || {}
    );
    const { CategoryEventList = [] } = useSelector(
        (state) => state.CategoryEventData || {}
    );
    const hostGender = profile?.user?.gender; // 1 = male, 2 = female

    useEffect(() => {
        if (eventId) {
            dispatch(getEventListDetail({ id: eventId }));
        }
    }, [eventId, dispatch]);

    useEffect(() => {
        dispatch(getProfile());
    }, [dispatch]);

    // Fetch event categories from backend
    useEffect(() => {
        dispatch(getCategoryEventList({ page: 1, limit: 100 }));
    }, [dispatch]);

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
                // Get category value from event details (single value now)
                // Support both old ObjectId format and new string format
                let category = EventListdetails?.event_category;
                
                // If it's an array, get the first item (for backward compatibility)
                if (Array.isArray(category) && category.length > 0) {
                    category = category[0];
                }
                
                if (!category) return "";
                
                // If it's an object with _id, return the ObjectId
                if (typeof category === 'object' && category._id) {
                    return String(category._id);
                }
                
                // If it's already a string, return as is (should be ObjectId)
                if (typeof category === 'string') {
                    return category;
                }
                
                return String(category);
            })() : "",
            dos_instruction: EventListId ? EventListdetails?.dos_instruction || "" : "",
            do_not_instruction: EventListId ? EventListdetails?.do_not_instruction || "" : "",
            latitude: EventListId ? (EventListdetails?.location?.coordinates?.[1] || "") : "",
            longitude: EventListId ? (EventListdetails?.location?.coordinates?.[0] || "") : "",
            neighborhood: EventListId ? (EventListdetails?.neighborhood || "") : "",
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
                .required("Event capacity is required")
                .integer("Event capacity must be a whole number")
                .positive("Event capacity must be a positive number"),
            event_price: Yup.number()
                .required(t('common.required') || 'Event price is required')
                .positive('Event price must be greater than 0')
                .min(1, 'Event price must be at least 1 SAR')
                .max(10000, 'Event price cannot exceed 10,000 SAR'),
            event_category: Yup.string()
                .required(t('common.required') || 'Event category is required'),
            event_for: Yup.number()
                .required(t('common.required') || 'Event audience is required')
                .oneOf([1, 2, 3], 'Please select a valid event audience'),
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
            // Validate event_category is a valid ObjectId
            const eventCategory = values.event_category || "";
            
            // Check if it's a valid MongoDB ObjectId
            const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(eventCategory);
            const categoryExists = CategoryEventList.some(cat => cat._id === eventCategory);

            if (!eventCategory || (!isValidObjectId && !categoryExists)) {
                toast.error('Please select a valid event category');
                setLoding(false);
                setSubmitting(false);
                return;
            }

            console.log('[EVENT-SUBMIT] Category being sent:', eventCategory);

            // Validate required fields before creating payload
            if (!eventCategory || eventCategory.trim() === '') {
                toast.error('Event category is required');
                setLoding(false);
                setSubmitting(false);
                return;
            }

            if (!eventImages || eventImages.length === 0) {
                toast.error('At least one event image is required');
                setLoding(false);
                setSubmitting(false);
                return;
            }

            // Ensure event_price is a valid number
            const eventPrice = Number(values.event_price);
            if (isNaN(eventPrice) || eventPrice <= 0) {
                toast.error('Event price must be a valid number greater than 0');
                setLoding(false);
                setSubmitting(false);
                return;
            }

            // Ensure no_of_attendees is a valid number
            const noOfAttendees = Number(values.no_of_attendees);
            if (isNaN(noOfAttendees) || noOfAttendees < 1) {
                toast.error('Number of attendees must be at least 1');
                setLoding(false);
                setSubmitting(false);
                return;
            }

            // Ensure event_date is in proper format (YYYY-MM-DD or ISO string)
            let eventDate = values.event_date;
            if (eventDate && typeof eventDate === 'string') {
                // If it's already in YYYY-MM-DD format, keep it
                // Otherwise try to parse and format it
                if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) {
                    const dateObj = new Date(eventDate);
                    if (!isNaN(dateObj.getTime())) {
                        eventDate = dateObj.toISOString().split('T')[0];
                    }
                }
            }

            const basePayload = {
                event_date: eventDate,
                event_start_time: values.event_start_time,
                event_end_time: values.event_end_time,
                event_name: values.event_name,
                event_images: eventImages,
                event_description: values.event_description || '',
                event_address: values.event_address,
                event_type: Number(values.event_type),
                event_for: Number(values.event_for),
                event_category: eventCategory,
                no_of_attendees: noOfAttendees,
                event_price: eventPrice,
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

            console.log('[EVENT-SUBMIT] Final payload:', JSON.stringify(payload, null, 2));

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
                console.error("[EVENT-SUBMIT] Error response:", error?.response?.data);
                console.error("[EVENT-SUBMIT] Error status:", error?.response?.status);
                setLoding(false);
                setSubmitting(false);
                
                // Show detailed error message
                const errorMessage = error?.response?.data?.message || 
                                   error?.response?.data?.error || 
                                   error?.message || 
                                   t('common.error') || 
                                   'An error occurred. Please try again.';
                toast.error(errorMessage);
            }
        },
    });

    // Initialize marker position from form values
    useEffect(() => {
        if (formik.values.latitude && formik.values.longitude) {
            const position = {
                lat: parseFloat(formik.values.latitude),
                lng: parseFloat(formik.values.longitude)
            };
            setMarkerPosition(position);
            
            // Update map center if map is loaded
            if (map && isLoaded) {
                map.setCenter(position);
                map.setZoom(15);
            }
        } else {
            setMarkerPosition(null);
        }
    }, [formik.values.latitude, formik.values.longitude, map, isLoaded]);

    // Handle map load error
    useEffect(() => {
        if (loadError) {
            setMapError('Failed to load Google Maps. Please check your API key configuration and internet connection.');
        } else {
            setMapError(null);
        }
    }, [loadError]);

    // Geocode function to get address from coordinates
    const geocodeLocation = (location) => {
        if (!isLoaded || !window.google) return;
        
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                const address = results[0].formatted_address;
                formik.setFieldValue('event_address', address);

                // Extract neighborhood
                let neighborhood = '';
                results[0].address_components.forEach(component => {
                    if (component.types.includes('neighborhood') || component.types.includes('sublocality')) {
                        neighborhood = component.long_name;
                    } else if (component.types.includes('locality') && !neighborhood) {
                        neighborhood = component.long_name;
                    }
                });
                formik.setFieldValue('neighborhood', neighborhood || address);
            }
        });
    };

    // Handle map click to place marker
    const handleMapClick = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        const position = { lat, lng };

        formik.setFieldValue('latitude', lat.toFixed(6));
        formik.setFieldValue('longitude', lng.toFixed(6));
        setMarkerPosition(position);
        geocodeLocation(position);
    };

    // Handle marker drag end
    const handleMarkerDragEnd = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        const position = { lat, lng };

        formik.setFieldValue('latitude', lat.toFixed(6));
        formik.setFieldValue('longitude', lng.toFixed(6));
        geocodeLocation(position);
    };

    // Handle autocomplete place selection
    const handlePlaceSelect = () => {
        if (!autocomplete) return;

        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
            return;
        }

        const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
        };

        // Update map center
        if (map) {
            map.setCenter(location);
            map.setZoom(15);
        }

        // Update form values
        formik.setFieldValue('latitude', location.lat.toFixed(6));
        formik.setFieldValue('longitude', location.lng.toFixed(6));
        formik.setFieldValue('event_address', place.formatted_address || place.name);
        setMarkerPosition(location);

        // Extract neighborhood
        let neighborhood = '';
        if (place.address_components) {
            place.address_components.forEach(component => {
                if (component.types.includes('neighborhood') || component.types.includes('sublocality')) {
                    neighborhood = component.long_name;
                } else if (component.types.includes('locality') && !neighborhood) {
                    neighborhood = component.long_name;
                }
            });
        }
        formik.setFieldValue('neighborhood', neighborhood || place.formatted_address || place.name);
    };

    // Get default center
    const defaultCenter = formik.values.latitude && formik.values.longitude
        ? { lat: parseFloat(formik.values.latitude), lng: parseFloat(formik.values.longitude) }
        : { lat: 24.7136, lng: 46.6753 }; // Default to Riyadh

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
                    console.warn("AddEditJoinEventModal: Error revoking object URL", error);
                }
            }
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const location = { lat, lng };
                    
                    formik.setFieldValue('latitude', lat.toFixed(6));
                    formik.setFieldValue('longitude', lng.toFixed(6));
                    setMarkerPosition(location);
                    
                    // Update map center if map is loaded
                    if (map) {
                        map.setCenter(location);
                        map.setZoom(15);
                    }
                    
                    // Geocode the location to get address
                    geocodeLocation(location);
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

                        {/* Event Category */}
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                {t('add.tab8') || t('add.tab56') || 'Event Categories'} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                </div>
                                <select
                                    {...formik.getFieldProps('event_category')}
                                    className="w-full pl-10 pr-4 py-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] text-gray-900 text-sm"
                                >
                                    <option value="">Select a category</option>
                                    {CategoryEventList && CategoryEventList.length > 0 ? (
                                        CategoryEventList.map((category) => (
                                            <option key={category._id} value={category._id}>
                                                {category.name || 'Unnamed Category'}
                                            </option>
                                        ))
                                    ) : (
                                        // Fallback to static categories if backend categories not loaded yet
                                        [
                                            { _id: 'cultural-traditional', name: 'Cultural & Traditional Events' },
                                            { _id: 'outdoor-adventure', name: 'Outdoor & Adventure' },
                                            { _id: 'educational-workshops', name: 'Educational & Workshops' },
                                            { _id: 'sports-fitness', name: 'Sports & Fitness' },
                                            { _id: 'music-arts', name: 'Music & Arts' },
                                            { _id: 'family-kids', name: 'Family & Kids Activities' },
                                            { _id: 'food-culinary', name: 'Food & Culinary Experiences' },
                                            { _id: 'wellness-relaxation', name: 'Wellness & Relaxation' },
                                            { _id: 'heritage-history', name: 'Heritage & History Tours' },
                                            { _id: 'nightlife-entertainment', name: 'Nightlife & Entertainment' },
                                            { _id: 'eco-sustainable', name: 'Eco & Sustainable Tourism' },
                                            { _id: 'business-networking', name: 'Business & Networking' },
                                            { _id: 'volunteering', name: 'Volunteering' },
                                            { _id: 'photography-sightseeing', name: 'Photography & Sightseeing' },
                                        ].map((category) => (
                                            <option key={category._id} value={category._id}>
                                                {category.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
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

                        {/* Event Price - Compact Design */}
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                {t('add.tab14') || 'Event Price'} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                                    <span className="text-gray-500 font-medium">SAR</span>
                                </div>
                                <input
                                    type="number"
                                    placeholder="Enter price per person"
                                    {...formik.getFieldProps('event_price')}
                                    min="1"
                                    max="10000"
                                    step="0.01"
                                    className="w-full pl-12 pr-4 py-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:border-transparent text-gray-900 placeholder:text-gray-400 text-sm transition-all"
                                />
                            </div>
                            {formik.touched.event_price && formik.errors.event_price ? (
                                <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {formik.errors.event_price}
                                </p>
                            ) : null}
                        </div>

                        {/* Event Capacity */}
                        <div className="mt-6">
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
                                        <p className="text-gray-500 text-xs mt-0.5">Enter maximum number of attendees</p>
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
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="Enter number of people"
                                        {...formik.getFieldProps('no_of_attendees')}
                                        className="w-full pl-16 pr-4 py-4 bg-white border-2 border-green-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 text-gray-900 font-semibold text-base shadow-sm hover:border-green-300 transition-all"
                                    />
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

                        {/* Event Address with Google Maps */}
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                {t('add.tab7') || 'Event Address'} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative mb-3">
                                {isLoaded ? (
                                    <Autocomplete
                                        onLoad={(autocomplete) => setAutocomplete(autocomplete)}
                                        onPlaceChanged={handlePlaceSelect}
                                        options={{
                                            types: ['address'],
                                            componentRestrictions: { country: 'sa' },
                                        }}
                                    >
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                                                <Image
                                                    src="/assets/images/icons/location-pin.png"
                                                    height={20}
                                                    width={20}
                                                    alt="Location"
                                                />
                                            </span>
                                            <input
                                                type="text"
                                                placeholder={t('add.tab7') || 'Search and select location on map'}
                                                value={formik.values.event_address || ''}
                                                onChange={(e) => {
                                                    formik.setFieldValue('event_address', e.target.value);
                                                }}
                                                className="w-full pl-10 pr-4 py-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:border-transparent text-gray-900 placeholder:text-gray-400 text-sm transition-all"
                                            />
                                        </div>
                                    </Autocomplete>
                                ) : (
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                                            <Image
                                                src="/assets/images/icons/location-pin.png"
                                                height={20}
                                                width={20}
                                                alt="Location"
                                            />
                                        </span>
                                        <input
                                            type="text"
                                            placeholder={t('add.tab7') || 'Search and select location on map'}
                                            value={formik.values.event_address || ''}
                                            onChange={(e) => {
                                                formik.setFieldValue('event_address', e.target.value);
                                            }}
                                            className="w-full pl-10 pr-4 py-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:border-transparent text-gray-900 placeholder:text-gray-400 text-sm transition-all"
                                        />
                                    </div>
                                )}
                            </div>
                            
                            {/* Google Maps Container - Professional Ultra Pro Design */}
                            <div className="mb-4">
                                <div className="bg-gradient-to-r from-[#a797cc] to-purple-600 rounded-t-xl p-4 shadow-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-white font-bold text-base mb-0.5">
                                                {t('add.selectLocationOnMap')}
                                            </h4>
                                            <p className="text-white/90 text-xs">
                                                {t('add.mapInstructions')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    {!isLoaded ? (
                                        <div 
                                            className="w-full border-x-2 border-b-2 border-gray-200 rounded-b-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl"
                                            style={{ minHeight: '400px', height: '400px' }}
                                        >
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
                                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#a797cc] border-t-transparent mb-4"></div>
                                                <p className="text-sm font-medium text-gray-600">
                                                    {t('add.mapLoading') || 'Loading map...'}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Please wait while we initialize the map
                                                </p>
                                            </div>
                                        </div>
                                    ) : loadError ? (
                                        <div 
                                            className="w-full border-x-2 border-b-2 border-gray-200 rounded-b-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl"
                                            style={{ minHeight: '400px', height: '400px' }}
                                        >
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm">
                                                <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p className="text-sm font-medium text-red-600 mb-1">Google Maps Error</p>
                                                <p className="text-xs text-gray-500 px-4 text-center">{mapError || loadError.message}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <GoogleMap
                                                mapContainerStyle={{ 
                                                    width: '100%', 
                                                    height: '400px',
                                                    borderRadius: '0 0 0.75rem 0.75rem'
                                                }}
                                                center={defaultCenter}
                                                zoom={formik.values.latitude && formik.values.longitude ? 15 : 13}
                                                onClick={handleMapClick}
                                                onLoad={(mapInstance) => setMap(mapInstance)}
                                                options={{
                                                    mapTypeControl: true,
                                                    fullscreenControl: true,
                                                    streetViewControl: false,
                                                    zoomControl: true,
                                                    mapTypeId: 'roadmap',
                                                }}
                                            >
                                                {markerPosition && (
                                                    <Marker
                                                        position={markerPosition}
                                                        draggable={true}
                                                        onDragEnd={handleMarkerDragEnd}
                                                    />
                                                )}
                                            </GoogleMap>
                                            {/* Map Overlay Instructions */}
                                            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-4 py-2 z-10 border border-gray-200">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-[#a797cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-xs font-semibold text-gray-700">Click to place marker</span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                {/* Additional Help Text */}
                                <div className="mt-3 flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold text-blue-900 mb-1">Pro Tip</p>
                                        <p className="text-xs text-blue-700 leading-relaxed">
                                            You can search for an address above, then click on the map to fine-tune the exact location. The marker is draggable for precise positioning.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Neighborhood Display */}
                            {formik.values.neighborhood && (
                                <div className="mb-3 p-3 bg-[#a797cc]/10 border border-[#a797cc]/20 rounded-lg">
                                    <p className="text-xs font-semibold text-gray-700 mb-1">
                                        {t('add.neighborhood') || 'Neighborhood:'}
                                    </p>
                                    <p className="text-sm text-[#a797cc] font-medium">
                                        {formik.values.neighborhood}
                                    </p>
                                </div>
                            )}

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
