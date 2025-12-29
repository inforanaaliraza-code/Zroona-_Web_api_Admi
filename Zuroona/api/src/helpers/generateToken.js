const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (userId, role) => {
	const token = jwt.sign({ userId, role }, process.env.SECRET_KEY);
	return token;
};

const verifyToken = (token) => {
	try {
		if (!token) {
			console.error("Token is undefined or null");
			throw new Error("Token is required");
		}

		if (typeof token !== "string") {
			console.error("Token is not a string:", typeof token);
			throw new Error("Token must be a string");
		}

		// Trim any whitespace
		token = token.trim();

		const decoded = jwt.verify(token, process.env.SECRET_KEY);
		return decoded;
	} catch (error) {
		console.error("Token verification failed:", error.message);
		throw error;
	}
};

module.exports = { generateToken, verifyToken };
