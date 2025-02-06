require('dotenv').config();
const apicache = require('apicache');
const redis = require('redis');
const {
    REDIS_URL,
    REDIS_HOST,
    REDIS_PASSWORD,
    REDIS_PORT
} = process.env

module.exports = {
    config: apicache.options({
        headers: {
            'cache-control': 'no-cache',
        },
        redisClient: redis.createClient(REDIS_URL),
        trackPerformance: true,
        respectCacheControl: false
    }).middleware,
    clear: (target) => apicache.clear(target),
    instance: apicache
}