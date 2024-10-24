import dotenv from 'dotenv';
dotenv.config();

const config = {
  development: {
    db: process.env.DB_URL_DEVELOPMENT,
    backend: process.env.BACKEND,
    frontend: process.env.FRONTEND,
  },
  staging: {
    db: process.env.MONGODB_URI,
    backend: process.env.STAGING_BACKEND,
    frontend: process.env.STAGING_FRONTEND,
  },
  production: {
    //db: 'mongodb+srv://dev:dev123@cluster0.6pqk0.mongodb.net/',
    db: 'mongodb+srv://anubhav:luci%40123@cluster0.iwca8.mongodb.net/luxuryHotels',
    backend: process.env.BACKEND,
    frontend: process.env.FRONTEND,
  },
  test: {
    db: process.env.DB_URL_TEST,
  },
};

export default config;
