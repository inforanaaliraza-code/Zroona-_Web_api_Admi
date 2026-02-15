import { BASE_API_URL, TOKEN_NAME } from "@/until";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

export const getEventListDetail = createAsyncThunk(
  "EventListdetails",
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
      url: `${BASE_API_URL}organizer/event/detail?event_id=${id}`, // Use `id` directly here
    }).then((res) => res.data.data);
    return setup;
  }
);

const EventListdetails = createSlice({
  name: "EventListdetails",
  initialState: {
    EventListdetails: "",
    loadingDetail: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEventListDetail.pending, (state) => {
        state.loadingDetail = true;
      })
      .addCase(getEventListDetail.fulfilled, (state, action) => {
        state.EventListdetails = action.payload;
        state.loadingDetail = false;
      })
      .addCase(getEventListDetail.rejected, (state) => {
        state.loadingDetail = false;
      });
  },
});

export default EventListdetails.reducer;
