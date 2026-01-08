/**
 * Setup Test Data Script
 * Creates test organizer and user accounts for testing
 * 
 * Run with: node setup-test-data.js
 * 
 * This will create:
 * - Test Organizer: host@test.com / Host123!
 * - Test User: lguest@test.com / Lguest123!
 */

const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Setting up test data...\n');
console.log('This will create test accounts for automated testing.\n');

const apiDir = path.join(__dirname, 'api');
const scriptPath = path.join(apiDir, 'src', 'scripts', 'addLguestAndHostUsers.js');

console.log(`Running: node ${scriptPath}\n`);

exec(`cd "${apiDir}" && node src/scripts/addLguestAndHostUsers.js`, (error, stdout, stderr) => {
    if (error) {
        console.error(`❌ Error: ${error.message}`);
        return;
    }
    
    if (stderr) {
        console.error(`⚠️  Warnings: ${stderr}`);
    }
    
    console.log(stdout);
    console.log('\n✅ Test data setup complete!');
    console.log('\n📝 Test Credentials:');
    console.log('   Organizer: host@test.com / Host123!');
    console.log('   User: lguest@test.com / Lguest123!');
    console.log('\nNow you can run: node run-tests.js');
});

