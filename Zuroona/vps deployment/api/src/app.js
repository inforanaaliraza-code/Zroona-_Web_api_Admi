const express = require("express");
const fs = require("fs");
const dotenv = require("dotenv");
const allRoutes = require("./routes/allRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const { connectWithRetry } = require("./config/database");
const morgan = require("morgan");
const cors = require("cors");
const Response = require("./helpers/response");
const { globalErrorHandler, handleNotFound } = require("./helpers/errorHandler");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const path = require("path");
const os = require("os");
const fileUpload = require("express-fileupload");
const commonController = require("./controllers/commonController");
const autoCloseGroupChats = require("./scripts/autoCloseGroupChats.js");
const updateCompletedBookings = require("./scripts/updateCompletedBookings.js");
const autoCancelUnpaidBookings = require("./scripts/autoCancelUnpaidBookings.js");
const sendHostResponseReminders = require("./scripts/sendHostResponseReminders.js");
const sendHoldExpiredNotifications = require("./scripts/sendHoldExpiredNotifications.js");
const sendReviewPrompts = require("./scripts/sendReviewPrompts.js");
// const createTestUsers = require("./scripts/createTestUsers.js"); // Disabled - run manually with: npm run script:create-users
const initSentry = require("./config/sentry.js");
const logger = require("./helpers/logger.js");

dotenv.config();

// Initialize Sentry error tracking
if (process.env.SENTRY_DSN) {
	initSentry();
	logger.info('Sentry error tracking initialized');
} else {
	logger.warn('Sentry DSN not configured. Error tracking disabled.');
}

const app = express();
const port = process.env.PORT || 3434;

// Trust proxy - required when behind a reverse proxy like Coolify
// Set to 1 to trust only the first proxy hop (prevents IP spoofing and rate limit bypass)
// This is more secure than setting it to true, which trusts all proxies
app.set("trust proxy", 1);

// CORS configuration - MUST be before all other middleware
const allowedOrigins = [
	// Development URLs
	"httpss://zuroona.sa",
	"httpss://admin.zuroona.sa",

	"https://localhost:3002", // Admin panel
	"httpss://api.zuroona.sa",

	"https://127.0.0.1:3000",
	"https://127.0.0.1:3001",

	"https://127.0.0.1:3002", // Admin panel
	"https://127.0.0.1:3434",
	// Docker service URLs (for internal communication)
	"https://web:3000",
	"https://admin:3002",
	"https://api:3434",
	// Production URLs
	"httpss://zuroona.sa",
	"httpss://www.zuroona.sa",
	"httpss://admin.zuroona.sa",
	"httpss://api.zuroona.sa",
	// Environment variable URLs (for flexibility)
	process.env.FRONTEND_URL,
	process.env.ADMIN_URL,
	process.env.WEB_URL,
].filter(Boolean); // Remove undefined values

const corsOptions = {
	origin: function (origin, callback) {
		// Allow requests with no origin (like mobile apps, Postman, or curl)
		if (!origin) {
			return callback(null, true);
		}

		// Allow all origins in development OR if CORS_ALLOW_ALL is set (for Docker testing)
		if (process.env.NODE_ENV !== 'production' || process.env.CORS_ALLOW_ALL === 'true') {
			return callback(null, true);
		}

		// Check against allowed list in production
		if (allowedOrigins.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
	allowedHeaders: [
		"Content-Type",
		"Authorization",
		"lang",
		"x-requested-with",
		"Accept",
		"Origin",
		"X-Requested-With",
		"X-CSRF-Token",
	],
	credentials: true,
	optionsSuccessStatus: 200,
	preflightContinue: false,
	maxAge: 86400, // 24 hours
};

// Apply CORS middleware FIRST - before any other middleware (including helmet)
app.use(cors(corsOptions));

// Normalize URLs to remove double slashes (e.g. /api//invoices -> /api/invoices)
app.use((req, res, next) => {
	if (req.url.includes('//')) {
		req.url = req.url.replace(/\/+/g, '/');
	}
	next();
});

// Add a simple health check endpoint before other middleware
app.get("/api/health", (req, res) => {
	res.json({
		status: 1,
		message: "Server is running",
		data: {
			timestamp: new Date().toISOString(),
			uptime: process.uptime(),
		},
	});
});

// File upload middleware - MUST be before any body parsers
app.use(
	fileUpload({
		limits: {
			fileSize: 50 * 1024 * 1024, // 50MB limit
		},
		abortOnLimit: true,
		createParentPath: true,
		useTempFiles: true,
		tempFileDir: os.tmpdir(), // Use OS temp directory (works on Windows, Linux, Mac)
		debug: false, // Disable debug to prevent spam
		parseNested: true,
		safeFileNames: true,
		preserveExtension: true,
		uploadTimeout: 60000, // 60 seconds timeout
		// Suppress Busboy errors - file uploads work despite the error
		busboy: {
			highWaterMark: 2 * 1024 * 1024, // 2MB buffer
		}
	})
);

// Cookie parser (required for CSRF)
app.use(cookieParser(process.env.COOKIE_SECRET || 'zuroona-cookie-secret-key-change-in-production'));

// Basic middleware
// app.use(morgan("tiny")); // Disabled for cleaner logs
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom route to serve invoices reliably
app.get(['/api/invoices/:filename', '/api//invoices/:filename', '/invoices/:filename'], (req, res) => {
	try {
		const filename = req.params.filename;
		// Sanitize filename to prevent directory traversal
		const safeFilename = path.basename(filename);
		const filepath = path.join(__dirname, '../invoices', safeFilename);

		if (fs.existsSync(filepath)) {
			console.log(`[INVOICE] Serving file: ${filepath}`);
			res.sendFile(filepath);
		} else {
			console.error(`[INVOICE] File not found: ${filepath}`);
			res.status(404).json({
				status: 0,
				message: `Invoice not found: ${safeFilename}`
			});
		}
	} catch (error) {
		console.error(`[INVOICE] Error serving file:`, error);
		res.status(500).json({
			status: 0,
			message: "Internal server error serving invoice"
		});
	}
});

// Serve static invoice files
// Handle both standard and double-slash paths explicitly
app.use(['/api/invoices', '/api//invoices', '/invoices'], express.static(path.join(__dirname, '../invoices')));

// Rate limiting - DISABLED: Removed global API rate limiter to prevent "Too Many Requests" errors
// Both web and mobile app share the same backend/IP, causing rate limit conflicts
// Specific rate limiters (auth, upload) are still applied to critical endpoints
// const { apiLimiter } = require("./middleware/rateLimiter");
// app.use('/api/', apiLimiter);

// Serve static files from uploads directory (for local file uploads)
const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));

// Debug middleware disabled for production-like clean output
// app.use((req, res, next) => {
// 	const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
// 	console.log(`${new Date().toISOString()} - ${req.method} ${fullUrl}`);
// 	next();
// });

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

// Middleware to suppress Busboy errors (they don't affect functionality)
app.use((req, res, next) => {
	// Suppress Busboy "Unexpected end of form" errors
	const originalOn = req.on;
	req.on = function (event, handler) {
		if (event === 'error' && handler.toString().includes('Busboy')) {
			// Suppress Busboy errors
			return originalOn.call(this, event, (err) => {
				if (!err.message.includes('Unexpected end of form')) {
					handler(err);
				}
			});
		}
		return originalOn.call(this, event, handler);
	};
	next();
});

// Enhanced Security headers
app.use(
	helmet({
		contentSecurityPolicy: false, // Disable CSP for API (CORS handles cross-origin)
		crossOriginEmbedderPolicy: false, // Disable for API compatibility
		crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin resources
		crossOriginOpenerPolicy: false, // Disable for API compatibility
		hsts: {
			maxAge: 31536000, // 1 year
			includeSubDomains: true,
			preload: true
		},
		xssFilter: true, // Enable XSS filter
		noSniff: true, // Prevent MIME type sniffing
		frameguard: { action: 'deny' }, // Prevent clickjacking
		referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
	})
);

// API Info endpoints (before other routes)
app.get("/", (req, res) => {
	const host = req.get("host");
	const baseUrl = `${req.protocol}://${host}`;
	res.json({
		status: 1,
		message: "Zuroona API Server is running",
		data: {
			version: "1.0.0",
			endpoints: {
				userApi: `${baseUrl}/api/`,
				adminApi: `${baseUrl}/api/admin/`,
				health: `${baseUrl}/api/health`,
			},
		},
		total_count: 0,
	});
});

app.get("/api/", (req, res) => {
	const host = req.get("host");
	const baseUrl = `${req.protocol}://${host}`;
	res.json({
		status: 1,
		message: "Zuroona User API",
		data: {
			baseUrl: `${baseUrl}/api/`,
			availableEndpoints: [
				"user/register",
				"user/login",
				"user/verify",
				"user/profile",
				"landing/events",
				"organizer/event/list",
				"user/event/book",
			],
			note: "Use specific endpoints for API calls. See documentation for full list.",
		},
		total_count: 0,
	});
});

app.get("/api/admin/", (req, res) => {
	const host = req.get("host");
	const baseUrl = `${req.protocol}://${host}`;
	res.json({
		status: 0,
		message: "Admin API requires authentication token. Please include 'Authorization: Bearer <token>' header.",
		data: {
			baseUrl: `${baseUrl}/api/admin/`,
			note: "Admin routes require valid authentication token in Authorization header.",
		},
		total_count: 0,
	});
});

// Routes
app.use("/api/admin", adminRoutes);

// Admin login route alias - handle /api/login for backward compatibility
// Must be before allRoutes to ensure it's matched first
const adminController = require("./controllers/adminController");
app.post("/api/login", adminController.adminLogin);

app.use("/api/", allRoutes);

// Upload endpoints (fallback - already handled by routes)
app.post("/api/user/uploadFile", commonController.uploadFile);
app.post("/api/common/user/uploadFile", commonController.uploadFile);

// Handle 404 - must be before error handler
app.all("*", (req, res) => {
	return handleNotFound(req, res);

});

// Global error handling middleware - must be last
app.use(globalErrorHandler);

const startServer = async () => {
	try {
		// Connect to MongoDB with retry mechanism
		await connectWithRetry();

		app.listen(port, () => {
			const host = process.env.HOST || "localhost";
			const basehttps = `https://${host}:${port}`;
			console.log("\n  ✓ MongoDB connected successfully");
			console.log(`\n  ▲ Express API Server`);
			console.log(`  - Local:        ${basehttps}`);
			console.log(`  - User API:     ${basehttps}/api/`);
			console.log(`  - Admin API:    ${basehttps}/api/admin/\n`);
		});
	} catch (error) {
		console.error("Failed to start server:", error);
		process.exit(1);
	}
};

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
	console.error("Uncaught Exception:", err);
	// Capture exception in Sentry if initialized
	if (process.env.SENTRY_DSN || process.env.NODE_ENV === 'production') {
		const Sentry = require("@sentry/node");
		Sentry.captureException(err);
	}
	process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
	console.error("Unhandled Rejection:", err);
	console.error("Promise:", promise);

	// Log error details



	if (err?.https_code) {
		console.error(`https Code: ${err.https_code}, Name: ${err.name || 'Unknown'}`);
	}
	if (err?.stack) {
		console.error("Stack trace:", err.stack);
	}

	// Capture rejection in Sentry if initialized
	if (process.env.SENTRY_DSN || process.env.NODE_ENV === 'production') {
		const Sentry = require("@sentry/node");
		Sentry.captureException(err);
	}

	// Only exit in production for critical errors
	// In development, log and continue to allow debugging
	if (process.env.NODE_ENV === 'production') {
		// For timeout errors, don't crash - just log
		if (err?.https_code === 499 || err?.name === 'TimeoutError') {
			console.error("⚠️ Timeout error detected - server will continue running");
			return;
		}
		// For other critical errors in production, exit
		console.error("❌ Critical unhandled rejection - exiting process");
		process.exit(1);
	} else {
		// In development, just log the error
		console.error("⚠️ Unhandled rejection in development - server will continue");
	}
});

// Start the application
startServer();

// Schedule auto-close group chats task (runs every hour)
if (process.env.ENABLE_AUTO_CLOSE_GROUP_CHATS !== 'false') {
	// Run immediately on startup (after 30 seconds to ensure DB is connected)
	setTimeout(() => {
		autoCloseGroupChats().catch(err => {
			console.error('[AUTO-CLOSE] Error in scheduled task:', err);
		});
	}, 30000);

	// Then run every hour
	setInterval(() => {
		autoCloseGroupChats().catch(err => {
			console.error('[AUTO-CLOSE] Error in scheduled task:', err);
		});
	}, 60 * 60 * 1000); // 1 hour in milliseconds

	console.log('[AUTO-CLOSE] Scheduled task enabled - will run every hour');
}

// Schedule auto-update completed bookings task (runs daily)
if (process.env.ENABLE_AUTO_COMPLETE_BOOKINGS !== 'false') {
	// Run immediately on startup (after 60 seconds to ensure DB is connected)
	setTimeout(() => {
		updateCompletedBookings().catch(err => {
			console.error('[AUTO-COMPLETE] Error in scheduled task:', err);
		});
	}, 60000);

	// Then run every 24 hours
	setInterval(() => {
		updateCompletedBookings().catch(err => {
			console.error('[AUTO-COMPLETE] Error in scheduled task:', err);
		});
	}, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

	console.log('[AUTO-COMPLETE] Scheduled task enabled - will run daily');
}

// Schedule auto-cancel unpaid bookings task (runs every hour)
if (process.env.ENABLE_AUTO_CANCEL_UNPAID_BOOKINGS !== 'false') {
	// Run immediately on startup (after 90 seconds to ensure DB is connected)
	setTimeout(() => {
		autoCancelUnpaidBookings().catch(err => {
			console.error('[AUTO-CANCEL-UNPAID] Error in scheduled task:', err);
		});
	}, 90000);

	// Then run every hour
	setInterval(() => {
		autoCancelUnpaidBookings().catch(err => {
			console.error('[AUTO-CANCEL-UNPAID] Error in scheduled task:', err);
		});
	}, 60 * 60 * 1000); // 1 hour in milliseconds

	console.log('[AUTO-CANCEL-UNPAID] Scheduled task enabled - will run every hour');
}

// Schedule host response reminders task (runs every hour)
if (process.env.ENABLE_HOST_RESPONSE_REMINDERS !== 'false') {
	// Run immediately on startup (after 120 seconds to ensure DB is connected)
	setTimeout(() => {
		sendHostResponseReminders().catch(err => {
			console.error('[HOST-REMINDER] Error in scheduled task:', err);
		});
	}, 120000);

	// Then run every hour
	setInterval(() => {
		sendHostResponseReminders().catch(err => {
			console.error('[HOST-REMINDER] Error in scheduled task:', err);
		});
	}, 60 * 60 * 1000); // 1 hour in milliseconds

	console.log('[HOST-REMINDER] Scheduled task enabled - will run every hour');
}

// Schedule hold expired notifications task (runs every 15 minutes)
if (process.env.ENABLE_HOLD_EXPIRED_NOTIFICATIONS !== 'false') {
	// Run immediately on startup (after 150 seconds to ensure DB is connected)
	setTimeout(() => {
		sendHoldExpiredNotifications().catch(err => {
			console.error('[HOLD-EXPIRED] Error in scheduled task:', err);
		});
	}, 150000);

	// Then run every 15 minutes
	setInterval(() => {
		sendHoldExpiredNotifications().catch(err => {
			console.error('[HOLD-EXPIRED] Error in scheduled task:', err);
		});
	}, 15 * 60 * 1000); // 15 minutes in milliseconds

	console.log('[HOLD-EXPIRED] Scheduled task enabled - will run every 15 minutes');
}

// Schedule review prompts task (runs every hour)
if (process.env.ENABLE_REVIEW_PROMPTS !== 'false') {
	// Run immediately on startup (after 180 seconds to ensure DB is connected)
	setTimeout(() => {
		sendReviewPrompts().catch(err => {
			console.error('[REVIEW-PROMPT] Error in scheduled task:', err);
		});
	}, 180000);

	// Then run every hour
	setInterval(() => {
		sendReviewPrompts().catch(err => {
			console.error('[REVIEW-PROMPT] Error in scheduled task:', err);
		});
	}, 60 * 60 * 1000); // 1 hour in milliseconds

	console.log('[REVIEW-PROMPT] Scheduled task enabled - will run every hour');
}

// Create test users on startup (DISABLED - run manually with: npm run script:create-users)
// if (process.env.CREATE_TEST_USERS === 'true' || process.env.NODE_ENV === 'development') {
//     setTimeout(() => {
//         createTestUsers().catch(err => {
//             console.error('[TEST-USERS] Error creating test users:', err);
//         });
//     }, 15000); // After 15 seconds to ensure DB is connected
//     
//     console.log('[TEST-USERS] Test users will be created on startup');
// }

module.exports = app;
