"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

export default function Breadcrumbs({ items = [] }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <nav className="py-4 px-4 md:px-8 xl:px-28">
      <ol className={`flex flex-wrap items-center gap-2 text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <Icon 
                  icon={isRTL ? "lucide:chevron-left" : "lucide:chevron-right"} 
                  className={`mx-2 h-4 w-4 text-gray-400 ${isRTL ? "order-1" : ""}`} 
                />
              )}
              
              {isLast ? (
                <span className="font-medium text-gray-900">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-500 hover:text-gray-700 hover:underline"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
