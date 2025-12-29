import { BASE_API_URL, TOKEN_NAME } from "@/until";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

export const getEarning = createAsyncThunk("Earning", async (obj) => {
  const cookie = new Cookies();
  const token = cookie.get(TOKEN_NAME);

  const response = await axios({
    method: "get",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
    url: `${BASE_API_URL}organizer/earning?page=${obj?.page}&limit=10&filter=${obj?.filter}`,
  });

  return response.data.data;
});

const Earning = createSlice({
  name: "Earning",
  initialState: {
    Earning: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEarning.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEarning.fulfilled, (state, action) => {
        state.Earning = action.payload;
        state.loading = false;
      })
      .addCase(getEarning.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default Earning.reducer;
