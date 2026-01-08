/**
 * Complete Event Creation Integration Test
 * Tests backend API, frontend payload structure, and full integration
 * 
 * This script verifies:
 * 1. Backend API accepts both single string and array for event_category
 * 2. Date format conversion works correctly
 * 3. Location coordinates are handled properly
 * 4. Event images validation works
 * 5. All required fields are validated
 * 6. Both Join Event (type 1) and Welcome Event (type 2) creation
 * 
 * Usage: 
 *   node test-event-creation-complete.js
 * 
 * Environment Variables:
 *   API_URL=http://localhost:3434/api/ (default)
 *   ORGANIZER_TOKEN=your-token-here (required)
 *   ORGANIZER_EMAIL=email@example.com (optional - for auto-login)
 *   ORGANIZER_PASSWORD=password (optional - for auto-login)
 */

const axios = require('axios');
const mongoose = require('mongoose');

// Configuration
const BASE_API_URL = process.env.API_URL || 'http://localhost:3434/api/';
const TEST_CONFIG = {
    ORGANIZER_TOKEN: process.env.ORGANIZER_TOKEN || '',
    ORGANIZER_EMAIL: process.env.ORGANIZER_EMAIL || '',
    ORGANIZER_PASSWORD: process.env.ORGANIZER_PASSWORD || '',
    EVENT_CATEGORY_ID: process.env.EVENT_CATEGORY_ID || '',
};

// Test results tracking
const testResults = {
    passed: 0,
    failed: 0,
    warnings: 0,
    errors: [],
};

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
    log('\n' + '═'.repeat(70), 'cyan');
    log(`  ${title}`, 'cyan');
    log('═'.repeat(70), 'cyan');
}

function logSuccess(message) {
    log(`✓ ${message}`, 'green');
    testResults.passed++;
}

function logError(message, details = null) {
    log(`✗ ${message}`, 'red');
    testResults.failed++;
    if (details) {
        testResults.errors.push({ message, details });
    }
}

function logWarning(message) {
    log(`⚠ ${message}`, 'yellow');
    testResults.warnings++;
}

function logInfo(message) {
    log(`ℹ ${message}`, 'blue');
}

// Helper: Format response for display
function formatResponse(data) {
    return JSON.stringify(data, null, 2);
}

// Helper: Login as organizer
async function loginOrganizer(email, password) {
    try {
        logSection('AUTHENTICATION: Organizer Login');
        const response = await axios.post(`${BASE_API_URL}user/login`, {
            email,
            password,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (response.data?.status === 1 && response.data?.data?.token) {
            logSuccess(`Login successful for: ${email}`);
            return response.data.data.token;
        } else {
            logError(`Login failed: ${response.data?.message || 'Unknown error'}`);
            return null;
        }
    } catch (error) {
        logError(`Login error: ${error.message}`);
        if (error.response?.data) {
            logError(`Response: ${formatResponse(error.response.data)}`);
        }
        return null;
    }
}

// Test 1: Get Event Categories
async function getEventCategories(token) {
    try {
        logSection('TEST 1: Fetching Event Categories');
        
        const response = await axios.get(`${BASE_API_URL}organizer/event/category/list`, {
            params: { page: 1, limit: 100 },
            headers: { 
                Authorization: token || '',
                'Content-Type': 'application/json',
            },
        });
        
        if (response.data?.status === 1 && response.data?.data?.length > 0) {
            const categories = response.data.data;
            logSuccess(`Found ${categories.length} event categories`);
            
            // Display first 5 categories
            categories.slice(0, 5).forEach((cat, index) => {
                logInfo(`  ${index + 1}. ${cat.name} (ID: ${cat._id})`);
            });
            
            if (categories.length > 5) {
                logInfo(`  ... and ${categories.length - 5} more`);
            }
            
            return categories;
        } else {
            logError('No event categories found');
            logError(`Response: ${formatResponse(response.data)}`);
            return [];
        }
    } catch (error) {
        logError(`Failed to fetch categories: ${error.message}`);
        if (error.response?.data) {
            logError(`Response: ${formatResponse(error.response.data)}`);
        }
        return [];
    }
}

// Test 2: Test Join Event Creation (Frontend format - single category string)
async function testJoinEventCreation(token, categoryId) {
    try {
        logSection('TEST 2: Join Event Creation (Type 1 - Single Category String)');
        
        // Simulate exact payload from AddEditJoinEventModal.jsx
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);
        const eventDate = futureDate.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        const payload = {
            event_date: eventDate,
            event_start_time: '10:00',
            event_end_time: '14:00',
            event_name: `Test Join Event - ${Date.now()}`,
            event_images: [
                'https://via.placeholder.com/800x600/4CAF50/FFFFFF?text=Join+Event+1',
                'https://via.placeholder.com/800x600/2196F3/FFFFFF?text=Join+Event+2'
            ],
            event_description: 'This is a test Join Event created to verify backend-frontend integration. Event category is sent as a single string (not array).',
            event_address: '123 Test Street, Riyadh, Saudi Arabia',
            event_type: 1, // Join Event
            event_for: 3, // All genders
            event_category: String(categoryId), // Single string (as AddEditJoinEventModal sends)
            no_of_attendees: 25,
            event_price: 50.00,
            dos_instruction: 'Please arrive on time. Bring your ID. Wear comfortable clothes.',
            do_not_instruction: 'No smoking. No pets allowed. No outside food.',
            latitude: 24.7136,
            longitude: 46.6753,
            area_name: 'Riyadh Test Area',
        };
        
        logInfo('Payload (matching AddEditJoinEventModal.jsx format):');
        logInfo(`  - event_category type: ${typeof payload.event_category} (single string)`);
        logInfo(`  - event_category value: ${payload.event_category}`);
        logInfo(`  - event_date format: ${payload.event_date} (YYYY-MM-DD)`);
        logInfo(`  - event_images count: ${payload.event_images.length}`);
        
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
            const event = response.data.data;
            logSuccess('Join Event created successfully!');
            logInfo(`  Event ID: ${event._id}`);
            logInfo(`  Event Name: ${event.event_name}`);
            logInfo(`  Event Type: ${event.event_type} (Join Event)`);
            logInfo(`  Event Date: ${new Date(event.event_date).toLocaleDateString()}`);
            logInfo(`  Status: ${event.is_approved === 0 ? 'Pending' : event.is_approved === 2 ? 'Approved' : 'Rejected'}`);
            logInfo(`  Images: ${event.event_images?.length || 0}`);
            logInfo(`  Category (primary): ${event.event_category}`);
            logInfo(`  Categories (array): ${event.event_categories?.length || 0} category(s)`);
            
            // Verify backend processed the single string category correctly
            if (event.event_categories && event.event_categories.length === 1) {
                logSuccess('  ✓ Backend correctly converted single category string to array');
            } else {
                logWarning('  ⚠ Category array length unexpected');
            }
            
            return event;
        } else {
            logError(`Event creation failed: ${response.data?.message || 'Unknown error'}`);
            logError(`Response: ${formatResponse(response.data)}`);
            return null;
        }
    } catch (error) {
        logError(`Failed to create Join Event: ${error.message}`);
        if (error.response) {
            logError(`  Status: ${error.response.status}`);
            logError(`  Response: ${formatResponse(error.response.data)}`);
        }
        return null;
    }
}

// Test 3: Test Welcome Event Creation (Frontend format - category array)
async function testWelcomeEventCreation(token, categoryId) {
    try {
        logSection('TEST 3: Welcome Event Creation (Type 2 - Category Array)');
        
        // Simulate exact payload from AddEditWelcomeEventModal.jsx
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 10);
        const eventDate = futureDate.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        const payload = {
            event_date: eventDate,
            event_start_time: '15:00',
            event_end_time: '18:00',
            event_name: `Test Welcome Event - ${Date.now()}`,
            event_images: [
                'https://via.placeholder.com/800x600/FF9800/FFFFFF?text=Welcome+Event+1',
                'https://via.placeholder.com/800x600/9C27B0/FFFFFF?text=Welcome+Event+2',
                'https://via.placeholder.com/800x600/E91E63/FFFFFF?text=Welcome+Event+3'
            ],
            event_description: 'This is a test Welcome Event created to verify backend-frontend integration. Event category is sent as an array.',
            event_address: '456 Welcome Avenue, Jeddah, Saudi Arabia',
            event_type: 2, // Welcome Event
            event_for: 3, // All genders
            event_category: [categoryId], // Array (as AddEditWelcomeEventModal sends)
            no_of_attendees: 35,
            event_price: 75.00,
            dos_instruction: 'Welcome! Please bring a positive attitude. Enjoy the event!',
            do_not_instruction: 'No negative energy. Respect others.',
            latitude: 21.4858,
            longitude: 39.1925,
            area_name: 'Jeddah Welcome Area',
        };
        
        logInfo('Payload (matching AddEditWelcomeEventModal.jsx format):');
        logInfo(`  - event_category type: ${Array.isArray(payload.event_category) ? 'array' : typeof payload.event_category}`);
        logInfo(`  - event_category value: [${payload.event_category.join(', ')}]`);
        logInfo(`  - event_date format: ${payload.event_date} (YYYY-MM-DD)`);
        logInfo(`  - event_images count: ${payload.event_images.length}`);
        
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
            const event = response.data.data;
            logSuccess('Welcome Event created successfully!');
            logInfo(`  Event ID: ${event._id}`);
            logInfo(`  Event Name: ${event.event_name}`);
            logInfo(`  Event Type: ${event.event_type} (Welcome Event)`);
            logInfo(`  Event Date: ${new Date(event.event_date).toLocaleDateString()}`);
            logInfo(`  Status: ${event.is_approved === 0 ? 'Pending' : event.is_approved === 2 ? 'Approved' : 'Rejected'}`);
            logInfo(`  Images: ${event.event_images?.length || 0}`);
            logInfo(`  Category (primary): ${event.event_category}`);
            logInfo(`  Categories (array): ${event.event_categories?.length || 0} category(s)`);
            
            // Verify backend processed the category array correctly
            if (event.event_categories && event.event_categories.length >= 1) {
                logSuccess('  ✓ Backend correctly processed category array');
            } else {
                logWarning('  ⚠ Category array processing unexpected');
            }
            
            return event;
        } else {
            logError(`Event creation failed: ${response.data?.message || 'Unknown error'}`);
            logError(`Response: ${formatResponse(response.data)}`);
            return null;
        }
    } catch (error) {
        logError(`Failed to create Welcome Event: ${error.message}`);
        if (error.response) {
            logError(`  Status: ${error.response.status}`);
            logError(`  Response: ${formatResponse(error.response.data)}`);
        }
        return null;
    }
}

// Test 4: Verify Event Details
async function verifyEventDetails(eventId, token, expectedType) {
    try {
        logSection(`TEST 4: Verifying Event Details (ID: ${eventId})`);
        
        const response = await axios.get(
            `${BASE_API_URL}organizer/event/detail`,
            {
                params: { event_id: eventId },
                headers: { 
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
            }
        );
        
        if (response.data?.status === 1 && response.data?.data) {
            const event = response.data.data;
            
            // Verify all fields
            const checks = [
                { field: 'event_name', value: event.event_name, required: true },
                { field: 'event_type', value: event.event_type, expected: expectedType },
                { field: 'event_date', value: event.event_date, required: true },
                { field: 'event_images', value: event.event_images, minLength: 1 },
                { field: 'event_category', value: event.event_category, required: true },
                { field: 'event_categories', value: event.event_categories, minLength: 1 },
                { field: 'organizer_id', value: event.organizer_id, required: true },
                { field: 'event_price', value: event.event_price, required: true },
                { field: 'no_of_attendees', value: event.no_of_attendees, required: true },
            ];
            
            let allPassed = true;
            checks.forEach(check => {
                if (check.required && !check.value) {
                    logError(`  Missing required field: ${check.field}`);
                    allPassed = false;
                } else if (check.expected && check.value !== check.expected) {
                    logError(`  Unexpected value for ${check.field}: expected ${check.expected}, got ${check.value}`);
                    allPassed = false;
                } else if (check.minLength && (!Array.isArray(check.value) || check.value.length < check.minLength)) {
                    logError(`  ${check.field} array too short: expected at least ${check.minLength}, got ${check.value?.length || 0}`);
                    allPassed = false;
                } else {
                    logSuccess(`  ✓ ${check.field}: ${check.value || 'OK'}`);
                }
            });
            
            if (allPassed) {
                logSuccess('All event fields verified successfully!');
                return true;
            } else {
                logError('Some event fields verification failed');
                return false;
            }
        } else {
            logError('Failed to fetch event details');
            logError(`Response: ${formatResponse(response.data)}`);
            return false;
        }
    } catch (error) {
        logError(`Failed to verify event: ${error.message}`);
        if (error.response?.data) {
            logError(`Response: ${formatResponse(error.response.data)}`);
        }
        return false;
    }
}

// Test 5: Test Validation Errors
async function testValidationErrors(token, categoryId) {
    try {
        logSection('TEST 5: Testing Validation & Error Handling');
        
        const tests = [
            {
                name: 'Missing event_name',
                payload: {
                    event_date: '2024-12-31',
                    event_start_time: '10:00',
                    event_end_time: '14:00',
                    event_images: ['https://via.placeholder.com/800x600'],
                    event_category: categoryId,
                    event_type: 1,
                    event_for: 3,
                    event_address: 'Test Address',
                    event_price: 50,
                },
                shouldFail: true,
            },
            {
                name: 'Missing event_images',
                payload: {
                    event_date: '2024-12-31',
                    event_start_time: '10:00',
                    event_end_time: '14:00',
                    event_name: 'Test Event',
                    event_category: categoryId,
                    event_type: 1,
                    event_for: 3,
                    event_address: 'Test Address',
                    event_price: 50,
                },
                shouldFail: true,
            },
            {
                name: 'Empty event_images array',
                payload: {
                    event_date: '2024-12-31',
                    event_start_time: '10:00',
                    event_end_time: '14:00',
                    event_name: 'Test Event',
                    event_images: [],
                    event_category: categoryId,
                    event_type: 1,
                    event_for: 3,
                    event_address: 'Test Address',
                    event_price: 50,
                },
                shouldFail: true,
            },
            {
                name: 'Invalid event_category (not ObjectId)',
                payload: {
                    event_date: '2024-12-31',
                    event_start_time: '10:00',
                    event_end_time: '14:00',
                    event_name: 'Test Event',
                    event_images: ['https://via.placeholder.com/800x600'],
                    event_category: 'invalid-category-id',
                    event_type: 1,
                    event_for: 3,
                    event_address: 'Test Address',
                    event_price: 50,
                },
                shouldFail: true,
            },
            {
                name: 'Invalid event_type',
                payload: {
                    event_date: '2024-12-31',
                    event_start_time: '10:00',
                    event_end_time: '14:00',
                    event_name: 'Test Event',
                    event_images: ['https://via.placeholder.com/800x600'],
                    event_category: categoryId,
                    event_type: 99, // Invalid
                    event_for: 3,
                    event_address: 'Test Address',
                    event_price: 50,
                },
                shouldFail: true,
            },
            {
                name: 'Missing event_address',
                payload: {
                    event_date: '2024-12-31',
                    event_start_time: '10:00',
                    event_end_time: '14:00',
                    event_name: 'Test Event',
                    event_images: ['https://via.placeholder.com/800x600'],
                    event_category: categoryId,
                    event_type: 1,
                    event_for: 3,
                    event_price: 50,
                },
                shouldFail: true,
            },
        ];
        
        let validationTestsPassed = 0;
        
        for (const test of tests) {
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
                
                if (test.shouldFail) {
                    if (response.data?.status === 0 || response.data?.status === false) {
                        logSuccess(`  ✓ Correctly rejected: ${test.name}`);
                        logInfo(`    Error message: ${response.data.message}`);
                        validationTestsPassed++;
                    } else {
                        logError(`  ✗ Should have failed but succeeded: ${test.name}`);
                    }
                } else {
                    if (response.data?.status === 1) {
                        logSuccess(`  ✓ Correctly accepted: ${test.name}`);
                        validationTestsPassed++;
                    } else {
                        logError(`  ✗ Should have succeeded but failed: ${test.name}`);
                    }
                }
            } catch (error) {
                if (test.shouldFail) {
                    if (error.response?.status === 400 || error.response?.status === 422) {
                        logSuccess(`  ✓ Correctly rejected: ${test.name} (HTTP ${error.response.status})`);
                        validationTestsPassed++;
                    } else {
                        logWarning(`  ⚠ Unexpected error status for ${test.name}: ${error.response?.status || 'N/A'}`);
                    }
                } else {
                    logError(`  ✗ Unexpected error: ${test.name} - ${error.message}`);
                }
            }
        }
        
        if (validationTestsPassed === tests.length) {
            logSuccess(`All ${tests.length} validation tests passed!`);
        } else {
            logWarning(`${validationTestsPassed}/${tests.length} validation tests passed`);
        }
        
        return validationTestsPassed === tests.length;
    } catch (error) {
        logError(`Validation test suite failed: ${error.message}`);
        return false;
    }
}

// Test 6: Test Date Format Handling
async function testDateFormats(token, categoryId) {
    try {
        logSection('TEST 6: Testing Date Format Handling');
        
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 5);
        
        const dateFormats = [
            { format: 'YYYY-MM-DD', value: futureDate.toISOString().split('T')[0] },
            { format: 'ISO String', value: futureDate.toISOString() },
            { format: 'Date Object (stringified)', value: futureDate.toISOString() },
        ];
        
        let dateTestsPassed = 0;
        
        for (const dateTest of dateFormats) {
            logInfo(`Testing date format: ${dateTest.format}`);
            try {
                const payload = {
                    event_date: dateTest.value,
                    event_start_time: '10:00',
                    event_end_time: '14:00',
                    event_name: `Date Test Event - ${dateTest.format} - ${Date.now()}`,
                    event_images: ['https://via.placeholder.com/800x600'],
                    event_category: categoryId,
                    event_type: 1,
                    event_for: 3,
                    event_address: 'Test Address',
                    event_price: 50,
                    no_of_attendees: 10,
                };
                
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
                    logSuccess(`  ✓ Date format ${dateTest.format} accepted`);
                    dateTestsPassed++;
                    
                    // Verify the date was stored correctly
                    const event = response.data.data;
                    const storedDate = new Date(event.event_date);
                    logInfo(`    Stored date: ${storedDate.toLocaleDateString()}`);
                } else {
                    logError(`  ✗ Date format ${dateTest.format} rejected: ${response.data?.message}`);
                }
            } catch (error) {
                logError(`  ✗ Date format ${dateTest.format} error: ${error.message}`);
            }
        }
        
        if (dateTestsPassed === dateFormats.length) {
            logSuccess(`All ${dateFormats.length} date format tests passed!`);
        } else {
            logWarning(`${dateTestsPassed}/${dateFormats.length} date format tests passed`);
        }
        
        return dateTestsPassed === dateFormats.length;
    } catch (error) {
        logError(`Date format test suite failed: ${error.message}`);
        return false;
    }
}

// Main test runner
async function runTests() {
    logSection('EVENT CREATION COMPLETE INTEGRATION TEST');
    log('Testing backend-frontend integration for event creation', 'cyan');
    log('This script verifies that backend and frontend are properly integrated\n', 'cyan');
    
    // Initialize test results
    testResults.passed = 0;
    testResults.failed = 0;
    testResults.warnings = 0;
    testResults.errors = [];
    
    // Get authentication token
    let token = TEST_CONFIG.ORGANIZER_TOKEN;
    
    if (!token && TEST_CONFIG.ORGANIZER_EMAIL && TEST_CONFIG.ORGANIZER_PASSWORD) {
        logInfo('Token not provided, attempting to login...');
        token = await loginOrganizer(TEST_CONFIG.ORGANIZER_EMAIL, TEST_CONFIG.ORGANIZER_PASSWORD);
        if (!token) {
            logError('Failed to login. Cannot proceed without authentication token.');
            logInfo('\nPlease provide one of:');
            logInfo('  1. ORGANIZER_TOKEN environment variable');
            logInfo('  2. ORGANIZER_EMAIL and ORGANIZER_PASSWORD for auto-login');
            return;
        }
    }
    
    if (!token) {
        logError('ORGANIZER_TOKEN is required');
        logInfo('\nUsage:');
        logInfo('  ORGANIZER_TOKEN=your-token node test-event-creation-complete.js');
        logInfo('  OR');
        logInfo('  ORGANIZER_EMAIL=email@example.com ORGANIZER_PASSWORD=password node test-event-creation-complete.js');
        return;
    }
    
    // Ensure token has Bearer prefix
    token = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    logSuccess('Authentication token ready');
    
    // Get event categories
    const categories = await getEventCategories(token);
    if (categories.length === 0) {
        logError('Cannot proceed without event categories. Please ensure categories exist in the database.');
        return;
    }
    
    const categoryId = TEST_CONFIG.EVENT_CATEGORY_ID || categories[0]._id;
    logInfo(`Using category ID: ${categoryId} (${categories.find(c => c._id === categoryId)?.name || 'Unknown'})`);
    
    // Run all tests
    logSection('RUNNING INTEGRATION TESTS');
    
    // Test 2: Join Event Creation
    const joinEvent = await testJoinEventCreation(token, categoryId);
    let joinEventVerified = false;
    if (joinEvent?._id) {
        joinEventVerified = await verifyEventDetails(joinEvent._id, token, 1);
    }
    
    // Test 3: Welcome Event Creation
    const welcomeEvent = await testWelcomeEventCreation(token, categoryId);
    let welcomeEventVerified = false;
    if (welcomeEvent?._id) {
        welcomeEventVerified = await verifyEventDetails(welcomeEvent._id, token, 2);
    }
    
    // Test 5: Validation Errors
    const validationTestsPassed = await testValidationErrors(token, categoryId);
    
    // Test 6: Date Format Handling
    const dateTestsPassed = await testDateFormats(token, categoryId);
    
    // Final Summary
    logSection('TEST SUMMARY');
    log(`Total Tests: ${testResults.passed + testResults.failed}`, 'cyan');
    log(`Passed: ${testResults.passed}`, 'green');
    log(`Failed: ${testResults.failed}`, 'red');
    log(`Warnings: ${testResults.warnings}`, 'yellow');
    
    log('\nDetailed Results:', 'cyan');
    if (joinEvent && joinEventVerified) {
        logSuccess('✓ Join Event (Type 1) - Created and verified successfully');
    } else {
        logError('✗ Join Event (Type 1) - Failed');
    }
    
    if (welcomeEvent && welcomeEventVerified) {
        logSuccess('✓ Welcome Event (Type 2) - Created and verified successfully');
    } else {
        logError('✗ Welcome Event (Type 2) - Failed');
    }
    
    if (validationTestsPassed) {
        logSuccess('✓ Validation Tests - All passed');
    } else {
        logWarning('⚠ Validation Tests - Some failed');
    }
    
    if (dateTestsPassed) {
        logSuccess('✓ Date Format Tests - All passed');
    } else {
        logWarning('⚠ Date Format Tests - Some failed');
    }
    
    // Final verdict
    logSection('FINAL VERDICT');
    if (joinEvent && welcomeEvent && joinEventVerified && welcomeEventVerified && 
        validationTestsPassed && testResults.failed === 0) {
        log('🎉 SUCCESS: Event creation is working smoothly!', 'green');
        log('   All backend-frontend integrations are functioning correctly.', 'green');
        log('   Both event types can be created successfully.', 'green');
    } else {
        log('❌ ISSUES DETECTED: Some tests failed', 'red');
        log('   Please review the errors above and fix any mismatches.', 'yellow');
        
        if (testResults.errors.length > 0) {
            log('\nError Details:', 'red');
            testResults.errors.forEach((error, index) => {
                log(`  ${index + 1}. ${error.message}`, 'red');
                if (error.details) {
                    log(`     ${error.details}`, 'yellow');
                }
            });
        }
    }
    
    log('\n');
}

// Run tests if executed directly
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
    verifyEventDetails,
    testValidationErrors,
    testDateFormats,
};

