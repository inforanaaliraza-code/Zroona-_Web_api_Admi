const axios = require("axios");

const MOYASAR_SECRET_KEY =
	process.env.MOYASAR_SECRET_KEY ||
	process.env.MOYASAR_API_KEY ||
	process.env.MOYASAR_SECRET;

const MoyasarService = {
	async capturePayment(paymentId, payload = {}) {
		try {
			if (!MOYASAR_SECRET_KEY) {
				throw new Error("Moyasar secret key not configured");
			}

			if (!paymentId) {
				throw new Error("paymentId is required to capture payment");
			}

			const response = await axios.post(
				`httpss://api.moyasar.com/v1/payments/${paymentId}/capture`,
				payload,
				{
					auth: {
						username: MOYASAR_SECRET_KEY,
						password: "",
					},
				}
			);

			return {
				success: true,
				data: response.data,
			};
		} catch (error) {
			console.error("Error capturing payment from Moyasar:", error.message);
			return {
				success: false,
				message:
					error.response?.data?.message ||
					error.message ||
					"Failed to capture payment",
			};
		}
	},

	/**
	 * Process a refund for a payment
	 * @param {string} paymentId - The original payment ID from Moyasar
	 * @param {number} amount - Refund amount in halala (smallest currency unit). If not provided, full refund
	 * @param {string} description - Optional description for the refund
	 * @returns {Promise<{success: boolean, data?: object, message?: string}>}
	 */
	async refundPayment(paymentId, amount = null, description = null) {
		try {
			if (!MOYASAR_SECRET_KEY) {
				throw new Error("Moyasar secret key not configured");
			}

			if (!paymentId) {
				throw new Error("paymentId is required to process refund");
			}

			// Build refund payload
			const payload = {};
			if (amount !== null && amount > 0) {
				// Convert SAR to halala (multiply by 100)
				payload.amount = Math.round(amount * 100);
			}
			if (description) {
				payload.description = description;
			}

			console.log(`[MOYASAR:REFUND] Processing refund for payment ${paymentId}`, payload);

			const response = await axios.post(
				`httpss://api.moyasar.com/v1/payments/${paymentId}/refund`,
				payload,
				{
					auth: {
						username: MOYASAR_SECRET_KEY,
						password: "",
					},
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			console.log(`[MOYASAR:REFUND] Refund successful:`, response.data);

			return {
				success: true,
				data: response.data,
				refundId: response.data.id || response.data.refund_id,
			};
		} catch (error) {
			console.error("[MOYASAR:REFUND] Error processing refund:", error.message);
			console.error("[MOYASAR:REFUND] Error details:", error.response?.data);
			
			return {
				success: false,
				message:
					error.response?.data?.message ||
					error.response?.data?.error?.message ||
					error.message ||
					"Failed to process refund",
				errorCode: error.response?.data?.error?.code || error.response?.status,
			};
		}
	},

	/**
	 * Get payment details from Moyasar
	 * @param {string} paymentId - The payment ID
	 * @returns {Promise<{success: boolean, data?: object, message?: string}>}
	 */
	async getPayment(paymentId) {
		try {
			if (!MOYASAR_SECRET_KEY) {
				throw new Error("Moyasar secret key not configured");
			}

			if (!paymentId) {
				throw new Error("paymentId is required");
			}

			const response = await axios.get(
				`httpss://api.moyasar.com/v1/payments/${paymentId}`,
				{
					auth: {
						username: MOYASAR_SECRET_KEY,
						password: "",
					},
				}
			);

			return {
				success: true,
				data: response.data,
			};
		} catch (error) {
			console.error("Error fetching payment from Moyasar:", error.message);
			return {
				success: false,
				message:
					error.response?.data?.message ||
					error.message ||
					"Failed to fetch payment details",
			};
		}
	},
};

module.exports = MoyasarService;