const selfsigned = require('selfsigned');
const fs = require('fs');
const path = require('path');

// Generate a self-signed certificate
const attrs = [{ name: 'commonName', value: 'localhost' }];
const pems = selfsigned.generate(attrs, { days: 365 });

// Save the private key
fs.writeFileSync(path.join(__dirname, 'key.pem'), pems.private);
console.log('Private key saved to certificates/key.pem');

// Save the certificate
fs.writeFileSync(path.join(__dirname, 'cert.pem'), pems.cert);
console.log('Certificate saved to certificates/cert.pem');

console.log('Self-signed certificates generated successfully!');
