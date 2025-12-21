const express = require("express");
const dotenv = require("dotenv");
const allRoutes = require("./routes/allRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const { connectWithRetry } = require("./config/database");
const morgan = require("morgan");
const cors = require("cors");
const Response = require("./helpers/response");
const helmet = require("helmet");
const path = require("path");
const os = require("os");
const fileUpload = require("express-fileupload");
const commonController = require("./controllers/commonController");
const autoCloseGroupChats = require("./scripts/autoCloseGroupChats.js");
const updateCompletedBookings = require("./scripts/updateCompletedBookings.js");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Trust proxy - required when behind a reverse proxy like Coolify
app.enable("trust proxy");

// CORS configuration
const corsOptions = {
	origin: "*", // Allow all origins
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
	allowedHeaders: [
		"Content-Type",
		"Authorization",
		"lang",
		"x-requested-with",
	],
	credentials: true,
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Handle OPTIONS requests explicitly
app.options("*", (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, OPTIONS"
	);
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
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

// Basic middleware
// app.use(morgan("tiny")); // Disabled for cleaner logs
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Security headers with flexible configuration for development
app.use(
	helmet({
		contentSecurityPolicy: false,
		crossOriginEmbedderPolicy: false,
		crossOriginResourcePolicy: false,
		crossOriginOpenerPolicy: false,
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

app.all("*", (req, res) => {
	return Response.notFoundResponse(res, "page not found");
});

// Error handling middleware
app.use((err, req, res, next) => {
	// Handle Busboy/file upload errors specifically
	if (err.message && err.message.includes('Unexpected end of form')) {
		console.error('File upload error (Busboy):', err.message);
		return res.status(400).json({
			status: 0,
			message: "File upload failed. Please try again with a smaller file or check your internet connection.",
			error: process.env.NODE_ENV === "development" ? err.message : undefined,
		});
	}

	// Handle file size limit errors
	if (err.message && err.message.includes('File too large')) {
		return res.status(413).json({
			status: 0,
			message: "File size exceeds the maximum limit of 50MB",
			error: process.env.NODE_ENV === "development" ? err.message : undefined,
		});
	}

	// General error handling
	console.error('Server error:', err.stack);
	res.status(err.status || 500).json({
		status: 0,
		message: err.message || "Something went wrong!",
		error: process.env.NODE_ENV === "development" ? err.stack : undefined,
	});
});

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
	process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
	console.error("Unhandled Rejection:", err);
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

module.exports = app;
