import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

export const getAllOrders = createAsyncThunk("orders", async (obj) => {
  const cookie = new Cookies();
  const token = cookie.get("ascus");
  let setup = await axios({
    method: "get",
    headers: {
      Accept: "/",
      "Content-Type": "application/json",
      authtoken: token,
    },
    url: `${process.env.URL}user/booking?page=${obj?.page}&limit=12&mode_action_type=${obj?.type}`,
  }).then((res) => res.data);
  return setup;
});

const orders = createSlice({
  name: "orders",
  initialState: {
    allOrders: [],
    loading: false,
  },
  extraReducers: {
    [getAllOrders.pending]: (state, action) => {
      state.loading = true;
    },
    [getAllOrders.fulfilled]: (state, action) => {
      state.allOrders = action.payload;
      state.loading = false;
    },
    [getAllOrders.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export default orders.reducer;
