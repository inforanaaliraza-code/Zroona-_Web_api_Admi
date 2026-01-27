const EmailVerificationToken = require("../models/emailVerificationToken Model");

const EmailVerificationService = {
    /**
     * Create a new email verification token
     * @param {Object} data - Token data
     * @returns {Promise<Object>} - Created token
     */
    CreateToken: async (data) => {
        try {
            const token = new EmailVerificationToken(data);
            return await token.save();
        } catch (error) {
            console.error("Error creating email verification token:", error);
            throw error;
        }
    },

    /**
     * Find one token by criteria
     * @param {Object} criteria - Search criteria
     * @returns {Promise<Object|null>} - Found token or null
     */
    FindOne: async (criteria) => {
        try {
            return await EmailVerificationToken.findOne(criteria);
        } catch (error) {
            console.error("Error finding email verification token:", error);
            throw error;
        }
    },

    /**
     * Find token by token string
     * @param {String} token - Token string
     * @returns {Promise<Object|null>} - Found token or null
     */
    FindByToken: async (token) => {
        try {
            return await EmailVerificationToken.findOne({
                token,
                isUsed: false,
                expiresAt: { $gt: new Date() } // Not expired
            });
        } catch (error) {
            console.error("Error finding token by string:", error);
            throw error;
        }
    },

    /**
     * Mark token as used
     * @param {String} tokenId - Token ID
     * @returns {Promise<Object>} - Updated token
     */
    MarkAsUsed: async (tokenId) => {
        try {
            return await EmailVerificationToken.findByIdAndUpdate(
                tokenId,
                {
                    isUsed: true,
                    usedAt: new Date()
                },
                { new: true }
            );
        } catch (error) {
            console.error("Error marking token as used:", error);
            throw error;
        }
    },

    /**
     * Delete tokens for a user
     * @param {String} userId - User ID
     * @param {String} userType - User type ('user' or 'organizer')
     * @returns {Promise<Object>} - Deletion result
     */
    DeleteUserTokens: async (userId, userType) => {
        try {
            return await EmailVerificationToken.deleteMany({
                user_id: userId,
                user_type: userType
            });
        } catch (error) {
            console.error("Error deleting user tokens:", error);
            throw error;
        }
    },

    /**
     * Delete expired tokens (cleanup)
     * @returns {Promise<Object>} - Deletion result
     */
    CleanupExpiredTokens: async () => {
        try {
            return await EmailVerificationToken.deleteMany({
                expiresAt: { $lt: new Date() }
            });
        } catch (error) {
            console.error("Error cleaning up expired tokens:", error);
            throw error;
        }
    }
};

module.exports = EmailVerificationService;

