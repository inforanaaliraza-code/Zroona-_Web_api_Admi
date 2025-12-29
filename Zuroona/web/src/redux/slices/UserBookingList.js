import { BASE_API_URL, TOKEN_NAME } from "@/until";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

export const getUserBookingList = createAsyncThunk("UserBookingList", async (obj) => {
  const cookie = new Cookies();
  const token = cookie.get(TOKEN_NAME);

  const response = await axios({
    method: "get",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
    url: `${BASE_API_URL}user/event/booked/list?page=${obj?.page}&limit=${obj?.limit}&book_status=${obj?.book_status}&event_date=${obj?.event_date}`,
  });
  return response.data;
});

const UserBookingList = createSlice({
  name: "UserBookingList",
  initialState: {
    UserBookingList: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserBookingList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserBookingList.fulfilled, (state, action) => {
        state.UserBookingList = action.payload;
        state.loading = false;
      })
      .addCase(getUserBookingList.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default UserBookingList.reducer;
