"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  loadCountryCityData,
  getCountriesWithTranslations,
  getCitiesForCountry,
  isDataLoaded,
} from "@/utils/countryCityData";
import { Icon } from "@iconify/react";
import Loader from "../Loader/Loader";

const CountryCitySelect = ({
  formik,
  countryFieldName = "country",
  cityFieldName = "city",
  showLabels = true,
  required = true,
  className = "",
}) => {
  const { t, i18n } = useTranslation();
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountryId, setSelectedCountryId] = useState(
    formik?.values?.[countryFieldName] || ""
  );

  const currentLocale = i18n.language || "en";

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (!isDataLoaded()) {
          await loadCountryCityData();
        }
        const countriesList = getCountriesWithTranslations(currentLocale);
        setCountries(countriesList);
        setLoading(false);
      } catch (error) {
        console.error("Error loading country/city data:", error);
        setLoading(false);
      }
    };

    loadData();
  }, [currentLocale]);

  // Update cities when country changes
  useEffect(() => {
    if (selectedCountryId) {
      const countryCities = getCitiesForCountry(selectedCountryId, currentLocale);
      setCities(countryCities);
    } else {
      setCities([]);
    }
  }, [selectedCountryId, currentLocale]);

  // Sync with formik values
  useEffect(() => {
    const countryValue = formik?.values?.[countryFieldName] || "";
    if (countryValue !== selectedCountryId) {
      setSelectedCountryId(countryValue);
    }
  }, [formik?.values?.[countryFieldName]]);

  const handleCountryChange = (e) => {
    const newCountryId = e.target.value;
    setSelectedCountryId(newCountryId);
    
    // Update formik
    if (formik) {
      formik.setFieldValue(countryFieldName, newCountryId);
      formik.setFieldValue(cityFieldName, ""); // Reset city when country changes
      formik.setFieldTouched(countryFieldName, true);
      formik.setFieldTouched(cityFieldName, false);
    }
  };

  const handleCityChange = (e) => {
    const newCityId = e.target.value;
    
    // Update formik
    if (formik) {
      formik.setFieldValue(cityFieldName, newCityId);
      formik.setFieldTouched(cityFieldName, true);
    }
  };

  const inputClasses = `w-full px-4 py-3 rounded-lg border bg-white/90 transition-all duration-200
    ${
      formik?.touched?.[countryFieldName] && formik?.errors?.[countryFieldName]
        ? "border-red-300"
        : "border-gray-200 hover:border-gray-300 focus:border-[#a797cc]"
    }
    focus:ring-2 focus:ring-orange-100 focus:outline-none text-gray-700`;

  const cityInputClasses = `w-full px-4 py-3 rounded-lg border bg-white/90 transition-all duration-200
    ${
      formik?.touched?.[cityFieldName] && formik?.errors?.[cityFieldName]
        ? "border-red-300"
        : "border-gray-200 hover:border-gray-300 focus:border-[#a797cc]"
    }
    focus:ring-2 focus:ring-orange-100 focus:outline-none text-gray-700`;

  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
  const iconContainerClasses =
    "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400";
  const errorClasses = "mt-1 text-sm text-red-500";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader />
        <span className="ml-2 text-gray-600">
          {t("common.loading") || "Loading..."}
        </span>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Country Select */}
      <div>
        {showLabels && (
          <label htmlFor={countryFieldName} className={labelClasses}>
            {t("signup.country") || "Country"}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <span className={iconContainerClasses}>
            <Icon
              icon="lucide:map-pin"
              className="w-4 h-4 text-[#a797cc]"
            />
          </span>
          <select
            id={countryFieldName}
            name={countryFieldName}
            value={selectedCountryId}
            onChange={handleCountryChange}
            className={`pl-10 ${inputClasses}`}
            required={required}
          >
            <option value="">
              {t("signup.selectCountry") || "Select Country"}
            </option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        {formik?.touched?.[countryFieldName] &&
          formik?.errors?.[countryFieldName] && (
            <p className={errorClasses}>
              {formik.errors[countryFieldName]}
            </p>
          )}
      </div>

      {/* City Select - Only show if country is selected */}
      {selectedCountryId && (
        <div>
          {showLabels && (
            <label htmlFor={cityFieldName} className={labelClasses}>
              {t("signup.city") || "City"}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          <div className="relative">
            <span className={iconContainerClasses}>
              <Icon
                icon="lucide:map-pin"
                className="w-4 h-4 text-[#a797cc]"
              />
            </span>
            <select
              id={cityFieldName}
              name={cityFieldName}
              value={formik?.values?.[cityFieldName] || ""}
              onChange={handleCityChange}
              className={`pl-10 ${cityInputClasses}`}
              required={required}
              disabled={!selectedCountryId || cities.length === 0}
            >
              <option value="">
                {cities.length === 0
                  ? t("signup.noCitiesAvailable") || "No cities available"
                  : t("signup.selectCity") || "Select City"}
              </option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          {formik?.touched?.[cityFieldName] &&
            formik?.errors?.[cityFieldName] && (
              <p className={errorClasses}>
                {formik.errors[cityFieldName]}
              </p>
            )}
        </div>
      )}
    </div>
  );
};

export default CountryCitySelect;
