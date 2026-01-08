import { createSlice } from "@reduxjs/toolkit";

// Get initial language from localStorage or default to English
const getInitialLanguage = () => {
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    try {
      const stored = localStorage.getItem("i18nextLng");
      if (stored && (stored === "ar" || stored === "en")) {
        return stored;
      }
      // If invalid language, set default to English and save it
      localStorage.setItem("i18nextLng", "en");
      return "en";
    } catch (error) {
      console.warn("[Language Redux] localStorage access failed, using default:", error);
    }
  }
  return "en"; // Default to English
};

const languageSlice = createSlice({
  name: "language",
  initialState: {
    currentLanguage: getInitialLanguage(),
    isRTL: getInitialLanguage() === "ar",
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

