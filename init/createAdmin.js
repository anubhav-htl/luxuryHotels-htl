import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Admin from '../models/admin.js';
import db from '../config/db.js';
import chalk from 'chalk';

const createAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ username: 'matakoyaruto' });
    if (existingAdmin) {
      console.log(chalk.red('Admin user already exists'));
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('rutomustgo', salt);


    const admin = new Admin({
      username: 'matakoyaruto',
      email: 'matakoyaruto@going.com',
      password: hashedPassword,
      permissions: {
        manage_users: true,
        view_reports: true,
        edit_content: true,
        delete_content: true,
        access_settings: true,
      },
    });

    await admin.save();
    console.log(chalk.green('Admin user created successfully'));
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(0);
  }
}

createAdmin();