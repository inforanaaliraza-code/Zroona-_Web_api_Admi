import i18n from "../../lib/i18n";
import { BASE_API_URL, TOKEN_NAME } from "@/until";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

export const getCategoryList = createAsyncThunk("CategoryList", async (obj) => {
  const cookie = new Cookies();
  const token = cookie.get(TOKEN_NAME);
  const language = i18n?.language || "en";

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    lang: language,
    Authorization: token
  };

  const response = await axios({
    method: "get",
    headers: headers,
    url: `${BASE_API_URL}organizer/category/list?page=${obj?.page}&limit=10`,
  });

  return response.data;
});

const CategoryList = createSlice({
  name: "CategoryList",
  initialState: {
    CategoryList: [],
    loadingCategory: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategoryList.pending, (state) => {
        state.loadingCategory = true;
      })
      .addCase(getCategoryList.fulfilled, (state, action) => {
        state.CategoryList = action.payload;
        state.loadingCategory = false;
      })
      .addCase(getCategoryList.rejected, (state) => {
        state.loadingCategory = false;
      });
  },
});

export default CategoryList.reducer;
