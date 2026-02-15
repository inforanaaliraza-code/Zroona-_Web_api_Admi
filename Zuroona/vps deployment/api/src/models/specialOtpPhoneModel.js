const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const specialOtpPhoneSchema = new Schema(
  {
    // Local phone number (last 9–10 digits without country code)
    localPhone: {
      type: String,
      required: true,
      unique: true,
    },
    // Optional country code (e.g. +966, +92)
    countryCode: {
      type: String,
    },
    // Optional description / label for easier debugging
    label: {
      type: String,
      default: "Special fixed-OTP phone",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const SpecialOtpPhone = mongoose.model("SpecialOtpPhone", specialOtpPhoneSchema);

module.exports = SpecialOtpPhone;

