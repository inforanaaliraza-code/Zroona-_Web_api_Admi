"use client";

import { useState } from "react";
import Image from "next/image";

// Helper function to check if image URL is external
const isExternalImage = (url) => {
  if (!url) return false;
  return url.startsWith("http://") || url.startsWith("https://");
};

export default function EventPlaceholder({ src, alt, className = "", aspectRatio = "aspect-video" }) {
  const [imageError, setImageError] = useState(false);
  
  // If there's a valid image and no error, show the image
  if (src && !imageError) {
    return (
      <div className={`relative ${aspectRatio} overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={alt || "Event"}
          fill
          className="object-cover w-full h-full"
          unoptimized={isExternalImage(src)}
          onError={() => setImageError(true)}
        />
      </div>
    );
  }
  
  // Otherwise, show the default SVG placeholder
  return (
    <div className={`flex items-center justify-center bg-gray-100 ${aspectRatio} overflow-hidden ${className}`}>
      <svg
        width="60%"
        height="60%"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="24" height="24" rx="4" fill="#E2E8F0" />
        <path
          d="M7 10.5C7.82843 10.5 8.5 9.82843 8.5 9C8.5 8.17157 7.82843 7.5 7 7.5C6.17157 7.5 5.5 8.17157 5.5 9C5.5 9.82843 6.17157 10.5 7 10.5Z"
          fill="#94A3B8"
        />
        <path
          d="M5.5 18.5V17.5L8.5 14.5L10.5 16.5L14.5 12.5L18.5 16.5V18.5H5.5Z"
          fill="#94A3B8"
        />
        <path
          d="M18.5 5.5H5.5V13.5L9.5 9.5L13.5 13.5L15.5 11.5L18.5 14.5V5.5Z"
          fill="#CBD5E1"
        />
      </svg>
    </div>
  );
}
