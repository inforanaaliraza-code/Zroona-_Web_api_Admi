import { format, parseISO } from "date-fns";
import { enUS, ar } from "date-fns/locale";

/**
 * Format a date string to a localized format using Gregorian calendar
 * @param {string} dateString - ISO date string
 * @param {string} formatStr - date-fns format string
 * @param {string} locale - 'en' or 'ar'
 * @returns {string} Formatted date string
 */
export const formatDate = (
	dateString,
	formatStr = "MMMM d, yyyy",
	locale = "en"
) => {
	if (!dateString) return "";

	try {
		const date =
			typeof dateString === "string" ? parseISO(dateString) : dateString;
		return format(date, formatStr, {
			locale: locale === "ar" ? ar : enUS,
		});
	} catch (error) {
		console.error("Error formatting date:", error);
		return dateString;
	}
};

/**
 * Format a time string
 * @param {string} timeString - Time string in HH:MM format
 * @param {string} locale - 'en' or 'ar'
 * @returns {string} Formatted time string
 */
export const formatTime = (timeString, locale = "en") => {
	if (!timeString) return "";

	try {
		// Create a date object with the time
		const date = new Date(`2000-01-01T${timeString}`);

		return date.toLocaleTimeString(locale === "ar" ? "ar-SA" : "en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	} catch (error) {
		console.error("Error formatting time:", error);
		return timeString;
	}
};
