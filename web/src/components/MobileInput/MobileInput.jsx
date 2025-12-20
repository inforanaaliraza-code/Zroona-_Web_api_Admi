"use client";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./style.css";

function MobileInput(props) {
  return (
    <div className="relative">
      <PhoneInput
        country={"in"}
        countryCodeEditable={false}
        inputProps={{
          name: props.mobileNumber,
          className: `block w-full text-gray-900 outline-none ${props.i18n.language === 'ar' ? 'pl-0 pr-5' : 'pl-10 pr-10'} p-2 h-14 rounded-xl border bg-[#fdfdfd] border-[#f2dfba] placeholder:text-sm placeholder:text-gray-500 ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`,
          dir: props.i18n.language === 'ar' ? 'rtl' : 'ltr', // Dynamically adjust direction
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
        inputClass={props.inputClass} // Ensuring consistent styles
        specialLabel=""
        containerClass={`relative ${props.disabled ? 'cursor-not-allowed' : ''}`}
      />
    </div>
  );
}

export default MobileInput;
