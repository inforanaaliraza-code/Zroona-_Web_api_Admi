import { BASE_API_URL, TOKEN_NAME } from "@/until";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

export const getWithdrawalList = createAsyncThunk("WithdrawalList", async (obj) => {
  const cookie = new Cookies();
  const token = cookie.get(TOKEN_NAME);

  const response = await axios({
    method: "get",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
    url: `${BASE_API_URL}organizer/withdrawalList?page=${obj?.page}&limit=${obj?.limit}`,
  });

  return response.data.data;
});

const WithdrawalList = createSlice({
  name: "WithdrawalList",
  initialState: {
    WithdrawalList: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWithdrawalList.pending, (state) => {
        state.loadingWithdrawal = true;
      })
      .addCase(getWithdrawalList.fulfilled, (state, action) => {
        state.WithdrawalList = action.payload;
        state.loadingWithdrawal = false;
      })
      .addCase(getWithdrawalList.rejected, (state) => {
        state.loadingWithdrawal = false;
      });
  },
});

export default WithdrawalList.reducer;
