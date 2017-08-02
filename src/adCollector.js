'use strict';

const OnlinerPoller = require('./pollers/onliner');


class AdCollector {
    constructor() {
        this.onliner = new OnlinerPoller();
    }

    fetchNew() {
        return 'Test ad';
    }
}

module.exports = AdCollector;