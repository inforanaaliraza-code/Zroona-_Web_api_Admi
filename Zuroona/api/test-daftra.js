/**
 * Daftra Integration Test Script
 *
 * This script tests the Daftra API integration by:
 * 1. Generating OAuth2 access token
 * 2. Creating a test client
 * 3. Creating a test invoice
 * 4. Verifying the invoice was created successfully
 *
 * Run with: node test-daftra.js
 */

require('dotenv').config();
const _axios = require('axios');
const daftraService = require('./src/services/daftraService.js');

async function testDaftraIntegration() {
    console.log('🧪 Testing Daftra Integration...\n');

    try {
        // Test data
        let testClient = {
            first_name: 'Test',
            last_name: 'User',
            email: `test${Date.now()}@zuroona.com`,
            phone: '+966501234567',
            address: 'Riyadh, Saudi Arabia',
            city: 'Riyadh',
            country_code: 'SA',
            currency: 'SAR'
        };

        let testInvoice = {
            client: testClient,
            date: new Date().toISOString().split('T')[0],
            currency: 'SAR',
            discount: 0,
            deposit: 0,
            notes: 'Test invoice from Zuroona integration',
            items: [{
                name: 'Test Event Booking',
                description: 'Test event booking for integration testing',
                quantity: 2,
                unit_price: 100,
                discount: 0,
                tax_rate: 15 // 15% VAT for Saudi Arabia
            }]
        };

        console.log('1️⃣ Testing Client Creation...');
        const client = await daftraService.createOrGetClient(testClient);
        console.log(`✅ Client created/found with ID: ${client.id}\n`);

        console.log('2️⃣ Testing Invoice Creation...');
        testInvoice = {
            client_id: client.id,
            date: new Date().toISOString().split('T')[0],
            currency: 'SAR',
            discount: 0,
            deposit: 0,
            notes: 'Test invoice from Zuroona integration',
            items: [{
                name: 'Test Event Booking',
                description: 'Test event booking for integration testing',
                quantity: 2,
                unit_price: 100,
                discount: 0,
                tax_rate: 15 // 15% VAT for Saudi Arabia
            }]
        };
        console.log('Invoice payload:', JSON.stringify(testInvoice, null, 2));
        const invoice = await daftraService.createInvoice(testInvoice);
        console.log(`✅ Invoice created successfully!`);
        console.log(`   Invoice ID: ${invoice.id}`);
        console.log(`   Invoice Number: ${invoice.number}`);
        console.log(`   Total Amount: ${invoice.total} ${testInvoice.currency}`);
        console.log(`   PDF URL: ${invoice.pdf_url}`);
        console.log(`   HTML URL: ${invoice.html_url}\n`);

        console.log('🎉 Daftra Integration Test PASSED!');
        console.log('📄 You can view the invoice at:', invoice.pdf_url || invoice.html_url);

        return {
            success: true,
            client: client,
            invoice: invoice
        };

    } catch (error) {
        console.error('❌ Daftra Integration Test FAILED!');
        console.error('Error:', error.message);

        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
        }

        return {
            success: false,
            error: error.message
        };
    }
}

// Run the test if this file is executed directly
if (require.main === module) {
    testDaftraIntegration()
        .then(result => {
            if (!result.success) {
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('Test execution failed:', error);
            process.exit(1);
        });
}

module.exports = { testDaftraIntegration };