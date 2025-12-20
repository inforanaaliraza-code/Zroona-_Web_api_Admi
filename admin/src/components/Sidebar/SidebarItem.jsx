import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const SidebarItem = ({ item, pageName, setPageName }) => {
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
    <li>
      <Link
        href={item.route}
        onClick={handleClick}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        className={`${
          isItemActive ? "bg-[#ffffff4d]" : ""
        } group relative flex items-center gap-2.5 rounded-lg py-2 px-2 font-medium text-white text-sm duration-300 ease-in-out ${
          !isMobile ? "hover:bg-[#ffffff4d]" : ""
        }`}
      >
        {/* Conditionally render the image based on active or hover state */}
        <Image
          src={item.icon}
          alt={item.label}
          width={18}
          height={19}
        />
        {item.label}
      </Link>
    </li>
  );
};

export default SidebarItem;
