import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config = {
  development: {
    username: process.env.DB_USERNAME || 'handit',
    password: process.env.DB_PASSWORD || 'handit',
    database: process.env.DB_NAME || 'handit_api',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
  },
  test: {
    username: process.env.DB_USERNAME || 'handit',
    password: process.env.DB_PASSWORD || 'handit',
    database: process.env.DB_NAME_TEST || 'handit_api_test',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USERNAME || 'handit',
    password: process.env.DB_PASSWORD || 'handit',
    database: process.env.DB_NAME || 'handit_api',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
  }
};

export default config;
