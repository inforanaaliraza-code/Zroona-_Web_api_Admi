"use client"

import Modal from '../common/Modal';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { getEventListDetail } from '@/redux/slices/EventListDetail';
import { useFormik } from 'formik';
import { AddEventListApi, EditEventListApi, UploadFileApi } from '@/app/api/setting';
import * as Yup from "yup";
import { toast } from 'react-toastify';
import Loader from '../Loader/Loader';
import { DatePickerTime } from '@/components/ui/date-picker-time';
import { getEventList } from '@/redux/slices/EventList';
import { useTranslation } from 'react-i18next';
import { getProfile } from '@/redux/slices/profileInfo';
import { format } from 'date-fns';
import { BASE_API_URL } from '@/until';
import { useJsApiLoader, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import { Icon } from '@iconify/react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon } from 'lucide-react';

// Professional Time Picker Component with Buttons
const TimePicker = ({ value, onChange, minTime, error, errorMessage }) => {
    const [hours, setHours] = useState(9);
    const [minutes, setMinutes] = useState(0);
    const [isAM, setIsAM] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const isInternalUpdate = useRef(false);

    // Parse initial value - only when value prop changes externally
    useEffect(() => {
        if (value && !isInternalUpdate.current) {
            const [h, m] = value.split(':').map(Number);
            if (h !== undefined && m !== undefined && !isNaN(h) && !isNaN(m)) {
                if (h === 0) {
                    setHours(12);
                    setIsAM(true);
                } else if (h < 12) {
                    setHours(h);
                    setIsAM(true);
                } else if (h === 12) {
                    setHours(12);
                    setIsAM(false);
                } else {
                    setHours(h - 12);
                    setIsAM(false);
                }
                setMinutes(m);
            }
        }
        isInternalUpdate.current = false;
    }, [value]);

    // Helper to format 24h string
    const getTimeString = (h, m, am) => {
        let h24 = h;
        if (h === 12) {
            h24 = am ? 0 : 12;
        } else {
            h24 = am ? h : h + 12;
        }
        return `${String(h24).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    // Update parent when time changes (only when value actually changes to avoid loops)
    useEffect(() => {
        if (!onChange) return;
        const next = getTimeString(hours, minutes, isAM);
        if (next !== value) {
            isInternalUpdate.current = true;
            onChange(next);
        }
    }, [hours, minutes, isAM]); // Removed value and onChange from deps to prevent loops

    const incrementHours = () => {
        setHours(prev => {
            if (prev === 12) return 1;
            return prev + 1;
        });
    };

    const decrementHours = () => {
        setHours(prev => {
            if (prev === 1) return 12;
            return prev - 1;
        });
    };

    const incrementMinutes = () => {
        setMinutes(prev => {
            if (prev === 59) return 0;
            const next = prev + 5;
            return next > 59 ? 0 : next;
        });
    };

    const decrementMinutes = () => {
        setMinutes(prev => {
            if (prev === 0) return 55;
            return prev - 5;
        });
    };

    const toggleAMPM = () => {
        setIsAM(prev => !prev);
    };

    const formatDisplayTime = () => {
        if (!value) return '--:-- --';
        const [h, m] = value.split(':').map(Number);
        const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
        const ampm = h < 12 ? 'AM' : 'PM';
        return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
    };

    return (
        <div className="relative">
            {/* Time Display Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-3.5 bg-white border-2 rounded-xl transition-all duration-300 flex items-center justify-between min-h-[56px] ${
                    error 
                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                        : 'border-gray-300 hover:border-[#a797cc] focus:border-[#a797cc] focus:ring-2 focus:ring-[#a797cc]/20'
                } shadow-sm hover:shadow-md`}
            >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 p-2 bg-gradient-to-br from-[#a797cc]/10 to-[#a3cc69]/10 rounded-lg">
                        <Icon icon="lucide:clock" className="w-5 h-5 text-[#a797cc]" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                        <div className="text-xs text-gray-500 font-medium leading-tight whitespace-nowrap">Select Time</div>
                        <div className="text-lg font-bold text-gray-900 leading-tight whitespace-nowrap min-h-[24px] flex items-center">
                            {formatDisplayTime()}
                        </div>
                    </div>
                </div>
                <Icon 
                    icon={isOpen ? "lucide:chevron-up" : "lucide:chevron-down"} 
                    className="w-5 h-5 text-gray-400 transition-transform flex-shrink-0"
                />
            </button>

            {/* Time Picker Dropdown */}
            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border-2 border-gray-200 p-4 animate-slideDown">
                        <div className="flex items-center justify-center gap-4 sm:gap-6">
                            {/* Hours */}
                            <div className="flex flex-col items-center">
                                <div className="text-xs font-semibold text-gray-500 mb-2">Hours</div>
                                <button
                                    type="button"
                                    onClick={incrementHours}
                                    className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#a797cc] to-[#a3cc69] text-white font-bold text-lg hover:shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center mb-2"
                                >
                                    <Icon icon="lucide:chevron-up" className="w-5 h-5" />
                                </button>
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-50 to-white border-2 border-[#a797cc] flex items-center justify-center mb-2">
                                    <span className="text-3xl font-bold text-gray-900">{String(hours).padStart(2, '0')}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={decrementHours}
                                    className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#a797cc] to-[#a3cc69] text-white font-bold text-lg hover:shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center"
                                >
                                    <Icon icon="lucide:chevron-down" className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Separator */}
                            <div className="text-3xl font-bold text-gray-300">:</div>

                            {/* Minutes */}
                            <div className="flex flex-col items-center">
                                <div className="text-xs font-semibold text-gray-500 mb-2">Minutes</div>
                                <button
                                    type="button"
                                    onClick={incrementMinutes}
                                    className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#a797cc] to-[#a3cc69] text-white font-bold text-lg hover:shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center mb-2"
                                >
                                    <Icon icon="lucide:chevron-up" className="w-5 h-5" />
                                </button>
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-50 to-white border-2 border-[#a797cc] flex items-center justify-center mb-2">
                                    <span className="text-3xl font-bold text-gray-900">{String(minutes).padStart(2, '0')}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={decrementMinutes}
                                    className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#a797cc] to-[#a3cc69] text-white font-bold text-lg hover:shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center"
                                >
                                    <Icon icon="lucide:chevron-down" className="w-5 h-5" />
                                </button>
                            </div>

                            {/* AM/PM Toggle */}
                            <div className="flex flex-col items-center ml-2">
                                <div className="text-xs font-semibold text-gray-500 mb-2">Period</div>
                                <button
                                    type="button"
                                    onClick={toggleAMPM}
                                    className={`w-16 sm:w-20 h-16 sm:h-20 rounded-xl font-bold text-sm sm:text-lg transition-all duration-200 ${
                                        isAM 
                                            ? 'bg-gradient-to-br from-[#a797cc] to-[#a3cc69] text-white shadow-lg scale-105' 
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    AM
                                </button>
                                <div className="h-2"></div>
                                <button
                                    type="button"
                                    onClick={toggleAMPM}
                                    className={`w-16 sm:w-20 h-16 sm:h-20 rounded-xl font-bold text-sm sm:text-lg transition-all duration-200 ${
                                        !isAM 
                                            ? 'bg-gradient-to-br from-[#a797cc] to-[#a3cc69] text-white shadow-lg scale-105' 
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    PM
                                </button>
                            </div>
                        </div>
                        
                        {/* Quick Time Buttons */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="text-xs font-semibold text-gray-500 mb-2">Quick Select</div>
                            <div className="grid grid-cols-4 gap-2">
                                {['09:00', '12:00', '15:00', '18:00'].map((quickTime) => (
                                    <button
                                        key={quickTime}
                                        type="button"
                                        onClick={() => {
                                            const [h, m] = quickTime.split(':').map(Number);
                                            if (h < 12) {
                                                setHours(h === 0 ? 12 : h);
                                                setIsAM(true);
                                            } else {
                                                setHours(h === 12 ? 12 : h - 12);
                                                setIsAM(false);
                                            }
                                            setMinutes(m);
                                        }}
                                        className="px-2 sm:px-3 py-2 text-xs font-semibold bg-gray-100 hover:bg-gradient-to-r hover:from-[#a797cc] hover:to-[#a3cc69] hover:text-white rounded-lg transition-all duration-200"
                                    >
                                        {quickTime}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Error Message */}
            <div className="min-h-[20px] mt-2">
                {error && errorMessage && (
                    <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                        <Icon icon="lucide:alert-circle" className="w-4 h-4 flex-shrink-0" />
                        <span className="leading-tight">{errorMessage}</span>
                    </p>
                )}
            </div>
        </div>
    );
};

// Date Picker Component integrated with formik
const DatePicker = ({ 
    value, 
    onChange, 
    onBlur, 
    label, 
    error, 
    errorMessage, 
    minDate,
    className = "" 
}) => {
    // Convert YYYY-MM-DD string to Date object, handling invalid dates
    const dateValue = useMemo(() => {
        if (!value) return undefined;
        const date = new Date(value);
        // Check if date is valid
        if (isNaN(date.getTime())) return undefined;
        return date;
    }, [value]);
    
    // Handle date selection
    const handleDateSelect = (selectedDate) => {
        if (selectedDate) {
            // Convert Date to YYYY-MM-DD format
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            onChange(formattedDate);
        } else {
            onChange('');
        }
    };

    // Convert minDate string to Date if provided
    const minDateObj = minDate ? new Date(minDate) : undefined;

    return (
        <div className={className}>
            {label && (
                <label className="block text-gray-700 text-sm font-semibold mb-3">
                    {label}
                </label>
            )}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className={`w-full justify-between text-left font-normal h-[44px] ${
                            error 
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 hover:border-[#a797cc] focus:border-[#a797cc] focus:ring-[#a797cc]'
                        } ${!dateValue ? 'text-gray-400' : 'text-gray-900'}`}
                    >
                        <div className="flex items-center gap-2">
                            <Icon icon="lucide:calendar" className="w-4 h-4 text-gray-400" />
                            <span>
                                {dateValue ? format(dateValue, "PPP") : "Select date"}
                            </span>
                        </div>
                        <ChevronDownIcon className="h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={dateValue}
                        onSelect={handleDateSelect}
                        defaultMonth={dateValue}
                        disabled={(date) => {
                            if (minDateObj) {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                const minDateOnly = new Date(minDateObj);
                                minDateOnly.setHours(0, 0, 0, 0);
                                return date < minDateOnly;
                            }
                            return false;
                        }}
                        className="rounded-md border-0"
                    />
                </PopoverContent>
            </Popover>
            {error && errorMessage && (
                <div className="min-h-[20px] mt-2">
                    <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                        <Icon icon="lucide:alert-circle" className="w-4 h-4 flex-shrink-0" />
                        <span className="leading-tight">{errorMessage}</span>
                    </p>
                </div>
            )}
        </div>
    );
};

// Keep libraries constant to avoid Google Maps reload warnings
const GOOGLE_MAP_LIBRARIES = ['places'];

// Permanent Event Categories List
const PERMANENT_CATEGORIES = [
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
];

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
    const [showCreateConfirm, setShowCreateConfirm] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [pendingPayload, setPendingPayload] = useState(null);
    // Get API key from environment variable (must be set in .env.local)
    const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAPS_API_KEY || '',
        libraries: GOOGLE_MAP_LIBRARIES,
    });
    const { profile } = useSelector((state) => state.profileData || {});

    // Surface missing key or load errors clearly
    useEffect(() => {
        if (!GOOGLE_MAPS_API_KEY) {
            setMapError('Google Maps API key missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in web/.env.local and restart the dev server.');
        }
    }, [GOOGLE_MAPS_API_KEY]);

    useEffect(() => {
        if (loadError) {
            setMapError(loadError.message || 'Google Maps failed to load. Check console for details.');
        }
    }, [loadError]);
    const EventListId = searchParams.get("id");
    const { EventListdetails = {}, loadingDetail } = useSelector(
        (state) => state.EventDetailData || {}
    );
    const hostGender = profile?.user?.gender; // 1 = male, 2 = female
    const maxEventCapacity = profile?.user?.max_event_capacity || 100; // Get max capacity from settings

    useEffect(() => {
        if (eventId) {
            dispatch(getEventListDetail({ id: eventId }));
        }
    }, [eventId, dispatch]);

    useEffect(() => {
        dispatch(getProfile());
    }, [dispatch]);

    // Categories are now hardcoded using PERMANENT_CATEGORIES - no API fetch needed

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
                // Get category value from event details
                // Support both single category and array of categories
                let category = EventListdetails?.event_category;
                
                // Check for event_categories array first (new format)
                if (EventListdetails?.event_categories && Array.isArray(EventListdetails.event_categories) && EventListdetails.event_categories.length > 0) {
                    category = EventListdetails.event_categories[0];
                }
                
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
                .test('after-start', t('End Time AfterStart') || 'End time must be after start time', function(value) {
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
                .max(200, 'Event title cannot exceed 200 characters'),
            event_description: Yup.string()
                .required(t('common.required') || 'Event description is required')
                .min(20, 'Event description must be at least 20 characters')
                .max(1000, 'Event description cannot exceed 1000 characters'),
            event_address: Yup.string()
                .required(t('common.required') || 'Event address is required')
                .min(5, 'Event address must be at least 5 characters'),
            no_of_attendees: Yup.number()
                .min(1, "Event capacity must be at least 1")
                .max(maxEventCapacity, `Event capacity cannot exceed ${maxEventCapacity} (your max event capacity setting)`)
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
            
            // If editing, proceed directly. If creating, show confirmation first
            if (EventListId) {
                // Edit mode - proceed directly
                await submitEvent(values, resetForm, setSubmitting);
            } else {
                // Create mode - show confirmation first
                setPendingPayload({ values, resetForm, setSubmitting });
                setShowCreateConfirm(true);
                setSubmitting(false);
            }
        },
    });

    // Prevent redundant Formik updates to avoid infinite loops
    const setFieldIfChanged = (field, nextValue) => {
        if (formik.values[field] !== nextValue) {
            formik.setFieldValue(field, nextValue);
        }
    };

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

    const submitEvent = async (valuesOrPayload, resetForm, setSubmitting) => {
        // Handle both direct call and confirmation call
        const values = valuesOrPayload?.values || valuesOrPayload;
        const actualResetForm = valuesOrPayload?.resetForm || resetForm;
        const actualSetSubmitting = valuesOrPayload?.setSubmitting || setSubmitting;
        
        setLoding(true);
        if (actualSetSubmitting) actualSetSubmitting(true);
        let payload;
        
        // Validate event_category - must be from the permanent categories list
        let eventCategory = (values.event_category || "").toString().trim();

        if (!eventCategory) {
            toast.error('Event category is required');
            setLoding(false);
            if (actualSetSubmitting) actualSetSubmitting(false);
            return;
        }

        // Validate that the selected category exists in the permanent categories list
        const categoryExists = PERMANENT_CATEGORIES.some(cat => {
            return String(cat._id) === String(eventCategory);
        });
        
        if (!categoryExists) {
            toast.error('Please select a valid event category from the list. The selected category ID is not found.');
            setLoding(false);
            if (actualSetSubmitting) actualSetSubmitting(false);
            return;
        }

        // Category validated and ready to send

        if (!eventImages || eventImages.length === 0) {
            toast.error('At least one event image is required');
            setLoding(false);
            if (actualSetSubmitting) actualSetSubmitting(false);
            return;
        }

        // Ensure event_price is a valid number
        const eventPrice = Number(values.event_price);
        if (isNaN(eventPrice) || eventPrice <= 0) {
            toast.error('Event price must be a valid number greater than 0');
            setLoding(false);
            if (actualSetSubmitting) actualSetSubmitting(false);
            return;
        }

        // Ensure no_of_attendees is a valid number
        const noOfAttendees = Number(values.no_of_attendees);
        if (isNaN(noOfAttendees) || noOfAttendees < 1) {
            toast.error('Number of attendees must be at least 1');
            setLoding(false);
            if (actualSetSubmitting) actualSetSubmitting(false);
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

        // Ensure event_category is sent as a string (backend handles both string and array)
        // Backend will convert it to array internally for event_categories field
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
            event_category: String(eventCategory), // Ensure it's a string
            no_of_attendees: noOfAttendees,
            event_price: eventPrice,
            dos_instruction: values.dos_instruction || '',
            do_not_instruction: values.do_not_instruction || '',
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

        console.log('[EVENT-SUBMIT] Final payload:', JSON.stringify(payload, null, 2));

        try {
                if (EventListId) {
                    const res = await EditEventListApi(payload);
                    setLoding(false);
                    if (actualSetSubmitting) actualSetSubmitting(false);
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
                    if (actualSetSubmitting) actualSetSubmitting(false);
                    if (res?.status == 1) {
                        // Show success popup for new events
                        setShowSuccessPopup(true);
                        setShowCreateConfirm(false);
                        // Close modal and reset after a delay
                        setTimeout(() => {
                            onClose();
                            dispatch(getEventList({ event_type: 1, page: eventpage, limit: eventlimit }));
                            if (actualResetForm) actualResetForm();
                            setEventImages([]);
                            setPreviewUrls([]);
                            setImageLoading(false);
                            setShowSuccessPopup(false);
                        }, 3000);
                    } else {
                        toast.error(res?.message || t('common.error') || 'Failed to create event');
                        setShowCreateConfirm(false);
                    }
                }
            } catch (error) {
                console.error("[EVENT-SUBMIT] Error:", error);
                console.error("[EVENT-SUBMIT] Error response:", error?.response?.data);
                console.error("[EVENT-SUBMIT] Error status:", error?.response?.status);
                setLoding(false);
                if (actualSetSubmitting) actualSetSubmitting(false);
                
                // Show detailed error message
                const errorMessage = error?.response?.data?.message || 
                                   error?.response?.data?.error || 
                                   error?.message || 
                                   t('common.error') || 
                                   'An error occurred. Please try again.';
                toast.error(errorMessage);
            }
    };

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
        <>
        <Modal isOpen={isOpen} onClose={onClose} width="landscape">
            <div className="space-y-0" style={{ overscrollBehavior: 'contain' }}>
                {/* Professional Header with Gradient */}
                <div className="sticky top-0 bg-gradient-to-r from-[#8b7bb8] via-[#a797cc] to-[#a3cc69] z-10 pb-0 shadow-lg">
                    <div className="bg-white/95 backdrop-blur-sm px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
                        <div className="flex items-start justify-between mb-4 sm:mb-6">
                            <div>
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                                    {EventListId ? t('add.tab21') || 'Edit Event' : t('add.tab1') || 'Add Event'}
                                </h2>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    {EventListId ? 'Update your event details' : 'Fill in all the details to create an amazing event'}
                                </p>
                            </div>
                        </div>
                        
                        {/* Professional Tab Navigation with Icons */}
                        <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2 -mb-4">
                            {[
                                { id: 'basic', label: 'Basic Info', icon: 'lucide:file-text' },
                                { id: 'details', label: 'Details', icon: 'lucide:info' },
                                { id: 'location', label: 'Location', icon: 'lucide:map-pin' },
                                { id: 'instructions', label: 'Instructions', icon: 'lucide:list-checks' },
                            ].map((section) => (
                                <button
                                    key={section.id}
                                    type="button"
                                    onClick={() => setActiveSection(section.id)}
                                    className={`group relative px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-t-lg sm:rounded-t-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-1 sm:gap-2 ${
                                        activeSection === section.id
                                            ? 'bg-white text-[#a797cc] shadow-lg shadow-[#a797cc]/20 border-t-2 border-x-2 border-[#a797cc]'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                                    }`}
                                >
                                    <Icon 
                                        icon={section.icon} 
                                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${activeSection === section.id ? 'scale-110' : 'group-hover:scale-105'}`}
                                    />
                                    <span className="hidden sm:inline">{section.label}</span>
                                    <span className="sm:hidden">{section.label.split(' ')[0]}</span>
                                    {activeSection === section.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#a797cc] to-[#a3cc69]"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                
                <form onSubmit={handleFormSubmit} className="space-y-6">

                {/* Basic Information Section */}
                {activeSection === 'basic' && (
                    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-white">
                        <div className="mb-6 pb-4 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-[#a797cc]/10 to-[#a3cc69]/10 rounded-lg">
                                    <Icon icon="lucide:file-text" className="w-5 h-5 text-[#a797cc]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Basic Information</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">Set the date, time, and title for your event</p>
                                </div>
                            </div>
                        </div>

                        {/* 2x2 Grid Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Event Date - Top Left */}
                            <div className="bg-white p-5 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <DatePicker
                                    value={formik.values.event_date}
                                    onChange={(date) => {
                                        formik.setFieldValue("event_date", date);
                                        formik.setFieldTouched("event_date", true);
                                    }}
                                    label={`${t('detail.tab5') || 'Event Date'} *`}
                                    minDate={new Date().toISOString().split('T')[0]}
                                    error={formik.touched.event_date && !!formik.errors.event_date}
                                    errorMessage={formik.errors.event_date}
                                    className="w-full"
                                />
                            </div>

                            {/* Event Title - Top Right */}
                            <div className="bg-white p-5 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <label className="flex items-baseline flex-wrap gap-2 text-gray-700 text-sm font-semibold mb-3">
                                    <span className="whitespace-nowrap">{t('add.tab2') || 'Event Title'}</span>
                                    <span className="text-red-500 flex-shrink-0">*</span>
                                    <span className="text-gray-400 text-xs font-normal ml-auto whitespace-nowrap">
                                        ({formik.values.event_name?.length || 0}/200)
                                    </span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                                        <Icon icon="lucide:calendar-days" className="w-5 h-5 text-gray-400" />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder={t('add.tab2') || 'Enter event title'}
                                        {...formik.getFieldProps('event_name')}
                                        maxLength={200}
                                        className="w-full pl-10 pr-4 py-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:border-transparent text-gray-900 placeholder:text-gray-400 text-sm transition-all min-h-[44px]"
                                    />
                                </div>
                                <div className="min-h-[20px] mt-2">
                                    {formik.touched.event_name && formik.errors.event_name ? (
                                        <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                                            <Icon icon="lucide:alert-circle" className="w-4 h-4" />
                                            <span>{formik.errors.event_name}</span>
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            {/* Start Time - Bottom Left */}
                            <div className="bg-white p-5 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <DatePickerTime
                                    time={formik.values.event_start_time}
                                    onTimeChange={(time) => {
                                        setFieldIfChanged('event_start_time', time);
                                        if (formik.values.event_end_time) {
                                            setTimeout(() => {
                                                formik.validateField('event_end_time');
                                            }, 100);
                                        }
                                    }}
                                    timeLabel={`${t('eventTime') || 'Event Start Time'} *`}
                                    timeId="event_start_time"
                                    showDate={false}
                                    showTime={true}
                                    fullWidth={true}
                                    timeError={formik.touched.event_start_time && !!formik.errors.event_start_time}
                                    timeErrorMessage={formik.errors.event_start_time}
                                    className="w-full"
                                />
                            </div>
                            
                            {/* End Time - Bottom Right */}
                            <div className="bg-white p-5 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <DatePickerTime
                                    time={formik.values.event_end_time}
                                    onTimeChange={(time) => {
                                        setFieldIfChanged('event_end_time', time);
                                        setTimeout(() => {
                                            formik.validateField('event_end_time');
                                        }, 100);
                                    }}
                                    timeLabel={`${t('add.tab13') || 'Event End Time'} *`}
                                    timeId="event_end_time"
                                    showDate={false}
                                    showTime={true}
                                    fullWidth={true}
                                    timeError={formik.touched.event_end_time && !!formik.errors.event_end_time}
                                    timeErrorMessage={formik.errors.event_end_time}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Event Images - Full Width Below Grid */}
                        <div className="bg-white p-5 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <label className="flex items-baseline flex-wrap gap-2 text-gray-700 text-sm font-semibold mb-2">
                                <span className="whitespace-nowrap">{t('add.tab4') || 'Event Images'}</span>
                                <span className="text-red-500 flex-shrink-0">*</span>
                                <span className="text-gray-400 text-xs font-normal ml-auto whitespace-nowrap">
                                    ({previewUrls.length}/5 uploaded)
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
                            {previewUrls.length < 5 && (
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
                                                        Max 5 images
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
                            <div className="min-h-[20px] mt-2">
                                {eventImages.length === 0 && formik.touched.event_images && (
                                    <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span className="leading-tight">At least one image is required</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Details Section */}
                {activeSection === 'details' && (
                    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-white">
                        <div className="mb-6 pb-4 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-[#a797cc]/10 to-[#a3cc69]/10 rounded-lg">
                                    <Icon icon="lucide:info" className="w-5 h-5 text-[#a797cc]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Event Details</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">Describe your event and set pricing details</p>
                                </div>
                            </div>
                        </div>

                        {/* 2x2 Grid Layout for Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Event Description - Top Left (Full Width) */}
                            <div className="md:col-span-2 bg-white p-5 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <label className="flex items-baseline flex-wrap gap-2 text-gray-700 text-sm font-semibold mb-3">
                                    <span className="whitespace-nowrap">{t('add.tab3') || 'Event Description'}</span>
                                    <span className="text-red-500 flex-shrink-0">*</span>
                                    <span className="text-gray-400 text-xs font-normal ml-auto whitespace-nowrap">
                                        ({formik.values.event_description?.length || 0}/1000)
                                    </span>
                                </label>
                                <div className="relative">
                                    <span className="absolute top-0 left-0 flex items-start pl-3 pt-3 pointer-events-none z-10">
                                        <Icon icon="lucide:file-text" className="w-5 h-5 text-gray-400" />
                                    </span>
                                    <textarea
                                        placeholder={t('add.tab3') || 'Describe your event...'}
                                        {...formik.getFieldProps('event_description')}
                                        maxLength={1000}
                                        className="w-full pl-10 pr-4 py-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:border-transparent text-gray-900 placeholder:text-gray-400 text-sm transition-all resize-y min-h-[120px]"
                                        rows="6"
                                    />
                                </div>
                                <div className="min-h-[20px] mt-2">
                                    {formik.touched.event_description && formik.errors.event_description ? (
                                        <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                                            <Icon icon="lucide:alert-circle" className="w-4 h-4" />
                                            <span>{formik.errors.event_description}</span>
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            {/* Event Price - Bottom Left */}
                            <div className="bg-white p-5 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <label className="flex items-baseline gap-2 text-gray-700 text-sm font-semibold mb-3">
                                    <span className="whitespace-nowrap">{t('add.tab14') || 'Event Price'}</span>
                                    <span className="text-red-500 flex-shrink-0">*</span>
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
                                        className="w-full pl-12 pr-4 py-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:border-transparent text-gray-900 placeholder:text-gray-400 text-sm transition-all min-h-[44px]"
                                    />
                                </div>
                                <div className="min-h-[20px] mt-2">
                                    {formik.touched.event_price && formik.errors.event_price ? (
                                        <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                                            <Icon icon="lucide:alert-circle" className="w-4 h-4" />
                                            <span>{formik.errors.event_price}</span>
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            {/* Event Capacity - Bottom Right */}
                            <div className="bg-white p-5 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <label className="flex items-baseline gap-2 text-gray-700 text-sm font-semibold mb-3">
                                    <span className="whitespace-nowrap">{t('add.tab10') || 'Event Capacity'}</span>
                                    <span className="text-red-500 flex-shrink-0">*</span>
                                    <span className="text-gray-400 text-xs font-normal ml-auto">
                                        (Max: {maxEventCapacity})
                                    </span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                                        <Icon icon="lucide:users" className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="Enter max attendees"
                                        {...formik.getFieldProps('no_of_attendees')}
                                        min="1"
                                        max={maxEventCapacity}
                                        step="1"
                                        className="w-full pl-10 pr-4 py-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:border-transparent text-gray-900 placeholder:text-gray-400 text-sm transition-all min-h-[44px]"
                                    />
                                </div>
                                <div className="min-h-[20px] mt-2">
                                    {formik.touched.no_of_attendees && formik.errors.no_of_attendees ? (
                                        <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                                            <Icon icon="lucide:alert-circle" className="w-4 h-4" />
                                            <span>{formik.errors.no_of_attendees}</span>
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        {/* Event Category - Full Width Below Grid */}
                        <div className="bg-white p-5 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <label className="flex items-baseline gap-2 text-gray-700 text-sm font-semibold mb-3">
                                <span className="whitespace-nowrap">{t('add.tab8') || t('add.tab56') || 'Event Categories'}</span>
                                <span className="text-red-500 flex-shrink-0">*</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {PERMANENT_CATEGORIES.map((category) => {
                                    const isSelected = formik.values.event_category === category._id;
                                    return (
                                        <button
                                            key={category._id}
                                            type="button"
                                            onClick={() => formik.setFieldValue('event_category', category._id)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                                                isSelected
                                                    ? 'bg-gradient-to-r from-[#a797cc] to-[#8ba179] text-white shadow-md shadow-[#a797cc]/30'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                                            }`}
                                        >
                                            {category.name}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="min-h-[20px] mt-2">
                                {formik.touched.event_category && formik.errors.event_category ? (
                                    <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                                        <Icon icon="lucide:alert-circle" className="w-4 h-4" />
                                        <span>{formik.errors.event_category}</span>
                                    </p>
                                ) : null}
                            </div>
                        </div>

                        {/* Event For (Audience) - Full Width Below Category */}
                        <div className="bg-white p-5 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
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
                                                    <Icon icon="lucide:check-circle" className="w-5 h-5 text-white" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                            {formik.errors.event_for && formik.touched.event_for && (
                                <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1">
                                    <Icon icon="lucide:alert-circle" className="w-4 h-4" />
                                    {formik.errors.event_for}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Location Section */}
                {activeSection === 'location' && (
                    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-white">
                        <div className="mb-6 pb-4 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-[#a797cc]/10 to-[#a3cc69]/10 rounded-lg">
                                    <Icon icon="lucide:map-pin" className="w-5 h-5 text-[#a797cc]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Event Location</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">Set where your event will take place</p>
                                </div>
                            </div>
                        </div>

                        {/* 2x2 Grid Layout for Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Event Address - Full Width */}
                            <div className="md:col-span-2 bg-white p-5 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <label className="block text-gray-700 text-sm font-semibold mb-3">
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
                                {formik.touched.event_address && formik.errors.event_address ? (
                                    <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1">
                                        <Icon icon="lucide:alert-circle" className="w-4 h-4" />
                                        {formik.errors.event_address}
                                    </p>
                                ) : null}
                                
                                {/* Google Maps Container */}
                                <div className="mt-4">
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
                                    <Icon icon="lucide:info" className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold text-blue-900 mb-1">Pro Tip</p>
                                        <p className="text-xs text-blue-700 leading-relaxed">
                                            You can search for an address above, then click on the map to fine-tune the exact location. The marker is draggable for precise positioning.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            </div>

                            {/* Neighborhood Display */}
                            {formik.values.neighborhood && (
                                <div className="md:col-span-2 mb-3 p-3 bg-[#a797cc]/10 border border-[#a797cc]/20 rounded-lg">
                                    <p className="text-xs font-semibold text-gray-700 mb-1">
                                        {t('add.neighborhood') || 'Neighborhood:'}
                                    </p>
                                    <p className="text-sm text-[#a797cc] font-medium">
                                        {formik.values.neighborhood}
                                    </p>
                                </div>
                            )}

                            {/* Location Coordinates - Bottom Left */}
                            <div className="bg-white p-5 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-gray-700 text-sm font-semibold">
                                        Latitude
                                    </label>
                                </div>
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
                                    <p className="text-red-500 text-xs mt-2">{formik.errors.latitude}</p>
                                ) : null}
                            </div>

                            {/* Longitude - Bottom Right */}
                            <div className="bg-white p-5 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-gray-700 text-sm font-semibold">
                                        Longitude
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleGetCurrentLocation}
                                        className="text-xs bg-[#a797cc] hover:bg-[#8ba179] text-white px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1"
                                    >
                                        <Icon icon="lucide:map-pin" className="w-3 h-3" />
                                        Get Current
                                    </button>
                                </div>
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
                                    <p className="text-red-500 text-xs mt-2">{formik.errors.longitude}</p>
                                ) : null}
                                {(formik.values.latitude && formik.values.longitude) && (
                                    <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
                                        <Icon icon="lucide:check-circle" className="w-4 h-4" />
                                        Coordinates saved
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Instructions Section */}
                {activeSection === 'instructions' && (
                    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-white">
                        <div className="mb-6 pb-4 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-[#a797cc]/10 to-[#a3cc69]/10 rounded-lg">
                                    <Icon icon="lucide:list-checks" className="w-5 h-5 text-[#a797cc]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Event Instructions</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">Optional: Add guidelines for attendees</p>
                                </div>
                            </div>
                        </div>

                        {/* 2x2 Grid Layout for Instructions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Do's Instructions - Left */}
                            <div className="bg-white p-5 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <label className="flex items-baseline flex-wrap gap-2 text-gray-700 text-sm font-semibold mb-3">
                                    <span className="whitespace-nowrap">Do&apos;s</span>
                                    <span className="text-gray-400 text-xs font-normal ml-auto whitespace-nowrap">
                                        ({formik.values.dos_instruction?.length || 0}/1000)
                                    </span>
                                </label>
                                <div className="relative">
                                    <span className="absolute top-0 left-0 flex items-start pl-3 pt-3 pointer-events-none z-10">
                                        <Icon icon="lucide:check-circle" className="w-5 h-5 text-green-500" />
                                    </span>
                                    <textarea
                                        placeholder="Enter guidelines for attendees..."
                                        {...formik.getFieldProps('dos_instruction')}
                                        maxLength={1000}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:border-[#a797cc] text-gray-900 placeholder:text-gray-400 text-sm transition-all resize-y min-h-[200px]"
                                        rows="8"
                                    />
                                </div>
                                <div className="min-h-[20px] mt-2">
                                    {formik.touched.dos_instruction && formik.errors.dos_instruction ? (
                                        <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                                            <Icon icon="lucide:alert-circle" className="w-4 h-4" />
                                            <span>{formik.errors.dos_instruction}</span>
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            {/* Don'ts Instructions - Right */}
                            <div className="bg-white p-5 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <label className="flex items-baseline flex-wrap gap-2 text-gray-700 text-sm font-semibold mb-3">
                                    <span className="whitespace-nowrap">Don&apos;ts</span>
                                    <span className="text-gray-400 text-xs font-normal ml-auto whitespace-nowrap">
                                        ({formik.values.do_not_instruction?.length || 0}/1000)
                                    </span>
                                </label>
                                <div className="relative">
                                    <span className="absolute top-0 left-0 flex items-start pl-3 pt-3 pointer-events-none z-10">
                                        <Icon icon="lucide:x-circle" className="w-5 h-5 text-red-500" />
                                    </span>
                                    <textarea
                                        placeholder="Enter restrictions or prohibited items..."
                                        {...formik.getFieldProps('do_not_instruction')}
                                        maxLength={1000}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:border-[#a797cc] text-gray-900 placeholder:text-gray-400 text-sm transition-all resize-y min-h-[200px]"
                                        rows="8"
                                    />
                                </div>
                                <div className="min-h-[20px] mt-2">
                                    {formik.touched.do_not_instruction && formik.errors.do_not_instruction ? (
                                        <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                                            <Icon icon="lucide:alert-circle" className="w-4 h-4" />
                                            <span>{formik.errors.do_not_instruction}</span>
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Professional Navigation and Submit Section */}
                <div className="sticky bottom-0 bg-white pt-4 sm:pt-6 pb-3 sm:pb-4 px-4 sm:px-6 border-t-2 border-gray-200 mt-6 sm:mt-8 shadow-lg">
                    {/* Section Navigation with Progress Indicator */}
                    <div className="flex justify-between items-center mb-6 px-2">
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
                                className="group px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-[#a797cc] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md"
                            >
                                <Icon icon="lucide:chevron-left" className="w-4 h-4" />
                                Previous
                            </button>
                            
                            {/* Progress Dots */}
                            <div className="flex items-center gap-2">
                                {['basic', 'details', 'location', 'instructions'].map((section, index) => {
                                    const currentIndex = ['basic', 'details', 'location', 'instructions'].indexOf(activeSection);
                                    const isActive = activeSection === section;
                                    const isCompleted = index < currentIndex;
                                    
                                    return (
                                        <div key={section} className="flex items-center">
                                            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                                isActive 
                                                    ? 'bg-[#a797cc] w-8 h-2 shadow-md shadow-[#a797cc]/30' 
                                                    : isCompleted
                                                    ? 'bg-[#a3cc69] w-3 h-3'
                                                    : 'bg-gray-300 w-3 h-3'
                                            }`} />
                                            {index < 3 && (
                                                <div className={`w-8 h-0.5 mx-1 transition-colors ${
                                                    isCompleted ? 'bg-[#a3cc69]' : 'bg-gray-200'
                                                }`} />
                                            )}
                                        </div>
                                    );
                                })}
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
                                className="group px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-[#a797cc] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md"
                            >
                                Next
                                <Icon icon="lucide:chevron-right" className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Professional Submit Buttons */}
                        <div className="flex gap-4">
                            <button 
                                type='button'
                                onClick={onClose}
                                className="flex-1 group px-6 py-3.5 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                            >
                                <Icon icon="lucide:x" className="w-4 h-4" />
                                {t('delete.tab4') || 'Cancel'}
                            </button>
                            <button 
                                type='submit' 
                                className="flex-1 group relative px-6 py-3.5 bg-gradient-to-r from-[#a797cc] to-[#a3cc69] hover:from-[#8b7bb8] hover:to-[#8ba179] text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-md overflow-hidden" 
                                disabled={formik.isSubmitting || loading || eventImages.length === 0}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#a3cc69] to-[#a797cc] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                {loading || formik.isSubmitting ? (
                                    <>
                                        <Loader color="#fff" height="20" width="20" />
                                        <span className="relative z-10">{EventListId ? t('common.updating') || 'Updating...' : t('common.creating') || 'Creating...'}</span>
                                    </>
                                ) : (
                                    <>
                                        {EventListId ? (
                                            <>
                                                <Icon icon="lucide:check-circle" className="w-5 h-5 relative z-10" />
                                                <span className="relative z-10">{t('add.tab22') || t('add.tab21') || 'Update Event'}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Icon icon="lucide:plus-circle" className="w-5 h-5 relative z-10" />
                                                <span className="relative z-10">{t('add.tab1') || 'Add Event'}</span>
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
        
        {/* Create Event Confirmation Modal */}
        {showCreateConfirm && (
            <Modal isOpen={showCreateConfirm} onClose={() => setShowCreateConfirm(false)} width="md">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#a797cc] to-[#8ba179] rounded-full flex items-center justify-center mb-4">
                        <Icon icon="lucide:alert-circle" className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {t('Confirm Create Event') || 'Are you sure you want to create this event?'}
                    </h3>
                    
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
                                    submitEvent(pendingPayload.values, pendingPayload.resetForm, pendingPayload.setSubmitting);
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
                        {t('Event Submitted') || 'Event Submitted for Review'}
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

export default AddEditJoinEventModal;
