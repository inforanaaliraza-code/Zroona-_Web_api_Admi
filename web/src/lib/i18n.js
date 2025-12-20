import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "@/i18n/locales/en/translation.json";
import arTranslation from "@/i18n/locales/ar/translation.json";

// Check if running in browser
const isBrowser = typeof window !== "undefined";

// Get language from localStorage or default to Arabic
// This function is safe to call during SSR
const getInitialLanguage = () => {
	try {
		if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
			return localStorage.getItem("i18nextLng") || "ar";
		}
	} catch (error) {
		// If localStorage access fails, return default
		console.warn("[i18n] localStorage access failed, using default language:", error);
	}
	return "ar";
};

// Initialize i18n with safe language detection
i18n.use(initReactI18next).init({
	resources: {
		en: {
			translation: enTranslation,
		},
		ar: {
			translation: arTranslation,
		},
	},
	lng: getInitialLanguage(), // Get language from localStorage or default (safe for SSR)
	fallbackLng: "en",
	debug: false,
	interpolation: {
		escapeValue: false,
	},
	react: {
		useSuspense: false, // Disable suspense to prevent hydration errors
	},
	// Return empty string if translation key is missing (prevents showing keys)
	returnEmptyString: false,
	returnNull: false,
	// Return the key itself if translation is missing (we handle this with fallbacks)
	returnObjects: false,
});

export default i18n;
