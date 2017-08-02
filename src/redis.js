'use strict';

const redis = require('redis');
const env = require('./env');

const client = redis.createClient(env.redisUrl);

client.on_connect('error', (error) => {
    console.error('Redis error: ' + error);
});

module.exports = client;