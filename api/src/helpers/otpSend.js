
const AdminService = require('../services/adminService.js');
const organizerService = require('../services/organizerService.js');
const UserService = require('../services/userService.js');

const otpRequestTimes = new Map();
const sendOtp = async (_id,role) => {

    const service = role == 1 ? UserService : (role == 3 ? AdminService:organizerService); 

    const user = await service.FindOneService({ _id });

    if (!user) {
        throw new Error('user not exist');
    }
    const number = user.phone_number;

    
    const otp = 123456

    let currentTime = Date.now();
    let lastRequestTime = otpRequestTimes.get(number);

    if (lastRequestTime && (currentTime - lastRequestTime < 30000)) {
        throw new Error('Please wait 30 seconds before requesting another OTP');
    }

    otpRequestTimes.set(number, currentTime);


    return otp
}

module.exports = sendOtp;
