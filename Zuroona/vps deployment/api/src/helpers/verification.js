const AdminService = require("../services/adminService.js");
const organizerService = require("../services/organizerService.js");
const UserService = require("../services/userService.js");
const verifyPhoneOtp = (userId, otp, role) => {
	const service =
		role == 1 ? UserService : role == 2 ? organizerService : AdminService;
	return new Promise(async (resolve, reject) => {
		service
			.FindOneService({ _id: userId })
			.then(async (user) => {
				if (user.otp == otp) {
					resolve(true);
					user.save();
				} else {
					reject("incorrect otp");
				}
			})
			.catch((error) => {
				console.log(error);
				reject("failed to verified");
			});
	});
};

module.exports = { verifyPhoneOtp };
