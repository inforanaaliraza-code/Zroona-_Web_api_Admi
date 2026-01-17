"use client";

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { fetchCountries, fetchCitiesByCountry } from '@/services/locationService';

/**
 * CountryCity Selector Component
 * @param {Object} props
 * @param {string} props.countryValue - Selected country ID
 * @param {string} props.cityValue - Selected city ID
 * @param {Function} props.onCountryChange - Callback when country changes
 * @param {Function} props.onCityChange - Callback when city changes
 * @param {Object} props.errors - Error messages { country, city }
 * @param {Object} props.touched - Touched status { country, city }
 * @param {boolean} props.disabled - Disable both selects
 */
const CountryCitySelector = ({
    countryValue = '',
    cityValue = '',
    onCountryChange,
    onCityChange,
    errors = {},
    touched = {},
    disabled = false
}) => {
    const { t, i18n } = useTranslation();
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingCountries, setLoadingCountries] = useState(true);
    const [loadingCities, setLoadingCities] = useState(false);

    const isRTL = i18n.language === 'ar';

    // Fetch countries on mount and when language changes
    useEffect(() => {
        const loadCountries = async () => {
            setLoadingCountries(true);
            const data = await fetchCountries(i18n.language);
            setCountries(data);
            setLoadingCountries(false);
        };

        loadCountries();
    }, [i18n.language]);

    // Fetch cities when country changes
    useEffect(() => {
        const loadCities = async () => {
            if (countryValue) {
                setLoadingCities(true);
                const data = await fetchCitiesByCountry(countryValue, i18n.language);
                setCities(data);
                setLoadingCities(false);
            } else {
                setCities([]);
            }
        };

        loadCities();
    }, [countryValue, i18n.language]);

    const handleCountryChange = (e) => {
        const newCountryId = e.target.value;
        onCountryChange(newCountryId);
        // Reset city when country changes
        onCityChange('');
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Country Select */}
            <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                    {t('signup.selectCountry')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <span className={`absolute flex items-center ${isRTL ? "inset-y-0 right-0 pr-3" : "inset-y-0 left-0 pl-3"}`}>
                        <Icon icon="lucide:globe" className="w-5 h-5 text-[#a797cc]" />
                    </span>
                    <select
                        value={countryValue}
                        onChange={handleCountryChange}
                        disabled={disabled || loadingCountries}
                        className={`w-full ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"} py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a797cc] text-black ${disabled || loadingCountries ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <option value="">
                            {loadingCountries ? t('common.loading') || 'Loading...' : t('signup.selectCountry')}
                        </option>
                        {countries.map((country) => (
                            <option key={country._id} value={country._id}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>
                {touched.country && errors.country && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">
                        {errors.country}
                    </p>
                )}
            </div>

            {/* City Select */}
            <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                    {t('signup.selectCity')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <span className={`absolute flex items-center ${isRTL ? "inset-y-0 right-0 pr-3" : "inset-y-0 left-0 pl-3"}`}>
                        <Icon icon="lucide:map-pin" className="w-5 h-5 text-[#a797cc]" />
                    </span>
                    <select
                        value={cityValue}
                        onChange={(e) => onCityChange(e.target.value)}
                        disabled={disabled || !countryValue || loadingCities}
                        className={`w-full ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"} py-4 border bg-[#fdfdfd] border-[#f2dfba] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a797cc] text-black ${disabled || !countryValue || loadingCities ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <option value="">
                            {!countryValue 
                                ? t('signup.selectCountry')
                                : loadingCities 
                                ? t('common.loading') || 'Loading...'
                                : t('signup.selectCity')
                            }
                        </option>
                        {cities.map((city) => (
                            <option key={city._id} value={city._id}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                </div>
                {touched.city && errors.city && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">
                        {errors.city}
                    </p>
                )}
            </div>
        </div>
    );
};

export default CountryCitySelector;

