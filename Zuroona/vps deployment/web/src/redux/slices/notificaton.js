import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

export const getNotificationData = createAsyncThunk(
  "notifications",
  async (obj) => {
    const cookie = new Cookies();
    const token = cookie.get("asus");
    let setup = await axios({
      method: "get",
      headers: {
        Accept: "/",
        "Content-Type": "application/json",
        authtoken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjVmOThlZWUzNjVkZGY2NmUyNGIyZTY4IiwiaWF0IjoxNzEyNjQ5NzgwfQ.biI_-bK7QFLYEYQc_PiWIPEnZyth-tDLlY_T8pNXFRI",
      },
      url: `${process.env.URL}user/notificationList?page=1&limit=6&is_read=0`,
    }).then((res) => res.data);
    return setup;
  }
);

const notification = createSlice({
  name: "notification",
  initialState: {
    notification: [],
    loading: false,
  },
  extraReducers: {
    [getNotificationData.pending]: (state, action) => {
      state.loading = true;
    },
    [getNotificationData.fulfilled]: (state, action) => {
      state.notification = action.payload;
      state.loading = false;
    },
    [getNotificationData.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export default notification.reducer;
