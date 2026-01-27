const router = require("express").Router();
const fileUpload = require("express-fileupload");
const commonController = require("../controllers/commonController");
const userRoutes = require("./userRoutes");
const organizerRoutes = require("./organizerRoutes");
const commonRoutes = require("./commonRoutes");
const landingPageRoutes = require("./landingPageRoutes");
const userReviewRoutes = require("./userReviewRoutes");
const locationRoutes = require("./locationRoutes");

router.use("/", commonRoutes);
router.use("/user", userRoutes);
router.use("/organizer/", organizerRoutes);
router.use("/landing", landingPageRoutes);
router.use("/user-reviews", userReviewRoutes);
router.use("/location", locationRoutes);

// Note: uploadFile endpoint is handled by commonRoutes and userRoutes
// This route is kept as a fallback but should use the global fileUpload middleware from app.js

module.exports = router;
