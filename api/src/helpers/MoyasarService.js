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
				`https://api.moyasar.com/v1/payments/${paymentId}/capture`,
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
};

module.exports = MoyasarService;