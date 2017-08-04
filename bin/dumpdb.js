'use strict';

const redis = require('../lib/redis');

redis.get('onliner', (err, data) => {
    console.log(data);
    redis.quit();
})