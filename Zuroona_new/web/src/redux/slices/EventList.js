import { BASE_API_URL, TOKEN_NAME } from "@/until";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

export const getEventList = createAsyncThunk("EventList", async (obj) => {
  const cookie = new Cookies();
  const token = cookie.get(TOKEN_NAME);

  const response = await axios({
    method: "get",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
    url: `${BASE_API_URL}organizer/event/list?page=${obj?.page}&limit=${obj?.limit}&event_type=${obj?.event_type}`,
  });

  return response.data;
});

const EventList = createSlice({
  name: "EventList",
  initialState: {
    EventList: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEventList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEventList.fulfilled, (state, action) => {
        state.EventList = action.payload;
        state.loading = false;
      })
      .addCase(getEventList.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default EventList.reducer;
