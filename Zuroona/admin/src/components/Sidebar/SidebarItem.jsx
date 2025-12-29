import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const SidebarItem = ({ item, pageName, setPageName, index = 0 }) => {
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
          group relative flex items-center gap-3 rounded-xl py-2.5 px-3 font-medium text-white text-sm
          transition-all duration-300 ease-in-out w-full min-w-0
          ${isItemActive 
            ? "bg-white/30 shadow-lg shadow-white/20 backdrop-blur-sm" 
            : "bg-white/0 hover:bg-white/20"
          }
          ${!isMobile ? "hover:shadow-lg hover:shadow-white/20 hover:backdrop-blur-sm hover:scale-[1.01]" : ""}
          ${isItemActive ? "scale-[1.01]" : ""}
        `}
      >
        {/* Active indicator bar */}
        {isItemActive && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-green to-brand-gray-green-2 rounded-r-full animate-scale-in" />
        )}
        
        {/* Hover glow effect */}
        <div 
          className={`
            absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/10 to-white/0
            opacity-0 transition-opacity duration-300
            ${isHovered || isItemActive ? "opacity-100" : ""}
          `}
        />
        
        {/* Icon with animation */}
        <div className={`
          relative z-10 transition-all duration-300 flex-shrink-0
          ${isItemActive ? "scale-105" : "group-hover:scale-105"}
          ${isHovered || isItemActive ? "brightness-110" : ""}
        `}>
          <Image
            src={item.icon}
            alt={item.label}
            width={20}
            height={20}
            className="transition-transform duration-300"
          />
        </div>
        
        {/* Label with smooth transition */}
        <span className={`
          relative z-10 transition-all duration-300 flex-1 text-left leading-tight
          ${isItemActive ? "font-semibold" : "font-medium"}
        `}>
          {item.label}
        </span>
        
        {/* Shimmer effect on hover */}
        {isHovered && (
          <div className="absolute inset-0 rounded-xl shimmer opacity-30" />
        )}
      </Link>
    </li>
  );
};

export default SidebarItem;
