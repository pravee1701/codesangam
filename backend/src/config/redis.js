import redis from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1', 
    port: process.env.REDIS_PORT || 6379,
  },
  password: process.env.REDIS_PASSWORD || null, 
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

(async () => {
  try {
    await client.connect(); 
    console.log('Redis client connected successfully');
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
    process.exit(1); 
  }
})();

export default client;