"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./style.css";

function ChangeCountryInput(props) {
  const { i18n } = useTranslation();
  const phoneInputRef = React.useRef(null);
  const isRTL = i18n.language === 'ar';
  const direction = isRTL ? 'rtl' : 'ltr';

  // Prevent backspace from removing country code
  React.useEffect(() => {
    const input = phoneInputRef.current?.querySelector('.form-control');
    if (input) {
      const handleKeyDown = (e) => {
        const inputValue = input.value;
        const cursorPosition = input.selectionStart;
        const countryCode = '+966';
        
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
      <style jsx>{`
        .phone-input-wrapper .react-tel-input .form-control {
          padding-left: ${isRTL ? '12px' : '100px'} !important;
          padding-right: ${isRTL ? '100px' : '12px'} !important;
          text-align: ${isRTL ? 'right' : 'left'} !important;
          direction: ltr !important;
        }
        .phone-input-wrapper .react-tel-input .flag-dropdown {
          ${isRTL ? 'right: 0 !important; left: auto !important;' : 'left: 0 !important; right: auto !important;'}
          border-radius: ${isRTL ? '0 12px 12px 0' : '12px 0 0 12px'} !important;
        }
        .phone-input-wrapper .react-tel-input .selected-flag {
          ${isRTL ? 'right: 0 !important; left: auto !important;' : 'left: 0 !important; right: auto !important;'}
          border-radius: ${isRTL ? '0 12px 12px 0' : '12px 0 0 12px'} !important;
          width: 90px !important;
          padding: ${isRTL ? '0 12px 0 0' : '0 0 0 12px'} !important;
          justify-content: ${isRTL ? 'flex-end' : 'flex-start'} !important;
          direction: ltr !important;
          ${isRTL ? 'flex-direction: row-reverse !important;' : 'flex-direction: row !important;'}
          gap: 14px !important;
        }
        .phone-input-wrapper .react-tel-input .selected-flag .flag {
          flex-shrink: 0 !important;
          ${isRTL ? 'margin-left: 0 !important; margin-right: 0 !important;' : 'margin-right: 0 !important; margin-left: 0 !important;'}
        }
        .phone-input-wrapper .react-tel-input .selected-flag .flag + span,
        .phone-input-wrapper .react-tel-input .selected-flag > span:not(.flag):not(.arrow) {
          direction: ltr !important;
          text-align: left !important;
          margin-left: 0 !important;
          padding-left: 0 !important;
          white-space: nowrap !important;
        }
      `}</style>
      <div className="phone-input-wrapper">
        <PhoneInput
          country={"sa"}
          countryCodeEditable={false}
          onlyCountries={['sa', 'pk']}
          autoFormat={false}
          inputProps={{
            name: props.mobileNumber,
            placeholder: "Mobile No.",
            dir: "ltr",
            style: { textAlign: isRTL ? 'right' : 'left' }
          }}
          disabled={props.disabled}
          enableSearch={true}
          disableDropdown={false}
          containerStyle={{ width: "100%" }}
          value={
            props.value
              ? props.value
              : props.formik.values[props.mobileNumber]
                ? props.formik.values[props.countryCode] + props.formik.values[props.mobileNumber]
                : props.formik.values[props.countryCode] || '+966'
          }
          onChange={(phone, country, e, formattedValue) => {
            if (phone.length > 0) {
              let raw = phone.slice(country?.dialCode?.length);
              
              // Remove any dashes, spaces, or special characters ONLY
              // DO NOT auto-add leading 0 - let user enter what they want
              raw = raw.replace(/[-\s()]/g, '');
              
              // Set max length based on country
              // Saudi: 9 digits max, Pakistan: 9 or 10 digits (user can choose)
              const maxLength = country?.dialCode === '966' ? 9 : 10;
              const rawLimited = raw.slice(0, maxLength);
              
              console.log(`[CHANGE_COUNTRY_INPUT] Phone formatting - phone: "${phone}", raw: "${raw}", limited: "${rawLimited}", country: ${country?.dialCode}`);
              
              props.formik.setFieldValue(props.mobileNumber, rawLimited);
              props.formik.setFieldValue(props.countryCode, `+${country.dialCode}`);
            } else {
              props.formik.setFieldValue(props.mobileNumber, "");
              props.formik.setFieldValue(props.countryCode, "+966");
            }
          }}
          onBlur={(e) => {
            props.formik.handleBlur(e);
            const rawNumber = props.formik.values[props.mobileNumber];
            if (!rawNumber || rawNumber.length < 1) {
              props.formik.setFieldTouched(props.mobileNumber, true, true);
            }
          }}
          specialLabel=""
        />
      </div>

      {props.formik.touched[props.mobileNumber] && props.formik.errors[props.mobileNumber] && (
        <p className="text-xs text-[#7d6956] mt-2">
          {props.formik.errors[props.mobileNumber]}
        </p>
      )}
    </div>
  );
}

export default ChangeCountryInput;
