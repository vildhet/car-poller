'use strict';

const request = require('request');
const async = require('async');


class OnlinerProvider {
    get dbKey() {
        return 'onliner';
    }

    fetchPage(page, next) {
        let data = {
            'max-price': 6000,
            'country': 248, // Belarus
            'region': 349, // Minsk region
            'body_type[]': 1, // sedan
            'body_type[]': 3, // hatchback
            'min-year': 2007,
            'fuel[]': 1, // gasoline
            'min-capacity': 1.4,
            'max-capacity': 1.6,
            'drivetrain[]': 1, // FWD
            'state[]': 2, // used
            'options[]': 1, // air-conditioning
            'currency': 'USD',
            'sort[]': 'last_time_up',
            'car[0][47]': '', // Opel
            'car[1][19]': '', // Ford
            'car[2][62]': '', // Volkswagen
            'car[3][57]': '', // Skoda
            'page': page,
        };

        request.post({
            url: 'http://ab.onliner.by/search',
            formData: data
        }, (error, res, body) => {
            if (error) {
                return next(error);
            }

            let parsed = JSON.parse(body);
            if (!parsed.success) {
                return next('failed');
            }

            let result = parsed.result;
            let total = result.counters ? result.counters.total : 0;

            next(null, result.advertisements, total);
        });
    }

    fetchAll(next) {
        let page = 1;

        let totalAds = 0;
        let fetchedAds = 0;

        let allData = [];

        async.doWhilst(
            (next) => {
                this.fetchPage(page, (error, data, total) => {
                    if (error) {
                        return next(error);
                    }

                    totalAds = total;
                    fetchedAds += Object.keys(data).length;
                    page++;

                    allData = allData.concat(Object.values(data));
                    next(null, allData);
                });
            },
            () => totalAds > fetchedAds,
            next
        );
    }

    fetch(next) {
        this.fetchAll((error, ads) => {
            if (error) {
                return next(error);
            }

            next(null, ads.map(ad => {
                return 'http://ab.onliner.by/car/' + ad.id;
            }));
        });
    }
}

module.exports = OnlinerProvider;