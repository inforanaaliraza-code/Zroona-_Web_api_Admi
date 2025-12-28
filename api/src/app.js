const express = require("express");
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
const createTestUsers = require("./scripts/createTestUsers.js");
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
const port = process.env.PORT || 3000;

// Trust proxy - required when behind a reverse proxy like Coolify
// Set to 1 to trust only the first proxy hop (prevents IP spoofing and rate limit bypass)
// This is more secure than setting it to true, which trusts all proxies
app.set("trust proxy", 1);

// CORS configuration
const allowedOrigins = [
	"http://localhost:3000",
	"http://localhost:3001",
	"http://127.0.0.1:3000",
	"http://127.0.0.1:3001",
	process.env.FRONTEND_URL,
	process.env.ADMIN_URL,
].filter(Boolean); // Remove undefined values

const corsOptions = {
	origin: function (origin, callback) {
		// Allow requests with no origin (like mobile apps, Postman, or curl)
		if (!origin) return callback(null, true);
		
		// Allow all origins in development, or check against allowed list
		if (process.env.NODE_ENV === 'development' || allowedOrigins.length === 0) {
			return callback(null, true);
		}
		
		if (allowedOrigins.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			// In development, allow all origins
			if (process.env.NODE_ENV === 'development') {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
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
	],
	credentials: true,
	optionsSuccessStatus: 200,
	preflightContinue: false,
};

app.use(cors(corsOptions));

// Handle OPTIONS requests explicitly (preflight)
app.options("*", cors(corsOptions), (req, res) => {
	res.sendStatus(200);
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

// Serve static invoice files
app.use('/invoices', express.static(path.join(__dirname, '../invoices')));

// Rate limiting - Apply to all API routes
const { apiLimiter } = require("./middleware/rateLimiter");
app.use('/api/', apiLimiter);

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
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				styleSrc: ["'self'", "'unsafe-inline'"],
				scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Adjust for production
				imgSrc: ["'self'", "data:", "https:"],
				connectSrc: ["'self'"],
				fontSrc: ["'self'", "data:"],
				objectSrc: ["'none'"],
				mediaSrc: ["'self'"],
				frameSrc: ["'none'"],
			},
		},
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
			const baseHttp = `http://${host}:${port}`;
			console.log("\n  ✓ MongoDB connected successfully");
			console.log(`\n  ▲ Express API Server`);
			console.log(`  - Local:        ${baseHttp}`);
			console.log(`  - User API:     ${baseHttp}/api/`);
			console.log(`  - Admin API:    ${baseHttp}/api/admin/\n`);
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
process.on("unhandledRejection", (err) => {
	console.error("Unhandled Rejection:", err);
	// Capture rejection in Sentry if initialized
	if (process.env.SENTRY_DSN || process.env.NODE_ENV === 'production') {
		const Sentry = require("@sentry/node");
		Sentry.captureException(err);
	}
	process.exit(1);
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

// Create test users on startup (for development/testing)
if (process.env.CREATE_TEST_USERS === 'true' || process.env.NODE_ENV === 'development') {
    setTimeout(() => {
        createTestUsers().catch(err => {
            console.error('[TEST-USERS] Error creating test users:', err);
        });
    }, 15000); // After 15 seconds to ensure DB is connected
    
    console.log('[TEST-USERS] Test users will be created on startup');
}

module.exports = app;
