require('dotenv').config();
const { connectWithRetry } = require("../config/database");
const User = require("../models/userModel");
const Organizer = require("../models/organizerModel");
const HashPassword = require("../helpers/hashPassword");

/**
 * Script to create test Guest and Host users
 * 
 * Usage (from api folder):
 *   node src/scripts/createTestUsers.js
 */

const GUEST_CREDENTIALS = {
  first_name: "Test",
  last_name: "Guest",
  email: "guest@test.com",
  phone_number: 501234567, // Saudi phone number (without country code)
  country_code: "+966", // Saudi Arabia country code
  password: "Guest123!",
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
  first_name: "Test",
  last_name: "Host",
  email: "host@test.com",
  phone_number: 507654321, // Saudi phone number (without country code)
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
    console.log("CREATING TEST USERS");
    console.log("=".repeat(60));
    
    await connectWithRetry();
    console.log("✓ Connected to database\n");

    // Check if users already exist
    const existingGuest = await User.findOne({ email: GUEST_CREDENTIALS.email });
    const existingHost = await Organizer.findOne({ email: HOST_CREDENTIALS.email });

    // Delete existing users first
    console.log("🗑️  Deleting existing test users...");
    const deletedGuests = await User.deleteMany({ 
      $or: [
        { email: GUEST_CREDENTIALS.email },
        { phone_number: GUEST_CREDENTIALS.phone_number, country_code: GUEST_CREDENTIALS.country_code }
      ]
    });
    const deletedHosts = await Organizer.deleteMany({ 
      $or: [
        { email: HOST_CREDENTIALS.email },
        { phone_number: HOST_CREDENTIALS.phone_number, country_code: HOST_CREDENTIALS.country_code }
      ]
    });
    console.log(`✓ Deleted ${deletedGuests.deletedCount} existing guest user(s)`);
    console.log(`✓ Deleted ${deletedHosts.deletedCount} existing host user(s)\n`);

    // Create Guest User
    console.log("👤 Creating Guest User...");

    const hashedGuestPassword = await HashPassword.hashPassword(GUEST_CREDENTIALS.password);
    const guestData = {
      ...GUEST_CREDENTIALS,
      password: hashedGuestPassword
    };

    const guest = await User.create(guestData);
    console.log(`✓ Guest user created successfully!`);
    console.log(`   User ID: ${guest._id}`);
    console.log(`   Name: ${guest.first_name} ${guest.last_name}`);
    console.log(`   Email: ${guest.email}`);

    // Create Host/Organizer User
    console.log("\n🏠 Creating Host/Organizer User...");

    const hashedHostPassword = await HashPassword.hashPassword(HOST_CREDENTIALS.password);
    const hostData = {
      ...HOST_CREDENTIALS,
      password: hashedHostPassword
    };

    const host = await Organizer.create(hostData);
    console.log(`✓ Host user created successfully!`);
    console.log(`   Organizer ID: ${host._id}`);
    console.log(`   Name: ${host.first_name} ${host.last_name}`);
    console.log(`   Email: ${host.email}`);

    // Display login credentials
    console.log("\n" + "=".repeat(60));
    console.log("LOGIN CREDENTIALS");
    console.log("=".repeat(60));
    console.log("\n📱 GUEST USER:");
    console.log(`   Email: ${GUEST_CREDENTIALS.email}`);
    console.log(`   Password: ${GUEST_CREDENTIALS.password}`);
    console.log(`   Phone: ${GUEST_CREDENTIALS.country_code}${GUEST_CREDENTIALS.phone_number}`);
    console.log(`   OTP: ${GUEST_CREDENTIALS.otp} (stored in database)`);
    console.log(`   User ID: ${guest._id}`);
    
    console.log("\n🏠 HOST/ORGANIZER USER:");
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
