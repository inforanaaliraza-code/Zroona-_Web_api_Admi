const bcrypt = require('bcryptjs');

async function main() {
  const [,, hash, password] = process.argv;
  if (!hash || !password) {
    console.error('Usage: node test-compare-password.js <hash> <password>');
    process.exit(2);
  }

  try {
    const match = await bcrypt.compare(password, hash);
    console.log('match:', match);
    process.exit(match ? 0 : 1);
  } catch (err) {
    console.error('Error comparing:', err);
    process.exit(3);
  }
}

main();
