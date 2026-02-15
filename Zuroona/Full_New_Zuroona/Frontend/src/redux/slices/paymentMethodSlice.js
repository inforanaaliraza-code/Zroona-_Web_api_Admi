import { createSlice } from "@reduxjs/toolkit";

const paymentMethodSlice = createSlice({
  name: "paymentMethod",
  initialState: {
    selectedMethod: null, // 'card' | 'applepay' | null
    isProcessing: false,
    paymentError: null,
  },
  reducers: {
    setSelectedMethod: (state, action) => {
      state.selectedMethod = action.payload;
      state.paymentError = null;
    },
    setProcessing: (state, action) => {
      state.isProcessing = action.payload;
    },
    setPaymentError: (state, action) => {
      state.paymentError = action.payload;
    },
    resetPaymentState: (state) => {
      state.selectedMethod = null;
      state.isProcessing = false;
      state.paymentError = null;
    },
  },
});

export const { setSelectedMethod, setProcessing, setPaymentError, resetPaymentState } = paymentMethodSlice.actions;
export default paymentMethodSlice.reducer;
