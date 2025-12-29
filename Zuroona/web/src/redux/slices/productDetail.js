import { TOKEN_NAME } from "@/until";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

export const getProductDetail = createAsyncThunk( "productdetails", async (obj) => {
    const cookie = new Cookies();
    const token = cookie.get(TOKEN_NAME);
    
    let setup = await axios({
      method: "get",
      headers: {
        Accept: "/",
        "Content-Type": "application/json",
        authtoken: token,
      },
      url: `${process.env.URL}user/product?product_id=${obj?.id}`,
    }).then((res) => res.data.data);
    return setup;
  }
);

const productdetails = createSlice({
  name: "productdetails",
  initialState: {
    productdetails: "",
    loadingDetails: false,
  },
  extraReducers: {
    [getProductDetail.pending]: (state, action) => {
      state.loadingDetails = true;
    },
    [getProductDetail.fulfilled]: (state, action) => {
      state.productdetails = action.payload;
      state.loadingDetails = false;
    },
    [getProductDetail.rejected]: (state, action) => {
      state.loadingDetails = false;
    },
  },
});

export default productdetails.reducer;
