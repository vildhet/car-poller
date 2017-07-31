'use strict';

const Telegraf = require('telegraf');
require('dotenv').config();


class TelegramBot {
    constructor() {
        this.bot = new Telegraf(process.env.TOKEN);
    }

    serve() {
        this.bot.command('start', ({ from, reply }) => {
            console.log('start', from);
            return reply('Welcome!');
        });

        const secretUrl = Math.random().toString(36).slice(2);

        this.bot.telegram.setWebhook(`${process.env.WEBHOOK_URL}/${secretUrl}`);

        console.log(`Listening on port ${process.env.PORT}`);
        this.bot.startWebhook(`/${secretUrl}`, null, process.env.PORT);
    }
}

module.exports = TelegramBot;