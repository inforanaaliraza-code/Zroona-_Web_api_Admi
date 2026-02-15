
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const Breadcrumbs = ({ items }) => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [language, setLanguage] = useState('en');






  useEffect(() => {
    setIsMounted(true);
    setLanguage(i18n.language || 'en');
    
  }, [i18n.language]);

  const handleBackClick = () => {
    router.back(); // Navigates to the previous page
  };




  // Use default language during SSR to prevent hydration mismatch
  const isRTL = isMounted ? language === 'ar' : false;

  return (
    <nav className="bg-white py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className='flex items-center text-sm font-semibold'>
          {isRTL ? (
            <button
              onClick={handleBackClick}
              className="text-gray-600 hover:text-gray-800 ml-2 flex items-center"
            >
              <Image
                src="/assets/images/icons/arrow-left.png"
                height={14}
                width={14}
                alt=""
                className="transform rotate-180"
                unoptimized
              />
            </button>
          ) : (
            <button
              onClick={handleBackClick}
              className="text-gray-600 hover:text-gray-800 mr-2 flex items-center"
            >
              <Image
                src="/assets/images/icons/arrow-left.png"
                height={14}
                width={14}
                alt=""
                unoptimized
              />
            </button>
          )}
          {items.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <span className="mx-1 text-gray-400">/</span>}
              {index === items.length - 1 ? (
                <span className="text-[#a797cc] truncate max-w-[160px] sm:max-w-full">{item.label}</span>
              ) : (
                <Link href={item.href} className="text-gray-600 hover:text-gray-800 truncate max-w-[110px] sm:max-w-full">
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
