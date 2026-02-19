/**
 * CSRF Protection Middleware
 * Protects against Cross-Site Request Forgery attacks
 */

const csrf = require('express-csurf');
const _cookieParser = require('cookie-parser');

// CSRF protection configuration
// Note: For API-only applications, CSRF might not be needed if using JWT tokens
// But we'll implement it for web forms and state-changing operations

const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'strict',
    },
    value: (req) => {
        // Get CSRF token from header or body
        return req.headers['x-csrf-token'] || req.body._csrf || req.query._csrf;
    }
});

// Middleware to skip CSRF for certain routes (API endpoints with JWT)
const skipCSRF = (req, res, next) => {
    // Skip CSRF for API endpoints that use JWT authentication
    if (req.path.startsWith('/api/') && req.headers.authorization) {
        return next();
    }
    // Skip CSRF for webhook endpoints
    if (req.path.includes('/webhook') || req.path.includes('/webhookReceived')) {
        return next();
    }
    // Apply CSRF for other routes
    return csrfProtection(req, res, next);
};

// Get CSRF token endpoint
const getCSRFToken = (req, res) => {
    res.json({
        status: 1,
        csrfToken: req.csrfToken(),
        message: 'CSRF token generated successfully'
    });
};

module.exports = {
    csrfProtection: skipCSRF,
    getCSRFToken,
};

