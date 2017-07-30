'use strict';

const Telegraf = require('telegraf');

function init() {
    const app = new Telegraf('223004546:AAHD-wmJvRs3fFgrlnj1S71hHkhLmD1hPVM');

    app.command('start', ({ from, reply }) => {
    console.log('start', from);
    return reply('Welcome!');
    });
    app.hears('hi', (ctx) => ctx.reply('Hey there!'));
    app.on('sticker', (ctx) => ctx.reply('👍'));

    app.startPolling();

}

module.exports = init;