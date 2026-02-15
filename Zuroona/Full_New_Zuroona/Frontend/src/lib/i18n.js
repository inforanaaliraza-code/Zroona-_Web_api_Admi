import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "@/i18n/locales/en/translation.json";
import arTranslation from "@/i18n/locales/ar/translation.json";

// CRITICAL: Always use "en" for SSR and initial client render to prevent hydration mismatch.
// Server and client MUST render identical HTML. RTLHandler syncs from localStorage after hydration.
const INITIAL_LNG = "en";

// Initialize i18n - NO detection, NO localStorage backend (causes hydration mismatch).
// Language is synced from localStorage in RTLHandler's useEffect after mount.
i18n.use(initReactI18next).init({
	resources: {
		en: { translation: enTranslation },
		ar: { translation: arTranslation },
	},
	lng: INITIAL_LNG,
	fallbackLng: "en",
	debug: false,
	interpolation: { escapeValue: false },
	react: { useSuspense: false },
	compatibilityJSON: "v3",
	returnEmptyString: false,
	returnNull: false,
	returnObjects: false,
});

// Ensure language is saved to localStorage whenever it changes
i18n.on('languageChanged', (lng) => {
	try {
		if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
			localStorage.setItem("i18nextLng", lng);
		}
	} catch (error) {
		console.warn("[i18n] Failed to save language change:", error);
	}
});

export default i18n;
