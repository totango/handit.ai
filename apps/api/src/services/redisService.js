import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URL, {
  connectTimeout: 5000, // 5 seconds
  commandTimeout: 5000, // 5 seconds
  maxRetriesPerRequest: 1,
  retryStrategy: (times) => {
    if (times > 3) {
      console.error('Redis connection failed after 3 retries');
      return null; // stop retrying
    }
    return Math.min(times * 100, 3000);
  },
  enableOfflineQueue: false
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err.message);
});

redisClient.on('connect', () => {
  console.log('Redis connected successfully');
});

let isRedisConnected = false;

redisClient.on('ready', () => {
  isRedisConnected = true;
});

redisClient.on('end', () => {
  isRedisConnected = false;  
});

export const redisService = {
  async get(key) {
    try {
      if (!isRedisConnected) {
        console.warn('Redis not connected, returning null');
        return null;
      }
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  },

  async set(key, value, ttl = 86400) {
    try {
      if (!isRedisConnected) {
        console.warn('Redis not connected, skipping set');
        return false;
      }
      // set expiration time (default 1 day)
      await redisClient.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Redis set error:', error);
      return false;
    }
  },

  async delete(key) {
    try {
      if (!isRedisConnected) {
        console.warn('Redis not connected, skipping delete');
        return false;
      }
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.error('Redis delete error:', error);
      return false;
    }
  },

  async deletePattern(pattern) {
    try {
      if (!isRedisConnected) {
        console.warn('Redis not connected, skipping deletePattern');
        return false;
      }
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
      return true;
    } catch (error) {
      console.error('Redis delete pattern error:', error);
      return false;
    }
  }
}; 