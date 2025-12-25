import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslation from "@/i18n/locales/en/translation.json";
import arTranslation from "@/i18n/locales/ar/translation.json";

// Always initialize with English on server to prevent hydration mismatch
// Language will be updated on client-side after mount
const defaultLanguage = "en";

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
		lng: defaultLanguage, // Always start with English to prevent hydration mismatch
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
			// Don't detect on init to prevent hydration mismatch
			lookupLocalStorage: "i18nextLng",
			checkWhitelist: true,
		},
	});

// Update language on client-side after initialization
if (typeof window !== "undefined") {
	const storedLanguage = localStorage.getItem("i18nextLng");
	if (storedLanguage && (storedLanguage === "en" || storedLanguage === "ar")) {
		// Change language after a short delay to ensure it happens after hydration
		setTimeout(() => {
			i18n.changeLanguage(storedLanguage);
		}, 0);
	}
}

export default i18n;

