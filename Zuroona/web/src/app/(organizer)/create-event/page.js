"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { toast } from 'react-toastify';
import { showGreenTick } from '@/utils/toastHelpers';
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

// Permanent Event Categories List (key used for translation)
const PERMANENT_CATEGORIES = [
    { _id: 'cultural-traditional', key: 'categoryCulturalTraditional', name: 'Cultural & Traditional Events' },
    { _id: 'outdoor-adventure', key: 'categoryOutdoorAdventure', name: 'Outdoor & Adventure' },
    { _id: 'educational-workshops', key: 'categoryEducationalWorkshops', name: 'Educational & Workshops' },
    { _id: 'sports-fitness', key: 'categorySportsFitness', name: 'Sports & Fitness' },
    { _id: 'music-arts', key: 'categoryMusicArts', name: 'Music & Arts' },
    { _id: 'family-kids', key: 'categoryFamilyKids', name: 'Family & Kids Activities' },
    { _id: 'food-culinary', key: 'categoryFoodCulinary', name: 'Food & Culinary Experiences' },
    { _id: 'wellness-relaxation', key: 'categoryWellnessRelaxation', name: 'Wellness & Relaxation' },
    { _id: 'heritage-history', key: 'categoryHeritageHistory', name: 'Heritage & History Tours' },
    { _id: 'nightlife-entertainment', key: 'categoryNightlifeEntertainment', name: 'Nightlife & Entertainment' },
    { _id: 'eco-sustainable', key: 'categoryEcoSustainable', name: 'Eco & Sustainable Tourism' },
    { _id: 'business-networking', key: 'categoryBusinessNetworking', name: 'Business & Networking' },
    { _id: 'volunteering', key: 'categoryVolunteering', name: 'Volunteering' },
    { _id: 'photography-sightseeing', key: 'categoryPhotographySightseeing', name: 'Photography & Sightseeing' },
];

const STEP_CONFIG = [
    { id: 1, key: 'event.createTitle', fallback: 'Basic Information', icon: 'lucide:info' },
    { id: 2, key: 'event.step2Title', fallback: 'Images & Location', icon: 'lucide:image' },
    { id: 3, key: 'event.step3Title', fallback: 'Categories & Details', icon: 'lucide:tag' },
    { id: 4, key: 'event.step4Title', fallback: "Do's & Don'ts", icon: 'lucide:lightbulb' },
    { id: 5, key: 'event.step5Title', fallback: 'Review & Submit', icon: 'lucide:check-circle' },
];

// Shared field box style for inputs and date picker (same look across form)
const FIELD_BOX_CLASS = "h-12 text-base rounded-xl border-2 border-gray-200 bg-gray-50/50 focus:border-[#a797cc] focus:ring-4 focus:ring-purple-100 transition-all hover:border-purple-200";
const PLACEHOLDER_OPACITY_CLASS = "placeholder:opacity-60 placeholder:text-gray-400";

// Professional Time Picker Component with Buttons - With Time Restrictions
const TimePicker = ({ value, onChange, minTime, error, errorMessage, selectedDate }) => {
    const { t, i18n } = useTranslation();
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
    }, [hours, minutes, isAM, onChange, value]);

    const incrementHours = () => {
        const newHours = hours === 12 ? 1 : hours + 1;
        const h24 = newHours === 12 ? (isAM ? 0 : 12) : (isAM ? newHours : newHours + 12);
        if (isTimeAllowed(h24, minutes)) {
            setHours(newHours);
        } else {
            toast.warning(t("add.cannotSelectPastTime") || "⏰ Cannot select past time! Please select a future time.");
        }
    };

    const decrementHours = () => {
        const newHours = hours === 1 ? 12 : hours - 1;
        const h24 = newHours === 12 ? (isAM ? 0 : 12) : (isAM ? newHours : newHours + 12);
        if (isTimeAllowed(h24, minutes)) {
            setHours(newHours);
        } else {
            toast.warning(t("add.cannotSelectPastTime") || "⏰ Cannot select past time! Please select a future time.");
        }
    };

    const incrementMinutes = () => {
        const newMinutes = minutes + 5 > 59 ? 0 : minutes + 5;
        const h24 = hours === 12 ? (isAM ? 0 : 12) : (isAM ? hours : hours + 12);
        if (isTimeAllowed(h24, newMinutes)) {
            setMinutes(newMinutes);
        } else {
            toast.warning(t("add.cannotSelectPastTime") || "⏰ Cannot select past time! Please select a future time.");
        }
    };

    const decrementMinutes = () => {
        const newMinutes = minutes === 0 ? 55 : minutes - 5;
        const h24 = hours === 12 ? (isAM ? 0 : 12) : (isAM ? hours : hours + 12);
        if (isTimeAllowed(h24, newMinutes)) {
            setMinutes(newMinutes);
        } else {
            toast.warning(t("add.cannotSelectPastTime") || "⏰ Cannot select past time! Please select a future time.");
        }
    };

    const toggleAMPM = () => {
        const h24 = hours === 12 ? (isAM ? 0 : 12) : (isAM ? hours : hours + 12);
        const newH24 = isAM ? h24 + 12 : h24 - 12;
        if (isTimeAllowed(newH24, minutes)) {
            setIsAM(prev => !prev);
        } else {
            toast.warning(t("add.cannotSelectPastTime") || "⏰ Cannot select past time! Please select a future time.");
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
    const { t, i18n } = useTranslation();
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
            showGreenTick();
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
                        className={`w-full justify-between text-left font-normal px-4 ${FIELD_BOX_CLASS} data-[empty=true]:text-gray-400 data-[empty=true]:opacity-80`}
                    >
                        {dateValue ? format(dateValue, "PPP") : <span>{t('add.pickDate') || 'Pick a date'}</span>}
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
    const { t, i18n } = useTranslation();
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
    const [mapLoadedSuccessfully, setMapLoadedSuccessfully] = useState(false);
    const [mapRetryCount, setMapRetryCount] = useState(0);
    const mapLoadedRef = useRef(false);
    
    const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    // Loader options must stay stable: do NOT pass language here. Changing language causes
    // "Loader must not be called again with different options". Map/Places use default script language.
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
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
                .min(3, typeof t === 'function' ? t('add.eventTitleMinChars') : 'Event title must be at least 3 characters')
                .max(200, typeof t === 'function' ? t('add.eventTitleMaxChars') : 'Event title cannot exceed 200 characters'),
            event_description: Yup.string()
                .required(t('signup.tab16'))
                .min(20, t('add.eventDescriptionMinChars') || 'Event description must be at least 20 characters')
                .max(1000, t('add.eventDescriptionMaxChars') || 'Event description cannot exceed 1000 characters'),
            event_address: Yup.string().required(t('signup.tab16')),
            no_of_attendees: Yup.number()
                .min(1, t("add.eventCapacityAtLeast1") || "Event capacity must be at least 1")
                .max(maxEventCapacity, t("add.eventCapacityCannotExceed", { max: maxEventCapacity }) || `Event capacity cannot exceed ${maxEventCapacity}`)
                .required(t("add.thisFieldRequired") || "This field is required"),
            event_price: Yup.number()
                .required(t('signup.tab16') || 'Event price is required')
                .min(1, t('add.eventPriceMin1SAR') || 'Event price must be at least 1 SAR')
                .positive(t('signup.tab16') || 'Event price must be greater than 0'),
            event_for: Yup.string()
                .required(t('signup.tab16'))
                .oneOf(['1', '2', '3'], t('signup.tab17')),
            event_category: Number(eventType) === 1 
                ? Yup.string().required(t('signup.tab16'))
                : Yup.array().min(1, t("add.pleaseSelectAtLeastOneCategory") || "Please select at least one category").required(t('signup.tab16')),
            dos_instruction: Yup.string()
                .max(500, t("add.dosInstructionsMaxChars") || "Do's instructions cannot exceed 500 characters"),
            do_not_instruction: Yup.string()
                .max(500, t("add.dontsInstructionsMaxChars") || "Don'ts instructions cannot exceed 500 characters"),
        }),
        enableReinitialize: true,
        onSubmit: async (values, { resetForm }) => {
            // Validate price immediately - must be at least 1 SAR
            const price = Number(values.event_price);
            if (isNaN(price) || price < 1) {
                toast.error(t('add.eventPriceMin1SAR') || 'Event price must be at least 1 SAR. Events with price less than 1 SAR cannot be created.');
                return;
            }

            if (eventImages.length === 0) {
                toast.error(t("add.pleaseUploadAtLeastOneImage") || "Please upload at least one event image");
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
        
        // Validate price before submitting - must be at least 1 SAR
        const price = Number(values.event_price);
        if (isNaN(price) || price < 1) {
            setLoading(false);
            toast.error(t('add.eventPriceMin1SAR') || 'Event price must be at least 1 SAR. Events with price less than 1 SAR cannot be created.');
            if (setShowCreateConfirm) setShowCreateConfirm(false);
            return;
        }
        
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
                    showGreenTick();
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
                showGreenTick();
            } else {
                throw new Error(resp?.message || t("add.uploadFailed") || "Upload failed");
            }
        } catch (error) {
            console.error("[EVENT-IMAGE-UPLOAD] Error:", error);
            toast.error(error?.message || t("add.uploadFailed") || "Image upload failed");
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

    // Surface missing key or load errors clearly (messages translated)
    useEffect(() => {
        if (!GOOGLE_MAPS_API_KEY) {
            setMapError(t('maps.apiKeyMissing'));
        }
    }, [GOOGLE_MAPS_API_KEY, t]);

    useEffect(() => {
        if (loadError) {
            setMapError(loadError.message || t('maps.loadFailed'));
        }
    }, [loadError, t]);

    // Overlay stays until onLoad. Give map 12s to load (slow networks) before showing "Map unavailable".
    useEffect(() => {
        if (!isLoaded || mapError) return;
        mapLoadedRef.current = false;
        setMapLoadedSuccessfully(false);
        const timer = setTimeout(() => {
            if (!mapLoadedRef.current) setMapError(t('maps.loadFailed'));
        }, 12000);
        return () => clearTimeout(timer);
    }, [isLoaded, mapError, t]);

    const validateStep = (step) => {
        const errors = {};
        
        if (step === 1) {
            if (!formik.values.event_date) errors.event_date = 'Required';
            if (!formik.values.event_start_time) errors.event_start_time = 'Required';
            if (!formik.values.event_name || formik.values.event_name.length < 3) errors.event_name = 'Required';
            if (!formik.values.no_of_attendees || formik.values.no_of_attendees < 1) errors.no_of_attendees = 'Required';
        } else if (step === 2) {
            if (eventImages.length === 0) {
                toast.error(t("add.pleaseUploadAtLeastOneImage") || "Please upload at least one event image");
                return false;
            }
            if (!formik.values.event_address) errors.event_address = 'Required';
        } else if (step === 3) {
            if (Number(eventType) === 1) {
                // Join events - single category string
                if (!formik.values.event_category || formik.values.event_category === "") {
                    toast.error(t("add.pleaseSelectCategory") || "Please select a category");
                    return false;
                }
            } else {
                // Welcome events - array of categories
                const selectedCategories = Array.isArray(formik.values.event_category) ? formik.values.event_category : [];
                if (selectedCategories.length === 0) {
                    toast.error(t("add.pleaseSelectAtLeastOneCategory") || "Please select at least one category");
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
            setCurrentStep(prev => Math.min(prev + 1, STEP_CONFIG.length));
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const breadcrumbItems = [
        { label: t('breadcrumb.tab1'), href: "/" },
        { label: eventType === "2" ? t('breadcrumb.tab15') : t('myEventOnly'), href: eventType === "2" ? "/welcomeUsEvent" : "/joinUsEvent" },
        { label: eventId ? t('add.tab21') || 'Edit Event' : t('add.tab19') || 'Create Event', href: "#" },
    ];

    return (
        <>
            <Breadcrumbs items={breadcrumbItems} />
            <section className="bg-gradient-to-br from-gray-50 via-white to-purple-50/30 py-8 min-h-screen">
                <div className="mx-auto px-4 md:px-8 xl:px-28 max-w-4xl">
                    
                    {/* Professional Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#a797cc] to-[#8ba179] shadow-lg shadow-purple-200 mb-4">
                            <Icon icon="lucide:calendar-plus" className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#a797cc] via-[#9688b8] to-[#8ba179] bg-clip-text text-transparent mb-2">
                            {eventId ? t('add.tab21') || 'Edit Event' : t('add.tab18') || 'Create Event'}
                        </h1>
                        <p className="text-gray-500 text-sm md:text-base">
                            {eventId ? t('add.updateEventDetails') || 'Update your event details' : t('add.fillInDetails') || 'Fill in the details to create an amazing event experience'}
                        </p>
                    </div>

                    {/* Enhanced Step Indicator */}
                    <div className="mb-8 bg-white rounded-2xl shadow-lg shadow-gray-100 p-4 md:p-6 border border-gray-100">
                        <div className="flex items-center justify-between relative">
                            {/* Progress Line Background */}
                            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full mx-8" style={{ zIndex: 0 }}></div>
                            {/* Progress Line Fill */}
                            <div 
                                className="absolute top-5 left-0 h-1 bg-gradient-to-r from-[#a797cc] to-[#8ba179] rounded-full mx-8 transition-all duration-500" 
                                style={{ 
                                    zIndex: 1, 
                                    width: `calc(${((currentStep - 1) / (STEP_CONFIG.length - 1)) * 100}% - 4rem)`,
                                    marginLeft: '2rem'
                                }}
                            ></div>
                            
                            {STEP_CONFIG.map((step, index) => (
                                <div key={step.id} className="flex flex-col items-center relative z-10 flex-1">
                                    <div 
                                        className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300 transform ${
                                            currentStep >= step.id
                                                ? 'bg-gradient-to-br from-[#a797cc] to-[#8ba179] text-white shadow-lg shadow-purple-200 scale-110'
                                                : 'bg-white border-2 border-gray-200 text-gray-400 hover:border-purple-200'
                                        } ${currentStep === step.id ? 'ring-4 ring-purple-100' : ''}`}
                                    >
                                        {currentStep > step.id ? (
                                            <Icon icon="lucide:check" className="w-5 h-5 md:w-6 md:h-6" />
                                        ) : (
                                            <Icon icon={step.icon} className="w-5 h-5 md:w-6 md:h-6" />
                                        )}
                                    </div>
                                    <span className={`text-xs md:text-sm mt-2 font-semibold text-center transition-colors ${
                                        currentStep >= step.id ? 'text-[#a797cc]' : 'text-gray-400'
                                    }`}>
                                        {t(step.key) || step.fallback}
                                    </span>
                                    {currentStep === step.id && (
                                        <div className="absolute -bottom-3 w-2 h-2 rounded-full bg-[#8ba179] animate-pulse"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <Card className="border-0 shadow-xl shadow-gray-200/50 overflow-visible relative rounded-3xl bg-white/80 backdrop-blur-sm">
                        {/* Decorative Elements */}
                        <div className="absolute -top-3 -right-3 w-24 h-24 bg-gradient-to-br from-[#a797cc]/20 to-[#8ba179]/20 rounded-full blur-2xl"></div>
                        <div className="absolute -bottom-3 -left-3 w-32 h-32 bg-gradient-to-br from-[#8ba179]/10 to-[#a797cc]/10 rounded-full blur-2xl"></div>
                        
                        <CardHeader className="pb-4 px-6 pt-6 relative">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#a797cc] to-[#8ba179] text-white shadow-md`}>
                                        <Icon icon={STEP_CONFIG[currentStep - 1]?.icon || 'lucide:file-text'} className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold text-gray-800">
                                            {t(STEP_CONFIG[currentStep - 1]?.key) || STEP_CONFIG[currentStep - 1]?.fallback}
                                        </CardTitle>
                                        <p className="text-sm text-gray-500">{t('add.stepXofY', { current: currentStep, total: STEP_CONFIG.length })}</p>
                                    </div>
                                </div>
                                <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[#a797cc]/10 to-[#8ba179]/10 px-4 py-2 rounded-full">
                                    <div className="w-2 h-2 rounded-full bg-[#8ba179] animate-pulse"></div>
                                    <span className="text-sm font-medium text-[#8ba179]">
                                        {Math.round((currentStep / STEP_CONFIG.length) * 100)}{t('add.percentComplete') || '% Complete'}
                                    </span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 px-6 pb-6 overflow-visible relative">
                            {/* Step 1: Basic Information */}
                            {currentStep === 1 && (
                                <div className="space-y-5">
                                    {/* Event Title - Premium Input */}
                                    <div className="group">
                                        <Label className="text-sm font-semibold mb-2 block text-gray-700 flex items-center gap-2">
                                            <Icon icon="lucide:type" className="w-4 h-4 text-[#a797cc]" />
                                            {t('add.eventTitle') || 'Event Title'} <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                type="text"
                                                placeholder={t("add.enterEventTitle") || "Enter a captivating event title..."}
                                                {...formik.getFieldProps('event_name')}
                                                maxLength={200}
                                                className={`pl-4 pr-20 ${FIELD_BOX_CLASS} ${PLACEHOLDER_OPACITY_CLASS}`}
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-white px-2 py-1 rounded-full">
                                                {formik.values.event_name?.length || 0}/200
                                            </span>
                                        </div>
                                        {formik.touched.event_name && formik.errors.event_name && (
                                            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                                <Icon icon="lucide:alert-circle" className="w-3 h-3" />
                                                {formik.errors.event_name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Event Date - Enhanced */}
                                    <div className="group">
                                        <Label className="text-sm font-semibold mb-2 block text-gray-700 flex items-center gap-2">
                                            <Icon icon="lucide:calendar" className="w-4 h-4 text-[#a797cc]" />
                                            {t('add.eventDate') || 'Event Date'} <span className="text-red-500">*</span>
                                        </Label>
                                        <div>
                                            <DatePicker
                                                value={formik.values.event_date}
                                                onChange={(date) => {
                                                    formik.setFieldValue("event_date", date);
                                                    formik.setFieldTouched("event_date", true);
                                                }}
                                                minDate={new Date().toISOString().split('T')[0]}
                                                error={formik.touched.event_date && !!formik.errors.event_date}
                                                errorMessage={formik.errors.event_date}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    {/* Start Time and End Time - Enhanced Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="group bg-gradient-to-br from-green-50 to-emerald-50/50 p-4 rounded-2xl border-2 border-green-100 hover:border-green-200 transition-all">
                                            <Label className="text-sm font-semibold mb-2 block text-gray-700 flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-green-500 flex items-center justify-center">
                                                    <Icon icon="lucide:play" className="w-3 h-3 text-white" />
                                                </div>
                                                {t('add.startTime') || 'Start Time'} <span className="text-red-500">*</span>
                                            </Label>
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
                                        <div className="group bg-gradient-to-br from-red-50 to-orange-50/50 p-4 rounded-2xl border-2 border-red-100 hover:border-red-200 transition-all">
                                            <Label className="text-sm font-semibold mb-2 block text-gray-700 flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-red-500 flex items-center justify-center">
                                                    <Icon icon="lucide:square" className="w-3 h-3 text-white" />
                                                </div>
                                                {t('add.endTime') || 'End Time'} <span className="text-red-500">*</span>
                                            </Label>
                                            <TimePicker
                                                value={formik.values.event_end_time}
                                                onChange={(time) => {
                                                    if (formik.values.event_start_time && time) {
                                                        const [startH, startM] = formik.values.event_start_time.split(':').map(Number);
                                                        const [endH, endM] = time.split(':').map(Number);
                                                        const startTotalMinutes = startH * 60 + startM;
                                                        const endTotalMinutes = endH * 60 + endM;
                                                        
                                                        if (endTotalMinutes <= startTotalMinutes) {
                                                            toast.error(t("add.endTimeCannotBeBeforeStart") || "End time must be after start time");
                                                            return;
                                                        }
                                                    }
                                                    formik.setFieldValue("event_end_time", time);
                                                    formik.setFieldTouched("event_end_time", true);
                                                }}
                                                error={formik.touched.event_end_time && !!formik.errors.event_end_time}
                                                errorMessage={formik.errors.event_end_time}
                                                selectedDate={formik.values.event_date}
                                            />
                                        </div>
                                    </div>

                                    {/* Event Description - Premium Textarea */}
                                    <div className="group">
                                        <Label className="text-sm font-semibold mb-2 block text-gray-700 flex items-center gap-2">
                                            <Icon icon="lucide:file-text" className="w-4 h-4 text-[#a797cc]" />
                                            {t('add.eventDescription') || 'Event Description'} <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <textarea
                                                placeholder={t("add.describeEventDetail") || "Describe your event in detail. What makes it special? What will attendees experience?"}
                                                {...formik.getFieldProps('event_description')}
                                                maxLength={1000}
                                                className={`w-full h-32 px-4 py-3 resize-none text-base ${FIELD_BOX_CLASS} focus:outline-none ${PLACEHOLDER_OPACITY_CLASS}`}
                                            />
                                            <span className="absolute right-3 bottom-3 text-xs text-gray-400 bg-white px-2 py-1 rounded-full shadow-sm">
                                                {formik.values.event_description?.length || 0}/1000
                                            </span>
                                        </div>
                                        {formik.touched.event_description && formik.errors.event_description && (
                                            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                                <Icon icon="lucide:alert-circle" className="w-3 h-3" />
                                                {formik.errors.event_description}
                                            </p>
                                        )}
                                    </div>

                                    {/* No of Attendees - Enhanced */}
                                    <div className="group bg-gradient-to-br from-blue-50 to-indigo-50/50 p-4 rounded-2xl border-2 border-blue-100 hover:border-blue-200 transition-all">
                                        <Label className="text-sm font-semibold mb-2 block text-gray-700 flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-lg bg-blue-500 flex items-center justify-center">
                                                <Icon icon="lucide:users" className="w-3 h-3 text-white" />
                                            </div>
                                            {t('add.numberOfAttendees') || 'Number of Attendees'} <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="flex items-center gap-3">
                                            <Input
                                                type="number"
                                                min="1"
                                                max={maxEventCapacity}
                                                placeholder="1"
                                                {...formik.getFieldProps('no_of_attendees')}
                                                className={`h-12 text-lg font-semibold text-center max-w-[120px] ${FIELD_BOX_CLASS} ${PLACEHOLDER_OPACITY_CLASS}`}
                                            />
                                            <div className="flex-1 bg-white/80 rounded-xl px-4 py-2 border border-blue-100">
                                                <p className="text-xs text-gray-500">{t('add.maximumCapacity') || 'Maximum Capacity'}</p>
                                                <p className="text-lg font-bold text-blue-600">{maxEventCapacity} {t('add.guests') || 'guests'}</p>
                                            </div>
                                        </div>
                                        {formik.touched.no_of_attendees && formik.errors.no_of_attendees && (
                                            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                                <Icon icon="lucide:alert-circle" className="w-3 h-3" />
                                                {formik.errors.no_of_attendees}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Images & Location */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    {/* Event Images - Premium Upload */}
                                    <div className="group">
                                        <Label className="text-sm font-semibold mb-3 block text-gray-700 flex items-center gap-2">
                                            <Icon icon="lucide:image" className="w-4 h-4 text-[#a797cc]" />
                                            {t('add.eventImages') || 'Event Images'} <span className="text-red-500">*</span>
                                            <span className="ml-auto text-xs font-normal text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                                                {previewUrls.length}/5 {t('add.uploaded') || 'uploaded'}
                                            </span>
                                        </Label>
                                        
                                        {/* Image Grid */}
                                        {previewUrls.length > 0 && (
                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                                                {previewUrls.map((url, index) => (
                                                    <div key={index} className="relative group aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                                                        <Image
                                                            src={url}
                                                            alt={`Event image ${index + 1}`}
                                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                            width={200}
                                                            height={200}
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-lg w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 shadow-lg"
                                                        >
                                                            <Icon icon="lucide:trash-2" className="w-4 h-4" />
                                                        </button>
                                                        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            Image {index + 1}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        
                                        {/* Upload Zone */}
                                        {previewUrls.length < 5 && (
                                            <div className="w-full cursor-pointer">
                                                <div className="w-full h-40 border-3 border-dashed bg-gradient-to-br from-purple-50 to-green-50 border-purple-200 rounded-2xl flex items-center justify-center hover:border-[#a797cc] hover:bg-purple-50/50 transition-all duration-300 group">
                                                    <label htmlFor="file-upload" className="flex justify-center flex-col items-center cursor-pointer w-full h-full py-6">
                                                        {imageLoading ? (
                                                            <div className="flex flex-col items-center gap-2">
                                                                <Loader />
                                                                <span className="text-sm text-[#a797cc] font-medium">Uploading...</span>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#a797cc] to-[#8ba179] flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform">
                                                                    <Icon icon="lucide:cloud-upload" className="w-8 h-8 text-white" />
                                                                </div>
                                                                <p className="text-gray-700 text-base font-semibold mb-1">
                                                                    {t('add.tab4') || 'Upload Event Images'}
                                                                </p>
                                                                <p className="text-gray-400 text-sm">
                                                                    {t('add.dragDropBrowse') || 'Drag & drop or click to browse (Max 5 images)'}
                                                                </p>
                                                                <p className="text-xs text-gray-400 mt-2">
                                                                    {t('add.supportedFormats') || 'Supported: JPG, PNG, WebP'}
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
                                                placeholder={t("add.enterAddressManually") || "Enter address manually or select from map"}
                                                {...formik.getFieldProps('event_address')}
                                                className={`${FIELD_BOX_CLASS} ${PLACEHOLDER_OPACITY_CLASS}`}
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
                                                        placeholder={t("add.orSearchOnMap") || "Or search on map..."}
                                                        className={`${FIELD_BOX_CLASS} ${PLACEHOLDER_OPACITY_CLASS}`}
                                                    />
                                                </Autocomplete>
                                            )}
                                            
                                            {/* Google Map - professional fallback when map unavailable */}
                                            {mapError ? (
                                                <div className="relative h-48 w-full rounded-xl border border-gray-200 overflow-hidden bg-gradient-to-br from-gray-50 to-white">
                                                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center px-5 py-6 text-center">
                                                        <div className="w-12 h-12 rounded-full bg-[#a797cc]/10 flex items-center justify-center mb-3">
                                                            <Icon icon="lucide:map-pin-off" className="w-6 h-6 text-[#a797cc]" />
                                                        </div>
                                                        <p className="text-sm font-semibold text-gray-800 mb-1">
                                                            {t('maps.loadError')}
                                                        </p>
                                                        <p className="text-xs text-gray-500 max-w-xs mb-4 leading-relaxed">
                                                            {t('maps.loadErrorHint')}
                                                        </p>
                                                        <div className="flex flex-wrap items-center justify-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => { mapLoadedRef.current = false; setMapLoadedSuccessfully(false); setMapError(null); setMapRetryCount((c) => c + 1); }}
                                                                className="px-4 py-2 rounded-xl border-2 border-[#a797cc] text-[#a797cc] text-sm font-medium hover:bg-[#a797cc]/10 transition-colors"
                                                            >
                                                                {t('maps.retry')}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setMapError(null)}
                                                                className="px-5 py-2.5 rounded-xl bg-[#a797cc] text-white text-sm font-medium hover:bg-[#9d8bc0] transition-colors shadow-sm"
                                                            >
                                                                {t('maps.ok')}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : isLoaded ? (
                                                <div key={mapRetryCount} className="relative h-48 w-full rounded-md overflow-hidden border isolate">
                                                    {/* Overlay until map onLoad; 12s timeout then "Map unavailable" + Retry */}
                                                    {!mapLoadedSuccessfully && (
                                                        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-white rounded-md shadow-inner">
                                                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#a797cc] border-t-transparent mb-3" />
                                                            <p className="text-sm font-medium text-gray-700">{t('maps.loadingMap')}</p>
                                                            <p className="text-xs text-gray-500 mt-1">{t('maps.loadingMapHint')}</p>
                                                        </div>
                                                    )}
                                                    <GoogleMap
                                                        mapContainerStyle={{ width: '100%', height: '100%' }}
                                                        center={markerPosition || { lat: 24.7136, lng: 46.6753 }}
                                                        zoom={markerPosition ? 15 : 10}
                                                        onLoad={(mapInstance) => { mapLoadedRef.current = true; setMap(mapInstance); setMapLoadedSuccessfully(true); }}
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
                                                    <p className="text-xs text-gray-500">{t('maps.loadingMap')}</p>
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
                                                        {t(`events.${category.key}`) || category.name}
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
                                            placeholder={t("add.enterAmount") || "Enter Amount"}
                                            {...formik.getFieldProps('event_price')}
                                            className={`${FIELD_BOX_CLASS} ${PLACEHOLDER_OPACITY_CLASS}`}
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
                                                {t('add.dosInstructions') || "Do's Instructions (Optional)"}
                                            </Label>
                                            <textarea
                                                placeholder={t('add.dosPlaceholder') || "Add things guests SHOULD do or follow (e.g., Wear comfortable shoes, Bring water bottle, etc.)"}
                                                {...formik.getFieldProps('dos_instruction')}
                                                maxLength={500}
                                                className={`w-full h-24 px-4 py-3 resize-none text-base ${FIELD_BOX_CLASS} focus:outline-none ${PLACEHOLDER_OPACITY_CLASS}`}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                ({formik.values.dos_instruction?.length || 0}/500 {t('add.characters') || 'characters'})
                                            </p>
                                        </div>

                                        {/* Don'ts Instructions */}
                                        <div>
                                            <Label className="text-xs font-semibold mb-1.5 block flex items-center gap-2">
                                                <Icon icon="lucide:thumbs-down" className="w-4 h-4 text-red-600" />
                                                {t('add.dontInstructions') || "Don'ts Instructions (Optional)"}
                                            </Label>
                                            <textarea
                                                placeholder={t('add.dontsPlaceholder') || "Add things guests SHOULD NOT do (e.g., Do not wear high heels, Do not bring pets, etc.)"}
                                                {...formik.getFieldProps('do_not_instruction')}
                                                maxLength={500}
                                                className={`w-full h-24 px-4 py-3 resize-none text-base ${FIELD_BOX_CLASS} focus:outline-none ${PLACEHOLDER_OPACITY_CLASS}`}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                ({formik.values.do_not_instruction?.length || 0}/500 {t('add.characters') || 'characters'})
                                            </p>
                                        </div>

                                        {/* Info Box */}
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                                            <div className="flex gap-2">
                                                <Icon icon="lucide:info" className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-xs font-semibold text-blue-900">{t('add.tips') || '💡 Tips:'}</p>
                                                    <p className="text-xs text-blue-800 mt-1">
                                                        • {t('add.clearInstructionsTip') || 'Clear instructions help guests prepare better'}<br/>
                                                        • {t('add.practicalRequirementsTip') || 'List practical requirements and expectations'}<br/>
                                                        • {t('add.conciseInstructionsTip') || 'Keep instructions concise and easy to understand'}<br/>
                                                        • {t('add.optionalFieldsTip') || 'Both fields are optional - fill only if needed'}
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
                                            <span className="text-xs font-semibold text-gray-600">{t('add.eventNameLabel') || 'Event Name:'}  </span>
                                            <p className="text-xs mt-0.5">{formik.values.event_name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-gray-600">{t('add.dateAndTimeLabel') || 'Date & Time:'}</span>
                                            <p className="text-xs mt-0.5">{formik.values.event_date} {formik.values.event_start_time} - {formik.values.event_end_time}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-gray-600">{t('add.descriptionLabel') || 'Description'}:</span>
                                            <p className="text-xs mt-0.5">{formik.values.event_description?.substring(0, 100)}...</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-gray-600">{t('add.addressLabel') || 'Address:'}</span>
                                            <p className="text-xs mt-0.5">{formik.values.event_address || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-gray-600">{t('add.categoriesLabel') || 'Categories:'}</span>
                                            <p className="text-xs mt-0.5">
                                                {(() => {
                                                    if (Number(eventType) === 1) {
                                                        const cat = PERMANENT_CATEGORIES.find(c => c._id === formik.values.event_category);
                                                        return cat ? (t(`events.${cat.key}`) || cat.name) : 'N/A';
                                                    } else {
                                                        return Array.isArray(formik.values.event_category) && formik.values.event_category.length > 0
                                                            ? PERMANENT_CATEGORIES.filter(cat => formik.values.event_category.includes(cat._id)).map(cat => t(`events.${cat.key}`) || cat.name).join(', ')
                                                            : 'N/A';
                                                    }
                                                })()}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-gray-600">{t('add.attendeesLabel') || 'Attendees:'}</span>
                                            <p className="text-xs mt-0.5">{formik.values.no_of_attendees}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-gray-600">{t('add.priceLabel') || 'Price:'}</span>
                                            <p className="text-xs mt-0.5">{formik.values.event_price} {t('add.sar') || 'SAR'}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-gray-600">{t('add.imagesLabel') || 'Images:'}</span>
                                            <p className="text-xs mt-0.5">{eventImages.length} {t('add.imagesUploaded') || 'image(s) uploaded'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons - Premium */}
                            <div className="flex justify-between items-center pt-6 mt-6 border-t-2 border-gray-100">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleBack}
                                    disabled={currentStep === 1}
                                    className={`h-12 px-6 text-sm font-semibold rounded-xl border-2 transition-all duration-300 ${
                                        currentStep === 1 
                                            ? 'opacity-50 cursor-not-allowed' 
                                            : 'hover:bg-gray-50 hover:border-gray-300 hover:shadow-md'
                                    }`}
                                >
                                    <Icon icon="lucide:arrow-left" className="w-4 h-4 mr-2" />
                                    {t('add.backButton') || 'Back'}
                                </Button>
                                
                                {currentStep < STEP_CONFIG.length ? (
                                    <Button
                                        type="button"
                                        onClick={handleNext}
                                        className="h-12 px-8 text-sm font-semibold bg-gradient-to-r from-[#a797cc] to-[#8ba179] text-white rounded-xl shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all duration-300 hover:scale-105"
                                    >
                                        {t('add.continueToNextStep') || 'Continue to Next Step'}
                                        <Icon icon="lucide:arrow-right" className="w-4 h-4 ml-2" />
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
                                        className="h-12 px-8 text-sm font-semibold bg-gradient-to-r from-[#a797cc] via-purple-500 to-[#8ba179] text-white rounded-xl shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <Loader color="#fff" height="16" width="16" />
                                                <span>Creating Event...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Icon icon="lucide:rocket" className="w-5 h-5" />
                                                {eventId ? (t('add.updateEvent') || 'Update Event') : (t('add.submitEvent') || 'Submit Event')}
                                            </div>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Create Event Confirmation Modal - Premium */}
            {showCreateConfirm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-lg mx-4 bg-white shadow-2xl border-0 rounded-3xl overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Decorative Header */}
                        <div className="bg-gradient-to-r from-[#a797cc] via-purple-500 to-[#8ba179] p-6 text-center">
                            <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                <Icon icon="lucide:rocket" className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">
                                {t('createEvent.readyToLaunch')}
                            </h3>
                            <p className="text-white/80 text-sm">
                                {t('createEvent.yourEventIsReadyForReview')}
                            </p>
                        </div>
                        
                        <CardContent className="p-6 space-y-5">
                            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex gap-3">
                                <Icon icon="lucide:info" className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-purple-800 mb-1">{t('createEvent.reviewProcess')}</p>
                                    <p className="text-xs text-purple-700">
                                        {t('createEvent.reviewProcessDescription')}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowCreateConfirm(false)}
                                    className="flex-1 h-12 rounded-xl font-semibold border-2 hover:bg-gray-50 flex items-center justify-center gap-2"
                                >
                                    <Icon icon="lucide:x" className="w-4 h-4" />
                                    {t('common.cancel')}
                                </Button>
                                <Button
                                    onClick={() => {
                                        if (pendingPayload) {
                                            submitEvent(pendingPayload.values, pendingPayload.resetForm);
                                        }
                                    }}
                                    className="flex-1 h-12 rounded-xl font-semibold bg-gradient-to-r from-[#a797cc] to-[#8ba179] text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                                >
                                    <Icon icon="lucide:send" className="w-4 h-4" />
                                    {t('createEvent.submitEvent')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Success Popup - Premium */}
            {showSuccessPopup && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-lg mx-4 bg-gradient-to-br from-emerald-50 via-white to-blue-50 shadow-2xl border-0 rounded-3xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <CardContent className="p-10 text-center relative">
                            {/* Confetti Effect */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <div className="absolute top-4 left-8 w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                <div className="absolute top-8 right-12 w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="absolute top-16 left-16 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                <div className="absolute top-6 right-20 w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }}></div>
                            </div>
                            
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-green-200 animate-pulse">
                                <Icon icon="lucide:party-popper" className="w-12 h-12 text-white" />
                            </div>
                            
                            <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-3">
                                Event Submitted!
                            </h3>
                            
                            <p className="text-gray-600 text-base mb-4">
                                Your event has been submitted for review.
                            </p>
                            
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                                <div className="flex items-center justify-center gap-2 text-blue-700">
                                    <Icon icon="lucide:mail" className="w-5 h-5" />
                                    <span className="font-medium">Check your email for confirmation</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                                <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
                                Redirecting you back...
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
}
