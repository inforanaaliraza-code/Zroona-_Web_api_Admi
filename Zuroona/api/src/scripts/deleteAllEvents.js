require('dotenv').config();
const { connectWithRetry } = require("../config/database");
const Event = require("../models/eventModel");
const BookEvent = require("../models/eventBookModel");

/**
 * Script to delete ALL events from the database
 * This will delete:
 * - All events (completed, pending, rejected, upcoming)
 * - All related bookings
 * 
 * Usage (from api folder):
 *   node src/scripts/deleteAllEvents.js
 */
const run = async () => {
  try {
    console.log("=".repeat(60));
    console.log("DELETING ALL EVENTS FROM DATABASE");
    console.log("=".repeat(60));
    
    await connectWithRetry();
    console.log("✓ Connected to database");

    // Count events before deletion
    const eventCount = await Event.countDocuments({});
    console.log(`\n📊 Found ${eventCount} event(s) in database`);

    if (eventCount === 0) {
      console.log("✓ No events to delete. Database is already clean.");
      process.exit(0);
    }

    // Count bookings before deletion
    const bookingCount = await BookEvent.countDocuments({});
    console.log(`📊 Found ${bookingCount} booking(s) in database`);

    // Delete all bookings first (to avoid foreign key issues)
    let bookingResult = { deletedCount: 0 };
    if (bookingCount > 0) {
      console.log("\n🗑️  Deleting all bookings...");
      bookingResult = await BookEvent.deleteMany({});
      console.log(`✓ Deleted ${bookingResult.deletedCount} booking(s)`);
    }

    // Delete all events
    console.log("\n🗑️  Deleting all events...");
    const eventResult = await Event.deleteMany({});
    console.log(`✓ Deleted ${eventResult.deletedCount} event(s)`);

    // Verify deletion
    const remainingEvents = await Event.countDocuments({});
    const remainingBookings = await BookEvent.countDocuments({});

    console.log("\n" + "=".repeat(60));
    console.log("DELETION COMPLETE");
    console.log("=".repeat(60));
    console.log(`✓ Events deleted: ${eventResult.deletedCount}`);
    console.log(`✓ Bookings deleted: ${bookingCount > 0 ? bookingResult.deletedCount : 0}`);
    console.log(`✓ Remaining events: ${remainingEvents}`);
    console.log(`✓ Remaining bookings: ${remainingBookings}`);
    console.log("=".repeat(60));

    process.exit(0);
  } catch (err) {
    console.error("\n❌ Error deleting events:", err);
    console.error(err.stack);
    process.exit(1);
  }
};

run();

