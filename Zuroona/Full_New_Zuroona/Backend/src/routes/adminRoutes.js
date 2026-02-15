const router = require('express').Router();
const fileUpload = require('express-fileupload');
const adminController = require('../controllers/adminController');
const { AuthenticateUser, AuthenticateAdmin } = require('../middleware/authenticate.js');
const Validator = require('../middleware/validateMiddleware.js');
const { groupCategoryValidation } = require('../validations/eventValidation.js');

// auth routes

router.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
    createParentPath: true
}));

router.post("/login", adminController.adminLogin);


router.post("/forgot-password", adminController.forgotAdminPassword);
router.post("/reset-password", adminController.resetPassword); // Token-based, no auth required

router.use(AuthenticateUser, AuthenticateAdmin)

router.post('/change-password', adminController.changePassword);

router.post("/logout", adminController.adminLogout);

router.post("/category/add", adminController.categoryAdd);

router.get('/profile', adminController.adminProfile);

router.get('/user/list', adminController.userList);

router.get('/user/detail', adminController.userDetail);

router.get('/event/detail', adminController.eventDetail);

router.get('/organizer/list', adminController.organizerList);

router.get('/organizer/detail', adminController.organizerDetail);

router.put('/changeStatus', adminController.changeStatus);

router.patch('/changeOrganizerStatus', adminController.changeOrganizerStatus);

router.patch('/user/changeStatus', adminController.changeUserStatus);
router.put('/user/update', adminController.updateUser);
router.delete('/user/delete', adminController.deleteUser);

router.get('/cms/detail', adminController.getCms);

router.get('/eventList', adminController.eventList);

router.put('/cms/update', adminController.updateCms);

router.post('/group-category/add', Validator(groupCategoryValidation), adminController.addOrganizerGroupCategory)

router.get('/group-category/detail', adminController.groupCategoryDetail);

router.get('/event/group-category/detail', adminController.eventCategoryDetail);

router.put('/group-category/update', adminController.groupCategoryUpdate);

router.put('/event/group-category/update', adminController.eventCategoryUpdate);

router.delete('/event/group-category/delete', adminController.eventGroupCategoryDelete);

router.delete('/group-category/delete', adminController.groupCategoryDelete);

router.get('/group-category/list', adminController.categoryList);

router.get('/event/group-category/list', adminController.eventCategoryList);

router.post('/event/group-category/add', adminController.addEventCategory);

router.post('/notification/add', adminController.addNotification);

router.get('/notification/list', adminController.notificationList);

router.get('/organizer/withdrawalList', adminController.withdrawalList);

router.put("/withdrawalStatus", adminController.withdrawalStatusUpdate);

router.get('/organizer/withdrawalStats', adminController.withdrawalStats);

// ===== REFUND MANAGEMENT =====
router.get("/refund/list", adminController.refundList); // Get refund requests list
router.get("/refund/detail", adminController.refundDetail); // Get refund request detail
router.put("/refund/update-status", adminController.refundStatusUpdate); // Update refund status

// ===== CAREER APPLICATION ROUTES =====
router.get("/career/applications", adminController.getCareerApplications); // Get all career applications
router.get("/career/application/detail", adminController.getCareerApplicationDetail); // Get application detail
router.put("/career/application/update-status", adminController.updateCareerApplicationStatus); // Update application status

// Event status change with email
router.put("/event/changeStatus", adminController.eventStatusChange);

// Admin Management CRUD
router.get("/admin/list", adminController.adminList);
router.get("/admin/detail", adminController.adminDetail);
router.post("/admin/create", adminController.adminCreate);
router.put("/admin/update", adminController.adminUpdate);
router.delete("/admin/delete", adminController.adminDelete);

// Wallet details
router.get("/wallet/stats", adminController.getWalletStats);
router.get("/wallet/details", adminController.walletDetails);

// Current admin profile
router.get("/admin/current", adminController.getCurrentAdmin);

// Admin notifications
router.get("/notifications", adminController.getAdminNotifications);

// Guest invoices/receipts management
router.get("/bookings/invoices/stats", adminController.getInvoiceStats);
router.get("/bookings/invoices", adminController.getAllBookingsWithInvoices);

// Cleanup duplicate bookings
router.post("/cleanup/duplicate-bookings", adminController.cleanupDuplicateBookings);

// Withdrawal Limits Management
router.put("/organizer/withdrawal-limits", adminController.updateWithdrawalLimits);
router.get("/organizer/withdrawal-limits", adminController.getWithdrawalLimits);

module.exports = router;