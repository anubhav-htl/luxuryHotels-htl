import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Admin from '../models/admin.js';
import db from '../config/db.js';

const resetAdminPassword = async () => {
  try {
    const admin = await Admin.findOne({ email: 'matakoyaruto@going.com' });
    if (!admin) {
      console.log('Admin user not found');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('lambalolo6969', salt); 

    admin.password = hashedPassword;
    await admin.save();

    console.log('Admin password reset successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting admin password:', error);
    process.exit(1);
  }
}

resetAdminPassword();