import i18n from "../../lib/i18n";
import { BASE_API_URL, TOKEN_NAME } from "@/until";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

export const getCategoryEventList = createAsyncThunk(
  "CategoryEventList",
  async (obj) => {
    const cookie = new Cookies();
    const token = cookie.get(TOKEN_NAME);
    const language = i18n?.language || "en";

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      lang: language,
      Authorization: token // Add Authorization only if token exists
    };

    const response = await axios({
      method: "get",
      headers: headers,
      url: `${BASE_API_URL}organizer/event/category/list?page=${obj?.page}&limit=${obj?.limit}`,
    });

    return response.data.data;
  }
);

const CategoryEventList = createSlice({
  name: "CategoryEventList",
  initialState: {
    CategoryEventList: [],
    loadingCategory: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategoryEventList.pending, (state) => {
        state.loadingCategory = true;
      })
      .addCase(getCategoryEventList.fulfilled, (state, action) => {
        console.log('[REDUX] CategoryEventList fulfilled, payload:', action.payload);
        console.log('[REDUX] Is payload array?', Array.isArray(action.payload));
        state.CategoryEventList = action.payload || [];
        state.loadingCategory = false;
      })
      .addCase(getCategoryEventList.rejected, (state, action) => {
        console.error('[REDUX] CategoryEventList rejected, error:', action.error);
        state.loadingCategory = false;
      });
  },
});

export default CategoryEventList.reducer;
