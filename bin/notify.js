#!/usr/bin/env node

const TelegramBot = require('../lib/telegramBot');
const redis = require('../lib/redis');

const bot = new TelegramBot();

bot.checkNewAds(() => {
    redis.quit();
});
