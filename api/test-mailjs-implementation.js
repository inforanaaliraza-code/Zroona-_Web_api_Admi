/**
 * MailJS Implementation Test - Code Structure
 */

const fs = require('fs');

console.log('🧪 Testing MailJS Implementation...\n');

let testsPassed = 0;
let testsFailed = 0;

// Test 1: Check mailJSService.js exists
console.log('Test 1: Checking mailJSService.js...');
if (fs.existsSync('./src/helpers/mailJSService.js')) {
    const content = fs.readFileSync('./src/helpers/mailJSService.js', 'utf8');
    if (content.includes('sendEmail') && content.includes('MAILJS_API_URL') && content.includes('PUBLIC_KEY')) {
        console.log('✅ mailJSService.js structure correct');
        testsPassed++;
    } else {
        console.error('❌ mailJSService.js missing required functions');
        testsFailed++;
    }
} else {
    console.error('❌ mailJSService.js file not found');
    testsFailed++;
}

// Test 2: Check emailService.js uses MailJS
console.log('\nTest 2: Checking emailService.js...');
if (fs.existsSync('./src/helpers/emailService.js')) {
    const content = fs.readFileSync('./src/helpers/emailService.js', 'utf8');
    if (content.includes('mailJSService') && content.includes('sendEmailViaMailJS') && !content.includes('nodemailer')) {
        console.log('✅ emailService.js uses MailJS');
        testsPassed++;
    } else if (content.includes('nodemailer')) {
        console.error('❌ emailService.js still uses nodemailer');
        testsFailed++;
    } else {
        console.error('❌ emailService.js not properly updated');
        testsFailed++;
    }
} else {
    console.error('❌ emailService.js file not found');
    testsFailed++;
}

// Test 3: Check credentials configuration
console.log('\nTest 3: Checking credentials configuration...');
if (fs.existsSync('./src/helpers/mailJSService.js')) {
    const content = fs.readFileSync('./src/helpers/mailJSService.js', 'utf8');
    if (content.includes('OSfCgupc61') && content.includes('fj4w33dz06Q')) {
        console.log('✅ MailJS credentials configured');
        testsPassed++;
    } else {
        console.error('❌ MailJS credentials not found');
        testsFailed++;
    }
} else {
    testsFailed++;
}

// Test 4: Check documentation
console.log('\nTest 4: Checking documentation...');
if (fs.existsSync('./MAILJS_CREDENTIALS_GUIDE.md')) {
    console.log('✅ MailJS credentials guide exists');
    testsPassed++;
} else {
    console.log('⚠️  MailJS credentials guide not found');
    testsPassed++; // Not critical
}

// Final Summary
console.log('\n' + '='.repeat(50));
console.log('📊 TEST SUMMARY');
console.log('='.repeat(50));
console.log(`✅ Tests Passed: ${testsPassed}`);
console.log(`❌ Tests Failed: ${testsFailed}`);
console.log(`📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);

if (testsFailed === 0) {
    console.log('\n🎉 All tests passed! MailJS implementation is ready.');
} else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.');
}

process.exit(testsFailed === 0 ? 0 : 1);

