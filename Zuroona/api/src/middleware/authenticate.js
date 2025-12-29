const dotenv = require("dotenv");
const Response = require("../helpers/response");
const { verifyToken } = require("../helpers/generateToken.js");
const adminService = require("../services/adminService.js");
const UserService = require("../services/userService.js");
const organizerService = require("../services/organizerService.js");
const resp_messages = require("../helpers/resp_messages.js");

dotenv.config();

const Authenticate = {
	/**
	 * Extracts userId and role from JWT token without database validation
	 * Lightweight middleware for routes that only need userId but don't require full authentication
	 */
	ExtractUserIdFromToken: async (req, res, next) => {
		let token = req.headers["authorization"];

		// If token not found, continue but userId will be undefined
		if (!token) {
			req.userId = null;
			req.role = null;
			return next();
		}

		// Remove 'Bearer ' prefix if present
		if (token.startsWith("Bearer ")) {
			token = token.slice(7);
		}

		try {
			const decoded = verifyToken(token);
			req.userId = decoded.userId;
			req.role = decoded.role;
			next();
		} catch (error) {
			// Don't return error, just set userId to null and continue
			console.error("Token extraction error:", error.message);
			req.userId = null;
			req.role = null;
			next();
		}
	},

	/**
	 * Utility function to apply ExtractUserIdFromToken middleware to multiple routes at once
	 * @param {object} router - Express router instance
	 * @param {string[]} routes - Array of route paths
	 * @param {string} method - HTTP method (get, post, put, delete)
	 */
	applyUserIdExtraction: (router, routes, method = "get") => {
		if (!Array.isArray(routes)) {
			routes = [routes];
		}

		routes.forEach((route) => {
			const existingRoute = router.stack.find(
				(layer) =>
					layer.route &&
					layer.route.path === route &&
					layer.route.methods[method]
			);

			if (existingRoute) {
				// Extract the existing handler
				const originalHandlers = existingRoute.route.stack.map(
					(layer) => layer.handle
				);

				// Clear route
				existingRoute.route.stack = [];

				// Add the middleware and original handlers back
				existingRoute.route[method](
					Authenticate.ExtractUserIdFromToken,
					...originalHandlers
				);
			} else {
				// If route doesn't exist yet, we can't modify it
				console.warn(
					`Route ${method.toUpperCase()} ${route} not found, can't apply middleware`
				);
			}
		});

		return router;
	},

	AuthenticateUser: async (req, res, next) => {
		let token = req.headers["authorization"];

		if (!token) {
			return Response.badRequestResponse(res, "Token Not Found (:");
		}

		// Remove 'Bearer ' prefix if present
		if (token.startsWith("Bearer ")) {
			token = token.slice(7);
		}

		try {
			const decoded = verifyToken(token, process.env.SECRET_KEY);

			req.userId = decoded.userId;
			req.role = decoded.role;

			const service =
				req.role === 1
					? UserService
					: req.role === 2
					? organizerService
					: adminService;

			const user = await service.FindOneService({ _id: req.userId });

			if (!user) {
				return Response.unauthorizedResponse(
					res,
					null,
					401,
					"Unauthorized user!"
				);
			}
			req.lang = user.language || "en";
			req.user = user;
			next();
		} catch (error) {
			console.error("Token verification error:", error.message);
			return Response.badRequestResponse(res, "Invalid Token (:");
		}
	},

	AuthenticateAdmin: (req, res, next) => {
		if (req.role === 3) {
			next();
		} else {
			return Response.badRequestResponse(
				res,
				resp_messages(req.lang).notAuthorizedAdmin
			);
		}
	},

	AuthenticateOrganizer: (req, res, next) => {
		if (req.role === 2) {
			next();
		} else {
			return Response.badRequestResponse(
				res,
				resp_messages(req.lang).notAuthorizedOrganizer
			);
		}
	},
};

module.exports = Authenticate;
