import { BASE_API_URL } from "@/until";

/**
 * Helper function to get proper image URL for events
 * Handles both absolute URLs and relative paths
 * @param {string} imagePath - Image path from database
 * @returns {string} - Full URL to the image
 */
export const getEventImageUrl = (imagePath) => {
  if (!imagePath) return "/assets/images/home/event1.png";
  
  // If already absolute URL (http/https), return as is
  if (imagePath.includes("http://") || imagePath.includes("https://")) {
    return imagePath;
  }
  
  // If relative path (starts with /uploads/), construct absolute URL
  if (imagePath.startsWith("/uploads/")) {
    const apiBase = BASE_API_URL.replace('/api/', '');
    return `${apiBase}${imagePath}`;
  }
  
  // If it's a relative path without /uploads/, try to construct URL
  if (imagePath.startsWith("/")) {
    const apiBase = BASE_API_URL.replace('/api/', '');
    return `${apiBase}${imagePath}`;
  }
  
  // Default fallback
  return "/assets/images/home/event1.png";
};

/**
 * Get all event images (up to 6) with proper URLs
 * @param {object} event - Event object
 * @returns {array} - Array of image URLs
 */
export const getEventImages = (event) => {
  const images = [];
  
  // Use event_images array if available (up to 6 images)
  if (event?.event_images && Array.isArray(event.event_images) && event.event_images.length > 0) {
    images.push(...event.event_images.slice(0, 6).map(img => getEventImageUrl(img)));
  } else if (event?.event_image) {
    // Fallback to single event_image
    images.push(getEventImageUrl(event.event_image));
  }
  
  // Ensure we have at least one image
  if (images.length === 0) {
    images.push("/assets/images/home/event1.png");
  }
  
  return images;
};

/**
 * Get the primary event image URL
 * @param {object} event - Event object
 * @returns {string} - Primary image URL
 */
export const getPrimaryEventImage = (event) => {
  if (event?.event_images && Array.isArray(event.event_images) && event.event_images.length > 0) {
    return getEventImageUrl(event.event_images[0]);
  }
  if (event?.event_image) {
    return getEventImageUrl(event.event_image);
  }
  return "/assets/images/home/event1.png";
};

