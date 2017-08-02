'use strict';


const async = require('async');
const Telegraf = require('telegraf');
const UserController = require('./userController');
const env = require('./env');


class TelegramBot {
    constructor() {
        this.bot = new Telegraf(env.token);
        this.userController = new UserController();
    }

    sendToAll(message, next) {
        async.waterfall([
            next => this.userController.getAll(next),
            (ids, next) => {
                let sendPromises = ids.map(id => {
                    return this.bot.telegram.sendMessage(id, message);
                });
                Promise.all(sendPromises).then(next);
            }
        ], next);
    }

    serve() {
        this._initCommands();

        if (env.polling) {
            this._startPolling();
        } else {
            this._startWebhook();
        }
    }

    _initCommands() {
        this.bot.command('start', ({ from, reply }) => {
            console.log('start', from);
            return reply(`Welcome, ${from.username}!`);
        });

        this.bot.command('subscribe', ({ from, reply}) => {
            this.userController.subscribe(from.id);
            console.log(`Subscribed user ${from.username}[${from.id}]`);
            return reply('Subscribed');
        });

        this.bot.command('unsubscribe', ({ from, reply}) => {
            this.userController.unsubscribe(from.id);
            console.log(`Unsubscribed user ${from.username}[${from.id}]`);
            return reply('Unsubscribed');
        });

    }

    _startWebhook() {
        const secretUrl = Math.random().toString(36).slice(2);

        this.bot.telegram.setWebhook(`${env.webhookUrl}/${secretUrl}`);

        console.log(`Listening on port ${env.port}`);
        this.bot.startWebhook(`/${secretUrl}`, null, env.port);
    }

    _startPolling() {
        this.bot.telegram.deleteWebhook().then(() => {
            console.log('Start poling');
            this.bot.startPolling();
        });
    }
}

module.exports = TelegramBot;