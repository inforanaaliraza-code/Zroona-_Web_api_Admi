const axios = require("axios");
const PrettyConsole = require("./prettyConsole");

const logger = new PrettyConsole();
logger.closeByNewLine = true;
logger.useIcons = true;

/**
 * Clean subdomain - remove https://, http://, trailing slashes, and .daftra.com
 * @param {string} subdomain - The subdomain to clean
 * @returns {string} - Cleaned subdomain
 */
function cleanSubdomain(subdomain) {
	if (!subdomain) return subdomain;
	let cleaned = subdomain
		.replace(/^https?:\/\//i, '') // Remove http:// or https://
		.replace(/\.daftra\.com.*$/i, '') // Remove .daftra.com and anything after
		.replace(/\/$/, '') // Remove trailing slash
		.trim();
	
	// Preserve case sensitivity for subdomain (Daftra subdomains are case-sensitive)
	// Convert to lowercase for consistency, but note: some Daftra accounts may need exact case
	return cleaned;
}

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
			let subdomain = options.subdomain || process.env.DAFTRA_SUBDOMAIN;
			subdomain = cleanSubdomain(subdomain);
			const apiKey = options.apiKey || process.env.DAFTRA_API_KEY;

			if (!subdomain || !apiKey) {
				const errorMsg = "Daftra API credentials missing. Please configure DAFTRA_SUBDOMAIN and DAFTRA_API_KEY in environment variables.";
				logger.error(errorMsg);
				throw new Error(errorMsg);
			}

			// Validate credentials format
			if (subdomain.trim() === "" || apiKey.trim() === "") {
				const errorMsg = "Daftra API credentials are empty. Please check your environment variables.";
				logger.error(errorMsg);
				throw new Error(errorMsg);
			}

			logger.info(
				`Creating invoice in Daftra for ${invoiceData.Invoice?.client_first_name || "client"}`
			);

			// Daftra uses APIKEY header and /api2/ endpoints
			const response = await axios.post(
				`https://${subdomain}.daftra.com/api2/invoices`,
				invoiceData,
				{
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						APIKEY: apiKey,
					},
					timeout: 30000, // 30 second timeout
				}
			);

			logger.success(
				`Invoice created successfully: ${response.data?.id || "unknown ID"}`
			);
			return response.data;
		} catch (error) {
			// Enhanced error handling
			if (error.response) {
				// Server responded with error status
				const status = error.response.status;
				const statusText = error.response.statusText;
				const errorData = error.response.data;

				if (status === 401) {
					const errorMsg = `Daftra API authentication failed (401). Please verify your API key and subdomain are correct.`;
					logger.error(errorMsg);
					logger.debug(`Response data: ${JSON.stringify(errorData)}`);
					throw new Error(errorMsg);
				} else if (status === 404) {
					const errorMsg = `Daftra API endpoint not found (404). Please verify the subdomain is correct.`;
					logger.error(errorMsg);
					throw new Error(errorMsg);
				} else {
					const errorMsg = `Daftra API error (${status} ${statusText}): ${errorData?.message || error.message}`;
					logger.error(errorMsg);
					logger.debug(`Response data: ${JSON.stringify(errorData)}`);
					throw new Error(errorMsg);
				}
			} else if (error.request) {
				// Request was made but no response received
				const errorMsg = `Daftra API request failed: No response received. Please check your network connection.`;
				logger.error(errorMsg);
				throw new Error(errorMsg);
			} else {
				// Error in request setup
				logger.error(`Failed to create Daftra invoice: ${error.message}`);
				throw error;
			}
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
			let subdomain = options.subdomain || process.env.DAFTRA_SUBDOMAIN;
			subdomain = cleanSubdomain(subdomain);
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
						APIKEY: apiKey,
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
			let subdomain = options.subdomain || process.env.DAFTRA_SUBDOMAIN;
			subdomain = cleanSubdomain(subdomain);
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
						APIKEY: apiKey,
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
	 * Create a receipt in Daftra (Receipts API)
	 * @param {Object} receiptData - The receipt data
	 * @param {Object} options - API options (subdomain, apiKey)
	 * @returns {Promise<Object>} - The created receipt
	 */
	async createReceipt(receiptData, options = {}) {
		try {
			let subdomain = options.subdomain || process.env.DAFTRA_SUBDOMAIN || "tdb";
			subdomain = cleanSubdomain(subdomain);
			const apiKey = options.apiKey || process.env.DAFTRA_API_KEY || "a287194bdf648c16341ecb843cea1fbae7392962";

			if (!subdomain || !apiKey) {
				const errorMsg = "Daftra API credentials missing. Please configure DAFTRA_SUBDOMAIN and DAFTRA_API_KEY in environment variables.";
				logger.error(errorMsg);
				throw new Error(errorMsg);
			}

			// Validate credentials format
			if (subdomain.trim() === "" || apiKey.trim() === "") {
				const errorMsg = "Daftra API credentials are empty. Please check your environment variables.";
				logger.error(errorMsg);
				throw new Error(errorMsg);
			}

			logger.info(
				`Creating receipt in Daftra for ${receiptData.Receipt?.client_first_name || "client"}`
			);

			// Daftra uses APIKEY header and requires client_id
			// Note: receipts are just invoices in Daftra
			const response = await axios.post(
				`https://${subdomain}.daftra.com/api2/invoices`,
				receiptData,
				{
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						APIKEY: apiKey,
					},
					timeout: 30000, // 30 second timeout
				}
			);

			logger.success(
				`Receipt created successfully: ${response.data?.id || "unknown ID"}`
			);
			return response.data;
		} catch (error) {
			// Enhanced error handling
			if (error.response) {
				const status = error.response.status;
				const statusText = error.response.statusText;
				const errorData = error.response.data;

				if (status === 401) {
					const errorMsg = `Daftra API authentication failed (401). Please verify your API key and subdomain are correct.`;
					logger.error(errorMsg);
					logger.debug(`Response data: ${JSON.stringify(errorData)}`);
					throw new Error(errorMsg);
				} else if (status === 404) {
					const errorMsg = `Daftra API endpoint not found (404). Please verify the subdomain is correct.`;
					logger.error(errorMsg);
					throw new Error(errorMsg);
				} else {
					const errorMsg = `Daftra API error (${status} ${statusText}): ${errorData?.message || error.message}`;
					logger.error(errorMsg);
					logger.debug(`Response data: ${JSON.stringify(errorData)}`);
					throw new Error(errorMsg);
				}
			} else if (error.request) {
				const errorMsg = `Daftra API request failed: No response received. Please check your network connection.`;
				logger.error(errorMsg);
				throw new Error(errorMsg);
			} else {
				logger.error(`Failed to create Daftra receipt: ${error.message}`);
				throw error;
			}
		}
	},

	/**
	 * Get receipt details from Daftra
	 * @param {string} receiptId - The receipt ID to retrieve
	 * @param {Object} options - API options (subdomain, apiKey)
	 * @returns {Promise<Object>} - The receipt details
	 */
	async getReceipt(receiptId, options = {}) {
		try {
			let subdomain = options.subdomain || process.env.DAFTRA_SUBDOMAIN || "tdb";
			subdomain = cleanSubdomain(subdomain);
			const apiKey = options.apiKey || process.env.DAFTRA_API_KEY || "a287194bdf648c16341ecb843cea1fbae7392962";

			if (!subdomain || !apiKey) {
				throw new Error("Daftra API credentials missing");
			}

			logger.info(`Getting receipt details for ID: ${receiptId}`);

			const response = await axios.get(
				`https://${subdomain}.daftra.com/api2/invoices/${receiptId}`,
				{
					headers: {
						Accept: "application/json",
						APIKEY: apiKey,
					},
				}
			);

			return response.data;
		} catch (error) {
			logger.error(`Failed to get Daftra receipt: ${error.message}`);
			throw error;
		}
	},

	/**
	 * Generate a receipt for an event booking (Create Client + Invoice)
	 * @param {Object} booking - The booking object
	 * @param {Object} event - The event object
	 * @param {Object} user - The user object
	 * @param {Object} organizer - The organizer object
	 * @param {Object} options - API options (subdomain, apiKey)
	 * @returns {Promise<Object>} - The created invoice with PDF URL
	 */
	async generateEventReceipt(booking, event, user, organizer, options = {}) {
		try {
			logger.info(`Generating invoice for booking: ${booking._id || booking._id?.toString() || 'unknown'}`);

			// Validate required data
			if (!booking || !event || !user || !organizer) {
				throw new Error("Missing required data for invoice generation");
			}

			let subdomain = options.subdomain || process.env.DAFTRA_SUBDOMAIN;
			subdomain = cleanSubdomain(subdomain);
			const apiKey = options.apiKey || process.env.DAFTRA_API_KEY;

			if (!subdomain || !apiKey) {
				throw new Error("Daftra API credentials missing");
			}

			const headers = {
				Accept: "application/json",
				"Content-Type": "application/json",
				APIKEY: apiKey, // Use APIKEY header (not Bearer)
			};

			// Step 1: Create or get client
			logger.info(`Creating client in Daftra: ${user.first_name} ${user.last_name}`);
			
			const clientData = {
				Client: {
					first_name: user.first_name || "Guest",
					last_name: user.last_name || "User",
					email: user.email || `guest${Date.now()}@zuroona.com`,
					phone: user.phone || "",
					country_code: "SA",
					address1: user.address || "Saudi Arabia",
					client_type: "Individual",
				}
			};

			let clientId;
			try {
				const clientResponse = await axios.post(
					`https://${subdomain}.daftra.com/api2/clients`,
					clientData,
					{
						headers,
						timeout: 20000,
					}
				);
				clientId = clientResponse.data?.id || clientResponse.data?.Client?.id;
				logger.success(`Client created with ID: ${clientId}`);
			} catch (clientError) {
				logger.error(`Failed to create client: ${clientError.message}`);
				throw new Error(`Failed to create client in Daftra: ${clientError.message}`);
			}

			// Step 2: Create invoice with client ID
			const invoiceDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
			const totalAmount = booking.total_amount || (event.event_price * (booking.no_of_attendees || 1));

			const invoiceData = {
				Invoice: {
					client_id: clientId, // Required!
					currency_code: "SAR",
					date: invoiceDate,
					draft: "0",
					notes: `Invoice for event: ${event.event_name || 'Event'}`,
					html_notes: `<p>Thank you for booking with Zuroona!</p><p><strong>Event:</strong> ${event.event_name || 'Event'}</p><p><strong>Date:</strong> ${event.event_date ? new Date(event.event_date).toLocaleDateString() : 'N/A'}</p><p><strong>Attendees:</strong> ${booking.no_of_attendees || 1}</p><p><strong>Total:</strong> ${totalAmount} SAR</p>`,
				},
				InvoiceItem: [
					{
						item: event.event_name || "Event Booking",
						description: `Booking for ${booking.no_of_attendees || 1} attendee(s)`,
						unit_price: event.event_price || 0,
						quantity: booking.no_of_attendees || 1,
					},
				],
			};

			logger.info(`Creating invoice in Daftra for client ID: ${clientId}`);

			try {
				const invoiceResponse = await axios.post(
					`https://${subdomain}.daftra.com/api2/invoices`,
					invoiceData,
					{
						headers,
						timeout: 20000,
					}
				);

				const invoiceId = invoiceResponse.data?.id || invoiceResponse.data?.Invoice?.id;
				const invoicePdfUrl = `https://${subdomain}.daftra.com/invoices/${invoiceId}/pdf`;

				logger.success(`Invoice created successfully: ${invoiceId}`);
				logger.success(`Invoice PDF URL: ${invoicePdfUrl}`);

				return {
					id: invoiceId,
					client_id: clientId,
					pdf_url: invoicePdfUrl,
					receipt_pdf_url: invoicePdfUrl,
					invoice_url: invoicePdfUrl,
					...invoiceResponse.data,
				};
			} catch (invoiceError) {
				logger.error(`Failed to create invoice: ${invoiceError.message}`);
				if (invoiceError.response) {
					logger.error(`Invoice error status: ${invoiceError.response.status}`);
					logger.error(`Invoice error data: ${JSON.stringify(invoiceError.response.data)}`);
				}
				throw new Error(`Failed to create invoice in Daftra: ${invoiceError.message}`);
			}
		} catch (error) {
			logger.error(`Failed to generate event invoice: ${error.message}`);
			throw error;
		}
	},

	/**
	 * Generate an invoice for an event booking (Legacy - kept for backward compatibility)
	 * @param {Object} booking - The booking object
	 * @param {Object} event - The event object
	 * @param {Object} user - The user object
	 * @param {Object} organizer - The organizer object
	 * @param {Object} options - API options (subdomain, apiKey)
	 * @returns {Promise<Object>} - The created invoice
	 */
	async generateEventInvoice(booking, event, user, organizer, options = {}) {
		// Use Receipts API instead of Invoices API
		return await this.generateEventReceipt(booking, event, user, organizer, options);
	},
};

module.exports = DaftraService;
