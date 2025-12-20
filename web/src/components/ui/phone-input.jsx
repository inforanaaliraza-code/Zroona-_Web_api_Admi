"use client"

import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneNumberInput = React.forwardRef(({ className, error, onChange, value, ...props }, ref) => {
  return (
    <div className="relative" dir="ltr">
      <style jsx global>{`
        .react-tel-input .form-control {
          width: 100% !important;
          height: 56px !important;
          border-radius: 12px !important;
          background: #fdfdfd !important;
          border: 1px solid #f2dfba !important;
          text-align: left !important;
          font-size: 14px !important;
          padding-left: 75px !important;
        }
        .react-tel-input .flag-dropdown {
          background: transparent !important;
          border: none !important;
          border-radius: 12px 0 0 12px !important;
        }
        .react-tel-input .selected-flag {
          background: transparent !important;
          border-radius: 12px 0 0 12px !important;
          width: 65px !important;
          padding: 0 0 0 12px !important;
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
        enableSearch
        disableSearchIcon
        searchPlaceholder="Search country..."
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
