import i18n from "../../lib/i18n";
import { BASE_API_URL, TOKEN_NAME } from "@/until";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

export const getCategoryEventList = createAsyncThunk(
  "CategoryEventList",
  async (obj, { rejectWithValue }) => {
    try {
      const cookie = new Cookies();
      const token = cookie.get(TOKEN_NAME);
      const language = i18n?.language || "en";

      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        lang: language,
        Authorization: token // Add Authorization only if token exists
      };

      console.log('[REDUX] Fetching categories from:', `${BASE_API_URL}organizer/event/category/list?page=${obj?.page}&limit=${obj?.limit}`);
      
      const response = await axios({
        method: "get",
        headers: headers,
        url: `${BASE_API_URL}organizer/event/category/list?page=${obj?.page}&limit=${obj?.limit}`,
      });

      console.log('[REDUX] Category API response:', response.data);
      
      // Check if response is successful
      if (response.data && response.data.status === 1) {
        const categories = response.data.data || [];
        console.log('[REDUX] Categories received:', categories.length);
        return categories;
      } else {
        console.error('[REDUX] API returned error status:', response.data);
        return rejectWithValue(response.data?.message || 'Failed to fetch categories');
      }
    } catch (error) {
      console.error('[REDUX] Category fetch error:', error);
      console.error('[REDUX] Error details:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch categories');
    }
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
        console.log('[REDUX] CategoryEventList loading started');
      })
      .addCase(getCategoryEventList.fulfilled, (state, action) => {
        console.log('[REDUX] CategoryEventList fulfilled, payload:', action.payload);
        console.log('[REDUX] Is payload array?', Array.isArray(action.payload));
        console.log('[REDUX] Payload length:', action.payload?.length || 0);
        state.CategoryEventList = Array.isArray(action.payload) ? action.payload : [];
        state.loadingCategory = false;
        console.log('[REDUX] State updated. CategoryEventList length:', state.CategoryEventList.length);
      })
      .addCase(getCategoryEventList.rejected, (state, action) => {
        console.error('[REDUX] CategoryEventList rejected, error:', action.error);
        console.error('[REDUX] Rejected payload:', action.payload);
        state.CategoryEventList = []; // Reset to empty array on error
        state.loadingCategory = false;
      });
  },
});

export default CategoryEventList.reducer;
