'use strict';

const async = require('async');
const redis = require('../lib/redis');

async.each(['avby', 'onliner'], (key, next) => {
    redis.del(key, next);
}, (err) => {
    redis.quit();
});

