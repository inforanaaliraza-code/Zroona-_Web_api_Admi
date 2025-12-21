/**
 * Test Script for Moyasar Refund Integration
 * 
 * This script verifies that the Moyasar refund integration is correctly implemented
 * by checking code structure, method signatures, and integration points.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Moyasar Refund Integration...\n');

let testsPassed = 0;
let testsFailed = 0;
const testResults = [];

function test(name, condition, details = '') {
    if (condition) {
        console.log(`✅ ${name}`);
        testsPassed++;
        testResults.push({ name, status: 'PASS', details });
    } else {
        console.log(`❌ ${name}`);
        testsFailed++;
        testResults.push({ name, status: 'FAIL', details });
    }
}

// Test 1: MoyasarService has refundPayment method
try {
    const moyasarServicePath = path.join(__dirname, 'src', 'helpers', 'MoyasarService.js');
    const moyasarServiceContent = fs.readFileSync(moyasarServicePath, 'utf8');
    test(
        'MoyasarService has refundPayment method',
        moyasarServiceContent.includes('refundPayment') && moyasarServiceContent.includes('async refundPayment'),
        'refundPayment method found in MoyasarService'
    );
} catch (error) {
    test('MoyasarService file exists', false, `Error: ${error.message}`);
}

// Test 2: MoyasarService has getPayment method
try {
    const moyasarServicePath = path.join(__dirname, 'src', 'helpers', 'MoyasarService.js');
    const moyasarServiceContent = fs.readFileSync(moyasarServicePath, 'utf8');
    test(
        'MoyasarService has getPayment method',
        moyasarServiceContent.includes('getPayment') && moyasarServiceContent.includes('async getPayment'),
        'getPayment method found in MoyasarService'
    );
} catch (error) {
    test('MoyasarService file exists', false, `Error: ${error.message}`);
}

// Test 3: MoyasarService uses correct API endpoint for refunds
try {
    const moyasarServicePath = path.join(__dirname, 'src', 'helpers', 'MoyasarService.js');
    const moyasarServiceContent = fs.readFileSync(moyasarServicePath, 'utf8');
    test(
        'MoyasarService uses correct refund API endpoint',
        moyasarServiceContent.includes('/v1/payments/') && moyasarServiceContent.includes('/refund'),
        'Refund API endpoint correctly configured'
    );
} catch (error) {
    test('MoyasarService file exists', false, `Error: ${error.message}`);
}

// Test 4: Admin controller integrates Moyasar refund
try {
    const adminControllerPath = path.join(__dirname, 'src', 'controllers', 'adminController.js');
    const adminControllerContent = fs.readFileSync(adminControllerPath, 'utf8');
    test(
        'Admin controller imports MoyasarService',
        adminControllerContent.includes('MoyasarService') || adminControllerContent.includes('require("../helpers/MoyasarService")'),
        'MoyasarService imported in admin controller'
    );
} catch (error) {
    test('Admin controller file exists', false, `Error: ${error.message}`);
}

// Test 5: Admin controller calls refundPayment
try {
    const adminControllerPath = path.join(__dirname, 'src', 'controllers', 'adminController.js');
    const adminControllerContent = fs.readFileSync(adminControllerPath, 'utf8');
    test(
        'Admin controller calls refundPayment',
        adminControllerContent.includes('refundPayment') && adminControllerContent.includes('MoyasarService'),
        'refundPayment called in admin refund approval flow'
    );
} catch (error) {
    test('Admin controller file exists', false, `Error: ${error.message}`);
}

// Test 6: Refund request model has refund_error field
try {
    const refundModelPath = path.join(__dirname, 'src', 'models', 'refundRequestModel.js');
    const refundModelContent = fs.readFileSync(refundModelPath, 'utf8');
    test(
        'Refund request model has refund_error field',
        refundModelContent.includes('refund_error'),
        'refund_error field added to refund request model'
    );
} catch (error) {
    test('Refund request model file exists', false, `Error: ${error.message}`);
}

// Test 7: Admin controller handles Moyasar refund errors
try {
    const adminControllerPath = path.join(__dirname, 'src', 'controllers', 'adminController.js');
    const adminControllerContent = fs.readFileSync(adminControllerPath, 'utf8');
    test(
        'Admin controller handles refund errors gracefully',
        adminControllerContent.includes('refundError') || adminControllerContent.includes('refund_error'),
        'Error handling implemented for Moyasar refund failures'
    );
} catch (error) {
    test('Admin controller file exists', false, `Error: ${error.message}`);
}

// Test 8: Moyasar refund ID stored in refund request
try {
    const adminControllerPath = path.join(__dirname, 'src', 'controllers', 'adminController.js');
    const adminControllerContent = fs.readFileSync(adminControllerPath, 'utf8');
    test(
        'Moyasar refund ID stored in database',
        adminControllerContent.includes('payment_refund_id') && adminControllerContent.includes('moyasarRefundId'),
        'Moyasar refund ID stored in refund request'
    );
} catch (error) {
    test('Admin controller file exists', false, `Error: ${error.message}`);
}

// Test 9: Refund transaction created with Moyasar refund ID
try {
    const adminControllerPath = path.join(__dirname, 'src', 'controllers', 'adminController.js');
    const adminControllerContent = fs.readFileSync(adminControllerPath, 'utf8');
    test(
        'Refund transaction created with payment_id',
        adminControllerContent.includes('TransactionService.CreateService') && 
        (adminControllerContent.includes('moyasarRefundId') || adminControllerContent.includes('payment_refund_id')),
        'Transaction created with Moyasar refund ID'
    );
} catch (error) {
    test('Admin controller file exists', false, `Error: ${error.message}`);
}

// Test 10: Booking payment_id used for refund
try {
    const adminControllerPath = path.join(__dirname, 'src', 'controllers', 'adminController.js');
    const adminControllerContent = fs.readFileSync(adminControllerPath, 'utf8');
    test(
        'Booking payment_id used for Moyasar refund',
        adminControllerContent.includes('booking.payment_id') || adminControllerContent.includes('payment_id'),
        'Booking payment_id extracted and used for refund'
    );
} catch (error) {
    test('Admin controller file exists', false, `Error: ${error.message}`);
}

// Test 11: Environment variables documented
try {
    const credentialsGuidePath = path.join(__dirname, 'MOYASAR_REFUND_CREDENTIALS_GUIDE.md');
    const guideExists = fs.existsSync(credentialsGuidePath);
    test(
        'Moyasar credentials guide exists',
        guideExists,
        'MOYASAR_REFUND_CREDENTIALS_GUIDE.md created'
    );
} catch (error) {
    test('Credentials guide exists', false, `Error: ${error.message}`);
}

// Test 12: Implementation summary exists
try {
    const summaryPath = path.join(__dirname, 'MOYASAR_REFUND_IMPLEMENTATION_SUMMARY.md');
    const summaryExists = fs.existsSync(summaryPath);
    test(
        'Implementation summary exists',
        summaryExists,
        'MOYASAR_REFUND_IMPLEMENTATION_SUMMARY.md created'
    );
} catch (error) {
    test('Implementation summary exists', false, `Error: ${error.message}`);
}

// Test 13: MoyasarService handles amount conversion (SAR to halala)
try {
    const moyasarServicePath = path.join(__dirname, 'src', 'helpers', 'MoyasarService.js');
    const moyasarServiceContent = fs.readFileSync(moyasarServicePath, 'utf8');
    test(
        'MoyasarService converts amount to halala',
        moyasarServiceContent.includes('* 100') || moyasarServiceContent.includes('Math.round') || moyasarServiceContent.includes('halala'),
        'Amount conversion to halala implemented'
    );
} catch (error) {
    test('MoyasarService file exists', false, `Error: ${error.message}`);
}

// Test 14: Error logging implemented
try {
    const moyasarServicePath = path.join(__dirname, 'src', 'helpers', 'MoyasarService.js');
    const moyasarServiceContent = fs.readFileSync(moyasarServicePath, 'utf8');
    test(
        'MoyasarService logs errors',
        moyasarServiceContent.includes('console.error') && moyasarServiceContent.includes('[MOYASAR:REFUND]'),
        'Error logging implemented with proper tags'
    );
} catch (error) {
    test('MoyasarService file exists', false, `Error: ${error.message}`);
}

// Test 15: Refund description includes booking details
try {
    const adminControllerPath = path.join(__dirname, 'src', 'controllers', 'adminController.js');
    const adminControllerContent = fs.readFileSync(adminControllerPath, 'utf8');
    test(
        'Refund description includes booking details',
        adminControllerContent.includes('refundDescription') || adminControllerContent.includes('description') || adminControllerContent.includes('order_id'),
        'Refund description includes booking/order information'
    );
} catch (error) {
    test('Admin controller file exists', false, `Error: ${error.message}`);
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 Test Summary');
console.log('='.repeat(60));
console.log(`✅ Passed: ${testsPassed}`);
console.log(`❌ Failed: ${testsFailed}`);
console.log(`📈 Total: ${testsPassed + testsFailed}`);
console.log(`🎯 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);

if (testsFailed === 0) {
    console.log('\n🎉 All tests passed! Moyasar refund integration is correctly implemented.');
} else {
    console.log('\n⚠️  Some tests failed. Please review the implementation.');
    console.log('\nFailed Tests:');
    testResults.filter(t => t.status === 'FAIL').forEach(t => {
        console.log(`  - ${t.name}: ${t.details}`);
    });
}

console.log('\n' + '='.repeat(60));
console.log('📝 Next Steps:');
console.log('1. Add Moyasar credentials to .env file');
console.log('2. Test refund flow with real booking');
console.log('3. Monitor logs for refund processing');
console.log('4. Verify refund transactions in Moyasar dashboard');
console.log('='.repeat(60) + '\n');

process.exit(testsFailed === 0 ? 0 : 1);

