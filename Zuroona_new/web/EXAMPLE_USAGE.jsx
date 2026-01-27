import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import CountryCitySelector from '@/components/common/CountryCitySelector';

/**
 * EXAMPLE: How to use CountryCitySelector in your signup form
 * 
 * This is a complete example showing integration with Formik validation
 */
const ExampleSignupForm = () => {
    const { t } = useTranslation();

    // ✅ STEP 1: Add validation schema
    const validationSchema = Yup.object({
        first_name: Yup.string().required(t("signup.firstNameRequired")),
        last_name: Yup.string().required(t("signup.lastNameRequired")),
        email: Yup.string().email().required(t("signup.emailRequired")),
        
        // Add country and city validation
        country_id: Yup.string().required(t("signup.countryRequired")),
        city_id: Yup.string().required(t("signup.cityRequired")),
    });

    // ✅ STEP 2: Add to initial values
    const formik = useFormik({
        initialValues: {
            first_name: '',
            last_name: '',
            email: '',
            country_id: '',  // Add this
            city_id: '',     // Add this
        },
        validationSchema,
        onSubmit: async (values) => {
            console.log('Form values:', values);
            // Your API call here with values.country_id and values.city_id
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            {/* Your existing fields */}
            <div className="mb-4">
                <input
                    type="text"
                    name="first_name"
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    placeholder={t("signup.tab2")}
                />
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    name="last_name"
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    placeholder={t("signup.tab3")}
                />
            </div>

            <div className="mb-4">
                <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    placeholder={t("signup.tab5")}
                />
            </div>

            {/* ✅ STEP 3: Add the CountryCity Selector */}
            <div className="mb-6">
                <CountryCitySelector
                    countryValue={formik.values.country_id}
                    cityValue={formik.values.city_id}
                    onCountryChange={(countryId) => formik.setFieldValue('country_id', countryId)}
                    onCityChange={(cityId) => formik.setFieldValue('city_id', cityId)}
                    errors={{
                        country: formik.errors.country_id,
                        city: formik.errors.city_id
                    }}
                    touched={{
                        country: formik.touched.country_id,
                        city: formik.touched.city_id
                    }}
                    disabled={formik.isSubmitting}
                />
            </div>

            {/* Submit button */}
            <button type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Loading...' : t("signup.tab17")}
            </button>
        </form>
    );
};

export default ExampleSignupForm;

