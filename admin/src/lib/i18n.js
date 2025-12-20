import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslation from "@/i18n/locales/en/translation.json";
import arTranslation from "@/i18n/locales/ar/translation.json";

// Check if running in browser
const isBrowser = typeof window !== "undefined";

// Get language from localStorage or default to English (Admin default)
const getInitialLanguage = () => {
	if (isBrowser) {
		return localStorage.getItem("i18nextLng") || "en";
	}
	return "en";
};

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			en: {
				translation: enTranslation,
			},
			ar: {
				translation: arTranslation,
			},
		},
		lng: getInitialLanguage(), // Get language from localStorage or default to English
		fallbackLng: "en",
		debug: false,
		interpolation: {
			escapeValue: false,
		},
		react: {
			useSuspense: false, // Disable suspense to prevent hydration errors
		},
		detection: {
			order: ["localStorage", "navigator"],
			caches: ["localStorage"],
		},
	});

export default i18n;

