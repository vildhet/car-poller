'use strict';

const redis = require('../lib/redis');

redis.del('onliner', () => {
    redis.quit();
});