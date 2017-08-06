'use strict';

const async = require('async');
const redis = require('./redis');
const OnlinerProvider = require('./providers/onliner');
const AvbyProvider = require('./providers/avby');


class AdCollector {
    constructor() {
        this.providers = [
            new OnlinerProvider(),
            new AvbyProvider()
        ];
    }

    fetchNewByProvider(provider, next) {
        let dbKey = provider.dbKey;

        async.parallel([
            next => provider.fetch(next),
            next => redis.get(dbKey, (err, data) => {
                if (err) return err;

                if (data) {
                    next(null, JSON.parse(data));
                } else {
                    next(null, []);
                }
            })
        ], (err, result) => {
            if (err) {
                return next(err);
            }

            let fetched = result[0];
            let stored = new Set(result[1]);

            let newLinks = fetched.filter(link => {
                return !stored.has(link);
            });

            redis.set(dbKey, JSON.stringify(fetched), () => {
                next(null, newLinks);
            });
        });
        
    }

    fetchNew(next) {
        async.concat(this.providers, (p, next) => {
            this.fetchNewByProvider(p, next);
        }, next);
    }
}

module.exports = AdCollector;