const mongoose = require("mongoose");

const connectWithRetry = async (retries = 5, interval = 5000) => {
	const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb+srv://aditya:1234@cluster0.jw8wy.mongodb.net/jeena";

	const options = {
		serverSelectionTimeoutMS: 15000,
		socketTimeoutMS: 45000,
		connectTimeoutMS: 15000,
		maxPoolSize: 50,
		minPoolSize: 10,
		autoIndex: true,
		family: 4, // Use IPv4, skip trying IPv6
	};

	for (let i = 0; i < retries; i++) {
		try {
			await mongoose.connect(mongoURI, options);

			// Add connection event listeners
			mongoose.connection.on("error", (err) => {
				console.error("MongoDB connection error:", err);
				if (err.name === "MongoNetworkError") {
					setTimeout(
						() => connectWithRetry(retries, interval),
						interval
					);
				}
			});

			mongoose.connection.on("disconnected", () => {
				console.warn(
					"MongoDB disconnected. Attempting to reconnect..."
				);
				setTimeout(() => connectWithRetry(retries, interval), interval);
			});

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

module.exports = { connectWithRetry };
