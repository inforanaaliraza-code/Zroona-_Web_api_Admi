import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "@/i18n/locales/en/translation.json";
import arTranslation from "@/i18n/locales/ar/translation.json";

// Custom localStorage backend for i18next persistence
const localStorageBackend = {
	type: 'localStorage',
	init: () => {},
	read: (language, namespace, callback) => {
		try {
			if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
				const stored = localStorage.getItem("i18nextLng");
				callback(null, stored || null);
			} else {
				callback(null, null);
			}
		} catch (error) {
			callback(error, null);
		}
	},
	create: () => {},
	write: (language, namespace, key, value) => {
		try {
			if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
				localStorage.setItem("i18nextLng", value);
			}
		} catch (error) {
			console.warn("[i18n] Failed to save language to localStorage:", error);
		}
	},
};

// Get language from localStorage or default to Arabic
// This function is safe to call during SSR
const getInitialLanguage = () => {
	try {
		if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
			const stored = localStorage.getItem("i18nextLng");
			if (stored && (stored === "ar" || stored === "en")) {
				return stored;
			}
			// If invalid language, set default and save it
			localStorage.setItem("i18nextLng", "ar");
			return "ar";
		}
	} catch (error) {
		// If localStorage access fails, return default
		console.warn("[i18n] localStorage access failed, using default language:", error);
	}
	return "ar";
};

// Initialize i18n with safe language detection and persistence
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
	fallbackLng: "ar", // Default to Arabic
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
	// Persistence configuration
	detection: {
		order: ['localStorage', 'navigator'],
		lookupLocalStorage: 'i18nextLng',
		caches: ['localStorage'],
		excludeCacheFor: ['cimode'],
	},
	// Save language to localStorage on change
	backend: localStorageBackend,
});

// Ensure language is saved to localStorage whenever it changes
i18n.on('languageChanged', (lng) => {
	try {
		if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
			localStorage.setItem("i18nextLng", lng);
			console.log(`[i18n] Language changed and saved to localStorage: ${lng}`);
		}
	} catch (error) {
		console.warn("[i18n] Failed to save language change:", error);
	}
});

export default i18n;
