import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin', 'moderator'],
    default: 'admin'
  },
  permissions: {
    manage_users: { type: Boolean, default: false },
    view_reports: { type: Boolean, default: false },
    edit_content: { type: Boolean, default: false },
    delete_content: { type: Boolean, default: false },
    access_settings: { type: Boolean, default: false },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});;


const Admin = mongoose.model('Admin', adminSchema);

export default Admin;