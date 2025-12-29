import { BASE_API_URL, TOKEN_NAME } from "@/until";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

export const getBookingDetail = createAsyncThunk(
  "Bookingdetails",
  async ({ id }) => { // Destructure to directly use `id`
    const cookie = new Cookies();
    const token = cookie.get(TOKEN_NAME);
    console.log("Fetching event details for ID:", id);
    const setup = await axios({
      method: "get",
      headers: {
        Accept: "/",
        "Content-Type": "application/json",
        Authorization: token,
      },
      url: `${BASE_API_URL}organizer/event/booking/detail?book_id=${id}`, // Use `id` directly here
    }).then((res) => res.data.data);
    return setup;
  }
);

const Bookingdetails = createSlice({
  name: "Bookingdetails",
  initialState: {
    Bookingdetails: "",
    loadingDetail: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBookingDetail.pending, (state) => {
        state.loadingDetail = true;
      })
      .addCase(getBookingDetail.fulfilled, (state, action) => {
        state.Bookingdetails = action.payload;
        state.loadingDetail = false;
      })
      .addCase(getBookingDetail.rejected, (state) => {
        state.loadingDetail = false;
      });
  },
});

export default Bookingdetails.reducer;
