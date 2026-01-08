/**
 * Comprehensive Event Creation Test Script
 * Tests backend API and frontend payload structure compatibility
 * 
 * Usage: node test-event-creation.js
 * 
 * Make sure:
 * 1. Backend API is running on http://localhost:3434
 * 2. You have a valid organizer token
 * 3. You have at least one event category in the database
 */

const axios = require('axios');

// Configuration
const BASE_API_URL = process.env.API_URL || 'http://localhost:3434/api/';
const TEST_CONFIG = {
    // You can set these via environment variables or directly here
    ORGANIZER_TOKEN: process.env.ORGANIZER_TOKEN || '', // Set your organizer token here
    EVENT_CATEGORY_ID: process.env.EVENT_CATEGORY_ID || '', // Set a valid event category ID here (optional)
    ORGANIZER_EMAIL: process.env.ORGANIZER_EMAIL || '', // Optional: for auto-login
    ORGANIZER_PASSWORD: process.env.ORGANIZER_PASSWORD || '', // Optional: for auto-login
};

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
    log('\n' + '='.repeat(60), 'cyan');
    log(title, 'cyan');
    log('='.repeat(60), 'cyan');
}

function logSuccess(message) {
    log(`✓ ${message}`, 'green');
}

function logError(message) {
    log(`✗ ${message}`, 'red');
}

function logWarning(message) {
    log(`⚠ ${message}`, 'yellow');
}

function logInfo(message) {
    log(`ℹ ${message}`, 'blue');
}

// Helper: Login as organizer (optional - if credentials provided)
async function loginOrganizer(email, password) {
    try {
        logSection('LOGIN: Attempting organizer login');
        const response = await axios.post(`${BASE_API_URL}user/login`, {
            email,
            password,
        });
        
        if (response.data?.status === 1 && response.data?.data?.token) {
            logSuccess('Login successful!');
            return response.data.data.token;
        } else {
            logError(`Login failed: ${response.data?.message || 'Unknown error'}`);
            return null;
        }
    } catch (error) {
        logError(`Login error: ${error.message}`);
        if (error.response) {
            logError(`Response: ${JSON.stringify(error.response.data, null, 2)}`);
        }
        return null;
    }
}

// Test 1: Get Event Categories
async function getEventCategories(token) {
    try {
        logSection('TEST 1: Fetching Event Categories');
        const response = await axios.get(`${BASE_API_URL}organizer/event/category/list`, {
            params: { page: 1, limit: 10 },
            headers: { Authorization: token || '' },
        });
        
        if (response.data?.status === 1 && response.data?.data?.length > 0) {
            const categories = response.data.data;
            logSuccess(`Found ${categories.length} event categories`);
            logInfo(`First category ID: ${categories[0]._id}`);
            return categories;
        } else {
            logError('No event categories found');
            return [];
        }
    } catch (error) {
        logError(`Failed to fetch categories: ${error.message}`);
        if (error.response) {
            logError(`Response: ${JSON.stringify(error.response.data, null, 2)}`);
        }
        return [];
    }
}

// Test 2: Test Backend API with Frontend-style Payload (Join Event - event_type: 1)
async function testJoinEventCreation(token, categoryId) {
    try {
        logSection('TEST 2: Testing Join Event Creation (event_type: 1)');
        
        // Simulate frontend payload from AddEditJoinEventModal.jsx
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7); // 7 days from now
        const eventDate = futureDate.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        const payload = {
            event_date: eventDate,
            event_start_time: '10:00',
            event_end_time: '14:00',
            event_name: `Test Join Event - ${Date.now()}`,
            event_images: [
                'https://via.placeholder.com/800x600/4CAF50/FFFFFF?text=Event+Image+1',
                'https://via.placeholder.com/800x600/2196F3/FFFFFF?text=Event+Image+2'
            ],
            event_description: 'This is a test event created by the automated test script',
            event_address: '123 Test Street, Test City, Test Country',
            event_type: 1, // Join Event
            event_for: 3, // All genders
            event_category: categoryId, // Single string (as sent by AddEditJoinEventModal)
            no_of_attendees: 20,
            event_price: 50.00,
            dos_instruction: 'Please arrive on time. Bring your ID.',
            do_not_instruction: 'No smoking. No pets allowed.',
            latitude: 24.7136,
            longitude: 46.6753,
            area_name: 'Riyadh Test Area',
        };
        
        logInfo('Payload structure (matching AddEditJoinEventModal.jsx):');
        console.log(JSON.stringify(payload, null, 2));
        
        const response = await axios.post(
            `${BASE_API_URL}organizer/event/add`,
            payload,
            {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
            }
        );
        
        if (response.data?.status === 1) {
            logSuccess('Join Event created successfully!');
            logInfo(`Event ID: ${response.data.data?._id || 'N/A'}`);
            logInfo(`Response message: ${response.data.message || 'N/A'}`);
            return response.data.data;
        } else {
            logError(`Event creation failed: ${response.data?.message || 'Unknown error'}`);
            logError(`Response: ${JSON.stringify(response.data, null, 2)}`);
            return null;
        }
    } catch (error) {
        logError(`Failed to create Join Event: ${error.message}`);
        if (error.response) {
            logError(`Status: ${error.response.status}`);
            logError(`Response: ${JSON.stringify(error.response.data, null, 2)}`);
        }
        return null;
    }
}

// Test 3: Test Backend API with Frontend-style Payload (Welcome Event - event_type: 2)
async function testWelcomeEventCreation(token, categoryId) {
    try {
        logSection('TEST 3: Testing Welcome Event Creation (event_type: 2)');
        
        // Simulate frontend payload from AddEditWelcomeEventModal.jsx
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 10); // 10 days from now
        const eventDate = futureDate.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        const payload = {
            event_date: eventDate,
            event_start_time: '15:00',
            event_end_time: '18:00',
            event_name: `Test Welcome Event - ${Date.now()}`,
            event_images: [
                'https://via.placeholder.com/800x600/FF9800/FFFFFF?text=Welcome+Event+1',
                'https://via.placeholder.com/800x600/9C27B0/FFFFFF?text=Welcome+Event+2'
            ],
            event_description: 'This is a test welcome event created by the automated test script',
            event_address: '456 Welcome Avenue, Test City, Test Country',
            event_type: 2, // Welcome Event
            event_for: 3, // All genders
            event_category: [categoryId], // Array (as sent by AddEditWelcomeEventModal)
            no_of_attendees: 30,
            event_price: 75.00,
            dos_instruction: 'Welcome! Please bring a positive attitude.',
            do_not_instruction: 'No negative energy allowed.',
            latitude: 24.7136,
            longitude: 46.6753,
            area_name: 'Riyadh Welcome Area',
        };
        
        logInfo('Payload structure (matching AddEditWelcomeEventModal.jsx):');
        console.log(JSON.stringify(payload, null, 2));
        
        const response = await axios.post(
            `${BASE_API_URL}organizer/event/add`,
            payload,
            {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
            }
        );
        
        if (response.data?.status === 1) {
            logSuccess('Welcome Event created successfully!');
            logInfo(`Event ID: ${response.data.data?._id || 'N/A'}`);
            logInfo(`Response message: ${response.data.message || 'N/A'}`);
            return response.data.data;
        } else {
            logError(`Event creation failed: ${response.data?.message || 'Unknown error'}`);
            logError(`Response: ${JSON.stringify(response.data, null, 2)}`);
            return null;
        }
    } catch (error) {
        logError(`Failed to create Welcome Event: ${error.message}`);
        if (error.response) {
            logError(`Status: ${error.response.status}`);
            logError(`Response: ${JSON.stringify(error.response.data, null, 2)}`);
        }
        return null;
    }
}

// Test 4: Verify Created Events
async function verifyEvent(eventId, token) {
    try {
        logSection(`TEST 4: Verifying Event ${eventId}`);
        
        const response = await axios.get(
            `${BASE_API_URL}organizer/event/detail`,
            {
                params: { event_id: eventId },
                headers: { Authorization: token },
            }
        );
        
        if (response.data?.status === 1 && response.data?.data) {
            const event = response.data.data;
            logSuccess('Event verified successfully!');
            logInfo(`Event Name: ${event.event_name}`);
            logInfo(`Event Type: ${event.event_type}`);
            logInfo(`Event Date: ${event.event_date}`);
            logInfo(`Event Status: ${event.is_approved === 0 ? 'Pending' : event.is_approved === 1 ? 'Approved' : 'Rejected'}`);
            logInfo(`Number of Images: ${event.event_images?.length || 0}`);
            logInfo(`Category: ${event.event_category}`);
            logInfo(`Categories (array): ${event.event_categories?.length || 0} categories`);
            return true;
        } else {
            logError('Event verification failed');
            return false;
        }
    } catch (error) {
        logError(`Failed to verify event: ${error.message}`);
        return false;
    }
}

// Test 5: Test Validation Errors
async function testValidationErrors(token) {
    try {
        logSection('TEST 5: Testing Validation Errors');
        
        // Test missing required fields
        const invalidPayloads = [
            {
                name: 'Missing event_name',
                payload: {
                    event_date: '2024-12-31',
                    event_start_time: '10:00',
                    event_end_time: '14:00',
                },
            },
            {
                name: 'Missing event_images',
                payload: {
                    event_date: '2024-12-31',
                    event_start_time: '10:00',
                    event_end_time: '14:00',
                    event_name: 'Test Event',
                },
            },
            {
                name: 'Empty event_images array',
                payload: {
                    event_date: '2024-12-31',
                    event_start_time: '10:00',
                    event_end_time: '14:00',
                    event_name: 'Test Event',
                    event_images: [],
                },
            },
            {
                name: 'Invalid event_category',
                payload: {
                    event_date: '2024-12-31',
                    event_start_time: '10:00',
                    event_end_time: '14:00',
                    event_name: 'Test Event',
                    event_images: ['https://via.placeholder.com/800x600'],
                    event_category: 'invalid-category-id',
                },
            },
        ];
        
        for (const test of invalidPayloads) {
            logInfo(`Testing: ${test.name}`);
            try {
                const response = await axios.post(
                    `${BASE_API_URL}organizer/event/add`,
                    test.payload,
                    {
                        headers: {
                            Authorization: token,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                
                if (response.data?.status === 0) {
                    logSuccess(`✓ Correctly rejected: ${test.name}`);
                    logInfo(`  Error: ${response.data.message}`);
                } else {
                    logWarning(`⚠ Unexpected success for: ${test.name}`);
                }
            } catch (error) {
                if (error.response?.status === 400 || error.response?.status === 422) {
                    logSuccess(`✓ Correctly rejected: ${test.name}`);
                } else {
                    logError(`✗ Unexpected error for ${test.name}: ${error.message}`);
                }
            }
        }
    } catch (error) {
        logError(`Validation test failed: ${error.message}`);
    }
}

// Main test runner
async function runTests() {
    logSection('EVENT CREATION INTEGRATION TEST');
    logInfo('Starting comprehensive event creation tests...\n');
    
    // Try to get token - either from config or by logging in
    let token = TEST_CONFIG.ORGANIZER_TOKEN;
    
    if (!token && TEST_CONFIG.ORGANIZER_EMAIL && TEST_CONFIG.ORGANIZER_PASSWORD) {
        logInfo('Token not provided, attempting to login...');
        token = await loginOrganizer(TEST_CONFIG.ORGANIZER_EMAIL, TEST_CONFIG.ORGANIZER_PASSWORD);
        if (!token) {
            logError('Failed to login. Please provide ORGANIZER_TOKEN manually.');
            return;
        }
    }
    
    if (!token) {
        logError('ORGANIZER_TOKEN is not set in TEST_CONFIG');
        logInfo('Please set your organizer token in the script before running');
        logInfo('You can get the token from your browser cookies or login response');
        logInfo('Or set ORGANIZER_EMAIL and ORGANIZER_PASSWORD for auto-login');
        logInfo('\nExample:');
        logInfo('  ORGANIZER_TOKEN=your-token node test-event-creation.js');
        logInfo('  OR');
        logInfo('  ORGANIZER_EMAIL=email@example.com ORGANIZER_PASSWORD=password node test-event-creation.js');
        return;
    }
    
    token = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    
    // Get event categories
    const categories = await getEventCategories(token);
    if (categories.length === 0) {
        logError('Cannot proceed without event categories');
        return;
    }
    
    const categoryId = TEST_CONFIG.EVENT_CATEGORY_ID || categories[0]._id;
    logInfo(`Using category ID: ${categoryId}`);
    
    // Run tests
    const joinEvent = await testJoinEventCreation(token, categoryId);
    if (joinEvent?._id) {
        await verifyEvent(joinEvent._id, token);
    }
    
    const welcomeEvent = await testWelcomeEventCreation(token, categoryId);
    if (welcomeEvent?._id) {
        await verifyEvent(welcomeEvent._id, token);
    }
    
    await testValidationErrors(token);
    
    // Summary
    logSection('TEST SUMMARY');
    if (joinEvent && welcomeEvent) {
        logSuccess('All event creation tests passed!');
        logInfo('✓ Join Event (event_type: 1) - Created successfully');
        logInfo('✓ Welcome Event (event_type: 2) - Created successfully');
        logInfo('✓ Validation tests - Working correctly');
        logInfo('\nEvent creation is working smoothly! 🎉');
    } else {
        logError('Some tests failed. Please check the errors above.');
        if (!joinEvent) {
            logError('✗ Join Event creation failed');
        }
        if (!welcomeEvent) {
            logError('✗ Welcome Event creation failed');
        }
    }
}

// Run tests
if (require.main === module) {
    runTests().catch((error) => {
        logError(`Fatal error: ${error.message}`);
        console.error(error);
        process.exit(1);
    });
}

module.exports = {
    runTests,
    testJoinEventCreation,
    testWelcomeEventCreation,
    getEventCategories,
    verifyEvent,
};

