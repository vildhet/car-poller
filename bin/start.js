#!/usr/bin/env node

const TelegramBot = require('../src/telegramBot');
const redis = require('../src/redis');

const bot = new TelegramBot();

bot.sendToAll('Holy shit', () => {
    redis.quit();
});
