// Auto-select API base URL: prefer env, else check if on production domain, else dev localhost
const getApiBaseUrl = () => {
  // First priority: Environment variable
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Second priority: Check if running on production domain (client-side check)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'zuroona.sa' || hostname === 'www.zuroona.sa' || hostname.includes('zuroona.sa')) {
      return "https://api.zuroona.sa/api/";
    }
  }
  
  // Third priority: Server-side NODE_ENV check
  if (process.env.NODE_ENV === "production") {
    return "https://api.zuroona.sa/api/";
  }
  
  // Default: Development localhost
  return "http://localhost:3434/api/";
};

export const BASE_API_URL = getApiBaseUrl();
export const TOKEN_NAME = "Zuroona";

// Client should not embed secrets. Keep only non-sensitive storage config.
export const config = {
  bucketName: process.env.NEXT_PUBLIC_S3_BUCKET || "",
  region: process.env.NEXT_PUBLIC_S3_REGION || "",
  s3Url: process.env.NEXT_PUBLIC_S3_URL || "",
  dirName: process.env.NEXT_PUBLIC_S3_DIR || "Zuroona",
};
