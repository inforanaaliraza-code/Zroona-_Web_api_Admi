import { BASE_API_URL, TOKEN_NAME } from "@/until";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

export const getPayment = createAsyncThunk("Payment", async (obj) => {
  const cookie = new Cookies();
  const token = cookie.get(TOKEN_NAME);

  const response = await axios({
    method: "get",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
    url: `${BASE_API_URL}organizer/paymentStatus`,
  });

  return response.data;
});

const Payment = createSlice({
  name: "Payment",
  initialState: {
    Payment: {},
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPayment.fulfilled, (state, action) => {
        state.Payment = action.payload;
        state.loading = false;
      })
      .addCase(getPayment.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default Payment.reducer;
