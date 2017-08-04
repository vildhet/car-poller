'use strict';

const OnlinerPoller = require('./pollers/onliner');

const redis = require('./redis');


class AdCollector {
    constructor() {
        this.onliner = new OnlinerPoller();
    }

    fetchNew(next) {
        let fetched = this.onliner.fetch(next);
    }
}

module.exports = AdCollector;