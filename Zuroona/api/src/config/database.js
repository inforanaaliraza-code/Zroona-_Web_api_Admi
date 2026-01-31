const mongoose = require("mongoose");

// Track if event listeners have been added to prevent duplicates
let eventListenersAdded = false;
let isReconnecting = false;

// Helper function to ensure MongoDB connection is ready
const ensureConnection = async () => {
	const state = mongoose.connection.readyState;
	// 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

	if (state === 1) {
		// Already connected
		return true;
	}

	if (state === 2) {
		// Currently connecting, wait for it
		return new Promise((resolve, reject) => {
			const timeout = setTimeout(() => {
				reject(new Error("Connection timeout while waiting for MongoDB"));
			}, 10000); // 10 second timeout

			mongoose.connection.once("connected", () => {
				clearTimeout(timeout);
				resolve(true);
			});

			mongoose.connection.once("error", (err) => {
				clearTimeout(timeout);
				reject(err);
			});
		});
	}

	// Not connected, try to reconnect
	if (!isReconnecting) {
		isReconnecting = true;
		try {
			await connectWithRetry(3, 3000);
			isReconnecting = false;
			return true;
		} catch (error) {
			isReconnecting = false;
			throw error;
		}
	}

	// Already reconnecting, wait for it
	return new Promise((resolve, reject) => {
		const checkInterval = setInterval(() => {
			if (mongoose.connection.readyState === 1) {
				clearInterval(checkInterval);
				resolve(true);
			} else if (!isReconnecting) {
				clearInterval(checkInterval);
				reject(new Error("Reconnection failed"));
			}
		}, 500);

		setTimeout(() => {
			clearInterval(checkInterval);
			reject(new Error("Reconnection timeout"));
		}, 15000);
	});
};

const connectWithRetry = async (retries = 5, interval = 5000) => {
	const preferFallback = process.env.MONGO_PREFER_FALLBACK === 'true';
	const fallbackURI = process.env.MONGO_FALLBACK;

	let mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb+srv://aditya:1234@cluster0.jw8wy.mongodb.net/jeena";

	if (preferFallback && fallbackURI) {
		console.log(`Using fallback MongoDB URI: ${fallbackURI}`);
		mongoURI = fallbackURI;
	}

	const options = {
		serverSelectionTimeoutMS: 15000,
		socketTimeoutMS: 45000,
		connectTimeoutMS: 15000,
		maxPoolSize: 50,
		minPoolSize: 10,
		autoIndex: true,
		family: 4, // Use IPv4, skip trying IPv6
		// Note: autoReconnect, reconnectTries, reconnectInterval are deprecated
		// Mongoose handles reconnection automatically in newer versions
	};

	// Add connection event listeners only once
	if (!eventListenersAdded) {
		mongoose.connection.on("error", (err) => {
			console.error("MongoDB connection error:", err.message);
			if (err.name === "MongoNetworkError" || err.name === "MongoNotConnectedError") {
				if (!isReconnecting) {
					isReconnecting = true;
					setTimeout(() => {
						connectWithRetry(retries, interval).catch((error) => {
							console.error("Auto-reconnect failed:", error.message);
							isReconnecting = false;
						});
					}, interval);
				}
			}
		});

		mongoose.connection.on("disconnected", () => {
			console.warn("MongoDB disconnected. Attempting to reconnect...");
			if (!isReconnecting) {
				isReconnecting = true;
				setTimeout(() => {
					connectWithRetry(retries, interval).catch((error) => {
						console.error("Auto-reconnect failed:", error.message);
						isReconnecting = false;
					});
				}, interval);
			}
		});

		mongoose.connection.on("connected", () => {
			console.log("✅ MongoDB connected successfully");
			isReconnecting = false;
		});

		mongoose.connection.on("reconnected", () => {
			console.log("✅ MongoDB reconnected successfully");
			isReconnecting = false;
		});

		eventListenersAdded = true;
	}

	// If already connected, return early
	if (mongoose.connection.readyState === 1) {
		return;
	}

	// If already connecting, wait for it
	if (mongoose.connection.readyState === 2) {
		return new Promise((resolve, reject) => {
			mongoose.connection.once("connected", resolve);
			mongoose.connection.once("error", reject);
		});
	}

	// Try to connect
	for (let i = 0; i < retries; i++) {
		try {
			// If already connected from a previous attempt, return
			if (mongoose.connection.readyState === 1) {
				return;
			}

			await mongoose.connect(mongoURI, options);
			return;
		} catch (error) {
			console.error(
				`MongoDB connection attempt ${i + 1} failed:`,
				error.message
			);
			if (i < retries - 1) {
				console.log(`Retrying in ${interval / 1000} seconds...`);
				await new Promise((resolve) => setTimeout(resolve, interval));
			} else {
				console.error(
					"Max retries reached. Could not connect to MongoDB"
				);
				throw error;
			}
		}
	}
};

module.exports = { connectWithRetry, ensureConnection };
