"use client";

import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "./slices/language";
import refundReducer from "./slices/refundSlice";

export const store = configureStore({
  reducer: {
    language: languageReducer,
    refund: refundReducer,
  },
});

