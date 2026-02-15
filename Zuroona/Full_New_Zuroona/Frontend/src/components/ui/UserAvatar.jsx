"use client";

import { useState, useEffect } from "react";
import { BASE_API_URL } from "@/until";

// Helper function to get proper image URL - matches logic from edit profile page
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  let imageUrl = imagePath;
  
  // Handle different URL formats - same logic as edit profile page
  if (imageUrl.startsWith('http://localhost:3000') || imageUrl.startsWith('https://localhost:3000')) {
    // Replace port 3000 with correct API base URL
    const apiBase = BASE_API_URL.replace(/\/api\/?$/, "");
    imageUrl = imageUrl.replace('localhost:3000', apiBase.replace(/^https?:\/\//, '').split('/')[0]);
  } else if (imageUrl.startsWith('/uploads/')) {
    // Relative path - prepend correct base URL
    const apiBase = BASE_API_URL.replace('/api/', '');
    imageUrl = `${apiBase}${imageUrl}`;
  } else if (imageUrl.includes('/uploads/')) {
    // Contains uploads path but might have wrong port
    const apiBase = BASE_API_URL.replace('/api/', '');
    const uploadsIndex = imageUrl.indexOf('/uploads/');
    imageUrl = `${apiBase}${imageUrl.substring(uploadsIndex)}`;
  } else if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://') && !imageUrl.startsWith('data:') && !imageUrl.startsWith('blob:')) {
    // Path without protocol - construct full URL
    if (imageUrl.startsWith('uploads/')) {
      const apiBase = BASE_API_URL.replace('/api/', '');
      imageUrl = `${apiBase}/${imageUrl}`;
    } else {
      const apiBase = BASE_API_URL.replace('/api/', '');
      imageUrl = `${apiBase}/uploads/Zuroona/${imageUrl}`;
    }
  }
  
  return imageUrl;
};

export default function UserAvatar({ src, alt, size = 40, className = "" }) {
  const [imageError, setImageError] = useState(false);
  
  const imageUrl = getImageUrl(src);
  
  // Reset error state when src changes
  useEffect(() => {
    setImageError(false);
  }, [src]);
  
  // Debug logging
  useEffect(() => {
    console.log("[UserAvatar] Rendering with:", {
      src,
      imageUrl,
      imageError,
      alt
    });
  }, [src, imageUrl, imageError, alt]);
  
  // If there's a valid image and no error, show the image using regular img tag (like edit profile page)
  if (imageUrl && !imageError) {
    return (
      <div 
        className={`relative overflow-hidden rounded-full bg-gray-100 ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          key={`avatar-${src || 'default'}`}
          src={imageUrl}
          alt={alt || "User"}
          className="object-cover w-full h-full rounded-full"
          style={{ minHeight: '100%', minWidth: '100%' }}
          onError={(e) => {
            console.error("[UserAvatar] ❌ Failed to load image:", {
              src,
              imageUrl,
              attemptedUrl: e.target.src
            });
            // Fallback to default image
            if (!e.target.src.includes("user-dummy.png")) {
              e.target.onerror = null;
              e.target.src = "/assets/images/home/user-dummy.png";
            }
            setImageError(true);
          }}
          onLoad={() => {
            console.log("[UserAvatar] ✅ Image loaded successfully:", imageUrl);
            setImageError(false);
          }}
        />
      </div>
    );
  }
  
  // Otherwise, show the default SVG avatar
  return (
    <div 
      className={`flex items-center justify-center overflow-hidden rounded-full bg-gray-100 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.7}
        height={size * 0.7}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
          fill="#94A3B8"
        />
        <path
          d="M12.0002 14.5C6.99016 14.5 2.91016 17.86 2.91016 22C2.91016 22.28 3.13016 22.5 3.41016 22.5H20.5902C20.8702 22.5 21.0902 22.28 21.0902 22C21.0902 17.86 17.0102 14.5 12.0002 14.5Z"
          fill="#94A3B8"
        />
      </svg>
    </div>
  );
}
