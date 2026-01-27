import { BASE_API_URL, TOKEN_NAME } from "@/until";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

export const getReviewList = createAsyncThunk("ReviewList", async (obj) => {
  const cookie = new Cookies();
  const token = cookie.get(TOKEN_NAME);

  const response = await axios({
    method: "get",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
    url: `${BASE_API_URL}organizer/event/review/list?page=${obj?.page}&limit=10`,
  });
  return response.data;
});

const ReviewsList = createSlice({
  name: "ReviewList",
  initialState: {
    ReviewsList: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReviewList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReviewList.fulfilled, (state, action) => {
        state.ReviewsList = action.payload;
        state.loading = false;
      })
      .addCase(getReviewList.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default ReviewsList.reducer;
