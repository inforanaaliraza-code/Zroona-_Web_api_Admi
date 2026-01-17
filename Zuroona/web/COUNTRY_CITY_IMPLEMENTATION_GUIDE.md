# Countries and Cities Implementation Guide

## Overview
This guide explains how to integrate the centralized countries and cities system into your signup forms (both guest and host/organizer).

## Backend Implementation

### 1. Database Models
- **Country Model** (`api/src/models/countryModel.js`): Stores country codes and translations (en/ar)
- **City Model** (`api/src/models/cityModel.js`): Stores cities with country references and translations

### 2. API Endpoints
All endpoints are accessible at `/api/location/`:

- `GET /api/location/countries` - Get all countries
  - Headers: `lang: en` or `lang: ar`
  - Response: Array of countries with `_id`, `code`, `name`

- `GET /api/location/cities/:countryId` - Get cities by country
  - Headers: `lang: en` or `lang: ar`
  - Response: Array of cities with `_id`, `name`, `country_id`

- `GET /api/location/cities` - Get all cities (optional)

### 3. Seeding Data
Run the seed script to populate countries and cities from CSV files:

```bash
cd api
npm install csv-parser
npm run seed:locations
```

**Note**: The CSV files are already copied to `api/data/` directory.

## Frontend Implementation

### 1. Service Layer
Use the location service (`web/src/services/locationService.js`) to fetch data:

```javascript
import { fetchCountries, fetchCitiesByCountry } from '@/services/locationService';

// Fetch countries
const countries = await fetchCountries('en'); // or 'ar'

// Fetch cities by country
const cities = await fetchCitiesByCountry(countryId, 'en');
```

### 2. CountryCity Selector Component
Use the pre-built component (`web/src/components/common/CountryCitySelector.jsx`):

```jsx
import CountryCitySelector from '@/components/common/CountryCitySelector';

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
    disabled={loading}
/>
```

### 3. Updating Signup Forms

#### For Guest Signup (`web/src/components/auth/GuestSignUpForm.jsx`)

**Step 1**: Add to imports
```javascript
import CountryCitySelector from '@/components/common/CountryCitySelector';
```

**Step 2**: Add to Yup validation schema
```javascript
const validationSchema = Yup.object({
    // ... existing fields
    country_id: Yup.string()
        .required(t("signup.countryRequired") || "Please select your country"),
    city_id: Yup.string()
        .required(t("signup.cityRequired") || "Please select your city"),
    // ... rest of fields
});
```

**Step 3**: Add to Formik initial values
```javascript
const formik = useFormik({
    initialValues: {
        // ... existing fields
        country_id: '',
        city_id: '',
        // ... rest of fields
    },
    // ...
});
```

**Step 4**: Add to the form (replace the nationality/address fields or add after them)
```jsx
{/* Country and City */}
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
    disabled={loading}
/>
```

**Step 5**: Include in registration payload
```javascript
const registrationPayload = {
    // ... existing fields
    country_id: formik.values.country_id,
    city_id: formik.values.city_id,
    // ... rest of fields
};
```

#### For Organizer/Host Signup (`web/src/components/OrganizerSignUp/PersonalInfoQuestionsForm.jsx`)

Follow the same 5 steps as above, but for the organizer signup form.

**Note**: If the organizer signup is multi-step, you may want to add country/city selection in the first step (BasicInfoForm) or the personal info step.

### 4. Update Backend Controllers

The user and organizer models have already been updated to include `country_id` and `city_id` fields:

```javascript
country_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'country',
    default: null
},
city_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'city',
    default: null
}
```

Make sure your registration endpoints accept and save these fields:

**User Registration** (`api/src/controllers/userController.js`):
```javascript
// In register or signup method
const newUser = await UserService.CreateService({
    // ... existing fields
    country_id: req.body.country_id || null,
    city_id: req.body.city_id || null,
    // ... rest of fields
});
```

**Organizer Registration** (`api/src/controllers/organizerController.js`):
```javascript
// In register or signup method
const newOrganizer = await OrganizerService.CreateService({
    // ... existing fields
    country_id: req.body.country_id || null,
    city_id: req.body.city_id || null,
    // ... rest of fields
});
```

## Translation Keys

Already added to both `en/translation.json` and `ar/translation.json`:

```json
{
  "signup": {
    "selectCountry": "Select Country",
    "selectCity": "Select City",
    "countryRequired": "Please select your country",
    "cityRequired": "Please select your city"
  }
}
```

## Testing

1. **Backend Testing**:
   ```bash
   # Seed the database
   npm run seed:locations
   
   # Test API endpoints
   GET http://localhost:3434/api/location/countries
   GET http://localhost:3434/api/location/cities/:countryId
   ```

2. **Frontend Testing**:
   - Open the signup form
   - Select a country - cities should load automatically
   - Change country - city should reset
   - Submit the form - `country_id` and `city_id` should be included in the payload

## Notes

- The countries and cities are loaded from the provided CSV files
- Translations are automatically handled based on the `lang` header
- The `CountryCitySelector` component handles loading states and RTL support
- City selection is disabled until a country is selected
- When a country changes, the city field is automatically reset

## Deployment Checklist

- [ ] Run `npm install csv-parser` in the API directory
- [ ] Copy CSV files to `api/data/` directory
- [ ] Run seed script: `npm run seed:locations`
- [ ] Verify API endpoints work
- [ ] Update frontend signup forms (guest and organizer)
- [ ] Test with both English and Arabic
- [ ] Test on real device/mobile

## Support

If you need any assistance implementing this in your specific forms, please let me know which form you'd like to update first, and I can make the specific changes for you.

