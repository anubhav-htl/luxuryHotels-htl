import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from './config.js';

dotenv.config();

const env = process.env.NODE_ENV;
const dbUrl = config[env].db;
console.log(dbUrl);
mongoose.connect(dbUrl);

mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${dbUrl}`);
});

mongoose.connection.on('error', (err) => {
  console.error(`Mongoose connection error:`, err);
});

mongoose.connection.on('disconnected', () => {
  console.log(`Mongoose disconnected`);
});

export default mongoose;