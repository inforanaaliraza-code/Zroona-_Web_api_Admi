require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

// Load Admin model (relative to api root)
const Admin = require(path.join(__dirname, 'src', 'models', 'adminModel'));

const argv = process.argv.slice(2);
const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || argv[0];

if (!mongoURI) {
  console.error('ERROR: MongoDB URI not provided. Set MONGO_URI in .env or pass it as the first argument.');
  console.error('Usage: node check-admin-logins.js "<MONGO_URI>"');
  process.exit(2);
}

const targets = [
  { email: 'admin@pro.zuroona.sa', password: '@pro.zuroona55771' },
  { email: 'admin@zuroona.sa', password: '@zuroona55771' },
];

async function checkOne({ email, password }) {
  const emailLower = (email || '').toLowerCase().trim();
  console.log('\nChecking', emailLower);

  // Try exact lowercase lookup first
  let admin = await Admin.findOne({ email: emailLower }).lean();

  // If not found, try case-insensitive regex
  if (!admin) {
    admin = await Admin.findOne({ email: { $regex: `^${email}$`, $options: 'i' } }).lean();
  }

  if (!admin) {
    console.log('  Result: Admin user not found in database for', email);
    return { email, found: false, match: false };
  }

  const hashed = admin.password || '';
  if (!hashed) {
    console.log('  Result: Admin record found but no password hash present');
    return { email, found: true, match: false };
  }

  let match = false;
  try {
    match = await bcrypt.compare(password, hashed);
  } catch (err) {
    console.error('  Error comparing password:', err.message || err);
    return { email, found: true, match: false, error: err };
  }

  console.log('  Found admin id:', admin._id);
  console.log('  Password matches?:', match);
  return { email, found: true, match };
}

async function main() {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected.');

    const results = [];
    for (const t of targets) {
      // eslint-disable-next-line no-await-in-loop
      const r = await checkOne(t);
      results.push(r);
    }

    await mongoose.connection.close();
    console.log('\nAll checks complete. Summary:');
    results.forEach(r => console.log(`- ${r.email}: found=${r.found} match=${r.match}`));

    // Exit code: 0 if all matched, 1 otherwise
    const allMatched = results.every(r => r.found && r.match);
    process.exit(allMatched ? 0 : 1);
  } catch (err) {
    console.error('Fatal error:', err.message || err);
    try { await mongoose.connection.close(); } catch (e) {}
    process.exit(3);
  }
}

main();
