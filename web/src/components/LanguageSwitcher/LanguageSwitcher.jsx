import { useState, useEffect } from 'react';
import i18n from '../../lib/i18n'; 
import { TOKEN_NAME } from '@/until';
import Cookies from 'js-cookie';
import { MdLanguage } from 'react-icons/md';
import { HiOutlineGlobeAlt } from 'react-icons/hi';
import { IoLanguageOutline } from 'react-icons/io5';

export default function LanguageSwitcher({ChangeLanguage }) {
    const [currentLang, setCurrentLang] = useState('ar'); // Default to match server
    const [isHovered, setIsHovered] = useState(false);
    const [mounted, setMounted] = useState(false);

    const toggleLanguage = () => {
        const newLang = currentLang === 'en' ? 'ar' : 'en';
        i18n.changeLanguage(newLang); 
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
        const token = Cookies.get(TOKEN_NAME);
        if (token) {
          ChangeLanguage(newLang);
        }
        setCurrentLang(newLang); 
    };

    useEffect(() => {
        // Set mounted to true and sync language from i18n
        setMounted(true);
        setCurrentLang(i18n.language || 'ar');
        
        const handleLanguageChange = (lang) => {
            document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
            setCurrentLang(lang);
        };

        i18n.on('languageChanged', handleLanguageChange);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, []);

    return (
        <div className="relative">
            <button
                className="group flex items-center gap-2 bg-white hover:bg-gray-50 px-4 py-2 rounded-xl transition-all duration-300 ease-in-out shadow-sm hover:shadow-md border border-[#8ba179]"
                onClick={toggleLanguage}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="relative w-6 h-6 flex items-center justify-center">
                    <IoLanguageOutline 
                        className={`absolute text-xl text-[#a797cc] transition-all duration-300 ${
                            isHovered ? 'opacity-0 rotate-180 scale-0' : 'opacity-100 rotate-0 scale-100'
                        }`}
                    />
                    <HiOutlineGlobeAlt 
                        className={`absolute text-xl text-[#a797cc] transition-all duration-300 ${
                            isHovered ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-0'
                        }`}
                    />
                </div>
                <span className="text-sm font-medium text-gray-800 group-hover:text-[#a797cc]">
                    {!mounted ? 'العربية' : (currentLang === 'en' ? 'العربية' : 'English')}
                </span>
                <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#a797cc] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full`} />
            </button>
        </div>
    );
}
