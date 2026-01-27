import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslation from "@/i18n/locales/en/translation.json";
import arTranslation from "@/i18n/locales/ar/translation.json";

// Always initialize with English on server to prevent hydration mismatch
// Language will be updated on client-side after mount
const defaultLanguage = "en";

i18n
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
		lng: defaultLanguage, // Always start with English to prevent hydration mismatch
		fallbackLng: "en",
		debug: false,
		interpolation: {
			escapeValue: false,
		},
		react: {
			useSuspense: false, // Disable suspense to prevent hydration errors
		},
		// DO NOT use LanguageDetector on init - it causes hydration mismatch
		// Language will be set manually after mount
	});

// Update language on client-side AFTER React hydration is complete
// Use double requestAnimationFrame to ensure it happens after all hydration
if (typeof window !== "undefined") {
	// Wait for React to fully hydrate before changing language
	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			const storedLanguage = localStorage.getItem("i18nextLng");
			if (storedLanguage && (storedLanguage === "en" || storedLanguage === "ar")) {
				if (i18n.language !== storedLanguage) {
					i18n.changeLanguage(storedLanguage);
				}
			}
		});
	});
}

export default i18n;

