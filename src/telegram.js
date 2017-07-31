'use strict';

const Telegraf = require('telegraf');

function serve() {
    let bot = new Telegraf(process.env.TOKEN);

    bot.command('start', ({ from, reply }) => {
        console.log('start', from);
        return reply('Welcome!');
    });

    bot.on('text', ({ reply }) => reply('Hey there!'));

    console.log('Listening on port ' + process.env.PORT);
    bot.startWebhook('/telegram-bot', null, process.env.PORT);
}

module.exports = {
    serve: serve
};