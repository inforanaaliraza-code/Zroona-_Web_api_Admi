"use client";

import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "./slices/language";

export const store = configureStore({
  reducer: {
    language: languageReducer,
  },
});

