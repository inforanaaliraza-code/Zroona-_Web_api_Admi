import { BASE_API_URL, TOKEN_NAME } from "@/until";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

export const getUserEventList = createAsyncThunk(
  "UserEventList",
  async (obj) => {
    const cookie = new Cookies();
    const token = cookie.get(TOKEN_NAME);

    const response = await axios({
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
      },
      url: `${BASE_API_URL}user/event/list?page=${obj?.page}&limit=${obj?.limit}&event_type=${obj?.event_type}&event_date=${obj?.event_date}&event_category=${obj?.event_category}`,
    });

    return response.data;
  }
);

const UserEventList = createSlice({
  name: "UserEventList",
  initialState: {
    UserEventList: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserEventList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserEventList.fulfilled, (state, action) => {
        state.UserEventList = action.payload;
        state.loading = false;
      })
      .addCase(getUserEventList.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default UserEventList.reducer;
