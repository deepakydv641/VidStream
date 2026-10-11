import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let client = null;
let redisEnabled = false;
let errorLogged = false;

// Only initialize Redis if REDIS_PASSWORD is provided
if (process.env.REDIS_PASSWORD) {
    try {
        client = createClient({
            username: 'default',
            password: process.env.REDIS_PASSWORD,
            socket: {
                host: 'redis-17096.crce263.ap-south-1-1.ec2.cloud.redislabs.com',
                port: 17096,
                keepAlive: 10000,
                reconnectStrategy: (retries) => {
                    if (retries > 10) {
                        if (!errorLogged) {
                            console.log('⚠️  Redis unavailable - running without caching');
                            errorLogged = true;
                        }
                        redisEnabled = false;
                        return new Error('Max reconnect attempts reached');
                    }
                    const delay = Math.min(retries * 200, 3000);
                    return delay;
                }
            }
        });

        client.on('error', () => {}); // Suppress repeated errors
        client.on('connect', () => {
            console.log('✓ Redis connected');
            redisEnabled = true;
        });

        // Attempt connection but don't await it to avoid blocking
        client.connect().catch(() => {
            if (!errorLogged) {
                console.log('⚠️  Redis unavailable - running without caching');
                errorLogged = true;
            }
            redisEnabled = false;
        });
    } catch (error) {
        if (!errorLogged) {
            console.log('⚠️  Redis unavailable - running without caching');
            errorLogged = true;
        }
        redisEnabled = false;
    }
}

// Export helper functions with graceful degradation
export const redisSet = async (key, value, options) => {
    if (!redisEnabled || !client) {
        return null;
    }
    try {
        if (!client.isOpen) {
            await client.connect();
        }
        return await client.set(key, value, options);
    } catch (error) {
        console.log('Redis set error:', error.message);
        return null;
    }
};

export const redisGet = async (key) => {
    if (!redisEnabled || !client) {
        return null;
    }
    try {
        if (!client.isOpen) {
            await client.connect();
        }
        return await client.get(key);
    } catch (error) {
        console.log('Redis get error:', error.message);
        return null;
    }
};

export const redisDel = async (key) => {
    if (!redisEnabled || !client) {
        return null;
    }
    try {
        if (!client.isOpen) {
            await client.connect();
        }
        return await client.del(key);
    } catch (error) {
        console.log('Redis del error:', error.message);
        return null;
    }
};

export const isRedisEnabled = () => redisEnabled;

export default client;
export { client as redisClient };
