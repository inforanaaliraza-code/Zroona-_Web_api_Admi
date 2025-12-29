/**
 * Local Invoice/Receipt Generator
 * 
 * This generates invoices locally when Daftra API is not available
 * Can be used as fallback or primary invoice generator
 */

const fs = require('fs');
const path = require('path');

const LocalInvoiceGenerator = {
	/**
	 * Generate a simple text-based invoice
	 */
	generateTextInvoice(booking, event, user, organizer) {
		const invoiceId = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
		const invoiceDate = new Date().toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});

		const invoice = `
╔══════════════════════════════════════════════════════════════╗
║                    ZUROONA EVENT RECEIPT                      ║
║                        Invoice/Receipt                        ║
╚══════════════════════════════════════════════════════════════╝

INVOICE DETAILS
───────────────────────────────────────────────────────────────
Invoice ID:       ${invoiceId}
Invoice Date:     ${invoiceDate}
Order ID:         ${booking.order_id || booking._id}
Payment Status:   PAID

CUSTOMER INFORMATION
───────────────────────────────────────────────────────────────
Name:            ${user.first_name} ${user.last_name}
Email:           ${user.email}
Phone:           ${user.phone_number || 'N/A'}
Address:         ${user.address || 'N/A'}

EVENT INFORMATION
───────────────────────────────────────────────────────────────
Event Name:      ${event.event_name}
Event Date:      ${new Date(event.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
Organizer:       ${organizer.group_name || `${organizer.first_name} ${organizer.last_name}`}

BOOKING DETAILS
───────────────────────────────────────────────────────────────
Number of Attendees:    ${booking.no_of_attendees}
Price per Ticket:       ${event.event_price} SAR
Subtotal:              ${(event.event_price * booking.no_of_attendees).toFixed(2)} SAR
Tax (if applicable):    ${(booking.total_tax_attendees || 0).toFixed(2)} SAR
───────────────────────────────────────────────────────────────
TOTAL AMOUNT PAID:     ${booking.total_amount.toFixed(2)} SAR
───────────────────────────────────────────────────────────────

PAYMENT INFORMATION
───────────────────────────────────────────────────────────────
Payment Method:   Card Payment (Moyasar)
Payment Date:     ${new Date().toLocaleDateString()}
Transaction ID:   ${booking.payment_id || 'N/A'}

───────────────────────────────────────────────────────────────
Thank you for booking with Zuroona!
For support, contact: ${process.env.ADMIN_EMAIL || 'support@zuroona.com'}

This is a computer-generated receipt and does not require signature.
Generated on: ${new Date().toISOString()}
───────────────────────────────────────────────────────────────
`;

		return {
			id: invoiceId,
			text: invoice,
			created_at: new Date().toISOString(),
			booking_id: booking._id,
			user_id: user._id,
			event_id: event._id,
			amount: booking.total_amount,
		};
	},

	/**
	 * Generate HTML invoice
	 */
	generateHTMLInvoice(booking, event, user, organizer) {
		const invoiceId = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
		const invoiceDate = new Date().toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});

		const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${invoiceId}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; padding: 20px; }
        .invoice-container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 3px solid #a797cc; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #a797cc; font-size: 32px; margin-bottom: 10px; }
        .header p { color: #666; font-size: 14px; }
        .invoice-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .invoice-info div { flex: 1; }
        .invoice-info h3 { color: #a797cc; margin-bottom: 10px; font-size: 16px; }
        .invoice-info p { margin: 5px 0; font-size: 14px; }
        .section { margin-bottom: 25px; }
        .section h3 { background: #a797cc; color: white; padding: 10px; margin-bottom: 15px; }
        .section-content { padding: 0 10px; }
        .section-content p { margin: 8px 0; display: flex; justify-content: space-between; }
        .section-content p strong { color: #555; }
        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        .table th { background: #f8f9fa; font-weight: 600; color: #555; }
        .total-section { background: #f8f9fa; padding: 20px; margin-top: 30px; border-left: 4px solid #a797cc; }
        .total-section p { display: flex; justify-content: space-between; margin: 10px 0; font-size: 16px; }
        .total-section .grand-total { font-size: 24px; font-weight: bold; color: #a797cc; border-top: 2px solid #a797cc; padding-top: 15px; margin-top: 15px; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #eee; color: #666; font-size: 12px; }
        .paid-stamp { text-align: center; margin: 20px 0; }
        .paid-stamp span { display: inline-block; background: #28a745; color: white; padding: 10px 30px; font-size: 24px; font-weight: bold; transform: rotate(-5deg); border-radius: 5px; }
        @media print { body { background: white; padding: 0; } .invoice-container { box-shadow: none; } }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <h1>🎉 ZUROONA</h1>
            <p>Event Management Platform</p>
            <p style="margin-top: 10px; font-size: 18px; font-weight: bold;">INVOICE / RECEIPT</p>
        </div>

        <div class="invoice-info">
            <div>
                <h3>Invoice Details</h3>
                <p><strong>Invoice ID:</strong> ${invoiceId}</p>
                <p><strong>Date:</strong> ${invoiceDate}</p>
                <p><strong>Order ID:</strong> ${booking.order_id || booking._id}</p>
            </div>
            <div>
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> ${user.first_name} ${user.last_name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone:</strong> ${user.phone_number || 'N/A'}</p>
            </div>
        </div>

        <div class="paid-stamp">
            <span>✓ PAID</span>
        </div>

        <div class="section">
            <h3>Event Information</h3>
            <div class="section-content">
                <p><strong>Event Name:</strong> <span>${event.event_name}</span></p>
                <p><strong>Event Date:</strong> <span>${new Date(event.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
                <p><strong>Organizer:</strong> <span>${organizer.group_name || `${organizer.first_name} ${organizer.last_name}`}</span></p>
            </div>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${event.event_name} - Event Ticket</td>
                    <td>${booking.no_of_attendees}</td>
                    <td>${event.event_price.toFixed(2)} SAR</td>
                    <td>${(event.event_price * booking.no_of_attendees).toFixed(2)} SAR</td>
                </tr>
            </tbody>
        </table>

        <div class="total-section">
            <p><strong>Subtotal:</strong> <span>${(event.event_price * booking.no_of_attendees).toFixed(2)} SAR</span></p>
            <p><strong>Tax:</strong> <span>${(booking.total_tax_attendees || 0).toFixed(2)} SAR</span></p>
            <p class="grand-total"><strong>TOTAL PAID:</strong> <span>${booking.total_amount.toFixed(2)} SAR</span></p>
        </div>

        <div class="section">
            <h3>Payment Information</h3>
            <div class="section-content">
                <p><strong>Payment Method:</strong> <span>Card Payment (Moyasar)</span></p>
                <p><strong>Payment Date:</strong> <span>${new Date().toLocaleDateString()}</span></p>
                <p><strong>Transaction ID:</strong> <span>${booking.payment_id || 'N/A'}</span></p>
                <p><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">✓ PAID</span></p>
            </div>
        </div>

        <div class="footer">
            <p>Thank you for booking with Zuroona!</p>
            <p>For support and inquiries: ${process.env.ADMIN_EMAIL || 'support@zuroona.com'}</p>
            <p style="margin-top: 10px;">This is a computer-generated receipt and does not require a signature.</p>
            <p style="font-size: 10px; margin-top: 10px;">Generated on: ${new Date().toISOString()}</p>
        </div>
    </div>
</body>
</html>
`;

		return {
			id: invoiceId,
			html: html,
			created_at: new Date().toISOString(),
			booking_id: booking._id,
			user_id: user._id,
			event_id: event._id,
			amount: booking.total_amount,
		};
	},

	/**
	 * Save invoice to file system
	 */
	async saveInvoiceToFile(invoice, format = 'html') {
		try {
			const invoicesDir = path.join(__dirname, '../../invoices');
			
			// Create directory if it doesn't exist
			if (!fs.existsSync(invoicesDir)) {
				fs.mkdirSync(invoicesDir, { recursive: true });
			}

			const filename = `invoice-${invoice.id}.${format}`;
			const filepath = path.join(invoicesDir, filename);

			const content = format === 'html' ? invoice.html : invoice.text;
			fs.writeFileSync(filepath, content, 'utf8');

			// Return public URL (you'll need to serve this directory)
			const publicUrl = `/invoices/${filename}`;

			return {
				success: true,
				filepath: filepath,
				url: publicUrl,
				filename: filename,
			};
		} catch (error) {
			console.error('Error saving invoice:', error);
			throw error;
		}
	},

	/**
	 * Generate and save invoice (complete flow)
	 */
	async generateAndSaveInvoice(booking, event, user, organizer) {
		try {
			// Generate HTML invoice
			const invoice = this.generateHTMLInvoice(booking, event, user, organizer);

			// Save to file
			const saved = await this.saveInvoiceToFile(invoice, 'html');

			return {
				id: invoice.id,
				invoice_url: saved.url,
				invoice_pdf_url: saved.url,
				receipt_pdf_url: saved.url,
				created_at: invoice.created_at,
				amount: invoice.amount,
				booking_id: invoice.booking_id,
				method: 'local', // To track this was generated locally
			};
		} catch (error) {
			console.error('Error generating invoice:', error);
			throw error;
		}
	},
};

module.exports = LocalInvoiceGenerator;


