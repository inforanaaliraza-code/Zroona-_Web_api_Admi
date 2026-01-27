import { BASE_API_URL, TOKEN_NAME } from "@/until";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getUserNotificationCount = createAsyncThunk(
  "UserNotificationCount/getUserNotificationCount",
  async (token) => {
    const setup = await axios({
      method: "get",
      headers: {
        Accept: "/",
        "Content-Type": "application/json",
        Authorization: token,
      },
      url: `${BASE_API_URL}user/unreadNotificationCount`,
    }).then((res) => res.data.data);

    // Assuming setup contains the notification count directly; adjust if nested
    return setup;
  }
);

const UserNotificationCount = createSlice({
  name: "UserNotificationCount",
  initialState: {
    UserNotificationCount: 0, // Initialize as 0 if it's a count
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserNotificationCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserNotificationCount.fulfilled, (state, action) => {
        state.UserNotificationCount = action.payload; // Assuming payload is the count directly
        state.loading = false;
      })
      .addCase(getUserNotificationCount.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default UserNotificationCount.reducer;
