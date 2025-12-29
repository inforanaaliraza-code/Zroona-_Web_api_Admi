import { BASE_API_URL, TOKEN_NAME } from "@/until";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

export const getBookingList = createAsyncThunk("BookingList", async (obj) => {
  const cookie = new Cookies();
  const token = cookie.get(TOKEN_NAME);

  const response = await axios({
    method: "get",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
    url: `${BASE_API_URL}organizer/event/booking/list?page=${obj?.page}&limit=${obj?.limit}&book_status=${obj?.book_status}&booking_date=${obj?.event_date}`,
  });
  return response.data;
});

const BookingList = createSlice({
  name: "BookingList",
  initialState: {
    BookingList: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBookingList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBookingList.fulfilled, (state, action) => {
        state.BookingList = action.payload;
        state.loading = false;
      })
      .addCase(getBookingList.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default BookingList.reducer;
