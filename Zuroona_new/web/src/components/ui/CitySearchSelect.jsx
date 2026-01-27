"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { saudiCities } from "@/data/saudiCities";

const CitySearchSelect = ({ 
  value, 
  onChange, 
  onBlur, 
  error, 
  touched,
  placeholder = "Select city",
  className = "",
  label = "City",
  required = false,
  isRTL = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Filter cities based on search term
  const filteredCities = saudiCities.filter(city =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (city) => {
    onChange(city);
    setIsOpen(false);
    setSearchTerm("");
    if (onBlur) {
      onBlur();
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    setSearchTerm(value || "");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-[#333333] mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none z-10`}>
          <Icon
            icon="material-symbols:location-city"
            className="w-4 h-4 text-[#a797cc]"
          />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : (value || "")}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className={`w-full px-4 py-4 rounded-xl border bg-[#fdfdfd] transition-all duration-200
            ${touched && error ? "border-red-300" : "border-[#f2dfba]"}
            focus:outline-none text-[#333333] placeholder:text-[#666666] focus:border-[#a797cc]
            ${isRTL ? "pr-10 pl-4" : "pl-10 pr-10"}
            ${className}`}
        />
        
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center z-10`}
          >
            <Icon
              icon="material-symbols:close"
              className="w-4 h-4 text-gray-400 hover:text-gray-600"
            />
          </button>
        )}
        
        <div className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-10' : 'right-0 pr-3'} flex items-center pointer-events-none z-10`}>
          <Icon
            icon="material-symbols:keyboard-arrow-down"
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#f2dfba] rounded-xl shadow-lg max-h-60 overflow-auto">
          {filteredCities.length > 0 ? (
            <ul className="py-1">
              {filteredCities.map((city) => (
                <li
                  key={city}
                  onClick={() => handleSelect(city)}
                  className={`px-4 py-2 cursor-pointer hover:bg-[#a797cc] hover:text-white transition-colors
                    ${value === city ? 'bg-[#a797cc] text-white' : 'text-[#333333]'}
                  `}
                >
                  {city}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-2 text-gray-500 text-sm">
              No cities found
            </div>
          )}
        </div>
      )}

      {touched && error && (
        <p className="mt-1 text-xs font-semibold text-red-500">{error}</p>
      )}
    </div>
  );
};

export default CitySearchSelect;

