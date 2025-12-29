const { connectWithRetry } = require("../config/database");
const Event = require("../models/eventModel");

/**
 * One-off script to delete events whose name contains "jhb"
 *
 * Usage (from api folder):
 *   node src/scripts/deleteJhbEvent.js
 */
const run = async () => {
  try {
    await connectWithRetry();

    const query = { event_name: /jhb/i };

    const events = await Event.find(query);
    console.log(`Found ${events.length} event(s) matching "jhb":`);
    events.forEach((e) =>
      console.log(` - ${e._id.toString()} :: ${e.event_name}`)
    );

    if (events.length === 0) {
      console.log("Nothing to delete.");
      process.exit(0);
    }

    const result = await Event.deleteMany(query);
    console.log(`Deleted ${result.deletedCount} event(s) from DB.`);
    process.exit(0);
  } catch (err) {
    console.error("Error deleting jhb events:", err);
    process.exit(1);
  }
};

run();


