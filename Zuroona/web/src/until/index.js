// Auto-select API base URL: prefer env, else dev localhost, else production URL
export const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3434/api/"
    : "https://api.zuroona.sa/api/");
export const TOKEN_NAME = "Zuroona";

export const config = {
	bucketName: "appsinvo-staging-ys",
	region: "us-west-1",
	accessKeyId: "AKIAVMOPKAV4RPMGAK5M",
	secretAccessKey: "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",
	s3Url: "https://s3.us-west-1.amazonaws.com/appsinvo-staging-ys",
	dirName: "Zuroona",
};
