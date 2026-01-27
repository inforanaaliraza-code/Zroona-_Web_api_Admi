/**
 * MailJS (jsmail) Email Service
 * 
 * This service handles sending emails via MailJS API
 * 
 * Required Environment Variables:
 * - MAILJS_PUBLIC_KEY: Your MailJS Public Key
 * - MAILJS_PRIVATE_KEY: Your MailJS Private Key
 * - MAILJS_SERVICE_ID: Your MailJS Service ID (optional)
 * - MAILJS_TEMPLATE_ID: Your MailJS Template ID (optional)
 * 
 * MailJS API Documentation: https://www.mailjs.com/
 */

const axios = require('axios');

// MailJS API Configuration
const MAILJS_API_URL = 'https://api.mailjs.com/api/v1/send';
const PUBLIC_KEY = process.env.MAILJS_PUBLIC_KEY || 'OSfCgupc61dwFtXNI';
const PRIVATE_KEY = process.env.MAILJS_PRIVATE_KEY || 'fj4w33dz06Qafqvr46ZrK';

/**
 * Send email via MailJS API
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - Email HTML content
 * @param {string} from - Sender email (optional)
 * @returns {Promise<Object>} - Response from MailJS API
 */
const sendEmail = async (to, subject, html, from = null) => {
    try {
        // Validate credentials
        if (!PUBLIC_KEY || !PRIVATE_KEY) {
            throw new Error('MailJS credentials not configured. Please set MAILJS_PUBLIC_KEY and MAILJS_PRIVATE_KEY in environment variables.');
        }

        // Clean keys (remove spaces)
        const publicKey = PUBLIC_KEY.replace(/\s+/g, '');
        const privateKey = PRIVATE_KEY.replace(/\s+/g, '');

        console.log(`📧 [MAILJS] Sending email to: ${to}`);
        console.log(`📝 [MAILJS] Subject: ${subject}`);

        // MailJS API request payload
        // Direct send format with public and private keys
        const payload = {
            publicKey: publicKey,
            privateKey: privateKey,
            to: to.trim(),
            subject: subject.trim(),
            html: html,
            from: from || process.env.MAIL_FROM || 'Zuroona Platform <noreply@zuroona.com>'
        };

        // Send email via MailJS API
        const response = await axios.post(MAILJS_API_URL, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 30000, // 30 seconds timeout
        });

        console.log(`✅ [MAILJS] Email sent successfully. Response:`, response.data);

        // Check if email was sent successfully
        if (response.data && (response.data.success === true || response.data.status === 'success' || response.status === 200)) {
            return {
                success: true,
                message: 'Email sent successfully',
                data: response.data
            };
        }

        return {
            success: true,
            message: 'Email request processed',
            data: response.data
        };

    } catch (error) {
        console.error('❌ [MAILJS] Error sending email:', error.message);
        
        if (error.response) {
            console.error('❌ [MAILJS] API Error Response:', error.response.data);
            console.error('❌ [MAILJS] Status Code:', error.response.status);
            throw new Error(`MailJS API Error: ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
            console.error('❌ [MAILJS] No response received from API');
            throw new Error('MailJS API request failed - no response received');
        } else {
            throw new Error(`MailJS Email Error: ${error.message}`);
        }
    }
};

module.exports = {
    sendEmail
};

