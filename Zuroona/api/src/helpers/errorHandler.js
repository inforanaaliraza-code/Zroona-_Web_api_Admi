/**
 * Comprehensive Error Handler Utility
 * Provides consistent error handling across the API
 */

const Response = require('./response');
const logger = require('./logger');

class AppError extends Error {
	constructor(message, statusCode = 500, isOperational = true) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
		
		Error.captureStackTrace(this, this.constructor);
	}
}

/**
 * Handle async errors in route handlers
 * Wraps async route handlers to catch errors automatically
 */
const asyncHandler = (fn) => {
	return (req, res, next) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};

/**
 * Handle validation errors
 */
const handleValidationError = (error, res, _lang = 'en') => {
	const errors = Object.values(error.errors || {}).map(err => err.message);
	const message = errors.length > 0 
		? errors.join(', ') 
		: (error.message || 'Validation error');
	
	logger.error('Validation Error:', { error: error.message, errors });
	return Response.validationErrorResponse(res, message);
};

/**
 * Handle database errors
 */
const handleDatabaseError = (error, res, lang = 'en') => {
	let message = 'Database operation failed';
	let statusCode = 500;

	if (error.name === 'MongoError' || error.name === 'MongoServerError') {
		if (error.code === 11000) {
			// Duplicate key error
			const field = Object.keys(error.keyPattern || {})[0] || 'field';
			message = `${field} already exists`;
			statusCode = 409;
		} else {
			message = 'Database connection error';
		}
	} else if (error.name === 'CastError') {
		message = 'Invalid ID format';
		statusCode = 400;
	} else if (error.name === 'ValidationError') {
		return handleValidationError(error, res, lang);
	}

	logger.error('Database Error:', { error: error.message, code: error.code, name: error.name });
	return Response.serverErrorResponse(res, message, {}, statusCode);
};

/**
 * Handle JWT errors
 */
const handleJWTError = (error, res, _lang = 'en') => {
	let message = 'Authentication failed';
	let statusCode = 401;

	if (error.name === 'JsonWebTokenError') {
		message = 'Invalid token';
	} else if (error.name === 'TokenExpiredError') {
		message = 'Token expired';
	} else if (error.name === 'NotBeforeError') {
		message = 'Token not active yet';
	}

	logger.error('JWT Error:', { error: error.message, name: error.name });
	return Response.unauthorizedResponse(res, {}, statusCode, message);
};

/**
 * Handle external API errors
 */
const handleExternalAPIError = (error, res, serviceName = 'External Service', _lang = 'en') => {
	let message = `${serviceName} error`;
	let statusCode = 502;

	if (error.response) {
		// API responded with error
		statusCode = error.response.status || 502;
		message = error.response.data?.message || `${serviceName} returned an error`;
	} else if (error.request) {
		// Request made but no response
		message = `${serviceName} is not responding`;
		statusCode = 503;
	} else {
		// Error in request setup
		message = `Failed to connect to ${serviceName}`;
	}

	logger.error(`${serviceName} Error:`, { 
		error: error.message, 
		status: error.response?.status,
		data: error.response?.data 
	});
	return Response.serverErrorResponse(res, message, {}, statusCode);
};

/**
 * Handle file upload errors
 */
const handleFileUploadError = (error, res, _lang = 'en') => {
	let message = 'File upload failed';
	let statusCode = 400;

	if (error.code === 'LIMIT_FILE_SIZE') {
		message = 'File size exceeds maximum limit';
		statusCode = 413;
	} else if (error.code === 'LIMIT_FILE_COUNT') {
		message = 'Too many files';
		statusCode = 400;
	} else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
		message = 'Unexpected file field';
		statusCode = 400;
	} else if (error.message && error.message.includes('Unexpected end of form')) {
		message = 'File upload incomplete. Please try again';
		statusCode = 400;
	}

	logger.error('File Upload Error:', { error: error.message, code: error.code });
	return Response.serverErrorResponse(res, message, {}, statusCode);
};

/**
 * Global error handler middleware
 */
const globalErrorHandler = (err, req, res, _next) => {
	const lang = req.headers['lang'] || 'en';
	
	// Set default error
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	// Log error
	logger.error('Global Error Handler:', {
		message: err.message,
		stack: err.stack,
		url: req.originalUrl,
		method: req.method,
		ip: req.ip,
		user: req.user?.id || 'anonymous'
	});

	// Handle specific error types
	if (err.name === 'ValidationError' || err.name === 'CastError' || err.name === 'MongoError' || err.name === 'MongoServerError') {
		return handleDatabaseError(err, res, lang);
	}

	if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError' || err.name === 'NotBeforeError') {
		return handleJWTError(err, res, lang);
	}

	if (err.isOperational !== false) {
		// Operational error - trusted error, send message to client
		return Response.serverErrorResponse(
			res,
			err.message || 'An error occurred',
			{},
			err.statusCode
		);
	}

	// Programming or unknown error - don't leak error details
	if (process.env.NODE_ENV === 'development') {
		return Response.serverErrorResponse(
			res,
			err.message || 'An error occurred',
			{ stack: err.stack },
			err.statusCode
		);
	}

	// Production - generic error message
	return Response.serverErrorResponse(
		res,
		'Something went wrong. Please try again later.',
		{},
		500
	);
};

/**
 * Handle 404 errors
 */
const handleNotFound = (req, res) => {
	return Response.notFoundResponse(
		res,
		`Route ${req.originalUrl} not found`
	);
};

module.exports = {
	AppError,
	asyncHandler,
	handleValidationError,
	handleDatabaseError,
	handleJWTError,
	handleExternalAPIError,
	handleFileUploadError,
	globalErrorHandler,
	handleNotFound
};

