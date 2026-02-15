"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "@/redux/slices/language";
import { FaGlobe } from "react-icons/fa";

const LanguageSwitcher = () => {
	const { i18n, t } = useTranslation();
	const dispatch = useDispatch();
	const { currentLanguage, isRTL } = useSelector((state) => state.language);
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);

	const languages = [
		{ code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
		{ code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
	];

	const currentLang =
		languages.find((lang) => lang.code === currentLanguage) || languages[0];

	const changeLanguage = (langCode) => {
		// Dispatch Redux action to set language
		dispatch(setLanguage(langCode));
		
		// Update i18n
		i18n.changeLanguage(langCode);
		
		// Update document direction immediately
		if (typeof document !== "undefined" && document.documentElement) {
			document.documentElement.dir = langCode === "ar" ? "rtl" : "ltr";
			document.documentElement.lang = langCode;
			
			// Update body class
			if (document.body) {
				document.body.classList.remove("rtl", "ltr");
				document.body.classList.add(langCode === "ar" ? "rtl" : "ltr");
			}
		}
		
		setIsOpen(false);
		
		// NO PAGE RELOAD - Language switching is instant now!
	};

	// Sync i18n with Redux on mount and language changes
	useEffect(() => {
		if (i18n.language !== currentLanguage) {
			i18n.changeLanguage(currentLanguage);
		}
		
		// Update document direction based on Redux state
		if (typeof document !== "undefined" && document.documentElement) {
			document.documentElement.dir = isRTL ? "rtl" : "ltr";
			document.documentElement.lang = currentLanguage;
			
			if (document.body) {
				document.body.classList.remove("rtl", "ltr");
				document.body.classList.add(isRTL ? "rtl" : "ltr");
			}
		}
		
		// Listen for language changes from i18n and sync with Redux
		const handleLanguageChange = (lang) => {
			if (lang !== currentLanguage) {
				dispatch(setLanguage(lang));
			}
		};
		
		i18n.on("languageChanged", handleLanguageChange);
		
		return () => {
			i18n.off("languageChanged", handleLanguageChange);
		};
	}, [dispatch, currentLanguage, isRTL]);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:ring-offset-2 transition-colors"
				aria-label="Change language"
			>
				<FaGlobe className="w-4 h-4" />
				<span className="hidden sm:inline">{currentLang.flag}</span>
				<span className="hidden md:inline">{currentLang.nativeName}</span>
				<svg
					className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
					{languages.map((lang) => (
						<button
							key={lang.code}
							onClick={() => changeLanguage(lang.code)}
							className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${
								currentLanguage === lang.code
									? "bg-[#a797cc]/10 text-[#a797cc] font-medium"
									: "text-gray-700"
							}`}
						>
							<span className="text-xl">{lang.flag}</span>
							<div className="flex flex-col">
								<span>{lang.nativeName}</span>
								<span className="text-xs text-gray-500">{lang.name}</span>
							</div>
							{currentLanguage === lang.code && (
								<svg
									className="w-4 h-4 ml-auto text-[#a797cc]"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clipRule="evenodd"
									/>
								</svg>
							)}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default LanguageSwitcher;

