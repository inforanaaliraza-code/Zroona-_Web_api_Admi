"use client";

import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage, toggleLanguage } from '@/redux/slices/language';
import i18n from '../../lib/i18n'; 
import { TOKEN_NAME } from '@/until';
import Cookies from 'js-cookie';
import { MdLanguage } from 'react-icons/md';
import { HiOutlineGlobeAlt } from 'react-icons/hi';
import { IoLanguageOutline } from 'react-icons/io5';

export default function LanguageSwitcher({ChangeLanguage }) {
    const dispatch = useDispatch();
    const { currentLanguage, isRTL } = useSelector((state) => state.language);
    const [isHovered, setIsHovered] = useState(false);
    const [mounted, setMounted] = useState(false);
    const isChangingLanguage = useRef(false); // Prevent recursion

    const toggleLanguageHandler = () => {
        // Prevent multiple simultaneous language changes
        if (isChangingLanguage.current) {
            return;
        }
        
        isChangingLanguage.current = true;
        
        // Calculate new language BEFORE dispatching (to avoid timing issues)
        const newLang = currentLanguage === 'en' ? 'ar' : 'en';
        
        // Don't change if already the same
        if (i18n.language === newLang && currentLanguage === newLang) {
            isChangingLanguage.current = false;
            return;
        }
        
        // Update localStorage immediately for global persistence
        if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
            try {
                localStorage.setItem("i18nextLng", newLang);
            } catch (error) {
                console.warn("[LanguageSwitcher] Failed to save to localStorage:", error);
            }
        }
        
        // Dispatch Redux action to toggle language (updates global state)
        dispatch(toggleLanguage());
        dispatch(setLanguage(newLang));
        
        // Update document direction immediately (global update) - BEFORE i18n change
        if (typeof document !== "undefined" && document.documentElement) {
            document.documentElement.setAttribute("dir", newLang === 'ar' ? 'rtl' : 'ltr');
            document.documentElement.setAttribute("lang", newLang);
            
            // Update body class (global update)
            if (document.body) {
                document.body.classList.remove("rtl", "ltr");
                document.body.classList.add(newLang === 'ar' ? 'rtl' : 'ltr');
            }
        }
        
        // Change language in i18n (this will trigger languageChanged event globally)
        // Only if different to prevent recursion
        if (i18n.language !== newLang) {
            i18n.changeLanguage(newLang);
        }
        
        // Update backend if user is logged in (optional callback)
        const token = Cookies.get(TOKEN_NAME);
        if (token && ChangeLanguage) {
          ChangeLanguage(newLang);
        }
        
        // Reset flag after a short delay
        setTimeout(() => {
            isChangingLanguage.current = false;
        }, 100);
    };

    useEffect(() => {
        // Set mounted to true and sync language from Redux
        setMounted(true);
        
        // Sync i18n with Redux state on mount
        if (i18n.language !== currentLanguage) {
            i18n.changeLanguage(currentLanguage);
        }
        
        // Update document direction based on Redux state
        if (typeof document !== "undefined" && document.documentElement) {
            document.documentElement.setAttribute("dir", isRTL ? 'rtl' : 'ltr');
            document.documentElement.setAttribute("lang", currentLanguage);
            
            if (document.body) {
                document.body.classList.remove("rtl", "ltr");
                document.body.classList.add(isRTL ? 'rtl' : 'ltr');
            }
        }
        
        // Listen for language changes from i18n and sync with Redux
        // Add guard to prevent recursion
        const handleLanguageChange = (lang) => {
            // Only update if language actually changed and we're not already changing
            if (lang !== currentLanguage && !isChangingLanguage.current) {
                // Update Redux state
                dispatch(setLanguage(lang));
                
                // Update localStorage
                if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
                    try {
                        localStorage.setItem("i18nextLng", lang);
                    } catch (error) {
                        console.warn("[LanguageSwitcher] Failed to save to localStorage:", error);
                    }
                }
            }
            
            // Always update DOM (safe to do multiple times)
            if (typeof document !== "undefined" && document.documentElement) {
                document.documentElement.setAttribute("dir", lang === 'ar' ? 'rtl' : 'ltr');
                document.documentElement.setAttribute("lang", lang);
                
                if (document.body) {
                    document.body.classList.remove("rtl", "ltr");
                    document.body.classList.add(lang === 'ar' ? 'rtl' : 'ltr');
                }
            }
        };

        i18n.on('languageChanged', handleLanguageChange);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [dispatch, currentLanguage, isRTL]);

    return (
        <div className="relative">
            <button
                className="group flex items-center gap-2 bg-white/70 hover:bg-white/80 sm:bg-white/20 sm:hover:bg-white/30 px-4 py-2 rounded-xl transition-all duration-300 ease-in-out shadow-sm hover:shadow-md border border-white/50 sm:border-white/30 text-gray-900 sm:text-white"
                onClick={toggleLanguageHandler}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="relative w-6 h-6 flex items-center justify-center">
                    <IoLanguageOutline 
                        className={`absolute text-xl text-gray-900 sm:text-white transition-all duration-300 ${
                            isHovered ? 'opacity-0 rotate-180 scale-0' : 'opacity-100 rotate-0 scale-100'
                        }`}
                    />
                    <HiOutlineGlobeAlt 
                        className={`absolute text-xl text-gray-900 sm:text-white transition-all duration-300 ${
                            isHovered ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-0'
                        }`}
                    />
                </div>
                <span className="text-sm font-medium text-gray-900 sm:text-white group-hover:text-gray-800 sm:group-hover:text-white/90">
                    {!mounted ? 'English' : (currentLanguage === 'en' ? 'العربية' : 'English')}
                </span>
                <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full`} />
            </button>
        </div>
    );
}
