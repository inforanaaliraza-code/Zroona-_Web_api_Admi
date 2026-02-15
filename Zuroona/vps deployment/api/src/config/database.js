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
	const primaryURI = process.env.MONGO_URI || process.env.MONGODB_URI;

	let mongoURI = primaryURI || "mongodb+srv://faith55771_db_user:%40Rana55771@cluster0.exxdpul.mongodb.net/jeena?appName=Cluster0";

	// Log which URI is being used
	const displayURI = mongoURI.replace(/:[^:]*@/, ':****@');
	if (preferFallback && fallbackURI) {
		console.log(`⚠️  Using fallback MongoDB URI: ${fallbackURI}`);
		mongoURI = fallbackURI;
	} else {
		console.log(`🔄 Attempting MongoDB connection: ${displayURI}`);
	}

	const options = {
		serverSelectionTimeoutMS: 10000,
		socketTimeoutMS: 45000,
		connectTimeoutMS: 10000,
		maxPoolSize: 50,
		minPoolSize: 10,
		autoIndex: true,
		family: 4, // Use IPv4, skip trying IPv6
		retryWrites: true,
		w: 'majority',
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
	let networkErrorCount = 0;

	for (let i = 0; i < retries; i++) {
		try {
			// If already connected from a previous attempt, return
			if (mongoose.connection.readyState === 1) {
				return;
			}

			await mongoose.connect(mongoURI, options);
			console.log(`✅ MongoDB connected successfully`);
			return;
		} catch (error) {
			const isNetworkError = error.message.includes('ECONNREFUSED') || 
									error.message.includes('ENOTFOUND') || 
									error.message.includes('querySrv') ||
									error.message.includes('getaddrinfo');
			
			if (isNetworkError) networkErrorCount++;

			console.error(
				`❌ MongoDB connection attempt ${i + 1}/${retries} failed:`,
				error.message
			);

			// After 2 failed attempts with network errors, suggest fallback
			if (isNetworkError && networkErrorCount >= 2 && !mongoURI.includes('localhost') && fallbackURI) {
				console.warn(`\n⚠️  Network/DNS error detected (MongoDB Atlas or network unreachable)`);
				console.warn(`💡 Consider using local MongoDB fallback by setting MONGO_PREFER_FALLBACK=true in .env\n`);
			}

			if (i < retries - 1) {
				const waitTime = interval / 1000;
				console.log(`🔄 Retrying in ${waitTime} seconds... (${i + 1}/${retries})`);
				await new Promise((resolve) => setTimeout(resolve, interval));
			} else {
				console.error(
					`\n❌ Max retries reached (${retries}). Could not connect to MongoDB`
				);
				
				if (isNetworkError && !mongoURI.includes('localhost') && fallbackURI) {
					console.error(`\n🛠️  SOLUTION - Choose one option:\n`);
					console.error(`   Option 1: Use Local MongoDB (Recommended for Development)`);
					console.error(`   ├─ Edit api/.env: Set MONGO_PREFER_FALLBACK=true`);
					console.error(`   ├─ Start MongoDB: mongod --dbpath "C:\\data\\db"`);
					console.error(`   └─ Restart this application\n`);
					console.error(`   Option 2: Fix MongoDB Atlas Connection`);
					console.error(`   ├─ Go to: httpss://cloud.mongodb.com/v2`);
					console.error(`   ├─ Select cluster0`);
					console.error(`   ├─ Go to Network Access → IP Whitelist`);
					console.error(`   ├─ Add your current IP address`);
					console.error(`   └─ Restart this application\n`);
				}
				
				throw error;
			}
		}
	}
};

module.exports = { connectWithRetry, ensureConnection };
