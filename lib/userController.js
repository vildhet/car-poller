'use strict';

const redis = require('./redis');

const USER_SET = 'users';

class UserController {
    subscribe(userId) {
        redis.sadd(USER_SET, userId);
    }

    unsubscribe(userId) {
        redis.srem(USER_SET, userId);
    }

    getAll(next) {
        redis.smembers(USER_SET, next);
    }
    
}


module.exports = UserController;