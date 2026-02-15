/**
 * OneSignal Configuration
 * 
 * This file initializes and exports the OneSignal client for push notifications.
 * 
 * Required Environment Variables:
 * - ONESIGNAL_APP_ID: Your OneSignal App ID
 * - ONESIGNAL_REST_API_KEY: Your OneSignal REST API Key
 */

const OneSignal = require('onesignal-node');

// Get OneSignal credentials from environment variables
const appId = process.env.ONESIGNAL_APP_ID;
const restApiKey = process.env.ONESIGNAL_REST_API_KEY;

if (!appId || !restApiKey) {
    console.warn('⚠️  OneSignal credentials not configured. Push notifications will not work.');
    console.warn('⚠️  Please set ONESIGNAL_APP_ID and ONESIGNAL_REST_API_KEY in your .env file.');
} else {
    console.log('✅ OneSignal credentials loaded successfully');
    console.log(`📱 App ID: ${appId.substring(0, 8)}...`);
    console.log(`🔑 REST API Key: ${restApiKey.substring(0, 20)}...`);
}

// Initialize OneSignal client (v3 syntax)
const oneSignalClient = new OneSignal.Client({
    userAuthKey: restApiKey, // REST API Key
    app: {
        appAuthKey: restApiKey, // REST API Key
        appId: appId // OneSignal App ID
    }
});

module.exports = oneSignalClient;

