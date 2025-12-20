import { BASE_API_URL, TOKEN_NAME } from "@/until";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

export const getUserNotificationList = createAsyncThunk(
  "UserNotification",
  async (obj) => {
    const cookie = new Cookies();
    const token = cookie.get(TOKEN_NAME);

    const setup = await axios({
      method: "get",
      headers: {
        Accept: "/",
        "Content-Type": "application/json",
        Authorization: token,
      },
      url: `${BASE_API_URL}user/notification/list?page=1&limit=${obj.limit}`,
    }).then((res) => res.data);
    
    return setup;
  }
);

const UserNotification = createSlice({
  name: "UserNotification",
  initialState: {
    UserNotification: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserNotificationList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserNotificationList.fulfilled, (state, action) => {
        state.UserNotification = action.payload;
        state.loading = false;
      })
      .addCase(getUserNotificationList.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default UserNotification.reducer;
