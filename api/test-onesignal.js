/**
 * OneSignal Push Notification Test Script
 * 
 * This script tests the OneSignal integration by sending a test notification
 * 
 * Usage: node test-onesignal.js <player_id>
 * Example: node test-onesignal.js your-onesignal-player-id-here
 */

require('dotenv').config();
const oneSignalClient = require('./src/config/oneSignalConfig.js');

// Get player ID from command line argument
const playerId = process.argv[2];

if (!playerId) {
    console.error('❌ Error: Player ID is required');
    console.log('Usage: node test-onesignal.js <player_id>');
    console.log('Example: node test-onesignal.js abc123def456');
    process.exit(1);
}

// Check if credentials are configured
if (!process.env.ONESIGNAL_APP_ID || !process.env.ONESIGNAL_REST_API_KEY) {
    console.error('❌ Error: OneSignal credentials not configured');
    console.log('Please set ONESIGNAL_APP_ID and ONESIGNAL_REST_API_KEY in your .env file');
    process.exit(1);
}

console.log('🧪 Testing OneSignal Push Notification...');
console.log(`📱 App ID: ${process.env.ONESIGNAL_APP_ID}`);
console.log(`👤 Player ID: ${playerId}`);
console.log('');

// Create test notification payload
const notificationPayload = {
    include_player_ids: [playerId],
    headings: {
        en: 'Test Notification',
        ar: 'إشعار تجريبي'
    },
    contents: {
        en: 'This is a test notification from OneSignal! 🎉',
        ar: 'هذا إشعار تجريبي من OneSignal! 🎉'
    },
    data: {
        test: 'true',
        timestamp: new Date().toISOString()
    }
};

// Send notification
oneSignalClient.createNotification(notificationPayload)
    .then(response => {
        console.log('✅ SUCCESS! Notification sent successfully');
        console.log('📦 Response:', JSON.stringify(response.body, null, 2));
        process.exit(0);
    })
    .catch(error => {
        console.error('❌ ERROR: Failed to send notification');
        console.error('Error details:', error);
        if (error.statusCode) {
            console.error(`Status Code: ${error.statusCode}`);
        }
        if (error.body) {
            console.error('Error Body:', JSON.stringify(error.body, null, 2));
        }
        process.exit(1);
    });

