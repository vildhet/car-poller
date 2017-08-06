'use strict';


const AdsCollector = require('../lib/adCollector');
const redis = require('../lib/redis');

let a = new AdsCollector();

a.fetchNew((err, data) => {
    console.log(data);
    redis.quit();
});