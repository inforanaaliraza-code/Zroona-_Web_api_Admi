/**
 * QUICK BOOKING FLOW TEST
 * Simple test to verify key endpoints are working
 */

const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3434';

console.log('🧪 Quick Booking Flow Test\n');
console.log('Testing API endpoints...\n');

// Test 1: Check if server is running
async function testServerHealth() {
	try {
		// Try multiple endpoints to check if server is running
		const endpoints = ['/health', '/api/user/login', '/api/'];
		for (const endpoint of endpoints) {
			try {
				const response = await axios.get(`${API_BASE_URL}${endpoint}`, { timeout: 2000 });
				console.log(`✅ Server is running (checked via ${endpoint})`);
				return true;
			} catch (e) {
				// Continue to next endpoint
			}
		}
		// If all fail, try a simple connection test
		const response = await axios.get(`${API_BASE_URL}/api/`, { timeout: 2000 });
		console.log('✅ Server is running');
		return true;
	} catch (error) {
		if (error.code === 'ECONNREFUSED') {
			console.log('❌ Server is not running (connection refused)');
		} else {
			console.log('⚠️  Server might be running but /health endpoint not available');
		}
		return false;
	}
}

// Test 2: Check booking endpoint exists
async function testBookingEndpoint() {
	try {
		// This should fail with auth error, not 404
		const response = await axios.post(`${API_BASE_URL}/api/user/event/book`, {
			event_id: 'test',
			no_of_attendees: 1,
		}, { timeout: 3000 });
	} catch (error) {
		if (error.code === 'ECONNREFUSED') {
			console.log('❌ Cannot connect to server');
			return false;
		}
		if (error.response?.status === 401 || error.response?.status === 403) {
			console.log('✅ Booking endpoint exists (auth required)');
			return true;
		} else if (error.response?.status === 404) {
			console.log('❌ Booking endpoint not found (404)');
			return false;
		} else if (error.response?.status === 400 || error.response?.status === 500) {
			console.log('✅ Booking endpoint exists (returns validation error)');
			return true;
		} else {
			console.log('✅ Booking endpoint exists');
			return true;
		}
	}
}

// Test 3: Check payment endpoint exists
async function testPaymentEndpoint() {
	try {
		const response = await axios.post(`${API_BASE_URL}/api/user/payment/update`, {
			booking_id: 'test',
		}, { timeout: 3000 });
	} catch (error) {
		if (error.code === 'ECONNREFUSED') {
			console.log('❌ Cannot connect to server');
			return false;
		}
		if (error.response?.status === 400 || error.response?.status === 401) {
			console.log('✅ Payment endpoint exists');
			return true;
		} else if (error.response?.status === 404) {
			console.log('❌ Payment endpoint not found (404)');
			return false;
		} else if (error.response?.status === 500) {
			console.log('✅ Payment endpoint exists (returns server error)');
			return true;
		} else {
			console.log('✅ Payment endpoint exists');
			return true;
		}
	}
}

// Test 4: Check change status endpoint exists
async function testChangeStatusEndpoint() {
	try {
		const response = await axios.patch(`${API_BASE_URL}/api/organizer/event/booking/update-status`, {
			book_id: 'test',
			book_status: 2,
		}, { timeout: 3000 });
	} catch (error) {
		if (error.code === 'ECONNREFUSED') {
			console.log('❌ Cannot connect to server');
			return false;
		}
		if (error.response?.status === 400 || error.response?.status === 401) {
			console.log('✅ Change status endpoint exists');
			return true;
		} else if (error.response?.status === 404) {
			console.log('❌ Change status endpoint not found (404)');
			return false;
		} else if (error.response?.status === 500) {
			console.log('✅ Change status endpoint exists (returns server error)');
			return true;
		} else {
			console.log('✅ Change status endpoint exists');
			return true;
		}
	}
}

async function runQuickTests() {
	const results = {
		server: await testServerHealth(),
		booking: await testBookingEndpoint(),
		payment: await testPaymentEndpoint(),
		changeStatus: await testChangeStatusEndpoint(),
	};

	console.log('\n📊 Results:');
	console.log(`Server: ${results.server ? '✅' : '❌'}`);
	console.log(`Booking Endpoint: ${results.booking ? '✅' : '❌'}`);
	console.log(`Payment Endpoint: ${results.payment ? '✅' : '❌'}`);
	console.log(`Change Status Endpoint: ${results.changeStatus ? '✅' : '❌'}`);

	const allPassed = Object.values(results).every((r) => r === true);
	
	if (allPassed) {
		console.log('\n✅ All endpoints are accessible!');
		console.log('💡 Run full test: node test-booking-flow.js');
	} else {
		console.log('\n❌ Some endpoints are not accessible');
		console.log('💡 Make sure API server is running: npm start');
	}
}

runQuickTests();

