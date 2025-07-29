import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config = {
  development: {
    username: process.env.TIMESERIES_DB_USER || 'handit',
    password: process.env.TIMESERIES_DB_PASSWORD || 'handit',
    database: process.env.HANDIT_DB_NAME || 'handit_api',
    host: process.env.TIMESERIES_DB_HOST || 'localhost',
    dialect: 'postgres',
  },
  test: {
    username: process.env.TIMESERIES_DB_USER || 'handit',
    password: process.env.TIMESERIES_DB_PASSWORD || 'handit',
    database: process.env.HANDIT_DB_NAME_TEST || 'handit_api_test',
    host: process.env.TIMESERIES_DB_HOST || 'localhost',
    dialect: 'postgres',
  },
  production: {
    username: process.env.TIMESERIES_DB_USER || 'handit',
    password: process.env.TIMESERIES_DB_PASSWORD || 'handit',
    database: process.env.HANDIT_DB_NAME || 'handit_api',
    host: process.env.TIMESERIES_DB_HOST || 'localhost',
    dialect: 'postgres',
  }
};

export default config;
