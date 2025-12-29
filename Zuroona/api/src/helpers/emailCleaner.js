/**
 * Email cleaning utility
 * Removes invisible/zero-width characters and normalizes email format
 * @param {string} email - Raw email string
 * @returns {string} - Cleaned email (lowercase, trimmed, no invisible chars)
 */
const cleanEmail = (email) => {
	if (!email || typeof email !== 'string') {
		return email;
	}
	
	// Remove zero-width and invisible characters:
	// \u200B - Zero Width Space
	// \u200C - Zero Width Non-Joiner
	// \u200D - Zero Width Joiner
	// \uFEFF - Zero Width No-Break Space (BOM)
	// \u00A0 - Non-Breaking Space
	// \u200E - Left-To-Right Mark
	// \u200F - Right-To-Left Mark
	return email
		.replace(/[\u200B-\u200D\uFEFF\u00A0\u200E\u200F]/g, '')
		.trim()
		.toLowerCase();
};

module.exports = { cleanEmail };

