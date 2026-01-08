/**
 * Add Test Earnings to Organizer Wallet
 * Adds dummy earnings for withdrawal testing
 */

const { exec } = require('child_process');
const path = require('path');

console.log('💰 Adding test earnings to organizer wallet...\n');
console.log('Running script from api directory...\n');

const apiDir = path.join(__dirname, 'api');
const scriptContent = `
require('dotenv').config();
const { connectWithRetry } = require('./src/config/database');
const WalletService = require('./src/services/walletService');
const Organizer = require('./src/models/organizerModel');
const TransactionService = require('./src/services/recentTransaction');

(async () => {
    try {
        await connectWithRetry();
        console.log('✅ Connected to database\\n');

        const organizer = await Organizer.findOne({ email: 'host@test.com' });
        if (!organizer) {
            console.log('❌ Test organizer not found.');
            process.exit(1);
        }

        let wallet = await WalletService.FindOneService({ organizer_id: organizer._id });
        if (!wallet) {
            wallet = await WalletService.CreateService({
                organizer_id: organizer._id,
                total_amount: 0
            });
        }

        const testEarnings = 500;
        wallet.total_amount = (wallet.total_amount || 0) + testEarnings;
        await wallet.save();

        await TransactionService.CreateService({
            organizer_id: organizer._id,
            amount: testEarnings,
            type: 1,
            status: 1,
            currency: 'SAR'
        });

        console.log(\`✅ Added \${testEarnings} SAR to wallet\`);
        console.log(\`   New balance: \${wallet.total_amount} SAR\\n\`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
})();
`;

const fs = require('fs');
const tempScript = path.join(apiDir, 'temp-add-earnings.js');
fs.writeFileSync(tempScript, scriptContent);

exec(`cd "${apiDir}" && node temp-add-earnings.js`, (error, stdout, stderr) => {
    if (stderr) console.error(stderr);
    console.log(stdout);
    // Clean up
    try {
        fs.unlinkSync(tempScript);
    } catch (e) {}
    if (error) process.exit(1);
});

async function addTestEarnings() {
    try {
        console.log('💰 Adding test earnings to organizer wallet...\n');
        
        await connectWithRetry();
        console.log('✅ Connected to database\n');

        // Find test organizer
        const organizer = await Organizer.findOne({ email: 'host@test.com' });
        
        if (!organizer) {
            console.log('❌ Test organizer not found. Run setup-test-data.js first.');
            process.exit(1);
        }

        console.log(`Found organizer: ${organizer.first_name} ${organizer.last_name} (${organizer._id})\n`);

        // Get or create wallet
        let wallet = await WalletService.FindOneService({
            organizer_id: organizer._id
        });

        if (!wallet) {
            console.log('Creating wallet...');
            wallet = await WalletService.CreateService({
                organizer_id: organizer._id,
                total_amount: 0
            });
        }

        // Add test earnings (500 SAR)
        const testEarnings = 500;
        wallet.total_amount = (wallet.total_amount || 0) + testEarnings;
        await wallet.save();

        // Create a test transaction
        await TransactionService.CreateService({
            organizer_id: organizer._id,
            amount: testEarnings,
            type: 1, // Earnings
            status: 1, // Completed
            currency: 'SAR'
        });

        console.log(`✅ Added ${testEarnings} SAR to wallet`);
        console.log(`   New balance: ${wallet.total_amount} SAR\n`);
        console.log('✅ Test earnings added successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

addTestEarnings();

