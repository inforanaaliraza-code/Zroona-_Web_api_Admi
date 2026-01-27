"use client"

import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneNumberInput = React.forwardRef(({ className, error, onChange, value, ...props }, ref) => {
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

  return (
    <div className="relative" dir={direction} ref={phoneInputRef}>
      <style jsx global>{`
        .react-tel-input .form-control {
          width: 100% !important;
          height: 56px !important;
          border-radius: 12px !important;
          background: #fdfdfd !important;
          border: 1px solid #f2dfba !important;
          text-align: ${isRTL ? 'right' : 'left'} !important;
          font-size: 14px !important;
          padding-left: ${isRTL ? '12px' : '100px'} !important;
          padding-right: ${isRTL ? '100px' : '12px'} !important;
          direction: ltr !important;
        }
        .react-tel-input .flag-dropdown {
          background: transparent !important;
          border: none !important;
          border-radius: ${isRTL ? '0 12px 12px 0' : '12px 0 0 12px'} !important;
          ${isRTL ? 'right: 0 !important; left: auto !important;' : 'left: 0 !important; right: auto !important;'}
        }
        .react-tel-input .selected-flag {
          background: transparent !important;
          border-radius: ${isRTL ? '0 12px 12px 0' : '12px 0 0 12px'} !important;
          width: 90px !important;
          padding: ${isRTL ? '0 12px 0 0' : '0 0 0 12px'} !important;
          display: flex !important;
          align-items: center !important;
          justify-content: ${isRTL ? 'flex-end' : 'flex-start'} !important;
          ${isRTL ? 'right: 0 !important; left: auto !important;' : 'left: 0 !important; right: auto !important;'}
          direction: ltr !important;
          ${isRTL ? 'flex-direction: row-reverse !important;' : 'flex-direction: row !important;'}
          gap: 14px !important;
        }
        .react-tel-input .selected-flag .flag {
          display: block !important;
          flex-shrink: 0 !important;
          ${isRTL ? 'margin-left: 0 !important; margin-right: 0 !important;' : 'margin-right: 0 !important; margin-left: 0 !important;'}
        }
        .react-tel-input .selected-flag .flag + span,
        .react-tel-input .selected-flag > span:not(.flag):not(.arrow) {
          direction: ltr !important;
          text-align: left !important;
          margin-left: 0 !important;
          padding-left: 0 !important;
          white-space: nowrap !important;
        }
        .react-tel-input .selected-flag:hover,
        .react-tel-input .selected-flag:focus {
          background: transparent !important;
        }
        .react-tel-input .country-list {
          margin: 10px 0 10px -1px !important;
          border-radius: 12px !important;
          border: 1px solid #f2dfba !important;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
        }
      `}</style>
      <PhoneInput
        country={'sa'}
        countryCodeEditable={false}
        onlyCountries={['sa']}
        enableSearch={true}
        disableDropdown={false}
        onChange={onChange}
        value={value}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

PhoneNumberInput.displayName = "PhoneNumberInput";

export { PhoneNumberInput };
