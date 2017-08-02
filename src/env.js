require('dotenv').config();


module.exports = {
    port: process.env.PORT,
    token: process.env.TOKEN,
    webhookUrl: process.env.WEBHOOK_URL,
    polling: process.env.POLLING,
    redisUrl: process.env.REDIS_URL
}