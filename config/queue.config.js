const Redis = require('ioredis');

const {
    REDIS_URL,
    REDIS_HOST,
    REDIS_PASSWORD,
    REDIS_PORT
} = process.env

const client = new Redis(REDIS_URL);
const subscriber = new Redis(REDIS_URL);

const opts = {
    createClient: function (type) {
        switch (type) {
            case 'client':
                return client;
            case 'subscriber':
                return subscriber;
            default:
                return new Redis(REDIS_URL);
        }
    }
}

module.exports = opts