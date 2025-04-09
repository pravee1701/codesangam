import redisClient from "../config/redis.js";

export const cacheData = async (key, value, expiryInSeconds) => {
    await redisClient.set(key, JSON.stringify(value), {EX: expiryInSeconds});
}

export const getCachedData = async (key) => {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data): null;
}

export const deleteCachedData = async (key) => {
    await redisClient.del(key);
}