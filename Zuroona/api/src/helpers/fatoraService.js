/**
 * Fatora API Service - Saudi Arabia Invoice Platform
 * 
 * Fatora is a Saudi-based invoicing platform with ZATCA compliance
 * API Documentation: https://docs.fatora.io
 */

const axios = require('axios');
const PrettyConsole = require('./prettyConsole');

const logger = new PrettyConsole();
logger.closeByNewLine = true;
logger.useIcons = true;

const FatoraService = {
	/**
	 * Get Fatora API base URL based on mode
	 */
	getBaseUrl() {
		const mode = process.env.FATORA_MODE || 'sandbox';
		return mode === 'production' 
			? 'https://api.fatora.io/v1' 
			: 'https://sandbox.fatora.io/v1';
	},

	/**
	 * Get Fatora API credentials
	 */
	getCredentials() {
		const apiKey = process.env.FATORA_API_KEY;
		const apiSecret = process.env.FATORA_SECRET_KEY || process.env.FATORA_API_SECRET;

		if (!apiKey || !apiSecret) {
			throw new Error('Fatora API credentials missing. Please set FATORA_API_KEY and FATORA_SECRET_KEY in .env file');
		}

		return { apiKey, apiSecret };
	},

	/**
	 * Create invoice in Fatora
	 */
	async createInvoice(booking, event, user, organizer, _options = {}) {
		try {
			logger.info(`Creating Fatora invoice for booking: ${booking._id || booking._id?.toString() || 'unknown'}`);

			const { apiKey, apiSecret } = this.getCredentials();
			const baseUrl = this.getBaseUrl();

			// Calculate amounts
			const subtotal = event.event_price * booking.no_of_attendees;
			const tax = booking.total_tax_attendees || 0;
			const total = booking.total_amount || (subtotal + tax);

			// Prepare invoice data for Fatora
			const invoiceData = {
				client: {
					name: `${user.first_name} ${user.last_name}`,
					email: user.email,
					phone: user.phone_number || '',
					address: user.address || '',
				},
				items: [
					{
						name: event.event_name,
						description: `Event booking for ${booking.no_of_attendees} attendee(s)`,
						quantity: booking.no_of_attendees,
						price: event.event_price,
						total: subtotal,
					}
				],
				payment: {
					method: 'Card Payment',
					status: 'paid',
					transaction_id: booking.payment_id || '',
				},
				currency: 'SAR',
				tax_amount: tax,
				subtotal: subtotal,
				total: total,
				notes: `Event: ${event.event_name}\nOrganizer: ${organizer.group_name || `${organizer.first_name} ${organizer.last_name}`}\nBooking ID: ${booking.order_id || booking._id}`,
				invoice_date: new Date().toISOString().split('T')[0],
				due_date: new Date().toISOString().split('T')[0],
			};

			logger.info('Sending request to Fatora API...');

			const response = await axios.post(
				`${baseUrl}/invoices`,
				invoiceData,
				{
					headers: {
						'Authorization': `Bearer ${apiKey}`,
						'X-API-Secret': apiSecret,
						'Content-Type': 'application/json',
						'Accept': 'application/json',
					},
					timeout: 30000,
				}
			);

			if (response.data && response.data.invoice_id) {
				logger.success(`Fatora invoice created successfully: ${response.data.invoice_id}`);
				
				return {
					id: response.data.invoice_id,
					invoice_url: response.data.invoice_url || response.data.pdf_url,
					invoice_pdf_url: response.data.pdf_url,
					receipt_pdf_url: response.data.pdf_url,
					qr_code: response.data.qr_code,
					created_at: new Date().toISOString(),
					method: 'fatora',
				};
			} else {
				logger.warn('Fatora response received but no invoice ID found');
				throw new Error('Invalid response from Fatora API');
			}
		} catch (error) {
			// Enhanced error handling
			if (error.response) {
				const status = error.response.status;
				const errorData = error.response.data;

				if (status === 401) {
					logger.error('Fatora API authentication failed (401). Check API credentials.');
					throw new Error('Fatora API authentication failed. Please verify API key and secret.');
				} else if (status === 404) {
					logger.error('Fatora API endpoint not found (404).');
					throw new Error('Fatora API endpoint not found. Check API version.');
				} else if (status === 422) {
					logger.error('Fatora API validation error (422).');
					logger.debug(`Validation errors: ${JSON.stringify(errorData)}`);
					throw new Error(`Fatora API validation failed: ${errorData?.message || 'Invalid data'}`);
				} else {
					logger.error(`Fatora API error (${status}): ${errorData?.message || error.message}`);
					throw new Error(`Fatora API error: ${errorData?.message || error.message}`);
				}
			} else if (error.request) {
				logger.error('Fatora API request failed: No response received');
				throw new Error('Fatora API request failed. Please check network connection.');
			} else {
				logger.error(`Failed to create Fatora invoice: ${error.message}`);
				throw error;
			}
		}
	},

	/**
	 * Get invoice details from Fatora
	 */
	async getInvoice(invoiceId, _options = {}) {
		try {
			const { apiKey, apiSecret } = this.getCredentials();
			const baseUrl = this.getBaseUrl();

			logger.info(`Getting Fatora invoice: ${invoiceId}`);

			const response = await axios.get(
				`${baseUrl}/invoices/${invoiceId}`,
				{
					headers: {
						'Authorization': `Bearer ${apiKey}`,
						'X-API-Secret': apiSecret,
						'Accept': 'application/json',
					},
					timeout: 10000,
				}
			);

			return response.data;
		} catch (error) {
			logger.error(`Failed to get Fatora invoice: ${error.message}`);
			throw error;
		}
	},

	/**
	 * Test Fatora API connection
	 */
	async testConnection() {
		try {
			const { apiKey, apiSecret } = this.getCredentials();
			const baseUrl = this.getBaseUrl();

			logger.info('Testing Fatora API connection...');

			const response = await axios.get(
				`${baseUrl}/account`,
				{
					headers: {
						'Authorization': `Bearer ${apiKey}`,
						'X-API-Secret': apiSecret,
						'Accept': 'application/json',
					},
					timeout: 10000,
				}
			);

			if (response.status === 200) {
				logger.success('Fatora API connection successful!');
				return {
					success: true,
					mode: process.env.FATORA_MODE || 'sandbox',
					account: response.data,
				};
			}
		} catch (error) {
			logger.error(`Fatora API connection failed: ${error.message}`);
			return {
				success: false,
				error: error.message,
			};
		}
	},

	/**
	 * Generate event receipt using Fatora
	 */
	async generateEventReceipt(booking, event, user, organizer, options = {}) {
		return this.createInvoice(booking, event, user, organizer, options);
	},
};

module.exports = FatoraService;


