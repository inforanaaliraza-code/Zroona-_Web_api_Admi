"use client";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./style.css";

function MobileInput(props) {
  const isRTL = props.i18n?.language === 'ar';
  const direction = isRTL ? 'rtl' : 'ltr';

  return (
    <div className="relative" dir={direction}>
      <style jsx>{`
        .mobile-input-wrapper .react-tel-input .form-control {
          padding-left: ${isRTL ? '12px' : '75px'} !important;
          padding-right: ${isRTL ? '75px' : '12px'} !important;
          text-align: ${isRTL ? 'right' : 'left'} !important;
          direction: ltr !important;
        }
        .mobile-input-wrapper .react-tel-input .flag-dropdown {
          ${isRTL ? 'right: 0 !important; left: auto !important;' : 'left: 0 !important; right: auto !important;'}
          border-radius: ${isRTL ? '0 12px 12px 0' : '12px 0 0 12px'} !important;
        }
        .mobile-input-wrapper .react-tel-input .selected-flag {
          ${isRTL ? 'right: 0 !important; left: auto !important;' : 'left: 0 !important; right: auto !important;'}
          border-radius: ${isRTL ? '0 12px 12px 0' : '12px 0 0 12px'} !important;
          padding: ${isRTL ? '0 12px 0 0' : '0 0 0 12px'} !important;
          justify-content: ${isRTL ? 'flex-end' : 'flex-start'} !important;
          direction: ltr !important;
          ${isRTL ? 'flex-direction: row-reverse !important;' : 'flex-direction: row !important;'}
        }
        .mobile-input-wrapper .react-tel-input .selected-flag .flag {
          ${isRTL ? 'margin-left: 6px !important; margin-right: 0 !important;' : 'margin-right: 6px !important; margin-left: 0 !important;'}
        }
        .mobile-input-wrapper .react-tel-input .selected-flag .flag + span,
        .mobile-input-wrapper .react-tel-input .selected-flag > span:not(.flag):not(.arrow) {
          direction: ltr !important;
          text-align: left !important;
        }
      `}</style>
      <div className="mobile-input-wrapper">
        <PhoneInput
          country={"in"}
          countryCodeEditable={false}
          inputProps={{
            name: props.mobileNumber,
            className: `block w-full text-gray-900 outline-none p-2 h-14 rounded-xl border bg-[#fdfdfd] border-[#f2dfba] placeholder:text-sm placeholder:text-gray-500 ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`,
            dir: "ltr",
            style: { textAlign: isRTL ? 'right' : 'left' }
          }}
          disabled={props.disabled}
          enableSearch
          value={
            props.value
              ? props.value
              : props.formik.values.mobileNumber
                ? props.formik.values.countryCode + props.formik.values.mobileNumber
                : props.formik.values.countryCode
          }
          onChange={(phone, country, e, formattedValue) => {
            if (phone.length > 0) {
              const raw = phone.slice(country?.dialCode?.length);
              props.formik.setFieldValue(props.mobileNumber, raw);
              props.formik.setFieldValue(
                props.countryCode,
                formattedValue?.split(" ")[0]
              );
            } else {
              props.formik.setFieldValue(props.mobileNumber, "");
              props.formik.setFieldValue(props.countryCode, "");
            }
          }}
          onBlur={props.formik.handleBlur}
          placeholder="Mobile No."
          inputClass={props.inputClass}
          specialLabel=""
          containerClass={`relative ${props.disabled ? 'cursor-not-allowed' : ''}`}
        />
      </div>
    </div>
  );
}

export default MobileInput;
