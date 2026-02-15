require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;

console.log('Connecting to:', uri);

const adminSchema = new mongoose.Schema({
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    mobileNumber: Number,
    role: Number
}, { collection: 'admins' });

const Admin = mongoose.model('Admin', adminSchema);

(async () => {
  try {
    await mongoose.connect(uri);
    const admins = await Admin.find({}).lean();
    console.log('Admin Data:', JSON.stringify(admins, null, 2));
    await mongoose.disconnect();
  } catch(err) {
    console.error('Error:', err.message);
  }
})();
