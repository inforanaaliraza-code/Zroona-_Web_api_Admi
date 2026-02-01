const axios = require('axios');
const logger = require('./logger.js');

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
	return cleaned;
}

/**
 * Service for interacting with Daftra API using OAuth2
 */
const DaftraService = {
	// Cache for access token
	accessToken: null,
	tokenExpiry: null,

	/**
	 * Generate OAuth2 access token
	 */
	async generateAccessToken(subdomain, apiKey, clientSecret) {
		try {
			subdomain = cleanSubdomain(subdomain);
			console.log('Cleaned subdomain:', subdomain);
			console.log('API Key:', apiKey ? 'Present' : 'Missing');
			console.log('Client Secret:', clientSecret ? 'Present' : 'Missing');

			const formData = new FormData();
			formData.append('grant_type', 'client_credentials');
			formData.append('client_id', apiKey);
			formData.append('client_secret', clientSecret);
			formData.append('scope', 'all');

			const url = `https://${subdomain}.daftra.com/api2/v2/oauth/token`;
			console.log('OAuth URL:', url);

			const response = await axios.post(url, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'Accept': 'application/json'
				}
			});

			if (response.data && response.data.access_token) {
				this.accessToken = response.data.access_token;
				// Set token expiry (typically 1 hour, but adjust based on response)
				this.tokenExpiry = Date.now() + (response.data.expires_in || 3600) * 1000;

				logger.info('[DAFTRA] Access token generated successfully');
				return this.accessToken;
			} else {
				throw new Error('Invalid response from Daftra OAuth endpoint');
			}
		} catch (error) {
			logger.error('[DAFTRA] Error generating access token:', error.message);
			if (error.response) {
				logger.error('[DAFTRA] Response data:', error.response.data);
			}
			throw error;
		}
	},

	/**
	 * Get valid access token (generate if expired or missing)
	 */
	async getAccessToken(subdomain, apiKey, clientSecret) {
		if (!this.accessToken || !this.tokenExpiry || Date.now() >= this.tokenExpiry) {
			await this.generateAccessToken(subdomain, apiKey, clientSecret);
		}
		return this.accessToken;
	},

	/**
	 * Make authenticated API request to Daftra using OAuth2 Bearer token
	 */
	async makeRequestWithOAuth(method, url, data = null, subdomain, apiKey, clientSecret) {
		try {
			const token = await this.getOAuthToken(subdomain, apiKey);

			let config = {
				method: method,
				url: url,
				headers: {
					'Authorization': `Bearer ${token}`,
					'Accept': 'application/json',
					'apikey': apiKey
				}
			};

			if (data && (method === 'POST' || method === 'PUT')) {
				config.data = data;
				// Check if data is FormData
				if (data instanceof FormData) {
					config.headers['Content-Type'] = 'multipart/form-data';
				} else {
					config.headers['Content-Type'] = 'application/json';
				}
			}

			if (method === 'GET' && data) {
				config.params = data;
			}

			const response = await axios(config);
			return response.data;
		} catch (error) {
			logger.error(`[DAFTRA] API request failed: ${method} ${url}`, error.message);
			if (error.response) {
				logger.error('[DAFTRA] Response status:', error.response.status);
				logger.error('[DAFTRA] Response data:', error.response.data);
			}
			throw error;
		}
	},

	/**
	 * Get OAuth2 access token using password grant type
	 */
	async getOAuthToken(subdomain, apiKey) {
		try {
			subdomain = cleanSubdomain(subdomain);

			const formData = new FormData();
			formData.append('client_secret', process.env.DAFTRA_CLIENT_SECRET);
			formData.append('client_id', '1'); // Daftra uses '1' as client_id for API access
			formData.append('grant_type', 'password');
			formData.append('username', 'alkahtaninaif17@gmail.com');
			formData.append('password', 'Naif@Z098');

			const tokenUrl = `https://${subdomain}.daftra.com/v2/oauth/token`;

			const response = await axios.post(tokenUrl, formData, {
				headers: {
					'Accept': 'application/json'
				}
			});

			if (response.data && response.data.access_token) {
				logger.info('[DAFTRA] OAuth2 token obtained successfully');
				return response.data.access_token;
			} else {
				throw new Error('Invalid OAuth2 response from Daftra');
			}
		} catch (error) {
			logger.error('[DAFTRA] Error getting OAuth2 token:', error.message);
			if (error.response) {
				logger.error('[DAFTRA] Token response status:', error.response.status);
				logger.error('[DAFTRA] Token response data:', error.response.data);
			}
			throw error;
		}
	},

	/**
	 * Create or get client in Daftra using OAuth2
	 */
	async createOrGetClient(clientData, subdomain, apiKey, clientSecret) {
		try {
			subdomain = cleanSubdomain(subdomain);

			// First, try to find existing client by email
			const existingClients = await this.makeRequestWithOAuth('GET', `https://${subdomain}.daftra.com/api2/clients.json`, {
				email: clientData.email
			}, subdomain, apiKey, clientSecret);

			if (existingClients && existingClients.data && existingClients.data.length > 0) {
				logger.info('[DAFTRA] Found existing client:', existingClients.data[0].id || existingClients.data[0].Client?.id);
				return existingClients.data[0].Client || existingClients.data[0];
			}

			// Create new client
			const clientPayload = {
				Client: {
					business_name: clientData.business_name || `${clientData.first_name} ${clientData.last_name}`,
					first_name: clientData.first_name,
					last_name: clientData.last_name,
					email: clientData.email,
					phone1: clientData.phone,
					address1: clientData.address || '',
					city: clientData.city || '',
					country_code: clientData.country_code || 'SA',
					type: 1, // Individual client
					default_currency_code: clientData.currency || 'SAR'
				}
			};

			const response = await this.makeRequestWithOAuth('POST', `https://${subdomain}.daftra.com/api2/clients.json`, clientPayload, subdomain, apiKey, clientSecret);

			if (response && response.id) {
				logger.info('[DAFTRA] Client created successfully:', response.id);
				return response;
			} else {
				throw new Error('Failed to create client in Daftra');
			}
		} catch (error) {
			logger.error('[DAFTRA] Error creating/getting client:', error.message);
			throw error;
		}
	},

	/**
	 * Create invoice in Daftra using OAuth2
	 */
	async createInvoice(invoiceData, subdomain, apiKey, clientSecret) {
		try {
			subdomain = cleanSubdomain(subdomain);

			// Ensure client exists
			const client = await this.createOrGetClient(invoiceData.client, subdomain, apiKey, clientSecret);

			// Try invoice payload with correct InvoiceItem structure
			const invoicePayload = {
				Invoice: {
					client_id: client.id,
					date: invoiceData.date || new Date().toISOString().split('T')[0],
					currency_code: 'SAR',
					notes: 'Test invoice from Zuroona',
					InvoiceItem: [{
						product_name: 'Test Event Booking',
						description: 'Test event booking for integration testing',
						quantity: 2,
						unit_price: 100.00,
						discount: 0,
						tax1_rate: 15
					}]
				}
			};

			logger.info('[DAFTRA] Creating invoice with payload:', JSON.stringify(invoicePayload, null, 2));

			const response = await this.makeRequestWithOAuth('POST', `https://${subdomain}.daftra.com/api2/invoices.json`, invoicePayload, subdomain, apiKey, clientSecret);

			if (response && response.id) {
				logger.info('[DAFTRA] Invoice created successfully:', response.id);
				return {
					id: response.id,
					number: response.no,
					pdf_url: response.invoice_pdf_url,
					html_url: response.invoice_html_url,
					total: response.summary_total,
					status: response.payment_status
				};
			} else {
				logger.error('[DAFTRA] Unexpected response:', response);
				throw new Error('Failed to create invoice in Daftra');
			}
		} catch (error) {
			logger.error('[DAFTRA] Error creating invoice:', error.message);
			if (error.response) {
				logger.error('[DAFTRA] Response status:', error.response.status);
				logger.error('[DAFTRA] Response data:', error.response.data);
			}
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
	 * @param {Object} options - API options (subdomain, apiKey, clientSecret)
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
			const clientSecret = options.clientSecret || process.env.DAFTRA_CLIENT_SECRET;

			if (!subdomain || !apiKey || !clientSecret) {
				throw new Error("Daftra API credentials missing (subdomain, apiKey, clientSecret)");
			}

			// Step 1: Create or get client
			logger.info(`Creating/getting client in Daftra: ${user.first_name} ${user.last_name}`);

			const clientInfo = {
				first_name: user.first_name || "Guest",
				last_name: user.last_name || "User",
				email: user.email || `guest${Date.now()}@zuroona.com`,
				phone: user.phone_number || user.phone || "",
				address: user.address || "Saudi Arabia",
				city: user.city || "",
				country_code: "SA",
				currency: "SAR"
			};

			let client;
			try {
				client = await this.createOrGetClient(clientInfo, subdomain, apiKey, clientSecret);
				logger.info(`Client ready with ID: ${client.id}`);
			} catch (clientError) {
				logger.error(`Failed to create/get client: ${clientError.message}`);
				throw new Error(`Failed to create client in Daftra: ${clientError.message}`);
			}

			// Step 2: Create invoice
			const invoiceDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
			const totalAmount = booking.total_amount || (event.event_price * (booking.no_of_attendees || 1));
			const attendees = booking.no_of_attendees || 1;

			const invoiceData = {
				client: clientInfo,
				date: invoiceDate,
				currency: "SAR",
				discount: 0,
				deposit: 0,
				notes: `Event booking for ${event.event_name} - Booking ID: ${booking.order_id || booking._id}`,
				items: [{
					name: `Event: ${event.event_name}`,
					description: `Event booking for ${attendees} attendee(s) on ${new Date(event.event_date).toLocaleDateString()}`,
					quantity: attendees,
					unit_price: event.event_price || (totalAmount / attendees),
					discount: 0,
					tax_rate: 15 // 15% VAT for Saudi Arabia
				}]
			};

			let invoice;
			try {
				invoice = await this.createInvoice(invoiceData, subdomain, apiKey, clientSecret);
				logger.info(`Invoice created with ID: ${invoice.id}, Number: ${invoice.number}`);
			} catch (invoiceError) {
				logger.error(`Failed to create invoice: ${invoiceError.message}`);
				throw new Error(`Failed to create invoice in Daftra: ${invoiceError.message}`);
			}

			// Return invoice data in expected format
			return {
				id: invoice.id,
				invoice_id: invoice.number,
				invoice_url: invoice.pdf_url || invoice.html_url,
				total_amount: invoice.total,
				status: invoice.status,
				created_at: new Date().toISOString()
			};

		} catch (error) {
			logger.error(`Failed to generate event receipt: ${error.message}`);
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
