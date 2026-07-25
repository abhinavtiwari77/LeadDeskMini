const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Admin = require('../models/Admin');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/leaddesk_mini';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB');

    const email = process.env.ADMIN_EMAIL || 'admin@leaddesk.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin@123456';

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log(`[Seed] Admin user ${email} already exists.`);
    } else {
      await Admin.create({ email, password });
      console.log(`[Seed] Admin user ${email} created successfully!`);
    }

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedAdmin();
