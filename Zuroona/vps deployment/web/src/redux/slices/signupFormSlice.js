import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  formData: {
    profileImage: null,
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    country_code: '+966',
    gender: '',
    date_of_birth: '',
    nationality: '',
    city: '',
    bio: '',
    acceptTerms: false,
    acceptPrivacy: false,
  },
  errors: {},
  touched: {},
  isSubmitting: false,
  emailStatus: {
    isValid: false,
    exists: false,
    message: '',
    status: 'idle',
    isChecking: false,
  },
};

const signupFormSlice = createSlice({
  name: 'signupForm',
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
      // Clear error when user starts typing
      if (state.errors[field]) {
        delete state.errors[field];
      }
    },
    setFieldError: (state, action) => {
      const { field, error } = action.payload;
      state.errors[field] = error;
    },
    setFieldTouched: (state, action) => {
      const { field, touched } = action.payload;
      state.touched[field] = touched;
    },
    setEmailStatus: (state, action) => {
      state.emailStatus = { ...state.emailStatus, ...action.payload };
    },
    resetForm: (state) => {
      return initialState;
    },
    setSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
  },
});

export const {
  updateField,
  setFieldError,
  setFieldTouched,
  setEmailStatus,
  resetForm,
  setSubmitting,
} = signupFormSlice.actions;

export default signupFormSlice.reducer;
