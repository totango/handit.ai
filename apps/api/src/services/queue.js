// services/queue.js

import Bull from 'bull';
import dotenv from 'dotenv';

dotenv.config();

const metricQueue = new Bull('metricQueue', {
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || 6379,
  },
});

export { metricQueue };
