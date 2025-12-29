require('dotenv').config();
const { connectWithRetry } = require("../config/database");
const User = require("../models/userModel");
const Organizer = require("../models/organizerModel");
const HashPassword = require("../helpers/hashPassword");

/**
 * Script to add new testing users: lguest and host
 * 
 * Usage (from api folder):
 *   node src/scripts/addLguestAndHostUsers.js
 */

const LGUEST_CREDENTIALS = {
  first_name: "Lguest",
  last_name: "Test",
  email: "lguest@test.com",
  phone_number: 501111111, // Saudi phone number (without country code)
  country_code: "+966", // Saudi Arabia country code
  password: "Lguest123!",
  gender: 1, // 1 = Male, 2 = Female, 3 = Other
  date_of_birth: new Date("1990-01-01"),
  role: 1, // 1 = Guest
  otp: "123456", // OTP stored in database
  is_verified: true,
  registration_step: 2, // Complete registration
  isActive: 1,
  is_delete: 0,
  language: "en"
};

const HOST_CREDENTIALS = {
  first_name: "Host",
  last_name: "Test",
  email: "host@test.com",
  phone_number: 502222222, // Saudi phone number (without country code)
  country_code: "+966", // Saudi Arabia country code
  password: "Host123!",
  gender: 1, // 1 = Male, 2 = Female, 3 = Other
  date_of_birth: new Date("1985-05-15"),
  role: 2, // 2 = Host/Organizer
  bio: "I am a test host organizer. I love creating amazing events for people to enjoy!",
  otp: "123456", // OTP stored in database
  is_verified: true,
  registration_step: 4, // Complete registration (all 4 steps done)
  isActive: 1,
  is_approved: 2, // 2 = approved
  language: "en"
};

const run = async () => {
  try {
    console.log("=".repeat(60));
    console.log("ADDING NEW TEST USERS: lguest and host");
    console.log("=".repeat(60));
    
    await connectWithRetry();
    console.log("✓ Connected to database\n");

    // Check if users already exist
    const existingLguest = await User.findOne({ email: LGUEST_CREDENTIALS.email });
    const existingHost = await Organizer.findOne({ email: HOST_CREDENTIALS.email });

    if (existingLguest) {
      console.log("⚠️  lguest user already exists with email:", LGUEST_CREDENTIALS.email);
      console.log("   Deleting existing user...");
      await User.deleteOne({ _id: existingLguest._id });
      console.log("   ✓ Deleted existing lguest user\n");
    }

    if (existingHost) {
      console.log("⚠️  host user already exists with email:", HOST_CREDENTIALS.email);
      console.log("   Deleting existing user...");
      await Organizer.deleteOne({ _id: existingHost._id });
      console.log("   ✓ Deleted existing host user\n");
    }

    // Create lguest User
    console.log("👤 Creating lguest User...");

    const hashedLguestPassword = await HashPassword.hashPassword(LGUEST_CREDENTIALS.password);
    const lguestData = {
      ...LGUEST_CREDENTIALS,
      password: hashedLguestPassword
    };

    const lguest = await User.create(lguestData);
    console.log(`✓ lguest user created successfully!`);
    console.log(`   User ID: ${lguest._id}`);
    console.log(`   Name: ${lguest.first_name} ${lguest.last_name}`);
    console.log(`   Email: ${lguest.email}`);

    // Create Host/Organizer User
    console.log("\n🏠 Creating host User...");

    const hashedHostPassword = await HashPassword.hashPassword(HOST_CREDENTIALS.password);
    const hostData = {
      ...HOST_CREDENTIALS,
      password: hashedHostPassword
    };

    const host = await Organizer.create(hostData);
    console.log(`✓ host user created successfully!`);
    console.log(`   Organizer ID: ${host._id}`);
    console.log(`   Name: ${host.first_name} ${host.last_name}`);
    console.log(`   Email: ${host.email}`);

    // Display login credentials
    console.log("\n" + "=".repeat(60));
    console.log("LOGIN CREDENTIALS");
    console.log("=".repeat(60));
    console.log("\n👤 LGUEST USER:");
    console.log(`   Email: ${LGUEST_CREDENTIALS.email}`);
    console.log(`   Password: ${LGUEST_CREDENTIALS.password}`);
    console.log(`   Phone: ${LGUEST_CREDENTIALS.country_code}${LGUEST_CREDENTIALS.phone_number}`);
    console.log(`   OTP: ${LGUEST_CREDENTIALS.otp} (stored in database)`);
    console.log(`   User ID: ${lguest._id}`);
    
    console.log("\n🏠 HOST USER:");
    console.log(`   Email: ${HOST_CREDENTIALS.email}`);
    console.log(`   Password: ${HOST_CREDENTIALS.password}`);
    console.log(`   Phone: ${HOST_CREDENTIALS.country_code}${HOST_CREDENTIALS.phone_number}`);
    console.log(`   OTP: ${HOST_CREDENTIALS.otp} (stored in database)`);
    console.log(`   Organizer ID: ${host._id}`);
    console.log("=".repeat(60));

    console.log("\n✅ Test users created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Error creating test users:", err);
    console.error(err.stack);
    process.exit(1);
  }
};

run();
