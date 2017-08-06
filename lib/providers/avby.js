'use strict';

const request = require('request');
const cheerio = require('cheerio');
const async = require('async');


class AvbyProvider {
    get dbKey() {
        return 'avby';
    }

    fetchPage(bodyId, page, next) {
        let params = {
            'brand_id[0]': 1216, // VW
            'brand_id[1]': 1126, // Skoda
            'brand_id[2]': 966, // Opel
            'brand_id[3]': 330, // Ford
            'year_from': 2007,
            'year_to': '',
            'currency': 'USD',
            'price_from': '',
            'price_to': 6000,
            'body_id': bodyId,
            'engine_type': 1,
            'engine_volume_min': 1400,
            'engine_volume_max': 1600,
            'driving_id': 1,
            'mileage_min': '',
            'mileage_max': 200000,
            'region_id': '',
            'interior_material': '',
            'interior_color': '',
            'condition_id[]': 2,
            'exchange': '',
            'search_time': '',
            'advanced_options[]': 13, // Air-conditioning
            'region_id': 5, // Minsk Region
            'order_from[]': 1 // Private ads
        };

        let pageString = page == 1 ? '' : '/page/' + page;

        request.get({
            url: 'https://cars.av.by/search' + pageString,
            qs: params
        }, (error, res, body) => {
            let links = this.parseHtmlPage(body, next);
        });
    }

    parseHtmlPage(htmlString, next) {
        let html = cheerio.load(htmlString);
        let links = [];

        html('div.listing-wrap').find('div.listing-item-title h4 a:not([class])').each((i, a) => {
            let link = html(a).attr('href');

            links.push(link);
        });

        let totalString = html('header.heading h1.heading-title').text();
        let match = totalString.match(/\d+/);

        if (!match) {
            return next('Failed to get total count');
        }

        let total = parseInt(match[0]);

        next(null, links, total);
    }

    fetchBody(bodyId, next) {
        let totalAds = 0;
        let page = 1;
        let adsList = [];

        async.doWhilst(
            (next) => {
                this.fetchPage(bodyId, page, (err, links, total) => {
                    if (err) {
                        return next(err);
                    }

                    totalAds = total;
                    adsList = adsList.concat(links);
                    page ++;
                    next(null, adsList);
                });
            },
            () => adsList.length < totalAds,
            next
        );
    }

    fetch(next) {
        // [sedan, hatck 5 doors, hatch 3 doors]
        async.concat([5, 3, 24], (bodyId, next) => {
            this.fetchBody(bodyId, next);
        }, next);
    }
}


module.exports = AvbyProvider;