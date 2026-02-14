import { createSlice } from "@reduxjs/toolkit";

// IMPORTANT: Always use "en" for initial state to prevent hydration mismatch.
// Server has no localStorage; client would get different value. We sync from
// localStorage in ClientProviders after hydration.
const languageSlice = createSlice({
  name: "language",
  initialState: {
    currentLanguage: "en",
    isRTL: false,
  },
  reducers: {
    setLanguage: (state, action) => {
      const newLang = action.payload;
      if (newLang === "ar" || newLang === "en") {
        state.currentLanguage = newLang;
        state.isRTL = newLang === "ar";
        
        // Persist to localStorage
        if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
          try {
            localStorage.setItem("i18nextLng", newLang);
          } catch (error) {
            console.warn("[Language Redux] Failed to save to localStorage:", error);
          }
        }
      }
    },
    toggleLanguage: (state) => {
      const newLang = state.currentLanguage === "en" ? "ar" : "en";
      state.currentLanguage = newLang;
      state.isRTL = newLang === "ar";
      
      // Persist to localStorage
      if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
        try {
          localStorage.setItem("i18nextLng", newLang);
        } catch (error) {
          console.warn("[Language Redux] Failed to save to localStorage:", error);
        }
      }
    },
  },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;
export default languageSlice.reducer;

