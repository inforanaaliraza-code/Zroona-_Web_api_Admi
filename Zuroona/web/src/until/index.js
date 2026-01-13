// Auto-select API base URL: prefer env, else dev localhost, else production URL
export const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3434/api/"
    : "https://api.zuroona.sa/api/");
export const TOKEN_NAME = "Zuroona";

// Client should not embed secrets. Keep only non-sensitive storage config.
export const config = {
  bucketName: process.env.NEXT_PUBLIC_S3_BUCKET || "",
  region: process.env.NEXT_PUBLIC_S3_REGION || "",
  s3Url: process.env.NEXT_PUBLIC_S3_URL || "",
  dirName: process.env.NEXT_PUBLIC_S3_DIR || "Zuroona",
};
