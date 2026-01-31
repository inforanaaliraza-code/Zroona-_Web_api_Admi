"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { AddEventListApi, EditEventListApi, UploadFileApi } from '@/app/api/setting';
import { getEventListDetail } from '@/redux/slices/EventListDetail';
import { getEventList } from '@/redux/slices/EventList';
import { getProfile } from '@/redux/slices/profileInfo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Loader from '@/components/Loader/Loader';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { DatePickerTime } from '@/components/ui/date-picker-time';
import { BASE_API_URL } from '@/until';
import { useJsApiLoader, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';

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

const STEPS = [
    { id: 1, title: 'Basic Information', icon: 'lucide:info' },
    { id: 2, title: 'Images & Location', icon: 'lucide:image' },
    { id: 3, title: 'Categories & Details', icon: 'lucide:tag' },
    { id: 4, title: "Do's & Don'ts", icon: 'lucide:lightbulb' },
    { id: 5, title: 'Review & Submit', icon: 'lucide:check-circle' },
];

// Professional Time Picker Component with Buttons - With Time Restrictions
const TimePicker = ({ value, onChange, minTime, error, errorMessage, selectedDate }) => {
    const [hours, setHours] = useState(9);
    const [minutes, setMinutes] = useState(0);
    const [isAM, setIsAM] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const isInternalUpdateRef = useRef(false);

    // Get current time for comparison
    const getCurrentTime = () => {
        const now = new Date();
        return {
            hours: now.getHours(),
            minutes: now.getMinutes(),
            date: now.toISOString().split('T')[0],
        };
    };

    // Check if time is allowed (not in the past for today's date)
    const isTimeAllowed = (h, m) => {
        const { hours: currentHour, minutes: currentMinutes, date: today } = getCurrentTime();
        
        // If selected date is today, don't allow past times
        if (selectedDate === today) {
            const selectedTimeInMinutes = h * 60 + m;
            const currentTimeInMinutes = currentHour * 60 + currentMinutes;
            return selectedTimeInMinutes > currentTimeInMinutes;
        }
        
        // For future dates, allow any time
        return true;
    };

    useEffect(() => {
        if (value && !isInternalUpdateRef.current) {
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
        isInternalUpdateRef.current = false;
    }, [value]);

    const getTimeString = (h, m, am) => {
        let h24 = h;
        if (h === 12) {
            h24 = am ? 0 : 12;
        } else {
            h24 = am ? h : h + 12;
        }
        return `${String(h24).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    useEffect(() => {
        if (!onChange) return;
        const next = getTimeString(hours, minutes, isAM);
        if (next !== value) {
            isInternalUpdateRef.current = true;
            onChange(next);
        }
    }, [hours, minutes, isAM]);

    const incrementHours = () => {
        const newHours = hours === 12 ? 1 : hours + 1;
        const h24 = newHours === 12 ? (isAM ? 0 : 12) : (isAM ? newHours : newHours + 12);
        if (isTimeAllowed(h24, minutes)) {
            setHours(newHours);
        } else {
            toast.warning("⏰ Cannot select past time! Please select a future time.");
        }
    };

    const decrementHours = () => {
        const newHours = hours === 1 ? 12 : hours - 1;
        const h24 = newHours === 12 ? (isAM ? 0 : 12) : (isAM ? newHours : newHours + 12);
        if (isTimeAllowed(h24, minutes)) {
            setHours(newHours);
        } else {
            toast.warning("⏰ Cannot select past time! Please select a future time.");
        }
    };

    const incrementMinutes = () => {
        const newMinutes = minutes + 5 > 59 ? 0 : minutes + 5;
        const h24 = hours === 12 ? (isAM ? 0 : 12) : (isAM ? hours : hours + 12);
        if (isTimeAllowed(h24, newMinutes)) {
            setMinutes(newMinutes);
        } else {
            toast.warning("⏰ Cannot select past time! Please select a future time.");
        }
    };

    const decrementMinutes = () => {
        const newMinutes = minutes === 0 ? 55 : minutes - 5;
        const h24 = hours === 12 ? (isAM ? 0 : 12) : (isAM ? hours : hours + 12);
        if (isTimeAllowed(h24, newMinutes)) {
            setMinutes(newMinutes);
        } else {
            toast.warning("⏰ Cannot select past time! Please select a future time.");
        }
    };

    const toggleAMPM = () => {
        const h24 = hours === 12 ? (isAM ? 0 : 12) : (isAM ? hours : hours + 12);
        const newH24 = isAM ? h24 + 12 : h24 - 12;
        if (isTimeAllowed(newH24, minutes)) {
            setIsAM(prev => !prev);
        } else {
            toast.warning("⏰ Cannot select past time! Please select a future time.");
        }
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
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-3 py-2 bg-white border rounded-md transition-all flex items-center justify-between h-8 ${
                    error 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-300 hover:border-[#a797cc]'
                }`}
            >
                <div className="flex items-center gap-2 flex-1">
                    <Icon icon="lucide:clock" className="w-4 h-4 text-[#a797cc]" />
                    <span className="text-xs font-medium">{formatDisplayTime()}</span>
                </div>
                <Icon 
                    icon={isOpen ? "lucide:chevron-up" : "lucide:chevron-down"} 
                    className="w-4 h-4 text-gray-400"
                />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border p-3">
                        <div className="flex items-center justify-center gap-3">
                            <div className="flex flex-col items-center">
                                <button
                                    type="button"
                                    onClick={incrementHours}
                                    className="w-8 h-8 rounded bg-gradient-to-br from-[#a797cc] to-[#8ba179] text-white text-xs mb-1"
                                >
                                    ↑
                                </button>
                                <div className="w-12 h-12 rounded border-2 border-[#a797cc] flex items-center justify-center mb-1">
                                    <span className="text-lg font-bold">{String(hours).padStart(2, '0')}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={decrementHours}
                                    className="w-8 h-8 rounded bg-gradient-to-br from-[#a797cc] to-[#8ba179] text-white text-xs"
                                >
                                    ↓
                                </button>
                            </div>
                            <div className="text-xl font-bold text-gray-300">:</div>
                            <div className="flex flex-col items-center">
                                <button
                                    type="button"
                                    onClick={incrementMinutes}
                                    className="w-8 h-8 rounded bg-gradient-to-br from-[#a797cc] to-[#8ba179] text-white text-xs mb-1"
                                >
                                    ↑
                                </button>
                                <div className="w-12 h-12 rounded border-2 border-[#a797cc] flex items-center justify-center mb-1">
                                    <span className="text-lg font-bold">{String(minutes).padStart(2, '0')}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={decrementMinutes}
                                    className="w-8 h-8 rounded bg-gradient-to-br from-[#a797cc] to-[#8ba179] text-white text-xs"
                                >
                                    ↓
                                </button>
                            </div>
                            <div className="flex flex-col items-center ml-2">
                                <button
                                    type="button"
                                    onClick={toggleAMPM}
                                    className={`w-12 h-12 rounded text-xs font-bold mb-1 ${
                                        isAM ? 'bg-gradient-to-br from-[#a797cc] to-[#8ba179] text-white' : 'bg-gray-100'
                                    }`}
                                >
                                    AM
                                </button>
                                <button
                                    type="button"
                                    onClick={toggleAMPM}
                                    className={`w-12 h-12 rounded text-xs font-bold ${
                                        !isAM ? 'bg-gradient-to-br from-[#a797cc] to-[#8ba179] text-white' : 'bg-gray-100'
                                    }`}
                                >
                                    PM
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {error && errorMessage && (
                <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
            )}
        </div>
    );
};

// Date Picker Component - ShadCN Style with Date Restrictions
const DatePicker = ({ value, onChange, label, error, errorMessage, minDate, className = "" }) => {
    const dateValue = value ? new Date(value) : undefined;
    
    const handleDateSelect = (selectedDate) => {
        if (selectedDate) {
            // Check if selected date is in the past
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const checkDate = new Date(selectedDate);
            checkDate.setHours(0, 0, 0, 0);
            
            if (checkDate < today) {
                toast.error("❌ Cannot select past dates! Please choose today or a future date.");
                return;
            }
            
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            onChange(`${year}-${month}-${day}`);
            toast.success("✅ Date selected successfully!");
        } else {
            onChange('');
        }
    };

    // Get today's date for restrictions
    const getTodayDate = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    };

    // Only allow current and future dates (not past dates)
    const minDateObj = getTodayDate();

    return (
        <div className={className}>
            {label && <Label className="text-xs font-semibold mb-1.5 block">{label}</Label>}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        data-empty={!dateValue}
                        className="w-full justify-between text-left font-normal data-[empty=true]:text-gray-400"
                    >
                        {dateValue ? format(dateValue, "PPP") : <span>Pick a date</span>}
                        <ChevronDownIcon className="h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4 z-[9999] bg-white border border-gray-200 shadow-lg rounded-lg" align="start" side="bottom" sideOffset={8}>
                    <Calendar
                        mode="single"
                        selected={dateValue}
                        onSelect={handleDateSelect}
                        defaultMonth={dateValue}
                        disabled={(date) => {
                            // Disable all past dates (before today)
                            const today = getTodayDate();
                            const checkDate = new Date(date);
                            checkDate.setHours(0, 0, 0, 0);
                            return checkDate < today;
                        }}
                        classNames={{
                            months: "flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0",
                            month: "space-y-4",
                            caption: "flex justify-center pt-1 relative items-center text-lg font-semibold",
                            caption_label: "text-base font-semibold",
                            nav: "space-x-1 flex items-center",
                            nav_button: "h-7 w-7 bg-gradient-to-r from-[#a797cc] to-[#8ba179] text-white hover:bg-gradient-to-r hover:from-[#9684b5] hover:to-[#79945f] rounded",
                            nav_button_previous: "absolute left-1",
                            nav_button_next: "absolute right-1",
                            table: "w-full border-collapse space-y-1",
                            head_row: "flex justify-between",
                            head_cell: "text-[0.8rem] font-semibold text-center text-gray-600 w-9 rounded-md",
                            row: "flex w-full mt-2 justify-between",
                            cell: "h-9 w-9 text-center text-sm p-0 relative",
                            day: "h-9 w-9 p-0 font-normal hover:bg-gray-100 rounded-md",
                            day_selected: "bg-gradient-to-r from-[#a797cc] to-[#8ba179] text-white hover:bg-gradient-to-r hover:from-[#9684b5] hover:to-[#79945f] font-semibold rounded-md",
                            day_today: "bg-blue-50 text-blue-600 font-semibold rounded-md",
                            day_outside: "text-gray-400",
                            day_disabled: "text-gray-300 cursor-not-allowed opacity-50",
                        }}
                    />
                </PopoverContent>
            </Popover>
            {error && errorMessage && (
                <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
            )}
        </div>
    );
};

export default function CreateEventPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const [currentStep, setCurrentStep] = useState(1);
    const [eventImages, setEventImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [imageLoading, setImageLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showCreateConfirm, setShowCreateConfirm] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [pendingPayload, setPendingPayload] = useState(null);
    const [map, setMap] = useState(null);
    const [markerPosition, setMarkerPosition] = useState(null);
    const [autocomplete, setAutocomplete] = useState(null);
    const [mapError, setMapError] = useState(null);
    
    const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        // If key is missing we still let loader run, but we'll hide the map and show a friendly message
        googleMapsApiKey: GOOGLE_MAPS_API_KEY || '',
        libraries: ['places'],
    });

    const eventId = searchParams.get("id");
    const eventType = searchParams.get("type") || "1"; // 1 = Join Event, 2 = Welcome Event
    const { EventListdetails = {} } = useSelector((state) => state.EventDetailData || {});
    const { profile } = useSelector((state) => state.profileData || {});
    const maxEventCapacity = profile?.user?.max_event_capacity || 100;

    useEffect(() => {
        if (eventId) {
            dispatch(getEventListDetail({ id: eventId }));
        }
        dispatch(getProfile());
    }, [eventId, dispatch]);

    useEffect(() => {
        if (eventId && EventListdetails?.event_images) {
            const images = Array.isArray(EventListdetails.event_images) 
                ? EventListdetails.event_images 
                : [EventListdetails.event_image].filter(Boolean);
            setEventImages(images);
            setPreviewUrls(images);
        }
    }, [eventId, EventListdetails]);

    const formik = useFormik({
        initialValues: {
            event_date: eventId ? EventListdetails?.event_date?.substr(0, 10) : "",
            event_start_time: eventId ? EventListdetails?.event_start_time : "",
            event_end_time: eventId ? EventListdetails?.event_end_time : (() => {
                // Calculate default end time (start time + 2 hours) if start time exists
                if (eventId ? EventListdetails?.event_start_time : false) {
                    const [h, m] = EventListdetails.event_start_time.split(':').map(Number);
                    const endHour = (h + 2) % 24;
                    return `${String(endHour).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                }
                return "";
            })(),
            event_name: eventId ? EventListdetails?.event_name : "",
            event_description: eventId ? EventListdetails?.event_description : "",
            event_address: eventId ? EventListdetails?.event_address : "",
            no_of_attendees: eventId ? EventListdetails?.no_of_attendees : 1,
            event_price: eventId ? EventListdetails?.event_price : 0,
            event_type: Number(eventType),
            event_for: eventId ? EventListdetails?.event_for : 3,
            event_category: eventId ? (() => {
                // For join events (type 1), use single category string
                // For welcome events (type 2), use array
                if (Number(eventType) === 1) {
                    let category = EventListdetails?.event_category;
                    if (EventListdetails?.event_categories && Array.isArray(EventListdetails.event_categories) && EventListdetails.event_categories.length > 0) {
                        category = EventListdetails.event_categories[0];
                    }
                    if (Array.isArray(category) && category.length > 0) {
                        category = category[0];
                    }
                    if (!category) return "";
                    if (typeof category === 'object' && category._id) {
                        return String(category._id);
                    }
                    return String(category);
                } else {
                    // Welcome events use array
                    return Array.isArray(EventListdetails?.event_category) ? EventListdetails?.event_category : [EventListdetails?.event_category].filter(Boolean);
                }
            })() : (Number(eventType) === 1 ? "" : []),
            latitude: eventId ? EventListdetails?.location?.coordinates?.[1] : "",
            longitude: eventId ? EventListdetails?.location?.coordinates?.[0] : "",
            neighborhood: eventId ? EventListdetails?.area_name || EventListdetails?.neighborhood : "",
            dos_instruction: eventId ? EventListdetails?.dos_instruction : "",
            do_not_instruction: eventId ? EventListdetails?.do_not_instruction : "",
        },
        validationSchema: Yup.object({
            event_date: Yup.string().required(t('signup.tab16')),
            event_start_time: Yup.string().required(t('signup.tab16')),
            event_end_time: Yup.string(),
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
                .max(maxEventCapacity, `Event capacity cannot exceed ${maxEventCapacity}`)
                .required("This field is required"),
            event_price: Yup.number().required(t('signup.tab16')).positive(t('signup.tab16')),
            event_for: Yup.string()
                .required(t('signup.tab16'))
                .oneOf(['1', '2', '3'], t('signup.tab17')),
            event_category: Number(eventType) === 1 
                ? Yup.string().required(t('signup.tab16'))
                : Yup.array().min(1, "Please select at least one category").required(t('signup.tab16')),
            dos_instruction: Yup.string()
                .max(500, "Do's instructions cannot exceed 500 characters"),
            do_not_instruction: Yup.string()
                .max(500, "Don'ts instructions cannot exceed 500 characters"),
        }),
        enableReinitialize: true,
        onSubmit: async (values, { resetForm }) => {
            if (eventImages.length === 0) {
                toast.error("Please upload at least one event image");
                return;
            }
            
            if (eventId) {
                await submitEvent(values, resetForm);
            } else {
                setPendingPayload({ values, resetForm });
                setShowCreateConfirm(true);
            }
        },
    });

    const submitEvent = async (valuesOrPayload, resetForm) => {
        const values = valuesOrPayload?.values || valuesOrPayload;
        const actualResetForm = valuesOrPayload?.resetForm || resetForm;
        
        setLoading(true);
        let payload;
        
        // Handle category based on event type
        let eventCategoryPayload;
        if (Number(values.event_type) === 1) {
            // Join events - single category string
            eventCategoryPayload = String(values.event_category || "").trim();
        } else {
            // Welcome events - array of categories
            eventCategoryPayload = Array.isArray(values.event_category) 
                ? values.event_category 
                : values.event_category ? [values.event_category] : [];
        }

        // Calculate end time if not provided (default: start time + 2 hours)
        let endTime = values.event_end_time;
        if (!endTime && values.event_start_time) {
            const [h, m] = values.event_start_time.split(':').map(Number);
            const endHour = (h + 2) % 24;
            endTime = `${String(endHour).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        }

        const basePayload = {
            event_date: values.event_date,
            event_start_time: values.event_start_time,
            event_end_time: endTime || values.event_start_time,
            event_name: values.event_name,
            event_images: eventImages,
            event_description: values.event_description || '',
            event_address: values.event_address,
            event_type: Number(values.event_type),
            event_for: Number(values.event_for),
            event_category: eventCategoryPayload,
            no_of_attendees: Number(values.no_of_attendees),
            event_price: Number(values.event_price),
            dos_instruction: values.dos_instruction || '',
            do_not_instruction: values.do_not_instruction || '',
            ...(values.latitude && values.longitude && {
                latitude: Number(values.latitude),
                longitude: Number(values.longitude),
            }),
            ...(values.neighborhood && {
                area_name: values.neighborhood,
            }),
        };

        if (eventId) {
            payload = {
                event_id: eventId,
                ...basePayload,
            };
        } else {
            payload = basePayload;
        }
        
        if (eventId) {
            EditEventListApi(payload).then((res) => {
                setLoading(false);
                if (res?.status == 1) {
                    toast.success(res?.message);
                    router.back();
                    dispatch(getEventListDetail({ id: eventId }));
                }
                if (res.status == 0) {
                    toast.error(res?.message);
                }
            });
        } else {
            AddEventListApi(payload).then((res) => {
                setLoading(false);
                if (res?.status == 1) {
                    setShowSuccessPopup(true);
                    setShowCreateConfirm(false);
                    setTimeout(() => {
                        router.push(eventType === "2" ? "/welcomeUsEvent" : "/joinUsEvent");
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
            const previewUrl = URL.createObjectURL(file);
            setPreviewUrls(prev => [...prev, previewUrl]);

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
            setPreviewUrls(prev => prev.slice(0, -1));
        } finally {
            setImageLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        files.forEach(file => handleFile(file));
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
                    console.warn("Error revoking object URL", error);
                }
            }
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleEventForSelect = (gender) => {
        formik.setFieldValue("event_for", gender);
    };

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

    // Initialize marker position from form values
    useEffect(() => {
        if (formik.values.latitude && formik.values.longitude) {
            const position = {
                lat: parseFloat(formik.values.latitude),
                lng: parseFloat(formik.values.longitude)
            };
            setMarkerPosition(position);
            
            if (map && isLoaded) {
                map.setCenter(position);
                map.setZoom(15);
            }
        } else {
            setMarkerPosition(null);
        }
    }, [formik.values.latitude, formik.values.longitude, map, isLoaded]);

    // Surface missing key or load errors clearly
    useEffect(() => {
        if (!GOOGLE_MAPS_API_KEY) {
            setMapError('Google Maps API key missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in web/.env.local.');
        }
    }, [GOOGLE_MAPS_API_KEY]);

    useEffect(() => {
        if (loadError) {
            setMapError(loadError.message || 'Failed to load Google Maps. Please check your API key configuration.');
        }
    }, [loadError]);

    const validateStep = (step) => {
        const errors = {};
        
        if (step === 1) {
            if (!formik.values.event_date) errors.event_date = 'Required';
            if (!formik.values.event_start_time) errors.event_start_time = 'Required';
            if (!formik.values.event_name || formik.values.event_name.length < 3) errors.event_name = 'Required';
            if (!formik.values.no_of_attendees || formik.values.no_of_attendees < 1) errors.no_of_attendees = 'Required';
        } else if (step === 2) {
            if (eventImages.length === 0) {
                toast.error("Please upload at least one event image");
                return false;
            }
            if (!formik.values.event_address) errors.event_address = 'Required';
        } else if (step === 3) {
            if (Number(eventType) === 1) {
                // Join events - single category string
                if (!formik.values.event_category || formik.values.event_category === "") {
                    toast.error("Please select a category");
                    return false;
                }
            } else {
                // Welcome events - array of categories
                const selectedCategories = Array.isArray(formik.values.event_category) ? formik.values.event_category : [];
                if (selectedCategories.length === 0) {
                    toast.error("Please select at least one category");
                    return false;
                }
            }
            if (!formik.values.event_price || formik.values.event_price <= 0) errors.event_price = 'Required';
        }
        
        if (Object.keys(errors).length > 0) {
            formik.setTouched(Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const breadcrumbItems = [
        { label: t('breadcrumb.tab1'), href: "/" },
        { label: eventType === "2" ? t('breadcrumb.tab15') : t('myEventOnly'), href: eventType === "2" ? "/welcomeUsEvent" : "/joinUsEvent" },
        { label: eventId ? 'Edit Event' : 'Create Event', href: "#" },
    ];

    return (
        <>
            <Breadcrumbs items={breadcrumbItems} />
            <section className="bg-white py-6 min-h-screen">
                <div className="mx-auto px-4 md:px-8 xl:px-28 max-w-3xl">
                    {/* Step Indicator */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            {STEPS.map((step, index) => (
                                <div key={step.id} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                            currentStep >= step.id
                                                ? 'bg-gradient-to-r from-[#a797cc] to-[#8ba179] border-[#a797cc] text-white'
                                                : 'bg-white border-gray-300 text-gray-400'
                                        }`}>
                                            {currentStep > step.id ? (
                                                <Icon icon="lucide:check" className="w-4 h-4" />
                                            ) : (
                                                <Icon icon={step.icon} className="w-4 h-4" />
                                            )}
                                        </div>
                                        <span className={`text-xs mt-1.5 font-medium ${
                                            currentStep >= step.id ? 'text-[#a797cc]' : 'text-gray-400'
                                        }`}>
                                            {step.title}
                                        </span>
                                    </div>
                                    {index < STEPS.length - 1 && (
                                        <div className={`h-0.5 flex-1 mx-1.5 transition-all ${
                                            currentStep > step.id ? 'bg-[#a797cc]' : 'bg-gray-300'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <Card className="border border-gray-200 shadow-md overflow-visible relative">
                        <CardHeader className="pb-3 px-4 pt-4">
                            <CardTitle className="text-lg font-bold text-center">
                                {eventId ? t('add.tab21') || 'Edit Event' : t('add.tab18') || 'Create Event'} - Step {currentStep} of {STEPS.length}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 px-4 pb-4 overflow-visible">
                            {/* Step 1: Basic Information */}
                            {currentStep === 1 && (
                                <div className="space-y-3">
                                    {/* Event Title - At the top */}
                                    <div>
                                        <Label className="text-xs font-semibold mb-1.5 block">Event Title <span className="text-red-500">*</span></Label>
                                        <Input
                                            type="text"
                                            placeholder="Enter Event Title"
                                            {...formik.getFieldProps('event_name')}
                                            maxLength={200}
                                            className="h-8 text-xs"
                                        />
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            ({formik.values.event_name?.length || 0}/200 characters)
                                        </p>
                                        {formik.touched.event_name && formik.errors.event_name && (
                                            <p className="text-red-500 text-xs mt-0.5">{formik.errors.event_name}</p>
                                        )}
                                    </div>

                                    {/* Event Date - Fixed UI */}
                                    <div>
                                        <DatePicker
                                            value={formik.values.event_date}
                                            onChange={(date) => {
                                                formik.setFieldValue("event_date", date);
                                                formik.setFieldTouched("event_date", true);
                                            }}
                                            label="Event Date *"
                                            minDate={new Date().toISOString().split('T')[0]}
                                            error={formik.touched.event_date && !!formik.errors.event_date}
                                            errorMessage={formik.errors.event_date}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Start Time and End Time */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label className="text-xs font-semibold mb-1.5 block">Start Time *</Label>
                                            <TimePicker
                                                value={formik.values.event_start_time}
                                                onChange={(time) => {
                                                    formik.setFieldValue("event_start_time", time);
                                                    formik.setFieldTouched("event_start_time", true);
                                                }}
                                                error={formik.touched.event_start_time && !!formik.errors.event_start_time}
                                                errorMessage={formik.errors.event_start_time}
                                                selectedDate={formik.values.event_date}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs font-semibold mb-1.5 block">End Time *</Label>
                                            <TimePicker
                                                value={formik.values.event_end_time}
                                                onChange={(time) => {
                                                    // Validate end time is not before start time
                                                    if (formik.values.event_start_time && time) {
                                                        const [startH, startM] = formik.values.event_start_time.split(':').map(Number);
                                                        const [endH, endM] = time.split(':').map(Number);
                                                        const startTotalMinutes = startH * 60 + startM;
                                                        const endTotalMinutes = endH * 60 + endM;
                                                        
                                                        if (endTotalMinutes <= startTotalMinutes) {
                                                            toast.error("❌ End time cannot be before or equal to start time! Please select a later time.");
                                                            return;
                                                        }
                                                    }
                                                    formik.setFieldValue("event_end_time", time);
                                                    formik.setFieldTouched("event_end_time", true);
                                                    toast.success("✅ End time set successfully!");
                                                }}
                                                error={formik.touched.event_end_time && !!formik.errors.event_end_time}
                                                errorMessage={formik.errors.event_end_time}
                                                selectedDate={formik.values.event_date}
                                            />
                                        </div>
                                    </div>

                                    {/* Event Description - Full Width */}
                                    <div>
                                        <Label className="text-xs font-semibold mb-1.5 block">Event Description *</Label>
                                        <textarea
                                            placeholder="Describe your event in detail..."
                                            {...formik.getFieldProps('event_description')}
                                            maxLength={1000}
                                            className="w-full h-20 px-3 py-2 bg-gray-50 rounded-md text-xs resize-none focus:outline-none focus:ring-2 focus:ring-[#a797cc]"
                                        />
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            ({formik.values.event_description?.length || 0}/1000 characters)
                                        </p>
                                        {formik.touched.event_description && formik.errors.event_description && (
                                            <p className="text-red-500 text-xs mt-0.5">{formik.errors.event_description}</p>
                                        )}
                                    </div>

                                    {/* No of Attendees */}
                                    <div>
                                        <Label className="text-xs font-semibold mb-1.5 block">No of Attendees *</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            max={maxEventCapacity}
                                            placeholder={`Max: ${maxEventCapacity}`}
                                            {...formik.getFieldProps('no_of_attendees')}
                                            className="h-8 text-xs"
                                        />
                                        {formik.touched.no_of_attendees && formik.errors.no_of_attendees && (
                                            <p className="text-red-500 text-xs mt-0.5">{formik.errors.no_of_attendees}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Images & Location */}
                            {currentStep === 2 && (
                                <div className="space-y-3">
                                    <div>
                                        <Label className="text-xs font-semibold mb-1.5 block">
                                            {t('add.tab4')} ({previewUrls.length}/5)
                                        </Label>
                                        {previewUrls.length > 0 && (
                                            <div className="grid grid-cols-4 gap-1.5 mb-2">
                                                {previewUrls.map((url, index) => (
                                                    <div key={index} className="relative group">
                                                        <img
                                                            src={url}
                                                            alt={`Event image ${index + 1}`}
                                                            className="w-full h-16 object-cover rounded border border-gray-200"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {previewUrls.length < 5 && (
                                            <div className="w-full cursor-pointer">
                                                <div className="w-full h-20 border-2 border-dashed bg-gray-50 border-gray-300 rounded-md flex items-center justify-center hover:border-[#a797cc] transition-colors">
                                                    <label htmlFor="file-upload" className="flex justify-center flex-col items-center cursor-pointer w-full h-full">
                                                        {imageLoading ? (
                                                            <Loader />
                                                        ) : (
                                                            <>
                                                                <Icon icon="lucide:upload" className="w-5 h-5 text-gray-400" />
                                                                <p className="text-gray-500 text-xs mt-0.5">
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
                                    </div>

                                    <div>
                                        <Label className="text-xs font-semibold mb-1.5 block">{t('add.tab7')} *</Label>
                                        <div className="space-y-2">
                                            {/* Manual Address Input */}
                                            <Input
                                                type="text"
                                                placeholder="Enter address manually or select from map"
                                                {...formik.getFieldProps('event_address')}
                                                className="h-8 text-xs"
                                                onChange={(e) => {
                                                    formik.setFieldValue('event_address', e.target.value);
                                                    // Geocode address when manually entered
                                                    if (e.target.value && isLoaded && window.google) {
                                                        const geocoder = new window.google.maps.Geocoder();
                                                        geocoder.geocode({ address: e.target.value }, (results, status) => {
                                                            if (status === 'OK' && results && results[0]) {
                                                                const location = results[0].geometry.location;
                                                                formik.setFieldValue('latitude', location.lat().toFixed(6));
                                                                formik.setFieldValue('longitude', location.lng().toFixed(6));
                                                                setMarkerPosition({ lat: location.lat(), lng: location.lng() });
                                                                if (map) {
                                                                    map.setCenter({ lat: location.lat(), lng: location.lng() });
                                                                    map.setZoom(15);
                                                                }
                                                            }
                                                        });
                                                    }
                                                }}
                                            />
                                            
                                            {/* Google Maps Autocomplete */}
                                            {isLoaded && !mapError && (
                                                <Autocomplete
                                                    onLoad={(autocomplete) => setAutocomplete(autocomplete)}
                                                    onPlaceChanged={() => {
                                                        if (autocomplete) {
                                                            const place = autocomplete.getPlace();
                                                            if (place.geometry && place.geometry.location) {
                                                                const location = {
                                                                    lat: place.geometry.location.lat(),
                                                                    lng: place.geometry.location.lng(),
                                                                };
                                                                formik.setFieldValue('latitude', location.lat.toFixed(6));
                                                                formik.setFieldValue('longitude', location.lng.toFixed(6));
                                                                formik.setFieldValue('event_address', place.formatted_address || place.name);
                                                                setMarkerPosition(location);
                                                                if (map) {
                                                                    map.setCenter(location);
                                                                    map.setZoom(15);
                                                                }
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <Input
                                                        type="text"
                                                        placeholder="Or search on map..."
                                                        className="h-8 text-xs"
                                                    />
                                                </Autocomplete>
                                            )}
                                            
                                            {/* Google Map */}
                                            {mapError ? (
                                                <div className="h-48 w-full rounded-md border flex items-center justify-center bg-red-50">
                                                    <p className="text-xs text-red-600 text-center px-4">
                                                        {mapError}
                                                    </p>
                                                </div>
                                            ) : isLoaded ? (
                                                <div className="h-48 w-full rounded-md overflow-hidden border">
                                                    <GoogleMap
                                                        mapContainerStyle={{ width: '100%', height: '100%' }}
                                                        center={markerPosition || { lat: 24.7136, lng: 46.6753 }}
                                                        zoom={markerPosition ? 15 : 10}
                                                        onLoad={(mapInstance) => setMap(mapInstance)}
                                                        onClick={(e) => {
                                                            const lat = e.latLng.lat();
                                                            const lng = e.latLng.lng();
                                                            const position = { lat, lng };
                                                            formik.setFieldValue('latitude', lat.toFixed(6));
                                                            formik.setFieldValue('longitude', lng.toFixed(6));
                                                            setMarkerPosition(position);
                                                            // Geocode to get address
                                                            if (window.google) {
                                                                const geocoder = new window.google.maps.Geocoder();
                                                                geocoder.geocode({ location: position }, (results, status) => {
                                                                    if (status === 'OK' && results && results[0]) {
                                                                        formik.setFieldValue('event_address', results[0].formatted_address);
                                                                    }
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        {markerPosition && (
                                                            <Marker
                                                                position={markerPosition}
                                                                draggable
                                                                onDragEnd={(e) => {
                                                                    const lat = e.latLng.lat();
                                                                    const lng = e.latLng.lng();
                                                                    const position = { lat, lng };
                                                                    formik.setFieldValue('latitude', lat.toFixed(6));
                                                                    formik.setFieldValue('longitude', lng.toFixed(6));
                                                                    setMarkerPosition(position);
                                                                    if (window.google) {
                                                                        const geocoder = new window.google.maps.Geocoder();
                                                                        geocoder.geocode({ location: position }, (results, status) => {
                                                                            if (status === 'OK' && results && results[0]) {
                                                                                formik.setFieldValue('event_address', results[0].formatted_address);
                                                                            }
                                                                        });
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                    </GoogleMap>
                                                </div>
                                            ) : (
                                                <div className="h-48 w-full rounded-md border flex items-center justify-center bg-gray-100">
                                                    <p className="text-xs text-gray-500">Loading map...</p>
                                                </div>
                                            )}
                                        </div>
                                        {formik.touched.event_address && formik.errors.event_address && (
                                            <p className="text-red-500 text-xs mt-0.5">{formik.errors.event_address}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Categories & Details */}
                            {currentStep === 3 && (
                                <div className="space-y-3">
                                    <div>
                                        <Label className="text-xs font-semibold mb-1.5 block">
                                            {t('add.tab8')} <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {PERMANENT_CATEGORIES.map((category) => {
                                                // Handle both single category (join events) and array (welcome events)
                                                const isSelected = Number(eventType) === 1
                                                    ? formik.values.event_category === category._id
                                                    : (Array.isArray(formik.values.event_category) ? formik.values.event_category : []).includes(category._id);
                                                
                                                return (
                                                    <Button
                                                        key={category._id}
                                                        type="button"
                                                        variant={isSelected ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => {
                                                            if (Number(eventType) === 1) {
                                                                // Join events - single selection
                                                                formik.setFieldValue('event_category', isSelected ? "" : category._id);
                                                            } else {
                                                                // Welcome events - multiple selection
                                                                const currentCategories = Array.isArray(formik.values.event_category) ? formik.values.event_category : [];
                                                                if (isSelected) {
                                                                    formik.setFieldValue('event_category', currentCategories.filter(id => id !== category._id));
                                                                } else {
                                                                    formik.setFieldValue('event_category', [...currentCategories, category._id]);
                                                                }
                                                            }
                                                        }}
                                                        className={`text-xs h-7 px-2 ${
                                                            isSelected
                                                                ? 'bg-gradient-to-r from-[#a797cc] to-[#8ba179] text-white'
                                                                : ''
                                                        }`}
                                                    >
                                                        {category.name}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                        {formik.touched.event_category && formik.errors.event_category && (
                                            <p className="text-red-500 text-xs mt-0.5">{formik.errors.event_category}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label className="text-xs font-semibold mb-1.5 block">{t('add.tab14')} *</Label>
                                        <Input
                                            type="number"
                                            placeholder="Enter Amount"
                                            {...formik.getFieldProps('event_price')}
                                            className="h-8 text-xs"
                                        />
                                        {formik.touched.event_price && formik.errors.event_price && (
                                            <p className="text-red-500 text-xs mt-0.5">{formik.errors.event_price}</p>
                                        )}
                                    </div>

                                    <div className="hidden">
                                        <Label className="text-sm font-semibold mb-2 block">Event For</Label>
                                        <div className="flex gap-2">
                                            {['tab10', 'tab11', 'tab12'].map((tab, index) => {
                                                const genderText = t(`add.${tab}`);
                                                const isSelected = formik.values.event_for === index + 1;
                                                return (
                                                    <Button
                                                        key={tab}
                                                        type="button"
                                                        variant={isSelected ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => handleEventForSelect(index + 1)}
                                                        className={`text-xs h-8 ${
                                                            isSelected
                                                                ? 'bg-gradient-to-r from-[#a797cc] to-[#8ba179] text-white'
                                                                : ''
                                                        }`}
                                                    >
                                                        {genderText}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Do's & Don'ts */}
                            {currentStep === 4 && (
                                <div className="space-y-3">
                                    <div className="space-y-4">
                                        {/* Do's Instructions */}
                                        <div>
                                            <Label className="text-xs font-semibold mb-1.5 block flex items-center gap-2">
                                                <Icon icon="lucide:thumbs-up" className="w-4 h-4 text-green-600" />
                                                Do's Instructions (Optional)
                                            </Label>
                                            <textarea
                                                placeholder="Add things guests SHOULD do or follow (e.g., Wear comfortable shoes, Bring water bottle, etc.)"
                                                {...formik.getFieldProps('dos_instruction')}
                                                maxLength={500}
                                                className="w-full h-24 px-3 py-2 bg-gray-50 rounded-md text-xs resize-none focus:outline-none focus:ring-2 focus:ring-green-500 border border-green-200"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                ({formik.values.dos_instruction?.length || 0}/500 characters)
                                            </p>
                                        </div>

                                        {/* Don'ts Instructions */}
                                        <div>
                                            <Label className="text-xs font-semibold mb-1.5 block flex items-center gap-2">
                                                <Icon icon="lucide:thumbs-down" className="w-4 h-4 text-red-600" />
                                                Don'ts Instructions (Optional)
                                            </Label>
                                            <textarea
                                                placeholder="Add things guests SHOULD NOT do (e.g., Do not wear high heels, Do not bring pets, etc.)"
                                                {...formik.getFieldProps('do_not_instruction')}
                                                maxLength={500}
                                                className="w-full h-24 px-3 py-2 bg-gray-50 rounded-md text-xs resize-none focus:outline-none focus:ring-2 focus:ring-red-500 border border-red-200"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                ({formik.values.do_not_instruction?.length || 0}/500 characters)
                                            </p>
                                        </div>

                                        {/* Info Box */}
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                                            <div className="flex gap-2">
                                                <Icon icon="lucide:info" className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-xs font-semibold text-blue-900">💡 Tips:</p>
                                                    <p className="text-xs text-blue-800 mt-1">
                                                        • Clear instructions help guests prepare better<br/>
                                                        • List practical requirements and expectations<br/>
                                                        • Keep instructions concise and easy to understand<br/>
                                                        • Both fields are optional - fill only if needed
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 5: Review & Submit */}
                            {currentStep === 5 && (
                                <div className="space-y-3">
                                    <div className="bg-gray-50 p-3 rounded-md space-y-2">
                                        <div>
                                            <span className="text-xs font-semibold text-gray-600">Event Name:</span>
                                            <p className="text-xs mt-0.5">{formik.values.event_name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-gray-600">Date & Time:</span>
                                            <p className="text-xs mt-0.5">{formik.values.event_date} {formik.values.event_start_time} - {formik.values.event_end_time}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-gray-600">Description:</span>
                                            <p className="text-xs mt-0.5">{formik.values.event_description?.substring(0, 100)}...</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-gray-600">Address:</span>
                                            <p className="text-xs mt-0.5">{formik.values.event_address || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-gray-600">Categories:</span>
                                            <p className="text-xs mt-0.5">
                                                {(() => {
                                                    if (Number(eventType) === 1) {
                                                        // Join events - single category
                                                        const cat = PERMANENT_CATEGORIES.find(c => c._id === formik.values.event_category);
                                                        return cat ? cat.name : 'N/A';
                                                    } else {
                                                        // Welcome events - array
                                                        return Array.isArray(formik.values.event_category) && formik.values.event_category.length > 0
                                                            ? PERMANENT_CATEGORIES.filter(cat => formik.values.event_category.includes(cat._id)).map(cat => cat.name).join(', ')
                                                            : 'N/A';
                                                    }
                                                })()}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-gray-600">Attendees:</span>
                                            <p className="text-xs mt-0.5">{formik.values.no_of_attendees}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-gray-600">Price:</span>
                                            <p className="text-xs mt-0.5">{formik.values.event_price} SAR</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-gray-600">Images:</span>
                                            <p className="text-xs mt-0.5">{eventImages.length} image(s) uploaded</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between pt-3 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleBack}
                                    disabled={currentStep === 1}
                                    className="h-8 text-xs"
                                    size="sm"
                                >
                                    <Icon icon="lucide:arrow-left" className="w-3 h-3 mr-1.5" />
                                    Back
                                </Button>
                                {currentStep < STEPS.length ? (
                                    <Button
                                        type="button"
                                        onClick={handleNext}
                                        className="h-8 text-xs bg-gradient-to-r from-[#a797cc] to-[#8ba179] text-white"
                                        size="sm"
                                    >
                                        Next
                                        <Icon icon="lucide:arrow-right" className="w-3 h-3 ml-1.5" />
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            if (eventImages.length === 0) {
                                                toast.error("Please upload at least one event image");
                                                return;
                                            }
                                            if (eventId) {
                                                formik.handleSubmit();
                                            } else {
                                                setPendingPayload({ values: formik.values, resetForm: formik.resetForm });
                                                setShowCreateConfirm(true);
                                            }
                                        }}
                                        disabled={loading || eventImages.length === 0}
                                        className="h-8 text-xs bg-gradient-to-r from-[#a797cc] to-[#8ba179] text-white"
                                        size="sm"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader color="#fff" height="14" width="14" />
                                                <span className="ml-1.5">Submitting...</span>
                                            </>
                                        ) : (
                                            <>
                                                {eventId ? 'Update Event' : 'Create Event'}
                                                <Icon icon="lucide:check" className="w-3 h-3 ml-1.5" />
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Create Event Confirmation Modal */}
            {showCreateConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md mx-4 bg-white shadow-2xl border-0">
                        <CardHeader>
                            <CardTitle className="text-center">Confirm Create Event</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-gray-600 text-center">
                                Once submitted, your event will be reviewed by our team before being published.
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowCreateConfirm(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => {
                                        if (pendingPayload) {
                                            submitEvent(pendingPayload.values, pendingPayload.resetForm);
                                        }
                                    }}
                                    className="flex-1 bg-gradient-to-r from-[#a797cc] to-[#8ba179] text-white"
                                >
                                    Yes, Create Event
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Success Popup */}
            {showSuccessPopup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md mx-4 bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl border-2 border-blue-200">
                        <CardContent className="p-8 text-center">
                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                                <Icon icon="lucide:check-circle" className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
                                Event Submitted for Review
                            </h3>
                            <p className="text-sm text-blue-700 font-medium">
                                Please check your email for confirmation.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
}
