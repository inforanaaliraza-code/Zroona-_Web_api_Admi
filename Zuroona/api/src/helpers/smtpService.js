/**
 * SMTP Email Service using Nodemailer
 * 
 * This service handles sending emails via SMTP (Gmail, etc.)
 * 
 * Required Environment Variables:
 * - SMTP_HOST: SMTP server host (e.g., smtp.gmail.com)
 * - SMTP_PORT: SMTP server port (e.g., 587)
 * - SMTP_USER: SMTP username (email address)
 * - SMTP_PASS: SMTP password (app password for Gmail)
 * - MAIL_FROM: Sender email address
 * - MAIL_FROM_NAME: Sender name (optional)
 */

const nodemailer = require('nodemailer');

// SMTP Configuration
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const MAIL_FROM = process.env.MAIL_FROM || 'noreply@Zuroona.sa';
const MAIL_FROM_NAME = process.env.MAIL_FROM_NAME || 'Zuroona Platform';

// Create reusable transporter
let transporter = null;

/**
 * Get or create SMTP transporter
 * @returns {Object} Nodemailer transporter
 */
function getTransporter() {
    if (!transporter) {
        if (!SMTP_USER || !SMTP_PASS) {
            throw new Error('SMTP credentials not configured. Please set SMTP_USER and SMTP_PASS in environment variables.');
        }

        transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: SMTP_PORT === 465, // true for 465, false for other ports
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS
            },
            tls: {
                // Do not fail on invalid certs
                rejectUnauthorized: false
            }
        });

        console.log(`✅ [SMTP] Transporter configured: ${SMTP_HOST}:${SMTP_PORT}`);
    }

    return transporter;
}

/**
 * Send email via SMTP
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - Email HTML content
 * @param {string} from - Sender email (optional, uses MAIL_FROM if not provided)
 * @returns {Promise<Object>} - Result object with success status
 */
const sendEmail = async (to, subject, html, from = null) => {
    try {
        // Validate credentials
        if (!SMTP_USER || !SMTP_PASS) {
            throw new Error('SMTP credentials not configured. Please set SMTP_USER and SMTP_PASS in environment variables.');
        }

        // Get transporter
        const mailTransporter = getTransporter();

        // Prepare sender
        const fromAddress = from || `${MAIL_FROM_NAME} <${MAIL_FROM}>`;

        console.log(`📧 [SMTP] Sending email to: ${to}`);
        console.log(`📝 [SMTP] Subject: ${subject}`);
        console.log(`📮 [SMTP] From: ${fromAddress}`);

        // Send email
        const info = await mailTransporter.sendMail({
            from: fromAddress,
            to: to.trim(),
            subject: subject.trim(),
            html: html,
            // Optional: text version
            // text: html.replace(/<[^>]*>/g, '') // Strip HTML tags for text version
        });

        console.log(`✅ [SMTP] Email sent successfully!`);
        console.log(`📬 [SMTP] Message ID: ${info.messageId}`);
        console.log(`📧 [SMTP] Response: ${info.response}`);

        return {
            success: true,
            message: 'Email sent successfully',
            messageId: info.messageId,
            response: info.response
        };

    } catch (error) {
        console.error('❌ [SMTP] Error sending email:', error.message);
        
        if (error.code === 'EAUTH') {
            console.error('❌ [SMTP] Authentication failed. Please check SMTP_USER and SMTP_PASS');
            throw new Error('SMTP Authentication failed. Please check your credentials.');
        } else if (error.code === 'ECONNECTION') {
            console.error('❌ [SMTP] Connection failed. Please check SMTP_HOST and SMTP_PORT');
            throw new Error('SMTP Connection failed. Please check your SMTP settings.');
        } else {
            throw new Error(`SMTP Email Error: ${error.message}`);
        }
    }
};

/**
 * Verify SMTP connection
 * @returns {Promise<boolean>} - True if connection is valid
 */
const verifyConnection = async () => {
    try {
        const mailTransporter = getTransporter();
        await mailTransporter.verify();
        console.log('✅ [SMTP] Server is ready to send emails');
        return true;
    } catch (error) {
        console.error('❌ [SMTP] Server verification failed:', error.message);
        return false;
    }
};

module.exports = {
    sendEmail,
    verifyConnection
};

