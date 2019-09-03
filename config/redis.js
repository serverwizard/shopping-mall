const redis = require('redis');

const client = redis.createClient();

client.auth("", (err) => {
    console.log('redisClient.auth');
    if (err) throw err;
});

client.on('error', (err) => {
    console.log('Redis error: ' + err);
});

module.exports = client;


