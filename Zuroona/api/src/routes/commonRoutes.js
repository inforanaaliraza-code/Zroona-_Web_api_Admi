const router = require("express").Router();
const commonController = require("../controllers/commonController.js");
const _fileUpload = require("express-fileupload");
const _UserController = require("../controllers/userController.js");
const { ExtractUserIdFromToken } = require("../middleware/authenticate.js");

// Health check endpoint
router.get("/health", (req, res) => {
	res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// User info from token demonstration endpoint
router.get("/user-info", ExtractUserIdFromToken, (req, res) => {
	// Simple response showing the extracted userId from token (if available)
	res.status(200).json({
		userId: req.userId,
		role: req.role,
		isAuthenticated: req.userId !== null,
		message: req.userId
			? "User is authenticated"
			: "User is not authenticated or token is invalid",
	});
});

router.get("/get-s3-credentials", commonController.getS3Credentials);
// Note: fileUpload middleware is applied globally in app.js
router.post("/user/uploadFile", commonController.uploadFile);
// ========== AWS S3 VIEW ROUTE - COMMENTED OUT (using express.static for local files) ==========
// router.get("/s3/view", commonController.viewFile);
// Files are now served directly via express.static at /uploads/{path}
// ==================================================
router.get("/cms", commonController.getCms);
router.post("/dataAdd", commonController.staticDataAdd);

module.exports = router;
