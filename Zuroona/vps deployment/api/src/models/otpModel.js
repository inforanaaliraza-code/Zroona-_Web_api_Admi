const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ["signup", "login", "user_otp", "organizer_otp", "admin_otp"],
      required: true,
    },
    role: {
      type: Number, // 1 = User, 2 = Organizer, 3 = Admin
    },
    userId: {
      type: Schema.Types.ObjectId,
      refPath: "roleModel",
    },
    roleModel: {
      type: String,
      enum: ["User", "Organizer", "Admin"],
    },
  },
  {
    timestamps: true,
  }
);

// TTL index - delete OTP documents automatically after 1 hour
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 });

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;

