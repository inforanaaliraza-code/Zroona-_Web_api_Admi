"use client";

import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

/**
 * Unified NumberInput component with full RTL/LTR support
 * Supports proper direction handling for Arabic (RTL) and English (LTR)
 */
  const NumberInput = React.forwardRef(({ 
  className = '', 
  error, 
  onChange, 
  value, 
  formik,
  mobileNumberField = 'phone_number',
  countryCodeField = 'country_code',
  disabled = false,
  placeholder = "Mobile No.",
  country = 'sa',
  countryCodeEditable = false,
  onlyCountries = ['sa'],
  enableSearch = true,
  disableDropdown = false,
  ...props 
}, ref) => {
  const { i18n } = useTranslation();
  const phoneInputRef = useRef(null);
  const isRTL = i18n.language === 'ar';
  const direction = isRTL ? 'rtl' : 'ltr';

  // Prevent backspace from removing country code
  useEffect(() => {
    const input = phoneInputRef.current?.querySelector('.form-control');
    if (input) {
      const handleKeyDown = (e) => {
        const cursorPosition = input.selectionStart;
        const currentValue = input.value || '';
        // Detect current country code from input value
        let countryCode = '+966'; // default - only Saudi Arabia allowed
        if (currentValue.startsWith('+966')) {
          countryCode = '+966';
        }
        
        // If backspace is pressed and cursor is at or before country code
        if (e.key === 'Backspace' && cursorPosition <= countryCode.length) {
          e.preventDefault();
          // Set cursor position after country code
          setTimeout(() => {
            input.setSelectionRange(countryCode.length, countryCode.length);
          }, 0);
        }
        
        // If delete is pressed and selection includes country code
        if (e.key === 'Delete' && cursorPosition < countryCode.length) {
          e.preventDefault();
          setTimeout(() => {
            input.setSelectionRange(countryCode.length, countryCode.length);
          }, 0);
        }
      };

      input.addEventListener('keydown', handleKeyDown);
      return () => {
        input.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);

  // Only Saudi Arabia is allowed - no need for Pakistan enabling code

  // Remove dashes from phone input in real-time (but don't modify digits)
  useEffect(() => {
    const input = phoneInputRef.current?.querySelector('.form-control');
    if (input) {
      const handleInput = (e) => {
        // Remove dashes and spaces ONLY - don't add or remove digits
        const value = e.target.value;
        const cleanValue = value.replace(/[-\s]/g, '');
        if (value !== cleanValue) {
          const cursorPosition = e.target.selectionStart;
          e.target.value = cleanValue;
          // Adjust cursor position after removing dashes
          const newPosition = Math.max(0, cursorPosition - (value.length - cleanValue.length));
          e.target.setSelectionRange(newPosition, newPosition);
          
          // Trigger change event for react-phone-input-2
          const event = new Event('input', { bubbles: true });
          e.target.dispatchEvent(event);
        }
      };

      input.addEventListener('input', handleInput);
      return () => {
        input.removeEventListener('input', handleInput);
      };
    }
  }, []);

  // Handle value from formik or direct value prop
  const getValue = () => {
    let phoneValue;
    if (value !== undefined) {
      phoneValue = value;
    } else if (formik && formik.values) {
      const phone = formik.values[mobileNumberField] || '';
      const countryCodeValue = formik.values[countryCodeField] || '+966';
      if (phone) {
        phoneValue = `${countryCodeValue}${phone}`;
      } else {
        phoneValue = countryCodeValue;
      }
    } else {
      phoneValue = '+966';
    }
    
    // Remove any dashes from the value before returning
    return phoneValue ? phoneValue.replace(/[-\s]/g, '') : phoneValue;
  };

  // Handle onChange - support both formik and direct onChange
  const handleChange = (phone, countryData, e, formattedValue) => {
    if (onChange) {
      // Direct onChange prop usage
      onChange(phone, countryData, e, formattedValue);
    } else if (formik) {
      // Formik usage
      if (phone.length > 0 && countryData) {
        const raw = phone.slice(countryData?.dialCode?.length || 0);
        
        // Clean the phone number - remove dashes and spaces ONLY
        // DO NOT auto-add leading 0 - let user enter what they want
        let processedRaw = raw.replace(/[-\s]/g, '');
        
        // Set max length based on country
        // Saudi: 9 digits max
        const maxLength = 9;
        const rawLimited = processedRaw.slice(0, maxLength);
        
        console.log(`[NUMBER_INPUT] Phone formatting - raw: "${raw}", processed: "${processedRaw}", limited: "${rawLimited}", country: ${countryData?.dialCode}`);
        
        formik.setFieldValue(mobileNumberField, rawLimited);
        formik.setFieldValue(countryCodeField, `+${countryData.dialCode}`);
      } else {
        formik.setFieldValue(mobileNumberField, "");
        formik.setFieldValue(countryCodeField, "+966");
      }
    }
  };

  // Handle onBlur
  const handleBlur = (e) => {
    if (formik) {
      formik.handleBlur(e);
      const rawNumber = formik.values[mobileNumberField];
      if (!rawNumber || rawNumber.length < 1) {
        formik.setFieldTouched(mobileNumberField, true, true);
      }
    }
  };

  return (
    <div className={`relative w-full max-w-full ${className}`} dir={direction} ref={phoneInputRef}>
      <style jsx global>{`
        .number-input-wrapper .react-tel-input {
          width: 100% !important;
        }
        
        .number-input-wrapper .react-tel-input .form-control {
          width: 100% !important;
          height: 56px !important;
          border-radius: 12px !important;
          background: #fdfdfd !important;
          border: 1px solid #f2dfba !important;
          text-align: ${isRTL ? 'right' : 'left'} !important;
          direction: ltr !important; /* Phone numbers are always LTR */
          padding-left: ${isRTL ? '1px' : '39px'} !important;
          padding-right: ${isRTL ? '39px' : '1px'} !important;
          font-size: 14px !important;
          color: #333333 !important;
          transition: all 0.2s ease !important;
          letter-spacing: 0 !important;
          -webkit-appearance: none !important;
          -moz-appearance: textfield !important;
          text-transform: none !important;
        }
        
        .number-input-wrapper .react-tel-input .form-control:focus {
          border-color: #a797cc !important;
          outline: none !important;
          box-shadow: 0 0 0 3px rgba(167, 151, 204, 0.1) !important;
        }
        
        .number-input-wrapper .react-tel-input .form-control:disabled {
          background: #f5f5f5 !important;
          cursor: not-allowed !important;
          opacity: 0.6 !important;
        }
        
        .number-input-wrapper .react-tel-input .form-control::placeholder {
          color: #999999 !important;
          font-size: 14px !important;
        }
        
        .number-input-wrapper .react-tel-input .flag-dropdown {
          background: transparent !important;
          border: none !important;
          border-radius: ${isRTL ? '0 12px 12px 0' : '12px 0 0 12px'} !important;
          ${isRTL ? 'right: 0 !important; left: auto !important;' : 'left: 0 !important; right: auto !important;'}
        }
        
        .number-input-wrapper .react-tel-input .selected-flag {
          background: transparent !important;
          border-radius: ${isRTL ? '0 12px 12px 0' : '12px 0 0 12px'} !important;
          width: 37px !important;
          height: 56px !important;
          padding: ${isRTL ? '0 1px 0 0' : '0 0 0 1px'} !important;
          display: flex !important;
          align-items: center !important;
          justify-content: ${isRTL ? 'flex-end' : 'flex-start'} !important;
          ${isRTL ? 'right: 0 !important; left: auto !important;' : 'left: 0 !important; right: auto !important;'}
          direction: ltr !important; /* Country code display always LTR */
          ${isRTL ? 'flex-direction: row-reverse !important;' : 'flex-direction: row !important;'}
          gap: 2px !important;
        }
        
        .number-input-wrapper .react-tel-input .selected-flag:hover,
        .number-input-wrapper .react-tel-input .selected-flag:focus,
        .number-input-wrapper .react-tel-input .selected-flag:active {
          background: transparent !important;
        }
        
        .number-input-wrapper .react-tel-input .selected-flag .flag {
          display: block !important;
          flex-shrink: 0 !important;
          width: 10px !important;
          height: 7px !important;
          ${isRTL ? 'margin-left: 0 !important; margin-right: 0 !important;' : 'margin-right: 0 !important; margin-left: 0 !important;'}
        }
        
        .number-input-wrapper .react-tel-input .selected-flag .flag + span,
        .number-input-wrapper .react-tel-input .selected-flag > span:not(.flag):not(.arrow) {
          direction: ltr !important;
          text-align: left !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
          white-space: nowrap !important;
          font-size: 8px !important;
          color: #333333 !important;
          font-weight: 500 !important;
          letter-spacing: -0.3px !important;
        }
        
        .number-input-wrapper .react-tel-input .selected-flag .arrow {
          display: ${disableDropdown ? 'none' : 'block'} !important;
        }
        
        .number-input-wrapper .react-tel-input .country-list {
          margin: 5px 0 5px -1px !important;
          border-radius: 12px !important;
          border: 1px solid #f2dfba !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          max-height: 200px !important;
          z-index: 9999 !important;
          position: absolute !important;
          ${isRTL ? 'right: 0 !important; left: auto !important;' : 'left: 0 !important; right: auto !important;'}
        }
        
        /* Ensure dropdown appears above all elements including buttons */
        .number-input-wrapper {
          position: relative !important;
          z-index: 1 !important;
        }
        
        .number-input-wrapper .react-tel-input {
          position: relative !important;
          z-index: 1 !important;
        }
        
        /* When dropdown is open, ensure it's above everything */
        .number-input-wrapper .react-tel-input .flag-dropdown.open .country-list {
          z-index: 10000 !important;
          position: absolute !important;
        }
        
        .number-input-wrapper .react-tel-input .country-list .country {
          padding: 8px 12px !important;
        }
        
        .number-input-wrapper .react-tel-input .country-list .country.highlight {
          background: rgba(167, 151, 204, 0.1) !important;
        }
        
        /* Enable Pakistan - remove any disabled styles */
        .number-input-wrapper .react-tel-input .country-list .country[data-country-code="pk"] {
          cursor: pointer !important;
          pointer-events: auto !important;
          opacity: 1 !important;
        }
        
        .number-input-wrapper .react-tel-input .country-list .country[data-country-code="pk"]:hover {
          background: rgba(167, 151, 204, 0.1) !important;
        }
        
        /* Remove any disabled/blocked indicators for Pakistan - remove red circle/no-entry symbol */
        .number-input-wrapper .react-tel-input .country-list .country[data-country-code="pk"] .country-name::before,
        .number-input-wrapper .react-tel-input .country-list .country[data-country-code="pk"]::before,
        .number-input-wrapper .react-tel-input .country-list .country[data-country-code="pk"] .no-entry,
        .number-input-wrapper .react-tel-input .country-list .country[data-country-code="pk"] [class*="no-entry"],
        .number-input-wrapper .react-tel-input .country-list .country[data-country-code="pk"] [class*="blocked"],
        .number-input-wrapper .react-tel-input .country-list .country[data-country-code="pk"] [class*="disabled"],
        .number-input-wrapper .react-tel-input .country-list .country[data-country-code="pk"] svg,
        .number-input-wrapper .react-tel-input .country-list .country[data-country-code="pk"] .icon,
        .number-input-wrapper .react-tel-input .country-list .country[data-country-code="pk"] [role="img"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }
        
        /* Remove any pseudo-elements that might show blocked symbol */
        .number-input-wrapper .react-tel-input .country-list .country[data-country-code="pk"]::after {
          display: none !important;
          content: none !important;
        }
        
        /* Ensure all countries in onlyCountries list are enabled */
        .number-input-wrapper .react-tel-input .country-list .country {
          cursor: pointer !important;
          pointer-events: auto !important;
        }
        
        /* Hide disabled countries completely */
        .number-input-wrapper .react-tel-input .country-list .country.disabled,
        .number-input-wrapper .react-tel-input .country-list .country[aria-disabled="true"] {
          display: none !important;
        }
        
        /* Only Saudi Arabia is allowed */
        .number-input-wrapper .react-tel-input .country-list .country[data-country-code="sa"] {
          -webkit-user-select: auto !important;
          -moz-user-select: auto !important;
          -ms-user-select: auto !important;
          user-select: auto !important;
        }
        
        /* RTL-specific adjustments */
        .number-input-wrapper[dir="rtl"] .react-tel-input .form-control {
          text-align: right !important;
          padding-left: 1px !important;
          padding-right: 39px !important;
        }
        
        .number-input-wrapper[dir="rtl"] .react-tel-input .selected-flag {
          right: 0 !important;
          left: auto !important;
        }
        
        /* LTR-specific adjustments */
        .number-input-wrapper[dir="ltr"] .react-tel-input .form-control {
          text-align: left !important;
          padding-left: 39px !important;
          padding-right: 1px !important;
        }
        
        .number-input-wrapper[dir="ltr"] .react-tel-input .selected-flag {
          left: 0 !important;
          right: auto !important;
        }
      `}</style>
      
      <div className="number-input-wrapper w-full">
        <PhoneInput
          country={country}
          countryCodeEditable={countryCodeEditable}
          onlyCountries={onlyCountries}
          preferredCountries={['sa', 'pk']}
          enableSearch={enableSearch}
          disableDropdown={disableDropdown}
          autoFormat={false}
          onChange={handleChange}
          onBlur={handleBlur}
          value={getValue()}
          disabled={disabled}
          disableCountryGuess={true}
          excludeCountries={[]}
          preserveOrder={['sa']}
          inputProps={{
            name: mobileNumberField,
            placeholder: placeholder,
            dir: "ltr", // Phone numbers are always LTR
            style: { 
              textAlign: isRTL ? 'right' : 'left',
              direction: 'ltr' // Force LTR for phone numbers
            }
          }}
          containerStyle={{ width: "100%" }}
          dropdownStyle={{ display: disableDropdown ? 'none' : 'block' }}
          specialLabel=""
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500" dir={direction}>
          {error}
        </p>
      )}
      
      {formik && formik.touched[mobileNumberField] && formik.errors[mobileNumberField] && (
        <p className="mt-1 text-sm text-red-500" dir={direction}>
          {formik.errors[mobileNumberField]}
        </p>
      )}
    </div>
  );
});

NumberInput.displayName = "NumberInput";

export { NumberInput };

