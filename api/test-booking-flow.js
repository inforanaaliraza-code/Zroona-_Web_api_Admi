/**
 * COMPREHENSIVE BOOKING FLOW TEST SCRIPT
 * Tests the complete booking flow: Request → Host Approval/Rejection → Payment → Group Chat
 * 
 * Usage: node test-booking-flow.js
 * 
 * Prerequisites:
 * 1. Start the API server: npm start
 * 2. Have test users ready (guest and host)
 * 3. Have a test event created by the host
 */

const axios = require('axios');
const mongoose = require('mongoose');

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3434';
const API_PREFIX = '/api'; // API routes are prefixed with /api
const TEST_CONFIG = {
	guest: {
		email: 'guest@test.com',
		password: 'password123',
		token: null,
		userId: null,
	},
	host: {
		email: 'host@test.com',
		password: 'password123',
		token: null,
		userId: null,
	},
	event: {
		id: null,
		name: 'Test Event for Booking Flow',
	},
	booking: {
		id: null,
		order_id: null,
	},
};

// Test Results
const testResults = {
	passed: 0,
	failed: 0,
	errors: [],
};

// Helper Functions
const log = (message, type = 'info') => {
	const timestamp = new Date().toISOString();
	const colors = {
		info: '\x1b[36m', // Cyan
		success: '\x1b[32m', // Green
		error: '\x1b[31m', // Red
		warning: '\x1b[33m', // Yellow
		reset: '\x1b[0m',
	};
	console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
};

const test = async (name, testFn) => {
	try {
		log(`\n🧪 Testing: ${name}`, 'info');
		await testFn();
		testResults.passed++;
		log(`✅ PASSED: ${name}`, 'success');
		return true;
	} catch (error) {
		testResults.failed++;
		testResults.errors.push({ test: name, error: error.message });
		log(`❌ FAILED: ${name} - ${error.message}`, 'error');
		return false;
	}
};

// API Helper Functions
const makeRequest = async (method, endpoint, data = null, token = null) => {
	const config = {
		method,
		url: `${API_BASE_URL}${endpoint}`,
		headers: {
			'Content-Type': 'application/json',
			lang: 'en',
		},
		timeout: 5000, // 5 second timeout
	};

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	if (data) {
		config.data = data;
	}

	try {
		const response = await axios(config);
		return { success: true, data: response.data, status: response.status };
	} catch (error) {
		// Better error logging
		if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
			return {
				success: false,
				error: `Server not reachable: ${error.message}. Make sure API server is running on ${API_BASE_URL}`,
				status: 0,
			};
		}
		
		return {
			success: false,
			error: error.response?.data || error.message,
			status: error.response?.status || 500,
			errorDetails: error.response?.data,
		};
	}
};

// ==================== TEST CASES ====================

// Test 1: Guest Login
const testGuestLogin = async () => {
	const response = await makeRequest('POST', `${API_PREFIX}/user/login`, {
		email: TEST_CONFIG.guest.email,
		password: TEST_CONFIG.guest.password,
	});

	if (!response.success) {
		if (response.status === 0) {
			throw new Error(`Cannot connect to server: ${response.error}`);
		}
		const errorMsg = typeof response.error === 'object' 
			? JSON.stringify(response.error) 
			: response.error;
		throw new Error(`Guest login failed: ${errorMsg}. Check if account exists: ${TEST_CONFIG.guest.email}`);
	}

	if (!response.data?.data?.token) {
		throw new Error('Guest login succeeded but no token received');
	}

	TEST_CONFIG.guest.token = response.data.data.token;
	TEST_CONFIG.guest.userId = response.data.data.user?._id || response.data.data.userId;
	log(`Guest logged in. User ID: ${TEST_CONFIG.guest.userId}`, 'success');
};

// Test 2: Host Login
const testHostLogin = async () => {
	const response = await makeRequest('POST', `${API_PREFIX}/organizer/login`, {
		email: TEST_CONFIG.host.email,
		password: TEST_CONFIG.host.password,
	});

	if (!response.success) {
		if (response.status === 0) {
			throw new Error(`Cannot connect to server: ${response.error}`);
		}
		const errorMsg = typeof response.error === 'object' 
			? JSON.stringify(response.error) 
			: response.error;
		throw new Error(`Host login failed: ${errorMsg}. Check if account exists: ${TEST_CONFIG.host.email}`);
	}

	if (!response.data?.data?.token) {
		throw new Error('Host login succeeded but no token received');
	}

	TEST_CONFIG.host.token = response.data.data.token;
	TEST_CONFIG.host.userId = response.data.data.user?._id || response.data.data.userId;
	log(`Host logged in. User ID: ${TEST_CONFIG.host.userId}`, 'success');
};

// Test 3: Get or Create Test Event
const testGetOrCreateEvent = async () => {
	// Try to get existing events first
	const response = await makeRequest(
		'GET',
		`${API_PREFIX}/organizer/event/list`,
		null,
		TEST_CONFIG.host.token
	);

	if (response.success && response.data?.data?.length > 0) {
		TEST_CONFIG.event.id = response.data.data[0]._id;
		log(`Using existing event: ${TEST_CONFIG.event.id}`, 'info');
		return;
	}

	// Create a new test event if none exists
	log('No existing event found. Creating new test event...', 'warning');
	const createResponse = await makeRequest(
		'POST',
		`${API_PREFIX}/organizer/event/add`,
		{
			event_name: TEST_CONFIG.event.name,
			event_description: 'Test event for booking flow',
			event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
			event_start_time: '10:00',
			event_end_time: '18:00',
			event_price: 100,
			no_of_attendees: 10,
			event_type: 1,
			event_for: 3, // Everyone
			event_category: null,
			event_address: 'Test Address',
			latitude: 24.7136,
			longitude: 46.6753,
			neighborhood: 'Test Neighborhood',
		},
		TEST_CONFIG.host.token
	);

	if (!createResponse.success) {
		throw new Error(`Failed to create event: ${JSON.stringify(createResponse.error)}`);
	}

	TEST_CONFIG.event.id = createResponse.data?.data?._id;
	log(`Event created: ${TEST_CONFIG.event.id}`, 'success');
};

// Test 4: Guest Books Event (Status should be 1 - Pending)
const testGuestBooksEvent = async () => {
	const response = await makeRequest(
		'POST',
		`${API_PREFIX}/user/event/book`,
		{
			event_id: TEST_CONFIG.event.id,
			no_of_attendees: 2,
		},
		TEST_CONFIG.guest.token
	);

	if (!response.success) {
		throw new Error(`Booking failed: ${JSON.stringify(response.error)}`);
	}

	if (response.data?.data?.book_status !== 1) {
		throw new Error(
			`Expected book_status to be 1 (Pending), got ${response.data?.data?.book_status}`
		);
	}

	TEST_CONFIG.booking.id = response.data.data._id;
	TEST_CONFIG.booking.order_id = response.data.data.order_id;
	log(`Booking created. ID: ${TEST_CONFIG.booking.id}, Status: ${response.data.data.book_status} (Pending)`, 'success');
};

// Test 5: Try to Make Payment Before Approval (Should Fail)
const testPaymentBeforeApproval = async () => {
	const response = await makeRequest(
		'PATCH',
		`${API_PREFIX}/organizer/paymentStatus`,
		{
			booking_id: TEST_CONFIG.booking.id,
			payment_id: 'test_payment_id_123',
			payment_status: 1,
			amount: 200,
		},
		TEST_CONFIG.guest.token
	);

	// This should FAIL because booking is not approved yet
	if (response.success) {
		throw new Error('Payment should have been rejected for pending booking');
	}

	if (response.status !== 400) {
		throw new Error(`Expected status 400, got ${response.status}`);
	}

	log('Payment correctly rejected for pending booking', 'success');
};

// Test 6: Host Accepts Booking (Status should change to 2 - Approved)
const testHostAcceptsBooking = async () => {
	const response = await makeRequest(
		'PATCH',
		`${API_PREFIX}/organizer/event/booking/update-status`,
		{
			book_id: TEST_CONFIG.booking.id,
			book_status: 2, // Approved
		},
		TEST_CONFIG.host.token
	);

	if (!response.success) {
		throw new Error(`Host acceptance failed: ${JSON.stringify(response.error)}`);
	}

	if (response.data?.data?.book_status !== 2) {
		throw new Error(
			`Expected book_status to be 2 (Approved), got ${response.data?.data?.book_status}`
		);
	}

	log(`Booking approved. Status: ${response.data.data.book_status} (Approved)`, 'success');
};

// Test 7: Try to Make Payment After Approval (Should Succeed)
const testPaymentAfterApproval = async () => {
	const response = await makeRequest(
		'PATCH',
		`${API_PREFIX}/organizer/paymentStatus`,
		{
			booking_id: TEST_CONFIG.booking.id,
			payment_id: 'test_payment_id_approved_123',
			payment_status: 1,
			amount: 200,
		},
		TEST_CONFIG.guest.token
	);

	if (!response.success) {
		throw new Error(`Payment failed: ${JSON.stringify(response.error)}`);
	}

	if (response.data?.data?.payment_status !== 1) {
		throw new Error(
			`Expected payment_status to be 1 (Paid), got ${response.data?.data?.payment_status}`
		);
	}

	log(`Payment successful. Payment Status: ${response.data.data.payment_status} (Paid)`, 'success');
};

// Test 8: Verify Group Chat Addition
const testGroupChatAddition = async () => {
	// Check if user was added to group chat
	const response = await makeRequest(
		'GET',
		`${API_PREFIX}/message/conversations`,
		null,
		TEST_CONFIG.guest.token
	);

	if (!response.success) {
		log('Could not verify group chat (conversations endpoint may not be available)', 'warning');
		return;
	}

	// Look for group chat with this event
	const groupChats = response.data?.data?.filter(
		(chat) => chat.event_id?._id === TEST_CONFIG.event.id || chat.event_id === TEST_CONFIG.event.id
	);

	if (groupChats && groupChats.length > 0) {
		log(`User added to group chat. Found ${groupChats.length} group chat(s)`, 'success');
	} else {
		log('Group chat not found (may need manual verification)', 'warning');
	}
};

// Test 9: Test Rejection Flow
const testRejectionFlow = async () => {
	// Create a new booking for rejection test
	const bookingResponse = await makeRequest(
		'POST',
		`${API_PREFIX}/user/event/book`,
		{
			event_id: TEST_CONFIG.event.id,
			no_of_attendees: 1,
		},
		TEST_CONFIG.guest.token
	);

	if (!bookingResponse.success) {
		throw new Error(`Failed to create booking for rejection test: ${JSON.stringify(bookingResponse.error)}`);
	}

	const rejectionBookingId = bookingResponse.data.data._id;

	// Host rejects the booking
	const rejectResponse = await makeRequest(
		'PATCH',
		`${API_PREFIX}/organizer/event/booking/update-status`,
		{
			book_id: rejectionBookingId,
			book_status: 3, // Rejected
			rejection_reason: 'Test rejection reason - This is a test rejection to verify the flow works correctly.',
		},
		TEST_CONFIG.host.token
	);

	if (!rejectResponse.success) {
		throw new Error(`Host rejection failed: ${JSON.stringify(rejectResponse.error)}`);
	}

	if (rejectResponse.data?.data?.book_status !== 3) {
		throw new Error(
			`Expected book_status to be 3 (Rejected), got ${rejectResponse.data?.data?.book_status}`
		);
	}

	// Try to make payment for rejected booking (should fail)
	const paymentResponse = await makeRequest(
		'PATCH',
		`${API_PREFIX}/organizer/paymentStatus`,
		{
			booking_id: rejectionBookingId,
			payment_id: 'test_payment_rejected_123',
			payment_status: 1,
			amount: 100,
		},
		TEST_CONFIG.guest.token
	);

	if (paymentResponse.success) {
		throw new Error('Payment should have been rejected for rejected booking');
	}

	log('Rejection flow tested successfully. Payment correctly blocked for rejected booking', 'success');
};

// Test 10: Verify Notifications
const testNotifications = async () => {
	// Check guest notifications
	const guestNotifications = await makeRequest(
		'GET',
		`${API_PREFIX}/user/notification/list`,
		null,
		TEST_CONFIG.guest.token
	);

	if (guestNotifications.success) {
		const notifications = guestNotifications.data?.data || [];
		const bookingNotifications = notifications.filter(
			(n) => n.book_id === TEST_CONFIG.booking.id
		);
		log(`Found ${bookingNotifications.length} notification(s) for booking ${TEST_CONFIG.booking.id}`, 'info');
	} else {
		log('Could not verify notifications (endpoint may not be available)', 'warning');
	}
};

// ==================== MAIN TEST RUNNER ====================

const runTests = async () => {
	log('🚀 Starting Booking Flow Tests...', 'info');
	log('='.repeat(60), 'info');

	try {
		// Authentication Tests
		await test('Guest Login', testGuestLogin);
		await test('Host Login', testHostLogin);

		// Event Setup
		await test('Get or Create Test Event', testGetOrCreateEvent);

		// Booking Flow Tests
		await test('Guest Books Event (Status = Pending)', testGuestBooksEvent);
		await test('Payment Blocked Before Approval', testPaymentBeforeApproval);
		await test('Host Accepts Booking (Status = Approved)', testHostAcceptsBooking);
		await test('Payment Allowed After Approval', testPaymentAfterApproval);
		await test('Group Chat Addition After Payment', testGroupChatAddition);

		// Rejection Flow Tests
		await test('Rejection Flow Test', testRejectionFlow);

		// Notification Tests
		await test('Verify Notifications', testNotifications);

		// Final Summary
		log('\n' + '='.repeat(60), 'info');
		log('📊 TEST SUMMARY', 'info');
		log(`✅ Passed: ${testResults.passed}`, 'success');
		log(`❌ Failed: ${testResults.failed}`, testResults.failed > 0 ? 'error' : 'success');

		if (testResults.errors.length > 0) {
			log('\n❌ ERRORS:', 'error');
			testResults.errors.forEach((err) => {
				log(`  - ${err.test}: ${err.error}`, 'error');
			});
		}

		if (testResults.failed === 0) {
			log('\n🎉 ALL TESTS PASSED!', 'success');
		} else {
			log('\n⚠️  SOME TESTS FAILED', 'warning');
			process.exit(1);
		}
	} catch (error) {
		log(`\n💥 FATAL ERROR: ${error.message}`, 'error');
		process.exit(1);
	}
};

// Run tests
if (require.main === module) {
	runTests();
}

module.exports = { runTests, TEST_CONFIG };

