const axios = require("axios");
const PrettyConsole = require("./prettyConsole");

const logger = new PrettyConsole();
logger.closeByNewLine = true;
logger.useIcons = true;

/**
 * Service for interacting with Daftra API
 */
const DaftraService = {
	/**
	 * Generate an invoice in Daftra
	 * @param {Object} invoiceData - The invoice data
	 * @param {Object} options - API options (subdomain, apiKey)
	 * @returns {Promise<Object>} - The created invoice
	 */
	async createInvoice(invoiceData, options = {}) {
		try {
			const subdomain = options.subdomain || process.env.DAFTRA_SUBDOMAIN;
			const apiKey = options.apiKey || process.env.DAFTRA_API_KEY;

			if (!subdomain || !apiKey) {
				throw new Error("Daftra API credentials missing");
			}

			logger.info(
				`Creating invoice in Daftra for ${invoiceData.Invoice?.client_first_name || "client"
				}`
			);

			const response = await axios.post(
				`https://${subdomain}.daftra.com/api2/invoices`,
				invoiceData,
				{
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: `Bearer ${apiKey}`,
						apikey: apiKey,
					},
				}
			);

			logger.success(
				`Invoice created successfully: ${response.data?.id || "unknown ID"
				}`
			);
			return response.data;
		} catch (error) {
			logger.error(`Failed to create Daftra invoice: ${error.message}`);
			logger.debug(error.response?.data || error);
			throw error;
		}
	},

	/**
	 * Get invoice details from Daftra
	 * @param {string} invoiceId - The invoice ID to retrieve
	 * @param {Object} options - API options (subdomain, apiKey)
	 * @returns {Promise<Object>} - The invoice details
	 */
	async getInvoice(invoiceId, options = {}) {
		try {
			const subdomain = options.subdomain || process.env.DAFTRA_SUBDOMAIN;
			const apiKey = options.apiKey || process.env.DAFTRA_API_KEY;

			if (!subdomain || !apiKey) {
				throw new Error("Daftra API credentials missing");
			}

			logger.info(`Getting invoice details for ID: ${invoiceId}`);

			const response = await axios.get(
				`https://${subdomain}.daftra.com/api2/invoices/${invoiceId}`,
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${apiKey}`,
						apikey: apiKey,
					},
				}
			);

			return response.data;
		} catch (error) {
			logger.error(`Failed to get Daftra invoice: ${error.message}`);
			throw error;
		}
	},

	/**
	 * Create a client in Daftra
	 * @param {Object} clientData - The client data
	 * @param {Object} options - API options (subdomain, apiKey)
	 * @returns {Promise<Object>} - The created client
	 */
	async createClient(clientData, options = {}) {
		try {
			const subdomain = options.subdomain || process.env.DAFTRA_SUBDOMAIN;
			const apiKey = options.apiKey || process.env.DAFTRA_API_KEY;

			if (!subdomain || !apiKey) {
				throw new Error("Daftra API credentials missing");
			}

			logger.info(
				`Creating client in Daftra: ${clientData.first_name} ${clientData.last_name}`
			);

			const response = await axios.post(
				`https://${subdomain}.daftra.com/api2/clients`,
				{ Client: clientData },
				{
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: `Bearer ${apiKey}`,
						apikey: apiKey,
					},
				}
			);

			logger.success(
				`Client created successfully: ${response.data?.id || "unknown ID"
				}`
			);
			return response.data;
		} catch (error) {
			logger.error(`Failed to create Daftra client: ${error.message}`);
			throw error;
		}
	},

	/**
	 * Generate an invoice for an event booking
	 * @param {Object} booking - The booking object
	 * @param {Object} event - The event object
	 * @param {Object} user - The user object
	 * @param {Object} organizer - The organizer object
	 * @param {Object} options - API options (subdomain, apiKey)
	 * @returns {Promise<Object>} - The created invoice
	 */
	async generateEventInvoice(booking, event, user, organizer, options = {}) {
		try {
			logger.info(`Generating invoice for booking: ${booking._id}`);

			// Format date for invoice
			const invoiceDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

			// Prepare invoice data
			const invoiceData = {
				Invoice: {
					staff_id: 0,
					store_id: 0,
					client_id: user._id.toString(),
					currency_code: "SAR",
					client_business_name:
						organizer.group_name || "Zuroona Events",
					client_first_name: user.first_name || "",
					client_last_name: user.last_name || "",
					client_email: user.email || "",
					client_address1: user.address || "",
					client_country_code: "SA",
					date: invoiceDate,
					draft: "0",
					notes: `Payment for event: ${event.event_name}`,
					html_notes: `<p>Thank you for booking with us!</p><p>Event: ${event.event_name
						}</p><p>Date: ${new Date(
							event.event_date
						).toLocaleDateString()}</p>`,
				},
				InvoiceItem: [
					{
						item: event.event_name,
						description: `Booking for ${booking.no_of_attendees} attendee(s)`,
						unit_price: event.event_price,
						quantity: booking.no_of_attendees,
						product_id: event._id.toString(),
					},
				],
			};

			// Create the invoice
			return await this.createInvoice(invoiceData, options);
		} catch (error) {
			logger.error(`Failed to generate event invoice: ${error.message}`);
			throw error;
		}
	},
};

module.exports = DaftraService;
