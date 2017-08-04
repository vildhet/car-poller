const Onliner = require('../lib/pollers/onliner');

let onliner = new Onliner();
onliner.fetch((err, data) => {
    console.log(data);
});