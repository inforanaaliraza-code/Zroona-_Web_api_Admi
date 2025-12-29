const admin = require('firebase-admin');
const serviceAccount = require('./jeena-e9c10-firebase-adminsdk-2osts-63207acc62.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
