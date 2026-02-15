const axios = require('axios');
const logger = require('../helpers/logger.js');

class DaftraService {
    constructor() {
        this.apiKey = process.env.DAFTRA_API_KEY;
        this.clientSecret = process.env.DAFTRA_CLIENT_SECRET;
        this.subdomain = process.env.DAFTRA_SUBDOMAIN;
        this.baseUrl = process.env.DAFTRA_BASE_URL?.replace('{{subdomain}}', this.subdomain);
        this.invoiceUrl = process.env.DAFTRA_INVOICE_URL?.replace('{{subdomain}}', this.subdomain);
        this.clientUrl = process.env.DAFTRA_CLIENT_URL?.replace('{{subdomain}}', this.subdomain);
    }

    /**
     * Make authenticated API request to Daftra
     */
    async makeRequest(method, url, data = null) {
        try {
            const config = {
                method: method,
                url: url,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'apikey': this.apiKey
                }
            };

            if (data && (method === 'POST' || method === 'PUT')) {
                config.data = data;
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
    }

    /**
     * Create or get client in Daftra
     */
    async createOrGetClient(clientData) {
        try {
            // Always create new client for testing
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

            const response = await this.makeRequest('POST', `${this.clientUrl}.json`, clientPayload);

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
    }

    /**
     * Create invoice in Daftra
     */
    async createInvoice(invoiceData) {
        try {
            let clientId = invoiceData.client_id;
            if (!clientId && invoiceData.client) {
                // Create client if not provided
                const client = await this.createOrGetClient(invoiceData.client);
                clientId = client.id;
            }

            const invoicePayload = {
                Invoice: {
                    client_id: parseInt(clientId),
                    date: "2024-02-01",
                    type: invoiceData.type || 1, // 1 = Invoice, 2 = Quote, etc.
                    currency_code: invoiceData.currency || 'SAR',
                    discount: invoiceData.discount || 0,
                    deposit: invoiceData.deposit || 0,
                    notes: invoiceData.notes || '',
                    InvoiceItem: invoiceData.items.map(item => ({
                        product_name: item.name,
                        description: item.description || '',
                        quantity: item.quantity,
                        unit_price: item.unit_price,
                        discount: item.discount || 0,
                        tax1_rate: item.tax_rate || 0
                    }))
                }
            };

            const response = await this.makeRequest('POST', `${this.invoiceUrl}.json`, invoicePayload);

            if (response && response.id) {
                logger.info('[DAFTRA] Invoice created successfully:', response.id);
                return {
                    id: response.id,
                    number: response.no,
                    pdf_url: response.invoice_pdf_url,
                    total: response.summary_total,
                    status: response.payment_status
                };
            } else {
                throw new Error('Failed to create invoice in Daftra');
            }
        } catch (error) {
            logger.error('[DAFTRA] Error creating invoice:', error.message);
            throw error;
        }
    }

    /**
     * Get invoice by ID
     */
    async getInvoice(invoiceId) {
        try {
            const response = await this.makeRequest('GET', `${this.invoiceUrl}/${invoiceId}.json`);
            return response;
        } catch (error) {
            logger.error('[DAFTRA] Error getting invoice:', error.message);
            throw error;
        }
    }

    /**
     * Get all invoices with pagination
     */
    async getAllInvoices(page = 1, limit = 20) {
        try {
            const response = await this.makeRequest('GET', `${this.invoiceUrl}.json`, {
                page: page,
                limit: limit
            });
            return response;
        } catch (error) {
            logger.error('[DAFTRA] Error getting invoices:', error.message);
            throw error;
        }
    }

    /**
     * Update invoice payment status
     */
    async updateInvoicePayment(invoiceId, paymentData) {
        try {
            const paymentPayload = {
                InvoicePayment: {
                    invoice_id: invoiceId,
                    amount: paymentData.amount,
                    date: paymentData.date || new Date().toISOString().split('T')[0],
                    method: paymentData.method || 'online',
                    notes: paymentData.notes || 'Payment via Zuroona platform'
                }
            };

            const response = await this.makeRequest('POST', `${this.invoiceUrl}/${invoiceId}/payments.json`, paymentPayload);
            return response;
        } catch (error) {
            logger.error('[DAFTRA] Error updating invoice payment:', error.message);
            throw error;
        }
    }
}

module.exports = new DaftraService();