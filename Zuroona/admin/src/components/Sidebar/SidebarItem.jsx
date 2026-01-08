"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { 
  Users, 
  UserCircle, 
  Calendar, 
  FileText, 
  Settings, 
  Shield, 
  Wallet, 
  ArrowDownCircle,
  Receipt
} from "lucide-react";

const SidebarItem = ({ item, pageName, setPageName, index = 0 }) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleClick = () => {
    const updatedPageName =
      pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
    setPageName(updatedPageName);
  };

  const pathname = usePathname();

  const isActive = (item) => {
    if (pathname.startsWith(item.route)) return true;

    if (item.children) {
      return item.children.some((child) => isActive(child));
    }

    return false;
  };

  const isItemActive = isActive(item);

  // Icon mapping for menu items
  const getIcon = () => {
    const iconProps = {
      className: `transition-all duration-300 ${
        isItemActive 
          ? "text-purple-600" 
          : "text-gray-500 group-hover:text-purple-500"
      }`,
      size: 20
    };

    const label = item.label?.toLowerCase() || "";
    
    if (label.includes("host") || label.includes("organizer")) {
      return <Users {...iconProps} />;
    } else if (label.includes("guest") || label.includes("user")) {
      return <UserCircle {...iconProps} />;
    } else if (label.includes("event")) {
      return <Calendar {...iconProps} />;
    } else if (label.includes("cms") || label.includes("content")) {
      return <FileText {...iconProps} />;
    } else if (label.includes("setting")) {
      return <Settings {...iconProps} />;
    } else if (label.includes("admin")) {
      return <Shield {...iconProps} />;
    } else if (label.includes("wallet") && !label.includes("withdrawal")) {
      return <Wallet {...iconProps} />;
    } else if (label.includes("withdrawal")) {
      return <ArrowDownCircle {...iconProps} />;
    } else if (label.includes("invoice")) {
      return <Receipt {...iconProps} />;
    }
    
    // Fallback: try to use image icon if available
    if (item.icon) {
      return (
        <Image
          src={item.icon}
          alt={item.label}
          width={20}
          height={20}
          className={`transition-all duration-300 ${
            isItemActive 
              ? "opacity-100 brightness-110" 
              : "opacity-70 group-hover:opacity-100"
          }`}
        />
      );
    }
    
    return null;
  };

  // Check if the screen width is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <li 
      className="animate-fade-in w-full list-none"
      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
    >
      <Link
        href={item.route}
        onClick={handleClick}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        className={`
          group relative flex items-center rounded-xl py-3 px-4 font-medium text-sm
          transition-all duration-300 ease-in-out w-full min-w-0 overflow-hidden
          ${isItemActive 
            ? "bg-gradient-to-r from-purple-100 via-purple-50 to-green-100 shadow-md shadow-purple-200/50 border-2 border-purple-400" 
            : "bg-white/70 hover:bg-purple-50/50 border-2 border-purple-100/50 hover:border-purple-300"
          }
          ${!isMobile ? "hover:shadow-md hover:shadow-purple-200/40 hover:scale-[1.02]" : ""}
          ${isItemActive ? "scale-[1.02]" : ""}
        `}
      >
        {/* Active indicator bar */}
        {isItemActive && (
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-green-500 via-purple-500 to-green-500 rounded-r-full shadow-md" />
        )}
        
        {/* Hover background effect with purple */}
        <div 
          className={`
            absolute inset-0 rounded-xl bg-gradient-to-r from-purple-50/0 via-purple-100/0 to-purple-50/0
            transition-all duration-500
            ${isHovered || isItemActive ? "from-purple-100/60 via-purple-50/40 to-purple-100/60" : ""}
          `}
        />
        
        {/* Icon */}
        <div className="relative z-10 mr-3 flex-shrink-0">
          {getIcon()}
        </div>
        
        {/* Label with proper text color */}
        <span className={`
          relative z-10 transition-all duration-300 flex-1 text-left leading-tight
          ${isItemActive 
            ? "font-semibold text-purple-700" 
            : "font-medium text-gray-700 group-hover:text-purple-600"
          }
        `}>
          {item.translationKey ? t(item.translationKey) : item.label}
        </span>
        
        {/* Active indicator dot */}
        {isItemActive && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-green-500 to-purple-500 shadow-sm" />
        )}
      </Link>
    </li>
  );
};

export default SidebarItem;
