'use strict';

const querystring = require('querystring');
const http = require('http');
const { URL } = require('url');


module.exports = {
    httpPost: function(url, data, next) {
        let parsedUrl = new URL(url);
        let dataString = querystring.stringify(data);

        let options = {
            host: parsedUrl.host,
            path: parsedUrl.pathname,
            port: parsedUrl.port,
            protocol: parsedUrl.protocol,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(dataString),
                'Accept': 'application/json'
            }
        }

        let request = http.request(options, (response) => {
            console.log(response.statusCode);
            let body = '';

            response.on('data', (chunk) => {
                body += chunk;
            });

            response.on('end', () => {
                console.log(body);
                let jsonBody = JSON.parse(body);
                next(null, jsonBody);
            });
        });

        request.write(dataString);
        request.end();
    }
}