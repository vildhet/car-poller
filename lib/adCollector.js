'use strict';

const async = require('async');
const redis = require('./redis');
const OnlinerPoller = require('./pollers/onliner');


class AdCollector {
    constructor() {
        this.onliner = new OnlinerPoller();
    }

    fetchNew(next) {
        async.parallel([
            next => this.onliner.fetch(next),
            next => redis.get('onliner', (err, data) => {
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

            redis.set('onliner', JSON.stringify(fetched), () => {
                next(null, newLinks);
            });
        });
        
    }
}

module.exports = AdCollector;