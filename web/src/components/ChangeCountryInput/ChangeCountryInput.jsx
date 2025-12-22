"use client";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./style.css";

function ChangeCountryInput(props) {
  return (
    <div className="relative">
      <PhoneInput
        country={"sa"}
        countryCodeEditable={false}
        onlyCountries={['sa']}
        inputProps={{
          name: props.mobileNumber,
          placeholder: "Mobile No.",
          dir: "ltr",
          style: { textAlign: 'right' }
        }}
        disabled={props.disabled}
        enableSearch={false}
        disableDropdown={true}
        containerStyle={{ width: "100%" }}
        dropdownStyle={{ display: 'none' }}
        value={
          props.value
            ? props.value
            : props.formik.values[props.mobileNumber]
              ? props.formik.values[props.countryCode] + props.formik.values[props.mobileNumber]
              : props.formik.values[props.countryCode]
        }
        onChange={(phone, country, e, formattedValue) => {
          if (phone.length > 0) {
            const raw = phone.slice(country?.dialCode?.length);
            const rawLimited = raw.slice(0, 10);
            props.formik.setFieldValue(props.mobileNumber, rawLimited);
            props.formik.setFieldValue(props.countryCode, `+${country.dialCode}`);
          } else {
            props.formik.setFieldValue(props.mobileNumber, "");
            props.formik.setFieldValue(props.countryCode, "");
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

      {props.formik.touched[props.mobileNumber] && props.formik.errors[props.mobileNumber] && (
        <p className="text-xs text-[#7d6956] mt-2">
          {props.formik.errors[props.mobileNumber]}
        </p>
      )}
    </div>
  );
}

export default ChangeCountryInput;
