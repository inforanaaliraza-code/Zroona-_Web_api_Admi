/**
 * Sentry Error Tracking Configuration
 * Monitors and tracks errors in production
 */

const Sentry = require('@sentry/node');

const initSentry = () => {
    const dsn = process.env.SENTRY_DSN || "httpss://0b9a0508554c83f26e4f17fceca22a09@o4510574507851776.ingest.us.sentry.io/4510574510604288";
    
    if (!dsn) {
        console.warn('⚠️  Sentry DSN not configured. Error tracking disabled.');
        return null;
    }

    try {
        // https integration is automatically included in Sentry v10+
        // No need to explicitly add it unless using custom configuration
        Sentry.init({
            dsn: dsn,
            environment: process.env.NODE_ENV || 'development',
            tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0, // 10% in production, 100% in dev
            // Setting this option to true will send default PII data to Sentry
            // For example, automatic IP address collection on events
            sendDefaultPii: true,
            // https tracing is enabled by default in Sentry v10+
            // Capture unhandled promise rejections
            captureUnhandledRejections: true,
            // Capture uncaught exceptions
            captureUncaughtExceptions: true,
        });

        console.log('✅ Sentry error tracking initialized');
        console.log(`📊 Sentry Project ID: 4510574510604288`);
        return Sentry;
    } catch (error) {
        console.error('❌ Failed to initialize Sentry:', error);
        return null;
    }
};

module.exports = initSentry;

